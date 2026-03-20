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
      className="absolute z-40 overflow-hidden anim-slide-left tool-popover"
      style={{
        left: 'calc(var(--toolbar-width) + 10px)',
        top: 10,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, marginBottom: 12 }}
      >
        <div className="flex items-center gap-3">
          <Square size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
            Formen
          </span>
        </div>
        <button className="icon-btn" style={{ width: 28, height: 28, borderRadius: 10, padding: 0 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Shape grid */}
      <div style={{ marginBottom: 14 }}>
        <div className="grid grid-cols-3 gap-3">
          {SHAPES.map((shape) => {
            const Icon = shape.icon
            const isActive = activeTool === shape.id
            return (
              <button
                key={shape.id}
                onClick={() => onSelectTool(shape.id)}
                data-active={isActive}
                className="shape-option relative group"
              >
                <Icon size={24} />
                <span className="text-[10px]" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>{shape.label}</span>
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
