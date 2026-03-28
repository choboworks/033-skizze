import { Group, Line, Rect } from 'react-konva'
import {
  getAsphaltPattern,
  getClinkerPattern,
  getNaturalStonePattern,
  getPavingPattern,
  getSidewalkSlabPattern,
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

interface SurfaceConfig {
  fill: string
  pattern: () => HTMLCanvasElement
  scale: number
  tint: string
  edgeHighlight: string
  edgeLine: string
  frameShade: string
}

const SURFACE_CONFIG: Record<SidewalkSurfaceType, SurfaceConfig> = {
  slabs: {
    fill: '#b7bbb7',
    pattern: getSidewalkSlabPattern,
    scale: 0.0105,
    tint: 'rgba(236,239,235,0.05)',
    edgeHighlight: 'rgba(244,246,242,0.20)',
    edgeLine: 'rgba(106,112,108,0.28)',
    frameShade: 'rgba(54,60,56,0.12)',
  },
  paving: {
    fill: '#a59d93',
    pattern: getPavingPattern,
    scale: 0.012,
    tint: 'rgba(244,236,226,0.11)',
    edgeHighlight: 'rgba(255,248,240,0.30)',
    edgeLine: 'rgba(150,136,120,0.32)',
    frameShade: 'rgba(78,68,58,0.10)',
  },
  'natural-stone': {
    fill: '#9a958e',
    pattern: getNaturalStonePattern,
    scale: 0.0098,
    tint: 'rgba(238,235,230,0.05)',
    edgeHighlight: 'rgba(246,244,238,0.18)',
    edgeLine: 'rgba(112,108,101,0.28)',
    frameShade: 'rgba(58,54,49,0.12)',
  },
  clinker: {
    fill: '#966858',
    pattern: getClinkerPattern,
    scale: 0.014,
    tint: 'rgba(244,226,212,0.08)',
    edgeHighlight: 'rgba(255,238,226,0.22)',
    edgeLine: 'rgba(126,76,62,0.30)',
    frameShade: 'rgba(72,40,34,0.12)',
  },
  asphalt: {
    fill: '#4a4a4a',
    pattern: getAsphaltPattern,
    scale: 0.015,
    tint: 'rgba(255,255,255,0.04)',
    edgeHighlight: 'rgba(230,230,230,0.16)',
    edgeLine: 'rgba(190,190,190,0.18)',
    frameShade: 'rgba(0,0,0,0.16)',
  },
}

const DEFAULT_BOUNDARY_DASH: [number, number] = [0.5, 0.5]
const DEFAULT_BOUNDARY_STROKE = MARKING_RULES.lineWidths.otherRoads.schmalstrich
const BIKE_ZONE_FILL = '#b8745a'
const BIKE_ZONE_TINT = 'rgba(255,240,230,0.10)'
const BIKE_ZONE_SEPARATOR = '#e9ddd2'

export function SidewalkStrip({
  x,
  y = 0,
  width,
  length,
  variant,
  color,
  surfaceType = 'paving',
  facingSide,
  boundaryLineMode = 'none',
  boundaryLineSides = 'both',
  boundaryLineStrokeWidth,
  boundaryLineDashLength,
  boundaryLineGapLength,
  boundaryLinePhase,
}: Props) {
  const config = SURFACE_CONFIG[surfaceType]
  const pattern = config.pattern()
  const edgeWidth = Math.max(0.035, Math.min(0.08, width * 0.055))
  const edgeLineWidth = Math.max(0.012, Math.min(0.024, width * 0.018))
  const frameShadeWidth = Math.max(0.02, Math.min(0.055, width * 0.04))
  const showLeftEdge = facingSide === 'left' || facingSide === 'both'
  const showRightEdge = facingSide === 'right' || facingSide === 'both'
  const showLeftFrame = !showLeftEdge
  const showRightFrame = !showRightEdge
  const bikeZoneWidth = Math.max(width * 0.38, 0.85)
  const bikeZoneX = width - bikeZoneWidth
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
      <Rect width={width} height={length} fill={color || config.fill} />
      <Rect
        width={width}
        height={length}
        fillPatternImage={pattern as unknown as HTMLImageElement}
        fillPatternRepeat="repeat"
        fillPatternScaleX={config.scale}
        fillPatternScaleY={config.scale}
        listening={false}
      />
      <Rect width={width} height={length} fill={config.tint} listening={false} />

      {showLeftEdge && (
        <>
          <Rect x={0} width={edgeWidth} height={length} fill={config.edgeHighlight} listening={false} />
          <Line
            points={[edgeWidth, 0, edgeWidth, length]}
            stroke={config.edgeLine}
            strokeWidth={edgeLineWidth}
            listening={false}
          />
        </>
      )}
      {showRightEdge && (
        <>
          <Rect x={width - edgeWidth} width={edgeWidth} height={length} fill={config.edgeHighlight} listening={false} />
          <Line
            points={[width - edgeWidth, 0, width - edgeWidth, length]}
            stroke={config.edgeLine}
            strokeWidth={edgeLineWidth}
            listening={false}
          />
        </>
      )}
      {showLeftFrame && (
        <Rect x={0} width={frameShadeWidth} height={length} fill={config.frameShade} listening={false} />
      )}
      {showRightFrame && (
        <Rect x={width - frameShadeWidth} width={frameShadeWidth} height={length} fill={config.frameShade} listening={false} />
      )}

      {variant === 'separated-bike' && (
        <>
          <Rect x={bikeZoneX} width={bikeZoneWidth} height={length} fill={BIKE_ZONE_FILL} opacity={0.88} listening={false} />
          <Rect
            x={bikeZoneX}
            width={bikeZoneWidth}
            height={length}
            fillPatternImage={getClinkerPattern() as unknown as HTMLImageElement}
            fillPatternRepeat="repeat"
            fillPatternScaleX={0.013}
            fillPatternScaleY={0.013}
            opacity={0.52}
            listening={false}
          />
          <Rect
            x={bikeZoneX}
            width={bikeZoneWidth}
            height={length}
            fill={BIKE_ZONE_TINT}
            listening={false}
          />
          <Line
            points={[bikeZoneX, 0, bikeZoneX, length]}
            stroke={BIKE_ZONE_SEPARATOR}
            strokeWidth={Math.max(0.04, width * 0.025)}
            opacity={0.65}
            listening={false}
          />
          <Line
            points={[
              bikeZoneX + Math.max(0.03, bikeZoneWidth * 0.08),
              0,
              bikeZoneX + Math.max(0.03, bikeZoneWidth * 0.08),
              length,
            ]}
            stroke="rgba(116,78,64,0.18)"
            strokeWidth={0.018}
            listening={false}
          />
        </>
      )}

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
