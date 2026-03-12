// src/canvas/CanvasArea.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Canvas,
  Ellipse,
  Line,
  Path,
  Rect,
  Textbox,
  Triangle,
  util,
  loadSVGFromString,
  Image as FabricImage,
  Group,
  type FabricObject,
} from 'fabric'

import {
  CrispCanvas,
  type ObjWithData,
  getId,
  ensureId,
  setName,
  setData,
} from './core/canvasCore'

import { attachCtrlMultiSelect } from './core/ctrlMultiSelect'
import { useToolbarOffset } from './core/useToolbarOffset'
import { useCanvasKeyboardShortcuts } from './core/useCanvasKeyboardShortcuts'
import { useCanvasTextTool } from './core/useCanvasTextTool'
import { useCanvasObjectsTool } from './core/useCanvasObjectsTool'
import { useCanvasPenTool } from './core/useCanvasPenTool'
import { useCanvasEraserTool } from './core/useCanvasEraserTool'
import { useCanvasFillTool } from './core/useCanvasFillTool'
import { useSpaceHandPan } from './core/useSpaceHandPan'
import { useWheelZoom } from './core/useWheelZoom'
import { useMarqueeSelection } from './core/useMarqueeSelection'
import { useCanvasLayerBridge } from './core/useCanvasLayerBridge'

import { ARTBOARD, uid } from './canvasUtils'
import { useDrop } from 'react-dnd'
import { useAppStore } from '../store/appStore'
import type { ElementModel } from './canvasTypes'
import { PenOverlay } from '../modules/toolbar/PenOverlay'
import { TextEditorOverlay } from '../modules/toolbar/TextEditorOverlay'
import { ObjectsPopover } from '../modules/toolbar/ObjectsPopover'
import { FillOverlay, type FillCfg } from '../modules/toolbar/FillOverlay'
import { applyCursorForTool, type ToolId } from './core/cursor'
import { mountMetaOverlays, isMetaOverlay, unmountMetaOverlays } from './core/metaOverlays'
import { saveCanvasAsPdf, printCanvasPdf, preloadPdfMake } from '../services/export/export'
import { useTouchPan } from './core/useTouchPan'

// Library (neues Manifest)
import { libraryAssets } from '../modules/library/libraryManifest'

// 🔥 NEU: SmartRoad importieren
import { SmartRoad } from '../modules/library/roads/SmartRoad'
import type { RoadTemplate } from '../modules/library/roads/types'

// 🔥 NEU: VisualRoadInspector (ersetzt alten RoadInspector)
import VisualRoadInspector from '../modules/library/roads/inspector/VisualRoadInspector'
import VisualCurveInspector from '../modules/library/roads/inspector/VisualCurveInspector'
import type { SmartRoadConfig } from '../modules/library/roads/types'

// Fahrzeuge
import { annotateVehicleOnDrop } from './core/useCarFeatures'

// Roads
import { parseRoadConnectorsFromSvg } from './roads/svgConnectors'
import { useRoadSnapping } from './core/useRoadSnapping'

// Drop-Sizing
import { 
  resizeToSubcategoryDefault, 
  isRoadSubcategory 
} from './core/dropSizing'
import type { SubcategoryId } from './core/dropSizing'

// History
import { useCanvasHistory } from '../history/useCanvasHistory'

// Clipboard
import { useCanvasClipboard } from './core/useClipboard'

/* =============================================================================
   Konstanten / Helfer
   ========================================================================== */

const EXPORT_BASENAME = 'Verkehrsunfallskizze' as const
const VIEW_PADDING = 40

const DND_ITEM_LIB = 'LIB_ITEM' as const
type LibDragItem = { type: typeof DND_ITEM_LIB; assetId: string }

/** Root-<svg id="..."> aus dem SVG-String (case-insensitive) */
const getSvgRootId = (svg: string): string | undefined => {
  const m = svg.match(/<svg[^>]*\bid\s*=\s*["']([^"']+)["']/i)
  return m?.[1]
}

function findAssetById(
  id: string,
): { 
  subcategory: SubcategoryId; 
  source: string; 
  kind: 'svg' | 'image' | 'smart-road';
  label: string;
  isSmartRoad?: boolean;
  roadTemplate?: RoadTemplate;  // ← RoadTemplate statt any
} | null {
  const meta = libraryAssets[id]
  if (!meta) return null

  // 🔥 NEU: SmartRoad-Check
  if (meta.isSmartRoad && meta.roadTemplate) {
    return {
      subcategory: meta.subcategory,
      source: '',  // Kein statisches SVG
      kind: 'smart-road',
      label: meta.label,
      isSmartRoad: true,
      roadTemplate: meta.roadTemplate,
    }
  }

  return {
    subcategory: meta.subcategory,
    source: meta.svg,
    kind: 'svg',
    label: meta.label,
  }
}

const META_TEXT_COLOR = '#000000' as const

function enforceMetaOverlayPaint(cv: Canvas): void {
  let dirty = false
  cv.getObjects().forEach((o) => {
    if (!isMetaOverlay(o)) return
    if (o instanceof Textbox) {
      const cur = typeof o.fill === 'string' ? o.fill.toLowerCase().trim() : ''
      if (cur !== META_TEXT_COLOR) {
        o.set({ fill: META_TEXT_COLOR, stroke: undefined, opacity: 1 })
        ;(o as unknown as { dirty?: boolean }).dirty = true
        dirty = true
      }
    }
  })
  if (dirty) cv.requestRenderAll()
}

