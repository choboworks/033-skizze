// src/modules/library/LeftSidebar.tsx
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Search } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import type { Category } from '../../store/appStore'
import { SidebarSection } from '../ui/SidebarSection'
import { SidebarButton } from '../ui/SidebarButton'
import { SidebarHint } from '../ui/SidebarHint'
import {
  libraryAssets,
  type AssetMeta,
  type MainCategoryId,
  type SubcategoryId,
} from './libraryManifest'

/** -------------------- DnD Basis -------------------- */

const DND_ITEM_LIB = 'LIB_ITEM' as const

type LibDragItem = { type: typeof DND_ITEM_LIB; assetId: string }

/** -------------------- Kategorien & Subkategorien -------------------- */

type CatConfig = {
  id: MainCategoryId
  label: string
  iconSrc: string
}

type SubcatConfig = {
  id: SubcategoryId
  label: string
  categoryId: MainCategoryId
}

type Tile = {
  id: string
  svg: string
  label: string
  tags: string[]
  previewSrc?: string
}

/**
 * Mapping zwischen Store-Category (alt) und neuen MainCategoryIds (Manifest).
 */
const MAIN_TO_STORE: Record<MainCategoryId, Category> = {
  strassengenerator: 'generator',  // 🔥 NEU
  infrastruktur: 'road',
  fahrzeuge: 'vehicle',
  verkehrsregelung: 'sign',
  umgebung: 'environment',
  markierungen: 'shape',
}

const STORE_TO_MAIN: Record<Category, MainCategoryId> = {
  generator: 'strassengenerator',  // 🔥 NEU
  road: 'infrastruktur',
  vehicle: 'fahrzeuge',
  sign: 'verkehrsregelung',
  environment: 'umgebung',
  shape: 'markierungen',
}

/** -------------------- UI-Config -------------------- */

const CAT_ICON: Record<MainCategoryId, string> = {
  strassengenerator: '/assets/roads.png',  // 🔥 NEU - gleiches Icon wie Infrastruktur
  infrastruktur: '/assets/roads.png',
  fahrzeuge: '/assets/cars.png',
  verkehrsregelung: '/assets/signs.png',
  umgebung: '/assets/env.png',
  markierungen: '/assets/obj.png',
}

const CATS: CatConfig[] = [
  { id: 'strassengenerator', label: 'Straßengenerator', iconSrc: CAT_ICON.strassengenerator },  // 🔥 NEU - VOR Infrastruktur
  { id: 'infrastruktur', label: 'Infrastruktur', iconSrc: CAT_ICON.infrastruktur },
  { id: 'fahrzeuge', label: 'Fahrzeuge', iconSrc: CAT_ICON.fahrzeuge },
  { id: 'verkehrsregelung', label: 'Verkehrsregelung', iconSrc: CAT_ICON.verkehrsregelung },
  { id: 'umgebung', label: 'Umgebung', iconSrc: CAT_ICON.umgebung },
  { id: 'markierungen', label: 'Markierungen', iconSrc: CAT_ICON.markierungen },
]

const MAIN_LABEL: Record<MainCategoryId, string> = CATS.reduce(
  (acc, c) => {
    acc[c.id] = c.label
    return acc
  },
  {} as Record<MainCategoryId, string>,
)

