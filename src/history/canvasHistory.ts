//src/history/canvasHistory.ts

import { Canvas, Textbox, type FabricObject } from 'fabric'
import type { CanvasAdapter, Geom, TransformType, Command } from './types'  // ← Command hier hinzufügen
import { TransformCommand, AddObjectCommand, RemoveObjectCommand } from './commands'
import { TransactionManager } from './transactionManager'
import { getId, extractGeom } from '../canvas/core/canvasCore'
import type { ElementModel } from '../canvas/canvasTypes'
import { useHistoryStore } from './historyStore'

interface CanvasHistoryConfig {
  getCanvas: () => Canvas | null
  updateGeom: (id: string, geom: Geom) => void
  upsertElement: (el: ElementModel) => void
  removeElement: (id: string) => void
  isMetaOverlay: (obj: FabricObject) => boolean
  snapAngleTo: (angle: number, snap: number) => number
}

export class CanvasHistory implements CanvasAdapter {
  private config: CanvasHistoryConfig
  private transactionManager: TransactionManager
  private activeTransforms = new Map<string, Geom>()

private isDragging = false
private dragTarget: FabricObject | null = null
private lastMouseMoveTime = 0
private lastTransformTime = 0
 
  private rotatedFreelyMap = new WeakMap<FabricObject, boolean>()
private isShiftPressed = false
private isReplaying = false
private isProgrammaticChange = false  // 🔥 DIESE ZEILE HINZUFÜGEN

  constructor(config: CanvasHistoryConfig) {
    this.config = config
    this.transactionManager = new TransactionManager()
    this.transactionManager.setCommitCallback((cmd) => {
      if (!this.isReplaying) {
        useHistoryStore.getState().push(cmd)
      }
    })
  }

  getCanvas(): Canvas | null {
    return this.config.getCanvas()
  }

  findObjectById(id: string): FabricObject | null {
    const canvas = this.getCanvas()
    if (!canvas) return null
    return canvas.getObjects().find(obj => getId(obj) === id) ?? null
  }

applyGeom(obj: FabricObject, geom: Geom) {
  this.isProgrammaticChange = true
  
  obj.set({
    left: geom.x,
    top: geom.y,
    angle: geom.angle,
    scaleX: geom.scaleX,
    scaleY: geom.scaleY,
  })
  obj.setCoords()
  
  setTimeout(() => {
    this.isProgrammaticChange = false
  }, 0)
}

  updateStore(id: string, geom: Geom) {
    this.config.updateGeom(id, geom)
  }

  requestRender() {
    this.getCanvas()?.requestRenderAll()
  }

attach() {
  const canvas = this.getCanvas()
  if (!canvas) return

  // Keyboard
  window.addEventListener('keydown', this.handleKeyDown)
  window.addEventListener('keyup', this.handleKeyUp)

  // Transform events
  canvas.on('object:rotating', this.handleTransforming)
  canvas.on('object:scaling', this.handleTransforming)
  canvas.on('object:modified', this.handleModified)

  // Add/Remove
  canvas.on('object:added', this.handleAdded)
  canvas.on('object:removed', this.handleRemoved)

  // 🔥 Mouse events für Bewegungserkennung
  canvas.on('mouse:down', this.handleMouseDown)
  canvas.on('mouse:move', this.handleMouseMove)
  canvas.on('mouse:up', this.handleMouseUp)

}

  detach() {
    const canvas = this.getCanvas()
    if (!canvas) return

    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)

    canvas.off('object:rotating', this.handleTransforming)
    canvas.off('object:scaling', this.handleTransforming)
    canvas.off('object:modified', this.handleModified)
    canvas.off('object:added', this.handleAdded)
    canvas.off('object:removed', this.handleRemoved)

    // 🔥 Mouse events
    canvas.off('mouse:down', this.handleMouseDown)
    canvas.off('mouse:move', this.handleMouseMove)
    canvas.off('mouse:up', this.handleMouseUp)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.isShiftPressed = e.shiftKey
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.isShiftPressed = e.shiftKey
  }

