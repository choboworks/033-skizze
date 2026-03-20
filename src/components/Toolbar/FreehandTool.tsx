import { useAppStore } from '@/store'
import { Pencil, X } from 'lucide-react'
import { ColorPicker } from '@/components/Inspector/ColorPicker'
import {
  PanelSection,
  PanelSlider,
  PanelSpacer,
  PanelSliderEnd,
  PanelSegmented,
  PanelColorLabel,
} from '@/components/ui/PanelPrimitives'

const LINE_STYLES = [
  { id: 'solid' as const, label: 'Linie' },
  { id: 'dashed' as const, label: 'Striche' },
  { id: 'dotted' as const, label: 'Punkte' },
]

export function FreehandToolPopover({
  onClose,
}: {
  onSelectTool?: (id: string) => void
  onClose: () => void
}) {
  const toolOptions = useAppStore((s) => s.toolOptions)
  const setToolOptions = useAppStore((s) => s.setToolOptions)

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
          <Pencil size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
            Freihand
          </span>
        </div>
        <button className="icon-btn" style={{ width: 28, height: 28, borderRadius: 10, padding: 0 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* STRICH */}
      <PanelSection title="Strich">
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
          label="Strichart"
          options={LINE_STYLES}
          value={toolOptions.lineStyle}
          onChange={(v) => setToolOptions({ lineStyle: v })}
        />
        <PanelSpacer />
        <PanelSlider
          label="Glättung"
          value={Math.round(toolOptions.smoothing * 100)}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => setToolOptions({ smoothing: v / 100 })}
        />
        <PanelSliderEnd />
      </PanelSection>

      {/* FARBE */}
      <PanelSection title="Farbe">
        <PanelColorLabel label="Strichfarbe" />
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 10 }}>
          <ColorPicker
            value={toolOptions.strokeColor}
            onChange={(c) => setToolOptions({ strokeColor: c })}
          />
        </div>
      </PanelSection>
    </div>
  )
}
