//src/canvas/core/canvasCore.ts
import { Canvas, type Object as FabricObject } from 'fabric'
import type { ElementModel } from '../canvasTypes'
import { uid } from '../canvasUtils'

// —— Fabric-Typ-Erweiterung: Canvas hat eine getRetinaScaling()-API
declare module 'fabric' {
  interface Canvas {
    getRetinaScaling(): number
  }
}

/* =============================================================================
   Gemeinsame Typen
   ========================================================================== */

export type ObjData = {
  id?: string
  name?: string
  category?: string
  kind?: string
  source?: string
  assetId?: string
  svgRootId?: string
  svgConnectors?: unknown
  chainId?: string // an Parts (Fabric-Objekt-Seite)
} & Record<string, unknown>

export type ChainPayload = { id: string; parts: string[]; joints: unknown[]; name?: string }
export type GroupData = { kind?: string; chain?: ChainPayload }

export type ObjWithData = FabricObject & { data?: ObjData }

export type ObjWithStyle = FabricObject & {
  fill?: unknown
  stroke?: unknown
  strokeWidth?: number
}

export type InteractiveObj = FabricObject & {
  selectable: boolean
  evented: boolean
  hasControls?: boolean
  hoverCursor?: string
  editable?: boolean
}

export type FabricPointerEvt = MouseEvent | TouchEvent | PointerEvent

export type CanvasMaybeDisposed = Canvas & { disposed?: boolean }


/* =============================================================================
   Retina-fähiger Canvas (CrispCanvas)
   ========================================================================== */

export class CrispCanvas extends Canvas {
  private _retinaZoomFactor = 1

  /** Begrenze aus Performance-Gründen auf max. 3× */
  public setRetinaZoomFactor(f: number): void {
    this._retinaZoomFactor = Math.max(1, Math.min(3, f))
  }

  /** Effektiver Retina-Scale = (Fabric-Basis) × (_retinaZoomFactor) */
  public override getRetinaScaling(): number {
    const base = typeof super.getRetinaScaling === 'function'
      ? super.getRetinaScaling()
      : (this.enableRetinaScaling ? window.devicePixelRatio : 1)

    return base * this._retinaZoomFactor
  }
}


/* =============================================================================
   Kleine Utils (ID, Name, Geom)
   ========================================================================== */

export const getId = (o: FabricObject): string | undefined =>
  (o as ObjWithData).data?.id as string | undefined

/**
 * Stellt sicher dass ein Objekt eine ID hat
 * 
 * @param o - FabricObject
 * @returns Die bestehende oder neu generierte ID
 */
export const ensureId = (o: FabricObject): string => {
  const od = o as ObjWithData
  od.data ??= {}
  
  if (typeof od.data.id !== 'string' || !od.data.id) {
    od.data.id = uid('obj')
  }
  
  return od.data.id
}

export const setName = (o: FabricObject, name: string): void => {
  const od = o as ObjWithData
  od.data ??= {}
  od.data.name = name
}

export const extractGeom = (o: FabricObject): ElementModel['geom'] => ({
  x: o.left ?? 0,
  y: o.top ?? 0,
  angle: o.angle ?? 0,
  scaleX: o.scaleX ?? 1,
  scaleY: o.scaleY ?? 1,
})

export const getStr = (v: unknown): string | undefined =>
  (typeof v === 'string' ? v : undefined)


/* =============================================================================
   Daten-Access-Helfer
   ========================================================================== */

export const getData = (o: unknown): Record<string, unknown> | undefined => {
  // Safety: Nur für echte Objekte
  if (o === null || typeof o !== 'object') return undefined
  
  const holder = o as { data?: Record<string, unknown> }
  return holder.data
}

export const setData = (o: unknown, patch: Record<string, unknown>): void => {
  // Safety: Nur für echte Objekte
  if (o === null || typeof o !== 'object') {
    console.warn('[canvasCore] setData called on non-object:', o)
    return
  }
  
  const holder = o as { data?: Record<string, unknown> }
  holder.data = { ...(holder.data ?? {}), ...patch }
}

