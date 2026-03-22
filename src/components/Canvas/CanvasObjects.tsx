import { useRef, useEffect, useCallback, useState } from 'react'
import { Rect, Ellipse, Line, Arrow, RegularPolygon, Star, Text, Group, Transformer } from 'react-konva'
import { useAppStore } from '@/store'
import type { CanvasObject } from '@/types'
import Konva from 'konva'
import { shapeRefs } from './shapeRefs'
import { pixelsToMeters, MM_TO_PX } from '@/utils/scale'
import { SmartRoadCanvasObject } from '@/smartroads/rendering/SmartRoadCanvasObject'

// ─── Text Shape (auto-sized background rect) ─────────────────

function TextShape({
  obj,
  commonProps,
  editingTextId,
}: {
  obj: CanvasObject
  commonProps: Record<string, unknown>
  editingTextId: string | null
}) {
  const textRef = useRef<Konva.Text>(null)
  const rectRef = useRef<Konva.Rect>(null)
  const hasBg = !!(obj.textBackground && obj.textBackground !== 'transparent')

  // Sync rect size with actual text dimensions after render
  useEffect(() => {
    if (hasBg && textRef.current && rectRef.current) {
      rectRef.current.width(textRef.current.width())
      rectRef.current.height(textRef.current.height())
      rectRef.current.getLayer()?.batchDraw()
    }
  }, [hasBg, obj.text, obj.fontSize, obj.fontStyle, obj.width])

  return (
    <Group
      {...commonProps}
      width={obj.width}
      height={obj.height}
      visible={obj.visible && editingTextId !== obj.id}
    >
      {hasBg && (
        <Rect
          ref={rectRef as React.RefObject<Konva.Rect>}
          x={0}
          y={0}
          fill={obj.textBackground}
          listening={false}
        />
      )}
      <Text
        ref={textRef as React.RefObject<Konva.Text>}
        text={obj.text || ''}
        fontSize={obj.fontSize ?? 24}
        lineHeight={1.2}
        fontStyle={obj.fontStyle ?? 'normal'}
        textDecoration={obj.textDecoration || ''}
        align={(obj.textAlign ?? 'left') as 'left' | 'center' | 'right'}
        fill={obj.fillColor !== 'transparent' ? obj.fillColor : '#000000'}
      />
    </Group>
  )
}

// ─── Dimension Shape (measurement line with label) ───────────

