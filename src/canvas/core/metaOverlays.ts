// src/canvas/core/metaOverlays.ts
import {
  Textbox,
  Text,
  Line,
  Rect,
  type Canvas,
  type FabricObject,
} from 'fabric'

/** -------- Layout-Konfig -------- */
const TOP_MARGIN = 24
const LEFT_MARGIN = 24
const BOTTOM_MARGIN = 24
const AGENT_LINE_GAP = 6

// HIER anpassen:
const HEADER_HEIGHT = 96
const HEADER_PADDING_X = 12
const HEADER_PADDING_Y = 12


/** Einheitliche Meta-Farbe (Theme-unabhängig, wie in CanvasArea erzwungen) */
const META_COLOR = '#000000'

/** Daten-Marker, damit Layer-Manager/Store diese Objekte ignorieren kann */
type MetaKind =
  | 'header_frame'
  | 'header_left_dep'
  | 'header_left_unit'
  | 'header_left_label'
  | 'header_left_case'
  | 'header_right'
  | 'header_title'
  | 'agent_text'
  | 'agent_line'

type MetaFlag = { metaOverlay: true; metaKind: MetaKind }

type MetaTextObj = (Textbox | Text) & { data?: Partial<MetaFlag> }
type MetaLineObj = Line & { data?: Partial<MetaFlag> }
type MetaRectObj = Rect & { data?: Partial<MetaFlag> }

/** Minimale Event-API (ohne any) */
type ObjWithEvents = FabricObject & {
  on: (eventName: string, handler: (opt: object) => void) => void
  off: (eventName: string, handler: (opt: object) => void) => void
}

/** Interner Zustand */
type MetaState = {
  headerFrame: MetaRectObj | null
  headerLeftDep: MetaTextObj | null
  headerLeftUnit: MetaTextObj | null
  headerLeftLabel: MetaTextObj | null
  headerLeftCase: MetaTextObj | null
  headerRight: MetaTextObj | null
  headerTitle: MetaTextObj | null
  agentText: MetaTextObj | null
  agentLine: MetaLineObj | null
  raw: {
    title?: string
    department?: string
    unit?: string
    caseNumber?: string
    agent?: string
    dateISO?: string
    street?: string
    zip?: string
    city?: string
    stationPhone?: string
  }
  headerLastLeft?: number
  headerLastTop?: number

  // NEU: letzte Canvas-Größe merken
  canvasWidth?: number
  canvasHeight?: number

  handlers: {
    txtMoving?: (opt: object) => void
    txtModified?: (opt: object) => void
    objectMoving?: (opt: unknown) => void
    objectAdded?: (opt: unknown) => void
    objectRemoved?: (opt: unknown) => void
    onAppReorderZ?: () => void
    onMetaUpdate?: (ev: Event) => void
    onMetaRequest?: (ev: Event) => void
    onMouseDownAgent?: (opt: object) => void
    onSelCreated?: (opt: unknown) => void
    onSelUpdated?: (opt: unknown) => void
    headerMoving?: (opt: object) => void

    // NEU:
    onFormatToggle?: () => void
  }

}

const stateByCanvas = new WeakMap<Canvas, MetaState>()

export function isMetaOverlay(o: FabricObject): boolean {
  const d = (o as { data?: Partial<MetaFlag> }).data
  return !!d?.metaOverlay
}

/** Canvas-Fallback-Typ für z-Funktionen */
type CanvasWithZFns = Canvas & {
  bringToFront?: (o: FabricObject) => void
  moveTo?: (o: FabricObject, index: number) => void
  _objects?: FabricObject[]
}

/** Robust nach vorne holen (v6-sicher) */
function bringToFront(canvas: Canvas, obj: FabricObject): void {
  const c = canvas as CanvasWithZFns

  if (typeof c.bringToFront === 'function') {
    c.bringToFront(obj)
    ;(obj as { dirty?: boolean }).dirty = true
    return
  }

  const list = (c._objects ?? (canvas.getObjects() as FabricObject[]))
  const idx = list.indexOf(obj)
  if (idx === -1) return

  if (typeof c.moveTo === 'function') {
    c.moveTo(obj, list.length - 1)
    ;(obj as { dirty?: boolean }).dirty = true
    return
  }

  list.splice(idx, 1)
  list.push(obj)
  ;(obj as { dirty?: boolean }).dirty = true
}

