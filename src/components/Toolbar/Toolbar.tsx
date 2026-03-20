import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useAppStore } from '@/store'
import type { ToolType } from '@/types'
import {
  MousePointer2,
  Pencil,
  Square,
  Type,
  Ruler,
  ScanSearch,
  Circle,
  Hexagon,
  Spline,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FreehandToolPopover } from './FreehandTool'
import { ShapesToolPopover } from './ShapesTool'
import { TextToolPopover } from './TextTool'
import { DimensionToolPopover } from './DimensionTool'

// --- Tool group definitions ---

interface ToolGroup {
  id: string
  defaultTool: ToolType
  icon: LucideIcon
  label: string
  shortcut: string
  tools: ToolType[]
  hasPopover: boolean
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    id: 'select',
    defaultTool: 'select',
    icon: MousePointer2,
    label: 'Auswahl',
    shortcut: 'V',
    tools: ['select'],
    hasPopover: false,
  },
  {
    id: 'draw',
    defaultTool: 'freehand',
    icon: Pencil,
    label: 'Freihand',
    shortcut: 'P',
    tools: ['freehand'],
    hasPopover: true,
  },
  {
    id: 'shapes',
    defaultTool: 'rect',
    icon: Square,
    label: 'Formen',
    shortcut: 'O',
    tools: ['rect', 'rounded-rect', 'ellipse', 'triangle', 'polygon', 'star', 'line', 'arrow', 'path'],
    hasPopover: true,
  },
  {
    id: 'text',
    defaultTool: 'text',
    icon: Type,
    label: 'Text',
    shortcut: 'T',
    tools: ['text'],
    hasPopover: true,
  },
  {
    id: 'measure',
    defaultTool: 'dimension',
    icon: Ruler,
    label: 'Bemaßung',
    shortcut: 'M',
    tools: ['dimension'],
    hasPopover: true,
  },
  {
    id: 'print-area',
    defaultTool: 'print-area',
    icon: ScanSearch,
    label: 'Ausschnitt',
    shortcut: 'A',
    tools: ['print-area'],
    hasPopover: false,
  },
]

function findGroupForTool(toolId: ToolType): ToolGroup | undefined {
  return TOOL_GROUPS.find((g) => g.tools.includes(toolId))
}

function getShapeIcon(toolId: ToolType): LucideIcon {
  switch (toolId) {
    case 'ellipse': return Circle
    case 'polygon': return Hexagon
    case 'path': return Spline
    default: return Square
  }
}

