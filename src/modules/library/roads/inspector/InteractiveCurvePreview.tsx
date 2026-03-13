// src/modules/library/roads/inspector/InteractiveCurvePreview.tsx
// Interaktive Live-Vorschau für Kurvenstraßen mit klickbaren Zonen

import { useState, useRef, useEffect, useMemo } from 'react'
import type { SmartRoadConfig, RoadsideElementType, RoadsideConfig } from '../types'
import { getActiveOrder, getElementWidth } from '../types'
// lucide-react icons removed — handles sind jetzt einfache SVG/HTML-Elemente
import { ARROW_DEFS } from '../markings/arrowSvgs'
import { BLOCKED_AREA_DEFS } from '../markings/blockedAreaSvgs'
import { SYMBOL_DEFS } from '../markings/symbolSvgs'

// Types aus previewTypes
import type { HoveredZone, PopupPosition, ZoneType, ZoneSide } from './previewTypes'
import { ZONE_COLORS } from './previewTypes'

// Popups removed — ContextPanel in parent handles all options

// Farben (synchron mit Generator)
const COLORS = {
  asphalt: '#6b6b6b',
  sidewalk: { tiles: '#c8c0b0', concrete: '#b8b8b8', pavement: '#a0a0a0' } as Record<string, string>,
  curb: { standard: '#4a4a4a', lowered: '#606060' } as Record<string, string>,
  greenStrip: '#5a7a5a',
  cyclePath: { red: '#c45c5c', asphalt: '#6b6b6b' } as Record<string, string>,
  barrier: '#d4d4d4',
  emergencyLane: '#6b6b6b',
  edgeLine: '#e7e6e6',
  laneLine: '#ffffff',
  medianGreen: '#4a7c59',
}

type Props = {
  config: SmartRoadConfig
  updatePartial: (updates: Partial<SmartRoadConfig>) => void
  onZoneSelect?: (popup: PopupPosition) => void
}

/**
 * InteractiveCurvePreview - Kurvenstraße mit klickbaren Zonen
 * Gleiche Struktur wie InteractiveRoadPreview
 */
