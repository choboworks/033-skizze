import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store'
import { useKeyboard } from '@/hooks/useKeyboard'
import { DevTestBench } from '@/smartroads/DevTestBench'
import { StraightEditor } from '@/smartroads/editors/StraightEditor'
import { createDefaultStraightRoad, totalWidth } from '@/smartroads/constants'
import { normalizeStraightRoadState } from '@/smartroads/state'
import { TopBar } from '@/components/TopBar/TopBar'
import { Toolbar } from '@/components/Toolbar/Toolbar'
import { SketchCanvas } from '@/components/Canvas/SketchCanvas'
import { RightSidebar } from '@/components/RightSidebar/RightSidebar'
import { FloatingProperties } from '@/components/Inspector/FloatingProperties'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { Toasts } from '@/components/ui/Toast'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, pixelsToMeters } from '@/utils/scale'
import type { StraightRoadState } from '@/smartroads/types'
import type { CanvasObject } from '@/types'

export default function App() {
  const theme = useAppStore((s) => s.theme)
  const roadEditor = useAppStore((s) => s.roadEditor)
  const [devBench, setDevBench] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Ctrl+Shift+D → Toggle DevTestBench
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setDevBench((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useKeyboard()

  // --- SmartRoad Editor handlers ---
  const handleEditorFinish = useCallback((state: StraightRoadState) => {
    const normalizedState = normalizeStraightRoadState(state, createDefaultStraightRoad())
    const store = useAppStore.getState()
    const editorState = JSON.stringify(normalizedState)
    const realWidth = totalWidth(normalizedState.strips)
    const realHeight = normalizedState.length

    let targetId: string | undefined

    if (roadEditor?.roadId === '__new__') {
      const newObj: CanvasObject = {
        id: crypto.randomUUID(),
        type: 'smartroad',
        subtype: 'straight',
        category: 'smartroads',
        layerId: '',
        label: 'Straße',
        x: 0, y: 0,
        xMeters: 0, yMeters: 0,
        width: realWidth,
        height: realHeight,
        rotation: 0,
        strokeColor: 'transparent',
        strokeWidth: 0,
        fillColor: 'transparent',
        opacity: 1,
        visible: true,
        locked: false,
        editorState,
        realWidth,
        realHeight,
      }
      store.addObject(newObj)
      store.select([newObj.id])
      targetId = newObj.id
    } else if (roadEditor?.roadId) {
      store.updateObject(roadEditor.roadId, {
        editorState,
        width: realWidth,
        height: realHeight,
        realWidth,
        realHeight,
      })
      targetId = roadEditor.roadId
    }

    // Recalculate scale and center the affected road
    store.recalculateScale()
    if (targetId) {
      const finalScale = useAppStore.getState().scale.currentScale
      const pgW = pixelsToMeters(PAGE_WIDTH_PX, finalScale)
      const pgH = pixelsToMeters(PAGE_HEIGHT_PX, finalScale)
      store.updateObject(targetId, {
        xMeters: (pgW - realWidth) / 2,
        yMeters: (pgH - realHeight) / 2,
      })
    }

    store.closeRoadEditor()
  }, [roadEditor])

  const handleEditorCancel = useCallback(() => {
    useAppStore.getState().closeRoadEditor()
  }, [])

  // Get initial state for editor
  const getEditorInitialState = (): StraightRoadState => {
    if (roadEditor?.roadId && roadEditor.roadId !== '__new__') {
      const obj = useAppStore.getState().objects[roadEditor.roadId]
      if (obj?.editorState) {
        try { return normalizeStraightRoadState(JSON.parse(obj.editorState), createDefaultStraightRoad()) } catch { /* fallthrough */ }
      }
    }
    return createDefaultStraightRoad()
  }

  if (devBench) {
    return <DevTestBench onClose={() => setDevBench(false)} />
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ background: 'var(--bg)' }}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--bg-gradient)' }} />

      {/* Padded content */}
      <div
        className="relative flex flex-col h-full"
        style={{ padding: 'var(--app-padding)', gap: 'var(--gap)' }}
      >
        <TopBar />

        <div className="flex flex-1 overflow-hidden relative" style={{ gap: 'var(--gap)' }}>
          {/* Left: Toolbar (fixed 92px) */}
          <Toolbar />

          {/* Canvas */}
          <SketchCanvas />

          {/* Right: Sidebar (Ebenen + Library/Metadaten) */}
          <RightSidebar />
        </div>

        <StatusBar />
      </div>

      {/* Floating Properties Modal */}
      <FloatingProperties />

      {/* SmartRoad Editor (opens as overlay) */}
      {roadEditor && (
        <StraightEditor
          key={roadEditor.roadId}
          open={true}
          initialState={getEditorInitialState()}
          onFinish={handleEditorFinish}
          onCancel={handleEditorCancel}
        />
      )}

      {/* Toast Notifications */}
      <Toasts />
    </div>
  )
}
