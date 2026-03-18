import { useMemo, useEffect, useRef } from 'react'
import { Group } from 'react-konva'
import { StripRenderer } from './StripRenderer'
import { MarkingRenderer } from './MarkingRenderer'
import type { StraightRoadState } from '../types'
import type { CanvasObject } from '@/types'
import { metersToPixels } from '@/utils/scale'
import type { ValidScale } from '@/types'
import { shapeRefs } from '@/components/Canvas/shapeRefs'
import type Konva from 'konva'

// ============================================================
// SmartRoadCanvasObject – Renders a SmartRoad on the main canvas
// ============================================================

interface Props {
  obj: CanvasObject
  scale: ValidScale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: (id: string, e: any) => void
  onDoubleClick?: (id: string) => void
}

export function SmartRoadCanvasObject({ obj, scale, onSelect, onDoubleClick }: Props) {
  const groupRef = useRef<Konva.Group>(null)

  // Register ref for the SelectionTransformer
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

  if (!state) return null

  const scaleFactor = metersToPixels(1, scale)

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
      x={obj.x}
      y={obj.y}
      rotation={obj.rotation}
      scaleX={scaleFactor}
      scaleY={scaleFactor}
      opacity={obj.opacity}
      visible={obj.visible}
      draggable={!obj.locked}
      onClick={(e) => onSelect?.(obj.id, e)}
      onTap={(e) => onSelect?.(obj.id, e)}
      onDblClick={() => onDoubleClick?.(obj.id)}
      onDblTap={() => onDoubleClick?.(obj.id)}
    >
      {stripNodes}
      {state.markings.map((m) => (
        <MarkingRenderer key={m.id} marking={m} roadLength={state.length} />
      ))}
    </Group>
  )
}
