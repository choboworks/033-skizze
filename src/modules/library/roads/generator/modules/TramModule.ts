// generator/modules/TramModule.ts

import type { SmartRoadConfig } from '../../types'

/**
 * TramModule - Rendert Straßenbahn-Gleise auf geraden Straßen
 * 
 * Gleisarten:
 * - embedded: Schienen im Fahrbahnbelag (Rillen + Schienen)
 * - dedicated: Eigener Gleiskörper (erhöht, Bordstein-getrennt)
 * - grass: Rasengleis (begrünte Fläche mit Schienen)
 * 
 * Position: center, left, right
 * Tracks: 1 (eingleisig) oder 2 (zweigleisig)
 */
export class TramModule {
  private config: SmartRoadConfig

  constructor(config: SmartRoadConfig) {
    this.config = config
  }

  /**
   * Berechnet die Breite des Gleisbereichs
   */
  getTramWidth(): number {
    const tram = this.config.tram
    if (!tram) return 0
    if (tram.width) return tram.width
    // Auto: 1 Gleis = 20px, 2 Gleise = 36px
    return tram.tracks === 1 ? 20 : 36
  }

  /**
   * Fügt Straßenbahn-Gleise zum SVG hinzu
   */
  addTramTracks(svgDoc: Document, leftSideWidth: number): void {
    const tram = this.config.tram
    if (!tram) return

    const svgRoot = svgDoc.documentElement
    const roadWidth = this.config.width
    const roadLength = this.config.length
    const tramWidth = this.getTramWidth()

    // Position berechnen
    const tramX = this.getTramX(leftSideWidth, roadWidth, tramWidth, tram.position)

    // Gruppe erstellen
    const group = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('id', 'tram-tracks')

    // Gleiskörper-Hintergrund
    this.addTrackBed(svgDoc, group, tramX, tramWidth, roadLength, tram.trackType)

    // Schienen zeichnen
    this.addRails(svgDoc, group, tramX, tramWidth, roadLength, tram.tracks)

    // Bordsteine bei dedicated/grass
    if (tram.trackType === 'dedicated' || tram.trackType === 'grass') {
      this.addTrackBorders(svgDoc, group, tramX, tramWidth, roadLength)
    }

    svgRoot.appendChild(group)
  }

  /**
   * Berechnet die X-Position des Gleisbereichs
   */
  private getTramX(leftSideWidth: number, roadWidth: number, tramWidth: number, position: string): number {
    const roadStart = leftSideWidth
    switch (position) {
      case 'left':
        return roadStart + 4 // kleiner Abstand zum linken Rand
      case 'right':
        return roadStart + roadWidth - tramWidth - 4
      case 'center':
      default:
        return roadStart + (roadWidth - tramWidth) / 2
    }
  }

  /**
   * Gleisbett/Hintergrund zeichnen
   */
  private addTrackBed(
    svgDoc: Document,
    group: Element,
    x: number,
    width: number,
    length: number,
    trackType: string
  ): void {
    const rect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(x))
    rect.setAttribute('y', '0')
    rect.setAttribute('width', String(width))
    rect.setAttribute('height', String(length))

    switch (trackType) {
      case 'grass':
        rect.setAttribute('fill', '#6a8f4e')
        break
      case 'dedicated':
        rect.setAttribute('fill', '#888888')
        break
      case 'embedded':
      default:
        // Eingebettet: leicht dunklere Fahrbahnfarbe
        rect.setAttribute('fill', '#5a5a5a')
        break
    }

    group.appendChild(rect)
  }

  /**
   * Schienen zeichnen
   */
  private addRails(
    svgDoc: Document,
    group: Element,
    tramX: number,
    tramWidth: number,
    length: number,
    tracks: 1 | 2
  ): void {
    const railColor = '#c0c0c0'
    const railWidth = 2
    const gaugeWidth = 10 // Spurweite (Abstand zwischen 2 Schienen eines Gleises)

    if (tracks === 1) {
      // Eingleisig: 2 Schienen in der Mitte
      const centerX = tramX + tramWidth / 2
      this.drawRailPair(svgDoc, group, centerX, gaugeWidth, railWidth, railColor, length)
    } else {
      // Zweigleisig: 2 Gleispaare
      const gap = 4 // Abstand zwischen den Gleisen
      const trackCenterLeft = tramX + tramWidth / 2 - gap / 2 - gaugeWidth / 2
      const trackCenterRight = tramX + tramWidth / 2 + gap / 2 + gaugeWidth / 2
      this.drawRailPair(svgDoc, group, trackCenterLeft, gaugeWidth, railWidth, railColor, length)
      this.drawRailPair(svgDoc, group, trackCenterRight, gaugeWidth, railWidth, railColor, length)
    }
  }

  /**
   * Ein Schienenpaar zeichnen (2 parallele Linien)
   */
  private drawRailPair(
    svgDoc: Document,
    group: Element,
    centerX: number,
    gaugeWidth: number,
    railWidth: number,
    color: string,
    length: number
  ): void {
    const leftRail = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    leftRail.setAttribute('x1', String(centerX - gaugeWidth / 2))
    leftRail.setAttribute('y1', '0')
    leftRail.setAttribute('x2', String(centerX - gaugeWidth / 2))
    leftRail.setAttribute('y2', String(length))
    leftRail.setAttribute('stroke', color)
    leftRail.setAttribute('stroke-width', String(railWidth))
    group.appendChild(leftRail)

    const rightRail = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    rightRail.setAttribute('x1', String(centerX + gaugeWidth / 2))
    rightRail.setAttribute('y1', '0')
    rightRail.setAttribute('x2', String(centerX + gaugeWidth / 2))
    rightRail.setAttribute('y2', String(length))
    rightRail.setAttribute('stroke', color)
    rightRail.setAttribute('stroke-width', String(railWidth))
    group.appendChild(rightRail)

    // Schwellen nur bei eingebetteten Gleisen
    if (this.config.tram?.trackType === 'embedded') {
      const tieSpacing = 20
      const tieWidth = gaugeWidth + 6
      for (let y = 10; y < length; y += tieSpacing) {
        const tie = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
        tie.setAttribute('x', String(centerX - tieWidth / 2))
        tie.setAttribute('y', String(y - 1.5))
        tie.setAttribute('width', String(tieWidth))
        tie.setAttribute('height', '3')
        tie.setAttribute('fill', '#8b7355')
        tie.setAttribute('opacity', '0.6')
        group.appendChild(tie)
      }
    }
  }

  /**
   * Bordsteine am Gleisrand zeichnen (für dedicated/grass)
   */
  private addTrackBorders(
    svgDoc: Document,
    group: Element,
    x: number,
    width: number,
    length: number
  ): void {
    const borderColor = '#999999'
    const borderWidth = 2

    // Linker Bordstein
    const leftBorder = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    leftBorder.setAttribute('x1', String(x))
    leftBorder.setAttribute('y1', '0')
    leftBorder.setAttribute('x2', String(x))
    leftBorder.setAttribute('y2', String(length))
    leftBorder.setAttribute('stroke', borderColor)
    leftBorder.setAttribute('stroke-width', String(borderWidth))
    group.appendChild(leftBorder)

    // Rechter Bordstein
    const rightBorder = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    rightBorder.setAttribute('x1', String(x + width))
    rightBorder.setAttribute('y1', '0')
    rightBorder.setAttribute('x2', String(x + width))
    rightBorder.setAttribute('y2', String(length))
    rightBorder.setAttribute('stroke', borderColor)
    rightBorder.setAttribute('stroke-width', String(borderWidth))
    group.appendChild(rightBorder)
  }
}