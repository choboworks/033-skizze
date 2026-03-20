/**
 * Shared UI primitives for all panels/popovers.
 * Ensures design consistency across tool popovers and floating properties.
 */

import type { ReactNode } from 'react'

/** Section with uppercase title + divider */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ padding: '14px 14px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.08em] block mb-2"
        style={{ color: 'var(--text-muted)' }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

/** Slider with label left, value right */
export function PanelSlider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px]" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="text-[11px] font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
          {value}{' '}
          {unit && <span className="font-normal" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-(--accent)"
        style={{ height: 4 }}
      />
    </>
  )
}

/** Spacer between controls */
export function PanelSpacer() {
  return <div className="h-4" />
}

/** Small spacer after last slider in a section */
export function PanelSliderEnd() {
  return <div className="h-2" />
}

/** Segmented control (Linie / Striche / Punkte etc.) */
export function PanelSegmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <>
      <span className="text-[13px] block mb-2" style={{ color: 'var(--text)' }}>{label}</span>
      <div
        className="flex gap-1"
        style={{
          padding: 4,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {options.map((opt) => {
          const active = value === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              data-active={active}
              className="flex-1 h-9 text-[12px] font-semibold text-center transition-all"
              style={{
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#031018' : 'var(--text-muted)',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </>
  )
}

/** Color picker label */
export function PanelColorLabel({ label }: { label: string }) {
  return <span className="text-[13px] block mb-3" style={{ color: 'var(--text)' }}>{label}</span>
}
