// src/canvas/core/useWheelZoom.ts
import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import { useAppStore } from '../../store/appStore'

type Params = {
  scrollRef: MutableRefObject<HTMLDivElement | null>
  spaceHandActiveRef: MutableRefObject<boolean>
}

/**
 * Mouse-Wheel-Zoom auf die Canvas (ohne Ctrl/Meta).
 * Nur im Select-Tool oder bei aktiver Space-Hand.
 */
export function useWheelZoom({
  scrollRef,
  spaceHandActiveRef,
}: Params): void {
  useEffect(() => {
    const sc = scrollRef.current
    if (!sc) return

    const onWheel = (e: WheelEvent) => {
      // Browser-/Trackpad-Zoom ignorieren
      if (e.ctrlKey || e.metaKey) return

      // Nur im Select-Tool oder während Space-Hand
      const hand = spaceHandActiveRef.current === true
      if (useAppStore.getState().ui.tool !== 'select' && !hand) return

      e.preventDefault()

      const oldRel = useAppStore.getState().view.zoom
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
      const next = Math.min(8, Math.max(0.1, oldRel * factor))

      ;(useAppStore.getState() as unknown as { setZoomAbs: (z: number) => void }).setZoomAbs(next)
    }

    sc.addEventListener('wheel', onWheel, { passive: false })
    return () => sc.removeEventListener('wheel', onWheel)
  }, [scrollRef, spaceHandActiveRef])
}
