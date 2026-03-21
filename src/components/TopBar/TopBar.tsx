import { useAppStore } from '@/store'
import {
  Settings,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Save,
  Download,
} from 'lucide-react'

export function TopBar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)


  // Shared button style for icon + secondary buttons
  const btnBase: React.CSSProperties = {
    height: 32,
    minWidth: 32,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background var(--duration-hover) var(--ease-out-fast), border-color var(--duration-hover) var(--ease-out-fast), color var(--duration-hover) var(--ease-out-fast), transform var(--duration-press) var(--ease-out-fast)',
  }

  const btnHover = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement
    t.style.background = 'rgba(255,255,255,0.08)'
    t.style.borderColor = 'rgba(255,255,255,0.10)'
    t.style.color = 'var(--text)'
  }
  const btnLeave = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement
    t.style.background = 'rgba(255,255,255,0.04)'
    t.style.borderColor = 'rgba(255,255,255,0.06)'
    t.style.color = 'var(--text-muted)'
  }

  return (
    <header
      className="glass flex items-center justify-between select-none shrink-0"
      style={{
        height: 'var(--topbar-height)',
        padding: '0 20px',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      {/* Left: Project Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/logo_ohne.png"
          alt="033-Skizze"
          className="h-8 w-8 rounded-lg shrink-0 object-contain"
        />
        <div className="min-w-0" style={{ lineHeight: 1.2 }}>
          <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
            033-Skizze
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            by Alex Pohlmeier
          </div>
        </div>
      </div>

      {/* Right: Actions — grouped with separators */}
      <div className="flex items-center" style={{ gap: 6 }}>
        {/* Undo / Redo */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <button style={{ ...btnBase, padding: 0 }} title="Rückgängig" onMouseEnter={btnHover} onMouseLeave={btnLeave}>
            <Undo2 size={15} />
          </button>
          <button style={{ ...btnBase, padding: 0 }} title="Wiederholen" onMouseEnter={btnHover} onMouseLeave={btnLeave}>
            <Redo2 size={15} />
          </button>
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />

        {/* Save + Export */}
        <div className="flex items-center" style={{ gap: 6 }}>
          <button
            style={{ ...btnBase, padding: '0 12px', borderRadius: 12, gap: 6, color: 'var(--text)', fontSize: 12, fontWeight: 600 }}
            title="Speichern"
            onMouseEnter={btnHover}
            onMouseLeave={(e) => { btnLeave(e); (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
          >
            <Save size={14} />
            <span>Save</span>
          </button>
          <button
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(56,189,248,0.9), rgba(14,165,233,0.9))',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
              transition: 'transform var(--duration-press) var(--ease-out-fast), filter var(--duration-hover) var(--ease-out-fast), box-shadow var(--duration-hover) var(--ease-out-fast)',
            }}
            title="Exportieren"
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLElement
              t.style.filter = 'brightness(1.05)'
              t.style.boxShadow = '0 6px 18px rgba(14,165,233,0.35)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement
              t.style.filter = 'none'
              t.style.boxShadow = '0 4px 14px rgba(14,165,233,0.3)'
            }}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />

        {/* Settings + Theme */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <button style={{ ...btnBase, padding: 0 }} title="Einstellungen" onMouseEnter={btnHover} onMouseLeave={btnLeave}>
            <Settings size={15} />
          </button>
          <button style={{ ...btnBase, padding: 0 }} onClick={toggleTheme} title={`${theme === 'dark' ? 'Light' : 'Dark'} Mode`} onMouseEnter={btnHover} onMouseLeave={btnLeave}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  )
}
