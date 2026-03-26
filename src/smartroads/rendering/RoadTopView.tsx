import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Stage, Layer, Group, Rect, Line as KonvaLine } from 'react-konva'
import { StripRenderer } from './StripRenderer'
import { MarkingRenderer } from './MarkingRenderer'
import { totalWidth, STRIP_MIN_WIDTHS, FIXED_WIDTH_STRIPS, orderMarkingsByLayer } from '../constants'
import type { Strip, Marking } from '../types'
import type Konva from 'konva'
import {
  DEFAULT_CURB_LOWERED_SECTION_LENGTH,
  getCurbStripProps,
  getParkingStripProps,
  getCyclepathOverlaySide,
  getCyclepathStripProps,
  getStripRenderLength,
  getStripRenderY,
  mergeStripProps,
  resolveCyclepathBoundaryDashPattern,
  resolveCyclepathBoundaryLineMode,
  resolveCyclepathBoundaryStrokeWidth,
  resolveCyclepathCenterDashPattern,
  resolveCyclepathCenterLineMode,
  resolveCyclepathCenterStrokeWidth,
} from '../stripProps'
import { getCrossSectionStrips, getCyclepathRenderMetrics, getLaneOverlayOccupancyWidth, getStripPlacements, isLaneOverlayCyclepath } from '../layout'

// ============================================================
// RoadTopView – Interactive top-down view
//
// - Click strip to select (blue highlight)
// - Resize at LEFT/RIGHT edges of selected strip (cursor: col-resize)
// - Drag selected strip to reorder
// - Delete key removes selected strip
// - Click background to deselect
// - Click background to deselect
// - Length handle at bottom
// ============================================================

interface Props {
  strips: Strip[]
  markings: Marking[]
  layerOrder?: string[]
  length: number
  selectedStripId: string | null
  selectedMarkingId: string | null
  onSelectStrip: (id: string | null) => void
  onSelectMarking: (id: string | null) => void
  onStripsUpdate?: (strips: Strip[]) => void
  onMarkingMove?: (id: string, x: number, y: number) => void
  onMarkingDelete?: (id: string) => void
  onDoubleClickElement?: (kind: 'strip' | 'marking', id: string) => void
  onContextMenuElement?: (e: React.MouseEvent, kind: 'strip' | 'marking', id: string) => void
  onLengthChange?: (length: number) => void
}

const PADDING = 40

