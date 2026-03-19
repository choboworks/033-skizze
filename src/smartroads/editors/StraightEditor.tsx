import { useState, useCallback } from 'react'
import { EditorShell } from '../shared/EditorShell'
import { ElementPalette } from '../shared/ElementPalette'
import { QuickSettings } from '../shared/QuickSettings'
import { PresetList } from '../shared/PresetList'
import { EditorLayerManager } from '../shared/EditorLayerManager'
import { FloatingEditorProperties } from '../shared/FloatingEditorProperties'
import { RoadTopView } from '../rendering/RoadTopView'
import { createStrip, totalWidth, ROAD_CLASS_CONFIG, generateLaneMarkings } from '../constants'
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
  const [length, setLength] = useState(initialState.length)
  const [roadClass, setRoadClass] = useState<RoadClass>(initialState.roadClass ?? 'innerorts')

  // Selection state (shared between canvas + layer manager + floating properties)
  const [selectedStripId, setSelectedStripId] = useState<string | null>(null)
  const [selectedMarkingId, setSelectedMarkingId] = useState<string | null>(null)

  // Floating properties panel
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  // --- Strip operations ---
  // When strips change, auto-regenerate centerlines (keep non-centerline markings)
  const handleStripsUpdate = useCallback((newStrips: Strip[]) => {
    setStrips(newStrips)
    setMarkings(prev => {
      const config = ROAD_CLASS_CONFIG[roadClass]
      const nonCenterlines = prev.filter(m => m.type !== 'centerline')
      const newCenterlines = generateLaneMarkings(newStrips, config.centerlineVariant, config.strokeWidth)
      return [...nonCenterlines, ...newCenterlines]
    })
  }, [roadClass])

  const handleUpdateStrip = useCallback((id: string, changes: Partial<Strip>) => {
    setStrips(prev => prev.map(s => s.id === id ? { ...s, ...changes } : s))
  }, [])

  const handleDeleteStrip = useCallback((id: string) => {
    setStrips(prev => prev.filter(s => s.id !== id))
    if (selectedStripId === id) { setSelectedStripId(null); setPropertiesOpen(false) }
  }, [selectedStripId])

  const handleAddStrip = useCallback((type: StripType, variant: StripVariant, side: 'left' | 'right') => {
    const newStrip = createStrip(type, variant)
    if (side === 'left') {
      setStrips(prev => [newStrip, ...prev])
    } else {
      setStrips(prev => [...prev, newStrip])
    }
  }, [])

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
    setMarkings(prev => [...prev, newMarking])
  }, [strips, length])

  const handleMarkingMove = useCallback((id: string, x: number, y: number) => {
    setMarkings(prev => prev.map(m => m.id === id ? { ...m, x, y } : m))
  }, [])

  const handleDeleteMarking = useCallback((id: string) => {
    setMarkings(prev => prev.filter(m => m.id !== id))
    if (selectedMarkingId === id) { setSelectedMarkingId(null); setPropertiesOpen(false) }
  }, [selectedMarkingId])

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
  }, [])

  // --- Road class ---
  const handleRoadClassChange = useCallback((rc: RoadClass) => {
    setRoadClass(rc)
    const config = ROAD_CLASS_CONFIG[rc]
    setMarkings(prev => prev.map(m =>
      m.type === 'centerline'
        ? { ...m, variant: config.centerlineVariant, strokeWidth: config.strokeWidth }
        : m
    ))
  }, [])

  // --- Presets ---
  const handleLoadPreset = useCallback((state: StraightRoadState) => {
    setStrips(state.strips)
    setMarkings(state.markings)
    setLength(state.length)
    setRoadClass(state.roadClass ?? 'innerorts')
    setSelectedStripId(null)
    setSelectedMarkingId(null)
    setPropertiesOpen(false)
  }, [])

  // --- Finish ---
  const handleFinish = () => {
    onFinish({ strips, markings, length, roadClass })
  }

  // --- Resolve selected objects for floating properties ---
  const selectedStrip = selectedStripId ? strips.find(s => s.id === selectedStripId) ?? null : null
  const selectedMarking = selectedMarkingId ? markings.find(m => m.id === selectedMarkingId) ?? null : null

  // --- Build sidebar: palette scrolls, presets pinned at bottom ---
  const sidebar = (
    <>
      <div className="flex-1 overflow-y-auto min-h-0">
        <ElementPalette
          onAddStrip={handleAddStrip}
          onAddMarking={handleAddMarking}
        />
      </div>
      <div className="shrink-0">
        <PresetList onLoadPreset={handleLoadPreset} />
      </div>
    </>
  )

  // --- Build editor center ---
  const editor = (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <RoadTopView
          strips={strips}
          markings={markings}
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

      {/* Floating properties modal */}
      {propertiesOpen && (selectedStrip || selectedMarking) && (
        <FloatingEditorProperties
          strip={selectedStrip}
          marking={selectedMarking}
          onUpdateStrip={selectedStripId ? (changes) => handleUpdateStrip(selectedStripId, changes) : undefined}
          onUpdateMarking={selectedMarkingId ? (changes) => handleUpdateMarking(selectedMarkingId, changes) : undefined}
          onClose={() => setPropertiesOpen(false)}
        />
      )}
    </div>
  )

  // --- Build right sidebar: QuickSettings + LayerManager ---
  const quickSettings = (
    <div className="flex flex-col h-full overflow-y-auto">
      <QuickSettings
        strips={strips}
        length={length}
        roadClass={roadClass}
        onUpdateStrips={handleStripsUpdate}
        onUpdateLength={handleLengthChange}
        onUpdateRoadClass={handleRoadClassChange}
      />
      <EditorLayerManager
        strips={strips}
        markings={markings}
        selectedStripId={selectedStripId}
        selectedMarkingId={selectedMarkingId}
        onSelectStrip={setSelectedStripId}
        onSelectMarking={setSelectedMarkingId}
        onDeleteStrip={handleDeleteStrip}
        onDeleteMarking={handleDeleteMarking}
        onOpenProperties={handleOpenProperties}
        onReorderStrips={handleStripsUpdate}
      />
    </div>
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
