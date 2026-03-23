import { DEFAULT_PARKING_BAY_LENGTH, getParkingStripProps, mergeStripProps } from '../../../stripProps'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

export function getParkingPropertySections(): StripPropertySectionDefinition[] {
  return [
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
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
