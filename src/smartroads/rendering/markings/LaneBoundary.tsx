import { Group, Line, Rect } from 'react-konva'
import type { Marking } from '../../types'
import { handleMarkingDragMove } from './snapHelper'
import { MARKING_RULES } from '../../rules/markingRules'

interface Props {
  marking: Marking
  roadLength: number
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

export function LaneBoundary({ marking, roadLength, draggable, selected, snapPositions, onDragEnd, onClick, onDoubleClick, onRightClick, onDragging }: Props) {
  const baseY = marking.offsetY ?? marking.y
  const effectiveLength = marking.length ?? roadLength
  const isDouble = marking.variant === 'double'
  const sw = marking.strokeWidth || MARKING_RULES.lineWidths.otherRoads.schmalstrich
  const color = marking.color || '#ffffff'
  const hitWidth = Math.max(0.6, sw * 4)

  return (
    <Group
      x={marking.x} y={baseY}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => {
        e.target.y(baseY) // solid line: always full length, no vertical drag
        handleMarkingDragMove(e, snapPositions)
      }}
      onDragEnd={(e) => { onDragging?.(false); onDragEnd?.(marking.id, e.target.x(), baseY) }}
      onMouseDown={(e) => { if (e.evt.button === 2) { e.cancelBubble = true; onRightClick?.(marking.id) } }}
      onClick={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick?.(marking.id) }}
      onTap={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
      {selected && (
        <Rect
          x={-hitWidth / 2} y={0}
          width={hitWidth} height={effectiveLength}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      )}
      {isDouble ? (
        <>
          <Line points={[-0.08, 0, -0.08, effectiveLength]} stroke={color} strokeWidth={sw} />
          <Line points={[0.08, 0, 0.08, effectiveLength]} stroke={color} strokeWidth={sw} />
        </>
      ) : (
        <Line points={[0, 0, 0, effectiveLength]} stroke={color} strokeWidth={sw} />
      )}
      <Rect
        x={-hitWidth / 2} y={0}
        width={hitWidth} height={effectiveLength}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
