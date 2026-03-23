import type { StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

export function getGreenPropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(),
    variantSection('green-variant', 'Ausführung', 'green'),
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
