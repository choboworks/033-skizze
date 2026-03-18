import { Rect } from 'react-konva'
import { STRIP_COLORS } from '../../constants'
import type { StripType } from '../../types'

// Fallback renderer for strip types without a dedicated component
// (median, bus, tram, shoulder, gutter)

interface Props {
  x: number
  width: number
  length: number
  type: StripType
}

export function GenericStrip({ x, width, length, type }: Props) {
  return (
    <Rect x={x} y={0} width={width} height={length} fill={STRIP_COLORS[type] || '#666'} />
  )
}
