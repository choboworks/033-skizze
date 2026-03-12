// src/modules/library/roads/inspector/utils.ts
// Helper-Funktionen für InteractiveRoadPreview

import type { SurfaceType } from '../types'

/**
 * Gibt die Farbe für einen Straßenbelag zurück
 * Farben exakt wie im Generator (SurfaceModule.ts Pattern-Hintergründe)
 */
export function getSurfaceColor(type: SurfaceType): string {
  switch (type) {
    case 'asphalt': return '#6b6b6b'  // Generator default
    case 'concrete': return '#9a9a9a'
    case 'cobblestone': return '#8a8a8a'   // Pflaster - rechteckige Steine
    case 'pavement': return '#6b6b6b'      // Kopfstein - runde Steine
    case 'gravel': return '#b8a88a'
    default: return '#6b6b6b'
  }
}

/**
 * Berechnet den Dash-Offset für gestrichelte Linien
 * Exakt wie im Generator: LaneModule.ts addLine()
 */
export function calculateDashOffset(lineLength: number): number {
  const dashCycle = 72  // 24 + 48
  const roadCenter = lineLength / 2
  const idealStrichStart = roadCenter - 12
  const cycleNumber = Math.floor(idealStrichStart / dashCycle)
  const actualStrichStart = cycleNumber * dashCycle
  return actualStrichStart - idealStrichStart
}