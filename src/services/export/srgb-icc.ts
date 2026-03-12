// src/services/export/srgb-icc.ts
// sRGB-ICC laden & im Speicher vorhalten. Kein null-Leak in Call-Sites.

import srgbUrl from './assets/srgb.icc?url'

let cache: Uint8Array | null = null
let loading: Promise<Uint8Array | null> | null = null

export async function loadSrgbIcc(): Promise<Uint8Array | null> {
  if (cache) return cache
  if (!loading) {
    loading = fetch(srgbUrl, { cache: 'force-cache' })
      .then(res => (res.ok ? res.arrayBuffer() : null))
      .then(buf => {
        cache = buf ? new Uint8Array(buf) : null
        return cache
      })
      .catch(() => null)
      .finally(() => {
        loading = null
      })
  }
  return loading
}

/** Liefert den aktuell geladenen Stand (kann null sein, bis loadSrgbIcc() fertig ist). */
export function getSrgbIcc(): Uint8Array | null {
  return cache
}

// Beim Modulimport schon mal „anschieben“, damit es beim ersten Export meist da ist.
void loadSrgbIcc()
