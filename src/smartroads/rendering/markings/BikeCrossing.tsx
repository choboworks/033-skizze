import { Group, Line, Rect } from 'react-konva'
import type { Marking } from '../../types'
import { handleMarkingDragMove } from './snapHelper'
import {
  DEFAULT_BIKE_CROSSING_COLOR,
  resolveBikeCrossingBoundaryDashPattern,
  resolveBikeCrossingBoundaryLineMode,
  resolveBikeCrossingBoundaryStrokeWidth,
  MARKING_RULES,
} from '../../rules/markingRules'
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

export function BikeCrossing({
  marking,
  draggable,
  selected,
  snapPositions,
  roadwayBounds,
  onDragEnd,
  onClick,
  onDoubleClick,
  onRightClick,
  onDragging,
}: Props) {
  const width = marking.width || 10
  const depth = marking.length || MARKING_RULES.bikeCrossing.defaultLength
  const surfaceType = marking.bikeCrossingSurfaceType || 'cyclepath'
  const boundaryMode = resolveBikeCrossingBoundaryLineMode(marking.bikeCrossingBoundaryLineMode)
  const isCyclepathFurt = surfaceType === 'cyclepath'
  const isPedestrianCrossing = surfaceType === 'crosswalk'
  const surfaceFill = isCyclepathFurt ? (marking.color || DEFAULT_BIKE_CROSSING_COLOR) : 'transparent'
  const surfaceTint = isCyclepathFurt ? 'rgba(255,255,255,0.06)' : 'transparent'
  const boundaryStroke = resolveBikeCrossingBoundaryStrokeWidth(marking.bikeCrossingBoundaryLineStrokeWidth)
  const boundaryDash = boundaryMode === 'dashed'
    ? resolveBikeCrossingBoundaryDashPattern(
        marking.bikeCrossingBoundaryLineDashLength,
        marking.bikeCrossingBoundaryLineGapLength,
      )
    : undefined
  const showBoundaryLines = isCyclepathFurt && boundaryMode !== 'none'
  const stripeWidth = MARKING_RULES.crosswalk.stripeWidth
  const stripeGap = MARKING_RULES.crosswalk.gap

  const zebraStripes: React.ReactNode[] = []
  if (isPedestrianCrossing) {
    for (let sx = 0; sx < width; sx += stripeWidth + stripeGap) {
      const clippedWidth = Math.min(stripeWidth, width - sx)
      if (clippedWidth <= 0) break
      zebraStripes.push(
        <Rect
          key={`zebra-${sx}`}
          x={sx}
          y={0}
          width={clippedWidth}
          height={depth}
          fill="#ffffff"
          listening={false}
        />,
      )
    }
  }

  return (
    <Group
      x={marking.x}
      y={marking.y}
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
      {selected && (
        <Rect
          x={0}
          y={0}
          width={width}
          height={depth}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      )}

      {isCyclepathFurt && (
        <>
          <Rect
            x={0}
            y={0}
            width={width}
            height={depth}
            fill={surfaceFill}
            listening={false}
          />
          <Rect
            x={0}
            y={0}
            width={width}
            height={depth}
            fill={surfaceTint}
            listening={false}
          />
        </>
      )}

      {isPedestrianCrossing && zebraStripes}

      {showBoundaryLines && (
        <>
          <Line
            points={[0, boundaryStroke / 2, width, boundaryStroke / 2]}
            stroke="#ffffff"
            strokeWidth={boundaryStroke}
            dash={boundaryDash}
            lineCap="butt"
            listening={false}
          />
          <Line
            points={[0, depth - boundaryStroke / 2, width, depth - boundaryStroke / 2]}
            stroke="#ffffff"
            strokeWidth={boundaryStroke}
            dash={boundaryDash}
            lineCap="butt"
            listening={false}
          />
        </>
      )}

      <Rect
        x={0}
        y={0}
        width={width}
        height={depth}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
