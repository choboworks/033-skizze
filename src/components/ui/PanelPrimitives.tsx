/**
 * Shared UI primitives for all panels/popovers.
 * Ensures design consistency across tool popovers and floating properties.
 */

import type { ReactNode } from 'react'

/** Section with uppercase title + divider */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-7 pt-7 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
      <span
        className="text-[11px] font-bold uppercase tracking-[0.15em] block mb-7"
        style={{ color: 'var(--text-muted)', opacity: 0.6 }}
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
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px]" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="text-[15px] font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
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
        style={{ height: 6 }}
      />
    </>
  )
}

/** Spacer between controls */
export function PanelSpacer() {
  return <div className="h-10" />
}

/** Small spacer after last slider in a section */
export function PanelSliderEnd() {
  return <div className="h-6" />
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
      <span className="text-[15px] block mb-4" style={{ color: 'var(--text)' }}>{label}</span>
      <div
        className="flex p-2 rounded-xl gap-2"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
      >
        {options.map((opt) => {
          const active = value === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className="flex-1 py-3.5 rounded-lg text-[14px] font-semibold transition-all text-center"
              style={{
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--text-muted)',
                boxShadow: active ? '0 2px 8px rgba(74,158,255,0.35)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
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
  return <span className="text-[15px] block mb-4" style={{ color: 'var(--text)' }}>{label}</span>
}
