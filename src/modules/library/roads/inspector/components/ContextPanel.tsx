// src/modules/library/roads/inspector/components/ContextPanel.tsx
// Dynamisches Kontext-Panel rechts neben der Preview
// Professionelles Design mit farbigen Sektionen und smooth transitions

import type { SmartRoadConfig, LineType, CurbType, SidewalkSurfaceType, SurfaceType, TramTrackType } from '../../types'
import type { PopupPosition } from '../previewTypes'
import { useState } from 'react'

type Props = {
  config: SmartRoadConfig
  popup: PopupPosition
  updatePartial: (updates: Partial<SmartRoadConfig>) => void
  onClose: () => void
}

export function ContextPanel({ config, popup, updatePartial, onClose }: Props) {
  // Determine if we're showing a specific element panel or the default add panel
  const isAddPanel = !popup || popup.zone === 'addLeft' || popup.zone === 'addRight'
  const zone = popup?.zone
  const side = popup?.side
  const titleInfo = isAddPanel 
    ? getPanelInfo('addRight', 'right')
    : getPanelInfo(zone!, side)
  
  // For the add panel, show a simpler header (title only, no close button — it's permanent)
  const headerTitle = isAddPanel ? 'Element hinzufügen' : titleInfo.title
  const headerSubtitle = isAddPanel ? undefined : titleInfo.subtitle
  
  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: 'var(--panel)',
        borderLeft: '1px solid var(--border)',
        width: '260px',
        minWidth: '260px',
      }}
    >
      {/* Header mit Farb-Akzent */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ 
        borderBottom: '1px solid var(--border)',
        background: `linear-gradient(135deg, ${titleInfo.color}08, ${titleInfo.color}03)`,
      }}>
        {!isAddPanel && (
          <button onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:scale-105"
            style={{ color: 'var(--text-muted)', background: 'var(--panel-elev)' }}
            title="Zurück zur Elementliste"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ 
          background: `${titleInfo.color}15`,
          color: titleInfo.color,
        }}>
          {titleInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
            {headerTitle}
          </div>
          {headerSubtitle && (
            <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
              {headerSubtitle}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {isAddPanel ? (
          <AddElementPanel config={config} side="right" updatePartial={updatePartial} />
        ) : (
          <>
            {(zone === 'laneLine' || zone === 'median' || zone === 'tram') && popup && (
              <LinePanel config={config} lineIndex={popup.index || 0} updatePartial={updatePartial} />
            )}
            {zone === 'surface' && <SurfacePanel config={config} updatePartial={updatePartial} />}
            {zone === 'sidewalk' && side && <SidewalkPanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
            {zone === 'curb' && side && <CurbPanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
            {zone === 'greenStrip' && side && <GreenStripPanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
            {zone === 'barrier' && side && (
              <RemoveOnlyPanel label="Leitplanke" onRemove={() => {
                const k = side === 'left' ? 'leftSide' : 'rightSide' as const
                updatePartial({ [k]: { ...config[k], barrier: undefined } })
                onClose()
              }} />
            )}
            {zone === 'ramp' && (
              <RampPanel config={config} updatePartial={updatePartial} onClose={onClose} />
            )}
            {zone === 'cyclePath' && side && <CyclePathPanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
            {(zone === 'onRoadCyclePath' || zone === 'onRoadCyclePathLine') && side && <OnRoadCyclePanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
            {zone === 'emergencyLane' && side && <EmergencyLanePanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
            {zone === 'parking' && side && <ParkingPanel config={config} side={side} updatePartial={updatePartial} onClose={onClose} />}
          </>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Panel Info (Title, Icon, Color)
// ============================================================================

function getPanelInfo(zone: string, side?: string): { title: string; subtitle?: string; color: string; icon: React.ReactNode } {
  const sideLabel = side === 'left' ? 'Linke Seite' : side === 'right' ? 'Rechte Seite' : ''
  
  const iconProps = { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }
  
  switch (zone) {
    case 'laneLine': case 'median': case 'tram':
      return { title: 'Spurlinie', subtitle: 'Markierung & Trennung', color: '#3b82f6', icon: <svg {...iconProps}><path d="M4 12h16" strokeDasharray="4 4" /></svg> }
    case 'surface':
      return { title: 'Fahrbahnbelag', color: '#f59e0b', icon: <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" /></svg> }
    case 'sidewalk':
      return { title: 'Gehweg', subtitle: sideLabel, color: '#8b5cf6', icon: <svg {...iconProps}><path d="M13 4a1 1 0 100-2 1 1 0 000 2zM7 21l3-4 2 2 4-5" /></svg> }
    case 'curb':
      return { title: 'Bordstein', subtitle: sideLabel, color: '#6b7280', icon: <svg {...iconProps}><path d="M4 19h16M4 15h16" /></svg> }
    case 'greenStrip':
      return { title: 'Grünstreifen', subtitle: sideLabel, color: '#22c55e', icon: <svg {...iconProps}><path d="M12 3v18M8 7l4-4 4 4" /></svg> }
    case 'barrier':
      return { title: 'Leitplanke', subtitle: sideLabel, color: '#94a3b8', icon: <svg {...iconProps}><path d="M4 6h16M4 12h16M4 18h16" /></svg> }
    case 'cyclePath':
      return { title: 'Radweg', subtitle: sideLabel, color: '#ef4444', icon: <svg {...iconProps}><circle cx="9" cy="18" r="3" /><circle cx="18" cy="14" r="3" /><path d="M9 18l6-8h3" /></svg> }
    case 'onRoadCyclePath': case 'onRoadCyclePathLine':
      return { title: 'Radstreifen', subtitle: sideLabel, color: '#ef4444', icon: <svg {...iconProps}><circle cx="9" cy="18" r="3" /><circle cx="18" cy="14" r="3" /><path d="M9 18l6-8h3" /></svg> }
    case 'emergencyLane':
      return { title: 'Standstreifen', subtitle: sideLabel, color: '#eab308', icon: <svg {...iconProps}><path d="M12 9v4M12 17h.01" /><path d="M4 4l16 16" /></svg> }
    case 'parking':
      return { title: 'Parkplätze', subtitle: sideLabel, color: '#6366f1', icon: <svg {...iconProps}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M9 10h6M12 10v4" /></svg> }
    case 'ramp':
      return { title: 'Beschleunigungsstr.', color: '#f97316', icon: <svg {...iconProps}><path d="M4 12h8l6 6M4 12l6-6" /></svg> }
    case 'addLeft': case 'addRight':
      return { title: 'Element hinzufügen', subtitle: side === 'left' ? 'Linke Seite' : 'Rechte Seite', color: '#3b82f6', icon: <svg {...iconProps} strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg> }
    default:
      return { title: 'Optionen', color: '#6b7280', icon: <svg {...iconProps}><circle cx="12" cy="12" r="3" /></svg> }
  }
}

// ============================================================================
// Shared UI Components
// ============================================================================

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-5 pb-2">
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  )
}

function OptionButton({ selected, onClick, children, accent }: { 
  selected: boolean; onClick: () => void; children: React.ReactNode; accent?: string 
}) {
  const accentColor = accent || 'var(--primary)'
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2.5 flex items-center gap-3 text-[13px] transition-all duration-150"
      style={{
        background: selected ? `color-mix(in srgb, ${accentColor} 8%, transparent)` : 'transparent',
        color: selected ? accentColor : 'var(--text)',
        borderLeft: selected ? `3px solid ${accentColor}` : '3px solid transparent',
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'var(--hover)' }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
      {selected && (
        <svg className="ml-auto w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </button>
  )
}

function RemoveBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="px-4 py-4 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
      <button onClick={onClick}
        className="w-full py-2.5 px-3 text-[13px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
        style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
        </svg>
        {label}
      </button>
    </div>
  )
}

function LineIcon({ type }: { type: string }) {
  const c = 'var(--text-muted)'
  switch (type) {
    case 'dashed':
      return <div className="w-7 flex items-center"><div className="w-full h-0.5 border-t-2 border-dashed" style={{ borderColor: c }} /></div>
    case 'solid':
      return <div className="w-7 h-0.5" style={{ background: c }} />
    case 'double-solid':
      return <div className="w-7 flex flex-col gap-[3px]"><div className="w-full h-0.5" style={{ background: c }} /><div className="w-full h-0.5" style={{ background: c }} /></div>
    case 'solid-dashed':
      return <div className="w-7 flex flex-col gap-[3px]"><div className="w-full h-0.5" style={{ background: c }} /><div className="w-full h-0.5 border-t-2 border-dashed" style={{ borderColor: c }} /></div>
    case 'dashed-solid':
      return <div className="w-7 flex flex-col gap-[3px]"><div className="w-full h-0.5 border-t-2 border-dashed" style={{ borderColor: c }} /><div className="w-full h-0.5" style={{ background: c }} /></div>
    case 'green-strip':
      return <div className="w-7 h-4 rounded" style={{ background: '#4a7c59' }} />
    case 'barrier':
      return <div className="w-7 h-4 rounded" style={{ background: '#94a3b8' }} />
    case 'none':
      return <div className="w-7 h-0.5 opacity-20" style={{ background: c }} />
    default: return null
  }
}

function ToggleChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-2 px-2 rounded-lg text-[12px] font-medium transition-all duration-150 text-center"
      style={{
        background: active ? 'var(--primary)' : 'var(--panel-elev)',
        color: active ? 'white' : 'var(--text)',
        border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
        boxShadow: active ? '0 2px 8px rgba(59, 130, 246, 0.25)' : 'none',
      }}
    >{label}</button>
  )
}

// ============================================================================
// LINE PANEL
// ============================================================================

function LinePanel({ config, lineIndex, updatePartial }: {
  config: SmartRoadConfig; lineIndex: number; updatePartial: (u: Partial<SmartRoadConfig>) => void
}) {
  const currentLine = config.lines?.[lineIndex]
  const currentType = currentLine?.type || config.defaultLineType || 'dashed'
  const tram = config.tram
  
  const handleLineChange = (type: LineType) => {
    const newLines = [...(config.lines || [])]
    while (newLines.length <= lineIndex) newLines.push({ type: config.defaultLineType || 'dashed' })
    newLines[lineIndex] = { type }
    updatePartial({ lines: newLines })
  }

  return (
    <>
      <SectionDivider label="Markierung" />
      {([
        ['dashed', 'Gestrichelt'], ['solid', 'Durchgezogen'], ['double-solid', 'Doppelt durchgezogen'],
        ['solid-dashed', 'Überholen rechts'], ['dashed-solid', 'Überholen links'], ['none', 'Keine'],
      ] as [LineType, string][]).map(([type, label]) => (
        <OptionButton key={type} selected={currentType === type} onClick={() => handleLineChange(type)}>
          <LineIcon type={type} /><span>{label}</span>
        </OptionButton>
      ))}
      
      <SectionDivider label="Physische Trennung" />
      {([
        ['green-strip', 'Grünstreifen'], ['barrier', 'Leitplanke'],
      ] as [LineType, string][]).map(([type, label]) => (
        <OptionButton key={type} selected={currentType === type} onClick={() => handleLineChange(type)} accent="#22c55e">
          <LineIcon type={type} /><span>{label}</span>
        </OptionButton>
      ))}
      
      {config.category === 'strasse' && (
        <>
          <SectionDivider label="Straßenbahn" />
          {!tram ? (
            <div className="px-4 py-2">
              <button onClick={() => updatePartial({ tram: { tracks: 1, trackType: 'embedded', position: 'center' } })}
                className="w-full py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 flex items-center justify-center gap-2"
                style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Gleise hinzufügen
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-3">
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Gleise</div>
                <div className="flex gap-1.5">
                  <TramChip active={tram.tracks === 1} onClick={() => updatePartial({ tram: { ...tram, tracks: 1 } })} label="Eingleisig" />
                  <TramChip active={tram.tracks === 2} onClick={() => updatePartial({ tram: { ...tram, tracks: 2 } })} label="Zweigleisig" />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Bauart</div>
                <div className="flex gap-1.5">
                  {([['embedded', 'Eingebettet', '#5a5a5a'], ['dedicated', 'Eigener Gleiskörper', '#888'], ['grass', 'Rasengleis', '#6a8f4e']] as [TramTrackType, string, string][]).map(([t, l, c]) => (
                    <TramTypeChip key={t} active={tram.trackType === t} onClick={() => updatePartial({ tram: { ...tram, trackType: t } })} label={l} color={c} />
                  ))}
                </div>
              </div>
              <RemoveBtn label="Gleise entfernen" onClick={() => updatePartial({ tram: undefined })} />
            </div>
          )}
        </>
      )}
    </>
  )
}

// ============================================================================
// SURFACE PANEL
// ============================================================================

function SurfacePanel({ config, updatePartial }: { config: SmartRoadConfig; updatePartial: (u: Partial<SmartRoadConfig>) => void }) {
  const current = config.surface?.type || 'asphalt'
  const opts: [SurfaceType, string, string][] = [
    ['asphalt', 'Asphalt', '#6b6b6b'], ['concrete', 'Beton', '#9a9a9a'], ['cobblestone', 'Pflastersteine', '#7a7a6a'],
    ['pavement', 'Kopfsteinpflaster', '#8a8a7a'], ['gravel', 'Schotter', '#a89080'],
  ]
  return (
    <div className="py-2">
      {opts.map(([type, label, color]) => (
        <OptionButton key={type} selected={current === type} onClick={() => updatePartial({ surface: { ...config.surface, type } })} accent="#f59e0b">
          <div className="w-5 h-5 rounded" style={{ background: color, border: '1px solid rgba(0,0,0,0.1)' }} />
          <span>{label}</span>
        </OptionButton>
      ))}
    </div>
  )
}

// ============================================================================
// SIDEWALK PANEL
// ============================================================================

function SidewalkPanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]
  const cw = sc?.sidewalk?.width || 35
  const cs = sc?.sidewalk?.surface || 'tiles'
  const upd = (w?: number, s?: string) => updatePartial({ [k]: { ...sc, sidewalk: { width: w ?? cw, surface: (s ?? cs) as SidewalkSurfaceType } } })
  
  return (
    <>
      <SectionDivider label="Breite" />
      <div className="px-4 py-2 flex gap-1.5">
        {[{ v: 20, l: 'S' }, { v: 35, l: 'M' }, { v: 50, l: 'L' }].map(({ v, l }) => (
          <ToggleChip key={v} active={cw === v} onClick={() => upd(v)} label={l} />
        ))}
      </div>
      <SectionDivider label="Oberfläche" />
      {([['tiles', 'Platten', '#c8c0b0'], ['concrete', 'Beton', '#b8b8b8'], ['pavement', 'Pflaster', '#a0a0a0']] as [SidewalkSurfaceType, string, string][]).map(([t, l, c]) => (
        <OptionButton key={t} selected={cs === t} onClick={() => upd(undefined, t)} accent="#8b5cf6">
          <div className="w-5 h-5 rounded" style={{ background: c }} /><span>{l}</span>
        </OptionButton>
      ))}
      <RemoveBtn label="Gehweg entfernen" onClick={() => { updatePartial({ [k]: { ...sc, sidewalk: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// CURB PANEL
// ============================================================================

function CurbPanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]
  const cur = sc?.curb || 'standard'
  return (
    <>
      <div className="py-2">
        {([['standard', 'Standard', 'Normaler Bordstein'], ['lowered', 'Abgesenkt', 'Rollstuhl-/Radfahrerfreundlich']] as [CurbType, string, string][]).map(([t, l, d]) => (
          <OptionButton key={t} selected={cur === t} onClick={() => updatePartial({ [k]: { ...sc, curb: t } })}>
            <div className="flex flex-col items-start"><span>{l}</span><span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{d}</span></div>
          </OptionButton>
        ))}
      </div>
      <RemoveBtn label="Bordstein entfernen" onClick={() => { updatePartial({ [k]: { ...sc, curb: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// GREEN STRIP
// ============================================================================

function GreenStripPanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]
  const cw = sc?.greenStrip?.width || 15
  return (
    <>
      <SectionDivider label="Breite" />
      <div className="px-4 py-2 flex gap-1.5">
        {[{ v: 10, l: 'S' }, { v: 15, l: 'M' }, { v: 25, l: 'L' }].map(({ v, l }) => (
          <ToggleChip key={v} active={cw === v} onClick={() => updatePartial({ [k]: { ...sc, greenStrip: { width: v } } })} label={l} />
        ))}
      </div>
      <RemoveBtn label="Grünstreifen entfernen" onClick={() => { updatePartial({ [k]: { ...sc, greenStrip: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// CYCLE PATH (separated)
// ============================================================================

function CyclePathPanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]; const cp = sc?.cyclePath; const cl = cp?.lineType || 'solid'
  return (
    <>
      <SectionDivider label="Breite" />
      {[{ v: 15, l: 'Schmal' }, { v: 25, l: 'Standard' }, { v: 35, l: 'Breit' }].map(({ v, l }) => (
        <OptionButton key={v} selected={(cp?.width || 25) === v} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, width: v } } })}>
          <span>{l}</span><span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{v}px</span>
        </OptionButton>
      ))}
      <SectionDivider label="Oberfläche" />
      <OptionButton selected={cp?.surface === 'red'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, surface: 'red' } } })} accent="#ef4444">
        <div className="w-5 h-5 rounded" style={{ background: '#c45c5c' }} /><span>Rot</span>
      </OptionButton>
      <OptionButton selected={cp?.surface === 'asphalt'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, surface: 'asphalt' } } })} accent="#ef4444">
        <div className="w-5 h-5 rounded" style={{ background: '#6b6b6b' }} /><span>Asphalt</span>
      </OptionButton>
      <SectionDivider label="Trennlinie" />
      {(['solid', 'dashed', 'none'] as const).map(t => (
        <OptionButton key={t} selected={cl === t} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, lineType: t } } })}>
          <span>{t === 'solid' ? 'Durchgezogen' : t === 'dashed' ? 'Gestrichelt' : 'Keine'}</span>
        </OptionButton>
      ))}
      <RemoveBtn label="Radweg entfernen" onClick={() => { updatePartial({ [k]: { ...sc, cyclePath: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// ON-ROAD CYCLE
// ============================================================================

function OnRoadCyclePanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]; const cp = sc?.cyclePath; const cl = cp?.lineType || 'solid'
  return (
    <>
      <SectionDivider label="Oberfläche" />
      <OptionButton selected={cp?.surface === 'red'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, surface: 'red' } } })} accent="#ef4444">
        <div className="w-5 h-5 rounded" style={{ background: '#c45c5c' }} /><span>Rot</span>
      </OptionButton>
      <OptionButton selected={cp?.surface === 'asphalt'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, surface: 'asphalt' } } })} accent="#ef4444">
        <div className="w-5 h-5 rounded" style={{ background: '#6b6b6b' }} /><span>Asphalt</span>
      </OptionButton>
      <SectionDivider label="Trennlinie" />
      {(['solid', 'dashed', 'none'] as const).map(t => (
        <OptionButton key={t} selected={cl === t} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...cp!, lineType: t } } })}>
          <span>{t === 'solid' ? 'Durchgezogen' : t === 'dashed' ? 'Gestrichelt' : 'Keine'}</span>
        </OptionButton>
      ))}
      <RemoveBtn label="Radstreifen entfernen" onClick={() => { updatePartial({ [k]: { ...sc, cyclePath: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// EMERGENCY LANE
// ============================================================================

function EmergencyLanePanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]; const cw = sc?.emergencyLane?.width || 30
  return (
    <>
      <SectionDivider label="Breite" />
      <div className="px-4 py-2 flex gap-1.5">
        {[{ v: 20, l: 'S' }, { v: 30, l: 'M' }, { v: 40, l: 'L' }].map(({ v, l }) => (
          <ToggleChip key={v} active={cw === v} onClick={() => updatePartial({ [k]: { ...sc, emergencyLane: { width: v } } })} label={l} />
        ))}
      </div>
      <RemoveBtn label="Standstreifen entfernen" onClick={() => { updatePartial({ [k]: { ...sc, emergencyLane: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// PARKING
// ============================================================================

function ParkingPanel({ config, side, updatePartial, onClose }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k]; const p = sc?.parking; const o = p?.orientation || 'parallel'
  return (
    <>
      <SectionDivider label="Aufstellung" />
      {([['parallel', 'Längsparken', '↕'], ['perpendicular', 'Querparken', '↔'], ['angled', 'Schrägparken', '⟋']] as const).map(([t, l, ico]) => (
        <OptionButton key={t} selected={o === t} onClick={() => updatePartial({ [k]: { ...sc, parking: { ...p!, orientation: t } } })} accent="#6366f1">
          <span className="text-lg w-5 text-center">{ico}</span><span>{l}</span>
        </OptionButton>
      ))}
      <RemoveBtn label="Parkplätze entfernen" onClick={() => { updatePartial({ [k]: { ...sc, parking: undefined } }); onClose() }} />
    </>
  )
}

// ============================================================================
// REMOVE ONLY
// ============================================================================

function RemoveOnlyPanel({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <RemoveBtn label={`${label} entfernen`} onClick={onRemove} />
}

// ============================================================================
// ADD ELEMENT
// ============================================================================

function AddElementPanel({ config, side: initialSide, updatePartial }: {
  config: SmartRoadConfig; side: string; updatePartial: (u: Partial<SmartRoadConfig>) => void
}) {
  const [activeSide, setActiveSide] = useState<string>(initialSide)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
  const side = activeSide
  const k = side === 'left' ? 'leftSide' : 'rightSide' as const
  const sc = config[k] || {}
  const isCurve = !!config.curve
  
  const hasSidewalk = !!sc.sidewalk?.width
  const hasCurb = !!sc.curb && sc.curb !== 'none'
  const hasCyclePath = !!sc.cyclePath
  const hasParking = !!sc.parking
  const hasEmergencyLane = !!sc.emergencyLane
  const hasGreenStrip = !!sc.greenStrip
  const hasBarrier = !!sc.barrier
  const hasRamp = !!sc.ramp
  
  const handleAdd = (key: string, addValue: unknown) => {
    const isActive = !!(sc as Record<string, unknown>)[key]
    if (!isActive) {
      const currentOrder = sc.order || []
      const elType = key as import('../../types').RoadsideElementType
      const newOrder = key !== 'ramp' && !currentOrder.includes(elType) 
        ? [...currentOrder, elType] 
        : currentOrder
      updatePartial({ [k]: { ...sc, [key]: addValue, order: newOrder.length > 0 ? newOrder : undefined } })
    }
  }
  
  const remove = (key: string) => {
    const currentOrder = sc.order || []
    const elType = key as import('../../types').RoadsideElementType
    const newOrder = currentOrder.filter(e => e !== elType)
    updatePartial({ [k]: { ...sc, [key]: undefined, order: newOrder.length > 0 ? newOrder : undefined } })
  }
  
  const toggleCat = (cat: string) => setExpandedCat(expandedCat === cat ? null : cat)
  
  const ico = { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }
  
  // Count active per category
  const footCount = (hasSidewalk ? 1 : 0) + (hasCurb ? 1 : 0)
  const cycleCount = hasCyclePath ? 1 : 0
  const parkCount = hasParking ? 1 : 0
  const safeCount = (hasEmergencyLane ? 1 : 0) + (hasGreenStrip ? 1 : 0) + (hasBarrier ? 1 : 0)
  const rampCount = hasRamp ? 1 : 0

  // Side labels: for curves use Innen/Außen, for straight use Links/Rechts
  const leftLabel = isCurve ? 'Innenseite' : 'Linke Seite'
  const rightLabel = isCurve ? 'Außenseite' : 'Rechte Seite'
  
  return (
    <>
      {/* Seiten-Toggle */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--panel-elev)' }}>
          <button
            onClick={() => { setActiveSide('left'); setExpandedCat(null) }}
            className="flex-1 py-2 text-[12px] font-medium transition-all duration-150"
            style={{
              background: activeSide === 'left' ? 'var(--primary)' : 'transparent',
              color: activeSide === 'left' ? 'white' : 'var(--text-muted)',
            }}
          >
            {leftLabel}
          </button>
          <button
            onClick={() => { setActiveSide('right'); setExpandedCat(null) }}
            className="flex-1 py-2 text-[12px] font-medium transition-all duration-150"
            style={{
              background: activeSide === 'right' ? 'var(--primary)' : 'transparent',
              color: activeSide === 'right' ? 'white' : 'var(--text-muted)',
            }}
          >
            {rightLabel}
          </button>
        </div>
      </div>

      {/* ========== FUSSVERKEHR ========== */}
      <ElementCategoryHeader label="Fußverkehr" color="#8b5cf6" count={footCount}
        icon={<svg {...ico}><path d="M13 4a1 1 0 100-2 1 1 0 000 2zM7 21l3-4 2 2 4-5" /></svg>}
        expanded={expandedCat === 'foot'} onToggle={() => toggleCat('foot')} />
      {expandedCat === 'foot' && (
        <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <ElementItem active={hasSidewalk} label="Gehweg" desc={hasSidewalk ? `${sc.sidewalk?.width}px` : undefined} color="#8b5cf6"
            icon={<svg {...ico}><path d="M13 4a1 1 0 100-2 1 1 0 000 2zM7 21l3-4 2 2 4-5" /></svg>}
            onToggle={() => hasSidewalk ? remove('sidewalk') : handleAdd('sidewalk', { width: 20, surface: 'tiles' })} />
          {hasSidewalk && (
            <InlineConfig>
              <ConfigLabel>Breite</ConfigLabel>
              <div className="flex gap-1.5">
                {[{ v: 20, l: 'S' }, { v: 35, l: 'M' }, { v: 50, l: 'L' }].map(({ v, l }) => (
                  <ToggleChip key={v} active={sc.sidewalk?.width === v} onClick={() => updatePartial({ [k]: { ...sc, sidewalk: { ...sc.sidewalk!, width: v } } })} label={l} />
                ))}
              </div>
              <ConfigLabel>Oberfläche</ConfigLabel>
              <div className="flex gap-1.5">
                {([['tiles', 'Platten'], ['concrete', 'Beton'], ['pavement', 'Pflaster']] as const).map(([t, l]) => (
                  <ToggleChip key={t} active={sc.sidewalk?.surface === t} onClick={() => updatePartial({ [k]: { ...sc, sidewalk: { ...sc.sidewalk!, surface: t } } })} label={l} />
                ))}
              </div>
            </InlineConfig>
          )}
          <ElementItem active={hasCurb} label="Bordstein" desc={hasCurb ? (sc.curb === 'lowered' ? 'Abgesenkt' : 'Standard') : undefined} color="#6b7280"
            icon={<svg {...ico}><path d="M4 19h16M4 15h16" /></svg>}
            onToggle={() => hasCurb ? remove('curb') : handleAdd('curb', 'standard')} />
          {hasCurb && (
            <InlineConfig>
              <ConfigLabel>Typ</ConfigLabel>
              <div className="flex gap-1.5">
                <ToggleChip active={sc.curb === 'standard'} onClick={() => updatePartial({ [k]: { ...sc, curb: 'standard' } })} label="Standard" />
                <ToggleChip active={sc.curb === 'lowered'} onClick={() => updatePartial({ [k]: { ...sc, curb: 'lowered' } })} label="Abgesenkt" />
              </div>
            </InlineConfig>
          )}
        </div>
      )}

      {/* ========== RADVERKEHR ========== */}
      <ElementCategoryHeader label="Radverkehr" color="#ef4444" count={cycleCount}
        icon={<svg {...ico}><circle cx="9" cy="18" r="3" /><circle cx="18" cy="14" r="3" /><path d="M9 18l6-8h3" /></svg>}
        expanded={expandedCat === 'cycle'} onToggle={() => toggleCat('cycle')} />
      {expandedCat === 'cycle' && (
        <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
          <ElementItem active={hasCyclePath} label="Radweg" desc={hasCyclePath ? (sc.cyclePath?.type === 'separated' ? 'Baulich getrennt' : 'Auf Fahrbahn') : undefined} color="#ef4444"
            icon={<svg {...ico}><circle cx="9" cy="18" r="3" /><circle cx="18" cy="14" r="3" /><path d="M9 18l6-8h3" /></svg>}
            onToggle={() => hasCyclePath ? remove('cyclePath') : handleAdd('cyclePath', { type: 'separated', width: 25, surface: 'red' })} />
          {hasCyclePath && (
            <InlineConfig>
              <ConfigLabel>Typ</ConfigLabel>
              <div className="flex gap-1.5">
                <ToggleChip active={sc.cyclePath?.type === 'separated'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, type: 'separated' } } })} label="Getrennt" />
                <ToggleChip active={sc.cyclePath?.type === 'lane'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, type: 'lane' } } })} label="Fahrbahn" />
              </div>
              <ConfigLabel>Oberfläche</ConfigLabel>
              <div className="flex gap-1.5">
                <ToggleChip active={sc.cyclePath?.surface === 'red'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, surface: 'red' } } })} label="Rot" />
                <ToggleChip active={sc.cyclePath?.surface === 'asphalt'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, surface: 'asphalt' } } })} label="Asphalt" />
              </div>
              <ConfigLabel>Trennlinie</ConfigLabel>
              <div className="flex gap-1.5">
                <ToggleChip active={(sc.cyclePath?.lineType || 'solid') === 'solid'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, lineType: 'solid' } } })} label="Durchgez." />
                <ToggleChip active={sc.cyclePath?.lineType === 'dashed'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, lineType: 'dashed' } } })} label="Gestrichelt" />
                <ToggleChip active={sc.cyclePath?.lineType === 'none'} onClick={() => updatePartial({ [k]: { ...sc, cyclePath: { ...sc.cyclePath!, lineType: 'none' } } })} label="Keine" />
              </div>
            </InlineConfig>
          )}
        </div>
      )}

      {/* ========== PARKEN ========== */}
      <ElementCategoryHeader label="Parken" color="#6366f1" count={parkCount}
        icon={<svg {...ico}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M9 10h6M12 10v4" /></svg>}
        expanded={expandedCat === 'park'} onToggle={() => toggleCat('park')} />
      {expandedCat === 'park' && (
        <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
          <ElementItem active={hasParking} label="Parkplätze" desc={hasParking ? (sc.parking?.orientation === 'parallel' ? 'Längs' : sc.parking?.orientation === 'perpendicular' ? 'Quer' : 'Schräg') : undefined} color="#6366f1"
            icon={<svg {...ico}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M9 10h6M12 10v4" /></svg>}
            onToggle={() => hasParking ? remove('parking') : handleAdd('parking', { type: 'separated', orientation: 'parallel', width: 25 })} />
          {hasParking && (
            <InlineConfig>
              <ConfigLabel>Aufstellung</ConfigLabel>
              <div className="flex gap-1.5">
                {([['parallel', 'Längs'], ['perpendicular', 'Quer'], ['angled', 'Schräg']] as const).map(([t, l]) => (
                  <ToggleChip key={t} active={sc.parking?.orientation === t} onClick={() => updatePartial({ [k]: { ...sc, parking: { ...sc.parking!, orientation: t } } })} label={l} />
                ))}
              </div>
            </InlineConfig>
          )}
        </div>
      )}

      {/* ========== SICHERHEIT & GRÜN ========== */}
      <ElementCategoryHeader label="Sicherheit & Grün" color="#22c55e" count={safeCount}
        icon={<svg {...ico}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
        expanded={expandedCat === 'safety'} onToggle={() => toggleCat('safety')} />
      {expandedCat === 'safety' && (
        <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
          <ElementItem active={hasEmergencyLane} label="Standstreifen" desc={hasEmergencyLane ? `${sc.emergencyLane?.width}px` : undefined} color="#eab308"
            icon={<svg {...ico}><path d="M12 9v4M12 17h.01" /><path d="M4 4l16 16" /></svg>}
            onToggle={() => hasEmergencyLane ? remove('emergencyLane') : handleAdd('emergencyLane', { width: 30 })} />
          {hasEmergencyLane && (
            <InlineConfig>
              <ConfigLabel>Breite</ConfigLabel>
              <div className="flex gap-1.5">
                {[{ v: 20, l: 'S' }, { v: 30, l: 'M' }, { v: 40, l: 'L' }].map(({ v, l }) => (
                  <ToggleChip key={v} active={sc.emergencyLane?.width === v} onClick={() => updatePartial({ [k]: { ...sc, emergencyLane: { width: v } } })} label={l} />
                ))}
              </div>
            </InlineConfig>
          )}
          <ElementItem active={hasGreenStrip} label="Grünstreifen" desc={hasGreenStrip ? `${sc.greenStrip?.width}px` : undefined} color="#22c55e"
            icon={<svg {...ico}><path d="M12 3v18M8 7l4-4 4 4" /></svg>}
            onToggle={() => hasGreenStrip ? remove('greenStrip') : handleAdd('greenStrip', { width: 15 })} />
          {hasGreenStrip && (
            <InlineConfig>
              <ConfigLabel>Breite</ConfigLabel>
              <div className="flex gap-1.5">
                {[{ v: 10, l: 'S' }, { v: 15, l: 'M' }, { v: 25, l: 'L' }].map(({ v, l }) => (
                  <ToggleChip key={v} active={sc.greenStrip?.width === v} onClick={() => updatePartial({ [k]: { ...sc, greenStrip: { width: v } } })} label={l} />
                ))}
              </div>
            </InlineConfig>
          )}
          <ElementItem active={hasBarrier} label="Leitplanke" color="#94a3b8"
            icon={<svg {...ico}><path d="M4 6h16M4 12h16M4 18h16" /></svg>}
            onToggle={() => hasBarrier ? remove('barrier') : handleAdd('barrier', true)} />
        </div>
      )}

      {/* ========== EIN-/AUSFAHRT (nur rechts) ========== */}
      {side === 'right' && (
        <>
          <ElementCategoryHeader label="Ein-/Ausfahrt" color="#f97316" count={rampCount}
            icon={<svg {...ico}><path d="M4 12h8l6 6M4 12l6-6" /></svg>}
            expanded={expandedCat === 'ramp'} onToggle={() => toggleCat('ramp')} />
          {expandedCat === 'ramp' && (
            <div className="px-3 pb-2" style={{ animation: 'fadeIn 0.1s ease-out' }}>
              <ElementItem active={hasRamp} label="Beschleunigungsstr." desc={hasRamp ? (sc.ramp?.type === 'deceleration' ? 'Verzögerung' : 'Beschleunigung') : undefined} color="#f97316"
                icon={<svg {...ico}><path d="M4 12h8l6 6M4 12l6-6" /></svg>}
                onToggle={() => hasRamp ? remove('ramp') : handleAdd('ramp', { type: 'acceleration', length: 200 })} />
              {hasRamp && (
                <InlineConfig>
                  <ConfigLabel>Typ</ConfigLabel>
                  <div className="flex gap-1.5">
                    <ToggleChip active={sc.ramp?.type === 'acceleration'} onClick={() => updatePartial({ [k]: { ...sc, ramp: { ...sc.ramp!, type: 'acceleration' } } })} label="Beschleunigung" />
                    <ToggleChip active={sc.ramp?.type === 'deceleration'} onClick={() => updatePartial({ [k]: { ...sc, ramp: { ...sc.ramp!, type: 'deceleration' } } })} label="Verzögerung" />
                  </div>
                  <ConfigLabel>Länge</ConfigLabel>
                  <div className="flex gap-1.5">
                    {[{ v: 80, l: 'Kurz' }, { v: 130, l: 'Mittel' }, { v: 200, l: 'Lang' }].map(({ v, l }) => (
                      <ToggleChip key={v} active={sc.ramp?.length === v} onClick={() => updatePartial({ [k]: { ...sc, ramp: { ...sc.ramp!, length: v } } })} label={l} />
                    ))}
                  </div>
                </InlineConfig>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

// CategoryHeader for element panel — matches MarkingsPanel CategoryHeader exactly
function ElementCategoryHeader({ label, color, count, icon, expanded, onToggle }: {
  label: string; color: string; count: number; icon: React.ReactNode; expanded: boolean; onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full px-4 py-2.5 flex items-center gap-3 transition-all duration-150"
      style={{
        background: expanded ? `color-mix(in srgb, ${color} 5%, transparent)` : 'transparent',
        borderBottom: expanded ? `1px solid var(--border)` : '1px solid transparent',
      }}
      onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = 'var(--hover)' }}
      onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = expanded ? `color-mix(in srgb, ${color} 5%, transparent)` : 'transparent' }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ 
        background: `${color}15`,
        color: color,
      }}>
        {icon}
      </div>
      <span className="text-[13px] font-medium flex-1 text-left" style={{ color: 'var(--text)' }}>
        {label}
      </span>
      {count > 0 && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ 
          background: `${color}15`, 
          color: color,
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

// Element item inside a category — toggle on/off with inline config below
function ElementItem({ active, label, desc, color, icon, onToggle }: {
  active: boolean; label: string; desc?: string; color: string; icon: React.ReactNode; onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full px-2 py-2.5 flex items-center gap-2.5 rounded-lg transition-all duration-150 mt-1"
      style={{
        background: active ? `color-mix(in srgb, ${color} 8%, transparent)` : 'var(--panel-elev)',
        border: `1px solid ${active ? color + '30' : 'var(--border)'}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = active ? `color-mix(in srgb, ${color} 12%, transparent)` : 'var(--hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = active ? `color-mix(in srgb, ${color} 8%, transparent)` : 'var(--panel-elev)' }}
    >
      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ color: active ? color : 'var(--text-muted)' }}>
        {icon}
      </div>
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{label}</span>
        {desc && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{desc}</span>}
      </div>
      {active ? (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
          <path d="M5 12l5 5L20 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  )
}

// ============================================================================
// RAMP PANEL (bei Klick auf bestehenden Ramp-Streifen)
// ============================================================================

function RampPanel({ config, updatePartial, onClose }: {
  config: SmartRoadConfig; updatePartial: (u: Partial<SmartRoadConfig>) => void; onClose: () => void
}) {
  const ramp = config.rightSide?.ramp
  if (!ramp) return null
  const sc = config.rightSide || {}
  
  return (
    <>
      <SectionDivider label="Typ" />
      <OptionButton selected={ramp.type === 'acceleration'} onClick={() => updatePartial({ rightSide: { ...sc, ramp: { ...ramp, type: 'acceleration' } } })}>
        <span>Beschleunigung</span><span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Auffahrt</span>
      </OptionButton>
      <OptionButton selected={ramp.type === 'deceleration'} onClick={() => updatePartial({ rightSide: { ...sc, ramp: { ...ramp, type: 'deceleration' } } })}>
        <span>Verzögerung</span><span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Abfahrt</span>
      </OptionButton>
      
      <SectionDivider label="Länge" />
      {[{ v: 80, l: 'Kurz' }, { v: 130, l: 'Mittel' }, { v: 200, l: 'Lang' }].map(({ v, l }) => (
        <OptionButton key={v} selected={ramp.length === v} onClick={() => updatePartial({ rightSide: { ...sc, ramp: { ...ramp, length: v } } })}>
          <span>{l}</span>
        </OptionButton>
      ))}
      
      <div className="px-4 py-3">
        <button onClick={() => { updatePartial({ rightSide: { ...sc, ramp: undefined } }); onClose() }}
          className="w-full py-2 rounded-lg text-[12px] font-medium transition-all flex items-center justify-center gap-1.5"
          style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          Entfernen
        </button>
      </div>
    </>
  )
}

// Inline config wrapper
function InlineConfig({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 space-y-2.5" style={{ 
      background: 'var(--panel-elev)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      animation: 'fadeIn 0.1s ease-out',
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      {children}
    </div>
  )
}

function ConfigLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{children}</div>
}

// ============================================================================
// Tram Chips
// ============================================================================

function TramChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all duration-150 text-center"
      style={{
        background: active ? 'rgba(245, 158, 11, 0.15)' : 'var(--panel-elev)',
        border: `1px solid ${active ? '#f59e0b' : 'var(--border)'}`,
        color: active ? '#f59e0b' : 'var(--text)',
        boxShadow: active ? '0 1px 4px rgba(245, 158, 11, 0.2)' : 'none',
      }}
    >{label}</button>
  )
}

function TramTypeChip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all duration-150"
      style={{
        background: active ? 'rgba(245, 158, 11, 0.15)' : 'var(--panel-elev)',
        border: `1px solid ${active ? '#f59e0b' : 'var(--border)'}`,
        color: active ? '#f59e0b' : 'var(--text)',
      }}
    >
      <div className="w-5 h-2.5 rounded" style={{ background: color }} />
      {label}
    </button>
  )
}