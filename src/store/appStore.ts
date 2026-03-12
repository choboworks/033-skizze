// src/store/appStore.ts
import { create } from 'zustand'
import type { ElementModel } from '../canvas/canvasTypes'

import {
  applyTheme,
  readStoredTheme,
  storeTheme,
  type Theme,
} from '../modules/ui/theme'

export type Tool =
  | 'select'
  | 'pen'
  | 'fill'
  | 'text'
  | 'objects'
  | 'eraser'

export type ObjectsMode =
  | 'line'
  | 'arrow-end'
  | 'arrow-both'
  | 'arrow-curve' 
  | 'rect'
  | 'ellipse'
  | 'triangle'


export type Category = 
  | 'generator'      
  | 'road'
  | 'vehicle'
  | 'sign'
  | 'environment'
  | 'shape'

/** ---------- Recents/Favorites (Sidebar) ---------- */
export type SidebarPrefs = {
  recents: string[]       
  favorites: string[]     
}

const SIDEBAR_LS_KEY = 'skizze.sidebar.v1'

function loadSidebarPrefs(): SidebarPrefs {
  if (typeof window === 'undefined') {
    return { recents: [], favorites: [] }
  }

  try {
    const raw = window.localStorage.getItem(SIDEBAR_LS_KEY)
    if (!raw) return { recents: [], favorites: [] }

    const parsed = JSON.parse(raw) as unknown
    const recents = Array.isArray((parsed as Record<string, unknown>)?.recents)
      ? ((parsed as Record<string, unknown>).recents as unknown[]).filter(
          (x): x is string => typeof x === 'string'
        )
      : []
    const favorites = Array.isArray((parsed as Record<string, unknown>)?.favorites)
      ? ((parsed as Record<string, unknown>).favorites as unknown[]).filter(
          (x): x is string => typeof x === 'string'
        )
      : []
    return { recents, favorites }
  } catch {
    return { recents: [], favorites: [] }
  }
}

function saveSidebarPrefs(prefs: SidebarPrefs) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SIDEBAR_LS_KEY, JSON.stringify(prefs))
  } catch {
    // Ignorieren (z. B. Private Mode / quota exceeded)
  }
}


/** ---------- UI / APP Types ---------- */
interface UiState {
  tool: Tool
  objectsMode: ObjectsMode
  pen: { strokeWidth: number; color: string }
  fill: { color: string }
  selection: string[]
  left: { search: string; activeCategory: Category | null }
  sidebar: SidebarPrefs
  theme: Theme
  orientation: 'portrait' | 'landscape'
}

interface ViewState {
  zoom: number
}

interface MetaState {
  title: string
  caseNumber: string
  officer: string
}

interface AppStore {
  ui: UiState
  view: ViewState
  elements: Record<string, ElementModel>
  meta: MetaState
  // UI
  uiSetTool: (t: Tool) => void
  uiSetObjectsMode: (m: ObjectsMode) => void
  uiSetPen: (p: Partial<UiState['pen']>) => void
  uiSetFill: (p: Partial<UiState['fill']>) => void
  uiSetSearch: (v: string) => void
  uiSetActiveCategory: (c: Category | null) => void
  uiSetMeta: (partial: Partial<MetaState>) => void
  // Sidebar / Recents
  bumpRecent: (assetId: string) => void
  uiBumpRecent: (assetId: string) => void
  clearRecents: () => void
  // View
  setZoomAbs: (z: number) => void
  // Elements
  upsertElement: (el: ElementModel) => void
  updateGeom: (id: string, geom: Partial<ElementModel['geom']>) => void
  removeElement: (id: string, force?: boolean) => void
  setVisible: (id: string, visible: boolean) => void
  setLocked: (id: string, locked: boolean) => void
  // Chains
  linkChainParts: (chainId: string, partIds: string[]) => void
  unlinkChainParts: (chainId: string, partIds: string[]) => void
  // Selection
  setSelection: (ids: string[]) => void
  clearSelection: () => void
  // Theme
  uiToggleTheme: () => void
  // Orientation
  uiToggleOrientation: () => void
}

/** ---------- Helpers ---------- */
type DataRecord = Record<string, unknown>
const isObject = (v: unknown): v is DataRecord =>
  typeof v === 'object' && v !== null

const hasKeepFlag = (d: unknown): d is { __keepInStore?: boolean } =>
  isObject(d) &&
  '__keepInStore' in d &&
  (d as { __keepInStore?: boolean }).__keepInStore === true

