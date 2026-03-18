import { useState, useEffect } from 'react'

// ============================================================
// SmartRoads – Texture Patterns (Offscreen Canvas → HTMLImageElement)
// Generated once, cached, reused by all strip components.
// Konva fillPatternImage requires HTMLImageElement, so we convert.
// ============================================================

function canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = canvas.toDataURL()
  })
}

export function createPavingPattern(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 8; c.height = 8
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#c8c0b0'
  ctx.fillRect(0, 0, 8, 8)
  ctx.fillStyle = '#b8b0a0'
  ctx.globalAlpha = 0.4
  ctx.fillRect(0, 0, 4, 4)
  ctx.fillRect(4, 4, 4, 4)
  return c
}

export function createGrassPattern(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 6; c.height = 6
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#7a9a5a'
  ctx.fillRect(0, 0, 6, 6)
  ctx.fillStyle = '#6a8a4a'
  ctx.globalAlpha = 0.3
  ctx.beginPath()
  ctx.arc(2, 2, 0.8, 0, Math.PI * 2)
  ctx.arc(5, 5, 0.8, 0, Math.PI * 2)
  ctx.fill()
  return c
}

export function createAsphaltPattern(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 4; c.height = 4
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(0, 0, 4, 4)
  ctx.fillStyle = '#333333'
  ctx.globalAlpha = 0.15
  ctx.fillRect(0, 0, 2, 2)
  ctx.fillRect(2, 2, 2, 2)
  return c
}

// Singleton cache
let _paving: HTMLCanvasElement | null = null
let _grass: HTMLCanvasElement | null = null
let _asphalt: HTMLCanvasElement | null = null

export function getPavingPattern(): HTMLCanvasElement {
  if (!_paving) _paving = createPavingPattern()
  return _paving
}

export function getGrassPattern(): HTMLCanvasElement {
  if (!_grass) _grass = createGrassPattern()
  return _grass
}

export function getAsphaltPattern(): HTMLCanvasElement {
  if (!_asphalt) _asphalt = createAsphaltPattern()
  return _asphalt
}

// React hooks — return HTMLImageElement for Konva fillPatternImage
export function usePavingPattern(): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => { canvasToImage(getPavingPattern()).then(setImg) }, [])
  return img
}

export function useGrassPattern(): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => { canvasToImage(getGrassPattern()).then(setImg) }, [])
  return img
}

export function useAsphaltPattern(): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => { canvasToImage(getAsphaltPattern()).then(setImg) }, [])
  return img
}
