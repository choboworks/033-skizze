// src/modules/toolbar/Toolbar.tsx
import { useCallback } from 'react'
import { useAppStore } from '../../store/appStore'
import type { Tool } from '../../store/appStore'

import ToolbarBar from '../ui/ToolbarBar'
import ToolbarButton from '../ui/ToolbarButton'
import ToolbarDivider from '../ui/ToolbarDivider'

import {
  MousePointer2,
  Pencil,
  Type,
  Shapes,
  Eraser,
  ZoomIn,
  ZoomOut,
  Percent,
  PaintBucket,
  RotateCcw,
  RotateCw,
} from 'lucide-react'

// History-API

import { useHistoryStore } from '../../history/historyStore'

function Toolbar() {
  const tool = useAppStore((s) => s.ui.tool)
  const setTool = useAppStore((s) => s.uiSetTool)
  const setObjectsMode = useAppStore((s) => s.uiSetObjectsMode)
  const zoom = useAppStore((s) => s.view.zoom)
  const setZoomAbs = useAppStore((s) => s.setZoomAbs)

const pick = useCallback(
  (t: Tool) => {
    // 🔥 Toggle: Wenn aktuelles Tool erneut geklickt → zurück zu 'select'
    if (tool === t) {
      setTool('select')
      return
    }
    
    // Normales Verhalten: Tool aktivieren
    if (t === 'objects') setObjectsMode('line')
    setTool(t)
  },
  [tool, setTool, setObjectsMode]
)

  const zoomIn = useCallback(() => setZoomAbs(Math.min(8, zoom * 1.1)), [setZoomAbs, zoom])
  const zoomOut = useCallback(() => setZoomAbs(Math.max(0.1, zoom / 1.1)), [setZoomAbs, zoom])
  const zoom100 = useCallback(() => setZoomAbs(1), [setZoomAbs])

const undo = useCallback(() => { useHistoryStore.getState().undo() }, [])
const redo = useCallback(() => { useHistoryStore.getState().redo() }, [])

  return (
    <ToolbarBar aria-label="Werkzeuge">
      {/* Tools */}
      <div className="flex items-center gap-1">
        <ToolbarButton active={tool === 'select'} onClick={() => pick('select')} title="Auswählen (V)">
          <MousePointer2 size={16} />
          <span>Auswahl (V)</span>
        </ToolbarButton>

        <ToolbarButton active={tool === 'pen'} onClick={() => pick('pen')} title="Stift (P)">
          <Pencil size={16} />
          <span>Pen (P)</span>
        </ToolbarButton>

        <ToolbarButton active={tool === 'fill'} onClick={() => pick('fill')} title="Füllen (F)">
          <PaintBucket size={16} />
          <span>Füllen (F)</span>
        </ToolbarButton>

        <ToolbarButton active={tool === 'text'} onClick={() => pick('text')} title="Text (T)">
          <Type size={16} />
          <span>Text (T)</span>
        </ToolbarButton>

        <ToolbarButton
          active={tool === 'objects'}
          onClick={() => pick('objects')}
          title="Objekte (O) – Linie, Pfeil, Rechteck, Ellipse, Dreieck"
        >
          <Shapes size={16} />
          <span>Objekte (O)</span>
        </ToolbarButton>

        <ToolbarButton active={tool === 'eraser'} onClick={() => pick('eraser')} title="Radierer (E)">
          <Eraser size={16} />
          <span>Radierer (E)</span>
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton title="Rückgängig (Strg+Z)" onClick={undo} icon aria-label="Rückgängig">
          <RotateCcw size={18} />
        </ToolbarButton>
        <ToolbarButton title="Wiederholen (Strg+Y)" onClick={redo} icon aria-label="Wiederholen">
          <RotateCw size={18} />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <ToolbarButton title="Zoom Out" onClick={zoomOut} icon>
          <ZoomOut size={20} />
        </ToolbarButton>
        <ToolbarButton title="100%" onClick={zoom100} icon>
          <Percent size={20} />
        </ToolbarButton>
        <ToolbarButton title="Zoom In" onClick={zoomIn} icon>
          <ZoomIn size={20} />
        </ToolbarButton>

        {/* Status-Chip */}
        <div
          data-zoom-indicator
          className="seg-btn h-10 px-3 text-[13px] font-medium border border-[--border] text-[--text] bg-[--panel] tabular-nums cursor-default select-none"
        >
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </ToolbarBar>
  )
}

export default Toolbar
export { Toolbar }
