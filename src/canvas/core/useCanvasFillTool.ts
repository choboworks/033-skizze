// src/canvas/core/useCanvasFillTool.ts
import { useEffect } from 'react'
import type { MutableRefObject } from 'react'
import {
  Textbox,
  Text,
  Line,
  Rect,
  Ellipse,
  Triangle,
  Path,
  Group,
} from 'fabric'
import type {
  Canvas,
  Object as FabricObject,
} from 'fabric'

import { useAppStore } from '../../store/appStore'
import type { ElementModel } from '../canvasTypes'

import {
  type ObjWithData,
  getId,
} from './canvasCore'

import { tryApplyVehicleFill } from './useCarFeatures'
import { tryApplyGenericSvgBodyFill } from './svgBodyFill'

// ✅ NEU: Einfacher Type für das History-Objekt
type HistoryBridge = {
  styleChanged: (id: string, before: ElementModel['style'], after: ElementModel['style']) => void
  forceCommit: () => void  // ← NEU
}

type UseCanvasFillToolOpts = {
  fabricRef: MutableRefObject<Canvas | null>
  uiTool: string
  history: HistoryBridge  // ← Geändert von CanvasHistoryBridge
}

/** Ermittelt die aktuelle Body-Farbe eines generischen SVG-Groups */
function getFirstBodyFill(g: Group): string {
  const kids = g.getObjects()
  for (const k of kids) {
    const meta = k as unknown as { name?: unknown; id?: unknown; fill?: unknown }
    const raw =
      (typeof meta.name === 'string'
        ? meta.name
        : typeof meta.id === 'string'
          ? meta.id
          : '') || ''
    if (raw.toLowerCase().startsWith('body')) {
      const f = meta.fill
      if (
        typeof f === 'string' &&
        f.trim().toLowerCase() !== 'none' &&
        f.trim() !== ''
      ) {
        return f
      }
    }
  }
  return '#ffffff'
}

type StoreShape = {
  elements: Record<string, ElementModel>
  upsertElement: (el: ElementModel) => void
  ui: { fill: { color: string } }
}

/** Ermittelt grob die bisherige Body-Farbe eines Fahrzeug-Groups */
function getFirstVehicleBodyFill(g: Group): string {
  const kids = g.getObjects()
  for (const k of kids) {
    const meta = k as unknown as { name?: unknown; id?: unknown; fill?: unknown }
    const raw =
      (typeof meta.name === 'string'
        ? meta.name
        : typeof meta.id === 'string'
          ? meta.id
          : '') || ''
    if (raw.toLowerCase().startsWith('body')) {
      const f = meta.fill
      if (
        typeof f === 'string' &&
        f.trim().toLowerCase() !== 'none' &&
        f.trim() !== ''
      ) {
        return f
      }
    }
  }
  return '#ffffff'
}

