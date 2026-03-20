import { useAppStore } from '@/store'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { ColorPicker } from './ColorPicker'
import { useState } from 'react'

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        className="surface-btn flex items-center justify-between w-full px-4 py-2.5"
        style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none' }}
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  )
}

export function Inspector() {
  const selection = useAppStore((s) => s.selection)
  const objects = useAppStore((s) => s.objects)
  const updateObject = useAppStore((s) => s.updateObject)

  // No selection
  if (selection.length === 0) {
    return (
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="panel-header-title">Eigenschaften</span>
        </div>
      </div>
    )
  }

  // Multi-selection
  if (selection.length > 1) {
    return (
      <>
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="panel-header-title">Eigenschaften</span>
          </div>
        </div>
        <div className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {selection.length} Objekte ausgewählt
        </div>
      </>
    )
  }

  // Single selection
  const obj = objects[selection[0]]
  if (!obj) return null

  const update = (changes: Record<string, unknown>) => updateObject(obj.id, changes)

  return (
    <>
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="panel-header-title">Eigenschaften</span>
        </div>
      </div>

      {/* Bezeichnung - always visible, compact */}
      <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <input
          type="text"
          value={obj.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder={obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}
          className="field-input w-full"
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Deckkraft */}
      <Section title="Deckkraft">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(obj.opacity * 100)}
            onChange={(e) => update({ opacity: parseInt(e.target.value) / 100 })}
            className="flex-1 accent-accent cursor-pointer"
          />
          <span className="text-sm font-mono w-10 text-right" style={{ color: 'var(--text)' }}>
            {Math.round(obj.opacity * 100)}%
          </span>
        </div>
      </Section>

      {/* Kontur */}
      <Section title="Kontur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Breite</span>
          <span className="text-sm font-mono" style={{ color: 'var(--text)' }}>{obj.strokeWidth}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={20}
          step={0.5}
          value={obj.strokeWidth}
          onChange={(e) => update({ strokeWidth: parseFloat(e.target.value) })}
          className="w-full accent-accent cursor-pointer mb-3"
        />
        <ColorPicker
          label="Kontur"
          value={obj.strokeColor}
          onChange={(v) => update({ strokeColor: v })}
        />
      </Section>

      {/* Füllung */}
      <Section title="Füllung">
        <ColorPicker
          label="Füllung"
          value={obj.fillColor}
          onChange={(v) => update({ fillColor: v })}
        />
      </Section>
    </>
  )
}
