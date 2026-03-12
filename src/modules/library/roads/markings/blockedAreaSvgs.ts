// src/modules/library/roads/markings/blockedAreaSvgs.ts
// Sperrflächen-Markierungen nach StVO (Zeichen 298)
//
// Zwei Darstellungen pro Typ:
// 1. svgBody: Original-SVG mit <pattern>, <clipPath> etc. — für Browser-Preview (Inspector)
// 2. flatPaths: Array aus reinen <path>/<line> Elementen — für Fabric.js Canvas-Rendering
//    Fabric.js versteht KEIN <pattern>, <clipPath>, <use>, <style>!

export type BlockedAreaDef = {
  /** Kompletter SVG-Body (alles innerhalb von <svg>...</svg>) — nur für Preview */
  svgBody: string
  viewBox: string
  width: number
  height: number
  /**
   * Bounding-Box des tatsächlichen Inhalts innerhalb des viewBox.
   * Wird für Skalierung und Zentrierung verwendet, damit alle Typen
   * trotz unterschiedlicher viewBox-Größen ähnlich groß erscheinen.
   */
  contentBox: { x: number; y: number; w: number; h: number }
  /** Flache Pfad-Elemente für Canvas-Rendering (Fabric.js-kompatibel) */
  flatPaths: FlatPath[]
}

/**
 * Ein einzelnes flaches SVG-Element, das Fabric.js rendern kann.
 * Alles wird als Path-D-String gespeichert (auch Linien/Polygone).
 */
export type FlatPath = {
  /** SVG path d-Attribut */
  d: string
  fill: string
  stroke: string
  strokeWidth: number
  strokeLinecap?: string
  strokeLinejoin?: string
}

// ============================================================================
// Utility: Generiere diagonale Schraffur-Linien in einem Rechteck
// ============================================================================

type Point = { x: number; y: number }

/**
 * Erzeugt diagonale Linien (als Path-D-Strings) innerhalb eines Rechtecks.
 * angleDeg: Winkel der Linien gegen die Horizontale
 * spacing: Abstand der Parallelen senkrecht zur Linienrichtung
 */
