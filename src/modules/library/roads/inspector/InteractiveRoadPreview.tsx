// src/modules/library/roads/inspector/InteractiveRoadPreview.tsx
// Interaktive Live-Vorschau mit klickbaren Zonen - Hauptkomponente

import { useState, useRef, useEffect, useMemo } from 'react'
import type { SmartRoadConfig, RoadsideElementType } from '../types'
import { getActiveOrder, getMarkingX, getCrossMarkingBounds } from '../types'
import { ARROW_SVGS, ARROW_DEFS } from '../markings/arrowSvgs'
import { BLOCKED_AREA_DEFS } from '../markings/blockedAreaSvgs'
import { SYMBOL_DEFS } from '../markings/symbolSvgs'
// lucide-react icons removed — handles are now SVG-based

// Types & Constants
import type { HoveredZone, PopupPosition, ZoneType, ZoneSide } from './previewTypes'

// Hook
import { useRoadCalculations } from './hooks/useRoadCalculations'

// SVG Components
import { LeftSideElements } from './svg/LeftSideElements'
import { RightSideElements } from './svg/RightSideElements'
import { RoadSurface } from './svg/RoadSurface'
import { MedianAndLanes } from './svg/MedianAndLanes'
import { RampElement } from './svg/RampElement'

// Popups removed — ContextPanel in parent handles all options

type Props = {
  config: SmartRoadConfig
  updatePartial: (updates: Partial<SmartRoadConfig>) => void
  onZoneSelect?: (popup: PopupPosition) => void
}

