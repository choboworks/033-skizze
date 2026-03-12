// src/modules/library/libraryManifest.ts

import { infrastructure } from './assets/infrastructure'
import { vehicles } from './assets/vehicles'
import { trafficRegulation } from './assets/trafficRegulation'
import { environment } from './assets/environment'
import { markings } from './assets/markings'

import { INFRASTRUKTUR_ASSETS } from './assets/infrastrukturAssets'
import { FAHRZEUGE_ASSETS } from './assets/fahrzeugeAssets'
import { VERKEHRSREGELUNG_ASSETS } from './assets/verkehrsregelungAssets'
import { UMGEBUNG_ASSETS } from './assets/umgebungAssets'
import { MARKIERUNGEN_ASSETS } from './assets/markierungenAssets'

// 🔥 NEU: SmartRoads importieren
import { roadPresets } from './roads/roadPresets'
import { ROAD_PREVIEWS } from './roads/roadPreviews'
import type { RoadTemplate } from './roads/types'

/**
 * Hauptkategorien (intern)
 */
export type MainCategoryId =
  | 'strassengenerator'       // 🔥 NEU: Straßengenerator (vor Infrastruktur)
  | 'infrastruktur'
  | 'fahrzeuge'
  | 'verkehrsregelung'
  | 'umgebung'
  | 'markierungen'

/**
 * Unterkategorien (Chips)
 */
export type SubcategoryId =
  // 🔥 NEU: Straßengenerator
  | 'gen_strasse'                    // Straßen (Generator)
  | 'gen_autobahn'                  // Autobahn (Generator)
  // Infrastruktur - NEUE STRUKTUR
  | 'infra_strassen_innerorts'      // Straßen Innerorts (alte SVGs, falls noch gebraucht)
  | 'infra_strassen_ausserorts'     // Straßen Außerorts (alte SVGs, falls noch gebraucht)
  | 'infra_autobahn'                // Autobahn (alte SVGs, falls noch gebraucht)
  | 'infra_wege'                    // Wege (Fußwege, Radwege)
  | 'infra_uebergaenge'             // Übergänge (Zebrastreifen, Bahnübergänge)
  | 'infra_begrenzungen'            // Begrenzungen
  | 'infra_oepnv_haltepunkte'       // ÖPNV & Haltepunkte
  | 'infra_parken_stellflaechen'    // Parken & Stellflächen
  | 'infra_sonstige'                // Sonstige Infrastruktur
  // Fahrzeuge (bleibt gleich)
  | 'fz_pkw_kombi'
  | 'fz_transporter_vans'
  | 'fz_lkw_nutzfahrzeuge'
  | 'fz_busse'
  | 'fz_zweiraeder'
  | 'fz_einsatz_sonder'
  | 'fz_sonstige'
  | 'fz_strassenbahn'
  // Verkehrsregelung
  | 'vr_gefahrzeichen'
  | 'vr_vorschriftzeichen'
  | 'vr_richtzeichen'
  | 'vr_zusatzzeichen'
  | 'vr_wegweiser'
  | 'vr_ampeln'
  | 'vr_bodenmarkierungen'
  | 'vr_leiteinrichtungen'
  | 'vr_baustellenregelung'
  // Umgebung
  | 'um_stadtmoebel'
  | 'um_vegetation'
  | 'um_mensch_tier'
  | 'um_gebaeude_bauliches'
  | 'um_technische_objekte'
  | 'um_muells_container'
  | 'um_sonstige'
  // Markierungen
  | 'mark_pfeile'
  | 'mark_kollisionen'
  | 'mark_spuren'
  | 'mark_text_info'
  | 'mark_masse_distanzen'
  | 'mark_symbole'
  | 'mark_orientierung'

/**
 * Basis-Metadaten für ein Asset (ohne SVG-String).
 */
export type AssetBaseMeta = {
  id: string
  label: string
  category: MainCategoryId
  subcategory: SubcategoryId
  tags: string[]
  searchKeywords?: string[]
  popularity?: number
  previewSrc?: string
  // 🔥 NEU: SmartRoad-Kennzeichnung
  isSmartRoad?: boolean
  roadTemplate?: RoadTemplate
}

/**
 * Vollständiges Asset inkl. SVG-String.
 */
export type AssetMeta = AssetBaseMeta & {
  svg: string
}

