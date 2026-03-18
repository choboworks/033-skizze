import type Konva from 'konva'

/**
 * Registry to track Konva node refs by object ID.
 * Shared between ShapeRenderer instances and the shared Transformer.
 * Exported so SketchCanvas can position the text editing overlay.
 */
export const shapeRefs = new Map<string, Konva.Node>()
