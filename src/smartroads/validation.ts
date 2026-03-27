import { getCrossSectionStrips, getFacingRoadwaySide, getImmediateOuterStrip, getLaneOverlayOccupancyWidth, getLaneOverlaySafetyBufferWidth, getRoadwayBoundsFromPlacements, getStripPlacements, isLaneOverlayCyclepath, normalizeLaneOverlayCyclepaths } from './layout'
import { getCyclepathOverlaySide, getCyclepathStripProps } from './stripProps'
import { getProtectedCyclepathRule } from './rules/stripRules'
import type { StraightRoadState, Strip } from './types'

export interface StraightRoadIssue {
  id: string
  message: string
  severity: 'info' | 'warning' | 'error'
}

function getSafeWidth(strip: Strip): number {
  return Math.max(0.1, Number.isFinite(strip.width) ? strip.width : 0.1)
}

function isRoadwayStrip(strip: Strip): boolean {
  return strip.type === 'lane' || strip.type === 'bus'
}

function getRoadwayStrips(strips: Strip[]): Strip[] {
  return strips.filter(isRoadwayStrip)
}

function sumWidths(strips: Strip[]): number {
  return strips.reduce((sum, strip) => sum + getSafeWidth(strip), 0)
}

function findRightmostRoadwayIndex(strips: Strip[]): number {
  for (let i = strips.length - 1; i >= 0; i--) {
    if (isRoadwayStrip(strips[i])) return i
  }
  return -1
}

function findLeftmostRoadwayIndex(strips: Strip[]): number {
  return strips.findIndex(isRoadwayStrip)
}

function scanBaseDirection(
  baseStrips: Strip[],
  startIndex: number,
  step: -1 | 1,
  predicate: (strip: Strip) => boolean,
): { strip: Strip; separationWidth: number; between: Strip[] } | null {
  let separationWidth = 0
  const between: Strip[] = []

  for (let i = startIndex + step; i >= 0 && i < baseStrips.length; i += step) {
    const current = baseStrips[i]
    if (predicate(current)) {
      return { strip: current, separationWidth, between }
    }
    separationWidth += getSafeWidth(current)
    between.push(current)
  }

  return null
}

function getClosestBaseStrip(
  baseStrips: Strip[],
  startIndex: number,
  predicate: (strip: Strip) => boolean,
): { strip: Strip; separationWidth: number; between: Strip[] } | null {
  const left = scanBaseDirection(baseStrips, startIndex, -1, predicate)
  const right = scanBaseDirection(baseStrips, startIndex, 1, predicate)

  if (!left) return right
  if (!right) return left
  return left.separationWidth <= right.separationWidth ? left : right
}

function pushIssue(
  issues: StraightRoadIssue[],
  id: string,
  message: string,
  severity: StraightRoadIssue['severity'] = 'warning',
) {
  if (issues.some((issue) => issue.id === id)) return
  issues.push({ id, message, severity })
}

function getOverlayAnchorIndex(strips: Strip[], side: 'left' | 'right'): number {
  return side === 'left' ? findLeftmostRoadwayIndex(strips) : findRightmostRoadwayIndex(strips)
}

function getOverlaySideLabel(strip: Strip): string {
  return getCyclepathOverlaySide(strip) === 'left' ? 'links' : 'rechts'
}

