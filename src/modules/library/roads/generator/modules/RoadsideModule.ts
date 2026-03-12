// generator/modules/RoadsideModule.ts

import type { SmartRoadConfig, CurbType, RoadsideConfig, RoadsideElementType } from '../../types'
import { getActiveOrder, getElementWidth } from '../../types'

/**
 * RoadsideModule - Handhabt Randausstattung
 * 
 * Verantwortlichkeiten:
 * - Gehwege hinzufügen (Innerorts)
 * - Bordsteine zeichnen
 * - Radwege hinzufügen (baulich getrennt, Streifen, Schutzstreifen)
 * - Standstreifen/Grünstreifen (Autobahn/Außerorts)
 * - Edge-Linien behandeln
 */
export class RoadsideModule {
  private config: SmartRoadConfig
  
  constructor(config: SmartRoadConfig) {
    this.config = config
  }

  /**
   * Berechnet die Gesamtbreite der linken Randausstattung
   */
  getLeftSideWidth(): number {
    const left = this.config.leftSide
    if (!left) return 0
    return getActiveOrder(left).reduce((w, el) => w + getElementWidth(left, el), 0)
  }

  /**
   * Berechnet die Gesamtbreite der rechten Randausstattung
   */
  getRightSideWidth(): number {
    const right = this.config.rightSide
    if (!right) return 0
    let width = getActiveOrder(right).reduce((w, el) => w + getElementWidth(right, el), 0)
    // Ramp ist nicht im order-Array (feste Position)
    if (right.ramp) width += 30
    return width
  }

  /**
   * Randausstattung hinzufügen
   */
  addRoadsides(svgDoc: Document, roadBodyX: number): void {
    const svgRoot = svgDoc.documentElement as unknown as SVGSVGElement
    const markings = svgDoc.getElementById('lane-markings') as unknown as SVGElement
    if (!svgRoot || !markings) return
    
    // Linke Seite zeichnen (von außen nach innen)
    this.drawLeftSide(svgDoc, svgRoot, markings)
    
    // Rechte Seite zeichnen (von innen nach außen)
    this.drawRightSide(svgDoc, svgRoot, markings, roadBodyX + this.config.width)
    
    // On-Road Parkplätze (innerhalb der Fahrbahn)
    this.drawOnRoadParkingSpaces(svgDoc, markings)
    
    // Edges behandeln
    this.handleEdges(svgDoc)
  }

  /**
   * On-Road Parkplätze zeichnen (innerhalb der Fahrbahn)
   */
  private drawOnRoadParkingSpaces(svgDoc: Document, markings: SVGElement): void {
    const left = this.config.leftSide
    const right = this.config.rightSide
    const leftSideWidth = this.getLeftSideWidth()
    
    // Linke on-road Parkplätze (max 25px für Längsparken)
    if (left?.parking?.type === 'on-road') {
      const parkingWidth = Math.min(left.parking.width || 25, 25)
      const parkingX = leftSideWidth + 2  // 2px vom Rand
      this.drawOnRoadParking(svgDoc, markings, parkingX, parkingWidth, 'left')
    }
    
    // Rechte on-road Parkplätze (max 25px für Längsparken)
    if (right?.parking?.type === 'on-road') {
      const parkingWidth = Math.min(right.parking.width || 25, 25)
      const parkingX = leftSideWidth + this.config.width - parkingWidth - 2  // 2px vom Rand
      this.drawOnRoadParking(svgDoc, markings, parkingX, parkingWidth, 'right')
    }
  }

  /**
   * Linke Seite zeichnen
   * Reihenfolge von außen nach innen: Gehweg → Bordstein → Radweg → Parkplätze → Leitplanke → Standstreifen → Fahrbahn
   */
  private drawLeftSide(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    markings: SVGElement
  ): void {
    const left = this.config.leftSide
    if (!left) return
    
    // Links: von außen nach innen (order umkehren)
    const order = getActiveOrder(left).slice().reverse()
    let currentX = 0
    
    for (const el of order) {
      const w = getElementWidth(left, el)
      if (w <= 0) continue
      this.drawSideElement(svgDoc, svgRoot, markings, left, el, currentX, w, 'left')
      currentX += w
    }
  }