export function InteractiveCurvePreview({ config, updatePartial, onZoneSelect }: Props) {
  const [hoveredZone, setHoveredZone] = useState<HoveredZone>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Drag & Drop State
  const [draggedElement, setDraggedElement] = useState<RoadsideElementType | null>(null)
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const dragStartRef = useRef<{ el: RoadsideElementType, side: 'left' | 'right', x: number, y: number } | null>(null)
  const DRAG_THRESHOLD = 5
  
  // Marking Selection + Handle Drag State
  const [selectedMarkingId, setSelectedMarkingId] = useState<string | null>(null)
  const [markingDraggingId, setMarkingDraggingId] = useState<string | null>(null)
  const [markingDragMode, setMarkingDragMode] = useState<'move' | 'rotate' | 'scale' | null>(null)
  const markingDragOriginRef = useRef<{
    x: number; y: number
    startRotation: number
    startScaleX: number; startScaleY: number
    centerScreenX?: number; centerScreenY?: number
    startDistance?: number
    startHwScreen?: number; startHhScreen?: number
    scaleAxis?: 'both' | 'x' | 'y'
  } | null>(null)
  
  const markings = useMemo(() => config.markings || [], [config.markings])

  // Auto-select: Wenn ein neues Marking hinzugefügt wird, automatisch auswählen
  const prevMarkingsLenRef = useRef(markings.length)
  useEffect(() => {
    if (markings.length > prevMarkingsLenRef.current && markings.length > 0) {
      setSelectedMarkingId(markings[markings.length - 1].id)
    }
    prevMarkingsLenRef.current = markings.length
  }, [markings])

  // Berechnungen
  const calc = useMemo(() => {
    const curve = config.curve || { angle: 90, direction: 'right', radius: 100 }
    const innerRadius = curve.radius
    const roadWidth = config.width
    const outerRadius = innerRadius + roadWidth
    
    // Seitenbreiten berechnen
    const leftSideWidth = getSideWidth(config.leftSide)
    const rightSideWidth = getSideWidth(config.rightSide)
    
    const totalOuterRadius = outerRadius + rightSideWidth
    const totalInnerRadius = Math.max(0, innerRadius - leftSideWidth)
    
    const angleRad = (curve.angle * Math.PI) / 180
    
    // Kurvenausdehnung (Zentrum ist bei (cx, cy) = (totalOuterRadius, totalOuterRadius))
    const cx = totalOuterRadius
    const cy = totalOuterRadius
    
    // Normalisierungsrotation: Ausgang soll immer horizontal zeigen
    // Bei 90°: 0° Rotation (Ausgang ist bereits horizontal)
    // Bei 15°: -75° Rotation (dreht den Ausgang von "fast oben" nach horizontal)
    const baseRotation = -(90 - curve.angle)
    const baseRotationRad = (baseRotation * Math.PI) / 180
    
    // Berechne Schlüsselpunkte der RECHTSKURVE (ViewBox wird immer für Rechtskurve berechnet)
    const points = [
      // Äußerer Bogen Start
      { x: cx, y: cy - totalOuterRadius },
      // Äußerer Bogen Ende  
      { x: cx - totalOuterRadius * Math.sin(angleRad), y: cy - totalOuterRadius * Math.cos(angleRad) },
      // Innerer Bogen Start
      { x: cx, y: cy - totalInnerRadius },
      // Innerer Bogen Ende
      { x: cx - totalInnerRadius * Math.sin(angleRad), y: cy - totalInnerRadius * Math.cos(angleRad) },
    ]
    
    // Rotiere alle Punkte um den Kurvenmittelpunkt (cx, cy)
    const rotatedPoints = points.map(p => {
      const dx = p.x - cx
      const dy = p.y - cy
      return {
        x: cx + dx * Math.cos(baseRotationRad) - dy * Math.sin(baseRotationRad),
        y: cy + dx * Math.sin(baseRotationRad) + dy * Math.cos(baseRotationRad),
      }
    })
    
    // Finde die Bounding Box der rotierten Punkte
    const rotatedXs = rotatedPoints.map(p => p.x)
    const rotatedYs = rotatedPoints.map(p => p.y)
    let newLeft = Math.min(...rotatedXs)
    let newRight = Math.max(...rotatedXs)
    const newTop = Math.min(...rotatedYs)
    const newBottom = Math.max(...rotatedYs)
    
    // Bei Linkskurve: Spiegele die X-Koordinaten um cx
    if (curve.direction === 'left') {
      const mirroredLeft = 2 * cx - newRight
      const mirroredRight = 2 * cx - newLeft
      newLeft = mirroredLeft
      newRight = mirroredRight
    }
    
    // Padding
    const padding = 30
    
    // ViewBox für den relevanten Bereich
    const vbX = newLeft - padding
    const vbY = newTop - padding
    const vbWidth = (newRight - newLeft) + padding * 2
    const vbHeight = (newBottom - newTop) + padding * 2
    
    // Display-Größe proportional zur viewBox - GRÖSSER
    const maxDisplaySize = 680
    const aspectRatio = vbWidth / vbHeight
    let displayWidth: number
    let displayHeight: number
    
    if (aspectRatio > 1) {
      // Breiter als hoch
      displayWidth = maxDisplaySize
      displayHeight = maxDisplaySize / aspectRatio
    } else {
      // Höher als breit
      displayHeight = maxDisplaySize
      displayWidth = maxDisplaySize * aspectRatio
    }
    
    // Minimum-Größen
    displayWidth = Math.max(400, displayWidth)
    displayHeight = Math.max(400, displayHeight)
    
    return {
      innerRadius,
      outerRadius,
      leftSideWidth,
      rightSideWidth,
      totalOuterRadius,
      totalInnerRadius,
      // Original viewBoxSize für Geometrie-Berechnungen (Kurvenzentrum)
      viewBoxSize: Math.ceil(totalOuterRadius),
      // Neue viewBox-Parameter für optimierte Darstellung
      vbX,
      vbY,
      vbWidth,
      vbHeight,
      angle: curve.angle,
      direction: curve.direction,
      baseRotation,
      lanes: (config.lanes),
      laneWidth: roadWidth / (config.lanes),
      isAsphalt: !config.surface?.type || config.surface.type === 'asphalt',
      displayWidth,
      displayHeight,
    }
  }, [config])

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

  // Global mouse handler for rotation/scale drags on markings
  useEffect(() => {
    if (!markingDraggingId || !markingDragMode || markingDragMode === 'move') return
    
    const handleGlobalMove = (e: MouseEvent) => {
      if (markingDragMode === 'rotate' && markingDragOriginRef.current) {
        const marking = markings.find(m => m.id === markingDraggingId)
        if (!marking) return
        
        const svgEl = svgRef.current
        if (!svgEl) return
        const gEl = svgEl.querySelector('g')
        if (!gEl) return
        const ctm = gEl.getScreenCTM()
        if (!ctm) return
        
        const laneWidth = config.width / config.lanes
        const innerRadius = calc.innerRadius
        const roadWidth = calc.outerRadius - calc.innerRadius
        
        let markRadius: number
        if ('xPercent' in marking && marking.xPercent !== undefined) {
          markRadius = innerRadius + (marking.xPercent / 100) * roadWidth
        } else if ('laneIndex' in marking) {
          markRadius = innerRadius + (marking.laneIndex + 0.5) * laneWidth
        } else {
          markRadius = innerRadius + roadWidth / 2
        }
        
        const posAngle = (marking.positionPercent / 100) * calc.angle
        const posAngleRad = (posAngle * Math.PI) / 180
        const geoX = calc.viewBoxSize - markRadius * Math.sin(posAngleRad)
        const geoY = calc.viewBoxSize - markRadius * Math.cos(posAngleRad)
        
        // Mausposition → lokaler SVG-Koordinatenraum (kompensiert <g transform>)
        const pt = svgEl.createSVGPoint()
        pt.x = e.clientX; pt.y = e.clientY
        const inverseCTM = ctm.inverse()
        const localPt = pt.matrixTransform(inverseCTM)
        
        // Winkel im lokalen Raum relativ zum Markierungszentrum
        const dx = localPt.x - geoX
        const dy = localPt.y - geoY
        const localAngle = Math.atan2(dx, -dy) * (180 / Math.PI)
        
        // Tangenten-Rotation abziehen → ergibt die reine User-Rotation
        const tangentRotation = 90 - posAngle
        let newRotation = Math.round((localAngle - tangentRotation) / 5) * 5
        newRotation = ((newRotation % 360) + 360) % 360
        
        updatePartial({ markings: markings.map(m => m.id === markingDraggingId ? { ...m, rotation: newRotation } : m) })
        
      } else if (markingDragMode === 'scale' && markingDragOriginRef.current) {
        const { centerScreenX, centerScreenY, startDistance, startScaleX, startScaleY, scaleAxis } = markingDragOriginRef.current
        if (centerScreenX != null && centerScreenY != null && startDistance) {
          const clamp = (v: number) => Math.max(0.1, Math.round(v * 100) / 100)
          if (scaleAxis === 'both') {
            const currentDist = Math.sqrt((e.clientX - centerScreenX) ** 2 + (e.clientY - centerScreenY) ** 2) || 1
            const ratio = currentDist / startDistance
            updatePartial({ markings: markings.map(m => m.id === markingDraggingId ? { ...m, scaleX: clamp(startScaleX * ratio), scaleY: clamp(startScaleY * ratio) } : m) })
          } else if (scaleAxis === 'x') {
            const startDx = Math.abs(markingDragOriginRef.current.x - centerScreenX) || 1
            const currentDx = Math.abs(e.clientX - centerScreenX) || 1
            updatePartial({ markings: markings.map(m => m.id === markingDraggingId ? { ...m, scaleX: clamp(startScaleX * (currentDx / startDx)), scaleY: m.scaleY ?? m.scale ?? 1 } : m) })
          } else if (scaleAxis === 'y') {
            const startDy = Math.abs(markingDragOriginRef.current.y - centerScreenY) || 1
            const currentDy = Math.abs(e.clientY - centerScreenY) || 1
            updatePartial({ markings: markings.map(m => m.id === markingDraggingId ? { ...m, scaleX: m.scaleX ?? m.scale ?? 1, scaleY: clamp(startScaleY * (currentDy / startDy)) } : m) })
          }
        }
      }
    }
    
    const handleGlobalUp = () => {
      setMarkingDraggingId(null)
      setMarkingDragMode(null)
      markingDragOriginRef.current = null
    }
    
    window.addEventListener('mousemove', handleGlobalMove)
    window.addEventListener('mouseup', handleGlobalUp)
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove)
      window.removeEventListener('mouseup', handleGlobalUp)
    }
  }, [markingDraggingId, markingDragMode, markings, config, calc, updatePartial])

  // ========== DRAG & DROP FÜR SEITENELEMENTE ==========
  const handleDragMouseDown = (el: RoadsideElementType, side: 'left' | 'right', e: React.MouseEvent) => {
    if (e.button !== 0) return
    dragStartRef.current = { el, side, x: e.clientX, y: e.clientY }
  }
  
  const handleDragMouseMove = (e: React.MouseEvent) => {
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
      setDraggedElement(null); setDragSide(null); setDropTargetIndex(null)
      return
    }
    const k = dragSide === 'left' ? 'leftSide' : 'rightSide' as const
    const sc = config[k] || {}
    const currentOrder = getActiveOrder(sc)
    const fromIndex = currentOrder.indexOf(draggedElement)
    if (fromIndex === -1 || fromIndex === dropTargetIndex) {
      setDraggedElement(null); setDragSide(null); setDropTargetIndex(null)
      return
    }
    const newOrder = [...currentOrder]
    newOrder.splice(fromIndex, 1)
    const insertAt = dropTargetIndex > fromIndex ? dropTargetIndex - 1 : dropTargetIndex
    newOrder.splice(insertAt, 0, draggedElement)
    updatePartial({ [k]: { ...sc, order: newOrder } })
    setDraggedElement(null); setDragSide(null); setDropTargetIndex(null)
  }
  
  const handleDragMouseUp = (e: React.MouseEvent, zone: ZoneType, side: ZoneSide) => {
    if (draggedElement) {
      handleDrop()
    } else if (dragStartRef.current) {
      dragStartRef.current = null
      handleZoneClick(e, zone, side)
    }
  }
  
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggedElement && dragSide) {
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
        setDraggedElement(null); setDragSide(null); setDropTargetIndex(null)
      }
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [draggedElement, dragSide, dropTargetIndex, config, updatePartial])

  // Zone Click Handler
  const handleZoneClick = (e: React.MouseEvent, zone: ZoneType, side?: ZoneSide, index?: number) => {
    e.stopPropagation()
    // Markierung deselektieren wenn Zone angeklickt wird
    setSelectedMarkingId(null)
    const popupData: PopupPosition = { x: 0, y: 0, zone, side, index }
    if (onZoneSelect) {
      onZoneSelect(popupData)
    }
  }

  const handleContainerClick = () => {
    onZoneSelect?.(null)
    setSelectedMarkingId(null)
  }

  // ESC zum Schließen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onZoneSelect?.(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onZoneSelect])

  // Sidebar Update Helpers
  const { viewBoxSize, angle, direction, innerRadius, outerRadius, baseRotation } = calc
  
  // Transform: Erst rotieren, dann bei Linkskurve das Ergebnis horizontal spiegeln
  let transform: string
  if (direction === 'left') {
    // Linkskurve: Rotieren wie Rechtskurve, dann horizontal spiegeln um viewBoxSize
    transform = `translate(${2 * viewBoxSize}, 0) scale(-1, 1) rotate(${baseRotation}, ${viewBoxSize}, ${viewBoxSize})`
  } else {
    // Rechtskurve: Nur rotieren
    transform = `rotate(${baseRotation}, ${viewBoxSize}, ${viewBoxSize})`
  }

  // Berechne ob Spuren hinzugefügt/entfernt werden können
  const totalLanes = config.lanes
  const maxLanes = 8
  const minLanes = 1
  const canAddLane = totalLanes < maxLanes
  const canRemoveLane = totalLanes > minLanes
  
  // Spurbreite und auto-resize
  const actualLaneWidth = totalLanes > 0 ? Math.round(config.width / totalLanes) : 40
  const widthForLanes = (newTotal: number) => Math.max(80, newTotal * actualLaneWidth)
  
  const addBtnClass = "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
  const addBtnStyle: React.CSSProperties = { background: 'var(--primary)', color: 'white', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }
  const removeBtnClass = addBtnClass
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
        onClick={() => canAddLane && updatePartial({ lanes: config.lanes + 1, width: widthForLanes(totalLanes + 1) })}
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

        {/* SVG Preview - ohne extra Container */}
        <div className="relative">
          <svg
            ref={svgRef}
            width={calc.displayWidth}
            height={calc.displayHeight}
            viewBox={`${calc.vbX} ${calc.vbY} ${calc.vbWidth} ${calc.vbHeight}`}
            style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'visible',
            }}
            onClick={(e) => {
              // Deselektieren wenn Klick NICHT auf einer Markierung
              const target = e.target as Element
              if (!target.closest('[data-marking-hitbox]')) {
                handleContainerClick()
                setSelectedMarkingId(null)
              }
            }}
            onMouseMove={(e) => {
              // Globaler Move-Handler für alle Markierungstypen
              if (!markingDraggingId || markingDragMode !== 'move') return
              
              const svg = svgRef.current
              if (!svg) return
              
              // Mausposition → SVG-Geometrie-Koordinaten (berücksichtigt transform der g-Gruppe)
              const pt = svg.createSVGPoint()
              pt.x = e.clientX
              pt.y = e.clientY
              
              // Inverse der <g transform> Gruppe holen
              const gEl = svg.querySelector('g')
              if (!gEl) return
              const ctm = gEl.getScreenCTM()
              if (!ctm) return
              const svgPt = pt.matrixTransform(ctm.inverse())
              
              // Jetzt sind svgPt.x/y im nicht-transformierten Geometrie-Raum
              const vbs = calc.viewBoxSize
              const dx = vbs - svgPt.x
              const dy = vbs - svgPt.y
              const radius = Math.sqrt(dx * dx + dy * dy)
              let angleRad2 = Math.atan2(dx, dy)
              if (angleRad2 < 0) angleRad2 += 2 * Math.PI
              const angleDeg = (angleRad2 * 180) / Math.PI
              const positionPercent = Math.max(0, Math.min(100, (angleDeg / calc.angle) * 100))
              const curveRoadWidth = calc.outerRadius - calc.innerRadius
              const radiusPercent = Math.max(0, Math.min(100, ((radius - calc.innerRadius) / curveRoadWidth) * 100))
              const isFreeMode = e.shiftKey
              
              const newMarkings = markings.map(m => {
                if (m.id !== markingDraggingId) return m
                
                const clampedPos = Math.max(5, Math.min(95, positionPercent))
                
                // Einheitliches Snapping für ALLE Markierungstypen:
                // Normal = Snap auf nächste Spurmitte, Shift = frei
                if (isFreeMode) {
                  return { ...m, positionPercent: clampedPos, xPercent: radiusPercent }
                } else {
                  const lanes = config.lanes
                  const halfLane = 50 / lanes
                  const snappedX = Math.round(radiusPercent / halfLane) * halfLane
                  const clampedX = Math.max(0, Math.min(100, snappedX))
                  return { ...m, positionPercent: clampedPos, xPercent: clampedX }
                }
              })
              updatePartial({ markings: newMarkings })
            }}
            onMouseUp={() => {
              if (markingDraggingId && markingDragMode === 'move') {
                setMarkingDraggingId(null)
                setMarkingDragMode(null)
                markingDragOriginRef.current = null
              }
            }}
            onMouseLeave={() => {
              if (markingDraggingId && markingDragMode === 'move') {
                setMarkingDraggingId(null)
                setMarkingDragMode(null)
                markingDragOriginRef.current = null
              }
            }}
          >
            <g transform={transform}>
              {/* ========== ÄUSSERE SEITENELEMENTE (rightSide) ========== */}
              <OuterSideElements
                config={config}
                outerRadius={outerRadius}
                angle={angle}
                viewBoxSize={viewBoxSize}
                hoveredZone={hoveredZone}
                onHover={setHoveredZone}
                onDoubleClick={handleZoneClick}
                onDragMouseDown={handleDragMouseDown}
                onDragMouseMove={handleDragMouseMove}
                onDragOver={handleDragOver}
                onDragMouseUp={handleDragMouseUp}
                draggedElement={dragSide === 'right' ? draggedElement : null}
                dropTargetIndex={dragSide === 'right' ? dropTargetIndex : null}
              />
              
              {/* ========== FAHRBAHN ========== */}
              <RoadSurface
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                angle={angle}
                viewBoxSize={viewBoxSize}
                config={config}
              />
              
              {/* ========== ON-ROAD CYCLE LANES ========== */}
              <OnRoadCycleLanes
                config={config}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                angle={angle}
                viewBoxSize={viewBoxSize}
                hoveredZone={hoveredZone}
                onHover={setHoveredZone}
                onClick={handleZoneClick}
              />
              
              {/* ========== SPURMARKIERUNGEN & MEDIAN ========== */}
              <LaneMarkings
                config={config}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                angle={angle}
                viewBoxSize={viewBoxSize}
                hoveredZone={hoveredZone}
                onHover={setHoveredZone}
                onClick={handleZoneClick}
              />
              
              {/* ========== STRASSENBAHN ========== */}
              {config.tram && config.category === 'strasse' && (() => {
                const tram = config.tram!
                const tramWidth = tram.width || (tram.tracks === 1 ? 20 : 36)
                const tramCenterRadius = innerRadius + (outerRadius - innerRadius) / 2
                const tramHalfWidth = tramWidth / 2
                const gaugeWidth = 10
                const gap = 4
                const isHovered = hoveredZone?.type === 'tram'
                
                // Schwellenpositionen einmal basierend auf tramCenterRadius berechnen,
                // damit bei zweigleisig die Schwellen synchron liegen
                const tieSpacing = 20
                const refArcLength = (angle * Math.PI / 180) * tramCenterRadius
                const tieCount = Math.floor(refArcLength / tieSpacing)

                const renderRailPair = (centerR: number, key: string) => {
                  const tieWidth = gaugeWidth + 6
                  const showTies = tram.trackType === 'embedded'

                  return (
                    <g key={key}>
                      {showTies && Array.from({ length: tieCount }, (_, idx) => {
                        const tieAngle = ((idx + 0.5) / tieCount) * angle
                        const tieAngleRad = (tieAngle * Math.PI) / 180
                        const cos = Math.cos(tieAngleRad)
                        const sin = Math.sin(tieAngleRad)
                        const innerR = centerR - tieWidth / 2
                        const outerR = centerR + tieWidth / 2
                        const x1 = viewBoxSize - innerR * sin
                        const y1 = viewBoxSize - innerR * cos
                        const x2 = viewBoxSize - outerR * sin
                        const y2 = viewBoxSize - outerR * cos
                        return <line key={`${key}-tie-${idx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b7355" strokeWidth={3} opacity={0.6} />
                      })}
                      <path d={createArcPath(centerR - gaugeWidth / 2, angle, viewBoxSize)} fill="none" stroke="#c0c0c0" strokeWidth={2} />
                      <path d={createArcPath(centerR + gaugeWidth / 2, angle, viewBoxSize)} fill="none" stroke="#c0c0c0" strokeWidth={2} />
                    </g>
                  )
                }
                
                return (
                  <g style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredZone({ type: 'tram' })}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={(e) => handleZoneClick(e, 'tram')}
                  >
                    {/* Gleisbett */}
                    <path 
                      d={createArcRingPath(tramCenterRadius - tramHalfWidth, tramCenterRadius + tramHalfWidth, angle, viewBoxSize)} 
                      fill={tram.trackType === 'grass' ? '#6a8f4e' : tram.trackType === 'dedicated' ? '#888888' : '#5a5a5a'} 
                    />
                    {/* Bordsteine bei dedicated/grass */}
                    {(tram.trackType === 'dedicated' || tram.trackType === 'grass') && (
                      <>
                        <path d={createArcPath(tramCenterRadius - tramHalfWidth, angle, viewBoxSize)} fill="none" stroke="#999" strokeWidth={2} />
                        <path d={createArcPath(tramCenterRadius + tramHalfWidth, angle, viewBoxSize)} fill="none" stroke="#999" strokeWidth={2} />
                      </>
                    )}
                    {/* Schienen */}
                    {tram.tracks === 1 
                      ? renderRailPair(tramCenterRadius, 'track-0')
                      : (
                        <>
                          {renderRailPair(tramCenterRadius - gap / 2 - gaugeWidth / 2, 'track-0')}
                          {renderRailPair(tramCenterRadius + gap / 2 + gaugeWidth / 2, 'track-1')}
                        </>
                      )
                    }
                    {/* Hover */}
                    {isHovered && (
                      <path d={createArcRingPath(tramCenterRadius - tramHalfWidth - 2, tramCenterRadius + tramHalfWidth + 2, angle, viewBoxSize)} fill="rgba(245, 158, 11, 0.25)" />
                    )}
                  </g>
                )
              })()}
              
              {/* ========== INNERE SEITENELEMENTE (leftSide) ========== */}
              <InnerSideElements
                config={config}
                innerRadius={innerRadius}
                angle={angle}
                viewBoxSize={viewBoxSize}
                hoveredZone={hoveredZone}
                onHover={setHoveredZone}
                onDoubleClick={handleZoneClick}
                onDragMouseDown={handleDragMouseDown}
                onDragMouseMove={handleDragMouseMove}
                onDragOver={handleDragOver}
                onDragMouseUp={handleDragMouseUp}
                draggedElement={dragSide === 'left' ? draggedElement : null}
                dropTargetIndex={dragSide === 'left' ? dropTargetIndex : null}
              />
              
              {/* ========== LINIEN-MARKIERUNGEN (Zebra/Halte-/Wartelinien/Haifischzähne) ========== */}
              {(config.markings || []).map((marking) => {
                if (marking.type !== 'zebra' && marking.type !== 'stopLine' && marking.type !== 'waitLine' && marking.type !== 'sharkTeeth' && marking.type !== 'blockedArea') return null

                const posAngle = (marking.positionPercent / 100) * angle
                const posAngleRad = (posAngle * Math.PI) / 180
                const roadWidth = outerRadius - innerRadius
                const r1Full = innerRadius
                const r2Full = outerRadius

                // Zebra: eigene Logik
                if (marking.type === 'zebra') {
                  const msx = marking.scaleX ?? marking.scale ?? 1
                  const msy = marking.scaleY ?? marking.scale ?? 1
                  const zebraWidth = (marking.width || 40) * msy
                  const stripeRadial = 5 * msx
                  const gapRadial = 5 * msx
                  // Edge-to-edge radial tiling
                  const totalRadial = r2Full - r1Full
                  const N = Math.max(1, Math.round((totalRadial + gapRadial) / (stripeRadial + gapRadial)))
                  const actualGap = N > 1 ? (totalRadial - N * stripeRadial) / (N - 1) : 0
                  const posAngleRad2 = (posAngle * Math.PI) / 180
                  const stripes: React.ReactElement[] = []
                  for (let idx = 0; idx < N; idx++) {
                    const rIn = r1Full + idx * (stripeRadial + actualGap)
                    const rOut = rIn + stripeRadial
                    // Pro Radius eigener Winkel → gleiche Bogenlänge (rechteckige Streifen)
                    const halfAngIn = (zebraWidth / 2) / rIn
                    const halfAngOut = (zebraWidth / 2) / rOut
                    const ix1 = viewBoxSize - rIn * Math.sin(posAngleRad2 - halfAngIn)
                    const iy1 = viewBoxSize - rIn * Math.cos(posAngleRad2 - halfAngIn)
                    const ix2 = viewBoxSize - rIn * Math.sin(posAngleRad2 + halfAngIn)
                    const iy2 = viewBoxSize - rIn * Math.cos(posAngleRad2 + halfAngIn)
                    const ox1 = viewBoxSize - rOut * Math.sin(posAngleRad2 - halfAngOut)
                    const oy1 = viewBoxSize - rOut * Math.cos(posAngleRad2 - halfAngOut)
                    const ox2 = viewBoxSize - rOut * Math.sin(posAngleRad2 + halfAngOut)
                    const oy2 = viewBoxSize - rOut * Math.cos(posAngleRad2 + halfAngOut)
                    const d = `M ${ix1},${iy1} L ${ox1},${oy1} L ${ox2},${oy2} L ${ix2},${iy2} Z`
                    stripes.push(<path key={idx} d={d} fill={marking.color || '#ffffff'} />)
                  }
                  return (
                    <g key={marking.id} style={{ filter: undefined }}>
                      {stripes}
                      {/* Hitbox — radiale Linie über gesamte Fahrbahnbreite */}
                      {(() => {
                        const hx1 = viewBoxSize - r1Full * Math.sin(posAngleRad)
                        const hy1 = viewBoxSize - r1Full * Math.cos(posAngleRad)
                        const hx2 = viewBoxSize - r2Full * Math.sin(posAngleRad)
                        const hy2 = viewBoxSize - r2Full * Math.cos(posAngleRad)
                        return <line x1={hx1} y1={hy1} x2={hx2} y2={hy2} stroke="transparent" strokeWidth={Math.max(12, zebraWidth)} strokeLinecap="round" data-marking-hitbox="true" style={{ cursor: 'pointer' }}
                          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedMarkingId(marking.id); setMarkingDraggingId(marking.id); setMarkingDragMode('move'); markingDragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 } }} />
                      })()}
                    </g>
                  )
                }

                const centerPct = marking.xPercent ?? 50
                const widthPct = marking.widthPercent ?? 100
                const halfW = widthPct / 2
                const r1 = innerRadius + (Math.max(0, centerPct - halfW) / 100) * roadWidth
                const r2 = innerRadius + (Math.min(100, centerPct + halfW) / 100) * roadWidth

                if (marking.type === 'sharkTeeth') {
                  // Haifischzähne: Dreiecke entlang des Radius
                  const msx = marking.scaleX ?? marking.scale ?? 1
                  const msy = marking.scaleY ?? marking.scale ?? 1
                  const toothLen = 6 * msx
                  const toothH = 8 * msy
                  const gap = 2 * msx
                  const dir = marking.direction === 'outward' ? -1 : 1
                  const midR = (r1 + r2) / 2
                  const halfAngleOffset = (toothH / 2 / midR) * dir
                  
                  const triangles: React.ReactElement[] = []
                  let pos = r1
                  let i = 0
                  while (pos + toothLen <= r2 + 0.1) {
                    const rMid = pos + toothLen / 2
                    const bx1 = viewBoxSize - pos * Math.sin(posAngleRad)
                    const by1 = viewBoxSize - pos * Math.cos(posAngleRad)
                    const bx2 = viewBoxSize - (pos + toothLen) * Math.sin(posAngleRad)
                    const by2 = viewBoxSize - (pos + toothLen) * Math.cos(posAngleRad)
                    const tipAngle = posAngleRad + halfAngleOffset
                    const tx = viewBoxSize - rMid * Math.sin(tipAngle)
                    const ty = viewBoxSize - rMid * Math.cos(tipAngle)
                    triangles.push(
                      <polygon key={i} points={`${bx1},${by1} ${tx},${ty} ${bx2},${by2}`} fill={marking.color || '#ffffff'} />
                    )
                    pos += toothLen + gap
                    i++
                  }
                  
                  return (
                    <g key={marking.id} style={{ filter: undefined }}>
                      {triangles}
                      {/* Hitbox */}
                      {(() => {
                        const p1x = viewBoxSize - r1 * Math.sin(posAngleRad)
                        const p1y = viewBoxSize - r1 * Math.cos(posAngleRad)
                        const p2x = viewBoxSize - r2 * Math.sin(posAngleRad)
                        const p2y = viewBoxSize - r2 * Math.cos(posAngleRad)
                        return <line x1={p1x} y1={p1y} x2={p2x} y2={p2y}
                          stroke="transparent" strokeWidth={14} strokeLinecap="round" data-marking-hitbox="true"
                          style={{ cursor: 'pointer' }}
                          onMouseDown={(e) => {
                            e.stopPropagation(); e.preventDefault()
                            setSelectedMarkingId(marking.id)
                            setMarkingDraggingId(marking.id)
                            setMarkingDragMode('move')
                            markingDragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                          }}
                        />
                      })()}
                    </g>
                  )
                }
                
                // Sperrflächen — echte Formdarstellung via flatPaths
                if (marking.type === 'blockedArea') {
                  const def = BLOCKED_AREA_DEFS[marking.areaType]
                  if (!def || !def.flatPaths || def.flatPaths.length === 0) return null

                  const bmsx = marking.scaleX ?? marking.scale ?? 1
                  const bmsy = marking.scaleY ?? marking.scale ?? 1
                  const hPct = marking.heightPercent ?? 15
                  const bWidthPct = marking.widthPercent ?? 30

                  // Zielgröße mit unabhängiger Skalierung
                  const roadW = outerRadius - innerRadius
                  const targetW = (bWidthPct / 100) * roadW * bmsx
                  const midArcR = (innerRadius + outerRadius) / 2
                  const arcLen = ((hPct / 100) * angle * Math.PI / 180) * midArcR
                  const targetH = arcLen * bmsy

                  // Skalierung basiert auf contentBox
                  const cb = def.contentBox
                  const bScaleX = targetW / cb.w
                  const bScaleY = targetH / cb.h

                  // Position auf dem Bogen
                  const xPct = marking.xPercent ?? 50
                  const midR = innerRadius + (xPct / 100) * (outerRadius - innerRadius)
                  const bx = viewBoxSize - midR * Math.sin(posAngleRad)
                  const by = viewBoxSize - midR * Math.cos(posAngleRad)
                  const tangentRot = 90 - (marking.positionPercent / 100) * angle
                  const totalRot = tangentRot + (marking.rotation || 0)

                  // Content-Zentrum für Offset (unabhängig pro Achse)
                  const contentCX = (cb.x + cb.w / 2) * bScaleX
                  const contentCY = (cb.y + cb.h / 2) * bScaleY
                  const scaledW = cb.w * bScaleX
                  const scaledH = cb.h * bScaleY
                  
                  const isDragging = markingDraggingId === marking.id
                  
                  return (
                    <g key={marking.id} style={{ filter: undefined }}>
                      {/* Eigentliche Form: translate → rotate → translate(center) → scale */}
                      <g
                        transform={`translate(${bx}, ${by}) rotate(${totalRot}) translate(${-contentCX}, ${-contentCY}) scale(${bScaleX}, ${bScaleY})`}
                        style={{ opacity: isDragging ? 0.7 : 1 }}
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
                      <g transform={`translate(${bx}, ${by}) rotate(${totalRot})`}>
                        <rect
                          x={-scaledW / 2 - 5} y={-scaledH / 2 - 5}
                          width={scaledW + 10} height={scaledH + 10}
                          fill="transparent" data-marking-hitbox="true"
                          style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
                          onMouseDown={(e) => {
                            e.stopPropagation(); e.preventDefault()
                            setSelectedMarkingId(marking.id)
                            setMarkingDraggingId(marking.id)
                            setMarkingDragMode('move')
                            markingDragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                          }}
                          onDoubleClick={(e) => {
                            e.preventDefault(); e.stopPropagation()
                            updatePartial({ markings: (config.markings || []).filter(m => m.id !== marking.id) })
                            setSelectedMarkingId(null)
                          }}
                          onWheel={(e) => {
                            e.preventDefault(); e.stopPropagation()
                            const rotDelta = e.deltaY > 0 ? 15 : -15
                            const cur = marking.rotation || 0
                            let next = (cur + rotDelta) % 360
                            if (next < 0) next += 360
                            updatePartial({ markings: (config.markings || []).map(m => m.id === marking.id ? { ...m, rotation: next } : m) })
                          }}
                        />
                      </g>
                    </g>
                  )
                }
                
                // Halte- / Wartelinie
                const p1x = viewBoxSize - r1 * Math.sin(posAngleRad)
                const p1y = viewBoxSize - r1 * Math.cos(posAngleRad)
                const p2x = viewBoxSize - r2 * Math.sin(posAngleRad)
                const p2y = viewBoxSize - r2 * Math.cos(posAngleRad)
                const msy = marking.scaleY ?? marking.scale ?? 1
                const thickness = (marking.type === 'stopLine' ? 3 : 2) * msy
                
                // Render line content based on type
                const lineContent = (() => {
                  const cLineColor = marking.color || '#ffffff'
                  if (marking.type === 'stopLine') {
                    return <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke={cLineColor} strokeWidth={thickness} />
                  } else {
                    return <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke={cLineColor} strokeWidth={thickness} strokeDasharray="4 4" />
                  }
                })()
                
                return (
                  <g key={marking.id} style={{ filter: undefined }}>
                    {lineContent}
                    <line x1={p1x} y1={p1y} x2={p2x} y2={p2y}
                      stroke="transparent" strokeWidth={12} strokeLinecap="round" data-marking-hitbox="true"
                      style={{ cursor: 'pointer' }}
                      onMouseDown={(e) => {
                        e.stopPropagation(); e.preventDefault()
                        setSelectedMarkingId(marking.id)
                        setMarkingDraggingId(marking.id)
                        setMarkingDragMode('move')
                        markingDragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking.rotation || 0, startScaleX: marking.scaleX ?? marking.scale ?? 1, startScaleY: marking.scaleY ?? marking.scale ?? 1 }
                      }}
                    />
                  </g>
                )
              })}
              
              {/* ========== FAHRBAHNMARKIERUNGEN (Pfeile) ========== */}
              <CurveArrowMarkings
                config={config}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                angle={angle}
                viewBoxSize={viewBoxSize}
                updatePartial={updatePartial}
                onSelect={setSelectedMarkingId}
                draggingId={markingDraggingId}
                setDraggingId={setMarkingDraggingId}
                dragMode={markingDragMode}
                setDragMode={setMarkingDragMode}
                dragOriginRef={markingDragOriginRef}
              />
            </g>
          </svg>
          
          {/* Selection-Handles (Fabric.js-Stil): Bounding-Box + 8 Scale-Handles + Rotate-Handle */}
          {selectedMarkingId && !markingDraggingId && (() => {
            const marking = markings.find(m => m.id === selectedMarkingId)
            if (!marking) return null

            const msx = marking.scaleX ?? marking.scale ?? 1
            const msy = marking.scaleY ?? marking.scale ?? 1
            const laneWidth = (calc.outerRadius - calc.innerRadius) / config.lanes
            const roadWidth = calc.outerRadius - calc.innerRadius

            // Position berechnen — einheitlich via xPercent
            const posAngle = (marking.positionPercent / 100) * calc.angle
            const posAngleRad = (posAngle * Math.PI) / 180
            const xPct = ('xPercent' in marking && marking.xPercent !== undefined)
              ? marking.xPercent
              : ('laneIndex' in marking
                ? ((marking as { laneIndex: number }).laneIndex + 0.5) / config.lanes * 100
                : 50)
            const midR = calc.innerRadius + (xPct / 100) * roadWidth
            const svgX = calc.viewBoxSize - midR * Math.sin(posAngleRad)
            const svgY = calc.viewBoxSize - midR * Math.cos(posAngleRad)

            // SVG → Screen via CTM
            const svg = svgRef.current
            if (!svg) return null
            const gEl = svg.querySelector('g')
            if (!gEl) return null
            const ctm = gEl.getScreenCTM()
            if (!ctm) return null
            const containerRect = svg.parentElement?.getBoundingClientRect()
            if (!containerRect) return null

            const pt = svg.createSVGPoint()
            pt.x = svgX; pt.y = svgY
            const screenPt = pt.matrixTransform(ctm)
            const screenX = screenPt.x - containerRect.left
            const screenY = screenPt.y - containerRect.top
            const svgScale = Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b)

            // hwScreen/hhScreen berechnen
            let hwScreen: number, hhScreen: number
            if (marking.type === 'zebra') {
              hwScreen = (roadWidth / 2 + 6) * svgScale
              hhScreen = ((marking.width || 40) * msy / 2 + 6) * svgScale
            } else if (marking.type === 'stopLine' || marking.type === 'waitLine' || marking.type === 'sharkTeeth') {
              hwScreen = (roadWidth / 2 + 6) * svgScale
              const thk = marking.type === 'sharkTeeth' ? 8 * msy : (marking.type === 'stopLine' ? 3 : 2) * msy
              hhScreen = (thk / 2 + 6) * svgScale
            } else if (marking.type === 'blockedArea') {
              const bDef = BLOCKED_AREA_DEFS[marking.areaType]
              if (bDef) {
                const bCb = bDef.contentBox
                const bWidthPct = marking.widthPercent ?? 30
                const hPct = marking.heightPercent ?? 15
                const targetW = (bWidthPct / 100) * roadWidth * msx
                const midArcR = (calc.innerRadius + calc.outerRadius) / 2
                const arcLen = ((hPct / 100) * calc.angle * Math.PI / 180) * midArcR
                const targetH = arcLen * msy
                const bScaleX = targetW / bCb.w
                const bScaleY = targetH / bCb.h
                hwScreen = (bCb.w * bScaleX / 2 + 6) * svgScale
                hhScreen = (bCb.h * bScaleY / 2 + 6) * svgScale
              } else {
                hwScreen = 20 * svgScale; hhScreen = 20 * svgScale
              }
            } else if (marking.type === 'arrow') {
              const def = ARROW_DEFS[marking.arrowType]
              if (def) {
                const midRadius = (calc.innerRadius + calc.outerRadius) / 2
                const arcLength = midRadius * (calc.angle * Math.PI / 180)
                const scaleByWidth = (laneWidth * 0.6) / def.width
                const scaleByHeight = (arcLength * 0.15) / def.height
                const baseScale = Math.min(scaleByWidth, scaleByHeight)
                hwScreen = (def.width * baseScale * msx / 2 + 6) * svgScale
                hhScreen = (def.height * baseScale * msy / 2 + 6) * svgScale
              } else {
                hwScreen = 15 * svgScale; hhScreen = 15 * svgScale
              }
            } else if (marking.type === 'speedNumber') {
              const fontSize = laneWidth * 0.55
              hwScreen = ((marking.value >= 100 ? fontSize * 1.8 : fontSize * 1.2) * msx / 2 + 6) * svgScale
              hhScreen = (fontSize * 1.1 * msy / 2 + 6) * svgScale
            } else if (marking.type === 'textMarking') {
              const fontSize = laneWidth * 0.4
              if (marking.orientation === 'vertical') {
                const charH = fontSize * 1.3
                hwScreen = (fontSize * 0.8 * msx / 2 + 6) * svgScale
                hhScreen = (marking.text.length * charH * msy / 2 + 6) * svgScale
              } else {
                hwScreen = (marking.text.length * fontSize * 0.65 * msx / 2 + 6) * svgScale
                hhScreen = (fontSize * 1.1 * msy / 2 + 6) * svgScale
              }
            } else if (marking.type === 'symbolMarking') {
              const sDef = SYMBOL_DEFS[marking.symbolType]
              if (sDef) {
                const targetH = laneWidth * 0.8
                const baseScale = targetH / sDef.height
                hwScreen = (sDef.width * baseScale * msx / 2 + 6) * svgScale
                hhScreen = (sDef.height * baseScale * msy / 2 + 6) * svgScale
              } else {
                hwScreen = 15 * svgScale; hhScreen = 15 * svgScale
              }
            } else if (marking.type === 'laneLine') {
              if (marking.fullLength) {
                // Gesamte Kurve — große Bounding-Box
                const rw = calc.outerRadius - calc.innerRadius
                const mr = marking.xPercent !== undefined
                  ? calc.innerRadius + (marking.xPercent / 100) * rw
                  : calc.innerRadius + (marking.laneIndex + 0.5) * laneWidth
                const aRad = (calc.angle * Math.PI) / 180
                const chordW = 2 * mr * Math.sin(aRad / 2)
                const sagitta = mr * (1 - Math.cos(aRad / 2))
                hwScreen = (Math.max(chordW, sagitta) / 2 + 6) * svgScale
                hhScreen = (Math.max(chordW, sagitta) / 2 + 6) * svgScale
              } else {
                const segSize = 15 * msy
                hwScreen = (segSize / 2 + 6) * svgScale
                hhScreen = (segSize / 2 + 6) * svgScale
              }
            } else {
              hwScreen = 15 * svgScale; hhScreen = 15 * svgScale
            }

            // Screen-Zentrum für Drag-Berechnungen
            const centerAbsX = screenX + containerRect.left
            const centerAbsY = screenY + containerRect.top
            const rotHandleDist = 20

            // Visuelle Rotation des Elements: Tangente + User-Rotation
            // Auf der Kurve ist die Tangenten-Rotation = 90 - posAngle (in SVG-Koordinaten)
            // Aber nach CTM-Transformation müssen wir die Screen-Rotation aus der CTM ableiten
            const tangentRotDeg = 90 - posAngle
            const userRot = marking.rotation || 0
            // CTM enthält evtl. eine Rotation (durch die <g transform="rotate(...)"> im SVG)
            const ctmRotDeg = Math.atan2(ctm.b, ctm.a) * (180 / Math.PI)
            const visualRotDeg = ctmRotDeg + tangentRotDeg + userRot

            const hs = 7  // Handle-Größe
            // Handle-Positionen relativ zum Zentrum (unrotiert), werden per CSS rotate gedreht
            const handles: { key: string; dx: number; dy: number; cursor: string; axis: 'both' | 'x' | 'y' }[] = [
              { key: 'nw', dx: -hwScreen - hs/2, dy: -hhScreen - hs/2, cursor: 'nwse-resize', axis: 'both' },
              { key: 'ne', dx: +hwScreen - hs/2, dy: -hhScreen - hs/2, cursor: 'nesw-resize', axis: 'both' },
              { key: 'sw', dx: -hwScreen - hs/2, dy: +hhScreen - hs/2, cursor: 'nesw-resize', axis: 'both' },
              { key: 'se', dx: +hwScreen - hs/2, dy: +hhScreen - hs/2, cursor: 'nwse-resize', axis: 'both' },
              { key: 'n', dx: -hs/2, dy: -hhScreen - hs/2, cursor: 'ns-resize', axis: 'y' },
              { key: 's', dx: -hs/2, dy: +hhScreen - hs/2, cursor: 'ns-resize', axis: 'y' },
              { key: 'w', dx: -hwScreen - hs/2, dy: -hs/2, cursor: 'ew-resize', axis: 'x' },
              { key: 'e', dx: +hwScreen - hs/2, dy: -hs/2, cursor: 'ew-resize', axis: 'x' },
            ]

            // Rotierte Positionen berechnen
            const rotRad = (visualRotDeg * Math.PI) / 180
            const cosR = Math.cos(rotRad)
            const sinR = Math.sin(rotRad)
            const rotatePoint = (dx: number, dy: number) => ({
              x: screenX + dx * cosR - dy * sinR,
              y: screenY + dx * sinR + dy * cosR,
            })

            // Rotate-Handle Position (oben am Element, rotiert)
            const rotHandlePos = rotatePoint(0, -hhScreen - rotHandleDist)
            const rotLineStart = rotatePoint(0, -hhScreen)

            return (
              <>
                {/* Verbindungslinie zum Rotate-Handle */}
                <svg className="absolute inset-0" style={{ pointerEvents: 'none', overflow: 'visible' }}>
                  <line x1={rotLineStart.x} y1={rotLineStart.y} x2={rotHandlePos.x} y2={rotHandlePos.y} stroke="#3b82f6" strokeWidth={1} />
                </svg>

                {/* Rotate-Handle (Kreis) */}
                <div className="absolute" style={{
                  left: rotHandlePos.x - 5, top: rotHandlePos.y - 5,
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'white', border: '1.5px solid #3b82f6',
                  cursor: 'crosshair', pointerEvents: 'auto', zIndex: 60,
                }}
                  onMouseDown={(e) => {
                    e.stopPropagation(); e.preventDefault()
                    setMarkingDraggingId(marking.id)
                    setMarkingDragMode('rotate')
                    markingDragOriginRef.current = {
                      x: e.clientX, y: e.clientY,
                      startRotation: marking.rotation || 0,
                      startScaleX: msx, startScaleY: msy,
                      centerScreenX: centerAbsX, centerScreenY: centerAbsY,
                    }
                  }}
                />

                {/* 8 Scale-Handles (rotiert um Elementzentrum) */}
                {handles.map(h => {
                  const pos = rotatePoint(h.dx + hs/2, h.dy + hs/2)
                  return (
                    <div key={h.key} className="absolute" style={{
                      width: hs, height: hs,
                      left: pos.x - hs/2, top: pos.y - hs/2,
                      background: 'white', border: '1.5px solid #3b82f6',
                      cursor: h.cursor, pointerEvents: 'auto', zIndex: 60,
                    }}
                      onMouseDown={(e) => {
                        e.stopPropagation(); e.preventDefault()
                        setMarkingDraggingId(marking.id)
                        setMarkingDragMode('scale')
                        const dist = Math.sqrt((e.clientX - centerAbsX) ** 2 + (e.clientY - centerAbsY) ** 2) || 1
                        markingDragOriginRef.current = {
                          x: e.clientX, y: e.clientY,
                          startRotation: marking.rotation || 0,
                          startScaleX: msx, startScaleY: msy,
                          centerScreenX: centerAbsX, centerScreenY: centerAbsY,
                          startDistance: dist, startHwScreen: hwScreen, startHhScreen: hhScreen,
                          scaleAxis: h.axis,
                        }
                      }}
                    />
                  )
                })}
              </>
            )
          })()}
          
        </div>
      </div>

      {/* Unten: - Spur Button */}
      <button
        onClick={() => canRemoveLane && updatePartial({ lanes: config.lanes - 1, width: widthForLanes(totalLanes - 1) })}
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

// ============================================================================
// SVG-Komponenten
// ============================================================================

function RoadSurface({ innerRadius, outerRadius, angle, viewBoxSize, config }: {
  innerRadius: number
  outerRadius: number
  angle: number
  viewBoxSize: number
  config: SmartRoadConfig
}) {
  // Oberflächenfarbe basierend auf config.surface.type
  const getSurfaceColor = () => {
    const surfaceType = config.surface?.type || 'asphalt'
    switch (surfaceType) {
      case 'asphalt': return '#6b6b6b'
      case 'pavement': return '#8a8a7a'
      case 'cobblestone': return '#7a7a6a'
      case 'concrete': return '#9a9a9a'
      case 'gravel': return '#a89080'
      default: return '#6b6b6b'
    }
  }
  
  // Randlinien nur wenn kein Radweg vorhanden (Radweg hat eigene Trennlinie)
  const hasRightCyclePath = config.rightSide?.cyclePath?.type === 'separated' || 
                            config.rightSide?.cyclePath?.type === 'lane' || 
                            config.rightSide?.cyclePath?.type === 'advisory'
  const hasLeftCyclePath = config.leftSide?.cyclePath?.type === 'separated' || 
                           config.leftSide?.cyclePath?.type === 'lane' || 
                           config.leftSide?.cyclePath?.type === 'advisory'
  
  return (
    <>
      <path d={createArcRingPath(innerRadius, outerRadius, angle, viewBoxSize)} fill={getSurfaceColor()} />
      {!hasRightCyclePath && (
        <path d={createArcPath(outerRadius - 1, angle, viewBoxSize)} fill="none" stroke={COLORS.edgeLine} strokeWidth={2} />
      )}
      {!hasLeftCyclePath && (
        <path d={createArcPath(innerRadius + 1, angle, viewBoxSize)} fill="none" stroke={COLORS.edgeLine} strokeWidth={2} />
      )}
    </>
  )
}

// On-Road Cycle Lanes (Radfahrstreifen/Schutzstreifen auf Fahrbahn)
function OnRoadCycleLanes({ config, innerRadius, outerRadius, angle, viewBoxSize, hoveredZone, onHover, onClick }: {
  config: SmartRoadConfig
  innerRadius: number
  outerRadius: number
  angle: number
  viewBoxSize: number
  hoveredZone: HoveredZone
  onHover: (zone: HoveredZone) => void
  onClick: (e: React.MouseEvent, zone: ZoneType, side?: ZoneSide) => void
}) {
  const left = config.leftSide
  const right = config.rightSide
  const isAsphalt = !config.surface?.type || config.surface.type === 'asphalt'
  
  // Nur bei Asphalt anzeigen
  if (!isAsphalt) return null
  
  const cycleWidth = 25
  const elements: React.ReactElement[] = []
  
  // Linker Radfahrstreifen (am inneren Rand)
  if (left?.cyclePath?.type === 'lane' || left?.cyclePath?.type === 'advisory') {
    const surface = left.cyclePath.surface || 'red'
    const color = surface === 'red' ? '#c45c5c' : '#6b6b6b'
    const isHovered = hoveredZone?.type === 'onRoadCyclePath' && hoveredZone?.side === 'left'
    const lineType = left.cyclePath.lineType || 'solid'
    
    elements.push(
      <g 
        key="onroad-cycle-left"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ type: 'onRoadCyclePath', side: 'left' })}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => onClick(e, 'onRoadCyclePath', 'left')}
      >
        <path d={createArcRingPath(innerRadius, innerRadius + cycleWidth, angle, viewBoxSize)} fill={color} />
        {isHovered && <path d={createArcRingPath(innerRadius, innerRadius + cycleWidth, angle, viewBoxSize)} fill={ZONE_COLORS.onRoadCyclePath} />}
        {/* Trennlinie - nur wenn nicht 'none' */}
        {lineType === 'solid' && (
          <path d={createArcPath(innerRadius + cycleWidth, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} />
        )}
        {lineType === 'dashed' && (
          <path d={createArcPath(innerRadius + cycleWidth, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="10 15" />
        )}
      </g>
    )
  }
  
  // Rechter Radfahrstreifen (am äußeren Rand)
  if (right?.cyclePath?.type === 'lane' || right?.cyclePath?.type === 'advisory') {
    const surface = right.cyclePath.surface || 'red'
    const color = surface === 'red' ? '#c45c5c' : '#6b6b6b'
    const isHovered = hoveredZone?.type === 'onRoadCyclePath' && hoveredZone?.side === 'right'
    const lineType = right.cyclePath.lineType || 'solid'
    
    elements.push(
      <g
        key="onroad-cycle-right"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ type: 'onRoadCyclePath', side: 'right' })}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => onClick(e, 'onRoadCyclePath', 'right')}
      >
        <path d={createArcRingPath(outerRadius - cycleWidth, outerRadius, angle, viewBoxSize)} fill={color} />
        {isHovered && <path d={createArcRingPath(outerRadius - cycleWidth, outerRadius, angle, viewBoxSize)} fill={ZONE_COLORS.onRoadCyclePath} />}
        {/* Trennlinie - nur wenn nicht 'none' */}
        {lineType === 'solid' && (
          <path d={createArcPath(outerRadius - cycleWidth, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} />
        )}
        {lineType === 'dashed' && (
          <path d={createArcPath(outerRadius - cycleWidth, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="10 15" />
        )}
      </g>
    )
  }
  
  return <>{elements}</>
}


function getArcElementFill(type: RoadsideElementType, side: RoadsideConfig | undefined): string {
  switch (type) {
    case 'sidewalk': {
      const s = side?.sidewalk?.surface || 'tiles'
      return s === 'concrete' ? '#b8b8b8' : s === 'pavement' ? '#a0a0a0' : '#c8c0b0'
    }
    case 'curb': return side?.curb === 'lowered' ? '#606060' : '#4a4a4a'
    case 'cyclePath': return side?.cyclePath?.surface === 'asphalt' ? '#6b6b6b' : '#c45c5c'
    case 'greenStrip': return '#5a7a5a'
    case 'barrier': return '#d4d4d4'
    case 'emergencyLane': return '#6b6b6b'
    case 'parking': return '#6b6b6b'
    default: return '#888'
  }
}

function OuterSideElements({ config, outerRadius, angle, viewBoxSize, hoveredZone, onHover, onDoubleClick, onDragMouseDown, onDragMouseMove, onDragOver, onDragMouseUp, draggedElement, dropTargetIndex }: {
  config: SmartRoadConfig
  outerRadius: number
  angle: number
  viewBoxSize: number
  hoveredZone: HoveredZone
  onHover: (zone: HoveredZone) => void
  onDoubleClick: (e: React.MouseEvent, zone: ZoneType, side?: ZoneSide) => void
  onDragMouseDown: (el: RoadsideElementType, side: 'left' | 'right', e: React.MouseEvent) => void
  onDragMouseMove: (e: React.MouseEvent) => void
  onDragOver: (index: number) => void
  onDragMouseUp: (e: React.MouseEvent, zone: ZoneType, side: ZoneSide) => void
  draggedElement: RoadsideElementType | null
  dropTargetIndex: number | null
}) {
  const right = config.rightSide
  const order = getActiveOrder(right)
  // Außen: von außen nach innen (reversed), outerRadius ist der äußerste Rand
  const reversed = [...order].reverse()
  let currentRadius = outerRadius + getSideWidth(right)
  const elements: React.ReactElement[] = []
  
  for (let ri = 0; ri < reversed.length; ri++) {
    const el = reversed[ri]
    const w = getElementWidth(right!, el)
    if (w <= 0) continue
    const zone = el as ZoneType
    const isHovered = hoveredZone?.type === zone && hoveredZone.side === 'right'
    const isDragged = draggedElement === el
    const realIdx = order.indexOf(el)
    const isDropTarget = dropTargetIndex === realIdx
    
    elements.push(
      <g key={el}
        style={{ cursor: draggedElement ? 'grabbing' : 'pointer', opacity: isDragged ? 0.4 : 1 }}
        onMouseEnter={() => !draggedElement && onHover({ type: zone, side: 'right' })}
        onMouseLeave={() => !draggedElement && onHover(null)}
        onMouseDown={(e) => onDragMouseDown(el, 'right', e)}
        onMouseUp={(e) => onDragMouseUp(e, zone, 'right')}
        onDoubleClick={(e) => onDoubleClick(e, zone, 'right')}
        onMouseMove={(ev) => { onDragMouseMove(ev); if (draggedElement && draggedElement !== el) onDragOver(realIdx) }}
      >
        <path d={createArcRingPath(currentRadius - w, currentRadius, angle, viewBoxSize)} fill={getArcElementFill(el, right)} />
        
        {/* Spezial: Trennlinie */}
        {(el === 'emergencyLane' || el === 'parking') && (
          <path d={createArcPath(currentRadius - w, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} />
        )}
        {el === 'cyclePath' && right?.cyclePath?.lineType !== 'none' && (
          <path d={createArcPath(currentRadius - w, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2}
            strokeDasharray={right?.cyclePath?.lineType === 'dashed' ? '10 15' : undefined} />
        )}
        {el === 'parking' && (() => {
          const orient = right?.parking?.orientation || 'parallel'
          const spotAngle = orient === 'parallel' ? 18 : orient === 'perpendicular' ? 8 : 10
          const innerR = currentRadius - w
          const outerR = currentRadius
          const lines: React.ReactElement[] = []
          for (let a = spotAngle; a < angle; a += spotAngle) {
            const aRad = (a * Math.PI) / 180
            const x1 = viewBoxSize - innerR * Math.sin(aRad)
            const y1 = viewBoxSize - innerR * Math.cos(aRad)
            const x2 = viewBoxSize - outerR * Math.sin(aRad)
            const y2 = viewBoxSize - outerR * Math.cos(aRad)
            lines.push(<line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth={1.5} />)
          }
          return lines
        })()}
        
        {isHovered && !draggedElement && <path d={createArcRingPath(currentRadius - w, currentRadius, angle, viewBoxSize)} fill={ZONE_COLORS[zone] || 'rgba(59,130,246,0.15)'} />}
        {isDropTarget && draggedElement && <path d={createArcPath(currentRadius - w, angle, viewBoxSize)} fill="none" stroke="#3b82f6" strokeWidth={3} />}
      </g>
    )
    currentRadius -= w
  }
  
  return <>{elements}</>
}

function InnerSideElements({ config, innerRadius, angle, viewBoxSize, hoveredZone, onHover, onDoubleClick, onDragMouseDown, onDragMouseMove, onDragOver, onDragMouseUp, draggedElement, dropTargetIndex }: {
  config: SmartRoadConfig
  innerRadius: number
  angle: number
  viewBoxSize: number
  hoveredZone: HoveredZone
  onHover: (zone: HoveredZone) => void
  onDoubleClick: (e: React.MouseEvent, zone: ZoneType, side?: ZoneSide) => void
  onDragMouseDown: (el: RoadsideElementType, side: 'left' | 'right', e: React.MouseEvent) => void
  onDragMouseMove: (e: React.MouseEvent) => void
  onDragOver: (index: number) => void
  onDragMouseUp: (e: React.MouseEvent, zone: ZoneType, side: ZoneSide) => void
  draggedElement: RoadsideElementType | null
  dropTargetIndex: number | null
}) {
  const left = config.leftSide
  const order = getActiveOrder(left)
  let currentRadius = innerRadius
  const elements: React.ReactElement[] = []
  
  for (let i = 0; i < order.length; i++) {
    const el = order[i]
    const w = getElementWidth(left!, el)
    if (w <= 0) continue
    const zone = el as ZoneType
    const isHovered = hoveredZone?.type === zone && hoveredZone.side === 'left'
    const isDragged = draggedElement === el
    const isDropTarget = dropTargetIndex === i
    
    currentRadius -= w
    if (currentRadius < 0) continue
    
    elements.push(
      <g key={el}
        style={{ cursor: draggedElement ? 'grabbing' : 'pointer', opacity: isDragged ? 0.4 : 1 }}
        onMouseEnter={() => !draggedElement && onHover({ type: zone, side: 'left' })}
        onMouseLeave={() => !draggedElement && onHover(null)}
        onMouseDown={(e) => onDragMouseDown(el, 'left', e)}
        onMouseUp={(e) => onDragMouseUp(e, zone, 'left')}
        onDoubleClick={(e) => onDoubleClick(e, zone, 'left')}
        onMouseMove={(ev) => { onDragMouseMove(ev); if (draggedElement && draggedElement !== el) onDragOver(i) }}
      >
        <path d={createArcRingPath(currentRadius, currentRadius + w, angle, viewBoxSize)} fill={getArcElementFill(el, left)} />
        
        {(el === 'emergencyLane' || el === 'parking') && (
          <path d={createArcPath(currentRadius + w, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} />
        )}
        {el === 'cyclePath' && left?.cyclePath?.lineType !== 'none' && (
          <path d={createArcPath(currentRadius + w, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2}
            strokeDasharray={left?.cyclePath?.lineType === 'dashed' ? '10 15' : undefined} />
        )}
        {el === 'parking' && (() => {
          const orient = left?.parking?.orientation || 'parallel'
          const spotAngle = orient === 'parallel' ? 18 : orient === 'perpendicular' ? 8 : 10
          const innerR = currentRadius
          const outerR = currentRadius + w
          const lines: React.ReactElement[] = []
          for (let a = spotAngle; a < angle; a += spotAngle) {
            const aRad = (a * Math.PI) / 180
            const x1 = viewBoxSize - innerR * Math.sin(aRad)
            const y1 = viewBoxSize - innerR * Math.cos(aRad)
            const x2 = viewBoxSize - outerR * Math.sin(aRad)
            const y2 = viewBoxSize - outerR * Math.cos(aRad)
            lines.push(<line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth={1.5} />)
          }
          return lines
        })()}
        
        {isHovered && !draggedElement && <path d={createArcRingPath(currentRadius, currentRadius + w, angle, viewBoxSize)} fill={ZONE_COLORS[zone] || 'rgba(59,130,246,0.15)'} />}
        {isDropTarget && draggedElement && <path d={createArcPath(currentRadius + w, angle, viewBoxSize)} fill="none" stroke="#3b82f6" strokeWidth={3} />}
      </g>
    )
  }
  
  return <>{elements}</>
}

function LaneMarkings({ config, innerRadius, outerRadius, angle, viewBoxSize, hoveredZone, onHover, onClick }: {
  config: SmartRoadConfig
  innerRadius: number
  outerRadius: number
  angle: number
  viewBoxSize: number
  hoveredZone: HoveredZone
  onHover: (zone: HoveredZone) => void
  onClick: (e: React.MouseEvent, zone: ZoneType, side?: ZoneSide, index?: number) => void
}) {
  const lanes = (config.lanes)
  const laneWidth = (outerRadius - innerRadius) / lanes
  const elements: React.ReactElement[] = []
  
  // Spurlinien
  for (let i = 1; i < lanes; i++) {
    const lineRadius = innerRadius + i * laneWidth
    
    const markingType = config.lines?.[i - 1]?.type || config.defaultLineType || 'dashed'
    if (markingType === 'none') continue
    
    // Tram-Überlappung: Linie nicht rendern wenn Gleise darüber liegen
    if (config.tram && config.category === 'strasse') {
      const tramWidth = config.tram.width || (config.tram.tracks === 1 ? 20 : 36)
      const tramCenterRadius = innerRadius + (outerRadius - innerRadius) / 2
      const tramHalfWidth = tramWidth / 2
      if (lineRadius >= tramCenterRadius - tramHalfWidth - 2 && lineRadius <= tramCenterRadius + tramHalfWidth + 2) {
        continue
      }
    }
    
    const isHovered = hoveredZone?.type === 'laneLine' && hoveredZone.index === i - 1
    
    // Bei Kurven: Innen = kleinerer Radius, Außen = größerer Radius
    const GAP = 14 // Abstand zu den Straßenenden (wie bei geraden Straßen)
    
    // Dash-Offset: Gleicher Lückenabstand am Anfang und Ende
    // Das SVG dash-pattern startet mit einem Strich. Wir wollen aber am Anfang
    // und Ende je eine halbe Lücke, damit keine abgeschnittenen Striche entstehen.
    const calcDashOffset = (radius: number) => {
      const arcLen = ((angle * Math.PI) / 180) * radius - 2 * GAP
      if (arcLen <= 0) return 0
      const dashOn = 15
      const dashOff = 25
      const cycle = dashOn + dashOff
      // Wie viele volle Striche passen rein (mit Lücken dazwischen)?
      // Pattern: [gap/2] [strich] [lücke] [strich] [lücke] ... [strich] [gap/2]
      // = n * dashOn + (n-1) * dashOff + 2 * halfGap = arcLen
      // → n * dashOn + (n-1) * dashOff = arcLen
      // → n * (dashOn + dashOff) - dashOff = arcLen
      // → n = (arcLen + dashOff) / cycle
      const n = Math.floor((arcLen + dashOff) / cycle)
      if (n <= 0) return 0
      const usedLen = n * dashOn + (n - 1) * dashOff
      const halfGap = (arcLen - usedLen) / 2
      // Offset = negativer halfGap verschiebt den Pattern-Start nach rechts,
      // sodass der erste Strich erst nach halfGap beginnt
      return -halfGap
    }
    
    const renderLaneLine = () => {
      const dOff = calcDashOffset(lineRadius)
      switch (markingType) {
        case 'dashed':
          return <path d={createArcPath(lineRadius, angle, viewBoxSize, GAP)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} strokeDasharray="15 25" strokeDashoffset={dOff} />
        case 'solid':
          return <path d={createArcPath(lineRadius, angle, viewBoxSize)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} />
        case 'double-solid':
          return (
            <>
              <path d={createArcPath(lineRadius - 2, angle, viewBoxSize)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} />
              <path d={createArcPath(lineRadius + 2, angle, viewBoxSize)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} />
            </>
          )
        case 'solid-dashed':
          return (
            <>
              <path d={createArcPath(lineRadius - 2, angle, viewBoxSize)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} />
              <path d={createArcPath(lineRadius + 2, angle, viewBoxSize, GAP)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} strokeDasharray="15 25" strokeDashoffset={calcDashOffset(lineRadius + 2)} />
            </>
          )
        case 'dashed-solid':
          return (
            <>
              <path d={createArcPath(lineRadius - 2, angle, viewBoxSize, GAP)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} strokeDasharray="15 25" strokeDashoffset={calcDashOffset(lineRadius - 2)} />
              <path d={createArcPath(lineRadius + 2, angle, viewBoxSize)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} />
            </>
          )
        case 'green-strip': {
          const greenWidth = config.lines?.[i - 1]?.width || 12
          return (
            <>
              <path d={createArcRingPath(lineRadius - greenWidth / 2, lineRadius + greenWidth / 2, angle, viewBoxSize)} fill={COLORS.medianGreen} />
              <path d={createArcPath(lineRadius - greenWidth / 2, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} />
              <path d={createArcPath(lineRadius + greenWidth / 2, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={2} />
            </>
          )
        }
        case 'barrier': {
          const totalBarrierWidth = config.lines?.[i - 1]?.width || 12
          const bw = totalBarrierWidth * 0.25
          const cw = (totalBarrierWidth - bw) / 2
          return (
            <>
              {/* Clearance innen */}
              <path d={createArcRingPath(lineRadius - totalBarrierWidth / 2, lineRadius - totalBarrierWidth / 2 + cw, angle, viewBoxSize)} fill="#888888" />
              {/* Leitplanke */}
              <path d={createArcRingPath(lineRadius - bw / 2, lineRadius + bw / 2, angle, viewBoxSize)} fill="#d4d4d4" />
              {/* Clearance außen */}
              <path d={createArcRingPath(lineRadius + bw / 2, lineRadius + totalBarrierWidth / 2, angle, viewBoxSize)} fill="#888888" />
              {/* Randlinien */}
              <path d={createArcPath(lineRadius - totalBarrierWidth / 2, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={3} />
              <path d={createArcPath(lineRadius + totalBarrierWidth / 2, angle, viewBoxSize)} fill="none" stroke="#ffffff" strokeWidth={3} />
            </>
          )
        }
        default:
          return <path d={createArcPath(lineRadius, angle, viewBoxSize, GAP)} fill="none" stroke={COLORS.laneLine} strokeWidth={2} strokeDasharray="15 25" strokeDashoffset={dOff} />
      }
    }
    
    elements.push(
      <g key={`lane-${i}`} style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ type: 'laneLine', index: i - 1 })}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => onClick(e, 'laneLine', undefined, i - 1)}
      >
        {renderLaneLine()}
        {/* Breiterer Klickbereich */}
        <path d={createArcPath(lineRadius, angle, viewBoxSize)} fill="none" stroke="transparent" strokeWidth={12} />
        {isHovered && <path d={createArcPath(lineRadius, angle, viewBoxSize)} fill="none" stroke={ZONE_COLORS.laneLine} strokeWidth={8} />}
      </g>
    )
  }
  
  // Tram-Gleise rendern (wenn vorhanden)
  if (config.tram && config.category === 'strasse') {
    const tram = config.tram
    const tramWidth = tram.width || (tram.tracks === 1 ? 20 : 36)
    const tramCenterRadius = innerRadius + (outerRadius - innerRadius) / 2
    const tramHalfWidth = tramWidth / 2
    const trackColor = tram.trackType === 'grass' ? '#6a8f4e' : tram.trackType === 'dedicated' ? '#888888' : '#5a5a5a'
    const gaugeWidth = 10
    const gap = 4
    const isHoveredTram = hoveredZone?.type === 'tram'

    // Schwellenpositionen einmal basierend auf tramCenterRadius berechnen
    const tieSpacing2 = 20
    const refArcLength2 = (angle * Math.PI / 180) * tramCenterRadius
    const tieCount2 = Math.floor(refArcLength2 / tieSpacing2)

    const renderRailPair = (centerR: number, key: string) => {
      const tieWidth = gaugeWidth + 6
      const showTies = tram.trackType === 'embedded'

      return (
        <g key={key}>
          {showTies && Array.from({ length: tieCount2 }, (_, idx) => {
            const tieAngle = ((idx + 0.5) / tieCount2) * angle
            const tieAngleRad = (tieAngle * Math.PI) / 180
            const cos = Math.cos(tieAngleRad)
            const sin = Math.sin(tieAngleRad)
            const innerR = centerR - tieWidth / 2
            const outerR = centerR + tieWidth / 2
            const x1 = viewBoxSize - innerR * sin
            const y1 = viewBoxSize - innerR * cos
            const x2 = viewBoxSize - outerR * sin
            const y2 = viewBoxSize - outerR * cos
            return <line key={`${key}-tie-${idx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b7355" strokeWidth={3} opacity={0.6} />
          })}
          <path d={createArcPath(centerR - gaugeWidth / 2, angle, viewBoxSize)} fill="none" stroke="#c0c0c0" strokeWidth={2} />
          <path d={createArcPath(centerR + gaugeWidth / 2, angle, viewBoxSize)} fill="none" stroke="#c0c0c0" strokeWidth={2} />
        </g>
      )
    }
    
    elements.push(
      <g key="tram" style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ type: 'tram' })}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => onClick(e, 'tram')}
      >
        {/* Gleisbett */}
        <path d={createArcRingPath(tramCenterRadius - tramHalfWidth, tramCenterRadius + tramHalfWidth, angle, viewBoxSize)} fill={trackColor} />
        {/* Bordsteine bei dedicated/grass */}
        {(tram.trackType === 'dedicated' || tram.trackType === 'grass') && (
          <>
            <path d={createArcPath(tramCenterRadius - tramHalfWidth, angle, viewBoxSize)} fill="none" stroke="#999" strokeWidth={2} />
            <path d={createArcPath(tramCenterRadius + tramHalfWidth, angle, viewBoxSize)} fill="none" stroke="#999" strokeWidth={2} />
          </>
        )}
        {/* Schienen */}
        {tram.tracks === 1 
          ? renderRailPair(tramCenterRadius, 'track-0')
          : (
            <>
              {renderRailPair(tramCenterRadius - gap / 2 - gaugeWidth / 2, 'track-0')}
              {renderRailPair(tramCenterRadius + gap / 2 + gaugeWidth / 2, 'track-1')}
            </>
          )
        }
        {/* Klickfläche */}
        <path d={createArcRingPath(tramCenterRadius - tramHalfWidth, tramCenterRadius + tramHalfWidth, angle, viewBoxSize)} fill="transparent" />
        {isHoveredTram && <path d={createArcRingPath(tramCenterRadius - tramHalfWidth - 2, tramCenterRadius + tramHalfWidth + 2, angle, viewBoxSize)} fill="rgba(245, 158, 11, 0.25)" />}
      </g>
    )
  }
  
  return <>{elements}</>
}

