// src/modules/library/roads/SmartRoad.ts

import { Group, util, loadSVGFromString, type FabricObject } from 'fabric'
import * as fabric from 'fabric'
import type { SmartRoadConfig } from './types'
import { SmartRoadGenerator } from './generator/SmartRoadGenerator'
import { CurveRoadGenerator } from './generator/CurveRoadGenerator'
import { getRoadTemplate } from './templates'
import { uid } from '../../../canvas/canvasUtils'

type ObjWithData = FabricObject & { data?: Record<string, unknown> }

/**
 * Smart Road - Parametrische Straße auf Fabric Canvas
 * 
 * Erweitert Fabric Group und kann live neu generiert werden
 * Unterstützt sowohl gerade Straßen als auch Kurven
 */
export class SmartRoad extends Group {
  public roadConfig: SmartRoadConfig
  public initialConfig: SmartRoadConfig  // 🔥 Speichert die ursprüngliche Config
  private templateKey: string
  private isUpdating = false
  private pendingPreserveSize: boolean | null = null
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  
  constructor(templateKey: string, config: SmartRoadConfig, options = {}) {
    super([], options)
    
    this.templateKey = templateKey
    this.roadConfig = config
    this.initialConfig = JSON.parse(JSON.stringify(config))  // 🔥 Deep copy für Reset
    
    // 🔥 Subcategory basierend auf Kategorie (wird später ggf. von außen überschrieben)
    const subcategory = 'gen_strasse'
    
    // Metadaten setzen
    this.set({
      data: {
        id: uid('road'),
        name: this.getDisplayName(),
        subcategory,
        kind: 'smart-road',
        roadConfig: config,
        initialConfig: JSON.parse(JSON.stringify(config)),  // 🔥 Auch in Metadaten
        templateKey: templateKey,
      }
    })
  }
    
  /**
   * Initialisiert die Straße (lädt & generiert SVG)
   * Muss nach Constructor aufgerufen werden!
   */
  async initialize(): Promise<void> {
    // 🔥 Richtigen Generator wählen basierend auf Shape
    const generatedSvg = await this.generateSvg()
    
    // SVG in Fabric laden
    const { objects, options } = await loadSVGFromString(generatedSvg)
    const valid = objects.filter((o): o is FabricObject => o !== null)
    
    if (!valid.length) {
      throw new Error('Kein gültiges SVG generiert')
    }
    
    // 🔥 Patterns manuell anwenden (Fabric.js lädt SVG Patterns nicht!)
    await this.applyFabricPatterns(valid)
    
    // Objekte zur Group hinzufügen
    if (valid.length === 1) {
      this.add(valid[0])
    } else {
      const group = util.groupSVGElements(valid, options ?? {})
      this.add(group)
    }
    
    // Connectors: Mitte der Fahrbahn
    const leftOffset = 0
    
    const connectors = [
      {
        id: 'conn-top',
        xLocal: leftOffset + this.roadConfig.width / 2,  // 🔥 Mit Offset!
        yLocal: 0,
      },
      {
        id: 'conn-bottom',
        xLocal: leftOffset + this.roadConfig.width / 2,  // 🔥 Mit Offset!
        yLocal: this.roadConfig.length,
      },
    ]
    
    // Connectors in Metadaten speichern
    const existingData = (this as ObjWithData).data || {}
    ;(this as ObjWithData).data = {
      ...existingData,
      svgConnectors: connectors,
    }
    
    this.setCoords()
    
    // 🔥 Initiale Skalierung: Mindestgröße 800px (wie dropSizing TARGET_CANVAS_SIZE)
    const bounds = this.getBoundingRect()
    const roadMax = Math.max(bounds.width, bounds.height)
    const MIN_SIZE = 800
    if (roadMax < MIN_SIZE && roadMax > 0) {
      const scaleFactor = MIN_SIZE / roadMax
      this.set({ scaleX: scaleFactor, scaleY: scaleFactor })
      this.setCoords()
    }
  }
  
  /**
   * 🔥 Wählt den richtigen Generator und generiert SVG
   */
  private async generateSvg(): Promise<string> {
    // Kurven-Generator für shape: 'curve'
    if (this.roadConfig.shape === 'curve') {
      const curveGenerator = new CurveRoadGenerator(this.roadConfig)
      return curveGenerator.generate()
    }
    
    // Standard: SmartRoadGenerator für gerade Straßen
    const templateSvg = getRoadTemplate(this.templateKey)
    if (!templateSvg) {
      throw new Error(`Template nicht gefunden: ${this.templateKey}`)
    }
    
    const generator = new SmartRoadGenerator(templateSvg, this.roadConfig)
    return generator.generate()
  }
  
