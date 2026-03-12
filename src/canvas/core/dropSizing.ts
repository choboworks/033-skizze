// src/canvas/core/dropSizing.ts

import type { FabricObject } from 'fabric'

/* =============================================================================
   Typen
   ========================================================================== */

export type SubcategoryId =
  // 🔥 NEU: Straßengenerator
  | 'gen_strasse'                   // Straßen (Generator)
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

/* =============================================================================
   Größen-Mapping: Unterkategorie → Zielgröße in Pixeln
   ========================================================================== */

/**
 * Zielgröße = max(width, height) des Objekts nach Skalierung
 * Diese Werte sind die DEFAULT-Größen beim Drop auf den Canvas
 * 
 * STRASSEN-SYSTEM (0.5x / 1x / 2x):
 * - Breite: Schmal 80px | Mittel 160px | Breit 320px
 * - Länge: Kurz 200px | Mittel 400px | Lang 800px
 * - Straßen werden nach BREITE (min dimension) skaliert
 */
const SUBCATEGORY_SIZES: Record<SubcategoryId, number> = {
  // 🔥 NEU: Straßengenerator - Gleiche Größen wie alte Straßen
  gen_strasse: 160,          // Mittel Breite
  gen_autobahn: 320,         // Breit - Autobahn doppelt so groß!
  
  // Infrastruktur - NEUES SYSTEM
  infra_strassen_innerorts: 160,        // 🔥 Mittel Breite (war 250)
  infra_strassen_ausserorts: 160,       // 🔥 Mittel Breite (war 250)
  infra_autobahn: 320,                  // 🔥 Breit - Autobahn doppelt so groß! (war 400)
  infra_wege: 400,
  infra_uebergaenge: 180,
  infra_begrenzungen: 120,
  infra_oepnv_haltepunkte: 100,
  infra_parken_stellflaechen: 160,
  infra_sonstige: 140,

  // Fahrzeuge - mittlere Größen
  fz_pkw_kombi: 140,
  fz_transporter_vans: 160,
  fz_lkw_nutzfahrzeuge: 220,
  fz_busse: 200,
  fz_zweiraeder: 80,
  fz_einsatz_sonder: 150,
  fz_sonstige: 140,
  fz_strassenbahn: 240,

  // Verkehrsregelung - eher klein
  vr_gefahrzeichen: 60,
  vr_vorschriftzeichen: 60,
  vr_richtzeichen: 70,
  vr_zusatzzeichen: 50,
  vr_wegweiser: 90,
  vr_ampeln: 80,
  vr_bodenmarkierungen: 100,
  vr_leiteinrichtungen: 70,
  vr_baustellenregelung: 80,

  // Umgebung - sehr unterschiedlich
  um_stadtmoebel: 90,
  um_vegetation: 150,
  um_mensch_tier: 100,
  um_gebaeude_bauliches: 200,
  um_technische_objekte: 110,
  um_muells_container: 80,
  um_sonstige: 100,

  // Markierungen - klein bis mittel
  mark_pfeile: 100,
  mark_kollisionen: 90,
  mark_spuren: 120,
  mark_text_info: 80,
  mark_masse_distanzen: 100,
  mark_symbole: 70,
  mark_orientierung: 110,
}

/* =============================================================================
   Straßen-Kategorien (für Snapping & Connectors)
   ========================================================================== */

/**
 * Unterkategorien die als "Straßen" gelten und Snapping-Connectors haben
 */
export const ROAD_SUBCATEGORIES: SubcategoryId[] = [
  'infra_strassen_innerorts',       // Straßen Innerorts
  'infra_strassen_ausserorts',      // Straßen Außerorts
  'infra_autobahn',                 // Autobahn
  // NICHT: 'infra_uebergaenge' - das sind Zebrastreifen, Bahnübergänge, etc.
]

/**
 * Prüft ob eine Unterkategorie eine Straße ist
 */
export function isRoadSubcategory(subcategory: SubcategoryId | string | undefined): boolean {
  if (!subcategory) return false
  return ROAD_SUBCATEGORIES.includes(subcategory as SubcategoryId)
}

/* =============================================================================
   Spezifische SVG-ID Overrides (optional)
   ========================================================================== */

const SVG_ID_OVERRIDES: Record<string, number> = {
  // Hier kannst du später spezifische IDs hinzufügen
  // Beispiele:
  // 'um_vegetation_baum_eiche': 180,
  // 'um_mensch_kind': 70,
  // 'fz_pkw_kleinwagen': 120,
}

/* =============================================================================
   Hilfsfunktionen
   ========================================================================== */

/**
 * Extrahiert die SVG Root-ID aus dem data-Objekt
 */
