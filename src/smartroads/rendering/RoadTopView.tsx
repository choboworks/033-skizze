import { useRef, useState, useCallback, useEffect } from 'react'
import { Stage, Layer, Rect, Line as KonvaLine, Text } from 'react-konva'
import { StripRenderer } from './StripRenderer'
import { MarkingRenderer } from './MarkingRenderer'
import { totalWidth, STRIP_LABELS, STRIP_MIN_WIDTHS, FIXED_WIDTH_STRIPS } from '../constants'
import type { Strip, Marking } from '../types'
import type Konva from 'konva'

// ============================================================
// RoadTopView – Interactive top-down view.
// Strips rendered from array. Edges between strips are draggable
// to resize. The road IS the editor.
// ============================================================

interface Props {
  strips: Strip[]
  markings: Marking[]
  length: number
  onStripsUpdate?: (strips: Strip[]) => void
  onMarkingMove?: (id: string, x: number, y: number) => void
  onLengthChange?: (length: number) => void
}

const PADDING = 40

export function RoadTopView({
  strips,
  markings,
  length,
  onStripsUpdate,
  onMarkingMove,
  onLengthChange,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 })
  const [selectedStripId, setSelectedStripId] = useState<string | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null) // index of left strip

  const tw = totalWidth(strips)

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

  // Compute scale & offsets
  const scaleByWidth = (containerSize.width - PADDING * 2) / tw
  const scaleByHeight = (containerSize.height - PADDING * 2 - 20) / length
  const displayScale = Math.min(scaleByWidth, scaleByHeight)
  const roadWidthPx = tw * displayScale
  const roadHeightPx = length * displayScale
  const offsetX = (containerSize.width - roadWidthPx) / 2
  const offsetY = (containerSize.height - roadHeightPx) / 2

  // --- Edge resize ---
  const edgeResizeRef = useRef<{ edgeIndex: number; startX: number; startLeftWidth: number; startRightWidth: number } | null>(null)

  const handleEdgePointerDown = useCallback((edgeIndex: number, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    const leftStrip = strips[edgeIndex]
    const rightStrip = strips[edgeIndex + 1]
    if (!leftStrip || !rightStrip) return
    if (FIXED_WIDTH_STRIPS.includes(leftStrip.type) || FIXED_WIDTH_STRIPS.includes(rightStrip.type)) return

    const stage = stageRef.current
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return

    edgeResizeRef.current = {
      edgeIndex,
      startX: pos.x,
      startLeftWidth: leftStrip.width,
      startRightWidth: rightStrip.width,
    }

    const onMove = (me: MouseEvent) => {
      const ref = edgeResizeRef.current
      if (!ref || !stage) return
      const stageBox = stage.container().getBoundingClientRect()
      const currentX = me.clientX - stageBox.left
      const deltaX = currentX - ref.startX
      const deltaMeter = deltaX / displayScale

      const minLeft = STRIP_MIN_WIDTHS[leftStrip.type] || 0.10
      const minRight = STRIP_MIN_WIDTHS[rightStrip.type] || 0.10
      const newLeftW = Math.max(minLeft, ref.startLeftWidth + deltaMeter)
      const newRightW = Math.max(minRight, ref.startRightWidth - deltaMeter)

      // Only update if both constraints are met
      if (newLeftW >= minLeft && newRightW >= minRight) {
        const newStrips = strips.map((s, i) => {
          if (i === edgeIndex) return { ...s, width: Math.round(newLeftW * 100) / 100 }
          if (i === edgeIndex + 1) return { ...s, width: Math.round(newRightW * 100) / 100 }
          return s
        })
        onStripsUpdate?.(newStrips)
      }
    }

    const onUp = () => {
      edgeResizeRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [strips, displayScale, onStripsUpdate])

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

    const onUp = () => {
      setDraggingLength(false)
      lengthDragStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [length, displayScale, onLengthChange])

  // --- Click on strip to select ---
  const handleStripClick = useCallback((stripId: string) => {
    setSelectedStripId(prev => prev === stripId ? null : stripId)
  }, [])

  // --- Build strip nodes + edge handles ---
  const stripNodes: React.ReactNode[] = []
  const edgeHandles: React.ReactNode[] = []
  const stripLabels: React.ReactNode[] = []
  let xOffset = 0

  for (let i = 0; i < strips.length; i++) {
    const strip = strips[i]
    const sx = xOffset
    const isSelected = selectedStripId === strip.id

    // Strip visual
    stripNodes.push(
      <StripRenderer key={strip.id} strip={strip} x={sx} length={length} />
    )

    // Clickable overlay per strip
    stripNodes.push(
      <Rect
        key={`click-${strip.id}`}
        x={sx} y={0}
        width={strip.width} height={length}
        fill="transparent"
        onClick={() => handleStripClick(strip.id)}
        onTap={() => handleStripClick(strip.id)}
      />
    )

    // Selection highlight
    if (isSelected) {
      stripNodes.push(
        <Rect
          key={`sel-${strip.id}`}
          x={sx} y={0}
          width={strip.width} height={length}
          fill="rgba(74,158,255,0.15)"
          stroke="#4a9eff"
          strokeWidth={2 / displayScale}
          listening={false}
        />
      )
    }

    // Strip label at top (small, abbreviated, no wrap)
    if (strip.width * displayScale > 20) {
      const shortLabel = STRIP_LABELS[strip.type]?.slice(0, Math.floor(strip.width * displayScale / 6)) || ''
      stripLabels.push(
        <Text
          key={`label-${strip.id}`}
          x={sx + 0.1}
          y={0.2}
          text={shortLabel}
          fontSize={0.55}
          fontFamily="Inter, sans-serif"
          fill="#ffffff"
          opacity={0.5}
          listening={false}
        />
      )
    }

    // Edge handle between this strip and next
    if (i < strips.length - 1) {
      const edgeX = sx + strip.width
      const isHovered = hoveredEdge === i
      const isFixed = FIXED_WIDTH_STRIPS.includes(strip.type) || FIXED_WIDTH_STRIPS.includes(strips[i + 1].type)

      edgeHandles.push(
        <Rect
          key={`edge-${i}`}
          x={edgeX - 0.15}
          y={0}
          width={0.30}
          height={length}
          fill={isHovered && !isFixed ? 'rgba(74,158,255,0.6)' : 'transparent'}
          cursor={isFixed ? 'default' : 'col-resize'}
          onMouseEnter={() => !isFixed && setHoveredEdge(i)}
          onMouseLeave={() => setHoveredEdge(null)}
          onMouseDown={(e) => handleEdgePointerDown(i, e)}
        />
      )

      // Visible edge line
      edgeHandles.push(
        <KonvaLine
          key={`edgeline-${i}`}
          points={[edgeX, 0, edgeX, length]}
          stroke={isHovered && !isFixed ? '#4a9eff' : 'rgba(255,255,255,0.2)'}
          strokeWidth={isHovered ? 2 / displayScale : 0.5 / displayScale}
          listening={false}
        />
      )
    }

    xOffset += strip.width
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg"
      style={{ background: '#f5f5f5', border: '1px solid var(--border)' }}
    >
      <Stage ref={stageRef} width={containerSize.width} height={containerSize.height}>
        {/* Background — click to deselect */}
        <Layer>
          <Rect
            x={0} y={0} width={containerSize.width} height={containerSize.height}
            fill="#f5f5f5"
            onClick={() => setSelectedStripId(null)}
            onTap={() => setSelectedStripId(null)}
          />
        </Layer>

        {/* Road strips */}
        <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
          {stripNodes}
          {stripLabels}
          {edgeHandles}
        </Layer>

        {/* Markings (draggable) */}
        <Layer x={offsetX} y={offsetY} scaleX={displayScale} scaleY={displayScale}>
          {markings.map((m) => (
            <MarkingRenderer key={m.id} marking={m} roadLength={length} draggable onDragEnd={onMarkingMove} />
          ))}
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