function promoteAll(canvas: Canvas, st: MetaState): void {
  if (st.headerFrame) bringToFront(canvas, st.headerFrame)
  if (st.headerLeftDep) bringToFront(canvas, st.headerLeftDep)
  if (st.headerLeftUnit) bringToFront(canvas, st.headerLeftUnit)
  if (st.headerLeftLabel) bringToFront(canvas, st.headerLeftLabel)
  if (st.headerLeftCase) bringToFront(canvas, st.headerLeftCase)
  if (st.headerRight) bringToFront(canvas, st.headerRight)
  if (st.headerTitle) bringToFront(canvas, st.headerTitle)
  if (st.agentLine) bringToFront(canvas, st.agentLine)
  if (st.agentText) bringToFront(canvas, st.agentText)
}

/* -------------------- CSS-Var Utilities -------------------- */

function readCssVarRaw(name: string): string {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name) || ''
  } catch {
    return ''
  }
}

function resolvePx(value: string, fallbackPx: number): number {
  const v = value.trim()
  if (!v) return fallbackPx
  if (v.endsWith('rem')) {
    const rem = parseFloat(v)
    const rootPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize || '16') ||
      16
    const px = rem * rootPx
    return Number.isFinite(px) && px > 0 ? px : fallbackPx
  }
  if (v.endsWith('px')) {
    const px = parseFloat(v)
    return Number.isFinite(px) && px > 0 ? px : fallbackPx
  }
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : fallbackPx
}

function cssNumberPx(varName: string, fallbackPx: number): number {
  const raw = readCssVarRaw(varName)
  return resolvePx(raw, fallbackPx)
}

/* ----------------------------- Interaktivität ------------------------------ */

function makeAgentInteractive(canvas: Canvas, obj: MetaTextObj): void {
  obj.set({
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
    lockScalingFlip: true,
    lockScalingX: false,
    lockScalingY: false,
    lockRotation: false,
    perPixelTargetFind: false,
    transparentCorners: false,
    cornerSize: 10,
    borderScaleFactor: 1,
  })
  const activate = () => {
    canvas.setActiveObject(obj)
    canvas.requestRenderAll()
  }
  ;(obj as ObjWithEvents).on('mousedown', activate)
  const st = stateByCanvas.get(canvas)
  if (st) {
    st.handlers.onMouseDownAgent = activate
  }
}

/* ------------------- „Enge“ Selektorbox für Textboxen ---------------------- */

function fitMetaTextbox(tb: Textbox, maxW: number, extraPadPx = 2): void {
  const tbi = tb as Textbox & { initDimensions?: () => void; _textLines?: string[] }
  const txt = (tb.text ?? '').toString().trim()

  if (!txt) {
    tb.set({ width: 1 })
    tbi.initDimensions?.()
    tb.setCoords()
    return
  }

  tb.set({ width: 99999 })
  tbi.initDimensions?.()

  let widest = 0
  const lines = Array.isArray(tbi._textLines) ? tbi._textLines.length : 1
  for (let i = 0; i < lines; i++) widest = Math.max(widest, tb.getLineWidth(i))

  const tight = Math.ceil(widest + extraPadPx)
  const finalW = Math.min(Math.max(10, tight), maxW)

  tb.set({ width: finalW })
  tbi.initDimensions?.()
  tb.setCoords()
}

/* --------------------------------- Create --------------------------------- */

