// ============================================================
// 033-Skizze – Core Type Definitions
// ============================================================

// --- Tool Types ---
export type ToolType =
  | 'select'
  | 'freehand'
  | 'line'
  | 'arrow'
  | 'rect'
  | 'rounded-rect'
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'path'
  | 'star'
  | 'text'
  | 'dimension'
  | 'brake-trail'
  | 'debris-field'
  | 'fluid'
  | 'collision-point'
  | 'final-position'
  | 'movement-line'

// --- Viewport ---
export interface ViewportState {
  x: number
  y: number
  zoom: number
}

// --- Scale ---
export const VALID_SCALES = [50, 100, 150, 200, 250, 500, 1000] as const
export type ValidScale = (typeof VALID_SCALES)[number]

export interface ScaleState {
  currentScale: ValidScale
  rawScale: number
}

// --- Document ---
export interface DocumentMeta {
  id: string
  name: string
  caseNumber: string    // Aktenzeichen
  date: string
  officer: string       // Sachbearbeiter
  department: string    // Dienststelle
  createdAt: number
  updatedAt: number
}

// --- Canvas Object ---
export type ObjectCategory =
  | 'smartroads'
  | 'vehicles'
  | 'infrastructure'
  | 'traffic-regulation'
  | 'environment'
  | 'markings'

export type ShapeType =
  | 'rect'
  | 'rounded-rect'
  | 'ellipse'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'polygon'
  | 'path'
  | 'star'
  | 'freehand'
  | 'text'
  | 'image'

export interface CanvasObject {
  id: string
  type: ShapeType
  category: ObjectCategory
  layerId: string
  label: string
  // Position & size in page-pixel coordinates (relative to A4 origin 0,0)
  x: number
  y: number
  width: number
  height: number
  rotation: number     // degrees
  // Appearance
  strokeColor: string
  strokeWidth: number
  fillColor: string
  opacity: number
  // Line-specific: array of [x,y] pairs relative to object origin
  points?: number[]
  // Shape-specific
  cornerRadius?: number     // for rounded-rect
  numPoints?: number        // for star (number of outer points)
  innerRadius?: number      // for star (inner radius ratio 0-1)
  // Freehand-specific
  tension?: number          // 0-1 smoothing factor (Konva Line tension)
  lineDash?: number[]       // dash pattern e.g. [10,5] for dashed
  // State
  visible: boolean
  locked: boolean
  note?: string
  number?: number      // Beteiligtennummer
  groupId?: string
}

// --- Layer ---
export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  color: string
  objectIds: string[]
}

// --- Panel States ---
export interface PanelStates {
  leftSidebarCollapsed: boolean
  rightSidebarCollapsed: boolean
  libraryExpanded: boolean
  leftSidebarWidth: number
  rightSidebarWidth: number
}

// --- Theme ---
export type Theme = 'light' | 'dark'

// --- Road Editor ---
export interface RoadEditorState {
  roadId: string
  // Will be expanded in Phase 4
}

// --- Tool Options ---
export interface ToolOptions {
  strokeColor: string
  strokeWidth: number
  fillColor: string
  lineStyle: 'solid' | 'dashed' | 'dotted'
  smoothing: number  // 0-1
}

// --- App State (full Zustand store shape) ---
export interface AppState {
  // Document
  document: DocumentMeta

  // Canvas
  viewport: ViewportState
  scale: ScaleState
  canvasSize: { width: number; height: number }

  // Objects & Layers
  layers: Layer[]
  objects: Record<string, CanvasObject>
  objectOrder: string[]  // z-order: first = bottom, last = top
  selection: string[]

  // Tools
  activeTool: ToolType
  toolOptions: ToolOptions

  // SmartRoads
  roadEditor: RoadEditorState | null

  // UI
  panels: PanelStates
  theme: Theme
  propertiesPanelId: string | null
  activeLibraryCategory: string | null

  // Actions – Viewport
  setViewport: (viewport: Partial<ViewportState>) => void
  zoomTo: (zoom: number) => void
  resetView: () => void
  setCanvasSize: (size: { width: number; height: number }) => void

  // Actions – Tools
  setActiveTool: (tool: ToolType) => void
  setToolOptions: (options: Partial<ToolOptions>) => void

  // Actions – Selection
  select: (ids: string[]) => void
  clearSelection: () => void
  addToSelection: (id: string) => void

  // Actions – Objects
  addObject: (obj: CanvasObject) => void
  updateObject: (id: string, changes: Partial<CanvasObject>) => void
  removeObject: (id: string) => void
  reorderObjects: (orderedIds: string[]) => void

  // Actions – Layers
  addLayer: (layer: Layer) => void
  updateLayer: (id: string, changes: Partial<Layer>) => void
  removeLayer: (id: string) => void
  reorderLayers: (layerIds: string[]) => void
  toggleLayerVisibility: (id: string) => void
  toggleLayerLock: (id: string) => void

  // Actions – Panels
  setPanels: (panels: Partial<PanelStates>) => void
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void

  // Actions – Properties Panel
  openProperties: (id: string) => void
  closeProperties: () => void

  // Actions – Library
  setLibraryCategory: (category: string | null) => void

  // Actions – Theme
  toggleTheme: () => void

  // Actions – Document
  updateDocument: (changes: Partial<DocumentMeta>) => void

  // Actions – Scale
  updateScale: (scale: ScaleState) => void
}
