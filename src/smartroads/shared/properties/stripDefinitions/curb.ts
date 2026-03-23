import {
  DEFAULT_CURB_LOWERED_SECTION_LENGTH,
  getCurbStripProps,
  getStripRenderLength,
  mergeStripProps,
} from '../../../stripProps'
import { heightOnlyGeometrySection } from './shared'
import type { StripPropertySectionDefinition } from './types'

function curbSection(): StripPropertySectionDefinition {
  return {
    id: 'curb',
    title: 'Bordstein',
    fields: [
      {
        kind: 'choice',
        id: 'curb-kind',
        label: 'Art',
        getValue: ({ strip }) => getCurbStripProps(strip).kind ?? 'standard',
        applyValue: (value, { strip, roadLength }) => {
          if (value === 'standard') {
            return mergeStripProps(strip, { kind: 'standard' })
          }

          if (value === 'lowered') {
            return mergeStripProps(strip, { kind: 'lowered', loweredSectionOffset: 0 })
          }

          const props = getCurbStripProps(strip)
          const renderLength = getStripRenderLength(strip, roadLength ?? 10)
          const loweredLength = Math.max(
            0.5,
            Math.min(
              props.loweredSectionLength ?? DEFAULT_CURB_LOWERED_SECTION_LENGTH,
              renderLength,
            ),
          )
          const centeredOffset = Math.max(
            0,
            Math.round(((renderLength - loweredLength) / 2) * 100) / 100,
          )

          return mergeStripProps(strip, {
            kind: 'driveway',
            loweredSectionOffset: centeredOffset,
          })
        },
        options: () => [
          { value: 'standard', label: 'Standard' },
          { value: 'lowered', label: 'Abgeflacht' },
          { value: 'driveway', label: 'Ein- oder Ausfahrt' },
        ],
      },
      {
        kind: 'number',
        id: 'curb-lowered-length',
        label: 'Ein- oder Ausfahrt Laenge',
        getValue: ({ strip }) =>
          getCurbStripProps(strip).loweredSectionLength ??
          DEFAULT_CURB_LOWERED_SECTION_LENGTH,
        applyValue: (value, { strip }) =>
          mergeStripProps(strip, { loweredSectionLength: value }),
        min: () => 0.5,
        max: ({ strip, roadLength }) => getStripRenderLength(strip, roadLength ?? 10),
        step: 0.25,
        readOnly: ({ strip }) => getCurbStripProps(strip).kind !== 'driveway',
        readOnlyLabel: () => 'nur bei Ein- oder Ausfahrt',
      },
    ],
  }
}

export function getCurbPropertySections(): StripPropertySectionDefinition[] {
  return [heightOnlyGeometrySection(), curbSection()]
}
