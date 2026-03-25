import { Group, Rect, Line } from 'react-konva'
import { getAsphaltPattern, getCobblestonePattern, getConcretePattern, getPavingPattern } from '../../shared/patterns'
import { MARKING_RULES } from '../../rules/markingRules'
import type { CyclepathBoundaryLineSides, CyclepathLineMode, LaneSurfaceType } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  color?: string
  surfaceType?: LaneSurfaceType
  boundaryLineMode?: CyclepathLineMode
  boundaryLineSides?: CyclepathBoundaryLineSides
  boundaryLineStrokeWidth?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
  boundaryLinePhase?: number
}

const SURFACE_COLORS: Record<LaneSurfaceType, string> = {
  asphalt: '#3a3a3a',
  concrete: '#8a8a88',
  cobblestone: '#2a2a2a',
  paving: '#3a3a3a',
}

const SURFACE_PATTERNS: Record<LaneSurfaceType, () => HTMLCanvasElement> = {
  asphalt: getAsphaltPattern,
  concrete: getConcretePattern,
  cobblestone: getCobblestonePattern,
  paving: getPavingPattern,
}

const SURFACE_SCALES: Record<LaneSurfaceType, number> = {
  asphalt: 0.015,
  concrete: 0.016,
  cobblestone: 0.015,
  paving: 0.015,
}

const DEFAULT_BOUNDARY_DASH: [number, number] = [0.5, 0.5]
const DEFAULT_BOUNDARY_STROKE = MARKING_RULES.lineWidths.otherRoads.schmalstrich

export function LaneStrip({
  x, y = 0, width, length, color, surfaceType = 'asphalt',
  boundaryLineMode = 'none',
  boundaryLineSides = 'both',
  boundaryLineStrokeWidth,
  boundaryLineDashLength,
  boundaryLineGapLength,
  boundaryLinePhase,
}: Props) {
  const fill = color || SURFACE_COLORS[surfaceType]
  const pattern = SURFACE_PATTERNS[surfaceType]()
  const scale = SURFACE_SCALES[surfaceType]

  // Boundary lines
  const showBoundaryLines = boundaryLineMode !== 'none'
  const boundaryStroke = boundaryLineStrokeWidth ?? DEFAULT_BOUNDARY_STROKE
  const boundaryDash = boundaryLineMode === 'dashed'
    ? [boundaryLineDashLength ?? DEFAULT_BOUNDARY_DASH[0], boundaryLineGapLength ?? DEFAULT_BOUNDARY_DASH[1]] as [number, number]
    : undefined
  const boundaryDashOffset = boundaryDash
    ? (((boundaryLinePhase ?? 0) % (boundaryDash[0] + boundaryDash[1])) + (boundaryDash[0] + boundaryDash[1])) % (boundaryDash[0] + boundaryDash[1])
    : undefined
  const showLeftBoundary = showBoundaryLines && (boundaryLineSides === 'both' || boundaryLineSides === 'left')
  const showRightBoundary = showBoundaryLines && (boundaryLineSides === 'both' || boundaryLineSides === 'right')
  const white = '#ffffff'

  return (
    <Group x={x} y={y}>
      <Rect width={width} height={length} fill={fill} />
      <Rect
        width={width}
        height={length}
        fillPatternImage={pattern as unknown as HTMLImageElement}
        fillPatternRepeat="repeat"
        fillPatternScaleX={scale}
        fillPatternScaleY={scale}
        listening={false}
      />

      {/* Boundary lines */}
      {showLeftBoundary && (
        <Line
          points={[boundaryStroke / 2, 0, boundaryStroke / 2, length]}
          stroke={white}
          strokeWidth={boundaryStroke}
          dash={boundaryDash}
          dashOffset={boundaryDashOffset}
          lineCap="butt"
          perfectDrawEnabled={false}
          listening={false}
        />
      )}
      {showRightBoundary && (
        <Line
          points={[width - boundaryStroke / 2, 0, width - boundaryStroke / 2, length]}
          stroke={white}
          strokeWidth={boundaryStroke}
          dash={boundaryDash}
          dashOffset={boundaryDashOffset}
          lineCap="butt"
          perfectDrawEnabled={false}
          listening={false}
        />
      )}
    </Group>
  )
}
