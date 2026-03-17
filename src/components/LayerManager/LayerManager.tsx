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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { CanvasObject, ShapeType } from '@/types'

function ObjectIcon({ type }: { type: ShapeType }) {
  switch (type) {
    case 'rect': return <Square size={18} />
    case 'rounded-rect': return <RectangleHorizontal size={18} />
    case 'ellipse': return <CircleIcon size={18} />
    case 'triangle': return <Triangle size={18} />
    case 'line': return <Minus size={18} />
    case 'arrow': return <ArrowUpRight size={18} />
    case 'polygon': return <Hexagon size={18} />
    case 'path': return <Spline size={18} />
    case 'star': return <Star size={18} />
    case 'freehand': return <Pencil size={18} />
    default: return <Square size={18} />
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

  // Auto-expand when a new object is added (via store subscribe, not effect)
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
  const hasObjects = displayOrder.length > 0

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

  // ─── Collapsed view (same width as toolbar) ───
  if (collapsed) {
    return (
      <div
        className="flex flex-col items-center shrink-0 h-full"
        style={{
          width: 'var(--toolbar-width)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
        }}
      >
        {/* Icon + expand */}
        <button
          className="icon-btn mt-3"
          style={{ padding: 6 }}
          onClick={() => setCollapsed(false)}
          title="Ebenen einblenden"
        >
          <Layers size={18} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Vertical label */}
        <div
          className="flex items-center justify-center flex-1 cursor-pointer"
          style={{ writingMode: 'vertical-rl', color: 'var(--text-muted)' }}
          onClick={() => setCollapsed(false)}
        >
          <span className="text-xs font-semibold uppercase tracking-widest">
            Ebenen{hasObjects ? ` (${displayOrder.length})` : ''}
          </span>
        </div>

        {hasObjects && (
          <button
            className="icon-btn mb-3"
            style={{ padding: 6 }}
            onClick={() => setCollapsed(false)}
            title="Ebenen einblenden"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>
    )
  }

  // ─── Expanded view ───
  return (
    <div
      className="flex flex-col shrink-0 h-full"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Layers size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="panel-header-title">Ebenen</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ({displayOrder.length})
          </span>
        </div>
        <button
          className="icon-btn"
          style={{ padding: 4 }}
          onClick={() => setCollapsed(true)}
          title="Ebenen einklappen"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Object list */}
      <div className="flex-1 overflow-y-auto" ref={listRef}>
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
              className="flex items-center gap-2 px-1 pr-2 group cursor-pointer transition-colors relative"
              style={{
                height: 56,
                background: isSelected ? 'var(--accent-muted)' : 'transparent',
                borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                borderBottom: '1px solid var(--border-subtle)',
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

              {/* Drag handle */}
              <div className="p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity shrink-0">
                <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              {/* Thumbnail */}
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <span style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                  <ObjectIcon type={obj.type} />
                </span>
              </div>

              {/* Name + meta */}
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
                    style={{ padding: '3px 6px', fontSize: 'var(--font-size-sm)' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div
                      className="text-sm truncate leading-snug"
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
                    </div>
                    <div className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      <span>{obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-sm"
                        style={{ background: obj.strokeColor, border: '1px solid var(--border)' }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="icon-btn" style={{ padding: 5 }} onClick={(e) => { e.stopPropagation(); openProperties(obj.id) }} title="Eigenschaften">
                  <Settings2 size={15} />
                </button>
                <button className="icon-btn" style={{ padding: 5 }} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }) }} title={obj.visible ? 'Ausblenden' : 'Einblenden'}>
                  {obj.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button className="icon-btn" style={{ padding: 5 }} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { locked: !obj.locked }) }} title={obj.locked ? 'Entsperren' : 'Sperren'}>
                  {obj.locked ? <Lock size={15} /> : <Unlock size={15} />}
                </button>
                <button className="icon-btn" style={{ padding: 5, color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); removeObject(obj.id) }} title="Löschen">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