const SUBCATS: SubcatConfig[] = [
  // Straßengenerator
  { id: 'gen_strasse', label: 'Straßen', categoryId: 'strassengenerator' },
  
  // Infrastruktur - OHNE Straßen (die sind jetzt im Generator)
  { id: 'infra_wege', label: 'Wege', categoryId: 'infrastruktur' },
  { id: 'infra_uebergaenge', label: 'Übergänge', categoryId: 'infrastruktur' },  
  { id: 'infra_begrenzungen', label: 'Begrenzungen', categoryId: 'infrastruktur' },
  { id: 'infra_oepnv_haltepunkte', label: 'ÖPNV & Haltepunkte', categoryId: 'infrastruktur' },
  { id: 'infra_parken_stellflaechen', label: 'Parken & Stellflächen', categoryId: 'infrastruktur' },
  { id: 'infra_sonstige', label: 'Sonstige Infrastruktur', categoryId: 'infrastruktur' },

  // Fahrzeuge (bleibt unverändert)
  { id: 'fz_pkw_kombi', label: 'Pkw & Kombi', categoryId: 'fahrzeuge' },
  { id: 'fz_transporter_vans', label: 'Transporter & Vans', categoryId: 'fahrzeuge' },
  { id: 'fz_lkw_nutzfahrzeuge', label: 'Lkw & Nutzfahrzeuge', categoryId: 'fahrzeuge' },
  { id: 'fz_busse', label: 'Busse', categoryId: 'fahrzeuge' },
  { id: 'fz_zweiraeder', label: 'Zweiräder', categoryId: 'fahrzeuge' },
  { id: 'fz_einsatz_sonder', label: 'Einsatz-/Sonderfahrzeuge', categoryId: 'fahrzeuge' },
  { id: 'fz_sonstige', label: 'Sonstige', categoryId: 'fahrzeuge' },
  { id: 'fz_strassenbahn', label: 'Straßenbahn', categoryId: 'fahrzeuge' },

  // Verkehrsregelung
  { id: 'vr_gefahrzeichen', label: 'Gefahrzeichen', categoryId: 'verkehrsregelung' },
  { id: 'vr_vorschriftzeichen', label: 'Vorschriftzeichen', categoryId: 'verkehrsregelung' },
  { id: 'vr_richtzeichen', label: 'Richtzeichen', categoryId: 'verkehrsregelung' },
  { id: 'vr_zusatzzeichen', label: 'Zusatzzeichen', categoryId: 'verkehrsregelung' },
  { id: 'vr_wegweiser', label: 'Wegweiser', categoryId: 'verkehrsregelung' },
  { id: 'vr_ampeln', label: 'Ampeln', categoryId: 'verkehrsregelung' },
  { id: 'vr_bodenmarkierungen', label: 'Bodenmarkierungen', categoryId: 'verkehrsregelung' },
  { id: 'vr_leiteinrichtungen', label: 'Leiteinrichtungen', categoryId: 'verkehrsregelung' },
  { id: 'vr_baustellenregelung', label: 'Baustellenregelung', categoryId: 'verkehrsregelung' },

  // Umgebung
  { id: 'um_stadtmoebel', label: 'Stadtmöbel', categoryId: 'umgebung' },
  { id: 'um_vegetation', label: 'Vegetation', categoryId: 'umgebung' },
  { id: 'um_mensch_tier', label: 'Mensch & Tier', categoryId: 'umgebung' },
  { id: 'um_gebaeude_bauliches', label: 'Gebäude & Bauliches', categoryId: 'umgebung' },
  { id: 'um_technische_objekte', label: 'Technische Objekte', categoryId: 'umgebung' },
  { id: 'um_muells_container', label: 'Müll & Container', categoryId: 'umgebung' },
  { id: 'um_sonstige', label: 'Sonstige Umgebung', categoryId: 'umgebung' },

  // Markierungen
  { id: 'mark_pfeile', label: 'Pfeile', categoryId: 'markierungen' },
  { id: 'mark_kollisionen', label: 'Kollisionssymbole', categoryId: 'markierungen' },
  { id: 'mark_spuren', label: 'Schlagmarken & Spuren', categoryId: 'markierungen' },
  { id: 'mark_text_info', label: 'Text & Info', categoryId: 'markierungen' },
  { id: 'mark_masse_distanzen', label: 'Maße & Distanzen', categoryId: 'markierungen' },
  { id: 'mark_symbole', label: 'Symbole', categoryId: 'markierungen' },
  { id: 'mark_orientierung', label: 'Orientierung', categoryId: 'markierungen' },
]

