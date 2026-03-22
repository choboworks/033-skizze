import { Group, Rect } from 'react-konva'
import type { Marking } from '../../types'
import { handleMarkingDragMove } from './snapHelper'

interface Props {
  marking: Marking
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

export function Crosswalk({ marking, draggable, selected, snapPositions, onDragEnd, onClick, onDoubleClick, onDragging }: Props) {
  const width = marking.width || 10
  const depth = 4.0
  const stripeW = 0.50
  const gap = 0.50

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
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => handleMarkingDragMove(e, snapPositions)}
      onDragEnd={(e) => { onDragging?.(false); onDragEnd?.(marking.id, e.target.x(), e.target.y()) }}
      onClick={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick?.(marking.id) }}
      onTap={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
      {selected && (
        <Rect
          x={0} y={0}
          width={width} height={depth}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      )}
      {stripes}
      <Rect
        x={0} y={0}
        width={width} height={depth}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
