import type { MarkingVariant } from '../../../types'
import type { MarkingChoiceOption, MarkingPropertySectionDefinition } from './types'

const MARKING_VARIANT_OPTIONS: Partial<Record<string, MarkingChoiceOption[]>> = {
  centerline: [
    { value: 'standard-dash', label: 'Leitlinie I' },
    { value: 'rural-dash', label: 'Leitlinie A' },
    { value: 'autobahn-dash', label: 'Leitlinie AB' },
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
        getValue: ({ marking }) => String(marking.strokeWidth || 0.12),
        applyValue: (value) => ({ strokeWidth: parseFloat(value) }),
        options: () => options,
      },
    ],
  }
}

export const CENTERLINE_STROKE_WIDTH_OPTIONS: MarkingChoiceOption[] = [
  { value: '0.12', label: '12cm' },
  { value: '0.15', label: '15cm' },
]

export const BOUNDARY_STROKE_WIDTH_OPTIONS: MarkingChoiceOption[] = [
  { value: '0.12', label: '12cm' },
  { value: '0.15', label: '15cm' },
  { value: '0.25', label: '25cm' },
  { value: '0.30', label: '30cm' },
]
