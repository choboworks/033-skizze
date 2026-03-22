import { VALID_SCALES, type ValidScale, type ScaleState } from '@/types'

// DIN A4 printable area in mm (210mm × 297mm with 10mm margins)
export const PRINT_WIDTH_MM = 190
export const PRINT_HEIGHT_MM = 277

// DIN A4 full size in mm
export const PAGE_WIDTH_MM = 210
export const PAGE_HEIGHT_MM = 297

// Convert mm to pixels at 96 DPI (screen)
// 1mm = 96/25.4 px ≈ 3.78px
export const MM_TO_PX = 96 / 25.4
export const PAGE_WIDTH_PX = PAGE_WIDTH_MM * MM_TO_PX
export const PAGE_HEIGHT_PX = PAGE_HEIGHT_MM * MM_TO_PX

/**
 * Calculate the auto-scale based on the bounding box of all objects.
 * Returns the nearest valid scale that is <= the raw calculated scale.
 */
export function calculateAutoScale(
  contentWidthMeters: number,
  contentHeightMeters: number
): ScaleState {
  if (contentWidthMeters <= 0 && contentHeightMeters <= 0) {
    return { currentScale: 200, rawScale: 200, viewport: null }
  }

  // Convert printable area from mm to meters
  const printWidthM = PRINT_WIDTH_MM / 1000
  const printHeightM = PRINT_HEIGHT_MM / 1000

  const scaleX = contentWidthMeters > 0 ? contentWidthMeters / printWidthM : 0
  const scaleY = contentHeightMeters > 0 ? contentHeightMeters / printHeightM : 0
  const rawScale = Math.max(scaleX, scaleY)

  // Find the next valid scale >= rawScale (round up to ensure content fits)
  let currentScale: ValidScale = VALID_SCALES[VALID_SCALES.length - 1]
  for (const s of VALID_SCALES) {
    if (s >= rawScale) {
      currentScale = s
      break
    }
  }

  return { currentScale, rawScale, viewport: null }
}

/**
 * Convert real-world meters into on-screen pixels for a given print scale 1:S.
 * At scale 1:200, 1 meter real = 1000 / 200 = 5mm on paper, which is ~18.9px at 96dpi.
 * In general:
 *   mmOnPaper = (1000 / scale) * meters
 *   pixels = mmOnPaper * MM_TO_PX
 */
export function metersToPixels(meters: number, scale: number): number {
  // At scale 1:S, 1 meter real = (1000/S) mm on paper
  const mmOnPaper = (1000 / scale) * meters
  return mmOnPaper * MM_TO_PX
}

export function pixelsToMeters(pixels: number, scale: number): number {
  const mmOnPaper = pixels / MM_TO_PX
  return mmOnPaper * (scale / 1000)
}
