import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'

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

function isTransparentColor(color: string | null | undefined): boolean {
  return !color || color === 'transparent'
}

function normalizeColorValue(color: string): string {
  if (isTransparentColor(color)) return 'transparent'
  const normalized = color.startsWith('#') ? color.toLowerCase() : `#${color.toLowerCase()}`
  return /^#[0-9a-f]{6}$/.test(normalized) ? normalized : '#000000'
}

function checkerboard(size: number): string {
  return `repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 0 0 / ${size}px ${size}px`
}

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

  const update = useCallback((e: MouseEvent | React.MouseEvent) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    onChange(x, 1 - y)
  }, [onChange])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) update(e)
    }
    const onUp = () => {
      dragging.current = false
    }

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
      className="relative w-full cursor-crosshair overflow-hidden rounded-2xl"
      style={{
        height: 164,
        background: `linear-gradient(to right, #ffffff, ${hueToColor(hue)})`,
      }}
      onMouseDown={(e) => {
        dragging.current = true
        update(e)
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
      />
      <div
        className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
        style={{
          left: `${sat * 100}%`,
          top: `${(1 - bright) * 100}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.45)',
        }}
      />
    </div>
  )
}

function HueSlider({
  hue,
  onChange,
}: {
  hue: number
  onChange: (h: number) => void
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback((e: MouseEvent | React.MouseEvent) => {
    const rect = barRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onChange(x * 360)
  }, [onChange])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) update(e)
    }
    const onUp = () => {
      dragging.current = false
    }

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
      className="relative w-full cursor-pointer rounded-full"
      style={{
        height: 12,
        background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
      }}
      onMouseDown={(e) => {
        dragging.current = true
        update(e)
      }}
    >
      <div
        className="pointer-events-none absolute h-[18px] w-[18px] rounded-full border-2 border-white"
        style={{
          left: `${(hue / 360) * 100}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: hueToColor(hue),
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
        }}
      />
    </div>
  )
}

const PRESET_SWATCHES = [
  '#000000',
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  'transparent',
] as const

