// src/canvas/core/useClipboard.ts
import { ActiveSelection, Group, util, type Canvas, type FabricObject } from 'fabric'
import { useEffect, useRef } from 'react'
import { isMetaOverlay } from './metaOverlays'
import { ensureId, setName, setData, type ObjWithData } from './canvasCore'
import { uid } from '../canvasUtils'
import type { ElementModel } from '../canvasTypes'

type CloneFnV5<T extends FabricObject = FabricObject> =
  (cb: (cloned: T) => void, propsToInclude?: string[]) => void
type CloneFnV6<T extends FabricObject = FabricObject> =
  () => Promise<T>

type ObjWithOptionalClone<T extends FabricObject = FabricObject> =
  T & { clone?: CloneFnV5<T> | CloneFnV6<T> }

type ToObjectCapable = FabricObject & { toObject: (props?: string[]) => Record<string, unknown> }

const isActiveSel = (o: FabricObject | null | undefined): o is ActiveSelection =>
  !!o && (o.type === 'activeSelection' || o instanceof ActiveSelection)

const hasToObject = (o: FabricObject): o is ToObjectCapable =>
  typeof (o as Partial<ToObjectCapable>).toObject === 'function'

const isFn = (f: unknown): f is (...args: unknown[]) => unknown =>
  typeof f === 'function'

const isPromiseLike = <T = unknown>(v: unknown): v is Promise<T> =>
  !!v && (typeof v === 'object' || typeof v === 'function') &&
  typeof (v as { then?: unknown }).then === 'function'

/* ---------------- Transient-Daten entfernen ---------------- */
const stripTransient = (d?: Record<string, unknown>) => {
  if (!d) return d
  const out = { ...d }
  delete (out as { id?: unknown }).id
  delete (out as { chainId?: unknown }).chainId
  delete (out as { __temp?: unknown }).__temp
  return out
}

const clearTransientDataDeep = (obj: FabricObject): void => {
  const holder = obj as ObjWithData
  if (holder.data) holder.data = stripTransient(holder.data)
  if (obj instanceof Group) obj.getObjects().forEach(clearTransientDataDeep)
}

/* ---------------- Daten vom Original in den Klon übertragen ---------------- */
const propagateDataDeep = (src: FabricObject, dst: FabricObject): void => {
  const s = src as ObjWithData
  const d = dst as ObjWithData
  if (s.data) {
    if (!d.data || (Object.keys(d.data).length === 0)) {
      d.data = stripTransient(s.data)
    } else {
      d.data = { ...stripTransient(s.data), ...stripTransient(d.data) }
    }
  }

  if (src instanceof Group && dst instanceof Group) {
    const sChildren = src.getObjects()
    const dChildren = dst.getObjects()
    const n = Math.min(sChildren.length, dChildren.length)
    for (let i = 0; i < n; i++) propagateDataDeep(sChildren[i], dChildren[i])
  }
}

/** Meta-Overlays niemals kopieren */
const filterClippable = (objs: FabricObject[]): FabricObject[] =>
  objs.filter((o) => !isMetaOverlay(o))

/* ---------------- v5/v6-sicher klonen (mit Daten-Erhalt) ---------------- */
const cloneOne = async <T extends FabricObject>(obj: T): Promise<T> => {
  const maybeClone = (obj as ObjWithOptionalClone<T>).clone

  // 1) Fabric v6: clone(): Promise<T>
  if (isFn(maybeClone)) {
    try {
      const callNoArg = maybeClone as unknown as () => unknown
      const res = callNoArg.call(obj)
      if (isPromiseLike<T>(res)) {
        const cloned = await res
        propagateDataDeep(obj, cloned as unknown as FabricObject)
        return cloned
      }
    } catch {
      // weiter zu v5-Versuch
    }

    // 2) Fabric v5: clone(cb)
    try {
      const callWithCb = maybeClone as unknown as (cb: (c: T) => void) => void
      const cloned = await new Promise<T>((resolve) => callWithCb.call(obj, (c) => resolve(c)))
      propagateDataDeep(obj, cloned as unknown as FabricObject)
      return cloned
    } catch {
      // weiter zum JSON-Fallback
    }
  }

  // 3) JSON-Fallback (v5/v6)
  const toObjectWithData = (): Record<string, unknown> => {
    if (!hasToObject(obj)) return {}
    try {
      return (obj as ToObjectCapable).toObject(['data'])
    } catch {
      try {
        return (obj as unknown as { toObject: (opts?: { extraProperties?: string[] }) => Record<string, unknown> })
          .toObject({ extraProperties: ['data'] })
      } catch {
        return (obj as ToObjectCapable).toObject()
      }
    }
  }

  const json = toObjectWithData()
  const result = await util.enlivenObjects([json])
  const cloned = (Array.isArray(result) ? result[0] : result) as T

  propagateDataDeep(obj, cloned as unknown as FabricObject)
  return cloned
}

