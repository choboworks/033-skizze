import { getCrossSectionStrips, isLaneOverlayCyclepath } from './layout'
import { getCyclepathStripProps } from './stripProps'
import { getProtectedCyclepathRule } from './rules/stripRules'
import type { StraightRoadState, Strip } from './types'

export interface StraightRoadIssue {
  id: string
  message: string
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

function pushIssue(issues: StraightRoadIssue[], id: string, message: string) {
  if (issues.some((issue) => issue.id === id)) return
  issues.push({ id, message })
}

export function applyCyclepathGeometryConstraints(strips: Strip[]): Strip[] {
  const nextStrips = [...strips]
  const roadwayStrips = getRoadwayStrips(nextStrips)
  const rightmostRoadwayIndex = findRightmostRoadwayIndex(nextStrips)
  if (roadwayStrips.length === 0 || rightmostRoadwayIndex === -1) return nextStrips

  const rightmostRoadway = nextStrips[rightmostRoadwayIndex]

  const laneMarked = nextStrips.find((strip) => strip.type === 'cyclepath' && strip.variant === 'lane-marked')
  if (laneMarked) {
    const requiredRightmostWidth = getSafeWidth(laneMarked) + 2.75
    if (getSafeWidth(rightmostRoadway) < requiredRightmostWidth) {
      nextStrips[rightmostRoadwayIndex] = { ...rightmostRoadway, width: Math.round(requiredRightmostWidth * 100) / 100 }
    }
  }

  const advisory = nextStrips.find((strip) => strip.type === 'cyclepath' && strip.variant === 'advisory')
  if (advisory) {
    const totalRoadwayWidth = sumWidths(getRoadwayStrips(nextStrips))
    const requiredRoadwayWidth = getSafeWidth(advisory) + 4.5
    if (totalRoadwayWidth < requiredRoadwayWidth) {
      const deficit = requiredRoadwayWidth - totalRoadwayWidth
      const updatedRightmost = nextStrips[rightmostRoadwayIndex]
      nextStrips[rightmostRoadwayIndex] = {
        ...updatedRightmost,
        width: Math.round((getSafeWidth(updatedRightmost) + deficit) * 100) / 100,
      }
    }
  }

  return nextStrips
}

export function validateStraightRoadState(state: Pick<StraightRoadState, 'strips' | 'markings' | 'roadClass'>): StraightRoadIssue[] {
  const issues: StraightRoadIssue[] = []
  const roadClass = state.roadClass ?? 'innerorts'
  const baseStrips = getCrossSectionStrips(state.strips)
  const roadwayStrips = getRoadwayStrips(baseStrips)
  const totalRoadwayWidth = sumWidths(roadwayStrips)
  const rightmostRoadway = [...baseStrips].reverse().find(isRoadwayStrip) ?? null
  const hasCenterline = state.markings.some((marking) => marking.type === 'centerline')

  for (const strip of state.strips) {
    if (strip.type === 'cyclepath') {
      const props = getCyclepathStripProps(strip)

      if (strip.variant === 'lane-marked') {
        if (getSafeWidth(strip) < 2.25) {
          pushIssue(issues, `${strip.id}-width`, 'Radfahrstreifen unter 2,25 m. 1,85 m ist nur Mindest- bzw. Bestandsmaß.')
        }
        if (!rightmostRoadway) {
          pushIssue(issues, `${strip.id}-anchor`, 'Radfahrstreifen benötigt eine angrenzende Fahrbahn.')
        } else if (getSafeWidth(rightmostRoadway) < getSafeWidth(strip) + 2.75) {
          pushIssue(issues, `${strip.id}-roadway`, 'Für den Radfahrstreifen bleibt auf der rechten Fahrbahn weniger als 2,75 m Kfz-Breite.')
        }
      }

      if (strip.variant === 'advisory') {
        if (getSafeWidth(strip) < 1.5) {
          pushIssue(issues, `${strip.id}-width`, 'Schutzstreifen unter 1,50 m. Das unterschreitet den aktuellen Neubaustandard.')
        }
        if (roadwayStrips.length === 0) {
          pushIssue(issues, `${strip.id}-anchor`, 'Schutzstreifen benötigt eine Fahrbahn als Trägerfläche.')
        } else {
          if (totalRoadwayWidth < getSafeWidth(strip) + 4.5) {
            pushIssue(issues, `${strip.id}-core`, 'Für den Schutzstreifen ist die Kernfahrbahn unter 4,50 m.')
          }
          if (hasCenterline && totalRoadwayWidth < getSafeWidth(strip) + 5.5) {
            pushIssue(issues, `${strip.id}-centerline`, 'Mit Mittelmarkierung sollte die Kernfahrbahn beim Schutzstreifen mindestens 5,50 m haben.')
          }
        }
      }

      if (strip.variant === 'protected') {
        const rule = getProtectedCyclepathRule(props.pathType, props.protectedPlacement)
        if (getSafeWidth(strip) < rule.defaultWidth) {
          pushIssue(issues, `${strip.id}-width`, `Dieser Radweg liegt unter der Regelbreite von ${rule.defaultWidth.toFixed(2)} m.`)
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
              pushIssue(issues, `${strip.id}-roadway-gap`, `Zum baulichen Radweg fehlen ${requiredRoadwayGap.toFixed(2)} m Trennraum zur Fahrbahn.`)
            }
          }

          const nearestParking = getClosestBaseStrip(baseStrips, baseIndex, (candidate) => candidate.type === 'parking')
          if (nearestParking) {
            const requiredParkingGap = nearestParking.strip.variant === 'parallel' ? 0.75 : 1.1
            if (nearestParking.separationWidth < requiredParkingGap) {
              pushIssue(issues, `${strip.id}-parking-gap`, `Zum Parken fehlen ${requiredParkingGap.toFixed(2)} m Sicherheitstrennstreifen.`)
            }
          }
        }
      }
    }

    if (strip.type === 'sidewalk') {
      if (strip.variant === 'shared-bike' && getSafeWidth(strip) < 2.5) {
        pushIssue(issues, `${strip.id}-shared-width`, 'Gemeinsamer Geh-/Radweg unter 2,50 m. Das ist innerorts unter Regelbreite.')
      }
      if (strip.variant === 'separated-bike' && getSafeWidth(strip) < 4.5) {
        pushIssue(issues, `${strip.id}-separated-width`, 'Getrennter Geh-/Radweg unter 4,50 m Gesamtbreite (2,00 m Radteil + 2,50 m Gehteil).')
      }
    }
  }

  if (rightmostRoadway) {
    const rightmostRoadwayIndex = baseStrips.findIndex((strip) => strip.id === rightmostRoadway.id)
    const rightSideParking = scanBaseDirection(baseStrips, rightmostRoadwayIndex, 1, (strip) => strip.type === 'parking')
    const overlayCyclepath = state.strips.find(isLaneOverlayCyclepath) ?? null
    if (overlayCyclepath && rightSideParking && rightSideParking.separationWidth < 0.75) {
      pushIssue(issues, `${overlayCyclepath.id}-parking-gap`, 'Neben ruhendem Verkehr fehlen mindestens 0,75 m Sicherheitstrennstreifen zur Radverkehrsführung.')
    }
  }

  return issues
}
