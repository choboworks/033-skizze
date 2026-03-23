import { useState, useEffect } from 'react'
import { ArrowUp, Route, Minus, ParkingCircle, TreePine, SeparatorHorizontal, Car, Pencil, Save, FolderOpen, Search } from 'lucide-react'
// Strip/variant labels available via constants if needed
import type { StripType, StripVariant, MarkingType, MarkingVariant, StraightRoadState } from '../types'
import type { LucideIcon } from 'lucide-react'

// ============================================================
// ElementPalette – Chip-based component palette for road building
// Category → Subcategory → filtered Element Cards
// ============================================================

// --- Data definitions ---

type TopCategory = 'strips' | 'markings' | 'presets'

interface SubcategoryDef {
  id: string
  label: string
}

interface ElementDef {
  id: string
  label: string
  sublabel?: string
  icon: LucideIcon
  action: () => void
}

// Strip subcategories
const STRIP_SUBCATEGORIES: SubcategoryDef[] = [
  { id: 'lane', label: 'Fahrstreifen' },
  { id: 'cyclepath', label: 'Radweg' },
  { id: 'sidewalk', label: 'Gehweg' },
  { id: 'parking', label: 'Parken' },
  { id: 'green', label: 'Grün' },
  { id: 'curb', label: 'Bordstein' },
  { id: 'median', label: 'Mittelstr.' },
  { id: 'bus', label: 'Bus' },
]

// Marking subcategories
const MARKING_SUBCATEGORIES: SubcategoryDef[] = [
  { id: 'centerline', label: 'Leitlinie' },
  { id: 'laneboundary', label: 'Begrenzung' },
  { id: 'crosswalk', label: 'Zebrastreifen' },
  { id: 'stopline', label: 'Haltelinie' },
  { id: 'arrow', label: 'Richtungspfeil' },
  { id: 'blocked-area', label: 'Sperrfläche' },
]

// Strip elements per subcategory
const STRIP_ELEMENTS: Record<string, { variant: StripVariant; label: string; sublabel?: string }[]> = {
  lane: [
    { variant: 'standard', label: 'Standard', sublabel: 'Fahrstreifen' },
    { variant: 'turn-left', label: 'Abbiegespur L', sublabel: 'Fahrstreifen' },
    { variant: 'turn-right', label: 'Abbiegespur R', sublabel: 'Fahrstreifen' },
  ],
  cyclepath: [
    { variant: 'protected', label: 'Baulich getrennt', sublabel: 'Radweg' },
    { variant: 'lane-marked', label: 'Radfahrstreifen', sublabel: 'Radweg' },
    { variant: 'advisory', label: 'Schutzstreifen', sublabel: 'Radweg' },
  ],
  sidewalk: [
    { variant: 'standard', label: 'Standard', sublabel: 'Gehweg' },
    { variant: 'shared-bike', label: 'Gem. Geh-/Radweg', sublabel: 'Gehweg' },
  ],
  parking: [
    { variant: 'parallel', label: 'Längs', sublabel: 'Parkstreifen' },
    { variant: 'angled', label: 'Schräg', sublabel: 'Parkstreifen' },
    { variant: 'perpendicular', label: 'Quer', sublabel: 'Parkstreifen' },
  ],
  green: [{ variant: 'standard', label: 'Standard', sublabel: 'Grünstreifen' }],
  curb: [{ variant: 'standard', label: 'Bordstein' }],
  median: [
    { variant: 'marking-only', label: 'Markierung', sublabel: 'Mittelstreifen' },
    { variant: 'green-median', label: 'Grünstreifen', sublabel: 'Mittelstreifen' },
    { variant: 'barrier', label: 'Leitplanke', sublabel: 'Mittelstreifen' },
  ],
  bus: [{ variant: 'standard', label: 'Busstreifen' }],
}

