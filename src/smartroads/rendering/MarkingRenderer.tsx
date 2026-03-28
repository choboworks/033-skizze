import type { Marking } from '../types'
import { CenterLine } from './markings/CenterLine'
import { LaneBoundary } from './markings/LaneBoundary'
import { Crosswalk } from './markings/Crosswalk'
import { BikeCrossing } from './markings/BikeCrossing'
import { DirectionArrow } from './markings/DirectionArrow'
import { StopLine } from './markings/StopLine'
import { TrafficIsland } from './markings/TrafficIsland'
import type { RoadwayBounds } from '../layout'

// ============================================================
// MarkingRenderer – Dispatches to the correct Konva component
// ============================================================

export interface MarkingCommonProps {
  marking: Marking
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  peerPhases?: number[]
  roadwayBounds?: RoadwayBounds
  roadClass?: string
  linkedIsland?: Marking
  linkedCrossing?: Marking
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

interface Props extends MarkingCommonProps {
  roadLength: number
}

export function MarkingRenderer({ roadLength, ...common }: Props) {
  switch (common.marking.type) {
    case 'centerline':
      return <CenterLine {...common} roadLength={roadLength} />
    case 'laneboundary':
      return <LaneBoundary {...common} roadLength={roadLength} />
    case 'crosswalk':
      return <Crosswalk {...common} />
    case 'bike-crossing':
      return <BikeCrossing {...common} />
    case 'arrow':
      return <DirectionArrow {...common} />
    case 'stopline':
      return <StopLine {...common} />
    case 'traffic-island':
      return <TrafficIsland {...common} roadLength={roadLength} />
    default:
      return null
  }
}
