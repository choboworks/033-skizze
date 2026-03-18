import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useAppStore } from '@/store'
import type { ToolType } from '@/types'
import {
  MousePointer2,
  Pencil,
  Square,
  Type,
  Ruler,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Circle,
  Hexagon,
  Spline,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { LIBRARY_CATEGORIES } from '@/constants/library'
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
  const activeLibraryCategory = useAppStore((s) => s.activeLibraryCategory)
  const setLibraryCategory = useAppStore((s) => s.setLibraryCategory)
  const leftSidebarCollapsed = useAppStore((s) => s.panels.leftSidebarCollapsed)
  const toggleLeftSidebar = useAppStore((s) => s.toggleLeftSidebar)

  const isExpanded = !leftSidebarCollapsed

  const [openPopoverGroupId, setOpenPopoverGroupId] = useState<string | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (group) setActivePerGroup((prev) => ({ ...prev, [group.id]: tool }))
  }, [setActiveTool])

  const handleGroupClick = useCallback((group: ToolGroup) => {
    const isGroupActive = group.tools.some((t) => t === activeTool)
    if (isGroupActive) {
      // Already active: deselect → go back to select, close popover
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
    <div
      className="flex flex-col py-2 shrink-0 h-full overflow-hidden"
      style={{
        width: 'var(--toolbar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        alignItems: isExpanded ? 'stretch' : 'center',
      }}
    >
      {/* Toggle button */}
      <div
        className="flex shrink-0 mb-1"
        style={{ justifyContent: isExpanded ? 'flex-end' : 'center', paddingRight: isExpanded ? 6 : 0 }}
      >
        <button
          onClick={toggleLeftSidebar}
          className="w-8 h-8 flex items-center justify-center rounded transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          title={isExpanded ? 'Einklappen' : 'Ausklappen'}
        >
          {isExpanded
            ? <PanelLeftClose size={16} />
            : <PanelLeftOpen size={16} />
          }
        </button>
      </div>

      {/* Section label */}
      {isExpanded && (
        <div
          className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Werkzeuge
        </div>
      )}

      {/* Tool groups */}
      {TOOL_GROUPS.map((group) => {
        const currentToolId = activePerGroup[group.id] || group.defaultTool
        const isGroupActive = group.tools.some((t) => t === activeTool)
        const isPopoverOpen = openPopoverGroupId === group.id
        const displayIcon = group.id === 'shapes' ? getShapeIcon(currentToolId) : group.icon

        return (
          <div key={group.id} className="relative" style={{ paddingLeft: isExpanded ? 6 : 0, paddingRight: isExpanded ? 6 : 0 }}>
            {isExpanded ? (
              /* Expanded: icon + label + shortcut */
              <button
                data-toolbar-group={group.id}
                onClick={() => handleGroupClick(group)}
                onPointerDown={() => { if (group.hasPopover) handlePointerDown(group.id) }}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onContextMenu={(e) => { if (group.hasPopover) handleContextMenu(e, group.id) }}
                className="w-full flex items-center gap-2.5 px-2.5 rounded transition-colors"
                style={{
                  height: 34,
                  background: isGroupActive ? 'var(--accent-muted)' : 'transparent',
                  color: isGroupActive ? 'var(--accent)' : 'var(--text)',
                }}
                onMouseEnter={(e) => {
                  if (!isGroupActive) e.currentTarget.style.background = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isGroupActive ? 'var(--accent-muted)' : 'transparent'
                }}
              >
                {isGroupActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                {React.createElement(displayIcon, { size: 15 })}
                <span className="text-[13px] font-medium flex-1 text-left whitespace-nowrap" style={{ opacity: 1, transition: 'opacity 0.15s ease' }}>{group.label}</span>
                <span
                  className="text-[11px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--text-muted)',
                    opacity: 1,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  {group.shortcut}
                </span>
              </button>
            ) : (
              /* Collapsed: icon only */
              <button
                data-toolbar-group={group.id}
                onClick={() => handleGroupClick(group)}
                onPointerDown={() => { if (group.hasPopover) handlePointerDown(group.id) }}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onContextMenu={(e) => { if (group.hasPopover) handleContextMenu(e, group.id) }}
                className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
                style={{
                  background: isGroupActive ? 'var(--accent-muted)' : 'transparent',
                  color: isGroupActive ? 'var(--accent)' : 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  if (!isGroupActive) e.currentTarget.style.background = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isGroupActive ? 'var(--accent-muted)' : 'transparent'
                }}
              >
                {isGroupActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                {React.createElement(displayIcon, { size: 18 })}
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
            )}
          </div>
        )
      })}

      {/* Separator */}
      <div
        className="my-2 shrink-0"
        style={{
          borderTop: '1px solid var(--border)',
          marginLeft: isExpanded ? 10 : 8,
          marginRight: isExpanded ? 10 : 8,
        }}
      />

      {/* Section label */}
      {isExpanded && (
        <div
          className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Bibliothek
        </div>
      )}

      {/* Library category buttons */}
      {LIBRARY_CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const isActive = activeLibraryCategory === cat.id

        return (
          <div
            key={cat.id}
            className="relative"
            style={{ paddingLeft: isExpanded ? 6 : 0, paddingRight: isExpanded ? 6 : 0 }}
          >
            {isExpanded ? (
              <button
                onClick={() => setLibraryCategory(isActive ? null : cat.id)}
                className="w-full flex items-center gap-2.5 px-2.5 rounded transition-colors"
                style={{
                  height: 34,
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActive ? 'var(--accent-muted)' : 'transparent'
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                <Icon size={15} />
                <span className="text-[13px] font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            ) : (
              <button
                onClick={() => setLibraryCategory(isActive ? null : cat.id)}
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
            )}
          </div>
        )
      })}

      {/* Search */}
      <div
        className="my-2 shrink-0"
        style={{
          borderTop: '1px solid var(--border)',
          marginLeft: isExpanded ? 10 : 8,
          marginRight: isExpanded ? 10 : 8,
        }}
      />
      <div
        className="relative"
        style={{ paddingLeft: isExpanded ? 6 : 0, paddingRight: isExpanded ? 6 : 0 }}
      >
        {isExpanded ? (
          <button
            onClick={() => setLibraryCategory(LIBRARY_CATEGORIES[0].id)}
            className="w-full flex items-center gap-2.5 px-2.5 rounded transition-colors"
            style={{ height: 34, color: 'var(--text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Search size={15} />
            <span className="text-[13px] font-medium">Suchen</span>
          </button>
        ) : (
          <button
            onClick={() => setLibraryCategory(LIBRARY_CATEGORIES[0].id)}
            className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
        )}
      </div>

      <div className="h-1" />

      {/* Tool options popover */}
      {openPopoverGroupId && renderPopover()}
    </div>
  )
}