const SUBCATS_BY_CATEGORY: Record<MainCategoryId, SubcatConfig[]> = {
  strassengenerator: SUBCATS.filter((s) => s.categoryId === 'strassengenerator'),  // 🔥 NEU
  infrastruktur: SUBCATS.filter((s) => s.categoryId === 'infrastruktur'),
  fahrzeuge: SUBCATS.filter((s) => s.categoryId === 'fahrzeuge'),
  verkehrsregelung: SUBCATS.filter((s) => s.categoryId === 'verkehrsregelung'),
  umgebung: SUBCATS.filter((s) => s.categoryId === 'umgebung'),
  markierungen: SUBCATS.filter((s) => s.categoryId === 'markierungen'),
}

const SUBCAT_LABEL: Record<SubcategoryId, string> = SUBCATS.reduce(
  (acc, s) => {
    acc[s.id] = s.label
    return acc
  },
  {} as Record<SubcategoryId, string>,
)

/** -------------------- Asset-Liste & Hilfsfunktionen -------------------- */

const ALL_ASSETS: AssetMeta[] = Object.values(libraryAssets)

const ASSET_BY_ID = new Map<string, AssetMeta>(
  ALL_ASSETS.map((a) => [a.id, a] as const),
)

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const tileFromAsset = (asset: AssetMeta): Tile => ({
  id: asset.id,
  svg: asset.svg,
  label: asset.label,
  tags: asset.tags,
  previewSrc: asset.previewSrc,
})

const tilesFromIds = (ids: string[]): Tile[] => {
  const res: Tile[] = []
  for (const id of ids) {
    const a = ASSET_BY_ID.get(id)
    if (!a) continue
    res.push(tileFromAsset(a))
  }
  return res
}

/** -------------------- Tile-Buttons (Drag & Drop) -------------------- */

function TileButton({ tile }: { tile: Tile }) {
  const [, dragRef] = useDrag<LibDragItem>(
    () => ({ type: DND_ITEM_LIB, item: { type: DND_ITEM_LIB, assetId: tile.id } }),
    [tile.id],
  )

  const setRef = (n: HTMLButtonElement | null) => {
    dragRef(n)
  }

  const dbl = () => {
    window.dispatchEvent(
      new CustomEvent('app:quick-insert-asset', {
        detail: { assetId: tile.id },
      }),
    )
  }

  return (
    <button
      ref={setRef}
      type="button"
      title={tile.label}
      className="aspect-square rounded-xl shadow-sm flex flex-col overflow-hidden transition
                 border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--panel-elev)]"
      onDoubleClick={dbl}
    >
      <div className="relative flex-1 p-2 flex items-center justify-center overflow-hidden">
        {tile.previewSrc ? (
          <img
            src={tile.previewSrc}
            alt=""
            aria-hidden
            className="max-w-full max-h-full object-contain"
            draggable={false}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: tile.svg }}
          />
        )}
      </div>
      <div className="px-2 py-1 border-t border-[var(--border)] text-[11px] leading-tight truncate text-[var(--text)]">
        {tile.label}
      </div>
    </button>
  )
}

