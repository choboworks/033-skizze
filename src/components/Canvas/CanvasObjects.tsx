import { useRef, useEffect, useCallback } from 'react'
import { Rect, Ellipse, Line, Arrow, RegularPolygon, Star, Transformer } from 'react-konva'
import { useAppStore } from '@/store'
import type { CanvasObject } from '@/types'
import type Konva from 'konva'

/**
 * Registry to track Konva node refs by object ID.
 * Shared between ShapeRenderer instances and the shared Transformer.
 */
const shapeRefs = new Map<string, Konva.Node>()

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
    draggable: !obj.locked,
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => onSelect(obj.id, e),
    onDblClick: () => onDoubleClick(obj.id),
    onDblTap: () => onDoubleClick(obj.id),
    onTap: (e: Konva.KonvaEventObject<Event>) =>
      onSelect(obj.id, e as Konva.KonvaEventObject<MouseEvent>),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      updateObject(obj.id, { x: e.target.x(), y: e.target.y() })
    },
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target
      const scaleX = node.scaleX()
      const scaleY = node.scaleY()
      node.scaleX(1)
      node.scaleY(1)

      updateObject(obj.id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(2, node.width() * scaleX),
        height: Math.max(2, node.height() * scaleY),
        rotation: node.rotation(),
      })
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

    default:
      return null
  }
}

// ─── Shared Transformer ───────────────────────────────────────

function SelectionTransformer() {
  const trRef = useRef<Konva.Transformer>(null)
  const selection = useAppStore((s) => s.selection)
  const objects = useAppStore((s) => s.objects)
  const updateObject = useAppStore((s) => s.updateObject)

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

  return (
    <Transformer
      ref={trRef as React.RefObject<Konva.Transformer>}
      rotateEnabled={true}
      enabledAnchors={[
        'top-left', 'top-right', 'bottom-left', 'bottom-right',
        'middle-left', 'middle-right', 'top-center', 'bottom-center',
      ]}
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

  const handleSelect = (id: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true

    if (e.evt.shiftKey) {
      addToSelection(id)
    } else {
      select([id])
    }
  }

  // Render in z-order: first in array = bottom, last = top
  const orderedObjects = objectOrder
    .map((id) => objects[id])
    .filter(Boolean)

  return (
    <>
      {orderedObjects.map((obj) => (
        <ShapeRenderer
          key={obj.id}
          obj={obj}
          onSelect={handleSelect}
          onDoubleClick={(id) => {
            select([id])
            openProperties(id)
          }}
        />
      ))}
      <SelectionTransformer />
    </>
  )
}
