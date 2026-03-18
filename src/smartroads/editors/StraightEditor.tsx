import { useState, useCallback } from 'react'
import { EditorShell } from '../shared/EditorShell'
import { ElementPalette } from '../shared/ElementPalette'
import { QuickSettings } from '../shared/QuickSettings'
import { PresetList } from '../shared/PresetList'
import { RoadTopView } from '../rendering/RoadTopView'
import { createStrip, totalWidth } from '../constants'
import type { Strip, Marking, StraightRoadState, StripType, StripVariant, MarkingType, MarkingVariant } from '../types'

// ============================================================
// StraightEditor – Complete editor for straight road segments
//
// Orchestrates: EditorShell + StripEditor + RoadTopView
//             + ElementPalette + QuickSettings + PresetList
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

  // --- Strip operations ---
  const handleStripsUpdate = useCallback((newStrips: Strip[]) => {
    setStrips(newStrips)
  }, [])

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
      x: tw / 2,      // center of road
      y: length / 2,   // middle of road length
      width: tw,        // full road width for crosswalks etc.
    }
    setMarkings(prev => [...prev, newMarking])
  }, [strips, length])

  const handleMarkingMove = useCallback((id: string, x: number, y: number) => {
    setMarkings(prev => prev.map(m => m.id === id ? { ...m, x, y } : m))
  }, [])

  // --- Length ---
  const handleLengthChange = useCallback((newLength: number) => {
    setLength(newLength)
  }, [])

  // --- Presets ---
  const handleLoadPreset = useCallback((state: StraightRoadState) => {
    setStrips(state.strips)
    setMarkings(state.markings)
    setLength(state.length)
  }, [])

  // --- Finish ---
  const handleFinish = () => {
    onFinish({ strips, markings, length })
  }

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
      {/* Top-down view — THE editor, fills all space */}
      <div className="flex-1 min-h-0">
        <RoadTopView
          strips={strips}
          markings={markings}
          length={length}
          onStripsUpdate={handleStripsUpdate}
          onMarkingMove={handleMarkingMove}
          onLengthChange={handleLengthChange}
        />
      </div>
    </div>
  )

  // --- Build quick settings ---
  const quickSettings = (
    <QuickSettings
      strips={strips}
      length={length}
      onUpdateStrips={handleStripsUpdate}
      onUpdateLength={handleLengthChange}
    />
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
