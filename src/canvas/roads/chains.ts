// src/canvas/roads/chains.ts
import { Canvas, Group, util, type FabricObject } from 'fabric'

/** ---------- Datentypen ---------- */
export type JointRef = {
  id: string
  a: { objId: string; connectorId: string }
  b: { objId: string; connectorId: string }
}

export type ChainJoint = JointRef

export type ChainPayload = {
  id: string
  parts: string[]            // Fabric-Objekt-IDs (obj.data.id) der Kinder
  joints: ChainJoint[]
  name?: string
}

export type ChainData = { chain: ChainPayload }

type ObjWithData = FabricObject & { data?: Record<string, unknown> }
export type GroupWithChain = Group &
  ObjWithData & {
    data?: { chain?: ChainPayload; kind?: string; name?: string }
  }

/** Callbacks → Store injizieren (keine window-events nötig) */
export type ChainCallbacks = {
  onMarkParts?: (chainId: string, partIds: string[]) => void
  onUnlinkParts?: (chainId: string, partIds: string[]) => void
}

/** ---------- interne Helper ---------- */
const hasChain = (g: Group | FabricObject): g is GroupWithChain => {
  const d = (g as ObjWithData).data
  return !!(d && typeof d === 'object' && 'chain' in d && typeof (d as { chain?: unknown }).chain === 'object')
}

const getObjId = (o: FabricObject): string | undefined => {
  const d = (o as ObjWithData).data
  const id = (d?.id ?? (o as unknown as { id?: unknown }).id) as unknown
  return typeof id === 'string' ? id : undefined
}

const markChildAsPart = (child: FabricObject, chainId: string) => {
  const d = (child as ObjWithData).data ?? {}
  ;(child as ObjWithData).data = { ...d, chainId, __keepInStore: true }
}

const clearChildPartMark = (child: FabricObject) => {
  const d = (child as ObjWithData).data ?? {}
  const nd = { ...d }
  delete (nd as Record<string, unknown>).chainId
  delete (nd as Record<string, unknown>).__keepInStore
  ;(child as ObjWithData).data = nd
}

const setGroupChainData = (g: GroupWithChain, payload: ChainPayload) => {
  const base = (g.data ?? {}) as Record<string, unknown>
  g.data = { ...base, kind: 'chain', name: payload.name ?? 'Straßenverbund', chain: payload }
}

// Add-API mit Fallback (v6 hat addWithUpdate)
const addChildToGroup = (group: Group, child: FabricObject) => {
  type MaybeAddWithUpdate = { addWithUpdate?: (o: FabricObject) => Group }
  const g = group as Group & MaybeAddWithUpdate
  if (typeof g.addWithUpdate === 'function') g.addWithUpdate(child)
  else {
    group.add(child)
    ;(group as unknown as { dirty?: boolean }).dirty = true
  }
}

/** ---------- Z-Order Helper (Fabric v5/v6 safe) ---------- */
type CanvasWithMoveTo = Canvas & { moveTo?: (o: FabricObject, index: number) => void }
type CanvasPrivate    = Canvas & { _objects?: FabricObject[] }
type ObjectWithMoveTo = FabricObject & { moveTo?: (index: number) => void }
type MovableObj       = FabricObject & { bringForward?: () => void; sendBackwards?: () => void }

const clampIndex = (canvas: Canvas, i: number) =>
  Math.max(0, Math.min(i, canvas.getObjects().length - 1))

export function moveObjectToIndex(canvas: Canvas, obj: FabricObject, index: number): void {
  const target = clampIndex(canvas, index)

  // 1) Bevorzugt: Canvas.moveTo(obj, index)
  const cMove = (canvas as CanvasWithMoveTo).moveTo
  if (typeof cMove === 'function') { cMove(obj, target); return }

  // 2) Fallback: obj.moveTo(index)
  const oMove = (obj as ObjectWithMoveTo).moveTo
  if (typeof oMove === 'function') { oMove.call(obj, target); return }

  // 3) Fallback: _objects direkt umsortieren (nur wenn vorhanden)
  const list = (canvas as CanvasPrivate)._objects ?? canvas.getObjects()
  const cur  = list.indexOf(obj)
  if (cur === -1 || cur === target) return
  if ((canvas as CanvasPrivate)._objects) {
    list.splice(cur, 1)
    list.splice(target, 0, obj)
    return
  }

  // 4) Letzter Fallback: via bringForward/sendBackwards iterieren
  const m = obj as MovableObj
  if (cur < target && typeof m.bringForward === 'function') {
    for (let i = cur; i < target; i++) m.bringForward!()
  } else if (cur > target && typeof m.sendBackwards === 'function') {
    for (let i = cur; i > target; i--) m.sendBackwards!()
  }
}

/** ---------- Type Guard (exportiert) ---------- */
export function isChainGroup(obj: FabricObject): obj is GroupWithChain {
  if (!(obj instanceof Group)) return false
  const d = (obj as ObjWithData).data
  if (!d || typeof d !== 'object') return false
  const maybe = (d as { chain?: unknown }).chain
  return typeof maybe === 'object' && !!maybe
}

