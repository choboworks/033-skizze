import { Group, Line, Rect } from 'react-konva'
import { getConcretePattern } from '../../shared/patterns'
import { DEFAULT_CURB_LOWERED_SECTION_LENGTH } from '../../stripProps'
import type { CurbKind } from '../../types'
import type { FacingSide } from '../../layout'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  color?: string
  facingSide?: FacingSide
  kind?: CurbKind
  loweredSectionLength?: number
  loweredSectionOffset?: number
}

export function CurbStrip({
  x,
  y = 0,
  width,
  length,
  color,
  facingSide: rawFacingSide = 'right',
  kind = 'standard',
  loweredSectionLength = DEFAULT_CURB_LOWERED_SECTION_LENGTH,
  loweredSectionOffset = 0,
}: Props) {
  // 'both' means the curb sits between two roadways — treat as 'right' for rendering
  const facingSide: 'left' | 'right' = rawFacingSide === 'left' ? 'left' : 'right'
  const safeWidth = Math.max(0.08, width)
  const safeLength = Math.max(0.5, length)
  const bevelWidth = Math.max(0.02, Math.min(0.04, safeWidth * 0.26))
  const topBandWidth = Math.max(0.015, Math.min(0.028, safeWidth * 0.14))
  const crownBandWidth = Math.max(0.016, Math.min(0.034, safeWidth * 0.18))
  const seamSpacing = 1.25
  const seamCount = Math.max(0, Math.floor(safeLength / seamSpacing))
  const highlightX = facingSide === 'left' ? safeWidth - topBandWidth : 0
  const bevelX = facingSide === 'left' ? 0 : safeWidth - bevelWidth
  const bevelLineX = facingSide === 'left' ? bevelWidth : safeWidth - bevelWidth
  const crownX = facingSide === 'left'
    ? bevelWidth
    : topBandWidth
  const isFullLowered = kind === 'lowered'
  const isDriveway = kind === 'driveway'
  const loweredLength = isFullLowered
    ? safeLength
    : isDriveway
      ? Math.max(0.5, Math.min(loweredSectionLength, safeLength))
      : 0
  const loweredOffset = isFullLowered
    ? 0
    : isDriveway
      ? Math.max(0, Math.min(loweredSectionOffset, safeLength - loweredLength))
      : 0
  const loweredEnd = loweredOffset + loweredLength
  const rampBandWidth = Math.max(0.03, Math.min(safeWidth * 0.56, safeWidth - topBandWidth - 0.012))
  const rampBandX = facingSide === 'left' ? safeWidth - rampBandWidth : 0
  const rampBoundaryX = facingSide === 'left' ? safeWidth - rampBandWidth : rampBandWidth
  const loweredBodyInset = Math.max(0.01, safeWidth * 0.08)
  const loweredBodyX = loweredBodyInset
  const loweredBodyWidth = Math.max(0.02, safeWidth - loweredBodyInset * 2)
  const transitionLength = isDriveway
    ? Math.max(0.14, Math.min(0.3, loweredLength * 0.18))
    : 0
  const transitionClamped = Math.min(transitionLength, loweredLength / 3)
  const loweredBodyY = loweredOffset + transitionClamped
  const loweredBodyHeight = Math.max(0, loweredLength - transitionClamped * 2)
  const seamInsetStart = facingSide === 'left' ? bevelWidth * 0.45 : 0.02
  const seamInsetEnd = facingSide === 'left' ? safeWidth - 0.02 : safeWidth - bevelWidth * 0.45

  if (color) {
    return (
      <Group x={x} y={y}>
        <Rect width={safeWidth} height={safeLength} fill={color} />
        <Rect x={highlightX} width={topBandWidth} height={safeLength} fill="rgba(255,255,255,0.22)" />
        <Rect x={bevelX} width={bevelWidth} height={safeLength} fill="rgba(0,0,0,0.16)" />
      </Group>
    )
  }

  return (
    <Group x={x} y={y}>
      <Rect
        width={safeWidth}
        height={safeLength}
        fillPatternImage={getConcretePattern() as unknown as HTMLImageElement}
        fillPatternScale={{ x: 0.018, y: 0.018 }}
      />

      <Rect
        width={safeWidth}
        height={safeLength}
        fill="rgba(237,232,224,0.18)"
        listening={false}
      />

      <Rect
        x={highlightX}
        width={topBandWidth}
        height={safeLength}
        fill="rgba(255,255,255,0.34)"
        listening={false}
      />

      <Rect
        x={crownX}
        width={crownBandWidth}
        height={safeLength}
        fill="rgba(243,238,231,0.34)"
        listening={false}
      />

      <Rect
        x={bevelX}
        width={bevelWidth}
        height={safeLength}
        fill="rgba(100,88,76,0.24)"
        listening={false}
      />

      <Line
        points={[bevelLineX, 0, bevelLineX, safeLength]}
        stroke="rgba(88,78,68,0.28)"
        strokeWidth={0.018}
        listening={false}
      />

      <Line
        points={[0, 0, safeWidth, 0]}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={0.016}
        listening={false}
      />

      {kind !== 'standard' && (
        <>
          <Rect
            y={loweredOffset}
            width={safeWidth}
            height={loweredLength}
            fill="rgba(249,246,240,0.38)"
            listening={false}
          />

          <Rect
            x={rampBandX}
            y={loweredOffset}
            width={rampBandWidth}
            height={loweredLength}
            fill={facingSide === 'left' ? 'rgba(255,255,255,0.28)' : 'rgba(231,225,216,0.48)'}
            listening={false}
          />

          {loweredBodyHeight > 0 && (
            <Rect
              x={loweredBodyX}
              y={loweredBodyY}
              width={loweredBodyWidth}
              height={loweredBodyHeight}
              fill="rgba(255,255,255,0.18)"
              listening={false}
            />
          )}

          {isDriveway && (
            <>
              <Line
                points={facingSide === 'left'
                  ? [safeWidth - 0.015, loweredOffset, 0.015, loweredOffset + transitionClamped]
                  : [0.015, loweredOffset + transitionClamped, safeWidth - 0.015, loweredOffset]}
                stroke="rgba(255,255,255,0.42)"
                strokeWidth={0.018}
                listening={false}
              />

              <Line
                points={facingSide === 'left'
                  ? [0.015, loweredEnd - transitionClamped, safeWidth - 0.015, loweredEnd]
                  : [0.015, loweredEnd, safeWidth - 0.015, loweredEnd - transitionClamped]}
                stroke="rgba(115,103,90,0.28)"
                strokeWidth={0.018}
                listening={false}
              />
            </>
          )}

          <Line
            points={[rampBoundaryX, loweredOffset, rampBoundaryX, loweredEnd]}
            stroke="rgba(132,120,107,0.2)"
            strokeWidth={0.012}
            listening={false}
          />
        </>
      )}

      {Array.from({ length: seamCount }, (_, index) => {
        const seamY = (index + 1) * seamSpacing
        const loweredSeam = kind !== 'standard' && seamY > loweredOffset + 0.06 && seamY < loweredEnd - 0.06
        return (
          <Line
            key={`curb-seam-${index}`}
            points={[seamInsetStart, seamY, seamInsetEnd, seamY]}
            stroke={loweredSeam ? 'rgba(136,126,116,0.12)' : 'rgba(98,88,78,0.22)'}
            strokeWidth={0.02}
            listening={false}
          />
        )
      })}
    </Group>
  )
}
