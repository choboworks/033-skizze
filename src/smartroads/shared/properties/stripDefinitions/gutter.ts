import type { StripPropertySectionDefinition } from './types'
import { geometrySection } from './shared'

export function getGutterPropertySections(): StripPropertySectionDefinition[] {
  return [geometrySection()]
}
