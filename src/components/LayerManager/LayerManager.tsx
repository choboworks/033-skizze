import { useAppStore } from '@/store'
import {
  Eye,
  EyeOff,
  Trash2,
  Layers,
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
  GripVertical,
  PanelRightClose,
  Ruler,
  Type,
  Route,
} from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { CanvasObject, ShapeType } from '@/types'

function ObjectIcon({ type }: { type: ShapeType }) {
  switch (type) {
    case 'rect': return <Square size={16} />
    case 'rounded-rect': return <RectangleHorizontal size={16} />
    case 'ellipse': return <CircleIcon size={16} />
    case 'triangle': return <Triangle size={16} />
    case 'line': return <Minus size={16} />
    case 'arrow': return <ArrowUpRight size={16} />
    case 'polygon': return <Hexagon size={16} />
    case 'path': return <Spline size={16} />
    case 'star': return <Star size={16} />
    case 'freehand': return <Pencil size={16} />
    case 'text': return <Type size={16} />
    case 'dimension': return <Ruler size={16} />
    case 'smartroad': return <Route size={16} />
    default: return <Square size={16} />
  }
}

function objectDisplayName(obj: CanvasObject, index: number): string {
  if (obj.label) return obj.label
  const typeNames: Record<string, string> = {
    rect: 'Rechteck',
    'rounded-rect': 'Abgerundet',
    ellipse: 'Ellipse',
    triangle: 'Dreieck',
    line: 'Linie',
    arrow: 'Pfeil',
    polygon: 'Polygon',
    path: 'Pfad',
    star: 'Stern',
    freehand: 'Freihand',
    text: 'Text',
    image: 'Bild',
    dimension: 'Bemaßung',
    smartroad: 'Straße',
  }
  return `${typeNames[obj.type] || obj.type} ${index + 1}`
}

export function LayerManager() {
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
  const [collapsed, setCollapsed] = useState(true)
  const prevCount = useRef(objectOrder.length)

  // Auto-expand when a new object is added
  useEffect(() => {
    const unsub = useAppStore.subscribe((state) => {
      const count = state.objectOrder.length
      if (count > prevCount.current) {
        setCollapsed(false)
      } else if (count === 0 && prevCount.current > 0) {
        setCollapsed(true)
      }
      prevCount.current = count
    })
    return unsub
  }, [])

  // Drag state
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const finishRename = () => {
    if (editingId && editValue.trim()) {
      updateObject(editingId, { label: editValue.trim() })
    }
    setEditingId(null)
  }

  const displayOrder = [...objectOrder].reverse()
  const hasEntries = displayOrder.length > 0

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
      setDragId(null)
      setDropTargetId(null)
      setDropPosition(null)
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
    setDragId(null)
    setDropTargetId(null)
    setDropPosition(null)
  }, [dragId, dropTargetId, dropPosition, objectOrder, reorderObjects])

  const handleDragEnd = useCallback(() => {
    setDragId(null)
    setDropTargetId(null)
    setDropPosition(null)
  }, [])

  // ─── Single wrapper with animated width ───
  return (
    <div
      className="flex flex-col h-full shrink-0 overflow-hidden"
      style={{
        width: collapsed ? 48 : 180,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {collapsed ? (
        /* ─── Collapsed view ─── */
        <div className="flex flex-col items-center anim-fade-in">
          <button
            className="icon-btn mt-3"
            style={{ padding: 6 }}
            onClick={() => setCollapsed(false)}
            title={`Ebenen${hasEntries ? ` (${displayOrder.length})` : ''} einblenden`}
          >
            <Layers size={18} style={{ color: hasEntries ? 'var(--text-secondary)' : 'var(--text-muted)' }} />
          </button>
          {hasEntries && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-1"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {displayOrder.length}
            </div>
          )}
        </div>
      ) : (
        /* ─── Expanded view ─── */
        <div className="flex flex-col h-full min-w-45 anim-fade-in">

      {/* Toggle button — mirrors toolbar toggle */}
      <div className="flex shrink-0 mb-1" style={{ justifyContent: 'flex-start', paddingLeft: 6 }}>
        <button
          className="w-8 h-8 flex items-center justify-center rounded transition-colors mt-2"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => setCollapsed(true)}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          title="Ebenen einklappen"
        >
          <PanelRightClose size={16} />
        </button>
      </div>

      {/* Section label */}
      <div
        className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest shrink-0"
        style={{ color: 'var(--text-muted)' }}
      >
        Ebenen {hasEntries && <span style={{ color: 'var(--accent)' }}>({displayOrder.length})</span>}
      </div>

      {/* Object list */}
      <div className="flex-1 overflow-y-auto" ref={listRef}>
        {!hasEntries && (
          <div className="px-3 py-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Keine Objekte
          </div>
        )}
        {displayOrder.map((objId, idx) => {
          const obj = objects[objId]
          if (!obj) return null

          const isSelected = selection.includes(obj.id)
          const displayName = objectDisplayName(obj, displayOrder.length - 1 - idx)
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
              className="relative group cursor-pointer transition-colors"
              style={{
                background: isSelected ? 'var(--accent-muted)' : 'transparent',
                borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
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
              onMouseEnter={(e) => {
                if (!isSelected && !isDragging) e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSelected ? 'var(--accent-muted)' : 'transparent'
              }}
            >
              {/* Drop indicators */}
              {isDropTarget && dropPosition === 'above' && (
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'var(--accent)', zIndex: 10 }} />
              )}
              {isDropTarget && dropPosition === 'below' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--accent)', zIndex: 10 }} />
              )}

              {/* Main row */}
              <div className="flex items-center gap-2 px-2.5" style={{ height: 36 }}>
                <GripVertical
                  size={13}
                  className="shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text-muted)' }}
                />
                <span className="shrink-0" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                  <ObjectIcon type={obj.type} />
                </span>
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
                      style={{ padding: '2px 5px', fontSize: 13 }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      className="text-[13px] truncate block"
                      style={{
                        color: isSelected ? 'var(--text)' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 600 : 400,
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        setEditingId(obj.id)
                        setEditValue(displayName)
                      }}
                    >
                      {displayName}
                    </span>
                  )}
                </div>
                <span
                  className="shrink-0 w-2.5 h-2.5 rounded-sm"
                  style={{ background: obj.strokeColor, border: '1px solid var(--border)' }}
                />
              </div>

              {/* Hover actions */}
              <div className="flex items-center gap-0.5 px-1.5 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="icon-btn" style={{ padding: 4 }} onClick={(e) => {
                  e.stopPropagation()
                  if (obj.type === 'smartroad' && obj.subtype) {
                    useAppStore.getState().openRoadEditor(obj.id, obj.subtype)
                  } else {
                    openProperties(obj.id)
                  }
                }} title="Eigenschaften">
                  <Settings2 size={14} />
                </button>
                <button className="icon-btn" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }) }} title={obj.visible ? 'Ausblenden' : 'Einblenden'}>
                  {obj.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button className="icon-btn" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { locked: !obj.locked }) }} title={obj.locked ? 'Entsperren' : 'Sperren'}>
                  {obj.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                <button className="icon-btn" style={{ padding: 4, color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); removeObject(obj.id) }} title="Löschen">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}

      </div>
        </div>
      )}
    </div>
  )
}
