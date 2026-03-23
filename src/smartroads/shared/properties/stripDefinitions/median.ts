import type { StripPropertySectionDefinition } from './types'
import { geometrySection, variantSection } from './shared'

export function getMedianPropertySections(): StripPropertySectionDefinition[] {
  return [
    geometrySection(),
    variantSection('median-variant', 'Trennung', 'median'),
  ].filter(Boolean) as StripPropertySectionDefinition[]
}
