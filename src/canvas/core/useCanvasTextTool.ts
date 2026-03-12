// src/canvas/core/useCanvasTextTool.ts
import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject, Dispatch, SetStateAction } from 'react'
import {
  Canvas,
  Textbox,
  type Object as FabricObject,
} from 'fabric'

import { useAppStore } from '../../store/appStore'
import type { Tool } from '../../store/appStore'

import type { TextCfg } from '../../modules/toolbar/TextEditorOverlay'
import type { ElementModel } from '../canvasTypes'
import { uid } from '../canvasUtils'

import { isMetaOverlay } from './metaOverlays'
import {
  type ObjWithData,
  type ObjWithStyle,
  type CanvasMaybeDisposed,
  type FabricPointerEvt,
  ensureId,
  setName,
  extractGeom,
  computeTextLayerName,
} from './canvasCore'


const DEFAULT_TEXT_CFG: TextCfg = {
  color: '#111827',
  bold: false,
  italic: false,
  underline: false,
  size: 16,
  text: '',
}

type StoreShape = {
  elements: Record<string, ElementModel>
}

type HistoryBridge = {
  objectAdded: (id: string, elementData: ElementModel) => void
  textChanged: (
    id: string,
    beforeText: string,
    afterText: string,
    beforeStyle: ElementModel['style'],
    afterStyle: ElementModel['style']
  ) => void
}

type UseCanvasTextToolOpts = {
  fabricRef: MutableRefObject<Canvas | null>
  uiTool: Tool
  uiSetTool: (tool: Tool) => void
  setSelection: (ids: string[]) => void
  upsertElement: (el: ElementModel) => void
  history: HistoryBridge
}

export type UseCanvasTextToolResult = {
  textCfg: TextCfg
  setTextCfg: Dispatch<SetStateAction<TextCfg>>
  handleTextOk: () => void
  handleTextCancel: () => void
  pendingTextRef: MutableRefObject<Textbox | null>
}

