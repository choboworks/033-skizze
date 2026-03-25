import { Group, Rect, Line } from 'react-konva'
import { MARKING_RULES } from '../../rules/markingRules'
import type { FacingSide } from '../../layout'
import type { StripVariant, ParkingMarkingStyle } from '../../types'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
  bayLength?: number
  bayOffset?: number
  angle?: number
  markingStyle?: ParkingMarkingStyle
  facingSide?: FacingSide
  color?: string
}

const SCHMALSTRICH = MARKING_RULES.lineWidths.otherRoads.schmalstrich

export function ParkingStrip({
  x, y = 0, width, length,
  variant = 'parallel',
  bayLength = 5.7,
  bayOffset = 0,
  angle = 45,
  markingStyle = 'solid',
  facingSide,
  color,
}: Props) {
  const noMarking = markingStyle === 'none'
  const strokeWidth = SCHMALSTRICH
  const dash = markingStyle === 'dashed' ? [0.30, 0.20] as [number, number] : undefined
  const markingColor = '#ffffff'

  // Determine diagonal direction for angled parking:
  // facingSide === 'left' → road is to the left → traffic comes from below on the left side
  //   → lines slope upward to the right (negative offset) so cars park forward
  // facingSide === 'right' or default → road is to the right → traffic comes from below on the right side
  //   → lines slope downward to the right (positive offset) so cars park forward
  const roadOnLeft = facingSide === 'left'

  // Phase-based pattern: bayOffset is a phase shift (modulo bayLength)
  const lines: number[][] = []
  const spineLines: number[][] = []

  if (!noMarking && bayLength > 0.1) {
    const phase = ((bayOffset % bayLength) + bayLength) % bayLength

    if (variant === 'angled') {
      const angleRad = (angle * Math.PI) / 180
      const tanA = Math.tan(angleRad)
      const lineOffsetY = tanA > 0.001 ? width / tanA : 0

      for (let yPos = phase; yPos < length; yPos += bayLength) {
        if (yPos > 0.01) {
          if (roadOnLeft) {
            // Road left: lines slope upward to the right
            lines.push([0, yPos, width, yPos - lineOffsetY])
          } else {
            // Road right (default): lines slope downward to the right
            lines.push([0, yPos, width, yPos + lineOffsetY])
          }
        }
      }
      // Spine on the outer edge (away from road)
      if (roadOnLeft) {
        spineLines.push([width, 0, width, length])
      } else {
        spineLines.push([0, 0, 0, length])
      }
    } else if (variant === 'perpendicular') {
      for (let yPos = phase; yPos < length; yPos += bayLength) {
        if (yPos > 0.01) lines.push([0, yPos, width, yPos])
      }
      // Spine on the outer edge (away from road)
      if (roadOnLeft) {
        spineLines.push([width - strokeWidth / 2, 0, width - strokeWidth / 2, length])
      } else {
        spineLines.push([strokeWidth / 2, 0, strokeWidth / 2, length])
      }
    } else {
      for (let yPos = phase; yPos < length; yPos += bayLength) {
        if (yPos > 0.01) lines.push([0, yPos, width, yPos])
      }
    }
  }

  return (
    <Group x={x} y={y} clipX={0} clipY={0} clipWidth={width} clipHeight={length}>
      {/* Asphalt-Fläche */}
      <Rect width={width} height={length} fill={color || '#3a3a3a'} />

      {/* Subtiler Randstreifen zur Fahrbahn */}
      <Rect x={0} width={Math.min(0.08, width * 0.04)} height={length} fill="#ffffff" opacity={0.08} listening={false} />

      {/* Stellplatz-Trennlinien */}
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          stroke={markingColor}
          strokeWidth={strokeWidth}
          dash={dash}
          lineCap="butt"
          perfectDrawEnabled={false}
          listening={false}
        />
      ))}

      {/* Kamm-Rücken (Längslinie am äußeren Rand für Quer-/Schrägparken) */}
      {spineLines.map((pts, i) => (
        <Line
          key={`spine-${i}`}
          points={pts}
          stroke={markingColor}
          strokeWidth={strokeWidth}
          lineCap="butt"
          perfectDrawEnabled={false}
          listening={false}
        />
      ))}
    </Group>
  )
}
