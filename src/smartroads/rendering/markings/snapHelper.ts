import type Konva from 'konva'

// Snap threshold in meters — marking snaps when within this distance
const SNAP_THRESHOLD = 0.5

/**
 * Shared drag-move handler: snaps a marking's x position to the nearest
 * strip edge. Call this from each marking component's onDragMove.
 */
export function handleMarkingDragMove(
  e: Konva.KonvaEventObject<DragEvent>,
  snapPositions?: number[],
) {
  const node = e.target

  if (!snapPositions?.length) return
  const x = node.x()

  let nearest = snapPositions[0]
  let minDist = Math.abs(x - nearest)
  for (const sp of snapPositions) {
    const dist = Math.abs(x - sp)
    if (dist < minDist) {
      minDist = dist
      nearest = sp
    }
  }

  if (minDist < SNAP_THRESHOLD) {
    node.x(nearest)
  }
}