function createHeader(canvas: Canvas): {
  frame: MetaRectObj
  leftDep: MetaTextObj
  leftUnit: MetaTextObj
  leftLabel: MetaTextObj
  leftCase: MetaTextObj
  right: MetaTextObj
  titleBelow: MetaTextObj
} {
  const w = canvas.getWidth()
  const headerWidth = Math.max(10, w - 2 * LEFT_MARGIN)

  const frame = new Rect({
    left: LEFT_MARGIN,
    top: TOP_MARGIN,
    width: headerWidth,
    height: HEADER_HEIGHT,
    stroke: META_COLOR,
    strokeWidth: 1,
    fill: '#ffffff',
    originX: 'left',
    originY: 'top',
    selectable: true,
    evented: true,
    hasControls: true,
    lockScalingFlip: true,
  }) as MetaRectObj
  frame.data = { metaOverlay: true, metaKind: 'header_frame' }

  const leftDep = new Text('', {
    left: LEFT_MARGIN + HEADER_PADDING_X,
    top: TOP_MARGIN + HEADER_PADDING_Y,
    originX: 'left',
    originY: 'top',
    fontSize: cssNumberPx('--font-base', 14),
    fontWeight: 700,
    fill: META_COLOR,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: false,
    evented: false,
  }) as MetaTextObj
  leftDep.data = { metaOverlay: true, metaKind: 'header_left_dep' }

  const leftUnit = new Text('', {
    left: LEFT_MARGIN + HEADER_PADDING_X,
    top: TOP_MARGIN + HEADER_PADDING_Y + 18,
    originX: 'left',
    originY: 'top',
    fontSize: cssNumberPx('--font-base', 14),
    fontWeight: 700,
    fill: META_COLOR,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: false,
    evented: false,
  }) as MetaTextObj
  leftUnit.data = { metaOverlay: true, metaKind: 'header_left_unit' }

  const leftLabel = new Text('Vorgangsnummer', {
    left: LEFT_MARGIN + HEADER_PADDING_X,
    top: TOP_MARGIN + HEADER_PADDING_Y + 36,
    originX: 'left',
    originY: 'top',
    fontSize: cssNumberPx('--font-sm', 13),
    fontWeight: 400,
    fill: META_COLOR,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: false,
    evented: false,
  }) as MetaTextObj
  leftLabel.data = { metaOverlay: true, metaKind: 'header_left_label' }

  const leftCase = new Text('', {
    left: LEFT_MARGIN + HEADER_PADDING_X,
    top: TOP_MARGIN + HEADER_PADDING_Y + 52,
    originX: 'left',
    originY: 'top',
    fontSize: cssNumberPx('--font-base', 14),
    fontWeight: 700,
    fill: META_COLOR,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: false,
    evented: false,
  }) as MetaTextObj
  leftCase.data = { metaOverlay: true, metaKind: 'header_left_case' }

  const right = new Textbox('', {
    left: LEFT_MARGIN + headerWidth - HEADER_PADDING_X,
    top: TOP_MARGIN + HEADER_PADDING_Y,
    width: headerWidth / 2 - HEADER_PADDING_X,
    originX: 'right',
    originY: 'top',
    textAlign: 'right',
    fontSize: cssNumberPx('--font-base', 14),
    fontWeight: 400,
    fill: META_COLOR,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: false,
    evented: false,
  }) as MetaTextObj
  right.data = { metaOverlay: true, metaKind: 'header_right' }

  const titleBelow = new Textbox('', {
    left: w / 2,
    top: TOP_MARGIN + HEADER_HEIGHT + 8,
    width: headerWidth,
    originX: 'center',
    originY: 'top',
    textAlign: 'center',
    fontSize: cssNumberPx('--font-base', 14),
    fontWeight: 600,
    fill: META_COLOR,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: false,
    evented: false,
  }) as MetaTextObj
  titleBelow.data = { metaOverlay: true, metaKind: 'header_title' }

  canvas.add(frame)
  canvas.add(leftDep)
  canvas.add(leftUnit)
  canvas.add(leftLabel)
  canvas.add(leftCase)
  canvas.add(right)
  canvas.add(titleBelow)

  return { frame, leftDep, leftUnit, leftLabel, leftCase, right, titleBelow }
}

