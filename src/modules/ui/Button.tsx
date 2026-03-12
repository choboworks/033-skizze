// src/modules/ui/Button.tsx
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'subtle' | 'destructive' | 'icon'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

/**
 * Zentrale Button-Komponente
 * - nutzt unsere CSS-Variablen aus index.css (Theme Tokens)
 * - Varianten: primary | ghost | subtle | destructive | icon
 * - Größen: sm | md | lg
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition ' +
      'focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ' +
      'disabled:opacity-50 disabled:pointer-events-none'

    const variants: Record<Variant, string> = {
      primary:
        'bg-[var(--primary)] text-[var(--primary-contrast)] ' +
        'hover:bg-[var(--primary-hover)] rounded-md shadow-sm',
      ghost:
        'bg-transparent text-[var(--text-muted)] ' +
        'hover:bg-[var(--panel-elev)] rounded-full',
      subtle:
        'bg-[var(--panel-elev)] text-[var(--text)] ' +
        'hover:bg-[var(--border)] rounded-md',
      destructive:
        'bg-[var(--danger)] text-white ' +
        'hover:bg-red-600 rounded-md shadow-sm',
      icon:
        'bg-transparent text-[var(--text-muted)] ' +
        'hover:bg-[var(--panel-elev)] rounded-full',
    }

    const sizes: Record<Size, string> = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-9 px-3 text-sm',
      lg: 'h-11 px-4 text-base',
    }

    return (
      <button
        ref={ref}
        className={[base, variants[variant], sizes[size], className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
