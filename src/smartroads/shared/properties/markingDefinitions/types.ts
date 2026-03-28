import type { LinkedCrossingType, Marking } from '../../../types'

export interface MarkingPropertyContext {
  marking: Marking
  roadwayWidth?: number
  linkedCrossingType?: LinkedCrossingType
  linkedCrossing?: Marking
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

export interface MarkingNumberFieldDefinition {
  kind: 'number'
  id: string
  label: string
  getValue: (context: MarkingPropertyContext) => number
  applyValue: (value: number, context: MarkingPropertyContext) => Partial<Marking>
  min: (context: MarkingPropertyContext) => number
  max?: (context: MarkingPropertyContext) => number
  step?: number
  displayUnit?: string
  displayFactor?: number
  readOnly?: (context: MarkingPropertyContext) => boolean
}

export type MarkingPropertyFieldDefinition =
  | MarkingChoiceFieldDefinition
  | MarkingReadOnlyFieldDefinition
  | MarkingNumberFieldDefinition

export interface MarkingPropertySectionDefinition {
  id: string
  title?: string
  fields: MarkingPropertyFieldDefinition[]
}
