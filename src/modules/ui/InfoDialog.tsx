// src/modules/ui/InfoDialog.tsx
import { useEffect, useState } from 'react'
import Button from './Button'

type Props = {
  open: boolean
  onClose: () => void
}

type Tab = 'privacy' | 'imprint'

export default function InfoDialog({ open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('privacy')

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
      aria-labelledby="info-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4"
      // Platz nach unten für die Toolbar/Safe-Area, damit nichts abgeschnitten wird
      style={{ paddingBottom: 'max(16px, var(--toolbar-safe))' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />

      {/* Scaling-Wrapper: skaliert den Dialog mit der Toolbar-Logik */}
      <div
        className="relative z-[1001]"
        style={{
          transform: 'scale(var(--toolbar-scale))',
          transformOrigin: 'center bottom',
        }}
      >
        {/* Panel: flex-col, feste Max-Höhe => Inhalt scrollt, Footer bleibt sichtbar */}
        <div
          className="flex flex-col w-[min(860px,92vw)] rounded-2xl bg-[var(--panel)] shadow-xl ring-1 ring-black/5 overflow-hidden"
          style={{
            // immer vollständig über der Toolbar bleiben
            maxHeight: 'calc(100vh - var(--toolbar-safe) - 24px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <h2 id="info-title" className="text-[15px] font-medium text-[var(--text)]">
              Info · Datenschutz &amp; Impressum
            </h2>
            <Button
              type="button"
              variant="icon"
              size="md"
              onClick={onClose}
              aria-label="Schließen"
              data-prevent-clear-selection
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-[var(--text-muted)]">
                <path d="M6.75 6.75l10.5 10.5M17.25 6.75l-10.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </Button>
          </div>

          {/* Tabs (Outline like Toolbar) */}
          <div className="px-5 pt-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="subtle"
                size="sm"
                aria-pressed={tab === 'privacy'}
                className={tab === 'privacy' ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/40' : undefined}
                onClick={() => setTab('privacy')}
              >
                Datenschutz
              </Button>
              <Button
                type="button"
                variant="subtle"
                size="sm"
                aria-pressed={tab === 'imprint'}
                className={tab === 'imprint' ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/40' : undefined}
                onClick={() => setTab('imprint')}
              >
                Impressum
              </Button>
            </div>
          </div>

          {/* Content (scrollt bei Bedarf) */}
          <div className="flex-1 px-5 pb-5 pt-4 text-[13.5px] leading-6 text-[var(--text)] overflow-auto min-h-0">
            {tab === 'privacy' ? <PrivacyContent /> : <ImprintContent />}
          </div>

          {/* Footer (immer sichtbar) */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)]">
            <Button type="button" variant="subtle" size="md" onClick={onClose}>
              Schließen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------- Inhalt: Datenschutz ----------------------- */
function PrivacyContent() {
  return (
    <article className="space-y-4">
      <header>
        <h3 className="text-[13px] font-semibold text-[var(--text)] mb-1">Datenschutzhinweis für 033-Skizze.de</h3>
      </header>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Verantwortlicher</h4>
        <p className="mt-1">
          Verantwortlich für die Datenverarbeitung auf dieser Website:<br />
          <span className="font-medium">033-Skizze.de</span><br />
          <a className="underline text-[var(--text)]" href="mailto:admin@033-skizze.de">admin@033-skizze.de</a>
        </p>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Grundprinzipien</h4>
        <p className="mt-1">
          033-Skizze.de ist eine rein lokal arbeitende Web-Anwendung zur Erstellung von Unfallskizzen.
          Die Anwendung folgt strikt dem Prinzip „Privacy by Design“:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Keine Registrierung, kein Nutzerkonto</li>
          <li>Keine Speicherung oder Übermittlung personenbezogener Daten</li>
          <li>Offline-fähig: Alle Funktionen können auch ohne Internet genutzt werden</li>
        </ul>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Verarbeitung personenbezogener Daten</h4>
        <p className="mt-1">
          Beim Besuch und bei der Nutzung der Anwendung werden keine personenbezogenen Daten verarbeitet.
          Insbesondere gilt:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Es werden keine Eingaben gespeichert oder an Server gesendet.</li>
          <li>Es werden keine externen Dienste oder Tracking-Tools (Analytics, Werbung etc.) eingebunden.</li>
          <li>Generierte Skizzen (PDF-A) entstehen ausschließlich lokal auf dem Gerät des Nutzers und enthalten keine versteckten Metadaten.</li>
        </ul>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Protokolldaten / Serverlogs</h4>
        <p className="mt-1">
          Der Webserver protokolliert aus technischen Gründen ausschließlich die üblichen Verbindungsdaten
          (z. B. IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Datei). Diese Daten werden nicht ausgewertet
          und nach spätestens <span className="italic">7 Tagen</span> automatisch gelöscht.
        </p>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Cookies und Local Storage</h4>
        <p className="mt-1">
          Die Anwendung verwendet keine Cookies. Lediglich technische Einstellungen (z. B. gewähltes
          Theme/Darstellung) können lokal im Browser-Speicher (Local Storage) abgelegt werden. Diese Daten
          verlassen das Endgerät nicht.
        </p>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Rechte der Nutzer</h4>
        <p className="mt-1">
          Auch wenn keine personenbezogene Verarbeitung erfolgt, bestehen nach der DSGVO grundsätzlich Rechte
          (Auskunft, Löschung, Berichtigung etc.). Da 033-Skizze.de keine personenbezogenen Daten verarbeitet,
          können diese Rechte im Normalfall nicht geltend gemacht werden. Bei Fragen wenden Sie sich bitte an
          die oben angegebenen Kontaktdaten.
        </p>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Sicherheit</h4>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Strenge Content Security Policy (CSP)</li>
          <li>Keine Einbindung externer Ressourcen</li>
          <li>Service Worker zwischenspeichert ausschließlich App-Assets, niemals Benutzerinhalte</li>
        </ul>
      </section>
    </article>
  )
}

/* ------------------------ Inhalt: Impressum ------------------------ */
function ImprintContent() {
  return (
    <article className="space-y-4">
      <header>
        <h3 className="text-[13px] font-semibold text-[var(--text)] mb-1">Impressum</h3>
        <p className="text-[13px] text-[var(--text-muted)]">Angaben gemäß § 5 TMG</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="font-medium">Alexander Milne</p>
          <p>Senator-Hilmer-Straße 13<br />31303 Burgdorf<br />Deutschland</p>
          <p className="mt-1">
            E-Mail: <a className="underline text-[var(--text)]" href="mailto:admin@033-skizze.de">admin@033-skizze.de</a>
          </p>
        </div>
        <div>
          <h4 className="text-[13px] font-semibold text-[var(--text)] mb-1">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h4>
          <p>Alexander Milne<br />Senator-Hilmer-Straße 13<br />31303 Burgdorf</p>
        </div>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Haftung für Inhalte</h4>
        <p className="mt-1">
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte übernehme ich jedoch keine Gewähr. Als Diensteanbieter
          bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          Nach §§ 8 bis 10 TMG bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen
          zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen
          zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          entsprechender Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.
        </p>
      </section>

      <section>
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Urheberrecht / Copyright</h4>
        <p className="mt-1">
          Alle Inhalte dieser Website – einschließlich Texte, Designs und Grafiken – wurden von mir persönlich mit Unterstützung von ChatGPT (OpenAI) erstellt.
          Ein Teil der grafischen Assets stammt von Vecteezy.com und wurde im Rahmen einer Pro-Lizenz erworben; diese Inhalte erfordern daher keinen gesonderten Urheberverweis.
          Weitere Symbole und Icons stammen von lucide.dev und unterliegen einer freien Open-Source-Lizenz (MIT).
          <br /><br />
          Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung oder jede sonstige Verwertung außerhalb der Grenzen des Urheberrechts bedürfen meiner vorherigen schriftlichen Zustimmung.
          Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
      </section>
    </article>
  )
}
