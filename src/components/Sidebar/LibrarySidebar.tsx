import { useAppStore } from '@/store'
import { LIBRARY_CATEGORIES } from '@/constants/library'
import { useState } from 'react'
import { X } from 'lucide-react'

const SUB_CATEGORIES: Record<string, string[]> = {
  smartroads: ['Alle', 'Geraden', 'Kurven', 'Kreuzungen', 'Kreisverkehr'],
  vehicles: ['Alle', 'PKW', 'LKW', 'Zweirad', 'Bus', 'Sonder'],
  infrastructure: ['Alle', 'Gebäude', 'Absperrung', 'Brücken'],
  'traffic-regulation': ['Alle', 'Ampeln', 'Schilder', 'Zusatzzeichen'],
  environment: ['Alle', 'Bäume', 'Zäune', 'Möblierung'],
  markings: ['Alle', 'Spuren', 'Felder', 'Symbole'],
}

const LIBRARY_ITEMS: Record<string, { name: string; sub: string }[]> = {
  smartroads: [
    { name: 'Gerade Straße', sub: 'Geraden' },
    { name: 'Kurve Straße', sub: 'Kurven' },
    { name: 'T-Kreuzung', sub: 'Kreuzungen' },
    { name: 'Kreuzung 4-Arm', sub: 'Kreuzungen' },
    { name: 'Kreisverkehr', sub: 'Kreisverkehr' },
  ],
  vehicles: [
    { name: 'PKW Limousine', sub: 'PKW' },
    { name: 'PKW Kombi', sub: 'PKW' },
    { name: 'PKW SUV', sub: 'PKW' },
    { name: 'Kleinwagen', sub: 'PKW' },
    { name: 'LKW Solo', sub: 'LKW' },
    { name: 'Sattelzug', sub: 'LKW' },
    { name: 'Kleintransporter', sub: 'LKW' },
    { name: 'Motorrad', sub: 'Zweirad' },
    { name: 'Fahrrad', sub: 'Zweirad' },
    { name: 'E-Scooter', sub: 'Zweirad' },
    { name: 'Linienbus', sub: 'Bus' },
    { name: 'Streifenwagen', sub: 'Sonder' },
    { name: 'RTW', sub: 'Sonder' },
  ],
  infrastructure: [
    { name: 'Gebäude', sub: 'Gebäude' },
    { name: 'Bordstein', sub: 'Absperrung' },
    { name: 'Leitplanke', sub: 'Absperrung' },
    { name: 'Poller', sub: 'Absperrung' },
    { name: 'Absperrung', sub: 'Absperrung' },
    { name: 'Brücke', sub: 'Brücken' },
    { name: 'Bake', sub: 'Absperrung' },
  ],
  'traffic-regulation': [
    { name: 'Ampel', sub: 'Ampeln' },
    { name: 'Stoppschild', sub: 'Schilder' },
    { name: 'Vorfahrt gewähren', sub: 'Schilder' },
    { name: 'Tempo 30', sub: 'Schilder' },
    { name: 'Tempo 50', sub: 'Schilder' },
    { name: 'Einbahnstraße', sub: 'Schilder' },
    { name: 'Fußgängerüberweg', sub: 'Zusatzzeichen' },
  ],
  environment: [
    { name: 'Laubbaum', sub: 'Bäume' },
    { name: 'Nadelbaum', sub: 'Bäume' },
    { name: 'Hecke', sub: 'Zäune' },
    { name: 'Zaun', sub: 'Zäune' },
    { name: 'Mauer', sub: 'Zäune' },
    { name: 'Laterne', sub: 'Möblierung' },
    { name: 'Mast', sub: 'Möblierung' },
    { name: 'Bushaltestelle', sub: 'Möblierung' },
  ],
  markings: [
    { name: 'Bremsspur', sub: 'Spuren' },
    { name: 'Splitterfeld', sub: 'Felder' },
    { name: 'Ölspur', sub: 'Spuren' },
    { name: 'Kollisionspunkt', sub: 'Symbole' },
    { name: 'Endlage', sub: 'Symbole' },
    { name: 'N-Pfeil', sub: 'Symbole' },
    { name: 'Foto-Marker', sub: 'Symbole' },
  ],
}

export function LibrarySidebar() {
  const activeCategory = useAppStore((s) => s.activeLibraryCategory)
  const setLibraryCategory = useAppStore((s) => s.setLibraryCategory)
  const [activeFilter, setActiveFilter] = useState('Alle')

  if (!activeCategory) return null

  const category = LIBRARY_CATEGORIES.find((c) => c.id === activeCategory)
  if (!category) return null

  const CategoryIcon = category.icon
  const chips = SUB_CATEGORIES[activeCategory] || ['Alle']
  const allItems = LIBRARY_ITEMS[activeCategory] || []
  const filteredItems = activeFilter === 'Alle'
    ? allItems
    : allItems.filter((item) => item.sub === activeFilter)

  return (
    <div
      className="flex flex-col absolute z-40"
      style={{
        width: 320,
        left: 'var(--toolbar-width)',
        top: 'var(--topbar-height)',
        bottom: 'var(--statusbar-height)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: 'var(--topbar-height)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <CategoryIcon size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {category.label}
          </span>
        </div>
        <button
          className="icon-btn"
          style={{ padding: 5 }}
          onClick={() => setLibraryCategory(null)}
          title="Schließen"
        >
          <X size={15} />
        </button>
      </div>

      {/* Filter chips */}
      <div
        className="px-4 py-3 flex flex-wrap gap-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {chips.map((chip) => {
          const isActive = activeFilter === chip
          return (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: isActive ? 'var(--accent)' : 'var(--bg)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isActive ? 'var(--accent)' : 'var(--bg)'
              }}
            >
              {chip}
            </button>
          )
        })}
      </div>

      {/* Grid of items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <button
              key={item.name}
              className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-grab"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'var(--accent-muted)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--bg)'
              }}
            >
              {/* Thumbnail */}
              <div
                className="w-full aspect-4/3 rounded-md flex items-center justify-center"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>SVG</span>
              </div>
              {/* Label */}
              <span
                className="text-xs text-center leading-tight w-full truncate"
                style={{ color: 'var(--text)' }}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Keine Elemente
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
