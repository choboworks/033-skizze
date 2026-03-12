import { useEffect, useRef } from 'react'

type SwipeDirection = 'left' | 'right'

interface UseSwipeToCloseOptions {
  onSwipe: () => void
  direction: SwipeDirection
  threshold?: number
  enabled?: boolean
}

export function useSwipeToClose({
  onSwipe,
  direction,
  threshold = 100,
  enabled = true,
}: UseSwipeToCloseOptions) {
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      
      startX.current = touch.clientX
      startY.current = touch.clientY
      isDragging.current = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      
      const touch = e.touches[0]
      if (!touch) return

      const deltaX = touch.clientX - startX.current
      const deltaY = touch.clientY - startY.current

      // Nur horizontal swipen (nicht vertikal scrollen)
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }

      // Swipe nach links (für rechten Drawer)
      if (direction === 'right' && deltaX < -threshold) {
        isDragging.current = false
        onSwipe()
      }

      // Swipe nach rechts (für linken Drawer)
      if (direction === 'left' && deltaX > threshold) {
        isDragging.current = false
        onSwipe()
      }
    }

    const handleTouchEnd = () => {
      isDragging.current = false
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipe, direction, threshold, enabled])
}