function createAgent(canvas: Canvas): { text: MetaTextObj; line: MetaLineObj } {
  const yTop = Math.max(0, canvas.getHeight() - BOTTOM_MARGIN - 16)

  const txt = new Text('', {
    left: LEFT_MARGIN,
    top: yTop,
    originX: 'left',
    originY: 'top',
    fontSize: cssNumberPx('--font-sm', 14),
    fontWeight: 400,
    fill: META_COLOR,
    backgroundColor: 'rgba(0,0,0,0.001)',
    padding: 4,
    fontFamily: 'ui-sans-serif, system-ui, Inter, Roboto, Arial, sans-serif',
    selectable: true,
    evented: true,
    hasControls: true,
    lockScalingFlip: true,
    lockScalingX: false,
    lockScalingY: false,
    lockRotation: false,
    perPixelTargetFind: false,
  }) as MetaTextObj
  txt.data = { metaOverlay: true, metaKind: 'agent_text' }
  canvas.add(txt)
  makeAgentInteractive(canvas, txt)

  const ln = new Line(
    [LEFT_MARGIN, yTop - AGENT_LINE_GAP, LEFT_MARGIN, yTop - AGENT_LINE_GAP],
    {
      stroke: META_COLOR,
      strokeWidth: 1.5,
      selectable: false,
      evented: false,
      visible: false,
    },
  ) as MetaLineObj
  ln.data = { metaOverlay: true, metaKind: 'agent_line' }
  canvas.add(ln)

  return { text: txt, line: ln }
}

/* --------------------------------- Layout --------------------------------- */

function syncAgentLineToText(st: MetaState, canvas: Canvas) {
  if (!st.agentText || !st.agentLine) return

  const x = st.agentText.left ?? 0
  const y = st.agentText.top ?? 0
  const textW = st.agentText.getScaledWidth()
  const hasText =
    ((st.agentText.text ?? '').trim().length > 0) && textW > 0.0001

  st.agentLine.set({
    x1: x,
    y1: y - AGENT_LINE_GAP,
    x2: x + (hasText ? textW : 0),
    y2: y - AGENT_LINE_GAP,
    visible: hasText,
  })
  st.agentLine.setCoords()
  bringToFront(canvas, st.agentLine)
}

/**
 * Layout nach aktueller Position des Rahmens.
 * Wenn der Nutzer den Rahmen verschoben hat, bleiben die relativen Abstände erhalten.
 */
function layoutMeta(canvas: Canvas, st: MetaState): void {
  const w = canvas.getWidth()
  const h = canvas.getHeight()
  const headerWidth = Math.max(10, w - 2 * LEFT_MARGIN)

  // Prüfen, ob sich die Canvas-Größe relevant geändert hat
  const widthChanged =
    st.canvasWidth !== undefined && Math.abs(w - st.canvasWidth) > 1
  const heightChanged =
    st.canvasHeight !== undefined && Math.abs(h - st.canvasHeight) > 1
  const sizeChanged = widthChanged || heightChanged

  if (sizeChanged) {
    // Formatwechsel (Portrait ↔ Landscape) o.ä. → Header zurück auf Standardposition
    st.headerLastLeft = LEFT_MARGIN
    st.headerLastTop = TOP_MARGIN
    st.canvasWidth = w
    st.canvasHeight = h
  } else {
    // Größe unverändert → aktuelle Größe merken
    st.canvasWidth = w
    st.canvasHeight = h
  }

  const frameLeft = st.headerLastLeft ?? LEFT_MARGIN
  const frameTop = st.headerLastTop ?? TOP_MARGIN

  if (st.headerFrame) {
    st.headerFrame.set({
      left: frameLeft,
      top: frameTop,
      width: headerWidth,
      height: HEADER_HEIGHT,
    })
    st.headerFrame.setCoords()
  }

  const baseX = frameLeft + HEADER_PADDING_X
  const baseY = frameTop + HEADER_PADDING_Y

  const hasUnit = !!(st.raw.unit && st.raw.unit.trim())
  const depLineHeight = 20
  const unitLineHeight = hasUnit ? 20 : 0
  const labelOffset = depLineHeight + unitLineHeight + 6
  const caseOffset = labelOffset + 18

  if (st.headerLeftDep) {
    st.headerLeftDep.set({
      left: baseX,
      top: baseY,
      fill: META_COLOR,
    })
    st.headerLeftDep.setCoords()
  }

  if (st.headerLeftUnit) {
    st.headerLeftUnit.set({
      left: baseX,
      top: baseY + depLineHeight,
      fill: META_COLOR,
    })
    st.headerLeftUnit.setCoords()
  }

  if (st.headerLeftLabel) {
    st.headerLeftLabel.set({
      left: baseX,
      top: baseY + labelOffset,
      fill: META_COLOR,
    })
    st.headerLeftLabel.setCoords()
  }

  if (st.headerLeftCase) {
    st.headerLeftCase.set({
      left: baseX,
      top: baseY + caseOffset,
      fill: META_COLOR,
    })
    st.headerLeftCase.setCoords()
  }

  if (st.headerRight && st.headerRight instanceof Textbox) {
    st.headerRight.set({
      left: frameLeft + headerWidth - HEADER_PADDING_X,
      top: frameTop + HEADER_PADDING_Y,
      width: headerWidth / 2 - HEADER_PADDING_X,
      originX: 'right',
      originY: 'top',
      textAlign: 'right',
      fill: META_COLOR,
    })
    fitMetaTextbox(
      st.headerRight as Textbox,
      headerWidth / 2 - HEADER_PADDING_X,
    )
    st.headerRight.setCoords()
  }


  if (st.headerTitle && st.headerTitle instanceof Textbox) {
    st.headerTitle.set({
      left: w / 2,
      top: frameTop + HEADER_HEIGHT + 8,
      width: headerWidth,
      originX: 'center',
      originY: 'top',
      textAlign: 'center',
      fill: META_COLOR,
    })
    fitMetaTextbox(st.headerTitle as Textbox, headerWidth)
    st.headerTitle.setCoords()
  }

  if (st.agentText) {
    const textH = st.agentText.getScaledHeight()
    const newTop = Math.max(0, h - BOTTOM_MARGIN - textH)
    st.agentText.set({ left: LEFT_MARGIN, top: newTop, fill: META_COLOR })
    st.agentText.setCoords()
  }

  syncAgentLineToText(st, canvas)
}

