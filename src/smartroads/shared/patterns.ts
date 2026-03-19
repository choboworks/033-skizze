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

export function getPavingPattern(): HTMLCanvasElement {
  if (!_paving) {
    _paving = createPattern(8, 8, (ctx) => {
      ctx.fillStyle = '#c8c0b0'
      ctx.fillRect(0, 0, 8, 8)
      ctx.fillStyle = '#b8b0a0'
      ctx.globalAlpha = 0.4
      ctx.fillRect(0, 0, 4, 4)
      ctx.fillRect(4, 4, 4, 4)
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
    _asphalt = createPattern(4, 4, (ctx) => {
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(0, 0, 4, 4)
      ctx.fillStyle = '#333333'
      ctx.globalAlpha = 0.15
      ctx.fillRect(0, 0, 2, 2)
      ctx.fillRect(2, 2, 2, 2)
    })
  }
  return _asphalt
}
