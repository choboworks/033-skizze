import { Group, Shape, Rect } from 'react-konva'
import type Konva from 'konva'
import type { Marking } from '../../types'
import { getCobblestonePattern, getGrassPattern, getPavingPattern } from '../../shared/patterns'
import { SPERRFLAECHE_RULES } from '../../rules/markingRules'
import type { RoadwayBounds } from '../../layout'

interface Props {
  marking: Marking
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  roadwayBounds?: RoadwayBounds
  roadClass?: string
  roadLength?: number
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

// Surface configs
const SURFACE_CONFIG: Record<string, { baseFill: string; getPattern: () => HTMLCanvasElement; patternScale: number }> = {
  green: { baseFill: '#4a6b3a', getPattern: getGrassPattern, patternScale: 0.018 },
  paved: { baseFill: '#9e9890', getPattern: getPavingPattern, patternScale: 0.012 },
  cobblestone: { baseFill: '#8a8078', getPattern: getCobblestonePattern, patternScale: 0.012 },
}

function getSurfaceConfig(surfaceType: string | undefined) {
  return SURFACE_CONFIG[surfaceType || 'green'] || SURFACE_CONFIG.green
}

// Asphalt color matching lane strips
const ASPHALT_COLOR = '#3a3a3a'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawIslandPath(ctx: any, x: number, width: number, length: number, taperLen: number, endShape: string) {
  if (endShape === 'flat') {
    ctx.rect(x, 0, width, length)
    return
  }
  const cx = x + width / 2
  if (endShape === 'pointed') {
    ctx.moveTo(cx, 0)
    ctx.lineTo(x + width, taperLen)
    ctx.lineTo(x + width, length - taperLen)
    ctx.lineTo(cx, length)
    ctx.lineTo(x, length - taperLen)
    ctx.lineTo(x, taperLen)
    ctx.closePath()
    return
  }
  ctx.moveTo(x, taperLen)
  ctx.quadraticCurveTo(x, 0, cx, 0)
  ctx.quadraticCurveTo(x + width, 0, x + width, taperLen)
  ctx.lineTo(x + width, length - taperLen)
  ctx.quadraticCurveTo(x + width, length, cx, length)
  ctx.quadraticCurveTo(x, length, x, length - taperLen)
  ctx.closePath()
}

// Draw approach triangle outline (two lines from tip to base corners)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawApproachOutline(ctx: any, cx: number, tipY: number, baseLeft: number, baseRight: number, baseY: number) {
  ctx.moveTo(cx, tipY)
  ctx.lineTo(baseRight, baseY)
  ctx.moveTo(cx, tipY)
  ctx.lineTo(baseLeft, baseY)
}

// Draw approach triangle fill path (closed triangle)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawApproachFill(ctx: any, cx: number, tipY: number, baseLeft: number, baseRight: number, baseY: number) {
  ctx.moveTo(cx, tipY)
  ctx.lineTo(baseRight, baseY)
  ctx.lineTo(baseLeft, baseY)
  ctx.closePath()
}

// Draw diagonal hatching lines within a clipped area
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawHatchLines(ctx: any, width: number, yStart: number, yEnd: number, spacing: number) {
  const height = yEnd - yStart
  const maxDim = width + Math.abs(height) + spacing * 2
  for (let d = -maxDim; d < maxDim; d += spacing) {
    ctx.moveTo(d, yStart)
    ctx.lineTo(d + Math.abs(height), yEnd)
  }
}

const SNAP_THRESHOLD = 0.5

function handleIslandDragMove(
  e: Konva.KonvaEventObject<DragEvent>,
  islandWidth: number,
  islandLength: number,
  snapPositions?: number[],
  roadwayBounds?: RoadwayBounds,
  roadLength?: number,
) {
  const node = e.target

  // Clamp x to roadway bounds
  if (roadwayBounds) {
    const x = node.x()
    node.x(Math.max(roadwayBounds.minX, Math.min(x, roadwayBounds.maxX - islandWidth)))
  }

  // X-axis: snap to strip edges AND roadway center
  if (snapPositions?.length || roadwayBounds) {
    const x = node.x()
    const candidates: number[] = []

    // Strip edges (within roadway bounds, adjusted for island width)
    if (snapPositions?.length) {
      const valid = roadwayBounds
        ? snapPositions.filter((sp) => sp >= roadwayBounds.minX && sp <= roadwayBounds.maxX - islandWidth)
        : snapPositions
      candidates.push(...valid)
    }

    // Center of roadway (snap island center to roadway center)
    if (roadwayBounds) {
      const roadwayCenter = (roadwayBounds.minX + roadwayBounds.maxX) / 2
      candidates.push(roadwayCenter - islandWidth / 2)
    }

    if (candidates.length) {
      let nearest = candidates[0]
      let minDist = Math.abs(x - nearest)
      for (const sp of candidates) {
        const dist = Math.abs(x - sp)
        if (dist < minDist) { minDist = dist; nearest = sp }
      }
      if (minDist < SNAP_THRESHOLD) node.x(nearest)
    }
  }

  // Y-axis: allow free movement, snap to vertical center
  const y = node.y()

  if (roadLength != null) {
    // Snap to vertical center of road
    const centerY = (roadLength - islandLength) / 2
    if (Math.abs(y - centerY) < SNAP_THRESHOLD) {
      node.y(centerY)
    }
  }
}

