import { Group, Line, Rect } from 'react-konva'
import { getPavingPattern } from '../../shared/patterns'
import type { StripVariant } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
}

export function SidewalkStrip({ x, y = 0, width, length, variant }: Props) {
  const edgeBand = Math.max(0.04, Math.min(width * 0.06, 0.1))
  const bikeZoneWidth = Math.max(width * 0.38, 0.85)
  const bikeZoneX = width - bikeZoneWidth

  return (
    <Group x={x} y={y}>
      <Rect
        width={width}
        height={length}
        fillPatternImage={getPavingPattern() as unknown as HTMLImageElement}
        fillPatternScale={{ x: 0.02, y: 0.02 }}
      />
      <Rect width={edgeBand} height={length} fill="#ffffff" opacity={0.14} listening={false} />
      <Rect x={width - edgeBand} width={edgeBand} height={length} fill="#5f584d" opacity={0.12} listening={false} />

      {variant === 'shared-bike' && (
        <>
          <Rect width={width} height={length} fill="#85a9b3" opacity={0.14} listening={false} />
          <Rect
            x={width * 0.18}
            y={0}
            width={width * 0.64}
            height={length}
            fill="#d9e6de"
            opacity={0.16}
            listening={false}
          />
        </>
      )}

      {variant === 'separated-bike' && (
        <>
          <Rect x={bikeZoneX} y={0} width={bikeZoneWidth} height={length} fill="#b6815a" opacity={0.18} listening={false} />
          <Line
            points={[bikeZoneX, 0, bikeZoneX, length]}
            stroke="#f1e7d8"
            strokeWidth={Math.max(0.03, width * 0.03)}
            opacity={0.72}
            listening={false}
          />
          <Rect
            x={bikeZoneX + edgeBand * 0.5}
            y={0}
            width={bikeZoneWidth - edgeBand}
            height={length}
            fill="#ffffff"
            opacity={0.05}
            listening={false}
          />
        </>
      )}
    </Group>
  )
}
