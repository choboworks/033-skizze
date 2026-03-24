import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Minus, Plus } from 'lucide-react'
import type { Strip } from '../../types'
import { getStripDisplayLabel, getStripSwatchColor } from '../../constants'
import {
  getStripPropertySections,
  type StripChoiceFieldDefinition,
  type StripNumberFieldDefinition,
  type StripPropertyFieldDefinition,
} from './stripPropertyRegistry'
import { ElementColorField } from './ElementColorField'

// ============================================================
// StripProperties - Generic strip property renderer
// Base geometry is shared; type-specific sections come from the registry.
// ============================================================

function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 0.25,
  displayUnit = 'm',
  displayFactor = 1,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max?: number
  step?: number
  displayUnit?: 'm' | 'cm'
  displayFactor?: number
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(Math.round(value * displayFactor * 100) / 100))

  const clamp = (next: number) => {
    const boundedMax = max != null ? Math.min(max, next) : next
    return Math.max(min, Math.round(boundedMax * 100) / 100)
  }

  const formatDisplayValue = (next: number) => {
    const scaled = Math.round(next * displayFactor * 100) / 100
    return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(2).replace(/\.?0+$/, '')
  }

  const commit = () => {
    const n = parseFloat(editValue)
    if (!isNaN(n)) onChange(clamp(n / displayFactor))
    setEditing(false)
  }

  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <button
        className="toggle-btn w-8 h-8 rounded-lg flex items-center justify-center"
        onClick={() => onChange(clamp(value - step))}
      >
        <Minus size={13} />
      </button>
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="w-16 h-8 text-center text-[13px] font-mono rounded-lg"
          style={{ background: 'var(--panel-control-bg)', border: '1px solid var(--accent)', color: 'var(--text)', outline: 'none' }}
        />
      ) : (
        <button
          className="toggle-btn w-16 h-8 text-center text-[13px] font-mono rounded-lg"
          style={{ color: 'var(--text)' }}
          onClick={() => { setEditValue(formatDisplayValue(value)); setEditing(true) }}
        >
          {formatDisplayValue(value)}{displayUnit}
        </button>
      )}
      <button
        className="toggle-btn w-8 h-8 rounded-lg flex items-center justify-center"
        onClick={() => onChange(clamp(value + step))}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}

interface Props {
  strip: Strip
  roadLength?: number
  onUpdate: (changes: Partial<Strip>) => void
}

function renderNumberField(
  field: StripNumberFieldDefinition,
  strip: Strip,
  roadLength: number | undefined,
  onUpdate: (changes: Partial<Strip>) => void,
) {
  const context = { strip, roadLength }
  const isReadOnly = field.readOnly?.(context) ?? false

  return (
    <div key={field.id} className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>{field.label}</span>
      {isReadOnly ? (
        <span className="text-[13px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {field.readOnlyLabel?.(context) ?? `${field.getValue(context)}m`}
        </span>
      ) : (
        <NumberStepper
          value={field.getValue(context)}
          onChange={(value) => onUpdate(field.applyValue(value, context))}
          min={field.min(context)}
          max={field.max?.(context)}
          step={field.step}
          displayUnit={field.displayUnit}
          displayFactor={field.displayFactor}
        />
      )}
    </div>
  )
}

function renderChoiceField(
  field: StripChoiceFieldDefinition,
  strip: Strip,
  roadLength: number | undefined,
  onUpdate: (changes: Partial<Strip>) => void,
) {
  const context = { strip, roadLength }
  const options = field.options(context)

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
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            className="toggle-btn flex items-center justify-center"
            style={{ height: 28, padding: '0 10px', borderRadius: 9999, fontSize: 10.5, fontWeight: 600 }}
            data-active={field.getValue(context) === option.value}
            title={option.title}
          >
            {option.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}

function renderField(
  field: StripPropertyFieldDefinition,
  strip: Strip,
  roadLength: number | undefined,
  onUpdate: (changes: Partial<Strip>) => void,
) {
  if (field.kind === 'number') {
    return renderNumberField(field, strip, roadLength, onUpdate)
  }
  return renderChoiceField(field, strip, roadLength, onUpdate)
}

export function StripProperties({ strip, roadLength, onUpdate }: Props) {
  const label = getStripDisplayLabel(strip)
  const sections = getStripPropertySections({ strip, roadLength })
  const resolvedColor = getStripSwatchColor(strip)

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
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
          {section.fields.map((field) => renderField(field, strip, roadLength, onUpdate))}
        </div>
      ))}

      {strip.type === 'cyclepath' && (
        <ElementColorField
          value={resolvedColor}
          hasCustomColor={Boolean(strip.color)}
          onChange={(color) => onUpdate({ color })}
          onReset={() => onUpdate({ color: undefined })}
        />
      )}
    </div>
  )
}
