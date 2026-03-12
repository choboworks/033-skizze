// src/modules/library/roads/inspector/components/MinimalToolbar.tsx
import { useState, useRef, useEffect } from 'react'
import { 
  Ruler,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react'
import type { SmartRoadConfig } from '../../types'
import { GlassPopup } from './GlassPopup'

type Props = {
  config: SmartRoadConfig
  onUpdate: <K extends keyof SmartRoadConfig>(key: K, value: SmartRoadConfig[K]) => void
  onReset: () => void
  canReset: boolean
  onClose: () => void
}

export function MinimalToolbar({ 
  config, 
  onUpdate, 
  onReset, 
  canReset, 
  onClose,
}: Props) {
  const [activePopup, setActivePopup] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Click outside to close popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActivePopup(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={toolbarRef}
      className="relative flex items-center gap-2"
    >
      {/* Größe */}
      <ToolbarButton
        icon={<Ruler className="w-4 h-4" />}
        label="Größe"
        isActive={activePopup === 'dimensions'}
        onClick={() => setActivePopup(activePopup === 'dimensions' ? null : 'dimensions')}
      />
      {activePopup === 'dimensions' && (
        <GlassPopup onClose={() => setActivePopup(null)} position="top">
          <DimensionsPopup 
            config={config}
            onChange={(updates) => {
              if (updates.width !== undefined) onUpdate('width', updates.width)
            }}
          />
        </GlassPopup>
      )}

      <ToolbarDivider />

      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={!canReset}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-40 text-slate-600 hover:bg-slate-50"
        title="Zurücksetzen"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm">Reset</span>
      </button>

      <ToolbarDivider />

      {/* Fertig Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-95"
        style={{
          background: 'var(--primary)',
          color: 'white',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2563eb'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--primary)'
        }}
      >
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">Fertig</span>
      </button>
    </div>
  )
}

// ==================== Sub-Components ====================

function ToolbarButton({ 
  icon, 
  label, 
  isActive, 
  onClick
}: { 
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg 
        transition-all duration-200
        active:scale-95
        ${isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-slate-600 hover:bg-slate-50'
        }
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
      <ChevronDown className={`w-3 h-3 transition-transform ${isActive ? 'rotate-180' : ''}`} />
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-slate-200" />
}

// ==================== Popups ====================

function DimensionsPopup({ 
  config, 
  onChange 
}: { 
  config: SmartRoadConfig
  onChange: (updates: { width?: number }) => void 
}) {
  const widthOptions = [
    { value: 80, label: 'Schmal', desc: '80px' },
    { value: 160, label: 'Mittel', desc: '160px' },
    { value: 240, label: 'Breit', desc: '240px' },
  ]

  return (
    <div className="p-2 min-w-[200px]">
      <div className="text-xs font-medium text-slate-500 px-2 mb-2">Breite</div>
      <div className="space-y-1">
        {widthOptions.map(opt => (
          <PopupOption
            key={opt.value}
            selected={config.width === opt.value}
            onClick={() => onChange({ width: opt.value })}
          >
            <span className="flex-1">{opt.label}</span>
            <span className="text-xs text-slate-400">{opt.desc}</span>
          </PopupOption>
        ))}
      </div>
    </div>
  )
}

function PopupOption({ 
  children, 
  selected, 
  onClick 
}: { 
  children: React.ReactNode
  selected: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-3 py-2 flex items-center gap-2 text-sm rounded-md
        transition-all duration-150
        ${selected 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-slate-700 hover:bg-slate-50'
        }
      `}
    >
      {children}
      {selected && <Check className="w-4 h-4 ml-auto" />}
    </button>
  )
}