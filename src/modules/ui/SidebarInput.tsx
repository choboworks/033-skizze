type Props = {
  label: string
  iconSrc?: string           // PNG aus /public/assets
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  disabled?: boolean
  className?: string
  name?: string
}

/**
 * Großes Eingabefeld, passend zu SidebarButton (64px, 24px Icon).
 * Tokens für Border/BG/Text/Focus-Ring.
 */
export default function SidebarInput({
  label,
  iconSrc,
  placeholder,
  value,
  onChange,
  disabled,
  className,
  name,
}: Props) {
  return (
    <div className={className}>
      <div className="mb-1 text-[11px] leading-none text-[var(--text-muted)]">{label}</div>

      <div
        className={[
          'flex items-center gap-4 rounded-2xl border px-4 py-3 min-h-[64px]',
          'border-[var(--border)] bg-[var(--panel)]',
          disabled
            ? 'opacity-60'
            : 'focus-within:ring-2 focus-within:ring-[var(--ring)]',
        ].join(' ')}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            className="h-6 w-6 object-contain select-none"
            draggable={false}
          />
        ) : null}

        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-base"
          style={{ color: 'var(--text)' }}
        />
      </div>
    </div>
  )
}
