import { MARKING_RULES } from '../../../rules/markingRules'
import type { MarkingPropertyContext, MarkingPropertySectionDefinition } from './types'
import { widthDisplaySection } from './shared'

function crossingAidSection(context: MarkingPropertyContext): MarkingPropertySectionDefinition | null {
  if (!context.marking.linkedIslandId) return null

  return {
    id: 'crosswalk-link',
    title: 'Querungshilfe',
    fields: [
      {
        kind: 'readonly',
        id: 'crosswalk-link-state',
        label: 'Kopplung',
        getValue: () => 'Mit Verkehrsinsel gekoppelt',
      },
    ],
  }
}

function crosswalkLengthSection(): MarkingPropertySectionDefinition {
  return {
    id: 'crosswalk-length',
    title: 'Furt',
    fields: [
      {
        kind: 'number',
        id: 'crosswalk-length',
        label: 'Furtbreite',
        getValue: ({ marking }) => marking.length ?? MARKING_RULES.crosswalk.defaultLength,
        applyValue: (value) => ({ length: value }),
        min: () => MARKING_RULES.crosswalk.minLength,
        max: () => MARKING_RULES.crosswalk.maxLength,
        step: 0.5,
      },
    ],
  }
}

export function getCrosswalkPropertySections(context: MarkingPropertyContext): MarkingPropertySectionDefinition[] {
  const sections: MarkingPropertySectionDefinition[] = []
  const linkedSection = crossingAidSection(context)
  if (linkedSection) sections.push(linkedSection)
  sections.push(crosswalkLengthSection())
  sections.push(widthDisplaySection())
  return sections
}
