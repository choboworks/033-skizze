// generator/modules/LaneModule.ts

import type { SmartRoadConfig, LineType } from '../../types'

/**
 * LaneModule - Handhabt Spuren und Linien
 * 
 * VEREINFACHT: Keine bidirectional/median-Unterscheidung.
 * Jede Linie zwischen Spur i und i+1 wird einheitlich gerendert.
 * Der User bestimmt frei, welche Linie welchen Typ hat.
 */
export class LaneModule {
  private config: SmartRoadConfig
  
  constructor(config: SmartRoadConfig) {
    this.config = config
  }

  /**
   * Spuren und Markierungen anpassen
   */
  adjustLanes(svgDoc: Document, leftOffset: number, extraWidthLeft: number): void {
    const markings = svgDoc.getElementById('lane-markings')
    const roadBody = svgDoc.getElementById('road-body')
    if (!markings || !roadBody) return
    
    // Alte Linien entfernen
    Array.from(markings.querySelectorAll('line, rect')).forEach(el => el.remove())
    
    const totalOffset = leftOffset + extraWidthLeft
    const lanes = this.config.lanes
    
    // Bei 1 Spur: nur Radfahrstreifen, keine Linien
    if (lanes <= 1) {
      this.addOnRoadCycleLanes(svgDoc, roadBody as unknown as SVGElement, markings as unknown as SVGElement, totalOffset)
      return
    }
    
    // Radfahrstreifen/Schutzstreifen
    this.addOnRoadCycleLanes(svgDoc, roadBody as unknown as SVGElement, markings as unknown as SVGElement, totalOffset)
    
    // Alle Linien zwischen Spuren zeichnen
    this.addAllLines(svgDoc, markings as unknown as SVGElement, totalOffset)
  }

  /**
   * Zeichne alle Linien zwischen Spuren
   * lines[i] = Linie zwischen Spur i und i+1
   */
  private addAllLines(svgDoc: Document, markings: SVGElement, leftOffset: number): void {
    const lanes = this.config.lanes
    const lines = this.config.lines || []
    const defaultType = this.config.defaultLineType || 'dashed'
    const halfGap = 14
    const strokeColor = '#ffffff'
    
    // Berechne Gesamtbreite der physischen Trenner
    let totalPhysicalWidth = 0
    for (let i = 0; i < lanes - 1; i++) {
      const line = lines[i]
      const lineType = line?.type || defaultType
      totalPhysicalWidth += this.getLinePhysicalWidth(lineType, line?.width)
    }
    
    // Verfügbare Breite für Spuren
    const availableWidth = this.config.width - totalPhysicalWidth
    const laneWidth = availableWidth / lanes
    
    // Zeichne jede Linie
    let currentX = leftOffset
    for (let laneIdx = 0; laneIdx < lanes; laneIdx++) {
      currentX += laneWidth
      
      // Linie nach dieser Spur (außer nach der letzten)
      if (laneIdx < lanes - 1) {
        const line = lines[laneIdx]
        const lineType = line?.type || defaultType
        
        if (lineType === 'none') {
          // Keine Linie → nichts zeichnen, kein Platz
          continue
        }
        
        const physWidth = this.getLinePhysicalWidth(lineType, line?.width)
        const centerX = currentX + physWidth / 2
        
        if (lineType === 'green-strip') {
          this.drawGreenStrip(svgDoc, markings, centerX, line?.width || 12)
        } else if (lineType === 'barrier') {
          this.drawBarrier(svgDoc, markings, centerX, line?.width || 12)
        } else if (lineType === 'double-solid') {
          this.addLine(svgDoc, markings, centerX - 1.5, 0, centerX - 1.5, this.config.length, strokeColor, 2, 'solid')
          this.addLine(svgDoc, markings, centerX + 1.5, 0, centerX + 1.5, this.config.length, strokeColor, 2, 'solid')
        } else if (lineType === 'solid-dashed') {
          this.addLine(svgDoc, markings, centerX - 1.5, 0, centerX - 1.5, this.config.length, strokeColor, 2, 'solid')
          this.addLine(svgDoc, markings, centerX + 1.5, 0, centerX + 1.5, this.config.length, strokeColor, 2, 'dashed')
        } else if (lineType === 'dashed-solid') {
          this.addLine(svgDoc, markings, centerX - 1.5, 0, centerX - 1.5, this.config.length, strokeColor, 2, 'dashed')
          this.addLine(svgDoc, markings, centerX + 1.5, 0, centerX + 1.5, this.config.length, strokeColor, 2, 'solid')
        } else {
          // solid oder dashed
          const hasSolid = lineType === 'solid'
          const y1 = hasSolid ? 0 : halfGap
          const y2 = hasSolid ? this.config.length : this.config.length - halfGap
          this.addLine(svgDoc, markings, centerX, y1, centerX, y2, strokeColor, 2, lineType as 'solid' | 'dashed')
        }
        
        currentX += physWidth
      }
    }
  }

