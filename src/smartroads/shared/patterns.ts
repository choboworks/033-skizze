// ============================================================
// SmartRoads – Texture Patterns
// All patterns created synchronously as HTMLCanvasElement.
// Konva fillPatternImage accepts both Canvas and Image elements.
// No async loading, no race conditions.
// ============================================================

function createPattern(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = width
  c.height = height
  const ctx = c.getContext('2d')!
  draw(ctx)
  return c
}

// Singleton cache
let _paving: HTMLCanvasElement | null = null
let _grass: HTMLCanvasElement | null = null
let _asphalt: HTMLCanvasElement | null = null
let _concrete: HTMLCanvasElement | null = null
let _cobblestone: HTMLCanvasElement | null = null
let _sidewalkStandard: HTMLCanvasElement | null = null
let _sidewalkSlabPremium: HTMLCanvasElement | null = null
let _sidewalkCommercial: HTMLCanvasElement | null = null
let _naturalStone: HTMLCanvasElement | null = null
let _naturalStoneWalkway: HTMLCanvasElement | null = null
let _clinker: HTMLCanvasElement | null = null
let _dirtPath: HTMLCanvasElement | null = null
let _gravelPath: HTMLCanvasElement | null = null
let _forestPath: HTMLCanvasElement | null = null

export function getPavingPattern(): HTMLCanvasElement {
  if (!_paving) {
    // Modern Verbundpflaster (interlocking concrete pavers) – Reihenverband (stretcher bond)
    // 32x32 tile, each stone ~8x4 with offset rows, narrow grout lines
    _paving = createPattern(32, 32, (ctx) => {
      const grout = '#3a3a3a'
      // Fill entire tile with grout color first
      ctx.fillStyle = grout
      ctx.fillRect(0, 0, 32, 32)

      // Stone base colors – slight warm-grey variation like real concrete pavers
      const stoneColors = [
        '#787068', '#7e756c', '#747068', '#7a7270',
        '#767060', '#7c7468', '#706a62', '#78706a',
      ]

      // Stretcher bond: even rows aligned, odd rows offset by half a stone width
      // Stone dimensions: 8w x 4h with 1px grout gap
      const sw = 7   // stone width (8 - 1px grout)
      const sh = 3   // stone height (4 - 1px grout)
      const gw = 8   // grid cell width
      const gh = 4   // grid cell height

      // Simple seeded-random for deterministic variation
      let seed = 41
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }

      for (let row = 0; row < 8; row++) {
        const yy = row * gh
        const offset = (row % 2 === 1) ? 4 : 0  // half-stone offset for odd rows
        for (let col = -1; col < 5; col++) {
          const xx = col * gw + offset
          // Pick a stone color with slight random variation
          const baseColor = stoneColors[Math.floor(rand() * stoneColors.length)]
          ctx.fillStyle = baseColor
          ctx.globalAlpha = 1
          ctx.fillRect(xx, yy, sw, sh)

          // Subtle surface variation – a lighter or darker patch on each stone
          ctx.globalAlpha = 0.12
          ctx.fillStyle = rand() > 0.5 ? '#999' : '#555'
          const px = xx + Math.floor(rand() * (sw - 2))
          const py = yy + Math.floor(rand() * (sh - 1))
          ctx.fillRect(px, py, 2, 1)
        }
      }

      ctx.globalAlpha = 1
    })
  }
  return _paving
}

export function getGrassPattern(): HTMLCanvasElement {
  if (!_grass) {
    _grass = createPattern(6, 6, (ctx) => {
      ctx.fillStyle = '#7a9a5a'
      ctx.fillRect(0, 0, 6, 6)
      ctx.fillStyle = '#6a8a4a'
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(2, 2, 0.8, 0, Math.PI * 2)
      ctx.arc(5, 5, 0.8, 0, Math.PI * 2)
      ctx.fill()
    })
  }
  return _grass
}

export function getAsphaltPattern(): HTMLCanvasElement {
  if (!_asphalt) {
    _asphalt = createPattern(12, 12, (ctx) => {
      // Base asphalt
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(0, 0, 12, 12)

      // Subtle aggregate noise
      ctx.globalAlpha = 0.08
      ctx.fillStyle = '#555555'
      ctx.fillRect(1, 0, 1, 1)
      ctx.fillRect(5, 3, 1, 1)
      ctx.fillRect(9, 1, 1, 1)
      ctx.fillRect(3, 7, 1, 1)
      ctx.fillRect(7, 9, 1, 1)
      ctx.fillRect(11, 6, 1, 1)
      ctx.fillRect(0, 10, 1, 1)
      ctx.fillRect(6, 11, 1, 1)

      // Darker variation
      ctx.fillStyle = '#2e2e2e'
      ctx.globalAlpha = 0.1
      ctx.fillRect(2, 4, 2, 1)
      ctx.fillRect(8, 8, 2, 1)
      ctx.fillRect(4, 10, 1, 2)

      ctx.globalAlpha = 1
    })
  }
  return _asphalt
}

