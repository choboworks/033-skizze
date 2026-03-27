import type { MarkingType } from '../../../types'
import { getArrowPropertySections } from './arrow'
import { getCenterlinePropertySections } from './centerline'
import { getCrosswalkPropertySections } from './crosswalk'
import { getDefaultMarkingPropertySections } from './default'
import { getLaneBoundaryPropertySections } from './laneboundary'
import { getIslandMarkingPropertySections } from './island'
import { getStoplinePropertySections } from './stopline'
import type { MarkingPropertyContext, MarkingPropertySectionDefinition } from './types'

const MARKING_PROPERTY_BUILDERS: Partial<Record<MarkingType, (context: MarkingPropertyContext) => MarkingPropertySectionDefinition[]>> = {
  centerline: getCenterlinePropertySections,
  laneboundary: getLaneBoundaryPropertySections,
  arrow: getArrowPropertySections,
  crosswalk: getCrosswalkPropertySections,
  stopline: getStoplinePropertySections,
  'traffic-island': getIslandMarkingPropertySections,
}

export type {
  MarkingChoiceFieldDefinition,
  MarkingChoiceOption,
  MarkingNumberFieldDefinition,
  MarkingPropertyContext,
  MarkingPropertyFieldDefinition,
  MarkingPropertySectionDefinition,
  MarkingReadOnlyFieldDefinition,
} from './types'

export function getMarkingPropertySections(context: MarkingPropertyContext): MarkingPropertySectionDefinition[] {
  return (MARKING_PROPERTY_BUILDERS[context.marking.type] ?? getDefaultMarkingPropertySections)(context)
}
