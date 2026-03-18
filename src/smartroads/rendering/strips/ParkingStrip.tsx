import { Group, Rect, Line } from 'react-konva'

interface Props {
  x: number
  width: number
  length: number
}

export function ParkingStrip({ x, width, length }: Props) {
  // Draw parking spot dividers
  const spotLength = 5.0 // ~5m per spot
  const lines: number[][] = []
  for (let y = spotLength; y < length; y += spotLength) {
    lines.push([0, y, width, y])
  }

  return (
    <Group x={x} y={0}>
      <Rect width={width} height={length} fill="#555555" />
      {lines.map((pts, i) => (
        <Line key={i} points={pts} stroke="#ffffff" strokeWidth={0.06} opacity={0.4} listening={false} />
      ))}
    </Group>
  )
}