export function getCobblestonePattern(): HTMLCanvasElement {
  if (!_cobblestone) {
    // Historic cobblestone (Natursteinpflaster) – irregular rounded stones, deep dark grout
    // 32x32 tile with ~4x4 to 6x5 irregularly sized/placed stones
    _cobblestone = createPattern(32, 32, (ctx) => {
      // Deep dark grout base – the gaps between old cobblestones are very dark
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, 0, 32, 32)

      // Irregular stones – each defined with center, radii, color
      // Laid out in a roughly 5-column, 5-row grid with jitter
      const stones: { cx: number; cy: number; rx: number; ry: number; color: string }[] = [
        // Row 0
        { cx: 3.2, cy: 3.0, rx: 2.6, ry: 2.4, color: '#5c5c5c' },
        { cx: 9.5, cy: 3.3, rx: 2.8, ry: 2.2, color: '#686260' },
        { cx: 16.0, cy: 2.8, rx: 2.5, ry: 2.5, color: '#555050' },
        { cx: 22.2, cy: 3.4, rx: 2.7, ry: 2.3, color: '#636363' },
        { cx: 28.8, cy: 2.9, rx: 2.6, ry: 2.6, color: '#5a5555' },
        // Row 1 – offset
        { cx: 6.0, cy: 9.2, rx: 2.5, ry: 2.7, color: '#605a58' },
        { cx: 12.8, cy: 9.5, rx: 2.9, ry: 2.4, color: '#585858' },
        { cx: 19.0, cy: 9.0, rx: 2.4, ry: 2.6, color: '#666060' },
        { cx: 25.5, cy: 9.6, rx: 2.8, ry: 2.3, color: '#5e5858' },
        { cx: 0.8, cy: 9.4, rx: 2.3, ry: 2.5, color: '#545050' },
        { cx: 31.5, cy: 9.1, rx: 2.2, ry: 2.6, color: '#5c5858' },
        // Row 2
        { cx: 3.5, cy: 15.5, rx: 2.7, ry: 2.3, color: '#646060' },
        { cx: 9.8, cy: 16.0, rx: 2.5, ry: 2.6, color: '#5a5656' },
        { cx: 16.2, cy: 15.3, rx: 2.8, ry: 2.5, color: '#585454' },
        { cx: 22.5, cy: 15.8, rx: 2.6, ry: 2.4, color: '#625e5c' },
        { cx: 29.0, cy: 15.6, rx: 2.5, ry: 2.7, color: '#565252' },
        // Row 3 – offset
        { cx: 6.3, cy: 21.8, rx: 2.6, ry: 2.5, color: '#5e5a58' },
        { cx: 12.5, cy: 22.2, rx: 2.4, ry: 2.3, color: '#686462' },
        { cx: 19.2, cy: 21.5, rx: 2.7, ry: 2.6, color: '#545050' },
        { cx: 25.8, cy: 22.0, rx: 2.5, ry: 2.4, color: '#5c5858' },
        { cx: 0.5, cy: 22.1, rx: 2.4, ry: 2.5, color: '#605c5a' },
        { cx: 31.8, cy: 21.7, rx: 2.3, ry: 2.5, color: '#585454' },
        // Row 4
        { cx: 3.0, cy: 28.2, rx: 2.5, ry: 2.4, color: '#5a5656' },
        { cx: 9.6, cy: 28.5, rx: 2.7, ry: 2.3, color: '#625e5c' },
        { cx: 16.0, cy: 28.0, rx: 2.6, ry: 2.6, color: '#585454' },
        { cx: 22.4, cy: 28.6, rx: 2.4, ry: 2.5, color: '#5e5a58' },
        { cx: 29.2, cy: 28.3, rx: 2.8, ry: 2.4, color: '#646060' },
      ]

      for (const s of stones) {
        // Draw each stone as an ellipse
        ctx.globalAlpha = 1
        ctx.fillStyle = s.color
        ctx.beginPath()
        // Approximate ellipse with bezier via arc + scale trick – but we only have basic API
        // So draw an ellipse manually with 4 quadratic curves
        const cx = s.cx, cy = s.cy, rx = s.rx, ry = s.ry
        ctx.moveTo(cx + rx, cy)
        ctx.quadraticCurveTo(cx + rx, cy + ry, cx, cy + ry)
        ctx.quadraticCurveTo(cx - rx, cy + ry, cx - rx, cy)
        ctx.quadraticCurveTo(cx - rx, cy - ry, cx, cy - ry)
        ctx.quadraticCurveTo(cx + rx, cy - ry, cx + rx, cy)
        ctx.fill()

        // Subtle highlight on upper-left of each stone (worn surface catching light)
        ctx.globalAlpha = 0.15
        ctx.fillStyle = '#999'
        ctx.beginPath()
        const hrx = rx * 0.55, hry = ry * 0.55
        const hcx = cx - rx * 0.15, hcy = cy - ry * 0.15
        ctx.moveTo(hcx + hrx, hcy)
        ctx.quadraticCurveTo(hcx + hrx, hcy + hry, hcx, hcy + hry)
        ctx.quadraticCurveTo(hcx - hrx, hcy + hry, hcx - hrx, hcy)
        ctx.quadraticCurveTo(hcx - hrx, hcy - hry, hcx, hcy - hry)
        ctx.quadraticCurveTo(hcx + hrx, hcy - hry, hcx + hrx, hcy)
        ctx.fill()

        // Dark edge on lower-right (shadow in grout)
        ctx.globalAlpha = 0.2
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(cx + rx * 0.3, cy + ry)
        ctx.quadraticCurveTo(cx + rx, cy + ry, cx + rx, cy + ry * 0.3)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
    })
  }
  return _cobblestone
}

export function getConcretePattern(): HTMLCanvasElement {
  if (!_concrete) {
    // Concrete road surface (Betonfahrbahn) – light-medium grey with expansion joints
    // 32x32 tile, subtle color variation/stains, transverse joint lines
    _concrete = createPattern(32, 32, (ctx) => {
      // Base concrete color – medium grey, dark enough for white markings to show
      ctx.fillStyle = '#8a8a88'
      ctx.fillRect(0, 0, 32, 32)

      // Subtle slab-to-slab color variation (two halves slightly different)
      ctx.globalAlpha = 0.06
      ctx.fillStyle = '#9a9a98'
      ctx.fillRect(0, 0, 32, 16)

      // Surface texture – fine aggregate speckle
      ctx.globalAlpha = 0.06
      const speckles = [
        [2, 3], [7, 1], [12, 5], [18, 2], [24, 7], [29, 4],
        [1, 10], [6, 13], [14, 11], [20, 14], [27, 12], [31, 9],
        [3, 18], [9, 20], [15, 17], [22, 19], [28, 21], [4, 22],
        [10, 25], [17, 28], [23, 26], [30, 29], [5, 30], [13, 31],
      ]
      for (const [sx, sy] of speckles) {
        ctx.fillStyle = '#aaa'
        ctx.fillRect(sx, sy, 1, 1)
      }
      // Darker speckles
      for (const [sx, sy] of [[4, 7], [11, 3], [19, 9], [26, 15], [8, 23], [16, 27], [25, 5], [2, 29]]) {
        ctx.fillStyle = '#666'
        ctx.globalAlpha = 0.08
        ctx.fillRect(sx, sy, 1, 1)
      }

      // Stain / discoloration patches (concrete weathers unevenly)
      ctx.globalAlpha = 0.04
      ctx.fillStyle = '#706860'
      ctx.fillRect(5, 6, 4, 3)
      ctx.fillRect(20, 22, 5, 3)
      ctx.fillStyle = '#a0a0a0'
      ctx.globalAlpha = 0.05
      ctx.fillRect(14, 2, 3, 2)
      ctx.fillRect(24, 18, 4, 2)

      // Transverse expansion joint – the key visual feature of concrete roads
      // A clear dark line running horizontally across the slab
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = '#5a5a58'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(0, 16)
      ctx.lineTo(32, 16)
      ctx.stroke()

      // Faint longitudinal joint (center joint between lanes, less visible)
      ctx.globalAlpha = 0.12
      ctx.strokeStyle = '#6a6a68'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(16, 0)
      ctx.lineTo(16, 32)
      ctx.stroke()

      // Very subtle hairline cracks near joints (aged concrete)
      ctx.globalAlpha = 0.08
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 0.3
      ctx.beginPath()
      ctx.moveTo(8, 15)
      ctx.lineTo(10, 13)
      ctx.lineTo(11, 14)
      ctx.stroke()

      ctx.globalAlpha = 1
    })
  }
  return _concrete
}

