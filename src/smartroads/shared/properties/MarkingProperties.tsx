import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Minus, Plus } from 'lucide-react'
import type { LinkedCrossingType, Marking } from '../../types'
import { DEFAULT_MARKING_COLOR } from '../../constants'
import { DEFAULT_BIKE_CROSSING_COLOR } from '../../rules/markingRules'
import { MARKING_TYPE_LABELS } from '@/constants/shared'
import { ElementColorField } from './ElementColorField'
import {
  getMarkingPropertySections,
  type MarkingChoiceFieldDefinition,
  type MarkingNumberFieldDefinition,
  type MarkingPropertyFieldDefinition,
  type MarkingReadOnlyFieldDefinition,
} from './markingDefinitions/registry'

// ============================================================
// MarkingProperties – Properties panel for a selected marking
// ============================================================

interface Props {
  marking: Marking
  roadwayWidth?: number
  linkedCrossingType?: LinkedCrossingType
  linkedCrossing?: Marking
  onUpdate: (changes: Partial<Marking>) => void
}

function renderChoiceField(
  field: MarkingChoiceFieldDefinition,
  context: { marking: Marking; roadwayWidth?: number },
  onUpdate: (changes: Partial<Marking>) => void,
) {
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

function MarkingNumberStepper({
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
  displayUnit?: string
  displayFactor?: number
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(Math.round(value * displayFactor * 100) / 100))

  const clamp = (next: number) => {
    const boundedMax = max != null ? Math.min(max, next) : next
    return Math.max(min, Math.round(boundedMax * 100) / 100)
  }

  const formatDisplayValue = (v: number) => {
    const scaled = Math.round(v * displayFactor * 100) / 100
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

function renderNumberField(
  field: MarkingNumberFieldDefinition,
  context: { marking: Marking; roadwayWidth?: number },
  onUpdate: (changes: Partial<Marking>) => void,
) {
  const isReadOnly = field.readOnly?.(context) ?? false
  const value = field.getValue(context)
  const min = field.min(context)
  const max = field.max?.(context)
  const unit = field.displayUnit ?? 'm'
  const displayFactor = field.displayFactor ?? 1
  const formatDisplayValue = (raw: number) => {
    const scaled = Math.round(raw * displayFactor * 100) / 100
    return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(2).replace(/\.?0+$/, '')
  }

  return (
    <div key={field.id} className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>{field.label}</span>
      {isReadOnly ? (
        <span className="text-[13px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {formatDisplayValue(value)} {unit}
        </span>
      ) : (
        <MarkingNumberStepper
          value={value}
          onChange={(v) => onUpdate(field.applyValue(v, context))}
          min={min}
          max={max}
          step={field.step ?? 0.25}
          displayUnit={unit}
          displayFactor={displayFactor}
        />
      )}
    </div>
  )
}

function renderField(
  field: MarkingPropertyFieldDefinition,
  context: { marking: Marking; roadwayWidth?: number },
  onUpdate: (changes: Partial<Marking>) => void,
) {
  if (field.kind === 'choice') return renderChoiceField(field, context, onUpdate)
  if (field.kind === 'number') return renderNumberField(field, context, onUpdate)
  return renderReadOnlyField(field, context.marking)
}

export function MarkingProperties({ marking, roadwayWidth, linkedCrossingType, linkedCrossing, onUpdate }: Props) {
  const label = MARKING_TYPE_LABELS[marking.type] || marking.type
  const context = { marking, roadwayWidth, linkedCrossingType, linkedCrossing }
  const sections = getMarkingPropertySections(context)
  const linkedBikeCrossingColorTarget = (
    marking.type === 'traffic-island' &&
    linkedCrossingType === 'bike-crossing' &&
    linkedCrossing?.type === 'bike-crossing' &&
    (linkedCrossing.bikeCrossingSurfaceType ?? 'cyclepath') === 'cyclepath'
  ) ? linkedCrossing : null
  const directBikeCrossingColorTarget = (
    marking.type === 'bike-crossing' &&
    (marking.bikeCrossingSurfaceType ?? 'cyclepath') === 'cyclepath'
  ) ? marking : null
  const defaultColorTarget = (
    marking.type !== 'traffic-island' &&
    marking.type !== 'bike-crossing'
  ) ? marking : null
  const colorTarget = linkedBikeCrossingColorTarget ?? directBikeCrossingColorTarget ?? defaultColorTarget
  const colorFallback = colorTarget?.type === 'bike-crossing' ? DEFAULT_BIKE_CROSSING_COLOR : DEFAULT_MARKING_COLOR

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
          {section.fields.map((field) => renderField(field, context, onUpdate))}
        </div>
      ))}

      {colorTarget && (
        <ElementColorField
          value={colorTarget.color || colorFallback}
          hasCustomColor={Boolean(colorTarget.color)}
          onChange={(color) => onUpdate({ color })}
          onReset={() => onUpdate({ color: undefined })}
        />
      )}
    </div>
  )
}
