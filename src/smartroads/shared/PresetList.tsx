import type { StraightRoadState } from '../types'
import { createStrip } from '../constants'

// ============================================================
// PresetList – Compact preset buttons at bottom of sidebar
// ============================================================

interface PresetDef {
  id: string
  label: string
  create: () => StraightRoadState
}

const STRAIGHT_PRESETS: PresetDef[] = [
  {
    id: 'residential', label: 'Erschließungsstr.',
    create: () => ({ length: 30, strips: [
      createStrip('sidewalk'), createStrip('curb'),
      createStrip('lane', 'standard', 'up'),
      createStrip('curb'), createStrip('sidewalk'),
    ], markings: [] }),
  },
  {
    id: 'collector', label: 'Sammelstraße',
    create: () => ({ length: 30, strips: [
      createStrip('sidewalk'), createStrip('curb'), createStrip('cyclepath', 'advisory'),
      createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
      createStrip('cyclepath', 'advisory'), createStrip('curb'), createStrip('sidewalk'),
    ], markings: [] }),
  },
  {
    id: 'arterial', label: 'Hauptverkehrsstr.',
    create: () => ({ length: 30, strips: [
      createStrip('sidewalk'), createStrip('curb'), createStrip('cyclepath', 'protected'),
      createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'),
      createStrip('green'),
      createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'),
      createStrip('cyclepath', 'protected'), createStrip('curb'), createStrip('sidewalk'),
    ], markings: [] }),
  },
  {
    id: 'rural', label: 'Landstraße',
    create: () => ({ length: 40, strips: [
      createStrip('shoulder'),
      createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
      createStrip('shoulder'),
    ], markings: [] }),
  },
  {
    id: 'highway', label: 'Autobahn',
    create: () => ({ length: 50, strips: [
      createStrip('shoulder'),
      createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'),
      createStrip('median', 'barrier'),
      createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'),
      createStrip('shoulder'),
    ], markings: [] }),
  },
  {
    id: 'tempo30', label: 'Tempo 30',
    create: () => ({ length: 25, strips: [
      createStrip('sidewalk'), createStrip('curb'),
      createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
      createStrip('curb'), createStrip('sidewalk'),
    ], markings: [] }),
  },
]

interface Props {
  onLoadPreset: (state: StraightRoadState) => void
}

export function PresetList({ onLoadPreset }: Props) {
  return (
    <div className="px-3 pb-3">
      <div className="py-2 text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        Presets
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STRAIGHT_PRESETS.map((p) => (
          <button
            key={p.id}
            className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            onClick={() => onLoadPreset(p.create())}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-muted)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--surface)' }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
