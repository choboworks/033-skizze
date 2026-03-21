import { useAppStore } from '@/store'

// ============================================================
// MetadataPanel – Premium editor-style document metadata
// Three sections: Vorgang, Zuständigkeit, Bearbeitung
// ============================================================

export function MetadataPanel() {
  const document = useAppStore((s) => s.document)
  const updateDocument = useAppStore((s) => s.updateDocument)

  return (
    <div className="flex flex-col" style={{ padding: 14, gap: 16 }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>
          Metadaten
        </div>
        <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Falldaten & Zuständigkeit
        </div>
      </div>

      {/* Sektion 1 – Vorgang */}
      <SectionCard title="Vorgang">
        <MetaField
          label="Überschrift"
          value={document.name}
          onChange={(v) => updateDocument({ name: v })}
        />
        <MetaField
          label="Vorgangsnummer"
          value={document.caseNumber}
          onChange={(v) => updateDocument({ caseNumber: v })}
          placeholder="Vg.-Nr."
        />
        <MetaField
          label="Datum"
          value={document.date}
          onChange={(v) => updateDocument({ date: v })}
          type="date"
        />
      </SectionCard>

      {/* Sektion 2 – Zuständigkeit */}
      <SectionCard title="Zuständigkeit">
        <MetaField
          label="Dienststelle"
          value={document.department}
          onChange={(v) => updateDocument({ department: v })}
          placeholder="z. B. PI Musterstadt"
        />
        <MetaField
          label="Dienstabteilung"
          value={document.subdivision}
          onChange={(v) => updateDocument({ subdivision: v })}
          placeholder="z. B. ESD DAIV"
        />
      </SectionCard>

      {/* Sektion 3 – Bearbeitung */}
      <SectionCard title="Bearbeitung">
        <MetaField
          label="Sachbearbeiter/in"
          value={document.officer}
          onChange={(v) => updateDocument({ officer: v })}
          placeholder="Name, Dienstgrad"
        />
      </SectionCard>
    </div>
  )
}

// --- Section Card ---
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col"
      style={{
        padding: 14,
        borderRadius: 16,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
        gap: 12,
      }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-[0.08em]"
        style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

// --- Metadata Field ---
function MetaField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label
        className="text-[10.5px]"
        style={{ color: 'rgba(255,255,255,0.48)', fontWeight: 500 }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          height: 36,
          padding: '0 12px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.07)',
          fontSize: 12,
          color: 'var(--text)',
          outline: 'none',
          transition: 'background var(--duration-hover) var(--ease-out-fast), border-color var(--duration-hover) var(--ease-out-fast), box-shadow var(--duration-hover) var(--ease-out-fast), transform var(--duration-press) var(--ease-out-fast)',
        }}
        onMouseEnter={(e) => {
          if (e.currentTarget !== window.document.activeElement) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
          }
        }}
        onMouseLeave={(e) => {
          if (e.currentTarget !== window.document.activeElement) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.045)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.42)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.10)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.045)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.background = 'rgba(255,255,255,0.045)'
        }}
      />
    </div>
  )
}
