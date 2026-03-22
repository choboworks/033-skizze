import type { MarkingVariant } from '../types'
import { reference, type RuleSourceRef } from './shared'

export interface CenterlineVariantRule {
  dashPattern: [number, number]
  source: RuleSourceRef[]
}

export const CENTERLINE_VARIANT_RULES: Partial<Record<MarkingVariant, CenterlineVariantRule>> = {
  'standard-dash': {
    dashPattern: [3, 6],
    source: [reference('1.3 Laengsmarkierungen', 'Leitlinie innerorts: 3 m Strich / 6 m Luecke')],
  },
  'rural-dash': {
    dashPattern: [6, 12],
    source: [reference('1.3 Laengsmarkierungen', 'Leitlinie ausserorts: 6 m Strich / 12 m Luecke')],
  },
  'autobahn-dash': {
    dashPattern: [6, 12],
    source: [reference('1.3 Laengsmarkierungen', 'Leitlinie Autobahn: 6 m Strich / 12 m Luecke')],
  },
  'short-dash': {
    dashPattern: [1.5, 3],
    source: [reference('1.3 Laengsmarkierungen', 'Ableitung aus dem 1:2 Leitlinienverhaeltnis')],
  },
  'warning-dash': {
    dashPattern: [6, 3],
    source: [reference('1.3 Laengsmarkierungen', 'Warnlinie innerorts: 6 m Strich / 3 m Luecke')],
  },
  'autobahn-warning': {
    dashPattern: [12, 6],
    source: [reference('1.3 Laengsmarkierungen', 'Warnlinie Autobahn: 12 m Strich / 6 m Luecke')],
  },
}

export const MARKING_RULES = {
  lineWidths: {
    otherRoads: {
      schmalstrich: 0.12,
      breitstrich: 0.25,
      source: [reference('1.2 Strichbreiten', 'Andere Strassen')],
    },
    autobahn: {
      schmalstrich: 0.15,
      breitstrich: 0.30,
      source: [reference('1.2 Strichbreiten', 'Autobahn')],
    },
  },
  stopline: {
    strokeWidth: 0.50,
    source: [reference('1.4 Quermarkierungen', 'Haltlinie (Zeichen 294)')],
  },
  waitLine: {
    strokeWidth: 0.50,
    segmentLength: 0.50,
    gap: 0.25,
    source: [reference('1.4 Quermarkierungen', 'Wartelinie (Zeichen 341)')],
  },
  crosswalk: {
    stripeWidth: 0.50,
    gap: 0.50,
    minLength: 3.00,
    defaultLength: 4.00,
    source: [reference('1.4 Quermarkierungen', 'Fussgaengerueberweg / Zebrastreifen (Zeichen 293)')],
    note: 'defaultLength keeps the current editor default above the normative minimum length.',
  },
  parkingMarking: {
    strokeWidth: 0.12,
    source: [reference('1.5 Flaechenmarkierungen', 'Parkflaechenmarkierung')],
  },
  arrow: {
    longitudinalStretch: 3,
    source: [reference('1.6 Sonderzeichen auf der Fahrbahn')],
  },
} as const

export function getCenterlineDashPattern(variant: MarkingVariant): [number, number] {
  return CENTERLINE_VARIANT_RULES[variant]?.dashPattern ?? CENTERLINE_VARIANT_RULES['standard-dash']!.dashPattern
}
