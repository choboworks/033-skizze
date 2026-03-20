import { useState } from 'react'
import { useAppStore } from '@/store'
import { Scaling } from 'lucide-react'

export function MetadataPanel() {
  const document = useAppStore((s) => s.document)
  const updateDocument = useAppStore((s) => s.updateDocument)
  const scale = useAppStore((s) => s.scale)
  const viewport = useAppStore((s) => s.viewport)

  const hasOverride = scale.viewport !== null
  const effectiveScale = hasOverride ? Math.round(scale.viewport!.scale) : scale.currentScale
  const zoomPercent = Math.round(viewport.zoom * 100)

  return (
    <div className="flex flex-col gap-3">
      {/* Falldaten & Dokument-Metadaten */}
      <GlassPanel title="Falldaten & Dokument-Metadaten">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <InfoBlock label="Fallnummer" value={document.caseNumber} onChange={(v) => updateDocument({ caseNumber: v })} />
          <InfoBlock label="Datum / Uhrzeit" value={document.date} onChange={(v) => updateDocument({ date: v })} />
        </div>

        <div
          className="space-y-2.5"
          style={{
            padding: 14,
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'var(--surface-raised)',
          }}
        >
          <InfoRow label="Bearbeiter" value={document.officer || '—'} />
          <InfoRow label="Ort" value={document.name} />
          <InfoRow label="Canvas" value="DIN A4" />
          <InfoRow label="Zoom" value={`${zoomPercent}%`} accent />
        </div>
      </GlassPanel>

      {/* Skizzenoptionen */}
      <GlassPanel title="Skizzenoptionen">
        <div
          className="space-y-3"
          style={{
            padding: 14,
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: 'var(--surface-raised)',
          }}
        >
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: 'var(--text-secondary)' }}>Grid anzeigen</span>
            <ToggleSwitch />
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: 'var(--text-secondary)' }}>Snap aktiv</span>
            <ToggleSwitch defaultOn />
          </div>
        </div>
      </GlassPanel>

      {/* Maßstab-System */}
      <GlassPanel title="Maßstab-System">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              Aktueller Maßstab
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {hasOverride ? 'Manuell (Ausschnitt-Override)' : 'Automatisch aus realen Objekten berechnet'}
            </div>
          </div>
          <span className="badge badge-accent" style={{ fontSize: 11 }}>
            <Scaling size={12} />
            1:{effectiveScale}
          </span>
        </div>

        <div className="h-px mb-3" style={{ background: 'var(--border)' }} />

        <div className="grid grid-cols-2 gap-2">
          {['1:10', '1:25', '1:50', '1:100', '1:250', '1:500', '1:1000'].map((step) => {
            const val = parseInt(step.split(':')[1])
            const isActive = effectiveScale === val
            return (
              <div
                key={step}
                className="px-3 py-2 text-[11px] font-medium"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: isActive ? 'var(--accent-muted)' : 'var(--surface)',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {step}
              </div>
            )
          })}
        </div>
      </GlassPanel>
    </div>
  )
}

function GlassPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="glass"
      style={{ borderRadius: 20, padding: 14 }}
    >
      <div className="text-[12px] font-semibold tracking-wide mb-3" style={{ color: 'var(--text)' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function InfoBlock({ label, value, onChange }: { label: string; value: string; onChange?: (v: string) => void }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 20,
        border: '1px solid var(--border)',
        background: 'var(--surface-raised)',
      }}
    >
      <div className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      {onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-[13px] font-semibold bg-transparent border-none outline-none w-full"
          style={{ color: 'var(--text)', padding: 0 }}
        />
      ) : (
        <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
      )}
    </div>
  )
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</span>
    </div>
  )
}

function ToggleSwitch({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative w-9 h-5 rounded-full transition-colors"
      style={{
        background: on ? 'var(--accent)' : 'var(--surface-active)',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
        style={{
          background: 'var(--paper)',
          left: on ? 18 : 2,
          transition: 'left 0.15s ease',
        }}
      />
    </button>
  )
}
