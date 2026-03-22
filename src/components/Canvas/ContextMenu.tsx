import { useEffect, useRef } from 'react'
import {
  Copy,
  Trash2,
  ArrowUpToLine,
  ArrowDownToLine,
  Settings2,
  BoxSelect,
  Maximize2,
  ClipboardPaste,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  hasSelection: boolean
  selectionCount: number
  onDuplicate: () => void
  onDelete: () => void
  onBringToFront: () => void
  onSendToBack: () => void
  onProperties: () => void
  onSelectAll: () => void
  onFitView: () => void
}

interface MenuItem {
  label: string
  icon: LucideIcon
  action: () => void
  disabled?: boolean
}

function MenuSeparator() {
  return (
    <div
      style={{
        height: 1,
        background: 'var(--panel-section-border)',
        margin: '4px 8px',
      }}
    />
  )
}

function MenuItemRow({ label, icon: Icon, action, disabled, onClose }: MenuItem & { onClose: () => void }) {
  return (
    <button
      onClick={() => {
        if (disabled) return
        action()
        onClose()
      }}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 12px',
        borderRadius: 10,
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        width: '100%',
        textAlign: 'left',
        opacity: disabled ? 0.4 : 1,
        transition: `background var(--duration-hover) var(--ease-out-fast)`,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      <Icon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 400 }}>{label}</span>
    </button>
  )
}

export function ContextMenu({
  x,
  y,
  onClose,
  hasSelection,
  // selectionCount available via props if needed
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onProperties,
  onSelectAll,
  onFitView,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Clamp to viewport
  const menuWidth = 200
  const estimatedHeight = hasSelection ? 232 : 140
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8)
  const clampedY = Math.min(y, window.innerHeight - estimatedHeight - 8)

  // Close on click outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Use a timeout to avoid the same right-click event closing the menu
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handle)
    }, 0)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousedown', handle)
    }
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="anim-scale-in"
      style={{
        position: 'fixed',
        top: clampedY,
        left: clampedX,
        width: menuWidth,
        background: 'var(--panel-bg-elevated)',
        border: '1px solid var(--panel-border)',
        boxShadow: 'var(--panel-shadow)',
        borderRadius: 'var(--radius-md)',
        padding: 4,
        zIndex: 9998,
      }}
    >
      {hasSelection ? (
        <>
          <MenuItemRow label="Duplizieren" icon={Copy} action={onDuplicate} onClose={onClose} />
          <MenuItemRow label="Löschen" icon={Trash2} action={onDelete} onClose={onClose} />
          <MenuSeparator />
          <MenuItemRow label="In den Vordergrund" icon={ArrowUpToLine} action={onBringToFront} onClose={onClose} />
          <MenuItemRow label="In den Hintergrund" icon={ArrowDownToLine} action={onSendToBack} onClose={onClose} />
          <MenuSeparator />
          <MenuItemRow label="Eigenschaften" icon={Settings2} action={onProperties} onClose={onClose} />
        </>
      ) : (
        <>
          <MenuItemRow label="Alles auswählen" icon={BoxSelect} action={onSelectAll} onClose={onClose} />
          <MenuItemRow label="Ansicht einpassen" icon={Maximize2} action={onFitView} onClose={onClose} />
          <MenuSeparator />
          <MenuItemRow label="Einfügen" icon={ClipboardPaste} action={() => {}} disabled onClose={onClose} />
        </>
      )}
    </div>
  )
}
