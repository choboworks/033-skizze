import { useState } from 'react'
import { useAppStore } from '@/store'
import { LIBRARY_CATEGORIES } from '@/constants/library'
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { createDefaultStraightRoad, totalWidth } from '@/smartroads/constants'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, pixelsToMeters } from '@/utils/scale'
import type { CanvasObject } from '@/types'

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
    { name: 'PKW Limousine', sub: 'PKW' }, { name: 'PKW Kombi', sub: 'PKW' },
    { name: 'PKW SUV', sub: 'PKW' }, { name: 'Kleinwagen', sub: 'PKW' },
    { name: 'LKW Solo', sub: 'LKW' }, { name: 'Sattelzug', sub: 'LKW' },
    { name: 'Kleintransporter', sub: 'LKW' }, { name: 'Motorrad', sub: 'Zweirad' },
    { name: 'Fahrrad', sub: 'Zweirad' }, { name: 'E-Scooter', sub: 'Zweirad' },
    { name: 'Linienbus', sub: 'Bus' }, { name: 'Streifenwagen', sub: 'Sonder' },
    { name: 'RTW', sub: 'Sonder' },
  ],
  infrastructure: [
    { name: 'Gebäude', sub: 'Gebäude' }, { name: 'Bordstein', sub: 'Absperrung' },
    { name: 'Leitplanke', sub: 'Absperrung' }, { name: 'Poller', sub: 'Absperrung' },
    { name: 'Absperrung', sub: 'Absperrung' }, { name: 'Brücke', sub: 'Brücken' },
    { name: 'Bake', sub: 'Absperrung' },
  ],
  'traffic-regulation': [
    { name: 'Ampel', sub: 'Ampeln' }, { name: 'Stoppschild', sub: 'Schilder' },
    { name: 'Vorfahrt gewähren', sub: 'Schilder' }, { name: 'Tempo 30', sub: 'Schilder' },
    { name: 'Tempo 50', sub: 'Schilder' }, { name: 'Einbahnstraße', sub: 'Schilder' },
    { name: 'Fußgängerüberweg', sub: 'Zusatzzeichen' },
  ],
  environment: [
    { name: 'Laubbaum', sub: 'Bäume' }, { name: 'Nadelbaum', sub: 'Bäume' },
    { name: 'Hecke', sub: 'Zäune' }, { name: 'Zaun', sub: 'Zäune' },
    { name: 'Mauer', sub: 'Zäune' }, { name: 'Laterne', sub: 'Möblierung' },
    { name: 'Mast', sub: 'Möblierung' }, { name: 'Bushaltestelle', sub: 'Möblierung' },
  ],
  markings: [
    { name: 'Bremsspur', sub: 'Spuren' }, { name: 'Splitterfeld', sub: 'Felder' },
    { name: 'Ölspur', sub: 'Spuren' }, { name: 'Kollisionspunkt', sub: 'Symbole' },
    { name: 'Endlage', sub: 'Symbole' }, { name: 'N-Pfeil', sub: 'Symbole' },
    { name: 'Foto-Marker', sub: 'Symbole' },
  ],
}

export function LibraryPanel() {
  const [activeCategory, setActiveCategory] = useState('smartroads')
  const [activeFilter, setActiveFilter] = useState('Alle')
  const [searchQuery, setSearchQuery] = useState('')

  const handleItemClick = (itemName: string) => {
    if (itemName === 'Gerade Straße') {
      const state = createDefaultStraightRoad()
      const editorState = JSON.stringify(state)
      const realWidth = totalWidth(state.strips)
      const realHeight = state.length
      const newObj: CanvasObject = {
        id: crypto.randomUUID(), type: 'smartroad', subtype: 'straight',
        category: 'smartroads', layerId: '', label: 'Straße',
        x: 0, y: 0, xMeters: 0, yMeters: 0,
        width: realWidth, height: realHeight, rotation: 0,
        strokeColor: 'transparent', strokeWidth: 0, fillColor: 'transparent',
        opacity: 1, visible: true, locked: false,
        editorState, realWidth, realHeight,
      }
      const store = useAppStore.getState()
      store.addObject(newObj)
      store.recalculateScale()
      const newScale = useAppStore.getState().scale.currentScale
      const pageWidthM = pixelsToMeters(PAGE_WIDTH_PX, newScale)
      const pageHeightM = pixelsToMeters(PAGE_HEIGHT_PX, newScale)
      store.updateObject(newObj.id, {
        xMeters: (pageWidthM - realWidth) / 2,
        yMeters: (pageHeightM - realHeight) / 2,
      })
      store.select([newObj.id])
    }
  }

  const category = LIBRARY_CATEGORIES.find((c) => c.id === activeCategory)
  const chips = SUB_CATEGORIES[activeCategory] || ['Alle']
  const allItems = LIBRARY_ITEMS[activeCategory] || []
  let filteredItems = activeFilter === 'Alle' ? allItems : allItems.filter((item) => item.sub === activeFilter)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    filteredItems = filteredItems.filter((item) => item.name.toLowerCase().includes(q))
  }

  return (
    <div
      className="glass flex flex-col flex-1 min-h-0"
      style={{ borderRadius: 'var(--radius-lg)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <span className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text)' }}>
          Objekt-Bibliothek
        </span>
        <span className="badge" style={{ fontSize: 10, padding: '3px 8px' }}>
          {LIBRARY_CATEGORIES.length} Kategorien
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 pb-3 shrink-0">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Objekt suchen …"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input w-full"
            style={{ paddingLeft: 32, borderRadius: 'var(--radius-md)' }}
          />
        </div>
        <button
          className="icon-btn shrink-0"
          style={{
            padding: 6,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)',
          }}
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {/* Category badges */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
        {LIBRARY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveFilter('Alle') }}
              className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors"
              style={{
                background: isActive ? 'var(--accent-muted)' : 'var(--surface)',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'var(--accent-muted)' : 'var(--surface)' }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-2">
          {filteredItems.map((item) => {
            const Icon = category?.icon
            return (
              <button
                key={item.name}
                className="flex items-center gap-3 p-3 transition-all"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-raised)',
                  cursor: 'pointer',
                }}
                onDoubleClick={() => handleItemClick(item.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface-raised)'
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center shrink-0"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface)',
                    color: 'var(--accent)',
                  }}
                >
                  {Icon && <Icon size={18} />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>
                    {item.name}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {category?.label} · {item.sub}
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              </button>
            )
          })}
          {filteredItems.length === 0 && (
            <div className="py-6 text-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
              Keine Elemente
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
