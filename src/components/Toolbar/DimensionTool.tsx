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
      className="absolute z-40 overflow-hidden anim-slide-left glass"
      style={{
        width: 320,
        left: 'calc(var(--toolbar-width) + 10px)',
        top: 10,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-7 py-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <Ruler size={18} style={{ color: 'var(--accent)' }} />
          <span className="text-[16px] font-semibold" style={{ color: 'var(--text)' }}>
            Bemaßung
          </span>
        </div>
        <button className="icon-btn" style={{ padding: 6 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="px-7 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
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
