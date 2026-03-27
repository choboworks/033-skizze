import {
  DEFAULT_GUARDRAIL_GREEN_WIDTH,
  DEFAULT_GUARDRAIL_POST_SPACING,
  DEFAULT_GUARDRAIL_SHOULDER_WIDTH,
  GUARDRAIL_POST_SPACING_DEFAULTS,
  getGuardrailStripProps,
  mergeStripProps,
} from '../../../stripProps'
import { getStripDefaultWidth } from '../../../rules/stripRules'
import type { StripVariant } from '../../../types'
import { heightOnlyGeometrySection } from './shared'
import type { StripChoiceOption, StripPropertySectionDefinition } from './types'

/** Recalculate the strip width to include shoulder + green */
function recalcTotalWidth(
  baseVariant: string,
  showShoulder: boolean,
  shoulderWidth: number,
  showGreen: boolean,
  greenWidth: number,
): number {
  const railWidth = getStripDefaultWidth('guardrail', baseVariant as never)
  return railWidth + (showShoulder ? shoulderWidth : 0) + (showGreen ? greenWidth : 0)
}

function guardrailSection(): StripPropertySectionDefinition {
  return {
    id: 'guardrail',
    title: 'Leitplanke',
    fields: [
      {
        kind: 'number',
        id: 'guardrail-post-spacing',
        label: 'Pfostenabstand',
        getValue: ({ strip }) => {
          const props = getGuardrailStripProps(strip)
          return props.postSpacing ?? GUARDRAIL_POST_SPACING_DEFAULTS[strip.variant] ?? DEFAULT_GUARDRAIL_POST_SPACING
        },
        applyValue: (value, { strip }) => mergeStripProps(strip, { postSpacing: value }),
        min: () => 1.0,
        max: () => 4.0,
        step: 0.01,
        readOnly: ({ strip }) => strip.variant === 'betonwand',
        readOnlyLabel: () => 'keine Pfosten',
      },
    ],
  }
}

function kontextSection(): StripPropertySectionDefinition {
  return {
    id: 'guardrail-kontext',
    title: 'Kontext',
    fields: [
      {
        kind: 'choice',
        id: 'guardrail-shoulder-toggle',
        label: 'Randstreifen',
        getValue: ({ strip }) => getGuardrailStripProps(strip).showShoulder ? 'on' : 'off',
        applyValue: (value, { strip }) => {
          const props = getGuardrailStripProps(strip)
          const showShoulder = value === 'on'
          const shoulderW = props.shoulderWidth ?? DEFAULT_GUARDRAIL_SHOULDER_WIDTH
          return {
            width: recalcTotalWidth(strip.variant, showShoulder, shoulderW, props.showGreen, props.greenWidth),
            ...mergeStripProps(strip, { showShoulder }),
          }
        },
        options: () => [
          { value: 'on', label: 'An' },
          { value: 'off', label: 'Aus' },
        ],
      },
      {
        kind: 'number',
        id: 'guardrail-shoulder-width',
        label: 'Randstreifen Breite',
        displayUnit: 'cm',
        displayFactor: 100,
        getValue: ({ strip }) => getGuardrailStripProps(strip).shoulderWidth ?? DEFAULT_GUARDRAIL_SHOULDER_WIDTH,
        applyValue: (value, { strip }) => {
          const props = getGuardrailStripProps(strip)
          return {
            width: recalcTotalWidth(strip.variant, props.showShoulder, value, props.showGreen, props.greenWidth),
            ...mergeStripProps(strip, { shoulderWidth: value }),
          }
        },
        min: () => 0.25,
        max: () => 3.0,
        step: 0.05,
        readOnly: ({ strip }) => !getGuardrailStripProps(strip).showShoulder,
        readOnlyLabel: () => 'Randstreifen aus',
      },
      {
        kind: 'choice',
        id: 'guardrail-green-toggle',
        label: 'Grünstreifen',
        getValue: ({ strip }) => getGuardrailStripProps(strip).showGreen ? 'on' : 'off',
        applyValue: (value, { strip }) => {
          const props = getGuardrailStripProps(strip)
          const showGreen = value === 'on'
          const greenW = props.greenWidth ?? DEFAULT_GUARDRAIL_GREEN_WIDTH
          return {
            width: recalcTotalWidth(strip.variant, props.showShoulder, props.shoulderWidth, showGreen, greenW),
            ...mergeStripProps(strip, { showGreen }),
          }
        },
        options: () => [
          { value: 'on', label: 'An' },
          { value: 'off', label: 'Aus' },
        ],
      },
      {
        kind: 'number',
        id: 'guardrail-green-width',
        label: 'Grünstreifen Breite',
        displayUnit: 'cm',
        displayFactor: 100,
        getValue: ({ strip }) => getGuardrailStripProps(strip).greenWidth ?? DEFAULT_GUARDRAIL_GREEN_WIDTH,
        applyValue: (value, { strip }) => {
          const props = getGuardrailStripProps(strip)
          return {
            width: recalcTotalWidth(strip.variant, props.showShoulder, props.shoulderWidth, props.showGreen, value),
            ...mergeStripProps(strip, { greenWidth: value }),
          }
        },
        min: () => 0.10,
        max: () => 4.0,
        step: 0.05,
        readOnly: ({ strip }) => !getGuardrailStripProps(strip).showGreen,
        readOnlyLabel: () => 'Grünstreifen aus',
      },
    ],
  }
}

const GUARDRAIL_VARIANT_OPTIONS: StripChoiceOption[] = [
  { value: 'schutzplanke', label: 'Schutzplanke' },
  { value: 'betonwand', label: 'Betonwand' },
  { value: 'doppel', label: 'Doppel' },
]

function guardrailVariantSection(): StripPropertySectionDefinition {
  return {
    id: 'guardrail-variant',
    title: 'Bauart',
    fields: [
      {
        kind: 'choice',
        id: 'variant',
        label: 'Bauart',
        getValue: ({ strip }) => strip.variant,
        applyValue: (value, { strip }) => {
          const props = getGuardrailStripProps(strip)
          return {
            variant: value as StripVariant,
            width: recalcTotalWidth(value, props.showShoulder, props.shoulderWidth, props.showGreen, props.greenWidth),
          }
        },
        options: () => GUARDRAIL_VARIANT_OPTIONS,
      },
    ],
  }
}

export function getGuardrailPropertySections(): StripPropertySectionDefinition[] {
  return [
    heightOnlyGeometrySection(),
    guardrailVariantSection(),
    guardrailSection(),
    kontextSection(),
  ]
}
