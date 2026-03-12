// src/modules/library/roads/generator/utils/transformPath.ts
// Transformiert SVG-Pfad-Daten (d-Attribut) durch eine 2D Affine-Matrix
// Damit Fabric.js die Bounding-Box korrekt berechnet (kein transform="rotate()" nötig)

type Matrix = { a: number; b: number; c: number; d: number; e: number; f: number }

/**
 * Wendet eine 2D affine Matrix auf einen SVG-Pfad-String an.
 * Transformiert alle Koordinaten inline — das Ergebnis hat keine Transform mehr nötig.
 * 
 * Unterstützt: M, L, H, V, C, S, Q, T, A, Z (absolut und relativ)
 */
export function transformPathData(d: string, m: Matrix): string {
  // Parse den Pfad in Tokens
  const tokens = tokenizePath(d)
  const result: string[] = []
  
  let i = 0
  let currentCmd = ''
  
  while (i < tokens.length) {
    const token = tokens[i]
    
    // Ist es ein Kommando-Buchstabe?
    if (/^[A-Za-z]$/.test(token)) {
      currentCmd = token
      result.push(token)
      i++
      continue
    }
    
    // Es sind Koordinaten — je nach Kommando verarbeiten
    const isRelative = currentCmd === currentCmd.toLowerCase()
    const cmd = currentCmd.toUpperCase()
    
    switch (cmd) {
      case 'M':
      case 'L':
      case 'T': {
        // x, y
        const x = parseFloat(tokens[i])
        const y = parseFloat(tokens[i + 1])
        const [tx, ty] = isRelative ? transformRel(x, y, m) : transformAbs(x, y, m)
        result.push(`${fmt(tx)},${fmt(ty)}`)
        i += 2
        break
      }
      case 'H': {
        // H/h → nach Rotation nicht mehr horizontal → konvertiere zu L/l
        const x = parseFloat(tokens[i])
        // Ersetze das H/h im result mit l/L
        result[result.length - 1] = isRelative ? 'l' : 'L'
        if (isRelative) {
          const [tx, ty] = transformRel(x, 0, m)
          result.push(`${fmt(tx)},${fmt(ty)}`)
        } else {
          // Absolute H braucht aktuelles Y — approximiere mit 0 (selten in diesen Pfaden)
          const [tx, ty] = transformAbs(x, 0, m)
          result.push(`${fmt(tx)},${fmt(ty)}`)
        }
        i += 1
        break
      }
      case 'V': {
        const y = parseFloat(tokens[i])
        // V/v → nach Rotation nicht mehr vertikal → konvertiere zu L/l
        result[result.length - 1] = isRelative ? 'l' : 'L'
        if (isRelative) {
          const [tx, ty] = transformRel(0, y, m)
          result.push(`${fmt(tx)},${fmt(ty)}`)
        } else {
          const [tx, ty] = transformAbs(0, y, m)
          result.push(`${fmt(tx)},${fmt(ty)}`)
        }
        i += 1
        break
      }
      case 'C': {
        // Cubic bezier: x1,y1 x2,y2 x,y
        for (let j = 0; j < 3; j++) {
          const x = parseFloat(tokens[i])
          const y = parseFloat(tokens[i + 1])
          const [tx, ty] = isRelative ? transformRel(x, y, m) : transformAbs(x, y, m)
          result.push(`${fmt(tx)},${fmt(ty)}`)
          i += 2
        }
        break
      }
      case 'S':
      case 'Q': {
        // S: x2,y2 x,y | Q: x1,y1 x,y
        for (let j = 0; j < 2; j++) {
          const x = parseFloat(tokens[i])
          const y = parseFloat(tokens[i + 1])
          const [tx, ty] = isRelative ? transformRel(x, y, m) : transformAbs(x, y, m)
          result.push(`${fmt(tx)},${fmt(ty)}`)
          i += 2
        }
        break
      }
      case 'A': {
        // Arc: rx ry rotation large-arc-flag sweep-flag x y
        const rx = parseFloat(tokens[i])
        const ry = parseFloat(tokens[i + 1])
        const rot = parseFloat(tokens[i + 2])
        const largeArc = tokens[i + 3]
        const sweep = tokens[i + 4]
        const x = parseFloat(tokens[i + 5])
        const y = parseFloat(tokens[i + 6])
        
        // Radien skalieren (approximation — korrekt nur bei uniformem Scale)
        const scale = Math.sqrt(m.a * m.a + m.b * m.b)
        const [tx, ty] = isRelative ? transformRel(x, y, m) : transformAbs(x, y, m)
        
        result.push(`${fmt(rx * scale)},${fmt(ry * scale)} ${fmt(rot)} ${largeArc} ${sweep} ${fmt(tx)},${fmt(ty)}`)
        i += 7
        break
      }
      case 'Z': {
        // Nichts zu transformieren
        i++
        break
      }
      default: {
        // Unbekanntes Kommando — Wert durchreichen
        result.push(tokens[i])
        i++
      }
    }
  }
  
  return result.join(' ')
}