export function applyCyclepathGeometryConstraints(strips: Strip[]): Strip[] {
  const nextStrips = normalizeLaneOverlayCyclepaths(strips)
  const baseStrips = getCrossSectionStrips(nextStrips)
  const roadwayStrips = getRoadwayStrips(baseStrips)
  const overlays = nextStrips.filter(isLaneOverlayCyclepath)
  const leftmostRoadwayIndex = findLeftmostRoadwayIndex(nextStrips)
  const rightmostRoadwayIndex = findRightmostRoadwayIndex(nextStrips)

  if (roadwayStrips.length === 0 || leftmostRoadwayIndex === -1 || rightmostRoadwayIndex === -1) {
    return nextStrips
  }

  for (const laneMarked of overlays.filter((strip) => strip.variant === 'lane-marked')) {
    const side = getCyclepathOverlaySide(laneMarked)
    const anchorIndex = getOverlayAnchorIndex(nextStrips, side)
    if (anchorIndex === -1) continue
    const anchor = nextStrips[anchorIndex]
    const requiredAnchorWidth = getLaneOverlayOccupancyWidth(laneMarked, baseStrips) + 2.75

    if (getSafeWidth(anchor) < requiredAnchorWidth) {
      nextStrips[anchorIndex] = {
        ...anchor,
        width: Math.round(requiredAnchorWidth * 100) / 100,
      }
    }
  }

  const advisoryOverlays = overlays.filter((strip) => strip.variant === 'advisory')
  if (advisoryOverlays.length > 0) {
    const totalRoadwayWidth = sumWidths(getRoadwayStrips(getCrossSectionStrips(nextStrips)))
    const requiredRoadwayWidth = 4.5 + advisoryOverlays.reduce(
      (sum, strip) => sum + getLaneOverlayOccupancyWidth(strip, baseStrips),
      0,
    )

    if (totalRoadwayWidth < requiredRoadwayWidth) {
      const deficit = requiredRoadwayWidth - totalRoadwayWidth
      const affectedSides = [...new Set(advisoryOverlays.map((strip) => getCyclepathOverlaySide(strip)))]
      const distributedDeficit = deficit / affectedSides.length

      for (const side of affectedSides) {
        const anchorIndex = getOverlayAnchorIndex(nextStrips, side)
        if (anchorIndex === -1) continue
        const anchor = nextStrips[anchorIndex]
        nextStrips[anchorIndex] = {
          ...anchor,
          width: Math.round((getSafeWidth(anchor) + distributedDeficit) * 100) / 100,
        }
      }
    }
  }

  return nextStrips
}

