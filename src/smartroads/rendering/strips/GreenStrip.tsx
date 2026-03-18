import { Rect } from 'react-konva'
import { useGrassPattern } from '../../shared/patterns'
import { STRIP_COLORS } from '../../constants'

interface Props {
  x: number
  width: number
  length: number
}

export function GreenStrip({ x, width, length }: Props) {
  const pattern = useGrassPattern()

  if (!pattern) {
    return <Rect x={x} y={0} width={width} height={length} fill={STRIP_COLORS.green} />
  }

  return (
    <Rect
      x={x} y={0}
      width={width} height={length}
      fillPatternImage={pattern}
      fillPatternScale={{ x: 0.02, y: 0.02 }}
    />
  )
}
