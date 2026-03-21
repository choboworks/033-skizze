import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Minus, Plus } from 'lucide-react'
import type { Strip, StripVariant } from '../../types'
import { STRIP_LABELS, STRIP_MIN_WIDTHS, FIXED_WIDTH_STRIPS, VARIANT_LABELS } from '../../constants'

// ============================================================
// StripProperties – Properties panel for a selected strip
// ============================================================

const STRIP_VARIANT_OPTIONS: Partial<Record<string, { value: StripVariant; label: string }[]>> = {
  lane: [
    { value: 'standard', label: 'Standard' },
    { value: 'turn-left', label: 'Abbieger L' },
    { value: 'turn-right', label: 'Abbieger R' },
    { value: 'multi-use', label: 'Mehrzweck' },
  ],
  cyclepath: [
    { value: 'protected', label: 'Baulich getr.' },
    { value: 'lane-marked', label: 'Radfahrstr.' },
    { value: 'advisory', label: 'Schutzstr.' },
  ],
  sidewalk: [
    { value: 'standard', label: 'Standard' },
    { value: 'shared-bike', label: 'Gem. Rad' },
    { value: 'separated-bike', label: 'Getr. Rad' },
  ],
  parking: [
    { value: 'parallel', label: 'Längs' },
    { value: 'angled', label: 'Schräg' },
    { value: 'perpendicular', label: 'Quer' },
  ],
  median: [
    { value: 'marking-only', label: 'Markierung' },
    { value: 'green-median', label: 'Grün' },
    { value: 'barrier', label: 'Leitplanke' },
  ],
  green: [
    { value: 'standard', label: 'Standard' },
    { value: 'tree-strip', label: 'Baumstreifen' },
  ],
}

function WidthStepper({ value, onChange, min }: { value: number; onChange: (v: number) => void; min: number }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))

  const commit = () => {
    const n = parseFloat(editValue)
    if (!isNaN(n)) onChange(Math.max(min, Math.round(n * 100) / 100))
    setEditing(false)
  }

  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <button
        className="toggle-btn w-8 h-8 rounded-lg flex items-center justify-center"
        onClick={() => onChange(Math.max(min, Math.round((value - 0.25) * 100) / 100))}
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
          onClick={() => { setEditValue(String(value)); setEditing(true) }}
        >
          {value}m
        </button>
      )}
      <button
        className="toggle-btn w-8 h-8 rounded-lg flex items-center justify-center"
        onClick={() => onChange(Math.round((value + 0.25) * 100) / 100)}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}

interface Props {
  strip: Strip
  onUpdate: (changes: Partial<Strip>) => void
}

export function StripProperties({ strip, onUpdate }: Props) {
  const label = STRIP_LABELS[strip.type] || strip.type
  const isFixed = FIXED_WIDTH_STRIPS.includes(strip.type)
  const minWidth = STRIP_MIN_WIDTHS[strip.type] || 0.10
  const variants = STRIP_VARIANT_OPTIONS[strip.type]
  const hasDirection = strip.type === 'lane' || strip.type === 'bus'

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {/* Type label */}
      <div className="text-[13px] font-semibold text-center" style={{ color: 'var(--text)' }}>
        {label}
      </div>

      {/* Width */}
      {!isFixed ? (
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Breite</span>
          <WidthStepper value={strip.width} onChange={(w) => onUpdate({ width: w })} min={minWidth} />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Breite</span>
          <span className="text-[13px] font-mono" style={{ color: 'var(--text-muted)' }}>{strip.width}m (fix)</span>
        </div>
      )}

      {/* Direction (lanes only) */}
      {hasDirection && (
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Richtung</span>
          <ToggleGroup.Root
            type="single"
            value={strip.direction || 'up'}
            onValueChange={(v) => { if (v) onUpdate({ direction: v as 'up' | 'down' }) }}
            className="flex" style={{ gap: 6 }}
          >
            <ToggleGroup.Item
              value="up"
              className="toggle-btn flex items-center justify-center"
              style={{ width: 28, height: 28, borderRadius: 9999, fontSize: 14 }}
              data-active={strip.direction === 'up'}
            >
              ↑
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="down"
              className="toggle-btn flex items-center justify-center"
              style={{ width: 28, height: 28, borderRadius: 9999, fontSize: 14 }}
              data-active={strip.direction === 'down'}
            >
              ↓
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      )}

      {/* Variant */}
      {variants && variants.length > 1 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Variante</span>
          <ToggleGroup.Root
            type="single"
            value={strip.variant}
            onValueChange={(v) => { if (v) onUpdate({ variant: v as StripVariant }) }}
            className="flex flex-wrap"
            style={{ gap: 6, rowGap: 8 }}
          >
            {variants.map((v) => (
              <ToggleGroup.Item
                key={v.value}
                value={v.value}
                className="toggle-btn flex items-center justify-center"
                style={{ height: 28, padding: '0 10px', borderRadius: 9999, fontSize: 10.5, fontWeight: 600 }}
                data-active={strip.variant === v.value}
                title={VARIANT_LABELS[v.value] || v.label}
              >
                {v.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
      )}
    </div>
  )
}
