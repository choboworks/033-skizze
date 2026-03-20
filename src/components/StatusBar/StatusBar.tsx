import { useAppStore } from '@/store'
import { Minus, Plus, Scaling, RotateCcw, ZoomIn, Settings2 } from 'lucide-react'

export function StatusBar() {
  const scale = useAppStore((s) => s.scale)
  const viewport = useAppStore((s) => s.viewport)
  const activeTool = useAppStore((s) => s.activeTool)
  const zoomTo = useAppStore((s) => s.zoomTo)
  const setViewport = useAppStore((s) => s.setViewport)
  const resetView = useAppStore((s) => s.resetView)
  const setScaleOverride = useAppStore((s) => s.setScaleOverride)

  const zoomPercent = Math.round(viewport.zoom * 100)
  const hasOverride = scale.viewport !== null
  const effectiveScale = hasOverride ? Math.round(scale.viewport!.scale) : scale.currentScale

  const toolLabels: Record<string, string> = {
    select: 'Auswahl',
    freehand: 'Freihand',
    rect: 'Rechteck',
    'rounded-rect': 'Abgerundet',
    ellipse: 'Ellipse',
    triangle: 'Dreieck',
    polygon: 'Polygon',
    star: 'Stern',
    line: 'Linie',
    arrow: 'Pfeil',
    path: 'Pfad',
    text: 'Text',
    dimension: 'Bemaßung',
    'print-area': 'Ausschnitt',
  }

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
    <footer
      className="glass flex items-center justify-between select-none shrink-0"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '0 var(--space-lg)',
        height: 'var(--statusbar-height)',
        fontSize: 'var(--font-size-xs)',
      }}
    >
      {/* Left: Status badges */}
      <div className="flex items-center gap-2 flex-1">
        <span className="badge badge-accent" style={{ height: 22, padding: '0 7px', fontSize: 10.5 }}>
          {toolLabels[activeTool] || activeTool}
        </span>
        <span className="badge" style={{ height: 22, padding: '0 7px', fontSize: 10.5 }}>
          {zoomPercent}%
        </span>
        <span className="badge" style={hasOverride ? { height: 22, padding: '0 7px', fontSize: 10.5, background: 'rgba(240, 160, 48, 0.15)', color: '#f0a030' } : { height: 22, padding: '0 7px', fontSize: 10.5 }}>
          <Scaling size={11} />
          1:{effectiveScale}
          {hasOverride && (
            <button
              className="ml-1 hover:opacity-80 transition-opacity"
              style={{ color: '#f0a030', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              onClick={() => setScaleOverride(null)}
              title="Druckbereich zurücksetzen (Auto)"
            >
              <RotateCcw size={10} />
            </button>
          )}
        </span>
      </div>

      {/* Center: Zoom controls */}
      <div className="flex items-center gap-1">
        <button onClick={handleZoomOut} className="icon-btn" style={{ width: 28, height: 28, borderRadius: 10, padding: 0 }} title="Herauszoomen">
          <Minus size={14} />
        </button>
        <button
          onClick={resetView}
          className="surface-btn flex items-center justify-center min-w-12 h-7 px-2 rounded-[10px] text-[11px] font-medium"
          style={{ background: 'transparent' }}
          title="Seite einpassen"
        >
          {zoomPercent}%
        </button>
        <button onClick={handleZoomIn} className="icon-btn" style={{ width: 28, height: 28, borderRadius: 10, padding: 0 }} title="Hineinzoomen">
          <Plus size={14} />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end text-[11px]" style={{ color: 'var(--text-muted)', opacity: 0.75 }}>
        <span>Scroll = Zoom · Space = Pan</span>
        <button
          onClick={resetView}
          className="icon-btn flex items-center gap-1.5 h-7 px-2 rounded-[10px] text-[11px]"
          style={{ color: 'var(--text-muted)' }}
        >
          <ZoomIn size={13} />
          Reset
        </button>
      </div>
    </footer>
  )
}
