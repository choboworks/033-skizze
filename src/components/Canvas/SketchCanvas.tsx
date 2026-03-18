import { useRef, useCallback, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Line as KonvaLine, Circle } from 'react-konva'
import { useAppStore } from '@/store'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, MM_TO_PX, pixelsToMeters } from '@/utils/scale'
import { snapTo45 } from '@/utils/snapAngle'
import { CanvasObjects } from './CanvasObjects'
import { shapeRefs } from './shapeRefs'
import { useDrawing } from '@/hooks/useDrawing'
import type Konva from 'konva'
import type { CanvasObject } from '@/types'

const MARGIN_PX = 10 * MM_TO_PX

export function SketchCanvas() {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewport = useAppStore((s) => s.viewport)
  const setViewport = useAppStore((s) => s.setViewport)
  const zoomTo = useAppStore((s) => s.zoomTo)
  const setCanvasSize = useAppStore((s) => s.setCanvasSize)
  const canvasSize = useAppStore((s) => s.canvasSize)
  const activeTool = useAppStore((s) => s.activeTool)
  const clearSelection = useAppStore((s) => s.clearSelection)
  const removeObject = useAppStore((s) => s.removeObject)
  const addObject = useAppStore((s) => s.addObject)
  const updateObject = useAppStore((s) => s.updateObject)
  const toolOptions = useAppStore((s) => s.toolOptions)
  const editingTextId = useAppStore((s) => s.editingTextId)
  const setEditingTextId = useAppStore((s) => s.setEditingTextId)
  const objects = useAppStore((s) => s.objects)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  const hasCentered = useRef(false)
  const isDragging = useRef(false)
  const [isDraggingCursor, setIsDraggingCursor] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Marquee selection (refs to avoid stale closures, state only for rendering)
  const marqueeStart = useRef<{ x: number; y: number } | null>(null)
  const marqueeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)
  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  // Dimension tool: first click + preview endpoint
  const [dimStart, setDimStart] = useState<{ x: number; y: number } | null>(null)
  const [dimEnd, setDimEnd] = useState<{ x: number; y: number } | null>(null)

  // Spacebar pan
  const [spaceHeld, setSpaceHeld] = useState(false)
  const spaceRef = useRef(false)

  // Drawing
  const { isDrawingTool, onDrawStart, onDrawMove, onDrawEnd, isDrawing } = useDrawing()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        spaceRef.current = true
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceRef.current = false
        setSpaceHeld(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // Finalize marquee: read from ref (never stale), then clear
  const finishMarquee = useCallback(() => {
    const rect = marqueeRef.current
    marqueeStart.current = null
    marqueeRef.current = null
    setMarqueeRect(null)
    if (!rect || (rect.w < 3 && rect.h < 3)) return
    const mx = rect.x, my = rect.y, mx2 = mx + rect.w, my2 = my + rect.h
    const hits: string[] = []
    const objs = useAppStore.getState().objects
    for (const [id, node] of shapeRefs) {
      if (!objs[id]?.visible) continue
      const box = node.getClientRect({ relativeTo: node.getLayer()! })
      if ((box.x + box.width) > mx && box.x < mx2 && (box.y + box.height) > my && box.y < my2) {
        hits.push(id)
      }
    }
    if (hits.length > 0) {
      useAppStore.getState().select(hits)
    }
  }, [])

  // Window-level mouseup fallback (clears marquee if mouse leaves stage)
  useEffect(() => {
    const onWindowMouseUp = () => {
      if (marqueeStart.current) finishMarquee()
    }
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => window.removeEventListener('mouseup', onWindowMouseUp)
  }, [finishMarquee])

  // Container size tracking
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width === 0 || height === 0) return

      setCanvasSize({ width, height })

      if (!hasCentered.current) {
        hasCentered.current = true
        const padding = 40
        const zoom = Math.min(
          (width - padding * 2) / PAGE_WIDTH_PX,
          (height - padding * 2) / PAGE_HEIGHT_PX
        )
        const x = (width - PAGE_WIDTH_PX * zoom) / 2
        const y = (height - PAGE_HEIGHT_PX * zoom) / 2
        setViewport({ x, y, zoom })
        zoomTo(zoom)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [setViewport, zoomTo, setCanvasSize])

  // Wheel zoom
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()
      const stage = stageRef.current
      if (!stage) return

      const oldZoom = viewport.zoom
      const pointer = stage.getPointerPosition()
      if (!pointer) return

      const scaleBy = 1.08
      const direction = e.evt.deltaY < 0 ? 1 : -1
      const newZoom = Math.max(0.1, Math.min(5, direction > 0 ? oldZoom * scaleBy : oldZoom / scaleBy))

      const mousePointTo = {
        x: (pointer.x - viewport.x) / oldZoom,
        y: (pointer.y - viewport.y) / oldZoom,
      }

      setViewport({
        zoom: newZoom,
        x: pointer.x - mousePointTo.x * newZoom,
        y: pointer.y - mousePointTo.y * newZoom,
      })
      zoomTo(newZoom)
    },
    [viewport, setViewport, zoomTo]
  )

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current
      if (!stage) return

      // Pan mode: middle mouse or spacebar+click
      const canPan =
        e.evt.button === 1 ||
        (e.evt.button === 0 && spaceRef.current)

      if (canPan) {
        isDragging.current = true
        setIsDraggingCursor(true)
        dragStart.current = {
          x: e.evt.clientX - viewport.x,
          y: e.evt.clientY - viewport.y,
        }
        e.evt.preventDefault()
        return
      }

      // Dimension tool: two-click to create measurement line
      if (e.evt.button === 0 && activeTool === 'dimension') {
        const pos = stage.getPointerPosition()
        if (!pos) return
        const cx = (pos.x - viewport.x) / viewport.zoom
        const cy = (pos.y - viewport.y) / viewport.zoom

        if (!dimStart) {
          // First click — set start point
          setDimStart({ x: cx, y: cy })
          setDimEnd({ x: cx, y: cy })
        } else {
          // Second click — create the dimension object
          const start = dimStart
          let endX = cx, endY = cy
          if (e.evt.shiftKey) {
            const snapped = snapTo45(start.x, start.y, cx, cy)
            endX = snapped.x
            endY = snapped.y
          }
          const end = { x: endX, y: endY }
          const dx = end.x - start.x
          const dy = end.y - start.y
          const distPx = Math.sqrt(dx * dx + dy * dy)

          if (distPx > 3) {
            const scale = useAppStore.getState().scale
            const distMeters = pixelsToMeters(distPx, scale.currentScale)

            const id = crypto.randomUUID()
            const newObj: CanvasObject = {
              id,
              type: 'dimension',
              category: 'markings',
              layerId: '',
              label: `${distMeters.toFixed(2)} m`,
              x: start.x,
              y: start.y,
              width: distPx,
              height: 0,
              rotation: 0,
              strokeColor: toolOptions.strokeColor,
              strokeWidth: toolOptions.strokeWidth,
              fillColor: toolOptions.strokeColor,
              opacity: 1,
              fontSize: toolOptions.fontSize,
              dimensionStart: start,
              dimensionEnd: end,
              visible: true,
              locked: false,
            }
            addObject(newObj)
            useAppStore.getState().select([id])
            useAppStore.getState().setActiveTool('select')
          }

          setDimStart(null)
          setDimEnd(null)
        }
        return
      }

      // Text tool: create text object on click
      if (e.evt.button === 0 && activeTool === 'text') {
        e.evt.preventDefault() // prevent canvas from stealing focus from textarea
        const pos = stage.getPointerPosition()
        if (!pos) return
        const x = (pos.x - viewport.x) / viewport.zoom
        const y = (pos.y - viewport.y) / viewport.zoom
        const id = crypto.randomUUID()
        const newObj: CanvasObject = {
          id,
          type: 'text',
          category: 'markings',
          layerId: '',
          label: 'Text',
          x,
          y,
          width: 10,
          height: 10,
          rotation: 0,
          strokeColor: 'transparent',
          strokeWidth: 0,
          fillColor: toolOptions.textColor,
          opacity: 1,
          text: '',
          fontSize: toolOptions.fontSize,
          fontStyle: toolOptions.fontStyle,
          textDecoration: toolOptions.textDecoration,
          textAlign: toolOptions.textAlign,
          textBackground: toolOptions.textBackground,
          visible: true,
          locked: false,
        }
        addObject(newObj)
        // Don't select while editing — hides the Transformer handles
        setEditingTextId(id)
        return
      }

      // Drawing mode
      if (e.evt.button === 0 && isDrawingTool(activeTool)) {
        onDrawStart(stage, activeTool)
        return
      }

      // Select tool on empty stage → start marquee selection
      if (e.evt.button === 0 && e.target === stage) {
        if (activeTool === 'select') {
          const pos = stage.getPointerPosition()
          if (pos) {
            const canvasX = (pos.x - viewport.x) / viewport.zoom
            const canvasY = (pos.y - viewport.y) / viewport.zoom
            marqueeStart.current = { x: canvasX, y: canvasY }
            marqueeRef.current = { x: canvasX, y: canvasY, w: 0, h: 0 }
            setMarqueeRect({ x: canvasX, y: canvasY, w: 0, h: 0 })
          }
        }
        clearSelection()
      }
    },
    [activeTool, viewport, toolOptions, addObject, setEditingTextId, isDrawingTool, onDrawStart, clearSelection, dimStart]
  )

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isDragging.current) {
        setViewport({
          x: e.evt.clientX - dragStart.current.x,
          y: e.evt.clientY - dragStart.current.y,
        })
        return
      }

      // Marquee drag
      if (marqueeStart.current) {
        const stage = stageRef.current
        if (stage) {
          const pos = stage.getPointerPosition()
          if (pos) {
            const canvasX = (pos.x - viewport.x) / viewport.zoom
            const canvasY = (pos.y - viewport.y) / viewport.zoom
            const sx = marqueeStart.current.x
            const sy = marqueeStart.current.y
            const rect = {
              x: Math.min(sx, canvasX),
              y: Math.min(sy, canvasY),
              w: Math.abs(canvasX - sx),
              h: Math.abs(canvasY - sy),
            }
            marqueeRef.current = rect
            setMarqueeRect(rect)
          }
        }
        return
      }

      // Dimension preview line
      if (dimStart && activeTool === 'dimension') {
        const stage = stageRef.current
        if (stage) {
          const pos = stage.getPointerPosition()
          if (pos) {
            let cx = (pos.x - viewport.x) / viewport.zoom
            let cy = (pos.y - viewport.y) / viewport.zoom
            if (e.evt.shiftKey) {
              const snapped = snapTo45(dimStart.x, dimStart.y, cx, cy)
              cx = snapped.x
              cy = snapped.y
            }
            setDimEnd({ x: cx, y: cy })
          }
        }
        return
      }

      if (isDrawing()) {
        const stage = stageRef.current
        if (stage) onDrawMove(stage, activeTool, e.evt.shiftKey)
      }
    },
    [setViewport, isDrawing, onDrawMove, activeTool, viewport, dimStart]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false
      setIsDraggingCursor(false)
      return
    }

    if (marqueeStart.current) {
      finishMarquee()
      return
    }

    if (isDrawing()) {
      onDrawEnd(removeObject)
    }
  }, [isDrawing, onDrawEnd, removeObject, finishMarquee])

  // Resize textarea to fit content (no auto-wrap — width tracks longest line)
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    const measure = measureRef.current
    if (!ta || !measure) return
    const lines = ta.value.split('\n')
    const longest = lines.reduce((a, b) => (a.length > b.length ? a : b), '')
    measure.textContent = longest || '\u00a0' // nbsp keeps height when empty
    const w = Math.max(measure.offsetWidth + 2, 60)
    ta.style.width = w + 'px'
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 'px'
  }, [])

  // Init size when editing starts
  useEffect(() => {
    if (editingTextId) resizeTextarea()
  }, [editingTextId, resizeTextarea])

  // Text editing commit
  const commitTextEdit = useCallback((value: string) => {
    if (!editingTextId) return
    if (value.trim() === '') {
      removeObject(editingTextId)
    } else {
      const zoom = useAppStore.getState().viewport.zoom
      const obj = useAppStore.getState().objects[editingTextId]
      const fontSize = obj?.fontSize ?? 24

      // Width: measure longest line via the hidden div (same font → matches Konva canvas)
      const measure = measureRef.current
      let finalWidth = 200
      if (measure) {
        const longest = value.split('\n').reduce((a, b) => a.length > b.length ? a : b, '')
        measure.textContent = longest || '\u00a0'
        finalWidth = Math.max(20, measure.offsetWidth / zoom)
      }

      // Height: derive from font metrics — same formula as Konva renderer
      const numLines = value.split('\n').length
      const finalHeight = fontSize * 1.2 * numLines

      // Auto-label: use first line of text as layer name (like Photoshop)
      const autoLabel = value.split('\n')[0].slice(0, 40)
      updateObject(editingTextId, { text: value, width: finalWidth, height: finalHeight, label: autoLabel })
      useAppStore.getState().select([editingTextId])
    }
    setEditingTextId(null)
    useAppStore.getState().setActiveTool('select')
  }, [editingTextId, removeObject, updateObject, setEditingTextId])


  // Cursor
  const isPanMode = spaceHeld
  const isDrawMode = isDrawingTool(activeTool)
  const cursor = isPanMode
    ? isDraggingCursor ? 'grabbing' : 'grab'
    : activeTool === 'text'
      ? 'text'
      : isDrawMode
        ? 'crosshair'
        : 'default'

  const editingObj = editingTextId ? objects[editingTextId] : null

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative"
      style={{ background: 'var(--canvas-bg)', cursor }}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        scaleX={viewport.zoom}
        scaleY={viewport.zoom}
        x={viewport.x}
        y={viewport.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* A4 Page shadow */}
        <Layer>
          <Rect
            x={4}
            y={4}
            width={PAGE_WIDTH_PX}
            height={PAGE_HEIGHT_PX}
            fill="rgba(0,0,0,0.12)"
            cornerRadius={2}
            listening={false}
          />
        </Layer>

        {/* A4 Paper */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={PAGE_WIDTH_PX}
            height={PAGE_HEIGHT_PX}
            fill="#ffffff"
            cornerRadius={1}
            listening={false}
          />

          {/* Printable area border */}
          <Rect
            x={MARGIN_PX}
            y={MARGIN_PX}
            width={PAGE_WIDTH_PX - 2 * MARGIN_PX}
            height={PAGE_HEIGHT_PX - 2 * MARGIN_PX}
            stroke="#e0e0e0"
            strokeWidth={0.5}
            dash={[4, 4]}
            listening={false}
          />
        </Layer>

        {/* Objects layer */}
        <Layer name="objects">
          <CanvasObjects />
        </Layer>

        {/* Dimension preview line */}
        {dimStart && dimEnd && (
          <Layer>
            <Circle
              x={dimStart.x}
              y={dimStart.y}
              radius={4 / viewport.zoom}
              fill="#4a9eff"
              listening={false}
            />
            <KonvaLine
              points={[dimStart.x, dimStart.y, dimEnd.x, dimEnd.y]}
              stroke="#4a9eff"
              strokeWidth={1.5 / viewport.zoom}
              dash={[6 / viewport.zoom, 4 / viewport.zoom]}
              listening={false}
            />
            <Circle
              x={dimEnd.x}
              y={dimEnd.y}
              radius={4 / viewport.zoom}
              fill="#4a9eff"
              listening={false}
            />
          </Layer>
        )}

        {/* Marquee selection overlay */}
        {marqueeRect && marqueeRect.w > 1 && marqueeRect.h > 1 && (
          <Layer>
            <Rect
              x={marqueeRect.x}
              y={marqueeRect.y}
              width={marqueeRect.w}
              height={marqueeRect.h}
              fill="rgba(74, 158, 255, 0.08)"
              stroke="#4a9eff"
              strokeWidth={1 / viewport.zoom}
              dash={[6 / viewport.zoom, 3 / viewport.zoom]}
              listening={false}
            />
          </Layer>
        )}
      </Stage>

      {/* Inline text editor overlay */}
      {editingTextId && editingObj && (() => {
        const fontSize = (editingObj.fontSize ?? 16) * viewport.zoom
        const fontWeight = (editingObj.fontStyle ?? '').includes('bold') ? 'bold' : 'normal'
        const fontStyle = (editingObj.fontStyle ?? '').includes('italic') ? 'italic' : 'normal'
        const textDecoration = (editingObj.textDecoration ?? '') === 'underline' ? 'underline' as const : 'none' as const
        const sharedFont = { fontSize, fontWeight, fontStyle, fontFamily: 'inherit', lineHeight: '1.2', textDecoration }
        return (
          <>
            {/* Hidden element used to measure text width per line */}
            <div
              ref={measureRef}
              aria-hidden
              style={{
                ...sharedFont,
                position: 'absolute',
                visibility: 'hidden',
                whiteSpace: 'pre',
                pointerEvents: 'none',
                padding: 0,
                margin: 0,
              }}
            />
            <textarea
              key={editingTextId}
              ref={textareaRef}
              autoFocus
              wrap="off"
              defaultValue={editingObj.text || ''}
              style={{
                ...sharedFont,
                position: 'absolute',
                left: viewport.x + editingObj.x * viewport.zoom,
                top: viewport.y + editingObj.y * viewport.zoom,
                width: 60,
                minWidth: 60,
                minHeight: fontSize * 1.4,
                textAlign: (editingObj.textAlign ?? 'left') as CanvasTextAlign,
                color: editingObj.fillColor !== 'transparent' ? editingObj.fillColor : '#000000',
                background: editingObj.textBackground && editingObj.textBackground !== 'transparent'
                  ? editingObj.textBackground
                  : 'rgba(255,255,255,0.05)',
                border: '1.5px dashed var(--accent)',
                outline: 'none',
                resize: 'none',
                overflow: 'hidden',
                padding: 0,
                margin: 0,
                zIndex: 100,
                boxSizing: 'border-box',
                whiteSpace: 'pre',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  commitTextEdit(e.currentTarget.value)
                }
              }}
              onBlur={(e) => commitTextEdit(e.target.value)}
              onChange={resizeTextarea}
            />
          </>
        )
      })()}
    </div>
  )
}
