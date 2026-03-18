import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { useKeyboard } from '@/hooks/useKeyboard'
import { TopBar } from '@/components/TopBar/TopBar'
import { Toolbar } from '@/components/Toolbar/Toolbar'
import { LibrarySidebar } from '@/components/Sidebar/LibrarySidebar'
import { SketchCanvas } from '@/components/Canvas/SketchCanvas'
import { LayerManager } from '@/components/LayerManager/LayerManager'
import { FloatingProperties } from '@/components/Inspector/FloatingProperties'
import { StatusBar } from '@/components/StatusBar/StatusBar'

export default function App() {
  const theme = useAppStore((s) => s.theme)
  const leftSidebarCollapsed = useAppStore((s) => s.panels.leftSidebarCollapsed)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--toolbar-width',
      leftSidebarCollapsed ? '48px' : '180px'
    )
  }, [leftSidebarCollapsed])

  useKeyboard()

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
    </div>
  )
}