const getChainIdFromData = (d: unknown): string | undefined => {
  if (!isObject(d)) return undefined

  const chainObj = (d as DataRecord).chain
  if (isObject(chainObj)) {
    const maybeId = (chainObj as DataRecord).id
    if (typeof maybeId === 'string') return maybeId
  }

  const chainId = (d as DataRecord).chainId
  return typeof chainId === 'string' ? chainId : undefined
}

const getChainPartsFromData = (d: unknown): string[] => {
  if (!isObject(d)) return []
  const chainVal = (d as DataRecord).chain
  if (!isObject(chainVal)) return []
  const parts = (chainVal as DataRecord).parts
  if (!Array.isArray(parts)) return []
  return parts.filter((x): x is string => typeof x === 'string')
}

const isChainLike = (d: unknown): boolean =>
  isObject(d) &&
  ((d as DataRecord).kind === 'chain' || isObject((d as DataRecord).chain))

const isPartOfAnyChain = (
  id: string,
  elements: Record<string, ElementModel>
): boolean => {
  for (const el of Object.values(elements)) {
    if (isChainLike(el.data)) {
      const parts = getChainPartsFromData(el.data)
      if (parts.includes(id)) return true
    }
  }
  return false
}

const collectAllIdsForChainId = (
  chainId: string,
  elements: Record<string, ElementModel>
): { chainGroupIds: string[]; partIds: string[] } => {
  const chainGroupIds: string[] = []
  const partIds: string[] = []
  for (const el of Object.values(elements)) {
    const cid = getChainIdFromData(el.data)
    if (cid !== chainId) continue
    if (isChainLike(el.data)) chainGroupIds.push(el.id)
    else partIds.push(el.id)
  }
  return { chainGroupIds, partIds }
}

