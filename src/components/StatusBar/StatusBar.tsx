import { useAppStore } from '@/store'
import { Scaling, RotateCcw, Minus, Plus, Maximize2 } from 'lucide-react'

const YEAR = new Date().getFullYear()

export function StatusBar() {
  const scale = useAppStore((s) => s.scale)
  const viewport = useAppStore((s) => s.viewport)
  const activeTool = useAppStore((s) => s.activeTool)
  const selection = useAppStore((s) => s.selection)
  const objectOrder = useAppStore((s) => s.objectOrder)
  const resetView = useAppStore((s) => s.resetView)
  const zoomTo = useAppStore((s) => s.zoomTo)
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

  const zoomIn = () => zoomTo(Math.min(5, viewport.zoom * 1.25))
  const zoomOut = () => zoomTo(Math.max(0.1, viewport.zoom / 1.25))

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

        {/* Selection info */}
        {selection.length > 0 && (
          <span className="badge" style={{ height: 22, padding: '0 7px', fontSize: 10.5 }}>
            {selection.length} {selection.length === 1 ? 'Objekt' : 'Objekte'}
          </span>
        )}

        {/* Object count */}
        {selection.length === 0 && objectOrder.length > 0 && (
          <span className="badge" style={{ height: 22, padding: '0 7px', fontSize: 10.5 }}>
            {objectOrder.length} {objectOrder.length === 1 ? 'Objekt' : 'Objekte'}
          </span>
        )}
      </div>

      {/* Center: Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          className="surface-btn flex items-center justify-center"
          style={{ width: 24, height: 24, borderRadius: 8, padding: 0 }}
          onClick={zoomOut}
          title="Verkleinern"
        >
          <Minus size={12} />
        </button>
        <button
          className="badge"
          style={{ height: 22, padding: '0 7px', fontSize: 10.5, cursor: 'pointer', border: 'none', minWidth: 42, textAlign: 'center' }}
          onClick={resetView}
          title="Ansicht einpassen (Strg+0)"
        >
          {zoomPercent}%
        </button>
        <button
          className="surface-btn flex items-center justify-center"
          style={{ width: 24, height: 24, borderRadius: 8, padding: 0 }}
          onClick={zoomIn}
          title="Vergrößern"
        >
          <Plus size={12} />
        </button>
        <button
          className="surface-btn flex items-center justify-center"
          style={{ width: 24, height: 24, borderRadius: 8, padding: 0, marginLeft: 4 }}
          onClick={resetView}
          title="Alles einpassen (Strg+0)"
        >
          <Maximize2 size={11} />
        </button>

        <div className="divider-v" style={{ marginLeft: 6, marginRight: 6 }} />

        {/* Scale badge */}
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
        <span>033-Skizze v2.0 · © {YEAR} ChoboWorks</span>
      </div>
    </footer>
  )
}