// ============================================================================
// Geometrie-Helfer
// ============================================================================

function createArcRingPath(innerR: number, outerR: number, angle: number, viewBoxSize: number): string {
  if (innerR < 0) innerR = 0
  if (outerR <= innerR) return ''
  
  const angleRad = (angle * Math.PI) / 180
  const largeArc = angle > 180 ? 1 : 0
  
  const outerStartX = viewBoxSize
  const outerStartY = viewBoxSize - outerR
  const innerStartX = viewBoxSize
  const innerStartY = viewBoxSize - innerR
  
  const outerEndX = viewBoxSize - outerR * Math.sin(angleRad)
  const outerEndY = viewBoxSize - outerR * Math.cos(angleRad)
  const innerEndX = viewBoxSize - innerR * Math.sin(angleRad)
  const innerEndY = viewBoxSize - innerR * Math.cos(angleRad)
  
  return [
    `M ${outerStartX.toFixed(2)} ${outerStartY.toFixed(2)}`,
    `A ${outerR.toFixed(2)} ${outerR.toFixed(2)} 0 ${largeArc} 0 ${outerEndX.toFixed(2)} ${outerEndY.toFixed(2)}`,
    `L ${innerEndX.toFixed(2)} ${innerEndY.toFixed(2)}`,
    `A ${innerR.toFixed(2)} ${innerR.toFixed(2)} 0 ${largeArc} 1 ${innerStartX.toFixed(2)} ${innerStartY.toFixed(2)}`,
    'Z'
  ].join(' ')
}

