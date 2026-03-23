import type { StripPropertySectionDefinition } from './types'
import { geometrySection, longitudinalSection } from './shared'

export function getBusPropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(false),
    longitudinalSection('bus'),
  ]
}
