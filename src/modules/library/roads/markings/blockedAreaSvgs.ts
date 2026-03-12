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
    } else if (cmd === 'L') {
      for (let i = 0; i < coords.length; i += 2) {
        currentX = coords[i]; currentY = coords[i + 1]
        points.push({ x: currentX, y: currentY })
      }
    } else if (cmd === 'Q') {
      for (let i = 0; i < coords.length; i += 4) {
        const x0 = currentX, y0 = currentY
        const cx = coords[i], cy = coords[i + 1]
        const x1 = coords[i + 2], y1 = coords[i + 3]
        for (let s = 1; s <= samplesPerCurve; s++) {
          const t = s / samplesPerCurve
          const u = 1 - t
          const px = u * u * x0 + 2 * u * t * cx + t * t * x1
          const py = u * u * y0 + 2 * u * t * cy + t * t * y1
          points.push({ x: px, y: py })
        }
        currentX = x1; currentY = y1
      }
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
  // Bogen: Illustrator-Export — Schraffur als Pfad-Geometrie eingebettet
  return [{
    d: 'M330.4,149.5c-.8-7.8-1.5-15.6-2.3-23.5-4.4-38.1-12-75.8-22.1-112.9-1-3.5-1.6-7.5-3.6-10.5-1.8-2.6-4.5-2.5-7.4-2.6-91.6,0-183.4,0-275,0-4.6,0-9.3-.3-13.9.2C3,.5.6,3.1.3,6.1-.2,10.4.1,14.8,0,19.1v1056c0,4.5-.4,9.3.4,13.8.9,3.6,4,5.3,7.6,5.2,12.3,0,24.7,0,37.1,0,4.1,0,8.2-1.5,8.8-6.1,1.3-14.9,1.3-30,2.8-45,1.5-16,2.9-32.1,5.2-48,1.1-7.4,1.9-14.8,3.1-22.1,2.5-14.1,5.3-28.1,7.9-42.1,3-13.2,6.1-26.4,9.3-39.6,3.2-12.3,6.8-24.6,10.2-36.8,4.1-12.3,7.9-24.7,12.1-37,6.4-16.6,12.1-33.4,19.3-49.7,11.3-26.4,22.5-52.8,33.8-79.1,13.4-29.9,26.8-59.9,40.2-89.8,13.9-29.7,27.8-59.5,41.8-89.2,12.8-26.2,25.6-52.4,38.5-78.5,5.9-11.7,10.9-23.8,16.3-35.7,7.5-18.8,14.2-38,19.5-57.5,2.7-11.1,5.8-22,7.8-33.2,1.3-6.9,3-13.8,3.9-20.8,1.5-11.7,3.5-23.3,4.2-35,3.2-33.1,2.9-66,.6-99.2ZM271.5,14.4c6.6-.8,13.6-.4,20.2-.2,8.8,31.5,15.7,63.5,20.3,95.9,1.2,5.5-2.8,9.1-5.3,13.6C211.6,275.9,116.5,428.1,21.3,580.4c-2.3,3.7-4.5,7.4-7.1,10.9-.3-5.7-.2-11.4-.2-17.2,0-48.3,0-96.7,0-145.1,0-2.1.4-3.7,1.5-5.5C98.8,290.4,181.9,157.3,265.1,24.1c2.1-3.2,3.8-6.8,6.4-9.7ZM15.7,45.7c5-8,10.1-15.9,15-24,1.5-2.4,2.9-5.1,4.8-7.2,1.7-.5,3.7-.5,5.5-.5,32.7.2,65.4-.1,98,.2-2.1,3.8-4.4,7.5-6.8,11.2-37.1,59.3-74.1,118.6-111.1,177.9-2.3,3.7-4.5,7.3-7,10.9-.3-6.4-.1-12.6-.2-19,0-45.7,0-91.3,0-137,.1-4.2-.7-8.7,1.7-12.3ZM14.4,237.3c1.2-3.4,3.6-6.4,5.5-9.4C62.5,159.8,105,91.7,147.6,23.6c1.9-3,3.6-6.4,6-9.1,2.7-.6,5.8-.4,8.5-.5,31.7.2,63.3-.1,95,.2-3,5.5-6.5,10.7-9.8,16C172.8,149.2,98.5,268.2,24.1,387.1c-3.4,5.2-6.1,10.5-9.9,15.2-.3-5.4-.2-10.8-.2-16.2,0-45.7,0-91.3,0-137,0-3.9-.4-7.9.4-11.7ZM52.1,965c-1.8,11.9-3.4,23.9-5.2,35.9-1.9,14.2-2.9,28.6-4.4,42.9-1,12-1.4,24.1-2,36.1-8.8.4-17.6.2-26.4.1-.3-26.6,0-53.3-.1-79.9,0-2.6-.1-5.3.4-7.8,1.1-3.2,3.3-6,5.1-8.8,11.3-18,22.6-36.1,33.9-54.2,2.4-3.8,4.1-7.6,7.5-10.6-2.9,15.4-6,30.8-8.7,46.3ZM283.2,385.2c-5.5,13.6-11.4,27-18,40.1-12.8,26.2-25.7,52.4-38.4,78.6-14.2,30.2-28.3,60.3-42.5,90.5-13.4,29.9-26.8,59.8-40.2,89.8-12.6,29.4-25.2,58.9-37.7,88.3-4.1,10.3-7.8,20.8-11.8,31.2-5.5,14.1-9.8,29-14.6,43.4-2.9,9.2-5.3,18.7-8,28-1.1,3.6-3,6.8-5.1,9.9-17.7,28-35,56.2-52.7,84.1-.3-6.6-.1-13.3-.1-19.9,0-47.3,0-94.8,0-142.1,0-2,.2-3.9,1.3-5.7,89.7-143.6,179.5-287.2,269.2-430.8,2.4-3.6,3.7-7.2,7.3-9.8-2,8.4-5.9,16.3-8.6,24.5ZM314.8,260c-1.7,13.2-3.9,26.2-6.5,39.2-1.3,6.1-1.5,13.1-4.8,18.3C209.5,467.9,115.6,618.3,21.6,768.6c-2.4,3.9-4.7,7.8-7.4,11.5-.3-6-.1-12-.2-18,0-45.3,0-90.7,0-136,0-3.8-.4-7.9.5-11.6,1.3-3.3,3.7-6.3,5.5-9.4,94.1-150.6,188.2-301.2,282.3-451.7,2.7-4.3,5.4-8.6,8-13,1.2-2.1,2.6-3.9,4.4-5.6,1.4,9.7,2.1,19.5,2.5,29.3,2,32,.8,64-2.4,95.9Z',
    fill: '#ffffff',
    stroke: 'none',
    strokeWidth: 0,
  }]
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
  viewBox: '0 0 332.2 1094.1',
  width: 332.2,
  height: 1094.1,
  contentBox: { x: 0, y: 0, w: 332.2, h: 1094.1 },
  svgBody: `<path d="M330.4,149.5c-.8-7.8-1.5-15.6-2.3-23.5-4.4-38.1-12-75.8-22.1-112.9-1-3.5-1.6-7.5-3.6-10.5-1.8-2.6-4.5-2.5-7.4-2.6-91.6,0-183.4,0-275,0-4.6,0-9.3-.3-13.9.2C3,.5.6,3.1.3,6.1-.2,10.4.1,14.8,0,19.1v1056c0,4.5-.4,9.3.4,13.8.9,3.6,4,5.3,7.6,5.2,12.3,0,24.7,0,37.1,0,4.1,0,8.2-1.5,8.8-6.1,1.3-14.9,1.3-30,2.8-45,1.5-16,2.9-32.1,5.2-48,1.1-7.4,1.9-14.8,3.1-22.1,2.5-14.1,5.3-28.1,7.9-42.1,3-13.2,6.1-26.4,9.3-39.6,3.2-12.3,6.8-24.6,10.2-36.8,4.1-12.3,7.9-24.7,12.1-37,6.4-16.6,12.1-33.4,19.3-49.7,11.3-26.4,22.5-52.8,33.8-79.1,13.4-29.9,26.8-59.9,40.2-89.8,13.9-29.7,27.8-59.5,41.8-89.2,12.8-26.2,25.6-52.4,38.5-78.5,5.9-11.7,10.9-23.8,16.3-35.7,7.5-18.8,14.2-38,19.5-57.5,2.7-11.1,5.8-22,7.8-33.2,1.3-6.9,3-13.8,3.9-20.8,1.5-11.7,3.5-23.3,4.2-35,3.2-33.1,2.9-66,.6-99.2ZM271.5,14.4c6.6-.8,13.6-.4,20.2-.2,8.8,31.5,15.7,63.5,20.3,95.9,1.2,5.5-2.8,9.1-5.3,13.6C211.6,275.9,116.5,428.1,21.3,580.4c-2.3,3.7-4.5,7.4-7.1,10.9-.3-5.7-.2-11.4-.2-17.2,0-48.3,0-96.7,0-145.1,0-2.1.4-3.7,1.5-5.5C98.8,290.4,181.9,157.3,265.1,24.1c2.1-3.2,3.8-6.8,6.4-9.7ZM15.7,45.7c5-8,10.1-15.9,15-24,1.5-2.4,2.9-5.1,4.8-7.2,1.7-.5,3.7-.5,5.5-.5,32.7.2,65.4-.1,98,.2-2.1,3.8-4.4,7.5-6.8,11.2-37.1,59.3-74.1,118.6-111.1,177.9-2.3,3.7-4.5,7.3-7,10.9-.3-6.4-.1-12.6-.2-19,0-45.7,0-91.3,0-137,.1-4.2-.7-8.7,1.7-12.3ZM14.4,237.3c1.2-3.4,3.6-6.4,5.5-9.4C62.5,159.8,105,91.7,147.6,23.6c1.9-3,3.6-6.4,6-9.1,2.7-.6,5.8-.4,8.5-.5,31.7.2,63.3-.1,95,.2-3,5.5-6.5,10.7-9.8,16C172.8,149.2,98.5,268.2,24.1,387.1c-3.4,5.2-6.1,10.5-9.9,15.2-.3-5.4-.2-10.8-.2-16.2,0-45.7,0-91.3,0-137,0-3.9-.4-7.9.4-11.7ZM52.1,965c-1.8,11.9-3.4,23.9-5.2,35.9-1.9,14.2-2.9,28.6-4.4,42.9-1,12-1.4,24.1-2,36.1-8.8.4-17.6.2-26.4.1-.3-26.6,0-53.3-.1-79.9,0-2.6-.1-5.3.4-7.8,1.1-3.2,3.3-6,5.1-8.8,11.3-18,22.6-36.1,33.9-54.2,2.4-3.8,4.1-7.6,7.5-10.6-2.9,15.4-6,30.8-8.7,46.3ZM283.2,385.2c-5.5,13.6-11.4,27-18,40.1-12.8,26.2-25.7,52.4-38.4,78.6-14.2,30.2-28.3,60.3-42.5,90.5-13.4,29.9-26.8,59.8-40.2,89.8-12.6,29.4-25.2,58.9-37.7,88.3-4.1,10.3-7.8,20.8-11.8,31.2-5.5,14.1-9.8,29-14.6,43.4-2.9,9.2-5.3,18.7-8,28-1.1,3.6-3,6.8-5.1,9.9-17.7,28-35,56.2-52.7,84.1-.3-6.6-.1-13.3-.1-19.9,0-47.3,0-94.8,0-142.1,0-2,.2-3.9,1.3-5.7,89.7-143.6,179.5-287.2,269.2-430.8,2.4-3.6,3.7-7.2,7.3-9.8-2,8.4-5.9,16.3-8.6,24.5ZM314.8,260c-1.7,13.2-3.9,26.2-6.5,39.2-1.3,6.1-1.5,13.1-4.8,18.3C209.5,467.9,115.6,618.3,21.6,768.6c-2.4,3.9-4.7,7.8-7.4,11.5-.3-6-.1-12-.2-18,0-45.3,0-90.7,0-136,0-3.8-.4-7.9.5-11.6,1.3-3.3,3.7-6.3,5.5-9.4,94.1-150.6,188.2-301.2,282.3-451.7,2.7-4.3,5.4-8.6,8-13,1.2-2.1,2.6-3.9,4.4-5.6,1.4,9.7,2.1,19.5,2.5,29.3,2,32,.8,64-2.4,95.9Z" style="fill: #fff;"/>`,
  flatPaths: buildHatchBogenFlat(),
}

