import { Group, Rect, Shape } from 'react-konva'
import type Konva from 'konva'
import type { Marking } from '../../types'
import { getCobblestonePattern, getGrassPattern, getPavingPattern } from '../../shared/patterns'
import { MARKING_RULES, SPERRFLAECHE_RULES } from '../../rules/markingRules'
import type { RoadwayBounds } from '../../layout'

interface Props {
  marking: Marking
  draggable?: boolean
  selected?: boolean
  snapPositions?: number[]
  roadwayBounds?: RoadwayBounds
  roadClass?: string
  roadLength?: number
  linkedCrossing?: Marking
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragging?: (isDragging: boolean) => void
}

const SURFACE_CONFIG: Record<string, { baseFill: string; getPattern: () => HTMLCanvasElement; patternScale: number }> = {
  green: { baseFill: '#49663f', getPattern: getGrassPattern, patternScale: 0.018 },
  paved: { baseFill: '#9e9890', getPattern: getPavingPattern, patternScale: 0.012 },
  cobblestone: { baseFill: '#8a8078', getPattern: getCobblestonePattern, patternScale: 0.012 },
}

function getSurfaceConfig(surfaceType: string | undefined) {
  return SURFACE_CONFIG[surfaceType || 'paved'] || SURFACE_CONFIG.paved
}

const ROADWAY_FILL = '#3a3a3a'
const SNAP_THRESHOLD = 0.5
const CURB_INSET = 0.035

interface EntryBandSegment {
  x: number
  width: number
  fill: string
  grooveStroke?: string
}

interface EntryBand {
  y: number
  height: number
  segments: EntryBandSegment[]
}

interface BikeCrossingIslandSegment {
  y: number
  length: number
  roundedSide: 'top' | 'bottom'
}

function drawIslandPath(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  x: number,
  width: number,
  length: number,
  taperLen: number,
  endShape: string,
) {
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

function drawBikeCrossingIslandCapPath(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  x: number,
  y: number,
  width: number,
  length: number,
  roundedSide: BikeCrossingIslandSegment['roundedSide'],
) {
  const radius = Math.max(0.12, Math.min(width / 2, length * 0.9))

  if (roundedSide === 'top') {
    ctx.moveTo(x, y + length)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + length)
    ctx.closePath()
    return
  }

  ctx.moveTo(x, y)
  ctx.lineTo(x, y + length - radius)
  ctx.quadraticCurveTo(x, y + length, x + radius, y + length)
  ctx.lineTo(x + width - radius, y + length)
  ctx.quadraticCurveTo(x + width, y + length, x + width, y + length - radius)
  ctx.lineTo(x + width, y)
  ctx.closePath()
}

function drawApproachOutline(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  cx: number,
  tipY: number,
  baseLeft: number,
  baseRight: number,
  baseY: number,
) {
  ctx.moveTo(cx, tipY)
  ctx.lineTo(baseRight, baseY)
  ctx.moveTo(cx, tipY)
  ctx.lineTo(baseLeft, baseY)
}

function drawApproachFill(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  cx: number,
  tipY: number,
  baseLeft: number,
  baseRight: number,
  baseY: number,
) {
  ctx.moveTo(cx, tipY)
  ctx.lineTo(baseRight, baseY)
  ctx.lineTo(baseLeft, baseY)
  ctx.closePath()
}

function drawHatchLines(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  width: number,
  yStart: number,
  yEnd: number,
  spacing: number,
) {
  const height = yEnd - yStart
  const maxDim = width + Math.abs(height) + spacing * 2
  for (let d = -maxDim; d < maxDim; d += spacing) {
    ctx.moveTo(d, yStart)
    ctx.lineTo(d + Math.abs(height), yEnd)
  }
}

