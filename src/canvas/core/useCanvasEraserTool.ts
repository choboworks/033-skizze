// src/canvas/core/useCanvasEraserTool.ts
import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import type { Canvas, Object as FabricObject } from 'fabric'
import { getId } from './canvasCore'

type UseCanvasEraserToolOpts = {
  fabricRef: MutableRefObject<Canvas | null>
  uiTool: string
}

export function useCanvasEraserTool({
  fabricRef,
  uiTool,
}: UseCanvasEraserToolOpts): void {
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    if (uiTool !== 'eraser') return

    const onMouseDown = (ev: unknown) => {
      const target = (ev as { target?: FabricObject } | null)?.target
      if (!target) return
      const id = getId(target)
      if (!id) return

      window.dispatchEvent(
        new CustomEvent('app:delete-id', { detail: { id } }),
      )
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }

    canvas.on('mouse:down', onMouseDown as unknown as () => void)
    return () => {
      canvas.off('mouse:down', onMouseDown as unknown as () => void)
    }
  }, [fabricRef, uiTool])
}
