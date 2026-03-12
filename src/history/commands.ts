//src/history/commands.ts

import type { Command, TransformData, CanvasAdapter } from './types'
import type { ElementModel } from '../canvas/canvasTypes'
import type { Canvas, Object as FabricObject } from 'fabric'
import { getId } from '../canvas/core/canvasCore'
import { tryApplyVehicleFill } from '../canvas/core/useCarFeatures'  // ← NEU
import { tryApplyGenericSvgBodyFill } from '../canvas/core/svgBodyFill'  // ← NEU
import { Group, Textbox } from 'fabric'  // ← Textbox hinzufügen

/**
 * Single Object Transform Command
 */
export class TransformCommand implements Command {
  private data: TransformData
  private adapter: CanvasAdapter

  constructor(data: TransformData, adapter: CanvasAdapter) {
    this.data = data
    this.adapter = adapter
  }

  execute() {
    this.applyGeometry(this.data.afterGeom)
  }

  undo() {
    this.applyGeometry(this.data.beforeGeom)
  }

  redo() {
    this.execute()
  }

  private applyGeometry(geom: TransformData['afterGeom']) {
    const history = this.adapter as unknown as { setReplaying?: (v: boolean) => void }
    
    if (history.setReplaying) history.setReplaying(true)

    try {
      const obj = this.adapter.findObjectById(this.data.objectId)
      if (!obj) return
      
      this.adapter.applyGeom(obj, geom)
      this.adapter.updateStore(this.data.objectId, geom)
      this.adapter.requestRender()
    } finally {
      if (history.setReplaying) history.setReplaying(false)
    }
  }

  canMergeWith(other: Command): boolean {
    if (!(other instanceof TransformCommand)) return false
    return other.data.objectId === this.data.objectId
  }

  merge(other: Command) {
    if (other instanceof TransformCommand) {
      this.data.afterGeom = other.data.afterGeom
    }
  }
}

/**
 * Batch Command (multiple objects or sequential transforms)
 */
export class BatchCommand implements Command {
  private commands: Command[]

  constructor(commands: Command[]) {
    this.commands = commands
  }

  execute() {
    this.commands.forEach(cmd => cmd.execute())
  }

  undo() {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo()
    }
  }

  redo() {
    this.execute()
  }
}

/**
 * Add Object Command - Keeps fabric object reference for redo
 */
export class AddObjectCommand implements Command {
  private objectId: string
  private elementData: ElementModel
  private adapter: CanvasAdapter
  private removeFromStore: (id: string) => void
  private addToStore: (el: ElementModel) => void
  private fabricObject: FabricObject | null = null

  constructor(
    objectId: string,
    elementData: ElementModel,
    adapter: CanvasAdapter,
    removeFromStore: (id: string) => void,
    addToStore: (el: ElementModel) => void
  ) {
    this.objectId = objectId
    this.elementData = elementData
    this.adapter = adapter
    this.removeFromStore = removeFromStore
    this.addToStore = addToStore
    
    // 🔥 Store the fabric object reference
    this.fabricObject = adapter.findObjectById(objectId)
  }

  execute() {
    this.addToStore(this.elementData)
  }

  undo() {
    const history = this.adapter as unknown as { setReplaying?: (v: boolean) => void }
    if (history.setReplaying) history.setReplaying(true)

    try {
      const obj = this.adapter.findObjectById(this.objectId)
      if (obj) {
        const canvas = this.adapter.getCanvas()
        if (canvas) {
          canvas.remove(obj)
        }
      }
      
      this.removeFromStore(this.objectId)
      this.adapter.requestRender()
    } finally {
      if (history.setReplaying) history.setReplaying(false)
    }
  }

  redo() {
    const history = this.adapter as unknown as { setReplaying?: (v: boolean) => void }
    if (history.setReplaying) history.setReplaying(true)

    try {
      // 🔥 Re-add the fabric object to canvas!
      if (this.fabricObject) {
        const canvas = this.adapter.getCanvas()
        if (canvas) {
          canvas.add(this.fabricObject)
          this.addToStore(this.elementData)
          this.adapter.requestRender()
        }
      } else {
        // Fallback: just add to store
        console.warn('[AddObjectCommand] No fabric object reference - object will not appear on canvas')
        this.addToStore(this.elementData)
      }
    } finally {
      if (history.setReplaying) history.setReplaying(false)
    }
  }
}

