import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { EditorShell } from '../shared/EditorShell'
import { ElementPalette } from '../shared/ElementPalette'
import { QuickSettings } from '../shared/QuickSettings'
import { STRAIGHT_PRESETS } from '../shared/PresetList'
import { EditorLayerManager } from '../shared/EditorLayerManager'
import { FloatingEditorProperties } from '../shared/FloatingEditorProperties'
import { EditorContextMenu } from '../shared/EditorContextMenu'
import { RoadTopView } from '../rendering/RoadTopView'
import { createDefaultStraightRoad, createStrip, totalWidth, ROAD_CLASS_CONFIG, generateLaneMarkings, normalizeLayerOrder } from '../constants'
import { getRoadwayBoundsFromPlacements, getStripPlacements, isLaneOverlayCyclepath, type RoadwayBounds } from '../layout'
import { MARKING_RULES, TRAFFIC_ISLAND_RULES, getTrafficIslandPresetRule } from '../rules/markingRules'
import { applyRoadClassWidthToStrips } from '../rules/stripRules'
import { getCyclepathOverlaySide } from '../stripProps'
import { normalizeStraightRoadState } from '../state'
import { applyCyclepathGeometryConstraints } from '../validation'
import type { Strip, Marking, StraightRoadState, StripType, StripVariant, MarkingType, MarkingVariant, RoadClass, TrafficIslandPreset, LinkedCrossingType } from '../types'

// ============================================================
// StraightEditor – Complete editor for straight road segments
//
// Layout:
//   Left sidebar:  ElementPalette + PresetList
//   Center:        RoadTopView (canvas)
//   Right sidebar: QuickSettings (collapsible) + EditorLayerManager
//   Floating:      FloatingEditorProperties (opens per gear icon / dblclick)
// ============================================================

interface Props {
  open: boolean
  initialState: StraightRoadState
  onFinish: (state: StraightRoadState) => void
  onCancel: () => void
}

function isCenterlineMarking(marking: Marking): boolean {
  return marking.type === 'centerline'
}

function roundMeters(value: number): number {
  return Math.round(value * 100) / 100
}

function getTrafficIslandLength(marking: Marking): number {
  return Math.max(0.1, marking.length ?? TRAFFIC_ISLAND_RULES.defaultLength)
}

function getCrosswalkLength(marking: Marking): number {
  const rawLength = marking.length ?? MARKING_RULES.crosswalk.defaultLength
  return Math.max(
    MARKING_RULES.crosswalk.minLength,
    Math.min(rawLength, MARKING_RULES.crosswalk.maxLength),
  )
}

function getBikeCrossingLength(marking: Marking): number {
  const rawLength = marking.length ?? MARKING_RULES.bikeCrossing.defaultLength
  return Math.max(
    MARKING_RULES.bikeCrossing.minLength,
    Math.min(rawLength, MARKING_RULES.bikeCrossing.maxLength),
  )
}

function getMarkingLengthForCentering(marking: Marking): number {
  if (marking.type === 'traffic-island') return getTrafficIslandLength(marking)
  if (marking.type === 'crosswalk') return getCrosswalkLength(marking)
  if (marking.type === 'bike-crossing') return getBikeCrossingLength(marking)
  return Math.max(0.1, marking.length ?? 0.1)
}

function getMarkingWidthForCentering(marking: Marking): number {
  return Math.max(0.1, marking.width ?? 0.1)
}

function isRoadwayStrip(strip: Strip): boolean {
  return strip.type === 'lane' || strip.type === 'bus'
}

function findRoadwayEdgeStripIndices(strips: Strip[]): { leftIndex: number; rightIndex: number } | null {
  const leftIndex = strips.findIndex(isRoadwayStrip)
  if (leftIndex === -1) return null

  for (let i = strips.length - 1; i >= 0; i--) {
    if (isRoadwayStrip(strips[i])) {
      return { leftIndex, rightIndex: i }
    }
  }

  return null
}

function ensureMinimumRoadwayPassageForTrafficIslands(
  strips: Strip[],
  markings: Marking[],
  roadLength: number,
): { strips: Strip[]; markings: Marking[] } {
  let nextStrips = strips
  let nextMarkings = markings

  for (let index = 0; index < nextMarkings.length; index++) {
    const marking = nextMarkings[index]
    if (marking.type !== 'traffic-island') continue

    const roadwayBounds = getRoadwayBoundsFromPlacements(getStripPlacements(nextStrips, roadLength))
    if (!roadwayBounds) continue

    const islandWidth = Math.max(0.1, marking.width ?? TRAFFIC_ISLAND_RULES.recommendedWidth)
    const leftClearance = marking.x - roadwayBounds.minX
    const rightClearance = roadwayBounds.maxX - (marking.x + islandWidth)
    const leftDeficit = Math.max(0, TRAFFIC_ISLAND_RULES.minimumPassageWidth - leftClearance)
    const rightDeficit = Math.max(0, TRAFFIC_ISLAND_RULES.minimumPassageWidth - rightClearance)

    if (leftDeficit <= 0 && rightDeficit <= 0) continue

    const edgeIndices = findRoadwayEdgeStripIndices(nextStrips)
    if (!edgeIndices) continue

    const widenedStrips = nextStrips.map((strip, stripIndex) => {
      let nextWidth = strip.width
      if (stripIndex === edgeIndices.leftIndex) nextWidth += leftDeficit
      if (stripIndex === edgeIndices.rightIndex) nextWidth += rightDeficit

      if (nextWidth === strip.width) return strip
      return {
        ...strip,
        width: roundMeters(nextWidth),
      }
    })

    nextStrips = applyCyclepathGeometryConstraints(widenedStrips)
    nextMarkings = nextMarkings.map((candidate, candidateIndex) => (
      candidateIndex === index
        ? {
            ...candidate,
            x: roundMeters(candidate.x + leftDeficit),
            width: roundMeters(islandWidth),
          }
        : candidate
    ))
  }

  return {
    strips: nextStrips,
    markings: nextMarkings,
  }
}

