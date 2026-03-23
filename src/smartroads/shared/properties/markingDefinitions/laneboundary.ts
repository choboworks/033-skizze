import type { MarkingPropertySectionDefinition } from './types'
import { BOUNDARY_STROKE_WIDTH_OPTIONS, strokeWidthSection, variantSection } from './shared'

export function getLaneBoundaryPropertySections(): MarkingPropertySectionDefinition[] {
  return [
    variantSection('laneboundary'),
    strokeWidthSection(BOUNDARY_STROKE_WIDTH_OPTIONS),
  ].filter(Boolean) as MarkingPropertySectionDefinition[]
}
