import { Group, Line, Rect } from 'react-konva'
import {
  getAsphaltPattern,
  getClinkerPattern,
  getNaturalStonePattern,
  getPavingPattern,
  getSidewalkPattern,
} from '../../shared/patterns'
import { MARKING_RULES } from '../../rules/markingRules'
import type { FacingSide } from '../../layout'
import type { CyclepathBoundaryLineSides, CyclepathLineMode, SidewalkSurfaceType, StripVariant } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
  color?: string
  surfaceType?: SidewalkSurfaceType
  facingSide?: FacingSide
  boundaryLineMode?: CyclepathLineMode
  boundaryLineSides?: CyclepathBoundaryLineSides
  boundaryLineStrokeWidth?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
  boundaryLinePhase?: number
}

const SURFACE_CONFIG: Record<SidewalkSurfaceType, { fill: string; pattern: () => HTMLCanvasElement; scale: number }> = {
  slabs: { fill: '#c8c0b0', pattern: getSidewalkPattern, scale: 0.018 },
  paving: { fill: '#3a3a3a', pattern: getPavingPattern, scale: 0.015 },
  'natural-stone': { fill: '#a09888', pattern: getNaturalStonePattern, scale: 0.016 },
  clinker: { fill: '#8a6050', pattern: getClinkerPattern, scale: 0.015 },
  asphalt: { fill: '#4a4a4a', pattern: getAsphaltPattern, scale: 0.015 },
  'gravel-bound': { fill: '#c8b898', pattern: () => getSidewalkPattern(), scale: 0.016 },
}

const DEFAULT_BOUNDARY_DASH: [number, number] = [0.5, 0.5]
const DEFAULT_BOUNDARY_STROKE = MARKING_RULES.lineWidths.otherRoads.schmalstrich

export function SidewalkStrip({
  x, y = 0, width, length, variant, color,
  surfaceType = 'paving', facingSide,
  boundaryLineMode = 'none',
  boundaryLineSides = 'both',
  boundaryLineStrokeWidth,
  boundaryLineDashLength,
  boundaryLineGapLength,
  boundaryLinePhase,
}: Props) {
  const config = SURFACE_CONFIG[surfaceType]

  // Road-facing edge highlights
  const edgeWidth = 0.06
  const showLeftEdge = facingSide === 'left' || facingSide === 'both'
  const showRightEdge = facingSide === 'right' || facingSide === 'both'

  // Shared bike zone (for separated-bike variant)
  const bikeZoneWidth = Math.max(width * 0.38, 0.85)
  const bikeZoneX = width - bikeZoneWidth

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
      {/* Base fill + pattern */}
      <Rect width={width} height={length} fill={color || config.fill} />
      <Rect
        width={width}
        height={length}
        fillPatternImage={config.pattern() as unknown as HTMLImageElement}
        fillPatternRepeat="repeat"
        fillPatternScaleX={config.scale}
        fillPatternScaleY={config.scale}
        listening={false}
      />

      {/* Road-facing edge highlight */}
      {showLeftEdge && (
        <Rect x={0} width={edgeWidth} height={length} fill="#ffffff" opacity={0.18} listening={false} />
      )}
      {showRightEdge && (
        <Rect x={width - edgeWidth} width={edgeWidth} height={length} fill="#ffffff" opacity={0.18} listening={false} />
      )}

      {/* Boundary lines — rendered last to stay on top */}
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

      {/* Shared bike overlay */}
      {variant === 'shared-bike' && (
        <>
          <Rect width={width} height={length} fill="#7aa0aa" opacity={0.12} listening={false} />
          <Rect x={width * 0.15} width={width * 0.70} height={length} fill="#b8d8d0" opacity={0.10} listening={false} />
        </>
      )}

      {/* Separated bike zone */}
      {variant === 'separated-bike' && (
        <>
          <Rect x={bikeZoneX} width={bikeZoneWidth} height={length} fill="#b87050" opacity={0.16} listening={false} />
          <Line
            points={[bikeZoneX, 0, bikeZoneX, length]}
            stroke="#e8dcd0"
            strokeWidth={Math.max(0.04, width * 0.025)}
            opacity={0.65}
            listening={false}
          />
        </>
      )}
    </Group>
  )
}
