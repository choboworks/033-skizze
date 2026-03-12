// src/modules/library/roads/inspector/components/MarkingsPalette.tsx
// Markierungs-Palette als linkes Side-Panel — ContextPanel-Style
// Klick zum Platzieren, Drag in Preview zum Verschieben

import { useState } from 'react'
import { Stamp, MoveRight, OctagonAlert, ShieldBan, Type, Footprints, Shapes, Minus } from 'lucide-react'
import type { SmartRoadConfig, RoadMarking, ArrowMarking, ZebraMarking, StopLineMarking, WaitLineMarking, SharkTeethMarking, SpeedNumberMarking, LaneLineMarking, BlockedAreaMarking } from '../../types'
import { ARROW_DEFS, ARROW_LABELS, type ArrowType } from '../../markings/arrowSvgs'
import { BLOCKED_AREA_DEFS } from '../../markings/blockedAreaSvgs'

type Props = {
  config: SmartRoadConfig
  onUpdate: (config: SmartRoadConfig, preserveSize?: boolean) => void
}

// ============================================================================
// ID Generator
// ============================================================================

function generateMarkingId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
}

// ============================================================================
// Marking Category Definitions
// ============================================================================

type MarkingCategory = 'laneLines' | 'directionArrows' | 'stopWaitLines' | 'blockedAreas' | 'textSymbols' | 'pedestrianCycle' | 'misc'

const CATEGORY_INFO: Record<MarkingCategory, { label: string; color: string; icon: React.ReactNode }> = {
  laneLines: {
    label: 'Fahrstreifenbegrenzungen',
    color: '#06b6d4',
    icon: <Minus className="w-4 h-4" />,
  },
  directionArrows: {
    label: 'Richtungspfeile',
    color: '#3b82f6',
    icon: <MoveRight className="w-4 h-4" />,
  },
  stopWaitLines: {
    label: 'Halt- und Wartelinien',
    color: '#ef4444',
    icon: <OctagonAlert className="w-4 h-4" />,
  },
  blockedAreas: {
    label: 'Sperrflächen',
    color: '#f59e0b',
    icon: <ShieldBan className="w-4 h-4" />,
  },
  textSymbols: {
    label: 'Schrift und Symbole',
    color: '#22c55e',
    icon: <Type className="w-4 h-4" />,
  },
  pedestrianCycle: {
    label: 'Fußgänger und Rad',
    color: '#8b5cf6',
    icon: <Footprints className="w-4 h-4" />,
  },
  misc: {
    label: 'Sonstiges',
    color: '#6b7280',
    icon: <Shapes className="w-4 h-4" />,
  },
}

// ============================================================================
// Mini-Preview Components
// ============================================================================

function ArrowMini({ type, size = 20 }: { type: ArrowType; size?: number }) {
  const def = ARROW_DEFS[type]
  if (!def) return null
  const aspect = def.width / def.height
  // SVG-Paths haben fill="#ffffff" inline — müssen wir für die Preview überschreiben
  const darkSvg = def.svg.replace(/fill="#ffffff"/g, 'fill="currentColor"').replace(/fill="#FFFFFF"/g, 'fill="currentColor"')
  return (
    <svg 
      viewBox={def.viewBox}
      width={size * aspect} 
      height={size}
      style={{ color: 'var(--text)' }}
      dangerouslySetInnerHTML={{ __html: darkSvg }}
    />
  )
}

function ZebraMini({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 24" width={size} height={size * 0.6}>
      {[0, 8, 16, 24, 32].map(x => (
        <rect key={x} x={x} y={0} width={5} height={24} fill="currentColor" />
      ))}
    </svg>
  )
}

function StopLineMini({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 8" width={size} height={size * 0.2}>
      <rect x={0} y={0} width={40} height={8} fill="currentColor" rx={1} />
    </svg>
  )
}

function WaitLineMini({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 6" width={size} height={size * 0.15}>
      {[0, 10, 20, 30].map(x => (
        <rect key={x} x={x} y={0} width={7} height={6} fill="currentColor" rx={0.5} />
      ))}
    </svg>
  )
}

