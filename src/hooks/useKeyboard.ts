import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { undoAction, redoAction } from '@/hooks/useUndoRedo'
import type { ToolType } from '@/types'

// Maps shortcut key → tool to activate
const TOOL_SHORTCUTS: Record<string, ToolType> = {
  v: 'select',
  p: 'freehand',
  o: 'rect',
  t: 'text',
  m: 'dimension',
  a: 'print-area',
}

// Which tools belong to the same group (for toggle behavior)
const TOOL_GROUPS: Record<string, ToolType[]> = {
  p: ['freehand'],
  o: ['rect', 'rounded-rect', 'ellipse', 'triangle', 'polygon', 'star', 'line', 'arrow', 'path'],
}

export function useKeyboard() {
  const setActiveTool = useAppStore((s) => s.setActiveTool)
  const clearSelection = useAppStore((s) => s.clearSelection)
  const removeObject = useAppStore((s) => s.removeObject)
  const selection = useAppStore((s) => s.selection)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Suppress all canvas shortcuts while the SmartRoad editor overlay is open
      if (useAppStore.getState().roadEditor) return

      const key = e.key.toLowerCase()

      // Tool shortcuts (single key, no modifiers)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const targetTool = TOOL_SHORTCUTS[key]
        if (targetTool) {
          e.preventDefault()
          const currentTool = useAppStore.getState().activeTool

          // If already in this tool's group → toggle back to select
          const group = TOOL_GROUPS[key]
          if (group && group.includes(currentTool)) {
            setActiveTool('select')
          } else {
            setActiveTool(targetTool)
          }
          return
        }

        // Delete / Backspace
        if (key === 'delete' || key === 'backspace') {
          e.preventDefault()
          const objects = useAppStore.getState().objects
          for (const id of selection) {
            if (!objects[id]?.locked) removeObject(id)
          }
          clearSelection()
          return
        }

        // Escape → close properties panel, deselect, back to select tool
        if (key === 'escape') {
          e.preventDefault()
          const state = useAppStore.getState()
          if (state.propertiesPanelId) {
            state.closeProperties()
          }
          clearSelection()
          setActiveTool('select')
          return
        }
      }

      // Ctrl shortcuts
      if (e.ctrlKey || e.metaKey) {
        // Undo: Ctrl+Z (without Shift)
        if (key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undoAction()
          return
        }
        // Redo: Ctrl+Shift+Z
        if (key === 'z' && e.shiftKey) {
          e.preventDefault()
          redoAction()
          return
        }
        // Redo: Ctrl+Y
        if (key === 'y') {
          e.preventDefault()
          redoAction()
          return
        }
        // Duplicate: Ctrl+D
        if (key === 'd') {
          e.preventDefault()
          const state = useAppStore.getState()
          const newIds: string[] = []
          for (const id of state.selection) {
            const obj = state.objects[id]
            if (!obj) continue
            const newObj = {
              ...obj,
              id: crypto.randomUUID(),
              x: obj.x + 20,
              y: obj.y + 20,
              // SmartRoads use xMeters/yMeters as position source — offset those too
              ...(obj.xMeters != null ? { xMeters: obj.xMeters + 1 } : {}),
              ...(obj.yMeters != null ? { yMeters: obj.yMeters + 1 } : {}),
              label: obj.label ? `${obj.label} (Kopie)` : '',
            }
            state.addObject(newObj)
            newIds.push(newObj.id)
          }
          if (newIds.length > 0) state.select(newIds)
          return
        }
        if (key === 'a') {
          e.preventDefault()
          const state = useAppStore.getState()
          const allIds = state.objectOrder.filter((id) => state.objects[id]?.visible && !state.objects[id]?.locked)
          if (allIds.length > 0) state.select(allIds)
          return
        }
        if (key === '0') {
          e.preventDefault()
          useAppStore.getState().resetView()
          return
        }
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
