import { Rect } from 'react-konva'
import { STRIP_COLORS } from '../../constants'
import type { StripType } from '../../types'

// Fallback renderer for strip types without a dedicated component
// (median, bus, tram, shoulder, gutter)

interface Props {
  x: number
  y?: number
  width: number
  length: number
  type: StripType
  color?: string
}

export function GenericStrip({ x, y = 0, width, length, type, color }: Props) {
  return (
    <Rect x={x} y={y} width={width} height={length} fill={color || STRIP_COLORS[type] || '#666'} />
  )
}