function SharkTeethMini({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 12" width={size} height={size * 0.3}>
      {[0, 10, 20, 30].map(x => (
        <polygon key={x} points={`${x},12 ${x+5},0 ${x+10},12`} fill="currentColor" />
      ))}
    </svg>
  )
}

function SpeedMini({ value, size = 24 }: { value: number; size?: number }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * 0.67}>
      <text 
        x="30" y="32" 
        textAnchor="middle" 
        fill="currentColor" 
        fontFamily="Arial, sans-serif" 
        fontWeight="bold" 
        fontSize={value >= 100 ? 28 : 34}
      >{value}</text>
    </svg>
  )
}

function LaneLineMini({ lineType, size = 24 }: { lineType: LaneLineMarking['lineType']; size?: number }) {
  const w = size * 0.5
  const h = size
  const c = 'currentColor'
  const mx = w / 2
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      {lineType === 'solid' && (
        <line x1={mx} y1={0} x2={mx} y2={h} stroke={c} strokeWidth={2} />
      )}
      {lineType === 'double-solid' && (
        <>
          <line x1={mx-2} y1={0} x2={mx-2} y2={h} stroke={c} strokeWidth={1.5} />
          <line x1={mx+2} y1={0} x2={mx+2} y2={h} stroke={c} strokeWidth={1.5} />
        </>
      )}
      {lineType === 'solid-dashed' && (
        <>
          <line x1={mx-2} y1={0} x2={mx-2} y2={h} stroke={c} strokeWidth={1.5} />
          <line x1={mx+2} y1={0} x2={mx+2} y2={h} stroke={c} strokeWidth={1.5} strokeDasharray="3 2.5" />
        </>
      )}
      {lineType === 'dashed-solid' && (
        <>
          <line x1={mx-2} y1={0} x2={mx-2} y2={h} stroke={c} strokeWidth={1.5} strokeDasharray="3 2.5" />
          <line x1={mx+2} y1={0} x2={mx+2} y2={h} stroke={c} strokeWidth={1.5} />
        </>
      )}
    </svg>
  )
}

const LANE_LINE_LABELS: Record<LaneLineMarking['lineType'], string> = {
  solid: 'Leitlinie',
  'double-solid': 'Doppelt',
  'solid-dashed': 'Überh. links',
  'dashed-solid': 'Überh. rechts',
}

function BlockedAreaMini({ areaType, size = 20 }: { areaType: BlockedAreaMarking['areaType']; size?: number }) {
  const def = BLOCKED_AREA_DEFS[areaType]
  if (!def) return null
  const cb = def.contentBox
  // Etwas Padding um die contentBox
  const pad = Math.max(cb.w, cb.h) * 0.05
  const vx = cb.x - pad
  const vy = cb.y - pad
  const vw = cb.w + pad * 2
  const vh = cb.h + pad * 2
  const aspect = vw / vh
  const w = aspect >= 1 ? size : size * aspect
  const h = aspect >= 1 ? size / aspect : size
  return (
    <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} width={w} height={h}>
      {def.flatPaths.map((fp, i) => (
        <path
          key={i}
          d={fp.d}
          fill={fp.fill === 'none' ? 'none' : 'currentColor'}
          stroke="currentColor"
          strokeWidth={fp.strokeWidth}
          strokeLinecap={fp.strokeLinecap as React.SVGAttributes<SVGPathElement>['strokeLinecap']}
          strokeLinejoin={fp.strokeLinejoin as React.SVGAttributes<SVGPathElement>['strokeLinejoin']}
        />
      ))}
    </svg>
  )
}

const BLOCKED_AREA_LABELS: Record<BlockedAreaMarking['areaType'], string> = {
  hatchRect: 'Sperrfläche',
  hatchWedge: 'Keil',
  hatchWedgeRounded: 'Keil abger.',
  hatchBogen: 'Bogen',
}

// ============================================================================
// Grid Tile — wiederverwendbare Kachel für alle Kategorien
// ============================================================================

