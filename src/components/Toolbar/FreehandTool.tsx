import { useAppStore } from '@/store'
import { Pencil } from 'lucide-react'
import { ColorPicker } from '@/components/Inspector/ColorPicker'
import {
  PanelHeader,
  PanelSection,
  PanelSlider,
  PanelSpacer,
  PanelSliderEnd,
  PanelSegmented,
  PanelColorLabel,
} from '@/components/ui/PanelPrimitives'
import { LINE_STYLES } from '@/constants/shared'

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
      className="absolute z-40 overflow-hidden anim-slide-left tool-popover panel-shell"
      style={{
        left: 'calc(var(--toolbar-width) + 10px)',
        top: 10,
      }}
    >
      <PanelHeader
        icon={<Pencil size={16} style={{ color: 'var(--accent)' }} />}
        title="Freihand"
        onClose={onClose}
      />

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
        <div className="color-picker-well">
          <ColorPicker
            value={toolOptions.strokeColor}
            onChange={(c) => setToolOptions({ strokeColor: c })}
          />
        </div>
      </PanelSection>
    </div>
  )
}
