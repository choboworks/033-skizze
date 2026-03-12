import { useEffect } from 'react'
import Button from './Button'

type Props = {
  open: boolean
  onClose: () => void
}

export default function HelpDialog({ open, onClose }: Props) {
  // ESC zum Schließen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(16px, calc(var(--toolbar-safe) + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />

      {/* Scaling-Wrapper */}
      <div
        className="relative z-[1001]"
        style={{ transform: 'scale(var(--toolbar-scale))', transformOrigin: 'center bottom' }}
      >
        {/* Panel */}
        <div
          className="flex flex-col w-[min(860px,92vw)] rounded-2xl bg-[var(--panel)] shadow-xl ring-1 ring-black/5 overflow-hidden"
          style={{ maxHeight: 'calc(var(--dvh) - var(--toolbar-safe) - 24px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <h2 id="help-title" className="text-[15px] font-medium text-[var(--text)]">
              Hilfe · Kurzanleitung &amp; Tastaturkürzel
            </h2>
            <Button type="button" variant="icon" size="md" onClick={onClose} aria-label="Schließen" data-prevent-clear-selection>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-[var(--text-muted)]">
                <path d="M6.75 6.75l10.5 10.5M17.25 6.75l-10.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </Button>
          </div>

          {/* Content (scrollt) */}
          <div className="px-5 pt-4 pb-5 text-[13.5px] leading-6 text-[var(--text)] overflow-auto min-h-0">
            {/* Grundprinzip */}
            <section className="mb-5">
              <h3 className="text-[13px] font-semibold text-[var(--text)] mb-1.5">Grundprinzip</h3>
              <p>
                Elemente aus der linken Bibliothek per Doppelklick oder Drag &amp; Drop auf die Leinwand (Hoch- oder Querformat) setzen. Mit der Maus
                verschieben, skalieren oder rotieren. Halte SHIFT gedrückt für freie Rotation. Nutze den Ebenen-Manager rechts, um Objekte in der Reihenfolge
                zu ändern, sie zu löschen oder zu gruppieren. Alle nicht-farbigen Fahrzeuge sowie die Objekte aus dem Objekte-Tool,
                kannst du mit dem Fülllen-Tool beliebig einfärben.
                Exportiere direkt als <span className="font-mono">PDF/A</span> oder drucke unmittelbar aus.
              </p>
            </section>

            {/* Shortcuts */}
            <section className="mb-5">
              <h3 className="text-[13px] font-semibold text-[var(--text)] mb-1.5">Tastaturkürzel</h3>
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <Row k="Als PDF speichern" v="STRG + S" />
                <Row k="Drucken" v="STRG + P" />
                <Row k="Rückgängig / Wiederherstellen" v="STRG + Z  /  STRG + Y" />
                <Row k="Zoom In / Out / 100%" v="+  /  -  /  0" />
                <Row k="Pan (Hand-Tool)" v="Leertaste gedrückt halten" />
                <Row k="Auswahl aufheben" v="Esc" />
                <Row k="Löschen" v="Entf / Backspace" />
              </div>
            </section>

            {/* Tipps */}
            <section>
              <h3 className="text-[13px] font-semibold text-[var(--text)] mb-1.5">Tipps</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bewege die Leinwand, indem du die <span className="font-mono">Leertaste</span> gedrückt hältst.</li>
                <li>Du kannst Straßenelemente miteinander verbinden (Snapping/Verbund).</li>
                <li>Färbe Fahrzeuge und Formen des <span className="font-mono">Objekte</span>-Tools mit dem <span className="font-mono">Füllen</span>-Werkzeug ein.</li>
                <li>Im Objekte-Tool halte <span className="font-mono">Alt</span> beim Ziehen, für Quadrate/Kreise bzw. gleichseitige Dreiecke.</li>
                <li>Halte beim Rotieren <span className="font-mono">Shift</span> gedrückt, um frei zu rotieren.</li>
                <li>Du kannst beliebig viele Ebenen im Ebenen-Manager gruppieren.</li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)]">
            <Button type="button" variant="subtle" size="md" onClick={onClose}>Schließen</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b last:border-0 border-[var(--border)] px-3 py-2.5">
      <div className="text-[var(--text)]">{k}</div>
      <div className="font-mono text-[var(--text)]">{v}</div>
    </div>
  )
}
