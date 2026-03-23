import type { StripPropertySectionDefinition } from './types'
import { geometrySection, longitudinalSection } from './shared'

export function getLanePropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(false),
    longitudinalSection('lane'),
  ]
}
