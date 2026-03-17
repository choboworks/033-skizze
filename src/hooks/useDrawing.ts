import { useRef, useCallback } from 'react'
import { useAppStore } from '@/store'
import type { CanvasObject, ShapeType } from '@/types'
import type Konva from 'konva'

interface DrawState {
  isDrawing: boolean
  startX: number
  startY: number
  currentId: string | null
  freehandPoints: number[]
}

const DRAWING_TOOLS: Set<string> = new Set([
  'rect', 'rounded-rect', 'ellipse', 'triangle', 'polygon', 'star',
  'line', 'arrow', 'freehand',
])

function getTargetLayerId(): string {
  const layers = useAppStore.getState().layers
  return layers.length > 0 ? layers[layers.length - 1].id : 'default'
}

/** Convert lineStyle to Konva dash array */
function getLineDash(style: string, strokeWidth: number): number[] | undefined {
  switch (style) {
    case 'dashed': return [strokeWidth * 5, strokeWidth * 4]
    case 'dotted': return [strokeWidth, strokeWidth * 3]
    default: return undefined
  }
}

/**
 * Ramer-Douglas-Peucker path simplification.
 * Reduces number of points while preserving shape.
 */
function simplifyPath(points: number[], tolerance: number): number[] {
  if (points.length <= 4) return points // 2 points or less

  const len = points.length / 2
  let maxDist = 0
  let maxIdx = 0

  const startX = points[0], startY = points[1]
  const endX = points[points.length - 2], endY = points[points.length - 1]

  for (let i = 1; i < len - 1; i++) {
    const px = points[i * 2], py = points[i * 2 + 1]
    const dist = perpendicularDistance(px, py, startX, startY, endX, endY)
    if (dist > maxDist) {
      maxDist = dist
      maxIdx = i
    }
  }

  if (maxDist > tolerance) {
    const left = simplifyPath(points.slice(0, (maxIdx + 1) * 2), tolerance)
    const right = simplifyPath(points.slice(maxIdx * 2), tolerance)
    return [...left.slice(0, -2), ...right]
  }

  return [startX, startY, endX, endY]
}

function perpendicularDistance(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - x1, py - y1)
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq))
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

export function useDrawing() {
  const drawState = useRef<DrawState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentId: null,
    freehandPoints: [],
  })

  const addObject = useAppStore((s) => s.addObject)
  const updateObject = useAppStore((s) => s.updateObject)
  const select = useAppStore((s) => s.select)
  const setActiveTool = useAppStore((s) => s.setActiveTool)

  const isDrawingTool = useCallback((tool: string) => DRAWING_TOOLS.has(tool), [])

  const getPagePos = useCallback((stage: Konva.Stage) => {
    const pointer = stage.getPointerPosition()
    if (!pointer) return null
    const transform = stage.getAbsoluteTransform().copy().invert()
    return transform.point(pointer)
  }, [])

  const onDrawStart = useCallback(
    (stage: Konva.Stage, tool: string) => {
      const pos = getPagePos(stage)
      if (!pos) return

      const id = crypto.randomUUID()
      const shapeType = tool as ShapeType
      const { strokeColor, strokeWidth, fillColor, lineStyle, smoothing } = useAppStore.getState().toolOptions

      const isLine = shapeType === 'line' || shapeType === 'arrow'
      const isFreehand = shapeType === 'freehand'
      const noFill = isFreehand || isLine

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
        strokeColor,
        strokeWidth,
        fillColor: noFill ? 'transparent' : fillColor,
        opacity: 1,
        points: isLine ? [0, 0, 0, 0] : isFreehand ? [0, 0] : undefined,
        tension: isFreehand ? smoothing * 0.5 : undefined,
        lineDash: getLineDash(lineStyle, strokeWidth),
        cornerRadius: shapeType === 'rounded-rect' ? 12 : undefined,
        numPoints: shapeType === 'star' ? 5 : undefined,
        innerRadius: shapeType === 'star' ? 0.4 : undefined,
        visible: true,
        locked: false,
      }

      addObject(obj)

      drawState.current = {
        isDrawing: true,
        startX: pos.x,
        startY: pos.y,
        currentId: id,
        freehandPoints: shapeType === 'freehand' ? [0, 0] : [],
      }
    },
    [addObject, getPagePos]
  )

  const onDrawMove = useCallback(
    (stage: Konva.Stage, tool: string) => {
      const state = drawState.current
      if (!state.isDrawing || !state.currentId) return

      const pos = getPagePos(stage)
      if (!pos) return

      const dx = pos.x - state.startX
      const dy = pos.y - state.startY

      if (tool === 'freehand') {
        // Add point relative to start position
        state.freehandPoints.push(dx, dy)

        // Only update every 3rd point for performance
        if (state.freehandPoints.length % 6 === 0 || true) {
          updateObject(state.currentId, {
            points: [...state.freehandPoints],
          })
        }
      } else if (tool === 'line' || tool === 'arrow') {
        updateObject(state.currentId, {
          points: [0, 0, dx, dy],
          width: Math.abs(dx),
          height: Math.abs(dy),
        })
      } else {
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

  const onDrawEnd = useCallback(
    (removeObject: (id: string) => void) => {
      const state = drawState.current
      if (!state.isDrawing || !state.currentId) return

      const id = state.currentId
      const obj = useAppStore.getState().objects[id]

      if (!obj) {
        drawState.current = { isDrawing: false, startX: 0, startY: 0, currentId: null, freehandPoints: [] }
        return
      }

      if (obj.type === 'freehand') {
        // Simplify the path
        if (state.freehandPoints.length < 6) {
          // Too short, remove
          removeObject(id)
        } else {
          const tolerance = 2
          const simplified = simplifyPath(state.freehandPoints, tolerance)
          updateObject(id, { points: simplified })
          select([id])
          setActiveTool('select')
        }
      } else if (obj.width < 3 && obj.height < 3) {
        removeObject(id)
      } else {
        select([id])
        setActiveTool('select')
      }

      drawState.current = {
        isDrawing: false,
        startX: 0,
        startY: 0,
        currentId: null,
        freehandPoints: [],
      }
    },
    [select, setActiveTool, updateObject]
  )

  return {
    isDrawingTool,
    onDrawStart,
    onDrawMove,
    onDrawEnd,
    isDrawing: () => drawState.current.isDrawing,
  }
}
