//src/canvas/core/ctrlMultiSelect.ts
import { ActiveSelection, Canvas, Group, type Object as FabricObject } from 'fabric'
import { useAppStore } from '../../store/appStore'
import { isMetaOverlay } from './metaOverlays'
import type { ObjWithData } from './canvasCore'

type CanvasPriv = Canvas & {
  upperCanvasEl?: HTMLCanvasElement
  // in Fabric vorhanden, aber nicht im TS-Typ exportiert
  findTarget?: (e: Event, skipGroup?: boolean) => FabricObject | null
}

/**
 * Ctrl/Strg-Klick Mehrfachauswahl direkt auf dem DOM-Canvas.
 * Gibt eine Cleanup-Funktion zurück, um den Listener wieder zu entfernen.
 */
export function attachCtrlMultiSelect(canvas: Canvas): () => void {
  const cv = canvas as CanvasPriv
  const upper = cv.upperCanvasEl
  const findTarget = cv.findTarget

  if (!upper || typeof findTarget !== 'function') {
    // Nichts zu tun (sollte in Fabric v6 vorhanden sein)
    return () => {}
  }

  canvas.selection = true

  const topLevelTarget = (t?: FabricObject | null): FabricObject | null => {
    if (!t) return null
    const parent = (t as FabricObject & { group?: Group | null }).group
    return parent ?? t
  }

  const setActiveSelectionFrom = (cvx: Canvas, objs: FabricObject[]) => {
    if (objs.length === 0) {
      cvx.discardActiveObject()
      return
    }
    if (objs.length === 1) {
      cvx.setActiveObject(objs[0])
      objs[0].setCoords()
      return
    }
    const sel = new ActiveSelection(objs, { canvas: cvx })
    cvx.setActiveObject(sel)
    sel.setCoords()
  }

  const storeSetSelection = (ids: string[]) => {
    try {
      (useAppStore.getState() as unknown as { setSelection?: (i: string[]) => void })
        .setSelection?.(ids)
    } catch {
      // no-op
    }
  }

  const onDomMouseDownCapture = (ev: MouseEvent) => {
    // Nur im Select-Tool eingreifen
    if (useAppStore.getState().ui.tool !== 'select') return

    const ctrlMeta = ev.ctrlKey || ev.metaKey
    if (!ctrlMeta) return

    // Vor Fabric: Ziel bestimmen (skipGroup=true gibt Child; wir heben auf Top an)
    const raw = findTarget.call(cv, ev, true) as FabricObject | null
    const tgt = topLevelTarget(raw)
    if (!tgt || isMetaOverlay(tgt)) return // Meta ignorieren, Event nicht schlucken

    // Aktuelle Auswahl VOR Fabric lesen (hier ist die alte Auswahl noch aktiv!)
    const current = canvas.getActiveObjects() // kann 0,1,n sein
    let next: FabricObject[]

    const inSel = current.indexOf(tgt) >= 0
    if (inSel) {
      // Toggle: Ziel aus der Auswahl entfernen
      next = current.filter(o => o !== tgt)
    } else {
      // Hinzufügen
      next = current.concat(tgt)
    }

    setActiveSelectionFrom(canvas, next)
    canvas.requestRenderAll()

    // Store-Selection sofort synchronisieren (falls Fabric-Events nicht feuern)
    const ids = next
      .map(o => (o as ObjWithData).data?.id)
      .filter((x): x is string => !!x)
    storeSetSelection(ids)

    // Fabric-Default vollständig unterbinden (sonst überschreibt Fabric unsere Auswahl)
    ev.preventDefault()
    ev.stopPropagation()
    ;(ev as unknown as { stopImmediatePropagation?: () => void })
      .stopImmediatePropagation?.()
  }

  upper.addEventListener('mousedown', onDomMouseDownCapture, { capture: true })

  // Cleanup-Funktion zurückgeben (optional nutzen)
  return () => {
    upper.removeEventListener('mousedown', onDomMouseDownCapture, true)
  }
}
