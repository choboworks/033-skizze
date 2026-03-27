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
import { getRoadwayBoundsFromPlacements, getStripPlacements, isLaneOverlayCyclepath } from '../layout'
import { MARKING_RULES } from '../rules/markingRules'
import { applyRoadClassWidthToStrips } from '../rules/stripRules'
import { getCyclepathOverlaySide } from '../stripProps'
import { normalizeStraightRoadState } from '../state'
import { applyCyclepathGeometryConstraints } from '../validation'
import type { Strip, Marking, StraightRoadState, StripType, StripVariant, MarkingType, MarkingVariant, RoadClass } from '../types'

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

function constrainTrafficIslandMarkings(markings: Marking[], strips: Strip[], roadLength: number): Marking[] {
  const roadwayBounds = getRoadwayBoundsFromPlacements(getStripPlacements(strips, roadLength))
  if (!roadwayBounds) return markings

  return markings.map((marking) => {
    if (marking.type !== 'traffic-island') return marking

    const width = Math.max(0.1, Math.min(marking.width ?? 2.5, roadwayBounds.width))
    const clampedX = Math.max(roadwayBounds.minX, Math.min(marking.x, roadwayBounds.maxX - width))

    return {
      ...marking,
      width: roundMeters(width),
      x: roundMeters(clampedX),
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
    const constrainedMarkings = constrainTrafficIslandMarkings(
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
  const layerOrderRef = useRef(layerOrder)
  const suppressedCenterlinesRef = useRef(suppressedCenterlines)

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
    const constrainedMarkings = constrainTrafficIslandMarkings(prevMarkings, nextStrips, nextLength)
    return reconcileCenterlineState(nextStrips, constrainedMarkings, prevSuppressedCenterlines, nextRoadClass, nextLength)
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
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      setLayerOrder(buildStripAnchoredLayerOrder(constrainedStrips, nextState.markings))
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
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(constrained, nextState.markings))
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
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextState.markings))
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
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(constrained, nextState.markings))
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
    const defaultIslandWidth = roadwayBounds ? Math.min(2.50, roadwayBounds.width) : 2.50

    // For traffic islands, spawn centered within the roadway (lane/bus area)
    const islandX = roadwayBounds
      ? roadwayBounds.minX + Math.max(0, roadwayBounds.width - defaultIslandWidth) / 2
      : (tw - defaultIslandWidth) / 2

    const newMarking: Marking = {
      id: crypto.randomUUID(),
      type,
      variant,
      x: isIsland ? islandX : tw / 2,
      y: isIsland ? Math.max(0, (length - 8.0) / 2) : length / 2,
      width: isIsland ? defaultIslandWidth : tw,
      ...(isIsland ? { length: 8.0, surfaceType: 'green', endShape: 'rounded', endTaperLength: 1.0, showCurbBorder: true, showApproachMarking: true, approachLength: 3.0 } : {}),
      ...(strokeWidth ? { strokeWidth } : {}),
    }
    setMarkings((prev) => {
      if (!isIsland) {
        const nextMarkings = [...prev, newMarking]
        setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, newMarking.id], strips, nextMarkings))
        return nextMarkings
      }

      const nextState = rebuildMarkingsForStrips(strips, [...prev, newMarking])
      setSuppressedCenterlines(nextState.suppressedCenterlines)
      setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, newMarking.id], strips, nextState.markings))
      return nextState.markings
    })
  }, [hasTrafficIsland, length, rebuildMarkingsForStrips, roadwayBounds, strips])

  const handleMarkingMove = useCallback((id: string, x: number, y: number) => {
    setMarkings(prev => prev.map(m => m.id === id ? { ...m, x, y } : m))
  }, [])

  const handleDeleteMarking = useCallback((id: string) => {
    setMarkings((prev) => {
      const deleted = prev.find((m) => m.id === id)
      const nextMarkings = prev.filter((marking) => marking.id !== id)

      if (deleted?.type === 'traffic-island') {
        const nextState = rebuildMarkingsForStrips(strips, nextMarkings)
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(normalizeLayerOrder(
          layerOrderRef.current.filter((layerId) => layerId !== id),
          strips,
          nextState.markings,
        ))
        return nextState.markings
      }

      setLayerOrder(normalizeLayerOrder(
        layerOrderRef.current.filter((layerId) => layerId !== id),
        strips,
        nextMarkings,
      ))
      return nextMarkings
    })
    if (selectedMarkingId === id) { setSelectedMarkingId(null); setPropertiesOpen(false) }
  }, [selectedMarkingId, strips, rebuildMarkingsForStrips])

  const handleUpdateMarking = useCallback((id: string, changes: Partial<Marking>) => {
    setMarkings((prev) => constrainTrafficIslandMarkings(
      prev.map((marking) => (marking.id === id ? { ...marking, ...changes } : marking)),
      strips,
      length,
    ))
  }, [length, strips])

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
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(constrained, nextState.markings))
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
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextState.markings))
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
        setSuppressedCenterlines(nextState.suppressedCenterlines)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextState.markings))
        return nextState.markings
      })
      return updated
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass, length])

  // --- Presets ---
  const handleLoadPreset = useCallback((state: StraightRoadState) => {
    const normalized = normalizeStraightRoadState(state, createDefaultStraightRoad())
    const constrainedMarkings = constrainTrafficIslandMarkings(normalized.markings, normalized.strips, normalized.length)
    const nextMarkingState = reconcileCenterlineState(
      normalized.strips,
      constrainedMarkings,
      normalized.suppressedCenterlines ?? [],
      normalized.roadClass ?? 'innerorts',
      normalized.length,
    )
    setStrips(normalized.strips)
    setMarkings(nextMarkingState.markings)
    setSuppressedCenterlines(nextMarkingState.suppressedCenterlines)
    setLayerOrder(normalizeLayerOrder(normalized.layerOrder, normalized.strips, nextMarkingState.markings))
    setLength(normalized.length)
    setRoadClass(normalized.roadClass ?? 'innerorts')
    setSelectedStripId(null)
    setSelectedMarkingId(null)
    setPropertiesOpen(false)
  }, [])

  const handleReorderLayers = useCallback((nextLayerOrder: string[]) => {
    setLayerOrder(normalizeLayerOrder(nextLayerOrder, strips, markings))
  }, [strips, markings])

  const handleReset = useCallback(() => {
    const defaultState = normalizeStraightRoadState(createDefaultStraightRoad(), createDefaultStraightRoad())
    const nextMarkingState = reconcileCenterlineState(
      defaultState.strips,
      defaultState.markings,
      defaultState.suppressedCenterlines ?? [],
      defaultState.roadClass ?? 'innerorts',
      defaultState.length,
    )
    setStrips(defaultState.strips)
    setMarkings(nextMarkingState.markings)
    setSuppressedCenterlines(nextMarkingState.suppressedCenterlines)
    setLayerOrder(normalizeLayerOrder(defaultState.layerOrder, defaultState.strips, nextMarkingState.markings))
    setLength(defaultState.length)
    setRoadClass(defaultState.roadClass ?? 'innerorts')
    setSelectedStripId(null)
    setSelectedMarkingId(null)
    setPropertiesOpen(false)
  }, [])

  // --- Finish ---
  const handleFinish = () => {
    onFinish(normalizeStraightRoadState({ strips, markings, suppressedCenterlines, layerOrder, length, roadClass }, createDefaultStraightRoad()))
  }

  // --- Resolve selected objects for floating properties ---
  const selectedStrip = selectedStripId ? strips.find(s => s.id === selectedStripId) ?? null : null
  const selectedMarking = selectedMarkingId ? markings.find(m => m.id === selectedMarkingId) ?? null : null

  // --- Build sidebar: unified palette with chips ---
  const sidebar = (
    <ElementPalette
      onAddStrip={handleAddStrip}
      onAddMarking={handleAddMarking}
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
