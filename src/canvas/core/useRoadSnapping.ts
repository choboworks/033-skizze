// src/canvas/roads/useRoadSnapping.ts
import type { Canvas } from 'fabric'

export type UseRoadSnappingOpts = {
  canvasRef: React.RefObject<Canvas | null>
  getStageScaleAbs: () => number
  updateGeom: (
    id: string,
    geom: Partial<{ x: number; y: number; angle: number; scaleX: number; scaleY: number }>
  ) => void
  commitCallbacks?: {
    onCreateChain?: (partIds: string[], name?: string) => void
  }
}

/**
 * Road Snapping - TEMPORÄR DEAKTIVIERT
 * 
 * Wird später wieder aktiviert wenn alle Basis-Features stehen.
 * Für jetzt: Straßen können platziert, skaliert und gedreht werden,
 * aber snappen nicht automatisch aneinander.
 */
export function useRoadSnapping(): void {
  // No-op - Snapping deaktiviert
}