  /**
   * Physische Breite einer Linie (Platz den sie einnimmt)
   */
  private getLinePhysicalWidth(type: LineType, configWidth?: number): number {
    if (type === 'green-strip' || type === 'barrier') {
      return configWidth || 12
    }
    if (type === 'double-solid' || type === 'solid-dashed' || type === 'dashed-solid') {
      return 6
    }
    // dashed, solid, none → nimmt keinen Extra-Platz ein
    return 0
  }

  /**
   * Grünstreifen zeichnen
   */
  private drawGreenStrip(svgDoc: Document, markings: SVGElement, centerX: number, width: number): void {
    const strip = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    strip.setAttribute('x', String(centerX - width / 2))
    strip.setAttribute('y', '0')
    strip.setAttribute('width', String(width))
    strip.setAttribute('height', String(this.config.length))
    strip.setAttribute('fill', '#4a7c59')
    markings.appendChild(strip)
    
    // Weiße Randlinien
    this.addLine(svgDoc, markings, centerX - width / 2, 0, centerX - width / 2, this.config.length, '#ffffff', 2, 'solid')
    this.addLine(svgDoc, markings, centerX + width / 2, 0, centerX + width / 2, this.config.length, '#ffffff', 2, 'solid')
  }

  /**
   * Leitplanke zeichnen
   */
  private drawBarrier(svgDoc: Document, markings: SVGElement, centerX: number, totalWidth: number): void {
    const barrierWidth = totalWidth * 0.25
    const clearanceWidth = (totalWidth - barrierWidth) / 2
    
    // Freifläche links
    const clearanceLeft = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    clearanceLeft.setAttribute('x', String(centerX - totalWidth / 2))
    clearanceLeft.setAttribute('y', '0')
    clearanceLeft.setAttribute('width', String(clearanceWidth))
    clearanceLeft.setAttribute('height', String(this.config.length))
    clearanceLeft.setAttribute('fill', '#888888')
    markings.appendChild(clearanceLeft)
    
    // Leitplanke
    const barrier = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    barrier.setAttribute('x', String(centerX - barrierWidth / 2))
    barrier.setAttribute('y', '0')
    barrier.setAttribute('width', String(barrierWidth))
    barrier.setAttribute('height', String(this.config.length))
    barrier.setAttribute('fill', '#d4d4d4')
    markings.appendChild(barrier)
    
    // Freifläche rechts
    const clearanceRight = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    clearanceRight.setAttribute('x', String(centerX + barrierWidth / 2))
    clearanceRight.setAttribute('y', '0')
    clearanceRight.setAttribute('width', String(clearanceWidth))
    clearanceRight.setAttribute('height', String(this.config.length))
    clearanceRight.setAttribute('fill', '#888888')
    markings.appendChild(clearanceRight)
    
    // Weiße Linien als Fahrbahnbegrenzung
    this.addLine(svgDoc, markings, centerX - totalWidth / 2, 0, centerX - totalWidth / 2, this.config.length, '#ffffff', 3, 'solid')
    this.addLine(svgDoc, markings, centerX + totalWidth / 2, 0, centerX + totalWidth / 2, this.config.length, '#ffffff', 3, 'solid')
  }

