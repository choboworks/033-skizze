import type { MarkingVariant, RoadClass } from '../types'
import { reference, type RuleSourceRef } from './shared'

export interface RoadProfileRule {
  label: string
  description: string
  centerlineVariant: MarkingVariant
  centerlineStrokeWidth: number
  laneWidth: number
  source: RuleSourceRef[]
  note?: string
}

export const ROAD_PROFILE_RULES: Record<RoadClass, RoadProfileRule> = {
  innerorts: {
    label: 'Innerorts',
    description: 'Urban street profile with city-street marking rules.',
    centerlineVariant: 'standard-dash',
    centerlineStrokeWidth: 0.12,
    laneWidth: 3.25,
    source: [
      reference('2.3 Stadtstrassen (RASt 06)', 'Einstreifige Richtungsfahrbahn'),
      reference('1.3 Laengsmarkierungen', 'Leitlinie (unterbrochen)'),
      reference('1.2 Strichbreiten'),
    ],
  },
  ausserorts: {
    label: 'Ausserorts',
    description: 'Rural road profile with land-road dash pattern defaults.',
    centerlineVariant: 'rural-dash',
    centerlineStrokeWidth: 0.12,
    laneWidth: 3.50,
    source: [
      reference('2.2 Landstrassen (RAL 2012)', 'EKL 2 / EKL 3 Fahrstreifenbreite'),
      reference('1.3 Laengsmarkierungen', 'Leitlinie (unterbrochen)'),
      reference('1.2 Strichbreiten'),
    ],
    note: 'The straight editor now adopts this lane width for profile-sensitive strips and presets.',
  },
  autobahn: {
    label: 'Autobahn',
    description: 'Motorway profile with motorway dash pattern and wider line width.',
    centerlineVariant: 'autobahn-dash',
    centerlineStrokeWidth: 0.15,
    laneWidth: 3.75,
    source: [
      reference('2.1 Autobahnen (RAA 2008)', 'RQ 31 / RQ 36 / RQ 43,5 Fahrstreifenbreite'),
      reference('1.3 Laengsmarkierungen', 'Leitlinie (unterbrochen)'),
      reference('1.2 Strichbreiten'),
    ],
    note: 'The straight editor now adopts this lane width for profile-sensitive strips and presets.',
  },
}
