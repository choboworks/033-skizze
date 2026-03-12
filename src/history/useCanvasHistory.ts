// src/history/useCanvasHistory.ts
import { useEffect, useRef, useMemo, useCallback } from 'react'
import type { Canvas } from 'fabric'
import { CanvasHistory } from './canvasHistory'
import { useHistoryStore } from './historyStore'
import { isMetaOverlay } from '../canvas/core/metaOverlays'
import { snapAngleTo } from '../canvas/core/canvasCore'
import type { ElementModel } from '../canvas/canvasTypes'
import {
  StyleChangeCommand,
  AddObjectCommand,
  TextChangeCommand,
  GroupCommand,
  UngroupCommand,
} from './commands'

interface UseCanvasHistoryProps {
  getCanvas: () => Canvas | null
  updateGeom: (id: string, geom: ElementModel['geom']) => void
  upsertElement: (el: ElementModel) => void
  removeElement: (id: string) => void
}

export function useCanvasHistory(props: UseCanvasHistoryProps) {
  const historyRef = useRef<CanvasHistory | null>(null)

  const undo = useHistoryStore(s => s.undo)
  const redo = useHistoryStore(s => s.redo)
  const canUndo = useHistoryStore(s => s.canUndo)
  const canRedo = useHistoryStore(s => s.canRedo)

  // Initialize history instance (but don't attach yet!)
  useEffect(() => {
    const history = new CanvasHistory({
      getCanvas: props.getCanvas,
      updateGeom: props.updateGeom,
      upsertElement: props.upsertElement,
      removeElement: props.removeElement,
      isMetaOverlay,
      snapAngleTo,
    })

    historyRef.current = history

    return () => {
      history.detach()
      historyRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const attach = useCallback(() => {
    const history = historyRef.current
    if (!history) {
      console.warn('[History] Cannot attach - no instance')
      return
    }
    
    const canvas = props.getCanvas()
    if (!canvas) {
      console.warn('[History] Cannot attach - no canvas')
      return
    }

    history.attach()
  }, [props])

  const undoWithCommit = useCallback(() => {
    historyRef.current?.forceCommit()
    setTimeout(() => {
      undo()
    }, 10)
  }, [undo])

  const redoWithCommit = useCallback(() => {
    historyRef.current?.forceCommit()
    setTimeout(() => {
      redo()
    }, 10)
  }, [redo])

  const forceCommit = useCallback(() => {
    historyRef.current?.forceCommit()
  }, [])

  // ✅ Style-Änderungen
  const styleChanged = useCallback((
    objectId: string,
    before: ElementModel['style'],
    after: ElementModel['style']
  ) => {
    const canvas = props.getCanvas()
    const history = historyRef.current
    
    if (!canvas || !history) return
    
    const cmd = new StyleChangeCommand(canvas, objectId, before, after)
    history.execute(cmd)
  }, [props])

  // ✅ Text-Änderungen
  const textChanged = useCallback((
    objectId: string,
    beforeText: string,
    afterText: string,
    beforeStyle: ElementModel['style'],
    afterStyle: ElementModel['style']
  ) => {
    const canvas = props.getCanvas()
    const history = historyRef.current
    
    if (!canvas || !history) return
    
    const cmd = new TextChangeCommand(
      canvas,
      objectId,
      beforeText,
      afterText,
      beforeStyle,
      afterStyle
    )
    history.execute(cmd)
  }, [props])

  // ✅ Objekt hinzugefügt
  const objectAdded = useCallback((id: string, elementData: ElementModel) => {
    const history = historyRef.current
    if (!history) return

    const cmd = new AddObjectCommand(
      id,
      elementData,
      history,
      (id) => props.removeElement(id),
      (el) => props.upsertElement(el)
    )

    cmd.execute()
    useHistoryStore.getState().push(cmd)
  }, [props])

  // ✅ Gruppe erstellt
  const groupedChain = useCallback((
    partIds: string[],
    chainId: string,
    groupStoreId: string
  ) => {
    const cmd = new GroupCommand(partIds, chainId, groupStoreId)
    useHistoryStore.getState().push(cmd)
  }, [])

  // ✅ Gruppe aufgelöst
  const ungroupedChain = useCallback((
    partIds: string[],
    chainId: string | undefined,
    groupStoreId: string
  ) => {
    const cmd = new UngroupCommand(partIds, chainId, groupStoreId)
    useHistoryStore.getState().push(cmd)
  }, [])

  // Stub functions (noch nicht implementiert)
  const objectRemoved = useCallback(() => {}, [])
  const visibilityChanged = useCallback(() => {}, [])
  const renamed = useCallback(() => {}, [])
  const zReordered = useCallback(() => {}, [])

  return useMemo(() => ({
    attach,
    undo: undoWithCommit,
    redo: redoWithCommit,
    canUndo,
    canRedo,
    forceCommit,
    styleChanged,
    textChanged,
    objectAdded,
    objectRemoved,
    groupedChain,
    ungroupedChain,
    visibilityChanged,
    renamed,
    zReordered,
  }), [
    attach,
    undoWithCommit,
    redoWithCommit,
    canUndo,
    canRedo,
    forceCommit,
    styleChanged,
    textChanged,
    objectAdded,
    objectRemoved,
    groupedChain,
    ungroupedChain,
    visibilityChanged,
    renamed,
    zReordered,
  ])
}