function getSvgRootId(obj: FabricObject): string | undefined {
  const data = (obj as { data?: { svgRootId?: string } }).data
  return data?.svgRootId
}

/**
 * Berechnet die aktuelle Bounding Box (inkl. Skalierung)
 */
function getCurrentSize(obj: FabricObject): { width: number; height: number } {
  const bounds = obj.getBoundingRect()
  return { width: bounds.width, height: bounds.height }
}

/* =============================================================================
   Hauptfunktion: Objekt auf Zielgröße skalieren
   ========================================================================== */

/**
 * Skaliert ein Fabric-Objekt basierend auf seiner Unterkategorie.
 * 
 * Logik:
 * 1. Prüfe ob es ein SVG-ID-Override gibt (höchste Priorität)
 * 2. Sonst nutze die Unterkategorie-Größe
 * 3. Skaliere das Objekt so, dass max(width, height) = Zielgröße
 * 
 * @param obj - Das Fabric-Objekt das skaliert werden soll
 * @param subcategoryId - Die Unterkategorie-ID aus dem Manifest
 */
export function resizeToSubcategoryDefault(
  obj: FabricObject,
  subcategoryId: SubcategoryId
): void {
  // 1. Versuche SVG-ID-Override zu finden
  const svgRootId = getSvgRootId(obj)
  let targetSize: number | undefined

  if (svgRootId && svgRootId in SVG_ID_OVERRIDES) {
    targetSize = SVG_ID_OVERRIDES[svgRootId]
  }

  // 2. Fallback auf Unterkategorie
  if (!targetSize) {
    targetSize = SUBCATEGORY_SIZES[subcategoryId]
  }

  // 3. Safety check
  if (!targetSize || targetSize <= 0) {
    console.warn(`[dropSizing] Keine gültige Größe für subcategory: ${subcategoryId}`)
    return
  }

  // 4. Aktuelle Größe ermitteln
  const current = getCurrentSize(obj)
  
  // 5. Spezialfall: Straßen nach längster Dimension skalieren (formfüllend)
  if (isRoadSubcategory(subcategoryId)) {
    // 🔥 Skaliere nach LÄNGSTER Dimension (max), nicht nach Breite!
    // Dadurch sind kleine Straßen GROSS und große Straßen KLEIN auf Canvas
    const roadMax = Math.max(current.width, current.height)
    
    if (roadMax <= 0) {
      console.warn('[dropSizing] Straße hat keine gültige Größe')
      return
    }
    
    // 🔥 Zielgröße: Alle Straßen haben ~800px in längster Dimension (formfüllend!)
    const TARGET_CANVAS_SIZE = 800
    const scaleFactor = TARGET_CANVAS_SIZE / roadMax
    
    const currentScaleX = obj.scaleX ?? 1
    const currentScaleY = obj.scaleY ?? 1
    
    obj.set({
      scaleX: currentScaleX * scaleFactor,
      scaleY: currentScaleY * scaleFactor,
    })
    
    obj.setCoords()
    return
  }
  
  // 6. Standard: längste Seite als Referenz
  const currentMax = Math.max(current.width, current.height)

  if (currentMax <= 0) {
    console.warn('[dropSizing] Objekt hat keine gültige Größe')
    return
  }

  const scaleFactor = targetSize / currentMax
  
  const currentScaleX = obj.scaleX ?? 1
  const currentScaleY = obj.scaleY ?? 1

  obj.set({
    scaleX: currentScaleX * scaleFactor,
    scaleY: currentScaleY * scaleFactor,
  })

  obj.setCoords()
}

/* =============================================================================
   Utilities für fortgeschrittene Nutzung
   ========================================================================== */

/**
 * Gibt die konfigurierte Zielgröße für eine Unterkategorie zurück
 */
export function getTargetSize(subcategoryId: SubcategoryId): number {
  return SUBCATEGORY_SIZES[subcategoryId]
}

/**
 * Setzt einen SVG-ID-Override zur Laufzeit
 */
export function setSvgIdOverride(svgId: string, targetSize: number): void {
  SVG_ID_OVERRIDES[svgId] = targetSize
}

/**
 * Entfernt einen SVG-ID-Override
 */
export function removeSvgIdOverride(svgId: string): void {
  delete SVG_ID_OVERRIDES[svgId]
}

/**
 * Gibt alle aktuellen SVG-ID-Overrides zurück
 */
export function getAllOverrides(): Record<string, number> {
  return { ...SVG_ID_OVERRIDES }
}

/* =============================================================================
   Export
   ========================================================================== */

export { SUBCATEGORY_SIZES }