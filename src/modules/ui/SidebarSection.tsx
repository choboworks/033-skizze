type Props = {
  title: string
  iconSrc?: string // PNG aus /public/assets, z.B. "/assets/roads.png"
  children: React.ReactNode
  className?: string
}

/**
 * Konsistenter Abschnitts-Wrapper für linke/rechte Sidebar.
 * Typo & Farben über Tokens.
 */
function SidebarSection({ title, iconSrc, children, className }: Props) {
  return (
    <section className={['px-3 pt-3 pb-3', className].filter(Boolean).join(' ')}>
      <header className="mb-2 flex items-center gap-2">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            className="h-5 w-5 object-contain select-none"
            draggable={false}
          />
        ) : null}
        <h2 className="text-base font-semibold tracking-wide text-[var(--text)]">
          {title}
        </h2>
      </header>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

export default SidebarSection
export { SidebarSection }
