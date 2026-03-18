import { Group, Rect } from 'react-konva'
import type { StripVariant } from '../../types'

interface Props {
  x: number
  width: number
  length: number
  variant?: StripVariant
}

export function CyclePathStrip({ x, width, length, variant }: Props) {
  // Advisory (Schutzstreifen) is lighter, lane-marked is medium, protected is full red
  const baseColor = variant === 'advisory' ? '#6a5a4a' : '#8b4513'
  const hasRedOverlay = variant === 'protected'

  return (
    <Group x={x} y={0}>
      <Rect width={width} height={length} fill={baseColor} />
      {hasRedOverlay && (
        <Rect width={width} height={length} fill="#cc3333" opacity={0.25} listening={false} />
      )}
      {/* Bike symbol (simple line art) */}
      <Rect
        x={width * 0.25} y={length / 2 - width * 0.25}
        width={width * 0.5} height={width * 0.5}
        fill="#ffffff" opacity={0.15} cornerRadius={width * 0.1}
        listening={false}
      />
    </Group>
  )
}
