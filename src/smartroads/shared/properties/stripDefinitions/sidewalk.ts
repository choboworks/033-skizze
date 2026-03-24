import { MARKING_DEFAULTS, STRIP_MIN_WIDTHS } from '../../../constants'
import { getStripEditorMinWidth } from '../../../rules/stripRules'
import { getSidewalkStripProps, mergeStripProps } from '../../../stripProps'
import type { Strip } from '../../../types'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection } from './shared'

function sidewalkMinWidth(strip: Strip): number {
  if (strip.type !== 'sidewalk') return STRIP_MIN_WIDTHS.sidewalk || 2.2
  if (strip.variant === 'separated-bike' || strip.variant === 'shared-bike') {
    return getStripEditorMinWidth('sidewalk', strip.variant)
  }
  return STRIP_MIN_WIDTHS.sidewalk || 2.2
}

function sidewalkGeometrySection(): StripPropertySectionDefinition {
  const base = geometrySection()
  return {
    ...base,
    fields: base.fields.map((field) => {
      if (field.kind === 'number' && field.id === 'width') {
        return {
          ...field,
          min: ({ strip }: StripPropertyContext) => sidewalkMinWidth(strip),
        }
      }
      return field
    }),
  }
}

function surfaceSection(): StripPropertySectionDefinition {
  return {
    id: 'sidewalk-surface',
    title: 'Art',
    fields: [
      {
        kind: 'choice',
        id: 'sidewalk-surface-type',
        label: 'Belag',
        getValue: ({ strip }: StripPropertyContext) => getSidewalkStripProps(strip).surfaceType ?? 'paving',
        applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, {
          surfaceType: value === 'paving' ? undefined : value,
        }),
        options: () => [
          { value: 'paving', label: 'Pflaster' },
          { value: 'slabs', label: 'Betonplatten' },
          { value: 'natural-stone', label: 'Naturstein' },
          { value: 'clinker', label: 'Klinker' },
          { value: 'asphalt', label: 'Asphalt' },
        ],
      },
    ],
  }
}

function boundaryLineSection(strip: Strip): StripPropertySectionDefinition[] {
  const props = getSidewalkStripProps(strip)
  const mode = props.boundaryLineMode ?? 'none'
  const lineOptions = [
    { value: 'dashed', label: 'Gestrichelt' },
    { value: 'solid', label: 'Durchgezogen' },
    { value: 'none', label: 'Keine' },
  ]

  return [{
    id: 'sidewalk-boundary-lines',
    title: 'Begrenzungslinien',
    fields: [
      {
        kind: 'choice',
        id: 'sidewalk-boundary-line-mode',
        label: 'Begrenzungslinien',
        getValue: ({ strip }: StripPropertyContext) => getSidewalkStripProps(strip).boundaryLineMode ?? 'none',
        applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineMode: value }),
        options: () => lineOptions,
      },
      ...(mode !== 'none'
        ? [{
            kind: 'choice' as const,
            id: 'sidewalk-boundary-line-sides',
            label: 'Seiten',
            getValue: ({ strip }: StripPropertyContext) => getSidewalkStripProps(strip).boundaryLineSides ?? 'both',
            applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineSides: value }),
            options: () => [
              { value: 'both', label: 'Beide' },
              { value: 'left', label: 'Links' },
              { value: 'right', label: 'Rechts' },
            ],
          }]
        : []),
      ...(mode !== 'none'
        ? [{
            kind: 'number' as const,
            id: 'sidewalk-boundary-line-stroke-width',
            label: 'Stärke',
            getValue: ({ strip }: StripPropertyContext) => getSidewalkStripProps(strip).boundaryLineStrokeWidth ?? MARKING_DEFAULTS.schmalstrich,
            applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineStrokeWidth: value }),
            min: () => 0.01,
            step: 0.01,
            displayUnit: 'cm' as const,
            displayFactor: 100,
          }]
        : []),
      ...(mode === 'dashed'
        ? [
            {
              kind: 'number' as const,
              id: 'sidewalk-boundary-line-dash-length',
              label: 'Strichlänge',
              getValue: ({ strip }: StripPropertyContext) => getSidewalkStripProps(strip).boundaryLineDashLength ?? 0.5,
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineDashLength: value }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm' as const,
              displayFactor: 100,
            },
            {
              kind: 'number' as const,
              id: 'sidewalk-boundary-line-gap-length',
              label: 'Lückenlänge',
              getValue: ({ strip }: StripPropertyContext) => getSidewalkStripProps(strip).boundaryLineGapLength ?? 0.5,
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineGapLength: value }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm' as const,
              displayFactor: 100,
            },
          ]
        : []),
    ],
  }]
}

export function getSidewalkPropertySections(context: StripPropertyContext): StripPropertySectionDefinition[] {
  return [
    sidewalkGeometrySection(),
    ...(context.strip.variant === 'standard' ? [surfaceSection()] : []),
    ...boundaryLineSection(context.strip),
  ]
}
