import type { RoadClass, Strip, StripType, StripVariant } from '../types'
import { editorDefault, reference, type RuleSourceRef } from './shared'

export interface StripDimensionRule {
  defaultWidth: number
  editorMinWidth: number
  source: RuleSourceRef[]
  note?: string
}

export interface StripVariantDimensionRule {
  width: number
  source: RuleSourceRef[]
  note?: string
}

export interface RoadClassStripDimensionRule {
  width: number
  source: RuleSourceRef[]
  note?: string
}

export const STRIP_BASE_RULES: Record<StripType, StripDimensionRule> = {
  lane: {
    defaultWidth: 3.25,
    editorMinWidth: 2.75,
    source: [
      reference('2.3 Stadtstrassen (RASt 06)', 'Einstreifige Richtungsfahrbahn'),
    ],
    note: 'Current editor default maps to the innerorts one-way lane width. Profile-specific lane widths are stored separately.',
  },
  sidewalk: {
    defaultWidth: 2.50,
    editorMinWidth: 1.50,
    source: [
      reference('2.5 Gehwege und Fussverkehr (RASt 06 / EFA 2002)', 'Gehweg (Regelfall)'),
    ],
    note: 'The editor minimum is a guardrail, not a full accessibility validation.',
  },
  cyclepath: {
    defaultWidth: 1.85,
    editorMinWidth: 1.00,
    source: [
      reference('2.4 Radverkehrsanlagen (ERA 2010 / E Klima 2022)', 'Radfahrstreifen'),
    ],
    note: 'Base default maps to the marked cycle-lane case. Other variants should override this width.',
  },
  parking: {
    defaultWidth: 2.00,
    editorMinWidth: 1.80,
    source: [
      reference('2.6 Parkstaende (RASt 06)', 'Laengsparken'),
    ],
    note: 'The base width models longitudinal parking. Angle-based parking uses variant overrides.',
  },
  green: {
    defaultWidth: 2.00,
    editorMinWidth: 0.50,
    source: [
      editorDefault('Current green-strip width is a project default and is not yet backed by a dedicated value in the root rulebook extract.'),
    ],
  },
  curb: {
    defaultWidth: 0.15,
    editorMinWidth: 0.15,
    source: [
      reference('6.2 Bordsteinarten im Ueberblick', 'Hochbord (HB) Breite 15-18 cm'),
    ],
  },
  gutter: {
    defaultWidth: 0.30,
    editorMinWidth: 0.20,
    source: [
      editorDefault('Current gutter width is an editor default; the root rulebook extract does not yet define a dedicated standard value.'),
    ],
  },
  median: {
    defaultWidth: 0.15,
    editorMinWidth: 0.10,
    source: [
      editorDefault('The marking-only median width is an editor default until median subtypes are modelled more explicitly.'),
    ],
  },
  bus: {
    defaultWidth: 3.50,
    editorMinWidth: 3.00,
    source: [
      editorDefault('Bus-lane width is currently kept as an editor default; the root rulebook extract does not list a dedicated normative bus-lane width.'),
    ],
  },
  tram: {
    defaultWidth: 3.00,
    editorMinWidth: 2.50,
    source: [
      editorDefault('Tram-way width is currently kept as an editor default; the root rulebook extract does not list tram cross-section values.'),
    ],
  },
  shoulder: {
    defaultWidth: 1.50,
    editorMinWidth: 0.50,
    source: [
      reference('2.2 Landstrassen (RAL 2012)', 'Bankett'),
    ],
    note: 'This base default matches the rural shoulder/bankett case. Autobahn shoulders require profile-specific overrides later.',
  },
}

