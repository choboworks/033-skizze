// src/modules/actions/RightSidebar.tsx
import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import LayerList from '../layers/LayerList'

// UI-Primitives
import { SidebarSection } from '../ui/SidebarSection'
import { SidebarButton } from '../ui/SidebarButton'
import FooterIndex from '../footer/FooterIndex'
import { VorgangsdatenModal } from './vorgangsdatenModal'

// PNG-Icons aus /public/assets
const ICON = {
  headline: '/assets/headline.png',
  case: '/assets/case.png',
  user: '/assets/user.png',
  import: '/assets/import.png',
  pdf: '/assets/pdf.png',
  print: '/assets/print.png',
} as const

export type MetaStore = {
  title: string
  caseNumber: string
  officer: string

  department?: string
  unit?: string
  street?: string
  zip?: string
  city?: string
  stationPhone?: string
  officerPhone?: string
  date?: string
}

export type MetaPayload = {
  title: string
  caseNumber: string
  agent: string

  department?: string
  unit?: string
  street?: string
  zip?: string
  city?: string
  stationPhone?: string
  officerPhone?: string
  dateISO?: string
}

function buildMetaPayload(meta: MetaStore): MetaPayload {
  return {
    title: meta.title ?? '',
    caseNumber: meta.caseNumber ?? '',
    agent: meta.officer ?? '',
    department: meta.department,
    unit: meta.unit,
    street: meta.street,
    zip: meta.zip,
    city: meta.city,
    stationPhone: meta.stationPhone,
    officerPhone: meta.officerPhone,
    dateISO: meta.date,
  }
}

function dispatchMetaUpdate(payload: MetaPayload): void {
  window.dispatchEvent(new CustomEvent<MetaPayload>('app:meta-update', { detail: payload }))
}

export function RightSidebar() {
  const meta = useAppStore((s) => s.meta as MetaStore)
  const setMeta = useAppStore((s) => s.uiSetMeta as (partial: Partial<MetaStore>) => void)

  const [metaDialogOpen, setMetaDialogOpen] = useState(false)

  useEffect(() => {
    const onPing = () => dispatchMetaUpdate(buildMetaPayload(meta))

    window.addEventListener('app:meta-ping', onPing)
    onPing()

    return () => {
      window.removeEventListener('app:meta-ping', onPing)
    }
  }, [meta])

  const handleSaveMeta = (next: MetaStore) => {
    setMeta(next)
    dispatchMetaUpdate(buildMetaPayload(next))
    setMetaDialogOpen(false)
  }

  return (
    <>
      <div className="h-full min-h-full bg-[var(--panel)] border-l border-[var(--border)] transition-colors-quick">
        <div className="flex h-full flex-col">
          {/* Aktionen-Sektion */}
          <SidebarSection title="Aktionen">
            <MetaSummaryCard onClick={() => setMetaDialogOpen(true)} />

            <div className="grid grid-cols-1 gap-2">
              <SidebarButton
                label="Bild Import"
                iconSrc={ICON.import}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('app:import-image'))
                }}
              />
              <SidebarButton
                label="Als PDF speichern"
                iconSrc={ICON.pdf}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('app:export-pdf', { detail: { withHeader: true } }),
                  )
                }}
              />
              <SidebarButton
                label="Drucken"
                iconSrc={ICON.print}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('app:print', { detail: { withHeader: true } }),
                  )
                }}
              />
            </div>
          </SidebarSection>

          {/* Layer-Manager – kein flex-1 mehr, damit Footer höher sitzt */}
          <div className="px-3 pt-2 pb-4">
            <LayerList />
          </div>

          {/* Footer-Aktionen */}
          <div className="px-3 pb-3">
            <div className="-mx-3 mt-2 mb-3 h-px border-t border-[var(--border)]/55" />
            <FooterIndex
              className="justify-center"
              onTheme={() => window.dispatchEvent(new CustomEvent('app:toggle-theme'))}
              onFormat={() => window.dispatchEvent(new CustomEvent('app:toggle-format'))}
              onInfo={() => window.dispatchEvent(new CustomEvent('app:open-info'))}
              onHelp={() => window.dispatchEvent(new CustomEvent('app:open-help'))}
              onContact={() => window.dispatchEvent(new CustomEvent('app:open-contact'))}
            />
          </div>
        </div>
      </div>

      {metaDialogOpen && (
        <VorgangsdatenModal
          meta={meta}
          onCancel={() => setMetaDialogOpen(false)}
          onSave={handleSaveMeta}
        />
      )}
    </>
  )
}

type MetaSummaryCardProps = {
  onClick: () => void
}

/**
 * Button im Sidebar-Stil (64px Höhe, 24px Icon),
 * optisch angelehnt an SidebarButton.
 */
function MetaSummaryCard({ onClick }: MetaSummaryCardProps) {
  const base =
    'w-full min-h-[64px] flex items-center gap-4 px-4 py-3 rounded-2xl border text-base transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/45'
  const idle =
    'border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--panel-elev)]'

  return (
    <button
      type="button"
      onClick={onClick}
      className={[base, idle].join(' ')}
    >
      <span className="flex-none grid place-items-center h-6 w-6">
        <img
          src={ICON.headline}
          alt=""
          aria-hidden
          className="block h-5 w-5 object-contain select-none"
          draggable={false}
        />
      </span>

      <span className="truncate leading-[1.2] text-[var(--text)] font-regular">
        Vorgangsdaten
      </span>
    </button>
  )
}

export default RightSidebar
