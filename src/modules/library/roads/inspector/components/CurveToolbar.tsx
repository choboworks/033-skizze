// src/modules/library/roads/inspector/components/CurveToolbar.tsx
import { useState, useRef, useEffect } from 'react'
import { 
  Check,
  ChevronDown,
  RotateCcw,
  CornerDownRight,
  CornerDownLeft,
  TrendingUp,
} from 'lucide-react'
import type { SmartRoadConfig } from '../../types'
import { GlassPopup } from './GlassPopup'

// Krümmungs-Presets: kombinieren Winkel + Radius
// Bogenlänge = (Winkel in Rad) × Radius → konstant halten (~160px)
// Bei 90°: Radius = 160 / (90 × π/180) ≈ 100
// Bei 15°: Radius = 160 / (15 × π/180) ≈ 610
const CURVATURE_PRESETS = [
  { level: 1, angle: 15, radius: 600, label: 'Sehr flach' },
  { level: 2, angle: 30, radius: 300, label: 'Flach' },
  { level: 3, angle: 45, radius: 200, label: 'Mittel' },
  { level: 4, angle: 60, radius: 150, label: 'Stark' },
  { level: 5, angle: 90, radius: 100, label: 'Sehr stark' },
]

type Props = {
  config: SmartRoadConfig
  onUpdate: <K extends keyof SmartRoadConfig>(key: K, value: SmartRoadConfig[K]) => void
  onReset: () => void
  canReset: boolean
  onClose: () => void
}

export function CurveToolbar({ 
  config, 
  onUpdate, 
  onReset, 
  canReset, 
  onClose,
}: Props) {
  const [activePopup, setActivePopup] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  
  const curve = config.curve || { angle: 90, direction: 'right', radius: 100 }

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

  const updateCurve = (updates: Partial<typeof curve>) => {
    onUpdate('curve', { ...curve, ...updates })
  }

  // Finde aktuelles Krümmungs-Level basierend auf Winkel
  const getCurrentCurvatureLevel = (): number => {
    const preset = CURVATURE_PRESETS.find(p => p.angle === curve.angle)
    return preset?.level || 5
  }

  const currentLevel = getCurrentCurvatureLevel()
  const currentPreset = CURVATURE_PRESETS.find(p => p.level === currentLevel) || CURVATURE_PRESETS[4]

  return (
    <div
      ref={toolbarRef}
      className="relative flex items-center gap-2"
    >
      {/* Kurvenrichtung */}
      <ToolbarButton
        icon={curve.direction === 'left' ? <CornerDownLeft className="w-4 h-4" /> : <CornerDownRight className="w-4 h-4" />}
        label={curve.direction === 'left' ? 'Links' : 'Rechts'}
        isActive={activePopup === 'curveDirection'}
        onClick={() => setActivePopup(activePopup === 'curveDirection' ? null : 'curveDirection')}
      />
      {activePopup === 'curveDirection' && (
        <GlassPopup onClose={() => setActivePopup(null)} position="top">
          <CurveDirectionPopup
            direction={curve.direction}
            onChange={(dir) => {
              updateCurve({ direction: dir })
              setActivePopup(null)
            }}
          />
        </GlassPopup>
      )}

      <ToolbarDivider />

      {/* Krümmung (ersetzt Winkel + Radius) */}
      <ToolbarButton
        icon={<TrendingUp className="w-4 h-4" />}
        label={currentPreset.label}
        isActive={activePopup === 'curvature'}
        onClick={() => setActivePopup(activePopup === 'curvature' ? null : 'curvature')}
      />
      {activePopup === 'curvature' && (
        <GlassPopup onClose={() => setActivePopup(null)} position="top">
          <CurvaturePopup
            currentLevel={currentLevel}
            onChange={(level) => {
              const preset = CURVATURE_PRESETS.find(p => p.level === level)
              if (preset) {
                updateCurve({ angle: preset.angle, radius: preset.radius })
              }
              setActivePopup(null)
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

function CurveDirectionPopup({ 
  direction, 
  onChange 
}: { 
  direction: 'left' | 'right'
  onChange: (direction: 'left' | 'right') => void
}) {
  return (
    <div className="flex flex-col gap-1 p-1 min-w-[140px]">
      <PopupOption
        selected={direction === 'right'}
        onClick={() => onChange('right')}
      >
        <CornerDownRight className="w-4 h-4" />
        <span>Rechtskurve</span>
      </PopupOption>
      <PopupOption
        selected={direction === 'left'}
        onClick={() => onChange('left')}
      >
        <CornerDownLeft className="w-4 h-4" />
        <span>Linkskurve</span>
      </PopupOption>
    </div>
  )
}

function CurvaturePopup({ 
  currentLevel, 
  onChange 
}: { 
  currentLevel: number
  onChange: (level: number) => void
}) {
  return (
    <div className="flex flex-col gap-1 p-1 min-w-[200px]">
      <div className="text-xs font-medium text-slate-500 px-2 py-1">Krümmung</div>
      
      {/* Visueller Slider */}
      <div className="px-2 py-2">
        <div className="flex items-center gap-1">
          {CURVATURE_PRESETS.map((preset) => (
            <button
              key={preset.level}
              onClick={() => onChange(preset.level)}
              className={`
                flex-1 h-8 rounded transition-all duration-150
                ${currentLevel === preset.level 
                  ? 'bg-blue-500 scale-110 shadow-md' 
                  : 'bg-slate-200 hover:bg-slate-300'
                }
              `}
              title={`${preset.label} (${preset.angle}°)`}
            >
              {/* Mini-Kurven-Icon */}
              <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
                <path
                  d={getCurveIconPath(preset.angle)}
                  fill="none"
                  stroke={currentLevel === preset.level ? 'white' : '#64748b'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-1 px-1">
          <span className="text-[10px] text-slate-400">Flach</span>
          <span className="text-[10px] text-slate-400">Stark</span>
        </div>
      </div>
      
      {/* Aktuelle Auswahl */}
      <div className="px-3 py-2 border-t border-slate-100 mt-1">
        <div className="text-sm font-medium text-slate-700">
          {CURVATURE_PRESETS.find(p => p.level === currentLevel)?.label}
        </div>
        <div className="text-xs text-slate-400">
          {CURVATURE_PRESETS.find(p => p.level === currentLevel)?.angle}° Winkel
        </div>
      </div>
    </div>
  )
}

// Generiert SVG-Pfad für Kurven-Icon basierend auf Winkel
function getCurveIconPath(angle: number): string {
  const cx = 20  // Kurvenmittelpunkt rechts unten
  const cy = 20
  const r = 14   // Radius
  
  const endAngle = (angle * Math.PI) / 180
  const startX = cx
  const startY = cy - r
  const endX = cx - r * Math.sin(endAngle)
  const endY = cy - r * Math.cos(endAngle)
  
  const largeArc = angle > 180 ? 1 : 0
  
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 0 ${endX.toFixed(1)} ${endY.toFixed(1)}`
}

function PopupOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left
        transition-colors text-sm
        ${selected 
          ? 'bg-blue-50 text-blue-600 font-medium' 
          : 'hover:bg-slate-50 text-slate-700'
        }
      `}
    >
      {children}
    </button>
  )
}