/** Liefert die Chain-Group eines Road-Objekts oder null. */
export function getChainGroupOf(obj: FabricObject): GroupWithChain | null {
  const parent = obj.group
  if (!parent) return null
  return hasChain(parent) ? parent : null
}

/** ---------- API ---------- */

/** Erstellt eine neue Chain aus genau zwei Teilen. */
export function createChainFromPair(
  canvas: Canvas,
  a: FabricObject,
  b: FabricObject,
  joint: JointRef,
  name = 'Straßenverbund',
  cb?: ChainCallbacks
): GroupWithChain {
  const idA = getObjId(a)
  const idB = getObjId(b)

  // Chain-ID erzeugen
  const chainId = `chain-${Date.now().toString(36)}`

  // 1) Store/DI VOR Canvas-Entfernen informieren (wichtig für Store-Guards)
  const initialParts: string[] = [idA, idB].filter((x): x is string => typeof x === 'string')
  if (initialParts.length) cb?.onMarkParts?.(chainId, initialParts)

  // 2) Fabric-Kinder markieren (Canvas-Objekte)
  markChildAsPart(a, chainId)
  markChildAsPart(b, chainId)

  // 3) Kinder vor dem Gruppieren von der Canvas lösen
  if (a.canvas === canvas) canvas.remove(a)
  if (b.canvas === canvas) canvas.remove(b)

  // 4) Gruppe erzeugen
  const group = new Group([a, b], {
    selectable: true,
    subTargetCheck: false,
    objectCaching: true,
  }) as GroupWithChain

  const payload: ChainPayload = { id: chainId, parts: initialParts, joints: [joint], name }
  setGroupChainData(group, payload)

  // 5) Kinder in der Group: nicht direkt selektierbar
  group.getObjects().forEach((child) => {
    markChildAsPart(child, chainId)
    child.evented = false
    child.selectable = false
  })

  canvas.add(group)
  canvas.requestRenderAll()

  return group
}

/** Hängt ein einzelnes Teil an eine bestehende Chain-Group an. */
export function appendPartToChain(
  canvas: Canvas,
  chain: GroupWithChain,
  part: FabricObject,
  joint: JointRef,
  cb?: ChainCallbacks
): void {
  const d = chain.data?.chain
  if (!d) return

  const pid = getObjId(part)
  if (pid) {
    // 1) Store/DI VOR Entfernen informieren
    cb?.onMarkParts?.(d.id, [pid])
  }

  // 2) Fabric: mark & payload pflegen
  markChildAsPart(part, d.id)
  if (pid && !d.parts.includes(pid)) d.parts.push(pid)
  d.joints.push(joint)
  setGroupChainData(chain, d)

  // 3) Vom Canvas lösen & in Group verschieben
  if (part.canvas === canvas) canvas.remove(part)
  addChildToGroup(chain, part)
  part.evented = false
  part.selectable = false

  ;(chain as unknown as { dirty?: boolean }).dirty = true
  canvas.requestRenderAll()
}

export function dissolveChain(
  canvas: Canvas,
  chain: GroupWithChain,
  cb?: ChainCallbacks
): void {
  const cid = chain.data?.chain?.id ?? ''
  const partIds = (chain.data?.chain?.parts ?? []).slice()
  const baseIndex = canvas.getObjects().indexOf(chain)

  // 1) Kinder erfassen + absolute States berechnen (MIT Matrix-Dekomposition!)
  const children = chain.getObjects().slice()
  const absStates = children.map((child) => {
    const m = child.calcTransformMatrix()
    const d = util.qrDecompose(m)
    const visible = (child as FabricObject).visible
    return { child, d, visible }
  })

  const prevROAR = canvas.renderOnAddRemove
  canvas.renderOnAddRemove = false

  if (chain.canvas === canvas) {
    canvas.remove(chain)
  }

  type KidObj = ObjWithData & {
    hasControls?: boolean
    lockMovementX?: boolean
    lockMovementY?: boolean
    perPixelTargetFind?: boolean
  }

  absStates.forEach((s, i) => {
    const o = s.child as KidObj

    ;(o as unknown as { group?: Group | undefined }).group = undefined
    clearChildPartMark(o)

    o.evented = true
    o.selectable = true
    o.hasControls = true
    o.lockMovementX = false
    o.lockMovementY = false
    o.perPixelTargetFind = false

    // 🔥 Setze absolute Transform MIT center origin + skew reset
    o.set({
      left: s.d.translateX,
      top: s.d.translateY,
      angle: s.d.angle,
      scaleX: s.d.scaleX,
      scaleY: s.d.scaleY,
      skewX: 0,          // ← RESET
      skewY: 0,          // ← RESET
      originX: 'center', // ← IMMER center
      originY: 'center', // ← IMMER center
      visible: s.visible,
    } as Partial<FabricObject>)
    o.setCoords()

    canvas.add(o)

    const targetZ = baseIndex >= 0 ? baseIndex + i : canvas.getObjects().length - 1
    moveObjectToIndex(canvas, o, targetZ)
    ;(o as { dirty?: boolean }).dirty = true
  })

  canvas.renderOnAddRemove = prevROAR
  canvas.requestRenderAll()

  if (cid && partIds.length) cb?.onUnlinkParts?.(cid, partIds)
}