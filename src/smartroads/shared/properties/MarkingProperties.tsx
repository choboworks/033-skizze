import * as ToggleGroup from '@radix-ui/react-toggle-group'
import type { Marking, MarkingVariant } from '../../types'

// ============================================================
// MarkingProperties – Properties panel for a selected marking
// ============================================================

// Display names per marking type
const MARKING_TYPE_LABELS: Record<string, string> = {
  centerline: 'Leitlinie',
  laneboundary: 'Begrenzung',
  crosswalk: 'Zebrastreifen',
  stopline: 'Haltelinie',
  arrow: 'Richtungspfeil',
  'blocked-area': 'Sperrfläche',
  'yield-line': 'Wartelinie',
  'bike-crossing': 'Radfurt',
  'bus-stop': 'Bushaltestelle',
  'speed-limit': 'Tempo',
  'parking-marking': 'Parkfläche',
  'free-line': 'Freie Linie',
}

// Variant options per marking type
const MARKING_VARIANT_OPTIONS: Partial<Record<string, { value: MarkingVariant; label: string }[]>> = {
  centerline: [
    { value: 'standard-dash', label: 'Innerorts' },
    { value: 'rural-dash', label: 'Außerorts' },
    { value: 'autobahn-dash', label: 'Autobahn' },
    { value: 'warning-dash', label: 'Warnlinie' },
  ],
  laneboundary: [
    { value: 'solid', label: 'Einfach' },
    { value: 'double', label: 'Doppelt' },
  ],
  arrow: [
    { value: 'straight', label: '↑' },
    { value: 'left', label: '←' },
    { value: 'right', label: '→' },
    { value: 'straight-left', label: '↑←' },
    { value: 'straight-right', label: '↑→' },
  ],
}

interface Props {
  marking: Marking
  onUpdate: (changes: Partial<Marking>) => void
}

export function MarkingProperties({ marking, onUpdate }: Props) {
  const label = MARKING_TYPE_LABELS[marking.type] || marking.type
  const variants = MARKING_VARIANT_OPTIONS[marking.type]

  // Markings that have adjustable width (crosswalk, stopline)
  const hasWidth = marking.type === 'crosswalk' || marking.type === 'stopline'

  // Markings that have adjustable stroke width
  const hasStrokeWidth = marking.type === 'centerline' || marking.type === 'laneboundary' || marking.type === 'stopline'

  return (
    <div className="flex flex-col gap-4">
      {/* Type label */}
      <div className="text-[13px] font-semibold text-center" style={{ color: 'var(--text)' }}>
        {label}
      </div>

      {/* Variant */}
      {variants && variants.length > 1 && (
        <div className="flex flex-col gap-2">
          <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Variante</span>
          <ToggleGroup.Root
            type="single"
            value={marking.variant}
            onValueChange={(v) => { if (v) onUpdate({ variant: v as MarkingVariant }) }}
            className="flex flex-wrap gap-1"
          >
            {variants.map((v) => (
              <ToggleGroup.Item
                key={v.value}
                value={v.value}
                className="flex-1 h-8 text-[11px] font-medium rounded-lg flex items-center justify-center transition-colors"
                style={{
                  minWidth: 55,
                  background: marking.variant === v.value ? 'var(--accent-muted)' : 'var(--surface)',
                  color: marking.variant === v.value ? 'var(--accent)' : 'var(--text-muted)',
                  border: marking.variant === v.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                {v.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
      )}

      {/* Width (crosswalk, stopline) */}
      {hasWidth && (
        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Breite</span>
          <span className="text-[13px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {(marking.width || 0).toFixed(1)}m
          </span>
        </div>
      )}

      {/* Stroke width */}
      {hasStrokeWidth && (
        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Strichbreite</span>
          <ToggleGroup.Root
            type="single"
            value={String(marking.strokeWidth || 0.12)}
            onValueChange={(v) => { if (v) onUpdate({ strokeWidth: parseFloat(v) }) }}
            className="flex gap-1"
          >
            {[
              { value: '0.12', label: '12cm' },
              { value: '0.15', label: '15cm' },
              { value: '0.25', label: '25cm' },
            ].map((sw) => (
              <ToggleGroup.Item
                key={sw.value}
                value={sw.value}
                className="h-8 px-2 text-[11px] font-medium rounded-lg flex items-center justify-center transition-colors"
                style={{
                  background: String(marking.strokeWidth || 0.12) === sw.value ? 'var(--accent-muted)' : 'var(--surface)',
                  color: String(marking.strokeWidth || 0.12) === sw.value ? 'var(--accent)' : 'var(--text-muted)',
                  border: String(marking.strokeWidth || 0.12) === sw.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                {sw.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
      )}
    </div>
  )
}
