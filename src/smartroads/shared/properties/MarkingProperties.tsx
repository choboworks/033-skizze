import * as ToggleGroup from '@radix-ui/react-toggle-group'
import type { Marking, MarkingVariant } from '../../types'
import { MARKING_TYPE_LABELS } from '@/constants/shared'

// ============================================================
// MarkingProperties – Properties panel for a selected marking
// ============================================================

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

  const hasWidth = marking.type === 'crosswalk' || marking.type === 'stopline'
  const hasStrokeWidth = marking.type === 'centerline' || marking.type === 'laneboundary' || marking.type === 'stopline'

  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {/* Type label */}
      <div className="text-[13px] font-semibold text-center" style={{ color: 'var(--text)' }}>
        {label}
      </div>

      {/* Variant */}
      {variants && variants.length > 1 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Variante</span>
          <ToggleGroup.Root
            type="single"
            value={marking.variant}
            onValueChange={(v) => { if (v) onUpdate({ variant: v as MarkingVariant }) }}
            className="flex flex-wrap"
            style={{ gap: 6, rowGap: 8 }}
          >
            {variants.map((v) => (
              <ToggleGroup.Item
                key={v.value}
                value={v.value}
                className="toggle-btn flex items-center justify-center"
                style={{ height: 28, padding: '0 10px', borderRadius: 9999, fontSize: 10.5, fontWeight: 600 }}
                data-active={marking.variant === v.value}
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
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Breite</span>
          <span className="text-[13px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {(marking.width || 0).toFixed(1)}m
          </span>
        </div>
      )}

      {/* Stroke width */}
      {hasStrokeWidth && (
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Strichbreite</span>
          <ToggleGroup.Root
            type="single"
            value={String(marking.strokeWidth || 0.12)}
            onValueChange={(v) => { if (v) onUpdate({ strokeWidth: parseFloat(v) }) }}
            className="flex" style={{ gap: 6 }}
          >
            {[
              { value: '0.12', label: '12cm' },
              { value: '0.15', label: '15cm' },
              { value: '0.25', label: '25cm' },
            ].map((sw) => (
              <ToggleGroup.Item
                key={sw.value}
                value={sw.value}
                className="toggle-btn flex items-center justify-center"
                style={{ height: 28, padding: '0 10px', borderRadius: 9999, fontSize: 10.5, fontWeight: 600 }}
                data-active={String(marking.strokeWidth || 0.12) === sw.value}
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
