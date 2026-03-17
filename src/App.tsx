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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useKeyboard()

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Toolbar (48px) + Library Drawer (slides out next to it) */}
        <Toolbar />
        <LibrarySidebar />

        {/* Canvas */}
        <SketchCanvas />

        {/* Right: Layer Manager (collapsible, 48px / 300px) */}
        <LayerManager />
      </div>

      <StatusBar />

      {/* Floating Properties Modal */}
      <FloatingProperties />
    </div>
  )
}
