//src/canvas/core/svgBodyFill.ts
import { Group, type FabricObject } from 'fabric'

/** Metadaten für generische SVG-Body-Füllung (im .data der Gruppe gespeichert). */
type SvgBodyMeta = {
  indices: number[]                   // Indizes der Body-Kinder in der Gruppe
  originalFills: (string | undefined)[] // Originale Füllfarben parallel zu indices
}

type ObjWithData = FabricObject & { data?: Record<string, unknown> }
const DATA_KEY = '__svgBodyMeta'
const WHITE = '#ffffff'

function ensureData(o: FabricObject): Record<string, unknown> {
  const host = o as ObjWithData
  if (!host.data) host.data = {}
  return host.data
}

function getNameLower(o: FabricObject): string {
  const any = o as unknown as { name?: unknown; id?: unknown }
  const raw = (typeof any?.name === 'string' ? any.name : typeof any?.id === 'string' ? any.id : '') || ''
  return String(raw).toLowerCase()
}

function isBodyTag(tag: string): boolean {
  return tag.startsWith('body') // "body", "body-2", "body_main", …
}

function resolveGroup(target: FabricObject): Group | null {
  if (target instanceof Group) return target
  const g = (target as FabricObject & { group?: Group | null }).group
  return g instanceof Group ? g : null
}

function findBodyChildren(g: Group): Array<{ index: number; child: FabricObject }> {
  const kids = g.getObjects()
  const out: Array<{ index: number; child: FabricObject }> = []
  for (let i = 0; i < kids.length; i += 1) {
    if (isBodyTag(getNameLower(kids[i]))) out.push({ index: i, child: kids[i] })
  }
  return out
}

function getCurrentFill(o: FabricObject): string | undefined {
  const any = o as unknown as { fill?: unknown }
  return typeof any.fill === 'string' ? any.fill : undefined
}

function setFillKV(o: FabricObject, value: string): void {
  const setter = (o as unknown as { set?: (key: string, value: unknown) => FabricObject }).set
  if (typeof setter === 'function') setter.call(o, 'fill', value)
  else (o as unknown as { fill?: string }).fill = value
  ;(o as unknown as { dirty?: boolean }).dirty = true
}

/**
 * Versucht, in einer SVG-Gruppe alle Parts mit name/id === "body*" zu färben.
 * - color = string   → Body-Teile auf diese Farbe setzen (Originale beim ersten Mal sichern)
 * - color = undefined → Originalfarben wiederherstellen
 *
 * @returns true, wenn bearbeitet; sonst false (kein Body o. kein Group).
 */
export function tryApplyGenericSvgBodyFill(target: FabricObject, color?: string): boolean {
  const host = resolveGroup(target)
  if (!host) return false

  const data = ensureData(host)
  const kids = host.getObjects()

  // Meta laden/initialisieren
  let meta = data[DATA_KEY] as SvgBodyMeta | undefined
  if (!meta || !Array.isArray(meta.indices) || meta.indices.length === 0) {
    const found = findBodyChildren(host)
    if (found.length === 0) return false
    meta = {
      indices: found.map(f => f.index),
      // Wichtig: Originale *normalisieren* – undefined → weiß, um "Schwarz-Default" zu vermeiden
      originalFills: found.map(f => getCurrentFill(f.child) ?? WHITE),
    }
    data[DATA_KEY] = meta
  }

  // Anwenden
  if (typeof color === 'string') {
    // Setzen auf gewünschte Farbe
    for (const idx of meta.indices) {
      const child = kids[idx]
      if (child) setFillKV(child, color)
    }
  } else {
    // Restaurieren
    for (let i = 0; i < meta.indices.length; i += 1) {
      const child = kids[meta.indices[i]]
      const orig = meta.originalFills[i] ?? WHITE
      if (child) setFillKV(child, orig)
    }
  }

  host.dirty = true
  host.setCoords()
  host.canvas?.requestRenderAll()
  return true
}
