// src/canvas/core/useSpaceHandPan.ts
import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, Textbox } from 'fabric'

const HAND_CURSOR = 'url(/assets/drag.png) 12 12, grab'
const HAND_GRABBING_CURSOR = 'url(/assets/drag.png) 12 12, grabbing'

type Params = {
  fabricRef: MutableRefObject<Canvas | null>
  stageRef: MutableRefObject<HTMLDivElement | null>
  panRef: MutableRefObject<{ x: number; y: number }>
  updateStageScale: () => void
}

/**
 * Spacebar-Hand-Tool (Photoshop-Style) als Hook.
 * Kapselt alle globalen Listener und Cursor-Umschaltungen.
 */
export function useSpaceHandPan({
  fabricRef,
  stageRef,
  panRef,
  updateStageScale,
}: Params): MutableRefObject<boolean> {
  const spaceHandActiveRef = useRef(false)
  const spaceHandDraggingRef = useRef(false)
  const panStartRef = useRef<{
    x: number
    y: number
    scrollLeft: number
    scrollTop: number
    panX: number
    panY: number
  } | null>(null)

  const savedFabricFlagsRef = useRef<{
    selection: boolean
    skipTargetFind: boolean
    isDrawingMode: boolean
    def: string
    hov: string
  } | null>(null)

  useEffect(() => {
    const isTypingTarget = (ev: Event | KeyboardEvent) => {
      const t = ev.target as HTMLElement | null
      if (!t) return false
      const tag = t.tagName.toLowerCase()
      if (t.isContentEditable) return true
      if (tag === 'input' || tag === 'textarea') return true
      const input = t as HTMLInputElement
      return input.type === 'text' || input.type === 'search'
    }

    const activeTextIsEditing = () => {
      const canvas = fabricRef.current
      if (!canvas) return false
      const a = canvas.getActiveObject()
      const tb = a instanceof Textbox ? (a as Textbox & { isEditing?: boolean }) : null
      return !!tb?.isEditing
    }

    const setUpperCanvasCursor = (cur: string) => {
      const canvas = fabricRef.current as (Canvas & { upperCanvasEl?: HTMLCanvasElement }) | null
      if (canvas?.upperCanvasEl) canvas.upperCanvasEl.style.cursor = cur
    }

    const beginHandMode = () => {
      const canvas = fabricRef.current
      const stage = stageRef.current
      if (!canvas || !stage) return
      if (spaceHandActiveRef.current) return

      savedFabricFlagsRef.current = {
        selection: canvas.selection,
        skipTargetFind: canvas.skipTargetFind as boolean,
        isDrawingMode: canvas.isDrawingMode,
        def: canvas.defaultCursor,
        hov: canvas.hoverCursor,
      }

      canvas.selection = false
      canvas.skipTargetFind = true
      canvas.isDrawingMode = false
      canvas.discardActiveObject()

      canvas.defaultCursor = HAND_CURSOR
      canvas.hoverCursor = HAND_CURSOR
      stage.style.cursor = 'grab'
      setUpperCanvasCursor('grab')
      stage.classList.add('select-none')

      spaceHandActiveRef.current = true
    }

    const beginGrabbingLook = () => {
      const canvas = fabricRef.current
      const stage = stageRef.current
      if (!canvas || !stage) return
      canvas.defaultCursor = HAND_GRABBING_CURSOR
      canvas.hoverCursor = HAND_GRABBING_CURSOR
      stage.style.cursor = 'grabbing'
      setUpperCanvasCursor('grabbing')
    }

    const backToHandLook = () => {
      const canvas = fabricRef.current
      const stage = stageRef.current
      if (!canvas || !stage) return
      canvas.defaultCursor = HAND_CURSOR
      canvas.hoverCursor = HAND_CURSOR
      stage.style.cursor = 'grab'
      setUpperCanvasCursor('grab')
    }

    const endHandMode = () => {
      if (!spaceHandActiveRef.current) return
      const canvas = fabricRef.current
      const stage = stageRef.current
      if (stage) stage.classList.remove('select-none')

      const saved = savedFabricFlagsRef.current
      if (saved && canvas) {
        canvas.selection = saved.selection
        canvas.skipTargetFind = saved.skipTargetFind
        canvas.isDrawingMode = saved.isDrawingMode
        canvas.defaultCursor = saved.def
        canvas.hoverCursor = saved.hov
        setUpperCanvasCursor(saved.def || '')
        savedFabricFlagsRef.current = null
      } else {
        if (stage) stage.style.cursor = ''
        setUpperCanvasCursor('')
      }

      spaceHandActiveRef.current = false
      spaceHandDraggingRef.current = false
      panStartRef.current = null
      canvas?.requestRenderAll()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.code === 'Space' || e.key === ' ')) return
      if (isTypingTarget(e)) return
      if (activeTextIsEditing()) return
      e.preventDefault()
      beginHandMode()
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (!(e.code === 'Space' || e.key === ' ')) return
      e.preventDefault()
      endHandMode()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (!spaceHandActiveRef.current) return
      const stage = stageRef.current
      if (!stage) return
      if (!stage.contains(e.target as Node)) return
      if (e.button !== 0) return
      e.preventDefault()

      spaceHandDraggingRef.current = true
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: 0,
        scrollTop: 0,
        panX: panRef.current.x,
        panY: panRef.current.y,
      }
      beginGrabbingLook()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!spaceHandActiveRef.current || !spaceHandDraggingRef.current) return
      const start = panStartRef.current
      if (!start) return

      const dx = e.clientX - start.x
      const dy = e.clientY - start.y

      panRef.current.x = Math.round(start.panX + dx)
      panRef.current.y = Math.round(start.panY + dy)
      updateStageScale()
    }

    const onMouseUp = () => {
      if (!spaceHandActiveRef.current) return
      if (!spaceHandDraggingRef.current) return
      spaceHandDraggingRef.current = false
      panStartRef.current = null
      backToHandLook()
    }

    const onWindowBlur = () => {
      endHandMode()
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    window.addEventListener('keyup', onKeyUp, { capture: true })
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('mousedown', onMouseDown, { passive: false, capture: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true, capture: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true, capture: true })

    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keyup', onKeyUp, true)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('mousedown', onMouseDown, true)
      window.removeEventListener('mousemove', onMouseMove, true)
      window.removeEventListener('mouseup', onMouseUp, true)
      endHandMode()
    }
  }, [fabricRef, stageRef, panRef, updateStageScale])

  return spaceHandActiveRef
}