/* =============================================================================
   Komponente
   ========================================================================== */

function CanvasArea() {
  // DOM/Fabric Refs
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const canvasEl = useRef<HTMLCanvasElement | null>(null)
  const fabricRef = useRef<Canvas | null>(null)
  const [clipCanvas, setClipCanvas] = useState<Canvas | null>(null)
  const marqueeRef = useRef<HTMLDivElement | null>(null)

  const toolbarOffset = useToolbarOffset()

  // Chain-Guards
  const unlinkingRef = useRef<boolean>(false)

  // Orphan-Scrub aus Layer-Bridge
  const scrubCanvasOrphansRef = useRef<() => void>(() => {})

  /* -------------------- Orientierung & Artboard -------------------- */

  const orientation = useAppStore((s) => s.ui.orientation)
  const AB = useMemo(
    () =>
      orientation === 'landscape'
        ? { w: ARTBOARD.h, h: ARTBOARD.w }
        : { w: ARTBOARD.w, h: ARTBOARD.h },
    [orientation],
  )

  const orientationRef = useRef<typeof orientation>(orientation)
  useEffect(() => {
    orientationRef.current = orientation
  }, [orientation])

  /* -------------------- PDF Export / Print -------------------- */

  const onExportPdf = useCallback(() => {
    const cv = fabricRef.current
    if (!cv) return
    const currentOrientation = orientationRef.current
    void saveCanvasAsPdf({
      canvas: cv,
      orientation: currentOrientation,
      filename: EXPORT_BASENAME,
    })
  }, [])

  const onPrint = useCallback(() => {
    const cv = fabricRef.current
    if (!cv) return
    const currentOrientation = orientationRef.current
    printCanvasPdf({
      canvas: cv,
      orientation: currentOrientation,
      filename: EXPORT_BASENAME,
    })
  }, [])

  /* -------------------- Pan/Zoom State -------------------- */

  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const baseZoomRef = useRef<number>(1)
  const prevZoomRef = useRef<number>(1)

  /* -------------------- Store Hooks -------------------- */

  const ui = useAppStore((s) => s.ui)
  const uiSetTool = useAppStore((s) => s.uiSetTool)
  const setSelection = useAppStore(
    (s) => (s as unknown as { setSelection: (ids: string[]) => void }).setSelection,
  )
  const clearSelection = useAppStore(
    (s) => (s as unknown as { clearSelection: () => void }).clearSelection,
  )

  const viewZoom = useAppStore((s) => s.view.zoom)

const upsertElement = useAppStore(
    (s) => (s as unknown as { upsertElement: (el: ElementModel) => void }).upsertElement,
  )
  const removeElement = useAppStore(
    (s) =>
      (s as unknown as { removeElement: (id: string, force?: boolean) => void }).removeElement,
  )

  const setVisibleStore = useAppStore(
    (s) => (s as unknown as { setVisible?: (id: string, v: boolean) => void }).setVisible,
  )
  const renameElement = useAppStore(
    (s) => (s as unknown as { renameElement?: (id: string, name: string) => void }).renameElement,
  )

const getNextZIndex = useCallback((): number => {
  const canvas = fabricRef.current
  const elements = useAppStore.getState().elements
  
  // Höchster z-Wert aus Store
  const maxStoreZ = Math.max(0, ...Object.values(elements).map(el => (el as ElementModel).z ?? 0))
  
  // Canvas-Objektanzahl als Fallback (falls z-Werte fehlen)
  const canvasSize = canvas ? canvas.getObjects().length : 0
  
  // Nimm das Maximum von beiden + 1
  return Math.max(maxStoreZ, canvasSize) + 1
}, [])

const unlinkChainParts = useAppStore(
  (s) =>
    (s as unknown as {
      unlinkChainParts: (chainId: string, partIds: string[]) => void
    }).unlinkChainParts,
)

// ✅ Config ist VOLLSTÄNDIG stabil
const historyConfigRef = useRef({
  getCanvas: () => fabricRef.current,
  updateGeom: (id: string, geom: ElementModel['geom']) => {
    useAppStore.getState().updateGeom(id, geom)
  },
  upsertElement: (el: ElementModel) => {
    useAppStore.getState().upsertElement(el)
  },
  removeElement: (id: string) => {
    useAppStore.getState().removeElement(id)
  },
})

const history = useCanvasHistory(historyConfigRef.current)

/* -------------------- Text / Tools / Overlays -------------------- */

  const {
    textCfg,
    setTextCfg,
    handleTextOk,
    handleTextCancel,
    pendingTextRef,
  } = useCanvasTextTool({
    fabricRef,
    uiTool: ui.tool,
    uiSetTool,
    setSelection,
    upsertElement,
    history,
  })

  const [fillCfg, setFillCfg] = useState<FillCfg>({
    color: useAppStore.getState().ui.fill.color,
  })

  // 🔥 NEU: RoadInspector State
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [inspectorRoad, setInspectorRoad] = useState<SmartRoad | null>(null)
  const [inspectorConfig, setInspectorConfig] = useState<SmartRoadConfig | null>(null)

// 🔥 RoadInspector Update-Handler
const handleRoadUpdate = useCallback((newConfig: SmartRoadConfig, preserveSize?: boolean) => {
  const road = inspectorRoad
  if (!road) return

  // 🔥 WICHTIG: Deep Copy der Config, nicht nur Referenz!
  road.roadConfig = JSON.parse(JSON.stringify(newConfig))

  road.regenerate(preserveSize ?? true).then(() => {  // ← Parameter weitergeben!
    const canvas = fabricRef.current
    if (canvas) {
      
      // 🔥 NEU: Nach Regeneration neu skalieren (formfüllend!)
      const data = (road as ObjWithData).data
      const subcategory = data?.subcategory as SubcategoryId | undefined
      
      // 🔥 WICHTIG: SmartRoad NICHT nochmal skalieren - regenerate() hat das bereits gemacht!
      if (subcategory && data?.kind !== 'smart-road') {
        resizeToSubcategoryDefault(road, subcategory)
      }
      
      canvas.requestRenderAll()

      // Store updaten
      if (data?.id) {
        const el = useAppStore.getState().elements[data.id as string]
        if (el) {
          useAppStore.getState().upsertElement({
            ...el,
            geom: {
              ...el.geom,
              width: newConfig.width,
              height: newConfig.length,
            },
          } as ElementModel)
        }
      }
    }
  }).catch(err => {
    console.error('[RoadInspector] Regenerate failed', err)
  })

  // Config-State updaten
  setInspectorConfig(newConfig)
}, [inspectorRoad])

  useEffect(() => {
    if (ui.tool === 'fill') {
      setFillCfg({ color: useAppStore.getState().ui.fill.color })
    }
  }, [ui.tool])

  const objectsMode = (ui as { objectsMode?: string }).objectsMode as
    | 'line'
    | 'arrow-end'
    | 'arrow-both'
    | 'arrow-curve'
    | 'rect'
    | 'ellipse'
    | 'triangle'
    | undefined

  const tool = ui.tool

  // Clipboard
  useCanvasClipboard(clipCanvas, {
  upsertElement,
  getNextZIndex,
})

  // Shapes
  const { cancelTempShape } = useCanvasObjectsTool({
    fabricRef,
    uiTool: tool,
    objectsMode,
    uiSetTool,
  })

// Pen
useCanvasPenTool({
  fabricRef,
  uiTool: tool,
  strokeWidth: ui.pen.strokeWidth,
  color: ui.pen.color,
  history,  // ← HIER hinzufügen
})

  // Eraser
  useCanvasEraserTool({
    fabricRef,
    uiTool: tool,
  })

  // Fill
  useCanvasFillTool({
    fabricRef,
    uiTool: tool,
    history,
  })

  // Shortcuts
useCanvasKeyboardShortcuts({
  fabricRef,
  pendingTextRef,
  cancelTempShape,
  history,  // 🔥 NEU
})

  useEffect(() => {
    void preloadPdfMake()
  }, [])

  /* =============================================================================
     Pan/Zoom / Layout
     ========================================================================== */

  const computeBaseZoom = useCallback(() => {
    const host = innerRef.current
    if (!host) return 1
    const availW = Math.max(0, host.clientWidth - VIEW_PADDING * 2)
    const availH = Math.max(0, host.clientHeight - VIEW_PADDING * 2)
    const zx = availW / AB.w
    const zy = availH / AB.h
    return Math.max(0.01, Math.min(zx, zy))
  }, [AB.w, AB.h])

  const updateStageScale = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const scale = baseZoomRef.current * useAppStore.getState().view.zoom
    const { x, y } = panRef.current
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
    stage.style.transformOrigin = 'top left'
  }, [])

  const spaceHandActiveRef = useSpaceHandPan({
    fabricRef,
    stageRef,
    panRef,
    updateStageScale,
  })

  // Touch-Pan für Mobile
