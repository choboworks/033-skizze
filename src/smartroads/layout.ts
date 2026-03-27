import type { CyclepathSide, Strip } from './types'
import { DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH, getCyclepathOverlaySide, getCyclepathStripProps, getGuardrailStripProps, getStripRenderLength, getStripRenderY } from './stripProps'

export interface StripPlacement {
  strip: Strip
  x: number
  y: number
  length: number
  renderWidth: number
  isLaneOverlay: boolean
  overlaySide?: CyclepathSide
  safetyBufferWidth?: number
  facingSide?: FacingSide
}

export interface RoadwayBounds {
  minX: number
  maxX: number
  width: number
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

function findRoadwayEdgeIndex(baseStrips: Strip[], side: CyclepathSide): number {
  if (side === 'left') {
    return baseStrips.findIndex(isRoadwayAnchorStrip)
  }

  for (let i = baseStrips.length - 1; i >= 0; i--) {
    if (isRoadwayAnchorStrip(baseStrips[i])) return i
  }
  return -1
}

export function getImmediateOuterStrip(baseStrips: Strip[], side: CyclepathSide): Strip | null {
  const roadwayIndex = findRoadwayEdgeIndex(baseStrips, side)
  if (roadwayIndex === -1) return null

  const adjacentIndex = side === 'left' ? roadwayIndex - 1 : roadwayIndex + 1
  return adjacentIndex >= 0 && adjacentIndex < baseStrips.length ? baseStrips[adjacentIndex] : null
}

export type FacingSide = 'left' | 'right' | 'both' | undefined

export function getFacingRoadwaySide(strip: Strip, baseStrips: Strip[]): FacingSide {
  const stripIndex = baseStrips.findIndex((candidate) => candidate.id === strip.id)
  if (stripIndex === -1) return undefined

  let leftFound = false
  let rightFound = false

  for (let i = stripIndex - 1; i >= 0; i--) {
    if (isRoadwayAnchorStrip(baseStrips[i])) { leftFound = true; break }
  }

  for (let i = stripIndex + 1; i < baseStrips.length; i++) {
    if (isRoadwayAnchorStrip(baseStrips[i])) { rightFound = true; break }
  }

  if (leftFound && rightFound) return 'both'
  if (leftFound) return 'left'
  if (rightFound) return 'right'
  return undefined
}

export function getLaneOverlaySafetyBufferWidth(strip: Strip, baseStrips: Strip[]): number {
  if (!isLaneOverlayCyclepath(strip)) return 0

  const side = getCyclepathOverlaySide(strip)
  const adjacentStrip = getImmediateOuterStrip(baseStrips, side)
  if (adjacentStrip?.type !== 'parking') return 0

  const configured = getCyclepathStripProps(strip).safetyBufferWidth
  return Math.max(0, configured ?? DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH)
}

export function getLaneOverlayOccupancyWidth(strip: Strip, baseStrips: Strip[]): number {
  return getSafeStripWidth(strip) + getLaneOverlaySafetyBufferWidth(strip, baseStrips)
}

export function getCyclepathRenderMetrics({
  strip,
  renderWidth,
  overlaySide = 'right',
  safetyBufferWidth = 0,
}: {
  strip: Strip
  renderWidth: number
  overlaySide?: CyclepathSide
  safetyBufferWidth?: number
}) {
  const totalWidth = Math.max(0.1, renderWidth)

  if (strip.variant === 'protected') {
    return {
      totalWidth,
      paintedX: 0,
      paintedWidth: totalWidth,
      laneBoundaryX: 0,
      leftBoundaryX: 0,
      rightBoundaryX: totalWidth,
      centerLineX: totalWidth / 2,
      safetyBufferWidth: 0,
      safetyBufferX: 0,
    }
  }

  const clampedBuffer = Math.max(0, Math.min(safetyBufferWidth, Math.max(0, totalWidth - 0.1)))
  const paintedWidth = Math.max(0.1, totalWidth - clampedBuffer)
  const paintedX = overlaySide === 'left' ? clampedBuffer : 0
  const laneBoundaryX = overlaySide === 'left' ? paintedX + paintedWidth : paintedX
  const safetyBufferX = overlaySide === 'left' ? 0 : paintedX + paintedWidth

  return {
    totalWidth,
    paintedX,
    paintedWidth,
    laneBoundaryX,
    leftBoundaryX: undefined,
    rightBoundaryX: undefined,
    centerLineX: undefined,
    safetyBufferWidth: clampedBuffer,
    safetyBufferX,
  }
}

export function normalizeLaneOverlayCyclepaths(strips: Strip[]): Strip[] {
  const seenSides = new Set<CyclepathSide>()
  const next: Strip[] = []

  for (let i = strips.length - 1; i >= 0; i--) {
    const strip = strips[i]
    if (!isLaneOverlayCyclepath(strip)) {
      next.push(strip)
      continue
    }

    const side = getCyclepathOverlaySide(strip)
    if (seenSides.has(side)) continue
    seenSides.add(side)
    next.push(strip)
  }

  return next.reverse()
}

export function getCrossSectionStrips(strips: Strip[]): Strip[] {
  const normalized = normalizeLaneOverlayCyclepaths(strips)
  const hasRoadwayAnchor = normalized.some(isRoadwayAnchorStrip)
  return normalized.filter((strip) => !(hasRoadwayAnchor && isLaneOverlayCyclepath(strip)))
}

export function getStripPlacements(strips: Strip[], roadLength: number): StripPlacement[] {
  const placements: StripPlacement[] = []
  const normalizedStrips = normalizeLaneOverlayCyclepaths(strips)
  const baseStrips = getCrossSectionStrips(normalizedStrips)
  const basePlacementById = new Map<string, StripPlacement>()

  let xOffset = 0
  for (const strip of baseStrips) {
    const facing = getFacingRoadwaySide(strip, baseStrips)
    let renderWidth = getSafeStripWidth(strip)

    // Guardrails with context (shoulder/green) need extra width when between two roadways
    if (strip.type === 'guardrail' && facing === 'both') {
      const gProps = getGuardrailStripProps(strip)
      const extraContext = (gProps.showShoulder ? gProps.shoulderWidth : 0) + (gProps.showGreen ? gProps.greenWidth : 0)
      // strip.width already includes 1× context; add another 1× for the second side
      renderWidth += extraContext
    }

    const placement: StripPlacement = {
      strip,
      x: xOffset,
      y: getStripRenderY(strip),
      length: getStripRenderLength(strip, roadLength),
      renderWidth,
      isLaneOverlay: false,
      facingSide: facing,
    }
    placements.push(placement)
    basePlacementById.set(strip.id, placement)
    xOffset += renderWidth
  }

  const leftmostRoadwayPlacement = placements.find((placement) => isRoadwayAnchorStrip(placement.strip)) ?? null
  const rightmostRoadwayPlacement = [...placements].reverse().find((placement) => isRoadwayAnchorStrip(placement.strip)) ?? null

  for (const strip of normalizedStrips) {
    if (!isLaneOverlayCyclepath(strip)) continue

    const overlaySide = getCyclepathOverlaySide(strip)
    const anchorPlacement = overlaySide === 'left' ? leftmostRoadwayPlacement : rightmostRoadwayPlacement
    const safetyBufferWidth = getLaneOverlaySafetyBufferWidth(strip, baseStrips)
    const renderWidth = getLaneOverlayOccupancyWidth(strip, baseStrips)

    const placement: StripPlacement = {
      strip,
      x: anchorPlacement
        ? overlaySide === 'left'
          ? anchorPlacement.x
          : anchorPlacement.x + Math.max(0, anchorPlacement.renderWidth - renderWidth)
        : 0,
      y: getStripRenderY(strip),
      length: getStripRenderLength(strip, roadLength),
      renderWidth,
      isLaneOverlay: Boolean(anchorPlacement),
      overlaySide,
      safetyBufferWidth,
    }
    placements.push(placement)
    basePlacementById.set(strip.id, placement)
  }

  return normalizedStrips
    .map((strip) => basePlacementById.get(strip.id))
    .filter((placement): placement is StripPlacement => Boolean(placement))
}

export function getRoadwayBoundsFromPlacements(placements: StripPlacement[]): RoadwayBounds | undefined {
  const roadwayPlacements = placements.filter((placement) => !placement.isLaneOverlay && isRoadwayAnchorStrip(placement.strip))
  const leftmost = roadwayPlacements[0] ?? null
  const rightmost = roadwayPlacements[roadwayPlacements.length - 1] ?? null
  if (!leftmost || !rightmost) return undefined

  const minX = leftmost.x
  const maxX = rightmost.x + rightmost.renderWidth
  return {
    minX,
    maxX,
    width: maxX - minX,
  }
}
