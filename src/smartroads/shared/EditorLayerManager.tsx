import { useState, useCallback } from 'react'
import {
  Trash2, GripVertical, Settings2,
  Minus, ArrowUp, ArrowDown, Route, Pencil,
} from 'lucide-react'
import type { Strip, Marking } from '../types'
import { DEFAULT_MARKING_COLOR, getStripDisplayLabel, getStripSwatchColor, normalizeLayerOrder } from '../constants'
import { MARKING_TYPE_LABELS } from '@/constants/shared'

// ============================================================
// EditorLayerManager - Ebenen-Manager inside the SmartRoad editor
// Mirrors the main app's LayerManager design.
// ============================================================

function StripIcon({ type }: { type: string }) {
  switch (type) {
    case 'lane':
    case 'bus':
      return <ArrowUp size={16} />
    case 'sidewalk':
      return <Route size={16} />
    default:
      return <Minus size={16} />
  }
}

function MarkingIcon({ type }: { type: string }) {
  switch (type) {
    case 'centerline':
    case 'laneboundary':
      return <Minus size={16} />
    case 'arrow':
      return <ArrowDown size={16} />
    default:
      return <Pencil size={16} />
  }
}

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
  layerOrder: string[]
  selectedStripId: string | null
  selectedMarkingId: string | null
  onSelectStrip: (id: string | null) => void
  onSelectMarking: (id: string | null) => void
  onDeleteStrip: (id: string) => void
  onDeleteMarking: (id: string) => void
  onOpenProperties: (kind: 'strip' | 'marking', id: string) => void
  onReorderLayers: (layerOrder: string[]) => void
}

export function EditorLayerManager({
  strips,
  markings,
  layerOrder,
  selectedStripId,
  selectedMarkingId,
  onSelectStrip,
  onSelectMarking,
  onDeleteStrip,
  onDeleteMarking,
  onOpenProperties,
  onReorderLayers,
}: Props) {
  const items: LayerItem[] = [
    ...strips.map((strip) => ({
      id: strip.id,
      kind: 'strip' as const,
      label: getStripDisplayLabel(strip),
      icon: <StripIcon type={strip.type} />,
      color: getStripSwatchColor(strip),
    })),
    ...markings.map((marking) => ({
      id: marking.id,
      kind: 'marking' as const,
      label: MARKING_TYPE_LABELS[marking.type] || marking.type,
      icon: <MarkingIcon type={marking.type} />,
      color: marking.color || DEFAULT_MARKING_COLOR,
    })),
  ]

  const normalizedOrder = normalizeLayerOrder(layerOrder, strips, markings)
  const displayOrder = [...normalizedOrder].reverse()
  const itemMap = new Map(items.map((item) => [item.id, item]))

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!dragId || !dropTargetId || dragId === dropTargetId) {
      setDragId(null)
      setDropTargetId(null)
      setDropPosition(null)
      return
    }

    const nextOrder = normalizedOrder.filter((id) => id !== dragId)
    const targetIdx = nextOrder.indexOf(dropTargetId)
    if (targetIdx === -1) {
      setDragId(null)
      setDropTargetId(null)
      setDropPosition(null)
      return
    }

    // displayOrder is normalizedOrder.reverse(), so "above" in the UI
    // means higher z-order = later in normalizedOrder = splice after target.
    // "below" in the UI = lower z-order = splice before target.
    if (dropPosition === 'above') {
      nextOrder.splice(targetIdx + 1, 0, dragId)
    } else {
      nextOrder.splice(targetIdx, 0, dragId)
    }

    onReorderLayers(nextOrder)
    setDragId(null)
    setDropTargetId(null)
    setDropPosition(null)
  }

  const handleDragEnd = useCallback(() => {
    setDragId(null)
    setDropTargetId(null)
    setDropPosition(null)
  }, [])

  const selectedId = selectedStripId || selectedMarkingId

  return (
    <div className="flex flex-col">
      <div
        className="pb-3 text-[11px] font-semibold flex items-center justify-between"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span>Elemente</span>
        {items.length > 0 && <span style={{ color: 'var(--accent)', fontSize: 10 }}>{items.length}</span>}
      </div>

      {items.length === 0 && (
        <div className="px-4 py-3 text-[13px] text-center" style={{ color: 'var(--text-muted)' }}>
          Keine Elemente
        </div>
      )}

      <div className="flex flex-col" style={{ gap: 8 }}>
        {displayOrder.map((itemId) => {
          const item = itemMap.get(itemId)
          if (!item) return null

          const isSelected = item.id === selectedId
          const isDragging = dragId === item.id
          const isDropTarget = dropTargetId === item.id

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              className="relative group cursor-pointer"
              style={{
                minHeight: 64,
                padding: 12,
                borderRadius: 18,
                background: isSelected ? 'var(--accent-muted)' : 'var(--surface)',
                border: isSelected ? '1px solid var(--panel-control-active-border)' : '1px solid var(--panel-control-border)',
                transition: 'background var(--duration-hover) var(--ease-out-fast), border-color var(--duration-hover) var(--ease-out-fast), transform var(--duration-hover) var(--ease-out-fast), box-shadow var(--duration-hover) var(--ease-out-fast)',
                ...(isDragging ? { transform: 'scale(1.02)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', opacity: 0.4 } : {}),
              }}
              onClick={() => {
                if (item.kind === 'strip') {
                  onSelectStrip(item.id)
                  onSelectMarking(null)
                } else {
                  onSelectMarking(item.id)
                  onSelectStrip(null)
                }
              }}
              onDoubleClick={() => onOpenProperties(item.kind, item.id)}
              onMouseEnter={(e) => {
                if (!isSelected && !isDragging) e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              {isDropTarget && dropPosition === 'above' && (
                <div className="absolute -top-0.5 left-2 right-2 h-0.5 rounded-full" style={{ background: 'var(--accent)', zIndex: 10 }} />
              )}
              {isDropTarget && dropPosition === 'below' && (
                <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full" style={{ background: 'var(--accent)', zIndex: 10 }} />
              )}

              <div className="flex items-center" style={{ gap: 10 }}>
                <GripVertical
                  size={14}
                  className="shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                />

                <span
                  className="shrink-0 w-3.5 h-3.5 rounded-sm"
                  style={{ background: item.color, border: '1.5px solid var(--border)' }}
                />
                <span className="shrink-0" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span
                  className="text-[13px] truncate flex-1"
                  style={{
                    color: isSelected ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>

                <div className="flex items-center shrink-0" style={{ gap: 4 }}>
                  <button
                    className="icon-btn"
                    style={{ width: 28, height: 28, borderRadius: 10, padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenProperties(item.kind, item.id)
                    }}
                    title="Eigenschaften"
                  >
                    <Settings2 size={14} />
                  </button>
                  <button
                    className="icon-btn"
                    style={{ width: 28, height: 28, borderRadius: 10, padding: 0, color: 'var(--danger, #e05050)' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (item.kind === 'strip') onDeleteStrip(item.id)
                      else onDeleteMarking(item.id)
                    }}
                    title="Entfernen"
                  >
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
