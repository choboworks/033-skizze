import {
  getDefaultBikeCrossingBoundaryDashPattern,
  resolveBikeCrossingBoundaryDashPattern,
  resolveBikeCrossingBoundaryLineMode,
  resolveBikeCrossingBoundaryStrokeWidth,
  MARKING_RULES,
} from '../../../rules/markingRules'
import type { BikeCrossingSurfaceType, CyclepathLineMode } from '../../../types'
import type { MarkingPropertyContext, MarkingPropertySectionDefinition } from './types'

function dimensionsSection(): MarkingPropertySectionDefinition {
  return {
    id: 'bike-crossing-dimensions',
    title: 'Furt',
    fields: [
      {
        kind: 'number',
        id: 'bike-crossing-length',
        label: 'Furtbreite',
        getValue: ({ marking }) => marking.length ?? MARKING_RULES.bikeCrossing.defaultLength,
        applyValue: (value) => ({ length: value }),
        min: () => MARKING_RULES.bikeCrossing.minLength,
        max: () => MARKING_RULES.bikeCrossing.maxLength,
        step: 0.25,
      },
    ],
  }
}

function appearanceSection(): MarkingPropertySectionDefinition {
  return {
    id: 'bike-crossing-appearance',
    title: 'Ausführung',
    fields: [
      {
        kind: 'choice',
        id: 'bike-crossing-surface',
        label: 'Fläche',
        getValue: ({ marking }) => marking.bikeCrossingSurfaceType ?? 'cyclepath',
        applyValue: (value) => ({
          bikeCrossingSurfaceType: value as BikeCrossingSurfaceType,
        }),
        options: () => [
          { value: 'cyclepath', label: 'Radweg' },
          { value: 'crosswalk', label: 'Überweg' },
        ],
      },
    ],
  }
}

function lineSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition | null {
  const surfaceType = context.marking.bikeCrossingSurfaceType ?? 'cyclepath'
  if (surfaceType !== 'cyclepath') return null

  const boundaryMode = resolveBikeCrossingBoundaryLineMode(context.marking.bikeCrossingBoundaryLineMode)
  const [defaultDashLength, defaultGapLength] = getDefaultBikeCrossingBoundaryDashPattern()

  return {
    id: 'bike-crossing-lines',
    title: 'Linien',
    fields: [
      {
        kind: 'choice',
        id: 'bike-crossing-boundary-line-mode',
        label: 'Begrenzungslinien',
        getValue: ({ marking }) => resolveBikeCrossingBoundaryLineMode(marking.bikeCrossingBoundaryLineMode),
        applyValue: (value) => ({ bikeCrossingBoundaryLineMode: value as CyclepathLineMode }),
        options: () => [
          { value: 'dashed', label: 'Gestrichelt' },
          { value: 'solid', label: 'Durchgezogen' },
          { value: 'none', label: 'Keine' },
        ],
      },
      ...(boundaryMode !== 'none'
        ? [{
            kind: 'number' as const,
            id: 'bike-crossing-boundary-line-stroke-width',
            label: 'Begrenzung Stärke',
            getValue: ({ marking }: MarkingPropertyContext) => resolveBikeCrossingBoundaryStrokeWidth(marking.bikeCrossingBoundaryLineStrokeWidth),
            applyValue: (value: number) => ({ bikeCrossingBoundaryLineStrokeWidth: value }),
            min: () => 0.01,
            step: 0.01,
            displayUnit: 'cm',
            displayFactor: 100,
          }]
        : []),
      ...(boundaryMode === 'dashed'
        ? [
            {
              kind: 'number' as const,
              id: 'bike-crossing-boundary-line-dash-length',
              label: 'Begrenzung Strichlänge',
              getValue: ({ marking }: MarkingPropertyContext) => resolveBikeCrossingBoundaryDashPattern(
                marking.bikeCrossingBoundaryLineDashLength,
                marking.bikeCrossingBoundaryLineGapLength,
              )[0],
              applyValue: (value: number, { marking }: MarkingPropertyContext) => ({
                bikeCrossingBoundaryLineDashLength: value,
                ...(marking.bikeCrossingBoundaryLineGapLength == null ? { bikeCrossingBoundaryLineGapLength: defaultGapLength } : {}),
              }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm',
              displayFactor: 100,
            },
            {
              kind: 'number' as const,
              id: 'bike-crossing-boundary-line-gap-length',
              label: 'Begrenzung Lückenlänge',
              getValue: ({ marking }: MarkingPropertyContext) => resolveBikeCrossingBoundaryDashPattern(
                marking.bikeCrossingBoundaryLineDashLength,
                marking.bikeCrossingBoundaryLineGapLength,
              )[1],
              applyValue: (value: number, { marking }: MarkingPropertyContext) => ({
                bikeCrossingBoundaryLineGapLength: value,
                ...(marking.bikeCrossingBoundaryLineDashLength == null ? { bikeCrossingBoundaryLineDashLength: defaultDashLength } : {}),
              }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm',
              displayFactor: 100,
            },
          ]
        : []),
    ],
  }
}

export function getBikeCrossingPropertySections(context: MarkingPropertyContext): MarkingPropertySectionDefinition[] {
  return [
    dimensionsSection(),
    appearanceSection(),
    lineSection(context),
  ].filter(Boolean) as MarkingPropertySectionDefinition[]
}
