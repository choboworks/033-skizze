// src/modules/toolbar/TextEditorOverlay.tsx
import {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type FC,
  type MouseEventHandler,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, X, Bold, Italic, Underline } from 'lucide-react'

export type TextCfg = {
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  size: number
  text: string
}

/** Kleiner Helfer: auf das Custom-Event der Toolbar hören (ohne any-Cast). */
function onToolbarMoved(handler: () => void): () => void {
  // addEventListener besitzt auch eine generische string-Variante – das ist hier ausreichend.
  window.addEventListener('app:toolbar-moved', handler as EventListener)
  return () => window.removeEventListener('app:toolbar-moved', handler as EventListener)
}

export const TextEditorOverlay: FC<{
  value: TextCfg
  onChange: (v: Partial<TextCfg>) => void
  onOk: () => void
  onCancel: () => void
}> = ({ value, onChange, onOk, onCancel }) => {
  const colorId = useId()
  const quickSizes: number[] = [12, 16, 20]
  const currentSize = Number.isFinite(value.size) ? value.size : 20

  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const colorRef = useRef<(HTMLInputElement & { showPicker?: () => void }) | null>(null)

  // --- Portal/Position ---
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const [ready, setReady] = useState(false) // Overlay erst zeigen, wenn gemessen

  /** Position relativ zur (nicht skalierten) Toolbar neu berechnen. */
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
    // einmal nach Mount + im nächsten Frame messen (sicher, wenn Fonts/Tailwind greifen)
    reposition()
    const raf = requestAnimationFrame(() => {
      reposition()
      setReady(true)
    })

    const on = () => reposition()
    window.addEventListener('resize', on)
    window.addEventListener('scroll', on, { passive: true })
    const offToolbar = onToolbarMoved(on)

    // Reagieren, wenn sich unsere eigene Größe ändert (z.B. Text wächst)
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

  // ---------- Auto-resize Textarea ----------
  const autoResize = () => {
    const el = taRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = Math.min(Math.max(el.scrollHeight, 64), 360) + 'px'
  }
  useEffect(() => { autoResize() }, [])
  useEffect(() => { autoResize() }, [value.text])

  useEffect(() => {
    // Cursor ans Ende setzen
    const el = taRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    const v = el.value
    el.setSelectionRange(v.length, v.length)
  }, [])

  // ---------- Farbe live vom Füll-Tool übernehmen ----------
  useEffect(() => {
    const onFillApplied = (ev: Event) => {
      const c = (ev as CustomEvent<{ color?: string }>).detail?.color
      if (c) onChange({ color: c })
    }
    window.addEventListener('app:fill-applied', onFillApplied as EventListener)
    return () => window.removeEventListener('app:fill-applied', onFillApplied as EventListener)
  }, [onChange])

  // ---------- Color-Picker Toggle ----------
  const [open, setOpen] = useState(false)
  const supportsShowPicker =
    typeof window !== 'undefined' &&
    typeof HTMLInputElement !== 'undefined' &&
    'showPicker' in HTMLInputElement.prototype

  const onColorMouseDownCapture: MouseEventHandler<HTMLLabelElement> = (e) => {
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
      className="floating-surface px-3 py-2 min-w-[780px] max-w-[95vw] z-[900]"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        visibility: ready ? 'visible' : 'hidden',
      }}
      role="dialog"
      aria-label="Text bearbeiten"
    >
      <div className="flex flex-wrap items-start gap-2">
        {/* Textfeld */}
        <div className="flex-1 min-w-[360px]">
          <textarea
            ref={taRef}
            placeholder="Text eingeben…"
            value={value.text}
            onChange={(e) => onChange({ text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { e.preventDefault(); onCancel(); return }
              if (e.key === 'Enter' && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                onOk()
              }
            }}
            rows={3}
            className="w-full rounded-[var(--radius-md)] border border-[--border] bg-[--panel] px-2 py-2 text-sm leading-[1.35]"
            style={{ resize: 'none', overflow: 'hidden' }}
            aria-label="Text"
          />
        </div>

        <span className="h-6 w-px bg-[--border] self-center" aria-hidden />

        {/* Styles */}
        <div className="flex items-center gap-1 self-center" role="group" aria-label="Textstil">
          {([
            { k: 'bold', icon: <Bold className="h-4 w-4" />, active: value.bold },
            { k: 'italic', icon: <Italic className="h-4 w-4" />, active: value.italic },
            { k: 'underline', icon: <Underline className="h-4 w-4" />, active: value.underline },
          ] as const).map(({ k, icon, active }) => (
            <button
              key={k}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ [k]: !active } as Partial<TextCfg>)}
              className={[
                'h-8 w-8 inline-flex items-center justify-center rounded-md border select-none',
                'transition-colors-quick focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/45',
                active
                  ? 'border-[--primary] ring-2 ring-[--primary]/40 shadow-[var(--shadow-sm)]'
                  : 'border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]',
              ].join(' ')}
              title={k === 'bold' ? 'Fett' : k === 'italic' ? 'Kursiv' : 'Unterstrichen'}
            >
              {icon}
            </button>
          ))}
        </div>

        <span className="h-6 w-px bg-[--border] self-center" aria-hidden />

        {/* Größe */}
        <div className="flex items-center gap-1 self-center" role="group" aria-label="Schriftgröße">
          {quickSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ size: s })}
              aria-pressed={currentSize === s}
              title={`${s}px`}
              className={[
                'h-8 px-2 rounded-md border text-[13px] transition-colors-quick',
                currentSize === s
                  ? 'border-[--primary] ring-2 ring-[--primary]/40 shadow-[var(--shadow-sm)]'
                  : 'border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]',
              ].join(' ')}
            >
              {s}
            </button>
          ))}

          <div className="flex items-center gap-1 ml-1">
            <input
              type="number"
              min={8}
              max={200}
              step={1}
              value={currentSize}
              onChange={(e) => {
                const n = Number(e.target.value)
                onChange({ size: Number.isFinite(n) && n > 0 ? n : 20 })
              }}
              className="h-8 w-16 rounded-md border border-[--border] bg-[--panel] px-2 text-sm"
              aria-label="Schriftgröße in px"
            />
            <span className="text-xs text-[--text-muted]">px</span>
          </div>
        </div>

        <span className="h-6 w-px bg-[--border] self-center" aria-hidden />

        {/* Farbe */}
        <label
          className="flex items-center gap-2 text-xs text-[--text-muted] self-center"
          htmlFor={colorId}
          onMouseDownCapture={onColorMouseDownCapture}
        >
          Farbe:
          <input
            id={colorId}
            ref={colorRef}
            type="color"
            value={value.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-7 w-9 border border-[--border] rounded-[var(--radius-sm)] p-0 bg-[--panel]"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onClick={(e) => { if (supportsShowPicker) e.preventDefault() }}
          />
        </label>

        <div className="grow" />

        {/* Aktionen */}
        <div className="flex items-center gap-1 self-center">
          <button
            type="button"
            onClick={onOk}
            className="seg-btn h-8 px-2 text-[13px] border border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_90%,var(--text)_10%)] focus:outline-none focus:ring-2 focus:ring-[--ring]"
            title="Übernehmen"
          >
            <Check className="h-4 w-4 icon" />
            OK
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="seg-btn h-8 px-2 text-[13px] border border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_90%,var(--text)_10%)] focus:outline-none focus:ring-2 focus:ring-[--ring]"
            title="Abbrechen (ESC)"
          >
            <X className="h-4 w-4 icon" />
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}

export default TextEditorOverlay