function generateRectHatchPaths(
  x1: number, y1: number, x2: number, y2: number,
  angleDeg: number,
  spacing: number,
  strokeWidth: number,
  strokeColor = '#ffffff',
): FlatPath[] {
  const paths: FlatPath[] = []
  const rad = (angleDeg * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  // Normal (senkrecht zur Linienrichtung)
  const nx = -dy
  const ny = dx

  // Projiziere alle 4 Ecken auf die Normale → Bereich bestimmen
  const corners = [
    { x: x1, y: y1 }, { x: x2, y: y1 },
    { x: x1, y: y2 }, { x: x2, y: y2 },
  ]
  const projs = corners.map(c => c.x * nx + c.y * ny)
  const minP = Math.min(...projs)
  const maxP = Math.max(...projs)

  // Diagonale als max. Linienlänge
  const diag = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  for (let p = minP; p <= maxP + spacing; p += spacing) {
    const cx = p * nx
    const cy = p * ny
    const lx1 = cx - dx * diag
    const ly1 = cy - dy * diag
    const lx2 = cx + dx * diag
    const ly2 = cy + dy * diag

    const clipped = clipLineToRect(lx1, ly1, lx2, ly2, x1, y1, x2, y2)
    if (clipped) {
      paths.push({
        d: `M ${clipped.x1.toFixed(1)},${clipped.y1.toFixed(1)} L ${clipped.x2.toFixed(1)},${clipped.y2.toFixed(1)}`,
        fill: 'none',
        stroke: strokeColor,
        strokeWidth,
      })
    }
  }
  return paths
}

/**
 * Clip Liniensegment an Rechteck (Liang-Barsky Algorithmus).
 */
function clipLineToRect(
  x1: number, y1: number, x2: number, y2: number,
  rx1: number, ry1: number, rx2: number, ry2: number,
): { x1: number; y1: number; x2: number; y2: number } | null {
  let t0 = 0, t1 = 1
  const dxLine = x2 - x1
  const dyLine = y2 - y1

  const edges = [
    { p: -dxLine, q: x1 - rx1 },
    { p: dxLine, q: rx2 - x1 },
    { p: -dyLine, q: y1 - ry1 },
    { p: dyLine, q: ry2 - y1 },
  ]

  for (const { p, q } of edges) {
    if (Math.abs(p) < 1e-10) {
      if (q < 0) return null
    } else {
      const r = q / p
      if (p < 0) { if (r > t1) return null; if (r > t0) t0 = r }
      else { if (r < t0) return null; if (r < t1) t1 = r }
    }
  }

  return {
    x1: x1 + t0 * dxLine, y1: y1 + t0 * dyLine,
    x2: x1 + t1 * dxLine, y2: y1 + t1 * dyLine,
  }
}

// ============================================================================
// Utility: Polygon-Clipping
// ============================================================================

/**
 * Schnitt zweier Liniensegmente.
 */
function segmentIntersection(
  a1: Point, a2: Point, b1: Point, b2: Point,
): Point | null {
  const dax = a2.x - a1.x
  const day = a2.y - a1.y
  const dbx = b2.x - b1.x
  const dby = b2.y - b1.y
  const denom = dax * dby - day * dbx
  if (Math.abs(denom) < 1e-10) return null

  const t = ((b1.x - a1.x) * dby - (b1.y - a1.y) * dbx) / denom
  const u = ((b1.x - a1.x) * day - (b1.y - a1.y) * dax) / denom

  if (t >= -0.001 && t <= 1.001 && u >= -0.001 && u <= 1.001) {
    return { x: a1.x + t * dax, y: a1.y + t * day }
  }
  return null
}

/**
 * Punkt-in-Polygon-Test (Winding / Kreuzprodukt für konvexe Polygone).
 */
function pointInPolygon(p: Point, poly: Point[]): boolean {
  const n = poly.length
  let positive = 0, negative = 0
  for (let i = 0; i < n; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % n]
    const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)
    if (cross > 0) positive++
    else if (cross < 0) negative++
    if (positive > 0 && negative > 0) return false
  }
  return true
}

/**
 * Clip Liniensegment an ein konvexes Polygon.
 */
function clipLineToPolygon(
  p1: Point, p2: Point, poly: Point[],
): { x1: number; y1: number; x2: number; y2: number } | null {
  const pts: { point: Point; t: number }[] = []
  const pdx = p2.x - p1.x
  const pdy = p2.y - p1.y

  if (pointInPolygon(p1, poly)) pts.push({ point: p1, t: 0 })
  if (pointInPolygon(p2, poly)) pts.push({ point: p2, t: 1 })

  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    const inter = segmentIntersection(p1, p2, a, b)
    if (inter) {
      const t = Math.abs(pdx) > Math.abs(pdy)
        ? (inter.x - p1.x) / pdx
        : (inter.y - p1.y) / pdy
      pts.push({ point: inter, t: Math.max(0, Math.min(1, t)) })
    }
  }

  if (pts.length < 2) return null
  pts.sort((a, b) => a.t - b.t)
  const first = pts[0]
  const last = pts[pts.length - 1]
  if (Math.abs(first.t - last.t) < 1e-6) return null

  return {
    x1: first.point.x, y1: first.point.y,
    x2: last.point.x, y2: last.point.y,
  }
}

/**
 * Generiere Schraffur-Linien geclippt an ein (konvexes) Polygon.
 */