  /**
   * Rechte Seite zeichnen
   * Reihenfolge von innen nach außen: Fahrbahn → Standstreifen → Parkplätze → Beschleunigungsstreifen → Leitplanke → Radweg → Grünfläche → Bordstein → Gehweg
   */
  private drawRightSide(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    markings: SVGElement,
    fahrbahnEndeX: number
  ): void {
    const right = this.config.rightSide
    if (!right) return
    
    let currentX = fahrbahnEndeX
    
    // Ramp hat feste Position (direkt an Fahrbahn, vor den order-Elementen)
    // Aber Ramp-Position hängt davon ab wo emergencyLane und parking sind...
    // Ramp wird nach dem ersten Block gezeichnet (emergencyLane + parking vor Ramp)
    
    // Rechts: von innen nach außen (order normal)
    const order = getActiveOrder(right)
    
    for (const el of order) {
      const w = getElementWidth(right, el)
      if (w <= 0) continue
      this.drawSideElement(svgDoc, svgRoot, markings, right, el, currentX, w, 'right')
      currentX += w
    }
    
    // Ramp separat (feste Position direkt an Fahrbahn)
    if (right.ramp) {
      this.drawRamp(svgDoc, svgRoot, markings, fahrbahnEndeX)
    }
  }
  
  /**
   * Einzelnes Seitenelement zeichnen (generisch)
   */
  private drawSideElement(
    svgDoc: Document,
    svgRoot: SVGSVGElement,
    markings: SVGElement,
    side: RoadsideConfig,
    el: RoadsideElementType,
    x: number,
    w: number,
    sideDir: 'left' | 'right'
  ): void {
    switch (el) {
      case 'sidewalk':
        this.drawSidewalk(svgDoc, svgRoot, x, w, side.sidewalk?.surface || 'tiles')
        break
      case 'curb':
        if (side.curb && side.curb !== 'none') this.drawCurb(svgDoc, svgRoot, x, side.curb)
        break
      case 'cyclePath':
        if (side.cyclePath?.type === 'separated') this.drawSeparatedCyclePath(svgDoc, svgRoot, markings, x, w, sideDir)
        break
      case 'greenStrip':
        if (side.greenStrip?.width) this.drawGreenStrip(svgDoc, svgRoot, x, w)
        break
      case 'barrier':
        if (side.barrier) this.drawBarrier(svgDoc, svgRoot, x)
        break
      case 'emergencyLane':
        if (side.emergencyLane?.width) this.drawEmergencyLane(svgDoc, svgRoot, markings, x, w, sideDir)
        break
      case 'parking':
        if (side.parking?.type === 'separated') this.drawParking(svgDoc, svgRoot, markings, x, w, side.parking.orientation || 'parallel', sideDir)
        break
    }
  }

  /**
   * Gehweg zeichnen
   */
  private drawSidewalk(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    x: number, 
    width: number,
    surface: 'concrete' | 'tiles' | 'pavement'
  ): void {
    const sidewalk = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    sidewalk.setAttribute('x', String(x))
    sidewalk.setAttribute('y', '0')
    sidewalk.setAttribute('width', String(width))
    sidewalk.setAttribute('height', String(this.config.length))
    sidewalk.setAttribute('data-roadside', 'sidewalk')
    
    // Fill basierend auf Oberfläche (alle als solide Farben)
    if (surface === 'tiles') {
      sidewalk.setAttribute('fill', '#c8c0b0')  // Gehwegplatten - beige
    } else if (surface === 'concrete') {
      sidewalk.setAttribute('fill', '#b8b8b8')  // Beton - hellgrau
    } else if (surface === 'pavement') {
      sidewalk.setAttribute('fill', '#a0a0a0')  // Pflaster - mittelgrau
    }
    
    // Am Anfang einfügen (unter der Fahrbahn)
    svgRoot.insertBefore(sidewalk, svgRoot.firstChild)
  }

  /**
   * Patterns für Gehweg-Oberflächen (nicht mehr benötigt - solide Farben)
   * Methode bleibt für Abwärtskompatibilität
   */
  ensurePatterns(svgDoc: Document): void {
    // Patterns werden nicht mehr verwendet - alle Oberflächen sind jetzt solide Farben
    void svgDoc
  }