const CURB_INSET = 0.035

function getHatchConfig(roadClass: string | undefined) {
  if (roadClass === 'ausserorts') return SPERRFLAECHE_RULES.ausserorts
  if (roadClass === 'autobahn') return SPERRFLAECHE_RULES.autobahn
  return SPERRFLAECHE_RULES.innerorts
}

function getVisibleRect(
  markingX: number,
  markingY: number,
  boundsLeft: number,
  boundsTop: number,
  boundsRight: number,
  boundsBottom: number,
  roadwayBounds?: RoadwayBounds,
  roadLength?: number,
) {
  const fullWidth = Math.max(0, boundsRight - boundsLeft)
  const fullHeight = Math.max(0, boundsBottom - boundsTop)
  if (fullWidth <= 0 || fullHeight <= 0) return null

  const visibleLeft = roadwayBounds ? Math.max(boundsLeft, roadwayBounds.minX - markingX) : boundsLeft
  const visibleRight = roadwayBounds ? Math.min(boundsRight, roadwayBounds.maxX - markingX) : boundsRight
  const visibleTop = roadLength != null ? Math.max(boundsTop, -markingY) : boundsTop
  const visibleBottom = roadLength != null ? Math.min(boundsBottom, roadLength - markingY) : boundsBottom

  if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) return null

  return {
    x: visibleLeft,
    y: visibleTop,
    width: visibleRight - visibleLeft,
    height: visibleBottom - visibleTop,
  }
}

