import { DEFAULT_ROAD_LENGTH, FIXED_WIDTH_STRIPS, STRIP_MIN_WIDTHS, VARIANT_LABELS } from '../../../constants'
import { getBusStripProps, getLaneStripProps, getStripRenderLength, mergeStripProps } from '../../../stripProps'
import type { StripType, StripVariant } from '../../../types'
import type { StripChoiceOption, StripPropertySectionDefinition } from './types'

const VARIANT_OPTIONS: Partial<Record<StripType, StripChoiceOption[]>> = {
  sidewalk: [
    { value: 'standard', label: 'Standard' },
    { value: 'shared-bike', label: 'Gem. Rad' },
    { value: 'separated-bike', label: 'Getr. Rad' },
  ],
  parking: [
    { value: 'parallel', label: 'Längs' },
    { value: 'angled', label: 'Schräg' },
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
  path: [
    { value: 'dirt', label: 'Erdweg' },
    { value: 'gravel', label: 'Schotter' },
    { value: 'forest', label: 'Waldweg' },
  ],
}

export function geometrySection(includeHeight = true): StripPropertySectionDefinition {
  const fields: StripPropertySectionDefinition['fields'] = [
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
      getValue: ({ strip, roadLength }) => strip.height ?? roadLength ?? DEFAULT_ROAD_LENGTH,
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

export function heightOnlyGeometrySection(): StripPropertySectionDefinition {
  return {
    id: 'geometry',
    title: 'Geometrie',
    fields: [
      {
        kind: 'number',
        id: 'height',
        label: 'Höhe',
        getValue: ({ strip, roadLength }) => strip.height ?? roadLength ?? DEFAULT_ROAD_LENGTH,
        applyValue: (value, { roadLength }) => ({
          height: roadLength != null && value >= roadLength ? undefined : value,
        }),
        min: () => 0.5,
        max: ({ roadLength }) => roadLength,
        step: 0.25,
      },
    ],
  }
}

export function variantSection(
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

export function longitudinalSection(kind: 'lane' | 'bus'): StripPropertySectionDefinition {
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
          const maxStart = Math.max(0, (roadLength ?? DEFAULT_ROAD_LENGTH) - (current.endOffset ?? 0) - 0.5)
          return mergeStripProps(strip, { startOffset: Math.min(value, maxStart) })
        },
        min: () => 0,
        max: ({ strip, roadLength }) => Math.max(0, (roadLength ?? DEFAULT_ROAD_LENGTH) - (getProps(strip).endOffset ?? 0) - 0.5),
        step: 0.25,
      },
      {
        kind: 'number',
        id: `${kind}-end-offset`,
        label: 'Ende',
        getValue: ({ strip }) => getProps(strip).endOffset ?? 0,
        applyValue: (value, { strip, roadLength }) => {
          const current = getProps(strip)
          const maxEnd = Math.max(0, (roadLength ?? DEFAULT_ROAD_LENGTH) - (current.startOffset ?? 0) - 0.5)
          return mergeStripProps(strip, { endOffset: Math.min(value, maxEnd) })
        },
        min: () => 0,
        max: ({ strip, roadLength }) => Math.max(0, (roadLength ?? DEFAULT_ROAD_LENGTH) - (getProps(strip).startOffset ?? 0) - 0.5),
        step: 0.25,
      },
      {
        kind: 'number',
        id: `${kind}-visible-length`,
        label: 'Länge',
        getValue: ({ strip, roadLength }) => getStripRenderLength(strip, roadLength ?? DEFAULT_ROAD_LENGTH),
        applyValue: () => ({}),
        min: () => 0.5,
        readOnly: () => true,
        readOnlyLabel: ({ strip, roadLength }) => `${getStripRenderLength(strip, roadLength ?? DEFAULT_ROAD_LENGTH)}m`,
      },
    ],
  }
}
