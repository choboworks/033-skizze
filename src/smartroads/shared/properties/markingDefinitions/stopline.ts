import type { MarkingPropertySectionDefinition } from './types'
import { widthDisplaySection } from './shared'

export function getStoplinePropertySections(): MarkingPropertySectionDefinition[] {
  return [widthDisplaySection()]
}
