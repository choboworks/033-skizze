type Props = {
  children: React.ReactNode
  className?: string
}

/**
 * Dezente Hinweis-Card für leere Zustände / Infos in beiden Sidebars.
 * Nutzt Theme-Tokens (Light/Dark).
 */
function SidebarHint({ children, className }: Props) {
  return (
    <div
      className={[
        'text-xs',
        'rounded-md',
        'px-3 py-2',
        'border bg-[var(--panel-elev)]',
        'text-[var(--text-muted)] border-[var(--border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export default SidebarHint
export { SidebarHint }
