// src/modules/library/roads/generator/CurveRoadGenerator.ts

import type { SmartRoadConfig, RoadsideConfig, RoadsideElementType } from '../types'
import { ARROW_DEFS } from '../markings/arrowSvgs'
import { BLOCKED_AREA_DEFS } from '../markings/blockedAreaSvgs'
import { SYMBOL_DEFS } from '../markings/symbolSvgs'
import { getActiveOrder, getElementWidth } from '../types'
import { transformPathData, buildMatrix } from './utils/transformPath'

/**
 * CurveRoadGenerator - Generiert SVG für Kurvenstraßen
 * 
 * Geometrie:
 * - Kurve wird intern bei Mittelpunkt (totalOuterRadius, totalOuterRadius) gezeichnet
 * - Normalisierungsrotation: -(90° - angle) sorgt dafür, dass der Ausgang IMMER horizontal nach links zeigt
 *   - 90°-Kurven: 0° Rotation (Ausgang ist bereits horizontal)
 *   - 15°-Kurven: -75° Rotation (dreht den fast vertikalen Ausgang nach horizontal)
 * - Bei Linkskurve wird zusätzlich horizontal gespiegelt
 */
export class CurveRoadGenerator {
  private config: SmartRoadConfig
  // Vorberechnete Transform-Parameter für direkte Koordinatentransformation
  private rotRad = 0
  private cosR = 1
  private sinR = 0
  private mirrorX = false
  private cx = 0 // Kurvenzentrum
  
  constructor(config: SmartRoadConfig) {
    this.config = config
  }
  
  /**
   * Transformiert einen Punkt: Rotation + optionale Spiegelung
   * Ersetzt die SVG <g transform="rotate(...)"> damit Fabric.js
   * korrekte Bounding Boxes berechnet.
   */
  private tp(x: number, y: number): { x: number; y: number } {
    // Rotation um (cx, cx)
    const dx = x - this.cx
    const dy = y - this.cx
    let rx = this.cx + dx * this.cosR - dy * this.sinR
    const ry = this.cx + dx * this.sinR + dy * this.cosR
    // Spiegelung bei Linkskurve
    if (this.mirrorX) {
      rx = 2 * this.cx - rx
    }
    return { x: rx, y: ry }
  }
  