function createArcPath(radius: number, angle: number, viewBoxSize: number, gapPx = 0): string {
  if (radius <= 0) return ''
  
  // Gap in Grad umrechnen (Bogenlänge = radius * winkel_rad)
  const gapAngle = gapPx > 0 ? (gapPx / radius) * (180 / Math.PI) : 0
  const startAngle = gapAngle
  const endAngle = angle - gapAngle
  if (endAngle <= startAngle) return ''
  
  const startAngleRad = (startAngle * Math.PI) / 180
  const endAngleRad = (endAngle * Math.PI) / 180
  const arcSpan = endAngle - startAngle
  const largeArc = arcSpan > 180 ? 1 : 0
  
  const startX = viewBoxSize - radius * Math.sin(startAngleRad)
  const startY = viewBoxSize - radius * Math.cos(startAngleRad)
  const endX = viewBoxSize - radius * Math.sin(endAngleRad)
  const endY = viewBoxSize - radius * Math.cos(endAngleRad)
  
  return `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArc} 0 ${endX.toFixed(2)} ${endY.toFixed(2)}`
}

function getSideWidth(side?: SmartRoadConfig['leftSide']): number {
  if (!side) return 0
  return getActiveOrder(side).reduce((w, el) => w + getElementWidth(side, el), 0)
}

