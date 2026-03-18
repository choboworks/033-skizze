import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store'
import { useKeyboard } from '@/hooks/useKeyboard'
import { DevTestBench } from '@/smartroads/DevTestBench'
import { StraightEditor } from '@/smartroads/editors/StraightEditor'
import { createDefaultStraightRoad, totalWidth } from '@/smartroads/constants'
import { TopBar } from '@/components/TopBar/TopBar'
import { Toolbar } from '@/components/Toolbar/Toolbar'
import { LibrarySidebar } from '@/components/Sidebar/LibrarySidebar'
import { SketchCanvas } from '@/components/Canvas/SketchCanvas'
import { LayerManager } from '@/components/LayerManager/LayerManager'
import { FloatingProperties } from '@/components/Inspector/FloatingProperties'
import { StatusBar } from '@/components/StatusBar/StatusBar'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, metersToPixels } from '@/utils/scale'
import type { StraightRoadState } from '@/smartroads/types'
import type { CanvasObject } from '@/types'

export default function App() {
  const theme = useAppStore((s) => s.theme)
  const leftSidebarCollapsed = useAppStore((s) => s.panels.leftSidebarCollapsed)
  const roadEditor = useAppStore((s) => s.roadEditor)
  const [devBench, setDevBench] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--toolbar-width',
      leftSidebarCollapsed ? '48px' : '180px'
    )
  }, [leftSidebarCollapsed])

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
    const store = useAppStore.getState()
    const editorState = JSON.stringify(state)
    const realWidth = totalWidth(state.strips)
    const realHeight = state.length

    if (roadEditor?.roadId === '__new__') {
      // Create new SmartRoad object centered on A4 page
      const currentScale = store.scale.currentScale
      const scaleFactor = metersToPixels(1, currentScale)
      const roadPixelW = realWidth * scaleFactor
      const roadPixelH = realHeight * scaleFactor

      const newObj: CanvasObject = {
        id: crypto.randomUUID(),
        type: 'smartroad',
        subtype: 'straight',
        category: 'smartroads',
        layerId: '',
        label: 'Straße',
        x: (PAGE_WIDTH_PX - roadPixelW) / 2,
        y: (PAGE_HEIGHT_PX - roadPixelH) / 2,
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
    } else if (roadEditor?.roadId) {
      // Update existing SmartRoad object
      store.updateObject(roadEditor.roadId, {
        editorState,
        realWidth,
        realHeight,
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
        try { return JSON.parse(obj.editorState) as StraightRoadState } catch { /* fallthrough */ }
      }
    }
    return createDefaultStraightRoad()
  }

  if (devBench) {
    return <DevTestBench onClose={() => setDevBench(false)} />
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: fixed 48px in flex flow, Toolbar overlays as absolute when expanded */}
        <div className="relative shrink-0 z-40" style={{ width: 48 }}>
          <div className="absolute top-0 left-0 h-full">
            <Toolbar />
          </div>
        </div>
        <LibrarySidebar />

        {/* Canvas */}
        <SketchCanvas />

        {/* Right: fixed 48px in flex flow, LayerManager overlays as absolute when expanded */}
        <div className="relative shrink-0 z-40" style={{ width: 48 }}>
          <div className="absolute top-0 right-0 h-full">
            <LayerManager />
          </div>
        </div>
      </div>

      <StatusBar />

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
    </div>
  )
}
