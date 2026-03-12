//src/canvas/core/cursor.ts
import type { Canvas } from 'fabric'

export type ToolId = 'select' | 'pen' | 'text' | 'fill' | 'objects' | 'eraser'

function getCursorForTool(tool: ToolId): { def: string; hov: string; draw?: string } {
  switch (tool) {
    case 'text': {
      const cur = 'url(/assets/text.png) 8 16, text'
      return { def: cur, hov: cur }
    }

    case 'pen': {
      const cur = 'url(/assets/pen.png) 2 20, crosshair'
      return { def: cur, hov: cur, draw: cur } // draw für freeDrawingCursor
    }

    case 'fill': {
      const cur = 'url(/assets/fill.png) 4 18, pointer'
      return { def: cur, hov: cur }
    }

    case 'eraser': {
      const cur = 'url(/assets/eraser.png) 8 8, crosshair'
      return { def: cur, hov: cur }
    }

    case 'objects': {
      const cur = 'url(/assets/object.png) 8 8, crosshair'
      return { def: cur, hov: cur }
    }

    case 'select':
    default:
      // Standard bleibt normaler System-Cursor
      return { def: 'default', hov: 'move' }
  }
}

export function applyCursorForTool(canvas: Canvas | null | undefined, tool: ToolId): void {
  if (!canvas) return
  const c = getCursorForTool(tool)

  canvas.defaultCursor = c.def
  canvas.hoverCursor = c.hov

  if (tool === 'pen' && c.draw) {
    canvas.freeDrawingCursor = c.draw
  }

  const el = canvas.getElement()
  if (el) el.style.cursor = c.def
}
