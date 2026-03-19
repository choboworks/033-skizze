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
          {/* Header — title centered over left sidebar width */}
          <div
            className="flex items-center shrink-0 relative"
            style={{ height: 56, borderBottom: '1px solid var(--border)' }}
          >
            {/* Title aligned to left sidebar center */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 280 }}
            >
              <Dialog.Title className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                SmartRoad: {title}
              </Dialog.Title>
            </div>

            {/* Close button at far right */}
            <div className="flex-1" />
            <div className="px-4">
              <Dialog.Close asChild>
                <button className="icon-btn" style={{ padding: 8 }} title="Schließen">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Body: 3 columns */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Element Palette + Presets */}
            <div
              className="shrink-0 flex flex-col"
              style={{
                width: 280,
                borderRight: '1px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
              {sidebar}
            </div>

            {/* Center: Editor */}
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              {editor}
            </div>

            {/* Right: Quick Settings */}
            {quickSettings && (
              <div
                className="shrink-0 overflow-y-auto"
                style={{
                  width: 260,
                  borderLeft: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              >
                {quickSettings}
              </div>
            )}
          </div>

          {/* Footer — buttons centered under the editor (between sidebars) */}
          <div
            className="flex shrink-0"
            style={{ height: 72, borderTop: '1px solid var(--border)' }}
          >
            {/* Left spacer matching sidebar */}
            <div className="shrink-0" style={{ width: 280, borderRight: '1px solid var(--border)' }} />

            {/* Center: buttons */}
            <div className="flex-1 flex items-center justify-center gap-4">
              <button
                className="rounded-xl text-[14px] font-medium transition-all"
                style={{
                  width: 140,
                  height: 44,
                  color: 'var(--text-secondary)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                }}
                onClick={onCancel}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--text-muted)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                Abbrechen
              </button>
              <button
                className="rounded-xl text-[14px] font-semibold transition-all"
                style={{
                  width: 140,
                  height: 44,
                  color: '#fff',
                  background: 'var(--accent)',
                  boxShadow: '0 2px 8px rgba(74,158,255,0.3)',
                }}
                onClick={onFinish}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,158,255,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(74,158,255,0.3)'; e.currentTarget.style.transform = 'none' }}
              >
                Fertig
              </button>
            </div>

            {/* Right spacer matching quick settings */}
            <div className="shrink-0" style={{ width: 260, borderLeft: '1px solid var(--border)' }} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
