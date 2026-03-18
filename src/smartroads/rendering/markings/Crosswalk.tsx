import { Group, Rect } from 'react-konva'
import type { Marking } from '../../types'

interface Props {
  marking: Marking
  draggable?: boolean
  onDragEnd?: (id: string, x: number, y: number) => void
}

export function Crosswalk({ marking, draggable, onDragEnd }: Props) {
  const width = marking.width || 10
  const depth = 4.0          // Meter crossing depth
  const stripeW = 0.50       // Meter
  const gap = 0.50           // Meter

  const stripes: React.ReactNode[] = []
  for (let sx = 0; sx < width; sx += stripeW + gap) {
    stripes.push(
      <Rect key={sx} x={sx} y={0} width={stripeW} height={depth} fill="#ffffff" />
    )
  }

  return (
    <Group
      x={marking.x} y={marking.y}
      rotation={marking.rotation || 0}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(marking.id, e.target.x(), e.target.y())}
    >
      {stripes}
    </Group>
  )
}