// ==================== CURVE ARROW MARKINGS ====================

type CurveArrowMarkingsProps = {
  config: SmartRoadConfig
  innerRadius: number
  outerRadius: number
  angle: number
  viewBoxSize: number
  updatePartial: (updates: Partial<SmartRoadConfig>) => void
  onSelect: (id: string | null) => void
  draggingId: string | null
  setDraggingId: (id: string | null) => void
  dragMode: 'move' | 'rotate' | 'scale' | null
  setDragMode: (mode: 'move' | 'rotate' | 'scale' | null) => void
  dragOriginRef: React.MutableRefObject<{
    x: number; y: number
    startRotation: number
    startScaleX: number; startScaleY: number
    centerScreenX?: number; centerScreenY?: number
    startDistance?: number
    startHwScreen?: number; startHhScreen?: number
    scaleAxis?: 'both' | 'x' | 'y'
  } | null>
}

function CurveArrowMarkings({ 
  config, 
  innerRadius, 
  outerRadius,
  angle, 
  viewBoxSize,
  updatePartial,
  onSelect,
  draggingId,
  setDraggingId,
  dragMode,
  setDragMode,
  dragOriginRef,
}: CurveArrowMarkingsProps) {
  const markings = config.markings || []
  const laneWidth = (outerRadius - innerRadius) / (config.lanes)
  
  const getArrowPosition = (laneIndex: number, positionPercent: number, xPercent?: number) => {
    const roadWidth = outerRadius - innerRadius
    const markRadius = xPercent !== undefined 
      ? innerRadius + (xPercent / 100) * roadWidth
      : innerRadius + (laneIndex + 0.5) * laneWidth
    const positionAngle = (positionPercent / 100) * angle
    const positionAngleRad = (positionAngle * Math.PI) / 180
    const x = viewBoxSize - markRadius * Math.sin(positionAngleRad)
    const y = viewBoxSize - markRadius * Math.cos(positionAngleRad)
    const tangentRotation = 90 - positionAngle
    return { x, y, tangentRotation, laneRadius: markRadius }
  }
  
  const svgToMarkingPosition = (svgX: number, svgY: number) => {
    const dx = viewBoxSize - svgX
    const dy = viewBoxSize - svgY
    const radius = Math.sqrt(dx * dx + dy * dy)
    let angleRad = Math.atan2(dx, dy)
    if (angleRad < 0) angleRad += 2 * Math.PI
    const angleInDegrees = (angleRad * 180) / Math.PI
    const positionPercent = Math.max(0, Math.min(100, (angleInDegrees / angle) * 100))
    const roadWidth = outerRadius - innerRadius
    const radiusPercent = Math.max(0, Math.min(100, ((radius - innerRadius) / roadWidth) * 100))
    const laneFloat = (radius - innerRadius) / laneWidth - 0.5
    const laneIndex = Math.round(laneFloat)
    const clampedLaneIndex = Math.max(0, Math.min((config.lanes) - 1, laneIndex))
    return { laneIndex: clampedLaneIndex, positionPercent, radiusPercent }
  }
  
  const handleMouseDown = (e: React.MouseEvent, markingId: string) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect(markingId)
    setDraggingId(markingId)
    setDragMode('move')
    const marking = markings.find(m => m.id === markingId)
    dragOriginRef.current = { x: e.clientX, y: e.clientY, startRotation: marking?.rotation || 0, startScaleX: marking?.scaleX ?? marking?.scale ?? 1, startScaleY: marking?.scaleY ?? marking?.scale ?? 1 }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || dragMode !== 'move') return
    
    const svg = (e.target as Element).closest('svg')
    if (!svg) return
    
    const rect = svg.getBoundingClientRect()
    const viewBox = svg.viewBox.baseVal
    const scaleX = viewBox.width / rect.width
    const scaleY = viewBox.height / rect.height
    const svgX = viewBox.x + (e.clientX - rect.left) * scaleX
    const svgY = viewBox.y + (e.clientY - rect.top) * scaleY
    
    const { positionPercent, radiusPercent } = svgToMarkingPosition(svgX, svgY)
    const isFreeMode = e.shiftKey
    
    const newMarkings = markings.map(m => {
      if (m.id !== draggingId) return m
      
      const clampedPos = Math.max(5, Math.min(95, positionPercent))
      
      // Einheitliches Snapping für ALLE Markierungstypen:
      // Normal = Snap auf nächste Spurmitte, Shift = frei
      if (isFreeMode) {
        return { ...m, positionPercent: clampedPos, xPercent: radiusPercent }
      } else {
        const lanes = config.lanes
        const halfLane = 50 / lanes
        const snappedX = Math.round(radiusPercent / halfLane) * halfLane
        const clampedX = Math.max(0, Math.min(100, snappedX))
        return { ...m, positionPercent: clampedPos, xPercent: clampedX }
      }
    })
    updatePartial({ markings: newMarkings })
  }
  
  const handleMouseUp = () => {
    setDraggingId(null)
    setDragMode(null)
    dragOriginRef.current = null
  }
  
  const handleDoubleClick = (e: React.MouseEvent, markingId: string) => {
    e.preventDefault()
    e.stopPropagation()
    updatePartial({ markings: markings.filter(m => m.id !== markingId) })
    onSelect(null)
  }
  
  const handleWheel = (e: React.WheelEvent, markingId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const marking = markings.find(m => m.id === markingId)
    if (!marking) return
    const rotationDelta = e.deltaY > 0 ? 15 : -15
    const currentRotation = marking.rotation || 0
    let newRotation = (currentRotation + rotationDelta) % 360
    if (newRotation < 0) newRotation += 360
    updatePartial({ markings: markings.map(m => m.id === markingId ? { ...m, rotation: newRotation } : m) })
  }
  
  if (markings.length === 0) return null
  
  // Bogenlänge für Height-Begrenzung
  const midRadius = (innerRadius + outerRadius) / 2
  const arcLength = midRadius * (angle * Math.PI / 180)
  
  return (
    <g 
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {markings.map((marking) => {
        if (marking.type === 'arrow') {
        const def = ARROW_DEFS[marking.arrowType]
        if (!def) return null
        
        const msx = marking.scaleX ?? marking.scale ?? 1
        const msy = marking.scaleY ?? marking.scale ?? 1

        // Skalierung: Breite = 60% der Spur, Höhe max 15% der Bogenlänge
        const scaleByWidth = (laneWidth * 0.6) / def.width
        const scaleByHeight = (arcLength * 0.15) / def.height
        const baseScale = Math.min(scaleByWidth, scaleByHeight)
        const totalScaleX = baseScale * msx
        const totalScaleY = baseScale * msy

        const { x, y, tangentRotation } = getArrowPosition(marking.laneIndex, marking.positionPercent, marking.xPercent)
        const totalRotation = tangentRotation + (marking.rotation || 0)
        const isDragging = draggingId === marking.id
        const scaledW = def.width * totalScaleX
        const scaledH = def.height * totalScaleY

        return (
          <g
            key={marking.id}
            transform={`translate(${x}, ${y}) rotate(${totalRotation}) translate(${-scaledW / 2}, ${-scaledH / 2}) scale(${totalScaleX}, ${totalScaleY})`}
            style={{
              cursor: isDragging ? 'grabbing' : 'pointer',
              opacity: isDragging ? 0.7 : 1,
              filter: undefined,
            }}
            onMouseDown={(e) => handleMouseDown(e, marking.id)}
            onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
            onWheel={(e) => handleWheel(e, marking.id)}
          >
            <g dangerouslySetInnerHTML={{ __html: marking.color ? def.svg.replace(/fill="#ffffff"/g, `fill="${marking.color}"`).replace(/fill="#FFFFFF"/g, `fill="${marking.color}"`) : def.svg }} />
            {/* Hitbox */}
            {(() => {
              const avgScale = (totalScaleX + totalScaleY) / 2
              return <rect x={-10 / avgScale} y={-10 / avgScale} width={def.width + 20 / avgScale} height={def.height + 20 / avgScale} fill="transparent" data-marking-hitbox="true" />
            })()}
          </g>
        )
        }
        
        if (marking.type === 'laneLine') {
          const msx = marking.scaleX ?? marking.scale ?? 1
          const msy = marking.scaleY ?? marking.scale ?? 1
          const lt = marking.lineType
          const cllColor = marking.color || '#ffffff'
          const isDragging = draggingId === marking.id
          const isFullLength = !!marking.fullLength

          // Radius: xPercent → freie Position, sonst Spurmitte
          const roadWidth = outerRadius - innerRadius
          const markRadius = marking.xPercent !== undefined
            ? innerRadius + (marking.xPercent / 100) * roadWidth
            : innerRadius + (marking.laneIndex + 0.5) * laneWidth

          const posAngle = (marking.positionPercent / 100) * angle
          const posAngRad = (posAngle * Math.PI) / 180
          const gap = 3 * msx
          const angleRad = (angle * Math.PI) / 180

          if (isFullLength) {
            // Gesamte Kurvenlänge — Dashes winkelsynchron mit Spurlinien
            const GAP_REF = 14
            // Nächste Spurlinie als Referenz-Radius für Dash-Ausrichtung
            const numLanes = config.lanes || 2
            let refR = innerRadius + laneWidth
            for (let i = 2; i < numLanes; i++) {
              const sepR = innerRadius + i * laneWidth
              if (Math.abs(sepR - markRadius) < Math.abs(refR - markRadius)) refR = sepR
            }
            // Einzelne Dash-Segmente an exakten Winkelpositionen der Referenz-Spurlinie
            const refArcLen = ((angle * Math.PI) / 180) * refR - 2 * GAP_REF
            const nRef = refArcLen > 0 ? Math.floor((refArcLen + 25) / 40) : 0
            const refHalfGap = nRef > 0 ? (refArcLen - (nRef * 15 + (nRef - 1) * 25)) / 2 : 0
            const mkFullArc = (r: number, dashed: boolean) => {
              if (dashed) {
                // Jeder Strich wird als eigener Bogen an der exakten Winkelposition gerendert
                const segs: React.ReactElement[] = []
                for (let i = 0; i < nRef; i++) {
                  const dashStart = GAP_REF + refHalfGap + i * 40
                  const dashEnd = dashStart + 15
                  const a1 = dashStart / refR
                  const a2 = dashEnd / refR
                  const x1 = viewBoxSize - r * Math.sin(a1)
                  const y1 = viewBoxSize - r * Math.cos(a1)
                  const x2 = viewBoxSize - r * Math.sin(a2)
                  const y2 = viewBoxSize - r * Math.cos(a2)
                  const span = (a2 - a1) * (180 / Math.PI)
                  const la = span > 180 ? 1 : 0
                  segs.push(<path key={`${r}-${i}`} d={`M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${la} 0 ${x2.toFixed(2)} ${y2.toFixed(2)}`} fill="none" stroke={cllColor} strokeWidth={2 * msx} />)
                }
                return <>{segs}</>
              }
              return <path key={r} d={createArcPath(r, angle, viewBoxSize)} fill="none" stroke={cllColor} strokeWidth={2 * msx} />
            }
            const lineContent = (() => {
              if (lt === 'solid') return mkFullArc(markRadius, false)
              else if (lt === 'double-solid') return <>{mkFullArc(markRadius - gap / 2, false)}{mkFullArc(markRadius + gap / 2, false)}</>
              else if (lt === 'solid-dashed') return <>{mkFullArc(markRadius - gap / 2, false)}{mkFullArc(markRadius + gap / 2, true)}</>
              else return <>{mkFullArc(markRadius - gap / 2, true)}{mkFullArc(markRadius + gap / 2, false)}</>
            })()

            // Hitbox am Mittelpunkt der Kurve
            const midAngRad = angleRad / 2
            const hx = viewBoxSize - markRadius * Math.sin(midAngRad)
            const hy = viewBoxSize - markRadius * Math.cos(midAngRad)

            return (
              <g key={marking.id}
                style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.7 : 1, filter: undefined }}
                onMouseDown={(e) => handleMouseDown(e, marking.id)}
                onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
                onWheel={(e) => handleWheel(e, marking.id)}
              >
                {lineContent}
                <circle cx={hx} cy={hy} r={20} fill="transparent" data-marking-hitbox="true" />
              </g>
            )
          } else {
            // Kurzes Segment (~15px)
            const segLen = 15 * msy
            const halfAngRad = (segLen / 2) / markRadius
            const da = `${3 * msy} ${3 * msy}`

            const mkArcSeg = (r: number, dashed: boolean) => {
              const a1 = posAngRad - halfAngRad
              const a2 = posAngRad + halfAngRad
              const steps = 8
              const pts: string[] = []
              for (let s = 0; s <= steps; s++) {
                const a = a1 + (a2 - a1) * (s / steps)
                const px = viewBoxSize - r * Math.sin(a)
                const py = viewBoxSize - r * Math.cos(a)
                pts.push(`${s === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)}`)
              }
              return <path key={r} d={pts.join(' ')} fill="none" stroke={cllColor} strokeWidth={2 * msx} strokeDasharray={dashed ? da : undefined} />
            }

            const lineContent = (() => {
              if (lt === 'solid') return mkArcSeg(markRadius, false)
              else if (lt === 'double-solid') return <>{mkArcSeg(markRadius - gap / 2, false)}{mkArcSeg(markRadius + gap / 2, false)}</>
              else if (lt === 'solid-dashed') return <>{mkArcSeg(markRadius - gap / 2, false)}{mkArcSeg(markRadius + gap / 2, true)}</>
              else return <>{mkArcSeg(markRadius - gap / 2, true)}{mkArcSeg(markRadius + gap / 2, false)}</>
            })()

            const hx = viewBoxSize - markRadius * Math.sin(posAngRad)
            const hy = viewBoxSize - markRadius * Math.cos(posAngRad)

            return (
              <g key={marking.id}
                style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.7 : 1, filter: undefined }}
                onMouseDown={(e) => handleMouseDown(e, marking.id)}
                onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
                onWheel={(e) => handleWheel(e, marking.id)}
              >
                {lineContent}
                <circle cx={hx} cy={hy} r={segLen} fill="transparent" data-marking-hitbox="true" />
              </g>
            )
          }
        }

        // ===== GESCHWINDIGKEITSZAHLEN =====
        if (marking.type === 'speedNumber') {
          const { x, y, tangentRotation } = getArrowPosition(marking.laneIndex, marking.positionPercent, marking.xPercent)
          const totalRotation = tangentRotation + (marking.rotation || 0)
          const isDragging = draggingId === marking.id
          const sx = marking.scaleX ?? marking.scale ?? 1
          const sy = marking.scaleY ?? marking.scale ?? 1
          const fontSize = laneWidth * 0.55
          const textW = (marking.value >= 100 ? fontSize * 1.8 : fontSize * 1.2) * sx
          const textH = fontSize * 1.1 * sy

          return (
            <g key={marking.id}
              transform={`translate(${x}, ${y}) rotate(${totalRotation})`}
              style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.7 : 1, filter: undefined }}
              onMouseDown={(e) => handleMouseDown(e, marking.id)}
              onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
              onWheel={(e) => handleWheel(e, marking.id)}
            >
              <text
                x={0} y={fontSize * 0.35 * sy}
                textAnchor="middle" fill={marking.color || '#ffffff'}
                fontFamily="Arial, sans-serif" fontWeight="bold" fontSize={fontSize}
                transform={`scale(${sx}, ${sy})`}
                style={{ filter: undefined }}
              >{marking.value}</text>
              <rect x={-textW / 2} y={-textH / 2} width={textW} height={textH}
                fill="transparent" data-marking-hitbox="true" />
            </g>
          )
        }

        // ===== TEXTMARKIERUNGEN =====
        if (marking.type === 'textMarking') {
          const { x, y, tangentRotation } = getArrowPosition(marking.laneIndex, marking.positionPercent, marking.xPercent)
          const totalRotation = tangentRotation + (marking.rotation || 0)
          const isDragging = draggingId === marking.id
          const sx = marking.scaleX ?? marking.scale ?? 1
          const sy = marking.scaleY ?? marking.scale ?? 1
          const fontSize = laneWidth * 0.4

          if (marking.orientation === 'vertical') {
            const chars = marking.text.split('')
            const charH = fontSize * 1.3
            const totalH = chars.length * charH * sy
            const totalW = fontSize * 0.8 * sx

            return (
              <g key={marking.id}
                transform={`translate(${x}, ${y}) rotate(${totalRotation})`}
                style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.7 : 1, filter: undefined }}
                onMouseDown={(e) => handleMouseDown(e, marking.id)}
                onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
                onWheel={(e) => handleWheel(e, marking.id)}
              >
                {chars.map((c, i) => (
                  <text key={i}
                    x={0} y={(-totalH / 2 + charH * 0.8 + i * charH) / (sy || 1)}
                    textAnchor="middle" fill={marking.color || '#ffffff'}
                    fontFamily="Arial, sans-serif" fontWeight="bold" fontSize={fontSize}
                    transform={`scale(${sx}, ${sy})`}
                    style={{ filter: undefined }}
                  >{c}</text>
                ))}
                <rect x={-totalW / 2} y={-totalH / 2} width={totalW} height={totalH}
                  fill="transparent" data-marking-hitbox="true" />
              </g>
            )
          }

          // horizontal
          const textW = marking.text.length * fontSize * 0.65 * sx
          const textH = fontSize * 1.1 * sy
          return (
            <g key={marking.id}
              transform={`translate(${x}, ${y}) rotate(${totalRotation})`}
              style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.7 : 1, filter: undefined }}
              onMouseDown={(e) => handleMouseDown(e, marking.id)}
              onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
              onWheel={(e) => handleWheel(e, marking.id)}
            >
              <text
                x={0} y={fontSize * 0.35 * sy}
                textAnchor="middle" fill={marking.color || '#ffffff'}
                fontFamily="Arial, sans-serif" fontWeight="bold" fontSize={fontSize}
                transform={`scale(${sx}, ${sy})`}
                style={{ filter: undefined }}
              >{marking.text}</text>
              <rect x={-textW / 2} y={-textH / 2} width={textW} height={textH}
                fill="transparent" data-marking-hitbox="true" />
            </g>
          )
        }

        // ===== SYMBOLMARKIERUNGEN =====
        if (marking.type === 'symbolMarking') {
          const def = SYMBOL_DEFS[marking.symbolType]
          if (!def) return null

          const { x, y, tangentRotation } = getArrowPosition(marking.laneIndex, marking.positionPercent, marking.xPercent)
          const totalRotation = tangentRotation + (marking.rotation || 0)
          const isDragging = draggingId === marking.id
          const sx = marking.scaleX ?? marking.scale ?? 1
          const sy = marking.scaleY ?? marking.scale ?? 1

          const targetH = laneWidth * 0.8
          const baseScale = targetH / def.height
          const scaleX = baseScale * sx
          const scaleY = baseScale * sy
          const scaledW = def.width * scaleX
          const scaledH = def.height * scaleY

          const useBody = def.svgBody.includes('<text') || def.svgBody.includes('<circle')

          return (
            <g key={marking.id}
              transform={`translate(${x}, ${y}) rotate(${totalRotation})`}
              style={{ cursor: isDragging ? 'grabbing' : 'pointer', opacity: isDragging ? 0.7 : 1, filter: undefined }}
              onMouseDown={(e) => handleMouseDown(e, marking.id)}
              onDoubleClick={(e) => handleDoubleClick(e, marking.id)}
              onWheel={(e) => handleWheel(e, marking.id)}
            >
              {useBody ? (
                <g transform={`translate(${-scaledW / 2}, ${-scaledH / 2}) scale(${scaleX}, ${scaleY})`}
                  dangerouslySetInnerHTML={{ __html: marking.color ? def.svgBody.replace(/fill="#fff(?:fff)?"/g, `fill="${marking.color}"`).replace(/fill="white"/g, `fill="${marking.color}"`) : def.svgBody }}
                />
              ) : (
                <g transform={`translate(${-scaledW / 2}, ${-scaledH / 2}) scale(${scaleX}, ${scaleY})`}>
                  {def.paths.map((p, i) => (
                    <path key={i} d={p.d} fill={marking.color && p.fill !== 'none' ? marking.color : p.fill} />
                  ))}
                </g>
              )}
              <rect x={-scaledW / 2} y={-scaledH / 2} width={scaledW} height={scaledH}
                fill="transparent" data-marking-hitbox="true" />
            </g>
          )
        }

        return null
      })}
    </g>
  )
}

export default InteractiveCurvePreview