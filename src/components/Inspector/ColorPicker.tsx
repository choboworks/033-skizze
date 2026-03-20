import { useState, useRef, useEffect, useCallback } from 'react'
import { Pipette } from 'lucide-react'

// ─── Color conversion utils ──────────────────────────────────

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  }
  const r = Math.round(f(5) * 255)
  const g = Math.round(f(3) * 255)
  const b = Math.round(f(1) * 255)
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  const s = max === 0 ? 0 : d / max
  return [h, s, max]
}

function hueToColor(h: number): string {
  return hsvToHex(h, 1, 1)
}

// ─── Saturation/Brightness Area ──────────────────────────────

function SatBrightArea({
  hue,
  sat,
  bright,
  onChange,
}: {
  hue: number
  sat: number
  bright: number
  onChange: (s: number, v: number) => void
}) {
  const areaRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const rect = areaRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
      onChange(x, 1 - y)
    },
    [onChange]
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) update(e) }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [update])

  return (
    <div
      ref={areaRef}
      className="relative w-full rounded-lg cursor-crosshair"
      style={{
        height: 160,
        background: `linear-gradient(to right, #fff, ${hueToColor(hue)})`,
      }}
      onMouseDown={(e) => {
        dragging.current = true
        update(e)
      }}
    >
      {/* Darkness overlay */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}
      />
      {/* Picker dot */}
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white pointer-events-none"
        style={{
          left: `${sat * 100}%`,
          top: `${(1 - bright) * 100}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  )
}

// ─── Hue Slider ──────────────────────────────────────────────

function HueSlider({
  hue,
  onChange,
}: {
  hue: number
  onChange: (h: number) => void
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const rect = barRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      onChange(x * 360)
    },
    [onChange]
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) update(e) }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [update])

  return (
    <div
      ref={barRef}
      className="relative w-full h-3 rounded-full cursor-pointer"
      style={{
        background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
      }}
      onMouseDown={(e) => {
        dragging.current = true
        update(e)
      }}
    >
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          background: hueToColor(hue),
        }}
      />
    </div>
  )
}

// ─── Main ColorPicker ────────────────────────────────────────

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
]

export function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(value)
  const panelRef = useRef<HTMLDivElement>(null)

  const isTransparent = value === 'transparent' || value === ''
  const safeHex = isTransparent ? '#000000' : (value.startsWith('#') ? value : '#000000')
  const [h, s, v] = hexToHsv(safeHex)
  // hueOverride: only set while user drags the hue slider (preserves hue for grays)
  const [hueOverride, setHueOverride] = useState<number | null>(null)
  const hue = hueOverride ?? h

  // Reset override and hex input when value changes externally
  const [prevValue, setPrevValue] = useState(value)
  if (prevValue !== value) {
    setPrevValue(value)
    setHexInput(value)
    // Clear hue override so we derive from the new value
    setHueOverride(null)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [open])

  const handleSatBright = (newS: number, newV: number) => {
    const hex = hsvToHex(hue, newS, newV)
    onChange(hex)
    setHexInput(hex)
  }

  const handleHue = (newH: number) => {
    setHueOverride(newH)
    const hex = hsvToHex(newH, s || 1, v || 1)
    onChange(hex)
    setHexInput(hex)
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger */}
      <div
        className="surface-btn flex items-center gap-2.5 cursor-pointer rounded-md px-2.5 py-2"
        style={{
          background: 'var(--bg)',
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          className="w-7 h-7 rounded-md shrink-0"
          style={{
            background: isTransparent
              ? 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 0 0 / 8px 8px'
              : value,
            border: '1px solid var(--border)',
          }}
        />
        <span className="text-xs font-mono flex-1" style={{ color: 'var(--text-secondary)' }}>
          {isTransparent ? 'Transparent' : value.toUpperCase()}
        </span>
        <Pipette size={14} style={{ color: 'var(--text-muted)' }} />
      </div>

      {/* Dropdown - opens UPWARD */}
      {open && (
        <div
          className="absolute left-0 right-0 bottom-full mb-2 rounded-xl z-50"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Sat/Bright area */}
          <div className="p-3 pb-2">
            <SatBrightArea hue={hue} sat={s} bright={v} onChange={handleSatBright} />
          </div>

          {/* Hue slider */}
          <div className="px-3 pb-3">
            <HueSlider hue={hue} onChange={handleHue} />
          </div>

          {/* Hex input */}
          <div className="px-3 pb-3">
            <div className="flex gap-2 items-center">
              <div
                className="w-9 h-9 rounded-md shrink-0"
                style={{
                  background: isTransparent ? 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 0 0 / 8px 8px' : value,
                  border: '1px solid var(--border)',
                }}
              />
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>#</span>
                <input
                  type="text"
                  value={hexInput.replace('#', '').replace('transparent', '').toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value.replace('#', '')
                    setHexInput('#' + val)
                    if (/^[0-9a-fA-F]{6}$/.test(val)) {
                      onChange('#' + val.toLowerCase())
                    }
                  }}
                  className="field-input font-mono w-full"
                  style={{ paddingLeft: 22, fontSize: 'var(--font-size-sm)' }}
                  maxLength={6}
                  placeholder="000000"
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>
          </div>

          {/* Presets + Transparent */}
          <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-md transition-transform hover:scale-125"
                style={{
                  background: color,
                  border: value === color ? '2px solid var(--accent)' : '1px solid var(--border)',
                }}
                onClick={() => {
                  onChange(color)
                  setHexInput(color)
                }}
              />
            ))}
            <button
              className="w-6 h-6 rounded-md transition-transform hover:scale-125"
              style={{
                background: 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 0 0 / 5px 5px',
                border: isTransparent ? '2px solid var(--accent)' : '1px solid var(--border)',
              }}
              onClick={() => {
                onChange('transparent')
                setHexInput('transparent')
              }}
              title="Transparent"
            />
          </div>
        </div>
      )}
    </div>
  )
}
