import { useEffect, useRef } from 'react'
import { Copy, Trash2, ChevronUp, ChevronDown, Settings2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EditorContextMenuProps {
  x: number
  y: number
  onClose: () => void
  targetKind: 'strip' | 'marking'
  onDelete: () => void
  onProperties: () => void
  onDuplicate?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
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

function MenuItemRow({
  label,
  icon: Icon,
  action,
  disabled,
  onClose,
}: {
  label: string
  icon: LucideIcon
  action: () => void
  disabled?: boolean
  onClose: () => void
}) {
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

export function EditorContextMenu({
  x,
  y,
  onClose,
  targetKind,
  onDelete,
  onProperties,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: EditorContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const menuWidth = 200
  const estimatedHeight = targetKind === 'strip' ? 220 : 100
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8)
  const clampedY = Math.min(y, window.innerHeight - estimatedHeight - 8)

  // Close on click outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
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
        zIndex: 10003,
      }}
    >
      <MenuItemRow label="Eigenschaften" icon={Settings2} action={onProperties} onClose={onClose} />
      {targetKind === 'strip' && onDuplicate && (
        <MenuItemRow label="Duplizieren" icon={Copy} action={onDuplicate} onClose={onClose} />
      )}
      {targetKind === 'strip' && (onMoveUp || onMoveDown) && (
        <>
          <MenuSeparator />
          {onMoveUp && <MenuItemRow label="Nach oben" icon={ChevronUp} action={onMoveUp} onClose={onClose} />}
          {onMoveDown && <MenuItemRow label="Nach unten" icon={ChevronDown} action={onMoveDown} onClose={onClose} />}
        </>
      )}
      <MenuSeparator />
      <MenuItemRow label="Löschen" icon={Trash2} action={onDelete} onClose={onClose} />
    </div>
  )
}
