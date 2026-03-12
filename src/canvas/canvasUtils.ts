// src/canvas/canvasUtils.ts

// A4 @ ~96 PPI – Canvas-Basisgröße
export const ARTBOARD = { w: 794, h: 1123 } as const

// Simple, in-memory ID-Generator für Canvas-Objekte
let seq = 0
export const uid = (prefix = 'el'): string => `${prefix}_${++seq}`

// Variadisch-typisiertes Throttling, bewahrt die Signatur von fn
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 80,
): (...args: Args) => void {
  let last = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let queuedArgs: Args | null = null

  const invoke = (args: Args) => {
    last = Date.now()
    fn(...args)
  }

  return (...args: Args): void => {
    const now = Date.now()
    const remaining = wait - (now - last)
    queuedArgs = args

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      invoke(args)
    } else if (!timer) {
      timer = setTimeout(() => {
        timer = null
        if (queuedArgs) {
          invoke(queuedArgs)
          queuedArgs = null
        }
      }, remaining)
    }
  }
}