function getTrafficIslandSpawnWidth(
  _preset: TrafficIslandPreset,
  preferredWidth: number,
  roadwayBounds?: RoadwayBounds,
): number {
  void roadwayBounds
  return preferredWidth
}

function isLinkedCrossingMarking(marking: Marking): marking is Marking & { linkedIslandId: string } {
  return (
    (marking.type === 'crosswalk' || marking.type === 'bike-crossing') &&
    typeof marking.linkedIslandId === 'string' &&
    marking.linkedIslandId.trim().length > 0
  )
}

function getLinkedCrossingLength(marking: Marking): number {
  return marking.type === 'bike-crossing' ? getBikeCrossingLength(marking) : getCrosswalkLength(marking)
}

function createTrafficIslandMarking(
  preset: TrafficIslandPreset,
  roadwayBounds: RoadwayBounds | undefined,
  roadLength: number,
  totalRoadWidth: number,
): Marking {
  const rule = getTrafficIslandPresetRule(preset)
  const islandWidth = roundMeters(getTrafficIslandSpawnWidth(preset, rule.width, roadwayBounds))
  const islandLength = roundMeters(rule.length)
  const islandX = roadwayBounds
    ? roadwayBounds.minX + Math.max(0, roadwayBounds.width - islandWidth) / 2
    : Math.max(0, (totalRoadWidth - islandWidth) / 2)
  const islandY = Math.max(0, (roadLength - islandLength) / 2)

  return {
    id: crypto.randomUUID(),
    type: 'traffic-island',
    variant: 'raised-paved',
    x: roundMeters(islandX),
    y: roundMeters(islandY),
    width: islandWidth,
    length: islandLength,
    crossingAidPreset: preset,
    surfaceType: rule.surfaceType,
    curbType: rule.curbType,
    entryTreatment: rule.entryTreatment,
    endShape: rule.endShape,
    endTaperLength: 1.0,
    showCurbBorder: rule.showCurbBorder,
    showApproachMarking: rule.showApproachMarking,
    approachLength: rule.approachLength,
  }
}

function createLinkedCrosswalkMarking(
  island: Marking,
  roadwayBounds: RoadwayBounds | undefined,
  totalRoadWidth: number,
): Marking {
  const crosswalkLength = MARKING_RULES.crosswalk.defaultLength
  const islandLength = getTrafficIslandLength(island)

  return {
    id: crypto.randomUUID(),
    type: 'crosswalk',
    variant: 'default',
    x: roadwayBounds?.minX ?? 0,
    y: roundMeters(island.y + islandLength / 2 - crosswalkLength / 2),
    width: roadwayBounds?.width ?? totalRoadWidth,
    length: crosswalkLength,
    linkedIslandId: island.id,
  }
}

function createLinkedBikeCrossingMarking(
  island: Marking,
  roadwayBounds: RoadwayBounds | undefined,
  totalRoadWidth: number,
): Marking {
  const crossingLength = MARKING_RULES.bikeCrossing.defaultLength
  const islandLength = getTrafficIslandLength(island)

  return {
    id: crypto.randomUUID(),
    type: 'bike-crossing',
    variant: 'default',
    x: roadwayBounds?.minX ?? 0,
    y: roundMeters(island.y + islandLength / 2 - crossingLength / 2),
    width: roadwayBounds?.width ?? totalRoadWidth,
    length: crossingLength,
    linkedIslandId: island.id,
    bikeCrossingSurfaceType: 'cyclepath',
    bikeCrossingBoundaryLineMode: 'solid',
    bikeCrossingBoundaryLineStrokeWidth: MARKING_RULES.lineWidths.otherRoads.schmalstrich,
  }
}

function constrainTrafficIslandMarkings(markings: Marking[], strips: Strip[], roadLength: number): Marking[] {
  const roadwayBounds = getRoadwayBoundsFromPlacements(getStripPlacements(strips, roadLength))
  if (!roadwayBounds) return markings

  return markings.map((marking) => {
    if (marking.type !== 'traffic-island') return marking

    const width = Math.max(0.1, marking.width ?? TRAFFIC_ISLAND_RULES.recommendedWidth)
    const maxX = width <= roadwayBounds.width ? roadwayBounds.maxX - width : roadwayBounds.minX
    const clampedX = Math.max(roadwayBounds.minX, Math.min(marking.x, maxX))

    return {
      ...marking,
      width: roundMeters(width),
      x: roundMeters(clampedX),
    }
  })
}

function synchronizeCrossingAidMarkings(markings: Marking[], strips: Strip[], roadLength: number): Marking[] {
  const constrainedIslands = constrainTrafficIslandMarkings(markings, strips, roadLength)
  const roadwayBounds = getRoadwayBoundsFromPlacements(getStripPlacements(strips, roadLength))
  const islandById = new Map(
    constrainedIslands
      .filter((marking) => marking.type === 'traffic-island')
      .map((marking) => [marking.id, marking]),
  )

  return constrainedIslands.map((marking) => {
    if (marking.type !== 'crosswalk' && marking.type !== 'bike-crossing') {
      return marking
    }

    const normalizedLength = roundMeters(getLinkedCrossingLength(marking))
    if (!isLinkedCrossingMarking(marking)) {
      return {
        ...marking,
        length: normalizedLength,
      }
    }

    const linkedIsland = islandById.get(marking.linkedIslandId)
    if (!linkedIsland || !roadwayBounds) {
      return {
        ...marking,
        length: normalizedLength,
      }
    }

    return {
      ...marking,
      x: roundMeters(roadwayBounds.minX),
      y: roundMeters(
        linkedIsland.y + getTrafficIslandLength(linkedIsland) / 2 - normalizedLength / 2,
      ),
      width: roundMeters(roadwayBounds.width),
      length: normalizedLength,
    }
  })
}