  /**
   * Live-Update: Breite ändern
   */
  async setWidth(width: number): Promise<void> {
    this.roadConfig.width = width
    await this.regenerate(false) // 🔥 Größe NICHT beibehalten - neue Breite soll sichtbar sein!
  }
  
  /**
   * Live-Update: Länge ändern
   */
  async setLength(length: number): Promise<void> {
    this.roadConfig.length = length
    await this.regenerate(false) // 🔥 Größe NICHT beibehalten - neue Länge soll sichtbar sein!
  }
  
  /**
   * Live-Update: Spuren ändern
   */
  async setLanes(lanes: number): Promise<void> {
    this.roadConfig.lanes = lanes
    await this.regenerate(true)
  }
  
  /**
   * 🔥 NEU: Generisches Config-Update
   * Aktualisiert beliebige Config-Properties und regeneriert
   * 
   * @param updates - Partial config mit zu ändernden Properties
   * @param preserveSize - Wenn true, bleibt Canvas-Größe gleich
   */
  async updateConfig(updates: Partial<SmartRoadConfig>, preserveSize: boolean = true): Promise<void> {
    // 🔥 Automatisch preserveSize=false wenn Randausstattung geändert wird
    // (Gehwege, Radwege, etc. ändern die Breite!)
    if (updates.leftSide || updates.rightSide) {
      preserveSize = false
    }
    
    // Config mergen (nicht überschreiben!)
    this.roadConfig = { ...this.roadConfig, ...updates }
    
    // Metadaten auch updaten
    const data = (this as ObjWithData).data
    if (data) {
      data.roadConfig = this.roadConfig
      data.name = this.getDisplayName()
    }
    
    await this.regenerate(preserveSize)
  }
  
  /**
   * Straße komplett neu generieren
   * 🔥 WICHTIG: Hält die Canvas-Pixel-Größe konstant, nicht die Scale!
   * 
   * @param preserveSize - Wenn true, bleibt Canvas-Größe gleich (z.B. bei Spuren-Änderung)
   *                       Wenn false, passt sich Größe an neue Dimensionen an (z.B. bei Breiten-Änderung)
   */
  public async regenerate(preserveSize: boolean = true): Promise<void> {
    // Speichere den gewünschten preserveSize für den nächsten Run
    this.pendingPreserveSize = preserveSize
    
    // Debounce: Vorheriges Pending canceln, neues schedulen
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    // Wenn gerade ein Update läuft, wird es nach Abschluss automatisch nochmal getriggert
    if (this.isUpdating) {
      return
    }
    
    // Kurzer Debounce (16ms ≈ 1 Frame) — coalesced schnelle Klicks
    return new Promise<void>((resolve) => {
      this.debounceTimer = setTimeout(async () => {
        this.debounceTimer = null
        await this._doRegenerate()
        resolve()
      }, 16)
    })
  }
  