export function validateStraightRoadState(state: Pick<StraightRoadState, 'strips' | 'markings' | 'roadClass' | 'length'>): StraightRoadIssue[] {
  const issues: StraightRoadIssue[] = []
  const roadClass = state.roadClass ?? 'innerorts'
  const baseStrips = getCrossSectionStrips(state.strips)
  const roadwayStrips = getRoadwayStrips(baseStrips)
  const totalRoadwayWidth = sumWidths(roadwayStrips)
  const rightmostRoadway = [...baseStrips].reverse().find(isRoadwayStrip) ?? null
  const hasCenterline = state.markings.some((marking) => marking.type === 'centerline')
  const advisoryOverlayWidth = state.strips
    .filter((candidate) => candidate.variant === 'advisory' && isLaneOverlayCyclepath(candidate))
    .reduce((sum, candidate) => sum + getLaneOverlayOccupancyWidth(candidate, baseStrips), 0)

  for (const strip of state.strips) {
    if (strip.type === 'cyclepath') {
      const props = getCyclepathStripProps(strip)

      if (strip.variant === 'lane-marked') {
        const side = getCyclepathOverlaySide(strip)
        const sideLabel = getOverlaySideLabel(strip)
        const occupancyWidth = getLaneOverlayOccupancyWidth(strip, baseStrips)
        const anchor = side === 'left' ? roadwayStrips[0] ?? null : rightmostRoadway

        if (getSafeWidth(strip) < 2.25) {
          pushIssue(issues, `${strip.id}-width`, `Radfahrstreifen ${sideLabel} unter 2,25 m. 1,85 m ist nur Mindest- bzw. Bestandsmass.`, 'warning')
        }

        if (!anchor) {
          pushIssue(issues, `${strip.id}-anchor`, 'Radfahrstreifen benoetigt eine angrenzende Fahrbahn.', 'error')
        } else if (getSafeWidth(anchor) < occupancyWidth + 2.75) {
          pushIssue(issues, `${strip.id}-roadway`, `Fuer den Radfahrstreifen ${sideLabel} bleibt weniger als 2,75 m Kfz-Breite.`, 'error')
        }

        const safetyBufferWidth = getLaneOverlaySafetyBufferWidth(strip, baseStrips)
        if (safetyBufferWidth > 0) {
          pushIssue(issues, `${strip.id}-buffer`, `Neben Parken ist beim Radfahrstreifen ${sideLabel} ein Sicherheitstrennstreifen von ${safetyBufferWidth.toFixed(2)} m eingeplant.`, 'info')
        }
      }

      if (strip.variant === 'advisory') {
        const sideLabel = getOverlaySideLabel(strip)
        const safetyBufferWidth = getLaneOverlaySafetyBufferWidth(strip, baseStrips)

        if (getSafeWidth(strip) < 1.5) {
          pushIssue(issues, `${strip.id}-width`, `Schutzstreifen ${sideLabel} unter 1,50 m. Das unterschreitet den aktuellen Neubaustandard.`, 'warning')
        }

        if (roadwayStrips.length === 0) {
          pushIssue(issues, `${strip.id}-anchor`, 'Schutzstreifen benoetigt eine Fahrbahn als Traegerflaeche.', 'error')
        } else {
          if (totalRoadwayWidth < advisoryOverlayWidth + 4.5) {
            pushIssue(issues, `${strip.id}-core`, 'Fuer die Schutzstreifen ist die Kernfahrbahn unter 4,50 m.', 'error')
          }
          if (hasCenterline && totalRoadwayWidth < advisoryOverlayWidth + 5.5) {
            pushIssue(issues, `${strip.id}-centerline`, 'Mit Mittelmarkierung sollte die Kernfahrbahn bei Schutzstreifen mindestens 5,50 m haben.', 'warning')
          }
        }

        if (safetyBufferWidth > 0) {
          pushIssue(issues, `${strip.id}-buffer`, `Neben Parken ist beim Schutzstreifen ${sideLabel} ein Sicherheitstrennstreifen von ${safetyBufferWidth.toFixed(2)} m eingeplant.`, 'info')
        }
      }

      if (strip.variant === 'protected') {
        const rule = getProtectedCyclepathRule(props.pathType, props.protectedPlacement)
        if (getSafeWidth(strip) < rule.defaultWidth) {
          pushIssue(issues, `${strip.id}-width`, `Dieser Radweg liegt unter der Regelbreite von ${rule.defaultWidth.toFixed(2)} m.`, 'warning')
        }

        const baseIndex = baseStrips.findIndex((candidate) => candidate.id === strip.id)
        if (baseIndex >= 0) {
          const nearestRoadway = getClosestBaseStrip(baseStrips, baseIndex, isRoadwayStrip)
          if (nearestRoadway) {
            const hasCurbBetween = nearestRoadway.between.some((candidate) => candidate.type === 'curb')
            const requiredRoadwayGap = roadClass === 'ausserorts'
              ? 1.75
              : hasCurbBetween ? 0.5 : 0.75
            if (nearestRoadway.separationWidth < requiredRoadwayGap) {
              pushIssue(issues, `${strip.id}-roadway-gap`, `Zum baulichen Radweg fehlen ${requiredRoadwayGap.toFixed(2)} m Trennraum zur Fahrbahn.`, 'warning')
            }
          }

          const nearestParking = getClosestBaseStrip(baseStrips, baseIndex, (candidate) => candidate.type === 'parking')
          if (nearestParking) {
            const requiredParkingGap = nearestParking.strip.variant === 'parallel' ? 0.75 : 1.1
            if (nearestParking.separationWidth < requiredParkingGap) {
              pushIssue(issues, `${strip.id}-parking-gap`, `Zum Parken fehlen ${requiredParkingGap.toFixed(2)} m Sicherheitstrennstreifen.`, 'warning')
            }
          }
        }
      }
    }

    if (strip.type === 'sidewalk') {
      if (strip.variant === 'shared-bike' && getSafeWidth(strip) < 2.5) {
        pushIssue(issues, `${strip.id}-shared-width`, 'Gemeinsamer Geh-/Radweg unter 2,50 m. Das ist innerorts unter Regelbreite.', 'warning')
      }
      if (strip.variant === 'separated-bike' && getSafeWidth(strip) < 4.5) {
        pushIssue(issues, `${strip.id}-separated-width`, 'Getrennter Geh-/Radweg unter 4,50 m Gesamtbreite (2,00 m Radteil + 2,50 m Gehteil).', 'warning')
      }
    }

    if (strip.type === 'guardrail' && strip.variant === 'schutzplanke') {
      const facing = getFacingRoadwaySide(strip, baseStrips)
      if (facing === 'both') {
        pushIssue(
          issues,
          `${strip.id}-single-median`,
          'Einfache Schutzplanke schützt nur eine Fahrtrichtung. Für den Mittelstreifen ist eine Doppelschutzplanke oder Betonschutzwand üblich.',
          'info',
        )
      }
    }

  }

  for (const overlayCyclepath of state.strips.filter(isLaneOverlayCyclepath)) {
    const sideLabel = getOverlaySideLabel(overlayCyclepath)
    const adjacentOuter = getImmediateOuterStrip(baseStrips, getCyclepathOverlaySide(overlayCyclepath))
    if (adjacentOuter?.type === 'parking' && getLaneOverlaySafetyBufferWidth(overlayCyclepath, baseStrips) < 0.75) {
      pushIssue(
        issues,
        `${overlayCyclepath.id}-parking-gap`,
        `Neben ruhendem Verkehr fehlen beim ${overlayCyclepath.variant === 'advisory' ? 'Schutzstreifen' : 'Radfahrstreifen'} ${sideLabel} mindestens 0,75 m Sicherheitstrennstreifen.`,
        'warning',
      )
    }
  }

  // Traffic island: check if road is long enough for island + approach markings
  const roadLength = state.length ?? 20
  const roadwayBounds = getRoadwayBoundsFromPlacements(getStripPlacements(state.strips, roadLength))
  const trafficIslands = state.markings.filter((marking) => marking.type === 'traffic-island')
  if (trafficIslands.length > 1) {
    pushIssue(
      issues,
      'traffic-island-multiple',
      'Aktuell ist pro Gerade nur eine Verkehrsinsel vorgesehen. Weitere Inseln entfernen.',
      'warning',
    )
  }

  for (const m of state.markings) {
    if (m.type !== 'traffic-island') continue
    const islandLen = m.length || 8.0
    const showApproach = m.showApproachMarking !== false
    const approachLen = showApproach ? (m.approachLength ?? 3.0) : 0
    const islandY = m.y || 0
    const totalNeeded = islandLen + approachLen * 2
    if (totalNeeded > roadLength) {
      pushIssue(
        issues,
        `${m.id}-road-too-short`,
        showApproach
          ? `Straßenlänge (${roadLength.toFixed(0)} m) zu kurz für Verkehrsinsel mit Zulaufmarkierungen (${totalNeeded.toFixed(1)} m benötigt).`
          : `Straßenlänge (${roadLength.toFixed(0)} m) zu kurz für die Verkehrsinsel (${totalNeeded.toFixed(1)} m benötigt).`,
        'warning',
      )
    }
    if (islandY < approachLen || islandY + islandLen + approachLen > roadLength) {
      pushIssue(
        issues,
        `${m.id}-approach-overflow`,
        showApproach
          ? 'Zulaufmarkierungen der Verkehrsinsel ragen über die Straße hinaus. Straße verlängern oder Insel verschieben.'
          : 'Die Verkehrsinsel ragt über die Straßenlänge hinaus. Straße verlängern oder Insel verschieben.',
        'info',
      )
    }

    if (roadwayBounds && (m.width ?? 2.5) > roadwayBounds.width) {
      pushIssue(
        issues,
        `${m.id}-width`,
        `Die Verkehrsinsel ist breiter als die verfügbare Fahrbahn (${roadwayBounds.width.toFixed(2)} m).`,
        'warning',
      )
    }
  }

  return issues
}
