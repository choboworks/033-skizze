import { useToast } from '@/hooks/useToast'

// --- Accent color per type ---
function accentColor(type: 'success' | 'info' | 'error'): string {
  switch (type) {
    case 'success': return 'var(--success)'
    case 'error': return 'var(--danger)'
    case 'info': return 'var(--accent)'
  }
}

// --- Render component ---
export function Toasts() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={t.exiting ? '' : 'anim-pop-in'}
          style={{
            height: 36,
            borderRadius: 'var(--radius-lg)',
            padding: '0 16px',
            background: 'var(--panel-bg-elevated)',
            border: '1px solid var(--panel-border)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            whiteSpace: 'nowrap',
            opacity: t.exiting ? 0 : 1,
            transition: 'opacity 180ms ease-out',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: 3,
              height: 16,
              borderRadius: 2,
              background: accentColor(t.type),
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: 'var(--text)',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {t.message}
          </span>
        </div>
      ))}
    </div>
  )
}