export function RoadTopView({
  strips,
  markings,
  layerOrder,
  length,
  selectedStripId,
  selectedMarkingId,
  onSelectStrip,
  onSelectMarking,
  onStripsUpdate,
  onMarkingMove,
  onMarkingDelete,
  onDoubleClickElement,
  onContextMenuElement,
  onLengthChange,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rightClickTargetRef = useRef<{ kind: 'strip' | 'marking'; id: string } | null>(null)
  const dragCleanupRef = useRef<Set<() => void>>(new Set())
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 })

  // Cleanup all active drag listeners on unmount
  useEffect(() => {
    const cleanups = dragCleanupRef.current
    return () => {
      for (const cleanup of cleanups) cleanup()
      cleanups.clear()
    }
  }, [])
  const [isDraggingMarking, setIsDraggingMarking] = useState(false)

  const safeRoadLength = Math.max(0.5, Number.isFinite(length) ? length : 0.5)
  const tw = Math.max(0.1, totalWidth(strips))
  const crossSectionStrips = useMemo(() => getCrossSectionStrips(strips), [strips])
  const stripPlacements = useMemo(() => getStripPlacements(strips, safeRoadLength), [strips, safeRoadLength])
  const placementById = useMemo(() => new Map(stripPlacements.map((placement) => [placement.strip.id, placement])), [stripPlacements])
  const roadwayPlacements = useMemo(
    () => stripPlacements.filter((placement) => !placement.isLaneOverlay && (placement.strip.type === 'lane' || placement.strip.type === 'bus')),
    [stripPlacements],
  )
  const leftmostRoadwayPlacement = roadwayPlacements[0] ?? null
  const rightmostRoadwayPlacement = roadwayPlacements[roadwayPlacements.length - 1] ?? null
  const orderedMarkings = useMemo(
    () => orderMarkingsByLayer(markings, layerOrder),
    [markings, layerOrder]
  )

  // Strip render order: follow layerOrder so the layer manager controls z-order.
  // Falls back to array order for strips not in layerOrder.
  const stripRenderOrder = useMemo(() => {
    if (!layerOrder || layerOrder.length === 0) return strips.map((_, i) => i)
    const stripIdToIndex = new Map(strips.map((s, i) => [s.id, i]))
    const ordered: number[] = []
    const seen = new Set<number>()
    for (const id of layerOrder) {
      const idx = stripIdToIndex.get(id)
      if (idx != null && !seen.has(idx)) {
        ordered.push(idx)
        seen.add(idx)
      }
    }
    // Append any strips not in layerOrder
    for (let i = 0; i < strips.length; i++) {
      if (!seen.has(i)) ordered.push(i)
    }
    return ordered
  }, [strips, layerOrder])

  // Snap positions: cumulative strip edges (boundaries between strips)
  const stripEdges: number[] = []
  { let acc = 0; for (const s of crossSectionStrips) { acc += s.width; stripEdges.push(acc) } }
  // Remove last edge (= total width, right edge of road) and add 0 (left edge)
  stripEdges.pop()
  // Don't include 0 — markings shouldn't snap to the very left edge
  // stripEdges now contains all internal boundaries between strips

  // Observe container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) setContainerSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Scale & layout
  const scaleByWidth = (containerSize.width - PADDING * 2) / tw
  const scaleByHeight = (containerSize.height - PADDING * 2 - 20) / safeRoadLength
  const displayScale = Math.min(scaleByWidth, scaleByHeight)
  const roadWidthPx = tw * displayScale
  const roadHeightPx = safeRoadLength * displayScale
  const offsetX = (containerSize.width - roadWidthPx) / 2
  const offsetY = (containerSize.height - roadHeightPx) / 2

  const getOverlaySnapPosition = useCallback((strip: Strip, side: 'left' | 'right') => {
    const candidateStrip = {
      ...strip,
      ...mergeStripProps(strip, { overlaySide: side }),
    }
    const renderWidth = getLaneOverlayOccupancyWidth(candidateStrip, crossSectionStrips)

    if (side === 'left') {
      return {
        x: leftmostRoadwayPlacement?.x ?? 0,
        renderWidth,
      }
    }

    return {
      x: rightmostRoadwayPlacement
        ? rightmostRoadwayPlacement.x + Math.max(0, rightmostRoadwayPlacement.renderWidth - renderWidth)
        : 0,
      renderWidth,
    }
  }, [crossSectionStrips, leftmostRoadwayPlacement, rightmostRoadwayPlacement])

  // --- Delete selected strip or marking ---
  useEffect(() => {
    if (!selectedStripId && !selectedMarkingId) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        if (selectedStripId) {
          const newStrips = strips.filter((s) => s.id !== selectedStripId)
          onStripsUpdate?.(newStrips)
          onSelectStrip(null)
          setAnimShifts((prev) => {
            const next = { ...prev }
            delete next[selectedStripId]
            return next
          })
        } else if (selectedMarkingId) {
          onMarkingDelete?.(selectedMarkingId)
          onSelectMarking(null)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedStripId, selectedMarkingId, strips, onStripsUpdate, onMarkingDelete, onSelectStrip, onSelectMarking])

  // --- Edge resize (only on selected strip's edges) ---
  const resizeRef = useRef<{ side: 'left' | 'right'; startX: number; startWidth: number; stripIndex: number } | null>(null)

  const handleResizeStart = useCallback((stripIndex: number, side: 'left' | 'right', e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    const stage = stageRef.current
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return

    const strip = strips[stripIndex]
    resizeRef.current = { side, startX: pos.x, startWidth: strip.width, stripIndex }

    const neighborIdx = side === 'left' ? stripIndex - 1 : stripIndex + 1
    const neighbor = strips[neighborIdx]
    const neighborStartWidth = neighbor?.width || 0

    const onMove = (me: MouseEvent) => {
      const ref = resizeRef.current
      if (!ref || !stage) return
      const stageBox = stage.container().getBoundingClientRect()
      const currentX = me.clientX - stageBox.left
      const deltaX = currentX - ref.startX
      const deltaMeter = deltaX / displayScale * (side === 'left' ? -1 : 1)

      const minW = STRIP_MIN_WIDTHS[strip.type] || 0.10
      const newWidth = Math.max(minW, ref.startWidth + deltaMeter)

      if (neighbor) {
        const neighborMinW = STRIP_MIN_WIDTHS[neighbor.type] || 0.10
        const rawNeighborWidth = neighborStartWidth - deltaMeter * (side === 'left' ? -1 : 1)
        if (rawNeighborWidth < neighborMinW) return
        const neighborNewWidth = rawNeighborWidth

        onStripsUpdate?.(strips.map((s, i) => {
          if (i === stripIndex) return { ...s, width: Math.round(newWidth * 100) / 100 }
          if (i === neighborIdx) return { ...s, width: Math.round(neighborNewWidth * 100) / 100 }
          return s
        }))
      } else {
        onStripsUpdate?.(strips.map((s, i) =>
          i === stripIndex ? { ...s, width: Math.round(newWidth * 100) / 100 } : s
        ))
      }
    }

    const cleanup = () => {
      resizeRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      dragCleanupRef.current.delete(cleanup)
    }

    const onUp = () => cleanup()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    dragCleanupRef.current.add(cleanup)
  }, [strips, displayScale, onStripsUpdate])

  // --- Drag to reorder ---
  const dragRef = useRef<{ stripId: string; originalIndex: number } | null>(null)
  const dragTargetRef = useRef<number | null>(null)
  const [dragPreviewIndex, setDragPreviewIndex] = useState<number | null>(null)
  const [dragGhostX, setDragGhostX] = useState<number | null>(null) // ghost strip X in meters
  const [isDragging, setIsDragging] = useState(false)
  const overlayDragRef = useRef<{ stripId: string; originalSide: 'left' | 'right' } | null>(null)
  const overlayTargetSideRef = useRef<'left' | 'right' | null>(null)
  const [overlayPreviewSide, setOverlayPreviewSide] = useState<'left' | 'right' | null>(null)
  const [overlayGhostX, setOverlayGhostX] = useState<number | null>(null)
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false)

  const startDragReorder = useCallback((stripId: string, stripIndex: number, e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return
    if (selectedStripId !== stripId) return
    e.cancelBubble = true
    dragRef.current = { stripId, originalIndex: stripIndex }
    dragTargetRef.current = null

    // Find the strip's current X offset
    let startOffsetM = 0
    for (let j = 0; j < stripIndex; j++) startOffsetM += strips[j].width

    const stage = stageRef.current
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    const grabOffsetPx = pos.x - offsetX - startOffsetM * displayScale

    // Small delay to distinguish click from drag
    let moved = false

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current || !stageRef.current) return
      const stageBox = stageRef.current.container().getBoundingClientRect()
      const currentX = me.clientX - stageBox.left
      const canvasX = (currentX - offsetX) / displayScale

      if (!moved) {
        const delta = Math.abs(currentX - pos.x)
        if (delta < 5) return // dead zone: 5px before drag starts
        moved = true
        setIsDragging(true)
      }

      // Ghost position (where the strip center is, in meters)
      const ghostX = (currentX - grabOffsetPx - offsetX) / displayScale
      setDragGhostX(ghostX)

      // Find target slot
      let acc = 0
      let targetIdx = strips.length
      for (let i = 0; i < strips.length; i++) {
        if (canvasX < acc + strips[i].width / 2) {
          targetIdx = i
          break
        }
        acc += strips[i].width
      }
      dragTargetRef.current = targetIdx
      setDragPreviewIndex(targetIdx)
    }

    const cleanup = () => {
      const ref = dragRef.current
      const target = dragTargetRef.current
      if (ref && target != null && moved) {
        const fromIdx = strips.findIndex((s) => s.id === ref.stripId)
        if (fromIdx !== -1 && fromIdx !== target) {
          const newStrips = [...strips]
          const [movedStrip] = newStrips.splice(fromIdx, 1)
          const insertIdx = target > fromIdx ? target - 1 : target
          newStrips.splice(insertIdx, 0, movedStrip)
          onStripsUpdate?.(newStrips)
        }
      }
      dragRef.current = null
      dragTargetRef.current = null
      setDragPreviewIndex(null)
      setDragGhostX(null)
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      dragCleanupRef.current.delete(cleanup)
    }

    const onUp = () => cleanup()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    dragCleanupRef.current.add(cleanup)
  }, [strips, offsetX, displayScale, onStripsUpdate, selectedStripId])

  const startOverlaySideDrag = useCallback((strip: Strip, e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return
    e.cancelBubble = true
    if (!leftmostRoadwayPlacement || !rightmostRoadwayPlacement) return

    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const originalSide = getCyclepathOverlaySide(strip)
    const currentSnap = getOverlaySnapPosition(strip, originalSide)
    const grabOffsetPx = pointer.x - offsetX - currentSnap.x * displayScale

    overlayDragRef.current = { stripId: strip.id, originalSide }
    overlayTargetSideRef.current = originalSide

    let moved = false

    const onMove = (me: MouseEvent) => {
      if (!overlayDragRef.current || !stageRef.current) return
      const stageBox = stageRef.current.container().getBoundingClientRect()
      const currentX = me.clientX - stageBox.left
      const currentY = me.clientY - stageBox.top
      const deltaX = currentX - pointer.x
      const deltaY = currentY - pointer.y

      if (!moved) {
        if (Math.hypot(deltaX, deltaY) < 5) return
        moved = true
        setIsDraggingOverlay(true)
      }

      const ghostX = (currentX - grabOffsetPx - offsetX) / displayScale
      const leftSnap = getOverlaySnapPosition(strip, 'left')
      const rightSnap = getOverlaySnapPosition(strip, 'right')
      const targetSide = Math.abs(ghostX - leftSnap.x) <= Math.abs(ghostX - rightSnap.x) ? 'left' : 'right'

      overlayTargetSideRef.current = targetSide
      setOverlayPreviewSide(targetSide)
      setOverlayGhostX(ghostX)
    }

    const cleanup = () => {
      const ref = overlayDragRef.current
      const targetSide = overlayTargetSideRef.current

      if (ref && targetSide && moved && targetSide !== ref.originalSide) {
        const nextStrips = strips.map((candidate) => {
          if (!isLaneOverlayCyclepath(candidate)) return candidate

          const candidateSide = getCyclepathOverlaySide(candidate)
          if (candidate.id === ref.stripId) {
            return { ...candidate, ...mergeStripProps(candidate, { overlaySide: targetSide }) }
          }

          if (candidateSide === targetSide) {
            return { ...candidate, ...mergeStripProps(candidate, { overlaySide: ref.originalSide }) }
          }

          return candidate
        })
        onStripsUpdate?.(nextStrips)
      }

      overlayDragRef.current = null
      overlayTargetSideRef.current = null
      setOverlayPreviewSide(null)
      setOverlayGhostX(null)
      setIsDraggingOverlay(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      dragCleanupRef.current.delete(cleanup)
    }

    const onUp = () => cleanup()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    dragCleanupRef.current.add(cleanup)
  }, [
    leftmostRoadwayPlacement,
    rightmostRoadwayPlacement,
    getOverlaySnapPosition,
    offsetX,
    displayScale,
    strips,
    onStripsUpdate,
  ])

  // --- Length drag ---
  const [draggingLength, setDraggingLength] = useState(false)
  const lengthDragStart = useRef<{ startY: number; startLength: number } | null>(null)

  const handleLengthDragStart = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    const stage = stageRef.current
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return
    lengthDragStart.current = { startY: pos.y, startLength: length }
    setDraggingLength(true)

    const onMove = (me: MouseEvent) => {
      if (!lengthDragStart.current || !stage) return
      const stageBox = stage.container().getBoundingClientRect()
      const currentY = me.clientY - stageBox.top
      const deltaY = currentY - lengthDragStart.current.startY
      const newLength = Math.max(5, lengthDragStart.current.startLength + deltaY / displayScale)
      onLengthChange?.(Math.round(newLength * 10) / 10)
    }

    const cleanup = () => {
      setDraggingLength(false)
      lengthDragStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      dragCleanupRef.current.delete(cleanup)
    }

    const onUp = () => cleanup()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    dragCleanupRef.current.add(cleanup)
  }, [length, displayScale, onLengthChange])

  const cyclepathPhaseDragRef = useRef<Record<string, { phase: number; cycle: number }>>({})
  const curbLoweredDragRef = useRef<Record<string, { startOffset: number; maxOffset: number }>>({})
  const parkingBayDragRef = useRef<Record<string, { startOffset: number; maxOffset: number }>>({})

  const wrapDashPhase = useCallback((phase: number, cycle: number) => {
    if (cycle <= 0) return 0
    return (((phase % cycle) + cycle) % cycle)
  }, [])

  const updateCyclepathPhase = useCallback((
    stripId: string,
    prop: 'boundaryLinePhase' | 'centerLinePhase',
    phase: number,
  ) => {
    onStripsUpdate?.(strips.map((candidate) => (
      candidate.id === stripId
        ? { ...candidate, ...mergeStripProps(candidate, { [prop]: phase }) }
        : candidate
    )))
  }, [onStripsUpdate, strips])

  // --- Animated shifts for iOS-style "make room" effect ---
  const draggedStripId = isDragging
    ? dragRef.current?.stripId
    : isDraggingOverlay
      ? overlayDragRef.current?.stripId
      : null

  // Compute target shifts per strip
  const targetShiftsRef = useRef<Record<string, number>>({})
  useEffect(() => {
    const targets: Record<string, number> = {}
    if (isDragging && dragPreviewIndex != null && draggedStripId) {
      const draggedIdx = strips.findIndex((s) => s.id === draggedStripId)
      const draggedWidth = strips[draggedIdx]?.width || 0
      for (let i = 0; i < strips.length; i++) {
        if (strips[i].id === draggedStripId) { targets[strips[i].id] = 0; continue }
        const visualIdx = i > draggedIdx ? i - 1 : i
        const insertIdx = dragPreviewIndex > draggedIdx ? dragPreviewIndex - 1 : dragPreviewIndex
        targets[strips[i].id] = visualIdx >= insertIdx ? draggedWidth : 0
      }
    } else {
      for (const s of strips) targets[s.id] = 0
    }
    targetShiftsRef.current = targets
  }, [isDragging, dragPreviewIndex, strips, draggedStripId])

  // Spring animation loop — only runs during drag
  const [animShifts, setAnimShifts] = useState<Record<string, number>>({})
  const animShiftsRef = useRef<Record<string, number>>({})
  const animRef = useRef<number>(0)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    animShiftsRef.current = animShifts
  }, [animShifts])

  useEffect(() => {
    const hasNonZeroTargets = Object.values(targetShiftsRef.current).some((v) => Math.abs(v) > 0.005)
    const hasActiveShifts = Object.values(animShiftsRef.current).some((v) => Math.abs(v) > 0.005)

    if (!isDragging && !hasNonZeroTargets && !hasActiveShifts) {
      // Not dragging and all shifts at rest — don't animate
      if (isAnimatingRef.current) {
        cancelAnimationFrame(animRef.current)
        isAnimatingRef.current = false
      }
      if (Object.keys(animShiftsRef.current).length > 0) {
        animShiftsRef.current = {}
        setAnimShifts({})
      }
      return
    }

    if (isAnimatingRef.current) return

    isAnimatingRef.current = true
    const animate = () => {
      if (!isAnimatingRef.current) return
      const prev = animShiftsRef.current
      const targets = targetShiftsRef.current
      const next: Record<string, number> = {}
      let anyMoving = false

      for (const id of Object.keys(targets)) {
        const current = prev[id] || 0
        const target = targets[id] || 0
        const diff = target - current
        if (Math.abs(diff) > 0.005) {
          next[id] = current + diff * 0.18
          anyMoving = true
        } else if (Math.abs(target) > 0.005) {
          next[id] = target
        }
      }

      for (const id of Object.keys(prev)) {
        if (id in next) continue
        const current = prev[id] || 0
        if (Math.abs(current) > 0.005) {
          next[id] = current * 0.82
          anyMoving = true
        }
      }

      animShiftsRef.current = next
      setAnimShifts(next)

      if (anyMoving || isDragging) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        isAnimatingRef.current = false
      }
    }
    animRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animRef.current)
      isAnimatingRef.current = false
    }
  }, [isDragging])

  // --- Build strip visuals ---
  // Render visuals in layerOrder (z-order), interaction nodes in array order.
  const stripVisualsByIndex: Map<number, React.ReactNode[]> = new Map()
  const interactionNodes: React.ReactNode[] = []

  for (let i = 0; i < strips.length; i++) {
    const strip = strips[i]
    const placement = placementById.get(strip.id)
    if (!placement) continue
    const stripY = placement.y
    const stripHeight = placement.length
    const stripRenderWidth = placement.renderWidth
    const isBeingDragged = strip.id === draggedStripId
    const shift = animShifts[strip.id] || 0
    const sx = placement.x + (placement.isLaneOverlay ? 0 : shift)
    const isSelected = selectedStripId === strip.id
    const isOverlay = placement.isLaneOverlay
    const isFixed = FIXED_WIDTH_STRIPS.includes(strip.type) || isOverlay

    // Collect visuals per strip index for z-ordering later
    const visuals: React.ReactNode[] = []

    // Strip visual
    visuals.push(
      <StripRenderer
        key={strip.id}
        strip={strip}
        x={sx}
        y={stripY}
        length={stripHeight}
        renderWidth={stripRenderWidth}
        overlaySide={placement.overlaySide}
        safetyBufferWidth={placement.safetyBufferWidth}
        facingSide={placement.facingSide}
      />
    )
    // Dim original during drag
    if (isBeingDragged) {
      visuals.push(
        <Rect
          key={`dim-${strip.id}`}
          x={sx} y={stripY} width={stripRenderWidth} height={stripHeight}
          fill="rgba(0,0,0,0.35)" listening={false}
        />
      )
    }

    // Stable interaction node for selection + double-click + optional drag.
    // Keeping this as a single Konva node avoids losing dblclick when the
    // selected overlay appears between the first and second click.
    interactionNodes.push(
        <Rect
        key={`hit-${strip.id}`}
        x={sx}
        y={stripY}
        width={stripRenderWidth}
        height={stripHeight}
          fill={isSelected ? 'rgba(74,158,255,0.12)' : 'rgba(0,0,0,0.001)'}
        stroke={isSelected ? '#4a9eff' : undefined}
        strokeWidth={isSelected ? 1.5 / displayScale : 0}
        onClick={(e) => { e.cancelBubble = true; onSelectStrip(strip.id); onSelectMarking(null) }}
        onDblClick={(e) => { if (e.evt.button !== 0) return; e.cancelBubble = true; onDoubleClickElement?.('strip', strip.id) }}
        onTap={(e) => { e.cancelBubble = true; onSelectStrip(strip.id); onSelectMarking(null) }}
        onDblTap={(e) => { e.cancelBubble = true; onDoubleClickElement?.('strip', strip.id) }}
        onMouseDown={(e) => {
          if (e.evt.button === 2) {
            rightClickTargetRef.current = { kind: 'strip', id: strip.id }
            onSelectStrip(strip.id)
            onSelectMarking(null)
            return
          }
          onSelectStrip(strip.id)
          onSelectMarking(null)
          if (isOverlay) {
            startOverlaySideDrag(strip, e)
          } else {
            startDragReorder(strip.id, i, e)
          }
        }}
        cursor={isSelected ? 'grab' : 'pointer'}
      />
    )

    // Selection highlight + resize edges (only for selected strip)
    if (isSelected && !isBeingDragged) {

      // Left edge resize handle (if not fixed and not first strip)
      if (!isFixed && i > 0) {
        interactionNodes.push(
          <Rect
            key={`resize-l-${strip.id}`}
            x={sx - 0.2} y={stripY}
            width={0.4} height={stripHeight}
            fill="rgba(0,0,0,0.001)"
            cursor="col-resize"
            onMouseDown={(e) => handleResizeStart(i, 'left', e)}
          />
        )
      }

      // Right edge resize handle (if not fixed and not last strip)
      if (!isFixed && i < strips.length - 1) {
        interactionNodes.push(
          <Rect
            key={`resize-r-${strip.id}`}
            x={sx + stripRenderWidth - 0.2} y={stripY}
            width={0.4} height={stripHeight}
            fill="rgba(0,0,0,0.001)"
            cursor="col-resize"
            onMouseDown={(e) => handleResizeStart(i, 'right', e)}
          />
        )
      }

      if (strip.type === 'cyclepath') {
        const cyclepathProps = getCyclepathStripProps(strip)
        const boundaryMode = resolveCyclepathBoundaryLineMode(strip.variant, cyclepathProps.boundaryLineMode)
        const centerMode = resolveCyclepathCenterLineMode(strip.variant, cyclepathProps.centerLineMode, cyclepathProps.pathType)
        const boundaryStroke = resolveCyclepathBoundaryStrokeWidth(strip.variant, cyclepathProps.boundaryLineStrokeWidth)
        const centerStroke = resolveCyclepathCenterStrokeWidth(cyclepathProps.centerLineStrokeWidth)
        const boundaryDash = boundaryMode === 'dashed'
          ? resolveCyclepathBoundaryDashPattern(strip.variant, cyclepathProps.boundaryLineDashLength, cyclepathProps.boundaryLineGapLength)
          : null
        const centerDash = centerMode === 'dashed'
          ? resolveCyclepathCenterDashPattern(cyclepathProps.centerLineDashLength, cyclepathProps.centerLineGapLength)
          : null
        const renderMetrics = getCyclepathRenderMetrics({
          strip,
          renderWidth: stripRenderWidth,
          overlaySide: placement.overlaySide,
          safetyBufferWidth: placement.safetyBufferWidth,
        })

        const createPhaseHandle = (
          key: string,
          lineX: number,
          prop: 'boundaryLinePhase' | 'centerLinePhase',
          phase: number,
          dash: [number, number],
          strokeWidth: number,
        ) => {
          const cycle = dash[0] + dash[1]
          const hitWidth = Math.max(0.45, strokeWidth * 5)

          interactionNodes.push(
            <Group
              key={key}
              x={lineX}
              y={stripY}
              draggable
              onDragStart={() => {
                cyclepathPhaseDragRef.current[key] = { phase, cycle }
              }}
              onDragMove={(e) => {
                const node = e.target
                const dragY = node.y() - stripY
                node.x(lineX)
                node.y(stripY)

                const current = cyclepathPhaseDragRef.current[key]
                if (!current) return
                updateCyclepathPhase(strip.id, prop, wrapDashPhase(current.phase - dragY, current.cycle))
              }}
              onDragEnd={(e) => {
                const node = e.target
                node.x(lineX)
                node.y(stripY)
                delete cyclepathPhaseDragRef.current[key]
              }}
            >
              <Rect
                x={-hitWidth / 2}
                y={0}
                width={hitWidth}
                height={stripHeight}
                fill="rgba(0,0,0,0.001)"
                cursor="ns-resize"
              />
            </Group>
          )
        }

        if (boundaryDash) {
          const boundaryPhase = cyclepathProps.boundaryLinePhase ?? 0
          const bSides = cyclepathProps.boundaryLineSides ?? 'both'
          const showLeftHandle = !strip.variant || strip.variant !== 'protected' || bSides === 'both' || bSides === 'left'
          const showRightHandle = strip.variant === 'protected' && (bSides === 'both' || bSides === 'right')
          if (showLeftHandle) {
            createPhaseHandle(
              `cyclepath-boundary-primary-${strip.id}`,
              sx + renderMetrics.laneBoundaryX,
              'boundaryLinePhase',
              boundaryPhase,
              boundaryDash,
              boundaryStroke,
            )
          }
          if (showRightHandle) {
            createPhaseHandle(
              `cyclepath-boundary-right-${strip.id}`,
              sx + (renderMetrics.rightBoundaryX ?? stripRenderWidth),
              'boundaryLinePhase',
              boundaryPhase,
              boundaryDash,
              boundaryStroke,
            )
          }
        }

        if (strip.variant === 'protected' && centerDash) {
          createPhaseHandle(
            `cyclepath-center-${strip.id}`,
            sx + (renderMetrics.centerLineX ?? stripRenderWidth / 2),
            'centerLinePhase',
            cyclepathProps.centerLinePhase ?? 0,
            centerDash,
            centerStroke,
          )
        }
      }

      if (strip.type === 'curb') {
        const curbProps = getCurbStripProps(strip)
        if (curbProps.kind === 'driveway') {
          const loweredLength = Math.max(0.5, Math.min(curbProps.loweredSectionLength ?? DEFAULT_CURB_LOWERED_SECTION_LENGTH, stripHeight))
          const maxOffset = Math.max(0, stripHeight - loweredLength)
          const loweredOffset = Math.max(0, Math.min(curbProps.loweredSectionOffset ?? 0, maxOffset))

          interactionNodes.push(
            <Group
              key={`curb-lowered-handle-${strip.id}`}
              x={sx}
              y={stripY + loweredOffset}
              draggable
              onMouseDown={(e) => { e.cancelBubble = true }}
              onDragStart={() => {
                curbLoweredDragRef.current[strip.id] = {
                  startOffset: loweredOffset,
                  maxOffset,
                }
              }}
              onDragMove={(e) => {
                const node = e.target
                const current = curbLoweredDragRef.current[strip.id]
                if (!current) return

                const dragY = node.y() - (stripY + current.startOffset)
                const nextOffset = Math.max(0, Math.min(current.startOffset + dragY, current.maxOffset))
                node.x(sx)
                node.y(stripY + current.startOffset)

                onStripsUpdate?.(strips.map((candidate) => (
                  candidate.id === strip.id
                    ? {
                        ...candidate,
                        ...mergeStripProps(candidate, {
                          loweredSectionOffset: Math.round(nextOffset * 100) / 100,
                        }),
                      }
                    : candidate
                )))
              }}
              onDragEnd={(e) => {
                const node = e.target
                node.x(sx)
                node.y(stripY + loweredOffset)
                delete curbLoweredDragRef.current[strip.id]
              }}
            >
              <Rect
                width={stripRenderWidth}
                height={loweredLength}
                fill="rgba(74,158,255,0.08)"
                stroke="rgba(74,158,255,0.45)"
                strokeWidth={1 / displayScale}
                dash={[0.2, 0.16]}
                cornerRadius={0.05}
                cursor="ns-resize"
              />
              <KonvaLine
                points={[
                  Math.max(0.06, stripRenderWidth * 0.22), loweredLength / 2,
                  Math.max(0.06, stripRenderWidth * 0.78), loweredLength / 2,
                ]}
                stroke="rgba(74,158,255,0.72)"
                strokeWidth={0.04}
                lineCap="round"
                listening={false}
              />
            </Group>
          )
        }
      }
    }

    // Parking bay phase drag — transparent overlay, ns-resize cursor
      if (strip.type === 'parking' && selectedStripId === strip.id) {
        const parkingProps = getParkingStripProps(strip)
        if (parkingProps.markingStyle !== 'none' && parkingProps.bayLength > 0.1) {
          const bayOffset = parkingProps.bayOffset ?? 0

          const gripW = Math.min(1.2, stripRenderWidth * 0.4)
          const gripH = 0.6
          const gripX = sx + (stripRenderWidth - gripW) / 2
          const gripY = stripY + stripHeight / 2 - gripH / 2
          const gripGap = 0.12

          // Selection tint (non-interactive)
          interactionNodes.push(
            <Rect
              key={`parking-tint-${strip.id}`}
              x={sx}
              y={stripY}
              width={stripRenderWidth}
              height={stripHeight}
              fill="rgba(74,158,255,0.08)"
              listening={false}
            />
          )

          // Grip handle — small draggable zone in the center
          interactionNodes.push(
            <Group
              key={`parking-bay-handle-${strip.id}`}
              x={gripX}
              y={gripY}
              draggable
              onMouseDown={(e) => { e.cancelBubble = true }}
              onDragStart={() => {
                parkingBayDragRef.current[strip.id] = {
                  startOffset: bayOffset,
                  maxOffset: parkingProps.bayLength,
                }
              }}
              onDragMove={(e) => {
                const node = e.target
                const current = parkingBayDragRef.current[strip.id]
                if (!current) return

                const dragY = node.y() - gripY
                const nextOffset = current.startOffset + dragY
                node.x(gripX)
                node.y(gripY)

                onStripsUpdate?.(strips.map((candidate) => (
                  candidate.id === strip.id
                    ? {
                        ...candidate,
                        ...mergeStripProps(candidate, {
                          bayOffset: Math.round(nextOffset * 100) / 100,
                        }),
                      }
                    : candidate
                )))
              }}
              onDragEnd={(e) => {
                const node = e.target
                node.x(gripX)
                node.y(gripY)
                delete parkingBayDragRef.current[strip.id]
              }}
            >
              {/* Hit area for grip */}
              <Rect
                width={gripW}
                height={gripH}
                fill="rgba(74,158,255,0.15)"
                cornerRadius={0.06}
                cursor="ns-resize"
              />
              {/* Grip lines */}
              <KonvaLine points={[gripW * 0.2, gripH / 2 - gripGap, gripW * 0.8, gripH / 2 - gripGap]} stroke="rgba(74,158,255,0.7)" strokeWidth={0.04} lineCap="round" listening={false} />
              <KonvaLine points={[gripW * 0.2, gripH / 2, gripW * 0.8, gripH / 2]} stroke="rgba(74,158,255,0.7)" strokeWidth={0.04} lineCap="round" listening={false} />
              <KonvaLine points={[gripW * 0.2, gripH / 2 + gripGap, gripW * 0.8, gripH / 2 + gripGap]} stroke="rgba(74,158,255,0.7)" strokeWidth={0.04} lineCap="round" listening={false} />
            </Group>
          )
        }
      }

    // Subtle edge line between strips of different types
    const baseIndex = crossSectionStrips.findIndex((candidate) => candidate.id === strip.id)
    if (!isOverlay && baseIndex >= 0 && baseIndex < crossSectionStrips.length - 1 && strip.type !== crossSectionStrips[baseIndex + 1].type) {
      const edgeX = sx + stripRenderWidth
      const nextPlacement = placementById.get(crossSectionStrips[baseIndex + 1].id)
      if (nextPlacement) {
        visuals.push(
          <KonvaLine
            key={`edge-${i}`}
            points={[edgeX, Math.min(stripY, nextPlacement.y), edgeX, Math.max(stripY + stripHeight, nextPlacement.y + nextPlacement.length)]}
            stroke="rgba(128,128,128,0.2)"
            strokeWidth={0.3 / displayScale}
            listening={false}
          />
        )
      }
    }

    stripVisualsByIndex.set(i, visuals)
  }

  // Assemble strip visuals in layer order (z-order from layerOrder)
  const stripNodes: React.ReactNode[] = []
  for (const idx of stripRenderOrder) {
    const nodes = stripVisualsByIndex.get(idx)
    if (nodes) stripNodes.push(...nodes)
  }

  // Ghost strip — iOS-style lifted element
  const ghostNodes: React.ReactNode[] = []
  if (isDragging && dragGhostX != null && dragRef.current) {
    const ghostStrip = strips.find((s) => s.id === dragRef.current!.stripId)
    if (ghostStrip && !isLaneOverlayCyclepath(ghostStrip)) {
      const gw = ghostStrip.width
      const ghostY = getStripRenderY(ghostStrip)
      const ghostHeight = getStripRenderLength(ghostStrip, safeRoadLength)
      const pad = 0.25

      // Soft shadow (slightly offset down-right for depth)
      ghostNodes.push(
        <Rect
          key="ghost-shadow"
          x={dragGhostX - pad + 0.06} y={ghostY - pad + 0.08}
          width={gw + pad * 2} height={ghostHeight + pad * 2}
          fill="rgba(0,0,0,0.12)"
          cornerRadius={0.12}
          listening={false}
        />
      )
      // Outer glow (accent, very soft, wide)
      ghostNodes.push(
        <Rect
          key="ghost-glow"
          x={dragGhostX - pad} y={ghostY - pad}
          width={gw + pad * 2} height={ghostHeight + pad * 2}
          fill="rgba(74,158,255,0.06)"
          stroke="rgba(74,158,255,0.2)"
          strokeWidth={2 / displayScale}
          cornerRadius={0.12}
          listening={false}
        />
      )
      // The strip itself (slightly scaled up for "lift" effect)
      ghostNodes.push(
        <StripRenderer key="ghost-strip" strip={ghostStrip} x={dragGhostX} y={ghostY} length={ghostHeight} />
      )
      // Accent border (thin, crisp)
      ghostNodes.push(
        <Rect
          key="ghost-accent"
          x={dragGhostX} y={ghostY}
          width={gw} height={ghostHeight}
          stroke="rgba(74,158,255,0.45)"
          strokeWidth={1 / displayScale}
          listening={false}
        />
      )
    }
  }

  if (isDraggingOverlay && overlayGhostX != null && overlayDragRef.current && overlayPreviewSide) {
    const ghostStrip = strips.find((candidate) => candidate.id === overlayDragRef.current?.stripId)
    if (ghostStrip && isLaneOverlayCyclepath(ghostStrip)) {
      const ghostPlacement = placementById.get(ghostStrip.id)
      if (ghostPlacement) {
        const previewSnap = getOverlaySnapPosition(ghostStrip, overlayPreviewSide)
        const ghostStripWithPreviewSide = {
          ...ghostStrip,
          ...mergeStripProps(ghostStrip, { overlaySide: overlayPreviewSide }),
        }
        const ghostY = getStripRenderY(ghostStrip)
        const ghostHeight = getStripRenderLength(ghostStrip, safeRoadLength)
        const pad = 0.18

        ghostNodes.push(
          <Rect
            key="overlay-ghost-shadow"
            x={overlayGhostX - pad + 0.05}
            y={ghostY - pad + 0.08}
            width={previewSnap.renderWidth + pad * 2}
            height={ghostHeight + pad * 2}
            fill="rgba(0,0,0,0.12)"
            cornerRadius={0.12}
            listening={false}
          />
        )
        ghostNodes.push(
          <Rect
            key="overlay-ghost-glow"
            x={overlayGhostX - pad}
            y={ghostY - pad}
            width={previewSnap.renderWidth + pad * 2}
            height={ghostHeight + pad * 2}
            fill="rgba(74,158,255,0.06)"
            stroke="rgba(74,158,255,0.2)"
            strokeWidth={2 / displayScale}
            cornerRadius={0.12}
            listening={false}
          />
        )
        ghostNodes.push(
          <StripRenderer
            key="overlay-ghost-strip"
            strip={ghostStripWithPreviewSide}
            x={overlayGhostX}
            y={ghostY}
            length={ghostHeight}
            renderWidth={previewSnap.renderWidth}
            overlaySide={overlayPreviewSide}
            safetyBufferWidth={overlayPreviewSide === 'left' || overlayPreviewSide === 'right'
              ? previewSnap.renderWidth - ghostStrip.width
              : ghostPlacement.safetyBufferWidth}
          />
        )
        ghostNodes.push(
          <Rect
            key="overlay-ghost-accent"
            x={overlayGhostX}
            y={ghostY}
            width={previewSnap.renderWidth}
            height={ghostHeight}
            stroke="rgba(74,158,255,0.45)"
            strokeWidth={1 / displayScale}
            listening={false}
          />
        )
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg"
      style={{ background: '#f5f5f5', border: '1px solid var(--border)' }}
      onContextMenu={(e) => {
        e.preventDefault()
        const target = rightClickTargetRef.current
        rightClickTargetRef.current = null
        if (target && onContextMenuElement) {
          onContextMenuElement(e, target.kind, target.id)
        }
      }}
    >
      <Stage ref={stageRef} width={containerSize.width} height={containerSize.height}>
        {/* Background — click to deselect */}
        <Layer>
          <Rect
            x={0} y={0} width={containerSize.width} height={containerSize.height}
            fill="#f5f5f5"
            onClick={() => { onSelectStrip(null); onSelectMarking(null) }}
            onTap={() => { onSelectStrip(null); onSelectMarking(null) }}
          />
        </Layer>

        {/* Strip visuals + labels + edge lines */}
        <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
          {stripNodes}
        </Layer>

        {/* Interaction: selection, resize, drag (same transform) */}
        <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
          {interactionNodes}
        </Layer>

        {/* Ghost strip (follows cursor during drag) */}
        {ghostNodes.length > 0 && (
          <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
            {ghostNodes}
          </Layer>
        )}

        {/* Snap guide lines (visible during marking drag) */}
        {isDraggingMarking && (
          <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
            {stripEdges.map((ex, i) => (
              <KonvaLine
                key={`snap-${i}`}
                points={[ex, 0, ex, safeRoadLength]}
                stroke="#4a9eff"
                strokeWidth={0.8 / displayScale}
                dash={[4 / displayScale, 4 / displayScale]}
                opacity={0.5}
                listening={false}
              />
            ))}
          </Layer>
        )}

        {/* Markings (draggable, selectable, snappable) */}
        <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
          {orderedMarkings.map((m) => {
            // For centerlines: pass peer phases for vertical alignment snap
            const peerPhases = m.type === 'centerline'
              ? orderedMarkings.filter((p) => p.type === 'centerline' && p.id !== m.id).map((p) => p.y)
              : undefined
            return (
              <MarkingRenderer
                key={m.id}
                marking={m}
                roadLength={safeRoadLength}
                draggable
                selected={selectedMarkingId === m.id}
                snapPositions={stripEdges}
                peerPhases={peerPhases}
                onDragEnd={onMarkingMove}
                onClick={(id) => { onSelectMarking(id); onSelectStrip(null) }}
                onDoubleClick={(id) => onDoubleClickElement?.('marking', id)}
                onRightClick={(id) => {
                  rightClickTargetRef.current = { kind: 'marking', id }
                  onSelectMarking(id)
                  onSelectStrip(null)
                }}
                onDragging={setIsDraggingMarking}
              />
            )
          })}
        </Layer>

        {/* Length handle */}
        <Layer>
          <Rect
            x={offsetX} y={offsetY + roadHeightPx - 2}
            width={roadWidthPx} height={5}
            fill={draggingLength ? '#4a9eff' : 'rgba(74,158,255,0.3)'}
            cornerRadius={2} cursor="ns-resize"
            onMouseDown={handleLengthDragStart}
          />
          <Rect
            x={offsetX + roadWidthPx / 2 - 15} y={offsetY + roadHeightPx + 6}
            width={30} height={3}
            fill={draggingLength ? '#4a9eff' : '#bbb'}
            cornerRadius={1.5} cursor="ns-resize"
            onMouseDown={handleLengthDragStart}
          />
        </Layer>
      </Stage>
    </div>
  )
}
