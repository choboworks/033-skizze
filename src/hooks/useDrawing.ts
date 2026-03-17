import { useRef, useCallback } from 'react'
import { useAppStore } from '@/store'
import type { CanvasObject, ShapeType } from '@/types'
import type Konva from 'konva'

interface DrawState {
  isDrawing: boolean
  startX: number
  startY: number
  currentId: string | null
}

const DRAWING_TOOLS: Set<string> = new Set(['rect', 'ellipse', 'line', 'arrow'])

/** Returns the first available layer ID */
function getTargetLayerId(): string {
  const layers = useAppStore.getState().layers
  return layers.length > 0 ? layers[layers.length - 1].id : 'default'
}

export function useDrawing() {
  const drawState = useRef<DrawState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentId: null,
  })

  const addObject = useAppStore((s) => s.addObject)
  const updateObject = useAppStore((s) => s.updateObject)
  const select = useAppStore((s) => s.select)
  const setActiveTool = useAppStore((s) => s.setActiveTool)

  /** Check if current tool is a drawing tool */
  const isDrawingTool = useCallback((tool: string) => DRAWING_TOOLS.has(tool), [])

  /** Get pointer position in page coordinates (undo viewport transform) */
  const getPagePos = useCallback((stage: Konva.Stage) => {
    const pointer = stage.getPointerPosition()
    if (!pointer) return null
    const transform = stage.getAbsoluteTransform().copy().invert()
    return transform.point(pointer)
  }, [])

  /** Start drawing on mousedown */
  const onDrawStart = useCallback(
    (stage: Konva.Stage, tool: string) => {
      const pos = getPagePos(stage)
      if (!pos) return

      const id = crypto.randomUUID()
      const shapeType = tool as ShapeType

      const obj: CanvasObject = {
        id,
        type: shapeType,
        category: 'markings',
        layerId: getTargetLayerId(),
        label: '',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        rotation: 0,
        strokeColor: '#000000',
        strokeWidth: 2,
        fillColor: 'transparent',
        opacity: 1,
        points: shapeType === 'line' || shapeType === 'arrow' ? [0, 0, 0, 0] : undefined,
        visible: true,
        locked: false,
      }

      addObject(obj)
      drawState.current = {
        isDrawing: true,
        startX: pos.x,
        startY: pos.y,
        currentId: id,
      }
    },
    [addObject, getPagePos]
  )

  /** Update shape while dragging */
  const onDrawMove = useCallback(
    (stage: Konva.Stage, tool: string) => {
      const state = drawState.current
      if (!state.isDrawing || !state.currentId) return

      const pos = getPagePos(stage)
      if (!pos) return

      const dx = pos.x - state.startX
      const dy = pos.y - state.startY

      if (tool === 'line' || tool === 'arrow') {
        updateObject(state.currentId, {
          points: [0, 0, dx, dy],
          width: Math.abs(dx),
          height: Math.abs(dy),
        })
      } else {
        // For rect/ellipse: support drawing in any direction
        updateObject(state.currentId, {
          x: dx >= 0 ? state.startX : pos.x,
          y: dy >= 0 ? state.startY : pos.y,
          width: Math.abs(dx),
          height: Math.abs(dy),
        })
      }
    },
    [updateObject, getPagePos]
  )

  /** Finish drawing on mouseup */
  const onDrawEnd = useCallback(
    (removeObject: (id: string) => void) => {
      const state = drawState.current
      if (!state.isDrawing || !state.currentId) return

      const id = state.currentId

      // Get the final object to check size
      const obj = useAppStore.getState().objects[id]
      if (obj && obj.width < 3 && obj.height < 3) {
        // Too small, remove it (accidental click)
        removeObject(id)
      } else {
        // Select the newly drawn object and switch to select tool
        select([id])
        setActiveTool('select')
      }

      drawState.current = {
        isDrawing: false,
        startX: 0,
        startY: 0,
        currentId: null,
      }
    },
    [select, setActiveTool]
  )

  return {
    isDrawingTool,
    onDrawStart,
    onDrawMove,
    onDrawEnd,
    isDrawing: () => drawState.current.isDrawing,
  }
}