function SuggestionTile({
  tile,
  onInsert,
  onDragStart,
}: {
  tile: Tile
  onInsert: () => void
  onDragStart: () => void
}) {
  const [, dragRef] = useDrag<LibDragItem>(
    () => ({ type: DND_ITEM_LIB, item: { type: DND_ITEM_LIB, assetId: tile.id } }),
    [tile.id],
  )

  const setRef = (n: HTMLButtonElement | null) => {
    dragRef(n)
  }

  const downPosRef = useRef<{ x: number; y: number } | null>(null)
  const closedRef = useRef(false)

  const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    downPosRef.current = { x: e.clientX, y: e.clientY }
    closedRef.current = false

    const onMove = (ev: MouseEvent) => {
      if (!downPosRef.current || closedRef.current) return
      const dx = ev.clientX - downPosRef.current.x
      const dy = ev.clientY - downPosRef.current.y
      if (dx * dx + dy * dy >= 36) {
        closedRef.current = true
        onDragStart()
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
    }

    const onUp = () => {
      downPosRef.current = null
      closedRef.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleDoubleClick = () => {
    window.dispatchEvent(
      new CustomEvent('app:quick-insert-asset', {
        detail: { assetId: tile.id },
      }),
    )
    onInsert()
  }

  return (
    <button
      ref={setRef}
      type="button"
      data-dnd-tile
      title={tile.label}
      className="aspect-square rounded-xl shadow-sm flex flex-col overflow-hidden transition
                 border border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--panel-elev)]"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative flex-1 p-2 flex items-center justify-center overflow-hidden">
        {tile.previewSrc ? (
          <img
            src={tile.previewSrc}
            alt=""
            aria-hidden
            className="max-w-full max-h-full object-contain"
            draggable={false}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: tile.svg }}
          />
        )}
      </div>
      <div className="px-2 py-1 border-t border-[var(--border)] text-[11px] leading-tight truncate text-[var(--text)]">
        {tile.label}
      </div>
    </button>
  )
}

/** -------------------- Chips-Leiste -------------------- */

