import { Line } from 'react-konva'
import type { Marking } from '../../types'

interface Props {
  marking: Marking
  roadLength: number
  draggable?: boolean
  onDragEnd?: (id: string, x: number, y: number) => void
}

export function CenterLine({ marking, roadLength, draggable, onDragEnd }: Props) {
  // Dash patterns in meters
  const dashMap: Record<string, number[]> = {
    'standard-dash': [6, 6],
    'short-dash': [3, 3],
    'warning-dash': [6, 3],
  }
  const dash = dashMap[marking.variant] || [6, 6]

  return (
    <Line
      x={marking.x}
      y={marking.y}
      points={[0, 0, 0, roadLength]}
      stroke={marking.color || '#ffffff'}
      strokeWidth={marking.strokeWidth || 0.12}
      dash={dash}
      lineCap="butt"
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(marking.id, e.target.x(), e.target.y())}
    />
  )
}
