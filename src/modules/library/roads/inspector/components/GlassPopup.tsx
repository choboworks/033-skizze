// src/modules/library/roads/inspector/components/GlassPopup.tsx
import { useRef, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
  onClose: () => void
  position?: 'top' | 'bottom'
}

export function GlassPopup({ children, onClose, position = 'top' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  // Click outside handler is managed by parent (IconToolbar)
  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={ref}
      className={`
        absolute z-50
        ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
        left-1/2 -translate-x-1/2
        transition-all duration-200 ease-out
        ${mounted 
          ? 'opacity-100 translate-y-0' 
          : position === 'top' 
            ? 'opacity-0 translate-y-2' 
            : 'opacity-0 -translate-y-2'
        }
      `}
      style={{
        background: 'var(--panel)',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 40px -5px rgba(0, 0, 0, 0.15)',
        minWidth: '140px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Subtle Arrow/Notch */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45
          ${position === 'top' ? '-bottom-1.5' : '-top-1.5'}
        `}
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderTop: position === 'top' ? 'none' : undefined,
          borderLeft: position === 'top' ? 'none' : undefined,
          borderBottom: position === 'bottom' ? 'none' : undefined,
          borderRight: position === 'bottom' ? 'none' : undefined,
        }}
      />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

// Standalone Version for use in InteractiveRoadPreview
export function StandaloneGlassPopup({ 
  children, 
  x, 
  y, 
  onClose 
}: { 
  children: React.ReactNode
  x: number
  y: number
  onClose: () => void 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })
  const [mounted, setMounted] = useState(false)

  // Animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  // Adjust position if popup would go off-screen
  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const padding = 8
    
    let newX = x
    let newY = y
    
    // Check right edge
    if (rect.right > window.innerWidth - padding) {
      newX = x - (rect.right - window.innerWidth + padding)
    }
    // Check left edge
    if (rect.left < padding) {
      newX = x + (padding - rect.left)
    }
    // Check bottom edge
    if (rect.bottom > window.innerHeight - padding) {
      newY = y - rect.height - 20 // Show above click point
    }
    // Check top edge
    if (rect.top < padding) {
      newY = padding
    }
    
    if (newX !== x || newY !== y) {
      setPosition({ x: newX, y: newY })
    }
  }, [x, y])

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={ref}
      className={`
        absolute z-50
        transition-all duration-200 ease-out
        ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
      style={{
        left: position.x,
        top: position.y,
        background: 'var(--panel)',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 40px -5px rgba(0, 0, 0, 0.15)',
        transformOrigin: 'top left',
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}
