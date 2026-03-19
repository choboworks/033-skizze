import { Rect } from 'react-konva'
import { getPavingPattern } from '../../shared/patterns'

interface Props {
  x: number
  width: number
  length: number
}

export function SidewalkStrip({ x, width, length }: Props) {
  return (
    <Rect
      x={x} y={0}
      width={width} height={length}
      fillPatternImage={getPavingPattern() as unknown as HTMLImageElement}
      fillPatternScale={{ x: 0.02, y: 0.02 }}
    />
  )
}