export function getSidewalkPattern(): HTMLCanvasElement {
  if (!_sidewalkStandard) {
    // Deutsche Gehwegplatten (30x30 / 40x40 cm) – Draufsicht
    // 64x64 tile = 2x2 large slabs (each 32x32), strong grout, per-slab color variation,
    // concrete surface texture, tileable. Rendered at scale ~0.009 for visible plate size.
    _sidewalkStandard = createPattern(64, 64, (ctx) => {
      // Deterministic PRNG
      let seed = 47
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }

      // --- Dark grout base ---
      ctx.fillStyle = '#8a8078'
      ctx.fillRect(0, 0, 64, 64)

      // --- Four slabs with noticeable color variation ---
      const slabColors = ['#c6bfb2', '#bab2a4', '#ccc5b8', '#b5ada0']
      const slabs = [
        { x: 0, y: 0 },
        { x: 32, y: 0 },
        { x: 0, y: 32 },
        { x: 32, y: 32 },
      ]
      const sw = 30  // 32 minus 2px grout gap
      const sh = 30

      for (let si = 0; si < slabs.length; si++) {
        const sx = slabs[si].x
        const sy = slabs[si].y

        // --- Slab base ---
        ctx.globalAlpha = 1
        ctx.fillStyle = slabColors[si]
        ctx.fillRect(sx, sy, sw, sh)

        // --- Subtle warm/cool tint per slab ---
        ctx.globalAlpha = 0.07
        ctx.fillStyle = si % 2 === 0 ? '#d8d0b8' : '#b0aaa4'
        ctx.fillRect(sx, sy, sw, sh)

        // --- Concrete surface noise (speckle) ---
        for (let i = 0; i < 55; i++) {
          const px = sx + Math.floor(rand() * sw)
          const py = sy + Math.floor(rand() * sh)
          ctx.globalAlpha = rand() > 0.5 ? 0.08 : 0.12
          ctx.fillStyle = rand() > 0.5 ? '#d8d2c8' : '#9a9488'
          ctx.fillRect(px, py, 1, 1)
        }

        // --- Micro pores ---
        for (let i = 0; i < 5; i++) {
          const px = sx + 3 + Math.floor(rand() * (sw - 6))
          const py = sy + 3 + Math.floor(rand() * (sh - 6))
          ctx.globalAlpha = 0.12
          ctx.fillStyle = '#6a6258'
          ctx.fillRect(px, py, 1, 1)
        }

        // --- Weathering stain on some slabs ---
        if (rand() > 0.5) {
          ctx.globalAlpha = 0.05
          ctx.fillStyle = '#706050'
          ctx.fillRect(
            sx + 3 + Math.floor(rand() * (sw - 8)),
            sy + 3 + Math.floor(rand() * (sh - 8)),
            3 + Math.floor(rand() * 5),
            3 + Math.floor(rand() * 4),
          )
        }

        // --- Slab edge bevel: light top/left, dark bottom/right ---
        ctx.globalAlpha = 0.14
        ctx.strokeStyle = '#ddd8d0'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(sx, sy + sh)
        ctx.lineTo(sx, sy)
        ctx.lineTo(sx + sw, sy)
        ctx.stroke()

        ctx.globalAlpha = 0.18
        ctx.strokeStyle = '#7a7268'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(sx + sw, sy)
        ctx.lineTo(sx + sw, sy + sh)
        ctx.lineTo(sx, sy + sh)
        ctx.stroke()
      }

      // --- Grout lines (strong, 2px gap) ---
      ctx.globalAlpha = 0.65
      ctx.fillStyle = '#6e665c'
      ctx.fillRect(0, 30, 64, 2)   // horizontal grout
      ctx.fillRect(30, 0, 2, 64)   // vertical grout

      // --- Grout shadow (bottom/right) ---
      ctx.globalAlpha = 0.3
      ctx.fillStyle = '#5a5248'
      ctx.fillRect(0, 31.5, 64, 0.7)
      ctx.fillRect(31.5, 0, 0.7, 64)

      // --- Grout highlight (top/left) ---
      ctx.globalAlpha = 0.12
      ctx.fillStyle = '#c8c0b4'
      ctx.fillRect(0, 30, 64, 0.5)
      ctx.fillRect(30, 0, 0.5, 64)

      ctx.globalAlpha = 1
    })
  }
  return _sidewalkStandard
}

