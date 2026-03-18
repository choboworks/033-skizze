import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

// ============================================================
// EditorShell – Overlay layout for all SmartRoad editors.
// Three-column layout: Palette | Editor | Quick Settings
// ============================================================

interface EditorShellProps {
  open: boolean
  title: string
  onFinish: () => void
  onCancel: () => void
  sidebar: React.ReactNode
  editor: React.ReactNode
  quickSettings?: React.ReactNode
}

export function EditorShell({
  open,
  title,
  onFinish,
  onCancel,
  sidebar,
  editor,
  quickSettings,
}: EditorShellProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-10000"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        />
        <Dialog.Content
          className="fixed z-10001 flex flex-col"
          style={{
            top: 20, left: 20, right: 20, bottom: 20,
            background: 'var(--surface)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            outline: 'none',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 shrink-0"
            style={{ height: 50, borderBottom: '1px solid var(--border)' }}
          >
            <Dialog.Title className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
              SmartRoad: {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="icon-btn" style={{ padding: 6 }} title="Schließen">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body: 3 columns */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Element Palette + Presets — flex column, presets pinned at bottom */}
            <div
              className="shrink-0 flex flex-col"
              style={{
                width: 220,
                borderRight: '1px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
              {sidebar}
            </div>

            {/* Center: Editor (StripEditor compact top + RoadTopView fills rest) */}
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              {editor}
            </div>

            {/* Right: Quick Settings */}
            {quickSettings && (
              <div
                className="shrink-0 overflow-y-auto"
                style={{
                  width: 200,
                  borderLeft: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              >
                {quickSettings}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 shrink-0"
            style={{ height: 60, borderTop: '1px solid var(--border)' }}
          >
            <button
              className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg)', border: '1px solid var(--border)' }}
              onClick={onCancel}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--text-muted)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              Abbrechen
            </button>
            <button
              className="px-8 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{ color: '#fff', background: 'var(--accent)', boxShadow: '0 2px 8px rgba(74,158,255,0.3)' }}
              onClick={onFinish}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,158,255,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(74,158,255,0.3)'; e.currentTarget.style.transform = 'none' }}
            >
              Fertig
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
