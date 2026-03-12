// src/modules/library/roads/inspector/svg/RightSideElements.tsx
// SVG-Elemente für die rechte Seite — order-basiert mit Drag & Drop

import type { SmartRoadConfig, RoadsideElementType } from '../../types'
import type { HoveredZone, ZoneType, ZoneSide } from '../previewTypes'
import { ZONE_COLORS, ZONE_BORDER_COLORS } from '../previewTypes'
import type { SideElementPosition } from '../hooks/useRoadCalculations'

type Props = {
  config: SmartRoadConfig
  leftSideWidth: number
  elements: SideElementPosition[]
  rightRampWidth?: number
  hoveredZone: HoveredZone
  draggedElement: RoadsideElementType | null
  dropTargetIndex: number | null
  onHover: (zone: HoveredZone) => void
  onDoubleClick: (e: React.MouseEvent, zone: ZoneType, index?: number, side?: ZoneSide) => void
  onDragMouseDown: (el: RoadsideElementType, side: 'left' | 'right', e: React.MouseEvent) => void
  onDragMouseMove: (e: React.MouseEvent) => void
  onDragMouseUp: (e: React.MouseEvent, zone: ZoneType, side: ZoneSide) => void
  onDragOver: (index: number) => void
}

function getElementFill(type: RoadsideElementType, config: SmartRoadConfig): string {
  switch (type) {
    case 'sidewalk': {
      const s = config.rightSide?.sidewalk?.surface
      return s === 'concrete' ? '#b8b8b8' : s === 'pavement' ? '#a0a0a0' : '#c8c0b0'
    }
    case 'curb': return config.rightSide?.curb === 'lowered' ? '#606060' : '#4a4a4a'
    case 'cyclePath': return config.rightSide?.cyclePath?.surface === 'asphalt' ? '#6b6b6b' : '#c45c5c'
    case 'greenStrip': return '#5a7a5a'
    case 'barrier': return '#d4d4d4'
    case 'emergencyLane': return '#6b6b6b'
    case 'parking': return '#6b6b6b'
    default: return '#888'
  }
}

export function RightSideElements({
  config,
  leftSideWidth,
  elements,
  rightRampWidth = 0,
  hoveredZone,
  draggedElement,
  dropTargetIndex,
  onHover,
  onDoubleClick,
  onDragMouseDown,
  onDragMouseMove,
  onDragMouseUp,
  onDragOver,
}: Props) {
  const roadRight = leftSideWidth + config.width
  const rampOffset = rightRampWidth

  return (
    <g data-roadside="right" onMouseMove={onDragMouseMove}>
      {elements.map((el, idx) => {
        const x = roadRight + rampOffset + el.x
        const zone = el.type as ZoneType
        const isHovered = hoveredZone?.type === zone && hoveredZone.side === 'right'
        const isDragged = draggedElement === el.type
        const isDropTarget = dropTargetIndex === idx

        return (
          <g
            key={el.type}
            style={{ 
              cursor: draggedElement ? 'grabbing' : 'pointer',
              opacity: isDragged ? 0.4 : 1,
            }}
            onMouseEnter={() => !draggedElement && onHover({ type: zone, side: 'right' })}
            onMouseLeave={() => !draggedElement && onHover(null)}
            onMouseDown={(e) => onDragMouseDown(el.type, 'right', e)}
            onMouseUp={(e) => onDragMouseUp(e, zone, 'right')}
            onDoubleClick={(e) => onDoubleClick(e, zone, undefined, 'right')}
            onMouseMove={() => draggedElement && draggedElement !== el.type && onDragOver(idx)}
          >
            <rect x={x} y={0} width={el.width} height={config.length}
              fill={getElementFill(el.type, config)} />

            {el.type === 'emergencyLane' && (
              <line x1={x} y1={0} x2={x} y2={config.length} stroke="#ffffff" strokeWidth={2} />
            )}

            {el.type === 'parking' && (() => {
              const orient = config.rightSide?.parking?.orientation || 'parallel'
              const spotSize = orient === 'parallel' ? 50 : orient === 'perpendicular' ? 25 : 30
              const lines: React.ReactNode[] = [
                <line key="edge" x1={x} y1={0} x2={x} y2={config.length} stroke="#ffffff" strokeWidth={2} />
              ]
              for (let y = spotSize; y < config.length; y += spotSize) {
                const y2 = orient === 'angled' ? y - el.width * 0.5 : y
                lines.push(<line key={y} x1={x} y1={y} x2={x + el.width} y2={y2} stroke="#ffffff" strokeWidth={1.5} />)
              }
              return lines
            })()}

            {el.type === 'barrier' && (() => {
              const halfGap = 14, avail = config.length - 28, spacing = 50
              const count = Math.floor(avail / spacing) + 1
              const total = (count - 1) * spacing
              const startY = halfGap + (avail - total) / 2
              return Array.from({ length: count }).map((_, i) => (
                <rect key={i} x={x + 2} y={startY + i * spacing - 4} width={4} height={8} fill="#64748b" />
              ))
            })()}

            {el.type === 'cyclePath' && config.rightSide?.cyclePath?.lineType !== 'none' && (
              <line x1={x + 2} y1={0} x2={x + 2} y2={config.length}
                stroke="#ffffff" strokeWidth={2}
                strokeDasharray={config.rightSide?.cyclePath?.lineType === 'dashed' ? '8 16' : undefined} />
            )}

            {isHovered && !draggedElement && (
              <rect x={x} y={0} width={el.width} height={config.length}
                fill={ZONE_COLORS[zone] || 'rgba(59,130,246,0.15)'}
                stroke={ZONE_BORDER_COLORS[zone] || '#3b82f6'} strokeWidth={2} />
            )}

            {isDropTarget && draggedElement && (
              <line x1={x} y1={0} x2={x} y2={config.length} stroke="#3b82f6" strokeWidth={3} />
            )}
          </g>
        )
      })}

      {draggedElement && dropTargetIndex === elements.length && elements.length > 0 && (
        <line
          x1={roadRight + rampOffset + elements[elements.length - 1].x + elements[elements.length - 1].width}
          y1={0}
          x2={roadRight + rampOffset + elements[elements.length - 1].x + elements[elements.length - 1].width}
          y2={config.length} stroke="#3b82f6" strokeWidth={3} />
      )}
    </g>
  )
}