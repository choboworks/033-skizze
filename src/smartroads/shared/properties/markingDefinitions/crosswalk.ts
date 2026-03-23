import type { MarkingPropertySectionDefinition } from './types'
import { widthDisplaySection } from './shared'

export function getCrosswalkPropertySections(): MarkingPropertySectionDefinition[] {
  return [widthDisplaySection()]
}
