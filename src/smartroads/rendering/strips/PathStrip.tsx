import { Group, Rect } from 'react-konva'
import { getDirtPathPattern, getGravelPathPattern, getForestPathPattern } from '../../shared/patterns'
import type { StripVariant } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
  color?: string
}

const VARIANT_COLORS: Record<string, string> = {
  dirt: '#8B7355',
  gravel: '#9a9080',
  forest: '#5a4a38',
}

const VARIANT_PATTERNS: Record<string, () => HTMLCanvasElement> = {
  dirt: getDirtPathPattern,
  gravel: getGravelPathPattern,
  forest: getForestPathPattern,
}

const VARIANT_SCALES: Record<string, number> = {
  dirt: 0.016,
  gravel: 0.014,
  forest: 0.016,
}

export function PathStrip({ x, y = 0, width, length, variant = 'dirt', color }: Props) {
  const key = variant === 'gravel' || variant === 'forest' ? variant : 'dirt'
  const fill = color || VARIANT_COLORS[key]
  const pattern = VARIANT_PATTERNS[key]()
  const scale = VARIANT_SCALES[key]

  return (
    <Group x={x} y={y}>
      <Rect width={width} height={length} fill={fill} />
      <Rect
        width={width}
        height={length}
        fillPatternImage={pattern as unknown as HTMLImageElement}
        fillPatternRepeat="repeat"
        fillPatternScaleX={scale}
        fillPatternScaleY={scale}
        listening={false}
      />
    </Group>
  )
}
