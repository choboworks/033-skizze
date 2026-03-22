import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  shortcut?: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, shortcut, children, side = 'bottom', delay = 500 }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      const el = triggerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const tooltipHeight = 28
      const tooltipGap = 6

      let top = 0
      let left = 0

      switch (side) {
        case 'top':
          top = rect.top - tooltipHeight - tooltipGap
          left = rect.left + rect.width / 2
          break
        case 'bottom':
          top = rect.bottom + tooltipGap
          left = rect.left + rect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.left - tooltipGap
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2
          left = rect.right + tooltipGap
          break
      }

      setPosition({ top, left })
      setVisible(true)
    }, delay)
  }, [delay, side])

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setVisible(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const isHorizontal = side === 'left' || side === 'right'
  const transform = isHorizontal ? 'translateY(0)' : 'translateX(-50%)'

  return (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ display: 'inline-flex' }}
    >
      {children}
      {visible && createPortal(
        <div
          className="anim-fade-in"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            transform,
            height: 28,
            padding: '0 10px',
            borderRadius: 8,
            background: 'var(--bg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            border: '1px solid var(--border)',
            opacity: 0.95,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: 'var(--text)', fontSize: 11, fontWeight: 500 }}>
            {content}
          </span>
          {shortcut && (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>&middot;</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}>
                {shortcut}
              </span>
            </>
          )}
        </div>,
        document.body
      )}
    </span>
  )
}