useTouchPan({
  stageRef,
  panRef,
  updateStageScale,
  enabled: true,
})

  useWheelZoom({
    scrollRef,
    spaceHandActiveRef,
  })

  const firstLayoutRef = useRef(true)

  const resetToDefaultView = useCallback(() => {
    const host = innerRef.current
    if (!host) return
    const scale = baseZoomRef.current
    const contentW = AB.w * scale
    const contentH = AB.h * scale
    const leftGutter = Math.max(VIEW_PADDING, (host.clientWidth - contentW) / 2)
    const topGutter = Math.max(VIEW_PADDING, (host.clientHeight - contentH) / 2)
    panRef.current = { x: leftGutter, y: topGutter }
    updateStageScale()
  }, [AB.w, AB.h, updateStageScale])

  const applyCrispRetina = useCallback(() => {
    const cv = fabricRef.current
    if (!cv) return

    const absScale = baseZoomRef.current * useAppStore.getState().view.zoom
    if (cv instanceof CrispCanvas) {
      cv.setRetinaZoomFactor(absScale)
      cv.setDimensions({ width: AB.w, height: AB.h })
      cv.calcOffset()
      cv.requestRenderAll()
    }
  }, [AB.w, AB.h])

  // Base-Zoom + Layout bei Resize
  useEffect(() => {
    const host = innerRef.current
    if (!host) return

    const apply = () => {
      const oldAbs = baseZoomRef.current * useAppStore.getState().view.zoom
      baseZoomRef.current = computeBaseZoom()
      const newAbs = baseZoomRef.current * useAppStore.getState().view.zoom

      if (firstLayoutRef.current) {
        firstLayoutRef.current = false
        resetToDefaultView()
        applyCrispRetina()
        return
      }

      if (useAppStore.getState().view.zoom === 1) {
        resetToDefaultView()
        applyCrispRetina()
        return
      }

      const cx = AB.w / 2
      const cy = AB.h / 2
      panRef.current.x += (oldAbs - newAbs) * cx
      panRef.current.y += (oldAbs - newAbs) * cy
      updateStageScale()
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(host)
    return () => ro.disconnect()
  }, [computeBaseZoom, updateStageScale, resetToDefaultView, applyCrispRetina, AB.w, AB.h])

  // Programm-Zoom (Buttons/Shortcuts)
  useEffect(() => {
    const base = baseZoomRef.current
    const oldRel = prevZoomRef.current
    const newRel = viewZoom

    if (newRel === 1) {
      resetToDefaultView()
      applyCrispRetina()
      prevZoomRef.current = newRel
      return
    }

    const oldAbs = base * oldRel
    const newAbs = base * newRel

    const cx = AB.w / 2
    const cy = AB.h / 2
    panRef.current.x += (oldAbs - newAbs) * cx
    panRef.current.y += (oldAbs - newAbs) * cy

    updateStageScale()
    applyCrispRetina()
    prevZoomRef.current = newRel
  }, [viewZoom, updateStageScale, resetToDefaultView, applyCrispRetina, AB.w, AB.h])

  // Orientation-Wechsel: Canvas neu dimensionieren + zentrieren
  useEffect(() => {
    const cv = fabricRef.current
    if (!cv) return

    cv.setDimensions({ width: AB.w, height: AB.h })
    cv.requestRenderAll()

    baseZoomRef.current = computeBaseZoom()
    resetToDefaultView()
    applyCrispRetina()
  }, [orientation, computeBaseZoom, resetToDefaultView, applyCrispRetina, AB.w, AB.h])

  /* =============================================================================
     Tool-abhängige Interaktion (Cursor, Meta, Objekte-Tool)
     ========================================================================== */

  // Objects-Tool: alle normalen Objekte interaktionslos
  useEffect(() => {
    const cv = fabricRef.current
    if (!cv) return

    const isObjectsTool = ui.tool === 'objects'
    const saved = new WeakMap<FabricObject, { selectable: boolean; evented: boolean }>()

    if (isObjectsTool) {
      cv.discardActiveObject()
      cv.selection = false
      cv.skipTargetFind = true

      cv.getObjects().forEach((o) => {
        if (isMetaOverlay(o)) return
        saved.set(o, { selectable: o.selectable, evented: o.evented })
        o.selectable = false
        o.evented = false
        o.setCoords()
      })

      cv.requestRenderAll()
    }

    return () => {
      if (!cv) return
      cv.getObjects().forEach((o) => {
        const s = saved.get(o)
        if (s) {
          o.selectable = s.selectable
          o.evented = s.evented
          o.setCoords()
        }
      })
      cv.selection = true
      cv.skipTargetFind = false
      cv.requestRenderAll()
    }
  }, [ui.tool])

  // Cursor
  useEffect(() => {
    const canvas = fabricRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    applyCursorForTool(canvas, ui.tool as ToolId)
    stage.style.cursor = ''
  }, [ui.tool])

  // Meta-Overlays: im Select-Tool transformierbar, im Fill-Tool hitbar
  useEffect(() => {
    const cv = fabricRef.current
    if (!cv) return

    const enableDrag = ui.tool === 'select'
    const enableFillHit = ui.tool === 'fill'

    cv.getObjects().forEach((o) => {
      if (!isMetaOverlay(o)) return

      if (o instanceof Textbox) o.editable = false

      o.set({
        selectable: enableDrag,
        hasControls: enableDrag,
        hasBorders: enableDrag,
        lockMovementX: !enableDrag,
        lockMovementY: !enableDrag,
        lockScalingX: !enableDrag,
        lockScalingY: !enableDrag,
        lockRotation: !enableDrag,
        evented: enableDrag || enableFillHit,
        hoverCursor: enableDrag ? 'move' : '',
        moveCursor: enableDrag ? 'move' : '',
        perPixelTargetFind: false,
      })
      o.setCoords()
    })

    const a = cv.getActiveObject()
    if (!enableDrag && a && isMetaOverlay(a)) {
      cv.discardActiveObject()
    }

    cv.requestRenderAll()
  }, [ui.tool])

  // Klick außerhalb des Canvas → Auswahl aufheben
  useEffect(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      const stage = stageRef.current
      const canvas = fabricRef.current
      if (!stage || !canvas) return

      const target = e.target as HTMLElement
      if (stage.contains(target)) return

      const interactive = target.closest(
        'input, textarea, select, button, [contenteditable="true"], [data-prevent-clear-selection]',
      )
      if (interactive) return

      canvas.discardActiveObject()
      useAppStore.getState().clearSelection()
      canvas.requestRenderAll()
    }

    document.addEventListener('pointerdown', onDocPointerDown, {
      capture: false,
      passive: true,
    })
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [])

  /* =============================================================================
     Koordinaten / Viewport-Center / Bild-Import
     ========================================================================== */

  const clientToCanvasXY = useCallback(
    (clientX: number, clientY: number, stageEl: HTMLDivElement) => {
      const rect = stageEl.getBoundingClientRect()
      const scale = baseZoomRef.current * useAppStore.getState().view.zoom
      const x = (clientX - rect.left) / scale
      const y = (clientY - rect.top) / scale
      return {
        x: Math.max(0, Math.min(AB.w, x)),
        y: Math.max(0, Math.min(AB.h, y)),
      }
    },
    [AB.w, AB.h],
  )

  const viewportCenterRef = useRef<() => { cx: number; cy: number }>(() => ({
    cx: AB.w / 2,
    cy: AB.h / 2,
  }))

  useEffect(() => {
    viewportCenterRef.current = () => {
      const sc = scrollRef.current
      const stage = stageRef.current
      if (!sc || !stage) return { cx: AB.w / 2, cy: AB.h / 2 }

      const r = sc.getBoundingClientRect()
      const clientX = r.left + r.width / 2
      const clientY = r.top + r.height / 2

      const { x, y } = clientToCanvasXY(clientX, clientY, stage)
      return { cx: x, cy: y }
    }
  }, [AB.w, AB.h, clientToCanvasXY])

  const getViewportCenterInCanvasCoords = useCallback((): { cx: number; cy: number } => {
    return viewportCenterRef.current()
  }, [])

  const onImportImage = useCallback((): void => {
    const canvas = fabricRef.current
    if (!canvas) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg'
    input.style.position = 'fixed'
    input.style.left = '-9999px'
    document.body.appendChild(input)

    const dispose = () => {
      input.value = ''
      input.remove()
    }

    input.onchange = () => {
      const file = input.files?.[0]
      dispose()
      if (!file) return
      if (!(file.type === 'image/png' || file.type === 'image/jpeg')) return

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const imgEl = new window.Image()
        imgEl.onload = () => {
          const { cx, cy } = getViewportCenterInCanvasCoords()

          const fo = new FabricImage(imgEl, {
            left: cx,
            top: cy,
            originX: 'center',
            originY: 'center',
          })

          const maxW = ARTBOARD.w * 0.8
          const maxH = ARTBOARD.h * 0.8
          const s = Math.min(maxW / imgEl.naturalWidth, maxH / imgEl.naturalHeight, 1)
          fo.set({ scaleX: s, scaleY: s })

          ;(fo as ObjWithData).data = {
            ...(fo as ObjWithData).data,
            id: uid('img'),
            name: `Bild: ${file.name}`,
            kind: 'image',
            source: 'upload',
          }
          ensureId(fo)
          setName(fo, `Bild: ${file.name}`)
          canvas.add(fo)
          canvas.setActiveObject(fo)
          canvas.requestRenderAll()
        }
        imgEl.src = dataUrl
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }, [getViewportCenterInCanvasCoords])

  useMarqueeSelection({
    clipCanvas,
    stageRef,
    marqueeRef,
    clientToCanvasXY,
    spaceHandActiveRef,
    orientation,
  })

  /* =============================================================================
     Library-Drops / Quick-Insert
     ========================================================================== */

const placeAssetAt = useCallback(
  async (assetId: string, x: number, y: number): Promise<void> => {
    const canvas = fabricRef.current
    if (!canvas) return

    const asset = findAssetById(assetId)
    if (!asset) return

// 🔥 SmartRoad-Handling
if (asset.isSmartRoad && asset.roadTemplate) {
  try {
    const smartRoad = new SmartRoad(
      asset.roadTemplate.templateKey,
      asset.roadTemplate.defaultConfig,
      {
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
      }
    )

    // Initialisieren (generiert SVG)
    await smartRoad.initialize()

    // 🔥 NEU: Position nochmal setzen (wird beim initialize() überschrieben)
    smartRoad.set({
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
    })

    // 🔥 SmartRoad macht eigene Skalierung in initialize() auf 800px
    // resizeToSubcategoryDefault wird NICHT aufgerufen!
    // resizeToSubcategoryDefault(smartRoad, asset.subcategory)

    // Metadaten setzen
    const patch: Record<string, unknown> = {
      id: uid('road'),
      name: asset.label,
      subcategory: asset.subcategory,
      kind: 'smart-road',
      source: 'library',
      assetId,
      z: getNextZIndex(),
      roadConfig: asset.roadTemplate.defaultConfig,
      templateKey: asset.roadTemplate.templateKey,
    }
    setData(smartRoad, patch)
    ensureId(smartRoad)
    setName(smartRoad, asset.label)

    canvas.add(smartRoad)
    canvas.bringObjectToFront(smartRoad)

    // Im Store speichern
    const smartRoadData = (smartRoad as ObjWithData).data
    const smartRoadId = smartRoadData?.id as string | undefined
    const zIndex = typeof smartRoadData?.z === 'number' ? smartRoadData.z : 0
    if (smartRoadId) {
      setTimeout(() => {
        const el = useAppStore.getState().elements[smartRoadId]
        if (el) {
          useAppStore.getState().upsertElement({
            ...el,
            z: zIndex
          } as ElementModel)
        }
      }, 0)
    }

    canvas.setActiveObject(smartRoad)
    canvas.requestRenderAll()
    return
  } catch (err) {
    console.error('[SmartRoad] Platzierung fehlgeschlagen', err)
    return
  }
}

    // Bestehender Code für normale SVGs...
    if (asset.kind === 'svg') {
        try {
          const { objects, options } = await loadSVGFromString(asset.source)
          const valid = objects.filter((o): o is FabricObject => o !== null)
          if (!valid.length) return

          const node: FabricObject =
            valid.length === 1 ? valid[0] : util.groupSVGElements(valid, options ?? {})

node.set({ left: x, top: y, originX: 'center', originY: 'center' })

let parsed = null as ReturnType<typeof parseRoadConnectorsFromSvg> | null

// Parse Connectors für Straßen
if (isRoadSubcategory(asset.subcategory)) {
  parsed = parseRoadConnectorsFromSvg(asset.source)
}
          const rootIdRaw = getSvgRootId(asset.source)
          const rootIdNorm = (() => {
            const raw = (rootIdRaw ?? '').trim().toLowerCase()
            if (!raw) return undefined
            if (/^(car|pkw)/.test(raw)) return 'car'
            if (/^(truck|lkw)/.test(raw)) return 'truck'
            if (/^bus/.test(raw)) return 'bus'
            return raw
          })()

const patch: Record<string, unknown> = {
  id: uid('svg'),
  name: asset.label,
  subcategory: asset.subcategory,
  kind: 'svg',
  source: 'library',
  assetId,
  z: getNextZIndex(),  // ← NEU HINZUFÜGEN
}

if (parsed) patch.svgConnectors = parsed


          if (rootIdNorm) {
            patch.svgRootId = rootIdNorm
            // Prüfe ob es ein Fahrzeug ist (alle beginnen mit 'fz_')
if (asset.subcategory.startsWith('fz_')) {
  patch.vehicleSubtypeHint = rootIdNorm
}
          }
          setData(node, patch)

    resizeToSubcategoryDefault(node, asset.subcategory)

// Prüfe ob es ein Fahrzeug ist
if (asset.subcategory.startsWith('fz_')) {
  annotateVehicleOnDrop(node)
}

ensureId(node)
setName(node, asset.label)

canvas.add(node)
canvas.bringObjectToFront(node)

// 🔥 Sofort im Store speichern mit z-Wert
const nodeData = (node as ObjWithData).data
const nodeId = nodeData?.id as string | undefined
const zIndex = typeof nodeData?.z === 'number' ? nodeData.z : 0
if (nodeId) {
  setTimeout(() => {
    const el = useAppStore.getState().elements[nodeId]
    if (el) {
      useAppStore.getState().upsertElement({
        ...el,
        z: zIndex
      } as ElementModel)
    }
  }, 0)
}

canvas.setActiveObject(node)
canvas.requestRenderAll()
          return
        } catch (err) {
          console.error('SVG parse failed', err)
          return
        }
      }

      // Bild aus Library
      const imgEl = new window.Image()
      imgEl.src = asset.source
      imgEl.onload = () => {
        const fo = new FabricImage(imgEl, {
          left: x,
          top: y,
          originX: 'center',
          originY: 'center',
        })

const patch: Record<string, unknown> = {
  id: uid('img'),
  name: asset.label,
  subcategory: asset.subcategory,
  kind: 'image',
  source: 'library',
  assetId,
  z: getNextZIndex(),  // ← NEU HINZUFÜGEN
}
        setData(fo, patch)

resizeToSubcategoryDefault(fo, asset.subcategory)
ensureId(fo)
setName(fo, asset.label)

canvas.add(fo)
canvas.bringObjectToFront(fo)

// 🔥 Sofort im Store speichern mit z-Wert
const foData = (fo as ObjWithData).data
const foId = foData?.id as string | undefined
const zIndex = typeof foData?.z === 'number' ? foData.z : 0
if (foId) {
  setTimeout(() => {
    const el = useAppStore.getState().elements[foId]
    if (el) {
      useAppStore.getState().upsertElement({
        ...el,
        z: zIndex
      } as ElementModel)
    }
  }, 0)
}

canvas.setActiveObject(fo)
canvas.requestRenderAll()
      }
    },
    [getNextZIndex], 
  )

  /* =============================================================================
     Fabric-Init & Event-Bridge (inkl. History)
     ========================================================================== */

  useEffect(() => {
    if (!canvasEl.current) return

const canvas = new CrispCanvas(canvasEl.current, {
  backgroundColor: '#FFFFFF',
  selection: true,
  preserveObjectStacking: true,
  // 🔥 Touch-Support aktivieren
  allowTouchScrolling: false,
  stopContextMenu: true,
})

// Touch-Gesten für Fabric aktivieren
canvas.enableRetinaScaling = true

// Touch-Events explizit aktivieren (Fabric 6)
if ('ontouchstart' in window) {
  canvas.upperCanvasEl.addEventListener('touchstart', (e: TouchEvent) => {
    // Verhindere default nur wenn auf Canvas-Objekt getippt
    const touch = e.touches[0]
    if (!touch) return
    
    // Fabric's getPointer braucht das originale Event
    const pointer = canvas.getPointer(e)
    
    // Prüfe ob selektierbares Objekt unter Touch-Punkt
    const objects = canvas.getObjects()
    const hasSelectableObject = objects.some(obj => {
      if (!obj.selectable) return false
      try {
        return obj.containsPoint(pointer)
      } catch {
        return false
      }
    })
    
    if (hasSelectableObject) {
      e.preventDefault()
    }
  }, { passive: false })
}

    fabricRef.current = canvas

    canvas.selectionColor = 'rgba(37,99,235,0.12)'
    canvas.selectionBorderColor = 'rgba(37,99,235,0.9)'
    canvas.selectionLineWidth = 1
    canvas.selectionDashArray = [4, 3]

    setClipCanvas(canvas)
    attachCtrlMultiSelect(canvas)

    // Anti-Blur / Caching
    canvas.enableRetinaScaling = true

// Shift-Taste: 90°-Rotation aktivieren
const handleRotating = (e: { target?: FabricObject; e?: PointerEvent | MouseEvent | TouchEvent }) => {
  const obj = e.target
  if (!obj) return
  
  const shiftPressed = e.e?.shiftKey === true
  
  if (shiftPressed) {
    const angle = obj.angle ?? 0
    const snapped = Math.round(angle / 90) * 90
    obj.set({ angle: snapped })
    obj.setCoords()
  }
}

canvas.on('object:rotating', handleRotating)

    type HasPrototype<T> = { prototype: T }
    const setNoCache = <T extends FabricObject>(ctor: HasPrototype<T>) => {
      ctor.prototype.objectCaching = false
    }

    const PROTOS: Array<HasPrototype<FabricObject>> = [
      Rect as unknown as HasPrototype<FabricObject>,
      Ellipse as unknown as HasPrototype<FabricObject>,
      Triangle as unknown as HasPrototype<FabricObject>,
      Line as unknown as HasPrototype<FabricObject>,
      Path as unknown as HasPrototype<FabricObject>,
      Group as unknown as HasPrototype<FabricObject>,
      Textbox as unknown as HasPrototype<FabricObject>,
      FabricImage as unknown as HasPrototype<FabricObject>,
    ]
    PROTOS.forEach(setNoCache)

    canvas.setDimensions({ width: AB.w, height: AB.h })
    applyCrispRetina()
    canvas.requestRenderAll()

    // Meta-Overlays
    mountMetaOverlays(canvas)

    const applyBaseMetaFlags = (cv: Canvas) => {
      cv.getObjects().forEach((o) => {
        if (!isMetaOverlay(o)) return
        if (o instanceof Textbox) o.editable = false
        o.set({
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          lockScalingX: false,
          lockScalingY: false,
          lockRotation: false,
          perPixelTargetFind: false,
          hasRotatingPoint: true,
          hoverCursor: 'move',
          moveCursor: 'move',
        })
        o.setCoords()
      })
      cv.requestRenderAll()
    }

applyBaseMetaFlags(canvas)
enforceMetaOverlayPaint(canvas)

// 🔥 ATTACH HISTORY AFTER CANVAS IS READY
history.attach()



    // ==============================
    // Fabric-6 Event-Helfer
    // ==============================

    /* ---------- Selection → Store ---------- */

    const handleSelChange = () => {
      if (unlinkingRef.current) return
      const ids = canvas
        .getActiveObjects()
        .map(getId)
        .filter((x): x is string => !!x)
      if (ids.length) setSelection(ids)
      else clearSelection()
    }
    canvas.on('selection:created', handleSelChange)
    canvas.on('selection:updated', handleSelChange)
    canvas.on('selection:cleared', handleSelChange)


    /* ---------- Leerer Klick auf Canvas → Auswahl löschen ---------- */

    const onCanvasBackgroundClick = (opt: unknown) => {
      if (useAppStore.getState().ui.tool !== 'select') return
      const ev = opt as { target?: FabricObject | null } | null
      const target = ev?.target ?? null
      if (target) return
      canvas.discardActiveObject()
      useAppStore.getState().clearSelection()
      canvas.requestRenderAll()
    }
   /* ---------- Doppelklick auf SmartRoad → Inspector öffnen ---------- */

    const handleObjectDblClick = (opt: unknown) => {
      const ev = opt as { target?: FabricObject } | null
      const target = ev?.target


      if (!target) return

      // Prüfe ob es eine SmartRoad ist
      if (target instanceof SmartRoad) {
        const road = target as SmartRoad
        setInspectorRoad(road)
        setInspectorConfig({ ...road.roadConfig })
        setInspectorOpen(true)
      }
    }

    canvas.on('mouse:dblclick', handleObjectDblClick)


/* ---------- Cleanup ---------- */

return () => {
  canvas.off('object:rotating', handleRotating)
  canvas.off('mouse:down', onCanvasBackgroundClick)
  canvas.off('mouse:dblclick', handleObjectDblClick)  // ← NEU
  canvas.off('selection:created', handleSelChange)
  canvas.off('selection:updated', handleSelChange)
  canvas.off('selection:cleared', handleSelChange)

  unmountMetaOverlays(canvas)
  setClipCanvas(null)
  canvas.dispose()
  fabricRef.current = null
}

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  clearSelection,
  setSelection,
]) 

  /* =============================================================================
     Canvas-Layer-Bridge (Store ↔ Fabric) + Orphan-Scrub
     ========================================================================== */

  const { scrubCanvasOrphans } = useCanvasLayerBridge({
    fabricRef,
    getViewportCenterInCanvasCoords,
    placeAssetAt,
    setSelection,
    clearSelection,
    removeElement,
    renameElement,
    setVisibleStore,
    unlinkChainParts,
    history,
    unlinkingRef,
  })

  useEffect(() => {
    scrubCanvasOrphansRef.current = scrubCanvasOrphans
  }, [scrubCanvasOrphans])

  /* =============================================================================
     Window-Events (PDF, Print, Image Import)
     ========================================================================== */

  useEffect(() => {
    window.addEventListener('app:export-pdf', onExportPdf)
    window.addEventListener('app:print', onPrint)
    window.addEventListener('app:import-image', onImportImage)

    return () => {
      window.removeEventListener('app:export-pdf', onExportPdf)
      window.removeEventListener('app:print', onPrint)
      window.removeEventListener('app:import-image', onImportImage)
    }
  }, [onExportPdf, onPrint, onImportImage])

  /* =============================================================================
     DnD-Setup
     ========================================================================== */

const [, dropRef] = useDrop<LibDragItem, void, unknown>(
  () => ({
    accept: DND_ITEM_LIB,
    drop: (item, monitor) => {
      const client = monitor.getClientOffset()
      const stage = stageRef.current
      if (!client || !stage) return

      const { x, y } = clientToCanvasXY(client.x, client.y, stage)
      void placeAssetAt(item.assetId, x, y)

      try {
        ;(useAppStore.getState() as unknown as { bumpRecent?: (id: string) => void }).bumpRecent?.(
          item.assetId,
        )
      } catch {
        // no-op
      }

// 🔥 NEU: Drawer schließen nach Drop
      const store = useAppStore.getState()
      if (store.uiSetActiveCategory) {
        store.uiSetActiveCategory(null)
      }

      // 🔥 NEU: Mobile Drawers auch schließen
      window.dispatchEvent(new CustomEvent('app:close-mobile-drawers'))
    },
  }),
  [clientToCanvasXY, placeAssetAt],
)

/* =============================================================================
     Road-Snapping & Chains
     ========================================================================== */

useRoadSnapping()

  /* =============================================================================
     Render
     ========================================================================== */

  return (
    <div
      ref={scrollRef}
      className="w-full h-full overflow-auto relative bg-[var(--panel-elev)]"
      style={{ paddingBottom: 'var(--toolbar-safe)' }}
    >
      <div
        ref={innerRef}
        className="w-full h-full"
        style={{ padding: VIEW_PADDING, position: 'relative' }}
      >
        <div
          ref={(node) => {
            stageRef.current = node
            dropRef(node as HTMLDivElement | null)
          }}
          className="absolute top-0 left-0 shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-[2px] bg-white"
          style={{ width: AB.w, height: AB.h, willChange: 'transform' }}
        >
          <canvas ref={canvasEl} width={AB.w} height={AB.h} className="block rounded-[2px]" />

          <div
            ref={marqueeRef}
            className="pointer-events-none"
            style={{
              position: 'absolute',
              display: 'none',
              zIndex: 9999,
              border: '1px dashed rgba(37,99,235,0.9)',
              background: 'rgba(37,99,235,0.12)',
              boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.25)',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>

      {ui.tool === 'pen' && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{ bottom: toolbarOffset }}
        >
          <PenOverlay
            value={{ strokeWidth: ui.pen.strokeWidth, color: ui.pen.color }}
            onChange={(v) => useAppStore.getState().uiSetPen(v)}
            onClose={() => uiSetTool('select')}
          />
        </div>
      )}

      {ui.tool === 'text' && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{ bottom: toolbarOffset }}
        >
          <TextEditorOverlay
            value={textCfg}
            onChange={(v) => setTextCfg((old) => ({ ...old, ...v }))}
            onOk={handleTextOk}
            onCancel={handleTextCancel}
          />
        </div>
      )}

      {ui.tool === 'objects' && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{ bottom: toolbarOffset }}
        >
          <ObjectsPopover />
        </div>
      )}

      {ui.tool === 'fill' && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{ bottom: toolbarOffset }}
        >
          <FillOverlay
            value={fillCfg}
            onChange={(v) => {
              const next = { ...fillCfg, ...v }
              setFillCfg(next)
              useAppStore.getState().uiSetFill({ color: next.color })
            }}
            onClose={() => uiSetTool('select')}
          />
        </div>
      )}
      {/* 🔥 NEU: VisualRoadInspector oder VisualCurveInspector basierend auf shape */}
      {inspectorOpen && inspectorConfig && (
        inspectorConfig.shape === 'curve' ? (
          <VisualCurveInspector
            open={inspectorOpen}
            config={inspectorConfig}
            onClose={() => setInspectorOpen(false)}
            onUpdate={handleRoadUpdate}
          />
        ) : (
          <VisualRoadInspector
            open={inspectorOpen}
            config={inspectorConfig}
            onClose={() => setInspectorOpen(false)}
            onUpdate={handleRoadUpdate}
          />
        )
      )}
    </div>
  )
}

export default CanvasArea
export { CanvasArea }