import { Path } from 'react-konva'
import type { Marking } from '../../types'

interface Props {
  marking: Marking
  draggable?: boolean
  onDragEnd?: (id: string, x: number, y: number) => void
}

// SVG path data for arrow variants (in meter-scale, ~2m tall)
const ARROW_PATHS: Record<string, string> = {
  straight:       'M0,1 L0,-1 M-0.4,-0.5 L0,-1 L0.4,-0.5',
  left:           'M0,1 L0,0 Q0,-0.8 -0.8,-0.8 M-0.4,-0.4 L-0.8,-0.8 L-0.4,-1.2',
  right:          'M0,1 L0,0 Q0,-0.8 0.8,-0.8 M0.4,-0.4 L0.8,-0.8 L0.4,-1.2',
  'straight-left':  'M0,1 L0,-1 M-0.4,-0.5 L0,-1 L0.4,-0.5 M0,0 Q0,-0.6 -0.6,-0.6',
  'straight-right': 'M0,1 L0,-1 M-0.4,-0.5 L0,-1 L0.4,-0.5 M0,0 Q0,-0.6 0.6,-0.6',
}

export function DirectionArrow({ marking, draggable, onDragEnd }: Props) {
  const pathData = ARROW_PATHS[marking.variant] || ARROW_PATHS.straight

  return (
    <Path
      x={marking.x} y={marking.y}
      data={pathData}
      stroke="#ffffff"
      strokeWidth={0.15}
      lineCap="round"
      lineJoin="round"
      opacity={0.9}
      scaleX={1.5}
      scaleY={1.5}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(marking.id, e.target.x(), e.target.y())}
    />
  )
}
