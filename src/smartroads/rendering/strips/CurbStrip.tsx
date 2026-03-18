import { Rect } from 'react-konva'

interface Props {
  x: number
  width: number
  length: number
}

export function CurbStrip({ x, width, length }: Props) {
  return (
    <Rect x={x} y={0} width={width} height={length} fill="#999999" />
  )
}
