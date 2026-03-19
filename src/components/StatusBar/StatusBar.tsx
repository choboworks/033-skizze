import { useAppStore } from '@/store'
import { Minus, Plus, Scaling, RotateCcw } from 'lucide-react'

export function StatusBar() {
  const scale = useAppStore((s) => s.scale)
  const viewport = useAppStore((s) => s.viewport)
  const zoomTo = useAppStore((s) => s.zoomTo)
  const setViewport = useAppStore((s) => s.setViewport)
  const resetView = useAppStore((s) => s.resetView)
  const setScaleOverride = useAppStore((s) => s.setScaleOverride)

  const zoomPercent = Math.round(viewport.zoom * 100)
  const hasOverride = scale.viewport !== null
  const effectiveScale = hasOverride ? Math.round(scale.viewport!.scale) : scale.currentScale

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
          className="min-w-12 text-center px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
          style={{ color: 'var(--text)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'var(--surface-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
          title="Seite einpassen"
        >
          {zoomPercent}%
        </button>
        <button onClick={handleZoomIn} className="icon-btn" style={{ padding: 4 }} title="Hineinzoomen">
          <Plus size={14} />
        </button>
      </div>

      {/* Right: Scale (orange + reset when override active) */}
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <Scaling size={13} style={hasOverride ? { color: '#f0a030' } : undefined} />
        <span
          className="font-medium"
          style={{ color: hasOverride ? '#f0a030' : 'var(--text)' }}
        >
          1:{effectiveScale}
        </span>
        {hasOverride && (
          <button
            className="icon-btn"
            style={{ padding: 3, color: '#f0a030' }}
            onClick={() => setScaleOverride(null)}
            title="Druckbereich zurücksetzen (Auto)"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
