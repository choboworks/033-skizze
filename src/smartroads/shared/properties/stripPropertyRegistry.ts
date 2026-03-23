import { FIXED_WIDTH_STRIPS, STRIP_MIN_WIDTHS, VARIANT_LABELS } from '../../constants'
import { getProtectedCyclepathRule } from '../../rules/stripRules'
import {
  DEFAULT_PARKING_BAY_LENGTH,
  getDefaultCyclepathBoundaryDashPattern,
  getDefaultCyclepathCenterDashPattern,
  getBusStripProps,
  getCyclepathStripProps,
  getLaneStripProps,
  getParkingStripProps,
  getStripRenderLength,
  mergeStripProps,
  resolveCyclepathBoundaryLineMode,
  resolveCyclepathBoundaryStrokeWidth,
  resolveCyclepathCenterLineMode,
  resolveCyclepathCenterStrokeWidth,
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
  displayUnit?: 'm' | 'cm'
  displayFactor?: number
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

function cyclepathMinWidth(strip: Strip): number {
  if (strip.type !== 'cyclepath') return STRIP_MIN_WIDTHS.cyclepath || 1
  if (strip.variant === 'lane-marked') return 1.85
  if (strip.variant === 'advisory') return 1.25
  if (strip.variant !== 'protected') return STRIP_MIN_WIDTHS.cyclepath || 1
  const props = getCyclepathStripProps(strip)
  return getProtectedCyclepathRule(props.pathType, props.protectedPlacement).editorMinWidth
}

function cyclepathGeometrySection(): StripPropertySectionDefinition {
  const base = geometrySection()
  return {
    ...base,
    fields: base.fields.map((field) => {
      if (field.kind === 'number' && field.id === 'width') {
        return {
          ...field,
          min: ({ strip }: StripPropertyContext) => cyclepathMinWidth(strip),
        }
      }
      return field
    }),
  }
}

function shouldSyncProtectedCyclepathWidth(currentWidth: number, currentDefaultWidth: number, nextDefaultWidth: number): boolean {
  return Math.abs(currentWidth - currentDefaultWidth) < 0.001 || currentWidth < nextDefaultWidth
}

function protectedCyclepathSection(strip: Strip): StripPropertySectionDefinition | null {
  if (strip.type !== 'cyclepath' || strip.variant !== 'protected') return null
  const props = getCyclepathStripProps(strip)

  return {
    id: 'cyclepath-protected',
    title: 'Radweg',
    fields: [
      {
        kind: 'choice',
        id: 'cyclepath-path-type',
        label: 'Richtung',
        getValue: ({ strip }) => getCyclepathStripProps(strip).pathType ?? 'one-way',
        applyValue: (value, { strip }) => {
          const currentProps = getCyclepathStripProps(strip)
          const currentRule = getProtectedCyclepathRule(currentProps.pathType, currentProps.protectedPlacement)
          const pathType = value as ReturnType<typeof getCyclepathStripProps>['pathType']
          const protectedPlacement = pathType === 'two-way'
            ? (currentProps.protectedPlacement ?? 'single-side')
            : 'single-side'
          const nextRule = getProtectedCyclepathRule(pathType, protectedPlacement)
          return {
            ...mergeStripProps(strip, { pathType, protectedPlacement }),
            ...(shouldSyncProtectedCyclepathWidth(strip.width, currentRule.defaultWidth, nextRule.defaultWidth)
              ? { width: nextRule.defaultWidth }
              : {}),
          }
        },
        options: () => [
          { value: 'one-way', label: 'Eine Richtung' },
          { value: 'two-way', label: 'Beide Richtungen' },
        ],
      },
      ...(props.pathType === 'two-way'
        ? [{
            kind: 'choice' as const,
            id: 'cyclepath-protected-placement',
            label: 'Führung',
            getValue: ({ strip }: StripPropertyContext) => getCyclepathStripProps(strip).protectedPlacement ?? 'single-side',
            applyValue: (value: string, { strip }: StripPropertyContext) => {
              const currentProps = getCyclepathStripProps(strip)
              const currentRule = getProtectedCyclepathRule('two-way', currentProps.protectedPlacement)
              const protectedPlacement = value as 'single-side' | 'both-sides'
              const nextRule = getProtectedCyclepathRule('two-way', protectedPlacement)
              return {
                ...mergeStripProps(strip, { protectedPlacement }),
                ...(shouldSyncProtectedCyclepathWidth(strip.width, currentRule.defaultWidth, nextRule.defaultWidth)
                  ? { width: nextRule.defaultWidth }
                  : {}),
              }
            },
            options: () => [
              { value: 'single-side', label: 'Einseitig' },
              { value: 'both-sides', label: 'Beidseitig' },
            ],
          }]
        : []),
    ],
  }
}

function sidewalkMinWidth(strip: Strip): number {
  if (strip.type !== 'sidewalk') return STRIP_MIN_WIDTHS.sidewalk || 1.5
  if (strip.variant === 'separated-bike') return 3.9
  if (strip.variant === 'shared-bike') return 2.0
  return STRIP_MIN_WIDTHS.sidewalk || 1.5
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

function cyclepathLineSections(strip: Strip): StripPropertySectionDefinition[] {
  if (strip.type !== 'cyclepath') return []
  const props = getCyclepathStripProps(strip)
  const boundaryMode = resolveCyclepathBoundaryLineMode(strip.variant, props.boundaryLineMode)
  const centerMode = resolveCyclepathCenterLineMode(strip.variant, props.centerLineMode, props.pathType)
  const [defaultBoundaryDashLength, defaultBoundaryGapLength] = getDefaultCyclepathBoundaryDashPattern(strip.variant)
  const [defaultCenterDashLength, defaultCenterGapLength] = getDefaultCyclepathCenterDashPattern()
  const lineOptions = [
    { value: 'dashed', label: 'Gestrichelt' },
    { value: 'solid', label: 'Durchgezogen' },
    { value: 'none', label: 'Keine' },
  ]

  const sections: StripPropertySectionDefinition[] = []

  if (strip.variant === 'protected') {
    sections.push({
      id: 'cyclepath-center-line',
      title: 'Linien',
      fields: [
        {
          kind: 'choice',
          id: 'cyclepath-center-line-mode',
          label: 'Mittellinie',
          getValue: ({ strip }) => {
            const currentProps = getCyclepathStripProps(strip)
            return resolveCyclepathCenterLineMode(strip.variant, currentProps.centerLineMode, currentProps.pathType)
          },
          applyValue: (value, { strip }) => mergeStripProps(strip, { centerLineMode: value }),
          options: () => lineOptions,
        },
        ...(centerMode !== 'none'
          ? [{
              kind: 'number' as const,
              id: 'cyclepath-center-line-stroke-width',
              label: 'Mittellinie Stärke',
              getValue: ({ strip }: StripPropertyContext) => resolveCyclepathCenterStrokeWidth(getCyclepathStripProps(strip).centerLineStrokeWidth),
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { centerLineStrokeWidth: value }),
              min: () => 0.01,
              step: 0.01,
              displayUnit: 'cm' as const,
              displayFactor: 100,
            }]
          : []),
        ...(centerMode === 'dashed'
          ? [
              {
                kind: 'number' as const,
                id: 'cyclepath-center-line-dash-length',
                label: 'Mittellinie Strichlänge',
                getValue: ({ strip }: StripPropertyContext) => getCyclepathStripProps(strip).centerLineDashLength ?? defaultCenterDashLength,
                applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { centerLineDashLength: value }),
                min: () => 0.1,
                step: 0.1,
                displayUnit: 'cm' as const,
                displayFactor: 100,
              },
              {
                kind: 'number' as const,
                id: 'cyclepath-center-line-gap-length',
                label: 'Mittellinie Lückenlänge',
                getValue: ({ strip }: StripPropertyContext) => getCyclepathStripProps(strip).centerLineGapLength ?? defaultCenterGapLength,
                applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { centerLineGapLength: value }),
                min: () => 0.1,
                step: 0.1,
                displayUnit: 'cm' as const,
                displayFactor: 100,
              },
            ]
          : []),
      ],
    })
  }

  sections.push({
    id: 'cyclepath-boundary-lines',
    title: sections.length === 0 ? 'Linien' : undefined,
    fields: [
      {
        kind: 'choice',
        id: 'cyclepath-boundary-line-mode',
        label: 'Begrenzungslinien',
        getValue: ({ strip }) => {
          const props = getCyclepathStripProps(strip)
          return resolveCyclepathBoundaryLineMode(strip.variant, props.boundaryLineMode)
        },
        applyValue: (value, { strip }) => mergeStripProps(strip, { boundaryLineMode: value }),
        options: () => lineOptions,
      },
      ...(boundaryMode !== 'none'
        ? [{
            kind: 'number' as const,
            id: 'cyclepath-boundary-line-stroke-width',
            label: 'Begrenzung Stärke',
            getValue: ({ strip }: StripPropertyContext) => resolveCyclepathBoundaryStrokeWidth(strip.variant, getCyclepathStripProps(strip).boundaryLineStrokeWidth),
            applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineStrokeWidth: value }),
            min: () => 0.01,
            step: 0.01,
            displayUnit: 'cm' as const,
            displayFactor: 100,
          }]
        : []),
      ...(boundaryMode === 'dashed'
        ? [
            {
              kind: 'number' as const,
              id: 'cyclepath-boundary-line-dash-length',
              label: 'Begrenzung Strichlänge',
              getValue: ({ strip }: StripPropertyContext) => getCyclepathStripProps(strip).boundaryLineDashLength ?? defaultBoundaryDashLength,
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineDashLength: value }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm' as const,
              displayFactor: 100,
            },
            {
              kind: 'number' as const,
              id: 'cyclepath-boundary-line-gap-length',
              label: 'Begrenzung Lückenlänge',
              getValue: ({ strip }: StripPropertyContext) => getCyclepathStripProps(strip).boundaryLineGapLength ?? defaultBoundaryGapLength,
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineGapLength: value }),
              min: () => 0.1,
              step: 0.1,
              displayUnit: 'cm' as const,
              displayFactor: 100,
            },
          ]
        : []),
    ],
  })

  return sections
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
        applyValue: (value) => {
          const variant = value as StripVariant

          return { variant }
        },
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
  cyclepath: ({ strip }) => [
    cyclepathGeometrySection(),
    protectedCyclepathSection(strip),
    ...cyclepathLineSections(strip),
  ].filter(Boolean) as StripPropertySectionDefinition[],
  sidewalk: () => [
    sidewalkGeometrySection(),
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
