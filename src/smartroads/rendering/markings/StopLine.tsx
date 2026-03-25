import { Group, Line, Rect } from 'react-konva'
import type { Marking } from '../../types'
import { handleMarkingDragMove } from './snapHelper'
import { MARKING_RULES } from '../../rules/markingRules'

interface Props {
  marking: Marking
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

export function StopLine({ marking, draggable, selected, snapPositions, onDragEnd, onClick, onDoubleClick, onRightClick, onDragging }: Props) {
  const width = marking.width || 10
  const sw = marking.strokeWidth || MARKING_RULES.stopline.strokeWidth
  const hitHeight = Math.max(0.8, sw * 2)

  return (
    <Group
      x={marking.x} y={marking.y}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => handleMarkingDragMove(e, snapPositions)}
      onDragEnd={(e) => { onDragging?.(false); onDragEnd?.(marking.id, e.target.x(), e.target.y()) }}
      onMouseDown={(e) => { if (e.evt.button === 2) { e.cancelBubble = true; onRightClick?.(marking.id) } }}
      onClick={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick?.(marking.id) }}
      onTap={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
      {selected && (
        <Rect
          x={0} y={-hitHeight / 2}
          width={width} height={hitHeight}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      )}
      <Line
        points={[0, 0, width, 0]}
        stroke={marking.color || '#ffffff'}
        strokeWidth={sw}
        lineCap="butt"
      />
      <Rect
        x={0} y={-hitHeight / 2}
        width={width} height={hitHeight}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