function DimensionShape({
  obj,
  commonProps,
}: {
  obj: CanvasObject
  commonProps: Record<string, unknown>
}) {
  const scale = useAppStore((s) => s.scale)
  const start = obj.dimensionStart
  const end = obj.dimensionEnd
  if (!start || !end) return null

  // All coords relative to dimensionStart (the group origin)
  const sx = 0
  const sy = 0
  const ex = end.x - start.x
  const ey = end.y - start.y

  const distPx = Math.sqrt(ex * ex + ey * ey)
  const distMeters = pixelsToMeters(distPx, scale.currentScale)
  const label = `${distMeters.toFixed(2)} m`

  // Angle of the line
  const angle = Math.atan2(ey, ex)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  // Perpendicular offset for extension lines
  const ext = 12
  const perpX = -sin * ext
  const perpY = cos * ext

  const fontSize = obj.fontSize ?? 14
  const strokeColor = obj.strokeColor || '#000000'
  const strokeWidth = obj.strokeWidth || 1.5

  // Arrowhead size
  const arrowLen = 8
  const arrowAngle = Math.PI / 6

  // Arrow points at start (pointing outward from start toward end)
  const a1x1 = sx + Math.cos(angle + arrowAngle) * arrowLen
  const a1y1 = sy + Math.sin(angle + arrowAngle) * arrowLen
  const a1x2 = sx + Math.cos(angle - arrowAngle) * arrowLen
  const a1y2 = sy + Math.sin(angle - arrowAngle) * arrowLen

  // Arrow points at end (pointing outward from end toward start)
  const a2x1 = ex - Math.cos(angle + arrowAngle) * arrowLen
  const a2y1 = ey - Math.sin(angle + arrowAngle) * arrowLen
  const a2x2 = ex - Math.cos(angle - arrowAngle) * arrowLen
  const a2y2 = ey - Math.sin(angle - arrowAngle) * arrowLen

  // Midpoint for text
  const midX = (sx + ex) / 2
  const midY = (sy + ey) / 2

  // Text rotation: keep readable (flip if upside-down)
  let textAngle = (angle * 180) / Math.PI
  if (textAngle > 90 || textAngle < -90) textAngle += 180

  // Text offset perpendicular above the line
  const textOffX = -sin * (fontSize * 0.8)
  const textOffY = cos * (fontSize * 0.8)

  return (
    <Group
      {...commonProps}
      x={start.x}
      y={start.y}
    >
      {/* Extension lines at start and end */}
      <Line
        points={[sx - perpX, sy - perpY, sx + perpX, sy + perpY]}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.6}
        listening={false}
      />
      <Line
        points={[ex - perpX, ey - perpY, ex + perpX, ey + perpY]}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.6}
        listening={false}
      />

      {/* Main line (listening enabled for drag/click hit area) */}
      <Line
        points={[sx, sy, ex, ey]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        hitStrokeWidth={Math.max(20, strokeWidth + 16)}
      />

      {/* Arrowhead at start */}
      <Line
        points={[a1x1, a1y1, sx, sy, a1x2, a1y2]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        listening={false}
      />

      {/* Arrowhead at end */}
      <Line
        points={[a2x1, a2y1, ex, ey, a2x2, a2y2]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        listening={false}
      />

      {/* Distance label */}
      <Text
        x={midX + textOffX}
        y={midY + textOffY}
        text={label}
        fontSize={fontSize}
        fill={strokeColor}
        rotation={textAngle}
        offsetX={label.length * fontSize * 0.3}
        offsetY={fontSize / 2}
        listening={false}
      />
    </Group>
  )
}

// ─── Single Shape ─────────────────────────────────────────────

function ShapeRenderer({
  obj,
  onSelect,
  onDoubleClick,
}: {
  obj: CanvasObject
  onSelect: (id: string, e: Konva.KonvaEventObject<MouseEvent>) => void
  onDoubleClick: (id: string) => void
}) {
  const updateObject = useAppStore((s) => s.updateObject)
  const editingTextId = useAppStore((s) => s.editingTextId)
  const activeTool = useAppStore((s) => s.activeTool)
  const hasViewportOverride = useAppStore((s) => !!s.scale.viewport)

  const registerRef = useCallback(
    (node: Konva.Node | null) => {
      if (node) shapeRefs.set(obj.id, node)
      else shapeRefs.delete(obj.id)
    },
    [obj.id]
  )

  if (!obj.visible) return null

  const commonProps = {
    ref: registerRef,
    id: obj.id,
    x: obj.x,
    y: obj.y,
    rotation: obj.rotation,
    opacity: obj.opacity,
    draggable: !obj.locked && (activeTool === 'select' || (activeTool === 'print-area' && hasViewportOverride)),
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => onSelect(obj.id, e),
    onDblClick: () => onDoubleClick(obj.id),
    onDblTap: () => onDoubleClick(obj.id),
    onTap: (e: Konva.KonvaEventObject<Event>) =>
      onSelect(obj.id, e as Konva.KonvaEventObject<MouseEvent>),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      if (obj.type === 'dimension' && obj.dimensionStart && obj.dimensionEnd) {
        // Dimension group origin = dimensionStart, so delta = newPos - oldStart
        const newX = e.target.x()
        const newY = e.target.y()
        const dx = newX - obj.dimensionStart.x
        const dy = newY - obj.dimensionStart.y
        updateObject(obj.id, {
          x: newX,
          y: newY,
          dimensionStart: { x: newX, y: newY },
          dimensionEnd: { x: obj.dimensionEnd.x + dx, y: obj.dimensionEnd.y + dy },
        })
      } else {
        updateObject(obj.id, { x: e.target.x(), y: e.target.y() })
      }
    },
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target
      const scaleX = node.scaleX()
      const scaleY = node.scaleY()
      node.scaleX(1)
      node.scaleY(1)

      if (obj.type === 'freehand' || obj.type === 'line' || obj.type === 'arrow') {
        const pts = obj.points || []
        const scaledPoints = pts.map((v, i) => (i % 2 === 0 ? v * scaleX : v * scaleY))
        updateObject(obj.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          points: scaledPoints,
        })
      } else if (obj.type === 'text') {
        // Use uniform scale (average of X/Y) so text scales proportionally
        const scale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2
        const newFontSize = Math.max(6, Math.round((obj.fontSize ?? 24) * scale))
        const numLines = (obj.text || '').split('\n').length || 1
        const newHeight = newFontSize * 1.2 * numLines
        // Measure new text width via a temporary Konva.Text node
        const tempText = new Konva.Text({
          text: obj.text || '',
          fontSize: newFontSize,
          fontStyle: obj.fontStyle ?? 'normal',
        })
        const newWidth = Math.max(20, tempText.width())
        tempText.destroy()
        updateObject(obj.id, {
          x: node.x(),
          y: node.y(),
          width: newWidth,
          height: newHeight,
          fontSize: newFontSize,
          rotation: node.rotation(),
        })
      } else {
        updateObject(obj.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(2, node.width() * scaleX),
          height: Math.max(2, node.height() * scaleY),
          rotation: node.rotation(),
        })
      }
    },
  }

  switch (obj.type) {
    case 'rect':
      return (
        <Rect
          {...commonProps}
          width={obj.width}
          height={obj.height}
          fill={obj.fillColor}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          dash={obj.lineDash}
        />
      )

    case 'rounded-rect':
      return (
        <Rect
          {...commonProps}
          width={obj.width}
          height={obj.height}
          cornerRadius={obj.cornerRadius ?? 12}
          fill={obj.fillColor}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          dash={obj.lineDash}
        />
      )

    case 'ellipse':
      return (
        <Ellipse
          {...commonProps}
          radiusX={obj.width / 2}
          radiusY={obj.height / 2}
          fill={obj.fillColor}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          dash={obj.lineDash}
        />
      )

    case 'triangle':
      return (
        <RegularPolygon
          {...commonProps}
          sides={3}
          radius={Math.max(obj.width, obj.height) / 2}
          fill={obj.fillColor}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          dash={obj.lineDash}
        />
      )

    case 'polygon':
      return (
        <RegularPolygon
          {...commonProps}
          sides={6}
          radius={Math.max(obj.width, obj.height) / 2}
          fill={obj.fillColor}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          dash={obj.lineDash}
        />
      )

    case 'star':
      return (
        <Star
          {...commonProps}
          numPoints={obj.numPoints ?? 5}
          innerRadius={(Math.max(obj.width, obj.height) / 2) * (obj.innerRadius ?? 0.4)}
          outerRadius={Math.max(obj.width, obj.height) / 2}
          fill={obj.fillColor}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          dash={obj.lineDash}
        />
      )

    case 'freehand':
      return (
        <Line
          {...commonProps}
          points={obj.points || []}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          tension={obj.tension ?? 0.25}
          lineCap="round"
          lineJoin="round"
          dash={obj.lineDash}
          hitStrokeWidth={Math.max(12, obj.strokeWidth + 8)}
        />
      )

    case 'line':
      return (
        <Line
          {...commonProps}
          points={obj.points || [0, 0, obj.width, obj.height]}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          lineCap="round"
          dash={obj.lineDash}
          hitStrokeWidth={12}
        />
      )

    case 'arrow':
      return (
        <Arrow
          {...commonProps}
          points={obj.points || [0, 0, obj.width, obj.height]}
          stroke={obj.strokeColor}
          strokeWidth={obj.strokeWidth}
          fill={obj.strokeColor}
          pointerLength={obj.strokeWidth * 4}
          pointerWidth={obj.strokeWidth * 3}
          lineCap="round"
          dash={obj.lineDash}
          hitStrokeWidth={12}
        />
      )

    case 'text':
      return (
        <TextShape
          obj={obj}
          commonProps={commonProps}
          editingTextId={editingTextId}
        />
      )

    case 'dimension':
      return (
        <DimensionShape
          obj={obj}
          commonProps={commonProps}
        />
      )

    default:
      return null
  }
}