/* Sichtbarkeit: Header/Überschrift erst, wenn Metadaten da sind */
function applyVisibility(st: MetaState): void {
  const hasAnyMeta =
    !!(st.raw.department && st.raw.department.trim()) ||
    !!(st.raw.unit && st.raw.unit.trim()) ||
    !!(st.raw.caseNumber && st.raw.caseNumber.trim()) ||
    !!(st.raw.dateISO && st.raw.dateISO.trim()) ||
    !!(st.raw.street && st.raw.street.trim()) ||
    !!(st.raw.zip && st.raw.zip.trim()) ||
    !!(st.raw.city && st.raw.city.trim()) ||
    !!(st.raw.stationPhone && st.raw.stationPhone.trim()) ||
    !!(st.raw.agent && st.raw.agent.trim())

  if (st.headerFrame) st.headerFrame.set({ visible: hasAnyMeta })
  if (st.headerLeftDep)
    st.headerLeftDep.set({
      visible: hasAnyMeta && !!(st.headerLeftDep.text ?? '').toString().trim(),
    })
  if (st.headerLeftUnit)
    st.headerLeftUnit.set({
      visible: hasAnyMeta && !!(st.headerLeftUnit.text ?? '').toString().trim(),
    })
  if (st.headerLeftLabel)
    st.headerLeftLabel.set({
      visible:
        hasAnyMeta &&
        !!(st.headerLeftCase?.text ?? '').toString().trim(),
    })
  if (st.headerLeftCase)
    st.headerLeftCase.set({
      visible: hasAnyMeta && !!(st.headerLeftCase.text ?? '').toString().trim(),
    })

  if (st.headerRight)
    st.headerRight.set({
      visible: hasAnyMeta && !!(st.headerRight.text ?? '').toString().trim(),
    })

  if (st.headerTitle)
    st.headerTitle.set({
      visible:
        hasAnyMeta && !!(st.headerTitle.text ?? '').toString().trim(),
    })

  if (st.agentText) {
    const hasAgent = ((st.agentText.text ?? '').toString().trim().length > 0)
    st.agentText.set({ visible: hasAgent })
    if (!hasAgent && st.agentLine) {
      st.agentLine.set({ visible: false })
    }
  }
}

/* --------------------------------- Mount ---------------------------------- */

type MetaUpdateDetail = {
  title?: string
  department?: string
  unit?: string
  caseNumber?: string
  agent?: string
  dateISO?: string
  street?: string
  zip?: string
  city?: string
  stationPhone?: string
}

