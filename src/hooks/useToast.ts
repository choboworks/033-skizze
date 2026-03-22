import { useCallback, useSyncExternalStore } from 'react'

// --- Toast Types ---
interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
  exiting?: boolean
}

// --- Mini Store (module-level, no Zustand dependency) ---
let toasts: Toast[] = []
const listeners = new Set<() => void>()

function notify() {
  for (const l of listeners) l()
}

function getSnapshot(): Toast[] {
  return toasts
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function addToast(message: string, type: Toast['type'] = 'info') {
  const id = crypto.randomUUID()
  toasts = [...toasts.slice(-2), { id, message, type }]
  notify()

  setTimeout(() => {
    toasts = toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    notify()
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notify()
    }, 180)
  }, 2500)
}

export function useToast() {
  const currentToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const toast = useCallback((message: string, type?: Toast['type']) => {
    addToast(message, type)
  }, [])

  return { toast, toasts: currentToasts }
}
