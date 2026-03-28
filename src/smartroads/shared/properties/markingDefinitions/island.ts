import {
  TRAFFIC_ISLAND_RULES,
  getDefaultBikeCrossingBoundaryDashPattern,
  getTrafficIslandPresetRule,
  resolveBikeCrossingBoundaryDashPattern,
  resolveBikeCrossingBoundaryLineMode,
  resolveBikeCrossingBoundaryStrokeWidth,
} from '../../../rules/markingRules'
import type {
  BikeCrossingSurfaceType,
  CyclepathLineMode,
  TrafficIslandEntryTreatment,
  TrafficIslandPreset,
  TrafficIslandSurfaceType,
} from '../../../types'
import type { MarkingPropertyContext, MarkingPropertySectionDefinition } from './types'

function getEffectivePreset(context: MarkingPropertyContext): TrafficIslandPreset {
  if (context.marking.crossingAidPreset && context.marking.crossingAidPreset !== 'free') {
    return context.marking.crossingAidPreset
  }
  if (context.linkedCrossingType === 'bike-crossing') return 'bike-crossing'
  return context.linkedCrossingType === 'crosswalk' ? 'standard' : 'free'
}

function executionSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition | null {
  if (context.linkedCrossingType === 'bike-crossing') return null
  if (context.linkedCrossingType !== 'crosswalk') return null

  return {
    id: 'island-execution',
    title: 'Ausführung',
    fields: [
      {
        kind: 'choice',
        id: 'island-execution-preset',
        label: 'Variante',
        getValue: () => getEffectivePreset(context),
        applyValue: (value) => {
          const preset = value as Exclude<TrafficIslandPreset, 'free'>
          const rule = getTrafficIslandPresetRule(preset)
          return {
            crossingAidPreset: preset,
            variant: 'raised-paved',
            surfaceType: rule.surfaceType,
            curbType: rule.curbType,
            entryTreatment: rule.entryTreatment,
            endShape: rule.endShape,
            showCurbBorder: rule.showCurbBorder,
            showApproachMarking: rule.showApproachMarking,
            approachLength: rule.approachLength,
          }
        },
        options: () => [
          { value: 'standard', label: 'Standard' },
          { value: 'barrier-free', label: 'Barrierefrei' },
        ],
      },
    ],
  }
}

function islandDimensionsSection(): MarkingPropertySectionDefinition {
  return {
    id: 'island-dimensions',
    title: 'Dimensionen',
    fields: [
      {
        kind: 'number',
        id: 'island-width',
        label: 'Breite',
        getValue: ({ marking, linkedCrossingType }) => {
          if (marking.width != null) return marking.width
          return linkedCrossingType
            ? TRAFFIC_ISLAND_RULES.preferredWidth
            : TRAFFIC_ISLAND_RULES.recommendedWidth
        },
        applyValue: (value) => ({ width: value }),
        min: () => TRAFFIC_ISLAND_RULES.narrowMinWidth,
        max: ({ roadwayWidth }) => roadwayWidth != null ? Math.max(TRAFFIC_ISLAND_RULES.narrowMinWidth, roadwayWidth) : 10.0,
        step: 0.25,
      },
      {
        kind: 'number',
        id: 'island-length',
        label: 'Länge',
        getValue: ({ marking }) => marking.length || TRAFFIC_ISLAND_RULES.defaultLength,
        applyValue: (value) => ({ length: value }),
        min: () => 4.0,
        max: () => 50.0,
        step: 0.5,
      },
    ],
  }
}

function islandAppearanceSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition {
  const isCrossingAid = Boolean(context.linkedCrossingType)
  const effectivePreset = getEffectivePreset(context)
  const presetSurfaceType = getTrafficIslandPresetRule(effectivePreset).surfaceType
  const isBikeCrossing = context.linkedCrossingType === 'bike-crossing'

  const fields: MarkingPropertySectionDefinition['fields'] = [
    {
      kind: 'choice',
      id: 'island-surface',
      label: 'Belag',
      getValue: ({ marking }) => marking.surfaceType || (isCrossingAid ? presetSurfaceType : 'green'),
      applyValue: (value) => ({ surfaceType: value as TrafficIslandSurfaceType }),
      options: () => [
        ...(!isCrossingAid ? [{ value: 'green', label: 'Grünfläche' }] : []),
        { value: 'paved', label: 'Pflaster' },
        { value: 'cobblestone', label: 'Kopfstein' },
      ],
    },
  ]

  if (!isBikeCrossing) {
    fields.push(
      {
        kind: 'choice',
        id: 'island-end-shape',
        label: 'Kopf',
        getValue: ({ marking }) => marking.endShape || 'rounded',
        applyValue: (value) => ({ endShape: value }),
        options: () => [
          { value: 'rounded', label: 'Abgerundet' },
          { value: 'pointed', label: 'Spitz' },
          { value: 'flat', label: 'Flach' },
        ],
      },
      {
        kind: 'number',
        id: 'island-taper-length',
        label: 'Zulauflänge',
        getValue: ({ marking }) => marking.endTaperLength ?? 1.0,
        applyValue: (value) => ({ endTaperLength: value }),
        min: () => 0.2,
        max: ({ marking }) => (marking.length || TRAFFIC_ISLAND_RULES.defaultLength) * 0.4,
        step: 0.1,
        readOnly: ({ marking }) => (marking.endShape || 'rounded') === 'flat',
      },
    )
  }

  return {
    id: 'island-appearance',
    title: 'Oberfläche',
    fields,
  }
}

function islandCurbSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition | null {
  const fields: MarkingPropertySectionDefinition['fields'] = [
    {
      kind: 'choice',
      id: 'island-curb-toggle',
      label: 'Bordstein',
      getValue: ({ marking }) => (marking.showCurbBorder !== false ? 'on' : 'off'),
      applyValue: (value) => ({ showCurbBorder: value === 'on' }),
      options: () => [
        { value: 'on', label: 'An' },
        { value: 'off', label: 'Aus' },
      ],
    },
  ]

  if (context.linkedCrossingType === 'crosswalk') {
    fields.push({
      kind: 'choice',
      id: 'island-entry-treatment',
      label: 'Querungsrand',
      getValue: ({ marking }) => (marking.entryTreatment || 'none') as TrafficIslandEntryTreatment,
      applyValue: (value) => ({ entryTreatment: value as TrafficIslandEntryTreatment }),
      options: () => [
        { value: 'none', label: 'Keine' },
        { value: 'round-3cm', label: 'Rundbord 3 cm' },
        { value: 'kassel', label: 'Kasseler Bord' },
        { value: 'separated-0-6', label: 'Getrennt 0/6 cm' },
      ],
    })
  }

  return {
    id: 'island-curb',
    title: 'Bord',
    fields,
  }
}

function linkedBikeCrossingSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition | null {
  if (context.linkedCrossingType !== 'bike-crossing' || context.linkedCrossing?.type !== 'bike-crossing') {
    return null
  }

  const crossingType = context.linkedCrossing.bikeCrossingSurfaceType ?? 'cyclepath'
  const fields: MarkingPropertySectionDefinition['fields'] = [
    {
      kind: 'choice',
      id: 'bike-crossing-surface-from-island',
      label: 'Fläche',
      getValue: ({ linkedCrossing }) => linkedCrossing?.bikeCrossingSurfaceType ?? 'cyclepath',
      applyValue: (value) => ({
        bikeCrossingSurfaceType: value as BikeCrossingSurfaceType,
      }),
      options: () => [
        { value: 'cyclepath', label: 'Radweg' },
        { value: 'crosswalk', label: 'Überweg' },
      ],
    },
  ]

  if (crossingType === 'cyclepath') {
    const boundaryMode = resolveBikeCrossingBoundaryLineMode(context.linkedCrossing.bikeCrossingBoundaryLineMode)
    const [defaultDashLength, defaultGapLength] = getDefaultBikeCrossingBoundaryDashPattern()

    fields.push({
      kind: 'choice',
      id: 'bike-crossing-boundary-line-mode-from-island',
      label: 'Begrenzungslinien',
      getValue: ({ linkedCrossing }) => resolveBikeCrossingBoundaryLineMode(linkedCrossing?.bikeCrossingBoundaryLineMode),
      applyValue: (value) => ({ bikeCrossingBoundaryLineMode: value as CyclepathLineMode }),
      options: () => [
        { value: 'dashed', label: 'Gestrichelt' },
        { value: 'solid', label: 'Durchgezogen' },
        { value: 'none', label: 'Keine' },
      ],
    })

    if (boundaryMode !== 'none') {
      fields.push({
        kind: 'number',
        id: 'bike-crossing-boundary-line-stroke-width-from-island',
        label: 'Begrenzung Stärke',
        getValue: ({ linkedCrossing }) => resolveBikeCrossingBoundaryStrokeWidth(linkedCrossing?.bikeCrossingBoundaryLineStrokeWidth),
        applyValue: (value) => ({ bikeCrossingBoundaryLineStrokeWidth: value }),
        min: () => 0.01,
        step: 0.01,
        displayUnit: 'cm',
        displayFactor: 100,
      })
    }

    if (boundaryMode === 'dashed') {
      fields.push(
        {
          kind: 'number',
          id: 'bike-crossing-boundary-line-dash-length-from-island',
          label: 'Begrenzung Strichlänge',
          getValue: ({ linkedCrossing }) => resolveBikeCrossingBoundaryDashPattern(
            linkedCrossing?.bikeCrossingBoundaryLineDashLength,
            linkedCrossing?.bikeCrossingBoundaryLineGapLength,
          )[0],
          applyValue: (value, { linkedCrossing }) => ({
            bikeCrossingBoundaryLineDashLength: value,
            ...(linkedCrossing?.bikeCrossingBoundaryLineGapLength == null
              ? { bikeCrossingBoundaryLineGapLength: defaultGapLength }
              : {}),
          }),
          min: () => 0.1,
          step: 0.1,
          displayUnit: 'cm',
          displayFactor: 100,
        },
        {
          kind: 'number',
          id: 'bike-crossing-boundary-line-gap-length-from-island',
          label: 'Begrenzung Lückenlänge',
          getValue: ({ linkedCrossing }) => resolveBikeCrossingBoundaryDashPattern(
            linkedCrossing?.bikeCrossingBoundaryLineDashLength,
            linkedCrossing?.bikeCrossingBoundaryLineGapLength,
          )[1],
          applyValue: (value, { linkedCrossing }) => ({
            bikeCrossingBoundaryLineGapLength: value,
            ...(linkedCrossing?.bikeCrossingBoundaryLineDashLength == null
              ? { bikeCrossingBoundaryLineDashLength: defaultDashLength }
              : {}),
          }),
          min: () => 0.1,
          step: 0.1,
          displayUnit: 'cm',
          displayFactor: 100,
        },
      )
    }
  }

  return {
    id: 'island-bike-crossing',
    title: 'Furt',
    fields,
  }
}

function islandApproachSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition | null {
  if (context.linkedCrossingType === 'bike-crossing') return null

  return {
    id: 'island-approach',
    title: 'Zulaufmarkierung',
    fields: [
      {
        kind: 'choice',
        id: 'island-approach-toggle',
        label: 'Sperrfläche',
        getValue: ({ marking }) => (marking.showApproachMarking !== false ? 'on' : 'off'),
        applyValue: (value) => ({ showApproachMarking: value === 'on' }),
        options: () => [
          { value: 'on', label: 'An' },
          { value: 'off', label: 'Aus' },
        ],
      },
      {
        kind: 'number',
        id: 'island-approach-length',
        label: 'Länge',
        getValue: ({ marking }) => marking.approachLength ?? TRAFFIC_ISLAND_RULES.defaultApproachLength,
        applyValue: (value) => ({ approachLength: value }),
        min: () => 1.0,
        max: () => 15.0,
        step: 0.5,
        readOnly: ({ marking }) => marking.showApproachMarking === false,
      },
    ],
  }
}

export function getIslandMarkingPropertySections(context: MarkingPropertyContext): MarkingPropertySectionDefinition[] {
  const sections: MarkingPropertySectionDefinition[] = []
  const execution = executionSection(context)
  if (execution) sections.push(execution)
  const curb = islandCurbSection(context)
  const linkedBikeCrossing = linkedBikeCrossingSection(context)
  const approach = islandApproachSection(context)

  sections.push(islandDimensionsSection(), islandAppearanceSection(context))
  if (linkedBikeCrossing) sections.push(linkedBikeCrossing)
  if (curb) sections.push(curb)
  if (approach) sections.push(approach)

  return sections
}