export function useCanvasTextTool({
  fabricRef,
  uiTool,
  uiSetTool,
  setSelection,
  upsertElement,
  history,
}: UseCanvasTextToolOpts): UseCanvasTextToolResult {
  const [textCfg, setTextCfg] = useState<TextCfg>(DEFAULT_TEXT_CFG)

  const pendingTextRef = useRef<Textbox | null>(null)
  const textCfgRef = useRef<TextCfg>(DEFAULT_TEXT_CFG)
  useEffect(() => {
    textCfgRef.current = textCfg
  }, [textCfg])

  // 🔥 FIX 1: Cleanup beim Tool-Wechsel
  useEffect(() => {
    if (uiTool !== 'text' && pendingTextRef.current) {
      const canvas = fabricRef.current
      if (canvas) {
        try {
          canvas.remove(pendingTextRef.current)
          pendingTextRef.current = null
          canvas.requestRenderAll()
        } catch (err) {
          console.warn('[TextTool] Cleanup failed:', err)
          pendingTextRef.current = null
        }
      }
    }
  }, [uiTool, fabricRef])

  // 1) Textboxen editierbar machen, wenn das Text-Tool aktiv ist
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const editable = uiTool === 'text'
    canvas.getObjects().forEach((o) => {
      if (o instanceof Textbox) {
        if (isMetaOverlay(o)) o.editable = false
        else o.editable = editable
      }
    })

    if (editable) {
      const active = canvas.getActiveObject()
      if (active && active instanceof Textbox && !isMetaOverlay(active)) {
        active.enterEditing()
        const len = (active.text ?? '').length
        active.selectionStart = len
        active.selectionEnd = len
        canvas.requestRenderAll()
      }
    }
  }, [fabricRef, uiTool])

  // 2) Beim Wechsel ins Text-Tool: aktive Textbox ins Overlay übernehmen
  useEffect(() => {
    if (uiTool !== 'text') return
    const cv = fabricRef.current
    if (!cv) return
    const a = cv.getActiveObject()
    if (a && a instanceof Textbox && !isMetaOverlay(a)) {
      setTextCfg({
        color: typeof a.fill === 'string' ? a.fill : DEFAULT_TEXT_CFG.color,
        bold: (a.fontWeight as string) === 'bold',
        italic: a.fontStyle === 'italic',
        underline: !!a.underline,
        size: typeof a.fontSize === 'number' ? a.fontSize : DEFAULT_TEXT_CFG.size,
        text: (a.text ?? '').toString(),
      })
    }
  }, [fabricRef, uiTool])

  // 3) Beim Wechsel INS Text-Tool: Editor leeren, wenn wir nichts bearbeiten
  useEffect(() => {
    if (uiTool !== 'text') return

    const cv = fabricRef.current
    const active = cv?.getActiveObject()
    const isEditingExisting =
      active instanceof Textbox &&
      !isMetaOverlay(active) &&
      (active as Textbox & { isEditing?: boolean }).isEditing === true

    const hasPending = !!pendingTextRef.current

    if (!isEditingExisting && !hasPending) {
      setTextCfg((prev) => ({ ...prev, text: '' }))
      textCfgRef.current = { ...textCfgRef.current, text: '' }
    }
  }, [fabricRef, uiTool])

  // 4) Text-Tool: Klick -> vorhandene Textbox editieren ODER neue erstellen
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const onMouseDownForText = (opt: unknown) => {
      if (uiTool !== 'text') return

      const ev = opt as { e: FabricPointerEvt; target?: FabricObject }
      const tgt = ev.target

      if (tgt && isMetaOverlay(tgt)) return

      // A) Klick auf bestehende Textbox
      if (tgt && tgt instanceof Textbox) {
        const tb = tgt
        canvas.setActiveObject(tb)
        tb.editable = true
        const id = ensureId(tb)
        setSelection([id])

        // 🔥 FIX 4: Try-catch für Race Condition
        requestAnimationFrame(() => {
          try {
            const c = fabricRef.current as CanvasMaybeDisposed | null
            if (!c || c.disposed) return
            if (c.getActiveObject() !== tb) c.setActiveObject(tb)

            tb.enterEditing()
            const len = (tb.text ?? '').length
            tb.selectionStart = len
            tb.selectionEnd = len

            const next = {
              color: typeof tb.fill === 'string' ? tb.fill : DEFAULT_TEXT_CFG.color,
              bold: (tb.fontWeight as string) === 'bold',
              italic: tb.fontStyle === 'italic',
              underline: !!tb.underline,
              size: typeof tb.fontSize === 'number' ? tb.fontSize : DEFAULT_TEXT_CFG.size,
              text: (tb.text ?? '').toString(),
            }
            setTextCfg(next)
            textCfgRef.current = { ...textCfgRef.current, ...next }

            c.requestRenderAll()
          } catch (err) {
            console.warn('[TextTool] Edit existing failed:', err)
          }
        })
        return
      }

      // B) Klick ins Leere -> neue Textbox (pending)
      const p = canvas.getPointer(ev.e as FabricPointerEvt)
      const tb = new Textbox('', {
        left: p.x,
        top: p.y,
        width: 260,
        fontSize: textCfgRef.current.size,
        fontWeight: textCfgRef.current.bold ? 'bold' : 'normal',
        fontStyle: textCfgRef.current.italic ? 'italic' : 'normal',
        underline: textCfgRef.current.underline,
        fill: textCfgRef.current.color,
        editable: true,
      })

      ;(tb as ObjWithData).data = { id: uid('txt') }
      pendingTextRef.current = tb

      canvas.add(tb)
      canvas.setActiveObject(tb)
      const ensuredId = ensureId(tb)
      setSelection([ensuredId])

      tb.enterEditing()
      tb.selectionStart = 0
      tb.selectionEnd = 0
      tb.visible = true

      canvas.requestRenderAll()
    }

    canvas.on('mouse:down', onMouseDownForText)
    return () => {
      canvas.off('mouse:down', onMouseDownForText)
    }
  }, [fabricRef, uiTool, setSelection])

  // 5) Auswahl/Klick -> Texteditor syncen
  useEffect(() => {
    const cv = fabricRef.current
    if (!cv) return

    const syncTextboxToOverlay = (tb: Textbox) => {
      if (isMetaOverlay(tb)) return
      const next = {
        color: typeof tb.fill === 'string' ? tb.fill : DEFAULT_TEXT_CFG.color,
        bold: (tb.fontWeight as string) === 'bold',
        italic: tb.fontStyle === 'italic',
        underline: !!tb.underline,
        size: typeof tb.fontSize === 'number' ? tb.fontSize : DEFAULT_TEXT_CFG.size,
        text: (tb.text ?? '').toString(),
      }
      setTextCfg(next)
      textCfgRef.current = { ...textCfgRef.current, ...next }
    }

    const onSelection = (e: unknown) => {
      if (uiTool !== 'text') return
      const ev = e as { selected?: FabricObject[] }
      const cand = ev.selected?.[0]
      const a = (cand instanceof Textbox ? cand : cv.getActiveObject())
      if (a && a instanceof Textbox && !isMetaOverlay(a)) syncTextboxToOverlay(a)
    }

    const onMouseUp = (e: unknown) => {
      if (uiTool !== 'text') return
      const tgt = (e as { target?: FabricObject }).target
      if (tgt && tgt instanceof Textbox && !isMetaOverlay(tgt)) syncTextboxToOverlay(tgt)
    }

    cv.on('selection:created', onSelection)
    cv.on('selection:updated', onSelection)
    cv.on('mouse:up', onMouseUp)

    return () => {
      cv.off('selection:created', onSelection)
      cv.off('selection:updated', onSelection)
      cv.off('mouse:up', onMouseUp)
    }
  }, [fabricRef, uiTool])

  // 🔥 FIX 5: Robustere fitTextboxToExplicitLines
  const fitTextboxToExplicitLines = (tb: Textbox): void => {
    try {
      const tbi = tb as Textbox & { initDimensions?: () => void; _textLines?: string[] }

      const MAX_WIDTH = 10000  // Sicherer als 99999
      tb.set({ width: MAX_WIDTH })
      
      if (typeof tbi.initDimensions === 'function') {
        tbi.initDimensions()
      }

      const lineCount = Array.isArray(tbi._textLines) ? tbi._textLines.length : 1
      let maxW = 0
      for (let i = 0; i < lineCount; i++) {
        const w = tb.getLineWidth(i)
        if (w > maxW) maxW = w
      }

      const newW = Math.max(1, Math.min(Math.ceil(maxW + 1), MAX_WIDTH))
      tb.set({ width: newW })
      
      if (typeof tbi.initDimensions === 'function') {
        tbi.initDimensions()
      }
      
      tb.setCoords()
    } catch (err) {
      console.warn('[TextTool] fitTextboxToExplicitLines failed:', err)
      // Fallback: Behalte aktuelle Breite
    }
  }

  // OK
  const handleTextOk = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    const active = canvas.getActiveObject()
    let tb = (active instanceof Textbox ? active : pendingTextRef.current) || null

    const overlayText = (textCfgRef.current.text ?? '').replace(/\r\n/g, '\n')
    const currentText = tb ? (tb.text ?? '').toString() : ''
    const cleanTextCandidate = (overlayText.trim() ? overlayText : currentText).replace(
      /\r\n/g,
      '\n',
    )

    let createdNow = false

    // Fallback: keine Box aktiv → neue mittig erzeugen (sofort "final")
    if (!tb && cleanTextCandidate.trim()) {
      const cx = canvas.getWidth() / 2
      const cy = canvas.getHeight() / 2
      const newId = uid('txt')
      
      tb = new Textbox(cleanTextCandidate, {
        left: cx - 130,
        top: cy - 10,
        width: 260,
        fontSize: textCfgRef.current.size,
        fontWeight: textCfgRef.current.bold ? 'bold' : 'normal',
        fontStyle: textCfgRef.current.italic ? 'italic' : 'normal',
        underline: textCfgRef.current.underline,
        fill: textCfgRef.current.color,
        editable: false,
      })
      ;(tb as ObjWithData).data = { id: newId }
      
      canvas.add(tb)
      canvas.setActiveObject(tb)
      createdNow = true
    }

    if (!tb) {
      uiSetTool('select')
      return
    }

    const cleanText = cleanTextCandidate
    const id = ensureId(tb)

    // 🔥 FIX 3: Textbox-Löschung mit History
    if (!cleanText.trim()) {
      const store = useAppStore.getState() as unknown as StoreShape
      const existed = !!store.elements[id]
      
      canvas.remove(tb)
      pendingTextRef.current = null
      
      // Nur History wenn es eine bestehende Textbox war (nicht pending)
      if (existed) {
        // canvas.remove feuert object:removed → handleRemoved macht History
      }
      
      canvas.requestRenderAll()
      uiSetTool('select')
      return
    }

    // Stil + Text final setzen; Editing aus
    tb.set({
      text: cleanText,
      fontSize: textCfgRef.current.size,
      fontWeight: textCfgRef.current.bold ? 'bold' : 'normal',
      fontStyle: textCfgRef.current.italic ? 'italic' : 'normal',
      underline: textCfgRef.current.underline,
      fill: textCfgRef.current.color,
      editable: false,
    })

    fitTextboxToExplicitLines(tb)

    const store = useAppStore.getState() as unknown as StoreShape
    const prev = store.elements[id]
    const wasPending = pendingTextRef.current === tb
    const isEditingExisting = !!prev && !wasPending && !createdNow

    const od = tb as ObjWithData
    od.data ??= {}
    od.data.text = cleanText

    const newName =
      od.data.kind === 'vehicleLabel'
        ? cleanText || 'Label'
        : computeTextLayerName(cleanText)
    setName(tb, newName)

    const st = tb as ObjWithStyle
    const nextStyle: ElementModel['style'] = {
      fill: typeof st.fill === 'string' ? st.fill : textCfgRef.current.color,
      stroke: undefined,
      strokeWidth: 0,
    }

    const nextEl: ElementModel = {
      id,
      type: 'text',
      z: canvas.getObjects().indexOf(tb),
      visible: tb.visible ?? true,
      locked: { move: false, rotate: false, scale: false },
      geom: extractGeom(tb),
      style: nextStyle,
      data: { text: cleanText, ...(od.data ?? {}) },
    }

    // 🔥 FIX 2: Bei createdNow KEIN doppelter upsertElement
    if (!createdNow) {
      upsertElement(nextEl)
    }

    // History:
    if (wasPending) {
      const elementData: ElementModel = {
        id,
        type: 'text',
        z: canvas.getObjects().indexOf(tb),
        visible: true,
        locked: { move: false, rotate: false, scale: false },
        geom: extractGeom(tb),
        style: nextStyle,
        data: { text: cleanText },
      }
      history.objectAdded(id, elementData)
    } else if (isEditingExisting && prev) {
      const beforeText = typeof prev.data?.text === 'string' ? prev.data.text : ''
      const beforeStyle = prev.style
      
      history.textChanged(
        id,
        beforeText,
        cleanText,
        beforeStyle,
        nextStyle
      )
    }

    setSelection([id])
    canvas.setActiveObject(tb)
    pendingTextRef.current = null
    canvas.requestRenderAll()
    uiSetTool('select')
  }

  // Cancel
  const handleTextCancel = () => {
    const canvas = fabricRef.current
    if (!canvas) return

    const active = canvas.getActiveObject()
    const tb = (active instanceof Textbox ? active : pendingTextRef.current) || null

    if (tb) {
      try {
        if ((tb as Textbox).isEditing) (tb as Textbox).exitEditing()
        const txt = (tb.text ?? '').toString()
        if (!txt.trim()) {
          canvas.remove(tb)
          pendingTextRef.current = null
        } else {
          tb.editable = false
        }
        canvas.requestRenderAll()
      } catch (err) {
        console.warn('[TextTool] Cancel failed:', err)
      }
    }

    uiSetTool('select')
  }

  // Live-Mirroring: Overlay → aktive/pending Textbox (nur Visual, ohne Store/History)
  useEffect(() => {
    if (uiTool !== 'text') return
    const cv = fabricRef.current
    if (!cv) return
    const a = cv.getActiveObject()
    const tb = (a && a instanceof Textbox) ? a : pendingTextRef.current
    if (!tb) return

    try {
      tb.set({
        text: (textCfgRef.current.text ?? '').replace(/\r\n/g, '\n'),
        fontSize: textCfgRef.current.size,
        fontWeight: textCfgRef.current.bold ? 'bold' : 'normal',
        fontStyle: textCfgRef.current.italic ? 'italic' : 'normal',
        underline: textCfgRef.current.underline,
        fill: textCfgRef.current.color,
      })
      tb.visible = true
      cv.requestRenderAll()
    } catch (err) {
      console.warn('[TextTool] Live mirror failed:', err)
    }
  }, [fabricRef, textCfg, uiTool])

  return {
    textCfg,
    setTextCfg,
    handleTextOk,
    handleTextCancel,
    pendingTextRef,
  }
}