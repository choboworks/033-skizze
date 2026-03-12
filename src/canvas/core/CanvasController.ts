//src/canvas/core/CanvasController.ts

import { Canvas, Point } from 'fabric'

class CanvasController {
  private _canvas: Canvas | null = null
  private minZoom = 0.25
  private maxZoom = 4

  setCanvas(c: Canvas) { this._canvas = c }
  get canvas(): Canvas { if (!this._canvas) throw new Error('Canvas not ready yet'); return this._canvas }

  zoomBy(delta: number, center?: { x: number; y: number }) {
    const c = this.canvas
    const current = c.getZoom()
    const next = this.clamp(current * (1 + delta), this.minZoom, this.maxZoom)
    this.setZoom(next, center)
  }

  setZoom(z: number, center?: { x: number; y: number }) {
    const c = this.canvas
    const clamped = this.clamp(z, this.minZoom, this.maxZoom)
    const pt = center ? new Point(center.x, center.y) : new Point(c.getWidth() / 2, c.getHeight() / 2)
    c.zoomToPoint(pt, clamped)
    c.requestRenderAll()
  }

  resetZoom() { this.setZoom(1) }

  /** Skaliert Artboard in einen Viewport; Zentrierung erledigt das Flex-Layout des Wrappers */
  fitArtboardToViewport(viewW: number, viewH: number, artW: number, artH: number, padding = 40) {
    const c = this.canvas
    const availW = Math.max(1, viewW - padding * 2)
    const availH = Math.max(1, viewH - padding * 2)
    const z = this.clamp(Math.min(availW / artW, availH / artH), this.minZoom, this.maxZoom)

    // Um Blattmitte zoomen (keine Pan-Tricks mehr)
    const contentCenter = new Point(artW / 2, artH / 2)
    this.setZoom(z, { x: contentCenter.x, y: contentCenter.y })

    // Ursprung auf (0,0) halten; die visuelle Zentrierung macht der Wrapper (flex center).
    c.absolutePan(new Point(0, 0))
    c.requestRenderAll()
  }

  fitToContent(padding = 40) {
    const c = this.canvas
    const objs = c.getObjects().filter(o => o.visible)
    if (!objs.length) { this.resetZoom(); c.absolutePan(new Point(0, 0)); c.requestRenderAll(); return }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const o of objs) {
      const r = o.getBoundingRect()
      minX = Math.min(minX, r.left); minY = Math.min(minY, r.top)
      maxX = Math.max(maxX, r.left + r.width); maxY = Math.max(maxY, r.top + r.height)
    }

    const boundsW = Math.max(1, maxX - minX)
    const boundsH = Math.max(1, maxY - minY)
    const viewW = Math.max(1, c.getWidth() - padding * 2)
    const viewH = Math.max(1, c.getHeight() - padding * 2)
    const targetZoom = this.clamp(Math.min(viewW / boundsW, viewH / boundsH), this.minZoom, this.maxZoom)

    const contentCenter = new Point(minX + boundsW / 2, minY + boundsH / 2)
    this.setZoom(targetZoom, { x: contentCenter.x, y: contentCenter.y })
    c.absolutePan(new Point(0, 0))
    c.requestRenderAll()
  }

  private clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)) }
}

export const CanvasCtrl = new CanvasController()
