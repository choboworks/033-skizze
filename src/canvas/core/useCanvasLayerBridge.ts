// src/canvas/core/useCanvasLayerBridge.ts
import { useCallback, useEffect } from 'react'
import type { MutableRefObject } from 'react'
import {
  ActiveSelection,
  Group,
  Textbox,
  type Canvas,
  type FabricObject,
} from 'fabric'

import { useAppStore } from '../../store/appStore'
import {
  getId,
  getData,
  setData,
  extractGeom,
  getStr,
  isChainObject,
  type GroupData,
  type ObjWithData,
  type ObjWithStyle,
} from './canvasCore'
import { isMetaOverlay } from './metaOverlays'
import { dissolveChain, isChainGroup, type GroupWithChain } from '../roads/chains'
import { createPlainGroup, dissolvePlainGroup } from './useGrouping'
import type { ElementModel } from '../canvasTypes'

/* =============================================================================
   Types & Constants
   ========================================================================== */

type CanvasWithTop = {
  _clearTopCanvas?: () => void
  contextTop?: CanvasRenderingContext2D | null
  clearContext?: (ctx: CanvasRenderingContext2D) => void
}

const BRIDGE_EVENTS = {
  SELECT_IDS: 'app:select-ids',
  UPDATE_VISIBILITY: 'app:update-visibility',
  DELETE_ID: 'app:delete-id',
  RENAME_ID: 'app:rename-id',
  REORDER_Z: 'app:reorder-z',
  DISSOLVE_CHAIN: 'app:dissolve-chain',
  GROUP_SELECTION: 'app:group-selection',
  QUICK_INSERT: 'app:quick-insert-asset',
  FLIP_SELECTION: 'app:flip-selection',
  UPDATE_GEOM: 'app:update-geom',
} as const

type AppStoreWithBridge = {
  elements: Record<string, ElementModel>
  ui: {
    selection?: string[]
  }
  upsertElement: (el: ElementModel) => void
  updateGeom: (id: string, geom: Partial<ElementModel['geom']>) => void
  removeElement: (id: string, force?: boolean) => void
  bumpRecent?: (id: string) => void
  setState: (fn: (state: unknown) => unknown) => void
}

const getStore = () => useAppStore.getState() as unknown as AppStoreWithBridge

export type CanvasHistoryBridgeApi = {
  groupedChain: (partIds: string[], chainId: string, groupStoreId: string) => void
  ungroupedChain: (partIds: string[], chainId: string | undefined, groupStoreId: string) => void
  visibilityChanged: (id: string, prevVisible: boolean, nextVisible: boolean) => void
  renamed: (id: string, beforeName: string | undefined, afterName: string) => void
  zReordered: (prevTopDown: string[], nextTopDown: string[]) => void
}

type DissolveChainDetail = {
  groupId?: string
  chainId?: string
  id?: string
}

type GroupSelectionDetail = {
  ids: string[]
  name?: string
  chainId?: string
  groupStoreId?: string
}

type UseCanvasLayerBridgeArgs = {
  fabricRef: MutableRefObject<Canvas | null>
  getViewportCenterInCanvasCoords: () => { cx: number; cy: number }
  placeAssetAt: (assetId: string, x: number, y: number) => Promise<void> | void
  setSelection: (ids: string[]) => void
  clearSelection: () => void
  removeElement: (id: string, force?: boolean) => void
  renameElement?: (id: string, name: string) => void
  setVisibleStore?: (id: string, v: boolean) => void
  unlinkChainParts: (chainId: string, partIds: string[]) => void
  history: CanvasHistoryBridgeApi
  unlinkingRef: MutableRefObject<boolean>
}

export type CanvasLayerBridgeApi = {
  scrubCanvasOrphans: () => void
}

/* =============================================================================
   Utilities
   ========================================================================== */

