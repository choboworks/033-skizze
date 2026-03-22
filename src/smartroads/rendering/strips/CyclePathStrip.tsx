import { Group, Line, Rect } from 'react-konva'
import { getAsphaltPattern } from '../../shared/patterns'
import type { StripVariant } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
}

export function CyclePathStrip({ x, y = 0, width, length, variant }: Props) {
  const edgeInset = Math.max(0.06, Math.min(width * 0.12, 0.18))
  const guideStroke = Math.max(0.03, Math.min(width * 0.045, 0.08))
  const guideLeft = edgeInset
  const guideRight = width - edgeInset
  const coreX = width * 0.18
  const coreWidth = width * 0.64
  const curbBand = Math.max(0.05, Math.min(width * 0.08, 0.12))

  const palette = (() => {
    switch (variant) {
      case 'advisory':
        return {
          tint: '#75614d',
          tintOpacity: 0.18,
          core: '#bfa78b',
          coreOpacity: 0.12,
          guideOpacity: 0.42,
          guideDash: [0.45, 0.32],
          protectedSurface: false,
        }
      case 'protected':
        return {
          tint: '#a85649',
          tintOpacity: 0.34,
          core: '#d48676',
          coreOpacity: 0.22,
          guideOpacity: 0,
          guideDash: undefined,
          protectedSurface: true,
        }
      case 'lane-marked':
      default:
        return {
          tint: '#8f6845',
          tintOpacity: 0.28,
          core: '#c99661',
          coreOpacity: 0.16,
          guideOpacity: 0.56,
          guideDash: undefined,
          protectedSurface: false,
        }
    }
  })()

  return (
    <Group x={x} y={y}>
      <Rect
        width={width}
        height={length}
        fillPatternImage={getAsphaltPattern() as unknown as HTMLImageElement}
        fillPatternScale={{ x: 0.02, y: 0.02 }}
      />
      <Rect width={width} height={length} fill={palette.tint} opacity={palette.tintOpacity} listening={false} />
      <Rect
        x={coreX}
        y={0}
        width={coreWidth}
        height={length}
        fill={palette.core}
        opacity={palette.coreOpacity}
        listening={false}
      />
      {palette.protectedSurface && (
        <>
          <Rect width={curbBand} height={length} fill="#f0e6d7" opacity={0.58} listening={false} />
          <Rect x={width - curbBand} width={curbBand} height={length} fill="#f0e6d7" opacity={0.58} listening={false} />
          <Rect x={curbBand} width={curbBand * 0.5} height={length} fill="#4e4138" opacity={0.22} listening={false} />
          <Rect x={width - curbBand * 1.5} width={curbBand * 0.5} height={length} fill="#4e4138" opacity={0.22} listening={false} />
        </>
      )}
      {palette.guideOpacity > 0 && (
        <>
          <Line
            points={[guideLeft, 0, guideLeft, length]}
            stroke="#f6f1ea"
            strokeWidth={guideStroke}
            opacity={palette.guideOpacity}
            dash={palette.guideDash}
            listening={false}
          />
          <Line
            points={[guideRight, 0, guideRight, length]}
            stroke="#f6f1ea"
            strokeWidth={guideStroke}
            opacity={palette.guideOpacity}
            dash={palette.guideDash}
            listening={false}
          />
        </>
      )}
    </Group>
  )
}
