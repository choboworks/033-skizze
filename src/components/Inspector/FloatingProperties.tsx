import { useAppStore } from '@/store'
import { GripHorizontal, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react'
import { ColorPicker } from './ColorPicker'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { CanvasObject, ShapeType } from '@/types'
import {
  PanelHeader,
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
  dimension: 'Bemaßung',
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
  const objectOrder = useAppStore((s) => s.objectOrder)
  const updateObject = useAppStore((s) => s.updateObject)
  const closeProperties = useAppStore((s) => s.closeProperties)

  const PANEL_W = 304

  const [pos, setPos] = useState(() => {
    const { rightSidebarCollapsed } = useAppStore.getState().panels
    return { x: window.innerWidth - (rightSidebarCollapsed ? 48 : 180) - PANEL_W - 12, y: 80 }
  })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }, [pos])

  const [prevPanelId, setPrevPanelId] = useState(propertiesPanelId)
  if (propertiesPanelId !== prevPanelId) {
    setPrevPanelId(propertiesPanelId)
    if (propertiesPanelId) {
      const { rightSidebarCollapsed } = useAppStore.getState().panels
      setPos({ x: window.innerWidth - (rightSidebarCollapsed ? 48 : 180) - PANEL_W - 12, y: 80 })
    }
  }

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
  const displayName = obj.label || `${typeLabel(obj.type)} ${objectOrder.indexOf(obj.id) + 1}`

  return (
    <div
      className="fixed z-50 select-none overflow-hidden anim-pop-in panel-shell-elevated"
      style={{
        left: pos.x,
        top: pos.y,
        width: PANEL_W,
      }}
    >
      <PanelHeader
        icon={<GripHorizontal size={16} style={{ color: 'var(--text-muted)' }} />}
        title={displayName}
        subtitle={`${typeLabel(obj.type)} – Eigenschaften`}
        onClose={closeProperties}
        onMouseDown={onDragStart}
        className="active:cursor-grabbing"
      />

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
            style={{ padding: '10px 14px', fontSize: '13px' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </PanelSection>

        {/* Type-specific properties */}
        {obj.type === 'text' ? (
          <TextProperties obj={obj} update={update} />
        ) : obj.type === 'freehand' ? (
          <FreehandProperties obj={obj} update={update} />
        ) : obj.type === 'dimension' ? (
          <DimensionProperties obj={obj} update={update} />
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

// ─── Text Properties ───

function TextProperties({
  obj,
  update,
}: {
  obj: CanvasObject
  update: (changes: Record<string, unknown>) => void
}) {
  const isBold = (obj.fontStyle ?? '').includes('bold')
  const isItalic = (obj.fontStyle ?? '').includes('italic')
  const isUnderline = (obj.textDecoration ?? '') === 'underline'

  const toggleBold = () => {
    const bold = !isBold
    const italic = isItalic
    update({ fontStyle: bold && italic ? 'bold italic' : bold ? 'bold' : italic ? 'italic' : 'normal' })
  }

  const toggleItalic = () => {
    const italic = !isItalic
    const bold = isBold
    update({ fontStyle: bold && italic ? 'bold italic' : bold ? 'bold' : italic ? 'italic' : 'normal' })
  }

  const toggleUnderline = () => {
    update({ textDecoration: isUnderline ? '' : 'underline' })
  }

  const ALIGN_ICONS = { left: AlignLeft, center: AlignCenter, right: AlignRight } as const

  return (
    <>
      <PanelSection title="Schrift">
        <PanelSlider
          label="Größe"
          value={obj.fontSize ?? 24}
          min={6}
          max={72}
          unit="px"
          onChange={(v) => update({ fontSize: v })}
        />
        <PanelSliderEnd />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px]" style={{ color: 'var(--text)' }}>Stil</span>
          <div className="flex gap-1.5">
            {[
              { active: isBold, onClick: toggleBold, Icon: Bold },
              { active: isItalic, onClick: toggleItalic, Icon: Italic },
              { active: isUnderline, onClick: toggleUnderline, Icon: Underline },
            ].map(({ active, onClick, Icon }, i) => (
              <button
                key={i}
                onClick={onClick}
                data-active={active}
                className="toggle-btn w-9 h-9 flex items-center justify-center rounded-xl"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ color: 'var(--text)' }}>Ausrichtung</span>
          <div className="flex gap-1.5">
            {(['left', 'center', 'right'] as const).map((align) => {
              const Icon = ALIGN_ICONS[align]
              const isActive = (obj.textAlign ?? 'left') === align
              return (
                <button
                  key={align}
                  onClick={() => update({ textAlign: align })}
                  data-active={isActive}
                  className="toggle-btn w-9 h-9 flex items-center justify-center rounded-xl"
                >
                  <Icon size={14} />
                </button>
              )
            })}
          </div>
        </div>
        <PanelSliderEnd />
      </PanelSection>

      <PanelSection title="Farbe">
        <PanelColorLabel label="Textfarbe" />
        <ColorPicker
          value={obj.fillColor !== 'transparent' ? obj.fillColor : '#000000'}
          onChange={(c) => update({ fillColor: c })}
        />
        <PanelSpacer />
        <PanelColorLabel label="Hintergrund" />
        <ColorPicker
          value={obj.textBackground || 'transparent'}
          onChange={(c) => update({ textBackground: c })}
        />
      </PanelSection>
    </>
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

// ─── Dimension Properties ───

function DimensionProperties({
  obj,
  update,
}: {
  obj: CanvasObject
  update: (changes: Record<string, unknown>) => void
}) {
  return (
    <>
      <PanelSection title="Darstellung">
        <PanelSlider
          label="Linienstärke"
          value={obj.strokeWidth}
          min={1}
          max={5}
          unit="px"
          onChange={(v) => update({ strokeWidth: v })}
        />
        <PanelSliderEnd />

        <PanelSlider
          label="Schriftgröße"
          value={obj.fontSize ?? 14}
          min={10}
          max={36}
          unit="px"
          onChange={(v) => update({ fontSize: v })}
        />
        <PanelSliderEnd />
      </PanelSection>

      <PanelSection title="Farbe">
        <PanelColorLabel label="Linienfarbe" />
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