export function mountMetaOverlays(canvas: Canvas): void {
  if (stateByCanvas.has(canvas)) return

  const {
    frame,
    leftDep,
    leftUnit,
    leftLabel,
    leftCase,
    right,
    titleBelow,
  } = createHeader(canvas)
  const { text: agentText, line: agentLine } = createAgent(canvas)

  const st: MetaState = {
    headerFrame: frame,
    headerLeftDep: leftDep,
    headerLeftUnit: leftUnit,
    headerLeftLabel: leftLabel,
    headerLeftCase: leftCase,
    headerRight: right,
    headerTitle: titleBelow,
    agentText,
    agentLine,
    raw: {},
    headerLastLeft: frame.left ?? LEFT_MARGIN,
    headerLastTop: frame.top ?? TOP_MARGIN,

    // NEU:
    canvasWidth: canvas.getWidth(),
    canvasHeight: canvas.getHeight(),

    handlers: {},
  }


  stateByCanvas.set(canvas, st)

  promoteAll(canvas, st)
  layoutMeta(canvas, st)
  applyVisibility(st)
  canvas.requestRenderAll()

  // Agent-Text bewegen → Linie mitziehen
  const onTxtMoving = () => {
    syncAgentLineToText(st, canvas)
    canvas.requestRenderAll()
  }
  const onTxtModified = () => {
    syncAgentLineToText(st, canvas)
    canvas.requestRenderAll()
  }
  ;(st.agentText as ObjWithEvents).on('moving', onTxtMoving)
  ;(st.agentText as ObjWithEvents).on('modified', onTxtModified)
  st.handlers.txtMoving = onTxtMoving
  st.handlers.txtModified = onTxtModified

  // Header-Rahmen bewegen → Rest des Headers mitverschieben
  const onHeaderMoving = () => {
    if (!st.headerFrame) return

    const curLeft = st.headerFrame.left ?? 0
    const curTop = st.headerFrame.top ?? 0
    const prevLeft = st.headerLastLeft ?? curLeft
    const prevTop = st.headerLastTop ?? curTop
    const dx = curLeft - prevLeft
    const dy = curTop - prevTop

    if (dx === 0 && dy === 0) {
      st.headerLastLeft = curLeft
      st.headerLastTop = curTop
      return
    }

    st.headerLastLeft = curLeft
    st.headerLastTop = curTop

    const move = (obj?: FabricObject | null) => {
      if (!obj) return
      obj.set({
        left: (obj.left ?? 0) + dx,
        top: (obj.top ?? 0) + dy,
      })
      obj.setCoords()
    }

    move(st.headerLeftDep)
    move(st.headerLeftUnit)
    move(st.headerLeftLabel)
    move(st.headerLeftCase)
    move(st.headerRight)
    move(st.headerTitle)

    canvas.requestRenderAll()
  }

  ;(st.headerFrame as ObjWithEvents).on('moving', onHeaderMoving)
  st.handlers.headerMoving = onHeaderMoving

  // Backup: Falls etwas anderes den Agent-Text bewegt
  const onObjectMoving = (opt: unknown) => {
    const target = (opt as { target?: FabricObject | null })?.target ?? null
    if (!target) return
    const kind = (target as { data?: Partial<MetaFlag> }).data?.metaKind
    if (kind === 'agent_text') {
      syncAgentLineToText(st, canvas)
      canvas.requestRenderAll()
    }
  }
  canvas.on('object:moving', onObjectMoving as unknown as (o: unknown) => void)
  st.handlers.objectMoving = onObjectMoving

  const promoteSoon = () => {
    requestAnimationFrame(() => {
      promoteAll(canvas, st)
      canvas.requestRenderAll()
    })
  }
  const onObjectAdded = (opt: unknown) => {
    const target = (opt as { target?: FabricObject | null })?.target ?? null
    if (target && !isMetaOverlay(target)) promoteSoon()
  }
  const onObjectRemoved = (opt: unknown) => {
    const target = (opt as { target?: FabricObject | null })?.target ?? null
    if (target && !isMetaOverlay(target)) promoteSoon()
  }
  canvas.on('object:added', onObjectAdded as unknown as (o: unknown) => void)
  canvas.on('object:removed', onObjectRemoved as unknown as (o: unknown) => void)
  st.handlers.objectAdded = onObjectAdded
  st.handlers.objectRemoved = onObjectRemoved

  const onAppReorderZ = () => promoteSoon()
  window.addEventListener('app:reorder-z', onAppReorderZ as EventListener)
  st.handlers.onAppReorderZ = onAppReorderZ

  const onSelCreated = (opt: unknown) => {
    const target = (opt as { selected?: FabricObject[] })?.selected?.[0] ?? null
    if (!target) return
    const kind = (target as { data?: Partial<MetaFlag> }).data?.metaKind
    if (kind === 'agent_text') makeAgentInteractive(canvas, target as MetaTextObj)
  }
  const onSelUpdated = (opt: unknown) => {
    const target = (opt as { selected?: FabricObject[] })?.selected?.[0] ?? null
    if (!target) return
    const kind = (target as { data?: Partial<MetaFlag> }).data?.metaKind
    if (kind === 'agent_text') makeAgentInteractive(canvas, target as MetaTextObj)
  }
  canvas.on('selection:created', onSelCreated as unknown as (o: unknown) => void)
  canvas.on('selection:updated', onSelUpdated as unknown as (o: unknown) => void)
  st.handlers.onSelCreated = onSelCreated
  st.handlers.onSelUpdated = onSelUpdated

  const onMetaUpdate = (ev: Event) => {
    const det = (ev as CustomEvent<MetaUpdateDetail>).detail
    if (!det) return
    const cur = stateByCanvas.get(canvas)
    if (!cur) return

    if (typeof det.title === 'string') cur.raw.title = det.title
    if (typeof det.department === 'string') cur.raw.department = det.department
    if (typeof det.unit === 'string') cur.raw.unit = det.unit
    if (typeof det.caseNumber === 'string') cur.raw.caseNumber = det.caseNumber
    if (typeof det.agent === 'string') cur.raw.agent = det.agent
    if (typeof det.dateISO === 'string') cur.raw.dateISO = det.dateISO
    if (typeof det.street === 'string') cur.raw.street = det.street
    if (typeof det.zip === 'string') cur.raw.zip = det.zip
    if (typeof det.city === 'string') cur.raw.city = det.city
    if (typeof det.stationPhone === 'string')
      cur.raw.stationPhone = det.stationPhone

    if (cur.headerLeftDep) {
      cur.headerLeftDep.set({ text: cur.raw.department ?? '' })
    }
    if (cur.headerLeftUnit) {
      cur.headerLeftUnit.set({ text: cur.raw.unit ?? '' })
    }
    if (cur.headerLeftLabel) {
      const showLabel = !!(cur.raw.caseNumber && cur.raw.caseNumber.trim())
      cur.headerLeftLabel.set({ text: showLabel ? 'Vorgangsnummer' : '' })
    }
    if (cur.headerLeftCase) {
      cur.headerLeftCase.set({ text: cur.raw.caseNumber ?? '' })
    }

    if (cur.headerRight) {
      const lines: string[] = []

      const firstParts: string[] = []
      if (cur.raw.zip) firstParts.push(cur.raw.zip)
      if (cur.raw.city) firstParts.push(cur.raw.city)
      const dateLabel = formatDate(cur.raw.dateISO)
      let firstLine = firstParts.join('  ')
      if (dateLabel) {
        if (firstLine) firstLine += ',  ' + dateLabel
        else firstLine = dateLabel
      }
      if (firstLine) lines.push(firstLine)

      if (cur.raw.street) lines.push(cur.raw.street)
      if (cur.raw.stationPhone) lines.push(`Tel.: ${cur.raw.stationPhone}`)
      if (cur.raw.agent) lines.push(cur.raw.agent)

      cur.headerRight.set({ text: lines.join('\n') })
    }

    if (cur.headerTitle) {
      cur.headerTitle.set({ text: cur.raw.title ?? '' })
    }

    if (cur.agentText && typeof cur.raw.agent === 'string') {
      cur.agentText.set({ text: cur.raw.agent, fill: META_COLOR })
    }

    layoutMeta(canvas, cur)
    applyVisibility(cur)
    promoteAll(canvas, cur)
    canvas.requestRenderAll()
  }

  const onMetaRequest = () =>
    window.dispatchEvent(new CustomEvent('app:meta-ping'))

  window.addEventListener('app:meta-update', onMetaUpdate)
  window.addEventListener('app:meta-request', onMetaRequest)
  st.handlers.onMetaUpdate = onMetaUpdate
  st.handlers.onMetaRequest = onMetaRequest

  // NEU: Re-Layout nach Umschalten Hochformat/Querformat
  const onFormatToggle = () => {
    // Wir warten einen Frame, damit CanvasArea Zeit hat,
    // Format/Größe wirklich umzusetzen.
    requestAnimationFrame(() => {
      const cur = stateByCanvas.get(canvas)
      if (!cur) return

      // Header zurück auf Standard-Position oben links
      cur.headerLastLeft = LEFT_MARGIN
      cur.headerLastTop = TOP_MARGIN

      // neue Canvas-Größe merken
      cur.canvasWidth = canvas.getWidth()
      cur.canvasHeight = canvas.getHeight()

      layoutMeta(canvas, cur)
      applyVisibility(cur)
      promoteAll(canvas, cur)
      canvas.requestRenderAll()
    })
  }

  window.addEventListener('app:toggle-format', onFormatToggle as EventListener)
  st.handlers.onFormatToggle = onFormatToggle

  // Initial den Sidebar-Stand anfragen
  window.dispatchEvent(new CustomEvent('app:meta-request'))
}


