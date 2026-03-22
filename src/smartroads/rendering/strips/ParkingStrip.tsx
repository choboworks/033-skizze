import { Group, Rect, Line } from 'react-konva'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  bayLength?: number
}

export function ParkingStrip({ x, y = 0, width, length, bayLength = 5.0 }: Props) {
  // Draw parking spot dividers
  const lines: number[][] = []
  for (let y = bayLength; y < length; y += bayLength) {
    lines.push([0, y, width, y])
  }

  return (
    <Group x={x} y={y}>
      <Rect width={width} height={length} fill="#555555" />
      {lines.map((pts, i) => (
        <Line key={i} points={pts} stroke="#ffffff" strokeWidth={0.06} opacity={0.4} listening={false} />
      ))}
    </Group>
  )
}
