import { useMemo, useEffect, useRef, useCallback } from 'react'
import { Group, Rect } from 'react-konva'
import { StripRenderer } from './StripRenderer'
import { MarkingRenderer } from './MarkingRenderer'
import type { StraightRoadState } from '../types'
import type { CanvasObject } from '@/types'
import { metersToPixels, pixelsToMeters } from '@/utils/scale'
import { shapeRefs } from '@/components/Canvas/shapeRefs'
import { useAppStore } from '@/store'
import type Konva from 'konva'
import { orderMarkingsByLayer, totalWidth } from '../constants'
import { getRoadwayBoundsFromPlacements, getStripPlacements } from '../layout'
import { normalizeStraightRoadState } from '../state'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDragStart?: (id: string, e: any) => void
  onDoubleClick?: (id: string) => void
}

export function SmartRoadCanvasObject({ obj, scale, offsetXMeters = 0, offsetYMeters = 0, contentOriginX = 0, contentOriginY = 0, onSelect, onDragStart, onDoubleClick }: Props) {
  const groupRef = useRef<Konva.Group>(null)
  const updateObject = useAppStore((s) => s.updateObject)
  const activeTool = useAppStore((s) => s.activeTool)
  const hasViewportOverride = useAppStore((s) => !!s.scale.viewport)

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
      return normalizeStraightRoadState(JSON.parse(obj.editorState))
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
  const orderedMarkings = orderMarkingsByLayer(state.markings, state.layerOrder)
  const markingById = new Map(state.markings.map((marking) => [marking.id, marking]))
  const linkedCrossingByIslandId = new Map(
    state.markings
      .filter((marking) => (
        (marking.type === 'crosswalk' || marking.type === 'bike-crossing') &&
        typeof marking.linkedIslandId === 'string' &&
        marking.linkedIslandId.trim().length > 0
      ))
      .map((marking) => [marking.linkedIslandId!, marking]),
  )
  const stripPlacements = getStripPlacements(state.strips, state.length)
  const roadwayBounds = getRoadwayBoundsFromPlacements(stripPlacements)
  const tw = totalWidth(state.strips)
  const roadLen = state.length

  // Build strip nodes
  const stripNodes: React.ReactNode[] = []
  for (const placement of stripPlacements) {
    stripNodes.push(
      <StripRenderer
        key={placement.strip.id}
        strip={placement.strip}
        x={placement.x}
        y={placement.y}
        length={placement.length}
        renderWidth={placement.renderWidth}
        overlaySide={placement.overlaySide}
        safetyBufferWidth={placement.safetyBufferWidth}
        facingSide={placement.facingSide}
      />
    )
  }

  // Clip function for road bounds (works correctly with scale/rotation)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clipRoadBounds = (ctx: any) => { ctx.rect(0, 0, tw, roadLen) }

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
      clipFunc={clipRoadBounds}
      draggable={!obj.locked && (activeTool === 'select' || (activeTool === 'print-area' && hasViewportOverride))}
      onMouseDown={(e) => onSelect?.(obj.id, e)}
      onClick={(e) => onSelect?.(obj.id, e)}
      onTap={(e) => onSelect?.(obj.id, e)}
      onDragStart={(e) => onDragStart?.(obj.id, e)}
      onDblClick={() => onDoubleClick?.(obj.id)}
      onDblTap={() => onDoubleClick?.(obj.id)}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* Bounds rect — forces Konva's getClientRect() to match exact road dimensions */}
      <Rect x={0} y={0} width={tw} height={roadLen} listening={false} />
      {stripNodes}
      {orderedMarkings.map((m) => (
        <MarkingRenderer
          key={m.id}
          marking={m}
          roadLength={roadLen}
          roadClass={state.roadClass}
          roadwayBounds={m.type === 'traffic-island' || m.type === 'crosswalk' || m.type === 'bike-crossing' ? roadwayBounds : undefined}
          linkedIsland={(m.type === 'crosswalk' || m.type === 'bike-crossing') && m.linkedIslandId ? markingById.get(m.linkedIslandId) : undefined}
          linkedCrossing={m.type === 'traffic-island' ? linkedCrossingByIslandId.get(m.id) : undefined}
        />
      ))}
    </Group>
  )
}

