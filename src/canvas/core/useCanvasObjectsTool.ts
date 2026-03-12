// src/canvas/core/useCanvasObjectsTool.ts
import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import {
  Canvas,
  Line,
  Rect,
  Ellipse,
  Triangle,
  Path,
  type Object as FabricObject,
} from 'fabric'

import { uid } from '../canvasUtils'
import {
  type ObjWithData,
  type InteractiveObj,
  type FabricPointerEvt,
  hasShift,
  hasAlt,
  deg,
  rad,
  snap15,
  setName,
  setData,
} from './canvasCore'

import type { Tool } from '../../store/appStore'

export type ObjectsMode =
  | 'line'
  | 'arrow-end'
  | 'arrow-both'
  | 'arrow-curve'
  | 'rect'
  | 'ellipse'
  | 'triangle'

type UseCanvasObjectsToolOpts = {
  fabricRef: MutableRefObject<Canvas | null>
  uiTool: Tool
  objectsMode?: ObjectsMode
  uiSetTool: (tool: Tool) => void
}

type UseCanvasObjectsToolResult = {
  cancelTempShape: () => void
}

export function useCanvasObjectsTool({
  fabricRef,
  uiTool,
  objectsMode,
  uiSetTool,
}: UseCanvasObjectsToolOpts): UseCanvasObjectsToolResult {
  const tempShapeRef = useRef<FabricObject | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const resetAfterDraw = () => {
      canvas.selection = true
      canvas.skipTargetFind = false
      drawingRef.current = false
      startRef.current = null
    }

    const onDown = (opt: unknown) => {
      if (uiTool !== 'objects') return
      if (!objectsMode) return

      const e = (opt as { e: FabricPointerEvt }).e
      const p = canvas.getPointer(e as FabricPointerEvt)

      startRef.current = p
      drawingRef.current = true
      canvas.selection = false
      canvas.skipTargetFind = true

      // Temp-Shape mit __temp Flag - wird von History ignoriert
      const markTemp = (o: FabricObject) => {
        setData(o, { __temp: true })
      }

      // Linien / Pfeile (inkl. gebogener Pfeil) starten als einfache Linie
      if (
        objectsMode === 'line' ||
        objectsMode === 'arrow-end' ||
        objectsMode === 'arrow-both' ||
        objectsMode === 'arrow-curve'
      ) {
        const ln = new Line([p.x, p.y, p.x, p.y], {
          stroke: '#111827',
          strokeWidth: 2,
        })
        markTemp(ln)
        tempShapeRef.current = ln
        canvas.add(ln)
        return
      }
if (objectsMode === 'rect') {
  const rc = new Rect({
    left: p.x,
    top: p.y,
    width: 1,
    height: 1,
    stroke: '#111827',
    strokeWidth: 2,
    fill: 'transparent',  // ← Ändern
  })
        markTemp(rc)
        tempShapeRef.current = rc
        canvas.add(rc)
        return
      }

      if (objectsMode === 'ellipse') {
        const el = new Ellipse({
          left: p.x,
          top: p.y,
          rx: 1,
          ry: 1,
          stroke: '#111827',
          strokeWidth: 2,
          fill: 'rgba(0,0,0,0)',
        })
        markTemp(el)
        tempShapeRef.current = el
        canvas.add(el)
        return
      }

      if (objectsMode === 'triangle') {
        const tri = new Triangle({
          left: p.x,
          top: p.y,
          width: 1,
          height: 1,
          stroke: '#111827',
          strokeWidth: 2,
          fill: 'rgba(0,0,0,0)',
        })
        markTemp(tri)
        tempShapeRef.current = tri
        canvas.add(tri)
        return
      }
    }

    const onMove = (opt: unknown) => {
      if (uiTool !== 'objects') return
      const start = startRef.current
      const temp = tempShapeRef.current
      if (!drawingRef.current || !start || !temp) return

      const e = (opt as { e: FabricPointerEvt }).e
      const p = canvas.getPointer(e as FabricPointerEvt)

      // Linie / Pfeil – 15° Snap (ohne Shift)
      if (temp instanceof Line) {
        const dx = p.x - start.x
        const dy = p.y - start.y
        let x2 = p.x
        let y2 = p.y
        const isShift = hasShift(e)
        if (!isShift) {
          const a = snap15(deg(Math.atan2(dy, dx)))
          const r = Math.hypot(dx, dy)
          x2 = start.x + Math.cos(rad(a)) * r
          y2 = start.y + Math.sin(rad(a)) * r
        }
        temp.set({ x1: start.x, y1: start.y, x2, y2 })
        canvas.requestRenderAll()
        return
      }

      if (temp instanceof Rect) {
        const alt = hasAlt(e)
        const dx = p.x - start.x
        const dy = p.y - start.y
        const w = Math.abs(dx)
        const h = Math.abs(dy)

        if (alt) {
          const s = Math.max(w, h)
          const left = dx >= 0 ? start.x : start.x - s
          const top = dy >= 0 ? start.y : start.y - s
          temp.set({ left, top, width: s, height: s })
        } else {
          const left = Math.min(start.x, p.x)
          const top = Math.min(start.y, p.y)
          temp.set({ left, top, width: w, height: h })
        }

        canvas.requestRenderAll()
        return
      }

      if (temp instanceof Ellipse) {
        const alt = hasAlt(e)
        const dx = p.x - start.x
        const dy = p.y - start.y
        const w = Math.abs(dx)
        const h = Math.abs(dy)

        if (alt) {
          const s = Math.max(w, h)
          const left = dx >= 0 ? start.x : start.x - s
          const top = dy >= 0 ? start.y : start.y - s
          temp.set({ left, top, rx: s / 2, ry: s / 2 })
        } else {
          const left = Math.min(start.x, p.x)
          const top = Math.min(start.y, p.y)
          temp.set({ left, top, rx: w / 2, ry: h / 2 })
        }

        canvas.requestRenderAll()
        return
      }

      if (temp instanceof Triangle) {
        const alt = hasAlt(e)
        const dx = p.x - start.x
        const dy = p.y - start.y
        const w = Math.abs(dx)
        const h = Math.abs(dy)

        if (alt) {
          const s = Math.max(w, h)
          const eqH = (s * Math.sqrt(3)) / 2
          const left = dx >= 0 ? start.x : start.x - s
          const top = dy >= 0 ? start.y : start.y - eqH
          temp.set({ left, top, width: s, height: eqH })
        } else {
          const left = Math.min(start.x, p.x)
          const top = Math.min(start.y, p.y)
          temp.set({ left, top, width: w, height: h })
        }

        canvas.requestRenderAll()
        return
      }
    }

    // Gerader Pfeil (Ende / beide Enden)
    const buildArrowHead = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      bothEnds: boolean,
    ): Path => {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1
      const ux = (x2 - x1) / len
      const uy = (y2 - y1) / len
      const size = 12

      const leftX = x2 - ux * size - uy * (size * 0.6)
      const leftY = y2 - uy * size + ux * (size * 0.6)
      const rightX = x2 - ux * size + uy * (size * 0.6)
      const rightY = y2 - uy * size - ux * (size * 0.6)

      const path: string[] = [
        `M ${x1} ${y1} L ${x2} ${y2}`,
        `M ${leftX} ${leftY} L ${x2} ${y2} L ${rightX} ${rightY}`,
      ]

      if (bothEnds) {
        const l2x = x1 + ux * size - uy * (size * 0.6)
        const l2y = y1 + uy * size + ux * (size * 0.6)
        const r2x = x1 + ux * size + uy * (size * 0.6)
        const r2y = y1 + uy * size - ux * (size * 0.6)
        path.push(`M ${l2x} ${l2y} L ${x1} ${y1} L ${r2x} ${r2y}`)
      }

      return new Path(path.join(' '), {
        stroke: '#111827',
        strokeWidth: 2,
        fill: '',
      })
    }

    // Gebogener Pfeil
    const buildCurvedArrow = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ): Path => {
      const dx = x2 - x1
      const dy = y2 - y1
      const len = Math.hypot(dx, dy) || 1

      let nx = dy / len
      let ny = -dx / len

      if (ny > 0) {
        nx = -nx
        ny = -ny
      }

      const bendFactor = 0.25
      const radius = len * 0.6

      const cx = (x1 + x2) / 2 + nx * radius * bendFactor
      const cy = (y1 + y2) / 2 + ny * radius * bendFactor

      const segments: string[] = [
        `M ${x1} ${y1}`,
        `Q ${cx} ${cy} ${x2} ${y2}`,
      ]

      const tx = x2 - cx
      const ty = y2 - cy
      const tlen = Math.hypot(tx, ty) || 1
      const tux = tx / tlen
      const tuy = ty / tlen

      const size = 12
      const leftX  = x2 - tux * size - tuy * (size * 0.6)
      const leftY  = y2 - tuy * size + tux * (size * 0.6)
      const rightX = x2 - tux * size + tuy * (size * 0.6)
      const rightY = y2 - tuy * size - tux * (size * 0.6)

      segments.push(`M ${leftX} ${leftY} L ${x2} ${y2} L ${rightX} ${rightY}`)

      return new Path(segments.join(' '), {
        stroke: '#111827',
        strokeWidth: 2,
        fill: '',
      })
    }

    const onUp = () => {
      if (uiTool !== 'objects') {
        resetAfterDraw()
        return
      }

      const start = startRef.current
      const temp = tempShapeRef.current
      resetAfterDraw()
      if (!start || !temp) return

      // 🔥 PFEILE: Temp-Linie entfernen und finalen Pfeil erstellen
      if (
        temp instanceof Line &&
        (objectsMode === 'arrow-end' ||
          objectsMode === 'arrow-both' ||
          objectsMode === 'arrow-curve')
      ) {
        const ln = temp as Line
        const { x1, y1, x2, y2 } = ln

        // Temp-Linie entfernen (keine History, weil __temp = true)
        canvas.remove(ln)
        tempShapeRef.current = null

        const newId = objectsMode === 'arrow-curve' ? uid('arrowCurve') : uid('arrow')

        let arrowPath: Path
        if (objectsMode === 'arrow-curve') {
          arrowPath = buildCurvedArrow(x1!, y1!, x2!, y2!)
        } else {
          arrowPath = buildArrowHead(
            x1!,
            y1!,
            x2!,
            y2!,
            objectsMode === 'arrow-both',
          )
        }

        const arrow = arrowPath as unknown as ObjWithData & FabricObject
        
        // Finale Daten setzen (OHNE __temp)
        arrow.data = {
          id: newId,
          arrow: objectsMode,
        }

        const label =
          objectsMode === 'arrow-both'
            ? 'Pfeil (beide)'
            : objectsMode === 'arrow-curve'
              ? 'Gebogener Pfeil'
              : 'Pfeil'
        setName(arrow, label)

        const a = arrow as InteractiveObj
        a.selectable = true
        a.evented = true
        a.hasControls = true
        a.lockMovementX = false
        a.lockMovementY = false
        a.perPixelTargetFind = false

        // 🎯 canvas.add() feuert object:added → canvasHistory macht den Rest!
        canvas.add(arrow)
        arrow.setCoords()

        canvas.setActiveObject(arrow)
        canvas.requestRenderAll()
        uiSetTool('select')

        return
      }
      
      // Temp-Shape entfernen (keine History, weil __temp = true)
      canvas.remove(temp)
      tempShapeRef.current = null

      const newId = uid('obj')
      let finalShape: FabricObject | null = null

      // Shape-Typ bestimmen und finales Shape erstellen
      if (temp instanceof Line) {
        const ln = temp as Line
        finalShape = new Line([ln.x1!, ln.y1!, ln.x2!, ln.y2!], {
          stroke: '#111827',
          strokeWidth: 2,
        })
        setName(finalShape, 'Linie')
      } else if (temp instanceof Rect) {
finalShape = new Rect({
  left: temp.left,
  top: temp.top,
  width: temp.width,
  height: temp.height,
  stroke: '#111827',
  strokeWidth: 2,
  fill: 'transparent',  // ← Ändern
})
        setName(finalShape, 'Rechteck')
      } else if (temp instanceof Ellipse) {
        finalShape = new Ellipse({
          left: temp.left,
          top: temp.top,
          rx: temp.rx,
          ry: temp.ry,
          stroke: '#111827',
          strokeWidth: 2,
          fill: 'rgba(0,0,0,0)',
        })
        setName(finalShape, 'Ellipse')
      } else if (temp instanceof Triangle) {
        finalShape = new Triangle({
          left: temp.left,
          top: temp.top,
          width: temp.width,
          height: temp.height,
          stroke: '#111827',
          strokeWidth: 2,
          fill: 'rgba(0,0,0,0)',
        })
        setName(finalShape, 'Dreieck')
      }

      if (!finalShape) return

      // Finale Daten setzen (OHNE __temp)
      setData(finalShape, { id: newId })

      const f = finalShape as InteractiveObj
      f.selectable = true
      f.evented = true
      f.hasControls = true
      f.lockMovementX = false
      f.lockMovementY = false
      f.perPixelTargetFind = false

      // 🎯 canvas.add() feuert object:added → canvasHistory macht den Rest!
      canvas.add(finalShape)
      finalShape.setCoords()

      canvas.setActiveObject(finalShape)
      canvas.requestRenderAll()
      uiSetTool('select')
    }

    canvas.on('mouse:down', onDown)
    canvas.on('mouse:move', onMove)
    canvas.on('mouse:up', onUp)

    const onWindowUp = () => {
      if (!drawingRef.current) return
      onUp()
    }
    window.addEventListener('mouseup', onWindowUp)

    return () => {
      canvas.off('mouse:down', onDown)
      canvas.off('mouse:move', onMove)
      canvas.off('mouse:up', onUp)
      window.removeEventListener('mouseup', onWindowUp)

      if (tempShapeRef.current) {
        canvas.remove(tempShapeRef.current)
        tempShapeRef.current = null
        canvas.requestRenderAll()
      }
    }
  }, [fabricRef, uiTool, objectsMode, uiSetTool])

  const cancelTempShape = () => {
    const canvas = fabricRef.current
    if (!canvas) return
    const temp = tempShapeRef.current
    if (!temp) return
    canvas.remove(temp)
    tempShapeRef.current = null
    canvas.requestRenderAll()
  }

  return { cancelTempShape }
}