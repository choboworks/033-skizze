import { useState, useRef, useCallback, useEffect } from 'react'
import { X, GripHorizontal } from 'lucide-react'
import type { Strip, Marking } from '../types'
import { STRIP_LABELS } from '../constants'
import { StripProperties } from './properties/StripProperties'
import { MarkingProperties } from './properties/MarkingProperties'

// ============================================================
// FloatingEditorProperties – Draggable properties modal
// Same pattern as main app's FloatingProperties.
// ============================================================

const MARKING_TYPE_LABELS: Record<string, string> = {
  centerline: 'Leitlinie',
  laneboundary: 'Begrenzung',
  crosswalk: 'Zebrastreifen',
  stopline: 'Haltelinie',
  arrow: 'Richtungspfeil',
  'blocked-area': 'Sperrfläche',
}

interface Props {
  strip: Strip | null
  marking: Marking | null
  onUpdateStrip?: (changes: Partial<Strip>) => void
  onUpdateMarking?: (changes: Partial<Marking>) => void
  onClose: () => void
}

export function FloatingEditorProperties({ strip, marking, onUpdateStrip, onUpdateMarking, onClose }: Props) {
  const PANEL_W = 340

  const [pos, setPos] = useState(() => ({
    x: Math.max(40, window.innerWidth / 2 - PANEL_W / 2),
    y: 120,
  }))
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Re-center when a new element is opened
  const prevId = useRef(strip?.id || marking?.id)
  const currentId = strip?.id || marking?.id
  if (currentId !== prevId.current) {
    prevId.current = currentId
  }

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!strip && !marking) return null

  const title = strip
    ? (STRIP_LABELS[strip.type] || 'Streifen')
    : (marking ? MARKING_TYPE_LABELS[marking.type] || 'Markierung' : '')

  return (
    <div
      className="fixed z-10002 rounded-2xl select-none overflow-hidden anim-pop-in"
      style={{
        left: pos.x,
        top: pos.y,
        width: PANEL_W,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
      }}
    >
      {/* Title bar — draggable */}
      <div
        className="flex items-center gap-3 px-7 py-5 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid var(--border)' }}
        onMouseDown={onDragStart}
      >
        <GripHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
        <span className="flex-1 text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
          {title}
        </span>
        <button
          className="icon-btn"
          style={{ padding: 6 }}
          onClick={onClose}
          title="Schließen"
        >
          <X size={16} />
        </button>
      </div>

      {/* Properties content — generous padding */}
      <div className="px-7 py-6" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {strip && onUpdateStrip && (
          <StripProperties strip={strip} onUpdate={onUpdateStrip} />
        )}
        {marking && onUpdateMarking && (
          <MarkingProperties marking={marking} onUpdate={onUpdateMarking} />
        )}
      </div>
    </div>
  )
}
