import { useAppStore } from '@/store'
import { Ruler } from 'lucide-react'
import { ColorPicker } from '@/components/Inspector/ColorPicker'
import {
  PanelHeader,
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
      className="absolute z-40 overflow-hidden anim-slide-left tool-popover panel-shell"
      style={{
        left: 'calc(var(--toolbar-width) + 10px)',
        top: 10,
      }}
    >
      <PanelHeader
        icon={<Ruler size={16} style={{ color: 'var(--accent)' }} />}
        title="Bemaßung"
        onClose={onClose}
      />

      {/* Info */}
      <div className="color-picker-well" style={{ marginBottom: 12 }}>
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
