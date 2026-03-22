import { useRef, useEffect } from 'react'
import { Group, Line, Rect } from 'react-konva'
import type { Marking } from '../../types'
import type Konva from 'konva'
import { handleMarkingDragMove } from './snapHelper'
import { getCenterlineDashPattern, MARKING_RULES } from '../../rules/markingRules'

interface Props {
  marking: Marking
  roadLength: number
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  peerPhases?: number[]
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

export function CenterLine({ marking, roadLength, draggable, selected, snapPositions, peerPhases, onDragEnd, onClick, onDoubleClick, onDragging }: Props) {
  const offsetY = marking.offsetY ?? 0
  const effectiveLength = marking.length ?? roadLength
  const dash = getCenterlineDashPattern(marking.variant)
  const sw = marking.strokeWidth || MARKING_RULES.lineWidths.otherRoads.schmalstrich
  const [d, g] = dash
  const cycle = d + g

  const lineRef = useRef<Konva.Line>(null)

  // Phase: marking.y controls where in the cycle the dashes start.
  // We use a ref for the live phase during drag to update Konva directly
  // (avoids React re-render lag for smooth 60fps feedback).
  const phaseRef = useRef(marking.y)

  // Sync ref when marking.y changes (e.g., variant switch, preset load)
  useEffect(() => { phaseRef.current = marking.y }, [marking.y])

  // Calculate dashOffset from phase, centered on road.
  // Places the dash(es) in the visual CENTER of the road,
  // not at the edges. Works for all road lengths and patterns.
  const computeOffset = (phase: number) => {
    const r = effectiveLength % cycle
    // r <= d: remainder is partial dash → center the full dashes in the middle
    // r > d:  remainder includes full dash + partial gap → center the gap splits
    const centerShift = r <= d
      ? d + (g - r) / 2
      : cycle - (r - d) / 2
    const wrapped = (((phase + centerShift) % cycle) + cycle) % cycle
    return wrapped
  }

  // Initial dashOffset (centering + stored phase)
  const initialOffset = computeOffset(marking.y)

  const hitWidth = Math.max(0.6, sw * 4)

  return (
    <Group
      x={marking.x}
      y={offsetY}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => {
        const node = e.target
        // Capture y drag as phase shift, reset y to keep line in place
        const dragY = node.y() - offsetY
        node.y(offsetY)

        // Update phase: subtract dragY so dragging UP increases phase (dashes move up)
        let newPhase = marking.y - dragY

        // Snap to peer centerline phases (align dashes vertically)
        if (peerPhases?.length) {
          const PHASE_SNAP = 0.4 // meters threshold
          const currentWrapped = ((newPhase % cycle) + cycle) % cycle
          for (const peer of peerPhases) {
            const peerWrapped = ((peer % cycle) + cycle) % cycle
            const diff = Math.abs(currentWrapped - peerWrapped)
            // Check both direct distance and wrap-around distance
            if (diff < PHASE_SNAP || (cycle - diff) < PHASE_SNAP) {
              newPhase = peer
              break
            }
          }
        }

        phaseRef.current = newPhase

        // Directly update Konva Line dashOffset for instant feedback (no React re-render needed)
        const line = lineRef.current
        if (line) {
          line.dashOffset(computeOffset(phaseRef.current))
          line.getLayer()?.batchDraw()
        }

        // Snap x to strip edges
        handleMarkingDragMove(e, snapPositions)
      }}
      onDragEnd={(e) => {
        onDragging?.(false)
        onDragEnd?.(marking.id, e.target.x(), phaseRef.current)
      }}
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
      {/* Dashed line — always full road, y-drag shifts the dash phase */}
      <Line
        ref={lineRef}
        points={[0, 0, 0, effectiveLength]}
        stroke={marking.color || '#ffffff'}
        strokeWidth={sw}
        dash={dash}
        dashOffset={initialOffset}
        lineCap="butt"
      />
      <Rect
        x={-hitWidth / 2} y={0}
        width={hitWidth} height={effectiveLength}
        fill="rgba(0,0,0,0.001)"
        cursor="pointer"
      />
    </Group>
  )
}
