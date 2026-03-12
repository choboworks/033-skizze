// src/modules/library/roads/inspector/svg/RoadSurface.tsx
// SVG-Elemente für die Fahrbahn

import type { SmartRoadConfig } from '../../types'
import { getActiveOrder } from '../../types'
import { getSurfaceColor } from '../utils'

type Props = {
  config: SmartRoadConfig
  leftSideWidth: number
}

export function RoadSurface({ config, leftSideWidth }: Props) {
  const hasLeftSide = getActiveOrder(config.leftSide).length > 0
  const hasRightSide = getActiveOrder(config.rightSide).length > 0
  const edgeWidth = 2.5
  const roadX = leftSideWidth
  const roadRight = leftSideWidth + config.width

  return (
    <>
      {/* Fahrbahn-Basis */}
      <rect
        x={roadX}
        y="0"
        width={config.width}
        height={config.length}
        fill={getSurfaceColor(config.surface?.type || 'asphalt')}
      />
      {/* Fahrbahnrand-Linien (nur wenn keine Seitenelemente) */}
      {!hasLeftSide && (
        <rect x={roadX} y={0} width={edgeWidth} height={config.length} fill="#ffffff" />
      )}
      {!hasRightSide && (
        <rect x={roadRight - edgeWidth} y={0} width={edgeWidth} height={config.length} fill="#ffffff" />
      )}
      {/* On-Road Radwege werden in MedianAndLanes.tsx gerendert */}
    </>
  )
}
