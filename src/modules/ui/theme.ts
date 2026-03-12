// src/modules/ui/theme.ts
export type Theme = 'light' | 'dark'

// Versionierter Key, damit alte Werte auf Prod ignoriert werden
export const THEME_STORAGE_KEY = 'skizze.theme.v1'

export const isTheme = (v: unknown): v is Theme => v === 'light' || v === 'dark'

/** Query (?theme), dann localStorage, dann vorhandenes data-theme, sonst 'light' */
export function readStoredTheme(): Theme {
  // 1) Query-Override
  try {
    const q = new URLSearchParams(window.location.search).get('theme')
    if (isTheme(q)) return q
  } catch {
    /* noop */
  }

  // 2) Persistiert
  const ls = safeLocalStorageGet(THEME_STORAGE_KEY)
  if (isTheme(ls)) return ls

  // 3) Bereits gesetztes data-theme (z. B. aus index.html)
  const ds = document.documentElement.dataset.theme
  if (isTheme(ds)) return ds

  // 4) Harte Default-Vorgabe
  return 'light'
}

/** Theme anwenden + natives color-scheme setzen + App-Event feuern */
export function applyTheme(
  t: Theme,
  source: 'bootstrap' | 'user' | 'system' = 'bootstrap'
): void {
  const root = document.documentElement
  if (root.dataset.theme !== t) root.setAttribute('data-theme', t)
  // Kein `any`: per CSS-Eigenschaft setzen
  try {
    root.style.setProperty('color-scheme', t)
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent('app:theme-changed', { detail: { theme: t, source } }))
}

/** Nutzer-Toggle */
export function toggleTheme(current?: Theme): Theme {
  const base = isTheme(current) ? current : readStoredTheme()
  const next: Theme = base === 'dark' ? 'light' : 'dark'
  applyTheme(next, 'user')
  storeTheme(next)
  return next
}

/** Früher Bootstrap (z. B. in main.tsx VOR React) */
export function bootstrapTheme(): Theme {
  const t = readStoredTheme()
  applyTheme(t, 'bootstrap')
  return t
}

/** Persistenz */
export function storeTheme(t: Theme): void {
  safeLocalStorageSet(THEME_STORAGE_KEY, t)
}

/* ===== Helpers (privacy/SSR-sicher) ===== */
function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeLocalStorageSet(key: string, val: string): void {
  try {
    window.localStorage.setItem(key, val)
  } catch {
    /* ignore */
  }
}
