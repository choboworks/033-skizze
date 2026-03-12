// generator/modules/DimensionModule.ts

import type { SmartRoadConfig } from '../../types'

/**
 * DimensionModule - Handhabt Breite und Länge der Straße
 * 
 * Verantwortlichkeiten:
 * - Länge anpassen (vertical scaling)
 * - Breite anpassen (horizontal scaling) 
 * - Road-Body positionieren
 * - Edges positionieren basierend auf Randausstattung
 */
export class DimensionModule {
  private config: SmartRoadConfig
  private leftOffset: number = 0
  
  constructor(config: SmartRoadConfig) {
    this.config = config
  }

  /**
   * Länge der Straße anpassen (vertikal)
   */
  adjustLength(svgDoc: Document, templateLength: number): void {
    const scale = this.config.length / templateLength
    
    // Road-Body vertikal strecken
    const roadBody = svgDoc.getElementById('road-body')
    if (roadBody) {
      roadBody.querySelectorAll('rect').forEach(rect => {
        const h = Number(rect.getAttribute('height') || templateLength)
        rect.setAttribute('height', String(h * scale))
      })
    }
    
    // Ränder verlängern
    const edges = svgDoc.getElementById('road-edges')
    if (edges) {
      edges.querySelectorAll('rect').forEach(rect => {
        const h = Number(rect.getAttribute('height') || templateLength)
        rect.setAttribute('height', String(h * scale))
      })
    }
  }

  /**
   * Breite der Straße anpassen (horizontal)
   * @param leftSideWidth - Breite der linken Randausstattung (vom RoadsideModule berechnet)
   */
  adjustWidth(svgDoc: Document, templateWidth: number, leftSideWidth: number = 0): void {
    const scale = this.config.width / templateWidth
    
    // leftOffset speichern für später
    this.leftOffset = leftSideWidth
    
    // Road-Body horizontal strecken UND verschieben
    const roadBody = svgDoc.getElementById('road-body')
    if (roadBody) {
      roadBody.querySelectorAll('rect').forEach(rect => {
        const w = Number(rect.getAttribute('width') || templateWidth)
        rect.setAttribute('width', String(w * scale))
        // Verschiebe um leftSideWidth (Randausstattung)
        rect.setAttribute('x', String(leftSideWidth))
      })
    }
    
    // Edges positionieren
    this.adjustEdges(svgDoc, leftSideWidth)
  }

  /**
   * Positioniert Edges basierend auf Randausstattung
   */
  private adjustEdges(svgDoc: Document, leftSideWidth: number): void {
    const edges = svgDoc.getElementById('road-edges')
    if (!edges) return

    const surfaceType = this.config.surface?.type || 'asphalt'
    const left = this.config.leftSide
    const right = this.config.rightSide
    
    // Pro Seite prüfen ob Randausstattung vorhanden ist
    const hasLeftRoadside = !!(
      left?.sidewalk?.width || 
      left?.curb ||
      left?.cyclePath?.type === 'separated' ||
      left?.greenStrip?.width ||
      left?.barrier
    )
    const hasRightRoadside = !!(
      right?.sidewalk?.width || 
      right?.curb ||
      right?.cyclePath?.type === 'separated' ||
      right?.greenStrip?.width ||
      right?.barrier ||
      right?.ramp  // Zubringer
    )
    
    if (surfaceType === 'asphalt') {
      const leftEdge = svgDoc.getElementById('edge-left')
      const rightEdge = svgDoc.getElementById('edge-right')
      
      // Linke Edge: nur zeichnen wenn KEINE linke Randausstattung
      if (!hasLeftRoadside && leftEdge) {
        leftEdge.setAttribute('x', String(leftSideWidth + 0.75))
        leftEdge.setAttribute('width', '2.5')
        leftEdge.setAttribute('opacity', '1')
      } else if (hasLeftRoadside && leftEdge) {
        leftEdge.setAttribute('width', '0')
        leftEdge.setAttribute('opacity', '0')
      }
      
      // Rechte Edge: nur zeichnen wenn KEINE rechte Randausstattung
      if (!hasRightRoadside && rightEdge) {
        rightEdge.setAttribute('x', String(leftSideWidth + this.config.width - 3.25))
        rightEdge.setAttribute('width', '2.5')
        rightEdge.setAttribute('opacity', '1')
      } else if (hasRightRoadside && rightEdge) {
        rightEdge.setAttribute('width', '0')
        rightEdge.setAttribute('opacity', '0')
      }
    } else {
      // Bei nicht-Asphalt: Beide Edges auf width=0
      const leftEdge = svgDoc.getElementById('edge-left')
      const rightEdge = svgDoc.getElementById('edge-right')
      if (leftEdge) {
        leftEdge.setAttribute('width', '0')
        leftEdge.setAttribute('opacity', '0')
      }
      if (rightEdge) {
        rightEdge.setAttribute('width', '0')
        rightEdge.setAttribute('opacity', '0')
      }
    }
  }

  /**
   * Public getter für leftOffset (wird von anderen Modulen benötigt)
   */
  getLeftOffset(): number {
    return this.leftOffset
  }
}