const PANEL_WIDTH = 320
const VIEWPORT_PADDING = 12
const PANEL_GAP = 10

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const initialColorRef = useRef(normalizeColorValue(value))
  const [panelPosition, setPanelPosition] = useState<{ left: number; top: number } | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  const committedColor = normalizeColorValue(value)
  const committedIsTransparent = isTransparentColor(committedColor)

  const [draftColor, setDraftColor] = useState(committedColor)
  const [draftHexInput, setDraftHexInput] = useState(
    committedIsTransparent ? '' : committedColor.replace('#', '').toUpperCase()
  )
  const [draftHueOverride, setDraftHueOverride] = useState<number | null>(null)

  const syncDraftFromColor = useCallback((color: string) => {
    const normalized = normalizeColorValue(color)
    setDraftColor(normalized)
    setDraftHexInput(isTransparentColor(normalized) ? '' : normalized.replace('#', '').toUpperCase())
    setDraftHueOverride(null)
  }, [])

  const previewColor = useCallback((color: string, nextHueOverride: number | null = null) => {
    const normalized = normalizeColorValue(color)
    setDraftColor(normalized)
    setDraftHexInput(isTransparentColor(normalized) ? '' : normalized.replace('#', '').toUpperCase())
    setDraftHueOverride(nextHueOverride)
    onChange(normalized)
  }, [onChange])

  const draftIsTransparent = isTransparentColor(draftColor)
  const draftSafeHex = draftIsTransparent ? '#000000' : draftColor
  const [draftH, draftS, draftV] = hexToHsv(draftSafeHex)
  const draftHue = (draftS === 0 || draftV === 0) && draftHueOverride != null ? draftHueOverride : draftH

  const resolvePortalContainer = useCallback(() => {
    if (typeof document === 'undefined') return null
    const dialogHost = triggerRef.current?.closest('[role="dialog"]') as HTMLElement | null
    return dialogHost ?? document.body
  }, [])

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const panelHeight = panelRef.current?.offsetHeight ?? 380
    const host = resolvePortalContainer()
    if (!host) return

    const isBodyHost = host === document.body
    const hostRect = isBodyHost
      ? { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight }
      : host.getBoundingClientRect()
    const left = clamp(
      triggerRect.left + triggerRect.width / 2 - PANEL_WIDTH / 2,
      hostRect.left + VIEWPORT_PADDING,
      hostRect.right - PANEL_WIDTH - VIEWPORT_PADDING,
    )

    const spaceAbove = triggerRect.top - hostRect.top - VIEWPORT_PADDING
    const spaceBelow = hostRect.bottom - triggerRect.bottom - VIEWPORT_PADDING
    const openAbove = spaceAbove >= panelHeight + PANEL_GAP || spaceAbove > spaceBelow

    const top = openAbove
      ? Math.max(hostRect.top + VIEWPORT_PADDING, triggerRect.top - panelHeight - PANEL_GAP)
      : Math.min(hostRect.bottom - panelHeight - VIEWPORT_PADDING, triggerRect.bottom + PANEL_GAP)

    setPortalContainer(host)
    setPanelPosition({
      left: isBodyHost ? left : left - hostRect.left,
      top: isBodyHost ? top : top - hostRect.top,
    })
  }, [resolvePortalContainer])

  useLayoutEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => {
      updatePanelPosition()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [open, updatePanelPosition])

  useEffect(() => {
    if (!open) return

    const handleViewportChange = () => updatePanelPosition()
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)
    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [open, updatePanelPosition])

  useEffect(() => {
    if (!open) return

    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const insidePanel = panelRef.current?.contains(target)
      const insideTrigger = triggerRef.current?.contains(target)

      if (!insidePanel && !insideTrigger) {
        const initialColor = initialColorRef.current
        syncDraftFromColor(initialColor)
        onChange(initialColor)
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [onChange, open, syncDraftFromColor])

  const handleSatBright = (newS: number, newV: number) => {
    previewColor(hsvToHex(draftHue, newS, newV), draftHueOverride)
  }

  const handleHue = (newH: number) => {
    if (draftS > 0 && draftV > 0) {
      previewColor(hsvToHex(newH, draftS, draftV), newH)
      return
    }

    setDraftHueOverride(newH)
  }

  const openPicker = useCallback(() => {
    initialColorRef.current = committedColor
    syncDraftFromColor(committedColor)
    setPortalContainer(resolvePortalContainer())
    setOpen(true)
  }, [committedColor, resolvePortalContainer, syncDraftFromColor])

  const cancelPicker = useCallback(() => {
    const initialColor = initialColorRef.current
    syncDraftFromColor(initialColor)
    onChange(initialColor)
    setOpen(false)
  }, [onChange, syncDraftFromColor])

  const confirmPicker = useCallback(() => {
    const nextColor = normalizeColorValue(draftColor)
    initialColorRef.current = nextColor
    onChange(nextColor)
    setOpen(false)
  }, [draftColor, onChange])

  const applyPreset = useCallback((color: string) => {
    previewColor(color)
  }, [previewColor])

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        className="surface-btn flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5"
        style={{
          background: 'var(--panel-control-bg)',
          borderColor: 'var(--panel-control-border)',
        }}
        onClick={() => {
          if (open) {
            cancelPicker()
            return
          }
          openPicker()
        }}
      >
        <div
          className="shrink-0 rounded-lg"
          style={{
            width: 28,
            height: 28,
            background: committedIsTransparent ? checkerboard(8) : committedColor,
            border: '1px solid var(--border)',
          }}
        />
        <span
          className="flex-1 truncate font-mono text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {committedIsTransparent ? 'Transparent' : committedColor.toUpperCase()}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--duration-hover) var(--ease-out-fast)',
          }}
        />
      </div>

      {open && portalContainer && createPortal(
        <div
          ref={panelRef}
          className="panel-shell-elevated overflow-hidden anim-pop-in"
          style={{
            width: PANEL_WIDTH,
            position: portalContainer === document.body ? 'fixed' : 'absolute',
            zIndex: 10020,
            left: panelPosition?.left ?? VIEWPORT_PADDING,
            top: panelPosition?.top ?? VIEWPORT_PADDING,
            pointerEvents: 'auto',
          }}
        >
          <div className="p-4 pb-3">
            <SatBrightArea hue={draftHue} sat={draftS} bright={draftV} onChange={handleSatBright} />
          </div>

          <div className="px-4 pb-4">
            <HueSlider hue={draftHue} onChange={handleHue} />
          </div>

          <div
            className="px-4 pb-4"
            style={{ borderTop: '1px solid var(--panel-section-border)' }}
          >
            <div
              className="rounded-2xl p-3"
              style={{
                background: 'var(--panel-control-bg)',
                border: '1px solid var(--panel-control-border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="shrink-0 rounded-xl"
                  style={{
                    width: 40,
                    height: 40,
                    background: draftIsTransparent ? checkerboard(8) : draftColor,
                    border: '1px solid var(--border)',
                  }}
                />

                <div className="relative flex-1">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    #
                  </span>
                  <input
                    type="text"
                    value={draftHexInput}
                    onChange={(e) => {
                      const nextValue = e.target.value.replace('#', '').toUpperCase()
                      setDraftHexInput(nextValue)
                      if (/^[0-9a-fA-F]{6}$/.test(nextValue)) {
                        previewColor(`#${nextValue.toLowerCase()}`)
                      }
                    }}
                    className="field-input font-mono w-full rounded-xl"
                    style={{
                      height: 40,
                      paddingLeft: 28,
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                    maxLength={6}
                    placeholder="000000"
                    onFocus={(e) => {
                      e.currentTarget.select()
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        cancelPicker()
                        e.currentTarget.blur()
                        return
                      }

                      if (e.key === 'Enter') {
                        const normalized = draftHexInput
                        if (/^[0-9a-fA-F]{6}$/.test(normalized)) {
                          const nextColor = `#${normalized.toLowerCase()}`
                          previewColor(nextColor)
                          confirmPicker()
                          e.currentTarget.blur()
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="px-4 pt-4 pb-5"
            style={{ borderTop: '1px solid var(--panel-section-border)' }}
          >
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Schnellfarben
            </div>

            <div
              className="rounded-2xl p-3"
              style={{
                background: 'var(--panel-control-bg)',
                border: '1px solid var(--panel-control-border)',
              }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                  gap: 10,
                }}
              >
                {PRESET_SWATCHES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="justify-self-center rounded-full transition-transform hover:scale-110"
                    style={{
                      width: 24,
                      height: 24,
                      background: color === 'transparent' ? checkerboard(5) : color,
                      border: draftColor === color ? '2px solid var(--accent)' : '1px solid var(--border)',
                      boxShadow: draftColor === color ? '0 0 0 2px rgba(56, 189, 248, 0.18)' : 'none',
                    }}
                    onClick={() => applyPreset(color)}
                    title={color === 'transparent' ? 'Transparent' : color.toUpperCase()}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-3 px-4 pt-5 pb-4"
            style={{ borderTop: '1px solid var(--panel-section-border)' }}
          >
            <button
              type="button"
              className="surface-btn flex-1 rounded-2xl px-4 text-sm font-semibold"
              style={{ height: 42 }}
              onClick={cancelPicker}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="primary-btn flex-1 rounded-2xl px-4 text-sm font-semibold"
              style={{ height: 42 }}
              onClick={confirmPicker}
            >
              OK
            </button>
          </div>
        </div>,
        portalContainer
      )}
    </div>
  )
}
