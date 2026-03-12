import type { FabricObject } from 'fabric'
import type { ElementModel } from '../canvas/canvasTypes'

export type Geom = ElementModel['geom']

export interface Command {
  execute(): void
  undo(): void
  redo(): void
  canMergeWith?(other: Command): boolean
  merge?(other: Command): void
}

export type TransformType = 'move' | 'scale' | 'rotate'

export interface TransformData {
  objectId: string
  beforeGeom: Geom
  afterGeom: Geom
}

export interface CanvasAdapter {
  getCanvas(): import('fabric').Canvas | null
  findObjectById(id: string): FabricObject | null
  applyGeom(obj: FabricObject, geom: Geom): void
  updateStore(id: string, geom: Geom): void
  requestRender(): void
}