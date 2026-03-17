import { useAppStore } from '@/store'
import { Minus, Plus, Scaling } from 'lucide-react'

export function StatusBar() {
  const scale = useAppStore((s) => s.scale)
  const viewport = useAppStore((s) => s.viewport)
  const zoomTo = useAppStore((s) => s.zoomTo)
  const setViewport = useAppStore((s) => s.setViewport)
  const resetView = useAppStore((s) => s.resetView)

  const zoomPercent = Math.round(viewport.zoom * 100)

  const handleZoomIn = () => {
    const newZoom = Math.min(5, viewport.zoom * 1.2)
    zoomTo(newZoom)
    setViewport({ zoom: newZoom })
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, viewport.zoom / 1.2)
    zoomTo(newZoom)
    setViewport({ zoom: newZoom })
  }

  return (
    <div
      className="flex items-center justify-between select-none shrink-0"
      style={{
        height: 'var(--statusbar-height)',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '0 var(--space-md)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-muted)',
      }}
    >
      {/* Left: Canvas info */}
      <div className="flex items-center gap-2 flex-1">
        <span>DIN A4 canvas, 794×1123px</span>
      </div>

      {/* Center: Zoom controls */}
      <div className="flex items-center gap-1">
        <button onClick={handleZoomOut} className="icon-btn" style={{ padding: 4 }} title="Herauszoomen">
          <Minus size={14} />
        </button>
        <button
          onClick={resetView}
          className="min-w-12 text-center px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
          style={{ color: 'var(--text)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'var(--surface-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
          title="Auf 100% zurücksetzen"
        >
          {zoomPercent}%
        </button>
        <button onClick={handleZoomIn} className="icon-btn" style={{ padding: 4 }} title="Hineinzoomen">
          <Plus size={14} />
        </button>
      </div>

      {/* Right: Scale */}
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <Scaling size={13} />
        <span className="font-medium" style={{ color: 'var(--text)' }}>
          1:{scale.currentScale}
        </span>
      </div>
    </div>
  )
}
