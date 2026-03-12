// src/canvas/cars/useCarFeatures.ts
import { Group, type FabricObject } from 'fabric'

export type VehicleMeta = {
  bodyChildIndices?: number[]
  bodyBaseFills?: Record<number, string>
  bodyChildIndex?: number // legacy
}
export type VehicleData = { category?: string; vehicle?: VehicleMeta }
type ObjWithVehicleData = FabricObject & { data?: VehicleData }

const WHITE = '#ffffff'

/* ---------- helpers ---------- */
function isGroup(o: unknown): o is Group {
  return !!o && (o as Group).type === 'group' && typeof (o as Group).getObjects === 'function'
}
function nameLower(o: FabricObject): string {
  const any = o as unknown as { name?: unknown; id?: unknown }
  const raw =
    (typeof any.name === 'string' ? any.name :
     typeof any.id   === 'string' ? any.id   : '') || ''
  return String(raw).toLowerCase()
}
function isBodyTag(tag: string): boolean { return tag.startsWith('body') }
function findBodyChildren(g: Group): Array<{ index: number; child: FabricObject }> {
  const kids = g.getObjects()
  const out: Array<{ index: number; child: FabricObject }> = []
  for (let i = 0; i < kids.length; i += 1) {
    if (isBodyTag(nameLower(kids[i]))) out.push({ index: i, child: kids[i] })
  }
  return out
}
function setFill(o: FabricObject, val: string): void {
  const setter = (o as unknown as { set?: (k: string, v: unknown) => FabricObject }).set
  if (typeof setter === 'function') setter.call(o, 'fill', val)
  else (o as unknown as { fill?: unknown }).fill = val
  ;(o as unknown as { dirty?: boolean }).dirty = true
}
function ensureVehicleMetaOn(host: Group): { indices: number[]; meta: VehicleMeta } {
  const holder = host as ObjWithVehicleData
  holder.data ??= {}
  holder.data.vehicle ??= {}
  const meta = holder.data.vehicle
  if (!Array.isArray(meta.bodyChildIndices) || meta.bodyChildIndices.length === 0) {
    const found = findBodyChildren(host)
    meta.bodyChildIndices = found.map(f => f.index)
    if (meta.bodyChildIndices.length > 0) meta.bodyChildIndex = meta.bodyChildIndices[0]
  }
  meta.bodyBaseFills ??= {}
  return { indices: meta.bodyChildIndices ?? [], meta }
}
function resolveVehicleGroup(target: FabricObject): Group | null {
  if (isGroup(target) && (target as ObjWithVehicleData).data?.category === 'vehicle') return target
  const parent = (target as FabricObject & { group?: Group | null }).group ?? null
  if (isGroup(parent) && (parent as ObjWithVehicleData).data?.category === 'vehicle') return parent
  return null
}

/* ---------- public API ---------- */

/** Beim Drop: Body-Indices erfassen UND **hart Weiß setzen** (+ als Basis speichern). */
export function annotateVehicleOnDrop(node: FabricObject): void {
  const holder = node as ObjWithVehicleData
  if (holder?.data?.category !== 'vehicle') return
  if (!isGroup(node)) return

  const host = node as Group
  const { indices, meta } = ensureVehicleMetaOn(host)
  if (indices.length === 0) return

  const kids = host.getObjects()
  for (const idx of indices) {
    const child = kids[idx]
    if (!child) continue
    setFill(child, WHITE)               // -> optische Basisfarbe
    meta.bodyBaseFills![idx] = WHITE    // -> Undo-Basis eindeutig weiß
  }

  ;(host as unknown as { dirty?: boolean }).dirty = true
  host.setCoords()
}

/**
 * Body-Fill anwenden:
 *  - color = string   → Body auf diese Farbe
 *  - color = undefined → auf die gespeicherten Basisfarben (bei uns: weiß) zurück
 */
export function tryApplyVehicleFill(target: FabricObject, color?: string): boolean {
  const host = resolveVehicleGroup(target)
  if (!host) return false

  const kids = host.getObjects()
  const { indices, meta } = ensureVehicleMetaOn(host)
  if (indices.length === 0) return false

  if (typeof color === 'string') {
    for (const idx of indices) { const c = kids[idx]; if (c) setFill(c, color) }
  } else {
    for (const idx of indices) {
      const c = kids[idx]
      if (c) setFill(c, meta.bodyBaseFills?.[idx] ?? WHITE)
    }
  }

  ;(host as unknown as { dirty?: boolean }).dirty = true
  host.setCoords()
  host.canvas?.requestRenderAll()
  return true
}
