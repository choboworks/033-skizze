import { STRIP_MIN_WIDTHS } from '../../../constants'
import type { Strip } from '../../../types'
import type { StripPropertyContext, StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

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

export function getSidewalkPropertySections(): StripPropertySectionDefinition[] {
  return [
    sidewalkGeometrySection(),
    variantSection('sidewalk-variant', 'Nutzung', 'sidewalk'),
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
