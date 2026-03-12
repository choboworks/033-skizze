// generator/modules/MarkingModule.ts
// Modul für Fahrbahnmarkierungen (Pfeile, Symbole)

import type { SmartRoadConfig } from '../../types'
import { getMarkingX } from '../../types'
import { ARROW_DEFS } from '../../markings/arrowSvgs'
import { BLOCKED_AREA_DEFS } from '../../markings/blockedAreaSvgs'

/**
 * MarkingModule - Fügt Fahrbahnmarkierungen (Pfeile etc.) zum SVG hinzu
 */
export class MarkingModule {
  private config: SmartRoadConfig
  
  constructor(config: SmartRoadConfig) {
    this.config = config
  }
  
  addMarkings(svgDoc: Document, leftSideWidth: number): void {
    const markings = this.config.markings
    if (!markings || markings.length === 0) return
    
    const markingsGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    markingsGroup.setAttribute('id', 'road-markings')
    
    const laneWidth = this.config.width / this.config.lanes
    
    for (const marking of markings) {
      if (marking.type === 'arrow') {
        this.addArrowMarking(svgDoc, markingsGroup, marking, leftSideWidth, laneWidth)
      } else if (marking.type === 'stopLine' || marking.type === 'waitLine') {
        this.addLineMarking(svgDoc, markingsGroup, marking, leftSideWidth)
      } else if (marking.type === 'sharkTeeth') {
        this.addSharkTeethMarking(svgDoc, markingsGroup, marking, leftSideWidth)
      } else if (marking.type === 'laneLine') {
        this.addLaneLineMarking(svgDoc, markingsGroup, marking, leftSideWidth)
      } else if (marking.type === 'blockedArea') {
        this.addBlockedAreaMarking(svgDoc, markingsGroup, marking, leftSideWidth)
      }
    }
    
    svgDoc.documentElement.appendChild(markingsGroup)
  }
  
  private addArrowMarking(
    svgDoc: Document,
    parent: Element,
    marking: { id: string; arrowType: string; laneIndex: number; xPercent?: number; positionPercent: number; rotation?: number; scale?: number; scaleX?: number; scaleY?: number },
    leftSideWidth: number,
    laneWidth: number
  ): void {
    const def = ARROW_DEFS[marking.arrowType]
    if (!def) {
      console.warn(`[MarkingModule] Unknown arrow type: ${marking.arrowType}`)
      return
    }
    
    const xPos = getMarkingX(marking, this.config.width, this.config.lanes, leftSideWidth)
    const yPosition = (marking.positionPercent / 100) * this.config.length
    
    // Skalierung: Breite = 60% der Spur, aber Höhe max 15% der Straßenlänge
    const scaleByWidth = (laneWidth * 0.6) / def.width
    const scaleByHeight = (this.config.length * 0.15) / def.height
    const baseScale = Math.min(scaleByWidth, scaleByHeight)
    const sx = marking.scaleX ?? marking.scale ?? 1
    const sy = marking.scaleY ?? marking.scale ?? 1
    const scaleX = baseScale * sx
    const scaleY = baseScale * sy

    // Mittelpunkt der ViewBox
    const scaledCenterX = (def.width / 2) * scaleX
    const scaledCenterY = (def.height / 2) * scaleY

    const arrowGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    arrowGroup.setAttribute('data-marking-id', marking.id)

    let transform: string
    if (marking.rotation) {
      transform = `translate(${xPos}, ${yPosition}) rotate(${marking.rotation}) translate(${-scaledCenterX}, ${-scaledCenterY}) scale(${scaleX}, ${scaleY})`
    } else {
      const translateX = xPos - scaledCenterX
      const translateY = yPosition - scaledCenterY
      transform = `translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`
    }
    
    arrowGroup.setAttribute('transform', transform)
    
    const innerGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    innerGroup.setAttribute('fill', '#ffffff')
    innerGroup.setAttribute('stroke', 'none')
    
    // SVG-Pfade extrahieren — robuste Regex für verschiedene Attribut-Reihenfolgen
    const pathRegex = /<path[^>]*\bd="([\s\S]*?)"[^>]*\/?>/g
    let match
    while ((match = pathRegex.exec(def.svg)) !== null) {
      const pathD = match[1].replace(/\s+/g, ' ').trim()
      if (pathD) {
        const pathEl = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path')
        pathEl.setAttribute('d', pathD)
        innerGroup.appendChild(pathEl)
      }
    }
    
    arrowGroup.appendChild(innerGroup)
    parent.appendChild(arrowGroup)
  }
  