// ─── Shared Transformer ───────────────────────────────────────

function SelectionTransformer() {
  const trRef = useRef<Konva.Transformer>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const selection = useAppStore((s) => s.selection)
  const objects = useAppStore((s) => s.objects)
  const updateObject = useAppStore((s) => s.updateObject)

  // Track Shift key for rotation snapping
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === 'Shift') setShiftHeld(true) }
    const up = (e: KeyboardEvent) => { if (e.key === 'Shift') setShiftHeld(false) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // Sync transformer nodes whenever selection changes
  useEffect(() => {
    const tr = trRef.current
    if (!tr) return

    const nodes: Konva.Node[] = []
    for (const id of selection) {
      const node = shapeRefs.get(id)
      if (node) nodes.push(node)
    }
    tr.nodes(nodes)
    tr.getLayer()?.batchDraw()
  }, [selection, objects]) // also react to object changes (new objects added)

  // After multi-drag, sync all dragged positions back to store
  useEffect(() => {
    const tr = trRef.current
    if (!tr) return

    const handleDragEnd = () => {
      for (const node of tr.nodes()) {
        const id = node.id()
        if (id) {
          updateObject(id, { x: node.x(), y: node.y() })
        }
      }
    }

    // Listen to dragend on each attached node for group drag
    const nodes = tr.nodes()
    for (const node of nodes) {
      node.on('dragend', handleDragEnd)
    }
    return () => {
      for (const node of nodes) {
        node.off('dragend', handleDragEnd)
      }
    }
  }, [selection, updateObject])

  if (selection.length === 0) return null

  // If ANY selected object is a smartroad, disable resize (real objects have fixed dimensions)
  const hasSmartRoad = selection.some((id) => objects[id]?.type === 'smartroad')
  const anchors = hasSmartRoad
    ? [] // no resize for real objects
    : ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']

  return (
    <Transformer
      ref={trRef as React.RefObject<Konva.Transformer>}
      rotateEnabled={true}
      resizeEnabled={!hasSmartRoad}
      rotationSnaps={shiftHeld ? [0, 90, 180, 270] : []}
      rotationSnapTolerance={shiftHeld ? 45 : 0}
      enabledAnchors={anchors}
      boundBoxFunc={(_oldBox, newBox) => {
        if (Math.abs(newBox.width) < 2 || Math.abs(newBox.height) < 2) {
          return _oldBox
        }
        return newBox
      }}
      borderStroke="#4a9eff"
      anchorStroke="#4a9eff"
      anchorFill="#ffffff"
      anchorSize={8}
      anchorCornerRadius={2}
    />
  )
}

