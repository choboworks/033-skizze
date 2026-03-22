import { useAppStore } from '@/store'
import { useUndoRedo } from '@/hooks/useUndoRedo'
import {
  Settings,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Save,
  Download,
  FolderOpen,
} from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'

export function TopBar() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const { undo, redo } = useUndoRedo()

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
            von Alex Pohlmeier
          </div>
        </div>
      </div>

      {/* Right: Actions — grouped with separators */}
      <div className="flex items-center" style={{ gap: 6 }}>
        {/* Undo / Redo */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <Tooltip content="Rückgängig" shortcut="Strg+Z">
            <button className="surface-btn flex items-center justify-center" style={{ height: 32, minWidth: 32, borderRadius: 10, padding: 0 }} onClick={undo}>
              <Undo2 size={15} />
            </button>
          </Tooltip>
          <Tooltip content="Wiederholen" shortcut="Strg+Shift+Z">
            <button className="surface-btn flex items-center justify-center" style={{ height: 32, minWidth: 32, borderRadius: 10, padding: 0 }} onClick={redo}>
              <Redo2 size={15} />
            </button>
          </Tooltip>
        </div>

        <div className="divider-v" />

        {/* Save + Export */}
        <div className="flex items-center" style={{ gap: 6 }}>
          <Tooltip content="Projekt laden" shortcut="Strg+O">
            <button
              className="surface-btn flex items-center justify-center"
              style={{ height: 32, padding: '0 12px', borderRadius: 12, gap: 6, color: 'var(--text)', fontSize: 12, fontWeight: 600 }}
            >
              <FolderOpen size={14} />
              <span>Laden</span>
            </button>
          </Tooltip>
          <Tooltip content="Projekt speichern" shortcut="Strg+S">
            <button
              className="surface-btn flex items-center justify-center"
              style={{ height: 32, padding: '0 12px', borderRadius: 12, gap: 6, color: 'var(--text)', fontSize: 12, fontWeight: 600 }}
            >
              <Save size={14} />
              <span>Speichern</span>
            </button>
          </Tooltip>
          <Tooltip content="Als PDF exportieren" shortcut="Strg+E">
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
              <span>Exportieren</span>
            </button>
          </Tooltip>
        </div>

        <div className="divider-v" />

        {/* Settings + Theme */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <Tooltip content="Einstellungen">
            <button className="surface-btn flex items-center justify-center" style={{ height: 32, minWidth: 32, borderRadius: 10, padding: 0 }}>
              <Settings size={15} />
            </button>
          </Tooltip>
          <Tooltip content="Design wechseln">
            <button className="surface-btn flex items-center justify-center" style={{ height: 32, minWidth: 32, borderRadius: 10, padding: 0 }} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