  getLaneCenter(laneIndex: number, leftSideWidth: number): number {
    const laneWidth = this.config.width / this.config.lanes
    return leftSideWidth + (laneIndex + 0.5) * laneWidth
  }
  
  private addLineMarking(
    svgDoc: Document,
    parent: Element,
    marking: { type: 'stopLine' | 'waitLine'; positionPercent: number; xPercent?: number; widthPercent?: number; rotation?: number },
    leftSideWidth: number
  ): void {
    const yPosition = (marking.positionPercent / 100) * this.config.length
    const centerPct = marking.xPercent ?? 50
    const widthPct = marking.widthPercent ?? 100
    const halfW = widthPct / 2
    
    const x1 = leftSideWidth + (Math.max(0, centerPct - halfW) / 100) * this.config.width
    const x2 = leftSideWidth + (Math.min(100, centerPct + halfW) / 100) * this.config.width
    const lineWidth = x2 - x1
    const thickness = marking.type === 'stopLine' ? 3 : 2
    
    if (marking.type === 'stopLine') {
      // Durchgezogene dicke Linie
      const rect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', String(x1))
      rect.setAttribute('y', String(yPosition - thickness / 2))
      rect.setAttribute('width', String(lineWidth))
      rect.setAttribute('height', String(thickness))
      rect.setAttribute('fill', '#ffffff')
      parent.appendChild(rect)
    } else {
      // Gestrichelte Wartelinie
      const dashLen = 4
      const gapLen = 4
      let cx = x1
      while (cx < x2) {
        const w = Math.min(dashLen, x2 - cx)
        const rect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('x', String(cx))
        rect.setAttribute('y', String(yPosition - thickness / 2))
        rect.setAttribute('width', String(w))
        rect.setAttribute('height', String(thickness))
        rect.setAttribute('fill', '#ffffff')
        parent.appendChild(rect)
        cx += dashLen + gapLen
      }
    }
  }
  
  private addSharkTeethMarking(
    svgDoc: Document,
    parent: Element,
    marking: { positionPercent: number; xPercent?: number; widthPercent?: number; direction: string; rotation?: number; scale?: number; scaleX?: number; scaleY?: number },
    leftSideWidth: number
  ): void {
    const yPosition = (marking.positionPercent / 100) * this.config.length
    const sx = marking.scaleX ?? marking.scale ?? 1
    const sy = marking.scaleY ?? marking.scale ?? 1
    const centerPct = marking.xPercent ?? 50
    const widthPct = marking.widthPercent ?? 100
    const halfW = widthPct / 2

    const x1 = leftSideWidth + (Math.max(0, centerPct - halfW) / 100) * this.config.width
    const x2 = leftSideWidth + (Math.min(100, centerPct + halfW) / 100) * this.config.width

    const toothW = 6 * sx
    const toothH = 8 * sy
    const gap = 2 * sx
    const dir = marking.direction === 'outward' ? -1 : 1
    
    const g = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    if (marking.rotation) {
      const cx = (x1 + x2) / 2
      g.setAttribute('transform', `rotate(${marking.rotation}, ${cx}, ${yPosition})`)
    }
    
    let cx = x1
    while (cx + toothW <= x2 + 0.1) {
      const ty = dir > 0 ? yPosition - toothH / 2 : yPosition + toothH / 2
      const by = dir > 0 ? yPosition + toothH / 2 : yPosition - toothH / 2
      const polygon = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      polygon.setAttribute('points', `${cx},${by} ${cx + toothW / 2},${ty} ${cx + toothW},${by}`)
      polygon.setAttribute('fill', '#ffffff')
      g.appendChild(polygon)
      cx += toothW + gap
    }
    
    parent.appendChild(g)
  }
  
