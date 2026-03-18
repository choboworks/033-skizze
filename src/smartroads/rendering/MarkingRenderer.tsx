import type { Marking } from '../types'
import { CenterLine } from './markings/CenterLine'
import { LaneBoundary } from './markings/LaneBoundary'
import { Crosswalk } from './markings/Crosswalk'
import { DirectionArrow } from './markings/DirectionArrow'
import { StopLine } from './markings/StopLine'

// ============================================================
// MarkingRenderer – Dispatches to the correct Konva component
// ============================================================

interface Props {
  marking: Marking
  roadLength: number
  draggable?: boolean
  onDragEnd?: (id: string, x: number, y: number) => void
}

export function MarkingRenderer({ marking, roadLength, draggable, onDragEnd }: Props) {
  switch (marking.type) {
    case 'centerline':
      return <CenterLine marking={marking} roadLength={roadLength} draggable={draggable} onDragEnd={onDragEnd} />
    case 'laneboundary':
      return <LaneBoundary marking={marking} roadLength={roadLength} draggable={draggable} onDragEnd={onDragEnd} />
    case 'crosswalk':
      return <Crosswalk marking={marking} draggable={draggable} onDragEnd={onDragEnd} />
    case 'arrow':
      return <DirectionArrow marking={marking} draggable={draggable} onDragEnd={onDragEnd} />
    case 'stopline':
      return <StopLine marking={marking} draggable={draggable} onDragEnd={onDragEnd} />
    default:
      return null
  }
}
