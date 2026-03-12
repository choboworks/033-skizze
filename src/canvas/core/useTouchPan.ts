import { useEffect, type RefObject } from 'react'

interface UseTouchPanOptions {
  stageRef: RefObject<HTMLDivElement | null>  // 🔥 null erlauben
  panRef: RefObject<{ x: number; y: number }>
  updateStageScale: () => void
  enabled?: boolean
}

export function useTouchPan({
  stageRef,
  panRef,
  updateStageScale,
  enabled = true,
}: UseTouchPanOptions) {
  useEffect(() => {
    if (!enabled) return
    if (!('ontouchstart' in window)) return // Nur auf Touch-Geräten

    const stage = stageRef.current
    if (!stage) return

    let startPan = { x: 0, y: 0 }
    let touchStart = { x: 0, y: 0 }
    let isPanning = false

const handleTouchStart = (e: TouchEvent) => {
  // Nur Ein-Finger-Pan (Zwei-Finger für Pinch-Zoom reserviert)
  if (e.touches.length !== 1) return

  const touch = e.touches[0]
  touchStart = { x: touch.clientX, y: touch.clientY }
  startPan = { ...panRef.current }
  isPanning = true
}
    const handleTouchMove = (e: TouchEvent) => {
      if (!isPanning || e.touches.length !== 1) return

      // Prevent default nur wenn wir tatsächlich pannen
      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y

      // Mindestbewegung von 5px bevor wir preventDefault aufrufen
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        e.preventDefault()
        
        panRef.current = {
          x: startPan.x + deltaX,
          y: startPan.y + deltaY,
        }
        updateStageScale()
      }
    }

    const handleTouchEnd = () => {
      isPanning = false
    }

    stage.addEventListener('touchstart', handleTouchStart, { passive: true })
    stage.addEventListener('touchmove', handleTouchMove, { passive: false })
    stage.addEventListener('touchend', handleTouchEnd, { passive: true })
    stage.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      stage.removeEventListener('touchstart', handleTouchStart)
      stage.removeEventListener('touchmove', handleTouchMove)
      stage.removeEventListener('touchend', handleTouchEnd)
      stage.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [stageRef, panRef, updateStageScale, enabled])
}