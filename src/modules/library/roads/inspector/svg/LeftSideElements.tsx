// src/modules/library/roads/inspector/svg/LeftSideElements.tsx
// SVG-Elemente für die linke Seite — order-basiert mit Drag & Drop

import type { SmartRoadConfig, RoadsideElementType } from '../../types'
import type { HoveredZone, ZoneType, ZoneSide } from '../previewTypes'
import { ZONE_COLORS, ZONE_BORDER_COLORS } from '../previewTypes'
import type { SideElementPosition } from '../hooks/useRoadCalculations'

type Props = {
  config: SmartRoadConfig
  leftSideWidth: number
  elements: SideElementPosition[]
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
      const s = config.leftSide?.sidewalk?.surface
      return s === 'concrete' ? '#b8b8b8' : s === 'pavement' ? '#a0a0a0' : '#c8c0b0'
    }
    case 'curb': return config.leftSide?.curb === 'lowered' ? '#606060' : '#4a4a4a'
    case 'cyclePath': return config.leftSide?.cyclePath?.surface === 'asphalt' ? '#6b6b6b' : '#c45c5c'
    case 'greenStrip': return '#5a7a5a'
    case 'barrier': return '#d4d4d4'
    case 'emergencyLane': return '#6b6b6b'
    case 'parking': return '#6b6b6b'
    default: return '#888'
  }
}

export function LeftSideElements({
  config,
  leftSideWidth,
  elements,
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
  const reversed = [...elements].reverse()

  return (
    <g data-roadside="left" onMouseMove={onDragMouseMove}>
      {reversed.map((el, idx) => {
        const x = leftSideWidth - el.x - el.width
        const zone = el.type as ZoneType
        const isHovered = hoveredZone?.type === zone && hoveredZone.side === 'left'
        const isDragged = draggedElement === el.type
        const realIdx = elements.length - 1 - idx
        const isDropTarget = dropTargetIndex === realIdx

        return (
          <g
            key={el.type}
            style={{ 
              cursor: draggedElement ? 'grabbing' : 'pointer',
              opacity: isDragged ? 0.4 : 1,
            }}
            onMouseEnter={() => !draggedElement && onHover({ type: zone, side: 'left' })}
            onMouseLeave={() => !draggedElement && onHover(null)}
            onMouseDown={(e) => onDragMouseDown(el.type, 'left', e)}
            onMouseUp={(e) => onDragMouseUp(e, zone, 'left')}
            onDoubleClick={(e) => onDoubleClick(e, zone, undefined, 'left')}
            onMouseMove={() => draggedElement && draggedElement !== el.type && onDragOver(realIdx)}
          >
            <rect x={x} y={0} width={el.width} height={config.length}
              fill={getElementFill(el.type, config)} />

            {el.type === 'emergencyLane' && (
              <line x1={x + el.width} y1={0} x2={x + el.width} y2={config.length} stroke="#ffffff" strokeWidth={2} />
            )}

            {el.type === 'parking' && (() => {
              const orient = config.leftSide?.parking?.orientation || 'parallel'
              const spotSize = orient === 'parallel' ? 50 : orient === 'perpendicular' ? 25 : 30
              const lines: React.ReactNode[] = [
                <line key="edge" x1={x + el.width} y1={0} x2={x + el.width} y2={config.length} stroke="#ffffff" strokeWidth={2} />
              ]
              for (let y = spotSize; y < config.length; y += spotSize) {
                lines.push(<line key={y} x1={x} y1={y} x2={x + el.width} y2={orient === 'angled' ? y - el.width * 0.5 : y} stroke="#ffffff" strokeWidth={1.5} />)
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

            {el.type === 'cyclePath' && config.leftSide?.cyclePath?.lineType !== 'none' && (
              <line x1={x + el.width - 2} y1={0} x2={x + el.width - 2} y2={config.length}
                stroke="#ffffff" strokeWidth={2}
                strokeDasharray={config.leftSide?.cyclePath?.lineType === 'dashed' ? '8 16' : undefined} />
            )}

            {isHovered && !draggedElement && (
              <rect x={x} y={0} width={el.width} height={config.length}
                fill={ZONE_COLORS[zone] || 'rgba(59,130,246,0.15)'}
                stroke={ZONE_BORDER_COLORS[zone] || '#3b82f6'} strokeWidth={2} />
            )}

            {isDropTarget && draggedElement && (
              <line x1={x + el.width} y1={0} x2={x + el.width} y2={config.length} stroke="#3b82f6" strokeWidth={3} />
            )}
          </g>
        )
      })}
    </g>
  )
}