function restoreCenterlines(generatedCenterlines: Marking[], preservedCenterlines: Marking[]): Marking[] {
  return generatedCenterlines.map((generated, index) => {
    const preserved = preservedCenterlines[index]
    if (!preserved) return generated

    return {
      ...generated,
      id: preserved.id,
      y: preserved.y,
      variant: preserved.variant,
      ...(preserved.strokeWidth != null ? { strokeWidth: preserved.strokeWidth } : {}),
      ...(preserved.color ? { color: preserved.color } : {}),
    }
  })
}

function reconcileCenterlineState(
  nextStrips: Strip[],
  visibleMarkings: Marking[],
  suppressedCenterlines: Marking[],
  nextRoadClass: RoadClass,
  nextLength: number,
) {
  const activeCenterlines = visibleMarkings.filter(isCenterlineMarking)
  const nonCenterlines = visibleMarkings.filter((marking) => !isCenterlineMarking(marking))
  const preservedCenterlines = [...activeCenterlines, ...suppressedCenterlines.filter(isCenterlineMarking)]
  const hasTrafficIsland = nonCenterlines.some((marking) => marking.type === 'traffic-island')

  if (hasTrafficIsland) {
    return {
      markings: nonCenterlines,
      suppressedCenterlines: preservedCenterlines,
    }
  }

  const config = ROAD_CLASS_CONFIG[nextRoadClass]
  const generatedCenterlines = generateLaneMarkings(nextStrips, config.centerlineVariant, config.strokeWidth, nextLength)
  return {
    markings: [...nonCenterlines, ...restoreCenterlines(generatedCenterlines, preservedCenterlines)],
    suppressedCenterlines: [] as Marking[],
  }
}