export function TrafficIsland({ marking, draggable, selected, snapPositions, roadwayBounds, roadClass, roadLength, onDragEnd, onClick, onDoubleClick, onRightClick, onDragging }: Props) {
  const width = marking.width || 2.50
  const length = marking.length || 8.0
  const surfaceType = marking.surfaceType || 'green'
  const endShape = marking.endShape || 'rounded'
  const endTaperLength = marking.endTaperLength ?? 1.0
  const showCurbBorder = marking.showCurbBorder !== false
  const showApproach = marking.showApproachMarking !== false
  const rawApproachLength = marking.approachLength ?? 3.0

  const taperLen = endShape === 'flat' ? 0 : Math.min(endTaperLength, length * 0.4)
  const config = getSurfaceConfig(surfaceType)
  const pattern = config.getPattern()
  const inset = showCurbBorder ? CURB_INSET : 0
  const hatch = getHatchConfig(roadClass)

  // Full-size approach triangles — correct proportions, no distortion.
  const topApproach = rawApproachLength
  const bottomApproach = rawApproachLength

  // Approach base coordinates (where triangle meets island)
  const topBaseY = endShape === 'flat' ? 0 : taperLen
  const bottomBaseY = endShape === 'flat' ? length : length - taperLen

  const cx = width / 2
  const boundsLeft = 0
  const boundsTop = showApproach ? -topApproach : 0
  const boundsRight = width
  const boundsBottom = length + (showApproach ? bottomApproach : 0)
  const visibleBounds = getVisibleRect(
    marking.x ?? 0,
    marking.y ?? 0,
    boundsLeft,
    boundsTop,
    boundsRight,
    boundsBottom,
    roadwayBounds,
    roadLength,
  )

  // Borderlinie thickness — thicker to visually connect to Leitlinie/Fahrstreifenbegrenzung
  const borderStroke = Math.max(hatch.borderWidth, 0.06)

  return (
    <Group
      x={marking.x} y={marking.y}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => handleIslandDragMove(e, width, length, snapPositions, roadwayBounds, roadLength)}
      onDragEnd={(e) => { onDragging?.(false); onDragEnd?.(marking.id, e.target.x(), e.target.y()) }}
      onMouseDown={(e) => { if (e.evt.button === 2) { e.cancelBubble = true; onRightClick?.(marking.id) } }}
      onClick={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblClick={(e) => { e.cancelBubble = true; onDoubleClick?.(marking.id) }}
      onTap={(e) => { e.cancelBubble = true; onClick?.(marking.id) }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
      {/* Selection highlight */}
      {selected && visibleBounds && (
        <Rect
          x={visibleBounds.x}
          y={visibleBounds.y}
          width={visibleBounds.width}
          height={visibleBounds.height}
          fill="rgba(74,158,255,0.10)"
          listening={false}
        />
      )}

      {/* ===== APPROACH MARKINGS (Sperrfläche Z 298) ===== */}

      {/* Top approach — asphalt background (covers Leitlinie underneath) */}
      {showApproach && topApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawApproachFill(ctx, cx, -topApproach, 0, width, topBaseY)
            ctx.fillStrokeShape(shape)
          }}
          fill={ASPHALT_COLOR}
          listening={false}
        />
      )}

      {/* Top approach — hatched triangle */}
      {showApproach && topApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.save()
            ctx.beginPath()
            drawApproachFill(ctx, cx, -topApproach, 0, width, topBaseY)
            ctx.clip()
            ctx.beginPath()
            drawHatchLines(ctx, width, -topApproach, topBaseY + 0.5, hatch.spacing)
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = hatch.lineWidth
            ctx.stroke()
            ctx.restore()
            ctx.fillStrokeShape(shape)
          }}
          fill="transparent"
          listening={false}
        />
      )}

      {/* Top approach — border lines */}
      {showApproach && topApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawApproachOutline(ctx, cx, -topApproach, 0, width, topBaseY)
            ctx.fillStrokeShape(shape)
          }}
          stroke="#ffffff"
          strokeWidth={borderStroke}
          fill="transparent"
          listening={false}
        />
      )}

      {/* Bottom approach — asphalt background */}
      {showApproach && bottomApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawApproachFill(ctx, cx, length + bottomApproach, 0, width, bottomBaseY)
            ctx.fillStrokeShape(shape)
          }}
          fill={ASPHALT_COLOR}
          listening={false}
        />
      )}

      {/* Bottom approach — hatched triangle */}
      {showApproach && bottomApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.save()
            ctx.beginPath()
            drawApproachFill(ctx, cx, length + bottomApproach, 0, width, bottomBaseY)
            ctx.clip()
            ctx.beginPath()
            drawHatchLines(ctx, width, bottomBaseY - 0.5, length + bottomApproach, hatch.spacing)
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = hatch.lineWidth
            ctx.stroke()
            ctx.restore()
            ctx.fillStrokeShape(shape)
          }}
          fill="transparent"
          listening={false}
        />
      )}

      {/* Bottom approach — border lines */}
      {showApproach && bottomApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawApproachOutline(ctx, cx, length + bottomApproach, 0, width, bottomBaseY)
            ctx.fillStrokeShape(shape)
          }}
          stroke="#ffffff"
          strokeWidth={borderStroke}
          fill="transparent"
          listening={false}
        />
      )}

      {/* ===== ISLAND BODY ===== */}

      {/* 1: Base fill */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath()
          drawIslandPath(ctx, 0, width, length, taperLen, endShape)
          ctx.fillStrokeShape(shape)
        }}
        fill={config.baseFill}
        listening={false}
      />

      {/* 2: Surface pattern */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath()
          drawIslandPath(ctx, inset, width - inset * 2, length, taperLen, endShape)
          ctx.fillStrokeShape(shape)
        }}
        fillPatternImage={pattern as unknown as HTMLImageElement}
        fillPatternScale={{ x: config.patternScale, y: config.patternScale }}
        listening={false}
      />

      {/* 3: Surface tint */}
      <Shape
        sceneFunc={(ctx, shape) => {
          ctx.beginPath()
          drawIslandPath(ctx, inset, width - inset * 2, length, taperLen, endShape)
          ctx.fillStrokeShape(shape)
        }}
        fill={surfaceType === 'green' ? 'rgba(55,90,40,0.08)' : 'rgba(120,110,100,0.06)'}
        listening={false}
      />

      {/* 4: Curb outer shadow */}
      {showCurbBorder && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawIslandPath(ctx, 0, width, length, taperLen, endShape)
            ctx.fillStrokeShape(shape)
          }}
          stroke="rgba(50,42,35,0.45)"
          strokeWidth={0.015}
          fill="transparent"
          listening={false}
        />
      )}

      {/* 5: Curb body */}
      {showCurbBorder && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawIslandPath(ctx, 0.008, width - 0.016, length, taperLen, endShape)
            ctx.fillStrokeShape(shape)
          }}
          stroke="#b5ada4"
          strokeWidth={0.018}
          fill="transparent"
          listening={false}
        />
      )}

      {/* 6: Curb inner highlight */}
      {showCurbBorder && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawIslandPath(ctx, CURB_INSET - 0.003, width - (CURB_INSET - 0.003) * 2, length, taperLen, endShape)
            ctx.fillStrokeShape(shape)
          }}
          stroke="rgba(240,235,228,0.35)"
          strokeWidth={0.008}
          fill="transparent"
          listening={false}
        />
      )}

      {/* Hit area */}
      {visibleBounds && (
        <Rect
          x={visibleBounds.x}
          y={visibleBounds.y}
          width={visibleBounds.width}
          height={visibleBounds.height}
          fill="rgba(0,0,0,0.001)"
          cursor="pointer"
        />
      )}
    </Group>
  )
}
