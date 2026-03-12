import { useEffect, useMemo, useRef, useState } from 'react'
import type { MetaStore } from './RightSidebar'
import Button from '../ui/Button'
import dienststellenRaw from './dienststellenAll'

type Dienststelle = {
  id: string
  name: string
  adresse: string
  telefon?: string
}

const DIENSTSTELLEN = dienststellenRaw as Dienststelle[]

const REQUIRED_FIELDS: (keyof MetaStore)[] = [
  'department',
  'officer',
  'caseNumber',
  'date',
]

type VorgangsdatenModalProps = {
  meta: MetaStore
  onCancel: () => void
  onSave: (next: MetaStore) => void
}

export function VorgangsdatenModal({ meta, onCancel, onSave }: VorgangsdatenModalProps) {
  const [form, setForm] = useState<MetaStore>(() => ({
    ...meta,
    date: meta.date ?? new Date().toISOString().slice(0, 10),
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof MetaStore, string>>>({})

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const updateField = <K extends keyof MetaStore>(key: K, value: MetaStore[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleDienststelleSelect = (ds: Dienststelle) => {
    setForm((prev) => {
      const next: MetaStore = { ...prev }
      next.department = ds.name

      const parsed = parseAdresse(ds.adresse)
      if (parsed.street) next.street = parsed.street
      if (parsed.zip) next.zip = parsed.zip
      if (parsed.city) next.city = parsed.city
      if (ds.telefon) next.stationPhone = ds.telefon

      return next
    })
    setErrors((prev) => {
      const next = { ...prev }
      delete next.department
      return next
    })
  }

  const handleSubmit = () => {
    const next = { ...form }
    const newErrors: Partial<Record<keyof MetaStore, string>> = {}

    for (const key of REQUIRED_FIELDS) {
      const value = next[key]
      if (!value || String(value).trim().length === 0) {
        newErrors[key] = 'Pflichtfeld'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(next)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vorgangsdaten-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        paddingBottom:
          'max(16px, calc(var(--toolbar-safe) + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onCancel}
      />

      <div
        className="relative z-[1001]"
        style={{
          transform: 'scale(var(--toolbar-scale))',
          transformOrigin: 'center bottom',
        }}
      >
        <div
          className="flex flex-col w-[min(720px,92vw)] rounded-2xl bg-[var(--panel)] shadow-xl ring-1 ring-black/5 overflow-hidden"
          style={{ maxHeight: 'calc(var(--dvh) - var(--toolbar-safe) - 24px)' }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <h2
              id="vorgangsdaten-title"
              className="text-[15px] font-medium text-[var(--text)]"
            >
              Vorgangsdaten
            </h2>
            <Button
              type="button"
              variant="icon"
              size="md"
              onClick={onCancel}
              aria-label="Schließen"
              data-prevent-clear-selection
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden
                className="text-[var(--text-muted)]"
              >
                <path
                  d="M6.75 6.75l10.5 10.5M17.25 6.75l-10.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>

          <form
            className="px-5 pt-4 pb-5 overflow-auto min-h-0"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Überschrift optional */}
              <Field
                label="Überschrift (optional)"
                value={form.title ?? ''}
                onChange={(v) => updateField('title', v)}
                placeholder="z.B. Verkehrsunfallskizze"
                colSpan={2}
              />

              <DienststelleField
                value={form.department ?? ''}
                error={errors.department}
                onChangeText={(v) => updateField('department', v)}
                onSelectDienststelle={handleDienststelleSelect}
              />

              <Field
                label="Dienstabteilung (optional)"
                value={form.unit ?? ''}
                onChange={(v) => updateField('unit', v)}
                placeholder="z.B. Einsatz- und Streifendienst Dienstabteilung 4"
                colSpan={2}
              />

              <Field
                label="Sachbearbeiterin/ Sachbearbeiter*"
                value={form.officer}
                error={errors.officer}
                onChange={(v) => updateField('officer', v)}
                placeholder="z.B. Milne, PK"
              />

              <Field
                label="Vorgangsnummer*"
                value={form.caseNumber}
                error={errors.caseNumber}
                onChange={(v) => updateField('caseNumber', v)}
                placeholder="z.B. 202501..."
              />

              <Field
                label="Datum*"
                type="date"
                value={form.date ?? ''}
                error={errors.date}
                onChange={(v) => updateField('date', v)}
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-[var(--border)] pt-3">
              <Button
                type="button"
                variant="subtle"
                size="md"
                onClick={onCancel}
              >
                Abbrechen
              </Button>
              <Button type="submit" size="md">
                Übernehmen
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- UI-Bausteine ----------------------------- */

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'date'
  error?: string
  colSpan?: 1 | 2
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  colSpan = 1,
}: FieldProps) {
  return (
    <div className={colSpan === 2 ? 'sm:col-span-2 col-span-1' : ''}>
      <label className="flex flex-col gap-1 text-[12px]">
        <span className="text-[var(--text)]">{label}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-3 py-2 text-[13px] bg-[var(--panel-elev)] border-[var(--border)] outline-none
            focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] ${
              error ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          style={{ color: 'var(--text)' }}
        />
      </label>
      {error && (
        <p className="mt-1 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

type DienststelleFieldProps = {
  value: string
  error?: string
  onChangeText: (v: string) => void
  onSelectDienststelle: (ds: Dienststelle) => void
}

function DienststelleField({
  value,
  error,
  onChangeText,
  onSelectDienststelle,
}: DienststelleFieldProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value ?? '')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setQuery(value ?? '')
  }, [value])

  // Suche: id + Name + Adresse werden berücksichtigt
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DIENSTSTELLEN
    return DIENSTSTELLEN.filter((d) => {
      const hay = (d.id + ' ' + d.name + ' ' + d.adresse).toLowerCase()
      return hay.includes(q)
    })
  }, [query])

  // Klick außerhalb → Dropdown schließen
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [open])

  const handleSelect = (ds: Dienststelle) => {
    onSelectDienststelle(ds)
    setQuery(ds.name)
    setOpen(false)
  }

  return (
    <div className="sm:col-span-2 col-span-1" ref={containerRef}>
      <label className="flex flex-col gap-1 text-[12px]">
        <span className="text-[var(--text)]">Dienststelle*</span>
        <div
          className={`relative w-full rounded-xl border bg-[var(--panel-elev)] ${
            error ? 'border-red-500' : 'border-[var(--border)]'
          } focus-within:border-[var(--ring)] focus-within:ring-1 focus-within:ring-[var(--ring)]`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const v = e.target.value
              setQuery(v)
              onChangeText(v)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // kleiner Delay, damit Klick auf einen Eintrag noch verarbeitet wird
              setTimeout(() => setOpen(false), 80)
            }}
            placeholder="z.B. Polizeiinspektion Hannover"
            className="w-full bg-transparent outline-none text-[13px] px-3 py-2 pr-7"
            style={{ color: 'var(--text)' }}
          />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="absolute inset-y-0 right-0 px-2 flex items-center justify-center"
            tabIndex={-1}
            aria-label="Dienststelle auswählen"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden
              className="text-[var(--text-muted)]"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && list.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-lg max-h-60 overflow-auto z-[1100]">
              {list.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onMouseDown={(e) => {
                    // verhindert, dass das Input blur zuerst schließt und danach wieder öffnet
                    e.preventDefault()
                    handleSelect(d)
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] hover:bg-[var(--panel-elev)]"
                >
                  <div className="font-medium text-[var(--text)]">
                    {d.name}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {d.adresse}
                    {d.telefon ? ` · ${d.telefon}` : ''}
                  </div>
                </button>
              ))}
            </div>
          )}

          {open && list.length === 0 && (
            <div className="absolute left-0 right-0 mt-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[11px] text-[var(--text-muted)] px-3 py-2 z-[1100]">
              Keine Dienststelle gefunden. Freitext bleibt erhalten.
            </div>
          )}
        </div>
      </label>
      {error && (
        <p className="mt-1 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}


/* --------------------------- Adresse parsen --------------------------- */

function parseAdresse(adresse: string | undefined): {
  street?: string
  zip?: string
  city?: string
} {
  if (!adresse) return {}
  const parts = adresse.split(',')
  if (parts.length < 2) {
    return { street: adresse }
  }
  const street = parts[0].trim()
  const rest = parts[1].trim()
  const restParts = rest.split(' ').filter(Boolean)
  const zip = restParts[0]
  const city = restParts.slice(1).join(' ') || undefined
  return { street, zip, city }
}