export function getSidewalkSlabPattern(): HTMLCanvasElement {
  if (!_sidewalkSlabPremium) {
    _sidewalkSlabPremium = createPattern(96, 96, (ctx) => {
      let seed = 147
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }
      const module = 48
      const joint = 3
      const slab = module - joint
      const slabColors = [
        '#b8bbb7', '#aeb2ae',
        '#c1c4c0', '#a4a8a4',
      ]

      ctx.fillStyle = '#6c706c'
      ctx.fillRect(0, 0, 96, 96)

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const sx = col * module
          const sy = row * module
          const sw = slab
          const sh = slab
          const baseColor = slabColors[row * 2 + col]

          ctx.globalAlpha = 1
          ctx.fillStyle = baseColor
          ctx.fillRect(sx, sy, sw, sh)

          const gradient = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh)
          gradient.addColorStop(0, 'rgba(247,248,244,0.08)')
          gradient.addColorStop(0.45, 'rgba(245,246,243,0.02)')
          gradient.addColorStop(1, 'rgba(78,84,82,0.10)')
          ctx.fillStyle = gradient
          ctx.fillRect(sx, sy, sw, sh)

          ctx.globalAlpha = 0.05
          ctx.fillStyle = row % 2 === col % 2 ? '#c7cbc6' : '#979d99'
          ctx.fillRect(sx, sy, sw, sh)

          for (let i = 0; i < 135; i++) {
            const px = sx + Math.floor(rand() * sw)
            const py = sy + Math.floor(rand() * sh)
            ctx.globalAlpha = rand() > 0.45 ? 0.09 : 0.07
            ctx.fillStyle = rand() > 0.5 ? '#d2d5d0' : '#858b87'
            ctx.fillRect(px, py, 1, 1)
          }

          for (let i = 0; i < 34; i++) {
            const py = sy + 3 + Math.floor(rand() * Math.max(1, sh - 6))
            const px = sx + 3 + Math.floor(rand() * 4)
            const len = 20 + Math.floor(rand() * 15)
            ctx.globalAlpha = 0.032
            ctx.fillStyle = '#7b817e'
            ctx.fillRect(px, py, Math.min(len, sw - 6), 1)
          }

          for (let i = 0; i < 10; i++) {
            const px = sx + 4 + Math.floor(rand() * Math.max(1, sw - 8))
            const py = sy + 4 + Math.floor(rand() * Math.max(1, sh - 8))
            ctx.globalAlpha = 0.12
            ctx.fillStyle = '#676d69'
            ctx.fillRect(px, py, 1, 1)
          }

          if (rand() > 0.28) {
            const patchX = sx + 5 + Math.floor(rand() * 10)
            const patchY = sy + 5 + Math.floor(rand() * 10)
            const patchW = 8 + Math.floor(rand() * 7)
            const patchH = 4 + Math.floor(rand() * 5)
            ctx.globalAlpha = 0.045
            ctx.fillStyle = rand() > 0.5 ? '#8d928d' : '#c7cbc6'
            ctx.fillRect(patchX, patchY, patchW, patchH)
          }

          if ((row + col) % 2 === 0) {
            const crackStartX = sx + 8 + Math.floor(rand() * 10)
            const crackStartY = sy + 12 + Math.floor(rand() * 10)
            ctx.globalAlpha = 0.09
            ctx.strokeStyle = '#686f6c'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(crackStartX, crackStartY)
            ctx.lineTo(crackStartX + 6 + Math.floor(rand() * 7), crackStartY + 1 + Math.floor(rand() * 4))
            ctx.lineTo(crackStartX + 12 + Math.floor(rand() * 10), crackStartY - 1 + Math.floor(rand() * 5))
            ctx.stroke()
          }

          ctx.globalAlpha = 0.12
          ctx.strokeStyle = '#d8ddd8'
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(sx, sy + sh)
          ctx.lineTo(sx, sy)
          ctx.lineTo(sx + sw, sy)
          ctx.stroke()

          ctx.globalAlpha = 0.14
          ctx.strokeStyle = '#666b67'
          ctx.lineWidth = 0.9
          ctx.beginPath()
          ctx.moveTo(sx + sw, sy)
          ctx.lineTo(sx + sw, sy + sh)
          ctx.lineTo(sx, sy + sh)
          ctx.stroke()

          ctx.globalAlpha = 0.08
          ctx.fillStyle = '#d6dbd6'
          ctx.fillRect(sx + 1, sy + 1, 2, 2)
          ctx.globalAlpha = 0.10
          ctx.fillStyle = '#646965'
          ctx.fillRect(sx + sw - 2, sy + sh - 2, 2, 2)
        }
      }

      ctx.globalAlpha = 0.74
      ctx.fillStyle = '#626761'
      for (let i = 1; i < 2; i++) {
        const pos = i * module - joint
        ctx.fillRect(0, pos, 96, joint)
        ctx.fillRect(pos, 0, joint, 96)
      }

      ctx.globalAlpha = 0.24
      ctx.fillStyle = '#565b56'
      for (let i = 1; i < 2; i++) {
        const pos = i * module - 0.4
        ctx.fillRect(0, pos, 96, 0.7)
        ctx.fillRect(pos, 0, 0.7, 96)
      }

      ctx.globalAlpha = 0.10
      ctx.fillStyle = '#c0c5bf'
      for (let i = 1; i < 2; i++) {
        const pos = i * module - joint
        ctx.fillRect(0, pos, 96, 0.5)
        ctx.fillRect(pos, 0, 0.5, 96)
      }

      ctx.globalAlpha = 1
    })
  }
  return _sidewalkSlabPremium
}

export function getSidewalkCommercialPattern(): HTMLCanvasElement {
  if (!_sidewalkCommercial) {
    // Geschäftsstraße: warm-toned, slightly more decorative paving
    // Smaller stones in a herringbone-like pattern — premium feel
    _sidewalkCommercial = createPattern(32, 32, (ctx) => {
      // Warm sand/beige base
      ctx.fillStyle = '#d0c0a8'
      ctx.fillRect(0, 0, 32, 32)

      // Alternating warm-toned rectangular pavers
      const colors = [
        '#c8b898', '#d4c4a8', '#ccbc9c', '#d8c8ac',
        '#c4b490', '#d0c0a0', '#c0b088', '#d4c4a4',
      ]

      let seed = 73
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }

      // Smaller stones: 8x4 grid with stretcher bond
      const sw = 7, sh = 3, gw = 8, gh = 4
      for (let row = 0; row < 8; row++) {
        const yy = row * gh
        const offset = (row % 2 === 1) ? 4 : 0
        for (let col = -1; col < 5; col++) {
          const xx = col * gw + offset
          ctx.fillStyle = colors[Math.floor(rand() * colors.length)]
          ctx.globalAlpha = 1
          ctx.fillRect(xx, yy, sw, sh)

          // Surface shimmer — lighter highlight
          ctx.globalAlpha = 0.08
          ctx.fillStyle = '#f0e8d8'
          ctx.fillRect(xx + 1, yy, sw - 2, 1)
        }
      }

      // Grout lines (subtle, lighter than road paving)
      ctx.globalAlpha = 0.12
      ctx.strokeStyle = '#a09880'
      ctx.lineWidth = 0.5
      for (let row = 0; row <= 8; row++) {
        ctx.beginPath()
        ctx.moveTo(0, row * gh)
        ctx.lineTo(32, row * gh)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
    })
  }
  return _sidewalkCommercial
}

