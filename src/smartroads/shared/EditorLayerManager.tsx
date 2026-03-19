import { useState, useCallback } from 'react'
import {
  Trash2, GripVertical, Settings2,
  Minus, ArrowUp, ArrowDown, Route, Pencil,
} from 'lucide-react'
import type { Strip, Marking } from '../types'
import { STRIP_LABELS, STRIP_COLORS } from '../constants'

// ============================================================
// EditorLayerManager – Ebenen-Manager inside the SmartRoad editor
// Mirrors the main app's LayerManager design.
// ============================================================

const MARKING_LABELS: Record<string, string> = {
  centerline: 'Leitlinie',
  laneboundary: 'Begrenzung',
  crosswalk: 'Zebrastreifen',
  stopline: 'Haltelinie',
  arrow: 'Richtungspfeil',
  'blocked-area': 'Sperrfläche',
}

// --- Icons ---
function StripIcon({ type }: { type: string }) {
  switch (type) {
    case 'lane': case 'bus': return <ArrowUp size={16} />
    case 'sidewalk': return <Route size={16} />
    default: return <Minus size={16} />
  }
}

function MarkingIcon({ type }: { type: string }) {
  switch (type) {
    case 'centerline': case 'laneboundary': return <Minus size={16} />
    case 'arrow': return <ArrowDown size={16} />
    default: return <Pencil size={16} />
  }
}

// Unified item type
interface LayerItem {
  id: string
  kind: 'strip' | 'marking'
  label: string
  icon: React.ReactNode
  color: string
}

interface Props {
  strips: Strip[]
  markings: Marking[]
  selectedStripId: string | null
  selectedMarkingId: string | null
  onSelectStrip: (id: string | null) => void
  onSelectMarking: (id: string | null) => void
  onDeleteStrip: (id: string) => void
  onDeleteMarking: (id: string) => void
  onOpenProperties: (kind: 'strip' | 'marking', id: string) => void
  onReorderStrips: (strips: Strip[]) => void
}

