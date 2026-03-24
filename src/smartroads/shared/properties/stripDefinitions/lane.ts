import { getLaneStripProps, mergeStripProps } from '../../../stripProps'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection, longitudinalSection } from './shared'

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

export function getLanePropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(false),
    surfaceSection(),
    longitudinalSection('lane'),
  ]
}