/**
 * Remove Object Command - Keeps fabric object reference for undo
 */
export class RemoveObjectCommand implements Command {
  private objectId: string
  private elementData: ElementModel
  private adapter: CanvasAdapter
  private removeFromStore: (id: string) => void
  private addToStore: (el: ElementModel) => void
  private fabricObject: FabricObject | null = null
  
  constructor(
    objectId: string,
    elementData: ElementModel,
    adapter: CanvasAdapter,
    removeFromStore: (id: string) => void,
    addToStore: (el: ElementModel) => void
  ) {
    this.objectId = objectId
    this.elementData = elementData
    this.adapter = adapter
    this.removeFromStore = removeFromStore
    this.addToStore = addToStore
    
    // Store the fabric object reference
    this.fabricObject = adapter.findObjectById(objectId)
  }

  execute() {
    const history = this.adapter as unknown as { setReplaying?: (v: boolean) => void }
    if (history.setReplaying) history.setReplaying(true)

    try {
      if (this.fabricObject) {
        const canvas = this.adapter.getCanvas()
        if (canvas) {
          canvas.remove(this.fabricObject)
        }
      }
      
      this.removeFromStore(this.objectId)
      this.adapter.requestRender()
    } finally {
      if (history.setReplaying) history.setReplaying(false)
    }
  }

  undo() {
    const history = this.adapter as unknown as { setReplaying?: (v: boolean) => void }
    if (history.setReplaying) history.setReplaying(true)

    try {
      // 🔥 Re-add the fabric object to canvas!
      if (this.fabricObject) {
        const canvas = this.adapter.getCanvas()
        if (canvas) {
          canvas.add(this.fabricObject)
          this.addToStore(this.elementData)
          this.adapter.requestRender()
        }
      } else {
        console.warn('[RemoveObjectCommand] No fabric object reference - object will not appear on canvas')
        this.addToStore(this.elementData)
      }
    } finally {
      if (history.setReplaying) history.setReplaying(false)
    }
  }

  redo() {
    this.execute()
  }
  
}

export class StyleChangeCommand implements Command {
  canvas: Canvas
  id: string
  before: ElementModel['style']
  after: ElementModel['style']

  constructor(
    canvas: Canvas,
    id: string,
    before: ElementModel['style'],
    after: ElementModel['style'],
  ) {
    this.canvas = canvas
    this.id = id
    this.before = before
    this.after = after
  }

private applyStyle(style: ElementModel['style']): void {
  
  const obj = this.canvas.getObjects().find((o: FabricObject) => getId(o) === this.id)
  if (!obj) {
    return
  }

  // Hilfsfunktion: Ist es ein Group?
  const resolveGroup = (o: FabricObject): Group | null => {
    if (o instanceof Group) return o
    const g = (o as FabricObject & { group?: Group | null }).group
    return g instanceof Group ? g : null
  }

  const host = resolveGroup(obj)

  // 🔥 Fall 1: SVG mit Body-Parts (Fahrzeuge oder generisch)
  if (host && style.fill !== undefined) {
    
    // Versuche erst Vehicle-Fill
    const isVehicle = !!(
      (host as { data?: { category?: string } }).data?.category === 'vehicle'
    )
        
    if (isVehicle) {
      tryApplyVehicleFill(host, style.fill)
      this.canvas.requestRenderAll()
      return
    }

// Dann generischer SVG-Body-Fill
try {
  const ok = tryApplyGenericSvgBodyFill(obj, style.fill)
  if (ok) {
    this.canvas.requestRenderAll()
    return
  }
} catch { 
  // Fallthrough
}
  }

  // 🔥 Fall 2: Standard-Objekte (Text, Shapes, Lines)
const updates: Record<string, unknown> = {}
if (style.fill !== undefined) updates.fill = style.fill
if (style.stroke !== undefined) updates.stroke = style.stroke
if (style.strokeWidth !== undefined) updates.strokeWidth = style.strokeWidth

if (Object.keys(updates).length > 0) {
  obj.set(updates)
  obj.setCoords()
}

this.canvas.requestRenderAll()
}

