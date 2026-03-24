import type { MarkingVariant } from '../../../types'
import { MARKING_DEFAULTS } from '../../../constants'
import type { MarkingChoiceOption, MarkingPropertySectionDefinition } from './types'

const MARKING_VARIANT_OPTIONS: Partial<Record<string, MarkingChoiceOption[]>> = {
  centerline: [
    { value: 'standard-dash', label: 'Leitlinie I' },
    { value: 'rural-dash', label: 'Leitlinie A' },
    { value: 'autobahn-dash', label: 'Leitlinie AB' },
    { value: 'short-dash', label: 'Kurzstrich' },
    { value: 'warning-dash', label: 'Warnlinie I' },
    { value: 'rural-warning', label: 'Warnlinie A' },
    { value: 'autobahn-warning', label: 'Warnlinie AB' },
  ],
  laneboundary: [
    { value: 'solid', label: 'Einfach' },
    { value: 'double', label: 'Doppelt' },
  ],
  arrow: [
    { value: 'straight', label: '↑' },
    { value: 'left', label: '←' },
    { value: 'right', label: '→' },
    { value: 'straight-left', label: '↑←' },
    { value: 'straight-right', label: '↑→' },
  ],
}

export function variantSection(type: string, title = 'Variante'): MarkingPropertySectionDefinition | null {
  const options = MARKING_VARIANT_OPTIONS[type]
  if (!options || options.length <= 1) return null

  return {
    id: `${type}-variant`,
    fields: [
      {
        kind: 'choice',
        id: 'variant',
        label: title,
        getValue: ({ marking }) => marking.variant,
        applyValue: (value) => ({ variant: value as MarkingVariant }),
        options: () => options,
      },
    ],
  }
}

export function widthDisplaySection(label = 'Breite'): MarkingPropertySectionDefinition {
  return {
    id: 'width',
    fields: [
      {
        kind: 'readonly',
        id: 'width',
        label,
        getValue: ({ marking }) => `${(marking.width || 0).toFixed(1)}m`,
      },
    ],
  }
}

export function strokeWidthSection(options: MarkingChoiceOption[]): MarkingPropertySectionDefinition {
  return {
    id: 'stroke-width',
    fields: [
      {
        kind: 'choice',
        id: 'strokeWidth',
        label: 'Strichbreite',
        getValue: ({ marking }) => String(marking.strokeWidth || MARKING_DEFAULTS.schmalstrich),
        applyValue: (value) => ({ strokeWidth: parseFloat(value) }),
        options: () => options,
      },
    ],
  }
}

export const CENTERLINE_STROKE_WIDTH_OPTIONS: MarkingChoiceOption[] = [
  { value: String(MARKING_DEFAULTS.schmalstrich), label: `${MARKING_DEFAULTS.schmalstrich * 100}cm` },
  { value: String(MARKING_DEFAULTS.schmalstrichAutobahn), label: `${MARKING_DEFAULTS.schmalstrichAutobahn * 100}cm` },
]

export const BOUNDARY_STROKE_WIDTH_OPTIONS: MarkingChoiceOption[] = [
  { value: String(MARKING_DEFAULTS.schmalstrich), label: `${MARKING_DEFAULTS.schmalstrich * 100}cm` },
  { value: String(MARKING_DEFAULTS.schmalstrichAutobahn), label: `${MARKING_DEFAULTS.schmalstrichAutobahn * 100}cm` },
  { value: String(MARKING_DEFAULTS.breitstrich), label: `${MARKING_DEFAULTS.breitstrich * 100}cm` },
  { value: String(MARKING_DEFAULTS.breitstrichAutobahn), label: `${MARKING_DEFAULTS.breitstrichAutobahn * 100}cm` },
]
