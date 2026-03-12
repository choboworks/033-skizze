// src/history/historyStore.ts
import { create } from 'zustand'
import type { Command } from './types'

const MAX_HISTORY_SIZE = 100

interface HistoryState {
  undoStack: Command[]
  redoStack: Command[]
  
  push: (command: Command) => void
  undo: () => void
  redo: () => void
  clear: () => void
  
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  undoStack: [],
  redoStack: [],

push: (command: Command) => {
  set((state) => {
    const newUndoStack = [...state.undoStack, command]
    
    if (newUndoStack.length > MAX_HISTORY_SIZE) {
      newUndoStack.shift()
    }

    return {
      undoStack: newUndoStack,
      redoStack: [],
    }
  })
},

  undo: () => {
    const { undoStack, redoStack } = get()
    if (undoStack.length === 0) return

    const command = undoStack[undoStack.length - 1]
    
    try {
      command.undo()
      
      set({
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, command],
      })
    } catch (error) {
      console.error('[History] Undo failed:', error)
    }
  },

  redo: () => {
    const { undoStack, redoStack } = get()
    if (redoStack.length === 0) return

    const command = redoStack[redoStack.length - 1]
    
    try {
      command.redo()
      
      set({
        undoStack: [...undoStack, command],
        redoStack: redoStack.slice(0, -1),
      })
    } catch (error) {
      console.error('[History] Redo failed:', error)
    }
  },

  clear: () => {
    set({
      undoStack: [],
      redoStack: [],
    })
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,
}))