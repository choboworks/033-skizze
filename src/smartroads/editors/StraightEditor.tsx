import { useState, useCallback, useRef, useEffect } from 'react'
import { EditorShell } from '../shared/EditorShell'
import { ElementPalette } from '../shared/ElementPalette'
import { QuickSettings } from '../shared/QuickSettings'
import { STRAIGHT_PRESETS } from '../shared/PresetList'
import { EditorLayerManager } from '../shared/EditorLayerManager'
import { FloatingEditorProperties } from '../shared/FloatingEditorProperties'
import { RoadTopView } from '../rendering/RoadTopView'
import { createStrip, totalWidth, ROAD_CLASS_CONFIG, generateLaneMarkings, normalizeLayerOrder } from '../constants'
import { applyRoadClassWidthToStrips } from '../rules/stripRules'
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

export function StraightEditor({ open, initialState, onFinish, onCancel }: Props) {
  const [strips, setStrips] = useState<Strip[]>(initialState.strips)
  const [markings, setMarkings] = useState<Marking[]>(initialState.markings)
  const [layerOrder, setLayerOrder] = useState<string[]>(
    () => normalizeLayerOrder(initialState.layerOrder, initialState.strips, initialState.markings)
  )
  const [length, setLength] = useState(initialState.length)
  const [roadClass, setRoadClass] = useState<RoadClass>(initialState.roadClass ?? 'innerorts')
  const layerOrderRef = useRef(layerOrder)

  useEffect(() => {
    layerOrderRef.current = layerOrder
  }, [layerOrder])

  // Selection state (shared between canvas + layer manager + floating properties)
  const [selectedStripId, setSelectedStripId] = useState<string | null>(null)
  const [selectedMarkingId, setSelectedMarkingId] = useState<string | null>(null)

  // Floating properties panel
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  const rebuildMarkingsForStrips = useCallback((nextStrips: Strip[], prevMarkings: Marking[], nextRoadClass: RoadClass = roadClass, nextLength: number = length) => {
    const config = ROAD_CLASS_CONFIG[nextRoadClass]
    const nonCenterlines = prevMarkings.filter((m) => m.type !== 'centerline')
    const centerlines = generateLaneMarkings(nextStrips, config.centerlineVariant, config.strokeWidth, nextLength)
    return [...nonCenterlines, ...centerlines]
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
    setStrips(newStrips)
    setMarkings((prev) => {
      const nextMarkings = rebuildMarkingsForStrips(newStrips, prev)
      setLayerOrder(buildStripAnchoredLayerOrder(newStrips, nextMarkings))
      return nextMarkings
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips])

  const handleUpdateStrip = useCallback((id: string, changes: Partial<Strip>) => {
    setStrips((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== id) return s
        const nextHeight = changes.height != null ? Math.min(changes.height, length) : changes.height
        return { ...s, ...changes, ...(changes.height !== undefined ? { height: nextHeight } : {}) }
      })
      setMarkings((current) => {
        const nextMarkings = rebuildMarkingsForStrips(updated, current, roadClass, length)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextMarkings))
        return nextMarkings
      })
      return updated
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass, length])

  const handleDeleteStrip = useCallback((id: string) => {
    setStrips((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      setMarkings((current) => {
        const nextMarkings = rebuildMarkingsForStrips(updated, current)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextMarkings))
        return nextMarkings
      })
      return updated
    })
    if (selectedStripId === id) { setSelectedStripId(null); setPropertiesOpen(false) }
  }, [selectedStripId, buildStripAnchoredLayerOrder, rebuildMarkingsForStrips])

  const handleAddStrip = useCallback((type: StripType, variant: StripVariant, side: 'left' | 'right') => {
    const newStrip = createStrip(type, variant, undefined, roadClass)
    setStrips((prev) => {
      const updated = side === 'left' ? [newStrip, ...prev] : [...prev, newStrip]
      setMarkings((current) => {
        const nextMarkings = rebuildMarkingsForStrips(updated, current)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextMarkings))
        return nextMarkings
      })
      return updated
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass])

  // --- Marking operations ---
  const handleAddMarking = useCallback((type: MarkingType, variant: MarkingVariant) => {
    const tw = totalWidth(strips)
    const newMarking: Marking = {
      id: crypto.randomUUID(),
      type,
      variant,
      x: tw / 2,
      y: length / 2,
      width: tw,
    }
    setMarkings((prev) => {
      const nextMarkings = [...prev, newMarking]
      setLayerOrder(normalizeLayerOrder([...layerOrderRef.current, newMarking.id], strips, nextMarkings))
      return nextMarkings
    })
  }, [strips, length])

  const handleMarkingMove = useCallback((id: string, x: number, y: number) => {
    setMarkings(prev => prev.map(m => m.id === id ? { ...m, x, y } : m))
  }, [])

  const handleDeleteMarking = useCallback((id: string) => {
    setMarkings((prev) => {
      const nextMarkings = prev.filter((marking) => marking.id !== id)
      setLayerOrder(normalizeLayerOrder(
        layerOrderRef.current.filter((layerId) => layerId !== id),
        strips,
        nextMarkings,
      ))
      return nextMarkings
    })
    if (selectedMarkingId === id) { setSelectedMarkingId(null); setPropertiesOpen(false) }
  }, [selectedMarkingId, strips])

  const handleUpdateMarking = useCallback((id: string, changes: Partial<Marking>) => {
    setMarkings(prev => prev.map(m => m.id === id ? { ...m, ...changes } : m))
  }, [])

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
        const nextMarkings = rebuildMarkingsForStrips(updated, current, roadClass, newLength)
        setLayerOrder(buildStripAnchoredLayerOrder(updated, nextMarkings))
        return nextMarkings
      })
      return updated
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, roadClass])

  // --- Road class ---
  const handleRoadClassChange = useCallback((rc: RoadClass) => {
    setRoadClass(rc)
    setStrips((prev) => {
      const nextStrips = applyRoadClassWidthToStrips(prev, rc)
      setMarkings((current) => {
        const nextMarkings = rebuildMarkingsForStrips(nextStrips, current, rc, length)
        setLayerOrder(buildStripAnchoredLayerOrder(nextStrips, nextMarkings))
        return nextMarkings
      })
      return nextStrips
    })
  }, [buildStripAnchoredLayerOrder, rebuildMarkingsForStrips, length])

  // --- Presets ---
  const handleLoadPreset = useCallback((state: StraightRoadState) => {
    setStrips(state.strips)
    setMarkings(state.markings)
    setLayerOrder(normalizeLayerOrder(state.layerOrder, state.strips, state.markings))
    setLength(state.length)
    setRoadClass(state.roadClass ?? 'innerorts')
    setSelectedStripId(null)
    setSelectedMarkingId(null)
    setPropertiesOpen(false)
  }, [])

  const handleReorderLayers = useCallback((nextLayerOrder: string[]) => {
    setLayerOrder(normalizeLayerOrder(nextLayerOrder, strips, markings))
  }, [strips, markings])

  // --- Finish ---
  const handleFinish = () => {
    onFinish({ strips, markings, layerOrder, length, roadClass })
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
          selectedStripId={selectedStripId}
          selectedMarkingId={selectedMarkingId}
          onSelectStrip={setSelectedStripId}
          onSelectMarking={setSelectedMarkingId}
          onStripsUpdate={handleStripsUpdate}
          onMarkingMove={handleMarkingMove}
          onMarkingDelete={handleDeleteMarking}
          onDoubleClickElement={handleOpenProperties}
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
          onUpdateStrip={selectedStripId ? (changes) => handleUpdateStrip(selectedStripId, changes) : undefined}
          onUpdateMarking={selectedMarkingId ? (changes) => handleUpdateMarking(selectedMarkingId, changes) : undefined}
          onClose={() => setPropertiesOpen(false)}
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
      sidebar={sidebar}
      editor={editor}
      quickSettings={quickSettings}
    />
  )
}
