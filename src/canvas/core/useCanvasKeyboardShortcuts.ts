// src/canvas/core/useCanvasKeyboardShortcuts.ts
import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import type { Canvas, Textbox, FabricObject, ActiveSelection } from 'fabric'
import { useAppStore } from '../../store/appStore'

type UseCanvasKeyboardShortcutsOpts = {
  fabricRef: MutableRefObject<Canvas | null>
  pendingTextRef: MutableRefObject<Textbox | null>
  cancelTempShape: () => void
  history: {
    undo: () => void
    redo: () => void
  }
}

/* =============================================================================
   Spiegelfunktionen
   ========================================================================== */

/**
 * Spiegelt Objekte horizontal (scaleX * -1)
 */
function flipObjectsHorizontal(
  canvas: Canvas,
  active: FabricObject,
  // history Parameter ENTFERNEN
): void {
  const objects =
    active.type === 'activeSelection'
      ? (active as ActiveSelection).getObjects()
      : [active]

  objects.forEach((obj) => {
    const currentScaleX = obj.scaleX ?? 1
    obj.set({ scaleX: currentScaleX * -1 })
    obj.setCoords()

    const id = (obj as { data?: { id?: string } }).data?.id
    if (id) {
      window.dispatchEvent(
        new CustomEvent('app:update-geom', {
          detail: { id, geom: { scaleX: obj.scaleX } },
        })
      )
    }
  })

  canvas.requestRenderAll()
  // history.snapshot() LÖSCHEN - app:update-geom triggert History automatisch
}

function flipObjectsVertical(
  canvas: Canvas,
  active: FabricObject,
  // history Parameter ENTFERNEN
): void {
  const objects =
    active.type === 'activeSelection'
      ? (active as ActiveSelection).getObjects()
      : [active]

  objects.forEach((obj) => {
    const currentScaleY = obj.scaleY ?? 1
    obj.set({ scaleY: currentScaleY * -1 })
    obj.setCoords()

    const id = (obj as { data?: { id?: string } }).data?.id
    if (id) {
      window.dispatchEvent(
        new CustomEvent('app:update-geom', {
          detail: { id, geom: { scaleY: obj.scaleY } },
        })
      )
    }
  })

  canvas.requestRenderAll()
  // history.snapshot() LÖSCHEN
}

/* =============================================================================
   Hook
   ========================================================================== */

export function useCanvasKeyboardShortcuts({
  fabricRef,
  pendingTextRef,
  cancelTempShape,
  history,
}: UseCanvasKeyboardShortcutsOpts): void {

  useEffect(() => {
    const isTypingTarget = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement | null
      if (!t) return false
      const tag = t.tagName.toLowerCase()
      const editable =
        t.isContentEditable ||
        tag === 'input' ||
        tag === 'textarea' ||
        (t as HTMLInputElement).type === 'text' ||
        (t as HTMLInputElement).type === 'search'
      return editable
    }

    const deleteSelection = () => {
      const canvas = fabricRef.current
      if (!canvas) return
      const active = canvas.getActiveObjects()
      if (!active.length) return
      active.forEach((obj) => canvas.remove(obj))
      ;(useAppStore.getState() as unknown as { clearSelection: () => void })
        .clearSelection()
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e)) return

      // ==============================
      // Ctrl/Cmd-Shortcuts
      // ==============================
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        const key = e.key.toLowerCase()

        // Clipboard (C/V/D/X) → an Clipboard-Hook weiterreichen
        if (key === 'c' || key === 'v' || key === 'd' || key === 'x') {
          e.preventDefault()
          const map: Record<string, 'copy' | 'paste' | 'dup' | 'cut'> = {
            c: 'copy',
            v: 'paste',
            d: 'dup',
            x: 'cut',
          }
          window.dispatchEvent(
            new CustomEvent('app:clipboard', { detail: { op: map[key] } }),
          )
          return
        }

        // Undo
        if (key === 'z') {
          e.preventDefault()
          history.undo()
          return
        }

        // Redo
        if (key === 'y') {
          e.preventDefault()
          history.redo()
          return
        }

        // PDF speichern
        if (key === 's') {
          e.preventDefault()
          window.dispatchEvent(
            new CustomEvent('app:export-pdf', { detail: { withHeader: true } }),
          )
          return
        }

        // Drucken
        if (key === 'p') {
          e.preventDefault()
          window.dispatchEvent(
            new CustomEvent('app:print', { detail: { withHeader: true } }),
          )
          return
        }

        // Zoom (Ctrl/Cmd + +/-/0)
        const state = useAppStore.getState() as unknown as {
          view: { zoom: number }
          setZoomAbs?: (z: number) => void
        }
        const setZoomAbs = state.setZoomAbs
        if (!setZoomAbs) return

        if (key === '=' || key === '+') {
          e.preventDefault()
          const z = state.view.zoom
          setZoomAbs(Math.min(8, z * 1.1))
          return
        }
        if (key === '-') {
          e.preventDefault()
          const z = state.view.zoom
          setZoomAbs(Math.max(0.1, z / 1.1))
          return
        }
        if (key === '0') {
          e.preventDefault()
          setZoomAbs(1)
          return
        }
      }

      // ==============================
      // Shift-Shortcuts (Spiegeln)
      // ==============================
      if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const key = e.key.toLowerCase()
        const canvas = fabricRef.current
        if (!canvas) return

        const active = canvas.getActiveObject()
        if (!active) return

        switch (key) {
          case 'h': {
            // Horizontal spiegeln
            e.preventDefault()
            flipObjectsHorizontal(canvas, active)  // ← history ENTFERNT
            return
          }
          case 'v': {
            // Vertikal spiegeln
            e.preventDefault()
            flipObjectsVertical(canvas, active)  // ← history ENTFERNT
            return
          }
        }
      }

      // ==============================
      // Einfache Shortcuts ohne Modifier
      // ==============================
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const key = e.key.toLowerCase()
        const canvas = fabricRef.current

        const st = useAppStore.getState() as unknown as {
          uiSetTool: (tool: string) => void
          clearSelection: () => void
        }

        switch (key) {
          case 'v':
            st.uiSetTool('select')
            break
          case 'p':
          case 'b':
            st.uiSetTool('pen')
            break
          case 't':
            st.uiSetTool('text')
            break
          case 'f':
            st.uiSetTool('fill')
            break
          case 'o':
            st.uiSetTool('objects')
            break
          case 'e':
            st.uiSetTool('eraser')
            break

          case 'escape': {
            if (canvas) {
              const tb = pendingTextRef.current
              if (tb) {
                canvas.remove(tb)
                pendingTextRef.current = null
              }

              // temporäre Shapes (Objekte-Tool) abbrechen
              cancelTempShape()

              canvas.discardActiveObject()
              canvas.requestRenderAll()
            }
            st.clearSelection()
            st.uiSetTool('select')
            break
          }

          case 'delete':
          case 'backspace':
            e.preventDefault()
            deleteSelection()
            break

          default:
            break
        }
      }
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [fabricRef, pendingTextRef, cancelTempShape, history])
}