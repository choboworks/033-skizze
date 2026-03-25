import { MARKING_DEFAULTS } from '../../../constants'
import { getLaneStripProps, mergeStripProps } from '../../../stripProps'
import type { RoadClass, Strip } from '../../../types'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection, longitudinalSection } from './shared'

function defaultBoundaryStroke(roadClass?: RoadClass): number {
  if (roadClass === 'ausserorts' || roadClass === 'autobahn') return MARKING_DEFAULTS.breitstrich
  return MARKING_DEFAULTS.schmalstrich
}

function surfaceSection(): StripPropertySectionDefinition {
  return {
    id: 'lane-surface',
    title: 'Belag',
    fields: [
      {
        kind: 'choice',
        id: 'lane-surface-type',
        label: 'Fahrbahnbelag',
        getValue: ({ strip }: StripPropertyContext) => getLaneStripProps(strip).surfaceType ?? 'asphalt',
        applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, {
          surfaceType: value === 'asphalt' ? undefined : value,
        }),
        options: () => [
          { value: 'asphalt', label: 'Asphalt' },
          { value: 'concrete', label: 'Beton' },
          { value: 'cobblestone', label: 'Kopfsteinpflaster' },
          { value: 'paving', label: 'Pflaster' },
        ],
      },
    ],
  }
}

function boundaryLineSection(strip: Strip, roadClass?: RoadClass): StripPropertySectionDefinition[] {
  const props = getLaneStripProps(strip)
  const mode = props.boundaryLineMode ?? 'none'

  return [{
    id: 'lane-boundary-lines',
    title: 'Begrenzungslinien',
    fields: [
      {
        kind: 'choice',
        id: 'lane-boundary-line-mode',
        label: 'Begrenzungslinien',
        getValue: ({ strip }: StripPropertyContext) => getLaneStripProps(strip).boundaryLineMode ?? 'none',
        applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineMode: value }),
        options: () => [
          { value: 'solid', label: 'Durchgezogen' },
          { value: 'dashed', label: 'Gestrichelt' },
          { value: 'none', label: 'Keine' },
        ],
      },
      ...(mode !== 'none'
        ? [{
            kind: 'choice' as const,
            id: 'lane-boundary-line-sides',
            label: 'Seiten',
            getValue: ({ strip }: StripPropertyContext) => getLaneStripProps(strip).boundaryLineSides ?? 'both',
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
            id: 'lane-boundary-line-stroke-width',
            label: 'Stärke',
            getValue: ({ strip }: StripPropertyContext) => getLaneStripProps(strip).boundaryLineStrokeWidth ?? defaultBoundaryStroke(roadClass),
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
              id: 'lane-boundary-line-dash-length',
              label: 'Strichlänge',
              getValue: ({ strip }: StripPropertyContext) => getLaneStripProps(strip).boundaryLineDashLength ?? 0.5,
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineDashLength: value }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm' as const,
              displayFactor: 100,
            },
            {
              kind: 'number' as const,
              id: 'lane-boundary-line-gap-length',
              label: 'Lückenlänge',
              getValue: ({ strip }: StripPropertyContext) => getLaneStripProps(strip).boundaryLineGapLength ?? 0.5,
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

export function getLanePropertySections(context: StripPropertyContext): StripPropertySectionDefinition[] {
  return [
    geometrySection(false),
    surfaceSection(),
    longitudinalSection('lane'),
    ...boundaryLineSection(context.strip, context.roadClass),
  ]
}
