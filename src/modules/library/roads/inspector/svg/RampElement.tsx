// src/modules/library/roads/inspector/svg/RampElement.tsx
// SVG-Element für Beschleunigungs-/Verzögerungsstreifen (nur rechts)

import type { SmartRoadConfig } from '../../types'
import type { HoveredZone, ZoneType, ZoneSide } from '../previewTypes'
import { ZONE_COLORS, ZONE_BORDER_COLORS } from '../previewTypes'

type Props = {
  config: SmartRoadConfig
  leftSideWidth: number
  hoveredZone: HoveredZone
  onHover: (zone: HoveredZone) => void
  onClick: (e: React.MouseEvent, zone: ZoneType, index?: number, side?: ZoneSide) => void
}

export function RampElement({
  config,
  leftSideWidth,
  hoveredZone,
  onHover,
  onClick,
}: Props) {
  const ramp = config.rightSide?.ramp
  if (!ramp) return null
  
  const roadRight = leftSideWidth + config.width
  const laneWidth = 30
  const roadLength = config.length
  const rampLength = Math.min(ramp.length || 200, roadLength)
  const isDecel = ramp.type === 'deceleration'
  
  // Kurve nur bei Beschleunigung
  const curveLen = laneWidth * 2.5
  
  // Positionen
  const rampStartY = isDecel ? 0 : roadLength - rampLength
  const rampEndY = isDecel ? rampLength : roadLength
  const curveY = rampStartY + curveLen // Nur für Beschleunigung relevant
  
  // Trennlinie:
  // Beschleunigung: durchgezogen unten, gestrichelt oben (bis zur Kurve)
  // Verzögerung: gestrichelt oben, durchgezogen unten (gerader Streifen, keine Kurve)
  const lineLen = isDecel ? rampLength : (rampEndY - curveY)
  const solidLen = lineLen * 0.4
  
  let solidStartY: number, solidEndY: number, dashedStartY: number, dashedEndY: number
  if (isDecel) {
    // Verzögerung/Abfahrt: durchgezogen oben, gestrichelt unten
    solidStartY = rampStartY
    solidEndY = rampStartY + lineLen * 0.4
    dashedStartY = solidEndY
    dashedEndY = rampEndY
  } else {
    // Beschleunigung: durchgezogen unten, gestrichelt bis ganz oben
    solidStartY = rampEndY - solidLen
    solidEndY = rampEndY
    dashedStartY = rampStartY
    dashedEndY = solidStartY
  }
  const dashedLen = dashedEndY - dashedStartY
  
  // Pfad für die Rampenfläche
  const ol = 1
  let pathD: string
  if (isDecel) {
    // Verzögerung/Abfahrt: Oben breiter (Abfahrt kommt von rechts), Kurve gliedert sich ein
    // Spiegelbild der Beschleunigung: oben breit mit Kurve, unten normale Breite
    const exitX = roadRight + laneWidth * 1.8 // Startpunkt der Abfahrt (weiter rechts)
    pathD = [
      `M ${roadRight - ol},${rampStartY}`,
      `L ${exitX},${rampStartY}`,
      `C ${exitX},${rampStartY + curveLen * 0.3} ${roadRight + laneWidth},${rampStartY + curveLen * 0.5} ${roadRight + laneWidth},${rampStartY + curveLen}`,
      `L ${roadRight + laneWidth},${rampEndY}`,
      `L ${roadRight - ol},${rampEndY}`,
      'Z'
    ].join(' ')
  } else {
    // Beschleunigung/Auffahrt: Kurve oben (einlaufend), unten breit
    pathD = [
      `M ${roadRight - ol},${rampStartY}`,
      `C ${roadRight + laneWidth * 0.4},${rampStartY} ${roadRight + laneWidth},${rampStartY + curveLen * 0.3} ${roadRight + laneWidth},${curveY}`,
      `L ${roadRight + laneWidth},${rampEndY}`,
      `L ${roadRight - ol},${rampEndY}`,
      'Z'
    ].join(' ')
  }
  
  // Außenlinie
  let outerCurveD: string | null
  let outerLineY1: number
  let outerLineY2: number
  if (isDecel) {
    const exitX = roadRight + laneWidth * 1.8
    outerCurveD = [
      `M ${exitX},${rampStartY}`,
      `C ${exitX},${rampStartY + curveLen * 0.3} ${roadRight + laneWidth},${rampStartY + curveLen * 0.5} ${roadRight + laneWidth},${rampStartY + curveLen}`,
    ].join(' ')
    outerLineY1 = rampStartY + curveLen
    outerLineY2 = rampEndY
  } else {
    outerCurveD = [
      `M ${roadRight},${rampStartY}`,
      `C ${roadRight + laneWidth * 0.4},${rampStartY} ${roadRight + laneWidth},${rampStartY + curveLen * 0.3} ${roadRight + laneWidth},${curveY}`,
    ].join(' ')
    outerLineY1 = curveY
    outerLineY2 = rampEndY
  }
  
  // Dash-Offset für symmetrische Striche
  const dashCycle = 36
  const halfDashed = dashedLen / 2
  const idealStart = halfDashed - 6
  const n = Math.floor(idealStart / dashCycle)
  const dashOffset = n * dashCycle - idealStart

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover({ type: 'ramp', side: 'right' })}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => onClick(e, 'ramp', undefined, 'right')}
    >
      {/* Rampenfläche */}
      <path d={pathD} fill="#6b6b6b" />
      
      {/* Trennlinie: durchgezogen + gestrichelt */}
      <line x1={roadRight} y1={solidStartY} x2={roadRight} y2={solidEndY}
        stroke="#ffffff" strokeWidth={2} />
      <line x1={roadRight} y1={dashedStartY} x2={roadRight} y2={dashedEndY}
        stroke="#ffffff" strokeWidth={2} strokeDasharray="12 24" strokeDashoffset={dashOffset} />
      
      {/* Außenlinie: Kurve */}
      {outerCurveD && <path d={outerCurveD} stroke="#ffffff" strokeWidth={2} fill="none" />}
      {/* Außenlinie: Gerade */}
      <line x1={roadRight + laneWidth} y1={outerLineY1} x2={roadRight + laneWidth} y2={outerLineY2}
        stroke="#ffffff" strokeWidth={2} />
      
      {/* Verzögerung: Fahrbahnbegrenzung oben — trennt Abfahrt von Hauptfahrbahn */}
      {isDecel && (
        <line x1={roadRight} y1={rampStartY} x2={roadRight + laneWidth * 1.8} y2={rampStartY}
          stroke="#ffffff" strokeWidth={2} />
      )}
      
      {/* Hover-Overlay */}
      {hoveredZone?.type === 'ramp' && hoveredZone.side === 'right' && (
        <path d={pathD} fill={ZONE_COLORS.ramp} stroke={ZONE_BORDER_COLORS.ramp} strokeWidth={2} />
      )}
    </g>
  )
}