// src/canvas/roads/snapping.ts
import type { FabricObject } from 'fabric'

export const SNAP_RADIUS_PX = 0
const SNAP_OVERLAP_PX = -1  // 🔥 Temporär auf 0 zum Testen

export type SvgConnector = { id: string; xLocal: number; yLocal: number }

type WorldPoint = { xWorld: number; yWorld: number }
type WorldConnector = WorldPoint & { id: string }

function localToWorld(obj: FabricObject, xLocal: number, yLocal: number): WorldPoint {
  const matrix = obj.calcTransformMatrix()
  const xWorld = matrix[0] * xLocal + matrix[2] * yLocal + matrix[4]
  const yWorld = matrix[1] * xLocal + matrix[3] * yLocal + matrix[5]
  return { xWorld, yWorld }
}

function getWorldConnectors(
  obj: FabricObject,
  connectors: SvgConnector[]
): WorldConnector[] {
  return connectors.map((c) => {
    const wp = localToWorld(obj, c.xLocal, c.yLocal)
    return { id: c.id, ...wp }
  })
}

function distance(a: WorldPoint, b: WorldPoint): number {
  const dx = a.xWorld - b.xWorld
  const dy = a.yWorld - b.yWorld
  return Math.hypot(dx, dy)
}

function getConnectorsFromData(obj: FabricObject): SvgConnector[] {
  const d = (obj as { data?: { svgConnectors?: unknown } }).data
  const arr = d?.svgConnectors
  if (!Array.isArray(arr)) return []
  
  return arr.filter((c): c is SvgConnector => {
    return (
      typeof c === 'object' &&
      c !== null &&
      typeof (c as { id?: unknown }).id === 'string' &&
      typeof (c as { xLocal?: unknown }).xLocal === 'number' &&
      typeof (c as { yLocal?: unknown }).yLocal === 'number'
    )
  })
}

export type SnapResult = {
  moving: FabricObject
  target: FabricObject
  movingConnector: { id: string; xLocal: number; yLocal: number }
  targetConnector: { id: string; xLocal: number; yLocal: number }
  targetWorldPoint: WorldPoint
  optimalAngle: number
}

export function findSnapCandidate(
  moving: FabricObject,
  targets: FabricObject[],
  stageScaleAbs: number,
  snapRadiusPx: number,
  moveDir?: { x: number; y: number }
): SnapResult | null {
  const threshold = snapRadiusPx / Math.max(1e-6, stageScaleAbs)
  
  const movingConns = getConnectorsFromData(moving)
  if (movingConns.length === 0) return null

  const movingWorldConns = getWorldConnectors(moving, movingConns)
  const movingCenter = { xWorld: moving.left ?? 0, yWorld: moving.top ?? 0 }

  let best: { distance: number; result: SnapResult } | null = null

  for (const target of targets) {
    const targetConns = getConnectorsFromData(target)
    if (targetConns.length === 0) continue

    const targetWorldConns = getWorldConnectors(target, targetConns)

    for (let j = 0; j < targetWorldConns.length; j++) {
      const tWorld = targetWorldConns[j]
      const tLocal = targetConns[j]

      let bestMovingIdx = -1
      let bestScore = Infinity

      for (let i = 0; i < movingWorldConns.length; i++) {
        const mWorld = movingWorldConns[i]
        const dist = distance(mWorld, tWorld)
        
        if (dist > threshold) continue

        let score = dist

        if (moveDir && (Math.abs(moveDir.x) > 1 || Math.abs(moveDir.y) > 1)) {
          const connectorVec = {
            x: mWorld.xWorld - movingCenter.xWorld,
            y: mWorld.yWorld - movingCenter.yWorld
          }
          
          const dotProduct = moveDir.x * connectorVec.x + moveDir.y * connectorVec.y
          
          if (dotProduct > 0) {
            score = dist * 0.01
          } else {
            score = dist * 100
          }
        }
        
        if (score < bestScore) {
          bestScore = score
          bestMovingIdx = i
        }
      }

      if (bestMovingIdx === -1) continue

      const mLocal = movingConns[bestMovingIdx]
      const mWorld = movingWorldConns[bestMovingIdx]
      const finalDist = distance(mWorld, tWorld)

      if (!best || finalDist < best.distance) {
        const result: SnapResult = {
          moving,
          target,
          movingConnector: mLocal,
          targetConnector: tLocal,
          targetWorldPoint: tWorld,
          optimalAngle: moving.angle ?? 0,
        }

        best = { distance: finalDist, result }
      }
    }
  }

  return best?.result ?? null
}

export function computeSnapPosition(
  moving: FabricObject,
  movingConnector: { id: string; xLocal: number; yLocal: number },
  targetWorldPoint: WorldPoint,
  target: FabricObject
): { left: number; top: number; scaleX: number; scaleY: number } {
  const targetScaleX = Math.abs(target.scaleX ?? 1)
  const targetScaleY = Math.abs(target.scaleY ?? 1)
  
  const movingScaleX = Math.abs(moving.scaleX ?? 1)
  const movingScaleY = Math.abs(moving.scaleY ?? 1)
  
  const scaleFactorX = targetScaleX / movingScaleX
  const scaleFactorY = targetScaleY / movingScaleY
  
  const newScaleX = (moving.scaleX ?? 1) * scaleFactorX
  const newScaleY = (moving.scaleY ?? 1) * scaleFactorY
  
  const movingWorldConn = localToWorld(moving, movingConnector.xLocal, movingConnector.yLocal)
  
  const offsetX = movingWorldConn.xWorld - (moving.left ?? 0)
  const offsetY = movingWorldConn.yWorld - (moving.top ?? 0)
  
  // 🔥 Einfacher Overlap: Immer in Y-Richtung
  // conn-top snapt an conn-bottom → moving muss RUNTER (+ overlap)
  // conn-bottom snapt an conn-top → moving muss HOCH (- overlap)
  let overlapY = 0
  
  if (movingConnector.id === 'conn-top') {
    // Top-Connector snappt → Straße muss nach unten verschoben werden
    overlapY = SNAP_OVERLAP_PX
  } else if (movingConnector.id === 'conn-bottom') {
    // Bottom-Connector snappt → Straße muss nach oben verschoben werden
    overlapY = -SNAP_OVERLAP_PX
  }
  
  return {
    left: targetWorldPoint.xWorld - offsetX,
    top: targetWorldPoint.yWorld - offsetY + overlapY,
    scaleX: newScaleX,
    scaleY: newScaleY,
  }
}