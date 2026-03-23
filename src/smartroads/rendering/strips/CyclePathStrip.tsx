import { Group, Line, Rect } from 'react-konva'
import { STRIP_COLORS } from '../../constants'
import { getCyclepathRenderMetrics } from '../../layout'
import {
  isTwoWayCyclepath,
  resolveCyclepathBoundaryDashPattern,
  resolveCyclepathBoundaryLineMode,
  resolveCyclepathBoundaryStrokeWidth,
  resolveCyclepathCenterDashPattern,
  resolveCyclepathCenterLineMode,
  resolveCyclepathCenterStrokeWidth,
} from '../../stripProps'
import type { CyclepathLineMode, CyclepathPathType, CyclepathSide, Strip, StripVariant } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
  color?: string
  overlaySide?: CyclepathSide
  safetyBufferWidth?: number
  pathType?: CyclepathPathType
  centerLineMode?: CyclepathLineMode
  boundaryLineMode?: CyclepathLineMode
  centerLineStrokeWidth?: number
  boundaryLineStrokeWidth?: number
  centerLineDashLength?: number
  centerLineGapLength?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
  centerLinePhase?: number
  boundaryLinePhase?: number
}

export function CyclePathStrip({
  x,
  y = 0,
  width,
  length,
  variant,
  color,
  overlaySide = 'right',
  safetyBufferWidth = 0,
  pathType = 'one-way',
  centerLineMode,
  boundaryLineMode,
  centerLineStrokeWidth,
  boundaryLineStrokeWidth,
  centerLineDashLength,
  centerLineGapLength,
  boundaryLineDashLength,
  boundaryLineGapLength,
  centerLinePhase,
  boundaryLinePhase,
}: Props) {
  const isProtected = variant === 'protected'
  const boundaryMode = resolveCyclepathBoundaryLineMode(variant, boundaryLineMode)
  const middleMode = resolveCyclepathCenterLineMode(variant, centerLineMode, pathType)
  const showMiddleLine = isProtected && middleMode !== 'none'
  const showBoundaryLines = boundaryMode !== 'none'

  const baseFill = color || (isProtected ? STRIP_COLORS.cyclepath : STRIP_COLORS.lane)
  const white = '#ffffff'
  const previewStrip: Strip = {
    id: 'cyclepath-preview',
    type: 'cyclepath',
    variant: variant ?? 'protected',
    width,
  }
  const metrics = getCyclepathRenderMetrics({
    strip: previewStrip,
    renderWidth: width,
    overlaySide,
    safetyBufferWidth,
  })
  const boundaryStroke = resolveCyclepathBoundaryStrokeWidth(variant, boundaryLineStrokeWidth)
  const boundaryDash = boundaryMode === 'dashed'
    ? resolveCyclepathBoundaryDashPattern(variant, boundaryLineDashLength, boundaryLineGapLength)
    : undefined
  const middleStroke = resolveCyclepathCenterStrokeWidth(centerLineStrokeWidth)
  const middleDash = middleMode === 'dashed'
    ? resolveCyclepathCenterDashPattern(centerLineDashLength, centerLineGapLength)
    : undefined
  const resolveDashOffset = (phase: number | undefined, dash: [number, number] | undefined) => {
    if (!dash) return undefined
    const cycle = dash[0] + dash[1]
    if (cycle <= 0) return undefined
    return (((phase ?? 0) % cycle) + cycle) % cycle
  }
  const boundaryDashOffset = resolveDashOffset(boundaryLinePhase, boundaryDash)
  const middleDashOffset = resolveDashOffset(centerLinePhase, middleDash)
  const hatchSpacing = 1
  const hatchCount = Math.ceil(length / hatchSpacing) + 2

  return (
    <Group x={x} y={y}>
      <Rect x={metrics.paintedX} width={metrics.paintedWidth} height={length} fill={baseFill} />

      {!isProtected && metrics.safetyBufferWidth > 0 && (
        <>
          <Rect
            x={metrics.safetyBufferX}
            width={metrics.safetyBufferWidth}
            height={length}
            fill="rgba(255,255,255,0.07)"
          />
          {Array.from({ length: hatchCount }, (_, index) => {
            const yStart = index * hatchSpacing - 0.4
            return (
              <Line
                key={`buffer-hatch-${index}`}
                points={[
                  metrics.safetyBufferX,
                  yStart + 0.55,
                  metrics.safetyBufferX + metrics.safetyBufferWidth,
                  yStart - 0.15,
                ]}
                stroke="rgba(255,255,255,0.24)"
                strokeWidth={0.06}
                listening={false}
              />
            )
          })}
        </>
      )}

      {showBoundaryLines && (
        <>
          <Line
            points={[metrics.laneBoundaryX, 0, metrics.laneBoundaryX, length]}
            stroke={white}
            strokeWidth={boundaryStroke}
            dash={boundaryDash}
            dashOffset={boundaryDashOffset}
            lineCap="butt"
            listening={false}
          />
          {isProtected && (
            <Line
              points={[metrics.rightBoundaryX ?? width, 0, metrics.rightBoundaryX ?? width, length]}
              stroke={white}
              strokeWidth={boundaryStroke}
              dash={boundaryDash}
              dashOffset={boundaryDashOffset}
              lineCap="butt"
              listening={false}
            />
          )}
        </>
      )}

      {showMiddleLine && (
        <Line
          points={[metrics.centerLineX ?? width / 2, 0, metrics.centerLineX ?? width / 2, length]}
          stroke={white}
          strokeWidth={middleStroke}
          dash={middleDash}
          dashOffset={middleDashOffset}
          lineCap="butt"
          opacity={isTwoWayCyclepath(pathType) ? 0.92 : 0.82}
          listening={false}
        />
      )}
    </Group>
  )
}
