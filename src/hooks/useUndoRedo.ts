import { useStore } from 'zustand'
import { useAppStore, _undoDebounce } from '@/store'

/**
 * Custom undo/redo that:
 * 1. Cancels any pending debounce timer (prevents futureStates wipe)
 * 2. Pauses zundo tracking
 * 3. Merges partial state into current full state
 * 4. Cleans up selection for deleted objects
 * 5. Resumes tracking
 */

function getPartial() {
  const s = useAppStore.getState()
  return {
    document: s.document,
    objects: s.objects,
    objectOrder: s.objectOrder,
    toolOptions: s.toolOptions,
    scale: s.scale,
  }
}

/** Force-save any pending debounced entry before undo/redo */
function flushDebounce() {
  if (_undoDebounce.timeout) {
    clearTimeout(_undoDebounce.timeout)
    _undoDebounce.timeout = null
  }
  // Fire the pending save immediately (if any)
  _undoDebounce.flush?.()
}

/** After undo/redo, clean up orphaned references */
function cleanupAfterRestore() {
  const { selection, objects, propertiesPanelId } = useAppStore.getState()
  const patch: Record<string, unknown> = {}

  // Clear selection for objects that no longer exist
  const validSelection = selection.filter((id) => id in objects)
  if (validSelection.length !== selection.length) {
    patch.selection = validSelection
  }

  // Clear properties panel if target object was removed
  if (propertiesPanelId && !(propertiesPanelId in objects)) {
    patch.propertiesPanelId = null
  }

  if (Object.keys(patch).length > 0) {
    useAppStore.setState(patch)
  }
}

function performUndo() {
  const temporal = useAppStore.temporal.getState()
  const { pastStates } = temporal
  if (pastStates.length === 0) return

  // Cancel pending debounce to prevent it from wiping futureStates
  flushDebounce()

  const currentPartial = getPartial()
  const pastState = pastStates[pastStates.length - 1]

  temporal.pause()

  useAppStore.temporal.setState({
    pastStates: pastStates.slice(0, -1),
    futureStates: [...temporal.futureStates, currentPartial],
  })

  useAppStore.setState(pastState)
  cleanupAfterRestore()

  temporal.resume()
}

function performRedo() {
  const temporal = useAppStore.temporal.getState()
  const { futureStates } = temporal
  if (futureStates.length === 0) return

  flushDebounce()

  const currentPartial = getPartial()
  const futureState = futureStates[futureStates.length - 1]

  temporal.pause()

  useAppStore.temporal.setState({
    pastStates: [...temporal.pastStates, currentPartial],
    futureStates: futureStates.slice(0, -1),
  })

  useAppStore.setState(futureState)
  cleanupAfterRestore()

  temporal.resume()
}

/**
 * Reactive hook for components (TopBar buttons).
 */
export function useUndoRedo() {
  const canUndo = useStore(useAppStore.temporal, (s) => s.pastStates.length > 0)
  const canRedo = useStore(useAppStore.temporal, (s) => s.futureStates.length > 0)
  return { undo: performUndo, redo: performRedo, canUndo, canRedo }
}

/** Non-reactive access for event handlers */
export const undoAction = performUndo
export const redoAction = performRedo
