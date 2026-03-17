import { useAppStore } from '@/store'
import { X, GripHorizontal } from 'lucide-react'
import { ColorPicker } from './ColorPicker'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { CanvasObject, ShapeType } from '@/types'
import {
  PanelSection,
  PanelSlider,
  PanelSpacer,
  PanelSliderEnd,
  PanelSegmented,
  PanelColorLabel,
} from '@/components/ui/PanelPrimitives'

const TYPE_NAMES: Record<string, string> = {
  rect: 'Rechteck',
  ellipse: 'Ellipse',
  line: 'Linie',
  arrow: 'Pfeil',
  freehand: 'Freihand',
  text: 'Text',
  image: 'Bild',
}

const LINE_STYLES = [
  { id: 'solid' as const, label: 'Linie' },
  { id: 'dashed' as const, label: 'Striche' },
  { id: 'dotted' as const, label: 'Punkte' },
]

function typeLabel(type: ShapeType): string {
  return TYPE_NAMES[type] || type
}

function getLineStyleFromDash(dash?: number[]): 'solid' | 'dashed' | 'dotted' {
  if (!dash || dash.length === 0) return 'solid'
  if (dash[0] < 1) return 'dotted'
  return 'dashed'
}

function lineStyleToDash(style: string, strokeWidth: number): number[] | undefined {
  switch (style) {
    case 'dashed': return [strokeWidth * 5, strokeWidth * 4]
    case 'dotted': return [0.1, strokeWidth * 3]
    default: return undefined
  }
}

export function FloatingProperties() {
  const propertiesPanelId = useAppStore((s) => s.propertiesPanelId)
  const objects = useAppStore((s) => s.objects)
  const updateObject = useAppStore((s) => s.updateObject)
  const closeProperties = useAppStore((s) => s.closeProperties)

  const [pos, setPos] = useState(() => ({
    x: Math.max(60, (window.innerWidth - 360) / 2),
    y: Math.max(80, (window.innerHeight - 520) / 2),
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
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!propertiesPanelId) return null
  const obj = objects[propertiesPanelId]
  if (!obj) return null

  const update = (changes: Record<string, unknown>) => updateObject(obj.id, changes)
  const displayName = obj.label || `${typeLabel(obj.type)} ${Object.keys(objects).indexOf(obj.id) + 1}`

  return (
    <div
      className="fixed z-50 rounded-2xl select-none overflow-hidden"
      style={{
        left: pos.x,
        top: pos.y,
        width: 320,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center gap-3 px-7 py-5 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid var(--border)' }}
        onMouseDown={onDragStart}
      >
        <GripHorizontal size={16} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-semibold truncate" style={{ color: 'var(--text)' }}>
            {displayName}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {typeLabel(obj.type)} – Eigenschaften
          </div>
        </div>
        <button className="icon-btn" style={{ padding: 5 }} onClick={closeProperties}>
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[65vh] overflow-y-auto">
        {/* Bezeichnung */}
        <PanelSection title="Bezeichnung">
          <input
            type="text"
            value={obj.label}
            onChange={(e) => update({ label: e.target.value })}
            placeholder={typeLabel(obj.type)}
            className="field-input w-full"
            style={{ padding: '10px 14px', fontSize: '14px' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </PanelSection>

        {/* Type-specific properties */}
        {obj.type === 'freehand' ? (
          <FreehandProperties obj={obj} update={update} />
        ) : (
          <ShapeProperties obj={obj} update={update} />
        )}

        {/* Deckkraft */}
        <PanelSection title="Deckkraft">
          <PanelSlider
            label="Deckkraft"
            value={Math.round(obj.opacity * 100)}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => update({ opacity: v / 100 })}
          />
          <PanelSliderEnd />
        </PanelSection>
      </div>
    </div>
  )
}

// ─── Freehand Properties ───

function FreehandProperties({
  obj,
  update,
}: {
  obj: CanvasObject
  update: (changes: Record<string, unknown>) => void
}) {
  const lineStyle = getLineStyleFromDash(obj.lineDash)

  return (
    <>
      <PanelSection title="Strich">
        <PanelSlider
          label="Stärke"
          value={obj.strokeWidth}
          min={1}
          max={10}
          unit="px"
          onChange={(v) => update({ strokeWidth: v })}
        />
        <PanelSpacer />
        <PanelSegmented
          label="Strichart"
          options={LINE_STYLES}
          value={lineStyle}
          onChange={(v) => update({ lineDash: lineStyleToDash(v, obj.strokeWidth) })}
        />
        <PanelSpacer />
        <PanelSlider
          label="Glättung"
          value={Math.round((obj.tension ?? 0.25) * 200)}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => update({ tension: v / 200 })}
        />
        <PanelSliderEnd />
      </PanelSection>

      <PanelSection title="Farbe">
        <PanelColorLabel label="Strichfarbe" />
        <ColorPicker
          value={obj.strokeColor}
          onChange={(c) => update({ strokeColor: c })}
        />
      </PanelSection>
    </>
  )
}

// ─── Shape Properties ───

const OPEN_SHAPES: Set<string> = new Set(['line', 'arrow', 'path'])

function ShapeProperties({
  obj,
  update,
}: {
  obj: CanvasObject
  update: (changes: Record<string, unknown>) => void
}) {
  const lineStyle = getLineStyleFromDash(obj.lineDash)
  const hasFill = !OPEN_SHAPES.has(obj.type)

  return (
    <>
      <PanelSection title="Kontur">
        <PanelSlider
          label="Stärke"
          value={obj.strokeWidth}
          min={0}
          max={10}
          unit="px"
          onChange={(v) => update({ strokeWidth: v })}
        />
        <PanelSpacer />
        <PanelSegmented
          label="Konturart"
          options={LINE_STYLES}
          value={lineStyle}
          onChange={(v) => update({ lineDash: lineStyleToDash(v, obj.strokeWidth) })}
        />
        <PanelSpacer />
        <PanelColorLabel label="Konturfarbe" />
        <ColorPicker
          value={obj.strokeColor}
          onChange={(c) => update({ strokeColor: c })}
        />
      </PanelSection>

      {hasFill && (
        <PanelSection title="Füllung">
          <PanelColorLabel label="Füllfarbe" />
          <ColorPicker
            value={obj.fillColor}
            onChange={(c) => update({ fillColor: c })}
          />
        </PanelSection>
      )}
    </>
  )
}