function GridTile({ 
  icon, label, onAdd, color,
}: { 
  icon: React.ReactNode
  label: string 
  onAdd: () => void
  color: string
}) {
  return (
    <button
      onClick={onAdd}
      className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-150"
      style={{
        background: 'var(--panel-elev)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.background = `color-mix(in srgb, ${color} 10%, transparent)`
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.color = color
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.background = 'var(--panel-elev)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text)'
      }}
      title={label}
    >
      <div className="h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[9px] font-medium leading-tight text-center">
        {label}
      </span>
    </button>
  )
}

// ============================================================================
// Section Divider (identisch zum ContextPanel)
// ============================================================================

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-1.5">
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  )
}

// ============================================================================
// Placed Marking Item
// ============================================================================

function PlacedMarkingItem({ 
  marking, 
  onRemove,
  accent,
}: { 
  marking: RoadMarking
  onRemove: () => void
  accent: string
}) {
  const getLabel = () => {
    switch (marking.type) {
      case 'arrow': return `${ARROW_LABELS[marking.arrowType]} • Spur ${marking.laneIndex + 1}`
      case 'zebra': return 'Zebrastreifen'
      case 'stopLine': return `Haltelinie${(marking.widthPercent ?? 100) < 100 ? ' (halb)' : ''}`
      case 'waitLine': return `Wartelinie${(marking.widthPercent ?? 100) < 100 ? ' (halb)' : ''}`
      case 'sharkTeeth': return `Haifischzähne${(marking.widthPercent ?? 100) < 100 ? ' (halb)' : ''}`
      case 'speedNumber': return `${marking.value} km/h • Spur ${marking.laneIndex + 1}`
      case 'laneLine': return `${LANE_LINE_LABELS[marking.lineType]} • Spur ${marking.laneIndex + 1}`
      case 'blockedArea': return BLOCKED_AREA_LABELS[marking.areaType]
    }
  }
  
  const getIcon = () => {
    switch (marking.type) {
      case 'arrow': return <ArrowMini type={marking.arrowType} size={14} />
      case 'zebra': return <ZebraMini size={18} />
      case 'stopLine': return <StopLineMini size={18} />
      case 'waitLine': return <WaitLineMini size={18} />
      case 'sharkTeeth': return <SharkTeethMini size={18} />
      case 'speedNumber': return <SpeedMini value={marking.value} size={18} />
      case 'laneLine': return <LaneLineMini lineType={marking.lineType} size={16} />
      case 'blockedArea': return <BlockedAreaMini areaType={marking.areaType} size={14} />
    }
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 group">
      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ 
        color: accent, 
        transform: marking.rotation ? `rotate(${marking.rotation}deg)` : undefined,
      }}>
        {getIcon()}
      </div>
      <span className="text-[11px] flex-1 min-w-0 truncate" style={{ color: 'var(--text-muted)' }}>
        {getLabel()}
      </span>
      <button
        onClick={onRemove}
        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
        title="Löschen"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ============================================================================
// Category Header (Accordion)
// ============================================================================

