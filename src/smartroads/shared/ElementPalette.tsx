import { useEffect, useState } from 'react'
import {
  ArrowUp,
  FolderOpen,
  Minus,
  ParkingCircle,
  Pencil,
  Route,
  Save,
  Search,
  SeparatorHorizontal,
  Footprints,
  TreePine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MarkingType, MarkingVariant, StraightRoadState, StripType, StripVariant } from '../types'

type TopCategory = 'strips' | 'markings' | 'structural' | 'presets'

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

const STRIP_SUBCATEGORIES: SubcategoryDef[] = [
  { id: 'lane', label: 'Fahrstreifen' },
  { id: 'cyclepath', label: 'Radweg' },
  { id: 'sidewalk', label: 'Gehweg' },
  { id: 'parking', label: 'Parken' },
  { id: 'path', label: 'Wege' },
]

const STRUCTURAL_SUBCATEGORIES: SubcategoryDef[] = [
  { id: 'edge', label: 'Rand' },
  { id: 'separator', label: 'Trennung' },
]

const MARKING_SUBCATEGORIES: SubcategoryDef[] = [
  { id: 'centerline', label: 'Leitlinie' },
  { id: 'laneboundary', label: 'Begrenzung' },
  { id: 'crosswalk', label: 'Zebrastreifen' },
  { id: 'stopline', label: 'Haltelinie' },
  { id: 'arrow', label: 'Richtungspfeil' },
  { id: 'blocked-area', label: 'Sperrfläche' },
]

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
  ],
  parking: [
    { variant: 'parallel', label: 'Längs', sublabel: 'Parkstreifen' },
    { variant: 'angled', label: 'Schräg', sublabel: 'Parkstreifen' },
    { variant: 'perpendicular', label: 'Quer', sublabel: 'Parkstreifen' },
  ],
  path: [
    { variant: 'dirt', label: 'Erdweg', sublabel: 'Weg' },
    { variant: 'gravel', label: 'Schotterweg', sublabel: 'Weg' },
    { variant: 'forest', label: 'Waldweg', sublabel: 'Weg' },
  ],
}

const STRUCTURAL_ELEMENTS: Array<{
  id: string
  category: string
  type: StripType
  variant: StripVariant
  label: string
  sublabel?: string
  icon: LucideIcon
}> = [
  {
    id: 'structural-curb',
    category: 'edge',
    type: 'curb',
    variant: 'standard',
    label: 'Bordstein',
    sublabel: 'Rand',
    icon: SeparatorHorizontal,
  },
  {
    id: 'structural-gutter',
    category: 'edge',
    type: 'gutter',
    variant: 'standard',
    label: 'Rinne',
    sublabel: 'Rand',
    icon: SeparatorHorizontal,
  },
  {
    id: 'structural-barrier',
    category: 'separator',
    type: 'median',
    variant: 'barrier',
    label: 'Leitplanke',
    sublabel: 'Trennung',
    icon: Minus,
  },
  {
    id: 'structural-green-strip',
    category: 'separator',
    type: 'green',
    variant: 'standard',
    label: 'Grünstreifen',
    sublabel: 'Trennung',
    icon: TreePine,
  },
  {
    id: 'structural-green-median',
    category: 'separator',
    type: 'median',
    variant: 'green-median',
    label: 'Begrünter Mittelstreifen',
    sublabel: 'Trennung',
    icon: TreePine,
  },
]

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

