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
  | 'print-area'
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
export const VALID_SCALES = [10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 175, 200, 250, 300, 400, 500, 600, 750, 1000, 1500, 2000, 3000, 5000] as const
export type ValidScale = (typeof VALID_SCALES)[number]

export interface ScaleViewportOverride {
  centerX: number    // Meter – center of the print area
  centerY: number    // Meter
  scale: number      // e.g. 150 for 1:150 (continuous, not snapped to ValidScale)
  // Content frame position/size on A4 page (in mm)
  frameX: number     // default 10
  frameY: number     // default 25
  frameW: number     // default 190
  frameH: number     // default 257
}

export interface ScaleState {
  currentScale: ValidScale
  rawScale: number
  viewport: ScaleViewportOverride | null  // null = auto mode
}

// --- Document ---
export interface DocumentMeta {
  id: string
  name: string
  caseNumber: string          // Aktenzeichen
  date: string
  officer: string             // Sachbearbeiter
  department: string          // Dienststelle (Name)
  departmentAddress: string   // Dienststellen-Adresse ("Straße, PLZ Stadt")
  departmentPhone: string     // Dienststellen-Telefon
  subdivision: string         // Dienstabteilung
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
  | 'dimension'
  | 'image'
  | 'smartroad'

// --- SmartRoad Subtypes ---
export type SmartRoadSubtype = 'straight' | 'curve' | 'intersection' | 'roundabout'

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
  // Text-specific
  text?: string
  fontSize?: number
  fontStyle?: string        // 'normal' | 'bold' | 'italic' | 'bold italic'
  textDecoration?: string   // '' | 'underline'
  textAlign?: string        // 'left' | 'center' | 'right'
  textBackground?: string
  // Dimension-specific
  dimensionStart?: { x: number; y: number }  // start point in page coords
  dimensionEnd?: { x: number; y: number }    // end point in page coords
  // SmartRoad-specific (real-world objects use meter positions)
  subtype?: SmartRoadSubtype          // 'straight' | 'curve' | 'intersection' | 'roundabout'
  editorState?: string                // serialized editor state (JSON)
  xMeters?: number                    // position in meters (source of truth for real objects)
  yMeters?: number                    // position in meters (source of truth for real objects)
  realWidth?: number                  // bounding box width in meters (for auto-scale)
  realHeight?: number                 // bounding box height in meters (for auto-scale)
  // State
  visible: boolean
  locked: boolean
  note?: string
  number?: number      // Beteiligtennummer
  groupId?: string
}

// --- Panel States ---
export interface PanelStates {
  leftSidebarCollapsed: boolean
  rightSidebarCollapsed: boolean
  libraryExpanded: boolean
  leftSidebarWidth: number
  rightSidebarWidth: number
}

export type RightSidebarTab = 'layers' | 'library' | 'metadata'

// --- Theme ---
export type Theme = 'light' | 'dark'

// --- Road Editor ---
export interface RoadEditorState {
  roadId: string
  subtype: SmartRoadSubtype
}

// --- Tool Options ---
export interface ToolOptions {
  strokeColor: string
  strokeWidth: number
  fillColor: string
  lineStyle: 'solid' | 'dashed' | 'dotted'
  smoothing: number  // 0-1
  // Text
  fontSize: number
  fontStyle: string   // 'normal' | 'bold' | 'italic' | 'bold italic'
  textDecoration: string  // '' | 'underline'
  textAlign: string   // 'left' | 'center' | 'right'
  textColor: string
  textBackground: string
}

// --- App State (full Zustand store shape) ---
export interface AppState {
  // Document
  document: DocumentMeta

  // Canvas
  viewport: ViewportState
  scale: ScaleState
  canvasSize: { width: number; height: number }

  // Objects (SmartRoads live here too, as type: 'smartroad')
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
  rightSidebarTab: RightSidebarTab

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

  // Actions – Panels
  setPanels: (panels: Partial<PanelStates>) => void
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void

  // Actions – Properties Panel
  openProperties: (id: string) => void
  closeProperties: () => void

  // Actions – Library
  setLibraryCategory: (category: string | null) => void
  setRightSidebarTab: (tab: RightSidebarTab) => void

  // Actions – Theme
  toggleTheme: () => void

  // Actions – Document
  updateDocument: (changes: Partial<DocumentMeta>) => void

  // Actions – Road Editor
  openRoadEditor: (roadId: string, subtype: SmartRoadSubtype) => void
  closeRoadEditor: () => void

  // Actions – Scale
  updateScale: (scale: ScaleState) => void
  recalculateScale: () => void
  setScaleOverride: (viewport: ScaleViewportOverride | null) => void

  // Editing text
  editingTextId: string | null
  setEditingTextId: (id: string | null) => void
}
