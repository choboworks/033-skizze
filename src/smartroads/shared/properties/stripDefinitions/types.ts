import type { Strip } from '../../../types'

export interface StripPropertyContext {
  strip: Strip
  roadLength?: number
}

export interface StripChoiceOption {
  value: string
  label: string
  title?: string
}

export interface StripNumberFieldDefinition {
  kind: 'number'
  id: string
  label: string
  getValue: (context: StripPropertyContext) => number
  applyValue: (value: number, context: StripPropertyContext) => Partial<Strip>
  min: (context: StripPropertyContext) => number
  max?: (context: StripPropertyContext) => number | undefined
  step?: number
  displayUnit?: 'm' | 'cm'
  displayFactor?: number
  readOnly?: (context: StripPropertyContext) => boolean
  readOnlyLabel?: (context: StripPropertyContext) => string
}

export interface StripChoiceFieldDefinition {
  kind: 'choice'
  id: string
  label: string
  getValue: (context: StripPropertyContext) => string | undefined
  applyValue: (value: string, context: StripPropertyContext) => Partial<Strip>
  options: (context: StripPropertyContext) => StripChoiceOption[]
}

export type StripPropertyFieldDefinition =
  | StripNumberFieldDefinition
  | StripChoiceFieldDefinition

export interface StripPropertySectionDefinition {
  id: string
  title?: string
  fields: StripPropertyFieldDefinition[]
}