private handleTransforming = (e: { target: FabricObject; transform?: { action?: string } }) => {
  if (this.isReplaying || this.isProgrammaticChange) return
  
  // 🔥 NEU: Während Drag ignorieren wir rotate/scale Events
  if (this.isDragging) {
    return
  }
  
  // Throttle: Max 1x alle 50ms
  const now = Date.now()
  if (now - this.lastTransformTime < 50) return
  this.lastTransformTime = now
  
  const obj = e.target
  if (!obj || this.config.isMetaOverlay(obj)) return

  const id = getId(obj)
  if (!id) return

  if (!this.activeTransforms.has(id)) {
    const geom = extractGeom(obj)
    this.activeTransforms.set(id, geom)

    const type = this.detectTransformType(e.transform?.action)
    this.transactionManager.startTransaction(type)
  }

    if (e.transform?.action?.includes('rotate')) {
      if (this.isShiftPressed) {
        this.rotatedFreelyMap.set(obj, true)
      } else {
        this.rotatedFreelyMap.delete(obj)
      }
    }

    const before = this.activeTransforms.get(id)!
    const after = extractGeom(obj)
    
    if (!this.geomEqual(before, after)) {
      const cmd = new TransformCommand(
        { objectId: id, beforeGeom: before, afterGeom: after },
        this
      )
      this.transactionManager.addCommand(cmd)
      
      this.activeTransforms.set(id, after)
    }
  }

private handleModified = (e: { target: FabricObject }) => {
  
  if (this.isReplaying) return
  
  const obj = e.target
  if (!obj || this.config.isMetaOverlay(obj)) return

  const id = getId(obj)
  if (!id) return

  // 🔥 NUR verarbeiten wenn wir eine aktive Transform haben
  if (!this.activeTransforms.has(id)) {
    return
  }

  // Bei Drag
  if (this.isDragging && this.dragTarget === obj) {
    this.activeTransforms.delete(id)
    this.transactionManager.endTransaction()
    this.isDragging = false
    this.dragTarget = null
    return
  }

  // Angle-Snapping
  const wasFree = this.rotatedFreelyMap.get(obj) ?? false
  if (!wasFree) {
    const currentAngle = obj.angle ?? 0
    const snapped = this.config.snapAngleTo(currentAngle, 90)
    if (Math.abs(snapped - currentAngle) > 0.5) {
      obj.set({ angle: snapped })
      obj.setCoords()
      this.requestRender()
      
      const before = this.activeTransforms.get(id)
      if (before) {
        const after = extractGeom(obj)
        const cmd = new TransformCommand(
          { objectId: id, beforeGeom: before, afterGeom: after },
          this
        )
        this.transactionManager.addCommand(cmd)
      }
    }
  }

  // Cleanup
  this.activeTransforms.delete(id)
  this.transactionManager.endTransaction()
}

private handleMouseDown = (e: { target?: FabricObject | null }) => {
  const obj = e.target
  if (!obj || this.config.isMetaOverlay(obj)) return
  
  const id = getId(obj)
  if (!id) return
 
  // 🔥 NEU: Alte Transaction beenden wenn noch eine läuft
  if (this.isDragging && this.dragTarget) {
    const oldId = getId(this.dragTarget)
    if (oldId && this.activeTransforms.has(oldId)) {
      this.activeTransforms.delete(oldId)
      this.transactionManager.endTransaction()
    }
  }
  
  this.isDragging = true
  this.dragTarget = obj

  // Neue Transaction starten
  const geom = extractGeom(obj)
  this.activeTransforms.set(id, geom)
  this.transactionManager.startTransaction('move')
}