/**
 * Chain-Objekte (Gruppen) erkennen
 * 
 * @param o - Beliebiges Objekt
 * @returns true wenn es ein Chain-Objekt ist (mit Type Guard)
 */
export const isChainObject = (o: unknown): o is ObjWithData & { data: { kind: 'chain'; chain: ChainPayload } } => {
  const d = getData(o)
  if (!d) return false
  
  return d.kind === 'chain' && typeof d.chain === 'object' && d.chain !== null
}

/**
 * Prüft ob Objekt ein FabricObject mit data ist
 * 
 * @param o - Beliebiges Objekt
 * @returns true mit Type Guard für ObjWithData
 */
export const isObjWithData = (o: unknown): o is ObjWithData => {
  if (o === null || typeof o !== 'object') return false
  return 'data' in o
}

/**
 * Prüft ob Objekt eine ID hat
 * 
 * @param o - FabricObject
 * @returns true mit Type Guard für Objekte mit ID
 */
export const hasId = (o: FabricObject): o is ObjWithData & { data: { id: string } } => {
  const data = getData(o)
  return !!data && typeof data.id === 'string'
}

/* =============================================================================
   Modifier-Helper (ohne KeyboardEvent-Cast)
   ========================================================================== */

/**
 * Prüft ob Shift-Taste gedrückt ist.
 * 
 * @param ev - Mouse, Pointer oder Touch Event
 * @returns true wenn Shift gedrückt, false bei TouchEvent (hat keine Modifier-Keys)
 * 
 * @example
 * canvas.on('object:moving', (e) => {
 *   if (hasShift(e.e)) {
 *     // Shift ist gedrückt (nur Mouse/Pointer)
 *   }
 * })
 */
export const hasShift = (ev: Event): boolean => {
  const e = ev as unknown as MouseEvent | PointerEvent | TouchEvent
  return 'shiftKey' in e ? Boolean((e as MouseEvent | PointerEvent).shiftKey) : false
}

/**
 * Prüft ob Alt-Taste gedrückt ist.
 * 
 * @param ev - Mouse, Pointer oder Touch Event
 * @returns true wenn Alt gedrückt, false bei TouchEvent (hat keine Modifier-Keys)
 * 
 * @example
 * canvas.on('object:scaling', (e) => {
 *   if (hasAlt(e.e)) {
 *     // Alt ist gedrückt (nur Mouse/Pointer)
 *   }
 * })
 */
export const hasAlt = (ev: Event): boolean => {
  const e = ev as unknown as MouseEvent | PointerEvent | TouchEvent
  return 'altKey' in e ? Boolean((e as MouseEvent | PointerEvent).altKey) : false
}


/* =============================================================================
   Winkel-/Geometrie-Helper
   ========================================================================== */

/** Winkel auf ein Schrittmaß (default 90°) runden */
export const snapAngleTo = (angleDeg: number, step = 90): number => {
  const n = ((angleDeg % 360) + 360) % 360 // normalisieren in [0,360)
  return Math.round(n / step) * step
}

export const deg = (radVal: number): number => (radVal * 180) / Math.PI
export const rad = (degVal: number): number => (degVal * Math.PI) / 180
export const snap15 = (angleDeg: number): number => Math.round(angleDeg / 15) * 15


/* =============================================================================
   Text-Layer-Namen
   ========================================================================== */

export const computeTextLayerName = (t: string): string => {
  const s = (t || '').replace(/\s+/g, ' ').trim()
  if (!s) return 'Text'
  
  // Unicode-safe Truncate (Emojis, Surrogate Pairs)
  const chars = Array.from(s)
  const head = chars.slice(0, 20).join('')
  
  return chars.length > 20 ? `Text: ${head}…` : `Text: ${head}`
}
