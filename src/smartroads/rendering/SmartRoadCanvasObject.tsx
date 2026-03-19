import { useMemo, useEffect, useRef, useCallback } from 'react'
import { Group } from 'react-konva'
import { StripRenderer } from './StripRenderer'
import { MarkingRenderer } from './MarkingRenderer'
import type { StraightRoadState } from '../types'
import type { CanvasObject } from '@/types'
import { metersToPixels, pixelsToMeters } from '@/utils/scale'
import { shapeRefs } from '@/components/Canvas/shapeRefs'
import { useAppStore } from '@/store'
import type Konva from 'konva'

// ============================================================
// SmartRoadCanvasObject – Renders a SmartRoad on the main canvas
//
// Position is stored in METERS (xMeters, yMeters).
// Rendered position = metersToPixels(xMeters, scale).
// After drag: pixel position → pixelsToMeters → store.
// No resize allowed — only rotation + drag.
// ============================================================

interface Props {
  obj: CanvasObject
  scale: number
  offsetXMeters?: number  // viewport offset in meters (for print-area override)
  offsetYMeters?: number
  contentOriginX?: number // pixel offset for content frame within A4
  contentOriginY?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: (id: string, e: any) => void
  onDoubleClick?: (id: string) => void
}

export function SmartRoadCanvasObject({ obj, scale, offsetXMeters = 0, offsetYMeters = 0, contentOriginX = 0, contentOriginY = 0, onSelect, onDoubleClick }: Props) {
  const groupRef = useRef<Konva.Group>(null)
  const updateObject = useAppStore((s) => s.updateObject)
  const activeTool = useAppStore((s) => s.activeTool)

  // Register ref for SelectionTransformer
  useEffect(() => {
    const node = groupRef.current
    if (node) {
      shapeRefs.set(obj.id, node)
      return () => { shapeRefs.delete(obj.id) }
    }
  }, [obj.id])

  // Parse editor state
  const state = useMemo<StraightRoadState | null>(() => {
    if (!obj.editorState) return null
    try {
      return JSON.parse(obj.editorState) as StraightRoadState
    } catch {
      return null
    }
  }, [obj.editorState])

  // Convert meter position to pixels (with viewport offset + content frame origin)
  const scaleFactor = metersToPixels(1, scale)
  const pixelX = contentOriginX + metersToPixels((obj.xMeters ?? 0) - offsetXMeters, scale)
  const pixelY = contentOriginY + metersToPixels((obj.yMeters ?? 0) - offsetYMeters, scale)

  // After drag: convert pixel position back to meters (accounting for content frame offset)
  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const newXMeters = pixelsToMeters(node.x() - contentOriginX, scale) + offsetXMeters
    const newYMeters = pixelsToMeters(node.y() - contentOriginY, scale) + offsetYMeters
    updateObject(obj.id, { xMeters: newXMeters, yMeters: newYMeters })
    // Reset node position to the computed pixel position (store is source of truth)
    node.x(contentOriginX + metersToPixels(newXMeters - offsetXMeters, scale))
    node.y(contentOriginY + metersToPixels(newYMeters - offsetYMeters, scale))
  }, [obj.id, scale, updateObject, contentOriginX, contentOriginY, offsetXMeters, offsetYMeters])

  // After rotation: save new rotation
  const handleTransformEnd = useCallback(() => {
    const node = groupRef.current
    if (!node) return
    // Reset scale (transformer might have changed it)
    node.scaleX(scaleFactor)
    node.scaleY(scaleFactor)
    // Save rotation + position (accounting for content frame offset)
    const newXMeters = pixelsToMeters(node.x() - contentOriginX, scale) + offsetXMeters
    const newYMeters = pixelsToMeters(node.y() - contentOriginY, scale) + offsetYMeters
    updateObject(obj.id, {
      rotation: node.rotation(),
      xMeters: newXMeters,
      yMeters: newYMeters,
    })
  }, [obj.id, scale, scaleFactor, updateObject, contentOriginX, contentOriginY, offsetXMeters, offsetYMeters])

  if (!state || !state.strips || state.strips.length === 0) return null

  // Build strip nodes
  const stripNodes: React.ReactNode[] = []
  let xOffset = 0
  for (const strip of state.strips) {
    stripNodes.push(
      <StripRenderer key={strip.id} strip={strip} x={xOffset} length={state.length} />
    )
    xOffset += strip.width
  }

  return (
    <Group
      ref={groupRef}
      id={obj.id}
      x={pixelX}
      y={pixelY}
      rotation={obj.rotation}
      scaleX={scaleFactor}
      scaleY={scaleFactor}
      opacity={obj.opacity}
      visible={obj.visible}
      draggable={!obj.locked && (activeTool === 'select' || (activeTool === 'print-area' && !!useAppStore.getState().scale.viewport))}
      onClick={(e) => onSelect?.(obj.id, e)}
      onTap={(e) => onSelect?.(obj.id, e)}
      onDblClick={() => onDoubleClick?.(obj.id)}
      onDblTap={() => onDoubleClick?.(obj.id)}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {stripNodes}
      {state.markings.map((m) => (
        <MarkingRenderer key={m.id} marking={m} roadLength={state.length} />
      ))}
    </Group>
  )
}
