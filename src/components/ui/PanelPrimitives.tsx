/**
 * Shared UI primitives for all panels/popovers.
 * Ensures design consistency across tool popovers and floating properties.
 */

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

/** Unified panel header with icon, title, optional subtitle, and close button */
export function PanelHeader({
  icon,
  title,
  subtitle,
  onClose,
  onMouseDown,
  className = '',
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
  onClose: () => void
  onMouseDown?: (e: React.MouseEvent) => void
  className?: string
}) {
  return (
    <div
      className={`panel-popover-header ${className}`}
      onMouseDown={onMouseDown}
      style={onMouseDown ? { cursor: 'grab' } : undefined}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon}
        <div className="min-w-0">
          <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <button className="panel-header-btn" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  )
}

/** Section with uppercase title + divider */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="panel-section">
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
      <div className="segmented-control">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            data-active={value === opt.id}
            className="segmented-option"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </>
  )
}

/** Color picker label */
export function PanelColorLabel({ label }: { label: string }) {
  return <span className="text-[13px] block mb-3" style={{ color: 'var(--text)' }}>{label}</span>
}