export function Toolbar() {
  const activeTool = useAppStore((s) => s.activeTool)
  const setActiveTool = useAppStore((s) => s.setActiveTool)
  const [openPopoverGroupId, setOpenPopoverGroupId] = useState<string | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activePerGroup, setActivePerGroup] = useState<Record<string, ToolType>>({
    select: 'select',
    draw: 'freehand',
    shapes: 'rect',
    text: 'text',
    measure: 'dimension',
    'print-area': 'print-area',
  })

  // Auto-open popover when tool changes (e.g. via keyboard shortcut)
  useEffect(() => {
    const unsub = useAppStore.subscribe((state, prev) => {
      if (state.activeTool !== prev.activeTool) {
        const group = TOOL_GROUPS.find((g) => g.tools.includes(state.activeTool))
        if (group?.hasPopover) {
          setOpenPopoverGroupId(group.id)
          setActivePerGroup((p) => ({ ...p, [group.id]: state.activeTool }))
        } else {
          setOpenPopoverGroupId(null)
        }
      }
    })
    return unsub
  }, [])

  // Close popover on outside click
  useEffect(() => {
    if (!openPopoverGroupId) return
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-toolbar-popover]') && !target.closest('[data-toolbar-group]')) {
        setOpenPopoverGroupId(null)
      }
    }
    window.addEventListener('mousedown', handle)
    return () => window.removeEventListener('mousedown', handle)
  }, [openPopoverGroupId])

  const handleToolSelect = useCallback((toolId: string) => {
    const tool = toolId as ToolType
    setActiveTool(tool)
    const group = findGroupForTool(tool)
    if (group) setActivePerGroup((prev) => ({ ...prev, [group.id]: tool }))
  }, [setActiveTool])

  const handleGroupClick = useCallback((group: ToolGroup) => {
    const isGroupActive = group.tools.some((t) => t === activeTool)
    if (isGroupActive) {
      setActiveTool('select')
      setOpenPopoverGroupId(null)
      return
    }
    const toolId = activePerGroup[group.id] || group.defaultTool
    setActiveTool(toolId)
    if (group.hasPopover) {
      setOpenPopoverGroupId(group.id)
    } else {
      setOpenPopoverGroupId(null)
    }
  }, [activeTool, activePerGroup, setActiveTool])

  const handlePointerDown = useCallback((groupId: string) => {
    longPressTimer.current = setTimeout(() => {
      setOpenPopoverGroupId(groupId)
      longPressTimer.current = null
    }, 400)
  }, [])

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent, groupId: string) => {
    e.preventDefault()
    setOpenPopoverGroupId(groupId)
  }, [])

  const closePopover = useCallback(() => setOpenPopoverGroupId(null), [])

  const renderPopover = () => {
    switch (openPopoverGroupId) {
      case 'draw':
        return <FreehandToolPopover onSelectTool={handleToolSelect} onClose={closePopover} />
      case 'shapes':
        return <ShapesToolPopover onSelectTool={handleToolSelect} onClose={closePopover} />
      case 'text':
        return <TextToolPopover onClose={closePopover} />
      case 'measure':
        return <DimensionToolPopover onClose={closePopover} />
      default:
        return null
    }
  }

  return (
    <aside
      className="flex flex-col shrink-0 h-full glass z-40"
      style={{
        width: 'var(--toolbar-width)',
        borderRadius: 'var(--radius-xl)',
        padding: '12px 8px',
      }}
    >
      {/* Section label */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span
          className="text-[10px] font-medium uppercase tracking-[0.15em]"
          style={{ color: 'var(--text-muted)' }}
        >
          Tools
        </span>
      </div>

      {/* Tool cards */}
      <div className="flex flex-col gap-1.5">
        {TOOL_GROUPS.map((group) => {
          const currentToolId = activePerGroup[group.id] || group.defaultTool
          const isGroupActive = group.tools.some((t) => t === activeTool)
          const displayIcon = group.id === 'shapes' ? getShapeIcon(currentToolId) : group.icon

          return (
            <button
              key={group.id}
              data-toolbar-group={group.id}
              onClick={() => handleGroupClick(group)}
              onPointerDown={() => { if (group.hasPopover) handlePointerDown(group.id) }}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onContextMenu={(e) => { if (group.hasPopover) handleContextMenu(e, group.id) }}
              className="group flex w-full flex-col items-center gap-1.5 px-1 py-2.5 transition-all"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: isGroupActive
                  ? '1px solid rgba(56, 189, 248, 0.4)'
                  : '1px solid var(--border-subtle)',
                background: isGroupActive ? 'var(--accent-muted)' : 'var(--surface-raised)',
                boxShadow: isGroupActive ? 'var(--shadow-glow)' : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isGroupActive) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface-hover)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isGroupActive
                  ? 'rgba(56, 189, 248, 0.4)'
                  : 'var(--border-subtle)'
                e.currentTarget.style.background = isGroupActive
                  ? 'var(--accent-muted)'
                  : 'var(--surface-raised)'
              }}
            >
              <div
                className="flex items-center justify-center transition-colors"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: isGroupActive ? 'var(--accent)' : 'var(--surface)',
                  color: isGroupActive ? '#000' : 'var(--text-muted)',
                }}
              >
                {React.createElement(displayIcon, { size: 17 })}
              </div>
              <div className="text-center">
                <div
                  className="text-[10px] font-medium leading-tight"
                  style={{ color: isGroupActive ? 'var(--text)' : 'var(--text-secondary)' }}
                >
                  {group.label}
                </div>
                <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                  {group.shortcut}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Tool options popover */}
      {openPopoverGroupId && renderPopover()}
    </aside>
  )
}
