import { Line } from 'react-konva'
import type { Marking } from '../../types'

interface Props {
  marking: Marking
  draggable?: boolean
  onDragEnd?: (id: string, x: number, y: number) => void
}

export function StopLine({ marking, draggable, onDragEnd }: Props) {
  const width = marking.width || 10

  return (
    <Line
      x={marking.x} y={marking.y}
      points={[0, 0, width, 0]}
      stroke={marking.color || '#ffffff'}
      strokeWidth={marking.strokeWidth || 0.40}
      lineCap="butt"
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(marking.id, e.target.x(), e.target.y())}
    />
  )
}
