import { Group, Rect } from 'react-konva'
import { getAsphaltPattern, getCobblestonePattern, getConcretePattern, getPavingPattern } from '../../shared/patterns'
import type { LaneSurfaceType } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  color?: string
  surfaceType?: LaneSurfaceType
}

const SURFACE_COLORS: Record<LaneSurfaceType, string> = {
  asphalt: '#3a3a3a',
  concrete: '#8a8a88',
  cobblestone: '#2a2a2a',
  paving: '#3a3a3a',
}

const SURFACE_PATTERNS: Record<LaneSurfaceType, () => HTMLCanvasElement> = {
  asphalt: getAsphaltPattern,
  concrete: getConcretePattern,
  cobblestone: getCobblestonePattern,
  paving: getPavingPattern,
}

const SURFACE_SCALES: Record<LaneSurfaceType, number> = {
  asphalt: 0.015,
  concrete: 0.016,
  cobblestone: 0.015,
  paving: 0.015,
}

export function LaneStrip({ x, y = 0, width, length, color, surfaceType = 'asphalt' }: Props) {
  const fill = color || SURFACE_COLORS[surfaceType]
  const pattern = SURFACE_PATTERNS[surfaceType]()
  const scale = SURFACE_SCALES[surfaceType]

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