function generatePolygonHatchPaths(
  poly: Point[],
  angleDeg: number,
  spacing: number,
  strokeWidth: number,
  strokeColor = '#ffffff',
): FlatPath[] {
  const paths: FlatPath[] = []
  const rad = (angleDeg * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  const nx = -dy
  const ny = dx

  const xs = poly.map(p => p.x)
  const ys = poly.map(p => p.y)
  const diag = Math.sqrt(
    (Math.max(...xs) - Math.min(...xs)) ** 2 +
    (Math.max(...ys) - Math.min(...ys)) ** 2,
  )

  const projs = poly.map(p => p.x * nx + p.y * ny)
  const minP = Math.min(...projs)
  const maxP = Math.max(...projs)

  for (let p = minP + spacing / 2; p <= maxP; p += spacing) {
    const cx = p * nx
    const cy = p * ny
    const lp1: Point = { x: cx - dx * diag, y: cy - dy * diag }
    const lp2: Point = { x: cx + dx * diag, y: cy + dy * diag }

    const clipped = clipLineToPolygon(lp1, lp2, poly)
    if (clipped) {
      paths.push({
        d: `M ${clipped.x1.toFixed(1)},${clipped.y1.toFixed(1)} L ${clipped.x2.toFixed(1)},${clipped.y2.toFixed(1)}`,
        fill: 'none',
        stroke: strokeColor,
        strokeWidth,
      })
    }
  }
  return paths
}

/**
 * Approximiere einen geschlossenen SVG-Pfad mit Cubic-Beziers als Polygon.
 */
function approximateClosedPathAsPolygon(d: string, samplesPerCurve = 8): Point[] {
  const points: Point[] = []
  const cmdRegex = /([MCZ])\s*([-\d.,\s]*)/gi
  let currentX = 0, currentY = 0
  let match: RegExpExecArray | null

  while ((match = cmdRegex.exec(d)) !== null) {
    const cmd = match[1].toUpperCase()
    const coords = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number)

    if (cmd === 'M') {
      currentX = coords[0]; currentY = coords[1]
      points.push({ x: currentX, y: currentY })
    } else if (cmd === 'C') {
      for (let i = 0; i < coords.length; i += 6) {
        const x0 = currentX, y0 = currentY
        const x1 = coords[i], y1 = coords[i + 1]
        const x2 = coords[i + 2], y2 = coords[i + 3]
        const x3 = coords[i + 4], y3 = coords[i + 5]
        for (let s = 1; s <= samplesPerCurve; s++) {
          const t = s / samplesPerCurve
          const u = 1 - t
          const px = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3
          const py = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
          points.push({ x: px, y: py })
        }
        currentX = x3; currentY = y3
      }
    }
    // Z: path closes back to start — already represented
  }

  return points
}

// ============================================================================
// Flat-Element-Generierung pro Typ
// ============================================================================

function buildHatchRectFlat(): FlatPath[] {
  const border: FlatPath = {
    d: 'M 9,9 L 529,9 L 529,1129 L 9,1129 Z',
    fill: 'none',
    stroke: '#ffffff',
    strokeWidth: 18,
    strokeLinejoin: 'round',
  }
  // Diagonale Schraffur ~45° (Pattern: rotate(-45) scale(1,-1) → obere-rechts nach untere-links)
  // Tile 60px, Strichbreite 16px
  const hatchLines = generateRectHatchPaths(9, 9, 529, 1129, 135, 60, 16)
  return [border, ...hatchLines]
}