  /**
   * Bordstein zeichnen
   */
  private drawCurb(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    x: number,
    type: CurbType
  ): void {
    const curb = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    curb.setAttribute('x', String(x))
    curb.setAttribute('y', '0')
    curb.setAttribute('width', '3')
    curb.setAttribute('height', String(this.config.length))
    curb.setAttribute('data-roadside', 'curb')
    
    // Farbe basierend auf Typ
    if (type === 'lowered') {
      curb.setAttribute('fill', '#606060')  // Dunkler für abgesenkt
    } else {
      curb.setAttribute('fill', '#4a4a4a')  // Standard
    }
    
    svgRoot.insertBefore(curb, svgRoot.firstChild)
  }

  /**
   * Baulich getrennten Radweg zeichnen (rot)
   */
  private drawSeparatedCyclePath(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    markings: SVGElement,
    x: number, 
    width: number,
    side: 'left' | 'right'
  ): void {
    const sideConfig = side === 'left' ? this.config.leftSide : this.config.rightSide
    const cyclePathConfig = sideConfig?.cyclePath
    
    // Radweg-Fläche (rot oder asphalt)
    const bikePath = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bikePath.setAttribute('x', String(x))
    bikePath.setAttribute('y', '0')
    bikePath.setAttribute('width', String(width))
    bikePath.setAttribute('height', String(this.config.length))
    bikePath.setAttribute('fill', cyclePathConfig?.surface === 'asphalt' ? '#6b6b6b' : '#c45c5c')
    bikePath.setAttribute('data-roadside', 'cyclepath-separated')
    
    svgRoot.insertBefore(bikePath, svgRoot.firstChild)
    
    // Weiße Trennlinie zur Fahrbahn (nur wenn nicht 'none')
    const lineType = cyclePathConfig?.lineType || 'solid'
    if (lineType !== 'none') {
      const lineX = side === 'left' ? x + width : x
      
      // Bei gestrichelten Linien: feineres Muster, symmetrisch
      if (lineType === 'dashed') {
        this.addCyclePathLine(svgDoc, markings, lineX, 0, lineX, this.config.length, '#ffffff', 2)
      } else {
        this.addLine(svgDoc, markings, lineX, 0, lineX, this.config.length, '#ffffff', 2, 'solid')
      }
    }
  }

  /**
   * Radweg-Trennlinie mit feinerem Dash-Pattern (realistischer)
   */
  private addCyclePathLine(
    svgDoc: Document, 
    parent: SVGElement, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    color: string, 
    width: number
  ): void {
    const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(x1))
    line.setAttribute('y1', String(y1))
    line.setAttribute('x2', String(x2))
    line.setAttribute('y2', String(y2))
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', String(width))
    line.setAttribute('stroke-dasharray', '8 16')  // Feineres Muster für Radweg
    
    // Symmetrische Berechnung: Ein Strich soll in der Mitte zentriert sein
    // Bei "8 16" ist der Strich 8px, die Lücke 16px, Zyklus = 24px
    const lineLength = y2 - y1
    const dashCycle = 24  // 8 + 16
    const roadCenter = lineLength / 2
    // Idealerweise beginnt ein Strich bei roadCenter - 4 (halbe Strichlänge)
    const idealStrichStart = roadCenter - 4
    const cycleNumber = Math.floor(idealStrichStart / dashCycle)
    const actualStrichStart = cycleNumber * dashCycle
    const dashOffset = actualStrichStart - idealStrichStart
    line.setAttribute('stroke-dashoffset', String(dashOffset))
    