/** ---------- Store ---------- */
export const useAppStore = create<AppStore>((set, get) => {
  const initialTheme: Theme = readStoredTheme()
  applyTheme(initialTheme)

  return {
    ui: {
      tool: 'select',
      objectsMode: 'line',
      pen: { strokeWidth: 2, color: '#111827' },
      fill: { color: '#111827' },
      selection: [],
      left: { search: '', activeCategory: null },
      sidebar: loadSidebarPrefs(),
      theme: initialTheme,
      orientation: 'portrait',
    },

    view: { zoom: 1 },
    elements: {},
    meta: { title: 'Verkehrsunfallskizze', caseNumber: '', officer: '' },

    // UI
    uiSetTool: (t) => set((s) => ({ ui: { ...s.ui, tool: t } })),
    uiSetObjectsMode: (m) =>
      set((s) => ({ ui: { ...s.ui, objectsMode: m } })),
    uiSetPen: (p) =>
      set((s) => ({ ui: { ...s.ui, pen: { ...s.ui.pen, ...p } } })),
    uiSetFill: (p) =>
      set((s) => ({ ui: { ...s.ui, fill: { ...s.ui.fill, ...p } } })),
    uiSetSearch: (v) =>
      set((s) => ({ ui: { ...s.ui, left: { ...s.ui.left, search: v } } })),
    uiSetActiveCategory: (c) =>
      set((s) => ({
        ui: { ...s.ui, left: { ...s.ui.left, activeCategory: c } },
      })),
    uiSetMeta: (partial) =>
      set((s) => ({ meta: { ...s.meta, ...partial } })),

    uiToggleTheme: () =>
      set((s) => {
        const next: Theme = s.ui.theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        storeTheme(next)
        return { ui: { ...s.ui, theme: next } }
      }),

    uiToggleOrientation: () =>
      set((s) => ({
        ui: {
          ...s.ui,
          orientation:
            s.ui.orientation === 'portrait' ? 'landscape' : 'portrait',
        },
      })),

    // Sidebar / Recents
    bumpRecent: (assetId) => {
      const s = get()
      const prev = s.ui.sidebar
      const nextRecents = [
        assetId,
        ...prev.recents.filter((id) => id !== assetId),
      ].slice(0, 8)
      const nextPrefs: SidebarPrefs = { ...prev, recents: nextRecents }
      set({ ui: { ...s.ui, sidebar: nextPrefs } })
      saveSidebarPrefs(nextPrefs)
    },

uiBumpRecent: (assetId) => get().bumpRecent(assetId),

    clearRecents: () => {
      const s = get()
      const nextPrefs: SidebarPrefs = { ...s.ui.sidebar, recents: [] }
      set({ ui: { ...s.ui, sidebar: nextPrefs } })
      saveSidebarPrefs(nextPrefs)
    },

    // View
setZoomAbs: (z) =>
  set((s) => {
    const clamped = Math.max(0.1, Math.min(8, z))
    if (clamped === s.view.zoom) return s
    return {
      ...s,
      view: { ...s.view, zoom: clamped },
    }
  }),

    // Elements
upsertElement: (el) =>
  set((s) => {
    const next = { ...s.elements }

    // Nur für Chain-ähnliche Elemente spezielle Logik anwenden
    if (isChainLike(el.data)) {
      const newChainId = getChainIdFromData(el.data)
      const newPartsArr = getChainPartsFromData(el.data)
      const newParts = new Set(newPartsArr)

      if (newChainId) {
        // Alte Chain-Gruppen mit derselben chainId entfernen
        for (const [eid, existing] of Object.entries(next)) {
          if (eid === el.id) continue
          if (
            isChainLike(existing.data) &&
            getChainIdFromData(existing.data) === newChainId
          ) {
            delete next[eid]
          }
        }
      }

      // Chain-Gruppen, deren Parts echte Teilmenge des neuen Sets sind, entfernen
      for (const [eid, existing] of Object.entries(next)) {
        if (eid === el.id) continue
        if (!isChainLike(existing.data)) continue

        const oldParts = getChainPartsFromData(existing.data)
        if (!oldParts.length) continue

        const isSubset =
          oldParts.every((p) => newParts.has(p)) &&
          newParts.size > oldParts.length

        if (isSubset) {
          delete next[eid]
        }
      }
    }

    next[el.id] = el
    return { elements: next }
  }),

updateGeom: (id, geom) =>
  set((s) => {
    const prev = s.elements[id]
    if (!prev) return { elements: s.elements }

    const nextGeom = { ...prev.geom, ...geom }

    return {
      elements: {
        ...s.elements,
        [id]: { ...prev, geom: nextGeom },
      },
    }
  }),


removeElement: (id, force = false) =>
  set((s) => {
    const cur = s.elements[id]
    if (!cur) {
      // keine Änderung nötig
      return { elements: s.elements, ui: s.ui }
    }

    const next = { ...s.elements }
    const selection = new Set(s.ui.selection ?? [])

    if (force) {
      // auch bei force: Chain-Parts geschützt lassen
      if (!isChainLike(cur.data) && isPartOfAnyChain(id, s.elements)) {
        return { elements: s.elements, ui: s.ui }
      }
      delete next[id]
      selection.delete(id)
      return {
        elements: next,
        ui: { ...s.ui, selection: Array.from(selection) },
      }
    }

    const chainId = getChainIdFromData(cur.data)
    if (chainId && isChainLike(cur.data)) {
      const { chainGroupIds, partIds } = collectAllIdsForChainId(
        chainId,
        next
      )
      for (const pid of partIds) delete next[pid]
      for (const gid of chainGroupIds) delete next[gid]
      partIds.concat(chainGroupIds).forEach((rid) =>
        selection.delete(rid)
      )
      return {
        elements: next,
        ui: { ...s.ui, selection: Array.from(selection) },
      }
    }

    if (hasKeepFlag(cur.data) || isPartOfAnyChain(id, s.elements)) {
      return { elements: s.elements, ui: s.ui }
    }

    delete next[id]
    selection.delete(id)
    return {
      elements: next,
      ui: { ...s.ui, selection: Array.from(selection) },
    }
  }),

    setVisible: (id, visible) =>
      set((s) => {
        const prev = s.elements[id]
        if (!prev) return { elements: s.elements }
        return {
          elements: {
            ...s.elements,
            [id]: { ...prev, visible },
          },
        }
      }),

    setLocked: (id, locked) =>
      set((s) => {
        const prev = s.elements[id]
        if (!prev) return { elements: s.elements }
        return {
          elements: {
            ...s.elements,
            [id]: {
              ...prev,
              locked: {
                move: locked,
                rotate: locked,
                scale: locked,
              },
            },
          },
        }
      }),

    linkChainParts: (chainId, partIds) =>
      set((s) => {
        const next = { ...s.elements }
        partIds.forEach((pid) => {
          const el = next[pid]
          if (!el) return
          const data: DataRecord = isObject(el.data) ? el.data : {}
          const newData: DataRecord = {
            ...data,
            chainId,
            __keepInStore: true,
          }
          next[pid] = {
            ...el,
            data: newData as ElementModel['data'],
          }
        })
        return { elements: next }
      }),

    unlinkChainParts: (_chainId, partIds) =>
      set((s) => {
        const next = { ...s.elements }
        partIds.forEach((pid) => {
          const el = next[pid]
          if (!el) return
          const data: DataRecord = isObject(el.data) ? el.data : {}
          const nd: DataRecord = { ...data }
          delete (nd as Record<string, unknown>).chainId
          delete (nd as Record<string, unknown>).__keepInStore
          next[pid] = {
            ...el,
            data: nd as ElementModel['data'],
          }
        })
        return { elements: next }
      }),

    setSelection: (ids) =>
      set((s) => ({ ui: { ...s.ui, selection: ids } })),
    clearSelection: () =>
      set((s) => ({ ui: { ...s.ui, selection: [] } })),
  }
})