/* -------------------------------- Unmount --------------------------------- */

export function unmountMetaOverlays(canvas: Canvas): void {
  const st = stateByCanvas.get(canvas)
  if (!st) return

  if (st.handlers.txtMoving && st.agentText)
    (st.agentText as ObjWithEvents).off('moving', st.handlers.txtMoving)
  if (st.handlers.txtModified && st.agentText)
    (st.agentText as ObjWithEvents).off('modified', st.handlers.txtModified)

  if (st.agentText && st.handlers.onMouseDownAgent)
    (st.agentText as ObjWithEvents).off('mousedown', st.handlers.onMouseDownAgent)

  if (st.headerFrame && st.handlers.headerMoving) {
    ;(st.headerFrame as ObjWithEvents).off('moving', st.handlers.headerMoving)
  }

  if (st.handlers.objectMoving) {
    canvas.off(
      'object:moving',
      st.handlers.objectMoving as unknown as (o: unknown) => void,
    )
  }
  if (st.handlers.objectAdded) {
    canvas.off(
      'object:added',
      st.handlers.objectAdded as unknown as (o: unknown) => void,
    )
  }
  if (st.handlers.objectRemoved) {
    canvas.off(
      'object:removed',
      st.handlers.objectRemoved as unknown as (o: unknown) => void,
    )
  }
  if (st.handlers.onSelCreated) {
    canvas.off(
      'selection:created',
      st.handlers.onSelCreated as unknown as (o: unknown) => void,
    )
  }
  if (st.handlers.onSelUpdated) {
    canvas.off(
      'selection:updated',
      st.handlers.onSelUpdated as unknown as (o: unknown) => void,
    )
  }

  if (st.handlers.onMetaUpdate)
    window.removeEventListener('app:meta-update', st.handlers.onMetaUpdate)
  if (st.handlers.onMetaRequest)
    window.removeEventListener('app:meta-request', st.handlers.onMetaRequest)
  if (st.handlers.onAppReorderZ)
    window.removeEventListener(
      'app:reorder-z',
      st.handlers.onAppReorderZ as unknown as EventListener,
    )

  // NEU:
  if (st.handlers.onFormatToggle)
    window.removeEventListener(
      'app:toggle-format',
      st.handlers.onFormatToggle as unknown as EventListener,
    )

  stateByCanvas.delete(canvas)
}


/* ----------------------------- Helper: Datum ------------------------------- */

function formatDate(dateISO: string | undefined): string {
  if (!dateISO) return ''
  const parts = dateISO.split('-')
  if (parts.length !== 3) return dateISO
  const [y, m, d] = parts
  return `${d}.${m}.${y}`
}
