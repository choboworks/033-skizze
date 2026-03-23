import type { MarkingPropertySectionDefinition } from './types'
import { variantSection } from './shared'

export function getArrowPropertySections(): MarkingPropertySectionDefinition[] {
  return [
    variantSection('arrow'),
  ].filter(Boolean) as MarkingPropertySectionDefinition[]
}