  /**
   * Generiert das Kurven-SVG
   */
  async generate(): Promise<string> {
    const { config } = this
    const curve = config.curve || { angle: 90, direction: 'right', radius: 100 }
    
    // Basis-Radien
    const innerRadius = curve.radius
    const roadWidth = config.width
    const outerRadius = innerRadius + roadWidth
    
    // Seitenelemente-Breiten
    const outerSideWidth = this.getRightSideWidth()
    const innerSideWidth = this.getLeftSideWidth()
    
    // Gesamtradien (inkl. Seitenelemente)
    const totalOuterRadius = outerRadius + outerSideWidth
    const totalInnerRadius = Math.max(0, innerRadius - innerSideWidth)
    
    // Internes Koordinatensystem: Mittelpunkt bei (cx, cy)
    const cx = totalOuterRadius
    const cy = totalOuterRadius
    
    // Normalisierungsrotation: Ausgang soll immer horizontal zeigen
    const baseRotationRad = (-(90 - curve.angle) * Math.PI) / 180
    const angleRad = (curve.angle * Math.PI) / 180
    
    // 🔥 Transform-Parameter für direkte Koordinatentransformation setzen
    this.rotRad = baseRotationRad
    this.cosR = Math.cos(baseRotationRad)
    this.sinR = Math.sin(baseRotationRad)
    this.mirrorX = curve.direction === 'left'
    this.cx = totalOuterRadius
    
    // Berechne Schlüsselpunkte der RECHTSKURVE (ViewBox wird immer für Rechtskurve berechnet)
    const points = [
      { x: cx, y: cy - totalOuterRadius },
      { x: cx - totalOuterRadius * Math.sin(angleRad), y: cy - totalOuterRadius * Math.cos(angleRad) },
      { x: cx, y: cy - totalInnerRadius },
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
    
    // Finde die Bounding Box
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
    const padding = 5
    
    // ViewBox für den relevanten Bereich
    const vbX = newLeft - padding
    const vbY = newTop - padding
    const vbWidth = (newRight - newLeft) + padding * 2
    const vbHeight = (newBottom - newTop) + padding * 2
    
    // viewBoxSize für interne Berechnungen (Kurvenzentrum)
    const viewBoxSize = Math.ceil(totalOuterRadius)
    
    // SVG-Inhalt generieren (Pfade werden direkt in finalen Koordinaten erzeugt via this.tp())
    const content = this.buildSvgContent(
      innerRadius,
      outerRadius,
      outerSideWidth,
      curve.angle,
      viewBoxSize
    )
    
    // Connectors berechnen (über this.tp())
    const connectorRadius = innerRadius + roadWidth / 2
    const connTop = this.tp(viewBoxSize, viewBoxSize - connectorRadius)
    const connBottom = this.tp(
      viewBoxSize - connectorRadius * Math.sin(angleRad),
      viewBoxSize - connectorRadius * Math.cos(angleRad)
    )
    
    const vbXr = Math.floor(vbX)
    const vbYr = Math.floor(vbY)
    const vbWr = Math.ceil(vbWidth)
    const vbHr = Math.ceil(vbHeight)
    
    // SVG — Pfade sind bereits in finalen Koordinaten (via this.tp()), kein <g transform> nötig
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbXr} ${vbYr} ${vbWr} ${vbHr}" width="${vbWr}" height="${vbHr}">
  ${content}
  <!-- Connectors -->
  <rect id="conn-top" x="${(connTop.x - 2).toFixed(1)}" y="${(connTop.y - 2).toFixed(1)}" width="4" height="4" fill="transparent"/>
  <rect id="conn-bottom" x="${(connBottom.x - 2).toFixed(1)}" y="${(connBottom.y - 2).toFixed(1)}" width="4" height="4" fill="transparent"/>
</svg>`
    
    return svg
  }
  
  /**
   * Baut den SVG-Inhalt
   */
  private buildSvgContent(
    innerRadius: number,
    outerRadius: number,
    outerSideWidth: number,
    angle: number,
    viewBoxSize: number
  ): string {
    const parts: string[] = []
    
    // ========== ÄUSSERE SEITENELEMENTE (rechts) — order-basiert ==========
    let currentOuterRadius = outerRadius + outerSideWidth
    
    // Von außen nach innen iterieren (reversed order)
    const rightOrder = getActiveOrder(this.config.rightSide).slice().reverse()
    for (const el of rightOrder) {
      const w = getElementWidth(this.config.rightSide!, el)
      if (w <= 0) continue
      this.renderCurveElement(parts, el, this.config.rightSide!, currentOuterRadius - w, currentOuterRadius, angle, viewBoxSize, 'outer')
      currentOuterRadius -= w
    }
    
    // ========== FAHRBAHN ==========
    const surfaceColor = this.getSurfaceColor()
    parts.push(this.createArcRing(innerRadius, outerRadius, angle, surfaceColor, viewBoxSize))
    
    // Randlinien nur wenn kein Radweg vorhanden (Radweg hat eigene Trennlinie)
    const hasRightCyclePath = this.config.rightSide?.cyclePath?.type === 'separated' || 
                              this.config.rightSide?.cyclePath?.type === 'lane' || 
                              this.config.rightSide?.cyclePath?.type === 'advisory'
    const hasLeftCyclePath = this.config.leftSide?.cyclePath?.type === 'separated' || 
                             this.config.leftSide?.cyclePath?.type === 'lane' || 
                             this.config.leftSide?.cyclePath?.type === 'advisory'
    
    if (!hasRightCyclePath) {
      parts.push(this.createArcStroke(outerRadius - 1, angle, '#e7e6e6', 2, viewBoxSize))
    }
    if (!hasLeftCyclePath) {
      parts.push(this.createArcStroke(innerRadius + 1, angle, '#e7e6e6', 2, viewBoxSize))
    }
    
    // ========== ON-ROAD CYCLE LANES ==========
    parts.push(this.createOnRoadCycleLanes(innerRadius, outerRadius, angle, viewBoxSize))
    
    // ========== ALLE LINIEN ZWISCHEN SPUREN ==========
    parts.push(this.createAllLines(innerRadius, outerRadius, angle, viewBoxSize))
    
    // ========== STRASSENBAHN-GLEISE ==========
    parts.push(this.createTramTracks(innerRadius, outerRadius, angle, viewBoxSize))
    
    // ========== PFEIL-MARKIERUNGEN ==========
    parts.push(this.createArrowMarkings(innerRadius, outerRadius, angle, viewBoxSize))
    
    // ========== LINIEN-MARKIERUNGEN (Halte-/Wartelinien) ==========
    parts.push(this.createLineMarkings(innerRadius, outerRadius, angle, viewBoxSize))
    
    // ========== INNERE SEITENELEMENTE (links) — order-basiert ==========
    let currentInnerRadius = innerRadius
    
    // Von innen nach außen iterieren (normal order)
    const leftOrder = getActiveOrder(this.config.leftSide)
    for (const el of leftOrder) {
      const w = getElementWidth(this.config.leftSide!, el)
      if (w <= 0) continue
      currentInnerRadius -= w
      if (currentInnerRadius >= 0) {
        this.renderCurveElement(parts, el, this.config.leftSide!, currentInnerRadius, currentInnerRadius + w, angle, viewBoxSize, 'inner')
      }
    }
    
    return parts.filter(Boolean).join('\n    ')
  }
  
  private createArcRing(
    innerR: number,
    outerR: number,
    angle: number,
    fill: string,
    viewBoxSize: number
  ): string {
    if (innerR < 0) innerR = 0
    if (outerR <= innerR) return ''
    
    const angleRad = (angle * Math.PI) / 180
    const largeArc = angle > 180 ? 1 : 0
    
    // Unrotierte Punkte berechnen
    const os = this.tp(viewBoxSize, viewBoxSize - outerR)
    const oe = this.tp(viewBoxSize - outerR * Math.sin(angleRad), viewBoxSize - outerR * Math.cos(angleRad))
    const is_ = this.tp(viewBoxSize, viewBoxSize - innerR)
    const ie = this.tp(viewBoxSize - innerR * Math.sin(angleRad), viewBoxSize - innerR * Math.cos(angleRad))
    
    // Bei Spiegelung (Linkskurve) muss sweep-direction umgekehrt werden
    const outerSweep = this.mirrorX ? 1 : 0
    const innerSweep = this.mirrorX ? 0 : 1
    
    const d = [
      `M ${os.x.toFixed(2)} ${os.y.toFixed(2)}`,
      `A ${outerR.toFixed(2)} ${outerR.toFixed(2)} 0 ${largeArc} ${outerSweep} ${oe.x.toFixed(2)} ${oe.y.toFixed(2)}`,
      `L ${ie.x.toFixed(2)} ${ie.y.toFixed(2)}`,
      `A ${innerR.toFixed(2)} ${innerR.toFixed(2)} 0 ${largeArc} ${innerSweep} ${is_.x.toFixed(2)} ${is_.y.toFixed(2)}`,
      'Z'
    ].join(' ')
    
    return `<path d="${d}" fill="${fill}" />`
  }
  
  private createArcStroke(
    radius: number,
    angle: number,
    stroke: string,
    strokeWidth: number,
    viewBoxSize: number,
    dashArray?: string,
    gapPx = 0
  ): string {
    if (radius <= 0) return ''
    
    // Gap in Grad umrechnen
    const gapAngle = gapPx > 0 ? (gapPx / radius) * (180 / Math.PI) : 0
    const startAngle = gapAngle
    const endAngle = angle - gapAngle
    if (endAngle <= startAngle) return ''
    
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    const arcSpan = endAngle - startAngle
    const largeArc = arcSpan > 180 ? 1 : 0
    
    const s = this.tp(viewBoxSize - radius * Math.sin(startAngleRad), viewBoxSize - radius * Math.cos(startAngleRad))
    const e = this.tp(viewBoxSize - radius * Math.sin(endAngleRad), viewBoxSize - radius * Math.cos(endAngleRad))
    
    const sweep = this.mirrorX ? 1 : 0
    
    const d = `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArc} ${sweep} ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
    const dash = dashArray ? `stroke-dasharray="${dashArray}"` : ''
    
    // Dash-Offset: Gleicher Lückenabstand am Anfang und Ende
    let dashOffset = ''
    if (dashArray && gapPx > 0) {
      const arcLen = ((arcSpan * Math.PI) / 180) * radius
      if (arcLen > 0) {
        const parts = dashArray.split(/\s+/).map(Number)
        const dashOn = parts[0] || 15
        const dashOff = parts[1] || 25
        const cycle = dashOn + dashOff
        const n = Math.floor((arcLen + dashOff) / cycle)
        if (n > 0) {
          const usedLen = n * dashOn + (n - 1) * dashOff
          const halfGap = (arcLen - usedLen) / 2
          dashOffset = `stroke-dashoffset="${(-halfGap).toFixed(2)}"`
        }
      }
    }
    
