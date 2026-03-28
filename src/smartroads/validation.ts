import { getCrossSectionStrips, getFacingRoadwaySide, getImmediateOuterStrip, getLaneOverlayOccupancyWidth, getLaneOverlaySafetyBufferWidth, getRoadwayBoundsFromPlacements, getStripPlacements, isLaneOverlayCyclepath, normalizeLaneOverlayCyclepaths } from './layout'
import { getCyclepathOverlaySide, getCyclepathStripProps } from './stripProps'
import { MARKING_RULES, TRAFFIC_ISLAND_RULES } from './rules/markingRules'
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

function isLinkedCrossingMarking(marking: StraightRoadState['markings'][number]): marking is StraightRoadState['markings'][number] & { linkedIslandId: string } {
  return (
    (marking.type === 'crosswalk' || marking.type === 'bike-crossing') &&
    typeof marking.linkedIslandId === 'string' &&
    marking.linkedIslandId.trim().length > 0
  )
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
    const linkedCrossing = state.markings.find(
      (marking) => isLinkedCrossingMarking(marking) && marking.linkedIslandId === m.id,
    )
    const linkedCrosswalk = linkedCrossing?.type === 'crosswalk' ? linkedCrossing : null
    const linkedBikeCrossing = linkedCrossing?.type === 'bike-crossing' ? linkedCrossing : null
    const preset = m.crossingAidPreset ?? (linkedCrossing ? (linkedBikeCrossing ? 'bike-crossing' : 'standard') : 'free')
    const islandWidth = m.width ?? (linkedCrossing ? TRAFFIC_ISLAND_RULES.crossingAidMinWidth : TRAFFIC_ISLAND_RULES.recommendedWidth)
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

    if (roadwayBounds && islandWidth > roadwayBounds.width) {
      pushIssue(
        issues,
        `${m.id}-width`,
        `Die Verkehrsinsel ist breiter als die verfügbare Fahrbahn (${roadwayBounds.width.toFixed(2)} m).`,
        'warning',
      )
    }

    if (m.id === '__legacy-disabled__' && islandWidth < TRAFFIC_ISLAND_RULES.narrowMinWidth) {
      pushIssue(
        issues,
        `${m.id}-too-narrow`,
        `Die Verkehrsinsel ist mit ${(m.width ?? 0).toFixed(2)} m zu schmal für eine belastbare Querungshilfe.`,
        'warning',
      )
    } else if (m.id === '__legacy-disabled__' && islandWidth < TRAFFIC_ISLAND_RULES.trafficIslandMinWidth) {
      pushIssue(
        issues,
        `${m.id}-narrow-exception`,
        `Die Verkehrsinsel ist schmaler als die übliche Regelbreite von ${TRAFFIC_ISLAND_RULES.minWidth.toFixed(2)} m und sollte nur als Engstellenlösung genutzt werden.`,
        'info',
      )
    }

    if (islandWidth < TRAFFIC_ISLAND_RULES.narrowMinWidth) {
      pushIssue(
        issues,
        `${m.id}-too-narrow`,
        `Die Verkehrsinsel liegt mit ${islandWidth.toFixed(2)} m unter dem Engstellenmass von ${TRAFFIC_ISLAND_RULES.narrowMinWidth.toFixed(2)} m.`,
        'warning',
      )
    } else if (islandWidth < TRAFFIC_ISLAND_RULES.trafficIslandMinWidth) {
      pushIssue(
        issues,
        `${m.id}-narrow-exception`,
        `Die Verkehrsinsel liegt unter der Mindestbreite von ${TRAFFIC_ISLAND_RULES.trafficIslandMinWidth.toFixed(2)} m und sollte nur als Engstellenloesung genutzt werden.`,
        'info',
      )
    }

    if (linkedCrossing) {
      if (islandWidth < TRAFFIC_ISLAND_RULES.crossingAidMinWidth) {
        pushIssue(
          issues,
          `${m.id}-below-crossing-min`,
          `Die Querungshilfe liegt unter der Mindestbreite von ${TRAFFIC_ISLAND_RULES.crossingAidMinWidth.toFixed(2)} m fuer Aufstellflaechen an Querungen.`,
          'warning',
        )
      } else if (islandWidth < TRAFFIC_ISLAND_RULES.preferredWidth) {
        pushIssue(
          issues,
          `${m.id}-below-crossing-preferred`,
          `Die Querungshilfe liegt unter der angestrebten Breite von ${TRAFFIC_ISLAND_RULES.preferredWidth.toFixed(2)} m.`,
          'info',
        )
      }
    } else if (islandWidth >= TRAFFIC_ISLAND_RULES.trafficIslandMinWidth && islandWidth < TRAFFIC_ISLAND_RULES.recommendedWidth) {
      pushIssue(
        issues,
        `${m.id}-below-island-recommended`,
        `Die Verkehrsinsel liegt unter der empfohlenen Breite von ${TRAFFIC_ISLAND_RULES.recommendedWidth.toFixed(2)} m.`,
        'info',
      )
    }

    if (roadwayBounds) {
      const leftClearance = m.x - roadwayBounds.minX
      const rightClearance = roadwayBounds.maxX - (m.x + islandWidth)
      if (leftClearance < TRAFFIC_ISLAND_RULES.sideClearance || rightClearance < TRAFFIC_ISLAND_RULES.sideClearance) {
        pushIssue(
          issues,
          `${m.id}-side-clearance`,
          `Seitlich sollten an der Verkehrsinsel mindestens ${TRAFFIC_ISLAND_RULES.sideClearance.toFixed(2)} m Sicherheitsraum je Seite verbleiben.`,
          'warning',
        )
      }

      if (leftClearance < TRAFFIC_ISLAND_RULES.minimumPassageWidth || rightClearance < TRAFFIC_ISLAND_RULES.minimumPassageWidth) {
        pushIssue(
          issues,
          `${m.id}-minimum-passage-width`,
          `Neben der Verkehrsinsel sollten je Seite mindestens ${TRAFFIC_ISLAND_RULES.minimumPassageWidth.toFixed(2)} m Restfahrbahn verbleiben.`,
          'warning',
        )
      } else if (leftClearance < TRAFFIC_ISLAND_RULES.preferredPassageWidth || rightClearance < TRAFFIC_ISLAND_RULES.preferredPassageWidth) {
        pushIssue(
          issues,
          `${m.id}-preferred-passage-width`,
          `Fuer einen komfortablen Vorbeifahrraum sind neben der Verkehrsinsel je Seite ${TRAFFIC_ISLAND_RULES.preferredPassageWidth.toFixed(2)} m Restfahrbahn sinnvoll.`,
          'info',
        )
      }
    }

    if (linkedCrosswalk && preset === 'free') {
      pushIssue(
        issues,
        `${m.id}-linked-free-preset`,
        linkedBikeCrossing
          ? 'Die Verkehrsinsel ist mit einer Furt gekoppelt, steht aber noch auf "Freie Insel".'
          : 'Die Verkehrsinsel ist mit einem FGUE gekoppelt, steht aber noch auf "Freie Insel".',
        'info',
      )
    }

    if (linkedCrosswalk && preset === 'standard' && (m.entryTreatment ?? 'none') === 'none') {
      pushIssue(
        issues,
        `${m.id}-standard-entry-treatment`,
        'Eine Standard-Querungshilfe sollte an den Querungsranden mindestens ein Rund- oder Flachbord vorsehen.',
        'warning',
      )
    }

    if (linkedCrosswalk && preset === 'barrier-free' && m.entryTreatment !== 'separated-0-6') {
      pushIssue(
        issues,
        `${m.id}-barrier-free-entry-treatment`,
        'Die barrierefreie Querungshilfe sollte mit getrennter 0/6-cm-Absenkung ausgefuehrt werden.',
        'warning',
      )
    }

    if (linkedCrossing && (m.surfaceType ?? 'paved') === 'green') {
      pushIssue(
        issues,
        `${m.id}-crossing-green-surface`,
        linkedBikeCrossing
          ? 'Eine Furtquerung sollte als befestigte Aufstellflaeche dargestellt werden, nicht als Gruenflaeche.'
          : 'Eine Querungshilfe sollte als befestigte Aufstellflaeche dargestellt werden, nicht als Gruenflaeche.',
        'warning',
      )
    }
  }

  const lanesByDirection = roadwayStrips.reduce<Record<string, number>>((acc, strip) => {
    const direction = strip.direction ?? 'unknown'
    acc[direction] = (acc[direction] ?? 0) + 1
    return acc
  }, {})

  for (const marking of state.markings) {
    if (marking.type !== 'crosswalk') continue
    const linkedIsland = marking.linkedIslandId
      ? trafficIslands.find((candidate) => candidate.id === marking.linkedIslandId)
      : null

    const crosswalkLength = marking.length ?? MARKING_RULES.crosswalk.defaultLength
    if (crosswalkLength < MARKING_RULES.crosswalk.minLength || crosswalkLength > MARKING_RULES.crosswalk.maxLength) {
      pushIssue(
        issues,
        `${marking.id}-crosswalk-length`,
        `Die Furtbreite des Zebrastreifens sollte zwischen ${MARKING_RULES.crosswalk.minLength.toFixed(2)} m und ${MARKING_RULES.crosswalk.maxLength.toFixed(2)} m liegen.`,
        'warning',
      )
    }

    if (state.roadClass !== 'innerorts') {
      pushIssue(
        issues,
        `${marking.id}-crosswalk-roadclass`,
        'Fußgängerüberwege sind in dieser Darstellung primär für innerörtliche Straßen vorgesehen.',
        marking.linkedIslandId ? 'warning' : 'info',
      )
    }

    if ((lanesByDirection.up ?? 0) > 1 || (lanesByDirection.down ?? 0) > 1) {
      pushIssue(
        issues,
        `${marking.id}-crosswalk-lanes`,
        'Ein Fußgängerüberweg sollte hier nicht mehr als einen Fahrstreifen je Richtung queren.',
        'warning',
      )
    }

    if (marking.linkedIslandId && !linkedIsland) {
      pushIssue(
        issues,
        `${marking.id}-missing-island`,
        'Der gekoppelte FGUE verweist auf keine vorhandene Verkehrsinsel mehr.',
        'warning',
      )
    }
  }

  for (const marking of state.markings) {
    if (marking.type !== 'bike-crossing') continue
    const linkedIsland = marking.linkedIslandId
      ? trafficIslands.find((candidate) => candidate.id === marking.linkedIslandId)
      : null

    const crossingLength = marking.length ?? MARKING_RULES.bikeCrossing.defaultLength
    if (crossingLength < MARKING_RULES.bikeCrossing.minLength || crossingLength > MARKING_RULES.bikeCrossing.maxLength) {
      pushIssue(
        issues,
        `${marking.id}-bike-crossing-length`,
        `Die Furtbreite der Furtquerung sollte zwischen ${MARKING_RULES.bikeCrossing.minLength.toFixed(2)} m und ${MARKING_RULES.bikeCrossing.maxLength.toFixed(2)} m liegen.`,
        'warning',
      )
    }

    if (marking.linkedIslandId && !linkedIsland) {
      pushIssue(
        issues,
        `${marking.id}-bike-crossing-missing-island`,
        'Die gekoppelte Furt verweist auf keine vorhandene Verkehrsinsel mehr.',
        'warning',
      )
    }
  }

  return issues
}