export const STRIP_VARIANT_RULES: Partial<Record<StripVariant, StripVariantDimensionRule>> = {
  'lane-marked': {
    width: 1.85,
    source: [
      reference('2.4 Radverkehrsanlagen (ERA 2010 / E Klima 2022)', 'Radfahrstreifen'),
    ],
  },
  advisory: {
    width: 1.50,
    source: [
      reference('2.4 Radverkehrsanlagen (ERA 2010 / E Klima 2022)', 'Schutzstreifen'),
    ],
  },
  protected: {
    width: 2.00,
    source: [
      reference('2.4 Radverkehrsanlagen (ERA 2010 / E Klima 2022)', 'Baulicher Radweg (Einrichtung, innerorts)'),
    ],
  },
  'shared-bike': {
    width: 2.50,
    source: [
      reference('2.4 Radverkehrsanlagen (ERA 2010 / E Klima 2022)', 'Gemeins. Geh-/Radweg (ausserorts)'),
    ],
    note: 'Used as the current shared-path default until a dedicated bidirectional/shared-facility model exists.',
  },
  parallel: {
    width: 2.00,
    source: [
      reference('2.6 Parkstaende (RASt 06)', 'Laengsparken'),
    ],
  },
  angled: {
    width: 4.50,
    source: [
      reference('2.6 Parkstaende (RASt 06)', 'Schraegparken (45-60 Grad)'),
    ],
    note: 'Cross-section depth approximation used by the editor.',
  },
  perpendicular: {
    width: 5.00,
    source: [
      reference('2.6 Parkstaende (RASt 06)', 'Senkrechtparken'),
    ],
    note: 'Cross-section depth approximation used by the editor.',
  },
  'green-median': {
    width: 3.00,
    source: [
      reference('3.2 Mittelstreifen (durchgehend)', 'Mit Radverkehr/Rollstuhl >= 2,50 m; bei hohem Kfz-Verkehr >= 3,00 m'),
    ],
  },
  barrier: {
    width: 0.60,
    source: [
      editorDefault('Barrier median width is a project default and still needs a dedicated normative source.'),
    ],
  },
  'tree-strip': {
    width: 2.50,
    source: [
      editorDefault('Tree-strip width is a project default and still needs a dedicated normative source.'),
    ],
  },
  dedicated: {
    width: 3.00,
    source: [
      editorDefault('Dedicated tram-way width is currently a project default.'),
    ],
  },
  flush: {
    width: 3.00,
    source: [
      editorDefault('Flush tram-way width is currently a project default.'),
    ],
  },
}

export const ROAD_CLASS_STRIP_RULES: Partial<Record<RoadClass, Partial<Record<StripType, RoadClassStripDimensionRule>>>> = {
  innerorts: {
    lane: {
      width: 3.25,
      source: [
        reference('2.3 Stadtstrassen (RASt 06)', 'Einstreifige Richtungsfahrbahn'),
      ],
    },
  },
  ausserorts: {
    lane: {
      width: 3.50,
      source: [
        reference('2.2 Landstrassen (RAL 2012)', 'EKL 2 / EKL 3 Fahrstreifenbreite'),
      ],
    },
    shoulder: {
      width: 1.50,
      source: [
        reference('2.2 Landstrassen (RAL 2012)', 'Bankett'),
      ],
    },
  },
  autobahn: {
    lane: {
      width: 3.75,
      source: [
        reference('2.1 Autobahnen (RAA 2008)', 'RQ 31 / RQ 36 / RQ 43,5 Fahrstreifenbreite'),
      ],
    },
    shoulder: {
      width: 3.00,
      source: [
        reference('2.1 Autobahnen (RAA 2008)', 'Seitenstreifen 3,00 m in RQ 31 / RQ 36 / RQ 43,5'),
      ],
      note: 'Uses the standard 3,00 m motorway shoulder and not the narrower RQ 28 shoulder.',
    },
  },
}

export const ROAD_CLASS_VARIANT_RULES: Partial<Record<RoadClass, Partial<Record<StripVariant, RoadClassStripDimensionRule>>>> = {
  autobahn: {
    barrier: {
      width: 4.00,
      source: [
        reference('2.1 Autobahnen (RAA 2008)', 'Mittelstreifen 4,00 m in RQ 31 / RQ 36 / RQ 43,5'),
      ],
      note: 'Maps the motorway median barrier strip to a full median-width placeholder in the straight editor.',
    },
  },
}

export const FIXED_WIDTH_STRIP_TYPES: StripType[] = ['curb', 'gutter']

export const PROFILE_SENSITIVE_STRIP_TYPES: StripType[] = ['lane', 'shoulder']
export const PROFILE_SENSITIVE_VARIANTS: StripVariant[] = ['barrier']

export function getStripDefaultWidth(
  type: StripType,
  variant: StripVariant = 'standard',
  roadClass?: RoadClass,
): number {
  if (roadClass && ROAD_CLASS_VARIANT_RULES[roadClass]?.[variant]) {
    return ROAD_CLASS_VARIANT_RULES[roadClass][variant]!.width
  }

  if (roadClass && ROAD_CLASS_STRIP_RULES[roadClass]?.[type]) {
    return ROAD_CLASS_STRIP_RULES[roadClass][type]!.width
  }

  return STRIP_VARIANT_RULES[variant]?.width ?? STRIP_BASE_RULES[type].defaultWidth
}

export function getStripEditorMinWidth(type: StripType): number {
  return STRIP_BASE_RULES[type].editorMinWidth
}

export function isProfileSensitiveStrip(type: StripType, variant: StripVariant = 'standard'): boolean {
  return PROFILE_SENSITIVE_STRIP_TYPES.includes(type) || PROFILE_SENSITIVE_VARIANTS.includes(variant)
}

export function applyRoadClassWidthToStrips(strips: Strip[], roadClass: RoadClass): Strip[] {
  return strips.map((strip) => (
    isProfileSensitiveStrip(strip.type, strip.variant)
      ? { ...strip, width: getStripDefaultWidth(strip.type, strip.variant, roadClass) }
      : strip
  ))
}
