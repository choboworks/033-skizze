import { useAppStore } from '@/store'
import {
  LIBRARY_CATEGORIES,
  LIBRARY_SUBCATEGORIES,
  LIBRARY_ITEMS,
  getSubcategoryLabel,
} from '@/constants/library'
import { useState } from 'react'
import { X } from 'lucide-react'
import { createDefaultStraightRoad, totalWidth } from '@/smartroads/constants'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, pixelsToMeters } from '@/utils/scale'
import type { CanvasObject } from '@/types'

// --- Inline SVG icons for library items ---
function StraightRoadIcon() {
  return (
    <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
      <rect x="2" y="2" width="8" height="32" rx="1" fill="#c8c0b0" />
      <rect x="38" y="2" width="8" height="32" rx="1" fill="#c8c0b0" />
      <rect x="10" y="2" width="1.5" height="32" fill="#999" />
      <rect x="36.5" y="2" width="1.5" height="32" fill="#999" />
      <rect x="11.5" y="2" width="12.5" height="32" fill="#3a3a3a" />
      <rect x="24" y="2" width="12.5" height="32" fill="#3a3a3a" />
      <line x1="24" y1="4" x2="24" y2="10" stroke="#fff" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="24" y1="14" x2="24" y2="20" stroke="#fff" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="24" y1="24" x2="24" y2="30" stroke="#fff" strokeWidth="0.8" strokeDasharray="3 3" />
    </svg>
  )
}

function LibraryItemIcon({ itemId, category }: { itemId: string; category: string }) {
  if (category === 'smartroads') {
    if (itemId === 'sr_gerade') return <StraightRoadIcon />
  }
  return <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>SVG</span>
}

export function LibrarySidebar() {
  const activeCategory = useAppStore((s) => s.activeLibraryCategory)
  const setLibraryCategory = useAppStore((s) => s.setLibraryCategory)
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)

  const handleItemClick = (itemId: string) => {
    if (itemId === 'sr_gerade') {
      const state = createDefaultStraightRoad()
      const editorState = JSON.stringify(state)
      const realWidth = totalWidth(state.strips)
      const realHeight = state.length

      const newObj: CanvasObject = {
        id: crypto.randomUUID(),
        type: 'smartroad',
        subtype: 'straight',
        category: 'smartroads',
        layerId: '',
        label: 'Straße',
        x: 0, y: 0,
        xMeters: 0, yMeters: 0,
        width: realWidth,
        height: realHeight,
        rotation: 0,
        strokeColor: 'transparent',
        strokeWidth: 0,
        fillColor: 'transparent',
        opacity: 1,
        visible: true,
        locked: false,
        editorState,
        realWidth,
        realHeight,
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
      store.setLibraryCategory(null)
    }
  }

  if (!activeCategory) return null

  const category = LIBRARY_CATEGORIES.find((c) => c.id === activeCategory)
  if (!category) return null

  const CategoryIcon = category.icon
  const subcategories = LIBRARY_SUBCATEGORIES[activeCategory] || []

  const filteredItems = LIBRARY_ITEMS.filter(item => {
    if (item.category !== activeCategory) return false
    if (activeSubcategory && item.subcategory !== activeSubcategory) return false
    return true
  })

  return (
    <div
      className="flex flex-col absolute z-40 anim-slide-left glass"
      style={{
        width: 320,
        left: 'calc(var(--toolbar-width) + var(--gap))',
        top: 0,
        bottom: 0,
        borderRadius: 'var(--radius-xl)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: 48,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <CategoryIcon size={16} style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
            {category.label}
          </span>
        </div>
        <button
          className="icon-btn"
          style={{ padding: 5 }}
          onClick={() => setLibraryCategory(null)}
          title="Schließen"
        >
          <X size={14} />
        </button>
      </div>

      {/* Subcategory chips */}
      {subcategories.length > 0 && (
        <div
          className="px-4 py-3 flex flex-wrap gap-1.5 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setActiveSubcategory(null)}
            data-active={activeSubcategory === null}
            className="category-chip px-2.5 py-1.5 rounded-full text-[11px] font-medium"
          >
            Alle
          </button>
          {subcategories.map((sub) => {
            const isActive = activeSubcategory === sub.id
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                data-active={isActive}
                className="category-chip px-2.5 py-1.5 rounded-full text-[11px] font-medium"
              >
                {sub.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid of items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              draggable={item.isSmartRoad}
              className="asset-card flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer"
              onDoubleClick={() => handleItemClick(item.id)}
              onDragStart={(e) => {
                if (item.isSmartRoad) {
                  e.dataTransfer.setData('application/smartroad', item.name)
                  e.dataTransfer.effectAllowed = 'copy'
                }
              }}
            >
              {/* Thumbnail */}
              <div
                className="w-full aspect-4/3 rounded-md flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}
              >
                <LibraryItemIcon itemId={item.id} category={activeCategory} />
              </div>
              {/* Label */}
              <div className="w-full text-center">
                <span
                  className="text-[11px] leading-tight truncate block"
                  style={{ color: 'var(--text)' }}
                >
                  {item.name}
                </span>
                <span
                  className="text-[9px] truncate block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {getSubcategoryLabel(item.subcategory)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Keine Elemente
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
