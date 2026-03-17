import { useRef, useCallback, useEffect, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useAppStore } from '@/store'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, MM_TO_PX } from '@/utils/scale'
import { CanvasObjects } from './CanvasObjects'
import { useDrawing } from '@/hooks/useDrawing'
import type Konva from 'konva'

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

  const hasCentered = useRef(false)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

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
        const x = (width - PAGE_WIDTH_PX) / 2
        const y = (height - PAGE_HEIGHT_PX) / 2
        setViewport({ x, y, zoom: 1 })
        zoomTo(1)
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

      // Pan mode: middle mouse, hand tool, or spacebar+click
      const canPan =
        e.evt.button === 1 ||
        activeTool === 'hand' ||
        (e.evt.button === 0 && spaceRef.current)

      if (canPan) {
        isDragging.current = true
        dragStart.current = {
          x: e.evt.clientX - viewport.x,
          y: e.evt.clientY - viewport.y,
        }
        e.evt.preventDefault()
        return
      }

      // Drawing mode
      if (e.evt.button === 0 && isDrawingTool(activeTool)) {
        onDrawStart(stage, activeTool)
        return
      }

      // Click on empty stage = deselect
      if (e.evt.button === 0 && e.target === stage) {
        clearSelection()
      }
    },
    [activeTool, viewport, isDrawingTool, onDrawStart, clearSelection]
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

      if (isDrawing()) {
        const stage = stageRef.current
        if (stage) onDrawMove(stage, activeTool)
      }
    },
    [setViewport, isDrawing, onDrawMove, activeTool]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false
      return
    }
    if (isDrawing()) {
      onDrawEnd(removeObject)
    }
  }, [isDrawing, onDrawEnd, removeObject])

  // Cursor
  const isPanMode = spaceHeld || activeTool === 'hand'
  const isDrawMode = isDrawingTool(activeTool)
  const cursor = isPanMode
    ? isDragging.current ? 'grabbing' : 'grab'
    : isDrawMode
      ? 'crosshair'
      : 'default'

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
      </Stage>
    </div>
  )
}
