import { useAppStore } from '@/store'
import {
  Square,
  RectangleHorizontal,
  Circle,
  Triangle,
  Minus,
  ArrowUpRight,
  Hexagon,
  Spline,
  Star,
  X,
} from 'lucide-react'
import { ColorPicker } from '@/components/Inspector/ColorPicker'
import {
  PanelSection,
  PanelSlider,
  PanelSpacer,
  PanelSegmented,
  PanelColorLabel,
} from '@/components/ui/PanelPrimitives'
import type { LucideIcon } from 'lucide-react'

const LINE_STYLES = [
  { id: 'solid' as const, label: 'Linie' },
  { id: 'dashed' as const, label: 'Striche' },
  { id: 'dotted' as const, label: 'Punkte' },
]

interface ShapeDef {
  id: string
  label: string
  icon: LucideIcon
  hasFill: boolean
}

const SHAPES: ShapeDef[] = [
  { id: 'rect', label: 'Rechteck', icon: Square, hasFill: true },
  { id: 'rounded-rect', label: 'Abgerundet', icon: RectangleHorizontal, hasFill: true },
  { id: 'ellipse', label: 'Ellipse', icon: Circle, hasFill: true },
  { id: 'triangle', label: 'Dreieck', icon: Triangle, hasFill: true },
  { id: 'polygon', label: 'Polygon', icon: Hexagon, hasFill: true },
  { id: 'star', label: 'Stern', icon: Star, hasFill: true },
  { id: 'line', label: 'Linie', icon: Minus, hasFill: false },
  { id: 'arrow', label: 'Pfeil', icon: ArrowUpRight, hasFill: false },
  { id: 'path', label: 'Pfad', icon: Spline, hasFill: false },
]

export function ShapesToolPopover({
  onSelectTool,
  onClose,
}: {
  onSelectTool: (id: string) => void
  onClose: () => void
}) {
  const toolOptions = useAppStore((s) => s.toolOptions)
  const setToolOptions = useAppStore((s) => s.setToolOptions)
  const activeTool = useAppStore((s) => s.activeTool)

  const activeShape = SHAPES.find((s) => s.id === activeTool)
  const showFill = activeShape?.hasFill ?? true

  return (
    <div
      data-toolbar-popover
      className="absolute z-40 rounded-2xl overflow-hidden anim-slide-left"
      style={{
        width: 320,
        left: 'calc(var(--toolbar-width) + 10px)',
        top: 'calc(var(--topbar-height) + 10px)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-7 py-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <Square size={18} style={{ color: 'var(--accent)' }} />
          <span className="text-[16px] font-semibold" style={{ color: 'var(--text)' }}>
            Formen
          </span>
        </div>
        <button className="icon-btn" style={{ padding: 6 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Shape grid */}
      <div className="px-7 pt-7 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="grid grid-cols-3 gap-3">
          {SHAPES.map((shape) => {
            const Icon = shape.icon
            const isActive = activeTool === shape.id
            return (
              <button
                key={shape.id}
                onClick={() => onSelectTool(shape.id)}
                className="flex items-center justify-center aspect-square rounded-xl transition-all relative group"
                style={{
                  background: isActive ? 'var(--accent-muted)' : 'var(--bg)',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--surface-hover)'
                    e.currentTarget.style.borderColor = 'var(--text-muted)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }
                }}
              >
                <Icon size={28} />
                {/* Tooltip */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-panel)',
                  }}
                >
                  {shape.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* KONTUR */}
      <PanelSection title="Kontur">
        <PanelSlider
          label="Stärke"
          value={toolOptions.strokeWidth}
          min={1}
          max={10}
          unit="px"
          onChange={(v) => setToolOptions({ strokeWidth: v })}
        />
        <PanelSpacer />
        <PanelSegmented
          label="Konturart"
          options={LINE_STYLES}
          value={toolOptions.lineStyle}
          onChange={(v) => setToolOptions({ lineStyle: v })}
        />
        <PanelSpacer />
        <PanelColorLabel label="Konturfarbe" />
        <ColorPicker
          value={toolOptions.strokeColor}
          onChange={(c) => setToolOptions({ strokeColor: c })}
        />
      </PanelSection>

      {/* FÜLLUNG - nur bei geschlossenen Formen */}
      {showFill && (
        <PanelSection title="Füllung">
          <PanelColorLabel label="Füllfarbe" />
          <ColorPicker
            value={toolOptions.fillColor}
            onChange={(c) => setToolOptions({ fillColor: c })}
          />
        </PanelSection>
      )}
    </div>
  )
}