  execute(): void {
    this.applyStyle(this.after)
  }

  undo(): void {
    this.applyStyle(this.before)
  }

  redo(): void {
    this.execute()
  }

  describe(): string {
    return `StyleChangeCommand`
  }
}

/**
 * Text Change Command - Ändert Text und Style einer Textbox atomisch
 */
export class TextChangeCommand implements Command {
  canvas: Canvas
  id: string
  beforeText: string
  afterText: string
  beforeStyle: ElementModel['style']
  afterStyle: ElementModel['style']

  constructor(
    canvas: Canvas,
    id: string,
    beforeText: string,
    afterText: string,
    beforeStyle: ElementModel['style'],
    afterStyle: ElementModel['style']
  ) {
    this.canvas = canvas
    this.id = id
    this.beforeText = beforeText
    this.afterText = afterText
    this.beforeStyle = beforeStyle
    this.afterStyle = afterStyle
  }

  private applyTextAndStyle(text: string, style: ElementModel['style']): void {
    const obj = this.canvas.getObjects().find((o: FabricObject) => getId(o) === this.id)
    if (!obj) {
      return
    }
    
    if (!(obj instanceof Textbox)) {
      return
    }

    const updates: Record<string, unknown> = {
      text: text
    }
    
    if (style.fill !== undefined) updates.fill = style.fill
    if (style.stroke !== undefined) updates.stroke = style.stroke
    if (style.strokeWidth !== undefined) updates.strokeWidth = style.strokeWidth
    
    obj.set(updates)
    obj.setCoords()
    this.canvas.requestRenderAll()
  }

  execute(): void {
    this.applyTextAndStyle(this.afterText, this.afterStyle)
  }

  undo(): void {
    this.applyTextAndStyle(this.beforeText, this.beforeStyle)
  }

  redo(): void {
    this.execute()
  }

  describe(): string {
    return `TextChangeCommand`
  }
}

// 🔗 GROUP COMMAND
export class GroupCommand implements Command {
  private partIds: string[]
  private chainId: string
  private groupStoreId: string

  constructor(partIds: string[], chainId: string, groupStoreId: string) {
    this.partIds = partIds
    this.chainId = chainId
    this.groupStoreId = groupStoreId
  }

  execute(): void {
    // Gruppierung wird bereits vom Event-Handler gemacht
  }

  undo(): void {
    // Gruppe auflösen
    window.dispatchEvent(
      new CustomEvent('app:dissolve-chain', {
        detail: { groupId: this.groupStoreId, chainId: this.chainId }
      })
    )
  }

  redo(): void {
    // Gruppe neu erstellen MIT DEN GLEICHEN IDs!
    window.dispatchEvent(
      new CustomEvent('app:group-selection', {
        detail: { 
          ids: this.partIds,
          chainId: this.chainId,        // ← Original IDs verwenden!
          groupStoreId: this.groupStoreId
        }
      })
    )
  }
}

// 🔓 UNGROUP COMMAND
export class UngroupCommand implements Command {
  private partIds: string[]
  private chainId: string | undefined
  private groupStoreId: string

  constructor(partIds: string[], chainId: string | undefined, groupStoreId: string) {
    this.partIds = partIds
    this.chainId = chainId
    this.groupStoreId = groupStoreId
  }

  execute(): void {
    // Auflösung wird bereits vom Event-Handler gemacht
  }

  undo(): void {
    // Gruppe wiederherstellen MIT DEN GLEICHEN IDs!
    window.dispatchEvent(
      new CustomEvent('app:group-selection', {
        detail: { 
          ids: this.partIds,
          chainId: this.chainId,        // ← Original IDs verwenden
          groupStoreId: this.groupStoreId
        }
      })
    )
  }

  redo(): void {
    // Gruppe erneut auflösen (wie execute)
    window.dispatchEvent(
      new CustomEvent('app:dissolve-chain', {
        detail: { groupId: this.groupStoreId, chainId: this.chainId }
      })
    )
  }
}