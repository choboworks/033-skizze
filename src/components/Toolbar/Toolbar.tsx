import { useAppStore } from '@/store'
import type { ToolType } from '@/types'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  MousePointer2,
  Pencil,
  Square,
  Type,
  Ruler,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { LIBRARY_CATEGORIES } from '@/constants/library'
import { FreehandToolPopover } from './FreehandTool'
import { ShapesToolPopover } from './ShapesTool'

// --- Tool group definitions ---

interface ToolGroup {
  id: string
  defaultTool: ToolType
  icon: LucideIcon
  label: string
  shortcut: string
  tools: ToolType[]  // all tools in this group
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
    hasPopover: false,
  },
  {
    id: 'measure',
    defaultTool: 'dimension',
    icon: Ruler,
    label: 'Bemaßung',
    shortcut: 'M',
    tools: ['dimension'],
    hasPopover: false,
  },
]

function findGroupForTool(toolId: ToolType): ToolGroup | undefined {
  return TOOL_GROUPS.find((g) => g.tools.includes(toolId))
}

export function Toolbar() {
  const activeTool = useAppStore((s) => s.activeTool)
  const setActiveTool = useAppStore((s) => s.setActiveTool)
  const activeLibraryCategory = useAppStore((s) => s.activeLibraryCategory)
  const setLibraryCategory = useAppStore((s) => s.setLibraryCategory)

  const [openPopoverGroupId, setOpenPopoverGroupId] = useState<string | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track which tool is active per group
  const [activePerGroup, setActivePerGroup] = useState<Record<string, ToolType>>({
    select: 'select',
    draw: 'freehand',
    shapes: 'rect',
    text: 'text',
    measure: 'dimension',
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
    if (group) {
      setActivePerGroup((prev) => ({ ...prev, [group.id]: tool }))
    }
  }, [setActiveTool])

  const handleGroupClick = useCallback((group: ToolGroup) => {
    const toolId = activePerGroup[group.id] || group.defaultTool
    setActiveTool(toolId)

    // Auto-open popover if group has one
    if (group.hasPopover) {
      setOpenPopoverGroupId(group.id)
    } else {
      setOpenPopoverGroupId(null)
    }
  }, [activePerGroup, setActiveTool])

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
      default:
        return null
    }
  }

  return (
    <div
      className="flex flex-col items-center py-2 gap-0.5 shrink-0 h-full"
      style={{
        width: 'var(--toolbar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Tool groups */}
      {TOOL_GROUPS.map((group) => {
        const currentToolId = activePerGroup[group.id] || group.defaultTool
        const isGroupActive = group.tools.some((t) => t === activeTool)
        const isPopoverOpen = openPopoverGroupId === group.id

        // Show the icon of the currently selected tool in this group
        const currentToolGroup = TOOL_GROUPS.find((g) => g.id === group.id)
        const Icon = currentToolGroup?.icon || group.icon
        // For shapes group, show the icon of the active variant
        const displayIcon = group.id === 'shapes'
          ? getShapeIcon(currentToolId)
          : Icon

        return (
          <div key={group.id} className="flex flex-col items-center relative">
            <button
              data-toolbar-group={group.id}
              onClick={() => handleGroupClick(group)}
              onPointerDown={() => { if (group.hasPopover) handlePointerDown(group.id) }}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onContextMenu={(e) => { if (group.hasPopover) handleContextMenu(e, group.id) }}
              className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
              style={{
                background: isGroupActive ? 'var(--accent)' : 'transparent',
                color: isGroupActive ? '#ffffff' : 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                if (!isGroupActive) e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                if (!isGroupActive) e.currentTarget.style.background = 'transparent'
              }}
              title={`${group.label} (${group.shortcut})`}
            >
              {React.createElement(displayIcon, { size: 20 })}
              {/* Multi-tool indicator */}
              {group.tools.length > 1 && (
                <div
                  className="absolute bottom-1 right-1"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '3px solid transparent',
                    borderBottom: `3px solid ${isGroupActive ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'}`,
                  }}
                />
              )}
              {/* Tooltip (hidden when popover open) */}
              {!isPopoverOpen && (
                <div
                  className="absolute left-full ml-2 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-panel)',
                  }}
                >
                  {group.label}{' '}
                  <span style={{ color: 'var(--text-muted)' }}>({group.shortcut})</span>
                </div>
              )}
            </button>

            {/* (popover rendered at toolbar root level) */}
          </div>
        )
      })}

      {/* Separator */}
      <div className="w-8 my-1.5" style={{ borderTop: '2px solid var(--border)' }} />

      {/* Library category icons */}
      {LIBRARY_CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const isActive = activeLibraryCategory === cat.id

        return (
          <button
            key={cat.id}
            onClick={() => setLibraryCategory(cat.id)}
            className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
            style={{
              background: isActive ? 'var(--accent-muted)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isActive ? 'var(--accent-muted)' : 'transparent'
            }}
            title={cat.label}
          >
            <Icon size={18} />
            {isActive && (
              <div
                className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r"
                style={{ background: 'var(--accent)' }}
              />
            )}
            <div
              className="absolute left-full ml-2 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-panel)',
              }}
            >
              {cat.label}
            </div>
          </button>
        )
      })}

      {/* Search */}
      <div className="w-6 my-1" style={{ borderTop: '1px solid var(--border)' }} />
      <button
        onClick={() => setLibraryCategory(LIBRARY_CATEGORIES[0].id)}
        className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        title="Suchen"
      >
        <Search size={18} />
        <div
          className="absolute left-full ml-2 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-panel)',
          }}
        >
          Suchen
        </div>
      </button>

      <div className="h-1" />

      {/* Tool options popover (rendered at root level, not per-button) */}
      {openPopoverGroupId && renderPopover()}
    </div>
  )
}

// Helper: get the right icon for a shape tool variant
import React from 'react'
import { Circle, Hexagon, Spline } from 'lucide-react'

function getShapeIcon(toolId: ToolType): LucideIcon {
  switch (toolId) {
    case 'ellipse': return Circle
    case 'polygon': return Hexagon
    case 'path': return Spline
    default: return Square
  }
}