private handleMouseMove = () => {
 if (!this.isDragging || !this.dragTarget || this.isReplaying || this.isProgrammaticChange) return

  // 🔥 NEU: Nur Commands erstellen wenn wir eine aktive Transaction haben
  const id = getId(this.dragTarget)
  if (!id || !this.activeTransforms.has(id)) return

  // Throttle: Max 1x alle 16ms (60fps)
  const now = Date.now()
  if (now - this.lastMouseMoveTime < 16) return
  this.lastMouseMoveTime = now

  const obj = this.dragTarget

  const before = this.activeTransforms.get(id)
  if (!before) return

  const after = extractGeom(obj)

  if (!this.geomEqual(before, after)) {
    const cmd = new TransformCommand(
      { objectId: id, beforeGeom: before, afterGeom: after },
      this
    )
    this.transactionManager.addCommand(cmd)
    this.activeTransforms.set(id, after)
  }
}

private handleMouseUp = () => { 
  if (this.isDragging && this.dragTarget) {
    const obj = this.dragTarget
    const id = getId(obj)
    
    if (id) {
      this.activeTransforms.delete(id)
      this.transactionManager.endTransaction()
    }
  }

  this.isDragging = false
  this.dragTarget = null
}

  private handleAdded = (e: { target: FabricObject }) => {
    if (this.isReplaying) return
    
    const obj = e.target
    if (!obj || this.config.isMetaOverlay(obj)) return

    const id = getId(obj)
    if (!id) return

    const isText = obj instanceof Textbox
    
    const objData = (obj as { data?: Record<string, unknown> }).data || {}
    
    const elementData: ElementModel = {
      id,
      type: isText ? 'text' : 'shape',
      z: 0,
      visible: true,
      locked: { move: false, rotate: false, scale: false },
      geom: extractGeom(obj),
      style: {},
      data: objData,
    }

    const cmd = new AddObjectCommand(
      id,
      elementData,
      this,
      (id) => this.config.removeElement(id),
      (el) => this.config.upsertElement(el)
    )

    cmd.execute()
    useHistoryStore.getState().push(cmd)
  }

  private handleRemoved = (e: { target: FabricObject }) => {
    if (this.isReplaying) return
    
    const obj = e.target
    if (!obj || this.config.isMetaOverlay(obj)) return

    const id = getId(obj)
    if (!id) return

    const isText = obj instanceof Textbox
    
    const objData = (obj as { data?: Record<string, unknown> }).data || {}
    
    const elementData: ElementModel = {
      id,
      type: isText ? 'text' : 'shape',
      z: 0,
      visible: true,
      locked: { move: false, rotate: false, scale: false },
      geom: extractGeom(obj),
      style: {},
      data: objData,
    }

    const cmd = new RemoveObjectCommand(
      id,
      elementData,
      this,
      (id) => this.config.removeElement(id),
      (el) => this.config.upsertElement(el)
    )

    useHistoryStore.getState().push(cmd)
  }

  private detectTransformType(action?: string): TransformType {
    if (action?.includes('rotate')) return 'rotate'
    if (action?.includes('scale')) return 'scale'
    return 'move'
  }

  private geomEqual(a: Geom, b: Geom): boolean {
    const POSITION_TOLERANCE = 0.1
    const ANGLE_TOLERANCE = 0.5
    const SCALE_TOLERANCE = 0.001

    return Math.abs(a.x - b.x) < POSITION_TOLERANCE &&
           Math.abs(a.y - b.y) < POSITION_TOLERANCE &&
           Math.abs(a.angle - b.angle) < ANGLE_TOLERANCE &&
           Math.abs(a.scaleX - b.scaleX) < SCALE_TOLERANCE &&
           Math.abs(a.scaleY - b.scaleY) < SCALE_TOLERANCE
  }

  public setReplaying(value: boolean) {
    this.isReplaying = value
  }

forceCommit() {
  // 🔥 State aufräumen
  if (this.isDragging) {
    this.isDragging = false
    this.dragTarget = null
  }
  
  this.transactionManager.forceCommit()
}

// ✅ HIER EINFÜGEN:
/**
 * Execute a command immediately (for non-transform operations like style changes)
 * Commands are pushed directly to history without transaction management
 */
execute(cmd: Command) {
  if (this.isReplaying) return
  
  cmd.execute()
  useHistoryStore.getState().push(cmd)
}

clear() {
  this.transactionManager.clear()
  this.activeTransforms.clear()
}
}