export function EditorLayerManager({
  strips, markings,
  selectedStripId, selectedMarkingId,
  onSelectStrip, onSelectMarking,
  onDeleteStrip, onDeleteMarking,
  onOpenProperties, onReorderStrips,
}: Props) {

  const items: LayerItem[] = [
    ...strips.map((s) => ({
      id: s.id,
      kind: 'strip' as const,
      label: `${STRIP_LABELS[s.type] || s.type}${s.direction ? (s.direction === 'up' ? ' ↑' : ' ↓') : ''}`,
      icon: <StripIcon type={s.type} />,
      color: STRIP_COLORS[s.type] || '#555',
    })),
    ...markings.map((m) => ({
      id: m.id,
      kind: 'marking' as const,
      label: MARKING_LABELS[m.type] || m.type,
      icon: <MarkingIcon type={m.type} />,
      color: '#ffffff',
    })),
  ]

  // --- Strip DnD z-order ---
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 22)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (id === dragId) return
    const rect = e.currentTarget.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    setDropTargetId(id)
    setDropPosition(e.clientY < midY ? 'above' : 'below')
  }, [dragId])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!dragId || !dropTargetId || dragId === dropTargetId) {
      setDragId(null); setDropTargetId(null); setDropPosition(null)
      return
    }
    const fromIdx = strips.findIndex(s => s.id === dragId)
    const toIdx = strips.findIndex(s => s.id === dropTargetId)
    if (fromIdx === -1 || toIdx === -1) {
      setDragId(null); setDropTargetId(null); setDropPosition(null)
      return
    }
    const newStrips = strips.filter(s => s.id !== dragId)
    const insertIdx = dropPosition === 'above' ? toIdx : toIdx + 1
    const adjustedIdx = insertIdx > fromIdx ? insertIdx - 1 : insertIdx
    newStrips.splice(adjustedIdx, 0, strips[fromIdx])
    onReorderStrips(newStrips)
    setDragId(null); setDropTargetId(null); setDropPosition(null)
  }, [dragId, dropTargetId, dropPosition, strips, onReorderStrips])

  const handleDragEnd = useCallback(() => {
    setDragId(null); setDropTargetId(null); setDropPosition(null)
  }, [])

  const selectedId = selectedStripId || selectedMarkingId

  return (
    <div className="flex flex-col pt-2">
      {/* Header — more top padding for visual separation */}
      <div
        className="px-4 pt-5 pb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-center"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', marginTop: 12 }}
      >
        Elemente {items.length > 0 && <span style={{ color: 'var(--accent)' }}>({items.length})</span>}
      </div>

      {items.length === 0 && (
        <div className="px-4 py-3 text-[13px] text-center" style={{ color: 'var(--text-muted)' }}>
          Keine Elemente
        </div>
      )}

      {/* Item list — each item is a distinct card-like row */}
      <div className="flex flex-col gap-2 px-2.5 pb-3">
        {items.map((item) => {
          const isSelected = item.id === selectedId
          const isDragging = dragId === item.id
          const isDropTarget = dropTargetId === item.id
          const isStrip = item.kind === 'strip'

          return (
            <div
              key={item.id}
              draggable={isStrip}
              onDragStart={isStrip ? (e) => handleDragStart(e, item.id) : undefined}
              onDragOver={isStrip ? (e) => handleDragOver(e, item.id) : undefined}
              onDrop={isStrip ? handleDrop : undefined}
              onDragEnd={isStrip ? handleDragEnd : undefined}
              className="relative group cursor-pointer transition-all rounded-lg"
              style={{
                background: isSelected ? 'var(--accent-muted)' : 'transparent',
                border: isSelected ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                opacity: isDragging ? 0.4 : 1,
              }}
              onClick={() => {
                if (isStrip) { onSelectStrip(item.id); onSelectMarking(null) }
                else { onSelectMarking(item.id); onSelectStrip(null) }
              }}
              onDoubleClick={() => onOpenProperties(item.kind, item.id)}
              onMouseEnter={(e) => {
                if (!isSelected && !isDragging) {
                  e.currentTarget.style.borderColor = 'var(--text-muted)'
                  e.currentTarget.style.background = 'var(--surface-hover)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isSelected ? 'var(--accent)' : 'var(--border)'
                e.currentTarget.style.background = isSelected ? 'var(--accent-muted)' : 'transparent'
              }}
            >
              {/* Drop indicators */}
              {isDropTarget && dropPosition === 'above' && (
                <div className="absolute -top-0.5 left-2 right-2 h-0.5 rounded-full" style={{ background: 'var(--accent)', zIndex: 10 }} />
              )}
              {isDropTarget && dropPosition === 'below' && (
                <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full" style={{ background: 'var(--accent)', zIndex: 10 }} />
              )}

              {/* Main row */}
              <div className="flex items-center gap-2.5 px-3" style={{ height: 46 }}>
                {isStrip ? (
                  <GripVertical
                    size={14}
                    className="shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                  />
                ) : (
                  <div className="w-3.5 shrink-0" />
                )}
                {/* Color dot */}
                <span
                  className="shrink-0 w-3.5 h-3.5 rounded-sm"
                  style={{ background: item.color, border: '1.5px solid rgba(255,255,255,0.2)' }}
                />
                <span className="shrink-0" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span
                  className="text-[12px] truncate flex-1"
                  style={{
                    color: isSelected ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>

                {/* Inline actions (always visible on hover) */}
                <div className="flex items-center gap-1 shrink-0">
                  <button className="icon-btn" style={{ padding: 5 }} onClick={(e) => {
                    e.stopPropagation()
                    onOpenProperties(item.kind, item.id)
                  }} title="Eigenschaften">
                    <Settings2 size={14} />
                  </button>
                  <button className="icon-btn" style={{ padding: 5, color: 'var(--danger, #e05050)' }} onClick={(e) => {
                    e.stopPropagation()
                    if (isStrip) onDeleteStrip(item.id)
                    else onDeleteMarking(item.id)
                  }} title="Entfernen">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
