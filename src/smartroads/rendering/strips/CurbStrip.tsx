import { Rect } from 'react-konva'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  color?: string
}

export function CurbStrip({ x, y = 0, width, length, color }: Props) {
  return (
    <Rect x={x} y={y} width={width} height={length} fill={color || '#999999'} />
  )
}
