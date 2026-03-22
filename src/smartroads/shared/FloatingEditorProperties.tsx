import { useState, useRef, useCallback, useEffect } from 'react'
import { GripHorizontal } from 'lucide-react'
import type { Strip, Marking } from '../types'
import { STRIP_LABELS } from '../constants'
import { StripProperties } from './properties/StripProperties'
import { MarkingProperties } from './properties/MarkingProperties'
import { PanelHeader } from '@/components/ui/PanelPrimitives'
import { MARKING_TYPE_LABELS } from '@/constants/shared'

// ============================================================
// FloatingEditorProperties – Draggable properties modal
// Same pattern as main app's FloatingProperties.
// ============================================================

interface Props {
  strip: Strip | null
  marking: Marking | null
  onUpdateStrip?: (changes: Partial<Strip>) => void
  onUpdateMarking?: (changes: Partial<Marking>) => void
  onClose: () => void
}

export function FloatingEditorProperties({ strip, marking, onUpdateStrip, onUpdateMarking, onClose }: Props) {
  const PANEL_W = 320

  const [pos, setPos] = useState(() => ({
    x: Math.max(40, window.innerWidth / 2 - PANEL_W / 2),
    y: 120,
  }))
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

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
      className="fixed z-10002 select-none overflow-hidden anim-pop-in"
      style={{
        left: pos.x,
        top: pos.y,
        width: PANEL_W,
        borderRadius: 20,
        background: 'linear-gradient(180deg, rgba(24,28,38,0.96), rgba(18,22,30,0.94))',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <PanelHeader
        icon={<GripHorizontal size={16} style={{ color: 'var(--text-muted)' }} />}
        title={title}
        subtitle="Eigenschaften"
        onClose={onClose}
        onMouseDown={onDragStart}
        className="active:cursor-grabbing"
      />

      {/* Properties content */}
      <div className="panel-section" style={{ maxHeight: '60vh', overflowY: 'auto', borderBottom: 'none' }}>
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
