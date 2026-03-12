// src/canvas/core/useCanvasPenTool.ts
import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import type { Canvas, Path } from 'fabric'
import { PencilBrush } from 'fabric'
import { extractGeom } from './canvasCore'  // ← NEU
import type { ElementModel } from '../canvasTypes'  // ← NEU

type HistoryBridge = {
  objectAdded: (id: string, elementData: ElementModel) => void
}

type UseCanvasPenToolOpts = {
  fabricRef: MutableRefObject<Canvas | null>
  uiTool: string
  strokeWidth: number
  color: string
  history: HistoryBridge  // ← NEU
}

export function useCanvasPenTool({
  fabricRef,
  uiTool,
  strokeWidth,
  color,
  history,  // ← NEU
}: UseCanvasPenToolOpts): void {
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const isPen = uiTool === 'pen'
    canvas.isDrawingMode = isPen

    if (isPen) {
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas)
      }
      const brush = canvas.freeDrawingBrush as PencilBrush
      brush.width = strokeWidth
      brush.color = color

      // 🔥 ID + Store-Eintrag für gezeichnete Paths
      const handlePathCreated = (evt: { path: Path }) => {
        const path = evt.path
        if (!path) return

        const id = `path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // ID setzen
        const objWithData = path as Path & { data?: Record<string, unknown> }
        if (!objWithData.data) objWithData.data = {}
        objWithData.data.id = id

        // ElementModel erstellen und an History übergeben
        const elementData: ElementModel = {
          id,
          type: 'shape',
          z: 0,
          visible: true,
          locked: { move: false, rotate: false, scale: false },
          geom: extractGeom(path),
          style: {
            stroke: color,
            strokeWidth: strokeWidth,
          },
          data: { isPenPath: true },
        }

        history.objectAdded(id, elementData)
      }

      canvas.on('path:created', handlePathCreated as () => void)

      return () => {
        canvas.off('path:created', handlePathCreated as () => void)
      }
    } else {
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }, [fabricRef, uiTool, strokeWidth, color, history])
}