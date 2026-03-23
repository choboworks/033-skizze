import type { StripPropertySectionDefinition } from './types'
import { geometrySection } from './shared'

export function getShoulderPropertySections(): StripPropertySectionDefinition[] {
  return [geometrySection()]
}