export function StraightEditor({ open, initialState, onFinish, onCancel }: Props) {
  const normalizedInitialState = useMemo(
    () => normalizeStraightRoadState(initialState, createDefaultStraightRoad()),
    [initialState]
  )
  const initialMarkingState = useMemo(() => {
    const constrainedMarkings = synchronizeCrossingAidMarkings(
      normalizedInitialState.markings,
      normalizedInitialState.strips,
      normalizedInitialState.length,
    )
    return reconcileCenterlineState(
      normalizedInitialState.strips,
      constrainedMarkings,
      normalizedInitialState.suppressedCenterlines ?? [],
      normalizedInitialState.roadClass ?? 'innerorts',
      normalizedInitialState.length,
    )
  }, [normalizedInitialState])

  const [strips, setStrips] = useState<Strip[]>(normalizedInitialState.strips)
  const [markings, setMarkings] = useState<Marking[]>(initialMarkingState.markings)
  const [suppressedCenterlines, setSuppressedCenterlines] = useState<Marking[]>(initialMarkingState.suppressedCenterlines)
  const [layerOrder, setLayerOrder] = useState<string[]>(
    () => normalizeLayerOrder(normalizedInitialState.layerOrder, normalizedInitialState.strips, initialMarkingState.markings)
  )
  const [length, setLength] = useState(normalizedInitialState.length)
  const [roadClass, setRoadClass] = useState<RoadClass>(normalizedInitialState.roadClass ?? 'innerorts')
  const stripsRef = useRef(strips)
  const layerOrderRef = useRef(layerOrder)
  const suppressedCenterlinesRef = useRef(suppressedCenterlines)

  useEffect(() => {
    stripsRef.current = strips
  }, [strips])

  useEffect(() => {
    layerOrderRef.current = layerOrder
  }, [layerOrder])

  useEffect(() => {
    suppressedCenterlinesRef.current = suppressedCenterlines
  }, [suppressedCenterlines])

  // Selection state (shared between canvas + layer manager + floating properties)
  const [selectedStripId, setSelectedStripId] = useState<string | null>(null)
  const [selectedMarkingId, setSelectedMarkingId] = useState<string | null>(null)

  // Floating properties panel
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  // Context menu
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; kind: 'strip' | 'marking'; id: string
  } | null>(null)

  const rebuildMarkingsForStrips = useCallback((
    nextStrips: Strip[],
    prevMarkings: Marking[],
    prevSuppressedCenterlines: Marking[] = suppressedCenterlinesRef.current,
    nextRoadClass: RoadClass = roadClass,
    nextLength: number = length,
  ) => {
    const widenedState = ensureMinimumRoadwayPassageForTrafficIslands(nextStrips, prevMarkings, nextLength)
    const constrainedMarkings = synchronizeCrossingAidMarkings(widenedState.markings, widenedState.strips, nextLength)
    const reconciled = reconcileCenterlineState(
      widenedState.strips,
      constrainedMarkings,
      prevSuppressedCenterlines,
      nextRoadClass,
      nextLength,
    )

    return {
      strips: widenedState.strips,
      ...reconciled,
    }
  }, [roadClass, length])

  const buildStripAnchoredLayerOrder = useCallback((nextStrips: Strip[], nextMarkings: Marking[]) => {
    const markingIdSet = new Set(nextMarkings.map((marking) => marking.id))
    const preservedMarkings = layerOrderRef.current.filter((id) => markingIdSet.has(id))
    return normalizeLayerOrder(
      [...nextStrips.map((strip) => strip.id), ...preservedMarkings],
      nextStrips,
      nextMarkings,
    )
  }, [])

  // --- Strip operations ---
  // When strips change, auto-regenerate centerlines (keep non-centerline markings)
  const handleStripsUpdate = useCallback((newStrips: Strip[]) => {
    const constrainedStrips = applyCyclepathGeometryConstraints(newStrips)
    setStrips(constrainedStrips)
    setMarkings((prev) => {
      const nextState = rebuildMarkingsForStrips(constrainedStrips, prev)
      if (nextState.strips !== constrainedStrips) setStrips(nextState.strips)
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
      return nextState.markings
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips])

  const handleUpdateStrip = useCallback((id: string, changes: Partial<Strip>) => {
    setStrips((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== id) return s
        if ('height' in changes) {
          const nextHeight = changes.height != null ? Math.min(changes.height, length) : undefined
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { height: _removed, ...rest } = changes
          return { ...s, ...rest, ...(nextHeight != null ? { height: nextHeight } : {}) }
        }
        return { ...s, ...changes }
      })
      const constrained = applyCyclepathGeometryConstraints(updated)
      setMarkings((current) => {
        const nextState = rebuildMarkingsForStrips(constrained, current, suppressedCenterlinesRef.current, roadClass, length)
        if (nextState.strips !== constrained) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
        return nextState.markings
      })
      return constrained
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass, length])

  const handleDeleteStrip = useCallback((id: string) => {
    setStrips((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      setMarkings((current) => {
        const nextState = rebuildMarkingsForStrips(updated, current)
        if (nextState.strips !== updated) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
        return nextState.markings
      })
      return updated
    })
    if (selectedStripId === id) { setSelectedStripId(null); setPropertiesOpen(false) }
  }, [selectedStripId, buildStripAnchoredLayerOrder, rebuildMarkingsForStrips])

  const handleAddStrip = useCallback((type: StripType, variant: StripVariant, side: 'left' | 'right') => {
    const newStripBase = createStrip(type, variant, undefined, roadClass)
    const newStrip = type === 'cyclepath' && (variant === 'advisory' || variant === 'lane-marked')
      ? {
          ...newStripBase,
          props: {
            ...(newStripBase.props ?? {}),
            overlaySide: side,
          },
        }
      : newStripBase
    setStrips((prev) => {
      const updated = (() => {
        if (type === 'cyclepath' && (variant === 'advisory' || variant === 'lane-marked')) {
          const withoutLaneOverlaysOnSameSide = prev.filter((strip) => {
            if (!isLaneOverlayCyclepath(strip)) return true
            return getCyclepathOverlaySide(strip) !== side
          })
          return [...withoutLaneOverlaysOnSameSide, newStrip]
        }

        return side === 'left' ? [newStrip, ...prev] : [...prev, newStrip]
      })()
      const constrained = applyCyclepathGeometryConstraints(updated)
      setMarkings((current) => {
        const nextState = rebuildMarkingsForStrips(constrained, current)
        if (nextState.strips !== constrained) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
        return nextState.markings
      })
      return constrained
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass])

  const roadwayBounds = useMemo(
    () => getRoadwayBoundsFromPlacements(getStripPlacements(strips, length)),
    [strips, length],
  )
  const roadwayWidth = roadwayBounds?.width
  const hasTrafficIsland = markings.some((marking) => marking.type === 'traffic-island')

  // --- Marking operations ---
  const handleAddMarking = useCallback((type: MarkingType, variant: MarkingVariant) => {
    if (hasTrafficIsland && (type === 'traffic-island' || type === 'centerline')) return

    const tw = totalWidth(strips)
    const strokeWidth = (() => {
      if (type === 'centerline') {
        return variant === 'autobahn-dash' || variant === 'autobahn-warning'
          ? MARKING_RULES.lineWidths.autobahn.schmalstrich
          : MARKING_RULES.lineWidths.otherRoads.schmalstrich
      }
      if (type === 'laneboundary') return MARKING_RULES.lineWidths.otherRoads.schmalstrich
      if (type === 'stopline') return MARKING_RULES.stopline.strokeWidth
      return undefined
    })()
    const isIsland = type === 'traffic-island'
    const crosswalkWidth = roadwayBounds?.width ?? tw
    const crosswalkX = roadwayBounds?.minX ?? 0

    const newMarking: Marking = isIsland
      ? {
          ...createTrafficIslandMarking('free', roadwayBounds, length, tw),
          variant,
        }
      : {
          id: crypto.randomUUID(),
          type,
          variant,
          x: type === 'crosswalk' ? crosswalkX : tw / 2,
          y: length / 2,
          width: type === 'crosswalk' ? crosswalkWidth : tw,
          ...(type === 'crosswalk' ? { length: MARKING_RULES.crosswalk.defaultLength } : {}),
          ...(strokeWidth ? { strokeWidth } : {}),
        }
    setMarkings((prev) => {
      if (!isIsland) {
        const nextMarkings = synchronizeCrossingAidMarkings([...prev, newMarking], strips, length)
        setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, newMarking.id], strips, nextMarkings))
        return nextMarkings
      }

      const nextState = rebuildMarkingsForStrips(stripsRef.current, [...prev, newMarking])
      if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, newMarking.id], nextState.strips, nextState.markings))
      return nextState.markings
    })
  }, [hasTrafficIsland, length, rebuildMarkingsForStrips, roadwayBounds, strips])

  const handleAddCrossingAid = useCallback(() => {
    if (hasTrafficIsland) return

    const tw = totalWidth(strips)
    const island = createTrafficIslandMarking('standard', roadwayBounds, length, tw)

    setMarkings((prev) => {
      const crosswalk = createLinkedCrosswalkMarking(island, roadwayBounds, tw)
      const nextState = rebuildMarkingsForStrips(stripsRef.current, [...prev, island, crosswalk])
      if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, island.id, crosswalk.id], nextState.strips, nextState.markings))
      return nextState.markings
    })
  }, [hasTrafficIsland, length, rebuildMarkingsForStrips, roadwayBounds, strips])

  const handleAddBikeCrossingAid = useCallback(() => {
    if (hasTrafficIsland) return

    const tw = totalWidth(strips)
    const island = createTrafficIslandMarking('bike-crossing', roadwayBounds, length, tw)

    setMarkings((prev) => {
      const bikeCrossing = createLinkedBikeCrossingMarking(island, roadwayBounds, tw)
      const nextState = rebuildMarkingsForStrips(stripsRef.current, [...prev, island, bikeCrossing])
      if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, island.id, bikeCrossing.id], nextState.strips, nextState.markings))
      return nextState.markings
    })
  }, [hasTrafficIsland, length, rebuildMarkingsForStrips, roadwayBounds, strips])

  const handleMarkingMove = useCallback((id: string, x: number, y: number) => {
    setMarkings((prev) => {
      const moved = prev.find((marking) => marking.id === id)
      if (!moved) return prev

      let nextMarkings = prev.map((marking) => (marking.id === id ? { ...marking, x, y } : marking))

      if ((moved.type === 'crosswalk' || moved.type === 'bike-crossing') && moved.linkedIslandId) {
        const crossingCenterY = y + getLinkedCrossingLength({ ...moved, y }) / 2
        nextMarkings = nextMarkings.map((marking) => (
          marking.id === moved.linkedIslandId && marking.type === 'traffic-island'
            ? { ...marking, y: roundMeters(crossingCenterY - getTrafficIslandLength(marking) / 2) }
            : marking
        ))
      }

      if (moved.type === 'traffic-island') {
        const islandCenterY = y + getTrafficIslandLength({ ...moved, y }) / 2
        nextMarkings = nextMarkings.map((marking) => (
          isLinkedCrossingMarking(marking) && marking.linkedIslandId === moved.id
            ? { ...marking, y: roundMeters(islandCenterY - getLinkedCrossingLength(marking) / 2) }
            : marking
        ))

        const nextState = rebuildMarkingsForStrips(stripsRef.current, nextMarkings)
        if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        return nextState.markings
      }

      return synchronizeCrossingAidMarkings(nextMarkings, strips, length)
    })
  }, [length, strips, rebuildMarkingsForStrips])

  const handleDeleteMarking = useCallback((id: string) => {
    setMarkings((prev) => {
      const deleted = prev.find((m) => m.id === id)
      const removedIds = new Set([id])

      if (deleted?.type === 'traffic-island') {
        for (const marking of prev) {
          if (isLinkedCrossingMarking(marking) && marking.linkedIslandId === id) {
            removedIds.add(marking.id)
          }
        }
      }

      const nextMarkings = prev.filter((marking) => !removedIds.has(marking.id))

      if (deleted?.type === 'traffic-island') {
        const nextState = rebuildMarkingsForStrips(stripsRef.current, nextMarkings)
        if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(normalizeLayerOrder(
          layerOrderRef.current.filter((layerId) => !removedIds.has(layerId)),
          nextState.strips,
          nextState.markings,
        ))
        if (selectedMarkingId && removedIds.has(selectedMarkingId)) {
          setSelectedMarkingId(null)
          setPropertiesOpen(false)
        }
        return nextState.markings
      }

      if ((deleted?.type === 'crosswalk' || deleted?.type === 'bike-crossing') && deleted.linkedIslandId) {
        const nextMarkingsWithFreeIsland = nextMarkings.map((marking) => (
          marking.id === deleted.linkedIslandId && marking.type === 'traffic-island'
            ? {
                ...marking,
                crossingAidPreset: 'free' as const,
                entryTreatment: 'none' as const,
                showApproachMarking: false,
              }
            : marking
        ))
        setLayerOrder(normalizeLayerOrder(
          layerOrderRef.current.filter((layerId) => !removedIds.has(layerId)),
          strips,
          nextMarkingsWithFreeIsland,
        ))
        if (selectedMarkingId && removedIds.has(selectedMarkingId)) {
          setSelectedMarkingId(null)
          setPropertiesOpen(false)
        }
        return synchronizeCrossingAidMarkings(nextMarkingsWithFreeIsland, strips, length)
      }

      setLayerOrder(normalizeLayerOrder(
        layerOrderRef.current.filter((layerId) => !removedIds.has(layerId)),
        strips,
        nextMarkings,
      ))
      if (selectedMarkingId && removedIds.has(selectedMarkingId)) {
        setSelectedMarkingId(null)
        setPropertiesOpen(false)
      }
      return synchronizeCrossingAidMarkings(nextMarkings, strips, length)
    })
  }, [selectedMarkingId, strips, rebuildMarkingsForStrips, length])

  const handleUpdateMarking = useCallback((id: string, changes: Partial<Marking>) => {
    setMarkings((prev) => {
      const current = prev.find((marking) => marking.id === id)
      if (!current) return prev

      const normalizedChanges = (() => {
        if (current.type !== 'traffic-island' && current.type !== 'crosswalk') return changes

        const nextChanges: Partial<Marking> = { ...changes }

        if (typeof changes.length === 'number') {
          const currentCenterY = current.y + getMarkingLengthForCentering(current) / 2
          nextChanges.y = roundMeters(currentCenterY - changes.length / 2)
        }

        if (typeof changes.width === 'number') {
          const currentCenterX = current.x + getMarkingWidthForCentering(current) / 2
          nextChanges.x = roundMeters(currentCenterX - changes.width / 2)
        }

        return nextChanges
      })()

      const forwardedBikeCrossingChanges: Partial<Marking> = {}
      if (current.type === 'traffic-island') {
        if ('color' in normalizedChanges) {
          forwardedBikeCrossingChanges.color = normalizedChanges.color
          delete normalizedChanges.color
        }
        if ('bikeCrossingSurfaceType' in normalizedChanges) {
          forwardedBikeCrossingChanges.bikeCrossingSurfaceType = normalizedChanges.bikeCrossingSurfaceType
          delete normalizedChanges.bikeCrossingSurfaceType
        }
        if ('bikeCrossingBoundaryLineMode' in normalizedChanges) {
          forwardedBikeCrossingChanges.bikeCrossingBoundaryLineMode = normalizedChanges.bikeCrossingBoundaryLineMode
          delete normalizedChanges.bikeCrossingBoundaryLineMode
        }
        if ('bikeCrossingBoundaryLineStrokeWidth' in normalizedChanges) {
          forwardedBikeCrossingChanges.bikeCrossingBoundaryLineStrokeWidth = normalizedChanges.bikeCrossingBoundaryLineStrokeWidth
          delete normalizedChanges.bikeCrossingBoundaryLineStrokeWidth
        }
        if ('bikeCrossingBoundaryLineDashLength' in normalizedChanges) {
          forwardedBikeCrossingChanges.bikeCrossingBoundaryLineDashLength = normalizedChanges.bikeCrossingBoundaryLineDashLength
          delete normalizedChanges.bikeCrossingBoundaryLineDashLength
        }
        if ('bikeCrossingBoundaryLineGapLength' in normalizedChanges) {
          forwardedBikeCrossingChanges.bikeCrossingBoundaryLineGapLength = normalizedChanges.bikeCrossingBoundaryLineGapLength
          delete normalizedChanges.bikeCrossingBoundaryLineGapLength
        }
      }

      let nextMarkings = prev.map((marking) => (marking.id === id ? { ...marking, ...normalizedChanges } : marking))

      if (current.type !== 'traffic-island') {
        return synchronizeCrossingAidMarkings(nextMarkings, strips, length)
      }

      const currentLinkedCrossing = prev.find(
        (marking) => isLinkedCrossingMarking(marking) && marking.linkedIslandId === id,
      )
      if (currentLinkedCrossing?.type === 'bike-crossing' && Object.keys(forwardedBikeCrossingChanges).length > 0) {
        nextMarkings = nextMarkings.map((marking) => (
          marking.id === currentLinkedCrossing.id
            ? { ...marking, ...forwardedBikeCrossingChanges }
            : marking
        ))
      }
      const nextIsland = nextMarkings.find((marking) => marking.id === id && marking.type === 'traffic-island')
      if (!nextIsland) {
        return synchronizeCrossingAidMarkings(nextMarkings, strips, length)
      }

      const nextPreset = nextIsland.crossingAidPreset ?? 'free'
      const desiredLinkedCrossingType: LinkedCrossingType | null = nextPreset === 'bike-crossing'
        ? 'bike-crossing'
        : nextPreset !== 'free'
          ? 'crosswalk'
          : null

      if (!currentLinkedCrossing && desiredLinkedCrossingType) {
        const linkedCrossing = desiredLinkedCrossingType === 'bike-crossing'
          ? createLinkedBikeCrossingMarking(nextIsland, roadwayBounds, totalWidth(strips))
          : createLinkedCrosswalkMarking(nextIsland, roadwayBounds, totalWidth(strips))
        nextMarkings = [...nextMarkings, linkedCrossing]
        const nextState = rebuildMarkingsForStrips(stripsRef.current, nextMarkings)
        if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, linkedCrossing.id], nextState.strips, nextState.markings))
        return nextState.markings
      }

      if (currentLinkedCrossing && !desiredLinkedCrossingType) {
        nextMarkings = nextMarkings.filter((marking) => marking.id !== currentLinkedCrossing.id)
        const nextState = rebuildMarkingsForStrips(stripsRef.current, nextMarkings)
        if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(normalizeLayerOrder(
          layerOrderRef.current.filter((layerId) => layerId !== currentLinkedCrossing.id),
          nextState.strips,
          nextState.markings,
        ))
        return nextState.markings
      }

      if (currentLinkedCrossing && desiredLinkedCrossingType && currentLinkedCrossing.type !== desiredLinkedCrossingType) {
        nextMarkings = nextMarkings.filter((marking) => marking.id !== currentLinkedCrossing.id)
        const replacement = desiredLinkedCrossingType === 'bike-crossing'
          ? createLinkedBikeCrossingMarking(nextIsland, roadwayBounds, totalWidth(strips))
          : createLinkedCrosswalkMarking(nextIsland, roadwayBounds, totalWidth(strips))
        nextMarkings = [...nextMarkings, replacement]
        const nextState = rebuildMarkingsForStrips(stripsRef.current, nextMarkings)
        if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(normalizeLayerOrder(
          [...layerOrderRef.current.filter((layerId) => layerId !== currentLinkedCrossing.id), replacement.id],
          nextState.strips,
          nextState.markings,
        ))
        return nextState.markings
      }

      const nextState = rebuildMarkingsForStrips(stripsRef.current, nextMarkings)
      if (nextState.strips !== stripsRef.current) setStrips(nextState.strips)
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      return nextState.markings
    })
  }, [length, roadwayBounds, strips, rebuildMarkingsForStrips])

  // --- Context menu ---
  const handleContextMenu = useCallback((e: React.MouseEvent, kind: 'strip' | 'marking', id: string) => {
    if (kind === 'strip') { setSelectedStripId(id); setSelectedMarkingId(null) }
    else { setSelectedMarkingId(id); setSelectedStripId(null) }
    setContextMenu({ x: e.clientX, y: e.clientY, kind, id })
  }, [])

  const closeContextMenu = useCallback(() => setContextMenu(null), [])

  const handleDuplicateStrip = useCallback((id: string) => {
    setStrips((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx === -1) return prev
      const clone = { ...prev[idx], id: crypto.randomUUID(), props: { ...(prev[idx].props ?? {}) } }
      const updated = [...prev]
      updated.splice(idx + 1, 0, clone)
      const constrained = applyCyclepathGeometryConstraints(updated)
      setMarkings((current) => {
        const nextState = rebuildMarkingsForStrips(constrained, current)
        if (nextState.strips !== constrained) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
        return nextState.markings
      })
      return constrained
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips])

  const handleMoveLayerUp = useCallback((id: string) => {
    const normalized = normalizeLayerOrder(layerOrder, strips, markings)
    const idx = normalized.indexOf(id)
    if (idx === -1 || idx >= normalized.length - 1) return
    const next = [...normalized]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    setLayerOrder(next)
  }, [layerOrder, strips, markings])

  const handleMoveLayerDown = useCallback((id: string) => {
    const normalized = normalizeLayerOrder(layerOrder, strips, markings)
    const idx = normalized.indexOf(id)
    if (idx <= 0) return
    const next = [...normalized]
    ;[next[idx], next[idx - 1]] = [next[idx - 1], next[idx]]
    setLayerOrder(next)
  }, [layerOrder, strips, markings])

  // --- Open properties (gear icon or double-click) ---
  const handleOpenProperties = useCallback((_kind: 'strip' | 'marking', id: string) => {
    if (_kind === 'strip') { setSelectedStripId(id); setSelectedMarkingId(null) }
    else { setSelectedMarkingId(id); setSelectedStripId(null) }
    setPropertiesOpen(true)
  }, [])

  // --- Length ---
  const handleLengthChange = useCallback((newLength: number) => {
    setLength(newLength)
    setStrips((prev) => {
      const updated = prev.map((strip) => (
        strip.height != null && strip.height > newLength
          ? { ...strip, height: newLength }
          : strip
      ))
      setMarkings((current) => {
        const nextState = rebuildMarkingsForStrips(updated, current, suppressedCenterlinesRef.current, roadClass, newLength)
        if (nextState.strips !== updated) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
        return nextState.markings
      })
      return updated
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass])

  const handleRoadClassChange = useCallback((nextRoadClass: RoadClass) => {
    if (nextRoadClass === roadClass) return
    setRoadClass(nextRoadClass)
    setStrips((prev) => {
      const updated = applyCyclepathGeometryConstraints(applyRoadClassWidthToStrips(prev, nextRoadClass))
      setMarkings((current) => {
        const nextState = rebuildMarkingsForStrips(updated, current, suppressedCenterlinesRef.current, nextRoadClass, length)
        if (nextState.strips !== updated) setStrips(nextState.strips)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(nextState.strips, nextState.markings))
        return nextState.markings
      })
      return updated
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass, length])

  // --- Presets ---
  const handleLoadPreset = useCallback((state: StraightRoadState) => {
    const normalized = normalizeStraightRoadState(state, createDefaultStraightRoad())
    const nextState = rebuildMarkingsForStrips(
      normalized.strips,
      normalized.markings,
      normalized.suppressedCenterlines ?? [],
      normalized.roadClass ?? 'innerorts',
      normalized.length,
    )
    setStrips(nextState.strips)
    setMarkings(nextState.markings)
    setSuppressedCenterlines(nextState.suppressedCenterlines)
    setLayerOrder(normalizeLayerOrder(normalized.layerOrder, nextState.strips, nextState.markings))
    setLength(normalized.length)
    setRoadClass(normalized.roadClass ?? 'innerorts')
    setSelectedStripId(null)
    setSelectedMarkingId(null)
    setPropertiesOpen(false)
  }, [rebuildMarkingsForStrips])

  const handleReorderLayers = useCallback((nextLayerOrder: string[]) => {
    setLayerOrder(normalizeLayerOrder(nextLayerOrder, strips, markings))
  }, [strips, markings])

  const handleReset = useCallback(() => {
    const defaultState = normalizeStraightRoadState(createDefaultStraightRoad(), createDefaultStraightRoad())
    const nextState = rebuildMarkingsForStrips(
      defaultState.strips,
      defaultState.markings,
      defaultState.suppressedCenterlines ?? [],
      defaultState.roadClass ?? 'innerorts',
      defaultState.length,
    )
    setStrips(nextState.strips)
    setMarkings(nextState.markings)
    setSuppressedCenterlines(nextState.suppressedCenterlines)
    setLayerOrder(normalizeLayerOrder(defaultState.layerOrder, nextState.strips, nextState.markings))
    setLength(defaultState.length)
    setRoadClass(defaultState.roadClass ?? 'innerorts')
    setSelectedStripId(null)
    setSelectedMarkingId(null)
    setPropertiesOpen(false)
  }, [rebuildMarkingsForStrips])

  // --- Finish ---
  const handleFinish = () => {
    onFinish(normalizeStraightRoadState({ strips, markings, suppressedCenterlines, layerOrder, length, roadClass }, createDefaultStraightRoad()))
  }

  // --- Resolve selected objects for floating properties ---
  const selectedStrip = selectedStripId ? strips.find(s => s.id === selectedStripId) ?? null : null
  const selectedMarking = selectedMarkingId ? markings.find(m => m.id === selectedMarkingId) ?? null : null
  const selectedIslandLinkedCrossing = selectedMarking?.type === 'traffic-island'
    ? markings.find((marking): marking is Marking & { linkedIslandId: string } => (
        isLinkedCrossingMarking(marking) && marking.linkedIslandId === selectedMarking.id
      ))
    : undefined
  const selectedIslandLinkedCrossingType: LinkedCrossingType | undefined =
    selectedIslandLinkedCrossing?.type === 'crosswalk' || selectedIslandLinkedCrossing?.type === 'bike-crossing'
      ? selectedIslandLinkedCrossing.type
      : undefined

  // --- Build sidebar: unified palette with chips ---
  const sidebar = (
    <ElementPalette
      onAddStrip={handleAddStrip}
      onAddMarking={handleAddMarking}
      onAddCrossingAid={handleAddCrossingAid}
      onAddBikeCrossingAid={handleAddBikeCrossingAid}
      onLoadPreset={handleLoadPreset}
      presets={STRAIGHT_PRESETS}
      hasTrafficIsland={hasTrafficIsland}
    />
  )

  // --- Build editor center ---
  const editor = (
    <div className="flex flex-col h-full items-center justify-center">
      {/* Stage Container */}
      <div
        className="flex-1 min-h-0 w-full flex items-center justify-center"
        style={{
          padding: 40,
        }}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: 28,
            background: 'var(--surface)',
            border: '1px solid var(--panel-control-border)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 0 0 1px var(--border-subtle)',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))',
          }}
        >
        <RoadTopView
          strips={strips}
          markings={markings}
          layerOrder={layerOrder}
          length={length}
          roadClass={roadClass}
          selectedStripId={selectedStripId}
          selectedMarkingId={selectedMarkingId}
          onSelectStrip={setSelectedStripId}
          onSelectMarking={setSelectedMarkingId}
          onStripsUpdate={handleStripsUpdate}
          onMarkingMove={handleMarkingMove}
          onMarkingDelete={handleDeleteMarking}
          onDoubleClickElement={handleOpenProperties}
          onContextMenuElement={handleContextMenu}
          onLengthChange={handleLengthChange}
        />
        </div>
      </div>

      {/* Floating properties modal */}
      {propertiesOpen && (selectedStrip || selectedMarking) && (
        <FloatingEditorProperties
          strip={selectedStrip}
          marking={selectedMarking}
          roadLength={length}
          roadClass={roadClass}
          roadwayWidth={roadwayWidth}
          linkedCrossingType={selectedIslandLinkedCrossingType}
          linkedCrossing={selectedIslandLinkedCrossing}
          onUpdateStrip={selectedStripId ? (changes) => handleUpdateStrip(selectedStripId, changes) : undefined}
          onUpdateMarking={selectedMarkingId ? (changes) => handleUpdateMarking(selectedMarkingId, changes) : undefined}
          onClose={() => setPropertiesOpen(false)}
        />
      )}

      {/* Context menu */}
      {contextMenu && (
        <EditorContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetKind={contextMenu.kind}
          onClose={closeContextMenu}
          onProperties={() => {
            handleOpenProperties(contextMenu.kind, contextMenu.id)
          }}
          onDelete={() => {
            if (contextMenu.kind === 'strip') handleDeleteStrip(contextMenu.id)
            else handleDeleteMarking(contextMenu.id)
          }}
          onDuplicate={contextMenu.kind === 'strip' ? () => handleDuplicateStrip(contextMenu.id) : undefined}
          onMoveUp={contextMenu.kind === 'strip' ? () => handleMoveLayerUp(contextMenu.id) : undefined}
          onMoveDown={contextMenu.kind === 'strip' ? () => handleMoveLayerDown(contextMenu.id) : undefined}
        />
      )}
    </div>
  )

  // --- Build right sidebar: two separate panels ---
  const quickSettings = (
    <>
      {/* Quick Settings — elevated panel */}
      <div
        className="shrink-0"
        style={{
          padding: 16,
          borderRadius: 22,
          background: 'var(--panel-control-bg)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.40)',
        }}
      >
        <QuickSettings
          strips={strips}
          markings={markings}
          length={length}
          roadClass={roadClass}
          onUpdateStrips={handleStripsUpdate}
          onUpdateLength={handleLengthChange}
          onUpdateRoadClass={handleRoadClassChange}
        />
      </div>

      {/* Road Structure — base panel */}
      <div
        className="flex-1 min-h-0 overflow-y-auto editor-panel-card"
        style={{
          padding: '14px 16px',
          borderRadius: 20,
          boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
        }}
      >
        <EditorLayerManager
          strips={strips}
          markings={markings}
          layerOrder={layerOrder}
          selectedStripId={selectedStripId}
          selectedMarkingId={selectedMarkingId}
          onSelectStrip={setSelectedStripId}
          onSelectMarking={setSelectedMarkingId}
          onDeleteStrip={handleDeleteStrip}
          onDeleteMarking={handleDeleteMarking}
          onOpenProperties={handleOpenProperties}
          onReorderLayers={handleReorderLayers}
        />
      </div>
    </>
  )

  return (
    <EditorShell
      open={open}
      title="Gerade"
      onFinish={handleFinish}
      onCancel={onCancel}
      onReset={handleReset}
      sidebar={sidebar}
      editor={editor}
      quickSettings={quickSettings}
    />
  )
}

