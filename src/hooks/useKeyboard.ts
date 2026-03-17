import { useEffect } from 'react'
import { useAppStore } from '@/store'
import type { ToolType } from '@/types'

const TOOL_SHORTCUTS: Record<string, ToolType> = {
  v: 'select',
  a: 'direct-select',
  h: 'hand',
  b: 'freehand',
  l: 'line',
  r: 'rect',
  o: 'ellipse',
  p: 'polygon',
  t: 'text',
  m: 'dimension',
}

export function useKeyboard() {
  const setActiveTool = useAppStore((s) => s.setActiveTool)
  const clearSelection = useAppStore((s) => s.clearSelection)
  const removeObject = useAppStore((s) => s.removeObject)
  const selection = useAppStore((s) => s.selection)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      const key = e.key.toLowerCase()

      // Tool shortcuts (single key, no modifiers)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        // Shift+L = Arrow
        if (e.shiftKey && key === 'l') {
          e.preventDefault()
          setActiveTool('arrow')
          return
        }
        // Shift+P = Path
        if (e.shiftKey && key === 'p') {
          e.preventDefault()
          setActiveTool('path')
          return
        }

        if (!e.shiftKey && TOOL_SHORTCUTS[key]) {
          e.preventDefault()
          setActiveTool(TOOL_SHORTCUTS[key])
          return
        }

        // Delete / Backspace
        if (key === 'delete' || key === 'backspace') {
          e.preventDefault()
          for (const id of selection) {
            removeObject(id)
          }
          clearSelection()
          return
        }

        // Escape → deselect
        if (key === 'escape') {
          e.preventDefault()
          clearSelection()
          setActiveTool('select')
          return
        }
      }

      // Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+A = select all (not yet implemented, placeholder)
        if (key === 'a') {
          e.preventDefault()
          return
        }
        // Ctrl+0 = fit to page
        if (key === '0') {
          e.preventDefault()
          useAppStore.getState().resetView()
          return
        }
        // Ctrl+1 = zoom 100%
        if (key === '1') {
          e.preventDefault()
          useAppStore.getState().zoomTo(1)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveTool, clearSelection, removeObject, selection])
}
