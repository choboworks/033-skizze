import type { MarkingPropertySectionDefinition } from './types'
import { CENTERLINE_STROKE_WIDTH_OPTIONS, strokeWidthSection, variantSection } from './shared'

export function getCenterlinePropertySections(): MarkingPropertySectionDefinition[] {
  return [
    variantSection('centerline'),
    strokeWidthSection(CENTERLINE_STROKE_WIDTH_OPTIONS),
  ].filter(Boolean) as MarkingPropertySectionDefinition[]
}