export function useCanvasFillTool({
  fabricRef,
  uiTool,
  history,
}: UseCanvasFillToolOpts): void {
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    if (uiTool !== 'fill') return

    const FILL_CURSOR_STR = 'url(/assets/fill.png) 4 18, pointer'
    const FORBIDDEN_CURSOR_STR = 'url(/assets/forbidden.png) 12 12, not-allowed'

    const getStore = () =>
      useAppStore.getState() as unknown as StoreShape

    const isArrowPath = (o: FabricObject): boolean =>
      o instanceof Path && !!((o as ObjWithData).data?.arrow)

    const isObjectsPrimitive = (o: FabricObject): boolean =>
      o instanceof Line ||
      o instanceof Rect ||
      o instanceof Ellipse ||
      o instanceof Triangle ||
      isArrowPath(o)

    const canFillTarget = (o?: FabricObject): boolean => {
      if (!o) return false

      // Text (inkl. Meta-Texte) füllbar
      if (o instanceof Textbox || o instanceof Text) return true

      // Primitive aus dem Objekte-Tool
      if (isObjectsPrimitive(o)) return true

      // SVG-Group mit "body*" Parts?
      let g: Group | null = null
      if (o instanceof Group) {
        g = o
      } else {
        const maybeGroup = (o as FabricObject & { group?: Group | null }).group
        if (maybeGroup instanceof Group) g = maybeGroup
      }
      if (!g) return false

      return g.getObjects().some((k) => {
        const meta = k as unknown as { name?: unknown; id?: unknown }
        const raw =
          (typeof meta.name === 'string'
            ? meta.name
            : typeof meta.id === 'string'
              ? meta.id
              : '') || ''
        return raw.toLowerCase().startsWith('body')
      })
    }

    const onMouseMoveForFill = (ev: unknown) => {
      const target = (ev as { target?: FabricObject } | null)?.target
      canvas.hoverCursor = canFillTarget(target)
        ? FILL_CURSOR_STR
        : FORBIDDEN_CURSOR_STR
    }

    const resolveGroup = (o: FabricObject): Group | null => {
      if (o instanceof Group) return o
      const g = (o as FabricObject & { group?: Group | null }).group
      return g instanceof Group ? g : null
    }

    const setProps = (
      obj: FabricObject,
      props: Partial<FabricObject>,
    ) => {
      const maybeSet = (obj as {
        set?: (p: Partial<FabricObject>) => FabricObject
      }).set
      if (typeof maybeSet === 'function') {
        maybeSet.call(obj, props)
      } else {
        Object.assign(obj, props)
      }
      ;(obj as { dirty?: boolean }).dirty = true
    }

const onFill = (opt: { target?: FabricObject }) => {
  const tgt = opt.target as FabricObject | undefined
  if (!tgt) return

  // 🔥 NEU: Transaction beenden falls noch aktiv
  history.forceCommit()

      const store = getStore()
      const color = store.ui.fill.color
      const all = store.elements
      const upsertElement = store.upsertElement

      // Hilfsfunktion: Store-Stil + History synchron schreiben
      const commitStyle = (params: {
        id: string
        patch: Partial<ElementModel['style']>
        beforeFillOverride?: string
      }) => {
        const { id, patch, beforeFillOverride } = params
        const prev = all[id]
        if (!prev) return

        const before: ElementModel['style'] =
          beforeFillOverride !== undefined
            ? { ...prev.style, fill: beforeFillOverride }
            : prev.style

        const after: ElementModel['style'] = {
          ...prev.style,
          ...patch,
        }

        upsertElement({ ...prev, style: after })
        history.styleChanged(id, before, after)
      }

      // === 0) TEXT (Textbox + Text) – inkl. Meta-Overlays ===
      if (tgt instanceof Textbox || tgt instanceof Text) {
        setProps(tgt, { fill: color })

        const id = getId(tgt)
        if (id) {
          commitStyle({
            id,
            patch: { fill: color },
          })
        }

        canvas.requestRenderAll()
        return
      }

      // === 1) Fahrzeuge: Host-Gruppe füllen (Body-Parts) ===
      {
        const host = resolveGroup(tgt)
        const isVehicle = !!(
          host &&
          (host as { data?: { category?: string } }).data?.category ===
            'vehicle'
        )
        if (isVehicle && host) {
          const beforeFill = getFirstVehicleBodyFill(host)

          const handled = tryApplyVehicleFill(host, color)
          if (handled) {
            const hostId = (host as { data?: { id?: string } }).data?.id
            if (hostId) {
              commitStyle({
                id: hostId,
                patch: { fill: color },
                beforeFillOverride: beforeFill,
              })
            }
            canvas.requestRenderAll()
            return
          }
        }
      }

// === 2) Generisch: SVG-Gruppe mit "body*" Parts ===
{
  const host = resolveGroup(tgt)
  const beforeFill = host ? getFirstBodyFill(host) : '#ffffff'  // ← VORHER lesen!
  
  let ok = false
  try {
    ok = tryApplyGenericSvgBodyFill(tgt, color)
  } catch {
    // no-op
  }
  if (ok) {
    const hostId =
      (host as { data?: { id?: string } } | null)?.data?.id ?? getId(tgt)
    if (hostId) {
      commitStyle({
        id: hostId,
        patch: { fill: color },
        beforeFillOverride: beforeFill,
      })
    }
    canvas.requestRenderAll()
    return
  }
}

// === 3) Primitive aus dem Objekte-Tool ===
if (!isObjectsPrimitive(tgt)) return

// 🔥 ALTE Farbe AUSLESEN bevor wir ändern
const beforeFill = tgt instanceof Line || isArrowPath(tgt)
  ? (tgt as { stroke?: unknown }).stroke
  : (tgt as { fill?: unknown }).fill

const beforeColor = typeof beforeFill === 'string' ? beforeFill : undefined

if (tgt instanceof Line || isArrowPath(tgt)) {
  setProps(tgt, { stroke: color })
} else {
  setProps(tgt, { fill: color })
}

const id = getId(tgt)
if (id) {
  if (tgt instanceof Line || isArrowPath(tgt)) {
    commitStyle({
      id,
      patch: { stroke: color },
      beforeFillOverride: beforeColor,  // ← NEU
    })
  } else {
    commitStyle({
      id,
      patch: { fill: color },
      beforeFillOverride: beforeColor,  // ← NEU
    })
  }
}

canvas.requestRenderAll()
    }

    canvas.on('mouse:down', onFill as unknown as () => void)
    canvas.on('mouse:move', onMouseMoveForFill as unknown as () => void)

    return () => {
      canvas.off('mouse:down', onFill as unknown as () => void)
      canvas.off('mouse:move', onMouseMoveForFill as unknown as () => void)
    }
  }, [fabricRef, uiTool, history])
}
