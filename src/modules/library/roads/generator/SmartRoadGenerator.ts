// generator/SmartRoadGenerator.ts

import type { SmartRoadConfig } from '../types'
import { 
  DimensionModule, 
  LaneModule, 
  MarkingModule,
  RoadsideModule, 
  SurfaceModule,
  TramModule,
} from './modules'

/**
 * SmartRoadGenerator - Orchestriert die Straßengenerierung
 * 
 * REFACTORED: Nutzt Module für bessere Wartbarkeit
 * - DimensionModule: Width/Length
 * - LaneModule: Spuren & Markierungen
 * - MarkingModule: Fahrbahnmarkierungen (Pfeile, Symbole)
 * - RoadsideModule: Randausstattung (Gehwege, Radwege, Bordsteine)
 * - SurfaceModule: Oberflächentexturen
 * - TramModule: Straßenbahn-Gleise
 */
export class SmartRoadGenerator {
  private templateSvg: string
  private config: SmartRoadConfig
  
  // Module
  private dimensionModule: DimensionModule
  private laneModule: LaneModule
  private markingModule: MarkingModule
  private roadsideModule: RoadsideModule
  private surfaceModule: SurfaceModule
  private tramModule: TramModule
  
  constructor(templateSvg: string, config: SmartRoadConfig) {
    this.templateSvg = templateSvg
    this.config = config
    
    // Module initialisieren
    this.dimensionModule = new DimensionModule(config)
    this.laneModule = new LaneModule(config)
    this.markingModule = new MarkingModule(config)
    this.roadsideModule = new RoadsideModule(config)
    this.surfaceModule = new SurfaceModule(config)
    this.tramModule = new TramModule(config)
  }
  
  /**
   * Generiert das angepasste SVG
   * @returns SVG als String
   */
  async generate(): Promise<string> {
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(this.templateSvg, 'image/svg+xml')
    const svgRoot = svgDoc.documentElement
    
    // Template-Dimensionen (Standard: 80×200)
    const templateWidth = 80
    const templateLength = 200
    
    // 0. Patterns früh erstellen (damit sie verfügbar sind)
    this.roadsideModule.ensurePatterns(svgDoc)
    
    // Randausstattung-Breiten berechnen
    const leftSideWidth = this.roadsideModule.getLeftSideWidth()
    const rightSideWidth = this.roadsideModule.getRightSideWidth()
    
    // 1. Länge anpassen (vertikal)
    this.dimensionModule.adjustLength(svgDoc, templateLength)
    
    // 2. Breite anpassen (horizontal) + Edges positionieren
    // leftOffset = linke Randausstattung
    this.dimensionModule.adjustWidth(svgDoc, templateWidth, leftSideWidth)
    
    // 3. Offsets berechnen (für Spuren & Randausstattung)
    // 🔥 ACHTUNG: leftOffset IST BEREITS leftSideWidth! Nicht doppelt addieren!
    const leftOffset = 0  // Median-Offset (aktuell nicht verwendet)
    
    // 4. Oberfläche anpassen (Texturen)
    this.surfaceModule.applySurface(svgDoc)
    
    // 5. Straßenbahn-Gleise (vor Spurlinien, damit Median darüber liegt)
    this.tramModule.addTramTracks(svgDoc, leftSideWidth)
    
    // 6. Spuren & Markierungen anpassen (Median + Spurlinien über Gleisen)
    this.laneModule.adjustLanes(svgDoc, leftOffset, leftSideWidth)
    
    // 7. Randausstattung (Gehwege, Radwege, Bordsteine)
    this.roadsideModule.addRoadsides(svgDoc, leftSideWidth)
    
    // 8. Fahrbahnmarkierungen (Pfeile, Symbole)
    this.markingModule.addMarkings(svgDoc, leftSideWidth)
    
    // 9. ViewBox & Dimensionen updaten
    const totalWidth = leftSideWidth + this.config.width + rightSideWidth
    svgRoot.setAttribute('viewBox', `0 0 ${totalWidth} ${this.config.length}`)
    svgRoot.setAttribute('width', String(totalWidth))
    svgRoot.setAttribute('height', String(this.config.length))
    
    // 9. IDs uniquifizieren
    const uniqueId = `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.makeIdsUnique(svgDoc, uniqueId)
    
    // 10. Zurück als String
    const serializer = new XMLSerializer()
    return serializer.serializeToString(svgRoot)
  }
  
  /**
   * IDs uniquifizieren (verhindert Konflikte bei mehreren Straßen)
   */
  private makeIdsUnique(svgDoc: Document, suffix: string): void {
    const idMap = new Map<string, string>()
    
    // Alle Elemente mit IDs finden und umbenennen
    const elementsWithIds = svgDoc.querySelectorAll('[id]')
    elementsWithIds.forEach(el => {
      const oldId = el.getAttribute('id')
      if (!oldId) return
      
      // Pattern-IDs NICHT uniquifizieren - global wiederverwendbar
      if (oldId.startsWith('pattern-')) return
      
      const newId = oldId + suffix
      idMap.set(oldId, newId)
      el.setAttribute('id', newId)
    })
    
    // Referenzen aktualisieren: url(#...)
    const styleAttrs = ['fill', 'stroke', 'filter', 'mask', 'clip-path']
    svgDoc.querySelectorAll('*').forEach(el => {
      styleAttrs.forEach(attr => {
        const value = el.getAttribute(attr)
        if (!value) return
        
        const urlMatch = value.match(/url\(#([^)]+)\)/)
        if (urlMatch) {
          const oldId = urlMatch[1]
          
          // Pattern-IDs nicht updaten
          if (oldId.startsWith('pattern-')) return
          
          const newId = idMap.get(oldId)
          if (newId) {
            el.setAttribute(attr, `url(#${newId})`)
          }
        }
      })
    })
  }
}