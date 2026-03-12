// src/modules/library/roads/inspector/svg/MedianAndLanes.tsx
// SVG-Elemente für ALLE Linien zwischen Spuren, On-Road Radwege und On-Road Parkplätze
// VEREINFACHT: Keine separate Median-Logik mehr. Jede Linie wird einheitlich gerendert.

import type { SmartRoadConfig } from '../../types'
import type { HoveredZone, ZoneType, ZoneSide, LaneLineInfo } from '../previewTypes'
import { ZONE_COLORS, ZONE_BORDER_COLORS } from '../previewTypes'
import { calculateDashOffset } from '../utils'

type Props = {
  config: SmartRoadConfig
  leftSideWidth: number
  lines: LaneLineInfo[]
  showLaneLines: boolean
  hoveredZone: HoveredZone
  onHover: (zone: HoveredZone) => void
  onClick: (e: React.MouseEvent, zone: ZoneType, index?: number, side?: ZoneSide) => void
}

export function MedianAndLanes({
  config,
  leftSideWidth,
  lines,
  showLaneLines,
  hoveredZone,
  onHover,
  onClick,
}: Props) {
  const isAsphalt = (config.surface?.type || 'asphalt') === 'asphalt'
  
  // On-Road Radweg Konfiguration
  const leftOnRoad = config.leftSide?.cyclePath
  const rightOnRoad = config.rightSide?.cyclePath
  const hasLeftOnRoad = isAsphalt && (leftOnRoad?.type === 'lane' || leftOnRoad?.type === 'advisory')
  const hasRightOnRoad = isAsphalt && (rightOnRoad?.type === 'lane' || rightOnRoad?.type === 'advisory')
  
  // On-Road Parkplätze Konfiguration
  const leftParking = config.leftSide?.parking
  const rightParking = config.rightSide?.parking
  const hasLeftOnRoadParking = isAsphalt && leftParking?.type === 'on-road'
  const hasRightOnRoadParking = isAsphalt && rightParking?.type === 'on-road'
  const leftParkingWidth = hasLeftOnRoadParking 
    ? Math.min(leftParking?.width || 25, 25) 
    : (leftParking?.width || 25)
  const rightParkingWidth = hasRightOnRoadParking 
    ? Math.min(rightParking?.width || 25, 25) 
    : (rightParking?.width || 25)
  
  const onRoadLaneWidth = 25
  
  // Dash-Offset für Radweg-Linien
  const dashOffset = (() => {
    const lineLength = config.length
    const dashCycle = 24
    const roadCenter = lineLength / 2
    const idealStrichStart = roadCenter - 4
    const cycleNumber = Math.floor(idealStrichStart / dashCycle)
    const actualStrichStart = cycleNumber * dashCycle
    return actualStrichStart - idealStrichStart
  })()
  
  // Parkplatz-Markierungen
  const renderParkingLines = (
    x: number, 
    width: number, 
    orientation: 'parallel' | 'perpendicular' | 'angled',
    side: 'left' | 'right'
  ) => {
    const parkLines: React.ReactNode[] = []
    
    if (orientation === 'parallel') {
      const spotLength = 50
      for (let y = spotLength; y < config.length; y += spotLength) {
        parkLines.push(
          <line key={`parking-${side}-${y}`} x1={x} y1={y} x2={x + width} y2={y} stroke="#ffffff" strokeWidth={1.5} />
        )
      }
    } else if (orientation === 'perpendicular') {
      const spotWidth = 25
      for (let y = spotWidth; y < config.length; y += spotWidth) {
        parkLines.push(
          <line key={`parking-${side}-${y}`} x1={x} y1={y} x2={x + width} y2={y} stroke="#ffffff" strokeWidth={1.5} />
        )
      }
    } else {
      // Schrägparken: gleichmäßige schräge Linien im 60° Winkel
      const spotWidth = 25
      const angleOffset = spotWidth * 0.6  // ~60° Winkel, fest basierend auf Abstand
      for (let y = 0; y < config.length; y += spotWidth) {
        parkLines.push(
          <line key={`parking-${side}-${y}`} x1={x} y1={y} x2={x + width} y2={y + angleOffset} stroke="#ffffff" strokeWidth={1.5} />
        )
      }
    }
    
    return parkLines
  }
  
  return (
    <>
      {/* ============ ON-ROAD PARKPLÄTZE ============ */}
      
      {hasLeftOnRoadParking && (
        <g style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover({ type: 'parking', side: 'left' })}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => onClick(e, 'parking', undefined, 'left')}
        >
          <rect x={leftSideWidth + 2} y={0} width={leftParkingWidth} height={config.length} fill="rgba(100, 100, 100, 0.15)" />
          {renderParkingLines(leftSideWidth + 2, leftParkingWidth, leftParking?.orientation || 'parallel', 'left')}
          <line x1={leftSideWidth + 2 + leftParkingWidth} y1={0} x2={leftSideWidth + 2 + leftParkingWidth} y2={config.length} stroke="#ffffff" strokeWidth={2} />
          {hoveredZone?.type === 'parking' && hoveredZone.side === 'left' && (
            <rect x={leftSideWidth + 2} y={0} width={leftParkingWidth} height={config.length} fill={ZONE_COLORS.parking} stroke={ZONE_BORDER_COLORS.parking} strokeWidth={2} />
          )}
        </g>
      )}
      
      {hasRightOnRoadParking && (
        <g style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover({ type: 'parking', side: 'right' })}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => onClick(e, 'parking', undefined, 'right')}
        >
          <rect x={leftSideWidth + config.width - rightParkingWidth - 2} y={0} width={rightParkingWidth} height={config.length} fill="rgba(100, 100, 100, 0.15)" />
          {renderParkingLines(leftSideWidth + config.width - rightParkingWidth - 2, rightParkingWidth, rightParking?.orientation || 'parallel', 'right')}
          <line x1={leftSideWidth + config.width - rightParkingWidth - 2} y1={0} x2={leftSideWidth + config.width - rightParkingWidth - 2} y2={config.length} stroke="#ffffff" strokeWidth={2} />
          {hoveredZone?.type === 'parking' && hoveredZone.side === 'right' && (
            <rect x={leftSideWidth + config.width - rightParkingWidth - 2} y={0} width={rightParkingWidth} height={config.length} fill={ZONE_COLORS.parking} stroke={ZONE_BORDER_COLORS.parking} strokeWidth={2} />
          )}
        </g>
      )}
      
      {/* ============ ON-ROAD RADWEGE ============ */}
      
      {hasLeftOnRoad && (
        <g style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover({ type: 'onRoadCyclePath', side: 'left' })}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => onClick(e, 'onRoadCyclePath', undefined, 'left')}
        >
          <rect
            x={leftSideWidth + 2 + (hasLeftOnRoadParking ? leftParkingWidth : 0)}
            y={0} width={onRoadLaneWidth} height={config.length}
            fill={leftOnRoad?.surface === 'red' ? '#c45c5c' : 'transparent'}
            opacity={leftOnRoad?.surface === 'red' ? 0.7 : 1}
          />
          {leftOnRoad?.lineType !== 'none' && (
            <line
              x1={leftSideWidth + 2 + (hasLeftOnRoadParking ? leftParkingWidth : 0) + onRoadLaneWidth}
              y1={0}
              x2={leftSideWidth + 2 + (hasLeftOnRoadParking ? leftParkingWidth : 0) + onRoadLaneWidth}
              y2={config.length}
              stroke="#ffffff" strokeWidth={2}
              strokeDasharray={leftOnRoad?.lineType === 'dashed' ? '8 16' : undefined}
              strokeDashoffset={leftOnRoad?.lineType === 'dashed' ? dashOffset : undefined}
            />
          )}
          {hoveredZone?.type === 'onRoadCyclePath' && hoveredZone.side === 'left' && (
            <rect
              x={leftSideWidth + 2 + (hasLeftOnRoadParking ? leftParkingWidth : 0)}
              y={0} width={onRoadLaneWidth} height={config.length}
              fill={ZONE_COLORS.onRoadCyclePath}
            />
          )}
        </g>
      )}
      
      {hasRightOnRoad && (
        <g style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover({ type: 'onRoadCyclePath', side: 'right' })}
          onMouseLeave={() => onHover(null)}
          onClick={(e) => onClick(e, 'onRoadCyclePath', undefined, 'right')}
        >
          <rect
            x={leftSideWidth + config.width - onRoadLaneWidth - 2 - (hasRightOnRoadParking ? rightParkingWidth : 0)}
            y={0} width={onRoadLaneWidth} height={config.length}
            fill={rightOnRoad?.surface === 'red' ? '#c45c5c' : 'transparent'}
            opacity={rightOnRoad?.surface === 'red' ? 0.7 : 1}
          />
          {rightOnRoad?.lineType !== 'none' && (
            <line
              x1={leftSideWidth + config.width - onRoadLaneWidth - 2 - (hasRightOnRoadParking ? rightParkingWidth : 0)}
              y1={0}
              x2={leftSideWidth + config.width - onRoadLaneWidth - 2 - (hasRightOnRoadParking ? rightParkingWidth : 0)}
              y2={config.length}
              stroke="#ffffff" strokeWidth={2}
              strokeDasharray={rightOnRoad?.lineType === 'dashed' ? '8 16' : undefined}
              strokeDashoffset={rightOnRoad?.lineType === 'dashed' ? dashOffset : undefined}
            />
          )}
          {hoveredZone?.type === 'onRoadCyclePath' && hoveredZone.side === 'right' && (
            <rect
              x={leftSideWidth + config.width - onRoadLaneWidth - 2 - (hasRightOnRoadParking ? rightParkingWidth : 0)}
              y={0} width={onRoadLaneWidth} height={config.length}
              fill={ZONE_COLORS.onRoadCyclePath}
            />
          )}
        </g>
      )}
      
      {/* ============ ALLE LINIEN ZWISCHEN SPUREN (VEREINHEITLICHT) ============ */}
      
      {showLaneLines && lines.map((line) => {
        const lineX = leftSideWidth + line.x
        const isHovered = hoveredZone?.type === 'laneLine' && hoveredZone.index === line.index
        const lineWidth = line.width || 12
        
        // Tram-Überlappung: Linie nicht rendern wenn Gleise darüber liegen
        if (config.tram) {
          const tram = config.tram
          const tramWidth = tram.width || (tram.tracks === 1 ? 20 : 36)
          const tramX = tram.position === 'left' 
            ? leftSideWidth + 4
            : tram.position === 'right'
              ? leftSideWidth + config.width - tramWidth - 4
              : leftSideWidth + (config.width - tramWidth) / 2
          const tramEnd = tramX + tramWidth
          // Linie fällt in den Tram-Bereich → nicht rendern
          if (lineX >= tramX - 2 && lineX <= tramEnd + 2) {
            return null
          }
        }
        
        // Physische Trenner (Grünstreifen, Leitplanke) rendern
        if (line.type === 'green-strip') {
          return (
            <g key={`line-${line.index}`} style={{ cursor: 'pointer' }}
              onMouseEnter={() => onHover({ type: 'laneLine', index: line.index })}
              onMouseLeave={() => onHover(null)}
              onClick={(e) => onClick(e, 'laneLine', line.index)}
            >
              <rect x={lineX - lineWidth / 2} y={0} width={lineWidth} height={config.length} fill="#4a7c59" />
              <line x1={lineX - lineWidth / 2} y1={0} x2={lineX - lineWidth / 2} y2={config.length} stroke="#ffffff" strokeWidth={2} />
              <line x1={lineX + lineWidth / 2} y1={0} x2={lineX + lineWidth / 2} y2={config.length} stroke="#ffffff" strokeWidth={2} />
              {isHovered && (
                <rect x={lineX - lineWidth / 2 - 3} y={0} width={lineWidth + 6} height={config.length}
                  fill={ZONE_COLORS.laneLine} rx={4} style={{ pointerEvents: 'none' }} />
              )}
              <rect x={lineX - lineWidth / 2 - 5} y={0} width={lineWidth + 10} height={config.length} fill="transparent" />
            </g>
          )
        }
        
        if (line.type === 'barrier') {
          const barrierWidth = lineWidth * 0.25
          const clearanceWidth = (lineWidth - barrierWidth) / 2
          return (
            <g key={`line-${line.index}`} style={{ cursor: 'pointer' }}
              onMouseEnter={() => onHover({ type: 'laneLine', index: line.index })}
              onMouseLeave={() => onHover(null)}
              onClick={(e) => onClick(e, 'laneLine', line.index)}
            >
              {/* Clearance links */}
              <rect x={lineX - lineWidth / 2} y={0} width={clearanceWidth} height={config.length} fill="#888888" />
              {/* Leitplanke */}
              <rect x={lineX - barrierWidth / 2} y={0} width={barrierWidth} height={config.length} fill="#d4d4d4" />
              {/* Clearance rechts */}
              <rect x={lineX + barrierWidth / 2} y={0} width={clearanceWidth} height={config.length} fill="#888888" />
              {/* Randlinien */}
              <line x1={lineX - lineWidth / 2} y1={0} x2={lineX - lineWidth / 2} y2={config.length} stroke="#ffffff" strokeWidth={3} />
              <line x1={lineX + lineWidth / 2} y1={0} x2={lineX + lineWidth / 2} y2={config.length} stroke="#ffffff" strokeWidth={3} />
              {isHovered && (
                <rect x={lineX - lineWidth / 2 - 3} y={0} width={lineWidth + 6} height={config.length}
                  fill={ZONE_COLORS.laneLine} rx={4} style={{ pointerEvents: 'none' }} />
              )}
              <rect x={lineX - lineWidth / 2 - 5} y={0} width={lineWidth + 10} height={config.length} fill="transparent" />
            </g>
          )
        }
        
        // Standard-Linien (dashed, solid, double-solid, solid-dashed, dashed-solid)
        const halfGap = 14
        const hasSolid = line.type === 'solid' || line.type === 'solid-dashed' || line.type === 'dashed-solid'
        const y1 = hasSolid ? 0 : halfGap
        const y2 = hasSolid ? config.length : config.length - halfGap
        const lineLength = y2 - y1
        const hasDashed = line.type === 'dashed' || line.type === 'solid-dashed' || line.type === 'dashed-solid'
        const lineDashOffset = hasDashed ? calculateDashOffset(lineLength) : 0
        
        return (
          <g key={`line-${line.index}`} style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover({ type: 'laneLine', index: line.index })}
            onMouseLeave={() => onHover(null)}
            onClick={(e) => onClick(e, 'laneLine', line.index)}
          >
            {/* Einfache Linien */}
            {(line.type === 'dashed' || line.type === 'solid') && (
              <line x1={lineX} y1={y1} x2={lineX} y2={y2}
                stroke="#ffffff" strokeWidth={2}
                strokeDasharray={line.type === 'dashed' ? '24 48' : undefined}
                strokeDashoffset={line.type === 'dashed' ? lineDashOffset : undefined}
              />
            )}
            
            {/* Double-Solid */}
            {line.type === 'double-solid' && (
              <>
                <line x1={lineX - 1.5} y1={0} x2={lineX - 1.5} y2={config.length} stroke="#ffffff" strokeWidth={2} />
                <line x1={lineX + 1.5} y1={0} x2={lineX + 1.5} y2={config.length} stroke="#ffffff" strokeWidth={2} />
              </>
            )}
            
            {/* Solid-Dashed */}
            {line.type === 'solid-dashed' && (
              <>
                <line x1={lineX - 1.5} y1={y1} x2={lineX - 1.5} y2={y2} stroke="#ffffff" strokeWidth={2} />
                <line x1={lineX + 1.5} y1={y1} x2={lineX + 1.5} y2={y2} stroke="#ffffff" strokeWidth={2}
                  strokeDasharray="24 48" strokeDashoffset={lineDashOffset} />
              </>
            )}
            
            {/* Dashed-Solid */}
            {line.type === 'dashed-solid' && (
              <>
                <line x1={lineX - 1.5} y1={y1} x2={lineX - 1.5} y2={y2} stroke="#ffffff" strokeWidth={2}
                  strokeDasharray="24 48" strokeDashoffset={lineDashOffset} />
                <line x1={lineX + 1.5} y1={y1} x2={lineX + 1.5} y2={y2} stroke="#ffffff" strokeWidth={2} />
              </>
            )}
            
            {/* Hover */}
            {isHovered && (
              <rect x={lineX - 8} y={0} width={16} height={config.length}
                fill={ZONE_COLORS.laneLine} rx={4} style={{ pointerEvents: 'none' }} />
            )}
            
            {/* Klickbereich */}
            <rect x={lineX - 12} y={0} width={24} height={config.length} fill="transparent" />
          </g>
        )
      })}
    </>
  )
}