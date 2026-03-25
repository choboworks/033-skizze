import { Group, Path, Rect } from 'react-konva'
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

const ARROW_PATHS: Record<string, string> = {
  straight:       'M0,1 L0,-1 M-0.4,-0.5 L0,-1 L0.4,-0.5',
  left:           'M0,1 L0,0 Q0,-0.8 -0.8,-0.8 M-0.4,-0.4 L-0.8,-0.8 L-0.4,-1.2',
  right:          'M0,1 L0,0 Q0,-0.8 0.8,-0.8 M0.4,-0.4 L0.8,-0.8 L0.4,-1.2',
  'straight-left':  'M0,1 L0,-1 M-0.4,-0.5 L0,-1 L0.4,-0.5 M0,0 Q0,-0.6 -0.6,-0.6',
  'straight-right': 'M0,1 L0,-1 M-0.4,-0.5 L0,-1 L0.4,-0.5 M0,0 Q0,-0.6 0.6,-0.6',
}

export function DirectionArrow({ marking, draggable, selected, snapPositions, onDragEnd, onClick, onDoubleClick, onRightClick, onDragging }: Props) {
  const pathData = ARROW_PATHS[marking.variant] || ARROW_PATHS.straight
  const hitWidth = 2.4
  const hitHeight = hitWidth * MARKING_RULES.arrow.longitudinalStretch
  const color = marking.color || '#ffffff'
  const transverseScale = 1.15
  const longitudinalScale = transverseScale * MARKING_RULES.arrow.longitudinalStretch

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
          x={-hitWidth / 2} y={-hitHeight / 2}
          width={hitWidth} height={hitHeight}
          fill="rgba(74,158,255,0.15)"
          listening={false}
        />
      )}
      <Path
        data={pathData}
        stroke={color}
        strokeWidth={0.15}
        lineCap="round"
        lineJoin="round"
        opacity={0.9}
        scaleX={transverseScale}
        scaleY={longitudinalScale}
      />
      <Rect
        x={-hitWidth / 2} y={-hitHeight / 2}
        width={hitWidth} height={hitHeight}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
