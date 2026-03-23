import * as Dialog from '@radix-ui/react-dialog'
import { X, Route } from 'lucide-react'

// ============================================================
// EditorShell – Overlay layout for all SmartRoad editors.
// Three-column layout: Palette | Editor | Quick Settings
// ============================================================

interface EditorShellProps {
  open: boolean
  title: string
  onFinish: () => void
  onCancel: () => void
  onReset?: () => void
  sidebar: React.ReactNode
  editor: React.ReactNode
  quickSettings?: React.ReactNode
}

export function EditorShell({
  open,
  title,
  onFinish,
  onCancel,
  onReset,
  sidebar,
  editor,
  quickSettings,
}: EditorShellProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-10000 anim-fade-in"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Content
          className="fixed z-10001 flex flex-col anim-scale-in"
          style={{
            top: 20, left: 20, right: 20, bottom: 20,
            background: 'var(--panel-bg-elevated)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--panel-border)',
            boxShadow: 'var(--panel-shadow)',
            outline: 'none',
          }}
        >
          {/* Header */}
          <div
            className="panel-popover-header shrink-0"
            style={{ height: 56, padding: '0 16px 0 0' }}
          >
            {/* Title aligned to left sidebar */}
            <div
              className="flex items-center justify-center gap-3 shrink-0"
              style={{ width: 280, padding: '0 20px' }}
            >
              <Route size={18} style={{ color: 'var(--accent)' }} />
              <Dialog.Title className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                SmartRoad: {title}
              </Dialog.Title>
            </div>

            <div className="flex-1" />

            {/* Close button */}
            <Dialog.Close asChild>
              <button className="panel-header-btn" title="Schließen">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body: 3 columns */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Element Palette */}
            <div
              className="shrink-0 flex flex-col"
              style={{
                width: 280,
                borderRight: '1px solid var(--panel-section-border)',
                padding: 12,
              }}
            >
              <div
                className="flex-1 min-h-0 overflow-y-auto flex flex-col editor-panel-card"
                style={{
                  borderRadius: 20,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
                }}
              >
                {sidebar}
              </div>
            </div>

            {/* Center: Editor — Hero Stage */}
            <div
              className="flex-1 flex flex-col overflow-hidden"
              style={{
                padding: 'var(--space-lg)',
                background: 'var(--editor-bg)',
              }}
            >
              {editor}
            </div>

            {/* Right: Quick Settings + Layer Manager */}
            {quickSettings && (
              <div
                className="shrink-0 overflow-y-auto flex flex-col"
                style={{
                  width: 300,
                  borderLeft: '1px solid var(--panel-section-border)',
                  padding: 12,
                  gap: 12,
                }}
              >
                {quickSettings}
              </div>
            )}
          </div>

          {/* Footer — buttons centered under the editor */}
          <div
            className="flex shrink-0"
            style={{ minHeight: 64, borderTop: '1px solid var(--panel-section-border)' }}
          >
            {/* Left spacer */}
            <div className="shrink-0" style={{ width: 280, borderRight: '1px solid var(--panel-section-border)' }} />

            {/* Center: buttons */}
            <div className="flex-1 flex items-center justify-center" style={{ gap: 12 }}>
              {onReset && (
                <button
                  className="surface-btn text-[12px] font-semibold"
                  style={{ height: 36, padding: '0 14px', borderRadius: 14 }}
                  onClick={onReset}
                >
                  Reset
                </button>
              )}
              <button
                className="surface-btn text-[12px] font-semibold"
                style={{ height: 36, padding: '0 14px', borderRadius: 14 }}
                onClick={onCancel}
              >
                Abbrechen
              </button>
              <button
                className="primary-btn text-[12px] font-semibold"
                style={{ height: 36, padding: '0 14px', borderRadius: 14 }}
                onClick={onFinish}
              >
                Fertig
              </button>
            </div>

            {/* Right spacer */}
            <div className="shrink-0" style={{ width: 300, borderLeft: '1px solid var(--panel-section-border)' }} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
