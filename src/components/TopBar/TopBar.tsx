import { useAppStore } from '@/store'
import {
  Settings,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Check,
  WifiOff,
  Share2,
  X,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const logoPng = '/logo.png'

export function TopBar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const documentName = useAppStore((s) => s.document.name)
  const document = useAppStore((s) => s.document)
  const updateDocument = useAppStore((s) => s.updateDocument)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [editing, setEditing] = useState(false)
  const [nameValue, setNameValue] = useState(documentName)
  const [showDocPanel, setShowDocPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

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

  const handleNameSubmit = () => {
    const trimmed = nameValue.trim()
    if (trimmed) {
      updateDocument({ name: trimmed })
    } else {
      setNameValue(documentName)
    }
    setEditing(false)
  }

  return (
    <div
      className="flex items-center select-none shrink-0"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 var(--space-md)',
      }}
    >
      {/* Left: Logo + Filename + Doc Dropdown */}
      <div className="flex items-center gap-3 min-w-0 flex-1 relative">
        <img src={logoPng} alt="033-Skizze" className="h-7 shrink-0" />

        <div className="flex items-center gap-1 min-w-0 relative" ref={panelRef}>
          {editing ? (
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSubmit()
                if (e.key === 'Escape') {
                  setNameValue(documentName)
                  setEditing(false)
                }
              }}
              className="bg-transparent border rounded px-2 py-1 text-sm outline-none min-w-30"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--text)',
                width: `${Math.max(nameValue.length * 8, 120)}px`,
              }}
            />
          ) : (
            <button
              onClick={() => setShowDocPanel(!showDocPanel)}
              className="flex items-center gap-1 px-2 py-1 rounded transition-colors truncate"
              style={{ color: 'var(--text)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--surface-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <span className="text-sm font-medium truncate">{documentName}</span>
              <ChevronDown
                size={14}
                style={{
                  color: 'var(--text-muted)',
                  transform: showDocPanel ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.15s',
                }}
              />
            </button>
          )}

          {/* Document Properties Dropdown */}
          {showDocPanel && (
            <div
              className="absolute top-full left-0 mt-1 rounded-lg z-50"
              style={{
                width: 320,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Dokument-Eigenschaften
                </span>
                <button
                  className="icon-btn"
                  style={{ padding: 3 }}
                  onClick={() => setShowDocPanel(false)}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Fields */}
              <div className="p-3 flex flex-col gap-3">
                <DocField
                  label="Dateiname"
                  value={documentName}
                  onChange={(v) => updateDocument({ name: v })}
                />
                <DocField
                  label="Aktenzeichen"
                  value={document.caseNumber}
                  onChange={(v) => updateDocument({ caseNumber: v })}
                />
                <DocField
                  label="Datum"
                  value={document.date}
                  onChange={(v) => updateDocument({ date: v })}
                />
                <DocField
                  label="Sachbearbeiter"
                  value={document.officer}
                  onChange={(v) => updateDocument({ officer: v })}
                />
                <DocField
                  label="Dienststelle"
                  value={document.department}
                  onChange={(v) => updateDocument({ department: v })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Brand */}
      <div className="flex items-center justify-center">
        <span
          className="text-xs font-bold tracking-[0.15em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          033 Skizze
        </span>
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-1 flex-1 justify-end">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded mr-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {isOnline ? (
            <>
              <Check size={14} style={{ color: 'var(--success)' }} />
              <span className="text-xs">Lokal gespeichert</span>
            </>
          ) : (
            <>
              <WifiOff size={14} />
              <span className="text-xs">Offline</span>
            </>
          )}
        </div>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        <button className="icon-btn" title="Teilen">
          <Share2 size={16} />
        </button>
        <button className="icon-btn" onClick={toggleTheme} title={`${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="icon-btn" title="Hilfe">
          <HelpCircle size={16} />
        </button>
        <button className="icon-btn" title="Einstellungen">
          <Settings size={16} />
        </button>
      </div>
    </div>
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
