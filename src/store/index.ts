import { create } from 'zustand'
import { temporal } from 'zundo'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, calculateAutoScale } from '@/utils/scale'
import type { AppState, Layer, CanvasObject, Theme, ToolType, ViewportState, PanelStates, ScaleState, ScaleViewportOverride, DocumentMeta } from '@/types'

// --- Default Layers (empty – objects are shown directly) ---
const DEFAULT_LAYERS: Layer[] = []

// --- Default Document ---
const createDefaultDocument = (): DocumentMeta => ({
  id: crypto.randomUUID(),
  name: 'Neue Skizze',
  caseNumber: '',
  date: new Date().toISOString().split('T')[0],
  officer: '',
  department: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

// --- Initial Theme ---
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('033-skizze-theme')
    if (stored === 'light' || stored === 'dark') return stored
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  }
  return 'dark'
}

// --- Store ---
export const useAppStore = create<AppState>()(
  temporal(
    (set) => ({
      // Document
      document: createDefaultDocument(),

      // Viewport
      viewport: { x: 0, y: 0, zoom: 1 },

      // Scale
      scale: { currentScale: 200, rawScale: 200, viewport: null },

      // Canvas container size (updated by SketchCanvas)
      canvasSize: { width: 800, height: 600 },

      // Objects & Layers
      layers: DEFAULT_LAYERS,
      objects: {},
      objectOrder: [],
      selection: [],

      // Tools
      activeTool: 'select' as ToolType,
      toolOptions: {
        strokeColor: '#000000',
        strokeWidth: 2,
        fillColor: 'transparent',
        lineStyle: 'solid' as const,
        smoothing: 0.5,
        fontSize: 24,
        fontStyle: 'normal',
        textDecoration: '',
        textAlign: 'left',
        textColor: '#000000',
        textBackground: 'transparent',
      },

      // SmartRoads
      roadEditor: null,

      // UI
      panels: {
        leftSidebarCollapsed: false,
        rightSidebarCollapsed: false,
        libraryExpanded: false,
        leftSidebarWidth: 48,
        rightSidebarWidth: 260,
      },
      theme: getInitialTheme(),
      propertiesPanelId: null,
      activeLibraryCategory: null,
      editingTextId: null,

      // --- Actions ---

      // Viewport
      setViewport: (viewport: Partial<ViewportState>) =>
        set((state) => ({ viewport: { ...state.viewport, ...viewport } })),

      zoomTo: (zoom: number) =>
        set((state) => ({
          viewport: { ...state.viewport, zoom: Math.max(0.1, Math.min(5, zoom)) },
        })),

      resetView: () =>
        set((state) => {
          const { width, height } = state.canvasSize
          const padding = 40
          const zoom = Math.min(
            (width - padding * 2) / PAGE_WIDTH_PX,
            (height - padding * 2) / PAGE_HEIGHT_PX
          )
          const x = (width - PAGE_WIDTH_PX * zoom) / 2
          const y = (height - PAGE_HEIGHT_PX * zoom) / 2
          return { viewport: { x, y, zoom } }
        }),

      setCanvasSize: (size: { width: number; height: number }) =>
        set({ canvasSize: size }),

      // Tools
      setActiveTool: (tool: ToolType) => set({ activeTool: tool, activeLibraryCategory: null }),
      setToolOptions: (options: Partial<import('@/types').ToolOptions>) =>
        set((state) => ({ toolOptions: { ...state.toolOptions, ...options } })),

      // Selection
      select: (ids: string[]) => set({ selection: ids }),
      clearSelection: () => set({ selection: [] }),
      addToSelection: (id: string) =>
        set((state) => ({
          selection: state.selection.includes(id) ? state.selection : [...state.selection, id],
        })),

      // Objects
      addObject: (obj: CanvasObject) =>
        set((state) => ({
          objects: { ...state.objects, [obj.id]: obj },
          objectOrder: [...state.objectOrder, obj.id],
        })),

      updateObject: (id: string, changes: Partial<CanvasObject>) =>
        set((state) => {
          const existing = state.objects[id]
          if (!existing) return state
          return {
            objects: { ...state.objects, [id]: { ...existing, ...changes } },
          }
        }),

      removeObject: (id: string) =>
        set((state) => {
          const remaining = Object.fromEntries(
            Object.entries(state.objects).filter(([key]) => key !== id)
          )
          return {
            objects: remaining,
            objectOrder: state.objectOrder.filter((oid) => oid !== id),
            selection: state.selection.filter((sid) => sid !== id),
          }
        }),

      reorderObjects: (orderedIds: string[]) =>
        set({ objectOrder: orderedIds }),

      // Layers
      addLayer: (layer: Layer) =>
        set((state) => ({ layers: [...state.layers, layer] })),

      updateLayer: (id: string, changes: Partial<Layer>) =>
        set((state) => ({
          layers: state.layers.map((l) => (l.id === id ? { ...l, ...changes } : l)),
        })),

      removeLayer: (id: string) =>
        set((state) => ({
          layers: state.layers.filter((l) => l.id !== id),
        })),

      reorderLayers: (layerIds: string[]) =>
        set((state) => {
          const layerMap = new Map(state.layers.map((l) => [l.id, l]))
          const reordered = layerIds.map((id) => layerMap.get(id)).filter(Boolean) as Layer[]
          return { layers: reordered }
        }),

      toggleLayerVisibility: (id: string) =>
        set((state) => ({
          layers: state.layers.map((l) =>
            l.id === id ? { ...l, visible: !l.visible } : l
          ),
        })),

      toggleLayerLock: (id: string) =>
        set((state) => ({
          layers: state.layers.map((l) =>
            l.id === id ? { ...l, locked: !l.locked } : l
          ),
        })),

      // Panels
      setPanels: (panels: Partial<PanelStates>) =>
        set((state) => ({ panels: { ...state.panels, ...panels } })),

      toggleLeftSidebar: () =>
        set((state) => ({
          panels: { ...state.panels, leftSidebarCollapsed: !state.panels.leftSidebarCollapsed },
        })),

      toggleRightSidebar: () =>
        set((state) => ({
          panels: { ...state.panels, rightSidebarCollapsed: !state.panels.rightSidebarCollapsed },
        })),

      // Properties Panel
      openProperties: (id: string) => set({ propertiesPanelId: id }),
      closeProperties: () => set({ propertiesPanelId: null }),

      // Library
      setLibraryCategory: (category: string | null) =>
        set((state) => ({
          activeLibraryCategory: state.activeLibraryCategory === category ? null : category,
        })),

      // Theme
      toggleTheme: () =>
        set((state) => {
          const next: Theme = state.theme === 'dark' ? 'light' : 'dark'
          localStorage.setItem('033-skizze-theme', next)
          return { theme: next }
        }),

      // Document
      updateDocument: (changes: Partial<DocumentMeta>) =>
        set((state) => ({
          document: { ...state.document, ...changes, updatedAt: Date.now() },
        })),

      // Road Editor
      openRoadEditor: (roadId: string, subtype: import('@/types').SmartRoadSubtype) =>
        set({ roadEditor: { roadId, subtype } }),

      closeRoadEditor: () => set({ roadEditor: null }),

      // Scale
      updateScale: (scale: ScaleState) => set({ scale }),

      recalculateScale: () =>
        set((state) => {
          // Find bounding box of all SmartRoad objects in meters
          const smartroads = Object.values(state.objects).filter((o) => o.type === 'smartroad' && o.xMeters != null)
          if (smartroads.length === 0) return { scale: { currentScale: 200, rawScale: 200, viewport: state.scale.viewport } }

          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
          for (const obj of smartroads) {
            const x = obj.xMeters!
            const y = obj.yMeters!
            const w = obj.realWidth || 0
            const h = obj.realHeight || 0
            minX = Math.min(minX, x)
            minY = Math.min(minY, y)
            maxX = Math.max(maxX, x + w)
            maxY = Math.max(maxY, y + h)
          }

          const contentH = maxY - minY
          // Scale based on LENGTH only — width may overflow the page (that's OK)
          // Add 15% padding
          const auto = calculateAutoScale(0, contentH * 1.15)
          return { scale: { ...auto, viewport: state.scale.viewport } }
        }),

      // Scale override (Druckbereich tool)
      setScaleOverride: (viewport: ScaleViewportOverride | null) =>
        set((state) => ({
          scale: { ...state.scale, viewport },
        })),

      // Editing text
      setEditingTextId: (id: string | null) => set({ editingTextId: id }),
    }),
    {
      // zundo config: exclude UI-only state from undo history
      partialize: (state) => ({
        document: state.document,
        layers: state.layers,
        objects: state.objects,
        objectOrder: state.objectOrder,
        selection: state.selection,
        activeTool: state.activeTool,
        toolOptions: state.toolOptions,
        scale: state.scale,
      }),
    }
  )
)
