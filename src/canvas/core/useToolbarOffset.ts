//src/canvas/core/useToolbarOffset.ts
import { useEffect, useState } from 'react'

/**
 * Ermittelt den vertikalen Abstand der Toolbar-Unterkante vom Viewport-Boden,
 * damit Overlays (Pen/Text/Fill/Objects) immer direkt darüber platziert werden können.
 */
export function useToolbarOffset(): number {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = document.querySelector('[data-app-toolbar]') as HTMLElement | null
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      // Abstand vom unteren Viewport-Rand bis zur OBERKANTE der Toolbar:
      const distanceFromBottomToTop = Math.max(0, window.innerHeight - rect.top)
      setOffset(distanceFromBottomToTop)
    }

    compute()

    const ro = new ResizeObserver(compute)
    ro.observe(el)

    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
      window.removeEventListener('scroll', compute as EventListener)
    }
  }, [])

  return offset
}
