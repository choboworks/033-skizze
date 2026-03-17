import { useAppStore } from '@/store'
import { X, GripHorizontal, Paintbrush, Droplets, PenLine } from 'lucide-react'
import { ColorPicker } from './ColorPicker'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { ShapeType } from '@/types'

const TYPE_NAMES: Record<string, string> = {
  rect: 'Rechteck',
  ellipse: 'Ellipse',
  line: 'Linie',
  arrow: 'Pfeil',
  freehand: 'Freihand',
  text: 'Text',
  image: 'Bild',
}

function typeLabel(type: ShapeType): string {
  return TYPE_NAMES[type] || type
}

export function FloatingProperties() {
  const propertiesPanelId = useAppStore((s) => s.propertiesPanelId)
  const objects = useAppStore((s) => s.objects)
  const updateObject = useAppStore((s) => s.updateObject)
  const closeProperties = useAppStore((s) => s.closeProperties)

  const [pos, setPos] = useState(() => ({
    x: Math.max(60, (window.innerWidth - 400) / 2),
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
      className="fixed z-50 rounded-xl select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: 400,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* ─── Title Bar ─── */}
      <div
        className="flex items-center gap-3 px-5 py-5 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid var(--border)' }}
        onMouseDown={onDragStart}
      >
        <GripHorizontal size={16} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold truncate" style={{ color: 'var(--text)' }}>
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

      {/* ─── Content ─── */}
      <div className="max-h-[65vh] overflow-y-auto">

        {/* Bezeichnung */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>
            Bezeichnung
          </label>
          <input
            type="text"
            value={obj.label}
            onChange={(e) => update({ label: e.target.value })}
            placeholder={typeLabel(obj.type)}
            className="field-input w-full"
            style={{ padding: '8px 12px', fontSize: 'var(--font-size-base)' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Deckkraft */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Droplets size={15} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium flex-1" style={{ color: 'var(--text-muted)' }}>
              Deckkraft
            </span>
            <span
              className="text-sm font-semibold font-mono px-2 py-0.5 rounded"
              style={{ color: 'var(--text)', background: 'var(--bg)' }}
            >
              {Math.round(obj.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(obj.opacity * 100)}
            onChange={(e) => update({ opacity: parseInt(e.target.value) / 100 })}
            className="w-full accent-accent cursor-pointer"
          />
        </div>

        {/* Kontur */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <PenLine size={15} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium flex-1" style={{ color: 'var(--text-muted)' }}>
              Kontur
            </span>
            <span
              className="text-sm font-semibold font-mono px-2 py-0.5 rounded"
              style={{ color: 'var(--text)', background: 'var(--bg)' }}
            >
              {obj.strokeWidth}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={obj.strokeWidth}
            onChange={(e) => update({ strokeWidth: parseFloat(e.target.value) })}
            className="w-full accent-accent cursor-pointer mb-4"
          />
          <ColorPicker
            value={obj.strokeColor}
            onChange={(v) => update({ strokeColor: v })}
          />
        </div>

        {/* Füllung */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Paintbrush size={15} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Füllung
            </span>
          </div>

          {/* Quick color bar */}
          <div className="flex gap-1.5 mb-3">
            {['transparent', '#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'].map((c) => (
              <button
                key={c}
                className="w-8 h-8 rounded-md transition-transform hover:scale-110 shrink-0"
                style={{
                  background: c === 'transparent'
                    ? 'repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 0 0 / 6px 6px'
                    : c,
                  border: obj.fillColor === c ? '2px solid var(--accent)' : '1px solid var(--border)',
                  boxShadow: obj.fillColor === c ? '0 0 0 2px var(--accent-muted)' : 'none',
                }}
                onClick={() => update({ fillColor: c })}
              />
            ))}
          </div>

          <ColorPicker
            value={obj.fillColor}
            onChange={(v) => update({ fillColor: v })}
          />
        </div>
      </div>
    </div>
  )
}
