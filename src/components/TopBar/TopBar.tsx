import { useAppStore } from '@/store'
import {
  Settings,
  ChevronDown,
  Sun,
  Moon,
  Check,
  WifiOff,
  X,
  Undo2,
  Redo2,
  Save,
  Download,
  Route,
  Scaling,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export function TopBar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const documentName = useAppStore((s) => s.document.name)
  const document = useAppStore((s) => s.document)
  const updateDocument = useAppStore((s) => s.updateDocument)
  const scale = useAppStore((s) => s.scale)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showDocPanel, setShowDocPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const hasOverride = scale.viewport !== null
  const effectiveScale = hasOverride ? Math.round(scale.viewport!.scale) : scale.currentScale

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Close panel on outside click
  useEffect(() => {
    if (!showDocPanel) return
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowDocPanel(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [showDocPanel])

  return (
    <header
      className="glass flex items-center select-none shrink-0"
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '0 var(--space-lg)',
        height: 'var(--topbar-height)',
      }}
    >
      {/* Left: Logo + App Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1 relative" ref={panelRef}>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
          }}
        >
          <Route size={18} style={{ color: '#000' }} />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>033-Skizze V2</div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Verkehrsunfallskizzen-Tool</div>
        </div>
      </div>

      {/* Center: Badges */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={() => setShowDocPanel(!showDocPanel)}
          className="badge badge-accent"
          style={{ cursor: 'pointer', border: 'none' }}
        >
          {documentName}
          <ChevronDown
            size={12}
            style={{
              transform: showDocPanel ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.15s',
            }}
          />
        </button>

        <span className="badge badge-success">
          <Scaling size={12} />
          {hasOverride ? `1:${effectiveScale} (Override)` : `1:${effectiveScale}`}
        </span>

        <span className="badge" style={{ gap: 4 }}>
          {isOnline ? (
            <>
              <Check size={11} style={{ color: 'var(--success)' }} />
              <span>Gespeichert</span>
            </>
          ) : (
            <>
              <WifiOff size={11} />
              <span>Offline</span>
            </>
          )}
        </span>
      </div>

      {/* Document Properties Dropdown */}
      {showDocPanel && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass anim-slide-down z-50"
          style={{
            width: 340,
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Dokument-Eigenschaften
            </span>
            <button className="icon-btn" style={{ padding: 3 }} onClick={() => setShowDocPanel(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <DocField label="Dateiname" value={documentName} onChange={(v) => updateDocument({ name: v })} />
            <DocField label="Aktenzeichen" value={document.caseNumber} onChange={(v) => updateDocument({ caseNumber: v })} />
            <DocField label="Datum" value={document.date} onChange={(v) => updateDocument({ date: v })} />
            <DocField label="Sachbearbeiter" value={document.officer} onChange={(v) => updateDocument({ officer: v })} />
            <DocField label="Dienststelle" value={document.department} onChange={(v) => updateDocument({ department: v })} />
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <button className="icon-btn" onClick={toggleTheme} title={`${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="icon-btn" title="Einstellungen">
          <Settings size={16} />
        </button>

        <div className="w-px h-6 mx-1" style={{ background: 'var(--border)' }} />

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[12px] font-medium transition-colors"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
          title="Rückgängig"
        >
          <Undo2 size={14} />
          <span className="hidden xl:inline">Undo</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[12px] font-medium transition-colors"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface)')}
          title="Speichern"
        >
          <Save size={14} />
          <span className="hidden xl:inline">Save</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[12px] font-semibold transition-colors"
          style={{
            background: 'var(--accent)',
            color: '#000',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
          title="Exportieren"
        >
          <Download size={14} />
          <span className="hidden xl:inline">Export</span>
        </button>
      </div>
    </header>
  )
}

function DocField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="field-label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}
