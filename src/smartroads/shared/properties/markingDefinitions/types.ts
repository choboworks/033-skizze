import type { Marking } from '../../../types'

export interface MarkingPropertyContext {
  marking: Marking
}

export interface MarkingChoiceOption {
  value: string
  label: string
}

export interface MarkingChoiceFieldDefinition {
  kind: 'choice'
  id: string
  label: string
  getValue: (context: MarkingPropertyContext) => string | undefined
  applyValue: (value: string, context: MarkingPropertyContext) => Partial<Marking>
  options: (context: MarkingPropertyContext) => MarkingChoiceOption[]
}

export interface MarkingReadOnlyFieldDefinition {
  kind: 'readonly'
  id: string
  label: string
  getValue: (context: MarkingPropertyContext) => string
}

export type MarkingPropertyFieldDefinition =
  | MarkingChoiceFieldDefinition
  | MarkingReadOnlyFieldDefinition

export interface MarkingPropertySectionDefinition {
  id: string
  title?: string
  fields: MarkingPropertyFieldDefinition[]
}
