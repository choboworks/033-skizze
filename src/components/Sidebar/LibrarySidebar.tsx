import { useAppStore } from '@/store'
import {
  Route,
  Car,
  Building,
  TrafficCone,
  Trees,
  Ruler,
  ChevronRight,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface CategoryDef {
  id: string
  label: string
  icon: LucideIcon
}

const CATEGORIES: CategoryDef[] = [
  { id: 'smartroads', label: 'SmartRoads', icon: Route },
  { id: 'vehicles', label: 'Fahrzeuge', icon: Car },
  { id: 'infrastructure', label: 'Infrastruktur', icon: Building },
  { id: 'traffic-regulation', label: 'Verkehrsregelung', icon: TrafficCone },
  { id: 'environment', label: 'Umgebung', icon: Trees },
  { id: 'markings', label: 'Markierungen', icon: Ruler },
]

export function LibrarySidebar() {
  const libraryExpanded = useAppStore((s) => s.panels.libraryExpanded)
  const setPanels = useAppStore((s) => s.setPanels)

  const toggleExpand = () => setPanels({ libraryExpanded: !libraryExpanded })

  if (!libraryExpanded) {
    // Collapsed: only category icons
    return (
      <div
        className="flex flex-col items-center py-2 gap-1 w-12 shrink-0"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={toggleExpand}
              className="w-9 h-9 flex items-center justify-center rounded transition-colors relative group"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--surface-hover)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
              title={cat.label}
            >
              <Icon size={18} />
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
                {cat.label}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // Expanded: full sidebar
  return (
    <div
      className="flex flex-col w-56 shrink-0"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Bibliothek
        </span>
        <button
          onClick={toggleExpand}
          className="p-0.5 rounded transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'var(--surface-hover)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
        >
          <ChevronRight size={14} className="rotate-180" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent text-xs outline-none flex-1"
            style={{ color: 'var(--text)' }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <div key={cat.id} className="mb-1">
              <button
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors"
                style={{ color: 'var(--text)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--surface-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <Icon size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{cat.label}</span>
                <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Placeholder for Phase 2 */}
      <div
        className="px-3 py-2 text-[11px]"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        Drag & Drop (Phase 2)
      </div>
    </div>
  )
}
