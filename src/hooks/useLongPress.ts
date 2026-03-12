import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  onLongPress: () => void
  onDoubleClick?: () => void
  delay?: number
}

/**
 * Hook für Long-Press (Touch) und Double-Click (Mouse) Support
 * 
 * @param options - Callbacks und Delay
 * @returns Event-Handler für onMouseDown, onTouchStart, etc.
 */
export function useLongPress({
  onLongPress,
  onDoubleClick,
  delay = 500,
}: UseLongPressOptions) {
  const timeoutRef = useRef<number | null>(null)
  const lastTapRef = useRef<number>(0)

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clear()
    timeoutRef.current = window.setTimeout(() => {
      onLongPress()
      timeoutRef.current = null
    }, delay)
  }, [onLongPress, delay, clear])

  const cancel = useCallback(() => {
    clear()
  }, [clear])

  const handleDoubleClick = useCallback(() => {
    if (onDoubleClick) {
      onDoubleClick()
    } else {
      onLongPress()
    }
  }, [onDoubleClick, onLongPress])

  // Touch: Double-Tap Detection
  const handleTouchStart = useCallback(() => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < 300) {
      // Double-Tap erkannt
      clear()
      if (onDoubleClick) {
        onDoubleClick()
      } else {
        onLongPress()
      }
      lastTapRef.current = 0
    } else {
      // Single-Tap → Start Long-Press Timer
      lastTapRef.current = now
      start()
    }
  }, [start, clear, onLongPress, onDoubleClick])

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: handleTouchStart,
    onTouchEnd: cancel,
    onTouchCancel: cancel,
    onDoubleClick: handleDoubleClick,
  }
}