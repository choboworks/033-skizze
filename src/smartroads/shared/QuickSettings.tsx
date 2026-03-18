import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Minus, Plus } from 'lucide-react'
import type { Strip } from '../types'
import { createStrip, totalWidth } from '../constants'

// ============================================================
// QuickSettings – Right sidebar, compact, editable inputs
// ============================================================

interface Props {
  strips: Strip[]
  length: number
  onUpdateStrips: (strips: Strip[]) => void
  onUpdateLength: (length: number) => void
}

type Side = 'left' | 'both' | 'right' | 'none'

function getSide(strips: Strip[], type: string): Side {
  const hasLeft = strips[0]?.type === type || strips[1]?.type === type
  const hasRight = strips[strips.length - 1]?.type === type || strips[strips.length - 2]?.type === type
  if (hasLeft && hasRight) return 'both'
  if (hasLeft) return 'left'
  if (hasRight) return 'right'
  return 'none'
}

function countLanes(strips: Strip[]): number {
  return strips.filter((s) => s.type === 'lane').length
}

// --- Editable number with +/- buttons ---
function NumberStepper({ value, onChange, min = 1, max = 999, step = 1, unit = '' }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))

  const commit = () => {
    const n = parseFloat(editValue)
    if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-1">
      <button
        className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        onClick={() => onChange(Math.max(min, value - step))}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <Minus size={11} />
      </button>
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
          className="w-12 h-6 text-center text-[12px] font-mono rounded-md"
          style={{ background: 'var(--bg)', border: '1px solid var(--accent)', color: 'var(--text)', outline: 'none' }}
        />
      ) : (
        <button
          className="w-12 h-6 text-center text-[12px] font-mono rounded-md transition-colors"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          onClick={() => { setEditValue(String(value)); setEditing(true) }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          {value}{unit}
        </button>
      )}
      <button
        className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        onClick={() => onChange(Math.min(max, value + step))}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        <Plus size={11} />
      </button>
    </div>
  )
}

// --- Side Toggle ---
function SideToggle({ label, value, onChange }: { label: string; value: Side; onChange: (s: Side) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <ToggleGroup.Root
        type="single" value={value}
        onValueChange={(v) => { if (v) onChange(v as Side) }}
        className="flex gap-px"
      >
        {(['left', 'both', 'right', 'none'] as Side[]).map((s) => (
          <ToggleGroup.Item
            key={s} value={s}
            className="w-7 h-6 text-[10px] font-semibold rounded-md flex items-center justify-center transition-colors"
            style={{
              background: value === s ? 'var(--accent-muted)' : 'var(--surface)',
              color: value === s ? 'var(--accent)' : 'var(--text-muted)',
              border: value === s ? '1px solid var(--accent)' : '1px solid var(--border)',
            }}
          >
            {s === 'left' ? 'L' : s === 'both' ? 'B' : s === 'right' ? 'R' : '—'}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}

export function QuickSettings({ strips, length, onUpdateStrips, onUpdateLength }: Props) {
  const laneCount = countLanes(strips)
  const tw = totalWidth(strips)

  const addLane = () => {
    const lastLaneIdx = strips.reduce((acc, s, i) => s.type === 'lane' ? i : acc, -1)
    const newStrips = [...strips]
    newStrips.splice(lastLaneIdx + 1, 0, createStrip('lane', 'standard', 'down'))
    onUpdateStrips(newStrips)
  }

  const removeLane = () => {
    if (laneCount <= 1) return
    const lastLaneIdx = strips.reduce((acc, s, i) => s.type === 'lane' ? i : acc, -1)
    if (lastLaneIdx >= 0) onUpdateStrips(strips.filter((_, i) => i !== lastLaneIdx))
  }

  const setSide = (type: 'sidewalk' | 'cyclepath' | 'parking', side: Side) => {
    let newStrips = strips.filter((s) => s.type !== type)
    if (side === 'left' || side === 'both') newStrips = [createStrip(type), ...newStrips]
    if (side === 'right' || side === 'both') newStrips = [...newStrips, createStrip(type)]
    onUpdateStrips(newStrips)
  }

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
        Quick Settings
      </div>

      {/* Length */}
      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Länge</span>
        <NumberStepper value={length} onChange={onUpdateLength} min={5} max={200} step={5} unit="m" />
      </div>

      {/* Lanes */}
      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Spuren</span>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            onClick={removeLane}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <Minus size={11} />
          </button>
          <span className="w-12 h-6 text-center text-[12px] font-mono rounded-md flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {laneCount}
          </span>
          <button
            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            onClick={addLane}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <Plus size={11} />
          </button>
        </div>
      </div>

      <div className="h-px" style={{ background: 'var(--border)' }} />

      <SideToggle label="Gehweg" value={getSide(strips, 'sidewalk')} onChange={(s) => setSide('sidewalk', s)} />
      <SideToggle label="Radweg" value={getSide(strips, 'cyclepath')} onChange={(s) => setSide('cyclepath', s)} />
      <SideToggle label="Parken" value={getSide(strips, 'parking')} onChange={(s) => setSide('parking', s)} />

      <div className="h-px" style={{ background: 'var(--border)' }} />

      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {tw.toFixed(1)}m breit · {length}m lang
      </div>
    </div>
  )
}
