// src/canvas/core/useMarqueeSelection.ts
import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import {
  Canvas,
  Group,
  type Object as FabricObject,
} from 'fabric'
import { useAppStore } from '../../store/appStore'

type CanvasMaybeDisposed = Canvas & { disposed?: boolean }

type Params = {
  clipCanvas: Canvas | null
  stageRef: MutableRefObject<HTMLDivElement | null>
  marqueeRef: MutableRefObject<HTMLDivElement | null>
  clientToCanvasXY: (
    clientX: number,
    clientY: number,
    stageEl: HTMLDivElement
  ) => { x: number; y: number }
  spaceHandActiveRef: MutableRefObject<boolean>
  orientation: unknown
}

/**
 * Rechteck-Auswahl (Marquee) im Select-Tool:
 * - Drag auf leerer Fläche → Box anzeigen
 * - Mausbewegung → Box-Größe anpassen
 * - MouseUp → Box ausblenden
 *
 * Zeichnet nur die Box im DOM, die eigentliche Auswahl
 * übernimmt weiter Fabric über die Layer-Bridge.
 */
export function useMarqueeSelection({
  clipCanvas,
  stageRef,
  marqueeRef,
  clientToCanvasXY,
  spaceHandActiveRef,
  orientation,
}: Params): void {
  const marqueeStateRef = useRef<{
    on: boolean
    startX: number
    startY: number
  } | null>(null)

  useEffect(() => {
    type CanvasPriv = Canvas & {
      upperCanvasEl?: HTMLCanvasElement
      findTarget?: (e: Event, skipGroup?: boolean) => FabricObject | null
    }

    const cv = clipCanvas as CanvasPriv | null
    const stage = stageRef.current
    const box = marqueeRef.current
    if (!cv || (cv as CanvasMaybeDisposed).disposed || !stage || !box) return
    const upper = cv.upperCanvasEl
    if (!upper || typeof cv.findTarget !== 'function') return

    const topLevelTarget = (
      t?: FabricObject | null
    ): FabricObject | null => {
      if (!t) return null
      const parent = (t as FabricObject & { group?: Group | null }).group
      return parent ?? t
    }

    const onDown = (ev: MouseEvent) => {
      // Nur im Select-Tool
      if (useAppStore.getState().ui.tool !== 'select') return
      // Nicht bei aktiver Space-Hand
      if (spaceHandActiveRef.current) return
      // Ctrl/Meta = Multi-Select per Click – kein Marquee
      if (ev.ctrlKey || ev.metaKey) return

      // Prüfen, ob ein Objekt getroffen wurde
      const raw = cv.findTarget!.call(cv, ev, true) as FabricObject | null
      const tgt = topLevelTarget(raw)
      if (tgt) return

      // Leerfläche: Marquee aktivieren
      const { x, y } = clientToCanvasXY(ev.clientX, ev.clientY, stage)
      marqueeStateRef.current = { on: true, startX: x, startY: y }

      box.style.display = 'block'
      box.style.left = `${x}px`
      box.style.top = `${y}px`
      box.style.width = '0px'
      box.style.height = '0px'
    }

    const onMove = (ev: MouseEvent) => {
      const st = marqueeStateRef.current
      if (!st?.on) return

      const { x, y } = clientToCanvasXY(ev.clientX, ev.clientY, stage)
      const l = Math.min(st.startX, x)
      const t = Math.min(st.startY, y)
      const w = Math.abs(x - st.startX)
      const h = Math.abs(y - st.startY)

      if (w < 2 && h < 2) {
        box.style.width = '0px'
        box.style.height = '0px'
        return
      }

      box.style.left = `${l}px`
      box.style.top = `${t}px`
      box.style.width = `${w}px`
      box.style.height = `${h}px`
    }

    const onUp = () => {
      if (!marqueeStateRef.current?.on) return
      marqueeStateRef.current = null
      box.style.display = 'none'
    }

    upper.addEventListener('mousedown', onDown, { capture: true })
    window.addEventListener('mousemove', onMove, { capture: true })
    window.addEventListener('mouseup', onUp, { capture: true })

    return () => {
      upper.removeEventListener('mousedown', onDown, true)
      window.removeEventListener('mousemove', onMove, true)
      window.removeEventListener('mouseup', onUp, true)
    }
  }, [
    clipCanvas,
    clientToCanvasXY,
    orientation,
    spaceHandActiveRef,
    stageRef,
    marqueeRef,
  ])
}
