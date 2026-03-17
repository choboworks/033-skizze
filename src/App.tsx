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
  const panels = useAppStore((s) => s.panels)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useKeyboard()

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Toolbar + Library */}
        {!panels.leftSidebarCollapsed && (
          <div className="flex flex-col shrink-0">
            <Toolbar />
            <LibrarySidebar />
          </div>
        )}

        {/* Canvas */}
        <SketchCanvas />

        {/* Right: Layer Manager (self-sizing) */}
        {!panels.rightSidebarCollapsed && <LayerManager />}
      </div>

      <StatusBar />

      {/* Floating Properties Modal */}
      <FloatingProperties />
    </div>
  )
}