// ─── All Objects + Transformer ────────────────────────────────

export function CanvasObjects() {
  const objects = useAppStore((s) => s.objects)
  const objectOrder = useAppStore((s) => s.objectOrder)
  const select = useAppStore((s) => s.select)
  const addToSelection = useAppStore((s) => s.addToSelection)
  const openProperties = useAppStore((s) => s.openProperties)
  const setEditingTextId = useAppStore((s) => s.setEditingTextId)
  const clearSelection = useAppStore((s) => s.clearSelection)


  const handleSelect = (id: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    if (e.evt.shiftKey) {
      addToSelection(id)
    } else {
      select([id])
    }
  }

  const setRoadEditor = useCallback((roadId: string) => {
    // Open the SmartRoad editor for this object
    const obj = objects[roadId]
    if (obj?.type === 'smartroad' && obj.subtype) {
      useAppStore.getState().openRoadEditor(roadId, obj.subtype)
    }
  }, [objects])

  const handleDoubleClick = (id: string) => {
    const obj = objects[id]
    if (obj?.type === 'smartroad') {
      setRoadEditor(id)
    } else if (obj?.type === 'text') {
      clearSelection()
      setEditingTextId(id)
      openProperties(id)
    } else {
      select([id])
      openProperties(id)
    }
  }

  const scaleState = useAppStore((s) => s.scale)
  const scale = scaleState.currentScale

  // Effective scale and viewport offset for print-area override
  const effectiveScale = scaleState.viewport?.scale ?? scale

  // Content frame from viewport override (dynamic size/position)
  const vp = scaleState.viewport
  const frameWmm = vp?.frameW ?? 190
  const frameHmm = vp?.frameH ?? 257
  const frameXmm = vp?.frameX ?? 10
  const frameYmm = vp?.frameY ?? 25

  const offsetXMeters = vp
    ? vp.centerX - (frameWmm / 1000 * effectiveScale) / 2
    : 0
  const offsetYMeters = vp
    ? vp.centerY - (frameHmm / 1000 * effectiveScale) / 2
    : 0

  // Pixel offset for content frame origin (within A4 page)
  const contentOriginX = vp ? frameXmm * MM_TO_PX : 0
  const contentOriginY = vp ? frameYmm * MM_TO_PX : 0

  const orderedObjects = objectOrder.map((id) => objects[id]).filter(Boolean)

  return (
    <>
      {orderedObjects.map((obj) => {
        // SmartRoad objects use their own renderer
        if (obj.type === 'smartroad') {
          return (
            <SmartRoadCanvasObject
              key={obj.id}
              obj={obj}
              scale={effectiveScale}
              offsetXMeters={offsetXMeters}
              offsetYMeters={offsetYMeters}
              contentOriginX={contentOriginX}
              contentOriginY={contentOriginY}
              onSelect={handleSelect}
              onDoubleClick={handleDoubleClick}
            />
          )
        }
        return (
          <ShapeRenderer
            key={obj.id}
            obj={obj}
            onSelect={handleSelect}
            onDoubleClick={handleDoubleClick}
          />
        )
      })}
      <SelectionTransformer />
    </>
  )
}