export function getNaturalStoneLegacyPattern(): HTMLCanvasElement {
  if (!_naturalStone) {
    // Gesägte Natursteinplatten (Granit) – Innenstadtbereich, Draufsicht
    // Mixed-format rectangular/square sawn plates, cool grey palette with subtle
    // bluish/reddish granite shimmer, flamed/bush-hammered surface texture,
    // narrow precise joints, occasional mica glints. 32x32, tileable.
    _naturalStone = createPattern(32, 32, (ctx) => {
      // Deterministic PRNG
      let seed = 61
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }

      // --- Joint base (dark narrow gaps between sawn plates) ---
      ctx.fillStyle = '#4a4640'
      ctx.fillRect(0, 0, 32, 32)

      // --- Stone layout: mixed-format (Mischformat) ---
      // Rows have different heights; columns within a row have different widths.
      // Joints are 1px wide. All coordinates must tile at 32x32.
      // Row layout: [rowY, rowH, colWidths[]]
      const rows: { y: number; h: number; cols: number[] }[] = [
        { y: 0,  h: 8,  cols: [10, 12, 10] },       // 10+1+12+1+10 = 34 -> wrap
        { y: 9,  h: 6,  cols: [7, 8, 9, 8] },        // mixed small
        { y: 16, h: 9,  cols: [15, 16] },              // two large slabs
        { y: 26, h: 6,  cols: [9, 7, 8, 8] },         // mixed small to tile edge
      ]

      // Granite base colors – cool greys with hints of blue/rose/warm
      const graniteColors = [
        '#8a8890', // cool blue-grey
        '#928e8c', // warm grey
        '#8c8a8e', // neutral cool
        '#969092', // slightly rose-grey
        '#888890', // steel blue-grey
        '#908c88', // warm granite
        '#8e8a90', // lavender-grey
        '#949090', // light warm
      ]

      for (const row of rows) {
        let cx = 0
        for (const colW of row.cols) {
          const stoneW = colW - 1  // 1px joint gap on right
          const stoneH = row.h - 1 // 1px joint gap on bottom

          // --- Stone base color ---
          const baseColor = graniteColors[Math.floor(rand() * graniteColors.length)]
          ctx.globalAlpha = 1
          ctx.fillStyle = baseColor
          ctx.fillRect(cx, row.y, stoneW, stoneH)

          // --- Subtle overall tint (bluish or reddish shimmer unique to granite) ---
          ctx.globalAlpha = 0.06
          const tint = rand()
          ctx.fillStyle = tint < 0.33 ? '#8888a0' : tint < 0.66 ? '#a08888' : '#909098'
          ctx.fillRect(cx, row.y, stoneW, stoneH)

          // --- Flamed / bush-hammered surface texture ---
          // Many fine light specks (exposed mineral crystals)
          const speckCount = Math.floor(stoneW * stoneH * 0.18)
          for (let i = 0; i < speckCount; i++) {
            const px = cx + Math.floor(rand() * stoneW)
            const py = row.y + Math.floor(rand() * stoneH)
            const bright = rand() > 0.4
            ctx.globalAlpha = bright ? 0.1 : 0.08
            ctx.fillStyle = bright ? '#b8b6ba' : '#6a686c'
            ctx.fillRect(px, py, 1, 1)
          }

          // --- Subtle directional grain (sawn granite has faint linear texture) ---
          // 1-2 very faint horizontal streaks per stone
          for (let g = 0; g < 2; g++) {
            const gy = row.y + 1 + Math.floor(rand() * (stoneH - 2))
            const gx = cx + 1 + Math.floor(rand() * (stoneW - 4))
            const gLen = 2 + Math.floor(rand() * 3)
            ctx.globalAlpha = 0.06
            ctx.fillStyle = rand() > 0.5 ? '#a0a0a8' : '#787680'
            ctx.fillRect(gx, gy, gLen, 1)
          }

          // --- Mica glints (very occasional bright pixel = feldspar/mica reflection) ---
          if (rand() > 0.55) {
            const mx = cx + 1 + Math.floor(rand() * (stoneW - 2))
            const my = row.y + 1 + Math.floor(rand() * (stoneH - 2))
            ctx.globalAlpha = 0.25
            ctx.fillStyle = '#d8d6dc'
            ctx.fillRect(mx, my, 1, 1)
          }
          if (rand() > 0.7) {
            const mx = cx + 1 + Math.floor(rand() * (stoneW - 2))
            const my = row.y + 1 + Math.floor(rand() * (stoneH - 2))
            ctx.globalAlpha = 0.18
            ctx.fillStyle = '#e0dce0'
            ctx.fillRect(mx, my, 1, 1)
          }

          // --- Subtle sawn-edge highlight (top edge catches light) ---
          ctx.globalAlpha = 0.08
          ctx.fillStyle = '#c0bec4'
          ctx.fillRect(cx, row.y, stoneW, 1)

          // --- Subtle shadow on bottom edge ---
          ctx.globalAlpha = 0.06
          ctx.fillStyle = '#505058'
          ctx.fillRect(cx, row.y + stoneH - 1, stoneW, 1)

          cx += colW
        }
      }

      // --- Explicit precise joint lines (dark, narrow, clean = sawn stone hallmark) ---
      ctx.globalAlpha = 0.4
      ctx.strokeStyle = '#3e3a36'
      ctx.lineWidth = 0.7

      // Horizontal joints between rows
      ctx.beginPath()
      ctx.moveTo(0, 8.5);  ctx.lineTo(32, 8.5)
      ctx.moveTo(0, 15.5); ctx.lineTo(32, 15.5)
      ctx.moveTo(0, 25.5); ctx.lineTo(32, 25.5)
      ctx.stroke()

      // Vertical joints per row (different column widths per row)
      ctx.beginPath()
      // Row 0 (y:0-8): cols [10, 12, 10]
      ctx.moveTo(9.5, 0);  ctx.lineTo(9.5, 8)
      ctx.moveTo(21.5, 0); ctx.lineTo(21.5, 8)
      // Row 1 (y:9-15): cols [7, 8, 9, 8]
      ctx.moveTo(6.5, 9);  ctx.lineTo(6.5, 15)
      ctx.moveTo(14.5, 9); ctx.lineTo(14.5, 15)
      ctx.moveTo(23.5, 9); ctx.lineTo(23.5, 15)
      // Row 2 (y:16-25): cols [15, 16]
      ctx.moveTo(14.5, 16); ctx.lineTo(14.5, 25)
      // Row 3 (y:26-32): cols [9, 7, 8, 8]
      ctx.moveTo(8.5, 26);  ctx.lineTo(8.5, 32)
      ctx.moveTo(15.5, 26); ctx.lineTo(15.5, 32)
      ctx.moveTo(23.5, 26); ctx.lineTo(23.5, 32)
      ctx.stroke()

      // --- Joint sand fill highlight (very faint lighter line next to dark joint) ---
      ctx.globalAlpha = 0.06
      ctx.strokeStyle = '#a09e98'
      ctx.lineWidth = 0.3
      ctx.beginPath()
      ctx.moveTo(0, 9.2);  ctx.lineTo(32, 9.2)
      ctx.moveTo(0, 16.2); ctx.lineTo(32, 16.2)
      ctx.moveTo(0, 26.2); ctx.lineTo(32, 26.2)
      ctx.stroke()

      ctx.globalAlpha = 1
    })
  }
  return _naturalStone
}