export function InteractiveRoadPreview({ 
  config, 
  updatePartial,
  onZoneSelect,
}: Props) {
  const [hoveredZone, setHoveredZone] = useState<HoveredZone>(null)
  const [popup, setPopup] = useState<PopupPosition>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)
  
  // Dragging state für Markierungen
  const [draggingMarkingId, setDraggingMarkingId] = useState<string | null>(null)
  const [selectedMarkingId, setSelectedMarkingId] = useState<string | null>(null)
  const [dragMode, setDragMode] = useState<'move' | 'rotate' | 'scale' | null>(null)
  const dragOriginRef = useRef<{
    x: number; y: number
    startRotation: number
    startScaleX: number; startScaleY: number
    centerScreenX?: number; centerScreenY?: number
    startDistance?: number
    startHwScreen?: number; startHhScreen?: number
    scaleAxis?: 'both' | 'x' | 'y'
  } | null>(null)
  
  // Drag & Drop state für Seitenelemente
  const [draggedElement, setDraggedElement] = useState<RoadsideElementType | null>(null)
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  
  // Alle Berechnungen aus dem Hook
  const calc = useRoadCalculations(config)
  
  const markings = useMemo(() => config.markings || [], [config.markings])

  // Auto-select: Wenn ein neues Marking hinzugefügt wird, automatisch auswählen
  const prevMarkingsLenRef = useRef(markings.length)
  useEffect(() => {
    if (markings.length > prevMarkingsLenRef.current && markings.length > 0) {
      setSelectedMarkingId(markings[markings.length - 1].id)
    }
    prevMarkingsLenRef.current = markings.length
  }, [markings])

  // Konvertiert SVG-Koordinaten → Screen-Koordinaten für Drag-Operationen
  const svgToScreen = (svgX: number, svgY: number): { sx: number; sy: number } | null => {
    const rect = svgContainerRef.current?.getBoundingClientRect()
    if (!rect) return null
    const screenScaleX = rect.width / calc.totalWidth
    const screenScaleY = rect.height / config.length
    return { sx: rect.left + svgX * screenScaleX, sy: rect.top + svgY * screenScaleY }
  }

  // Start-Handler für Scale-Drag
  const startScaleDrag = (e: React.MouseEvent, markingId: string, centerSvgX: number, centerSvgY: number, hwSvg: number, hhSvg: number, axis: 'both' | 'x' | 'y') => {
    const m = markings.find(mk => mk.id === markingId)
    if (!m) return
    const center = svgToScreen(centerSvgX, centerSvgY)
    if (!center) return
    // Berechne initiale Distanz zum Zentrum
    const hwScreen = hwSvg * (svgContainerRef.current!.getBoundingClientRect().width / calc.totalWidth)
    const hhScreen = hhSvg * (svgContainerRef.current!.getBoundingClientRect().height / config.length)
    setDraggingMarkingId(markingId)
    setDragMode('scale')
    dragOriginRef.current = {
      x: e.clientX, y: e.clientY,
      startRotation: m.rotation || 0,
      startScaleX: m.scaleX ?? m.scale ?? 1,
      startScaleY: m.scaleY ?? m.scale ?? 1,
      centerScreenX: center.sx, centerScreenY: center.sy,
      startDistance: Math.sqrt((e.clientX - center.sx) ** 2 + (e.clientY - center.sy) ** 2) || 1,
      startHwScreen: hwScreen, startHhScreen: hhScreen,
      scaleAxis: axis,
    }
  }

  // Start-Handler für Rotate-Drag
  const startRotateDrag = (e: React.MouseEvent, markingId: string, centerSvgX: number, centerSvgY: number) => {
    const m = markings.find(mk => mk.id === markingId)
    if (!m) return
    const center = svgToScreen(centerSvgX, centerSvgY)
    if (!center) return
    setDraggingMarkingId(markingId)
    setDragMode('rotate')
    dragOriginRef.current = {
      x: e.clientX, y: e.clientY,
      startRotation: m.rotation || 0,
      startScaleX: m.scaleX ?? m.scale ?? 1,
      startScaleY: m.scaleY ?? m.scale ?? 1,
      centerScreenX: center.sx, centerScreenY: center.sy,
    }
  }

  // Keyboard-Handler: Delete löscht ausgewählte Markierung, Escape deselektiert
  useEffect(() => {
    if (!selectedMarkingId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        updatePartial({ markings: markings.filter(m => m.id !== selectedMarkingId) })
        setSelectedMarkingId(null)
      } else if (e.key === 'Escape') {
        setSelectedMarkingId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedMarkingId, markings, updatePartial])
  
  // ========== DRAG & DROP FÜR SEITENELEMENTE ==========
  // Threshold-basiert: Klick öffnet Context, Drag startet erst nach Bewegung
  const dragStartRef = useRef<{ el: RoadsideElementType, side: 'left' | 'right', x: number, y: number } | null>(null)
  const DRAG_THRESHOLD = 5 // px Bewegung bevor Drag startet
  
  const handleDragMouseDown = (el: RoadsideElementType, side: 'left' | 'right', e: React.MouseEvent) => {
    if (e.button !== 0) return
    // Nur Drag-Intent speichern, noch kein Drag starten
    dragStartRef.current = { el, side, x: e.clientX, y: e.clientY }
  }
  
  const handleDragMouseMove = (e: React.MouseEvent) => {
    // Prüfe ob Drag-Intent existiert und Threshold überschritten
    if (dragStartRef.current && !draggedElement) {
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
        setDraggedElement(dragStartRef.current.el)
        setDragSide(dragStartRef.current.side)
        setDropTargetIndex(null)
      }
    }
  }
  
  const handleDragOver = (index: number) => {
    if (draggedElement) setDropTargetIndex(index)
  }
  
  const handleDrop = () => {
    dragStartRef.current = null
    
    if (!draggedElement || !dragSide || dropTargetIndex === null) {
      setDraggedElement(null)
      setDragSide(null)
      setDropTargetIndex(null)
      return
    }
    
    const k = dragSide === 'left' ? 'leftSide' : 'rightSide' as const
    const sc = config[k] || {}
    const currentOrder = getActiveOrder(sc)
    
    const fromIndex = currentOrder.indexOf(draggedElement)
    if (fromIndex === -1 || fromIndex === dropTargetIndex) {
      setDraggedElement(null)
      setDragSide(null)
      setDropTargetIndex(null)
      return
    }
    
    const newOrder = [...currentOrder]
    newOrder.splice(fromIndex, 1)
    const insertAt = dropTargetIndex > fromIndex ? dropTargetIndex - 1 : dropTargetIndex
    newOrder.splice(insertAt, 0, draggedElement)
    
    updatePartial({ [k]: { ...sc, order: newOrder } })
    
    setDraggedElement(null)
    setDragSide(null)
    setDropTargetIndex(null)
  }
  
  const handleDragMouseUp = (e: React.MouseEvent, zone: ZoneType, side: ZoneSide) => {
    if (draggedElement) {
      // War ein Drag — Drop ausführen
      handleDrop()
    } else if (dragStartRef.current) {
      // War ein Klick (kein Drag) — Context öffnen
      dragStartRef.current = null
      handleZoneClick(e, zone, undefined, side)
    }
  }
  
  // Global mouseup — nur aktiven Drag abbrechen
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggedElement && dragSide) {
        // Inline Drop-Logik (vermeidet handleDrop dependency)
        if (dropTargetIndex !== null) {
          const k = dragSide === 'left' ? 'leftSide' : 'rightSide' as const
          const sc = config[k] || {}
          const currentOrder = getActiveOrder(sc)
          const fromIndex = currentOrder.indexOf(draggedElement)
          if (fromIndex !== -1 && fromIndex !== dropTargetIndex) {
            const newOrder = [...currentOrder]
            newOrder.splice(fromIndex, 1)
            const insertAt = dropTargetIndex > fromIndex ? dropTargetIndex - 1 : dropTargetIndex
            newOrder.splice(insertAt, 0, draggedElement)
            updatePartial({ [k]: { ...sc, order: newOrder } })
          }
        }
        setDraggedElement(null)
        setDragSide(null)
        setDropTargetIndex(null)
      }
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [draggedElement, dragSide, dropTargetIndex, config, updatePartial])
  
  // Handle Zone Click
  const handleZoneClick = (
    e: React.MouseEvent,
    zone: ZoneType,
    index?: number,
    side?: ZoneSide
  ) => {
    e.stopPropagation()
    // Markierung deselektieren wenn Zone angeklickt wird
    setSelectedMarkingId(null)
    const popupData: PopupPosition = {
      x: 0,
      y: 0,
      zone,
      side,
      index,
    }
    
    if (onZoneSelect) {
      onZoneSelect(popupData)
    } else {
      setPopup(popupData)
    }
  }

  // Handle Container Click (close popup/panel + deselect marking)
  const handleContainerClick = () => {
    setPopup(null)
    onZoneSelect?.(null)
    setSelectedMarkingId(null)
  }
  
  // Close popup on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopup(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ========== CHANGE HANDLERS ==========
  
  // ========== RENDER ==========
  
  // Berechne Spurbreite und ob Spuren hinzugefügt/entfernt werden können
  const totalLanes = config.lanes
  const maxLanes = 8
  const minLanes = 1
  const canAddLane = totalLanes < maxLanes
  const canRemoveLane = totalLanes > minLanes
  
  // Spurbreite aus calc (berücksichtigt physische Trenner)
  const actualLaneWidth = calc.laneWidth > 0 ? Math.round(calc.laneWidth) : 40
  
  // Helper: Breite bei Spuränderung berechnen
  const widthForLanes = (newTotal: number) => {
    const newWidth = newTotal * actualLaneWidth + calc.totalPhysicalWidth
    return Math.max(80, newWidth)
  }
  
  // Button-Style Helpers
  const addBtnClass = "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
  const addBtnStyle: React.CSSProperties = { background: 'var(--primary)', color: 'white', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }
  const removeBtnClass = "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
  const removeBtnStyle: React.CSSProperties = { background: 'var(--panel)', color: 'var(--text-muted)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }
  
  const plusIcon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
  const minusIcon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
  
  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center gap-3"
    >
      {/* Oben: + Spur Button */}
      <button
        onClick={() => canAddLane && updatePartial({ lanes: totalLanes + 1, width: widthForLanes(totalLanes + 1) })}
        disabled={!canAddLane}
        className={addBtnClass}
        style={addBtnStyle}
        title="Spur hinzufügen"
      >
        {plusIcon}
        <span>Spur</span>
      </button>

      {/* Mittlerer Bereich: SVG */}
      <div className="flex items-center gap-4">

        {/* SVG Preview */}
        <div className="relative" ref={svgContainerRef}>
          <svg
            width={calc.displayWidth}
            height={calc.displayHeight}
            viewBox={`0 0 ${calc.totalWidth} ${config.length}`}
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
            onClick={handleContainerClick}
          >
        {/* Hintergrund/Bankett (hellgrau wie im Canvas) */}
        <rect
          x={0}
          y={0}
          width={calc.totalWidth}
          height={config.length}
          fill="#e5e7eb"
        />
        
        {/* Linke Seitenbereiche */}
        <LeftSideElements
          config={config}
          leftSideWidth={calc.leftSideWidth}
          elements={calc.leftElements}
          hoveredZone={hoveredZone}
          draggedElement={dragSide === 'left' ? draggedElement : null}
          dropTargetIndex={dragSide === 'left' ? dropTargetIndex : null}
          onHover={setHoveredZone}
          onDoubleClick={handleZoneClick}
          onDragMouseDown={handleDragMouseDown}
          onDragMouseMove={handleDragMouseMove}
          onDragMouseUp={handleDragMouseUp}
          onDragOver={handleDragOver}
        />
        
        {/* Fahrbahn */}
        <RoadSurface
          config={config}
          leftSideWidth={calc.leftSideWidth}
        />
        {/* Klickbare Fahrbahn-Zonen (links und rechts der Mitte, damit Median/Tram-Klicks nicht blockiert werden) */}
        {(() => {
          const roadX = calc.leftSideWidth
          const roadW = config.width
          const centerGap = 30 // Freiraum in der Mitte für Median/Tram-Klick
          const leftHalfW = roadW / 2 - centerGap / 2
          const rightHalfX = roadX + roadW / 2 + centerGap / 2
          const rightHalfW = roadW / 2 - centerGap / 2
          const isHovered = hoveredZone?.type === 'surface'
          const hoverFill = isHovered ? 'rgba(249, 115, 22, 0.15)' : 'transparent'
          
          return leftHalfW > 0 ? (
            <>
              <rect
                x={roadX} y={0} width={leftHalfW} height={config.length}
                fill={hoverFill}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredZone({ type: 'surface' })}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={(e) => handleZoneClick(e, 'surface')}
              />
              <rect
                x={rightHalfX} y={0} width={rightHalfW} height={config.length}
                fill={hoverFill}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredZone({ type: 'surface' })}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={(e) => handleZoneClick(e, 'surface')}
              />
            </>
          ) : null
        })()}
        
        {/* Beschleunigungsstreifen (direkt neben Fahrbahn, vor anderen Seitenelementen) */}
        {config.rightSide?.ramp && (
          <RampElement
            config={config}
            leftSideWidth={calc.leftSideWidth}
            hoveredZone={hoveredZone}
            onHover={setHoveredZone}
            onClick={handleZoneClick}
          />
        )}
        
        {/* Rechte Seitenbereiche (nach Beschleunigungsstreifen) */}
        <RightSideElements
          config={config}
          leftSideWidth={calc.leftSideWidth}
          elements={calc.rightElements}
          rightRampWidth={config.rightSide?.ramp ? 30 : 0}
          hoveredZone={hoveredZone}
          draggedElement={dragSide === 'right' ? draggedElement : null}
          dropTargetIndex={dragSide === 'right' ? dropTargetIndex : null}
          onHover={setHoveredZone}
          onDoubleClick={handleZoneClick}
          onDragMouseDown={handleDragMouseDown}
          onDragMouseMove={handleDragMouseMove}
          onDragMouseUp={handleDragMouseUp}
          onDragOver={handleDragOver}
        />
        
        {/* Straßenbahn-Gleise (vor Median, damit Mittellinien darüber liegen) */}
        {config.tram && config.category === 'strasse' && (() => {
          const tram = config.tram!
          const tramWidth = tram.width || (tram.tracks === 1 ? 20 : 36)
          const roadStart = calc.leftSideWidth
          const tramX = tram.position === 'left' 
            ? roadStart + 4
            : tram.position === 'right'
              ? roadStart + config.width - tramWidth - 4
              : roadStart + (config.width - tramWidth) / 2
          const gaugeWidth = 10
          const gap = 4
          const isHovered = hoveredZone?.type === 'tram'
          
          const renderRailPair = (centerX: number, key: string) => {
            const tieWidth = gaugeWidth + 6
            const showTies = tram.trackType === 'embedded'
            return (
              <g key={key}>
                {showTies && Array.from({ length: Math.floor(config.length / 20) }, (_, i) => {
                  const y = 10 + i * 20
                  return <rect key={`${key}-tie-${y}`} x={centerX - tieWidth / 2} y={y - 1.5} width={tieWidth} height={3} fill="#8b7355" opacity={0.6} />
                })}
                <line x1={centerX - gaugeWidth / 2} y1={0} x2={centerX - gaugeWidth / 2} y2={config.length} stroke="#c0c0c0" strokeWidth={2} />
                <line x1={centerX + gaugeWidth / 2} y1={0} x2={centerX + gaugeWidth / 2} y2={config.length} stroke="#c0c0c0" strokeWidth={2} />
              </g>
            )
          }
          
          return (
            <g className="tram-tracks">
              {/* Gleisbett */}
              <rect
                x={tramX} y={0} width={tramWidth} height={config.length}
                fill={tram.trackType === 'grass' ? '#6a8f4e' : tram.trackType === 'dedicated' ? '#888888' : '#5a5a5a'}
              />
              {/* Bordsteine bei dedicated/grass */}
              {(tram.trackType === 'dedicated' || tram.trackType === 'grass') && (
                <>
                  <line x1={tramX} y1={0} x2={tramX} y2={config.length} stroke="#999" strokeWidth={2} />
                  <line x1={tramX + tramWidth} y1={0} x2={tramX + tramWidth} y2={config.length} stroke="#999" strokeWidth={2} />
                </>
              )}
              {/* Schienen */}
              {tram.tracks === 1 
                ? renderRailPair(tramX + tramWidth / 2, 'track-0')
                : (
                  <>
                    {renderRailPair(tramX + tramWidth / 2 - gap / 2 - gaugeWidth / 2, 'track-0')}
                    {renderRailPair(tramX + tramWidth / 2 + gap / 2 + gaugeWidth / 2, 'track-1')}
                  </>
                )
              }
              {/* Klickbare Hover-Zone */}
              <rect
                x={tramX - 2} y={0} width={tramWidth + 4} height={config.length}
                fill={isHovered ? 'rgba(245, 158, 11, 0.25)' : 'transparent'}
                stroke={isHovered ? '#f59e0b' : 'transparent'}
                strokeWidth={isHovered ? 2 : 0}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredZone({ type: 'tram' })}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={(e) => handleZoneClick(e, 'tram')}
              />
            </g>
          )
        })()}

        {/* Median und Spurlinien (nach Tram, damit Linien darüber liegen) */}
        <MedianAndLanes
          config={config}
          leftSideWidth={calc.leftSideWidth}
          lines={calc.lines}
          showLaneLines={calc.showLaneLines}
          hoveredZone={hoveredZone}
          onHover={setHoveredZone}
          onClick={handleZoneClick}
        />
        
        
        {/* Fahrbahnmarkierungen */}
        {markings.map((marking) => {
          const yPosition = (marking.positionPercent / 100) * config.length
          const isDragging = draggingMarkingId === marking.id
          const laneWidth = config.width / config.lanes
          
          // ===== PFEILE =====
          if (marking.type === 'arrow') {
            const def = ARROW_DEFS[marking.arrowType]
            if (!def) return null

            const scaleByWidth = (laneWidth * 0.6) / def.width
            const scaleByHeight = (config.length * 0.15) / def.height
            const baseScale = Math.min(scaleByWidth, scaleByHeight)

            const laneCenter = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1

            const totalScaleX = baseScale * sx
            const totalScaleY = baseScale * sy
            const scaledCenterX = (def.width / 2) * totalScaleX
            const scaledCenterY = (def.height / 2) * totalScaleY
            const renderedW = def.width * baseScale * sx
            const renderedH = def.height * baseScale * sy

            return (
              <g
                key={marking.id}
                transform={`translate(${laneCenter}, ${yPosition})`}
                style={{
                  cursor: isDragging ? 'grabbing' : 'pointer',
                  filter: isDragging
                    ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                }}
              >
                <g transform={`rotate(${rotation})`}>
                  <g transform={`translate(${-scaledCenterX}, ${-scaledCenterY}) scale(${totalScaleX}, ${totalScaleY})`}>
                    <g dangerouslySetInnerHTML={{ __html: marking.color ? ARROW_SVGS[marking.arrowType].replace(/fill="#ffffff"/g, `fill="${marking.color}"`).replace(/fill="#FFFFFF"/g, `fill="${marking.color}"`) : ARROW_SVGS[marking.arrowType] }} />
                  </g>
                </g>
                {/* Hitbox */}
                <rect
                  x={-renderedW / 2 - 10}
                  y={-renderedH / 2 - 10}
                  width={renderedW + 20}
                  height={renderedH + 20}
                  fill="transparent"
                  style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); e.preventDefault()
                    setSelectedMarkingId(marking.id)
                    setDraggingMarkingId(marking.id)
                    setDragMode('move')
                    dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                  }}
                />
              </g>
            )
          }
          
          // ===== FAHRSTREIFENBEGRENZUNG (eine Leitlinie, ~15px) =====
          if (marking.type === 'laneLine') {
            const xPos = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1
            const lt = marking.lineType
            const isFullLength = !!marking.fullLength
            const lineH = isFullLength ? config.length * sy : 15 * sy
            const gap = 3 * sx
            const halfH = lineH / 2
            const da = isFullLength ? `${24 * sy} ${48 * sy}` : `${3 * sy} ${3 * sy}`
            // Dash-Offset für fullLength: Striche mittig ausrichten (wie LaneModule)
            const dOff = isFullLength ? (() => {
              const dashCycle = 72 * sy
              const roadCenter = lineH / 2
              const idealStart = roadCenter - 12 * sy
              const cycleNum = Math.floor(idealStart / dashCycle)
              return cycleNum * dashCycle - idealStart
            })() : undefined

            const lineColor = marking.color || '#ffffff'
            const lineContent = (() => {
              if (lt === 'solid') {
                return <line x1={0} y1={-halfH} x2={0} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} />
              } else if (lt === 'double-solid') {
                return (
                  <>
                    <line x1={-gap/2} y1={-halfH} x2={-gap/2} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} />
                    <line x1={gap/2} y1={-halfH} x2={gap/2} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} />
                  </>
                )
              } else if (lt === 'solid-dashed') {
                return (
                  <>
                    <line x1={-gap/2} y1={-halfH} x2={-gap/2} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} />
                    <line x1={gap/2} y1={-halfH} x2={gap/2} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} strokeDasharray={da} strokeDashoffset={dOff} />
                  </>
                )
              } else {
                return (
                  <>
                    <line x1={-gap/2} y1={-halfH} x2={-gap/2} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} strokeDasharray={da} strokeDashoffset={dOff} />
                    <line x1={gap/2} y1={-halfH} x2={gap/2} y2={halfH} stroke={lineColor} strokeWidth={2 * sx} />
                  </>
                )
              }
            })()

            const hitW = 12 * sx

            return (
              <g key={marking.id} transform={`translate(${xPos}, ${yPosition})`}
                style={{
                  cursor: isDragging ? 'grabbing' : 'pointer',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                }}
              >
                <g transform={rotation ? `rotate(${rotation})` : undefined}>
                  {lineContent}
                </g>
                <rect x={-hitW/2 - 5} y={-halfH - 5} width={hitW + 10} height={lineH + 10}
                  fill="transparent" style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); e.preventDefault()
                    setSelectedMarkingId(marking.id)
                    setDraggingMarkingId(marking.id)
                    setDragMode('move')
                    dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                  }}
                />
              </g>
            )
          }

          // ===== ZEBRASTREIFEN =====
          if (marking.type === 'zebra') {
            const x1 = calc.leftSideWidth
            const x2 = calc.leftSideWidth + config.width
            const lineWidth = x2 - x1
            const centerX = (x1 + x2) / 2
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1
            const zebraWidth = (marking.width || 40) * sy
            const stripeW = 5 * sx
            const gapW = 5 * sx
            const totalWidth = x2 - x1
            // Edge-to-edge: first stripe at x1, last stripe ends at x2
            const N = Math.max(1, Math.round((totalWidth + gapW) / (stripeW + gapW)))
            const actualGap = N > 1 ? (totalWidth - N * stripeW) / (N - 1) : 0
            const stripes: React.ReactElement[] = []
            for (let idx = 0; idx < N; idx++) {
              const cx = x1 + idx * (stripeW + actualGap)
              stripes.push(<rect key={idx} x={cx} y={yPosition - zebraWidth / 2} width={stripeW} height={zebraWidth} fill={marking.color || '#ffffff'} />)
            }
            const rotation = marking.rotation || 0
            return (
              <g key={marking.id}>
                <g transform={rotation ? `rotate(${rotation}, ${centerX}, ${yPosition})` : undefined}>
                  {stripes}
                  <rect x={x1 - 5} y={yPosition - zebraWidth / 2 - 5} width={lineWidth + 10} height={zebraWidth + 10}
                    fill="transparent" style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      setSelectedMarkingId(marking.id)
                      setDraggingMarkingId(marking.id)
                      setDragMode('move')
                      dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                    }}
                  />
                </g>
              </g>
            )
          }

          // ===== HALTELINIE / WARTELINIE / HAIFISCHZÄHNE =====
          if (marking.type === 'stopLine' || marking.type === 'waitLine' || marking.type === 'sharkTeeth') {
            const { x1, x2, centerX, lineWidth } = getCrossMarkingBounds(marking, config.width, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1
            const thickness = marking.type === 'stopLine' ? 3 : 2

            const crossColor = marking.color || '#ffffff'
            const lineContent = (() => {
              if (marking.type === 'stopLine') {
                return <rect x={x1} y={yPosition - thickness * sy / 2} width={lineWidth} height={thickness * sy} fill={crossColor} />
              } else if (marking.type === 'waitLine') {
                const dashLen = 4
                const gapLen = 4
                const segments: React.ReactElement[] = []
                let cx = x1
                let i = 0
                while (cx < x2) {
                  const w = Math.min(dashLen, x2 - cx)
                  segments.push(<rect key={i} x={cx} y={yPosition - thickness * sy / 2} width={w} height={thickness * sy} fill={crossColor} />)
                  cx += dashLen + gapLen
                  i++
                }
                return <>{segments}</>
              } else {
                const toothW = 6 * sx
                const toothH = 8 * sy
                const gap = 2 * sx
                const dir = marking.direction === 'outward' ? -1 : 1
                const triangles: React.ReactElement[] = []
                let cx = x1
                let i = 0
                while (cx + toothW <= x2 + 0.1) {
                  const ty = dir > 0 ? yPosition - toothH / 2 : yPosition + toothH / 2
                  const by = dir > 0 ? yPosition + toothH / 2 : yPosition - toothH / 2
                  triangles.push(
                    <polygon key={i} points={`${cx},${by} ${cx + toothW / 2},${ty} ${cx + toothW},${by}`} fill={crossColor} />
                  )
                  cx += toothW + gap
                  i++
                }
                return <>{triangles}</>
              }
            })()
            

            return (
              <g key={marking.id}>
                <g transform={rotation ? `rotate(${rotation}, ${centerX}, ${yPosition})` : undefined}>
                  <g style={{
                  }}>
                    {lineContent}
                  </g>
                  <rect x={x1 - 5} y={yPosition - 12} width={lineWidth + 10} height={24}
                    fill="transparent" style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      setSelectedMarkingId(marking.id)
                      setDraggingMarkingId(marking.id)
                      setDragMode('move')
                      dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: rotation, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                    }}
                  />
                </g>
              </g>
            )
          }

          // ===== SPERRFLÄCHEN — echte Formdarstellung via flatPaths =====
          if (marking.type === 'blockedArea') {
            const def = BLOCKED_AREA_DEFS[marking.areaType]
            if (!def || !def.flatPaths || def.flatPaths.length === 0) return null
            
            const { centerX } = getCrossMarkingBounds(marking, config.width, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1
            const hPct = marking.heightPercent ?? 15
            const bWidthPct = marking.widthPercent ?? 30

            // Zielgröße mit unabhängiger Skalierung
            const targetW = (bWidthPct / 100) * config.width * sx
            const targetH = (hPct / 100) * config.length * sy

            // Skalierung basiert auf contentBox
            const cb = def.contentBox
            const bScaleX = targetW / cb.w
            const bScaleY = targetH / cb.h

            const scaledW = cb.w * bScaleX
            const scaledH = cb.h * bScaleY
            const contentCX = (cb.x + cb.w / 2) * bScaleX
            const contentCY = (cb.y + cb.h / 2) * bScaleY


            return (
              <g key={marking.id}>
                <g transform={rotation ? `rotate(${rotation}, ${centerX}, ${yPosition})` : undefined}>
                  {/* Eigentliche Form — Content-Zentrum auf (centerX, yPosition) */}
                  <g
                    transform={`translate(${centerX - contentCX}, ${yPosition - contentCY}) scale(${bScaleX}, ${bScaleY})`}
                    style={{}}
                  >
                    {def.flatPaths.map((fp, i) => (
                      <path
                        key={i}
                        d={fp.d}
                        fill={fp.fill}
                        stroke={fp.stroke}
                        strokeWidth={fp.strokeWidth}
                        strokeLinecap={fp.strokeLinecap as 'butt' | 'round' | 'square' | undefined}
                        strokeLinejoin={fp.strokeLinejoin as 'miter' | 'round' | 'bevel' | undefined}
                      />
                    ))}
                  </g>
                  {/* Hitbox */}
                  <rect x={centerX - scaledW / 2 - 5} y={yPosition - scaledH / 2 - 5} width={scaledW + 10} height={scaledH + 10}
                    fill="transparent" style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      setSelectedMarkingId(marking.id)
                      setDraggingMarkingId(marking.id)
                      setDragMode('move')
                      dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: rotation, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                    }}
                  />
                </g>
              </g>
            )
          }
          
          // ===== GESCHWINDIGKEITSZAHLEN =====
          if (marking.type === 'speedNumber') {
            const laneCenter = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1
            const fontSize = laneWidth * 0.55
            const textW = (marking.value >= 100 ? fontSize * 1.8 : fontSize * 1.2) * sx
            const textH = fontSize * 1.1 * sy

            return (
              <g key={marking.id}>
                <g transform={`translate(${laneCenter}, ${yPosition})`}>
                  <g transform={`rotate(${rotation})`}>
                    <text
                      x={0} y={fontSize * 0.35 * sy}
                      textAnchor="middle"
                      fill={marking.color || '#ffffff'}
                      fontFamily="Arial, sans-serif"
                      fontWeight="bold"
                      fontSize={fontSize}
                      transform={`scale(${sx}, ${sy})`}
                      style={{
                        cursor: isDragging ? 'grabbing' : 'pointer',
                        filter: isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      }}
                    >{marking.value}</text>
                  </g>
                  {/* Hitbox */}
                  <rect x={-textW / 2} y={-textH / 2} width={textW} height={textH}
                    fill="transparent" style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      setSelectedMarkingId(marking.id)
                      setDraggingMarkingId(marking.id)
                      setDragMode('move')
                      dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: rotation, startScaleX: sx, startScaleY: sy }
                    }}
                  />
                </g>
              </g>
            )
          }

          // ===== TEXTMARKIERUNGEN =====
          if (marking.type === 'textMarking') {
            const laneCenter = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1
            const fontSize = laneWidth * 0.4

            if (marking.orientation === 'vertical') {
              const chars = marking.text.split('')
              const charH = fontSize * 1.3
              const totalH = chars.length * charH * sy
              const totalW = fontSize * 0.8 * sx

              return (
                <g key={marking.id}>
                  <g transform={`translate(${laneCenter}, ${yPosition})`}>
                    <g transform={`rotate(${rotation})`}>
                      {chars.map((c, i) => (
                        <text key={i}
                          x={0} y={(-totalH / 2 + charH * 0.8 + i * charH) / (sy || 1)}
                          textAnchor="middle" fill={marking.color || '#ffffff'}
                          fontFamily="Arial, sans-serif" fontWeight="bold" fontSize={fontSize}
                          transform={`scale(${sx}, ${sy})`}
                          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                        >{c}</text>
                      ))}
                    </g>
                    <rect x={-totalW / 2} y={-totalH / 2} width={totalW} height={totalH}
                      fill="transparent" style={{ cursor: 'pointer' }}
                      onMouseDown={(e) => {
                        e.stopPropagation(); e.preventDefault()
                        setSelectedMarkingId(marking.id)
                        setDraggingMarkingId(marking.id)
                        setDragMode('move')
                        dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: rotation, startScaleX: sx, startScaleY: sy }
                      }}
                    />
                  </g>
                </g>
              )
            }

            // horizontal
            const textW = marking.text.length * fontSize * 0.65 * sx
            const textH = fontSize * 1.1 * sy
            return (
              <g key={marking.id}>
                <g transform={`translate(${laneCenter}, ${yPosition})`}>
                  <g transform={`rotate(${rotation})`}>
                    <text
                      x={0} y={fontSize * 0.35 * sy}
                      textAnchor="middle" fill={marking.color || '#ffffff'}
                      fontFamily="Arial, sans-serif" fontWeight="bold" fontSize={fontSize}
                      transform={`scale(${sx}, ${sy})`}
                      style={{
                        cursor: isDragging ? 'grabbing' : 'pointer',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      }}
                    >{marking.text}</text>
                  </g>
                  <rect x={-textW / 2} y={-textH / 2} width={textW} height={textH}
                    fill="transparent" style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      setSelectedMarkingId(marking.id)
                      setDraggingMarkingId(marking.id)
                      setDragMode('move')
                      dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: rotation, startScaleX: sx, startScaleY: sy }
                    }}
                  />
                </g>
              </g>
            )
          }

          // ===== SYMBOLMARKIERUNGEN =====
          if (marking.type === 'symbolMarking') {
            const def = SYMBOL_DEFS[marking.symbolType]
            if (!def) return null

            const laneCenter = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
            const rotation = marking.rotation || 0
            const sx = marking.scaleX ?? marking.scale ?? 1
            const sy = marking.scaleY ?? marking.scale ?? 1

            const targetH = laneWidth * 0.8
            const baseScale = targetH / def.height
            const scaleX = baseScale * sx
            const scaleY = baseScale * sy
            const scaledW = def.width * scaleX
            const scaledH = def.height * scaleY

            return (
              <g key={marking.id}>
                <g transform={`translate(${laneCenter}, ${yPosition})`}>
                  <g transform={`rotate(${rotation})`}>
                    {(def.svgBody.includes('<text') || def.svgBody.includes('<circle')) ? (
                      <g transform={`translate(${-scaledW / 2}, ${-scaledH / 2}) scale(${scaleX}, ${scaleY})`}
                        style={{
                          cursor: isDragging ? 'grabbing' : 'pointer',
                          filter: isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                        }}
                        dangerouslySetInnerHTML={{ __html: marking.color ? def.svgBody.replace(/fill="#fff(?:fff)?"/g, `fill="${marking.color}"`).replace(/fill="white"/g, `fill="${marking.color}"`) : def.svgBody }}
                      />
                    ) : (
                      <g transform={`translate(${-scaledW / 2}, ${-scaledH / 2}) scale(${scaleX}, ${scaleY})`}
                        style={{
                          cursor: isDragging ? 'grabbing' : 'pointer',
                          filter: isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                        }}
                      >
                        {def.paths.map((p, i) => (
                          <path key={i} d={p.d} fill={marking.color && p.fill !== 'none' ? marking.color : p.fill} />
                        ))}
                      </g>
                    )}
                  </g>
                  <rect x={-scaledW / 2} y={-scaledH / 2} width={scaledW} height={scaledH}
                    fill="transparent" style={{ cursor: 'pointer' }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      setSelectedMarkingId(marking.id)
                      setDraggingMarkingId(marking.id)
                      setDragMode('move')
                      dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: rotation, startScaleX: sx, startScaleY: sy }
                    }}
                  />
                </g>
              </g>
            )
          }

          return null
        })}
          </svg>
          
          {/* Interaktives Markierungs-Overlay - für Drag, Doppelklick, Scroll */}
          <div
            className="absolute inset-0"
            style={{
              cursor: draggingMarkingId ? (dragMode === 'rotate' ? 'grabbing' : dragMode === 'scale' ? 'nwse-resize' : 'grabbing') : 'default',
              pointerEvents: (draggingMarkingId || selectedMarkingId) ? 'auto' : 'none',
            }}
            onMouseDown={(e) => {
              // Klick auf leere Fläche → Deselect
              const rect = svgContainerRef.current?.getBoundingClientRect()
              if (!rect) return
              
              const clickX = e.clientX - rect.left
              const clickY = e.clientY - rect.top
              
              const scaleX = calc.totalWidth / calc.displayWidth
              const scaleY = config.length / calc.displayHeight
              
              const configX = clickX * scaleX
              const configY = clickY * scaleY
              
              const laneWidth = config.width / (config.lanes)
              const arrowWidth = laneWidth * 0.6
              const arrowHeight = arrowWidth * 1.2
              
              for (const marking of markings) {
                const yPos = (marking.positionPercent / 100) * config.length
                
                // Quermarkierungen (zebra, stopLine, waitLine) — ganze Fahrbahnbreite
                if (marking.type === 'zebra' || marking.type === 'stopLine' || marking.type === 'waitLine') {
                  const roadLeft = calc.leftSideWidth
                  const roadRight = calc.leftSideWidth + config.width
                  const hitH = marking.type === 'zebra' ? ((marking.width || 40) * (marking.scaleY ?? marking.scale ?? 1)) / 2 + 5 : 12
                  if (configX >= roadLeft - 5 && configX <= roadRight + 5 && configY >= yPos - hitH && configY <= yPos + hitH) {
                    setSelectedMarkingId(marking.id)
                    setDraggingMarkingId(marking.id)
                    setDragMode('move')
                    dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: 0, startScaleX: 1, startScaleY: 1 }
                    e.preventDefault(); e.stopPropagation()
                    return
                  }
                  continue
                }
                
                // Pfeile + SpeedNumber — Spur-basiert
                if (marking.type !== 'arrow' && marking.type !== 'speedNumber' && marking.type !== 'laneLine' && marking.type !== 'textMarking' && marking.type !== 'symbolMarking') continue
                const ms = marking.scale || 1
                const laneCenter = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
                
                const hw = arrowWidth * ms / 2 + 15
                const hh = arrowHeight * ms / 2 + 15
                
                if (configX >= laneCenter - hw && configX <= laneCenter + hw && configY >= yPos - hh && configY <= yPos + hh) {
                  setSelectedMarkingId(marking.id)
                  setDraggingMarkingId(marking.id)
                  setDragMode('move')
                  dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                  e.preventDefault(); e.stopPropagation()
                  return
                }
              }
              // Nichts getroffen → deselect
              setSelectedMarkingId(null)
            }}
            onMouseMove={(e) => {
              if (!draggingMarkingId || !dragMode) return
              
              const rect = svgContainerRef.current?.getBoundingClientRect()
              if (!rect) return
              
              if (dragMode === 'move') {
                const clickX = e.clientX - rect.left
                const clickY = e.clientY - rect.top
                
                const scaleX = calc.totalWidth / calc.displayWidth
                const scaleY = config.length / calc.displayHeight
                
                const configX = clickX * scaleX
                const configY = clickY * scaleY
                
                const roadX = configX - calc.leftSideWidth
                const positionPercent = Math.max(5, Math.min(95, (configY / config.length) * 100))
                
                // Shift gedrückt → freie Platzierung (xPercent), sonst Snap-to-Lane
                const isFreeMode = e.shiftKey
                
                const newMarkings = markings.map(m => {
                  if (m.id !== draggingMarkingId) return m
                  
                  const xPct = Math.max(0, Math.min(100, (roadX / config.width) * 100))
                  
                  // Einheitliches Snapping für ALLE Markierungstypen:
                  // Normal = Snap auf nächste Spurmitte, Shift = frei
                  if (isFreeMode) {
                    return { ...m, positionPercent, xPercent: xPct }
                  } else {
                    const lanes = config.lanes
                    const halfLane = 50 / lanes
                    const snappedX = Math.round(xPct / halfLane) * halfLane
                    const clampedX = Math.max(0, Math.min(100, snappedX))
                    return { ...m, positionPercent, xPercent: clampedX }
                  }
                })
                updatePartial({ markings: newMarkings })
                
              } else if (dragMode === 'rotate' && dragOriginRef.current) {
                const { centerScreenX, centerScreenY } = dragOriginRef.current
                if (centerScreenX == null || centerScreenY == null) return

                // Winkel von Zentrum zum Mauszeiger
                const dx = e.clientX - centerScreenX
                const dy = e.clientY - centerScreenY
                const angle = Math.atan2(dx, -dy) * (180 / Math.PI)

                let newRotation = Math.round(angle / 5) * 5 // 5°-Snapping
                if (newRotation < 0) newRotation += 360

                const newMarkings = markings.map(m =>
                  m.id === draggingMarkingId ? { ...m, rotation: newRotation } : m
                )
                updatePartial({ markings: newMarkings })
                
              } else if (dragMode === 'scale' && dragOriginRef.current) {
                const { centerScreenX, centerScreenY, startDistance, startScaleX, startScaleY, scaleAxis } = dragOriginRef.current
                if (centerScreenX != null && centerScreenY != null && startDistance) {
                  const clamp = (v: number) => Math.max(0.1, Math.round(v * 100) / 100)

                  if (scaleAxis === 'both') {
                    // Proportional — Distanz-Ratio vom Zentrum
                    const currentDist = Math.sqrt((e.clientX - centerScreenX) ** 2 + (e.clientY - centerScreenY) ** 2) || 1
                    const ratio = currentDist / startDistance
                    const newMarkings = markings.map(m =>
                      m.id === draggingMarkingId ? { ...m, scaleX: clamp(startScaleX * ratio), scaleY: clamp(startScaleY * ratio) } : m
                    )
                    updatePartial({ markings: newMarkings })
                  } else if (scaleAxis === 'x') {
                    // Nur Breite — horizontale Distanz vom Zentrum
                    const startDx = Math.abs(dragOriginRef.current.x - centerScreenX) || 1
                    const currentDx = Math.abs(e.clientX - centerScreenX) || 1
                    const newMarkings = markings.map(m =>
                      m.id === draggingMarkingId ? { ...m, scaleX: clamp(startScaleX * (currentDx / startDx)), scaleY: m.scaleY ?? m.scale ?? 1 } : m
                    )
                    updatePartial({ markings: newMarkings })
                  } else if (scaleAxis === 'y') {
                    // Nur Höhe — vertikale Distanz vom Zentrum
                    const startDy = Math.abs(dragOriginRef.current.y - centerScreenY) || 1
                    const currentDy = Math.abs(e.clientY - centerScreenY) || 1
                    const newMarkings = markings.map(m =>
                      m.id === draggingMarkingId ? { ...m, scaleX: m.scaleX ?? m.scale ?? 1, scaleY: clamp(startScaleY * (currentDy / startDy)) } : m
                    )
                    updatePartial({ markings: newMarkings })
                  }
                }
              }
            }}
            onMouseUp={() => {
              setDraggingMarkingId(null)
              setDragMode(null)
              dragOriginRef.current = null
            }}
            onMouseLeave={() => {
              setDraggingMarkingId(null)
              setDragMode(null)
              dragOriginRef.current = null
            }}
            onDoubleClick={(e) => {
              // Lösche Markierung bei Doppelklick
              const rect = svgContainerRef.current?.getBoundingClientRect()
              if (!rect) return
              
              const clickX = e.clientX - rect.left
              const clickY = e.clientY - rect.top
              
              const scaleX = calc.totalWidth / calc.displayWidth
              const scaleY = config.length / calc.displayHeight
              
              const configX = clickX * scaleX
              const configY = clickY * scaleY
              
              const laneWidth = config.width / (config.lanes)
              const arrowWidth = laneWidth * 0.6
              const arrowHeight = arrowWidth * 1.2
              
              for (const marking of markings) {
                const yPos = (marking.positionPercent / 100) * config.length
                
                // Quermarkierungen
                if (marking.type === 'zebra' || marking.type === 'stopLine' || marking.type === 'waitLine' || marking.type === 'sharkTeeth' || marking.type === 'blockedArea') {
                  const dblHitH = marking.type === 'zebra' ? ((marking.width || 40) * (marking.scaleY ?? marking.scale ?? 1)) / 2 + 5 : 12
                  if (configX >= calc.leftSideWidth - 5 && configX <= calc.leftSideWidth + config.width + 5 && configY >= yPos - dblHitH && configY <= yPos + dblHitH) {
                    updatePartial({ markings: markings.filter(m => m.id !== marking.id) })
                    setSelectedMarkingId(null)
                    return
                  }
                  continue
                }
                
                if (marking.type !== 'arrow' && marking.type !== 'speedNumber' && marking.type !== 'laneLine' && marking.type !== 'textMarking' && marking.type !== 'symbolMarking') continue
                const ms = marking.scale || 1
                const laneCenter = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
                
                const hw = arrowWidth * ms / 2 + 15
                const hh = arrowHeight * ms / 2 + 15
                
                if (configX >= laneCenter - hw && configX <= laneCenter + hw && configY >= yPos - hh && configY <= yPos + hh) {
                  updatePartial({ markings: markings.filter(m => m.id !== marking.id) })
                  setSelectedMarkingId(null)
                  return
                }
              }
            }}
            onWheel={(e) => {
              // Rotiere ausgewählte Markierung mit Scroll-Rad
              if (!selectedMarkingId) return
              const marking = markings.find(m => m.id === selectedMarkingId)
              if (!marking) return
              
              e.preventDefault()
              e.stopPropagation()
              
              const rotationDelta = e.deltaY > 0 ? 15 : -15
              const currentRotation = marking.rotation || 0
              let newRotation = (currentRotation + rotationDelta) % 360
              if (newRotation < 0) newRotation += 360
              
              const newMarkings = markings.map(m => 
                m.id === selectedMarkingId ? { ...m, rotation: newRotation } : m
              )
              updatePartial({ markings: newMarkings })
            }}
          />
          
          {/* Selection-Handles (HTML, nach Overlay damit klickbar) */}
          {selectedMarkingId && !draggingMarkingId && (() => {
            const marking = markings.find(m => m.id === selectedMarkingId)
            if (!marking) return null
            const rect = svgContainerRef.current?.getBoundingClientRect()
            if (!rect) return null

            const msx = marking.scaleX ?? marking.scale ?? 1
            const msy = marking.scaleY ?? marking.scale ?? 1
            const yPos = (marking.positionPercent / 100) * config.length
            const laneWidth = config.width / config.lanes
            const screenScaleX = rect.width / calc.totalWidth
            const screenScaleY = rect.height / config.length

            let centerSvgX: number, centerSvgY: number
            let hwSvg: number, hhSvg: number

            if (marking.type === 'arrow') {
              const def = ARROW_DEFS[marking.arrowType]
              if (!def) return null
              const scaleByWidth = (laneWidth * 0.6) / def.width
              const scaleByHeight = (config.length * 0.15) / def.height
              const baseScale = Math.min(scaleByWidth, scaleByHeight)
              centerSvgX = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
              centerSvgY = yPos
              hwSvg = def.width * baseScale * msx / 2 + 4
              hhSvg = def.height * baseScale * msy / 2 + 4
            } else if (marking.type === 'laneLine') {
              centerSvgX = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
              centerSvgY = yPos
              const lineH = marking.fullLength ? config.length * msy : 15 * msy
              hwSvg = 8 * msx
              hhSvg = lineH / 2 + 4
            } else if (marking.type === 'zebra') {
              centerSvgX = calc.leftSideWidth + config.width / 2
              centerSvgY = yPos
              hwSvg = config.width / 2 + 4
              hhSvg = (marking.width || 40) * msy / 2 + 4
            } else if (marking.type === 'stopLine' || marking.type === 'waitLine' || marking.type === 'sharkTeeth') {
              const { centerX, lineWidth } = getCrossMarkingBounds(marking, config.width, calc.leftSideWidth)
              centerSvgX = centerX
              centerSvgY = yPos
              const thickness = marking.type === 'sharkTeeth' ? 8 * msy : (marking.type === 'stopLine' ? 3 : 2) * msy
              hwSvg = lineWidth / 2 + 4
              hhSvg = thickness / 2 + 4
            } else if (marking.type === 'blockedArea') {
              const { centerX } = getCrossMarkingBounds(marking, config.width, calc.leftSideWidth)
              const bDef = BLOCKED_AREA_DEFS[marking.areaType]
              if (!bDef) return null
              const bWidthPct = marking.widthPercent ?? 30
              const hPct = marking.heightPercent ?? 15
              const targetW = (bWidthPct / 100) * config.width * msx
              const targetH = (hPct / 100) * config.length * msy
              const bScaleX = targetW / bDef.contentBox.w
              const bScaleY = targetH / bDef.contentBox.h
              centerSvgX = centerX
              centerSvgY = yPos
              hwSvg = bDef.contentBox.w * bScaleX / 2 + 4
              hhSvg = bDef.contentBox.h * bScaleY / 2 + 4
            } else if (marking.type === 'speedNumber') {
              const fontSize = laneWidth * 0.55
              centerSvgX = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
              centerSvgY = yPos
              hwSvg = (marking.value >= 100 ? fontSize * 1.8 : fontSize * 1.2) * msx / 2 + 4
              hhSvg = fontSize * 1.1 * msy / 2 + 4
            } else if (marking.type === 'textMarking') {
              const fontSize = laneWidth * 0.4
              centerSvgX = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
              centerSvgY = yPos
              if (marking.orientation === 'vertical') {
                const charH = fontSize * 1.3
                hwSvg = fontSize * 0.8 * msx / 2 + 4
                hhSvg = marking.text.length * charH * msy / 2 + 4
              } else {
                hwSvg = marking.text.length * fontSize * 0.65 * msx / 2 + 4
                hhSvg = fontSize * 1.1 * msy / 2 + 4
              }
            } else if (marking.type === 'symbolMarking') {
              const sDef = SYMBOL_DEFS[marking.symbolType]
              if (!sDef) return null
              const targetH = laneWidth * 0.8
              const baseScale = targetH / sDef.height
              centerSvgX = getMarkingX(marking, config.width, config.lanes, calc.leftSideWidth)
              centerSvgY = yPos
              hwSvg = sDef.width * baseScale * msx / 2 + 4
              hhSvg = sDef.height * baseScale * msy / 2 + 4
            } else {
              return null
            }

            const screenX = centerSvgX * screenScaleX
            const screenY = centerSvgY * screenScaleY
            const hwScreen = hwSvg * screenScaleX
            const hhScreen = hhSvg * screenScaleY

            const rotHandleDist = 20
            const hs = 7
            const handles: { key: string; left: number; top: number; cursor: string; axis: 'both' | 'x' | 'y' }[] = [
              { key: 'nw', left: screenX - hwScreen - hs/2, top: screenY - hhScreen - hs/2, cursor: 'nwse-resize', axis: 'both' },
              { key: 'ne', left: screenX + hwScreen - hs/2, top: screenY - hhScreen - hs/2, cursor: 'nesw-resize', axis: 'both' },
              { key: 'sw', left: screenX - hwScreen - hs/2, top: screenY + hhScreen - hs/2, cursor: 'nesw-resize', axis: 'both' },
              { key: 'se', left: screenX + hwScreen - hs/2, top: screenY + hhScreen - hs/2, cursor: 'nwse-resize', axis: 'both' },
              { key: 'n', left: screenX - hs/2, top: screenY - hhScreen - hs/2, cursor: 'ns-resize', axis: 'y' },
              { key: 's', left: screenX - hs/2, top: screenY + hhScreen - hs/2, cursor: 'ns-resize', axis: 'y' },
              { key: 'w', left: screenX - hwScreen - hs/2, top: screenY - hs/2, cursor: 'ew-resize', axis: 'x' },
              { key: 'e', left: screenX + hwScreen - hs/2, top: screenY - hs/2, cursor: 'ew-resize', axis: 'x' },
            ]

            return (
              <>
                {/* Verbindungslinie zum Rotate-Handle */}
                <div className="absolute" style={{
                  left: screenX - 0.5, top: screenY - hhScreen - rotHandleDist,
                  width: 1, height: rotHandleDist,
                  background: '#3b82f6', pointerEvents: 'none',
                }} />
                {/* Rotate-Handle (Kreis) */}
                <div className="absolute" style={{
                  left: screenX - 5, top: screenY - hhScreen - rotHandleDist - 5,
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'white', border: '1.5px solid #3b82f6',
                  cursor: 'crosshair', pointerEvents: 'auto', zIndex: 60,
                }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); e.preventDefault()
                    startRotateDrag(e, marking.id, centerSvgX, centerSvgY)
                  }}
                />
                {/* 8 Scale-Handles */}
                {handles.map(h => (
                  <div key={h.key} className="absolute" style={{
                    width: hs, height: hs,
                    left: h.left, top: h.top,
                    background: 'white', border: '1.5px solid #3b82f6',
                    cursor: h.cursor, pointerEvents: 'auto', zIndex: 60,
                  }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); e.preventDefault()
                      startScaleDrag(e, marking.id, centerSvgX, centerSvgY, hwSvg, hhSvg, h.axis)
                    }}
                  />
                ))}
              </>
            )
          })()}

          {/* Hover-Hint */}
          {!popup && hoveredZone && (
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                pointerEvents: 'none',
              }}
            >
              {hoveredZone.type === 'surface' && 'Fahrbahnbelag'}
              {hoveredZone.type === 'median' && 'Mittellinie'}
              {hoveredZone.type === 'laneLine' && `Spurlinie ${(hoveredZone.index || 0) + 1}`}
              {hoveredZone.type === 'sidewalk' && `Gehweg ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'cyclePath' && `Radweg-Fläche ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'cyclePathLine' && `Radweg-Linie ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'onRoadCyclePath' && `Radstreifen ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'onRoadCyclePathLine' && `Radstreifen-Linie ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'curb' && `Bordstein ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'greenStrip' && `Grünfläche ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'barrier' && `Leitplanke ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'emergencyLane' && `Standstreifen ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'parking' && `Parkplätze ${hoveredZone.side === 'left' ? 'links' : 'rechts'}`}
              {hoveredZone.type === 'ramp' && 'Beschleunigungsstreifen'}
              {hoveredZone.type === 'tram' && '🚋 Straßenbahn-Gleise'}
            </div>
          )}
        </div>
      </div>

      {/* Unten: - Spur Button */}
      <button
        onClick={() => canRemoveLane && updatePartial({ lanes: Math.max(1, totalLanes - 1), width: widthForLanes(totalLanes - 1) })}
        disabled={!canRemoveLane}
        className={removeBtnClass}
        style={removeBtnStyle}
        title="Spur entfernen"
      >
        {minusIcon}
        <span>Spur</span>
      </button>
    </div>
  )
}