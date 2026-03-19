import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { STRIP_LABELS, VARIANT_LABELS } from '../constants'
import type { StripType, StripVariant, MarkingType, MarkingVariant } from '../types'

// ============================================================
// ElementPalette – Figma-style sidebar with large touch targets
// ============================================================

const STRIP_OPTIONS: { type: StripType; variants: { variant: StripVariant; label: string }[] }[] = [
  { type: 'lane', variants: [
    { variant: 'standard', label: 'Standard' },
    { variant: 'turn-left', label: 'Abbiegespur L' },
    { variant: 'turn-right', label: 'Abbiegespur R' },
  ]},
  { type: 'cyclepath', variants: [
    { variant: 'protected', label: 'Baulich getrennt' },
    { variant: 'lane-marked', label: 'Radfahrstreifen' },
    { variant: 'advisory', label: 'Schutzstreifen' },
  ]},
  { type: 'sidewalk', variants: [
    { variant: 'standard', label: 'Standard' },
    { variant: 'shared-bike', label: 'Gem. Geh-/Radweg' },
  ]},
  { type: 'parking', variants: [
    { variant: 'parallel', label: 'Längs' },
    { variant: 'angled', label: 'Schräg' },
    { variant: 'perpendicular', label: 'Quer' },
  ]},
  { type: 'green', variants: [{ variant: 'standard', label: 'Standard' }] },
  { type: 'curb', variants: [{ variant: 'standard', label: 'Bordstein' }] },
  { type: 'median', variants: [
    { variant: 'marking-only', label: 'Markierung' },
    { variant: 'green-median', label: 'Grünstreifen' },
    { variant: 'barrier', label: 'Leitplanke' },
  ]},
  { type: 'bus', variants: [{ variant: 'standard', label: 'Busstreifen' }] },
]

const MARKING_OPTIONS: { type: MarkingType; label: string; variants: { variant: MarkingVariant; label: string }[] }[] = [
  { type: 'centerline', label: 'Leitlinie', variants: [
    { variant: 'standard-dash', label: 'Innerorts (3m/6m)' },
    { variant: 'rural-dash', label: 'Außerorts (6m/12m)' },
    { variant: 'autobahn-dash', label: 'Autobahn (6m/12m)' },
    { variant: 'warning-dash', label: 'Warnlinie (6m/3m)' },
  ]},
  { type: 'laneboundary', label: 'Begrenzung', variants: [
    { variant: 'solid', label: 'Durchgezogen' },
    { variant: 'double', label: 'Doppelt' },
  ]},
  { type: 'crosswalk', label: 'Zebrastreifen', variants: [{ variant: 'default', label: 'Standard' }] },
  { type: 'stopline', label: 'Haltelinie', variants: [{ variant: 'default', label: 'Standard' }] },
  { type: 'arrow', label: 'Richtungspfeil', variants: [
    { variant: 'straight', label: '↑ Geradeaus' },
    { variant: 'left', label: '← Links' },
    { variant: 'right', label: '→ Rechts' },
  ]},
  { type: 'blocked-area', label: 'Sperrfläche', variants: [{ variant: 'default', label: 'Schraffur' }] },
]

interface Props {
  onAddStrip: (type: StripType, variant: StripVariant, side: 'left' | 'right') => void
  onAddMarking: (type: MarkingType, variant: MarkingVariant) => void
}

export function ElementPalette({ onAddStrip, onAddMarking }: Props) {
  return (
    <div className="flex flex-col h-full">
      <Accordion.Root type="multiple" className="flex-1">
        {/* Section: Streifen */}
        <div className="px-4 pt-5 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-center" style={{ color: 'var(--text-muted)' }}>
          Streifen
        </div>

        {STRIP_OPTIONS.map((opt) => (
          <Accordion.Item key={opt.type} value={opt.type} className="mx-3 mb-0.5">
            <Accordion.Trigger
              className="group flex items-center justify-between w-full px-3 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', height: 38 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <span className="text-[13px] font-medium">{STRIP_LABELS[opt.type]}</span>
              <ChevronDown size={14} className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" style={{ color: 'var(--text-muted)' }} />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden">
              <div className="pl-4 pr-2 pb-2 flex flex-col gap-0.5">
                {opt.variants.map((v) => (
                  <button
                    key={v.variant}
                    className="text-left text-[12px] px-3 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)', height: 34 }}
                    onClick={() => onAddStrip(opt.type, v.variant, 'right')}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-muted)'; e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {v.label || VARIANT_LABELS[v.variant] || v.variant}
                  </button>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}

        {/* Divider */}
        <div className="mx-5 my-3 h-px" style={{ background: 'var(--border)' }} />

        {/* Section: Markierungen */}
        <div className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-center" style={{ color: 'var(--text-muted)' }}>
          Markierungen
        </div>

        {MARKING_OPTIONS.map((opt) => (
          <Accordion.Item key={opt.type} value={`m-${opt.type}`} className="mx-3 mb-0.5">
            <Accordion.Trigger
              className="group flex items-center justify-between w-full px-3 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', height: 38 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <span className="text-[13px] font-medium">{opt.label}</span>
              <ChevronDown size={14} className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" style={{ color: 'var(--text-muted)' }} />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden">
              <div className="pl-4 pr-2 pb-2 flex flex-col gap-0.5">
                {opt.variants.map((v) => (
                  <button
                    key={v.variant}
                    className="text-left text-[12px] px-3 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)', height: 34 }}
                    onClick={() => onAddMarking(opt.type, v.variant)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-muted)'; e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}