  private async _doRegenerate(): Promise<void> {
    if (this.isUpdating) return
    this.isUpdating = true

    const preserveSize = this.pendingPreserveSize ?? true
    this.pendingPreserveSize = null

    try {
      // Position merken
      const { left, top, angle } = this

      // Bei preserveSize: Canvas-Größe VOR Regenerierung merken
      let oldCanvasWidth = 0
      let oldCanvasHeight = 0

      if (preserveSize) {
        const oldBounds = this.getBoundingRect()
        oldCanvasWidth = oldBounds.width
        oldCanvasHeight = oldBounds.height
      }

      // SVG generieren und laden BEVOR alte Objekte entfernt werden
      const generatedSvg = await this.generateSvg()

      // SVG auf Parse-Fehler prüfen
      if (generatedSvg.includes('parsererror')) {
        console.error('[SmartRoad] Generated SVG contains parse errors, skipping regeneration')
        this.canvas?.requestRenderAll()
        return
      }

      let valid: FabricObject[] = []
      let options: Record<string, unknown> | undefined

      // loadSVGFromString kann sporadisch leere Ergebnisse liefern — Retry
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await loadSVGFromString(generatedSvg)
        valid = result.objects.filter((o): o is FabricObject => o !== null)
        options = result.options as Record<string, unknown> | undefined
        if (valid.length > 0) break
        if (attempt === 0) {
          console.warn('[SmartRoad] loadSVGFromString returned empty, retrying...')
          // Kurze Pause vor Retry — DOM-Cleanup abwarten
          await new Promise(r => setTimeout(r, 50))
        }
      }

      if (!valid.length) {
        console.error('[SmartRoad] loadSVGFromString returned no valid objects after retry. SVG length:', generatedSvg.length)
        this.canvas?.requestRenderAll()
        return
      }

      // Patterns manuell anwenden
      await this.applyFabricPatterns(valid)

      // Atomar tauschen: alt raus, neu rein
      this.removeAll()
      const group = valid.length === 1 ? valid[0] : util.groupSVGElements(valid, options ?? {})
      this.add(group)

      let newScaleX: number
      let newScaleY: number

      if (preserveSize && oldCanvasWidth > 0) {
        this.set({ scaleX: 1, scaleY: 1 })
        this.setCoords()

        const newBounds = this.getBoundingRect()
        const oldMax = Math.max(oldCanvasWidth, oldCanvasHeight)
        const newMax = Math.max(newBounds.width, newBounds.height)
        const uniformScale = newMax > 0 ? oldMax / newMax : 1

        newScaleX = uniformScale
        newScaleY = uniformScale
      } else {
        this.set({ scaleX: 1, scaleY: 1 })
        this.setCoords()

        const newBounds = this.getBoundingRect()
        const roadMax = Math.max(newBounds.width, newBounds.height)
        const TARGET_SIZE = 800
        const scaleFactor = roadMax > 0 ? TARGET_SIZE / roadMax : 1

        newScaleX = scaleFactor
        newScaleY = scaleFactor
      }

      // Guard: Scale muss endlich und positiv sein
      if (!isFinite(newScaleX) || !isFinite(newScaleY) || newScaleX <= 0 || newScaleY <= 0) {
        console.error('[SmartRoad] Invalid scale computed:', { newScaleX, newScaleY }, '— falling back to 1')
        newScaleX = 1
        newScaleY = 1
      }

      this.set({ left, top, angle, scaleX: newScaleX, scaleY: newScaleY })
    
      // Connectors
      const leftOffset = 0
      const connectors = [
        { id: 'conn-top', xLocal: leftOffset + this.roadConfig.width / 2, yLocal: 0 },
        { id: 'conn-bottom', xLocal: leftOffset + this.roadConfig.width / 2, yLocal: this.roadConfig.length },
      ]
    
      const data = (this as ObjWithData).data
      if (data) {
        data.roadConfig = this.roadConfig
        data.name = this.getDisplayName()
        data.svgConnectors = connectors
      }
    
      this.setCoords()
      this.dirty = true
      this.getObjects().forEach(obj => {
        obj.dirty = true
        obj.setCoords()
      })
    
      this.canvas?.requestRenderAll()
    } finally {
      this.isUpdating = false
    }
    
