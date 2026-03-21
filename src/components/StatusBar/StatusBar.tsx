import { useAppStore } from '@/store'
import { Scaling, RotateCcw } from 'lucide-react'

export function StatusBar() {
  const scale = useAppStore((s) => s.scale)
  const viewport = useAppStore((s) => s.viewport)
  const activeTool = useAppStore((s) => s.activeTool)
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
        <button
          className="badge"
          style={{ height: 22, padding: '0 7px', fontSize: 10.5, cursor: 'pointer', border: 'none' }}
          onClick={resetView}
          title="Ansicht zurücksetzen (100%)"
        >
          {zoomPercent}%
        </button>
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

      {/* Right: Version */}
      <div className="flex items-center flex-1 justify-end text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
        <span>033-Skizze v2.0 · © {new Date().getFullYear()} ChoboWorks</span>
      </div>
    </footer>
  )
}