function CategoryChips({
  category,
  activeSubcat,
  onChange,
}: {
  category: MainCategoryId
  activeSubcat: SubcategoryId | null
  onChange: (sub: SubcategoryId | null) => void
}) {
  const chips = SUBCATS_BY_CATEGORY[category]
  if (!chips.length) return null

  return (
    <div className="px-3 pb-2 flex flex-wrap gap-2">
      <button
        type="button"
        className={`px-3 py-1 rounded-full text-xs border transition
          ${
            activeSubcat === null
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-[var(--panel)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--panel-elev)]'
          }`}
        onClick={() => onChange(null)}
      >
        Alle
      </button>
      {chips.map((chip) => {
        const active = chip.id === activeSubcat
        return (
          <button
            key={chip.id}
            type="button"
            className={`px-3 py-1 rounded-full text-xs border transition
              ${
                active
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-[var(--panel)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--panel-elev)]'
              }`}
            onClick={() => onChange(active ? null : chip.id)}
          >
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}

/** -------------------- Kategorie-Panel (Overlay-Inhalt) -------------------- */

type CategoryPanelProps = {
  category: MainCategoryId
  query: string
  activeSubcat: SubcategoryId | null
}

function CategoryPanel({
  category,
  query,
  activeSubcat,
}: CategoryPanelProps) {

  const normQuery = normalize(query ?? '')

  const tokens = useMemo(
    () => (normQuery ? normQuery.split(/\s+/) : []),
    [normQuery],
  )

  const hasQuery = tokens.length > 0

  const categoryAssets = useMemo(
    () => ALL_ASSETS.filter((a) => a.category === category),
    [category],
  )

  const filteredByChip = useMemo(
    () =>
      activeSubcat
        ? categoryAssets.filter((a) => a.subcategory === activeSubcat)
        : categoryAssets,
    [categoryAssets, activeSubcat],
  )

  const searchFilteredAssets = useMemo(() => {
    if (!hasQuery) return filteredByChip
    return filteredByChip.filter((a) => {
      const hay = normalize(
        [a.id, a.label, ...a.tags, ...(a.searchKeywords ?? [])].join(' '),
      )
      return tokens.every((tok) => hay.includes(tok))
    })
  }, [filteredByChip, hasQuery, tokens])

  const searchTiles = useMemo<Tile[]>(
    () => searchFilteredAssets.map(tileFromAsset),
    [searchFilteredAssets],
  )

  const grouped = useMemo<
    Array<{ subcategory: SubcategoryId; label: string; tiles: Tile[] }>
  >(() => {
    if (hasQuery) return []

    const groups = new Map<SubcategoryId, AssetMeta[]>()
    for (const asset of filteredByChip) {
      const list = groups.get(asset.subcategory)
      if (list) {
        list.push(asset)
      } else {
        groups.set(asset.subcategory, [asset])
      }
    }

    const subcatOrder = SUBCATS_BY_CATEGORY[category].map((s) => s.id)
    const indexOf = (id: SubcategoryId): number => {
      const idx = subcatOrder.indexOf(id)
      return idx === -1 ? Number.MAX_SAFE_INTEGER : idx
    }

    const result = Array.from(groups.entries())
      .map(([subId, assets]) => ({
        subcategory: subId,
        label: SUBCAT_LABEL[subId],
        tiles: assets.map(tileFromAsset),
      }))
      .sort((a, b) => indexOf(a.subcategory) - indexOf(b.subcategory))

    return result
  }, [category, filteredByChip, hasQuery])

  return (
    <div className="px-3 pb-3 space-y-3">
      {hasQuery ? (
        <div>
          <div className="text-[11px] font-medium text-[var(--text-muted)] mb-1">
            Suchergebnisse
          </div>
          {searchTiles.length === 0 ? (
            <div className="text-center text-xs text-[var(--text-muted)] py-4">
              Keine Treffer
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {searchTiles.map((t) => (
                <TileButton key={t.id} tile={t} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.length === 0 ? (
            <div className="text-center text-xs text-[var(--text-muted)] py-4">
              Keine Elemente in dieser Kategorie.
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.subcategory}>
                <div className="text-[11px] font-medium text-[var(--text-muted)] mb-1">
                  {group.label}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {group.tiles.map((t) => (
                    <TileButton key={t.id} tile={t} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

/** -------------------- Globale Suche (ohne aktive Kategorie) -------------------- */

function GlobalSearchGrid({ query }: { query: string }) {
  const normQuery = normalize(query ?? '')

  const tokens = useMemo(
    () => (normQuery ? normQuery.split(/\s+/) : []),
    [normQuery],
  )

  const tiles = useMemo<Tile[]>(() => {
    if (!tokens.length) return []
    const matches = ALL_ASSETS.filter((a) => {
      const hay = normalize(
        [a.id, a.label, ...a.tags, ...(a.searchKeywords ?? [])].join(' '),
      )
      return tokens.every((tok) => hay.includes(tok))
    })
    return matches.map(tileFromAsset)
  }, [tokens])

  if (!tiles.length) {
    return (
      <div className="text-center text-xs text-[var(--text-muted)] py-4">
        Keine Treffer
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((t) => (
        <TileButton key={t.id} tile={t} />
      ))}
    </div>
  )
}

/** -------------------- Overlay / Drawer für Kategorien -------------------- */

type LibraryOverlayProps = {
  open: boolean
  category: MainCategoryId | null
  activeSubcat: SubcategoryId | null
  onSubcatChange: (sub: SubcategoryId | null) => void
  onClose: () => void
  query: string
}

// Drawer mit Glasmorphism + Transition
function LibraryOverlay({
  open,
  category,
  activeSubcat,
  onSubcatChange,
  onClose,
  query,
}: LibraryOverlayProps) {
  return (
    <div
      data-library-overlay
      className={`fixed top-6 bottom-28 right-6 z-40 flex items-start justify-start pointer-events-none
                  transition-all duration-200 ease-out
                  ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
      style={{ left: 'calc(var(--sb-left) + 0.25rem)' }}
    >
      {(category || query) && (
        <div
          className="pointer-events-auto h-full w-[420px] max-w-full rounded-3xl
                     border border-white/25 bg-white/40 backdrop-blur-xl shadow-2xl
                     flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-white/30 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Bibliothek
              </div>
              <div className="text-sm font-semibold text-[var(--text)]">
                {category ? MAIN_LABEL[category] : 'Suchergebnisse'}
              </div>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-full border border-white/40
                         text-[var(--text)] hover:bg-white/20 hover:border-white/60
                         transition-colors"
              onClick={onClose}
            >
              Schließen
            </button>
          </div>

          {/* Chips - nur bei aktiver Kategorie */}
          {category && (
            <div className="px-4 pt-2 pb-1 border-b border-white/15 bg-black/5">
              <CategoryChips
                category={category}
                activeSubcat={activeSubcat}
                onChange={onSubcatChange}
              />
            </div>
          )}

          {/* Inhalte */}
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-black/5">
            {category ? (
              <CategoryPanel
                category={category}
                query={query}
                activeSubcat={activeSubcat}
              />
            ) : (
              <div className="px-3 pb-3">
                <div className="text-[11px] font-medium text-[var(--text-muted)] mb-1">
                  Alle Kategorien
                </div>
                <GlobalSearchGrid query={query} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** -------------------- Haupt-Komponente LeftSidebar -------------------- */

function LeftSidebar() {
  const ui = useAppStore((s) => s.ui)
  const setCat = useAppStore((s) => s.uiSetActiveCategory)
  const setSearch = useAppStore((s) => s.uiSetSearch)

  // Sidebar-Prefs (Recents + optionale Favorites)
  const sidebarPrefs = useAppStore(
    (s) =>
      s.ui.sidebar as unknown as {
        recents: string[]
      },
  )

  const recents = useMemo(
    () => sidebarPrefs.recents ?? [],
    [sidebarPrefs.recents],
  )

  const suggestionTiles = useMemo(
    () => tilesFromIds(recents).slice(0, 6),
    [recents],
  )

  const [searchFocused, setSearchFocused] = useState(false)
  const [hoverPanel, setHoverPanel] = useState(false)
  const [activeSubcat, setActiveSubcat] = useState<SubcategoryId | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Auto-Close beim Quick-Insert (Doppelklick) - mit Smooth Animation
  useEffect(() => {
    const onQuickInsert = () => {
      setCat(null)
      setActiveSubcat(null)
      setSearch('')
    }
    window.addEventListener('app:quick-insert-asset', onQuickInsert)
    return () => window.removeEventListener('app:quick-insert-asset', onQuickInsert)
  }, [setCat, setSearch])

  const activeCat: MainCategoryId | null = useMemo(() => {
    const raw = ui.left.activeCategory as Category | null
    if (!raw) return null
    return STORE_TO_MAIN[raw]
  }, [ui.left.activeCategory])

  const hasQuery = (ui.left.search ?? '').trim().length > 0

  const categoryRecentTiles = useMemo<Tile[]>(() => {
    if (!activeCat) return []
    if (hasQuery) return []
    if (!recents.length) return []

    const categoryAssets = ALL_ASSETS.filter((a) => a.category === activeCat)
    const inCategory = new Set(categoryAssets.map((a) => a.id))

    const filteredIds = recents.filter((id) => inCategory.has(id))
    const tiles = tilesFromIds(filteredIds)
    return tiles.slice(0, 3)
  }, [activeCat, hasQuery, recents])

  const categoryPopularTiles = useMemo<Tile[]>(() => {
    if (!activeCat) return []
    if (hasQuery) return []

    const categoryAssets = ALL_ASSETS.filter((a) => a.category === activeCat)
    const filteredByChip = activeSubcat
      ? categoryAssets.filter((a) => a.subcategory === activeSubcat)
      : categoryAssets

    if (!filteredByChip.length) return []

    const candidates = filteredByChip.slice()
    candidates.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    const top = candidates.slice(0, 6)
    return top.map(tileFromAsset)
  }, [activeCat, hasQuery, activeSubcat])

  const panelOpen =
    (searchFocused || hoverPanel) && !hasQuery && suggestionTiles.length > 0

  const closeRecentsPanel = () => {
    setSearchFocused(false)
    setHoverPanel(false)
    inputRef.current?.blur()
  }

  const handleCategoryClick = (catId: MainCategoryId) => {
    if (activeCat === catId) {
      setCat(null)
      setActiveSubcat(null)
    } else {
      const legacyCat = MAIN_TO_STORE[catId]
      setCat(legacyCat)
      setActiveSubcat(null)
      closeRecentsPanel()
    }
  }

  const overlayOpen = Boolean(activeCat) || hasQuery

  return (
    <div className="h-full min-h-full bg-[var(--panel)] border-r border-[var(--border)] relative">
      <div className="w-full max-w-full overflow-x-hidden space-y-2 text-[var(--text)] px-3 py-3">
        {/* Elemente: Kategorien */}
        <SidebarSection title="Elemente">
          <div className="grid grid-cols-1 gap-2">
            {CATS.map((c) => {
              const isActive = activeCat === c.id
              return (
                <SidebarButton
                  key={c.id}
                  label={c.label}
                  iconSrc={c.iconSrc}
                  active={isActive}
                  onClick={() => handleCategoryClick(c.id)}
                />
              )
            })}
          </div>
        </SidebarSection>

        {/* Suche */}
        <SidebarSection title="Suche">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[var(--text-muted)]" />
            <input
              ref={inputRef}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-[var(--panel)] text-base
                         border-[var(--border)] text-[var(--text)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]
                         transition-colors-quick"
              placeholder="Suchen…"
              value={ui.left.search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                setSearchFocused(true)
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (!hoverPanel) setSearchFocused(false)
                }, 80)
              }}
            />

            {panelOpen && (
              <div
                role="listbox"
                aria-label="Zuletzt benutzt"
                className="mt-2 rounded-xl border bg-[var(--panel)] shadow-sm border-[var(--border)]"
                onMouseEnter={() => setHoverPanel(true)}
                onMouseLeave={() => setHoverPanel(false)}
              >
                <div className="px-3 pt-2 pb-1 text-[12px] font-medium text-[var(--text-muted)]">
                  Zuletzt benutzt
                </div>
                <div className="p-2 grid grid-cols-3 gap-2">
                  {suggestionTiles.map((tile) => (
                    <SuggestionTile
                      key={tile.id}
                      tile={tile}
                      onInsert={closeRecentsPanel}
                      onDragStart={closeRecentsPanel}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </SidebarSection>

        {/* Kontextbezogene Zuletzt verwendet / Beliebt pro Kategorie */}
        {activeCat && !hasQuery && (
          <>
            {categoryRecentTiles.length > 0 && (
              <SidebarSection title="Zuletzt verwendet">
                <div className="grid grid-cols-3 gap-2">
                  {categoryRecentTiles.map((t) => (
                    <TileButton key={t.id} tile={t} />
                  ))}
                </div>
              </SidebarSection>
            )}

            {categoryPopularTiles.length > 0 && (
              <SidebarSection title="Beliebt">
                <div className="grid grid-cols-3 gap-2">
                  {categoryPopularTiles.map((t) => (
                    <TileButton key={t.id} tile={t} />
                  ))}
                </div>
              </SidebarSection>
            )}
          </>
        )}

        {!hasQuery && !activeCat && (
          <div className="px-3">
            <SidebarHint>
              Wähle eine Kategorie oder gib einen Suchbegriff ein.
            </SidebarHint>
          </div>
        )}
      </div>

      {/* Kategorie-Drawer (Overlay) */}
      <LibraryOverlay
        open={overlayOpen}
        category={activeCat}
        activeSubcat={activeSubcat}
        onSubcatChange={setActiveSubcat}
        onClose={() => {
          setCat(null)
          setActiveSubcat(null)
        }}
        query={ui.left.search ?? ''}
      />
    </div>
  )
}

export default LeftSidebar
export { LeftSidebar }