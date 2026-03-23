import { Rect } from 'react-konva'
import { getGrassPattern } from '../../shared/patterns'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  color?: string
}

export function GreenStrip({ x, y = 0, width, length, color }: Props) {
  if (color) {
    return <Rect x={x} y={y} width={width} height={length} fill={color} />
  }

  return (
    <Rect
      x={x} y={y}
      width={width} height={length}
      fillPatternImage={getGrassPattern() as unknown as HTMLImageElement}
      fillPatternScale={{ x: 0.02, y: 0.02 }}
    />
  )
}