// ============================================================================
// Zickzacklinie komplett
// ============================================================================
const ZIGZAG_LINE: BlockedAreaDef = {
  viewBox: '0 0 32.04 143.78',
  width: 32.04,
  height: 143.78,
  contentBox: { x: 0, y: 0, w: 32.04, h: 143.78 },
  svgBody: `<path d="M32.02,0c.02.98.02,1.96.02,2.94-8.43-.02-16.72-.26-25.15.14,8.14,7.06,16.96,13.79,25.02,20.9l.04.86c-6.9,4.86-13.28,10.9-20.01,16.15-2.85,2.38-5.43,4.59-8.19,7.07,6.44,6.05,13.41,11.02,20.07,16.99,2.64,2.16,5.33,4.06,7.99,6.15l.08,1.62c-7.07,4.65-13.3,10.82-20.1,16-2.78,2.3-5.41,4.59-8.05,7.05,6.78,6.01,13.97,11.45,20.8,17.44,2.49,2.06,4.76,3.87,7.41,5.75l-.04.85c-8.15,7.02-16.94,13.74-25.02,20.89,8.5.36,16.61.15,25.14.13,0,.95,0,1.9,0,2.85-10.7-.52-21.27-.13-32.02-.22,9.14-8.19,19.54-16,28.25-23.75C19.53,111.22,9.1,104.16.06,95.82c9.17-8.16,19.18-15.58,28.17-23.89C19.4,63.51,9.2,56.27.06,48.11c9.04-8.38,19.37-15.49,28.19-24.02C19.35,15.93,9.07,8.27.01.18c10.67-.29,21.33.04,32.01-.18Z" fill="#fff"/>`,
  flatPaths: [{
    d: 'M32.02,0c.02.98.02,1.96.02,2.94-8.43-.02-16.72-.26-25.15.14,8.14,7.06,16.96,13.79,25.02,20.9l.04.86c-6.9,4.86-13.28,10.9-20.01,16.15-2.85,2.38-5.43,4.59-8.19,7.07,6.44,6.05,13.41,11.02,20.07,16.99,2.64,2.16,5.33,4.06,7.99,6.15l.08,1.62c-7.07,4.65-13.3,10.82-20.1,16-2.78,2.3-5.41,4.59-8.05,7.05,6.78,6.01,13.97,11.45,20.8,17.44,2.49,2.06,4.76,3.87,7.41,5.75l-.04.85c-8.15,7.02-16.94,13.74-25.02,20.89,8.5.36,16.61.15,25.14.13,0,.95,0,1.9,0,2.85-10.7-.52-21.27-.13-32.02-.22,9.14-8.19,19.54-16,28.25-23.75C19.53,111.22,9.1,104.16.06,95.82c9.17-8.16,19.18-15.58,28.17-23.89C19.4,63.51,9.2,56.27.06,48.11c9.04-8.38,19.37-15.49,28.19-24.02C19.35,15.93,9.07,8.27.01.18c10.67-.29,21.33.04,32.01-.18Z',
    fill: '#ffffff',
    stroke: 'none',
    strokeWidth: 0,
  }],
}

