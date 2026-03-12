import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export type PenCfg = { strokeWidth: number; color: string }
type ColorInputWithPicker = HTMLInputElement & { showPicker?: () => void }

function onToolbarMoved(handler: () => void): () => void {
  window.addEventListener('app:toolbar-moved', handler as EventListener)
  return () => window.removeEventListener('app:toolbar-moved', handler as EventListener)
}

export function PenOverlay(props: {
  value: PenCfg
  onChange: (v: Partial<PenCfg>) => void
  onClose: () => void
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const colorRef = useRef<ColorInputWithPicker | null>(null)

  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  const reposition = () => {
    const anchor = document.querySelector('[data-app-toolbar]') as HTMLElement | null
    const el = wrapRef.current
    if (!anchor || !el) return

    const a = anchor.getBoundingClientRect()
    const w = el.offsetWidth
    const h = el.offsetHeight
    const gap = 12

    const cx = a.left + a.width / 2
    let top = a.top - h - gap
    if (top < 8) top = a.bottom + gap

    const left = Math.round(Math.min(Math.max(8, cx - w / 2), window.innerWidth - w - 8))
    setPos({ left, top })
  }

  useLayoutEffect(() => {
    reposition()
    const raf = requestAnimationFrame(() => {
      reposition()
      setReady(true)
    })

    const on = () => reposition()
    window.addEventListener('resize', on)
    window.addEventListener('scroll', on, { passive: true })
    const offToolbar = onToolbarMoved(on)

    const el = wrapRef.current
    const ro = new ResizeObserver(() => reposition())
    if (el) ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', on)
      window.removeEventListener('scroll', on)
      offToolbar()
      ro.disconnect()
    }
  }, [])

  const supportsShowPicker =
    typeof window !== 'undefined' &&
    typeof HTMLInputElement !== 'undefined' &&
    'showPicker' in HTMLInputElement.prototype

  const onCustomMouseDownCapture: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    if (!supportsShowPicker) return
    e.preventDefault()
    e.stopPropagation()
    const el = colorRef.current
    if (!el) return
    const isFocused = document.activeElement === el
    if (open || isFocused) {
      el.blur()
      setOpen(false)
    } else {
      el.focus({ preventScroll: true })
      el.showPicker?.()
      setOpen(true)
    }
  }

  const widths = [1, 2, 4, 6, 8] as const
  const swatches = ['#FFFFFF', '#000000', '#EF4444', '#2563EB', '#10B981', '#F59E0B', '#6B7280'] as const

  const node = (
    <div
      ref={wrapRef}
      className="floating-surface px-3 py-2 min-w-[720px] max-w-[90vw] z-[900]"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        visibility: ready ? 'visible' : 'hidden',
      }}
      role="dialog"
      aria-label="Stift-Einstellungen"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Strichstärke */}
        <div className="flex items-center gap-1" aria-label="Strichstärke wählen" role="group">
          {widths.map((w) => {
            const isActive = props.value.strokeWidth === w
            return (
              <button
                key={w}
                onClick={() => props.onChange({ strokeWidth: w })}
                aria-pressed={isActive}
                title={`${w}px`}
                className={[
                  'h-7 px-2 inline-flex items-center justify-center rounded-md border text-[13px]',
                  'transition-colors-quick',
                  isActive
                    ? 'border-[--primary] ring-2 ring-[--primary]/40 shadow-[var(--shadow-sm)]'
                    : 'border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]',
                ].join(' ')}
              >
                <div className="w-10 h-6 rounded-md bg-white border border-[--border] relative overflow-hidden">
                  <div
                    className="absolute left-1 right-1 top-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      height: `${w}px`,
                      backgroundColor: props.value.color,
                      boxShadow:
                        props.value.color.trim().toLowerCase() === '#ffffff'
                          ? 'inset 0 0 0 1px var(--border)'
                          : undefined,
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        <span className="h-5 w-px bg-[--border] mx-1" aria-hidden />

        {/* Farben */}
        <div className="flex items-center gap-1" aria-label="Stiftfarbe wählen" role="group">
          {swatches.map((c) => {
            const active = props.value.color.toLowerCase() === c.toLowerCase()
            const isWhite = c.toLowerCase() === '#ffffff'
            return (
              <button
                key={c}
                onClick={() => props.onChange({ color: c })}
                aria-pressed={active}
                title={c}
                className={[
                  'h-7 w-7 inline-flex items-center justify-center rounded-md border select-none',
                  'transition-colors-quick focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/45',
                  active
                    ? 'border-[--primary] ring-2 ring-[--primary]/40 shadow-[var(--shadow-sm)]'
                    : 'border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]',
                ].join(' ')}
              >
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{
                    backgroundColor: c,
                    boxShadow: isWhite ? 'inset 0 0 0 1px var(--border)' : undefined,
                  }}
                />
              </button>
            )
          })}
        </div>

        <span className="h-5 w-px bg-[--border] mx-1" aria-hidden />

        {/* Custom Color */}
        <label
          className="flex items-center gap-2 text-xs text-[--text-muted]"
          onMouseDownCapture={onCustomMouseDownCapture}
        >
          Eigene Farbe:
          <input
            ref={colorRef}
            type="color"
            value={props.value.color}
            onChange={(e) => props.onChange({ color: e.target.value })}
            className="h-7 w-9 border border-[--border] rounded-[var(--radius-sm)] p-0 bg-[--panel]"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={(e) => { if (supportsShowPicker) e.preventDefault() }}
          />
        </label>

        <div className="grow" />

        <button
          type="button"
          onClick={props.onClose}
          className="seg-btn h-8 px-2 text-[13px] border border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_90%,var(--text)_10%)] focus:outline-none focus:ring-2 focus:ring-[--ring]"
        >
          <X className="h-4 w-4 icon" />
          Schließen
        </button>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}

export default PenOverlay
