import { Rect } from 'react-konva'

interface Props {
  x: number
  y?: number
  width: number
  length: number
}

export function CurbStrip({ x, y = 0, width, length }: Props) {
  return (
    <Rect x={x} y={y} width={width} height={length} fill="#999999" />
  )
}
