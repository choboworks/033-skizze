import type { StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

export function getPathPropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(),
    variantSection('path-variant', 'Wegart', 'path'),
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
