import type { MarkingPropertySectionDefinition } from './types'

function islandVariantSection(): MarkingPropertySectionDefinition {
  return {
    id: 'island-variant',
    title: 'Bauart',
    fields: [
      {
        kind: 'choice',
        id: 'variant',
        label: 'Variante',
        getValue: ({ marking }) => marking.variant,
        applyValue: (value) => {
          const variant = value as 'median-island' | 'raised-paved'
          if (variant === 'raised-paved') {
            return { variant, surfaceType: 'paved', showCurbBorder: true, endShape: 'rounded' }
          }
          return { variant, surfaceType: 'green', showCurbBorder: true, endShape: 'rounded' }
        },
        options: () => [
          { value: 'median-island', label: 'Begrünt' },
          { value: 'raised-paved', label: 'Gepflastert' },
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
        getValue: ({ marking }) => marking.width || 2.50,
        applyValue: (value) => ({ width: value }),
        min: () => 1.0,
        max: ({ roadwayWidth }) => roadwayWidth != null ? Math.max(1.0, roadwayWidth) : 10.0,
        step: 0.25,
      },
      {
        kind: 'number',
        id: 'island-length',
        label: 'Länge',
        getValue: ({ marking }) => marking.length || 8.0,
        applyValue: (value) => ({ length: value }),
        min: () => 2.0,
        max: () => 50.0,
        step: 0.5,
      },
    ],
  }
}

function islandAppearanceSection(): MarkingPropertySectionDefinition {
  return {
    id: 'island-appearance',
    title: 'Erscheinung',
    fields: [
      {
        kind: 'choice',
        id: 'island-surface',
        label: 'Oberfläche',
        getValue: ({ marking }) => marking.surfaceType || 'green',
        applyValue: (value) => ({ surfaceType: value }),
        options: () => [
          { value: 'green', label: 'Begrünt' },
          { value: 'paved', label: 'Gepflastert' },
          { value: 'cobblestone', label: 'Kopfstein' },
        ],
      },
      {
        kind: 'choice',
        id: 'island-end-shape',
        label: 'Inselform',
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
        max: ({ marking }) => (marking.length || 8.0) * 0.4,
        step: 0.1,
        readOnly: ({ marking }) => (marking.endShape || 'rounded') === 'flat',
      },
    ],
  }
}

function islandCurbSection(): MarkingPropertySectionDefinition {
  return {
    id: 'island-curb',
    title: 'Bordstein',
    fields: [
      {
        kind: 'choice',
        id: 'island-curb-toggle',
        label: 'Bordstein',
        getValue: ({ marking }) => marking.showCurbBorder !== false ? 'on' : 'off',
        applyValue: (value) => ({ showCurbBorder: value === 'on' }),
        options: () => [
          { value: 'on', label: 'An' },
          { value: 'off', label: 'Aus' },
        ],
      },
    ],
  }
}

function islandApproachSection(): MarkingPropertySectionDefinition {
  return {
    id: 'island-approach',
    title: 'Zulaufmarkierung (Z 298)',
    fields: [
      {
        kind: 'choice',
        id: 'island-approach-toggle',
        label: 'Sperrfläche',
        getValue: ({ marking }) => marking.showApproachMarking !== false ? 'on' : 'off',
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
        getValue: ({ marking }) => marking.approachLength ?? 3.0,
        applyValue: (value) => ({ approachLength: value }),
        min: () => 1.0,
        max: () => 15.0,
        step: 0.5,
        readOnly: ({ marking }) => marking.showApproachMarking === false,
      },
    ],
  }
}

export function getIslandMarkingPropertySections(): MarkingPropertySectionDefinition[] {
  return [
    islandVariantSection(),
    islandDimensionsSection(),
    islandAppearanceSection(),
    islandCurbSection(),
    islandApproachSection(),
  ]
}