const STRIP_ICONS: Record<string, LucideIcon> = {
  lane: ArrowUp,
  cyclepath: Route,
  sidewalk: Route,
  parking: ParkingCircle,
  path: Footprints,
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

  const topCategories: { id: TopCategory; label: string }[] = [
    { id: 'strips', label: 'Streifen' },
    { id: 'markings', label: 'Markierungen' },
    { id: 'structural', label: 'Bauliches' },
    { id: 'presets', label: 'Presets' },
  ]

  const subcategories =
    activeCategory === 'strips'
      ? STRIP_SUBCATEGORIES
      : activeCategory === 'markings'
        ? MARKING_SUBCATEGORIES
        : activeCategory === 'structural'
          ? STRUCTURAL_SUBCATEGORIES
          : []

  const elements: ElementDef[] = (() => {
    const buildStrips = (types: string[]) =>
      types.flatMap((type) => {
        const items = STRIP_ELEMENTS[type] || []
        const Icon = STRIP_ICONS[type] || Minus
        return items.map((item) => ({
          id: `strip-${type}-${item.variant}`,
          label: item.label,
          sublabel: item.sublabel,
          icon: Icon,
          action: () => onAddStrip(type as StripType, item.variant, 'right'),
        }))
      })

    const buildMarkings = (types: string[]) =>
      types.flatMap((type) => {
        const items = MARKING_ELEMENTS[type] || []
        return items.map((item) => ({
          id: `marking-${type}-${item.variant}`,
          label: item.label,
          sublabel: item.sublabel,
          icon: Pencil,
          action: () => onAddMarking(type as MarkingType, item.variant),
        }))
      })

    const buildStructural = (categories?: string[]) =>
      STRUCTURAL_ELEMENTS
        .filter((item) => !categories || categories.includes(item.category))
        .map((item) => ({
          id: item.id,
          label: item.label,
          sublabel: item.sublabel,
          icon: item.icon,
          action: () => onAddStrip(item.type, item.variant, 'right'),
        }))

    if (isSearchMode) {
      const query = searchQuery.toLowerCase()
      return [
        ...buildStrips(Object.keys(STRIP_ELEMENTS)),
        ...buildStructural(),
        ...buildMarkings(Object.keys(MARKING_ELEMENTS)),
      ].filter(
        (element) =>
          element.label.toLowerCase().includes(query) ||
          element.sublabel?.toLowerCase().includes(query),
      )
    }

    if (activeCategory === 'strips') {
      return buildStrips(activeSubcategory ? [activeSubcategory] : Object.keys(STRIP_ELEMENTS))
    }
    if (activeCategory === 'markings') {
      return buildMarkings(activeSubcategory ? [activeSubcategory] : Object.keys(MARKING_ELEMENTS))
    }
    if (activeCategory === 'structural') {
      return buildStructural(activeSubcategory ? [activeSubcategory] : undefined)
    }
    return []
  })()

  return (
    <div className="flex flex-col h-full" style={{ padding: 14 }}>
      <div className="shrink-0" style={{ marginBottom: 14 }}>
        <div className="relative">
          <Search
            size={14}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: 14, color: 'var(--text-muted)' }}
          />
          <input
            placeholder="Element suchen …"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
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

      <div
        className="flex flex-wrap shrink-0"
        style={{ gap: 'var(--chip-gap-x)', rowGap: 'var(--chip-gap-y)', marginBottom: 10 }}
      >
        {topCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id)
              setActiveSubcategory(null)
            }}
            data-active={activeCategory === category.id}
            className="category-chip flex items-center rounded-full font-semibold"
            style={{
              height: 'var(--chip-height-primary)',
              padding: '0 12px',
              fontSize: 11,
              ...(isSearchMode ? { opacity: 0.5 } : {}),
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      {!isSearchMode && subcategories.length > 0 && (
        <div
          className="flex flex-wrap shrink-0"
          style={{ gap: 'var(--chip-gap-x)', rowGap: 'var(--chip-gap-y)', marginBottom: 14 }}
        >
          <button
            onClick={() => setActiveSubcategory(null)}
            data-active={activeSubcategory === null}
            className="subcategory-chip flex items-center rounded-full font-semibold"
            style={{ height: 'var(--chip-height-secondary)', padding: '0 10px', fontSize: 10.5 }}
          >
            Alle
          </button>
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setActiveSubcategory(subcategory.id)}
              data-active={activeSubcategory === subcategory.id}
              className="subcategory-chip flex items-center rounded-full font-semibold"
              style={{ height: 'var(--chip-height-secondary)', padding: '0 10px', fontSize: 10.5 }}
            >
              {subcategory.label}
            </button>
          ))}
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto min-h-0"
        style={{ marginTop: isSearchMode || subcategories.length === 0 ? 14 : 0 }}
      >
        {!isSearchMode && activeCategory === 'presets' ? (
          <div className="flex flex-col" style={{ gap: 10 }}>
            <div className="grid grid-cols-2" style={{ gap: 8 }}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className="surface-btn flex items-center justify-center text-[12px] font-semibold text-center"
                  style={{ height: 36, borderRadius: 14 }}
                  onClick={() => onLoadPreset(preset.create())}
                >
                  {preset.label}
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
          <div className="flex flex-col" style={{ gap: 8 }}>
            {elements.map((element) => {
              const Icon = element.icon
              return (
                <button
                  key={element.id}
                  className="asset-card flex items-center w-full text-left"
                  style={{
                    minHeight: 60,
                    padding: '10px 12px',
                    borderRadius: 16,
                    gap: 10,
                  }}
                  onClick={element.action}
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
                      {element.label}
                    </div>
                    {element.sublabel && (
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {element.sublabel}
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
