import type { StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

export function getTramPropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(),
    variantSection('tram-variant', 'Gleistyp', 'tram'),
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
