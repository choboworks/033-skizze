import { useState, useRef, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store'
import { DIENSTSTELLEN, type Dienststelle } from './Dienststellen/dienststellenAll'

// ============================================================
// MetadataPanel - Premium editor-style document metadata
// Three sections: Vorgang, Zustandigkeit, Bearbeitung
// ============================================================

export function MetadataPanel() {
  const document = useAppStore((s) => s.document)
  const updateDocument = useAppStore((s) => s.updateDocument)

  return (
    <div className="glass flex flex-col h-full min-h-0" style={{ borderRadius: 24 }}>
      <div className="flex-1 overflow-y-auto" style={{ padding: 14 }}>
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              Metadaten
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Falldaten & Zustandigkeit
            </div>
          </div>

          <SectionCard title="Vorgang">
            <MetaField
              label="Uberschrift"
              value={document.name}
              onChange={(v) => updateDocument({ name: v })}
            />
            <MetaField
              label="Vorgangsnummer"
              value={document.caseNumber}
              onChange={(v) => updateDocument({ caseNumber: v })}
              placeholder="Vg.-Nr."
              required
            />
            <MetaField
              label="Datum"
              value={document.date}
              onChange={(v) => updateDocument({ date: v })}
              type="date"
              required
            />
          </SectionCard>

          <SectionCard title="Zustandigkeit">
            <DienststellenField
              value={document.department}
              onSelect={(name, address, phone) => updateDocument({ department: name, departmentAddress: address, departmentPhone: phone })}
              onManualChange={(v) => updateDocument({ department: v })}
              required
            />
            {(!document.departmentAddress || !document.departmentPhone) && document.department.trim() !== '' && (
              <>
                <MetaField
                  label="Adresse"
                  value={document.departmentAddress}
                  onChange={(v) => updateDocument({ departmentAddress: v })}
                  placeholder="Strasse, PLZ Stadt"
                />
                <MetaField
                  label="Telefon"
                  value={document.departmentPhone}
                  onChange={(v) => updateDocument({ departmentPhone: v })}
                  placeholder="+49 ..."
                />
              </>
            )}
            <MetaField
              label="Dienstabteilung"
              value={document.subdivision}
              onChange={(v) => updateDocument({ subdivision: v })}
              placeholder="z. B. ESD DAIV"
            />
          </SectionCard>

          <SectionCard title="Bearbeitung">
            <MetaField
              label="Sachbearbeiter/in"
              value={document.officer}
              onChange={(v) => updateDocument({ officer: v })}
              placeholder="Name, Dienstgrad"
              required
            />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col"
      style={{
        padding: 14,
        borderRadius: 16,
        background: 'var(--panel-control-bg)',
        border: '1px solid var(--panel-control-border)',
        boxShadow: 'inset 0 1px 0 var(--border-subtle)',
        gap: 12,
      }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-[0.08em]"
        style={{ color: 'var(--text-muted)', marginBottom: 6 }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

function MetaField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  const isEmpty = required && value.trim() === ''

  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label
        className="text-[10.5px] flex items-center gap-1"
        style={{ color: isEmpty ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 500 }}
      >
        {label}
        {required && <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>}
      </label>
      <input
        className="meta-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={isEmpty ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 1px rgba(239,68,68,0.15)' } : undefined}
      />
    </div>
  )
}

function DienststellenField({
  value,
  onSelect,
  onManualChange,
  required = false,
}: {
  value: string
  onSelect: (name: string, address: string, phone: string) => void
  onManualChange: (v: string) => void
  required?: boolean
}) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isEmpty = required && value.trim() === ''

  useEffect(() => { setQuery(value) }, [value])

  const results = query.trim().length === 0
    ? DIENSTSTELLEN
    : DIENSTSTELLEN.filter((d) => {
        const q = query.toLowerCase()
        return d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
      })

  const selectItem = useCallback((d: Dienststelle) => {
    onSelect(d.name, d.adresse, d.telefon)
    setQuery(d.name)
    setOpen(false)
    setActiveIdx(-1)
  }, [onSelect])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      selectItem(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col relative" style={{ gap: 6 }} ref={wrapperRef}>
      <label
        className="text-[10.5px] flex items-center gap-1"
        style={{ color: isEmpty ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 500 }}
      >
        Dienststelle
        {required && <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>}
      </label>
      <input
        className="meta-input"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onManualChange(e.target.value)
          setOpen(true)
          setActiveIdx(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Dienststelle suchen ..."
        style={isEmpty ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 1px rgba(239,68,68,0.15)' } : undefined}
      />

      {open && results.length > 0 && (
        <div
          ref={listRef}
          className="anim-fade-in"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 240,
            overflowY: 'auto',
            background: 'var(--panel-bg-elevated)',
            border: '1px solid var(--panel-border)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
            padding: 4,
          }}
        >
          {results.map((d, i) => (
            <button
              key={d.id}
              className="w-full text-left"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: i === activeIdx ? 'var(--surface-hover)' : 'transparent',
                transition: 'background var(--duration-hover) var(--ease-out-fast)',
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseDown={(e) => { e.preventDefault(); selectItem(d) }}
            >
              <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 500 }}>
                {d.name}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>
                {d.adresse}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