  private addLaneLineMarking(
    svgDoc: Document,
    parent: Element,
    marking: { type: 'laneLine'; lineType: string; laneIndex: number; xPercent?: number; positionPercent: number; rotation?: number; scale?: number; scaleX?: number; scaleY?: number },
    leftSideWidth: number
  ): void {
    const xPos = getMarkingX(marking, this.config.width, this.config.lanes, leftSideWidth)
    const yPosition = (marking.positionPercent / 100) * this.config.length
    const sx = marking.scaleX ?? marking.scale ?? 1
    const sy = marking.scaleY ?? marking.scale ?? 1
    const lineH = this.config.length * 0.12 * sy
    const halfH = lineH / 2
    const gap = 3 * sx
    const lt = marking.lineType
    
    const g = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('transform', `translate(${xPos}, ${yPosition})${marking.rotation ? ` rotate(${marking.rotation})` : ''}`)
    
    const makeLine = (x: number, dashed: boolean): Element => {
      const line = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', String(x))
      line.setAttribute('y1', String(-halfH))
      line.setAttribute('x2', String(x))
      line.setAttribute('y2', String(halfH))
      line.setAttribute('stroke', '#ffffff')
      line.setAttribute('stroke-width', String((lt === 'solid' ? 2 : 1.5) * sx))
      if (dashed) {
        line.setAttribute('stroke-dasharray', `${4 * sy} ${3 * sy}`)
      }
      return line
    }
    
    if (lt === 'solid') {
      g.appendChild(makeLine(0, false))
    } else if (lt === 'double-solid') {
      g.appendChild(makeLine(-gap / 2, false))
      g.appendChild(makeLine(gap / 2, false))
    } else if (lt === 'solid-dashed') {
      g.appendChild(makeLine(-gap / 2, false))
      g.appendChild(makeLine(gap / 2, true))
    } else if (lt === 'dashed-solid') {
      g.appendChild(makeLine(-gap / 2, true))
      g.appendChild(makeLine(gap / 2, false))
    }
    
    parent.appendChild(g)
  }
  
  private addBlockedAreaMarking(
    svgDoc: Document,
    parent: Element,
    marking: { type: 'blockedArea'; areaType: string; positionPercent: number; xPercent?: number; widthPercent?: number; heightPercent?: number; rotation?: number; scale?: number; scaleX?: number; scaleY?: number },
    leftSideWidth: number
  ): void {
    const def = BLOCKED_AREA_DEFS[marking.areaType]
    if (!def || !def.flatPaths || def.flatPaths.length === 0) {
      console.warn(`[MarkingModule] Unknown or empty blockedArea type: ${marking.areaType}`)
      return
    }

    const yPosition = (marking.positionPercent / 100) * this.config.length
    const msx = marking.scaleX ?? marking.scale ?? 1
    const msy = marking.scaleY ?? marking.scale ?? 1
    const centerPct = marking.xPercent ?? 50
    const widthPct = marking.widthPercent ?? 30
    const hPct = marking.heightPercent ?? 15

    // Zielgröße auf der Straße mit unabhängiger Skalierung
    const targetWidth = (widthPct / 100) * this.config.width * msx
    const targetHeight = (hPct / 100) * this.config.length * msy

    // Skalierung basiert auf contentBox (tatsächlicher Inhalt), nicht viewBox
    const cb = def.contentBox
    const scaleX = targetWidth / cb.w
    const scaleY = targetHeight / cb.h
    
    // Position — Content-Zentrum auf (xCenter, yPosition) ausrichten
    const xCenter = leftSideWidth + (centerPct / 100) * this.config.width
    const contentCX = (cb.x + cb.w / 2) * scaleX
    const contentCY = (cb.y + cb.h / 2) * scaleY

    // Gruppe mit Transform für Position + Rotation + Skalierung
    const g = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('data-marking-type', 'blockedArea')

    let transform: string
    if (marking.rotation) {
      transform = `translate(${xCenter}, ${yPosition}) rotate(${marking.rotation}) translate(${-contentCX}, ${-contentCY}) scale(${scaleX}, ${scaleY})`
    } else {
      transform = `translate(${xCenter - contentCX}, ${yPosition - contentCY}) scale(${scaleX}, ${scaleY})`
    }
    g.setAttribute('transform', transform)

    // Flache Pfade rendern — KEIN <pattern>, KEIN <clipPath>, KEIN <style>
    for (const fp of def.flatPaths) {
      const path = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', fp.d)
      path.setAttribute('fill', fp.fill)
      path.setAttribute('stroke', fp.stroke)
      path.setAttribute('stroke-width', String(fp.strokeWidth))
      if (fp.strokeLinecap) path.setAttribute('stroke-linecap', fp.strokeLinecap)
      if (fp.strokeLinejoin) path.setAttribute('stroke-linejoin', fp.strokeLinejoin)
      g.appendChild(path)
    }
    
    parent.appendChild(g)
  }
}