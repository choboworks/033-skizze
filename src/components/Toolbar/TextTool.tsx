import { useAppStore } from '@/store'
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, X } from 'lucide-react'
import { ColorPicker } from '@/components/Inspector/ColorPicker'
import {
  PanelSection,
  PanelSlider,
  PanelSpacer,
  PanelSliderEnd,
  PanelColorLabel,
} from '@/components/ui/PanelPrimitives'

export function TextToolPopover({
  onClose,
}: {
  onSelectTool?: (id: string) => void
  onClose: () => void
}) {
  const toolOptions = useAppStore((s) => s.toolOptions)
  const setToolOptions = useAppStore((s) => s.setToolOptions)

  const isBold = toolOptions.fontStyle.includes('bold')
  const isItalic = toolOptions.fontStyle.includes('italic')
  const isUnderline = toolOptions.textDecoration === 'underline'

  const toggleBold = () => {
    const bold = !isBold
    const italic = toolOptions.fontStyle.includes('italic')
    setToolOptions({ fontStyle: bold && italic ? 'bold italic' : bold ? 'bold' : italic ? 'italic' : 'normal' })
  }

  const toggleItalic = () => {
    const italic = !isItalic
    const bold = toolOptions.fontStyle.includes('bold')
    setToolOptions({ fontStyle: bold && italic ? 'bold italic' : bold ? 'bold' : italic ? 'italic' : 'normal' })
  }

  const toggleUnderline = () => {
    setToolOptions({ textDecoration: isUnderline ? '' : 'underline' })
  }

  const ALIGN_ICONS = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
  } as const

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
          <Type size={18} style={{ color: 'var(--accent)' }} />
          <span className="text-[16px] font-semibold" style={{ color: 'var(--text)' }}>
            Text
          </span>
        </div>
        <button className="icon-btn" style={{ padding: 6 }} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Schrift */}
      <PanelSection title="Schrift">
        <PanelSlider
          label="Größe"
          value={toolOptions.fontSize}
          min={8}
          max={72}
          unit="px"
          onChange={(v) => setToolOptions({ fontSize: v })}
        />
        <PanelSliderEnd />

        {/* Bold / Italic */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px]" style={{ color: 'var(--text)' }}>Stil</span>
          <div className="flex gap-1.5">
            {[
              { label: 'Fett', active: isBold, onClick: toggleBold, Icon: Bold },
              { label: 'Kursiv', active: isItalic, onClick: toggleItalic, Icon: Italic },
              { label: 'Unterstrichen', active: isUnderline, onClick: toggleUnderline, Icon: Underline },
            ].map(({ label, active, onClick, Icon }) => (
              <button
                key={label}
                onClick={onClick}
                className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: active ? 'var(--accent-muted)' : 'var(--bg)',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? 'var(--accent-muted)' : 'var(--bg)' }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Alignment */}
        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ color: 'var(--text)' }}>Ausrichtung</span>
          <div className="flex gap-1.5">
            {(['left', 'center', 'right'] as const).map((align) => {
              const Icon = ALIGN_ICONS[align]
              const isActive = toolOptions.textAlign === align
              return (
                <button
                  key={align}
                  onClick={() => setToolOptions({ textAlign: align })}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    background: isActive ? 'var(--accent-muted)' : 'var(--bg)',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'var(--accent-muted)' : 'var(--bg)' }}
                >
                  <Icon size={14} />
                </button>
              )
            })}
          </div>
        </div>
        <PanelSliderEnd />
      </PanelSection>

      {/* Farbe */}
      <PanelSection title="Farbe">
        <PanelColorLabel label="Textfarbe" />
        <ColorPicker
          value={toolOptions.textColor}
          onChange={(c) => setToolOptions({ textColor: c })}
        />
        <PanelSpacer />
        <PanelColorLabel label="Hintergrund" />
        <ColorPicker
          value={toolOptions.textBackground || 'transparent'}
          onChange={(c) => setToolOptions({ textBackground: c })}
        />
      </PanelSection>
    </div>
  )
}
