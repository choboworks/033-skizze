// src/modules/ui/Slider.tsx
import type { ChangeEvent } from 'react'

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  disabled?: boolean
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
}: SliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className="space-y-1.5">
      {/* Label + Value */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
        <span className="text-sm font-mono text-[var(--text-muted)]">
          {value}{unit}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[var(--primary)]
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-[var(--primary)]
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  )
}