function handleIslandDragMove(
  e: Konva.KonvaEventObject<DragEvent>,
  islandWidth: number,
  islandLength: number,
  snapPositions?: number[],
  roadwayBounds?: RoadwayBounds,
  roadLength?: number,
) {
  const node = e.target

  if (roadwayBounds) {
    const x = node.x()
    node.x(Math.max(roadwayBounds.minX, Math.min(x, roadwayBounds.maxX - islandWidth)))
  }

  if (snapPositions?.length || roadwayBounds) {
    const x = node.x()
    const candidates: number[] = []

    if (snapPositions?.length) {
      const valid = roadwayBounds
        ? snapPositions.filter((sp) => sp >= roadwayBounds.minX && sp <= roadwayBounds.maxX - islandWidth)
        : snapPositions
      candidates.push(...valid)
    }

    if (roadwayBounds) {
      const roadwayCenter = (roadwayBounds.minX + roadwayBounds.maxX) / 2
      candidates.push(roadwayCenter - islandWidth / 2)
    }

    if (candidates.length) {
      let nearest = candidates[0]
      let minDist = Math.abs(x - nearest)
      for (const sp of candidates) {
        const dist = Math.abs(x - sp)
        if (dist < minDist) {
          minDist = dist
          nearest = sp
        }
      }
      if (minDist < SNAP_THRESHOLD) node.x(nearest)
    }
  }

  const y = node.y()
  if (roadLength != null) {
    const centerY = (roadLength - islandLength) / 2
    if (Math.abs(y - centerY) < SNAP_THRESHOLD) {
      node.y(centerY)
    }
  }
}

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

function getEntryBands(
  width: number,
  length: number,
  taperLen: number,
  endShape: string,
  entryTreatment: string,
): EntryBand[] {
  if (entryTreatment === 'none') return []

  const sideInset = Math.min(0.26, Math.max(0.12, width * 0.1))
  const innerWidth = Math.max(0.5, width - sideInset * 2)
  const bandHeight = Math.min(0.42, Math.max(0.26, length * 0.05))
  const topY = endShape === 'flat' ? 0.16 : taperLen + 0.14
  const bottomY = length - bandHeight - (endShape === 'flat' ? 0.16 : taperLen + 0.14)

  const createSegments = (): EntryBandSegment[] => {
    if (entryTreatment === 'round-3cm') {
      return [{ x: sideInset, width: innerWidth, fill: '#d8d2ca' }]
    }

    if (entryTreatment === 'kassel') {
      return [{ x: sideInset, width: innerWidth, fill: '#e6e0d7', grooveStroke: 'rgba(116,107,96,0.55)' }]
    }

    const gap = Math.min(0.08, innerWidth * 0.08)
    const leftWidth = Math.max(0.48, innerWidth * 0.58)
    const rightWidth = Math.max(0.34, Math.min(innerWidth - leftWidth - gap, innerWidth * 0.28))
    const rightX = sideInset + innerWidth - rightWidth

    return [
      { x: sideInset, width: leftWidth, fill: '#ece8de' },
      { x: rightX, width: rightWidth, fill: '#d6d0c6', grooveStroke: 'rgba(122,113,103,0.52)' },
    ]
  }

  const segments = createSegments()
  if (bottomY <= topY + bandHeight + 0.08) {
    return [{ y: Math.max(0.18, (length - bandHeight) / 2), height: bandHeight, segments }]
  }

  return [
    { y: topY, height: bandHeight, segments },
    { y: bottomY, height: bandHeight, segments },
  ]
}

function getBikeCrossingIslandSegments(
  totalLength: number,
  desiredGapLength: number,
  width: number,
): BikeCrossingIslandSegment[] {
  const maxCapLength = Math.max(0.22, totalLength / 2 - 0.02)
  const preferredCapLength = (totalLength - desiredGapLength) / 2
  const minimumCapLength = Math.min(
    maxCapLength,
    Math.max(0.9, Math.min(1.4, width * 0.38)),
  )
  const capLength = Math.max(
    0.22,
    Math.min(
      maxCapLength,
      preferredCapLength >= minimumCapLength ? preferredCapLength : maxCapLength,
    ),
  )
  const bottomY = Math.max(capLength, totalLength - capLength)

  return [
    { y: 0, length: capLength, roundedSide: 'top' },
    { y: bottomY, length: capLength, roundedSide: 'bottom' },
  ]
}

