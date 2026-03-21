import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Minus, Plus, ChevronDown } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'
import type { Strip, RoadClass } from '../types'
import { createStrip, totalWidth, ROAD_CLASS_CONFIG } from '../constants'
import { calculateAutoScale, PAGE_WIDTH_MM } from '@/utils/scale'

// ============================================================
// QuickSettings – Modern control cards for road configuration
// ============================================================

interface Props {
  strips: Strip[]
  length: number
  roadClass: RoadClass
  onUpdateStrips: (strips: Strip[]) => void
  onUpdateLength: (length: number) => void
  onUpdateRoadClass: (rc: RoadClass) => void
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
    <div className="flex items-center" style={{ gap: 8 }}>
      <button
        className="toggle-btn flex items-center justify-center"
        style={{ width: 28, height: 28, borderRadius: 10 }}
        onClick={() => onChange(Math.max(min, value - step))}
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
          className="text-center text-[11px] font-mono"
          style={{ width: 48, height: 28, borderRadius: 10, background: 'var(--panel-control-bg)', border: '1px solid var(--accent)', color: 'var(--text)', outline: 'none' }}
        />
      ) : (
        <button
          className="toggle-btn text-center text-[11px] font-semibold font-mono"
        style={{ width: 48, height: 28, borderRadius: 10 }}
          style={{ color: 'var(--text)' }}
          onClick={() => { setEditValue(String(value)); setEditing(true) }}
        >
          {value}{unit}
        </button>
      )}
      <button
        className="toggle-btn flex items-center justify-center"
        style={{ width: 28, height: 28, borderRadius: 10 }}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}

// --- Side Toggle ---
function SideToggle({ label, value, onChange }: { label: string; value: Side; onChange: (s: Side) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <ToggleGroup.Root
        type="single" value={value}
        onValueChange={(v) => { if (v) onChange(v as Side) }}
        className="flex gap-1"
      >
        {(['left', 'both', 'right', 'none'] as Side[]).map((s) => (
          <ToggleGroup.Item
            key={s} value={s}
            className="toggle-btn flex items-center justify-center"
            style={{ width: 26, height: 26, borderRadius: 8, fontSize: 10, fontWeight: 600 }}
            data-active={value === s}
          >
            {s === 'left' ? 'L' : s === 'both' ? 'B' : s === 'right' ? 'R' : '—'}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  )
}

const ROAD_CLASSES: { value: RoadClass; label: string }[] = [
  { value: 'innerorts', label: 'Innerorts' },
  { value: 'ausserorts', label: 'Außerorts' },
  { value: 'autobahn', label: 'Autobahn' },
]

export function QuickSettings({ strips, length, roadClass, onUpdateStrips, onUpdateLength, onUpdateRoadClass }: Props) {
  const [collapsed, setCollapsed] = useState(false)
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

  const { currentScale } = calculateAutoScale(0, length * 1.15)
  const pageWidthM = (PAGE_WIDTH_MM / 1000) * currentScale
  const widthOverflow = tw > pageWidthM

  return (
    <div className="flex flex-col">
      {/* Collapsible header */}
      <button
        className="flex items-center justify-center gap-2.5 w-full"
        style={{ height: 36, cursor: 'pointer' }}
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>Quick Settings</span>
        <ChevronDown
          size={13}
          className="transition-transform duration-200"
          style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', color: 'var(--text-muted)' }}
        />
      </button>

      {collapsed ? null : <div className="flex flex-col" style={{ gap: 14 }}>

      {/* Road class — segmented control */}
      <div className="flex flex-col" style={{ gap: 6 }}>
        <span className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--text-muted)' }}>Straßentyp</span>
        <ToggleGroup.Root
          type="single" value={roadClass}
          onValueChange={(v) => { if (v) onUpdateRoadClass(v as RoadClass) }}
          className="segmented-control w-full"
        >
          {ROAD_CLASSES.map((rc) => (
            <ToggleGroup.Item
              key={rc.value} value={rc.value}
              className="segmented-option"
              style={{ height: 28, fontSize: 11 }}
              data-active={roadClass === rc.value}
              title={ROAD_CLASS_CONFIG[rc.value].label}
            >
              {rc.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <div className="h-px" style={{ background: 'var(--panel-section-border)' }} />

      {/* Length */}
      <div className="flex items-center justify-between">
        <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>Länge</span>
        <NumberStepper value={length} onChange={onUpdateLength} min={5} max={200} step={5} unit="m" />
      </div>

      {/* Lanes */}
      <div className="flex items-center justify-between">
        <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>Spuren</span>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            className="toggle-btn flex items-center justify-center"
        style={{ width: 28, height: 28, borderRadius: 10 }}
            onClick={removeLane}
          >
            <Minus size={13} />
          </button>
          <span
            className="text-center text-[11px] font-semibold font-mono flex items-center justify-center"
            style={{ width: 48, height: 28, borderRadius: 10, background: 'var(--panel-control-bg)', border: '1px solid var(--panel-control-border)', color: 'var(--text)' }}
          >
            {laneCount}
          </span>
          <button
            className="toggle-btn flex items-center justify-center"
        style={{ width: 28, height: 28, borderRadius: 10 }}
            onClick={addLane}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="h-px" style={{ background: 'var(--panel-section-border)' }} />

      <SideToggle label="Gehweg" value={getSide(strips, 'sidewalk')} onChange={(s) => setSide('sidewalk', s)} />
      <SideToggle label="Radweg" value={getSide(strips, 'cyclepath')} onChange={(s) => setSide('cyclepath', s)} />
      <SideToggle label="Parken" value={getSide(strips, 'parking')} onChange={(s) => setSide('parking', s)} />

    </div>}

      {/* Size info + warning */}
      <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--panel-section-border)', marginTop: 4 }}>
        <div className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
          {tw.toFixed(1)}m breit · {length}m lang · 1:{currentScale}
        </div>
        {widthOverflow && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px]"
            style={{ background: 'rgba(255,180,50,0.1)', border: '1px solid rgba(255,180,50,0.25)', color: 'var(--warning, #f0b030)' }}
          >
            <AlertTriangle size={14} className="shrink-0" />
            <span>Straße breiter als Seite. Länge erhöhen oder Streifen entfernen.</span>
          </div>
        )}
      </div>
    </div>
  )
}