// ============================================================================
// Grenzmarkierung fortlaufend
// ============================================================================
const BOUNDARY_CONTINUOUS: BlockedAreaDef = {
  viewBox: '0 0 339.04 215.31',
  width: 339.04,
  height: 215.31,
  contentBox: { x: 0, y: 0, w: 339.04, h: 215.31 },
  svgBody: `<path d="M.32.35C4.7-.04,9.32-.23,13.67.46c3.51,2.24,6.29,5.74,9.37,8.53,54.25,51.42,108.51,102.82,162.77,154.23,9.11,8.4,17.78,17.31,27.15,25.43,2.84-2.77,5.6-5.59,8.26-8.53,25.13-26.53,50.3-53.05,75.4-79.6,9.79-10.05,19.11-20.58,29.1-30.42,4.55,4.18,9.02,8.4,13.32,12.83-14.36,15.62-29.19,30.83-43.71,46.31-27.24,28.73-54.3,57.3-81.49,86.07-4.3-3.4-8.13-7.26-12.08-11.04C142.41,147.95,82.97,91.71,23.6,35.42c-2.96-2.89-5.98-5.7-9.1-8.41.05,56.65,0,113.31.02,169.96.07,5.36.05,10.71-.16,16.07-4.76.23-9.47.24-14.22-.02C-.08,145.69.15,78.31.03,10.97.03,7.46-.15,3.84.32.35Z" fill="#fff"/>`,
  flatPaths: [{
    d: 'M.32.35C4.7-.04,9.32-.23,13.67.46c3.51,2.24,6.29,5.74,9.37,8.53,54.25,51.42,108.51,102.82,162.77,154.23,9.11,8.4,17.78,17.31,27.15,25.43,2.84-2.77,5.6-5.59,8.26-8.53,25.13-26.53,50.3-53.05,75.4-79.6,9.79-10.05,19.11-20.58,29.1-30.42,4.55,4.18,9.02,8.4,13.32,12.83-14.36,15.62-29.19,30.83-43.71,46.31-27.24,28.73-54.3,57.3-81.49,86.07-4.3-3.4-8.13-7.26-12.08-11.04C142.41,147.95,82.97,91.71,23.6,35.42c-2.96-2.89-5.98-5.7-9.1-8.41.05,56.65,0,113.31.02,169.96.07,5.36.05,10.71-.16,16.07-4.76.23-9.47.24-14.22-.02C-.08,145.69.15,78.31.03,10.97.03,7.46-.15,3.84.32.35Z',
    fill: '#ffffff',
    stroke: 'none',
    strokeWidth: 0,
  }],
}