function buildHatchWedgeFlat(): FlatPath[] {
  const border: FlatPath = {
    d: 'M 189,1049 L 9,9 L 369,9 Z',
    fill: 'none',
    stroke: '#ffffff',
    strokeWidth: 18,
    strokeLinejoin: 'round',
  }

  // Die 10 Original-Linien geclippt ans Dreieck
  const triangle: Point[] = [
    { x: 9, y: 9 },
    { x: 369, y: 9 },
    { x: 189, y: 1049 },
  ]

  const lineEndpoints = [
    { x1: 509, y1: 1009, x2: -131, y2: 709 },
    { x1: 509, y1: 909, x2: -131, y2: 609 },
    { x1: 509, y1: 809, x2: -131, y2: 509 },
    { x1: 509, y1: 709, x2: -131, y2: 409 },
    { x1: 509, y1: 609, x2: -131, y2: 309 },
    { x1: 509, y1: 509, x2: -131, y2: 209 },
    { x1: 509, y1: 409, x2: -131, y2: 109 },
    { x1: 509, y1: 309, x2: -131, y2: 9 },
    { x1: 509, y1: 209, x2: -131, y2: -91 },
    { x1: 509, y1: 109, x2: -131, y2: -191 },
  ]

  const clippedLines: FlatPath[] = lineEndpoints
    .map(l => clipLineToPolygon(
      { x: l.x1, y: l.y1 }, { x: l.x2, y: l.y2 }, triangle,
    ))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map(c => ({
      d: `M ${c.x1.toFixed(1)},${c.y1.toFixed(1)} L ${c.x2.toFixed(1)},${c.y2.toFixed(1)}`,
      fill: 'none',
      stroke: '#ffffff',
      strokeWidth: 14,
      strokeLinecap: 'square' as const,
    }))

  return [border, ...clippedLines]
}

function buildHatchBogenFlat(): FlatPath[] {
  // Bogen: Rechteck mit diagonaler Schraffur, kein sichtbarer Rand
  // Pattern: rotate(-55), Tile 95px, Strichbreite 26px
  const hatchLines = generateRectHatchPaths(0, 0, 500, 1200, 125, 95, 26)
  return [...hatchLines]
}

function buildHatchWedgeRoundedFlat(): FlatPath[] {
  const pathD = 'M470,90 C505,160 535,260 550,390 C565,520 575,690 585,900 C590,1015 596,1110 603,1185 C560,1148 520,1105 485,1055 C450,1005 420,955 397,905 C418,690 438,510 450,365 C460,250 467,160 470,90 Z'

  const border: FlatPath = {
    d: pathD,
    fill: 'none',
    stroke: '#ffffff',
    strokeWidth: 16,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  }

  // Pfad als Polygon approximieren für Clipping
  const poly = approximateClosedPathAsPolygon(pathD, 8)

  // Schraffur geclippt an die Form
  // Pattern: rotate(-45), Tile 60px, Strichbreite 14px
  const hatchLines = generatePolygonHatchPaths(poly, 135, 60, 14)

  return [border, ...hatchLines]
}

// ============================================================================
// Sperrfläche Rechteck
// ============================================================================
const HATCH_RECT: BlockedAreaDef = {
  viewBox: '0 0 538 1138',
  width: 538,
  height: 1138,
  contentBox: { x: 9, y: 9, w: 520, h: 1120 },
  svgBody: `<defs>
    <style>.sr0,.sr1{fill:none}.sr2{fill:url(#hatch_rect);stroke-linejoin:round;stroke-width:18px}.sr2,.sr1{stroke:#fff}.sr1{stroke-width:16px}</style>
    <pattern id="hatch_rect" x="0" y="0" width="60" height="60" patternTransform="translate(-8553.26 -16532.35) rotate(-45) scale(1 -1)" patternUnits="userSpaceOnUse" viewBox="0 0 60 60">
      <g><rect class="sr0" width="60" height="60"/><line class="sr1" y1="60"/></g>
    </pattern>
  </defs>
  <polygon class="sr2" points="9 1129 9 9 529 9 529 1129 9 1129"/>`,
  flatPaths: buildHatchRectFlat(),
}

