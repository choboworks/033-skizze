import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
    /** Icon-only (quadratisch) */
    icon?: boolean
  }
>

/**
 * Einheitlicher Toolbar-Button:
 * - Höhe: 40px (h-10) für Icon & Text
 * - Active: Outline (Primary) + Ring, kein Vollflächen-Fill
 * - Integriert in .segmented Container
 * - Immer einzeilig (whitespace-nowrap)
 */
export default function ToolbarButton({
  active = false,
  icon = false,
  className = '',
  children,
  ...rest
}: Props) {
  const base = icon
    ? 'seg-btn h-10 w-10 inline-flex items-center justify-center select-none whitespace-nowrap leading-none shrink-0'
    : 'seg-btn h-10 inline-flex items-center gap-2 px-3 select-none text-sm whitespace-nowrap leading-none shrink-0'

  const idle =
    'bg-[var(--panel)] text-[var(--text)] border border-[var(--border)] hover:[background-color:color-mix(in_srgb,var(--panel)_92%,var(--text)_8%)]'

  const outlinedActive =
    'bg-[var(--panel)] text-[var(--text)] border border-[var(--primary)] ring-2 ring-[var(--primary)]/40 shadow-[var(--shadow-sm)]'

  return (
    <button
      {...rest}
      aria-pressed={active}
      className={[
        base,
        active ? outlinedActive : idle,
        'transition-colors-quick',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/45',
        className,
      ].join(' ')}
    >
      {/* Inhalt bleibt garantiert in einer Zeile */}
      <span className="inline-flex items-center gap-2 whitespace-nowrap leading-none">
        {children}
      </span>
    </button>
  )
}
