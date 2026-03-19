import { useState, useCallback } from 'react'
import { useAppStore } from '@/store'
import { PAGE_WIDTH_MM, PAGE_HEIGHT_MM, pixelsToMeters } from '@/utils/scale'
import type Konva from 'konva'

// ============================================================
// useAusschnitt – Hook for the Ausschnitt (print-area) tool
// Handles frame-drag selection on the canvas.
// ============================================================

export interface UseAusschnittResult {
  ausschnittStart: { x: number; y: number } | null
  ausschnittEnd: { x: number; y: number } | null
  handleAusschnittMouseDown: (stage: Konva.Stage, viewport: { x: number; y: number; zoom: number }) => boolean
  handleAusschnittMouseMove: (stage: Konva.Stage, viewport: { x: number; y: number; zoom: number }) => boolean
  handleAusschnittMouseUp: () => boolean
}

export function useAusschnitt(): UseAusschnittResult {
  const [ausschnittStart, setAusschnittStart] = useState<{ x: number; y: number } | null>(null)
  const [ausschnittEnd, setAusschnittEnd] = useState<{ x: number; y: number } | null>(null)

  const handleAusschnittMouseDown = useCallback((
    stage: Konva.Stage,
    viewport: { x: number; y: number; zoom: number },
  ): boolean => {
    if (useAppStore.getState().activeTool !== 'print-area') return false
    // If a frame already exists, don't start a new one — let events pass through
    if (useAppStore.getState().scale.viewport) return false
    const pos = stage.getPointerPosition()
    if (!pos) return false
    const cx = (pos.x - viewport.x) / viewport.zoom
    const cy = (pos.y - viewport.y) / viewport.zoom
    setAusschnittStart({ x: cx, y: cy })
    setAusschnittEnd({ x: cx, y: cy })
    return true
  }, [])

  const handleAusschnittMouseMove = useCallback((
    stage: Konva.Stage,
    viewport: { x: number; y: number; zoom: number },
  ): boolean => {
    if (!ausschnittStart || useAppStore.getState().activeTool !== 'print-area') return false
    const pos = stage.getPointerPosition()
    if (!pos) return false
    const cx = (pos.x - viewport.x) / viewport.zoom
    const cy = (pos.y - viewport.y) / viewport.zoom
    setAusschnittEnd({ x: cx, y: cy })
    return true
  }, [ausschnittStart])

  const handleAusschnittMouseUp = useCallback((): boolean => {
    if (!ausschnittStart || !ausschnittEnd || useAppStore.getState().activeTool !== 'print-area') return false

    const w = Math.abs(ausschnittEnd.x - ausschnittStart.x)
    const h = Math.abs(ausschnittEnd.y - ausschnittStart.y)

    if (w > 5 && h > 5) {
      const x1 = Math.min(ausschnittStart.x, ausschnittEnd.x)
      const y1 = Math.min(ausschnittStart.y, ausschnittEnd.y)
      const state = useAppStore.getState()
      const autoScale = state.scale.currentScale
      const frameWM = pixelsToMeters(w, autoScale)
      const frameHM = pixelsToMeters(h, autoScale)
      const frameCenterXM = pixelsToMeters(x1 + w / 2, autoScale)
      const frameCenterYM = pixelsToMeters(y1 + h / 2, autoScale)

      const scaleX = frameWM / (PAGE_WIDTH_MM / 1000)
      const scaleY = frameHM / (PAGE_HEIGHT_MM / 1000)
      const newScale = Math.max(10, Math.min(5000, Math.ceil(Math.max(scaleX, scaleY))))

      state.setScaleOverride({
        centerX: frameCenterXM, centerY: frameCenterYM, scale: newScale,
        frameX: 10, frameY: 25, frameW: 190, frameH: 257,
      })

      // Auto-switch to select tool after creating the frame
      state.setActiveTool('select')
    }

    setAusschnittStart(null)
    setAusschnittEnd(null)
    return true
  }, [ausschnittStart, ausschnittEnd])

  return {
    ausschnittStart,
    ausschnittEnd,
    handleAusschnittMouseDown,
    handleAusschnittMouseMove,
    handleAusschnittMouseUp,
  }
}