// Marking elements per subcategory
const MARKING_ELEMENTS: Record<string, { variant: MarkingVariant; label: string; sublabel?: string }[]> = {
  centerline: [
    { variant: 'standard-dash', label: 'Innerorts (3m/6m)', sublabel: 'Leitlinie' },
    { variant: 'rural-dash', label: 'Außerorts (4m/8m)', sublabel: 'Leitlinie' },
    { variant: 'autobahn-dash', label: 'Autobahn (6m/12m)', sublabel: 'Leitlinie' },
    { variant: 'warning-dash', label: 'Warnlinie I (3m/1,5m)', sublabel: 'Leitlinie' },
    { variant: 'rural-warning', label: 'Warnlinie A (4m/2m)', sublabel: 'Leitlinie' },
    { variant: 'autobahn-warning', label: 'Warnlinie AB (6m/3m)', sublabel: 'Leitlinie' },
  ],
  laneboundary: [
    { variant: 'solid', label: 'Durchgezogen', sublabel: 'Begrenzung' },
    { variant: 'double', label: 'Doppelt', sublabel: 'Begrenzung' },
  ],
  crosswalk: [{ variant: 'default', label: 'Standard', sublabel: 'Zebrastreifen' }],
  stopline: [{ variant: 'default', label: 'Standard', sublabel: 'Haltelinie' }],
  arrow: [
    { variant: 'straight', label: '↑ Geradeaus', sublabel: 'Richtungspfeil' },
    { variant: 'left', label: '← Links', sublabel: 'Richtungspfeil' },
    { variant: 'right', label: '→ Rechts', sublabel: 'Richtungspfeil' },
  ],
  'blocked-area': [{ variant: 'default', label: 'Schraffur', sublabel: 'Sperrfläche' }],
}

// Icon mapping per strip type
const STRIP_ICONS: Record<string, LucideIcon> = {
  lane: ArrowUp,
  cyclepath: Route,
  sidewalk: Route,
  parking: ParkingCircle,
  green: TreePine,
  curb: SeparatorHorizontal,
  median: Minus,
  bus: Car,
}

interface Props {
  onAddStrip: (type: StripType, variant: StripVariant, side: 'left' | 'right') => void
  onAddMarking: (type: MarkingType, variant: MarkingVariant) => void
  onLoadPreset: (state: StraightRoadState) => void
  presets: { id: string; label: string; create: () => StraightRoadState }[]
}

