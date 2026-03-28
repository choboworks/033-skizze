import { Group, Rect } from 'react-konva'
import type { Marking } from '../../types'
import { handleMarkingDragMove } from './snapHelper'
import { MARKING_RULES } from '../../rules/markingRules'
import type { RoadwayBounds } from '../../layout'

interface Props {
  marking: Marking
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  roadwayBounds?: RoadwayBounds
  linkedIsland?: Marking
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

interface CrosswalkSegment {
  x: number
  width: number
}

function getCrosswalkSegments(marking: Marking, roadwayBounds?: RoadwayBounds, linkedIsland?: Marking): CrosswalkSegment[] {
  const width = marking.width || 10

  if (
    !marking.linkedIslandId ||
    !roadwayBounds ||
    !linkedIsland ||
    linkedIsland.type !== 'traffic-island'
  ) {
    return [{ x: 0, width }]
  }

  const islandX = linkedIsland.x - roadwayBounds.minX
  const islandWidth = linkedIsland.width ?? 0
  const leftWidth = Math.max(0, islandX)
  const rightX = islandX + islandWidth
  const rightWidth = Math.max(0, width - rightX)

  return [
    ...(leftWidth > 0.05 ? [{ x: 0, width: leftWidth }] : []),
    ...(rightWidth > 0.05 ? [{ x: rightX, width: rightWidth }] : []),
  ]
}

export function Crosswalk({ marking, draggable, selected, snapPositions, roadwayBounds, linkedIsland, onDragEnd, onClick, onDoubleClick, onRightClick, onDragging }: Props) {
  const width = marking.width || 10
  const depth = marking.length || MARKING_RULES.crosswalk.defaultLength
  const stripeW = MARKING_RULES.crosswalk.stripeWidth
  const gap = MARKING_RULES.crosswalk.gap
  const color = marking.color || '#ffffff'
  const segments = getCrosswalkSegments(marking, roadwayBounds, linkedIsland)

  const stripes: React.ReactNode[] = []
  for (const segment of segments) {
    for (let sx = 0; sx < segment.width; sx += stripeW + gap) {
      const clippedW = Math.min(stripeW, segment.width - sx)
      if (clippedW <= 0) break
      stripes.push(
        <Rect key={`${segment.x}-${sx}`} x={segment.x + sx} y={0} width={clippedW} height={depth} fill={color} />
      )
    }
  }

  return (
    <Group
      x={marking.x} y={marking.y}
      rotation={marking.rotation || 0}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => {
        if (marking.linkedIslandId && roadwayBounds) {
          e.target.x(roadwayBounds.minX)
          return
        }
        handleMarkingDragMove(e, snapPositions)
      }}
      onDragEnd={(e) => { onDragging?.(false); onDragEnd?.(marking.id, e.target.x(), e.target.y()) }}
      onMouseDown={(e) => { if (e.evt.button === 2) { e.cancelBubble = true; onRightClick?.(marking.id) } }}
      onClick={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick?.(marking.id) }}
      onTap={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
      {selected && segments.map((segment) => (
        <Rect
          key={`selection-${segment.x}`}
          x={segment.x}
          y={0}
          width={segment.width}
          height={depth}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      ))}
      {stripes}
      {segments.length > 0 ? segments.map((segment) => (
        <Rect
          key={`hit-${segment.x}`}
          x={segment.x}
          y={0}
          width={segment.width}
          height={depth}
          fill="rgba(0,0,0,0.001)"
          cursor="pointer"
        />
      )) : (
        <Rect
          x={0}
          y={0}
          width={width}
          height={depth}
          fill="rgba(0,0,0,0.001)"
          cursor="pointer"
        />
      )}
    </Group>
  )
}