// ============================================================================
// Sperrfläche Keil (Dreieck)
// ============================================================================
const HATCH_WEDGE: BlockedAreaDef = {
  viewBox: '0 0 378 1058',
  width: 378,
  height: 1058,
  contentBox: { x: 9, y: 9, w: 360, h: 1040 },
  svgBody: `<defs>
    <style>.sw0,.sw1,.sw2{fill:none}.sw1{stroke-linejoin:round;stroke-width:18px}.sw1,.sw2{stroke:#fff}.sw2{stroke-linecap:square;stroke-width:14px}.sw3{clip-path:url(#clippath_wedge)}</style>
    <clipPath id="clippath_wedge"><polygon class="sw0" points="189 1049 9 9 369 9 189 1049"/></clipPath>
  </defs>
  <polygon class="sw1" points="189 1049 9 9 369 9 189 1049"/>
  <g class="sw3">
    <g>
      <line class="sw2" x1="509" y1="1009" x2="-131" y2="709"/>
      <line class="sw2" x1="509" y1="909" x2="-131" y2="609"/>
      <line class="sw2" x1="509" y1="809" x2="-131" y2="509"/>
      <line class="sw2" x1="509" y1="709" x2="-131" y2="409"/>
      <line class="sw2" x1="509" y1="609" x2="-131" y2="309"/>
      <line class="sw2" x1="509" y1="509" x2="-131" y2="209"/>
      <line class="sw2" x1="509" y1="409" x2="-131" y2="109"/>
      <line class="sw2" x1="509" y1="309" x2="-131" y2="9"/>
      <line class="sw2" x1="509" y1="209" x2="-131" y2="-91"/>
      <line class="sw2" x1="509" y1="109" x2="-131" y2="-191"/>
    </g>
  </g>`,
  flatPaths: buildHatchWedgeFlat(),
}

// ============================================================================
// Sperrfläche Keil abgerundet
// ============================================================================
const HATCH_WEDGE_ROUNDED: BlockedAreaDef = {
  viewBox: '0 0 900 1400',
  width: 900,
  height: 1400,
  contentBox: { x: 390, y: 80, w: 220, h: 1115 },
  svgBody: `<defs>
    <pattern id="hatch_rounded" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="60" stroke="white" stroke-width="14"/>
    </pattern>
    <path id="sperrflaeche_rounded" d="M470,90 C505,160 535,260 550,390 C565,520 575,690 585,900 C590,1015 596,1110 603,1185 C560,1148 520,1105 485,1055 C450,1005 420,955 397,905 C418,690 438,510 450,365 C460,250 467,160 470,90 Z"/>
    <clipPath id="clip_rounded"><use href="#sperrflaeche_rounded"/></clipPath>
  </defs>
  <rect x="0" y="0" width="900" height="1400" fill="url(#hatch_rounded)" clip-path="url(#clip_rounded)"/>
  <use href="#sperrflaeche_rounded" fill="none" stroke="white" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>`,
  flatPaths: buildHatchWedgeRoundedFlat(),
}

// ============================================================================
// Sperrfläche Bogen
// ============================================================================
const HATCH_BOGEN: BlockedAreaDef = {
  viewBox: '0 0 500 1200',
  width: 500,
  height: 1200,
  contentBox: { x: 0, y: 0, w: 500, h: 1200 },
  svgBody: `<defs>
    <style>.sb0{fill:url(#hatch_bogen)}.sb1,.sb2{fill:none}.sb2{stroke:#fff;stroke-width:26px}</style>
    <pattern id="hatch_bogen" x="0" y="0" width="95" height="95" patternTransform="translate(-10492.05 -16143.57) rotate(-55) scale(1 -1)" patternUnits="userSpaceOnUse" viewBox="0 0 95 95">
      <g><rect class="sb1" width="95" height="95"/><line class="sb2" y1="95"/></g>
    </pattern>
  </defs>
  <polygon class="sb0" points="0 1200 0 0 500 0 500 1200 0 1200"/>`,
  flatPaths: buildHatchBogenFlat(),
}

// ============================================================================
// Export-Map
// ============================================================================
export const BLOCKED_AREA_DEFS: Record<string, BlockedAreaDef> = {
  hatchRect: HATCH_RECT,
  hatchWedge: HATCH_WEDGE,
  hatchWedgeRounded: HATCH_WEDGE_ROUNDED,
  hatchBogen: HATCH_BOGEN,
}