const cloneMany = (objs: FabricObject[]) => Promise.all(objs.map(cloneOne))

/* ========================================================================== */

type ClipboardDeps = {
  upsertElement: (el: ElementModel) => void
  getNextZIndex: () => number
}

export function useCanvasClipboard(
  canvas: Canvas | null,
  deps: ClipboardDeps
): void {
  const clipboardRef = useRef<FabricObject[] | null>(null)
  const pasteOffsetRef = useRef<number>(20)

  useEffect(() => {
    if (!canvas) return

    const getSelection = (): FabricObject[] => {
      const a = canvas.getActiveObject()
      if (!a) return []
      if (isActiveSel(a)) return filterClippable(a.getObjects())
      return filterClippable([a])
    }

    const copy = async (): Promise<void> => {
      const sel = getSelection()
      if (!sel.length) return
      const clones = await cloneMany(sel)
      clones.forEach(clearTransientDataDeep)
      clipboardRef.current = clones
      pasteOffsetRef.current = 20
    }

    const cut = async (): Promise<void> => {
      const sel = getSelection()
      if (!sel.length) return
      const clones = await cloneMany(sel)
      clones.forEach(clearTransientDataDeep)
      clipboardRef.current = clones

      sel.forEach((o) => canvas.remove(o))
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }

const paste = async (): Promise<void> => {
  const clip = clipboardRef.current
  if (!clip?.length) return

  const dx = pasteOffsetRef.current
  const dy = pasteOffsetRef.current
  pasteOffsetRef.current = Math.min(dx + 10, 80)

  const clones = await cloneMany(clip)

  const prev = canvas.renderOnAddRemove
  canvas.renderOnAddRemove = false
  try {
    clones.forEach((o) => {
      o.set({ left: (o.left ?? 0) + dx, top: (o.top ?? 0) + dy })
      
      const oldData = (o as ObjWithData).data
      
      const oldName = (oldData?.name as string | undefined) || 
                      (o as { name?: string }).name || 
                      'Unbenannt'
      const newName = oldName  // ← GEÄNDERT: Kein "(Kopie)" mehr
      
      const newId = uid('paste')
      const zIndex = deps.getNextZIndex()
      
      setData(o, {
        ...(oldData ?? {}),
        id: newId,
        name: newName,
        z: zIndex,
      })
      
      clearTransientDataDeep(o)
      
      setData(o, {
        ...(o as ObjWithData).data,
        id: newId,
        name: newName,
        z: zIndex,
      })
      
      ensureId(o)
      setName(o, newName)
      
      canvas.add(o)
      o.setCoords()
      
      // 🔥 Im Store registrieren
      const data = (o as ObjWithData).data
      if (data?.id) {
        const dataObj: Record<string, unknown> = {
          id: data.id,
          name: newName,
          kind: data.kind,
          assetId: data.assetId,
          subcategory: data.subcategory,
          source: data.source,
        }
        
        // Optionale Properties einzeln hinzufügen
        if (data.svgRootId) dataObj.svgRootId = data.svgRootId
        if (data.vehicleSubtypeHint) dataObj.vehicleSubtypeHint = data.vehicleSubtypeHint
        if (data.svgConnectors) dataObj.svgConnectors = data.svgConnectors
        
        const element: Record<string, unknown> = {
          id: data.id as string,
          name: newName,
          type: (data.kind as string) ?? 'unknown',
          visible: true,
          locked: {
            move: false,
            rotate: false,
            scale: false,
          },
          z: zIndex,
          geom: {
            x: o.left ?? 0,
            y: o.top ?? 0,
            scaleX: o.scaleX ?? 1,
            scaleY: o.scaleY ?? 1,
            angle: o.angle ?? 0,
          },
          style: {},
          data: dataObj,
        }

        deps.upsertElement(element as unknown as ElementModel)
      }
    })

    if (clones.length === 1) {
      canvas.setActiveObject(clones[0])
    } else {
      canvas.setActiveObject(new ActiveSelection(clones, { canvas }))
    }
  } finally {
    canvas.renderOnAddRemove = prev
  }

  canvas.requestRenderAll()
}

    const duplicate = async (): Promise<void> => {
      await copy()
      await paste()
    }

    const onClipboard = (ev: Event) => {
      const op = (ev as CustomEvent<{ op: 'copy' | 'paste' | 'dup' | 'cut' }>).detail?.op
      if (!op) return
      if (op === 'copy') { void copy(); return }
      if (op === 'paste') { void paste(); return }
      if (op === 'dup') { void duplicate(); return }
      if (op === 'cut') { void cut(); return }
    }

    window.addEventListener('app:clipboard', onClipboard)
    return () => window.removeEventListener('app:clipboard', onClipboard)
  }, [canvas, deps])
}