    // Wenn während des Updates neue Änderungen reinkamen → nochmal ausführen
    if (this.pendingPreserveSize !== null || this.debounceTimer) {
      // Es gibt noch ein pending Update — der debounce-Timer wird es triggern
      // Falls kein Timer läuft aber pendingPreserveSize gesetzt ist, direkt ausführen
      if (!this.debounceTimer && this.pendingPreserveSize !== null) {
        await this._doRegenerate()
      }
    }
  }
  
  /**
   * Display-Name für Layer-Panel
   */
  private getDisplayName(): string {
    const shapeLabel = {
      straight: 'Gerade',
      curve: 'Kurve',
      junction: 'Kreuzung',
      roundabout: 'Kreisel',
    }[this.roadConfig.shape]
    
    return `${shapeLabel} Straße (${this.roadConfig.lanes} Spuren)`
  }
  
  /**
   * Pattern-Fills manuell als Fabric Patterns anwenden
   * (Fabric.js lädt SVG <pattern> nicht automatisch)
   */
  private async applyFabricPatterns(objects: FabricObject[]): Promise<void> {
    const surfaceType = this.roadConfig.surface?.type || 'asphalt'
    
    // Pattern-Canvas/Image für Road Surface erstellen
    const roadPattern = surfaceType !== 'asphalt' ? this.createPatternCanvas(surfaceType) : null
    
    // Pattern-Canvas für Sidewalk Tiles erstellen
    const sidewalkPattern = this.createSidewalkPatternCanvas()
    
    // 🔥 Wenn roadPattern ein Image ist, auf Load warten
    if (roadPattern instanceof HTMLImageElement) {
      await new Promise<void>((resolve, reject) => {
        roadPattern.onload = () => resolve()
        roadPattern.onerror = () => reject(new Error('Failed to load pattern image'))
        if (roadPattern.complete) resolve()
      })
    }
    
    // Pattern auf alle rect-Objekte anwenden
    objects.forEach(obj => {
      // Rekursiv in Groups suchen
      if (obj.type === 'group' && '_objects' in obj) {
        const group = obj as Group
        if (Array.isArray(group._objects)) {
          group._objects.forEach((child: FabricObject) => {
            if (child.type === 'rect' && child.fill && typeof child.fill === 'string') {
              this.applyPatternToRect(child, roadPattern, sidewalkPattern, surfaceType)
            }
          })
        }
      }
      // Direkte rects
      else if (obj.type === 'rect' && obj.fill && typeof obj.fill === 'string') {
        this.applyPatternToRect(obj, roadPattern, sidewalkPattern, surfaceType)
      }
    })
  }
  
  /**
   * Pattern auf einzelnes Rect anwenden
   */
  private applyPatternToRect(
    rect: FabricObject,
    roadPattern: HTMLCanvasElement | HTMLImageElement | null,
    sidewalkPattern: HTMLCanvasElement | null,
    surfaceType: string
  ): void {
    if (!rect.fill || typeof rect.fill !== 'string') return
    
    // 🔥 Gehweg-Pattern
    if (rect.fill.includes('url(#pattern-sidewalk-tiles)')) {
      if (sidewalkPattern) {
        // Pattern wird natürlich wiederholt (80x80 Canvas)
        const pattern = new fabric.Pattern({
          source: sidewalkPattern,
          repeat: 'repeat',
        })
        rect.set('fill', pattern)
      } else {
        console.warn('⚠️ [Pattern] Gehweg-Pattern Canvas nicht verfügbar!')
      }
    }
    // 🔥 Road Surface Pattern  
    else if (rect.fill.includes('url(#pattern-') && roadPattern) {
      const pattern = new fabric.Pattern({
        source: roadPattern,
        repeat: 'repeat',
        // 🔥 SVG ist 500×500, wir wollen 40×40 → scale 0.08
        patternTransform: surfaceType === 'cobblestone' ? [0.08, 0, 0, 0.08, 0, 0] : undefined
      })
      rect.set('fill', pattern)
    }
  }
  
  /**
   * Canvas-Pattern für Oberflächen-Texturen erstellen
   */
  private createPatternCanvas(surfaceType: string): HTMLCanvasElement | HTMLImageElement | null {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    
    switch (surfaceType) {
      case 'cobblestone': {
        // 🔥 Pflasterstein SVG - neues, realistisches Muster
        const img = new Image()
        // SVG mit hoher Auflösung für scharfe Kanten
        img.src = 'data:image/svg+xml;base64,' + btoa(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 501.5166 501.5146">
<defs>
<style>.b{fill:#593c31;}.c{fill:#ab8b72;}.d{fill:#916956;}.e{fill:#b59a81;}.f{fill:#9c7962;}</style>
</defs>
<rect class="f" x=".0039" y="417.9311" width="83.584" height="83.5835"/>
<rect class="f" x="167.1748" y=".0019" width="83.584" height="83.5869"/>
<rect class="e" x="83.5879" y="417.9311" width="83.5869" height="83.5835"/>
<rect class="f" x="334.3428" y="417.9311" width="83.5869" height="83.5835"/>
<polygon class="d" points="83.5879 334.3437 .0039 334.3437 .0039 417.9311 83.5879 417.9311 167.1748 417.9311 167.1748 334.3437 83.5879 334.3437"/>
<polygon class="f" points="167.1748 417.9311 167.1748 501.5146 250.7588 501.5146 250.7588 417.9311 250.7588 334.3437 167.1748 334.3437 167.1748 417.9311"/>
<polygon class="c" points="417.9297 417.9311 417.9297 501.5146 501.5166 501.5146 501.5166 417.9311 501.5166 334.3437 417.9297 334.3437 417.9297 417.9311"/>
<polygon class="e" points="125.3799 250.7583 .0039 250.7583 .0039 334.3437 125.3799 334.3437 250.7588 334.3437 250.7588 250.7583 125.3799 250.7583"/>
<polygon class="d" points="250.7588 376.1357 250.7588 501.5146 334.3428 501.5146 334.3428 376.1357 334.3428 250.7583 250.7588 250.7583 250.7588 376.1357"/>
<polygon class="f" points="208.9629 167.1748 83.5879 167.1748 83.5879 250.7583 208.9629 250.7583 334.3428 250.7583 334.3428 167.1748 208.9629 167.1748"/>
<polygon class="c" points=".0039 125.3808 .0039 250.7583 83.5879 250.7583 83.5879 125.3808 83.5879 .0034 .0039 .0034 .0039 125.3808"/>
<polygon class="e" points="334.3428 292.5517 334.3428 417.9311 417.9297 417.9311 417.9297 292.5517 417.9297 167.1748 334.3428 167.1748 334.3428 292.5517"/>
<polygon class="d" points="292.5508 83.5888 167.1748 83.5888 167.1748 167.1748 292.5508 167.1748 417.9297 167.1748 417.9297 83.5888 292.5508 83.5888"/>
<polygon class="e" points="83.5879 83.5854 83.5879 167.1728 167.1748 167.1728 167.1748 83.5854 167.1748 0 83.5879 0 83.5879 83.5854"/>
<polygon class="f" points="417.9297 208.9663 417.9297 334.3437 501.5166 334.3437 501.5166 208.9663 501.5166 83.5888 417.9297 83.5888 417.9297 208.9663"/>
<polygon class="e" points="376.1377 .0019 250.7588 .0019 250.7588 83.5888 376.1377 83.5888 501.5166 83.5888 501.5166 .0019 376.1377 .0019"/>
<path class="b" d="M164.6641,164.664h-78.5694V0H0v501.5146h86.0947v-81.0762h78.5733v81.0762h336.8486V0H164.6641v164.664ZM2.5078,2.5107h78.5694l.0039,245.7402H2.5078V2.5107ZM81.0811,499.0078H2.5078v-78.5694h78.5733v78.5694ZM164.668,415.4238H2.5078v-78.5693h162.1602v78.5693ZM248.252,499.0078h-78.5733v-162.1533h78.5733v162.1533ZM248.252,331.8364H2.5078v-78.5728h245.7442v78.5728ZM331.835,499.0078h-78.5694v-245.7442h78.5694v245.7442ZM331.835,248.2509H86.0947v-78.5713h245.7403v78.5713ZM415.419,499.0078h-78.5694v-78.5694h78.5694v78.5694ZM415.419,415.4238h-78.5694v-245.7442h78.5694v245.7442ZM499.0059,499.0078h-78.5694v-162.1533h78.5694v162.1533ZM499.0059,331.833h-78.5694V86.0942h78.5694v245.7388ZM253.2656,2.5107h245.7403v78.5693h-245.7403V2.5107ZM169.6787,2.5107h78.5733v78.5693h-78.5733V2.5107ZM415.419,86.0942v78.5713h-245.7403v-78.5713h245.7403Z"/>
</svg>`)
        return img
      }
      
      case 'pavement': {  // Kopfsteinpflaster - unregelmäßig, rund
        canvas.width = 30
        canvas.height = 30
        
        // Basis-Grau mit leichter Variation
        ctx.fillStyle = '#4a4a4a'
        ctx.fillRect(0, 0, 30, 30)
        
        // Unregelmäßige Steine mit Schattierung
        const stones = [
          { cx: 6, cy: 6, r: 4.5, base: '#5a5a5a' },
          { cx: 20, cy: 5, r: 4, base: '#555555' },
          { cx: 5, cy: 20, r: 4.2, base: '#525252' },
          { cx: 22, cy: 19, r: 4.8, base: '#585858' },
          { cx: 14, cy: 13, r: 3.8, base: '#565656' },
          { cx: 25, cy: 11, r: 3.5, base: '#545454' },
          { cx: 2, cy: 12, r: 3.2, base: '#5c5c5c' },
        ]
        
        stones.forEach(s => {
          // Schatten (dunkler)
          ctx.fillStyle = '#3a3a3a'
          ctx.beginPath()
          ctx.arc(s.cx + 0.5, s.cy + 0.5, s.r, 0, Math.PI * 2)
          ctx.fill()
          
          // Stein (Hauptfarbe)
          ctx.fillStyle = s.base
          ctx.beginPath()
          ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2)
          ctx.fill()
          
          // Highlight (heller)
          ctx.fillStyle = 'rgba(100, 100, 100, 0.3)'
          ctx.beginPath()
          ctx.arc(s.cx - 0.8, s.cy - 0.8, s.r * 0.6, 0, Math.PI * 2)
          ctx.fill()
          
          // Fugen (dunkel)
          ctx.strokeStyle = '#3a3a3a'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2)
          ctx.stroke()
        })
        break
      }
        
      case 'concrete': {  // Beton - hell mit feinen Dehnungsfugen
        canvas.width = 40
        canvas.height = 40
        
        // Beton-Basis (heller als Asphalt)
        ctx.fillStyle = '#9a9a9a'
        ctx.fillRect(0, 0, 40, 40)
        
        // Leichte Textur/Körnung
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * 40
          const y = Math.random() * 40
          const size = Math.random() * 1.5 + 0.5
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(110, 110, 110, 0.3)' : 'rgba(80, 80, 80, 0.2)'
          ctx.fillRect(x, y, size, size)
        }
        
        // Dehnungsfugen (dunkel, dünn)
        ctx.strokeStyle = '#5a5a5a'
        ctx.lineWidth = 1.5
        
        // Horizontale Fuge
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(40, 0)
        ctx.stroke()
        
        // Vertikale Fuge
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 40)
        ctx.stroke()
        
        // Schatten an Fugen
        ctx.strokeStyle = 'rgba(40, 40, 40, 0.3)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(0, 1)
        ctx.lineTo(40, 1)
        ctx.moveTo(1, 0)
        ctx.lineTo(1, 40)
        ctx.stroke()
        break
      }
        
      case 'gravel': {  // Schotter - sehr körnig, viele Steine
        canvas.width = 20
        canvas.height = 20
        
        // Basis-Grau
        ctx.fillStyle = '#6a6a6a'
        ctx.fillRect(0, 0, 20, 20)
        
        // Viele kleine Steine (50+)
        const stoneCount = 60
        for (let i = 0; i < stoneCount; i++) {
          const x = Math.random() * 20
          const y = Math.random() * 20
          const r = Math.random() * 1.2 + 0.4
          
          // Zufällige Grautöne
          const colors = ['#5a5a5a', '#656565', '#707070', '#757575', '#606060']
          const color = colors[Math.floor(Math.random() * colors.length)]
          
          // Stein
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
          
          // Mini-Highlight
          if (Math.random() > 0.7) {
            ctx.fillStyle = 'rgba(100, 100, 100, 0.4)'
            ctx.beginPath()
            ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break
      }
        
      default:
        return null
    }
    
    return canvas
  }
  
  /**
   * Canvas-Pattern für Gehwegplatten erstellen
   * Pattern ist 40x40 - wird von Fabric.js NICHT mit Objekt skaliert!
   * Das Pattern wiederholt sich einfach über die Canvas-Fläche.
   */
  private createSidewalkPatternCanvas(): HTMLCanvasElement {
    const SIZE = 40    // Pattern-Kachel-Größe (wird wiederholt!)
    const TILE = 38    // Platte
    const GROUT = 1    // Fuge
    
    
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')!
    
    // Hintergrund (Fuge) - dunkler
    ctx.fillStyle = '#a8a098'
    ctx.fillRect(0, 0, SIZE, SIZE)
    
    // Platte (38x38, zentriert mit 1px Fuge)
    ctx.fillStyle = '#c8c0b0'
    ctx.fillRect(GROUT, GROUT, TILE, TILE)
    
    // Leichte Textur auf der Platte (subtile Linien)
    ctx.strokeStyle = '#d0c8b8'
    ctx.lineWidth = 0.5
    ctx.globalAlpha = 0.3
    
    // Vertikale Linien
    ctx.beginPath()
    ctx.moveTo(8, GROUT)
    ctx.lineTo(8, SIZE - GROUT)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(20, GROUT)
    ctx.lineTo(20, SIZE - GROUT)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(32, GROUT)
    ctx.lineTo(32, SIZE - GROUT)
    ctx.stroke()
    
    return canvas
  }
}