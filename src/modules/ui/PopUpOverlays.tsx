// src/modules/ui/PopUpOverlays.tsx
import type { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react'
import Button from './Button'

/* ---------- zentrale Theme-Variablen ---------- */
export type OverlayVars = {
  radius?: string
  shadow?: string
  border?: string
  bg?: string
  gap?: string
  padding?: string
}

/**
 * Default-Werte greifen auf globale CSS-Tokens zurück.
 * Du kannst sie per <OverlayTheme vars={{ ... }}/> pro Overlay überschreiben.
 */
const DEFAULT_VARS: Required<OverlayVars> = {
  radius: 'var(--radius-lg)',                 // z. B. 12px
  shadow: 'var(--shadow-lg)',                 // z. B. weiche, große Shadow
  border: '1px solid var(--border)',          // Theme-Border
  bg: 'var(--panel)',                         // Panel-Hintergrund (Light/Dark)
  gap: '8px',
  padding: '10px',
}

/* ---------- CSS-Variablen an den DOM binden ---------- */
type OverlayCSSVars = CSSProperties & {
  '--ov-radius'?: string
  '--ov-shadow'?: string
  '--ov-border'?: string
  '--ov-bg'?: string
  '--ov-gap'?: string
  '--ov-padding'?: string
}

/* ---------- Optionaler Theme-Provider ---------- */
export const OverlayTheme: FC<PropsWithChildren<{ vars?: OverlayVars }>> = ({ vars, children }) => {
  const v = { ...DEFAULT_VARS, ...(vars ?? {}) }
  const style: OverlayCSSVars = {
    '--ov-radius': v.radius,
    '--ov-shadow': v.shadow,
    '--ov-border': v.border,
    '--ov-bg': v.bg,
    '--ov-gap': v.gap,
    '--ov-padding': v.padding,
  }
  return <div style={style}>{children}</div>
}

/* ---------- Bausteine für Overlays ---------- */

/**
 * OverlayCard – Container für kleine Popups (z. B. Kontexte, Pickers).
 * Zieht komplett aus Tokens (Light/Dark-fähig). Kein Tailwind-Hardcode.
 */
export const OverlayCard: FC<{
  className?: string
  style?: CSSProperties
  children: ReactNode
}> = ({ className = '', style, children }) => {
  return (
    <div
      className={['rounded-2xl', 'backdrop-blur-[2px]', className].filter(Boolean).join(' ')}
      style={{
        ...style,
        borderRadius: 'var(--ov-radius, var(--radius-lg))',
        boxShadow: 'var(--ov-shadow, var(--shadow-lg))',
        border: 'var(--ov-border, 1px solid var(--border))',
        background: 'var(--ov-bg, var(--panel))',
        rowGap: 'var(--ov-gap, 8px)',
        padding: 'var(--ov-padding, 10px)',
        // Grundlayout:
        display: 'flex',
        alignItems: 'center',
        columnGap: 'var(--ov-gap, 8px)',
      }}
      data-overlay-card
    >
      {children}
    </div>
  )
}

/**
 * IconButton – Icon-only Button im Overlay (kompakt, 32x32),
 * konsistent mit dem globalen Button-Design (Tokens, Focus-Ring).
 */
export const IconButton: FC<{
  label: string
  onClick?: () => void
  className?: string
  children: ReactNode
  active?: boolean
}> = ({ label, onClick, className = '', children, active = false }) => {
  return (
    <Button
      type="button"
      variant="subtle"
      size="sm"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={[
        'w-8 h-8 flex items-center justify-center rounded-md transition',
        active
          ? 'border border-[var(--primary)] bg-[var(--panel)] shadow-sm'
          : 'border border-[var(--border)] bg-[var(--panel)] hover:shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </Button>
  )
}

/**
 * OverlayDivider – dezente Trennlinie zwischen Overlay-Controls.
 */
export const OverlayDivider: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={['w-px h-8 bg-[var(--border)] mx-2', className].filter(Boolean).join(' ')} aria-hidden />
)

export default OverlayCard
