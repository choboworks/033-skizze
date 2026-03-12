// src/modules/ui/SidebarButton.tsx
type Props = {
  label: string
  iconSrc?: string
  active?: boolean
  onClick?: () => void
  className?: string
  title?: string
  'aria-pressed'?: boolean
}

function SidebarButton({
  label,
  iconSrc,
  active,
  onClick,
  className,
  title,
  ...aria
}: Props) {
  const base =
    'w-full min-h-[64px] flex items-center gap-4 px-4 py-3 rounded-2xl border text-base transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/45'
  const idle =
    'border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--panel-elev)]'
  const act =
    'border-[var(--primary)] ring-1 ring-[var(--ring)]/40 bg-[var(--panel)] shadow-sm'

  return (
    <button
      type="button"
      title={title ?? label}
      onClick={onClick}
      className={[base, active ? act : idle, className].filter(Boolean).join(' ')}
      aria-pressed={aria['aria-pressed'] ?? active ?? false}
    >
      {/* Feste Icon-Box → echtes Zentrieren */}
      {iconSrc ? (
        <span className="flex-none grid place-items-center h-6 w-6">
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            className="block h-5 w-5 object-contain select-none"
            draggable={false}
          />
        </span>
      ) : null}

      {/* Label mit definierter Zeilenhöhe → optisch mittig */}
      <span className="truncate leading-[1.2] text-[var(--text)]">{label}</span>
    </button>
  )
}

export default SidebarButton
export { SidebarButton }
