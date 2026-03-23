import type { Strip } from './types'
import { getStripRenderLength, getStripRenderY } from './stripProps'

export interface StripPlacement {
  strip: Strip
  x: number
  y: number
  length: number
  isLaneOverlay: boolean
}

export function isLaneOverlayCyclepath(strip: Strip): boolean {
  return strip.type === 'cyclepath' && (strip.variant === 'advisory' || strip.variant === 'lane-marked')
}

function getSafeStripWidth(strip: Strip): number {
  return Math.max(0.1, Number.isFinite(strip.width) ? strip.width : 0.1)
}

function isRoadwayAnchorStrip(strip: Strip): boolean {
  return strip.type === 'lane' || strip.type === 'bus'
}

export function getCrossSectionStrips(strips: Strip[]): Strip[] {
  const hasRoadwayAnchor = strips.some(isRoadwayAnchorStrip)
  return strips.filter((strip) => !(hasRoadwayAnchor && isLaneOverlayCyclepath(strip)))
}

export function getStripPlacements(strips: Strip[], roadLength: number): StripPlacement[] {
  const placements: StripPlacement[] = []
  const baseStrips = getCrossSectionStrips(strips)
  const basePlacementById = new Map<string, StripPlacement>()

  let xOffset = 0
  for (const strip of baseStrips) {
    const placement: StripPlacement = {
      strip,
      x: xOffset,
      y: getStripRenderY(strip),
      length: getStripRenderLength(strip, roadLength),
      isLaneOverlay: false,
    }
    placements.push(placement)
    basePlacementById.set(strip.id, placement)
    xOffset += getSafeStripWidth(strip)
  }

  const rightmostRoadwayPlacement = [...placements].reverse().find((placement) => isRoadwayAnchorStrip(placement.strip)) ?? null

  for (const strip of strips) {
    if (!isLaneOverlayCyclepath(strip)) continue

    const placement: StripPlacement = {
      strip,
      x: rightmostRoadwayPlacement
        ? rightmostRoadwayPlacement.x + Math.max(0, getSafeStripWidth(rightmostRoadwayPlacement.strip) - getSafeStripWidth(strip))
        : 0,
      y: getStripRenderY(strip),
      length: getStripRenderLength(strip, roadLength),
      isLaneOverlay: Boolean(rightmostRoadwayPlacement),
    }
    placements.push(placement)
    basePlacementById.set(strip.id, placement)
  }

  return strips
    .map((strip) => basePlacementById.get(strip.id))
    .filter((placement): placement is StripPlacement => Boolean(placement))
}
