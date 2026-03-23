import { Group, Line, Rect } from 'react-konva'
import { STRIP_COLORS } from '../../constants'
import {
  isTwoWayCyclepath,
  resolveCyclepathBoundaryDashPattern,
  resolveCyclepathBoundaryLineMode,
  resolveCyclepathBoundaryStrokeWidth,
  resolveCyclepathCenterDashPattern,
  resolveCyclepathCenterLineMode,
  resolveCyclepathCenterStrokeWidth,
} from '../../stripProps'
import type { CyclepathLineMode, CyclepathPathType, StripVariant } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
  color?: string
  pathType?: CyclepathPathType
  centerLineMode?: CyclepathLineMode
  boundaryLineMode?: CyclepathLineMode
  centerLineStrokeWidth?: number
  boundaryLineStrokeWidth?: number
  centerLineDashLength?: number
  centerLineGapLength?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
}

export function CyclePathStrip({
  x,
  y = 0,
  width,
  length,
  variant,
  color,
  pathType = 'one-way',
  centerLineMode,
  boundaryLineMode,
  centerLineStrokeWidth,
  boundaryLineStrokeWidth,
  centerLineDashLength,
  centerLineGapLength,
  boundaryLineDashLength,
  boundaryLineGapLength,
}: Props) {
  const isProtected = variant === 'protected'
  const boundaryMode = resolveCyclepathBoundaryLineMode(variant, boundaryLineMode)
  const middleMode = resolveCyclepathCenterLineMode(variant, centerLineMode, pathType)
  const showMiddleLine = isProtected && middleMode !== 'none'
  const showBoundaryLines = boundaryMode !== 'none'

  const baseFill = color || (isProtected ? STRIP_COLORS.cyclepath : STRIP_COLORS.lane)
  const white = '#ffffff'
  const boundaryStroke = resolveCyclepathBoundaryStrokeWidth(variant, boundaryLineStrokeWidth)
  const boundaryDash = boundaryMode === 'dashed'
    ? resolveCyclepathBoundaryDashPattern(variant, boundaryLineDashLength, boundaryLineGapLength)
    : undefined
  const middleStroke = resolveCyclepathCenterStrokeWidth(centerLineStrokeWidth)
  const middleDash = middleMode === 'dashed'
    ? resolveCyclepathCenterDashPattern(centerLineDashLength, centerLineGapLength)
    : undefined
  const leftBoundaryX = 0
  const rightBoundaryX = width

  return (
    <Group x={x} y={y}>
      <Rect width={width} height={length} fill={baseFill} />

      {showBoundaryLines && (
        <>
          <Line
            points={[leftBoundaryX, 0, leftBoundaryX, length]}
            stroke={white}
            strokeWidth={boundaryStroke}
            dash={boundaryDash}
            lineCap="butt"
            listening={false}
          />
          {isProtected && (
            <Line
              points={[rightBoundaryX, 0, rightBoundaryX, length]}
              stroke={white}
              strokeWidth={boundaryStroke}
              dash={boundaryDash}
              lineCap="butt"
              listening={false}
            />
          )}
        </>
      )}

      {showMiddleLine && (
        <Line
          points={[width / 2, 0, width / 2, length]}
          stroke={white}
          strokeWidth={middleStroke}
          dash={middleDash}
          lineCap="butt"
          opacity={isTwoWayCyclepath(pathType) ? 0.92 : 0.82}
          listening={false}
        />
      )}
    </Group>
  )
}