export function getNaturalStonePattern(): HTMLCanvasElement {
  if (!_naturalStoneWalkway) {
    _naturalStoneWalkway = createPattern(96, 96, (ctx) => {
      type Point = [number, number]

      let seed = 211
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }

      const drawPolygon = (points: Point[]) => {
        ctx.beginPath()
        points.forEach(([px, py], index) => {
          if (index === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.closePath()
      }

      const getCentroid = (points: Point[]): Point => {
        const sum = points.reduce<Point>((acc, [px, py]) => [acc[0] + px, acc[1] + py], [0, 0])
        return [sum[0] / points.length, sum[1] / points.length]
      }

      const insetPolygon = (points: Point[], inset: number): Point[] => {
        const [cx, cy] = getCentroid(points)
        return points.map(([px, py]) => {
          const dx = cx - px
          const dy = cy - py
          const len = Math.hypot(dx, dy) || 1
          return [px + (dx / len) * inset, py + (dy / len) * inset]
        })
      }

      const getBounds = (points: Point[]) => {
        const xs = points.map(([px]) => px)
        const ys = points.map(([, py]) => py)
        return {
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
        }
      }

      const stones: Point[][] = [
        [[0, 0], [28, 0], [32, 14], [18, 28], [0, 24]],
        [[28, 0], [58, 0], [66, 16], [50, 30], [32, 14]],
        [[58, 0], [96, 0], [96, 22], [80, 32], [66, 16]],
        [[0, 24], [18, 28], [24, 46], [12, 64], [0, 60]],
        [[18, 28], [50, 30], [54, 48], [36, 60], [24, 46]],
        [[50, 30], [80, 32], [84, 48], [70, 64], [54, 48]],
        [[80, 32], [96, 22], [96, 58], [84, 48]],
        [[0, 60], [12, 64], [18, 82], [10, 96], [0, 96]],
        [[12, 64], [36, 60], [44, 78], [30, 96], [10, 96], [18, 82]],
        [[36, 60], [70, 64], [74, 82], [56, 96], [30, 96], [44, 78]],
        [[70, 64], [96, 58], [96, 96], [56, 96], [74, 82]],
      ]

      const stoneColors = [
        '#9d9a93',
        '#8f8d87',
        '#a7a39d',
        '#96938c',
        '#aaa59f',
        '#8c8a85',
        '#b0aba4',
      ]

      ctx.fillStyle = '#5d5953'
      ctx.fillRect(0, 0, 96, 96)

      for (let i = 0; i < 150; i++) {
        ctx.globalAlpha = rand() > 0.45 ? 0.08 : 0.05
        ctx.fillStyle = rand() > 0.5 ? '#736f68' : '#4e4a45'
        ctx.fillRect(Math.floor(rand() * 96), Math.floor(rand() * 96), 1, 1)
      }

      stones.forEach((stonePoints, index) => {
        const insetPoints = insetPolygon(stonePoints, 1.8 + rand() * 0.5)
        const bounds = getBounds(insetPoints)
        const stoneWidth = Math.max(8, bounds.maxX - bounds.minX)
        const stoneHeight = Math.max(8, bounds.maxY - bounds.minY)
        const baseColor = stoneColors[index % stoneColors.length]

        drawPolygon(insetPoints)
        ctx.globalAlpha = 1
        ctx.fillStyle = baseColor
        ctx.fill()

        ctx.save()
        drawPolygon(insetPoints)
        ctx.clip()

        const gradient = ctx.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
        gradient.addColorStop(0, 'rgba(250,249,245,0.10)')
        gradient.addColorStop(0.52, 'rgba(246,245,240,0.03)')
        gradient.addColorStop(1, 'rgba(82,80,74,0.12)')
        ctx.fillStyle = gradient
        ctx.fillRect(bounds.minX, bounds.minY, stoneWidth, stoneHeight)

        ctx.globalAlpha = 0.05
        ctx.fillStyle = index % 2 === 0 ? '#b5b1aa' : '#7f7d77'
        ctx.fillRect(bounds.minX, bounds.minY, stoneWidth, stoneHeight)

        for (let speck = 0; speck < Math.floor(stoneWidth * stoneHeight * 0.12); speck++) {
          const px = bounds.minX + Math.floor(rand() * stoneWidth)
          const py = bounds.minY + Math.floor(rand() * stoneHeight)
          ctx.globalAlpha = rand() > 0.5 ? 0.08 : 0.06
          ctx.fillStyle = rand() > 0.45 ? '#c9c5be' : '#7a7771'
          ctx.fillRect(px, py, 1, 1)
        }

        for (let streak = 0; streak < 3; streak++) {
          const startX = bounds.minX + 4 + Math.floor(rand() * Math.max(1, stoneWidth - 12))
          const startY = bounds.minY + 4 + Math.floor(rand() * Math.max(1, stoneHeight - 12))
          ctx.globalAlpha = 0.045
          ctx.strokeStyle = rand() > 0.5 ? '#d8d5cf' : '#736f69'
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(startX + 10 + Math.floor(rand() * 8), startY + (rand() > 0.5 ? 2 : -2))
          ctx.lineTo(startX + 18 + Math.floor(rand() * 10), startY + (rand() > 0.5 ? 4 : -4))
          ctx.stroke()
        }

        if (rand() > 0.35) {
          const patchX = bounds.minX + 4 + Math.floor(rand() * Math.max(1, stoneWidth - 14))
          const patchY = bounds.minY + 4 + Math.floor(rand() * Math.max(1, stoneHeight - 14))
          const patchW = 8 + Math.floor(rand() * 9)
          const patchH = 4 + Math.floor(rand() * 7)
          ctx.globalAlpha = 0.05
          ctx.fillStyle = rand() > 0.5 ? '#beb9b2' : '#84817b'
          ctx.fillRect(patchX, patchY, patchW, patchH)
        }

        if (rand() > 0.48) {
          const sparkX = bounds.minX + 3 + Math.floor(rand() * Math.max(1, stoneWidth - 6))
          const sparkY = bounds.minY + 3 + Math.floor(rand() * Math.max(1, stoneHeight - 6))
          ctx.globalAlpha = 0.18
          ctx.fillStyle = '#dedbd5'
          ctx.fillRect(sparkX, sparkY, 1, 1)
        }

        ctx.restore()

        drawPolygon(insetPoints)
        ctx.globalAlpha = 0.16
        ctx.strokeStyle = '#6a665f'
        ctx.lineWidth = 0.9
        ctx.lineJoin = 'round'
        ctx.stroke()

        drawPolygon(insetPoints)
        ctx.globalAlpha = 0.08
        ctx.strokeStyle = '#d4d0c8'
        ctx.lineWidth = 0.55
        ctx.lineJoin = 'round'
        ctx.stroke()

        const highlightEdge = insetPoints.slice(0, 3)
        ctx.globalAlpha = 0.06
        ctx.strokeStyle = '#ebe7df'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        highlightEdge.forEach(([px, py], pointIndex) => {
          if (pointIndex === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()

        const shadowEdge = insetPoints.slice(-3)
        ctx.globalAlpha = 0.08
        ctx.strokeStyle = '#5a5650'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        shadowEdge.forEach(([px, py], pointIndex) => {
          if (pointIndex === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        })
        ctx.stroke()
      })

      ctx.globalAlpha = 0.06
      ctx.strokeStyle = '#9c968f'
      ctx.lineWidth = 0.5
      stones.forEach((stonePoints) => {
        drawPolygon(insetPolygon(stonePoints, 0.9))
        ctx.stroke()
      })

      ctx.globalAlpha = 1
    })
  }
  return _naturalStoneWalkway
}

export function getClinkerPattern(): HTMLCanvasElement {
  if (!_clinker) {
    // Klinker — rectangular red-brown bricks in stretcher bond
    _clinker = createPattern(32, 32, (ctx) => {
      ctx.fillStyle = '#7a5246'
      ctx.fillRect(0, 0, 32, 32)

      const colors = [
        '#9f6e5d', '#8c5a4a', '#a87561', '#945f51',
        '#855447', '#9a6758', '#7f4e41', '#ae7a67',
      ]
      let seed = 59
      const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) / 32768 }

      // Bricks: 10w x 4h with 1px mortar gap, stretcher bond
      const bw = 9, bh = 3, gw = 10, gh = 4
      for (let row = 0; row < 8; row++) {
        const yy = row * gh
        const offset = (row % 2 === 1) ? 5 : 0
        for (let col = -1; col < 4; col++) {
          const xx = col * gw + offset
          const brickColor = colors[Math.floor(rand() * colors.length)]
          ctx.globalAlpha = 1
          ctx.fillStyle = brickColor
          ctx.fillRect(xx, yy, bw, bh)

          ctx.globalAlpha = 0.12
          ctx.fillStyle = '#d9a48e'
          ctx.fillRect(xx + 1, yy, Math.max(1, bw - 2), 1)

          ctx.globalAlpha = 0.14
          ctx.fillStyle = '#5e362d'
          ctx.fillRect(xx + 1, yy + bh - 1, Math.max(1, bw - 2), 1)

          ctx.globalAlpha = 0.10
          ctx.fillStyle = rand() > 0.5 ? '#c78670' : '#6f4338'
          ctx.fillRect(xx + 1, yy + 1, Math.max(1, bw - 2), 1)

          if (rand() > 0.45) {
            ctx.globalAlpha = 0.08
            ctx.fillStyle = '#f0c5ae'
            ctx.fillRect(xx + 2 + Math.floor(rand() * Math.max(1, bw - 4)), yy + 1, 2, 1)
          }
        }
      }
      ctx.globalAlpha = 0.18
      ctx.strokeStyle = '#b68b78'
      ctx.lineWidth = 0.4
      for (let row = 0; row <= 8; row++) {
        ctx.beginPath()
        ctx.moveTo(0, row * gh + 0.1)
        ctx.lineTo(32, row * gh + 0.1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    })
  }
  return _clinker
}


export function getDirtPathPattern(): HTMLCanvasElement {
  if (!_dirtPath) {
    _dirtPath = createPattern(24, 24, (ctx) => {
      // Warm brown earth base
      ctx.fillStyle = '#8B7355'
      ctx.fillRect(0, 0, 24, 24)

      // Irregular earth texture — clumps and variation
      ctx.globalAlpha = 0.12
      ctx.fillStyle = '#6a5540'
      ctx.fillRect(2, 1, 3, 2)
      ctx.fillRect(10, 5, 4, 2)
      ctx.fillRect(18, 3, 3, 3)
      ctx.fillRect(5, 12, 3, 2)
      ctx.fillRect(14, 14, 4, 3)
      ctx.fillRect(0, 19, 3, 2)
      ctx.fillRect(20, 18, 3, 2)
      ctx.fillRect(8, 20, 4, 2)

      // Lighter sandy patches
      ctx.fillStyle = '#a08a6a'
      ctx.globalAlpha = 0.1
      ctx.fillRect(6, 3, 3, 2)
      ctx.fillRect(15, 8, 3, 2)
      ctx.fillRect(1, 15, 2, 2)
      ctx.fillRect(11, 19, 3, 2)
      ctx.fillRect(21, 11, 2, 3)

      // Small pebbles
      ctx.globalAlpha = 0.15
      ctx.fillStyle = '#7a6a55'
      ctx.beginPath()
      ctx.arc(4, 8, 0.8, 0, Math.PI * 2)
      ctx.arc(17, 7, 0.6, 0, Math.PI * 2)
      ctx.arc(9, 16, 0.7, 0, Math.PI * 2)
      ctx.arc(22, 15, 0.5, 0, Math.PI * 2)
      ctx.arc(13, 2, 0.6, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 1
    })
  }
  return _dirtPath
}

export function getGravelPathPattern(): HTMLCanvasElement {
  if (!_gravelPath) {
    _gravelPath = createPattern(24, 24, (ctx) => {
      // Grey-brown gravel base
      ctx.fillStyle = '#9a9080'
      ctx.fillRect(0, 0, 24, 24)

      // Individual gravel stones — many small varied shapes
      const stones = [
        { x: 1, y: 1, w: 3, h: 2, c: '#8a8070' },
        { x: 5, y: 0, w: 2, h: 2, c: '#a09888' },
        { x: 9, y: 1, w: 3, h: 2, c: '#7a7060' },
        { x: 13, y: 0, w: 2, h: 3, c: '#928878' },
        { x: 17, y: 1, w: 3, h: 2, c: '#88806e' },
        { x: 21, y: 0, w: 3, h: 2, c: '#9a9282' },
        { x: 0, y: 4, w: 2, h: 3, c: '#a49c8c' },
        { x: 3, y: 5, w: 3, h: 2, c: '#807868' },
        { x: 7, y: 4, w: 2, h: 2, c: '#968e7e' },
        { x: 11, y: 5, w: 3, h: 2, c: '#847c6c' },
        { x: 15, y: 4, w: 2, h: 3, c: '#a09080' },
        { x: 19, y: 5, w: 3, h: 2, c: '#8a8272' },
        { x: 1, y: 8, w: 3, h: 2, c: '#928a7a' },
        { x: 5, y: 9, w: 2, h: 2, c: '#7e7668' },
        { x: 9, y: 8, w: 3, h: 3, c: '#9c9484' },
        { x: 13, y: 9, w: 2, h: 2, c: '#887e70' },
        { x: 17, y: 8, w: 3, h: 2, c: '#a49a8a' },
        { x: 21, y: 9, w: 2, h: 2, c: '#8a8070' },
        { x: 0, y: 12, w: 2, h: 2, c: '#968a7a' },
        { x: 3, y: 13, w: 3, h: 2, c: '#a09888' },
        { x: 7, y: 12, w: 2, h: 3, c: '#847c6c' },
        { x: 11, y: 13, w: 3, h: 2, c: '#928878' },
        { x: 15, y: 12, w: 2, h: 2, c: '#7a7262' },
        { x: 19, y: 13, w: 3, h: 2, c: '#9a9080' },
        { x: 1, y: 16, w: 2, h: 3, c: '#88806e' },
        { x: 4, y: 17, w: 3, h: 2, c: '#9c9282' },
        { x: 9, y: 16, w: 2, h: 2, c: '#807868' },
        { x: 13, y: 17, w: 3, h: 2, c: '#a49c8c' },
        { x: 17, y: 16, w: 2, h: 3, c: '#8a8272' },
        { x: 21, y: 17, w: 3, h: 2, c: '#928a7a' },
        { x: 0, y: 20, w: 3, h: 2, c: '#968e7e' },
        { x: 5, y: 21, w: 2, h: 2, c: '#7e7668' },
        { x: 9, y: 20, w: 3, h: 2, c: '#a09080' },
        { x: 13, y: 21, w: 2, h: 3, c: '#847a6c' },
        { x: 17, y: 20, w: 3, h: 2, c: '#928878' },
        { x: 21, y: 21, w: 2, h: 2, c: '#9c9484' },
      ]
      for (const s of stones) {
        ctx.globalAlpha = 0.7
        ctx.fillStyle = s.c
        ctx.fillRect(s.x, s.y, s.w, s.h)
      }

      // Dark gaps between stones
      ctx.globalAlpha = 0.2
      ctx.fillStyle = '#5a5040'
      for (let y = 0; y < 24; y += 4) {
        for (let x = 0; x < 24; x += 6) {
          ctx.fillRect(x + 2, y + 2, 1, 1)
        }
      }

      ctx.globalAlpha = 1
    })
  }
  return _gravelPath
}

export function getForestPathPattern(): HTMLCanvasElement {
  if (!_forestPath) {
    _forestPath = createPattern(24, 24, (ctx) => {
      // Dark brown earth
      ctx.fillStyle = '#5a4a38'
      ctx.fillRect(0, 0, 24, 24)

      // Darker damp patches
      ctx.globalAlpha = 0.15
      ctx.fillStyle = '#3a3028'
      ctx.fillRect(3, 2, 5, 3)
      ctx.fillRect(14, 8, 4, 3)
      ctx.fillRect(1, 16, 6, 3)
      ctx.fillRect(18, 19, 4, 3)

      // Leaf litter — small warm/orange spots
      ctx.globalAlpha = 0.12
      ctx.fillStyle = '#8a6a40'
      ctx.fillRect(6, 1, 2, 1)
      ctx.fillRect(19, 4, 2, 1)
      ctx.fillRect(2, 10, 1, 2)
      ctx.fillRect(12, 13, 2, 1)
      ctx.fillRect(21, 14, 1, 2)
      ctx.fillRect(8, 20, 2, 1)
      ctx.fillRect(16, 22, 1, 2)

      // Root/twig hints — thin dark lines
      ctx.globalAlpha = 0.1
      ctx.strokeStyle = '#3a2a1a'
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(2, 7)
      ctx.lineTo(7, 6)
      ctx.moveTo(15, 17)
      ctx.lineTo(20, 16)
      ctx.stroke()

      // Moss patches — subtle green
      ctx.globalAlpha = 0.08
      ctx.fillStyle = '#5a7a4a'
      ctx.fillRect(10, 4, 3, 2)
      ctx.fillRect(0, 22, 3, 2)
      ctx.fillRect(17, 10, 2, 2)

      ctx.globalAlpha = 1
    })
  }
  return _forestPath
}