    return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${dash} ${dashOffset} />`
  }
  
  /**
   * Zeichne alle Linien zwischen Spuren (vereinheitlicht)
   */
  private createAllLines(innerR: number, outerR: number, angle: number, viewBoxSize: number): string {
    const lanes = this.config.lanes
    if (lanes <= 1) return ''
    
    const lines = this.config.lines || []
    const defaultType = this.config.defaultLineType || 'dashed'
    const laneWidth = (outerR - innerR) / lanes
    const parts: string[] = []
    
    // Tram-Bereich berechnen für Überlappungs-Check
    const tram = this.config.tram
    let tramInnerR = 0
    let tramOuterR = 0
    if (tram) {
      const tramWidth = tram.width || (tram.tracks === 1 ? 20 : 36)
      const tramCenterRadius = innerR + (outerR - innerR) / 2
      tramInnerR = tramCenterRadius - tramWidth / 2
      tramOuterR = tramCenterRadius + tramWidth / 2
    }
    
    for (let i = 0; i < lanes - 1; i++) {
      const line = lines[i]
      const lineType = line?.type || defaultType
      if (lineType === 'none') continue
      
      const lineRadius = innerR + (i + 1) * laneWidth
      
      // Tram-Überlappung: Linie nicht rendern wenn Gleise darüber liegen
      if (tram) {
        if (lineRadius >= tramInnerR - 2 && lineRadius <= tramOuterR + 2) {
          continue
        }
      }
      
      const GAP = 14
      
      switch (lineType) {
        case 'dashed':
          parts.push(this.createArcStroke(lineRadius, angle, '#ffffff', 2, viewBoxSize, '15 25', GAP))
          break
        case 'solid':
          parts.push(this.createArcStroke(lineRadius, angle, '#ffffff', 2, viewBoxSize))
          break
        case 'double-solid':
          parts.push(this.createArcStroke(lineRadius - 2, angle, '#ffffff', 2, viewBoxSize))
          parts.push(this.createArcStroke(lineRadius + 2, angle, '#ffffff', 2, viewBoxSize))
          break
        case 'solid-dashed':
          parts.push(this.createArcStroke(lineRadius - 2, angle, '#ffffff', 2, viewBoxSize))
          parts.push(this.createArcStroke(lineRadius + 2, angle, '#ffffff', 2, viewBoxSize, '15 25', GAP))
          break
        case 'dashed-solid':
          parts.push(this.createArcStroke(lineRadius - 2, angle, '#ffffff', 2, viewBoxSize, '15 25', GAP))
          parts.push(this.createArcStroke(lineRadius + 2, angle, '#ffffff', 2, viewBoxSize))
          break
        case 'barrier': {
          const totalBarrierWidth = line?.width || 12
          const barrierWidth = totalBarrierWidth * 0.25
          const clearanceWidth = (totalBarrierWidth - barrierWidth) / 2
          
          const innerClearanceOuter = lineRadius - totalBarrierWidth / 2 + clearanceWidth
          const innerClearanceInner = lineRadius - totalBarrierWidth / 2
          parts.push(this.createArcRing(innerClearanceInner, innerClearanceOuter, angle, '#888888', viewBoxSize))
          
          const barrierInner = lineRadius - barrierWidth / 2
          const barrierOuter = lineRadius + barrierWidth / 2
          parts.push(this.createArcRing(barrierInner, barrierOuter, angle, '#d4d4d4', viewBoxSize))
          
          const outerClearanceInner = lineRadius + barrierWidth / 2
          const outerClearanceOuter = lineRadius + totalBarrierWidth / 2
          parts.push(this.createArcRing(outerClearanceInner, outerClearanceOuter, angle, '#888888', viewBoxSize))
          
          parts.push(this.createArcStroke(lineRadius - totalBarrierWidth / 2, angle, '#ffffff', 3, viewBoxSize))
          parts.push(this.createArcStroke(lineRadius + totalBarrierWidth / 2, angle, '#ffffff', 3, viewBoxSize))
          break
        }
        case 'green-strip': {
          const greenWidth = line?.width || 12
          parts.push(this.createArcRing(lineRadius - greenWidth / 2, lineRadius + greenWidth / 2, angle, '#4a7c59', viewBoxSize))
          parts.push(this.createArcStroke(lineRadius - greenWidth / 2, angle, '#ffffff', 2, viewBoxSize))
          parts.push(this.createArcStroke(lineRadius + greenWidth / 2, angle, '#ffffff', 2, viewBoxSize))
          break
        }
      }
    }
    
    return parts.join('\n    ')
  }
  
  /**
   * Rendert Straßenbahn-Gleise auf der Kurve
   * Analog zum TramModule für gerade Straßen
   */
  private createTramTracks(innerR: number, outerR: number, angle: number, viewBoxSize: number): string {
    const tram = this.config.tram
    if (!tram) return ''
    
    
    const parts: string[] = []
    const tramWidth = tram.width || (tram.tracks === 1 ? 20 : 36)
    const tramCenterRadius = innerR + (outerR - innerR) / 2
    const tramInnerR = tramCenterRadius - tramWidth / 2
    const tramOuterR = tramCenterRadius + tramWidth / 2
    
    // Gleisbett
    const bedColor = tram.trackType === 'grass' ? '#6a8f4e' : tram.trackType === 'dedicated' ? '#888888' : '#5a5a5a'
    parts.push(this.createArcRing(tramInnerR, tramOuterR, angle, bedColor, viewBoxSize))
    
    // Bordsteine bei dedicated/grass
    if (tram.trackType === 'dedicated' || tram.trackType === 'grass') {
      parts.push(this.createArcStroke(tramInnerR, angle, '#999999', 2, viewBoxSize))
      parts.push(this.createArcStroke(tramOuterR, angle, '#999999', 2, viewBoxSize))
    }
    
    // Schienen + Schwellen
    const gaugeWidth = 10
    const railColor = '#c0c0c0'
    const railWidth = 2
    
    // Schwellenpositionen einmal berechnen (basierend auf tramCenterRadius),
    // damit bei zweigleisig die Schwellen beider Gleise synchron liegen
    const tieSpacing = 20
    const refArcLength = (angle * Math.PI / 180) * tramCenterRadius
    const tieCount = Math.floor(refArcLength / tieSpacing)
    const tieAngles: number[] = []
    for (let i = 0; i < tieCount; i++) {
      tieAngles.push(((i + 0.5) / tieCount) * angle)
    }

    const addRailPair = (centerR: number) => {
      // Schwellen bei embedded
      if (tram.trackType === 'embedded') {
        const tieWidth = gaugeWidth + 6
        for (const tieAngle of tieAngles) {
          const tieAngleRad = (tieAngle * Math.PI) / 180
          const cos = Math.cos(tieAngleRad)
          const sin = Math.sin(tieAngleRad)
          const tieInnerR = centerR - tieWidth / 2
          const tieOuterR = centerR + tieWidth / 2
          const p1 = this.tp(viewBoxSize - tieInnerR * sin, viewBoxSize - tieInnerR * cos)
          const p2 = this.tp(viewBoxSize - tieOuterR * sin, viewBoxSize - tieOuterR * cos)
          parts.push(`<line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}" x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}" stroke="#8b7355" stroke-width="3" opacity="0.6" />`)
        }
      }

      // Schienen
      parts.push(this.createArcStroke(centerR - gaugeWidth / 2, angle, railColor, railWidth, viewBoxSize))
      parts.push(this.createArcStroke(centerR + gaugeWidth / 2, angle, railColor, railWidth, viewBoxSize))
    }

    if (tram.tracks === 1) {
      addRailPair(tramCenterRadius)
    } else {
      const gap = 4
      const trackCenterLeft = tramCenterRadius - gap / 2 - gaugeWidth / 2
      const trackCenterRight = tramCenterRadius + gap / 2 + gaugeWidth / 2
      addRailPair(trackCenterLeft)
      addRailPair(trackCenterRight)
    }
    
    return parts.filter(Boolean).join('\n    ')
  }
  
  /**
   * Parkplatz-Markierungen für Kurven (radiale Linien als Stellplatz-Trenner)
   */
  private createParkingMarkings(
    innerR: number,
    outerR: number,
    angle: number,
    viewBoxSize: number,
    orientation: 'parallel' | 'perpendicular' | 'angled'
  ): string {
    const parts: string[] = []
    const midR = (innerR + outerR) / 2
    const spotAngle = orientation === 'parallel' ? 50 : orientation === 'perpendicular' ? 25 : 30
    const arcLength = (angle * Math.PI / 180) * midR
    const count = Math.floor(arcLength / spotAngle)
    
    for (let i = 1; i < count; i++) {
      const lineAngle = (i / count) * angle
      const lineAngleRad = (lineAngle * Math.PI) / 180
      const cos = Math.cos(lineAngleRad)
      const sin = Math.sin(lineAngleRad)
      const p1 = this.tp(viewBoxSize - innerR * sin, viewBoxSize - innerR * cos)
      const p2 = this.tp(viewBoxSize - outerR * sin, viewBoxSize - outerR * cos)
      parts.push(`<line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}" x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}" stroke="#ffffff" stroke-width="1.5" />`)
    }
    
    return parts.join('\n    ')
  }
  
  /**
   * Erstellt Pfeil-Markierungen für Kurven
   * Position wird als Winkel entlang der Kurve berechnet
   */
  private createArrowMarkings(
    innerRadius: number,
    outerRadius: number,
    angle: number,
    viewBoxSize: number
  ): string {
    const markings = this.config.markings
    if (!markings || markings.length === 0) return ''
    
    const parts: string[] = []
    const lanes = this.config.lanes
    const laneWidth = (outerRadius - innerRadius) / lanes
    
    const midRadius = (innerRadius + outerRadius) / 2
    const arcLength = midRadius * (angle * Math.PI / 180)
    
    for (const marking of markings) {
      if (marking.type !== 'arrow') continue
      
      const def = ARROW_DEFS[marking.arrowType]
      if (!def) continue
      
      // Radius: xPercent → freie Position, sonst Spurmitte
      const roadWidth = outerRadius - innerRadius
      let markingRadius: number
      if (marking.xPercent !== undefined) {
        markingRadius = innerRadius + (marking.xPercent / 100) * roadWidth
      } else {
        markingRadius = innerRadius + (marking.laneIndex + 0.5) * laneWidth
      }
      const positionAngle = (marking.positionPercent / 100) * angle
      const positionAngleRad = (positionAngle * Math.PI) / 180
      
      // Position: GLEICHES Koordinatensystem wie alle anderen Kurvenelemente!
      // Zentrum bei (viewBoxSize, viewBoxSize), Bogen von 0° (oben) im Uhrzeigersinn
      const rawX = viewBoxSize - markingRadius * Math.sin(positionAngleRad)
      const rawY = viewBoxSize - markingRadius * Math.cos(positionAngleRad)
      const pos = this.tp(rawX, rawY)
      
      // Skalierung: Breite = 60% der Spur, Höhe max 15% der Bogenlänge
      const scaleByWidth = (laneWidth * 0.6) / def.width
      const scaleByHeight = (arcLength * 0.15) / def.height
      const userSx = marking.scaleX ?? marking.scale ?? 1
      const userSy = marking.scaleY ?? marking.scale ?? 1
      const baseS = Math.min(scaleByWidth, scaleByHeight)
      const sX = baseS * userSx
      const sY = baseS * userSy
      
      // Rotation: Tangente an der Position + User-Rotation + globale SVG-Rotation
      // tangentDeg ist im lokalen Raum, rotDeg transformiert in den finalen Raum
      // (tp() transformiert nur die Position, nicht die Orientierung)
      const tangentDeg = 90 - positionAngle  // Tangente dreht sich mit dem Bogen
      const mirrorOffset = this.mirrorX ? -180 : 0
      const rotDeg = (this.rotRad * 180) / Math.PI
      const totalRotDeg = tangentDeg + (marking.rotation || 0) + rotDeg + mirrorOffset
      
      // Offset: Pfeil-Zentrum auf Position
      const cx = -(def.width / 2)
      const cy = -(def.height / 2)
      
      // Matrix berechnen: translate(pos) * rotate(rot) * [mirror] * translate(center) * scale(sx,sy)
      const matrix = buildMatrix(pos.x, pos.y, totalRotDeg, cx, cy, sX, this.mirrorX, sY)
      
      // Pfade extrahieren und Koordinaten vorab transformieren — KEIN transform-Attribut nötig!
      const pathRegex = /<path[^>]*\bd="([\s\S]*?)"[^>]*\/?>/g
      let pathMatch
      
      while ((pathMatch = pathRegex.exec(def.svg)) !== null) {
        const pathD = pathMatch[1].replace(/\s+/g, ' ').trim()
        if (pathD) {
          const transformedD = transformPathData(pathD, matrix)
          parts.push(`<path fill="${marking.color || '#ffffff'}" stroke="none" d="${transformedD}"/>`)
        }
      }
    }
    
    // Fahrstreifenbegrenzungen
    for (const marking of markings) {
      if (marking.type !== 'laneLine') continue

      const roadWidth = outerRadius - innerRadius
      let markingRadius: number
      if (marking.xPercent !== undefined) {
        markingRadius = innerRadius + (marking.xPercent / 100) * roadWidth
      } else {
        markingRadius = innerRadius + (marking.laneIndex + 0.5) * laneWidth
      }
      const msx = marking.scaleX ?? marking.scale ?? 1
      const msy = marking.scaleY ?? marking.scale ?? 1
      const lt = marking.lineType
      const gap = 2 * msx
      const sw = 2 * msx
      const isFullLength = !!marking.fullLength
      const da = isFullLength ? '15 25' : `${3 * msy} ${3 * msy}`
      const llColor = marking.color || '#ffffff'
      const angleRad = (angle * Math.PI) / 180

      if (isFullLength) {
        // Gesamte Kurvenlänge — Dashes winkelsynchron mit Spurlinien (proportionale Skalierung)
        const GAP_REF = 14
        const numLanes = this.config.lanes || 2
        let refR = innerRadius + laneWidth
        for (let i = 2; i < numLanes; i++) {
          const sepR = innerRadius + i * laneWidth
          if (Math.abs(sepR - markingRadius) < Math.abs(refR - markingRadius)) refR = sepR
        }
        // Referenz-Dash-Positionen berechnen
        const refArcLen = ((angle * Math.PI) / 180) * refR - 2 * GAP_REF
        const nRef = refArcLen > 0 ? Math.floor((refArcLen + 25) / 40) : 0
        const refHalfGap = nRef > 0 ? (refArcLen - (nRef * 15 + (nRef - 1) * 25)) / 2 : 0
        const mkArc = (r: number, dashed: boolean) => {
          if (dashed) {
            // Einzelne Strich-Segmente an exakten Winkelpositionen
            const segs: string[] = []
            for (let i = 0; i < nRef; i++) {
              const dashStart = GAP_REF + refHalfGap + i * 40
              const dashEnd = dashStart + 15
              const a1 = dashStart / refR
              const a2 = dashEnd / refR
              const p1 = this.tp(viewBoxSize - r * Math.sin(a1), viewBoxSize - r * Math.cos(a1))
              const p2 = this.tp(viewBoxSize - r * Math.sin(a2), viewBoxSize - r * Math.cos(a2))
              const span = (a2 - a1) * (180 / Math.PI)
              const la = span > 180 ? 1 : 0
              const sweep = this.mirrorX ? 1 : 0
              segs.push(`<path d="M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${la} ${sweep} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}" fill="none" stroke="${llColor}" stroke-width="${sw}"/>`)
            }
            return segs.join('')
          }
          return this.createArcStroke(r, angle, llColor, sw, viewBoxSize)
        }
        if (lt === 'solid') { parts.push(mkArc(markingRadius, false)) }
        else if (lt === 'double-solid') { parts.push(mkArc(markingRadius + gap, false)); parts.push(mkArc(markingRadius - gap, false)) }
        else if (lt === 'solid-dashed') { parts.push(mkArc(markingRadius - gap, false)); parts.push(mkArc(markingRadius + gap, true)) }
        else if (lt === 'dashed-solid') { parts.push(mkArc(markingRadius - gap, true)); parts.push(mkArc(markingRadius + gap, false)) }
      } else {
        // Kurzes Bogen-Segment (~15px) an positionPercent
        const segLen = 15 * msy
        const halfAngRad = (segLen / 2) / markingRadius
        const posAngRad = (marking.positionPercent / 100) * angleRad

        const mkArc = (r: number, dashed: boolean) => {
          const a1 = posAngRad - halfAngRad
          const a2 = posAngRad + halfAngRad
          const steps = 8
          const pts: string[] = []
          for (let s = 0; s <= steps; s++) {
            const a = a1 + (a2 - a1) * (s / steps)
            const p = this.tp(viewBoxSize - r * Math.sin(a), viewBoxSize - r * Math.cos(a))
            pts.push(`${p.x.toFixed(2)},${p.y.toFixed(2)}`)
          }
          let s = `<polyline points="${pts.join(' ')}" fill="none" stroke="${llColor}" stroke-width="${sw}"`
          if (dashed) s += ` stroke-dasharray="${da}"`
          s += '/>'
          return s
        }
        if (lt === 'solid') { parts.push(mkArc(markingRadius, false)) }
        else if (lt === 'double-solid') { parts.push(mkArc(markingRadius + gap, false)); parts.push(mkArc(markingRadius - gap, false)) }
        else if (lt === 'solid-dashed') { parts.push(mkArc(markingRadius - gap, false)); parts.push(mkArc(markingRadius + gap, true)) }
        else if (lt === 'dashed-solid') { parts.push(mkArc(markingRadius - gap, true)); parts.push(mkArc(markingRadius + gap, false)) }
      }
    }

    // ===== GESCHWINDIGKEITSZAHLEN =====
    for (const marking of markings) {
      if (marking.type !== 'speedNumber') continue

      const roadWidth = outerRadius - innerRadius
      let markingRadius: number
      if (marking.xPercent !== undefined) {
        markingRadius = innerRadius + (marking.xPercent / 100) * roadWidth
      } else {
        markingRadius = innerRadius + (marking.laneIndex + 0.5) * laneWidth
      }
      const positionAngle = (marking.positionPercent / 100) * angle
      const posAngleRad = (positionAngle * Math.PI) / 180
      const pos = this.tp(viewBoxSize - markingRadius * Math.sin(posAngleRad), viewBoxSize - markingRadius * Math.cos(posAngleRad))

      const sx = marking.scaleX ?? marking.scale ?? 1
      const sy = marking.scaleY ?? marking.scale ?? 1
      const fontSize = laneWidth * 0.55

      const tangentDeg = 90 - positionAngle
      const mirrorOffset = this.mirrorX ? -180 : 0
      const rotDeg = (this.rotRad * 180) / Math.PI
      const totalRotDeg = tangentDeg + (marking.rotation || 0) + rotDeg + mirrorOffset

      parts.push(`<text x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}" text-anchor="middle" dominant-baseline="central" fill="${marking.color || '#ffffff'}" font-family="Arial, sans-serif" font-weight="bold" font-size="${(fontSize * sx).toFixed(1)}" transform="rotate(${totalRotDeg.toFixed(2)}, ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) scale(1, ${(sy / sx || 1).toFixed(3)})">${marking.value}</text>`)
    }

    // ===== TEXTMARKIERUNGEN =====
    for (const marking of markings) {
      if (marking.type !== 'textMarking') continue

      const roadWidth = outerRadius - innerRadius
      let markingRadius: number
      if (marking.xPercent !== undefined) {
        markingRadius = innerRadius + (marking.xPercent / 100) * roadWidth
      } else {
        markingRadius = innerRadius + (marking.laneIndex + 0.5) * laneWidth
      }
      const positionAngle = (marking.positionPercent / 100) * angle
      const posAngleRad = (positionAngle * Math.PI) / 180
      const pos = this.tp(viewBoxSize - markingRadius * Math.sin(posAngleRad), viewBoxSize - markingRadius * Math.cos(posAngleRad))

      const sx = marking.scaleX ?? marking.scale ?? 1
      const sy = marking.scaleY ?? marking.scale ?? 1
      const fontSize = laneWidth * 0.4

      const tangentDeg = 90 - positionAngle
      const mirrorOffset = this.mirrorX ? -180 : 0
      const rotDeg = (this.rotRad * 180) / Math.PI
      const totalRotDeg = tangentDeg + (marking.rotation || 0) + rotDeg + mirrorOffset

      if (marking.orientation === 'vertical') {
        const chars = marking.text.split('')
        const charH = fontSize * 1.3
        const totalH = chars.length * charH
        for (let ci = 0; ci < chars.length; ci++) {
          const yOff = -totalH / 2 + charH * 0.8 + ci * charH
          parts.push(`<text x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}" text-anchor="middle" fill="${marking.color || '#ffffff'}" font-family="Arial, sans-serif" font-weight="bold" font-size="${(fontSize * sx).toFixed(1)}" transform="rotate(${totalRotDeg.toFixed(2)}, ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) translate(0, ${(yOff * sy).toFixed(2)})">${chars[ci]}</text>`)
        }
      } else {
        parts.push(`<text x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}" text-anchor="middle" dominant-baseline="central" fill="${marking.color || '#ffffff'}" font-family="Arial, sans-serif" font-weight="bold" font-size="${(fontSize * sx).toFixed(1)}" transform="rotate(${totalRotDeg.toFixed(2)}, ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) scale(1, ${(sy / sx || 1).toFixed(3)})">${marking.text}</text>`)
      }
    }

    // ===== SYMBOLMARKIERUNGEN =====
    for (const marking of markings) {
      if (marking.type !== 'symbolMarking') continue

      const def = SYMBOL_DEFS[marking.symbolType]
      if (!def) continue

      const roadWidth = outerRadius - innerRadius
      let markingRadius: number
      if (marking.xPercent !== undefined) {
        markingRadius = innerRadius + (marking.xPercent / 100) * roadWidth
      } else {
        markingRadius = innerRadius + (marking.laneIndex + 0.5) * laneWidth
      }
      const positionAngle = (marking.positionPercent / 100) * angle
      const posAngleRad = (positionAngle * Math.PI) / 180

      const rawX = viewBoxSize - markingRadius * Math.sin(posAngleRad)
      const rawY = viewBoxSize - markingRadius * Math.cos(posAngleRad)
      const pos = this.tp(rawX, rawY)

      const userSx = marking.scaleX ?? marking.scale ?? 1
      const userSy = marking.scaleY ?? marking.scale ?? 1
      const targetH = laneWidth * 0.8
      const baseScale = targetH / def.height
      const sX = baseScale * userSx
      const sY = baseScale * userSy

      const tangentDeg = 90 - positionAngle
      const mirrorOffset = this.mirrorX ? -180 : 0
      const rotDeg = (this.rotRad * 180) / Math.PI
      const totalRotDeg = tangentDeg + (marking.rotation || 0) + rotDeg + mirrorOffset

      const cx = -(def.width / 2)
      const cy = -(def.height / 2)
      const matrix = buildMatrix(pos.x, pos.y, totalRotDeg, cx, cy, sX, this.mirrorX, sY)

      // Render paths via transformPathData
      const symColor = marking.color || null
      for (const p of def.paths) {
        const transformedD = transformPathData(p.d, matrix)
        const fillColor = symColor && p.fill !== 'none' ? symColor : p.fill
        parts.push(`<path fill="${fillColor}" stroke="none" d="${transformedD}"/>`)
      }

      // Tempo 30: circle + text need special handling
      if (marking.symbolType === 'tempo30') {
        // Circle as arc path
        const r = 90
        const circleD = `M${100},${10} A${r},${r} 0 1,1 ${99.99},${10} Z`
        const transformedCircle = transformPathData(circleD, matrix)
        const avgScale = (Math.abs(sX) + Math.abs(sY)) / 2
        parts.push(`<path d="${transformedCircle}" fill="none" stroke="${symColor || '#ffffff'}" stroke-width="${(12 * avgScale).toFixed(2)}"/>`)
        // Text as positioned element
        parts.push(`<text x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}" text-anchor="middle" dominant-baseline="central" fill="${symColor || '#ffffff'}" font-family="Arial, sans-serif" font-weight="bold" font-size="${(80 * sX).toFixed(1)}" transform="rotate(${totalRotDeg.toFixed(2)}, ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})">30</text>`)
      }
    }

    return parts.join('')
  }
  
  /**
   * Erzeugt Linien-Markierungen (Halte-/Wartelinien) als radiale Striche
   */
  private createLineMarkings(
    innerRadius: number,
    outerRadius: number,
    angle: number,
    viewBoxSize: number
  ): string {
    const markings = this.config.markings
    if (!markings || markings.length === 0) return ''
    
    const parts: string[] = []
    
    for (const marking of markings) {
      if (marking.type !== 'zebra' && marking.type !== 'stopLine' && marking.type !== 'waitLine' && marking.type !== 'sharkTeeth' && marking.type !== 'blockedArea') continue

      const positionAngle = (marking.positionPercent / 100) * angle
      const posAngleRad = (positionAngle * Math.PI) / 180
      const roadWidth = outerRadius - innerRadius

      // Zebra: Arc-Bänder radial getiled, konstante Breite pro Streifen
      if (marking.type === 'zebra') {
        const msx = marking.scaleX ?? marking.scale ?? 1
        const msy = marking.scaleY ?? marking.scale ?? 1
        const zebraWidth = (marking.width || 40) * msy
        const stripeRadial = 5 * msx
        const gapRadial = 5 * msx
        // Edge-to-edge radial tiling
        const totalRadial = outerRadius - innerRadius
        const N = Math.max(1, Math.round((totalRadial + gapRadial) / (stripeRadial + gapRadial)))
        const actualGap = N > 1 ? (totalRadial - N * stripeRadial) / (N - 1) : 0
        for (let i = 0; i < N; i++) {
          const rIn = innerRadius + i * (stripeRadial + actualGap)
          const rOut = rIn + stripeRadial
          // Per-radius angle → constant arc length (visual width) at each edge
          const halfAngIn = (zebraWidth / 2) / rIn
          const halfAngOut = (zebraWidth / 2) / rOut
          // 4-corner quadrilateral with straight edges (no arc interpolation)
          const pInL = this.tp(viewBoxSize - rIn * Math.sin(posAngleRad - halfAngIn), viewBoxSize - rIn * Math.cos(posAngleRad - halfAngIn))
          const pInR = this.tp(viewBoxSize - rIn * Math.sin(posAngleRad + halfAngIn), viewBoxSize - rIn * Math.cos(posAngleRad + halfAngIn))
          const pOutL = this.tp(viewBoxSize - rOut * Math.sin(posAngleRad - halfAngOut), viewBoxSize - rOut * Math.cos(posAngleRad - halfAngOut))
          const pOutR = this.tp(viewBoxSize - rOut * Math.sin(posAngleRad + halfAngOut), viewBoxSize - rOut * Math.cos(posAngleRad + halfAngOut))
          const d = `M ${pInL.x.toFixed(2)},${pInL.y.toFixed(2)} L ${pOutL.x.toFixed(2)},${pOutL.y.toFixed(2)} L ${pOutR.x.toFixed(2)},${pOutR.y.toFixed(2)} L ${pInR.x.toFixed(2)},${pInR.y.toFixed(2)} Z`
          parts.push(`<path d="${d}" fill="${marking.color || '#ffffff'}"/>`)
        }
        continue
      }

      // r1/r2 aus xPercent/widthPercent berechnen
      const centerPct = marking.xPercent ?? 50
      const widthPct = marking.widthPercent ?? 100
      const halfW = widthPct / 2
      const r1 = innerRadius + (Math.max(0, centerPct - halfW) / 100) * roadWidth
      const r2 = innerRadius + (Math.min(100, centerPct + halfW) / 100) * roadWidth

      if (marking.type === 'stopLine') {
        const msy = marking.scaleY ?? marking.scale ?? 1
        const thickness = 3 * msy
        const p1 = this.tp(viewBoxSize - r1 * Math.sin(posAngleRad), viewBoxSize - r1 * Math.cos(posAngleRad))
        const p2 = this.tp(viewBoxSize - r2 * Math.sin(posAngleRad), viewBoxSize - r2 * Math.cos(posAngleRad))
        const slColor = marking.color || '#ffffff'
        parts.push(`<line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}" x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}" stroke="${slColor}" stroke-width="${thickness}"/>`)
      } else if (marking.type === 'waitLine') {
        const msy = marking.scaleY ?? marking.scale ?? 1
        const thickness = 2 * msy
        const dashLen = 4
        const gapLen = 4
        const totalLen = r2 - r1
        const wlColor = marking.color || '#ffffff'
        let pos = 0
        while (pos < totalLen) {
          const segEnd = Math.min(pos + dashLen, totalLen)
          const sr1 = r1 + pos
          const sr2 = r1 + segEnd
          const p1 = this.tp(viewBoxSize - sr1 * Math.sin(posAngleRad), viewBoxSize - sr1 * Math.cos(posAngleRad))
          const p2 = this.tp(viewBoxSize - sr2 * Math.sin(posAngleRad), viewBoxSize - sr2 * Math.cos(posAngleRad))
          parts.push(`<line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}" x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}" stroke="${wlColor}" stroke-width="${thickness}"/>`)
          pos += dashLen + gapLen
        }
      } else if (marking.type === 'sharkTeeth') {
        // Haifischzähne: Dreiecke entlang des Radius
        const msx = marking.scaleX ?? marking.scale ?? 1
        const msy = marking.scaleY ?? marking.scale ?? 1
        const toothLen = 6 * msx  // Radiale Breite eines Zahns
        const toothH = 8 * msy   // Höhe (quer zur Richtung)
        const gap = 2 * msx
        const dir = marking.direction === 'outward' ? -1 : 1
        
        // Offset-Winkel für die Zahn-Höhe
        const midR = (r1 + r2) / 2
        const halfAngleOffset = (toothH / 2 / midR) * dir
        
        let pos = r1
        while (pos + toothLen <= r2 + 0.1) {
          const rMid = pos + toothLen / 2
          // Basis-Punkte (an posAngle)
          const pb1 = this.tp(viewBoxSize - pos * Math.sin(posAngleRad), viewBoxSize - pos * Math.cos(posAngleRad))
          const pb2 = this.tp(viewBoxSize - (pos + toothLen) * Math.sin(posAngleRad), viewBoxSize - (pos + toothLen) * Math.cos(posAngleRad))
          // Spitze (versetzt in Winkelrichtung)
          const tipAngle = posAngleRad + halfAngleOffset
          const pt = this.tp(viewBoxSize - rMid * Math.sin(tipAngle), viewBoxSize - rMid * Math.cos(tipAngle))
          parts.push(`<polygon points="${pb1.x.toFixed(2)},${pb1.y.toFixed(2)} ${pt.x.toFixed(2)},${pt.y.toFixed(2)} ${pb2.x.toFixed(2)},${pb2.y.toFixed(2)}" fill="${marking.color || '#ffffff'}"/>`)
          pos += toothLen + gap
        }
      } else if (marking.type === 'blockedArea') {
        // Sperrflächen: Gleicher Ansatz wie Pfeile!
        // flatPaths verwenden → buildMatrix → transformPathData → flache <path> Elemente
        // KEIN nested <svg>, KEIN <pattern>, KEIN <clipPath> — Fabric.js versteht das nicht!
        const def = BLOCKED_AREA_DEFS[marking.areaType]
        if (!def || !def.flatPaths || def.flatPaths.length === 0) continue
        
        const msx = marking.scaleX ?? marking.scale ?? 1
        const msy = marking.scaleY ?? marking.scale ?? 1
        const hPct = marking.heightPercent ?? 15
        const widthPct = marking.widthPercent ?? 30

        // Zielgröße berechnen
        const roadWidth = outerRadius - innerRadius
        const targetWidth = (widthPct / 100) * roadWidth * msx
        const midArcRadius = (innerRadius + outerRadius) / 2
        const arcLen = ((hPct / 100) * angle * Math.PI / 180) * midArcRadius
        const targetHeight = arcLen * msy

        // Skalierung basiert auf contentBox (tatsächlicher Inhalt), nicht viewBox
        const cb = def.contentBox
        const scaleX = targetWidth / cb.w
        const scaleY = targetHeight / cb.h

        // Position auf dem Bogen — direkt aus xPercent (NICHT aus r1/r2!)
        const xPct = marking.xPercent ?? 50
        const midR = innerRadius + (xPct / 100) * (outerRadius - innerRadius)
        const pos = this.tp(
          viewBoxSize - midR * Math.sin(posAngleRad),
          viewBoxSize - midR * Math.cos(posAngleRad)
        )

        // Rotation: Tangente + User-Rotation + globale SVG-Rotation
        const tangentDeg = 90 - positionAngle
        const mirrorOffset = this.mirrorX ? -180 : 0
        const rotDeg = (this.rotRad * 180) / Math.PI
        const totalRotDeg = tangentDeg + (marking.rotation || 0) + rotDeg + mirrorOffset

        // Offset: Content-Zentrum auf Position (nicht viewBox-Zentrum!)
        const cx = -(cb.x + cb.w / 2)
        const cy = -(cb.y + cb.h / 2)

        // Affine Matrix berechnen — unabhängige Achsen-Skalierung
        const matrix = buildMatrix(pos.x, pos.y, totalRotDeg, cx, cy, scaleX, this.mirrorX, scaleY)

        // Alle flachen Pfade transformieren und als <path> ausgeben
        const avgScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2
        for (const fp of def.flatPaths) {
          const transformedD = transformPathData(fp.d, matrix)
          let attrs = `d="${transformedD}"`
          attrs += ` fill="${fp.fill}"`
          attrs += ` stroke="${fp.stroke}"`
          attrs += ` stroke-width="${(fp.strokeWidth * avgScale).toFixed(2)}"`
          if (fp.strokeLinecap) attrs += ` stroke-linecap="${fp.strokeLinecap}"`
          if (fp.strokeLinejoin) attrs += ` stroke-linejoin="${fp.strokeLinejoin}"`
          parts.push(`<path ${attrs}/>`)
        }
      }
    }
    
    return parts.join('')
  }
  
  private getSurfaceColor(): string {
    const surfaceType = this.config.surface?.type || 'asphalt'
    
    switch (surfaceType) {
      case 'asphalt': return '#6b6b6b'
      case 'pavement': return '#8a8a7a'
      case 'cobblestone': return '#7a7a6a'
      case 'concrete': return '#9a9a9a'
      case 'gravel': return '#a89080'
      default: return '#6b6b6b'
    }
  }
  
  private createOnRoadCycleLanes(
    innerRadius: number,
    outerRadius: number,
    angle: number,
    viewBoxSize: number
  ): string {
    const parts: string[] = []
    const left = this.config.leftSide
    const right = this.config.rightSide
    const isAsphalt = !this.config.surface?.type || this.config.surface.type === 'asphalt'
    
    if (!isAsphalt) return ''
    
    const cycleWidth = 25
    
    if (left?.cyclePath?.type === 'lane' || left?.cyclePath?.type === 'advisory') {
      const surface = left.cyclePath.surface || 'red'
      const color = surface === 'red' ? '#c45c5c' : '#6b6b6b'
      const lineType = left.cyclePath.lineType || 'solid'
      
      parts.push(this.createArcRing(innerRadius, innerRadius + cycleWidth, angle, color, viewBoxSize))
      
      // Trennlinie nur wenn nicht 'none'
      if (lineType === 'solid') {
        parts.push(this.createArcStroke(innerRadius + cycleWidth, angle, '#ffffff', 2, viewBoxSize))
      } else if (lineType === 'dashed') {
        parts.push(this.createArcStroke(innerRadius + cycleWidth, angle, '#ffffff', 2, viewBoxSize, '10 15'))
      }
    }
    
    if (right?.cyclePath?.type === 'lane' || right?.cyclePath?.type === 'advisory') {
      const surface = right.cyclePath.surface || 'red'
      const color = surface === 'red' ? '#c45c5c' : '#6b6b6b'
      const lineType = right.cyclePath.lineType || 'solid'
      
      parts.push(this.createArcRing(outerRadius - cycleWidth, outerRadius, angle, color, viewBoxSize))
      
      // Trennlinie nur wenn nicht 'none'
      if (lineType === 'solid') {
        parts.push(this.createArcStroke(outerRadius - cycleWidth, angle, '#ffffff', 2, viewBoxSize))
      } else if (lineType === 'dashed') {
        parts.push(this.createArcStroke(outerRadius - cycleWidth, angle, '#ffffff', 2, viewBoxSize, '10 15'))
      }
    }
    
    return parts.join('\n    ')
  }
  
  private getSidewalkColor(surface: string): string {
    switch (surface) {
      case 'concrete': return '#b8b8b8'
      case 'pavement': return '#a0a0a0'
      default: return '#c8c0b0'
    }
  }
  
  /**
   * Generisches Rendering eines Seitenelements als Arc
   */
  private renderCurveElement(
    parts: string[],
    el: RoadsideElementType,
    side: RoadsideConfig,
    innerR: number,
    outerR: number,
    angle: number,
    viewBoxSize: number,
    position: 'outer' | 'inner'
  ): void {
    switch (el) {
      case 'sidewalk': {
        const surface = side.sidewalk?.surface || 'tiles'
        parts.push(this.createArcRing(innerR, outerR, angle, this.getSidewalkColor(surface), viewBoxSize))
        break
      }
      case 'curb': {
        const color = side.curb === 'lowered' ? '#606060' : '#4a4a4a'
        parts.push(this.createArcRing(innerR, outerR, angle, color, viewBoxSize))
        break
      }
      case 'cyclePath': {
        const color = side.cyclePath?.surface === 'asphalt' ? '#6b6b6b' : '#c45c5c'
        const lineType = side.cyclePath?.lineType || 'solid'
        parts.push(this.createArcRing(innerR, outerR, angle, color, viewBoxSize))
        // Trennlinie an der Fahrbahnseite
        const lineR = position === 'outer' ? innerR : outerR
        if (lineType === 'solid') {
          parts.push(this.createArcStroke(lineR, angle, '#ffffff', 2, viewBoxSize))
        } else if (lineType === 'dashed') {
          parts.push(this.createArcStroke(lineR, angle, '#ffffff', 2, viewBoxSize, '10 15'))
        }
        break
      }
      case 'greenStrip':
        parts.push(this.createArcRing(innerR, outerR, angle, '#5a7a5a', viewBoxSize))
        break
      case 'barrier':
        parts.push(this.createArcRing(innerR, outerR, angle, '#d4d4d4', viewBoxSize))
        break
      case 'emergencyLane': {
        parts.push(this.createArcRing(innerR, outerR, angle, '#6b6b6b', viewBoxSize))
        const lineR = position === 'outer' ? innerR : outerR
        parts.push(this.createArcStroke(lineR, angle, '#ffffff', 2, viewBoxSize))
        break
      }
      case 'parking': {
        parts.push(this.createArcRing(innerR, outerR, angle, '#6b6b6b', viewBoxSize))
        const lineR = position === 'outer' ? innerR : outerR
        parts.push(this.createArcStroke(lineR, angle, '#ffffff', 2, viewBoxSize))
        parts.push(this.createParkingMarkings(innerR, outerR, angle, viewBoxSize, side.parking?.orientation || 'parallel'))
        break
      }
    }
  }

  getLeftSideWidth(): number {
    const left = this.config.leftSide
    if (!left) return 0
    return getActiveOrder(left).reduce((w, el) => w + getElementWidth(left, el), 0)
  }
  
  getRightSideWidth(): number {
    const right = this.config.rightSide
    if (!right) return 0
    return getActiveOrder(right).reduce((w, el) => w + getElementWidth(right, el), 0)
  }
}