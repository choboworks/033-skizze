import { Rect } from 'react-konva'
import { useAppStore } from '@/store'
import { MM_TO_PX } from '@/utils/scale'
import type Konva from 'konva'

// ============================================================
// Ausschnitt Tool – Components
// Hook lives in src/hooks/useAusschnitt.ts
// ============================================================

// --- Component: Interactive content frame (drag + resize handles, LIVE) ---

interface PrintAreaFrameProps {
  zoom: number
}

export function PrintAreaFrame({ zoom }: PrintAreaFrameProps) {
  const scaleViewport = useAppStore((s) => s.scale.viewport)
  const activeTool = useAppStore((s) => s.activeTool)
  if (!scaleViewport) return null

  // Frame is only interactive (drag/resize) with select tool.
  const interactive = activeTool === 'select'

  const sv = scaleViewport
  const fX = sv.frameX * MM_TO_PX
  const fY = sv.frameY * MM_TO_PX
  const fW = sv.frameW * MM_TO_PX
  const fH = sv.frameH * MM_TO_PX
  const handleSize = 8 / zoom

  const handleFrameDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const newXmm = node.x() / MM_TO_PX
    const newYmm = node.y() / MM_TO_PX
    const clampedX = Math.max(2, Math.min(210 - sv.frameW - 2, newXmm))
    const clampedY = Math.max(2, Math.min(297 - sv.frameH - 2, newYmm))
    node.x(clampedX * MM_TO_PX)
    node.y(clampedY * MM_TO_PX)
    useAppStore.getState().setScaleOverride({ ...sv, frameX: clampedX, frameY: clampedY })
  }

  const handleCornerDragMove = (corner: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const cx = (node.x() + handleSize / 2) / MM_TO_PX
    const cy = (node.y() + handleSize / 2) / MM_TO_PX
    let newX = sv.frameX, newY = sv.frameY, newW = sv.frameW, newH = sv.frameH

    if (corner.includes('l')) { newW = sv.frameX + sv.frameW - cx; newX = cx }
    if (corner.includes('r')) { newW = cx - sv.frameX }
    if (corner.includes('t')) { newH = sv.frameY + sv.frameH - cy; newY = cy }
    if (corner.includes('b')) { newH = cy - sv.frameY }

    if (newW < 40 || newH < 40) return
    useAppStore.getState().setScaleOverride({ ...sv, frameX: newX, frameY: newY, frameW: newW, frameH: newH })
  }

  const corners = [
    { id: 'tl', x: fX, y: fY, cursor: 'nwse-resize' },
    { id: 'tr', x: fX + fW, y: fY, cursor: 'nesw-resize' },
    { id: 'bl', x: fX, y: fY + fH, cursor: 'nesw-resize' },
    { id: 'br', x: fX + fW, y: fY + fH, cursor: 'nwse-resize' },
  ]

  return (
    <>
      {/* Frame body — draggable only with select tool */}
      <Rect
        x={fX} y={fY} width={fW} height={fH}
        stroke="#f0a030"
        strokeWidth={1.5 / zoom}
        dash={[6 / zoom, 3 / zoom]}
        fill="transparent"
        draggable={interactive}
        listening={interactive}
        cursor={interactive ? 'move' : undefined}
        onDragMove={interactive ? handleFrameDragMove : undefined}
      />
      {/* Resize handles at corners — only with select tool */}
      {interactive && corners.map((c) => (
        <Rect
          key={c.id}
          x={c.x - handleSize / 2}
          y={c.y - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="#f0a030"
          cornerRadius={1}
          draggable
          cursor={c.cursor}
          onDragMove={handleCornerDragMove(c.id)}
        />
      ))}
    </>
  )
}

// --- Component: Frame drag preview rectangle ---

interface PrintAreaPreviewProps {
  start: { x: number; y: number } | null
  end: { x: number; y: number } | null
  zoom: number
}

export function PrintAreaPreview({ start, end, zoom }: PrintAreaPreviewProps) {
  if (!start || !end) return null
  const x1 = Math.min(start.x, end.x)
  const y1 = Math.min(start.y, end.y)
  const w = Math.abs(end.x - start.x)
  const h = Math.abs(end.y - start.y)
  if (w < 3 || h < 3) return null

  return (
    <Rect
      x={x1} y={y1} width={w} height={h}
      fill="rgba(74, 158, 255, 0.06)"
      stroke="#4a9eff"
      strokeWidth={1.5 / zoom}
      listening={false}
    />
  )
}
