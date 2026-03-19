import { Save, FolderOpen } from 'lucide-react'
import type { StraightRoadState } from '../types'
import { createStrip, generateLaneMarkings } from '../constants'

// ============================================================
// PresetList – Large touch-ready preset grid + save/load
// ============================================================

interface PresetDef {
  id: string
  label: string
  create: () => StraightRoadState
}

const STRAIGHT_PRESETS: PresetDef[] = [
  {
    id: 'residential', label: 'Erschließungsstr.',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'),
        createStrip('lane', 'standard', 'up'),
        createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 30, strips, markings: [], roadClass: 'innerorts' }
    },
  },
  {
    id: 'collector', label: 'Sammelstraße',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'), createStrip('cyclepath', 'advisory'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
        createStrip('cyclepath', 'advisory'), createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 30, strips, markings: generateLaneMarkings(strips, 'standard-dash'), roadClass: 'innerorts' }
    },
  },
  {
    id: 'arterial', label: 'Hauptverkehrsstr.',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'), createStrip('cyclepath', 'protected'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'),
        createStrip('green'),
        createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'),
        createStrip('cyclepath', 'protected'), createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 30, strips, markings: generateLaneMarkings(strips, 'standard-dash'), roadClass: 'innerorts' }
    },
  },
  {
    id: 'rural', label: 'Landstraße',
    create: () => {
      const strips = [
        createStrip('shoulder'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
        createStrip('shoulder'),
      ]
      return { length: 40, strips, markings: generateLaneMarkings(strips, 'rural-dash'), roadClass: 'ausserorts' }
    },
  },
  {
    id: 'highway', label: 'Autobahn',
    create: () => {
      const strips = [
        createStrip('shoulder'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'),
        createStrip('median', 'barrier'),
        createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'),
        createStrip('shoulder'),
      ]
      return { length: 50, strips, markings: generateLaneMarkings(strips, 'autobahn-dash', 0.15), roadClass: 'autobahn' }
    },
  },
  {
    id: 'tempo30', label: 'Tempo 30',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
        createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 25, strips, markings: generateLaneMarkings(strips, 'standard-dash'), roadClass: 'innerorts' }
    },
  },
]

interface Props {
  onLoadPreset: (state: StraightRoadState) => void
}

export function PresetList({ onLoadPreset }: Props) {
  return (
    <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="pt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-center" style={{ color: 'var(--text-muted)' }}>
        Presets
      </div>

      {/* Preset grid — 2 columns, large touch targets */}
      <div className="grid grid-cols-2 gap-2">
        {STRAIGHT_PRESETS.map((p) => (
          <button
            key={p.id}
            className="flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors text-center"
            style={{
              height: 40,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            onClick={() => onLoadPreset(p.create())}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-muted)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--surface)' }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Save / Load actions */}
      <div className="flex gap-2 pt-1">
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-lg text-[12px] font-medium transition-colors"
          style={{
            height: 40,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
          title="Aktuellen Querschnitt als Preset speichern"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-muted)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--surface)' }}
        >
          <Save size={14} />
          Speichern
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-lg text-[12px] font-medium transition-colors"
          style={{
            height: 40,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
          title="Gespeichertes Preset laden"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-muted)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--surface)' }}
        >
          <FolderOpen size={14} />
          Laden
        </button>
      </div>
    </div>
  )
}
