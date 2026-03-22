import { FIXED_WIDTH_STRIPS, STRIP_MIN_WIDTHS, VARIANT_LABELS } from '../../constants'
import {
  DEFAULT_PARKING_BAY_LENGTH,
  getBusStripProps,
  getLaneStripProps,
  getParkingStripProps,
  getStripRenderLength,
  mergeStripProps,
} from '../../stripProps'
import type { Strip, StripType, StripVariant } from '../../types'

export interface StripPropertyContext {
  strip: Strip
  roadLength?: number
}

export interface StripChoiceOption {
  value: string
  label: string
  title?: string
}

export interface StripNumberFieldDefinition {
  kind: 'number'
  id: string
  label: string
  getValue: (context: StripPropertyContext) => number
  applyValue: (value: number, context: StripPropertyContext) => Partial<Strip>
  min: (context: StripPropertyContext) => number
  max?: (context: StripPropertyContext) => number | undefined
  step?: number
  readOnly?: (context: StripPropertyContext) => boolean
  readOnlyLabel?: (context: StripPropertyContext) => string
}

export interface StripChoiceFieldDefinition {
  kind: 'choice'
  id: string
  label: string
  getValue: (context: StripPropertyContext) => string | undefined
  applyValue: (value: string, context: StripPropertyContext) => Partial<Strip>
  options: (context: StripPropertyContext) => StripChoiceOption[]
}

export type StripPropertyFieldDefinition =
  | StripNumberFieldDefinition
  | StripChoiceFieldDefinition

export interface StripPropertySectionDefinition {
  id: string
  title?: string
  fields: StripPropertyFieldDefinition[]
}

const VARIANT_OPTIONS: Partial<Record<StripType, StripChoiceOption[]>> = {
  cyclepath: [
    { value: 'protected', label: 'Baulich getr.' },
    { value: 'lane-marked', label: 'Radfahrstr.' },
    { value: 'advisory', label: 'Schutzstr.' },
  ],
  sidewalk: [
    { value: 'standard', label: 'Standard' },
    { value: 'shared-bike', label: 'Gem. Rad' },
    { value: 'separated-bike', label: 'Getr. Rad' },
  ],
  parking: [
    { value: 'parallel', label: 'Längs' },
    { value: 'angled', label: 'Schraeg' },
    { value: 'perpendicular', label: 'Quer' },
  ],
  median: [
    { value: 'marking-only', label: 'Markierung' },
    { value: 'green-median', label: 'Grün' },
    { value: 'barrier', label: 'Leitplanke' },
  ],
  green: [
    { value: 'standard', label: 'Standard' },
    { value: 'tree-strip', label: 'Baumstreifen' },
  ],
  tram: [
    { value: 'dedicated', label: 'Eigentrasse' },
    { value: 'flush', label: 'Bündig' },
  ],
}

function geometrySection(includeHeight = true): StripPropertySectionDefinition {
  const fields: StripPropertyFieldDefinition[] = [
    {
      kind: 'number',
      id: 'width',
      label: 'Breite',
      getValue: ({ strip }) => strip.width,
      applyValue: (value) => ({ width: value }),
      min: ({ strip }) => STRIP_MIN_WIDTHS[strip.type] || 0.1,
      step: 0.25,
      readOnly: ({ strip }) => FIXED_WIDTH_STRIPS.includes(strip.type),
      readOnlyLabel: ({ strip }) => `${strip.width}m (fix)`,
    },
  ]

  if (includeHeight) {
    fields.push({
      kind: 'number',
      id: 'height',
        label: 'Höhe',
      getValue: ({ strip, roadLength }) => strip.height ?? roadLength ?? 10,
      applyValue: (value, { roadLength }) => ({
        height: roadLength != null && value >= roadLength ? undefined : value,
      }),
      min: () => 0.5,
      max: ({ roadLength }) => roadLength,
      step: 0.25,
    })
  }

  return {
    id: 'geometry',
    title: 'Geometrie',
    fields,
  }
}

