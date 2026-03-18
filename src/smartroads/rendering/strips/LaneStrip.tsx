import { Rect } from 'react-konva'

interface Props {
  x: number
  width: number
  length: number
  direction?: 'up' | 'down'
}

export function LaneStrip({ x, width, length }: Props) {
  return (
    <Rect x={x} y={0} width={width} height={length} fill="#3a3a3a" />
  )
}
