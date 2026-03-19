import { Group, Line, Rect } from 'react-konva'
import type { Marking } from '../../types'
import { handleMarkingDragMove } from './snapHelper'

interface Props {
  marking: Marking
  roadLength: number
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

export function LaneBoundary({ marking, roadLength, draggable, selected, snapPositions, onDragEnd, onClick, onDoubleClick, onDragging }: Props) {
  const isDouble = marking.variant === 'double'
  const sw = marking.strokeWidth || 0.12
  const color = marking.color || '#ffffff'
  const hitWidth = Math.max(0.6, sw * 4)

  return (
    <Group
      x={marking.x} y={marking.y}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => {
        e.target.y(0) // solid line: always full length, no vertical drag
        handleMarkingDragMove(e, snapPositions)
      }}
      onDragEnd={(e) => { onDragging?.(false); onDragEnd?.(marking.id, e.target.x(), e.target.y()) }}
      onClick={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick?.(marking.id) }}
      onTap={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
      {selected && (
        <Rect
          x={-hitWidth / 2} y={0}
          width={hitWidth} height={roadLength}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      )}
      {isDouble ? (
        <>
          <Line points={[-0.08, 0, -0.08, roadLength]} stroke={color} strokeWidth={sw} />
          <Line points={[0.08, 0, 0.08, roadLength]} stroke={color} strokeWidth={sw} />
        </>
      ) : (
        <Line points={[0, 0, 0, roadLength]} stroke={color} strokeWidth={sw} />
      )}
      <Rect
        x={-hitWidth / 2} y={0}
        width={hitWidth} height={roadLength}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
