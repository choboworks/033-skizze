import { DEFAULT_PARKING_ANGLE, getParkingStripProps, mergeStripProps, PARKING_BAY_DEFAULTS } from '../../../stripProps'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

export function getParkingPropertySections(context: StripPropertyContext): StripPropertySectionDefinition[] {
  const variant = context.strip.variant
  const isAngled = variant === 'angled'

  const bayLabel = variant === 'perpendicular'
    ? 'Stellplatzbreite'
    : variant === 'angled'
      ? 'Stellplatzabstand'
      : 'Stellplatzlänge'

  const defaultBay = PARKING_BAY_DEFAULTS[variant] ?? 5.70

  return [
    geometrySection(),
    variantSection('parking-variant', 'Parkart', 'parking'),
    {
      id: 'parking-details',
      title: 'Stellplätze',
      fields: [
        {
          kind: 'number',
          id: 'parking-bay-length',
          label: bayLabel,
          getValue: ({ strip }: StripPropertyContext) => getParkingStripProps(strip).bayLength ?? defaultBay,
          applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { bayLength: value }),
          min: () => 1.5,
          step: 0.25,
        },
        ...(isAngled
          ? [{
              kind: 'number' as const,
              id: 'parking-angle',
              label: 'Aufstellwinkel',
              getValue: ({ strip }: StripPropertyContext) => getParkingStripProps(strip).angle ?? DEFAULT_PARKING_ANGLE,
              applyValue: (value: number, { strip }: StripPropertyContext) => mergeStripProps(strip, { angle: value }),
              min: () => 30,
              max: () => 75 as number | undefined,
              step: 5,
              displayUnit: '°' as const,
              displayFactor: 1,
            }]
          : []),
      ],
    },
    {
      id: 'parking-marking',
      title: 'Markierung',
      fields: [
        {
          kind: 'choice' as const,
          id: 'parking-marking-style',
          label: 'Markierung',
          getValue: ({ strip }: StripPropertyContext) => getParkingStripProps(strip).markingStyle ?? 'solid',
          applyValue: (value: string, { strip }: StripPropertyContext) => mergeStripProps(strip, { markingStyle: value }),
          options: () => [
            { value: 'solid', label: 'Durchgehend' },
            { value: 'dashed', label: 'Unterbrochen' },
            { value: 'none', label: 'Keine' },
          ],
        },
      ],
    },
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