    parent.appendChild(line)
  }

  /**
   * Grünstreifen zeichnen
   */
  private drawGreenStrip(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    x: number, 
    width: number
  ): void {
    const strip = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    strip.setAttribute('x', String(x))
    strip.setAttribute('y', '0')
    strip.setAttribute('width', String(width))
    strip.setAttribute('height', String(this.config.length))
    strip.setAttribute('fill', '#5a7a5a')  // Grün
    strip.setAttribute('data-roadside', 'greenstrip')
    
    svgRoot.insertBefore(strip, svgRoot.firstChild)
  }

  /**
   * Leitplanke zeichnen
   */
  private drawBarrier(
    svgDoc: Document, 
    svgRoot: SVGSVGElement, 
    x: number
  ): void {
    const barrierWidth = 8
    
    // Leitplanke Basis (silber/grau)
    const barrier = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    barrier.setAttribute('x', String(x))
    barrier.setAttribute('y', '0')
    barrier.setAttribute('width', String(barrierWidth))
    barrier.setAttribute('height', String(this.config.length))
    barrier.setAttribute('fill', '#94a3b8')  // Silber/Grau
    barrier.setAttribute('data-roadside', 'barrier')
    
    svgRoot.insertBefore(barrier, svgRoot.firstChild)
    
    // Pfosten symmetrisch angeordnet - innerhalb der Leitplanke
    const halfGap = 14
    const availableLength = this.config.length - 2 * halfGap
    const postSpacing = 50
    const postCount = Math.floor(availableLength / postSpacing) + 1
    const totalPostsLength = (postCount - 1) * postSpacing
    const startY = halfGap + (availableLength - totalPostsLength) / 2
    
    for (let i = 0; i < postCount; i++) {
      const post = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
      // Pfosten zentriert innerhalb der Leitplanke (x + 2 für 4px Pfosten in 8px Leitplanke)
      post.setAttribute('x', String(x + 2))
      post.setAttribute('y', String(startY + i * postSpacing - 4))
      post.setAttribute('width', '4')
      post.setAttribute('height', '8')
      post.setAttribute('fill', '#64748b')  // Dunkelgrau
      post.setAttribute('data-roadside', 'barrier-post')
      
      svgRoot.appendChild(post)
    }
  }

  /**
   * Standstreifen zeichnen (gleicher Asphalt wie Fahrbahn)
   */
  private drawEmergencyLane(
    svgDoc: Document, 
    svgRoot: SVGSVGElement,
    markings: SVGElement,
    x: number,
    width: number,
    side: 'left' | 'right'
  ): void {
    // Asphalt-Fläche (gleiche Farbe wie Fahrbahn)
    const lane = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    lane.setAttribute('x', String(x))
    lane.setAttribute('y', '0')
    lane.setAttribute('width', String(width))
    lane.setAttribute('height', String(this.config.length))
    lane.setAttribute('fill', '#6b6b6b')  // Gleiche Asphalt-Farbe
    lane.setAttribute('data-roadside', 'emergency-lane')
    
    svgRoot.insertBefore(lane, svgRoot.firstChild)
    
    // Randlinie zur Fahrbahn (durchgezogen weiß)
    const lineX = side === 'left' ? x + width : x
    const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(lineX))
    line.setAttribute('y1', '0')
    line.setAttribute('x2', String(lineX))
    line.setAttribute('y2', String(this.config.length))
    line.setAttribute('stroke', '#ffffff')
    line.setAttribute('stroke-width', '2')
    line.setAttribute('data-roadside', 'emergency-lane-line')
    
    markings.appendChild(line)
  }

  /**
   * Parkplätze zeichnen (baulich getrennt)
   */
  private drawParking(
    svgDoc: Document, 
    svgRoot: SVGSVGElement,
    markings: SVGElement,
    x: number,
    width: number,
    orientation: 'parallel' | 'perpendicular' | 'angled',
    side: 'left' | 'right'
  ): void {
    // Asphalt-Fläche
    const parking = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    parking.setAttribute('x', String(x))
    parking.setAttribute('y', '0')
    parking.setAttribute('width', String(width))
    parking.setAttribute('height', String(this.config.length))
    parking.setAttribute('fill', '#6b6b6b')  // Gleiche Asphalt-Farbe
    parking.setAttribute('data-roadside', 'parking')
    
    svgRoot.insertBefore(parking, svgRoot.firstChild)
    
    // Randlinie zur Fahrbahn (durchgezogen weiß)
    const edgeX = side === 'left' ? x + width : x
    const edgeLine = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    edgeLine.setAttribute('x1', String(edgeX))
    edgeLine.setAttribute('y1', '0')
    edgeLine.setAttribute('x2', String(edgeX))
    edgeLine.setAttribute('y2', String(this.config.length))
    edgeLine.setAttribute('stroke', '#ffffff')
    edgeLine.setAttribute('stroke-width', '2')
    edgeLine.setAttribute('data-roadside', 'parking-edge')
    markings.appendChild(edgeLine)
    
    // Parkplatz-Markierungen basierend auf Ausrichtung
    if (orientation === 'parallel') {
      // Längsparken: horizontale Trennlinien
      const spotLength = 50 // Länge eines Stellplatzes
      
      for (let y = spotLength; y < this.config.length; y += spotLength) {
        const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', String(x))
        line.setAttribute('y1', String(y))
        line.setAttribute('x2', String(x + width))
        line.setAttribute('y2', String(y))
        line.setAttribute('stroke', '#ffffff')
        line.setAttribute('stroke-width', '1.5')
        line.setAttribute('data-roadside', 'parking-line')
        markings.appendChild(line)
      }
    } else if (orientation === 'perpendicular') {
      // Querparken: vertikale Trennlinien
      const spotWidth = 25 // Breite eines Stellplatzes
      
      for (let y = spotWidth; y < this.config.length; y += spotWidth) {
        const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', String(x))
        line.setAttribute('y1', String(y))
        line.setAttribute('x2', String(x + width))
        line.setAttribute('y2', String(y))
        line.setAttribute('stroke', '#ffffff')
        line.setAttribute('stroke-width', '1.5')
        line.setAttribute('data-roadside', 'parking-line')
        markings.appendChild(line)
      }
    } else {
      // Schrägparken: schräge Trennlinien
      const spotWidth = 30 // Breite eines Stellplatzes (schräg)
      const angleOffset = width * 0.5 // Versatz durch Schräge
      
      for (let y = spotWidth; y < this.config.length; y += spotWidth) {
        const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
        
        if (side === 'right') {
          line.setAttribute('x1', String(x))
          line.setAttribute('y1', String(y))
          line.setAttribute('x2', String(x + width))
          line.setAttribute('y2', String(y - angleOffset))
        } else {
          line.setAttribute('x1', String(x))
          line.setAttribute('y1', String(y))
          line.setAttribute('x2', String(x + width))
          line.setAttribute('y2', String(y + angleOffset))
        }
        
        line.setAttribute('stroke', '#ffffff')
        line.setAttribute('stroke-width', '1.5')
        line.setAttribute('data-roadside', 'parking-line')
        markings.appendChild(line)
      }
    }
  }

  /**
   * On-Road Parkplätze zeichnen (innerhalb der Fahrbahn)
   * Nur Längsparken erlaubt
   */
  private drawOnRoadParking(
    svgDoc: Document, 
    markings: SVGElement,
    x: number,
    width: number,
    side: 'left' | 'right'
  ): void {
    // Trennlinie zur restlichen Fahrbahn (durchgezogen weiß)
    const edgeX = side === 'left' ? x + width : x
    const edgeLine = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    edgeLine.setAttribute('x1', String(edgeX))
    edgeLine.setAttribute('y1', '0')
    edgeLine.setAttribute('x2', String(edgeX))
    edgeLine.setAttribute('y2', String(this.config.length))
    edgeLine.setAttribute('stroke', '#ffffff')
    edgeLine.setAttribute('stroke-width', '2')
    edgeLine.setAttribute('data-roadside', 'onroad-parking-edge')
    markings.appendChild(edgeLine)
    
    // Parkplatz-Markierungen (nur Längsparken bei on-road)
    const spotLength = 50 // Länge eines Stellplatzes
    
    for (let y = spotLength; y < this.config.length; y += spotLength) {
      const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', String(x))
      line.setAttribute('y1', String(y))
      line.setAttribute('x2', String(x + width))
      line.setAttribute('y2', String(y))
      line.setAttribute('stroke', '#ffffff')
      line.setAttribute('stroke-width', '1.5')
      line.setAttribute('data-roadside', 'onroad-parking-line')
      markings.appendChild(line)
    }
  }

  /**
   * Edge-Linien behandeln (bei Randausstattung ausblenden)
   */
  private handleEdges(svgDoc: Document): void {
    const left = this.config.leftSide
    const right = this.config.rightSide
    
    const hasLeftRoadside = !!(
      left?.sidewalk?.width || 
      left?.curb ||
      left?.cyclePath?.type === 'separated' ||
      left?.greenStrip?.width ||
      left?.barrier ||
      left?.emergencyLane?.width ||
      left?.parking?.type === 'separated'
    )
    const hasRightRoadside = !!(
      right?.sidewalk?.width || 
      right?.curb ||
      right?.cyclePath?.type === 'separated' ||
      right?.greenStrip?.width ||
      right?.barrier ||
      right?.emergencyLane?.width ||
      right?.parking?.type === 'separated' ||
      right?.ramp  // Beschleunigungsstreifen
    )
    
    const leftEdge = svgDoc.getElementById('edge-left')
    const rightEdge = svgDoc.getElementById('edge-right')
    
    // Linke Edge ausblenden wenn Randausstattung vorhanden
    if (hasLeftRoadside && leftEdge) {
      leftEdge.setAttribute('width', '0')
      leftEdge.setAttribute('opacity', '0')
    }
    
    // Rechte Edge ausblenden wenn Randausstattung vorhanden
    if (hasRightRoadside && rightEdge) {
      rightEdge.setAttribute('width', '0')
      rightEdge.setAttribute('opacity', '0')
    }
  }

  /**
   * Prüft ob Radfahrstreifen auf der Fahrbahn existieren
   */
  hasOnRoadCycleLanes(): { left: boolean; right: boolean } {
    return {
      left: this.config.leftSide?.cyclePath?.type === 'lane' || 
            this.config.leftSide?.cyclePath?.type === 'advisory',
      right: this.config.rightSide?.cyclePath?.type === 'lane' || 
             this.config.rightSide?.cyclePath?.type === 'advisory'
    }
  }

  /**
   * Zubringer zeichnen (trapezförmige Einfahrt)
   */
  private drawRamp(
    svgDoc: Document,
    svgRoot: SVGSVGElement,
    _markings: SVGElement,
    x: number
  ): void {
    const ramp = this.config.rightSide?.ramp
    if (!ramp) return
    
    const roadLength = this.config.length
    const laneWidth = 30
    const rampLength = Math.min(ramp.length || 200, roadLength)
    const isDecel = ramp.type === 'deceleration'
    const curveLen = laneWidth * 2.5
    
    // Positionen
    const rampStartY = isDecel ? 0 : roadLength - rampLength
    const rampEndY = isDecel ? rampLength : roadLength
    const curveY = rampStartY + curveLen // Nur für Beschleunigung relevant
    
    // Rampenfläche (1px Overlap)
    const ol = 1
    let pathD: string
    if (isDecel) {
      const exitX = x + laneWidth * 1.8
      pathD = `M ${x - ol},${rampStartY} L ${exitX},${rampStartY} C ${exitX},${rampStartY + curveLen * 0.3} ${x + laneWidth},${rampStartY + curveLen * 0.5} ${x + laneWidth},${rampStartY + curveLen} L ${x + laneWidth},${rampEndY} L ${x - ol},${rampEndY} Z`
    } else {
      // Beschleunigung/Auffahrt: Kurve oben
      pathD = `M ${x - ol},${rampStartY} C ${x + laneWidth * 0.4},${rampStartY} ${x + laneWidth},${rampStartY + curveLen * 0.3} ${x + laneWidth},${curveY} L ${x + laneWidth},${rampEndY} L ${x - ol},${rampEndY} Z`
    }
    
    const path = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', pathD)
    path.setAttribute('fill', '#6b6b6b')
    path.setAttribute('data-roadside', 'ramp')
    
    const roadBody = svgDoc.getElementById('road-body')
    if (roadBody) {
      svgRoot.insertBefore(path, roadBody)
    } else {
      svgRoot.insertBefore(path, svgRoot.firstChild)
    }
    
    // Trennlinie
    const lineLen = isDecel ? rampLength : (rampEndY - curveY)
    const solidLen = lineLen * 0.4
    
    let solidStartY: number, solidEndY: number, dashedStartY: number, dashedEndY2: number
    if (isDecel) {
      // Verzögerung/Abfahrt: durchgezogen oben, gestrichelt unten
      solidStartY = rampStartY
      solidEndY = rampStartY + lineLen * 0.4
      dashedStartY = solidEndY
      dashedEndY2 = rampEndY
    } else {
      solidStartY = rampEndY - solidLen
      solidEndY = rampEndY
      dashedStartY = rampStartY
      dashedEndY2 = solidStartY
    }
    const dashedLen = dashedEndY2 - dashedStartY
    
    // Dash-Offset
    const dashCycle = 36
    const halfDashed = dashedLen / 2
    const idealStart = halfDashed - 6
    const n = Math.floor(idealStart / dashCycle)
    const dashOffset = n * dashCycle - idealStart
    
    const rampLines = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    rampLines.setAttribute('id', 'ramp-markings')
    
    // Gestrichelte Trennlinie
    const dashedLine = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    dashedLine.setAttribute('x1', String(x))
    dashedLine.setAttribute('y1', String(dashedStartY))
    dashedLine.setAttribute('x2', String(x))
    dashedLine.setAttribute('y2', String(dashedEndY2))
    dashedLine.setAttribute('stroke', '#ffffff')
    dashedLine.setAttribute('stroke-width', '2')
    dashedLine.setAttribute('stroke-dasharray', '12 24')
    dashedLine.setAttribute('stroke-dashoffset', String(dashOffset))
    rampLines.appendChild(dashedLine)
    
    // Durchgezogene Trennlinie
    const solidLine = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    solidLine.setAttribute('x1', String(x))
    solidLine.setAttribute('y1', String(solidStartY))
    solidLine.setAttribute('x2', String(x))
    solidLine.setAttribute('y2', String(solidEndY))
    solidLine.setAttribute('stroke', '#ffffff')
    solidLine.setAttribute('stroke-width', '2')
    rampLines.appendChild(solidLine)
    
    // Außenlinie: Kurve
    if (isDecel) {
      const exitX = x + laneWidth * 1.8
      const outerCurveD = `M ${exitX},${rampStartY} C ${exitX},${rampStartY + curveLen * 0.3} ${x + laneWidth},${rampStartY + curveLen * 0.5} ${x + laneWidth},${rampStartY + curveLen}`
      const outerCurve = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path')
      outerCurve.setAttribute('d', outerCurveD)
      outerCurve.setAttribute('stroke', '#ffffff')
      outerCurve.setAttribute('stroke-width', '2')
      outerCurve.setAttribute('fill', 'none')
      rampLines.appendChild(outerCurve)
    } else {
      const outerCurveD = `M ${x},${rampStartY} C ${x + laneWidth * 0.4},${rampStartY} ${x + laneWidth},${rampStartY + curveLen * 0.3} ${x + laneWidth},${curveY}`
      const outerCurve = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path')
      outerCurve.setAttribute('d', outerCurveD)
      outerCurve.setAttribute('stroke', '#ffffff')
      outerCurve.setAttribute('stroke-width', '2')
      outerCurve.setAttribute('fill', 'none')
      rampLines.appendChild(outerCurve)
    }
    
    // Außenlinie: Gerade
    const outerLineY1 = isDecel ? rampStartY + curveLen : curveY
    const outerLineY2 = rampEndY
    const edgeLine = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    edgeLine.setAttribute('x1', String(x + laneWidth))
    edgeLine.setAttribute('y1', String(outerLineY1))
    edgeLine.setAttribute('x2', String(x + laneWidth))
    edgeLine.setAttribute('y2', String(outerLineY2))
    edgeLine.setAttribute('stroke', '#ffffff')
    edgeLine.setAttribute('stroke-width', '2')
    rampLines.appendChild(edgeLine)
    
    // Verzögerung: Fahrbahnbegrenzung oben — trennt Abfahrt von Hauptfahrbahn
    if (isDecel) {
      const topLine = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
      topLine.setAttribute('x1', String(x))
      topLine.setAttribute('y1', String(rampStartY))
      topLine.setAttribute('x2', String(x + laneWidth * 1.8))
      topLine.setAttribute('y2', String(rampStartY))
      topLine.setAttribute('stroke', '#ffffff')
      topLine.setAttribute('stroke-width', '2')
      rampLines.appendChild(topLine)
    }
    
    svgRoot.appendChild(rampLines)
  }

  /**
   * Hilfsfunktion: Linie hinzufügen
   */
  private addLine(
    svgDoc: Document, 
    parent: SVGElement, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    color: string, 
    width: number, 
    type: 'solid' | 'dashed'
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
    }
    
    parent.appendChild(line)
  }
}