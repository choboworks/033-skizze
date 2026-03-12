// src/modules/library/roads/inspector/svg/RoadSurface.tsx
// SVG-Elemente für die Fahrbahn

import type { SmartRoadConfig } from '../../types'
import { getSurfaceColor } from '../utils'

type Props = {
  config: SmartRoadConfig
  leftSideWidth: number
}

export function RoadSurface({ config, leftSideWidth }: Props) {
  return (
    <>
      {/* Fahrbahn-Basis */}
      <rect
        x={leftSideWidth}
        y="0"
        width={config.width}
        height={config.length}
        fill={getSurfaceColor(config.surface?.type || 'asphalt')}
      />
      {/* On-Road Radwege werden in MedianAndLanes.tsx gerendert */}
    </>
  )
}