function CategoryHeader({ info, count, expanded, onToggle }: { 
  info: { label: string; color: string; icon: React.ReactNode }
  count: number
  expanded: boolean 
  onToggle: () => void 
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150"
      style={{
        background: expanded ? `color-mix(in srgb, ${info.color} 5%, transparent)` : 'transparent',
        borderBottom: expanded ? `1px solid var(--border)` : '1px solid transparent',
      }}
      onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = 'var(--hover)' }}
      onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = 'transparent' }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ 
        background: `${info.color}15`,
        color: info.color,
      }}>
        {info.icon}
      </div>
      <span className="text-[13px] font-medium flex-1 text-left" style={{ color: 'var(--text)' }}>
        {info.label}
      </span>
      {count > 0 && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ 
          background: `${info.color}15`, 
          color: info.color,
        }}>
          {count}
        </span>
      )}
      <svg 
        className="w-3.5 h-3.5 shrink-0 transition-transform duration-150" 
        style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function MarkingsPanel({ config, onUpdate }: Props) {
  const [expandedCategory, setExpandedCategory] = useState<MarkingCategory | null>(null)
  const markings = config.markings || []
  
  // Finde freie Position auf einer Spur
  const findFreePosition = (laneIndex: number): number => {
    const existingOnLane = markings.filter(m => 
      (m.type === 'arrow' || m.type === 'speedNumber') && m.laneIndex === laneIndex
    )
    const usedPositions = existingOnLane.map(m => m.positionPercent)
    const tryPositions = [50, 30, 70, 20, 80, 40, 60, 15, 85]
    for (const pos of tryPositions) {
      if (!usedPositions.some(p => Math.abs(p - pos) < 12)) return pos
    }
    return 50
  }
  
  // Finde freie Position für Quermarkierungen
  const findFreeCrossPosition = (): number => {
    const existing = markings.filter(m => m.type === 'zebra' || m.type === 'stopLine')
    const usedPositions = existing.map(m => m.positionPercent)
    const tryPositions = [50, 30, 70, 20, 80, 40, 60]
    for (const pos of tryPositions) {
      if (!usedPositions.some(p => Math.abs(p - pos) < 15)) return pos
    }
    return 50
  }
  
  // Add Handlers
  const addArrow = (arrowType: ArrowType) => {
    const newMarking: ArrowMarking = {
      id: generateMarkingId(),
      type: 'arrow',
      arrowType: arrowType as ArrowMarking['arrowType'],
      laneIndex: 0,
      positionPercent: findFreePosition(0),
      rotation: 0,
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addZebra = () => {
    const newMarking: ZebraMarking = {
      id: generateMarkingId(),
      type: 'zebra',
      positionPercent: findFreeCrossPosition(),
      width: 40,
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addStopLine = (widthPercent = 100, xPercent?: number) => {
    const newMarking: StopLineMarking = {
      id: generateMarkingId(),
      type: 'stopLine',
      positionPercent: findFreeCrossPosition(),
      widthPercent,
      ...(xPercent !== undefined ? { xPercent } : {}),
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addWaitLine = (widthPercent = 100, xPercent?: number) => {
    const newMarking: WaitLineMarking = {
      id: generateMarkingId(),
      type: 'waitLine',
      positionPercent: findFreeCrossPosition(),
      widthPercent,
      ...(xPercent !== undefined ? { xPercent } : {}),
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addSharkTeeth = (widthPercent = 100, direction: SharkTeethMarking['direction'] = 'inward', xPercent?: number) => {
    const newMarking: SharkTeethMarking = {
      id: generateMarkingId(),
      type: 'sharkTeeth',
      positionPercent: findFreeCrossPosition(),
      widthPercent,
      direction,
      ...(xPercent !== undefined ? { xPercent } : {}),
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addSpeedNumber = (value: SpeedNumberMarking['value']) => {
    const newMarking: SpeedNumberMarking = {
      id: generateMarkingId(),
      type: 'speedNumber',
      value,
      laneIndex: 0,
      positionPercent: findFreePosition(0),
      rotation: 0,
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addLaneLine = (lineType: LaneLineMarking['lineType']) => {
    const newMarking: LaneLineMarking = {
      id: generateMarkingId(),
      type: 'laneLine',
      lineType,
      laneIndex: 0,
      positionPercent: findFreePosition(0),
      rotation: 0,
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const addBlockedArea = (areaType: BlockedAreaMarking['areaType'], widthPercent = 30, heightPercent = 15) => {
    const newMarking: BlockedAreaMarking = {
      id: generateMarkingId(),
      type: 'blockedArea',
      areaType,
      positionPercent: findFreeCrossPosition(),
      widthPercent,
      heightPercent,
    }
    onUpdate({ ...config, markings: [...markings, newMarking] }, true)
  }
  
  const removeMarking = (id: string) => {
    onUpdate({ ...config, markings: markings.filter(m => m.id !== id) }, true)
  }
  
  const clearAllMarkings = () => {
    onUpdate({ ...config, markings: [] }, true)
  }
  
  const toggleCategory = (cat: MarkingCategory) => {
    setExpandedCategory(expandedCategory === cat ? null : cat)
  }
  
  // Zähle Markierungen pro Kategorie
  const laneLineCount = markings.filter(m => m.type === 'laneLine').length
  const arrowCount = markings.filter(m => m.type === 'arrow').length
  const stopLineCount = markings.filter(m => m.type === 'stopLine' || m.type === 'waitLine' || m.type === 'sharkTeeth').length
  const speedCount = markings.filter(m => m.type === 'speedNumber').length
  const zebraCount = markings.filter(m => m.type === 'zebra').length
  const blockedAreaCount = markings.filter(m => m.type === 'blockedArea').length
  
  const arrowTypes: ArrowType[] = ['straight', 'left', 'right', 'straight-left', 'straight-right', 'all', 'half-left', 'half-right']
  const speedValues: SpeedNumberMarking['value'][] = [30, 50, 70, 100]
  
  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: 'var(--panel)',
        borderRight: '1px solid var(--border)',
        width: '250px',
        minWidth: '250px',
      }}
    >
      
      {/* Header — ContextPanel-Style */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ 
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.03), rgba(59,130,246,0.01))',
      }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ 
          background: 'rgba(59,130,246,0.1)',
          color: '#3b82f6',
        }}>
          <Stamp className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
            Markierungen
          </div>
          <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
            Klick zum Platzieren
          </div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        
        {/* ========== 0. FAHRSTREIFENBEGRENZUNGEN ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.laneLines} 
          count={laneLineCount}
          expanded={expandedCategory === 'laneLines'} 
          onToggle={() => toggleCategory('laneLines')} 
        />
        {expandedCategory === 'laneLines' && (
          <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
            <div className="grid grid-cols-3 gap-1.5">
              {(['solid', 'double-solid', 'solid-dashed', 'dashed-solid'] as const).map((lt) => (
                <GridTile
                  key={lt}
                  icon={<LaneLineMini lineType={lt} size={16} />}
                  label={LANE_LINE_LABELS[lt]}
                  onAdd={() => addLaneLine(lt)}
                  color="#06b6d4"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* ========== 1. RICHTUNGSPFEILE ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.directionArrows} 
          count={arrowCount}
          expanded={expandedCategory === 'directionArrows'} 
          onToggle={() => toggleCategory('directionArrows')} 
        />
        {expandedCategory === 'directionArrows' && (
          <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
            <div className="grid grid-cols-3 gap-1.5">
              {arrowTypes.map((type) => (
                <GridTile
                  key={type}
                  icon={<ArrowMini type={type} size={16} />}
                  label={ARROW_LABELS[type]}
                  onAdd={() => addArrow(type)}
                  color="#3b82f6"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* ========== 2. HALT- UND WARTELINIEN ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.stopWaitLines} 
          count={stopLineCount}
          expanded={expandedCategory === 'stopWaitLines'} 
          onToggle={() => toggleCategory('stopWaitLines')} 
        />
        {expandedCategory === 'stopWaitLines' && (
          <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
            <div className="grid grid-cols-3 gap-1.5">
              <GridTile icon={<StopLineMini size={18} />} label="Haltelinie" onAdd={() => addStopLine(100)} color="#ef4444" />
              <GridTile icon={<StopLineMini size={14} />} label="Halte halb" onAdd={() => addStopLine(50, 25)} color="#ef4444" />
              <GridTile icon={<WaitLineMini size={18} />} label="Wartelinie" onAdd={() => addWaitLine(100)} color="#ef4444" />
              <GridTile icon={<WaitLineMini size={14} />} label="Warte halb" onAdd={() => addWaitLine(50, 25)} color="#ef4444" />
              <GridTile icon={<SharkTeethMini size={18} />} label="Haifisch" onAdd={() => addSharkTeeth(100, 'inward')} color="#ef4444" />
              <GridTile icon={<SharkTeethMini size={14} />} label="Haifisch halb" onAdd={() => addSharkTeeth(50, 'inward', 25)} color="#ef4444" />
            </div>
          </div>
        )}
        
        {/* ========== 3. SPERRFLÄCHEN ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.blockedAreas} 
          count={blockedAreaCount}
          expanded={expandedCategory === 'blockedAreas'} 
          onToggle={() => toggleCategory('blockedAreas')} 
        />
        {expandedCategory === 'blockedAreas' && (
          <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
            <div className="grid grid-cols-3 gap-1.5">
              <GridTile icon={<BlockedAreaMini areaType="hatchRect" size={20} />} label="Sperrfläche" onAdd={() => addBlockedArea('hatchRect', 30, 15)} color="#f59e0b" />
              <GridTile icon={<BlockedAreaMini areaType="hatchWedge" size={20} />} label="Keil" onAdd={() => addBlockedArea('hatchWedge', 50, 20)} color="#f59e0b" />
              <GridTile icon={<BlockedAreaMini areaType="hatchWedgeRounded" size={20} />} label="Keil abger." onAdd={() => addBlockedArea('hatchWedgeRounded', 25, 20)} color="#f59e0b" />
              <GridTile icon={<BlockedAreaMini areaType="hatchBogen" size={20} />} label="Bogen" onAdd={() => addBlockedArea('hatchBogen', 30, 15)} color="#f59e0b" />
            </div>
          </div>
        )}
        
        {/* ========== 4. SCHRIFT UND SYMBOLE ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.textSymbols} 
          count={speedCount}
          expanded={expandedCategory === 'textSymbols'} 
          onToggle={() => toggleCategory('textSymbols')} 
        />
        {expandedCategory === 'textSymbols' && (
          <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
            <div className="grid grid-cols-3 gap-1.5">
              {speedValues.map((v) => (
                <GridTile
                  key={v}
                  icon={<SpeedMini value={v} size={18} />}
                  label={`${v} km/h`}
                  onAdd={() => addSpeedNumber(v)}
                  color="#22c55e"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* ========== 5. FUSSGÄNGER UND RAD ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.pedestrianCycle} 
          count={zebraCount}
          expanded={expandedCategory === 'pedestrianCycle'} 
          onToggle={() => toggleCategory('pedestrianCycle')} 
        />
        {expandedCategory === 'pedestrianCycle' && (
          <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
            <div className="grid grid-cols-3 gap-1.5">
              <GridTile icon={<ZebraMini size={18} />} label="Zebrastreifen" onAdd={addZebra} color="#8b5cf6" />
            </div>
          </div>
        )}
        
        {/* ========== 6. SONSTIGES ========== */}
        <CategoryHeader 
          info={CATEGORY_INFO.misc} 
          count={0}
          expanded={expandedCategory === 'misc'} 
          onToggle={() => toggleCategory('misc')} 
        />
        {expandedCategory === 'misc' && (
          <div className="px-4 py-3 text-[11px]" style={{ color: 'var(--text-muted)', animation: 'fadeIn 0.1s ease-out' }}>
            Demnächst verfügbar
          </div>
        )}
        
        {/* ========== PLATZIERTE MARKIERUNGEN ========== */}
        {markings.length > 0 && (
          <>
            <SectionDivider label={`Platziert (${markings.length})`} />
            
            <div className="py-1">
              {markings.map((marking) => {
                const accent = marking.type === 'arrow' ? '#3b82f6' 
                  : marking.type === 'stopLine' || marking.type === 'waitLine' || marking.type === 'sharkTeeth' ? '#ef4444'
                  : marking.type === 'zebra' ? '#8b5cf6'
                  : marking.type === 'speedNumber' ? '#22c55e'
                  : marking.type === 'laneLine' ? '#06b6d4'
                  : marking.type === 'blockedArea' ? '#f59e0b'
                  : '#6b7280'
                return (
                  <PlacedMarkingItem
                    key={marking.id}
                    marking={marking}
                    onRemove={() => removeMarking(marking.id)}
                    accent={accent}
                  />
                )
              })}
            </div>
            
            {/* Alle löschen */}
            <div className="px-4 pb-3">
              <button
                onClick={clearAllMarkings}
                className="w-full py-2 text-[11px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5"
                style={{ color: '#ef4444' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                </svg>
                Alle entfernen
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Footer Hint */}
      <div 
        className="px-3 py-2 text-[10px] flex-shrink-0 text-center"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--panel-elev)' }}
      >
        Drag verschieben • Shift+Drag frei • Scroll rotieren
      </div>
    </div>
  )
}