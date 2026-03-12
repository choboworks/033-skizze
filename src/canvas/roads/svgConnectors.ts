// src/canvas/roads/svgConnectors.ts

export type SvgConnector = {
  id: string
  /** lokale Koordinate relativ zur SVG-Mitte (origin = center) */
  xLocal: number
  yLocal: number
}

function toNumOrNull(v: string | null): number | null {
  if (v == null) return null
  const n = Number(String(v).trim())
  return Number.isFinite(n) ? n : null
}

function readViewBox(el: SVGSVGElement): [number, number, number, number] | null {
  const vb = el.getAttribute('viewBox')
  if (vb) {
    const p = vb.trim().split(/\s+|,/).map((s) => Number(s))
    if (p.length === 4 && p.every((n) => Number.isFinite(n))) {
      return [p[0], p[1], p[2], p[3]]
    }
  }
  const w = toNumOrNull(el.getAttribute('width'))
  const h = toNumOrNull(el.getAttribute('height'))
  if (w != null && h != null) return [0, 0, w, h]
  return null
}

/**
 * Extrahiert id^="conn" Marker:
 *  - <circle>: cx/cy (fehlend → 0)
 *  - <rect>: Mittelpunkt (x + w/2, y + h/2), **fehlendes x/y → 0** (SVG-Default!)
 * Ergebnis: center-origin (xLocal/yLocal).
 */
export function parseRoadConnectorsFromSvg(svgSource: string): SvgConnector[] {
  const dom = new DOMParser().parseFromString(svgSource, 'image/svg+xml')
  const svgEl = dom.querySelector('svg')
  if (!svgEl) return []

  const vb = readViewBox(svgEl)
  if (!vb) return []
  const [vbX, vbY, vbW, vbH] = vb
  const cx0 = vbX + vbW / 2
  const cy0 = vbY + vbH / 2

  const out: SvgConnector[] = []

  // Kreise
  dom.querySelectorAll<SVGCircleElement>('circle[id^="conn"]').forEach((el) => {
    const id = el.getAttribute('id') ?? ''
    const cx = toNumOrNull(el.getAttribute('cx')) ?? 0
    const cy = toNumOrNull(el.getAttribute('cy')) ?? 0
    out.push({ id, xLocal: cx - cx0, yLocal: cy - cy0 })
  })

  // Rechtecke → Mittelpunkt
  dom.querySelectorAll<SVGRectElement>('rect[id^="conn"]').forEach((el) => {
    const id = el.getAttribute('id') ?? ''
    const w = toNumOrNull(el.getAttribute('width')) ?? 0
    const h = toNumOrNull(el.getAttribute('height')) ?? 0
    const x = toNumOrNull(el.getAttribute('x')) ?? 0   // WICHTIG: fehlend → 0
    const y = toNumOrNull(el.getAttribute('y')) ?? 0   // WICHTIG: fehlend → 0
    const cx = x + w / 2
    const cy = y + h / 2
    out.push({ id, xLocal: cx - cx0, yLocal: cy - cy0 })
  })

  return out
}