export function TrafficIsland({
  marking,
  draggable,
  selected,
  snapPositions,
  roadwayBounds,
  roadClass,
  roadLength,
  linkedCrossing,
  onDragEnd,
  onClick,
  onDoubleClick,
  onRightClick,
  onDragging,
}: Props) {
  const width = marking.width || 2.5
  const length = marking.length || 8.0
  const surfaceType = marking.surfaceType || 'paved'
  const endShape = marking.endShape || 'rounded'
  const endTaperLength = marking.endTaperLength ?? 1.0
  const preset = marking.crossingAidPreset || 'free'
  const showCurbBorder = marking.showCurbBorder !== false
  const showApproach = preset !== 'bike-crossing' && marking.showApproachMarking !== false
  const rawApproachLength = marking.approachLength ?? 3.0
  const entryTreatment = marking.entryTreatment || 'none'

  const taperLen = endShape === 'flat' ? 0 : Math.min(endTaperLength, length * 0.4)
  const config = getSurfaceConfig(surfaceType)
  const pattern = config.getPattern()
  const inset = showCurbBorder ? CURB_INSET : 0
  const hatch = getHatchConfig(roadClass)
  const entryBands = preset === 'bike-crossing'
    ? []
    : getEntryBands(width, length, taperLen, endShape, entryTreatment)
  const bikeCrossingGapLength = linkedCrossing?.type === 'bike-crossing'
    ? Math.max(0.8, linkedCrossing.length ?? MARKING_RULES.bikeCrossing.defaultLength)
    : MARKING_RULES.bikeCrossing.defaultLength
  const bikeCrossingSegments = preset === 'bike-crossing'
    ? getBikeCrossingIslandSegments(length, bikeCrossingGapLength, width)
    : []

  const topApproach = rawApproachLength
  const bottomApproach = rawApproachLength
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

  const borderStroke = Math.max(hatch.borderWidth, 0.06)
  const curbStyle = {
    outerStroke: 'rgba(50,42,35,0.45)',
    outerWidth: 0.015,
    bodyStroke: '#b5ada4',
    bodyWidth: 0.018,
    highlightStroke: 'rgba(240,235,228,0.35)',
    highlightWidth: 0.008,
  }

  const tintFill = (() => {
    if (preset === 'barrier-free') return 'rgba(212,204,192,0.10)'
    if (surfaceType === 'green') return 'rgba(55,90,40,0.08)'
    if (surfaceType === 'cobblestone') return 'rgba(105,95,86,0.09)'
    return 'rgba(120,110,100,0.06)'
  })()

  return (
    <Group
      x={marking.x}
      y={marking.y}
      draggable={draggable}
      onDragStart={() => onDragging?.(true)}
      onDragMove={(e) => handleIslandDragMove(e, width, length, snapPositions, roadwayBounds, roadLength)}
      onDragEnd={(e) => {
        onDragging?.(false)
        onDragEnd?.(marking.id, e.target.x(), e.target.y())
      }}
      onMouseDown={(e) => {
        if (e.evt.button === 2) {
          e.cancelBubble = true
          onRightClick?.(marking.id)
        }
      }}
      onClick={(e) => {
        e.cancelBubble = true
        onClick?.(marking.id)
      }}
      onDblClick={(e) => {
        e.cancelBubble = true
        onDoubleClick?.(marking.id)
      }}
      onTap={(e) => {
        e.cancelBubble = true
        onClick?.(marking.id)
      }}
      onDblTap={() => onDoubleClick?.(marking.id)}
    >
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

      {showApproach && topApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawApproachFill(ctx, cx, -topApproach, 0, width, topBaseY)
            ctx.fillStrokeShape(shape)
          }}
          fill={ROADWAY_FILL}
          listening={false}
        />
      )}

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

      {showApproach && bottomApproach > 0.2 && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawApproachFill(ctx, cx, length + bottomApproach, 0, width, bottomBaseY)
            ctx.fillStrokeShape(shape)
          }}
          fill={ROADWAY_FILL}
          listening={false}
        />
      )}

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

      {preset === 'bike-crossing' ? bikeCrossingSegments.map((segment, index) => (
        <Group key={`bike-crossing-island-segment-${index}`} listening={false}>
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath()
              drawBikeCrossingIslandCapPath(ctx, 0, segment.y, width, segment.length, segment.roundedSide)
              ctx.fillStrokeShape(shape)
            }}
            fill={config.baseFill}
            listening={false}
          />

          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath()
              drawBikeCrossingIslandCapPath(
                ctx,
                inset,
                segment.y,
                Math.max(0.1, width - inset * 2),
                segment.length,
                segment.roundedSide,
              )
              ctx.fillStrokeShape(shape)
            }}
            fillPatternImage={pattern as unknown as HTMLImageElement}
            fillPatternScale={{ x: config.patternScale, y: config.patternScale }}
            listening={false}
          />

          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath()
              drawBikeCrossingIslandCapPath(
                ctx,
                inset,
                segment.y,
                Math.max(0.1, width - inset * 2),
                segment.length,
                segment.roundedSide,
              )
              ctx.fillStrokeShape(shape)
            }}
            fill={tintFill}
            listening={false}
          />

          {showCurbBorder && (
            <Shape
              sceneFunc={(ctx, shape) => {
                ctx.beginPath()
                drawBikeCrossingIslandCapPath(ctx, 0, segment.y, width, segment.length, segment.roundedSide)
                ctx.fillStrokeShape(shape)
              }}
              stroke={curbStyle.outerStroke}
              strokeWidth={curbStyle.outerWidth}
              fill="transparent"
              listening={false}
            />
          )}

          {showCurbBorder && (
            <Shape
              sceneFunc={(ctx, shape) => {
                ctx.beginPath()
                drawBikeCrossingIslandCapPath(
                  ctx,
                  0.008,
                  segment.y,
                  Math.max(0.1, width - 0.016),
                  segment.length,
                  segment.roundedSide,
                )
                ctx.fillStrokeShape(shape)
              }}
              stroke={curbStyle.bodyStroke}
              strokeWidth={curbStyle.bodyWidth}
              fill="transparent"
              listening={false}
            />
          )}

          {showCurbBorder && (
            <Shape
              sceneFunc={(ctx, shape) => {
                ctx.beginPath()
                const highlightInset = CURB_INSET - 0.003
                drawBikeCrossingIslandCapPath(
                  ctx,
                  highlightInset,
                  segment.y,
                  Math.max(0.1, width - highlightInset * 2),
                  segment.length,
                  segment.roundedSide,
                )
                ctx.fillStrokeShape(shape)
              }}
              stroke={curbStyle.highlightStroke}
              strokeWidth={curbStyle.highlightWidth}
              fill="transparent"
              listening={false}
            />
          )}
        </Group>
      )) : (
        <>
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath()
              drawIslandPath(ctx, 0, width, length, taperLen, endShape)
              ctx.fillStrokeShape(shape)
            }}
            fill={config.baseFill}
            listening={false}
          />

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

          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath()
              drawIslandPath(ctx, inset, width - inset * 2, length, taperLen, endShape)
              ctx.fillStrokeShape(shape)
            }}
            fill={tintFill}
            listening={false}
          />
        </>
      )}

      {entryBands.map((band, bandIndex) => (
        <Group key={`entry-band-${bandIndex}`} listening={false}>
          {band.segments.map((segment, segmentIndex) => (
            <Rect
              key={`entry-band-fill-${bandIndex}-${segmentIndex}`}
              x={segment.x}
              y={band.y}
              width={segment.width}
              height={band.height}
              fill={segment.fill}
              cornerRadius={0.05}
              listening={false}
            />
          ))}
          {band.segments.map((segment, segmentIndex) => (
            segment.grooveStroke ? (
              <Shape
                key={`entry-band-grooves-${bandIndex}-${segmentIndex}`}
                sceneFunc={(ctx, shape) => {
                  ctx.beginPath()
                  const spacing = Math.max(0.06, segment.width / 10)
                  for (let grooveX = segment.x + spacing; grooveX < segment.x + segment.width - spacing / 2; grooveX += spacing) {
                    ctx.moveTo(grooveX, band.y + 0.04)
                    ctx.lineTo(grooveX, band.y + band.height - 0.04)
                  }
                  ctx.fillStrokeShape(shape)
                }}
                stroke={segment.grooveStroke}
                strokeWidth={0.012}
                fill="transparent"
                listening={false}
              />
            ) : null
          ))}
        </Group>
      ))}

      {showCurbBorder && preset !== 'bike-crossing' && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawIslandPath(ctx, 0, width, length, taperLen, endShape)
            ctx.fillStrokeShape(shape)
          }}
          stroke={curbStyle.outerStroke}
          strokeWidth={curbStyle.outerWidth}
          fill="transparent"
          listening={false}
        />
      )}

      {showCurbBorder && preset !== 'bike-crossing' && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawIslandPath(ctx, 0.008, width - 0.016, length, taperLen, endShape)
            ctx.fillStrokeShape(shape)
          }}
          stroke={curbStyle.bodyStroke}
          strokeWidth={curbStyle.bodyWidth}
          fill="transparent"
          listening={false}
        />
      )}

      {showCurbBorder && preset !== 'bike-crossing' && (
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath()
            drawIslandPath(ctx, CURB_INSET - 0.003, width - (CURB_INSET - 0.003) * 2, length, taperLen, endShape)
            ctx.fillStrokeShape(shape)
          }}
          stroke={curbStyle.highlightStroke}
          strokeWidth={curbStyle.highlightWidth}
          fill="transparent"
          listening={false}
        />
      )}

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