  /**
   * Radfahrstreifen/Schutzstreifen auf der Fahrbahn
   */
  private addOnRoadCycleLanes(svgDoc: Document, roadBody: SVGElement, markings: SVGElement, leftOffset: number): void {
    const left = this.config.leftSide
    const right = this.config.rightSide
    const isAsphalt = !this.config.surface?.type || this.config.surface.type === 'asphalt'
    
    if (!isAsphalt) return
    
    const laneWidth = 25
    
    // Linker Radfahrstreifen
    if (left?.cyclePath?.type === 'lane' || left?.cyclePath?.type === 'advisory') {
      const surface = left.cyclePath.surface || 'red'
      const lineType = left.cyclePath.lineType || 'solid'
      
      if (surface === 'red') {
        const strip = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
        strip.setAttribute('x', String(leftOffset + 2))
        strip.setAttribute('y', '0')
        strip.setAttribute('width', String(laneWidth))
        strip.setAttribute('height', String(this.config.length))
        strip.setAttribute('fill', '#c45c5c')
        strip.setAttribute('data-cycle-lane', 'left')
        strip.setAttribute('opacity', '0.7')
        roadBody.appendChild(strip)
      }
      
      if (lineType !== 'none') {
        const lineX = leftOffset + 2 + laneWidth
        this.addCyclePathLine(svgDoc, markings, lineX, lineType)
      }
    }
    
    // Rechter Radfahrstreifen
    if (right?.cyclePath?.type === 'lane' || right?.cyclePath?.type === 'advisory') {
      const surface = right.cyclePath.surface || 'red'
      const lineType = right.cyclePath.lineType || 'solid'
      const stripX = leftOffset + this.config.width - laneWidth - 2
      
      if (surface === 'red') {
        const strip = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
        strip.setAttribute('x', String(stripX))
        strip.setAttribute('y', '0')
        strip.setAttribute('width', String(laneWidth))
        strip.setAttribute('height', String(this.config.length))
        strip.setAttribute('fill', '#c45c5c')
        strip.setAttribute('data-cycle-lane', 'right')
        strip.setAttribute('opacity', '0.7')
        roadBody.appendChild(strip)
      }
      
      if (lineType !== 'none') {
        this.addCyclePathLine(svgDoc, markings, stripX, lineType)
      }
    }
  }

  /**
   * Linie zeichnen
   */
  private addLine(
    svgDoc: Document, 
    parent: SVGElement, 
    x1: number, y1: number, x2: number, y2: number, 
    color: string, width: number, type: 'solid' | 'dashed'
  ): void {
    const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(x1))
    line.setAttribute('y1', String(y1))
    line.setAttribute('x2', String(x2))
    line.setAttribute('y2', String(y2))
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', String(width))
    
    if (type === 'dashed') {
      line.setAttribute('stroke-dasharray', '24 48')
      const lineLength = Math.abs(y2 - y1)
      const dashCycle = 72
      const roadCenter = lineLength / 2
      const idealStrichStart = roadCenter - 12
      const cycleNumber = Math.floor(idealStrichStart / dashCycle)
      const actualStrichStart = cycleNumber * dashCycle
      const offset = actualStrichStart - idealStrichStart
      line.setAttribute('stroke-dashoffset', String(offset))
    }
    
    parent.appendChild(line)
  }
  
  /**
   * Radweg-Trennlinie
   */
  private addCyclePathLine(svgDoc: Document, parent: SVGElement, x: number, type: 'solid' | 'dashed'): void {
    const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(x))
    line.setAttribute('y1', '0')
    line.setAttribute('x2', String(x))
    line.setAttribute('y2', String(this.config.length))
    line.setAttribute('stroke', '#ffffff')
    line.setAttribute('stroke-width', '2')
    
    if (type === 'dashed') {
      line.setAttribute('stroke-dasharray', '8 16')
      const lineLength = this.config.length
      const dashCycle = 24
      const roadCenter = lineLength / 2
      const idealStrichStart = roadCenter - 4
      const cycleNumber = Math.floor(idealStrichStart / dashCycle)
      const actualStrichStart = cycleNumber * dashCycle
      const dashOffset = actualStrichStart - idealStrichStart
      line.setAttribute('stroke-dashoffset', String(dashOffset))
    }
    
    parent.appendChild(line)
  }

  /**
   * Berechne die X-Position für eine Spur (Mitte)
   * Berücksichtigt physische Trennbreiten
   */
  getLaneCenter(laneIndex: number, leftSideWidth: number): number {
    const lanes = this.config.lanes
    const lines = this.config.lines || []
    const defaultType = this.config.defaultLineType || 'dashed'
    
    let totalPhysicalWidth = 0
    for (let i = 0; i < lanes - 1; i++) {
      const line = lines[i]
      const lineType = line?.type || defaultType
      totalPhysicalWidth += this.getLinePhysicalWidth(lineType, line?.width)
    }
    
    const availableWidth = this.config.width - totalPhysicalWidth
    const laneWidth = availableWidth / lanes
    
    let x = leftSideWidth
    for (let i = 0; i <= laneIndex; i++) {
      if (i === laneIndex) {
        x += laneWidth / 2
      } else {
        x += laneWidth
        // Plus die Linie nach dieser Spur
        const line = lines[i]
        const lineType = line?.type || defaultType
        x += this.getLinePhysicalWidth(lineType, line?.width)
      }
    }
    
    return x
  }
}
