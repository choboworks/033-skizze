import {
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type MouseEventHandler,
} from 'react'

import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export type FillCfg = { color: string }

const PALETTE = [
  '#FFFFFF', '#000000', '#6b7280', '#9ca3af',
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#22c55e', '#eab308',
] as const

function onToolbarMoved(handler: () => void): () => void {
  window.addEventListener('app:toolbar-moved', handler as EventListener)
  return () => window.removeEventListener('app:toolbar-moved', handler as EventListener)
}

export const FillOverlay: FC<{
  value: FillCfg
  onChange: (v: Partial<FillCfg>) => void
  onClose: () => void
}> = ({ value, onChange, onClose }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const colorRef = useRef<(HTMLInputElement & { showPicker?: () => void }) | null>(null)

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

  const onCustomMouseDownCapture: MouseEventHandler<HTMLLabelElement> = (e) => {
    if (!supportsShowPicker) return
    e.preventDefault()
    e.stopPropagation()
    const el = colorRef.current
    if (!el) return
    const focused = document.activeElement === el
    if (open || focused) {
      el.blur()
      setOpen(false)
    } else {
      el.focus({ preventScroll: true })
      el.showPicker?.()
      setOpen(true)
    }
  }

  const node = (
    <div
      ref={wrapRef}
      className="floating-surface px-3 py-2 min-w-[560px] max-w-[80vw] z-[900]"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        visibility: ready ? 'visible' : 'hidden',
      }}
      role="dialog"
      aria-label="Füllfarben"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Palette */}
        <div className="flex items-center gap-1">
          {PALETTE.map((c) => {
            const active = value.color.toLowerCase() === c.toLowerCase()
            return (
              <button
                key={c}
                type="button"
                aria-label={`Farbe ${c}`}
                aria-pressed={active}
                className={[
                  'h-7 w-7 rounded-md border transition-colors-quick',
                  active
                    ? 'border-[--primary] ring-2 ring-[--primary]/40 shadow-[var(--shadow-sm)]'
                    : 'border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]',
                ].join(' ')}
                onClick={() => onChange({ color: c })}
                title={c}
              >
                <span className="block h-4 w-4 rounded-sm mx-auto" style={{ background: c }} />
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
            aria-label="Eigene Farbe wählen"
            type="color"
            value={value.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-9 h-7 p-0 border border-[--border] rounded-[var(--radius-sm)] bg-[--panel]"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={(e) => { if (supportsShowPicker) e.preventDefault() }}
          />
        </label>

        <div className="grow" />

        <button
          type="button"
          onClick={onClose}
          className="seg-btn h-8 px-2 text-[13px] border border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_90%,var(--text)_10%)] focus:outline-none focus:ring-2 focus:ring-[--ring]"
        >
          <X size={16} className="icon" />
          Schließen
        </button>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}

export default FillOverlay