/** ---------- Window-Event-Bridge ---------- */
if (typeof window !== 'undefined') {
  window.addEventListener('app:toggle-format', () => {
    useAppStore.getState().uiToggleOrientation()
  })

  // Theme beim Start sicher anwenden (idempotent)
  applyTheme(useAppStore.getState().ui.theme)

  window.addEventListener('app:toggle-theme', () => {
    useAppStore.getState().uiToggleTheme()
  })

  window.addEventListener(
    'app:update-visibility',
    ((e: Event) => {
      const detail = (e as CustomEvent<{ id: string; visible: boolean }>).detail
      if (detail) useAppStore.getState().setVisible(detail.id, detail.visible)
    }) as EventListener
  )

  window.addEventListener(
    'app:delete-id',
    ((e: Event) => {
      const detail = (e as CustomEvent<{ id: string; force?: boolean }>).detail
      if (!detail) return
      const st = useAppStore.getState()
      const el = st.elements[detail.id]
      if (!el) return

      const chainId = getChainIdFromData(el.data)
      if (chainId && !isChainLike(el.data)) {
        const group = Object.values(st.elements).find(
          (x) =>
            isChainLike(x.data) &&
            getChainIdFromData(x.data) === chainId
        )
        if (group) {
          st.removeElement(group.id, true)
          return
        }
      }
      st.removeElement(detail.id, !!detail.force)
    }) as EventListener
  )

  window.addEventListener(
    'app:rename-id',
    ((e: Event) => {
      const detail = (e as CustomEvent<{ id: string; name: string }>).detail
      if (!detail) return
      const st = useAppStore.getState()
      const cur = st.elements[detail.id]
      if (!cur) return
      const prevData: DataRecord = isObject(cur.data) ? cur.data : {}
      const nextData: DataRecord = { ...prevData, name: detail.name }
      useAppStore.setState((s) => ({
        elements: {
          ...s.elements,
          [detail.id]: { ...cur, data: nextData as ElementModel['data'] },
        },
      }))
    }) as EventListener
  )

  window.addEventListener(
    'app:reorder-z',
    ((e: Event) => {
      const detail = (e as CustomEvent<{ idsTopDown: string[] }>).detail
      if (!detail) return
      useAppStore.setState((s) => {
        const next = { ...s.elements }
        let z = detail.idsTopDown.length
        detail.idsTopDown.forEach((id) => {
          if (next[id]) next[id] = { ...next[id], z }
          z -= 1
        })
        return { elements: next }
      })
    }) as EventListener
  )

  window.addEventListener(
    'app:select-ids',
    ((e: Event) => {
      const detail = (e as CustomEvent<{ ids: string[] }>).detail
      if (detail) useAppStore.getState().setSelection(detail.ids ?? [])
    }) as EventListener
  )
}

window.addEventListener(
  'app:reorder-z',
  ((e: Event) => {
    const detail = (e as CustomEvent<{ idsTopDown: string[] }>).detail
    if (!detail) return

    useAppStore.setState((s) => {
      const next = { ...s.elements }
      let z = detail.idsTopDown.length
      detail.idsTopDown.forEach((id) => {
        if (next[id]) next[id] = { ...next[id], z }
        z -= 1
      })
      return { elements: next }
    })
  }) as EventListener
)

window.addEventListener(
  'app:rename-id',
  ((e: Event) => {
    const detail = (e as CustomEvent<{ id: string; name: string }>).detail
    if (!detail) return
    const st = useAppStore.getState()
    const cur = st.elements[detail.id]
    if (!cur) return

    const prevData: DataRecord = isObject(cur.data) ? cur.data : {}
    const nextData: DataRecord = { ...prevData, name: detail.name }

    useAppStore.setState((s) => ({
      elements: {
        ...s.elements,
        [detail.id]: { ...cur, data: nextData as ElementModel['data'] },
      },
    }))
  }) as EventListener
)


