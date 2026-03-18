import { useCallback, useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import * as Tooltip from '@radix-ui/react-tooltip'
import type { Strip, StripType, StripVariant } from '../types'
import {
  STRIP_COLORS,
  STRIP_LABELS,
  STRIP_MIN_WIDTHS,
  FIXED_WIDTH_STRIPS,
  VARIANT_LABELS,
  totalWidth,
  createStrip,
} from '../constants'

// ============================================================
// StripEditor – Constrained cross-section editor (React/CSS)
//
// Horizontal flexbox of strips. Always flush, no gaps.
// - Reorder via dnd-kit sortable
// - Resize via pointer events on edges
// - Add via [+ Links] / [+ Rechts] buttons
// ============================================================

interface StripEditorProps {
  strips: Strip[]
  onUpdate: (strips: Strip[]) => void
  addStripType?: StripType        // which type to add when clicking +
  addStripVariant?: StripVariant  // which variant
}

// --- Sortable Strip Item ---
function SortableStrip({
  strip,
  isLast,
  onResizeStart,
  onRemove,
}: {
  strip: Strip
  isLast: boolean
  onResizeStart: (stripId: string, side: 'right', startX: number) => void
  onRemove: (stripId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: strip.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    flex: `${strip.width} 0 0`,
    minWidth: 0,
    height: '100%',
    background: STRIP_COLORS[strip.type] || '#666',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    cursor: 'grab',
    userSelect: 'none' as const,
  }

  const isFixed = FIXED_WIDTH_STRIPS.includes(strip.type)
  const label = STRIP_LABELS[strip.type] || strip.type
  const variantLabel = VARIANT_LABELS[strip.variant] || ''

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group"
          >
            {/* Strip label (visible when wide enough) */}
            {strip.width > 1 && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{ fontSize: 10, color: '#fff', opacity: 0.7, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
              >
                {label}
              </div>
            )}

            {/* Remove button */}
            <button
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 9, lineHeight: 1 }}
              onClick={(e) => { e.stopPropagation(); onRemove(strip.id) }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Entfernen"
            >
              ×
            </button>

            {/* Right edge resize handle */}
            {!isLast && !isFixed && (
              <div
                className="absolute top-0 right-0 w-1 h-full"
                style={{ cursor: 'col-resize', zIndex: 10 }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onResizeStart(strip.id, 'right', e.clientX)
                }}
              />
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-md px-3 py-1.5 text-xs"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            sideOffset={5}
          >
            {label}{variantLabel ? ` – ${variantLabel}` : ''} · {strip.width.toFixed(2)}m
            <Tooltip.Arrow style={{ fill: 'var(--surface)' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

// --- Main Component ---
export function StripEditor({ strips, onUpdate, addStripType = 'lane', addStripVariant = 'standard' }: StripEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [resizing, setResizing] = useState<{
    stripId: string
    startX: number
    startWidth: number
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // --- Drag & Drop reorder ---
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = strips.findIndex((s) => s.id === active.id)
    const newIndex = strips.findIndex((s) => s.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onUpdate(arrayMove(strips, oldIndex, newIndex))
    }
  }, [strips, onUpdate])

  // --- Edge resize ---
  const handleResizeStart = useCallback((stripId: string, _side: 'right', startX: number) => {
    const strip = strips.find((s) => s.id === stripId)
    if (!strip) return
    setResizing({ stripId, startX, startWidth: strip.width })

    const containerWidth = containerRef.current?.clientWidth || 500
    const tw = totalWidth(strips)
    const metersPerPixel = tw / containerWidth

    const onMove = (e: PointerEvent) => {
      const delta = e.clientX - startX
      const deltaMeters = delta * metersPerPixel
      const minW = STRIP_MIN_WIDTHS[strip.type] || 0.10
      const newWidth = Math.max(minW, strip.width + deltaMeters)

      onUpdate(strips.map((s) =>
        s.id === stripId ? { ...s, width: Math.round(newWidth * 100) / 100 } : s
      ))
    }

    const onUp = () => {
      setResizing(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [strips, onUpdate])

  // --- Add / Remove ---
  const handleAddLeft = () => {
    onUpdate([createStrip(addStripType, addStripVariant), ...strips])
  }

  const handleAddRight = () => {
    onUpdate([...strips, createStrip(addStripType, addStripVariant)])
  }

  const handleRemove = useCallback((id: string) => {
    onUpdate(strips.filter((s) => s.id !== id))
  }, [strips, onUpdate])

  const tw = totalWidth(strips)

  return (
    <div className="flex flex-col gap-2">
      {/* Width info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Gesamtbreite: {tw.toFixed(2)}m
        </span>
      </div>

      {/* Strip bar */}
      <div className="flex items-stretch gap-0" style={{ height: 80 }}>
        {/* [+ Links] */}
        <button
          className="shrink-0 flex items-center justify-center rounded-l-md transition-colors"
          style={{ width: 28, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 16 }}
          onClick={handleAddLeft}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          title="Streifen links hinzufügen"
        >
          +
        </button>

        {/* Strips */}
        <div
          ref={containerRef}
          className="flex-1 flex items-stretch overflow-hidden rounded-none"
          style={{
            border: '1px solid var(--border)',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: resizing ? 'col-resize' : undefined,
          }}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={strips.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
              {strips.map((strip, i) => (
                <SortableStrip
                  key={strip.id}
                  strip={strip}
                  isLast={i === strips.length - 1}
                  onResizeStart={handleResizeStart}
                  onRemove={handleRemove}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* [+ Rechts] */}
        <button
          className="shrink-0 flex items-center justify-center rounded-r-md transition-colors"
          style={{ width: 28, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 16 }}
          onClick={handleAddRight}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          title="Streifen rechts hinzufügen"
        >
          +
        </button>
      </div>
    </div>
  )
}
