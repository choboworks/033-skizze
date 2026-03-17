import { useAppStore } from '@/store'
import type { ToolType } from '@/types'
import {
  MousePointer2,
  Diamond,
  Hand,
  Pencil,
  Minus,
  ArrowUpRight,
  Square,
  Circle,
  Hexagon,
  Spline,
  Type,
  Ruler,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ToolDef {
  id: ToolType
  label: string
  shortcut: string
  icon: LucideIcon
  group: 'navigation' | 'draw' | 'text' | 'measure'
}

const TOOLS: ToolDef[] = [
  // Navigation
  { id: 'select', label: 'Auswahl', shortcut: 'V', icon: MousePointer2, group: 'navigation' },
  { id: 'direct-select', label: 'Direktauswahl', shortcut: 'A', icon: Diamond, group: 'navigation' },
  { id: 'hand', label: 'Hand', shortcut: 'H', icon: Hand, group: 'navigation' },
  // Draw
  { id: 'freehand', label: 'Freihand', shortcut: 'B', icon: Pencil, group: 'draw' },
  { id: 'line', label: 'Linie', shortcut: 'L', icon: Minus, group: 'draw' },
  { id: 'arrow', label: 'Pfeil', shortcut: '⇧L', icon: ArrowUpRight, group: 'draw' },
  { id: 'rect', label: 'Rechteck', shortcut: 'R', icon: Square, group: 'draw' },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: Circle, group: 'draw' },
  { id: 'polygon', label: 'Polygon', shortcut: 'P', icon: Hexagon, group: 'draw' },
  { id: 'path', label: 'Pfad', shortcut: '⇧P', icon: Spline, group: 'draw' },
  // Text
  { id: 'text', label: 'Text', shortcut: 'T', icon: Type, group: 'text' },
  // Measure
  { id: 'dimension', label: 'Bemaßung', shortcut: 'M', icon: Ruler, group: 'measure' },
]

export function Toolbar() {
  const activeTool = useAppStore((s) => s.activeTool)
  const setActiveTool = useAppStore((s) => s.setActiveTool)

  let lastGroup = ''

  return (
    <div
      className="flex flex-col items-center py-2 gap-0.5 w-12 shrink-0"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {TOOLS.map((tool) => {
        const showSeparator = lastGroup !== '' && tool.group !== lastGroup
        lastGroup = tool.group
        const Icon = tool.icon
        const isActive = activeTool === tool.id

        return (
          <div key={tool.id} className="flex flex-col items-center">
            {showSeparator && (
              <div
                className="w-6 my-1"
                style={{ borderTop: '1px solid var(--border)' }}
              />
            )}
            <button
              onClick={() => setActiveTool(tool.id)}
              className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
              style={{
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon size={20} />
              {/* Tooltip */}
              <div
                className="absolute left-full ml-2 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-panel)',
                }}
              >
                {tool.label}{' '}
                <span style={{ color: 'var(--text-muted)' }}>{tool.shortcut}</span>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
