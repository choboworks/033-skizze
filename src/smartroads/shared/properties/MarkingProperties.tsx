import * as ToggleGroup from '@radix-ui/react-toggle-group'
import type { Marking } from '../../types'
import { DEFAULT_MARKING_COLOR } from '../../constants'
import { MARKING_TYPE_LABELS } from '@/constants/shared'
import { ElementColorField } from './ElementColorField'
import {
  getMarkingPropertySections,
  type MarkingChoiceFieldDefinition,
  type MarkingPropertyFieldDefinition,
  type MarkingReadOnlyFieldDefinition,
} from './markingDefinitions/registry'

// ============================================================
// MarkingProperties – Properties panel for a selected marking
// ============================================================

interface Props {
  marking: Marking
  onUpdate: (changes: Partial<Marking>) => void
}

function renderChoiceField(
  field: MarkingChoiceFieldDefinition,
  marking: Marking,
  onUpdate: (changes: Partial<Marking>) => void,
) {
  const context = { marking }

  return (
    <div key={field.id} className="flex flex-col gap-2">
      <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>{field.label}</span>
      <ToggleGroup.Root
        type="single"
        value={field.getValue(context)}
        onValueChange={(value) => { if (value) onUpdate(field.applyValue(value, context)) }}
        className="flex flex-wrap"
        style={{ gap: 6, rowGap: 8 }}
      >
        {field.options(context).map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            className="toggle-btn flex items-center justify-center"
            style={{ height: 28, padding: '0 10px', borderRadius: 9999, fontSize: 10.5, fontWeight: 600 }}
            data-active={field.getValue(context) === option.value}
          >
            {option.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}

function renderReadOnlyField(field: MarkingReadOnlyFieldDefinition, marking: Marking) {
  const context = { marking }
  return (
    <div key={field.id} className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>{field.label}</span>
      <span className="text-[13px] font-mono" style={{ color: 'var(--text-muted)' }}>
        {field.getValue(context)}
      </span>
    </div>
  )
}

function renderField(
  field: MarkingPropertyFieldDefinition,
  marking: Marking,
  onUpdate: (changes: Partial<Marking>) => void,
) {
  if (field.kind === 'choice') return renderChoiceField(field, marking, onUpdate)
  return renderReadOnlyField(field, marking)
}

export function MarkingProperties({ marking, onUpdate }: Props) {
  const label = MARKING_TYPE_LABELS[marking.type] || marking.type
  const sections = getMarkingPropertySections({ marking })

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {/* Type label */}
      <div className="text-[13px] font-semibold text-center" style={{ color: 'var(--text)' }}>
        {label}
      </div>

      {sections.map((section) => (
        <div key={section.id} className="flex flex-col" style={{ gap: 10 }}>
          {section.title && (
            <span className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>
              {section.title}
            </span>
          )}
          {section.fields.map((field) => renderField(field, marking, onUpdate))}
        </div>
      ))}

      <ElementColorField
        value={marking.color || DEFAULT_MARKING_COLOR}
        hasCustomColor={Boolean(marking.color)}
        onChange={(color) => onUpdate({ color })}
        onReset={() => onUpdate({ color: undefined })}
      />
    </div>
  )
}
