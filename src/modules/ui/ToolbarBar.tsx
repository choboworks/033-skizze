// src/modules/toolbar/ToolbarBar.tsx
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  className?: string
  'aria-label'?: string
}>

/**
 * Matte Dock (ohne Glas/Blur): solide Panel-Farbe, Hairline-Border, zarte Shadow.
 * Als segmentierter Container – jetzt strikt einzeilig (kein Wrap).
 */
export default function ToolbarBar({ className, children, ...aria }: Props) {
  return (
    <div className="w-full flex justify-center pointer-events-none">
      <div
        {...aria}
        role="toolbar"
        className={[
          'pointer-events-auto inline-flex items-center',
          'flex-nowrap whitespace-nowrap',     // ⬅️ NIE umbrechen
          'max-w-full overflow-x-auto',        // ⬅️ falls zu schmal, horizontal scrollen statt umbrechen
          'segmented',                          // visueller Stil der Gruppe
          'transition-colors-quick',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