export function ElementPalette({ onAddStrip, onAddMarking, onLoadPreset, presets }: Props) {
  const [activeCategory, setActiveCategory] = useState<TopCategory>('strips')
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 150)
    return () => clearTimeout(timer)
  }, [searchInput])

  const isSearchMode = searchQuery.trim().length > 0

  const TOP_CATEGORIES: { id: TopCategory; label: string }[] = [
    { id: 'strips', label: 'Streifen' },
    { id: 'markings', label: 'Markierungen' },
    { id: 'presets', label: 'Presets' },
  ]

  const subcategories = activeCategory === 'strips'
    ? STRIP_SUBCATEGORIES
    : activeCategory === 'markings'
      ? MARKING_SUBCATEGORIES
      : []

  // Build element list based on category + subcategory (or search)
  const elements: ElementDef[] = (() => {
    const buildStrips = (types: string[]) =>
      types.flatMap(type => {
        const items = STRIP_ELEMENTS[type] || []
        const Icon = STRIP_ICONS[type] || Minus
        return items.map(item => ({
          id: `strip-${type}-${item.variant}`,
          label: item.label,
          sublabel: item.sublabel,
          icon: Icon,
          action: () => onAddStrip(type as StripType, item.variant, 'right'),
        }))
      })

    const buildMarkings = (types: string[]) =>
      types.flatMap(type => {
        const items = MARKING_ELEMENTS[type] || []
        return items.map(item => ({
          id: `marking-${type}-${item.variant}`,
          label: item.label,
          sublabel: item.sublabel,
          icon: Pencil,
          action: () => onAddMarking(type as MarkingType, item.variant),
        }))
      })

    if (isSearchMode) {
      const q = searchQuery.toLowerCase()
      return [
        ...buildStrips(Object.keys(STRIP_ELEMENTS)),
        ...buildMarkings(Object.keys(MARKING_ELEMENTS)),
      ].filter(el => el.label.toLowerCase().includes(q) || el.sublabel?.toLowerCase().includes(q))
    }

    if (activeCategory === 'strips') {
      return buildStrips(activeSubcategory ? [activeSubcategory] : Object.keys(STRIP_ELEMENTS))
    }
    if (activeCategory === 'markings') {
      return buildMarkings(activeSubcategory ? [activeSubcategory] : Object.keys(MARKING_ELEMENTS))
    }
    return []
  })()

  return (
    <div className="flex flex-col h-full" style={{ padding: 14 }}>
      {/* Searchbar */}
      <div className="shrink-0" style={{ marginBottom: 14 }}>
        <div className="relative">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2" style={{ left: 14, color: 'var(--text-muted)' }} />
          <input
            placeholder="Element suchen …"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="field-input w-full"
            style={{
              paddingLeft: 36,
              paddingRight: 12,
              borderRadius: 14,
              height: 40,
              fontSize: 12,
              background: 'var(--panel-control-bg)',
              border: '1px solid var(--panel-control-border)',
            }}
          />
        </div>
      </div>

      {/* Top category chips */}
      <div className="flex flex-wrap shrink-0" style={{ gap: 'var(--chip-gap-x)', rowGap: 'var(--chip-gap-y)', marginBottom: 10 }}>
        {TOP_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setActiveSubcategory(null) }}
            data-active={activeCategory === cat.id}
            className="category-chip flex items-center rounded-full font-semibold"
            style={{ height: 'var(--chip-height-primary)', padding: '0 12px', fontSize: 11, ...(isSearchMode ? { opacity: 0.5 } : {}) }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Subcategory chips */}
      {!isSearchMode && subcategories.length > 0 && (
        <div className="flex flex-wrap shrink-0" style={{ gap: 'var(--chip-gap-x)', rowGap: 'var(--chip-gap-y)', marginBottom: 14 }}>
          <button
            onClick={() => setActiveSubcategory(null)}
            data-active={activeSubcategory === null}
            className="subcategory-chip flex items-center rounded-full font-semibold"
            style={{ height: 'var(--chip-height-secondary)', padding: '0 10px', fontSize: 10.5 }}
          >
            Alle
          </button>
          {subcategories.map(sub => (
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

      {/* Element cards or Presets */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ marginTop: isSearchMode || subcategories.length === 0 ? 14 : 0 }}>
        {!isSearchMode && activeCategory === 'presets' ? (
          /* Preset grid */
          <div className="flex flex-col" style={{ gap: 10 }}>
            <div className="grid grid-cols-2" style={{ gap: 8 }}>
              {presets.map(p => (
                <button
                  key={p.id}
                  className="surface-btn flex items-center justify-center text-[12px] font-semibold text-center"
                  style={{ height: 36, borderRadius: 14 }}
                  onClick={() => onLoadPreset(p.create())}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="h-px" style={{ background: 'var(--panel-section-border)' }} />
            <div className="flex" style={{ gap: 8 }}>
              <button
                className="surface-btn flex-1 flex items-center justify-center gap-2 text-[12px] font-semibold"
                style={{ height: 36, borderRadius: 14 }}
                title="Aktuellen Querschnitt als Preset speichern"
              >
                <Save size={14} />
                Speichern
              </button>
              <button
                className="surface-btn flex-1 flex items-center justify-center gap-2 text-[12px] font-semibold"
                style={{ height: 36, borderRadius: 14 }}
                title="Gespeichertes Preset laden"
              >
                <FolderOpen size={14} />
                Laden
              </button>
            </div>
          </div>
        ) : (
          /* Element cards */
          <div className="flex flex-col" style={{ gap: 8 }}>
            {elements.map(el => {
              const Icon = el.icon
              return (
                <button
                  key={el.id}
                  className="asset-card flex items-center w-full text-left"
                  style={{
                    minHeight: 60,
                    padding: '10px 12px',
                    borderRadius: 16,
                    gap: 10,
                  }}
                  onClick={el.action}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'var(--panel-control-bg)',
                      border: '1px solid var(--panel-control-border)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate" style={{ color: 'var(--text)', fontWeight: 500 }}>
                      {el.label}
                    </div>
                    {el.sublabel && (
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {el.sublabel}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
            {elements.length === 0 && (
              <div className="py-6 text-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
                Keine Elemente
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
