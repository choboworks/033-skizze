import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const MODES = [
  { id: 'line',       label: 'Linie' },
  { id: 'arrow-end',  label: 'Pfeil (Ende)' },
  { id: 'arrow-both', label: 'Pfeil (beide)' },
  { id: 'arrow-curve', label: 'Gebogener Pfeil' }, // ⬅️ NEU
  { id: 'rect',       label: 'Rechteck' },
  { id: 'ellipse',    label: 'Ellipse' },
  { id: 'triangle',   label: 'Dreieck' },
] as const

type Mode = (typeof MODES)[number]['id']

function onToolbarMoved(handler: () => void): () => void {
  window.addEventListener('app:toolbar-moved', handler as EventListener)
  return () => window.removeEventListener('app:toolbar-moved', handler as EventListener)
}

export function ObjectsPopover() {
  const objectsMode = useAppStore((s) => s.ui.objectsMode)
  const setObjectsMode = useAppStore((s) => s.uiSetObjectsMode)
  const uiSetTool    = useAppStore((s) => s.uiSetTool)

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const [ready, setReady] = useState(false)

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

  const node = (
    <div
      ref={wrapRef}
      className="floating-surface px-3 py-2 min-w-[520px] max-w-[85vw] z-[900]"
      style={{
        position: 'fixed',
        left: pos.left,
        top: pos.top,
        visibility: ready ? 'visible' : 'hidden',
      }}
      role="dialog"
      aria-label="Objekte"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Modus-Auswahl */}
        <div role="group" aria-label="Zeichenelement wählen" className="flex items-center gap-1">
          {MODES.map((m) => {
            const active = objectsMode === (m.id as Mode)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setObjectsMode(m.id as Mode)}
                aria-pressed={active}
                title={m.label}
                className={[
                  'h-8 px-3 rounded-md border text-[13px] select-none',
                  'transition-colors-quick focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/45',
                  active
                    ? 'border-[--primary] ring-2 ring-[--primary]/40 shadow-[var(--shadow-sm)]'
                    : 'border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]',
                ].join(' ')}
              >
                {m.label}
              </button>
            )
          })}
        </div>

        <span className="h-5 w-px bg-[--border] mx-1" aria-hidden />

        <div className="grow" />

        <button
          type="button"
          onClick={() => uiSetTool('select')}
          className="seg-btn h-8 px-2 text-[13px] border border-[--border] hover:[background-color:color-mix(in_srgb,var(--panel)_90%,var(--text)_10%)] focus:outline-none focus:ring-2 focus:ring-[--ring]"
        >
          <Check className="h-4 w-4 icon" />
          Fertig
        </button>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}

export default ObjectsPopover
