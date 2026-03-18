/**
 * Snap an endpoint to the nearest 45° angle relative to a start point.
 * Snaps to: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°.
 * Used when Shift is held during line/arrow/dimension drawing.
 */
export function snapTo45(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { x: number; y: number } {
  const dx = endX - startX
  const dy = endY - startY
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return { x: endX, y: endY }

  const angle = Math.atan2(dy, dx)
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4)

  return {
    x: startX + Math.cos(snapped) * dist,
    y: startY + Math.sin(snapped) * dist,
  }
}
