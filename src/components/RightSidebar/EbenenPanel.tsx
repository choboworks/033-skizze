import { useAppStore } from '@/store'
import {
  Eye,
  EyeOff,
  Square,
  RectangleHorizontal,
  CircleIcon,
  Triangle,
  Minus,
  ArrowUpRight,
  Hexagon,
  Spline,
  Star,
  Pencil,
  Lock,
  Unlock,
  Settings2,
  Ruler,
  Type,
  Route,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import type { CanvasObject, ShapeType } from '@/types'

function ObjectIcon({ type }: { type: ShapeType }) {
  switch (type) {
    case 'rect': return <Square size={15} />
    case 'rounded-rect': return <RectangleHorizontal size={15} />
    case 'ellipse': return <CircleIcon size={15} />
    case 'triangle': return <Triangle size={15} />
    case 'line': return <Minus size={15} />
    case 'arrow': return <ArrowUpRight size={15} />
    case 'polygon': return <Hexagon size={15} />
    case 'path': return <Spline size={15} />
    case 'star': return <Star size={15} />
    case 'freehand': return <Pencil size={15} />
    case 'text': return <Type size={15} />
    case 'dimension': return <Ruler size={15} />
    case 'smartroad': return <Route size={15} />
    default: return <Square size={15} />
  }
}

function objectDisplayName(obj: CanvasObject, index: number): string {
  if (obj.label) return obj.label
  const typeNames: Record<string, string> = {
    rect: 'Rechteck', 'rounded-rect': 'Abgerundet', ellipse: 'Ellipse',
    triangle: 'Dreieck', line: 'Linie', arrow: 'Pfeil', polygon: 'Polygon',
    path: 'Pfad', star: 'Stern', freehand: 'Freihand', text: 'Text',
    image: 'Bild', dimension: 'Bemaßung', smartroad: 'Straße',
  }
  return `${typeNames[obj.type] || obj.type} ${index + 1}`
}

function objectTypeName(obj: CanvasObject): string {
  const types: Record<string, string> = {
    rect: 'Form', 'rounded-rect': 'Form', ellipse: 'Form',
    triangle: 'Form', line: 'Form', arrow: 'Form', polygon: 'Form',
    path: 'Pfad', star: 'Form', freehand: 'Zeichnung', text: 'Text',
    image: 'Bild', dimension: 'Maß', smartroad: 'SmartRoad',
  }
  return types[obj.type] || obj.type
}

export function EbenenPanel() {
  const objects = useAppStore((s) => s.objects)
  const objectOrder = useAppStore((s) => s.objectOrder)
  const selection = useAppStore((s) => s.selection)
  const select = useAppStore((s) => s.select)
  const updateObject = useAppStore((s) => s.updateObject)
  const removeObject = useAppStore((s) => s.removeObject)
  const openProperties = useAppStore((s) => s.openProperties)
  const reorderObjects = useAppStore((s) => s.reorderObjects)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const [dragId, setDragId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null)

  const finishRename = () => {
    if (editingId && editValue.trim()) {
      updateObject(editingId, { label: editValue.trim() })
    }
    setEditingId(null)
  }

  const displayOrder = [...objectOrder].reverse()

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 28)
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
    const newOrder = objectOrder.filter((id) => id !== dragId)
    const targetIdx = newOrder.indexOf(dropTargetId)
    if (dropPosition === 'above') {
      newOrder.splice(targetIdx + 1, 0, dragId)
    } else {
      newOrder.splice(targetIdx, 0, dragId)
    }
    reorderObjects(newOrder)
    setDragId(null); setDropTargetId(null); setDropPosition(null)
  }, [dragId, dropTargetId, dropPosition, objectOrder, reorderObjects])

  const handleDragEnd = useCallback(() => {
    setDragId(null); setDropTargetId(null); setDropPosition(null)
  }, [])

  return (
    <div
      className="glass flex flex-col shrink-0"
      style={{ borderRadius: 24, maxHeight: 360 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center px-4 pt-4 pb-4 shrink-0 gap-2">
        <span className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text)' }}>
          Ebenen-Manager
        </span>
        <span className="badge badge-accent" style={{ fontSize: 10, padding: '3px 8px' }}>
          {displayOrder.length}
        </span>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {displayOrder.length === 0 && (
          <div className="py-4 text-[12px] text-center" style={{ color: 'var(--text-muted)' }}>
            Keine Objekte
          </div>
        )}
        <div className="flex flex-col gap-2">
          {displayOrder.map((objId, idx) => {
            const obj = objects[objId]
            if (!obj) return null

            const isSelected = selection.includes(obj.id)
            const displayName = objectDisplayName(obj, displayOrder.length - 1 - displayOrder.indexOf(objId))
            const isDragging = dragId === obj.id
            const isDropTarget = dropTargetId === obj.id

            return (
              <div
                key={obj.id}
                draggable
                onDragStart={(e) => handleDragStart(e, obj.id)}
                onDragOver={(e) => handleDragOver(e, obj.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                data-selected={isSelected}
                className="layer-card relative group cursor-pointer transition-all flex items-center p-3"
                style={{
                  minHeight: 68,
                  gap: 10,
                  borderRadius: 20,
                  opacity: isDragging ? 0.4 : 1,
                }}
                onClick={(e) => {
                  if (e.shiftKey) {
                    const newSel = selection.includes(obj.id)
                      ? selection.filter((s) => s !== obj.id)
                      : [...selection, obj.id]
                    select(newSel)
                  } else {
                    select([obj.id])
                  }
                }}
              >
                {/* Drop indicators */}
                {isDropTarget && dropPosition === 'above' && (
                  <div className="absolute -top-1 left-3 right-3 h-0.5 rounded-full" style={{ background: 'var(--accent)', zIndex: 10 }} />
                )}
                {isDropTarget && dropPosition === 'below' && (
                  <div className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full" style={{ background: 'var(--accent)', zIndex: 10 }} />
                )}

                {/* Color dot */}
                <div
                  className="rounded-full shrink-0"
                  style={{ width: 10, height: 10, background: isSelected ? 'var(--accent)' : 'var(--text-muted)', opacity: isSelected ? 1 : 0.4 }}
                />

                {/* Name + Type */}
                <div className="flex-1 min-w-0">
                  {editingId === obj.id ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={finishRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') finishRename()
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="field-input w-full"
                      style={{ padding: '2px 6px', fontSize: 12 }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <div
                        className="text-[13px] font-medium truncate"
                        style={{ color: 'var(--text)' }}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setEditingId(obj.id)
                          setEditValue(displayName)
                        }}
                      >
                        {displayName}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {objectTypeName(obj)}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    className="icon-btn"
                    style={{ padding: 4, width: 28, height: 28, borderRadius: 'var(--radius-sm)' }}
                    onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }) }}
                    title={obj.visible ? 'Ausblenden' : 'Einblenden'}
                  >
                    {obj.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    className="icon-btn"
                    style={{ padding: 4, width: 28, height: 28, borderRadius: 'var(--radius-sm)' }}
                    onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { locked: !obj.locked }) }}
                    title={obj.locked ? 'Entsperren' : 'Sperren'}
                  >
                    {obj.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                  <button
                    className="icon-btn"
                    style={{ padding: 4, width: 28, height: 28, borderRadius: 'var(--radius-sm)' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (obj.type === 'smartroad' && obj.subtype) {
                        useAppStore.getState().openRoadEditor(obj.id, obj.subtype)
                      } else {
                        openProperties(obj.id)
                      }
                    }}
                    title="Eigenschaften"
                  >
                    <Settings2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