// ============================================================================
// Grenzmarkierung N-Form
// ============================================================================
const BOUNDARY_N_SHAPE: BlockedAreaDef = {
  viewBox: '0 0 228.05 215.26',
  width: 228.05,
  height: 215.26,
  contentBox: { x: 0, y: 0, w: 228.05, h: 215.26 },
  svgBody: `<path d="M.16.33C4.22-.08,8.58-.09,12.65.19c1.61.05,2.5,1.22,3.64,2.2,3.35,3.32,6.71,6.61,10.18,9.8,59.56,56.44,119.14,112.87,178.7,169.32,2.67,2.56,5.33,5.3,8.34,7.47.16-56.9.01-114.09.07-171.03.09-5.2-.36-10.54.31-15.7,4.46-.36,9.28-.36,13.73,0,.7,4.48.31,9.17.37,13.7-.01,61.67-.01,123.33-.01,185-.05,4.59.31,9.31-.31,13.86-4.71.42-9.93.84-14.55-.22-2.94-1.92-5.33-4.77-7.91-7.14C145.48,150.85,85.75,94.25,26.01,37.65c-3.63-3.3-7.1-7.3-11.18-9.96-.45,5.04-.21,10.2-.24,15.26v157c-.03,4.27.23,8.59-.16,12.84-4.6.62-9.68.65-14.27-.08-.31-3.9-.08-7.85-.1-11.76V11.95c.03-3.86-.21-7.77.1-11.62Z" fill="#fff"/>`,
  flatPaths: [{
    d: 'M.16.33C4.22-.08,8.58-.09,12.65.19c1.61.05,2.5,1.22,3.64,2.2,3.35,3.32,6.71,6.61,10.18,9.8,59.56,56.44,119.14,112.87,178.7,169.32,2.67,2.56,5.33,5.3,8.34,7.47.16-56.9.01-114.09.07-171.03.09-5.2-.36-10.54.31-15.7,4.46-.36,9.28-.36,13.73,0,.7,4.48.31,9.17.37,13.7-.01,61.67-.01,123.33-.01,185-.05,4.59.31,9.31-.31,13.86-4.71.42-9.93.84-14.55-.22-2.94-1.92-5.33-4.77-7.91-7.14C145.48,150.85,85.75,94.25,26.01,37.65c-3.63-3.3-7.1-7.3-11.18-9.96-.45,5.04-.21,10.2-.24,15.26v157c-.03,4.27.23,8.59-.16,12.84-4.6.62-9.68.65-14.27-.08-.31-3.9-.08-7.85-.1-11.76V11.95c.03-3.86-.21-7.77.1-11.62Z',
    fill: '#ffffff',
    stroke: 'none',
    strokeWidth: 0,
  }],
}

