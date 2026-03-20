import { useState } from 'react'
import { useAppStore } from '@/store'
import {
  LIBRARY_CATEGORIES,
  LIBRARY_SUBCATEGORIES,
  LIBRARY_ITEMS,
  searchLibrary,
  getSubcategoryLabel,
} from '@/constants/library'
import { Search, ChevronRight } from 'lucide-react'
import { createDefaultStraightRoad, totalWidth } from '@/smartroads/constants'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, pixelsToMeters } from '@/utils/scale'
import type { CanvasObject } from '@/types'

export function LibraryPanel() {
  const [activeCategory, setActiveCategory] = useState('smartroads')
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const isSearchMode = searchQuery.trim().length > 0

  const handleItemClick = (itemId: string) => {
    if (itemId === 'sr_gerade') {
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

  // Filter logic
  const filteredItems = isSearchMode
    ? searchLibrary(LIBRARY_ITEMS, searchQuery.trim())
    : LIBRARY_ITEMS.filter(item => {
        if (item.category !== activeCategory) return false
        if (activeSubcategory && item.subcategory !== activeSubcategory) return false
        return true
      })

  const subcategories = LIBRARY_SUBCATEGORIES[activeCategory] || []

  return (
    <div
      className="glass flex flex-col flex-1 min-h-0"
      style={{ borderRadius: 24 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ paddingTop: 16, paddingBottom: 'var(--library-gap-md)' }}
      >
        <span className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text)' }}>
          Objekt-Bibliothek
        </span>
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            height: 22,
            padding: '0 8px',
            fontSize: 10,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-muted)',
          }}
        >
          {filteredItems.length} Objekte
        </span>
      </div>

      {/* Search */}
      <div
        className="px-4 shrink-0"
        style={{ paddingBottom: 'var(--library-gap-lg)' }}
      >
        <div className="relative">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2" style={{ left: 14, color: 'var(--text-muted)' }} />
          <input
            placeholder="Objekt suchen …"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input w-full"
            style={{ paddingLeft: 36, borderRadius: 14, height: 40, fontSize: 12 }}
          />
        </div>
      </div>

      {/* Primary category chips */}
      <div
        className="px-4 flex flex-wrap shrink-0"
        style={{
          gap: 'var(--chip-gap-x)',
          rowGap: 'var(--chip-gap-y)',
          paddingBottom: 'var(--library-gap-sm)',
        }}
      >
        {LIBRARY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setActiveSubcategory(null)
                setSearchQuery('')
              }}
              data-active={isActive}
              className="category-chip flex items-center rounded-full font-semibold"
              style={{
                height: 'var(--chip-height-primary)',
                padding: '0 12px',
                fontSize: 11,
                ...(isSearchMode ? { opacity: 0.5 } : {}),
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Secondary subcategory chips (only in browse mode) */}
      {!isSearchMode && subcategories.length > 0 && (
        <div
          className="px-4 flex flex-wrap shrink-0"
          style={{
            gap: 'var(--chip-gap-x)',
            rowGap: 'var(--chip-gap-y)',
            paddingBottom: 'var(--library-gap-lg)',
          }}
        >
          <button
            onClick={() => setActiveSubcategory(null)}
            data-active={activeSubcategory === null}
            className="subcategory-chip flex items-center rounded-full font-semibold"
            style={{ height: 'var(--chip-height-secondary)', padding: '0 10px', fontSize: 10.5 }}
          >
            Alle
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubcategory(sub.id)}
              data-active={activeSubcategory === sub.id}
              className="subcategory-chip flex items-center rounded-full font-semibold"
              style={{ height: 'var(--chip-height-secondary)', padding: '0 10px', fontSize: 10.5 }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col" style={{ gap: 10 }}>
          {filteredItems.map((item) => {
            const itemCategory = LIBRARY_CATEGORIES.find(c => c.id === item.category)
            const Icon = itemCategory?.icon
            return (
              <button
                key={item.id}
                className="asset-card flex items-center gap-3 transition-all"
                style={{
                  minHeight: 'var(--library-card-height)',
                  padding: 12,
                  borderRadius: 20,
                }}
                onDoubleClick={() => handleItemClick(item.id)}
              >
                <div
                  className="asset-icon-tile flex items-center justify-center shrink-0"
                  style={{ color: 'var(--accent)' }}
                >
                  {Icon && <Icon size={18} />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>
                    {item.name}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {isSearchMode
                      ? `${itemCategory?.label || item.category} · ${getSubcategoryLabel(item.subcategory)}`
                      : getSubcategoryLabel(item.subcategory)
                    }
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', opacity: 0.35 }} />
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