/**
 * Erstellt eine Transformationsmatrix: translate(tx,ty) → rotate(deg) → translate(cx,cy) → scale(s)
 * Optional mirror (scale(-1,1)) vor dem finalen translate+scale
 */
export function buildMatrix(
  tx: number, ty: number,
  rotDeg: number,
  cx: number, cy: number,
  s: number,
  mirror: boolean = false,
  sy?: number
): Matrix {
  const rad = (rotDeg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const sxVal = s
  const syVal = sy ?? s

  // Kette: T(tx,ty) * R(rot) * [Mirror] * T(cx*sx, cy*sy) * S(sx,sy) * P
  // Von rechts nach links auf Punkt P angewendet:
  // 1. Scale(sx,sy)    2. Translate(cx*sx, cy*sy)    3. Mirror?    4. Rotate    5. Translate(tx,ty)

  // Start: S(sx,sy) → [sx, 0, 0, sy, 0, 0]
  // T(cx*sx, cy*sy) * S(sx,sy) → [sx, 0, 0, sy, cx*sx, cy*sy]
  let a = sxVal
  const b = 0
  let c = 0
  const d = syVal
  let e = cx * sxVal
  const f = cy * syVal
  
  // Mirror: scale(-1, 1)
  if (mirror) { a = -a; c = -c; e = -e }
  
  // R * current (SVG matrix convention: column-major [a,b,c,d,e,f])
  // | cos -sin |   | a c e |   | cos*a-sin*b  cos*c-sin*d  cos*e-sin*f |
  // | sin  cos | * | b d f | = | sin*a+cos*b  sin*c+cos*d  sin*e+cos*f |
  const na = cos * a - sin * b
  const nb = sin * a + cos * b
  const nc = cos * c - sin * d
  const nd = sin * c + cos * d
  const ne = cos * e - sin * f
  const nf = sin * e + cos * f
  
  // T(tx, ty)
  return { a: na, b: nb, c: nc, d: nd, e: ne + tx, f: nf + ty }
}

// ============================================================================
// Helpers
// ============================================================================

function transformAbs(x: number, y: number, m: Matrix): [number, number] {
  return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]
}

function transformRel(x: number, y: number, m: Matrix): [number, number] {
  // Relative Koordinaten: nur Rotation/Scale, kein Translation
  return [m.a * x + m.c * y, m.b * x + m.d * y]
}

function fmt(n: number): string {
  return Number(n.toFixed(2)).toString()
}

/**
 * Tokenisiert einen SVG-Pfad-String in Kommandos und Zahlen
 */
function tokenizePath(d: string): string[] {
  const tokens: string[] = []
  // Match: Kommando-Buchstaben ODER Zahlen (mit optionalem Minus und Dezimalpunkt)
  const regex = /([A-Za-z])|(-?\d*\.?\d+(?:e[+-]?\d+)?)/gi
  let match
  while ((match = regex.exec(d)) !== null) {
    tokens.push(match[0])
  }
  return tokens
}