// ============================================================================
// Halteverbotslinie
// ============================================================================
const NO_STOPPING_LINE: BlockedAreaDef = {
  viewBox: '0 0 11.89 118.07',
  width: 11.89,
  height: 118.07,
  contentBox: { x: 0, y: 0, w: 11.89, h: 118.07 },
  svgBody: `<path d="M0,115.73c1.45-.64,2.93-1.2,4.4-1.78.3-10.05.07-20.08.14-30.14-.11-26.5.2-53.01-.15-79.5C2.98,3.69,1.57,3.07.16,2.45c.06-.76.12-1.51.18-2.26,3.84-.11,7.68-.17,11.52-.19-.1,1.02-.2,2.05-.29,3.08-1.19.35-2.37.71-3.55,1.07-.34,9.89-.1,19.77-.16,29.66.11,26.82-.22,53.66.16,80.48,1.22.32,2.43.63,3.64.95.08.91.15,1.81.23,2.72-3.46.04-7.19.39-10.57-.39-.49-.57-.93-1.18-1.32-1.84Z" fill="#fff"/>`,
  flatPaths: [{
    d: 'M0,115.73c1.45-.64,2.93-1.2,4.4-1.78.3-10.05.07-20.08.14-30.14-.11-26.5.2-53.01-.15-79.5C2.98,3.69,1.57,3.07.16,2.45c.06-.76.12-1.51.18-2.26,3.84-.11,7.68-.17,11.52-.19-.1,1.02-.2,2.05-.29,3.08-1.19.35-2.37.71-3.55,1.07-.34,9.89-.1,19.77-.16,29.66.11,26.82-.22,53.66.16,80.48,1.22.32,2.43.63,3.64.95.08.91.15,1.81.23,2.72-3.46.04-7.19.39-10.57-.39-.49-.57-.93-1.18-1.32-1.84Z',
    fill: '#ffffff',
    stroke: 'none',
    strokeWidth: 0,
  }],
}

// ============================================================================
// Export-Map
// ============================================================================
export const BLOCKED_AREA_DEFS: Record<string, BlockedAreaDef> = {
  hatchRect: HATCH_RECT,
  hatchWedge: HATCH_WEDGE,
  hatchWedgeRounded: HATCH_WEDGE_ROUNDED,
  hatchBogen: HATCH_BOGEN,
  zigzagLine: ZIGZAG_LINE,
  boundaryContinuous: BOUNDARY_CONTINUOUS,
  boundaryNShape: BOUNDARY_N_SHAPE,
  noStoppingLine: NO_STOPPING_LINE,
}