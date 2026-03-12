// generator/modules/SurfaceModule.ts

import type { SmartRoadConfig } from '../../types'

/**
 * SurfaceModule - Handhabt Oberflächentexturen
 * 
 * Verantwortlichkeiten:
 * - Oberflächentexturen auf road-body anwenden
 * - SVG Patterns erstellen (Kopfsteinpflaster, Beton, etc.)
 */
export class SurfaceModule {
  private config: SmartRoadConfig
  
  constructor(config: SmartRoadConfig) {
    this.config = config
  }

  /**
   * Oberflächentextur anwenden
   */
  applySurface(svgDoc: Document): void {
    const surfaceType = this.config.surface?.type || 'asphalt'
    
    // Patterns erstellen (falls noch nicht vorhanden)
    this.ensureSurfacePatterns(svgDoc)
    
    // road-body mit entsprechendem Pattern füllen
    const roadBody = svgDoc.getElementById('road-body')
    if (!roadBody) return
    
    const rects = roadBody.querySelectorAll('rect')
    if (rects.length === 0) return
    
    // Pattern oder Solid-Fill anwenden
    // WICHTIG: Radweg-Streifen (data-cycle-lane) NICHT überschreiben!
    rects.forEach(rect => {
      // Skip cycle lane stripes - they have their own color
      if (rect.getAttribute('data-cycle-lane')) {
        return
      }
      
      let fillValue = '#6b6b6b'  // Default Asphalt
      
      switch (surfaceType) {
        case 'asphalt':
          fillValue = '#6b6b6b'
          break
        case 'pavement':  // Kopfsteinpflaster
          fillValue = 'url(#pattern-pavement)'
          break
        case 'cobblestone':  // Pflastersteine
          fillValue = 'url(#pattern-cobblestone)'
          break
        case 'concrete':  // Beton
          fillValue = 'url(#pattern-concrete)'
          break
        case 'gravel':  // Schotter
          fillValue = 'url(#pattern-gravel)'
          break
        default:
          fillValue = '#6b6b6b'
      }
      
      rect.setAttribute('fill', fillValue)
    })
  }

  /**
   * SVG Patterns für Texturen erstellen
   */
  private ensureSurfacePatterns(svgDoc: Document): void {
    let defs = svgDoc.querySelector('defs')
    if (!defs) {
      defs = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'defs')
      svgDoc.documentElement.insertBefore(defs, svgDoc.documentElement.firstChild)
    }
    
    // Prüfen ob Patterns schon existieren
    if (defs.querySelector('#pattern-pavement')) return
    
    // Pattern 1: Kopfsteinpflaster
    this.createPavementPattern(svgDoc, defs)
    
    // Pattern 2: Pflastersteine
    this.createCobblestonePattern(svgDoc, defs)
    
    // Pattern 3: Beton
    this.createConcretePattern(svgDoc, defs)
    