/**
 * Mapping: Kategorie → SVG-Map (id → svg)
 */
const SVG_BY_CATEGORY: Record<MainCategoryId, Record<string, string>> = {
  strassengenerator: {},  // 🔥 NEU - SmartRoads haben keine statischen SVGs
  infrastruktur: infrastructure,
  fahrzeuge: vehicles,
  verkehrsregelung: trafficRegulation,
  umgebung: environment,
  markierungen: markings,
}

/**
 * Holt den SVG-Code aus der passenden Map.
 * Falls kein SVG vorhanden ist, gibt es eine Warnung und ein leeres SVG.
 */
function attachSvg(meta: AssetBaseMeta): AssetMeta {
  // 🔥 SmartRoads: Preview-SVG aus ROAD_PREVIEWS verwenden
  if (meta.isSmartRoad) {
    const previewSvg = ROAD_PREVIEWS[meta.id] || ''
    return { ...meta, svg: previewSvg }
  }
  
  const map = SVG_BY_CATEGORY[meta.category]
  const svg = map[meta.id]

  if (!svg) {
    console.warn(
      `[libraryManifest] Kein SVG für Asset-ID "${meta.id}" in Kategorie "${meta.category}" gefunden.`,
    )
    return { ...meta, svg: '' }
  }

  return { ...meta, svg }
}

/* ------------------------------------------------------------------------- */
/* 🔥 NEU: SmartRoads zu Assets konvertieren                                */
/* ------------------------------------------------------------------------- */

/**
 * Konvertiert RoadPresets zu AssetBaseMeta
 */
function roadPresetsToAssets(): AssetBaseMeta[] {
  return roadPresets.map(preset => {
    return {
      id: preset.id,
      label: preset.label,
      category: 'strassengenerator',
      subcategory: 'gen_strasse' as SubcategoryId,
      tags: ['straße', 'road', 'smart', 'generator'],
      searchKeywords: ['straße', 'fahrbahn', 'generator'],
      popularity: 10,
      isSmartRoad: true,
      roadTemplate: preset,
    }
  })
}

/* ------------------------------------------------------------------------- */
/* Gesamtsammlung + Export                                                  */
/* ------------------------------------------------------------------------- */

// 🔥 Assets die durch SmartRoads ersetzt werden
const REPLACED_BY_SMART_ROADS: SubcategoryId[] = [
  'infra_strassen_innerorts',
  'infra_strassen_ausserorts',
]

// 🔥 Kreuzungs-SVGs die später durch SmartRoads ersetzt werden
const KREUZUNGS_SVG_IDS = [
  'infra_kreuzung_4arm',
  'infra_kreuzung_t',
  'infra_kreuzung_y',
  'infra_kreuzung_mittelinsel',
  'infra_abknickende_vorfahrt_links',
  'infra_abknickende_vorfahrt_rechts',
  'infra_kreuzung_versetzt',
  'infra_einmuendung_links',
  'infra_einmuendung_rechts',
  'infra_einmuendung_eng',
  'infra_einmuendung_breit',
  'infra_kreisverkehr_klein',
  'infra_kreisverkehr_gross',
  'infra_kreisverkehr_mini',
]

// 🔥 Filtere Straßen UND Kreuzungen raus
const FILTERED_INFRASTRUKTUR = INFRASTRUKTUR_ASSETS.filter(
  asset => 
    !REPLACED_BY_SMART_ROADS.includes(asset.subcategory) &&
    !KREUZUNGS_SVG_IDS.includes(asset.id)
)

const BASE_ASSETS: AssetBaseMeta[] = [
  ...FILTERED_INFRASTRUKTUR,  // ← Nur Wege, Übergänge, Begrenzungen, ÖPNV, Parken, Sonstiges
  ...FAHRZEUGE_ASSETS,
  ...VERKEHRSREGELUNG_ASSETS,
  ...UMGEBUNG_ASSETS,
  ...MARKIERUNGEN_ASSETS,
  // 🔥 SmartRoads hinzufügen
  ...roadPresetsToAssets(),
]

export const libraryAssets: Record<string, AssetMeta> = BASE_ASSETS.reduce(
  (acc, meta) => {
    const full = attachSvg(meta)
    acc[full.id] = full
    return acc
  },
  {} as Record<string, AssetMeta>,
)

export const allAssets: AssetMeta[] = Object.values(libraryAssets)