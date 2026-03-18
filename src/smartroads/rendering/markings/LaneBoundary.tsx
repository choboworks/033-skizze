import { Group, Line } from 'react-konva'
import type { Marking } from '../../types'

interface Props {
  marking: Marking
  roadLength: number
  draggable?: boolean
  onDragEnd?: (id: string, x: number, y: number) => void
}

export function LaneBoundary({ marking, roadLength, draggable, onDragEnd }: Props) {
  const isDouble = marking.variant === 'double'
  const sw = marking.strokeWidth || 0.12
  const color = marking.color || '#ffffff'

  if (isDouble) {
    return (
      <Group
        x={marking.x} y={marking.y}
        draggable={draggable}
        onDragEnd={(e) => onDragEnd?.(marking.id, e.target.x(), e.target.y())}
      >
        <Line points={[-0.08, 0, -0.08, roadLength]} stroke={color} strokeWidth={sw} />
        <Line points={[0.08, 0, 0.08, roadLength]} stroke={color} strokeWidth={sw} />
      </Group>
    )
  }

  return (
    <Line
      x={marking.x} y={marking.y}
      points={[0, 0, 0, roadLength]}
      stroke={color}
      strokeWidth={sw}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(marking.id, e.target.x(), e.target.y())}
    />
  )
}