    // Pattern 4: Schotter
    this.createGravelPattern(svgDoc, defs)
  }

  /**
   * Kopfsteinpflaster Pattern
   */
  private createPavementPattern(svgDoc: Document, defs: Element): void {
    const pavement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    pavement.setAttribute('id', 'pattern-pavement')
    pavement.setAttribute('width', '20')
    pavement.setAttribute('height', '20')
    pavement.setAttribute('patternUnits', 'userSpaceOnUse')
    
    const pavementBg = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    pavementBg.setAttribute('width', '20')
    pavementBg.setAttribute('height', '20')
    pavementBg.setAttribute('fill', '#5a5a5a')
    pavement.appendChild(pavementBg)
    
    const pavementCircles = [
      { cx: 5, cy: 5, r: 3.5, fill: '#6b6b6b' },
      { cx: 15, cy: 4, r: 3, fill: '#656565' },
      { cx: 3, cy: 15, r: 3.2, fill: '#636363' },
      { cx: 16, cy: 14, r: 3.8, fill: '#686868' },
      { cx: 10, cy: 10, r: 2.8, fill: '#6a6a6a' },
    ]
    pavementCircles.forEach(c => {
      const circle = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', String(c.cx))
      circle.setAttribute('cy', String(c.cy))
      circle.setAttribute('r', String(c.r))
      circle.setAttribute('fill', c.fill)
      pavement.appendChild(circle)
    })
    defs.appendChild(pavement)
  }

  /**
   * Pflastersteine Pattern
   */
  private createCobblestonePattern(svgDoc: Document, defs: Element): void {
    const cobblestone = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    cobblestone.setAttribute('id', 'pattern-cobblestone')
    cobblestone.setAttribute('width', '20')
    cobblestone.setAttribute('height', '10')
    cobblestone.setAttribute('patternUnits', 'userSpaceOnUse')
    
    const cobbleBg = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cobbleBg.setAttribute('width', '20')
    cobbleBg.setAttribute('height', '10')
    cobbleBg.setAttribute('fill', '#7a7a7a')
    cobblestone.appendChild(cobbleBg)
    
    const cobbleRect1 = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cobbleRect1.setAttribute('x', '0.5')
    cobbleRect1.setAttribute('y', '0.5')
    cobbleRect1.setAttribute('width', '9')
    cobbleRect1.setAttribute('height', '9')
    cobbleRect1.setAttribute('fill', '#8a8a8a')
    cobbleRect1.setAttribute('stroke', '#5a5a5a')
    cobbleRect1.setAttribute('stroke-width', '0.5')
    cobblestone.appendChild(cobbleRect1)
    
    const cobbleRect2 = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cobbleRect2.setAttribute('x', '10.5')
    cobbleRect2.setAttribute('y', '0.5')
    cobbleRect2.setAttribute('width', '9')
    cobbleRect2.setAttribute('height', '9')
    cobbleRect2.setAttribute('fill', '#888888')
    cobbleRect2.setAttribute('stroke', '#5a5a5a')
    cobbleRect2.setAttribute('stroke-width', '0.5')
    cobblestone.appendChild(cobbleRect2)
    defs.appendChild(cobblestone)
  }

  /**
   * Beton Pattern
   */
  private createConcretePattern(svgDoc: Document, defs: Element): void {
    const concrete = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    concrete.setAttribute('id', 'pattern-concrete')
    concrete.setAttribute('width', '30')
    concrete.setAttribute('height', '30')
    concrete.setAttribute('patternUnits', 'userSpaceOnUse')
    
    const concreteBg = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    concreteBg.setAttribute('width', '30')
    concreteBg.setAttribute('height', '30')
    concreteBg.setAttribute('fill', '#8a8a8a')
    concrete.appendChild(concreteBg)
    
    const concreteLine1 = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    concreteLine1.setAttribute('x1', '0')
    concreteLine1.setAttribute('y1', '0')
    concreteLine1.setAttribute('x2', '30')
    concreteLine1.setAttribute('y2', '0')
    concreteLine1.setAttribute('stroke', '#6a6a6a')
    concreteLine1.setAttribute('stroke-width', '1')
    concrete.appendChild(concreteLine1)
    
    const concreteLine2 = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
    concreteLine2.setAttribute('x1', '0')
    concreteLine2.setAttribute('y1', '0')
    concreteLine2.setAttribute('x2', '0')
    concreteLine2.setAttribute('y2', '30')
    concreteLine2.setAttribute('stroke', '#6a6a6a')
    concreteLine2.setAttribute('stroke-width', '1')
    concrete.appendChild(concreteLine2)
    defs.appendChild(concrete)
  }

  /**
   * Schotter Pattern
   */
  private createGravelPattern(svgDoc: Document, defs: Element): void {
    const gravel = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    gravel.setAttribute('id', 'pattern-gravel')
    gravel.setAttribute('width', '15')
    gravel.setAttribute('height', '15')
    gravel.setAttribute('patternUnits', 'userSpaceOnUse')
    
    const gravelBg = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    gravelBg.setAttribute('width', '15')
    gravelBg.setAttribute('height', '15')
    gravelBg.setAttribute('fill', '#7a7a7a')
    gravel.appendChild(gravelBg)
    
    const gravelDots = [
      { cx: 2, cy: 3, r: 1, fill: '#5a5a5a' },
      { cx: 7, cy: 2, r: 1.5, fill: '#6a6a6a' },
      { cx: 12, cy: 4, r: 1.2, fill: '#656565' },
      { cx: 4, cy: 8, r: 1.3, fill: '#636363' },
      { cx: 10, cy: 7, r: 1, fill: '#686868' },
      { cx: 13, cy: 11, r: 1.4, fill: '#6a6a6a' },
      { cx: 5, cy: 13, r: 1.1, fill: '#5a5a5a' },
      { cx: 8, cy: 12, r: 1.2, fill: '#656565' },
      { cx: 2, cy: 10, r: 1, fill: '#636363' },
      { cx: 11, cy: 13, r: 1.3, fill: '#686868' },
    ]
    gravelDots.forEach(d => {
      const circle = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', String(d.cx))
      circle.setAttribute('cy', String(d.cy))
      circle.setAttribute('r', String(d.r))
      circle.setAttribute('fill', d.fill)
      gravel.appendChild(circle)
    })
    defs.appendChild(gravel)
  }
}
