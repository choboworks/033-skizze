import { Rect } from 'react-konva'
import { usePavingPattern } from '../../shared/patterns'
import { STRIP_COLORS } from '../../constants'

interface Props {
  x: number
  width: number
  length: number
}

export function SidewalkStrip({ x, width, length }: Props) {
  const pattern = usePavingPattern()

  if (!pattern) {
    return <Rect x={x} y={0} width={width} height={length} fill={STRIP_COLORS.sidewalk} />
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
