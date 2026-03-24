import { STRIP_MIN_WIDTHS } from '../../../constants'
import { getProtectedCyclepathRule, getStripEditorMinWidth } from '../../../rules/stripRules'
import {
  DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH,
  getCyclepathStripProps,
  getDefaultCyclepathBoundaryDashPattern,
  getDefaultCyclepathCenterDashPattern,
  mergeStripProps,
  resolveCyclepathBoundaryLineMode,
  resolveCyclepathBoundaryStrokeWidth,
  resolveCyclepathCenterLineMode,
  resolveCyclepathCenterStrokeWidth,
} from '../../../stripProps'
import type { Strip } from '../../../types'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection } from './shared'

function cyclepathMinWidth(strip: Strip): number {
  if (strip.type !== 'cyclepath') return STRIP_MIN_WIDTHS.cyclepath || 1
  if (strip.variant === 'lane-marked' || strip.variant === 'advisory') {
    return getStripEditorMinWidth('cyclepath', strip.variant)
  }
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

function overlayCyclepathSection(strip: Strip): StripPropertySectionDefinition | null {
  if (strip.type !== 'cyclepath' || (strip.variant !== 'advisory' && strip.variant !== 'lane-marked')) return null

  return {
    id: 'cyclepath-overlay',
    title: 'Einbau',
    fields: [
      {
        kind: 'number',
        id: 'cyclepath-safety-buffer-width',
        label: 'Sicherheitsstreifen',
        getValue: ({ strip }) => getCyclepathStripProps(strip).safetyBufferWidth ?? DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH,
        applyValue: (value, { strip }) => mergeStripProps(strip, { safetyBufferWidth: value }),
        min: () => 0,
        step: 0.05,
      },
    ],
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
          const currentProps = getCyclepathStripProps(strip)
          return resolveCyclepathBoundaryLineMode(strip.variant, currentProps.boundaryLineMode)
        },
        applyValue: (value, { strip }) => mergeStripProps(strip, { boundaryLineMode: value }),
        options: () => lineOptions,
      },
      ...(boundaryMode !== 'none' && strip.variant === 'protected'
        ? [{
            kind: 'choice' as const,
            id: 'cyclepath-boundary-line-sides',
            label: 'Begrenzung Seiten',
            getValue: ({ strip }: StripPropertyContext) => getCyclepathStripProps(strip).boundaryLineSides ?? 'both',
            applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, { boundaryLineSides: value }),
            options: () => [
              { value: 'both', label: 'Beide' },
              { value: 'left', label: 'Links' },
              { value: 'right', label: 'Rechts' },
            ],
          }]
        : []),
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

export function getCyclepathPropertySections(context: StripPropertyContext): StripPropertySectionDefinition[] {
  const { strip } = context
  return [
    cyclepathGeometrySection(),
    protectedCyclepathSection(strip),
    overlayCyclepathSection(strip),
    ...cyclepathLineSections(strip),
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