function variantSection(
  id: string,
  label: string,
  type: StripType,
): StripPropertySectionDefinition | null {
  const options = VARIANT_OPTIONS[type]
  if (!options || options.length <= 1) return null

  return {
    id,
    title: label,
    fields: [
      {
        kind: 'choice',
        id: 'variant',
        label,
        getValue: ({ strip }) => strip.variant,
        applyValue: (value) => ({ variant: value as StripVariant }),
        options: () => options.map((option) => ({
          ...option,
          title: VARIANT_LABELS[option.value as StripVariant] || option.label,
        })),
      },
    ],
  }
}

function longitudinalSection(kind: 'lane' | 'bus'): StripPropertySectionDefinition {
  const getProps = kind === 'lane' ? getLaneStripProps : getBusStripProps

  return {
    id: `${kind}-longitudinal`,
    title: 'Längslage',
    fields: [
      {
        kind: 'number',
        id: `${kind}-start-offset`,
        label: 'Start',
        getValue: ({ strip }) => getProps(strip).startOffset ?? 0,
        applyValue: (value, { strip, roadLength }) => {
          const current = getProps(strip)
          const maxStart = Math.max(0, (roadLength ?? 10) - (current.endOffset ?? 0) - 0.5)
          return mergeStripProps(strip, { startOffset: Math.min(value, maxStart) })
        },
        min: () => 0,
        max: ({ strip, roadLength }) => Math.max(0, (roadLength ?? 10) - (getProps(strip).endOffset ?? 0) - 0.5),
        step: 0.25,
      },
      {
        kind: 'number',
        id: `${kind}-end-offset`,
        label: 'Ende',
        getValue: ({ strip }) => getProps(strip).endOffset ?? 0,
        applyValue: (value, { strip, roadLength }) => {
          const current = getProps(strip)
          const maxEnd = Math.max(0, (roadLength ?? 10) - (current.startOffset ?? 0) - 0.5)
          return mergeStripProps(strip, { endOffset: Math.min(value, maxEnd) })
        },
        min: () => 0,
        max: ({ strip, roadLength }) => Math.max(0, (roadLength ?? 10) - (getProps(strip).startOffset ?? 0) - 0.5),
        step: 0.25,
      },
      {
        kind: 'number',
        id: `${kind}-visible-length`,
        label: 'Länge',
        getValue: ({ strip, roadLength }) => getStripRenderLength(strip, roadLength ?? 10),
        applyValue: () => ({}),
        min: () => 0.5,
        readOnly: () => true,
        readOnlyLabel: ({ strip, roadLength }) => `${getStripRenderLength(strip, roadLength ?? 10)}m`,
      },
    ],
  }
}

const STRIP_PROPERTY_BUILDERS: Record<StripType, (context: StripPropertyContext) => StripPropertySectionDefinition[]> = {
  lane: () => [
    geometrySection(false),
    longitudinalSection('lane'),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  bus: () => [
    geometrySection(false),
    longitudinalSection('bus'),
  ],
  cyclepath: () => [
    geometrySection(),
    variantSection('cyclepath-variant', 'Führung', 'cyclepath'),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  sidewalk: () => [
    geometrySection(),
    variantSection('sidewalk-variant', 'Nutzung', 'sidewalk'),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  parking: () => [
    geometrySection(),
    variantSection('parking-variant', 'Parkart', 'parking'),
    {
      id: 'parking-details',
      title: 'Parken',
      fields: [
        {
          kind: 'number',
          id: 'parking-bay-length',
          label: 'Stellplatzlänge',
          getValue: ({ strip }: StripPropertyContext) => getParkingStripProps(strip).bayLength ?? DEFAULT_PARKING_BAY_LENGTH,
          applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { bayLength: value }),
          min: () => 2,
          step: 0.25,
        },
      ],
    },
  ].filter(Boolean) as StripPropertySectionDefinition[],
  green: () => [
    geometrySection(),
    variantSection('green-variant', 'Ausführung', 'green'),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  median: () => [
    geometrySection(),
    variantSection('median-variant', 'Trennung', 'median'),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  tram: () => [
    geometrySection(),
    variantSection('tram-variant', 'Gleistyp', 'tram'),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  curb: () => [geometrySection()],
  gutter: () => [geometrySection()],
  shoulder: () => [geometrySection()],
}

export function getStripPropertySections(context: StripPropertyContext): StripPropertySectionDefinition[] {
  return STRIP_PROPERTY_BUILDERS[context.strip.type](context)
}
