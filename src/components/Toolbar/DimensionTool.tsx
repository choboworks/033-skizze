import { useAppStore } from '@/store'
import { Ruler, X } from 'lucide-react'
import { ColorPicker } from '@/components/Inspector/ColorPicker'
import {
  PanelSection,
  PanelSlider,
  PanelSliderEnd,
  PanelColorLabel,
} from '@/components/ui/PanelPrimitives'

export function DimensionToolPopover({
  onClose,
}: {
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
          <Ruler size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
            Bemaßung
          </span>
        </div>
        <button className="icon-btn" style={{ width: 28, height: 28, borderRadius: 10, padding: 0 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Info */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 12, marginBottom: 12 }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Klicke zwei Punkte auf dem Canvas, um eine Bemaßungslinie zu erstellen.
          Die Distanz wird automatisch in Metern berechnet.
        </p>
      </div>

      {/* Strich */}
      <PanelSection title="Darstellung">
        <PanelSlider
          label="Linienstärke"
          value={toolOptions.strokeWidth}
          min={1}
          max={5}
          unit="px"
          onChange={(v) => setToolOptions({ strokeWidth: v })}
        />
        <PanelSliderEnd />

        <PanelSlider
          label="Schriftgröße"
          value={toolOptions.fontSize}
          min={10}
          max={36}
          unit="px"
          onChange={(v) => setToolOptions({ fontSize: v })}
        />
        <PanelSliderEnd />
      </PanelSection>

      {/* Farbe */}
      <PanelSection title="Farbe">
        <PanelColorLabel label="Linienfarbe" />
        <ColorPicker
          value={toolOptions.strokeColor}
          onChange={(c) => setToolOptions({ strokeColor: c })}
        />
      </PanelSection>
    </div>
  )
}
