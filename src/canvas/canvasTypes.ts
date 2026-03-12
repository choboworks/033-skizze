//srccanvas/canvasTypes.ts

export type ElementType =
  | 'road' | 'vehicle' | 'sign' | 'environment' | 'shape'
  | 'text' | 'arrow' | 'line' | 'rect' | 'ellipse' | 'polygon' | 'marking' | 'badge'
  | 'heading' | 'caseId' | 'officer'

export interface ElementModel {
  id: string
  type: ElementType
  z: number
  visible: boolean
  locked: { move: boolean; rotate: boolean; scale: boolean }
  geom: { x: number; y: number; angle: number; scaleX: number; scaleY: number }
  style: {
    stroke?: string
    fill?: string
    strokeWidth?: number
    opacity?: number
    dash?: number[]
    arrowHead?: 'none' | 'start' | 'end' | 'both'
  }
  data?: Record<string, unknown>
}

export type CatalogCategory = 'road' | 'vehicle' | 'sign' | 'environment' | 'shape'
export type RendererKind = 'vector' | 'svg' | 'png'
export type AnchorKey = 'center' | 'midX' | 'midY' | 'tl' | 'tr' | 'bl' | 'br'

export interface ElementDef {
  id: string
  category: CatalogCategory
  renderer: RendererKind
  asset?: string
  manifest: {
    targetBBox?: { w?: number; h?: number }
    defaultStyle?: { fill?: string; stroke?: string; strokeWidth?: number }
    anchors?: AnchorKey[]
    rotationOrigin?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    parts?: Array<{ key: string; colorizable: boolean }>
  }
  tags: string[]
}

export interface AppStateModel {
  elements: ElementModel[]
  selection: string[]
  view: { zoom: number; pan: { x: number; y: number } }
  ui: {
    left: { activeCategory?: string; search: string }
    tool: 'select' | 'pen' | 'text' | 'objects' | 'eraser'
    pen: { strokeWidth: number; color: string }
    modals: null | 'info' | 'help' | 'donate'
    theme: 'system' | 'light' | 'dark'
  }
  meta: { title?: string; caseId?: string; officerName?: string }
  library: { catalog: ElementDef[] }
  history: { canUndo: boolean; canRedo: boolean }
}