const makeId = (prefix: string) =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${prefix}_${(crypto as unknown as { randomUUID: () => string }).randomUUID().slice(0, 8)}`
    : `${prefix}_${Math.random().toString(36).slice(2, 10)}`

const isRoadLike = (o: unknown): boolean => {
  const d = getData(o) as { category?: unknown; svgConnectors?: unknown } | undefined
  return d?.category === 'road' || Array.isArray(d?.svgConnectors)
}

const uniqStr = (arr: string[]) => Array.from(new Set(arr))

const nextGroupName = (): string => {
  const els = getStore().elements
  let max = 0
  for (const el of Object.values(els)) {
    const nm = String((el.data as { name?: string } | undefined)?.name ?? '').trim()
    const m = /^Gruppe\s+(\d+)$/.exec(nm)
    if (m) max = Math.max(max, parseInt(m[1] || '0', 10))
  }
  return `Gruppe ${max + 1}`
}

/* =============================================================================
   Flip Operations
   ========================================================================== */

function flipObjects(
  canvas: Canvas,
  active: FabricObject,
  direction: 'horizontal' | 'vertical',
  history: CanvasHistoryBridgeApi
): void {
  const objects =
    active.type === 'activeSelection' ? (active as ActiveSelection).getObjects() : [active]

  const scaleKey = direction === 'horizontal' ? 'scaleX' : 'scaleY'

  objects.forEach((obj) => {
    const currentScale = (obj[scaleKey] as number | undefined) ?? 1
    obj.set({ [scaleKey]: currentScale * -1 })
    obj.setCoords()

    const id = (obj as { data?: { id?: string } }).data?.id
    if (id) {
      window.dispatchEvent(
        new CustomEvent(BRIDGE_EVENTS.UPDATE_GEOM, {
          detail: { id, geom: { [scaleKey]: obj[scaleKey] } },
        })
      )
    }
  })

  canvas.requestRenderAll()
  const label = direction === 'horizontal' ? 'Horizontal gespiegelt' : 'Vertikal gespiegelt'
  history.renamed(`flip-${direction[0]}`, undefined, label)
}

/* =============================================================================
   Main Hook
   ========================================================================== */

export function useCanvasLayerBridge({
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
}: UseCanvasLayerBridgeArgs): CanvasLayerBridgeApi {
  
  /* ---------------------------------------------------------------------------
     Canvas Sync: Remove orphaned objects
     --------------------------------------------------------------------------- */
  
  const scrubCanvasOrphans = useCallback(() => {
    const cv = fabricRef.current
    if (!cv) return

    unlinkingRef.current = true
    try {
      const idsInStore = new Set(Object.keys(getStore().elements))
      const toRemove = cv.getObjects().filter((o) => {
        if (isMetaOverlay(o)) return false
        const id = getId(o)
        return !id || !idsInStore.has(id)
      })
      toRemove.forEach((o) => cv.remove(o))

      const ctop = cv as unknown as CanvasWithTop
      if (typeof ctop._clearTopCanvas === 'function') ctop._clearTopCanvas()
      else if (ctop.contextTop && typeof ctop.clearContext === 'function') {
        ctop.clearContext(ctop.contextTop)
      }

      const active = cv.getActiveObject()
      if (active && !isMetaOverlay(active)) {
        const aid = getId(active)
        if (!aid || !idsInStore.has(aid)) {
          cv.discardActiveObject()
        }
      }
    } finally {
      unlinkingRef.current = false
    }

    cv.requestRenderAll()
  }, [fabricRef, unlinkingRef])

  /* ---------------------------------------------------------------------------
     Z-Order Sync: Canvas → Store
     --------------------------------------------------------------------------- */
  
  const syncZFromCanvasToStore = useCallback(() => {
    const cv = fabricRef.current
    if (!cv) return

    const drawable = cv.getObjects().filter((o) => !isMetaOverlay(o))
    const elementsById = getStore().elements
    const store = getStore()

    for (let i = 0; i < drawable.length; i++) {
      const id = getId(drawable[i] as FabricObject)
      if (!id) continue
      const prev = elementsById[id]
      if (prev && prev.z !== i) {
        store.upsertElement({ ...prev, z: i })
      }
    }
  }, [fabricRef])

  /* ---------------------------------------------------------------------------
     Object Finders
     --------------------------------------------------------------------------- */
  
  const findById = useCallback(
    (id: string): FabricObject | undefined => {
      const cv = fabricRef.current
      if (!cv) return undefined
      return cv.getObjects().find((o) => getId(o) === id)
    },
    [fabricRef]
  )

  const findByIdDeep = useCallback(
    (cv: Canvas, id: string): { obj: FabricObject; parent?: Group } | null => {
      const all = cv.getObjects()
      for (const o of all) {
        if (getId(o) === id) return { obj: o }
        if (o instanceof Group) {
          for (const k of o.getObjects()) {
            if (getId(k) === id) return { obj: k as FabricObject, parent: o }
          }
        }
      }
      return null
    },
    []
  )

  const findLabelChildAndParentById = useCallback(
    (labelId: string): { parent: Group; child: Textbox } | null => {
      const cv = fabricRef.current
      if (!cv) return null

      for (const obj of cv.getObjects()) {
        if (!(obj instanceof Group)) continue
        const kids = obj.getObjects()
        for (const k of kids) {
          const kd = (k as ObjWithData).data
          if (kd?.kind === 'vehicleLabel' && kd?.id === labelId && k instanceof Textbox) {
            return { parent: obj, child: k }
          }
        }
      }
      return null
    },
    [fabricRef]
  )

  /* ---------------------------------------------------------------------------
     Event Handlers
     --------------------------------------------------------------------------- */
  
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    // Selection
    const onSelectIds = (ev: Event) => {
      const detail = (ev as CustomEvent<{ ids: string[] }>).detail
      const ids = detail?.ids ?? []
      if (!ids.length) return
      const objs = ids.map(findById).filter((o): o is FabricObject => !!o)
      if (!objs.length) return

      canvas.discardActiveObject()
      if (objs.length === 1) canvas.setActiveObject(objs[0])
      else canvas.setActiveObject(new ActiveSelection(objs, { canvas }))
      setSelection(ids)
      canvas.requestRenderAll()
    }

    // Visibility Toggle
    const onUpdateVisibility = (ev: Event) => {
      const detail = (ev as CustomEvent<{ id: string; visible: boolean }>).detail
      if (!detail) return
      const obj = findById(detail.id)
      if (!obj) return

      const prevVisible = obj.visible ?? true
      obj.visible = detail.visible
      if (setVisibleStore) setVisibleStore(detail.id, detail.visible)
      history.visibilityChanged(detail.id, prevVisible, detail.visible)
      canvas.requestRenderAll()
    }

    // Delete Element
    const onDeleteId = (ev: Event) => {
      const detail = (ev as CustomEvent<{ id: string }>).detail
      if (!detail?.id) return
      const id = detail.id
      const cv = fabricRef.current
      if (!cv) return

      // Top-level object
      const obj = findById(id)
      if (obj) {
        cv.remove(obj)
        cv.requestRenderAll()
        return
      }

      // Vehicle label as group child
      const hit = findLabelChildAndParentById(id)
      if (hit) {
        const { parent, child } = hit
        parent.remove(child)
        parent.setCoords()
        ;(parent as Group & { dirty?: boolean }).dirty = true

        try {
          removeElement(id, true)
        } catch {
          // ignore - label might already be removed from store
        }

        cv.discardActiveObject()
        cv.requestRenderAll()
        return
      }

      // Fallback: Store only
      try {
        removeElement(id, true)
      } catch {
        // ignore - element might already be removed
      }

      try {
        clearSelection()
      } catch {
        // ignore - selection cleanup might fail
      }

      scrubCanvasOrphans()
    }

    // Group Selection (Chain/Plain)
    const onGroupSelection = (ev: Event) => {
      const detail = (ev as CustomEvent<GroupSelectionDetail>).detail
      const idsRaw = detail?.ids ?? []
      if (!idsRaw || idsRaw.length < 2) return

      const cv = fabricRef.current
      if (!cv) return

      const ids = uniqStr(idsRaw)
      const hits = ids
        .map((id) => findByIdDeep(cv, id))
        .filter((h): h is { obj: FabricObject; parent?: Group } => !!h)
      if (hits.length < 2) return

      // Dissolve existing parent groups
      const parentGroups = Array.from(
        new Set(
          hits
            .map((h) => h.parent)
            .filter((g): g is Group => !!g && isChainObject(g as unknown))
        )
      )

      for (const g of parentGroups) {
        const gid = getId(g as unknown as FabricObject)
        if (gid) {
          window.dispatchEvent(
            new CustomEvent(BRIDGE_EVENTS.DISSOLVE_CHAIN, { detail: { groupId: gid } })
          )
        }
      }

      // Collect top-level objects
      const findTop = (id: string) => cv.getObjects().find((o) => getId(o) === id)
      const chosen = ids.map(findTop).filter((o): o is FabricObject => !!o)
      const objs = chosen.filter((o) => !isChainObject(o))
      if (objs.length < 2) return

      const allAreRoads = objs.every(isRoadLike)
      const plainObjs = allAreRoads ? objs : objs.filter((o) => !isRoadLike(o))
      if (plainObjs.length < 2) return

      const partIds = plainObjs
        .map((o) => getData(o)?.id)
        .filter((x): x is string => typeof x === 'string')
      if (!partIds.length) return

      const groupName = (detail?.name || nextGroupName()).trim()
      const chainId = detail?.chainId || makeId('chain')
      const groupStoreId = detail?.groupStoreId || makeId('grp')

      const list = cv.getObjects()
      const sortByCanvasZ = <T extends FabricObject>(arr: T[]) =>
        [...arr].sort((a, b) => list.indexOf(a) - list.indexOf(b))

      const orderedPlain = sortByCanvasZ(plainObjs)
      const topIndex = Math.max(...orderedPlain.map((o) => list.indexOf(o)).filter((i) => i >= 0))

      unlinkingRef.current = true
      try {
        const store = getStore()

        if (allAreRoads) {
          // Road-only grouping
          orderedPlain.forEach((o) => cv.remove(o))
          const g = new Group(orderedPlain as FabricObject[], { subTargetCheck: true })

          setData(g, {
            id: groupStoreId,
            name: groupName,
            kind: 'chain',
            chain: { id: chainId, parts: partIds, joints: [], name: groupName },
          })

          cv.add(g)
          g.setCoords()

          const cvMoveTo = (cv as unknown as { moveTo?: (o: FabricObject, index: number) => void })
            .moveTo
          if (typeof cvMoveTo === 'function') cvMoveTo(g as FabricObject, topIndex)
          else (g as unknown as { moveTo?: (index: number) => void }).moveTo?.(topIndex)

          store.upsertElement({
            id: groupStoreId,
            type: 'shape',
            z: cv.getObjects().filter((x) => !isMetaOverlay(x)).indexOf(g),
            visible: (g as { visible?: boolean }).visible ?? true,
            locked: { move: false, rotate: false, scale: false },
            geom: extractGeom(g),
            style: { fill: undefined, stroke: '#111827', strokeWidth: 0 },
            data: getData(g),
          })

          const all = store.elements
          for (const pid of partIds) {
            const prev = all[pid]
            if (!prev) continue
            store.upsertElement({ ...prev, data: { ...(prev.data ?? {}), chainId } })
          }

          history.groupedChain(partIds, chainId, groupStoreId)
          cv.discardActiveObject()
          cv.setActiveObject(g)
          cv.requestRenderAll()
          syncZFromCanvasToStore()
          return
        }

        // Plain grouping (non-roads)
        const g = createPlainGroup(cv, orderedPlain, groupStoreId, groupName, chainId)

        const cvMoveTo = (cv as unknown as { moveTo?: (o: FabricObject, index: number) => void })
          .moveTo
        if (typeof cvMoveTo === 'function') cvMoveTo(g as FabricObject, topIndex)
        else (g as unknown as { moveTo?: (index: number) => void }).moveTo?.(topIndex)

        store.upsertElement({
          id: groupStoreId,
          type: 'shape',
          z: cv.getObjects().filter((x) => !isMetaOverlay(x)).indexOf(g),
          visible: (g as { visible?: boolean }).visible ?? true,
          locked: { move: false, rotate: false, scale: false },
          geom: extractGeom(g),
          style: { fill: undefined, stroke: '#111827', strokeWidth: 0 },
          data: getData(g),
        })

        const all = store.elements
        for (const pid of partIds) {
          const prev = all[pid]
          if (!prev) continue
          store.upsertElement({ ...prev, data: { ...(prev.data ?? {}), chainId } })
        }

        history.groupedChain(partIds, chainId, groupStoreId)
        cv.discardActiveObject()
        cv.setActiveObject(g)
        cv.requestRenderAll()
        syncZFromCanvasToStore()
      } finally {
        unlinkingRef.current = false
      }
    }

    // Dissolve Chain
    const onDissolveChain = async (ev: Event) => {
      const detail = (ev as CustomEvent<DissolveChainDetail>).detail
      if (!detail) return

      const cv = fabricRef.current
      if (!cv) return

      unlinkingRef.current = true
      try {
        cv.discardActiveObject()

        const elements = getStore().elements
        let groupStoreId: string | undefined = detail.groupId

        if (!groupStoreId && detail.id && elements[detail.id]) {
          const maybe = elements[detail.id]
          const kd = (maybe.data as { kind?: string } | undefined)?.kind
          if (kd === 'chain') groupStoreId = detail.id
        }
        const wantChainId = detail.chainId ?? (groupStoreId ? undefined : detail.id)
        if (!groupStoreId && wantChainId) {
          for (const [eid, el] of Object.entries(elements)) {
            const d = el.data as { kind?: string; chain?: { id?: string } } | undefined
            if (d?.kind === 'chain' && d.chain?.id === wantChainId) {
              groupStoreId = eid
              break
            }
          }
        }
        if (!groupStoreId) return

        const groupObj = cv
          .getObjects()
          .find((o) => getId(o) === groupStoreId) as (Group & { data?: GroupData }) | undefined
        if (!groupObj) return
        if (!isChainGroup(groupObj as unknown as FabricObject)) return

        const partIds: string[] = (groupObj.data?.chain?.parts ?? []).slice()
        history.ungroupedChain(partIds, wantChainId, groupStoreId)

        const isPlainGroup = !groupObj.getObjects().every(isRoadLike)

        if (isPlainGroup) {
          await dissolvePlainGroup(cv, groupObj)

          removeElement(groupStoreId, true)
          const st = getStore()
          if (st.elements[groupStoreId]) {
            useAppStore.setState((s) => {
              const next = { ...s.elements }
              delete next[groupStoreId]
              const sel = new Set(s.ui.selection ?? [])
              sel.delete(groupStoreId)
              return { elements: next, ui: { ...s.ui, selection: Array.from(sel) } }
            })
          }

          syncZFromCanvasToStore()
          clearSelection()
          cv.requestRenderAll()
        } else {
          dissolveChain(cv, groupObj as unknown as GroupWithChain, {
            onUnlinkParts: (chainId, ids) => unlinkChainParts(chainId, ids),
          })

          if (partIds.length) {
            const elsNow = getStore().elements
            for (const pid of partIds) {
              const o = cv.getObjects().find((x) => getId(x) === pid)
              if (o) o.visible = elsNow[pid]?.visible ?? true
            }
          }

          const toRemove = cv.getObjects().filter((o) => !isMetaOverlay(o) && !getId(o))
          toRemove.forEach((o) => cv.remove(o))

          removeElement(groupStoreId, true)
          const st = getStore()
          if (st.elements[groupStoreId]) {
            useAppStore.setState((s) => {
              const next = { ...s.elements }
              delete next[groupStoreId]
              const sel = new Set(s.ui.selection ?? [])
              sel.delete(groupStoreId)
              return { elements: next, ui: { ...s.ui, selection: Array.from(sel) } }
            })
          }

          syncZFromCanvasToStore()
          clearSelection()
          cv.requestRenderAll()
        }
      } finally {
        unlinkingRef.current = false
      }
    }

    // Rename Element
    const onRenameId = (ev: Event) => {
      const detail = (ev as CustomEvent<{ id: string; name: string }>).detail
      if (!detail) return

      const obj = findById(detail.id) as ObjWithData | undefined
      if (!obj) return

      const storeEls = getStore().elements
      const beforeName = (storeEls[detail.id]?.data as { name?: string } | undefined)?.name

      obj.data ??= {}
      obj.data.name = detail.name
      history.renamed(detail.id, beforeName, detail.name)

      if (renameElement) {
        renameElement(detail.id, detail.name)
      } else {
        const st = obj as ObjWithStyle
        const store = getStore()

        store.upsertElement({
          id: detail.id,
          type: 'shape',
          z: canvas.getObjects().filter((x) => !isMetaOverlay(x)).indexOf(obj),
          visible: obj.visible ?? true,
          locked: { move: false, rotate: false, scale: false },
          geom: extractGeom(obj),
          style: {
            fill: getStr(st.fill),
            stroke: getStr(st.stroke) ?? '#111827',
            strokeWidth: st.strokeWidth ?? 2,
          },
          data: obj.data,
        })
      }

      canvas.requestRenderAll()
    }

    // Reorder Z-Index
    const onReorderZ = (ev: Event) => {
      const detail = (ev as CustomEvent<{ idsTopDown: string[] }>).detail
      if (!detail || !detail.idsTopDown || !detail.idsTopDown.length) return

      const allObjs = canvas.getObjects()
      const idSet = new Set(detail.idsTopDown)
      const prevTopDown: string[] = []
      for (let i = allObjs.length - 1; i >= 0; i--) {
        const o = allObjs[i]
        const oid = getId(o as FabricObject)
        if (oid && idSet.has(oid)) prevTopDown.push(oid)
      }

      const idsTopDown = detail.idsTopDown.filter((id) => !!findById(id))
      if (!idsTopDown.length) return

      const idsBottomUp = [...idsTopDown].reverse()
      const prevRenderOnAddRemove: boolean = canvas.renderOnAddRemove
      canvas.renderOnAddRemove = false
      const prevActive: FabricObject | undefined = canvas.getActiveObject()
      canvas.discardActiveObject()

      type CanvasWithMoveTo = { moveTo?(o: FabricObject, index: number): void }
      type ObjectWithMoveTo = { moveTo?(index: number): void }
      type CanvasPrivate = { _objects?: FabricObject[] }
      type MovableObj = FabricObject & { bringForward?: () => void; sendBackwards?: () => void }

      const canvasMoveTo = (canvas as Canvas & CanvasWithMoveTo).moveTo
      const objectsList: FabricObject[] | undefined = (canvas as Canvas & CanvasPrivate)._objects

      idsBottomUp.forEach((id, bottomIndex) => {
        const obj = findById(id)
        if (!obj) return

        if (typeof canvasMoveTo === 'function') {
          canvasMoveTo.call(canvas, obj, bottomIndex)
          return
        }

        const objMoveTo = (obj as ObjectWithMoveTo).moveTo
        if (typeof objMoveTo === 'function') {
          objMoveTo.call(obj, bottomIndex)
          return
        }

        if (objectsList) {
          const current = objectsList.indexOf(obj)
          if (current !== -1 && current !== bottomIndex) {
            objectsList.splice(current, 1)
            objectsList.splice(bottomIndex, 0, obj)
            return
          }
        }

        const list = canvas.getObjects()
        const current = list.indexOf(obj)
        if (current === -1 || current === bottomIndex) return
        const m = obj as MovableObj
        if (current < bottomIndex && typeof m.bringForward === 'function') {
          for (let i = current; i < bottomIndex; i++) m.bringForward()
        } else if (current > bottomIndex && typeof m.sendBackwards === 'function') {
          for (let i = current; i > bottomIndex; i--) m.sendBackwards()
        }
      })

      canvas.renderOnAddRemove = prevRenderOnAddRemove
      canvas.requestRenderAll()

      if (prevActive && canvas.getObjects().includes(prevActive)) {
        canvas.setActiveObject(prevActive)
      }

      syncZFromCanvasToStore()
      history.zReordered(prevTopDown, detail.idsTopDown)
    }

    // Quick Insert Asset
    const onQuickInsert = (ev: Event) => {
      const detail = (ev as CustomEvent<{ assetId: string }>).detail
      const assetId = detail?.assetId
      if (!assetId) return

      const { cx, cy } = getViewportCenterInCanvasCoords()
      void placeAssetAt(assetId, cx, cy)

      try {
        getStore().bumpRecent?.(assetId)
      } catch {
        // ignore - bumpRecent might not be available
      }
    }

    // Flip Selection
    const onFlipSelection = (ev: Event) => {
      const detail = (ev as CustomEvent<{ direction: 'horizontal' | 'vertical' }>).detail
      const cv = fabricRef.current
      if (!cv) return

      const active = cv.getActiveObject()
      if (!active) return

      flipObjects(cv, active, detail.direction, history)
    }

    // Register Event Listeners
    window.addEventListener(BRIDGE_EVENTS.SELECT_IDS, onSelectIds)
    window.addEventListener(BRIDGE_EVENTS.UPDATE_VISIBILITY, onUpdateVisibility)
    window.addEventListener(BRIDGE_EVENTS.DELETE_ID, onDeleteId)
    window.addEventListener(BRIDGE_EVENTS.RENAME_ID, onRenameId)
    window.addEventListener(BRIDGE_EVENTS.REORDER_Z, onReorderZ)
    window.addEventListener(BRIDGE_EVENTS.DISSOLVE_CHAIN, onDissolveChain)
    window.addEventListener(BRIDGE_EVENTS.GROUP_SELECTION, onGroupSelection)
    window.addEventListener(BRIDGE_EVENTS.QUICK_INSERT, onQuickInsert)
    window.addEventListener(BRIDGE_EVENTS.FLIP_SELECTION, onFlipSelection)

    // Cleanup
    return () => {
      window.removeEventListener(BRIDGE_EVENTS.SELECT_IDS, onSelectIds)
      window.removeEventListener(BRIDGE_EVENTS.UPDATE_VISIBILITY, onUpdateVisibility)
      window.removeEventListener(BRIDGE_EVENTS.DELETE_ID, onDeleteId)
      window.removeEventListener(BRIDGE_EVENTS.RENAME_ID, onRenameId)
      window.removeEventListener(BRIDGE_EVENTS.REORDER_Z, onReorderZ)
      window.removeEventListener(BRIDGE_EVENTS.DISSOLVE_CHAIN, onDissolveChain)
      window.removeEventListener(BRIDGE_EVENTS.GROUP_SELECTION, onGroupSelection)
      window.removeEventListener(BRIDGE_EVENTS.QUICK_INSERT, onQuickInsert)
      window.removeEventListener(BRIDGE_EVENTS.FLIP_SELECTION, onFlipSelection)
    }
  }, [
    fabricRef,
    setSelection,
    clearSelection,
    removeElement,
    renameElement,
    setVisibleStore,
    unlinkChainParts,
    history,
    findById,
    findByIdDeep,
    findLabelChildAndParentById,
    getViewportCenterInCanvasCoords,
    placeAssetAt,
    scrubCanvasOrphans,
    syncZFromCanvasToStore,
    unlinkingRef,
  ])

  return { scrubCanvasOrphans }
}