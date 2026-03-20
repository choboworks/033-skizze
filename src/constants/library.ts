import {
  Route,
  Car,
  Building,
  TrafficCone,
  Trees,
  Ruler,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────

export interface LibraryCategoryDef {
  id: string
  label: string
  icon: LucideIcon
}

export interface LibrarySubcategory {
  id: string
  label: string
  categoryId: string
}

export interface LibraryItem {
  id: string
  name: string
  category: string
  subcategory: string
  tags: string[]
  keywords?: string[]
  popularity?: number
  isSmartRoad?: boolean
}

// ── Categories ─────────────────────────────────────────────────────────

export const LIBRARY_CATEGORIES: LibraryCategoryDef[] = [
  { id: 'smartroads', label: 'SmartRoads', icon: Route },
  { id: 'vehicles', label: 'Fahrzeuge', icon: Car },
  { id: 'infrastructure', label: 'Infrastruktur', icon: Building },
  { id: 'traffic-regulation', label: 'Verkehrsregelung', icon: TrafficCone },
  { id: 'environment', label: 'Umgebung', icon: Trees },
  { id: 'markings', label: 'Markierungen', icon: Ruler },
]

// ── Subcategories ──────────────────────────────────────────────────────

export const LIBRARY_SUBCATEGORIES: Record<string, LibrarySubcategory[]> = {
  smartroads: [],
  vehicles: [
    { id: 'fz_pkw_kombi', label: 'PKW & Kombi', categoryId: 'vehicles' },
    { id: 'fz_transporter_vans', label: 'Transporter & Vans', categoryId: 'vehicles' },
    { id: 'fz_lkw_nutzfahrzeuge', label: 'LKW & Nutzfahrzeuge', categoryId: 'vehicles' },
    { id: 'fz_busse', label: 'Busse', categoryId: 'vehicles' },
    { id: 'fz_zweiraeder', label: 'Zweiräder', categoryId: 'vehicles' },
    { id: 'fz_einsatz_sonder', label: 'Einsatzfahrzeuge', categoryId: 'vehicles' },
    { id: 'fz_sonstige', label: 'Sonstige', categoryId: 'vehicles' },
    { id: 'fz_strassenbahn', label: 'Straßenbahn', categoryId: 'vehicles' },
  ],
  infrastructure: [
    { id: 'infra_wege', label: 'Wege', categoryId: 'infrastructure' },
    { id: 'infra_uebergaenge', label: 'Übergänge', categoryId: 'infrastructure' },
    { id: 'infra_begrenzungen', label: 'Begrenzungen', categoryId: 'infrastructure' },
    { id: 'infra_oepnv_haltepunkte', label: 'ÖPNV & Haltepunkte', categoryId: 'infrastructure' },
    { id: 'infra_parken_stellflaechen', label: 'Parken & Stellflächen', categoryId: 'infrastructure' },
    { id: 'infra_sonstige', label: 'Sonstige', categoryId: 'infrastructure' },
  ],
  'traffic-regulation': [
    { id: 'vr_gefahrzeichen', label: 'Gefahrzeichen', categoryId: 'traffic-regulation' },
    { id: 'vr_vorschriftzeichen', label: 'Vorschriftzeichen', categoryId: 'traffic-regulation' },
    { id: 'vr_richtzeichen', label: 'Richtzeichen', categoryId: 'traffic-regulation' },
    { id: 'vr_ampeln', label: 'Ampeln', categoryId: 'traffic-regulation' },
    { id: 'vr_bodenmarkierungen', label: 'Bodenmarkierungen', categoryId: 'traffic-regulation' },
  ],
  environment: [
    { id: 'um_vegetation', label: 'Vegetation', categoryId: 'environment' },
    { id: 'um_stadtmoebel', label: 'Stadtmöbel', categoryId: 'environment' },
    { id: 'um_mensch_tier', label: 'Mensch & Tier', categoryId: 'environment' },
    { id: 'um_gebaeude_bauliches', label: 'Gebäude', categoryId: 'environment' },
    { id: 'um_technische_objekte', label: 'Technische Objekte', categoryId: 'environment' },
    { id: 'um_muells_container', label: 'Müll & Container', categoryId: 'environment' },
    { id: 'um_sonstige', label: 'Sonstige', categoryId: 'environment' },
  ],
  markings: [
    { id: 'mark_pfeile', label: 'Pfeile', categoryId: 'markings' },
    { id: 'mark_kollisionen', label: 'Kollisionen', categoryId: 'markings' },
    { id: 'mark_spuren', label: 'Spuren', categoryId: 'markings' },
    { id: 'mark_text_info', label: 'Text & Info', categoryId: 'markings' },
    { id: 'mark_masse_distanzen', label: 'Maße', categoryId: 'markings' },
    { id: 'mark_symbole', label: 'Symbole', categoryId: 'markings' },
    { id: 'mark_orientierung', label: 'Orientierung', categoryId: 'markings' },
  ],
}

// ── Items ──────────────────────────────────────────────────────────────

export const LIBRARY_ITEMS: LibraryItem[] = [
  // ─── SmartRoads ────────────────────────────────────────────────────
  { id: 'sr_gerade', name: 'Gerade Straße', category: 'smartroads', subcategory: 'gen_strasse', tags: ['straße', 'gerade', 'road'], keywords: ['fahrbahn', 'generator'], isSmartRoad: true },
  { id: 'sr_kurve', name: 'Kurve Straße', category: 'smartroads', subcategory: 'gen_strasse', tags: ['straße', 'kurve'], keywords: ['kurve'], isSmartRoad: true },
  { id: 'sr_t_kreuzung', name: 'T-Kreuzung', category: 'smartroads', subcategory: 'gen_strasse', tags: ['kreuzung', 't-kreuzung'], keywords: ['kreuzung'], isSmartRoad: true },
  { id: 'sr_kreuzung_4arm', name: 'Kreuzung 4-Arm', category: 'smartroads', subcategory: 'gen_strasse', tags: ['kreuzung', '4-arm'], keywords: ['kreuzung'], isSmartRoad: true },
  { id: 'sr_kreisverkehr', name: 'Kreisverkehr', category: 'smartroads', subcategory: 'gen_strasse', tags: ['kreisverkehr'], keywords: ['kreisverkehr'], isSmartRoad: true },

  // ─── Fahrzeuge: PKW & Kombi ────────────────────────────────────────
  { id: 'fz_pkw_kompakt', name: 'Kompakt-Pkw', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['pkw', 'kompakt', 'auto'], keywords: ['kompaktwagen'], popularity: 100 },
  { id: 'fz_pkw_mittelklasse', name: 'Mittelklasse-Pkw', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['pkw', 'mittelklasse'], keywords: ['mittelklasse'], popularity: 80 },
  { id: 'fz_pkw_oberklasse', name: 'Oberklasse-Pkw', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['pkw', 'oberklasse'], keywords: ['oberklasse'], popularity: 60 },
  { id: 'fz_pkw_kleinwagen', name: 'Kleinwagen', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['pkw', 'kleinwagen'], keywords: ['kleinwagen'], popularity: 90 },
  { id: 'fz_suv_klein', name: 'SUV (klein)', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['suv', 'klein'], keywords: ['suv', 'kompakt suv'], popularity: 80 },
  { id: 'fz_suv_gross', name: 'SUV (groß)', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['suv', 'groß'], keywords: ['suv'], popularity: 80 },
  { id: 'fz_coupe', name: 'Coupé', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['coupé'], keywords: ['coupe'], popularity: 50 },
  { id: 'fz_cabrio', name: 'Cabrio', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['cabrio'], keywords: ['cabrio'], popularity: 50 },
  { id: 'fz_kombi_kompakt', name: 'Kombi (kompakt)', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['kombi', 'kompakt'], keywords: ['kombi'], popularity: 75 },
  { id: 'fz_kombi_mittel', name: 'Kombi (mittel)', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['kombi', 'mittel'], keywords: ['kombi'], popularity: 70 },
  { id: 'fz_kombi_grossraum', name: 'Großraum-Kombi', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['kombi', 'großraum'], keywords: ['großraumkombi'], popularity: 60 },
  { id: 'fz_taxi', name: 'Taxi', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['taxi'], keywords: ['taxi'], popularity: 85 },
  { id: 'fz_mietwagen', name: 'Mietwagen / Carsharing', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['mietwagen', 'carsharing'], keywords: ['mietwagen', 'carsharing'], popularity: 65 },
  { id: 'fz_e_auto', name: 'E-Auto', category: 'vehicles', subcategory: 'fz_pkw_kombi', tags: ['e-auto', 'elektroauto'], keywords: ['e auto', 'elektroauto'], popularity: 70 },

  // ─── Fahrzeuge: Transporter & Vans ─────────────────────────────────
  { id: 'fz_kastenwagen_kurz', name: 'Kastenwagen (kurz)', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['kastenwagen', 'kurz'], keywords: ['kastenwagen'], popularity: 80 },
  { id: 'fz_kastenwagen_lang', name: 'Kastenwagen (lang)', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['kastenwagen', 'lang'], keywords: ['kastenwagen'], popularity: 70 },
  { id: 'fz_hochdachkombi', name: 'Hochdachkombi', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['hochdachkombi'], keywords: ['hochdachkombi'], popularity: 70 },
  { id: 'fz_sprinter_kurz', name: 'Sprinter (kurz)', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['sprinter', 'kurz'], keywords: ['sprinter'], popularity: 80 },
  { id: 'fz_sprinter_lang', name: 'Sprinter (lang)', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['sprinter', 'lang'], keywords: ['sprinter'], popularity: 80 },
  { id: 'fz_minivan', name: 'Minivan', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['minivan'], keywords: ['minivan'], popularity: 60 },
  { id: 'fz_grossraumvan', name: 'Großraumvan', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['großraumvan'], keywords: ['großraumvan'], popularity: 60 },
  { id: 'fz_liefertransporter', name: 'Liefertransporter', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['liefertransporter'], keywords: ['lieferwagen'], popularity: 70 },
  { id: 'fz_kuehltransporter', name: 'Kühltransporter', category: 'vehicles', subcategory: 'fz_transporter_vans', tags: ['kühltransporter'], keywords: ['kühltransporter'], popularity: 50 },

  // ─── Fahrzeuge: LKW & Nutzfahrzeuge ────────────────────────────────
  { id: 'fz_lkw_2achser', name: 'Lkw (2-Achser)', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['lkw', '2-achser'], keywords: ['2 achser'], popularity: 60 },
  { id: 'fz_lkw_3achser', name: 'Lkw (3-Achser)', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['lkw', '3-achser'], keywords: ['3 achser'], popularity: 60 },
  { id: 'fz_sattelzugmaschine', name: 'Sattelzugmaschine', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['sattelzugmaschine'], keywords: ['sattelzugmaschine'], popularity: 55 },
  { id: 'fz_auflieger_plane', name: 'Auflieger (Plane)', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['auflieger', 'plane'], keywords: ['auflieger'], popularity: 50 },
  { id: 'fz_auflieger_koffer', name: 'Auflieger (Koffer)', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['auflieger', 'koffer'], keywords: ['auflieger'], popularity: 50 },
  { id: 'fz_sattelzug_komplett', name: 'Sattelzug (komplett)', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['sattelzug'], keywords: ['sattelzug'], popularity: 75 },
  { id: 'fz_kipper', name: 'Kipper', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['kipper'], keywords: ['kipper'], popularity: 50 },
  { id: 'fz_betonmischer', name: 'Betonmischer', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['betonmischer'], keywords: ['betonmischer'], popularity: 50 },
  { id: 'fz_tanklaster', name: 'Tanklaster', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['tanklaster'], keywords: ['tanklaster'], popularity: 55 },
  { id: 'fz_pritschenwagen', name: 'Pritschenwagen', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['pritschenwagen'], keywords: ['pritschenwagen'], popularity: 55 },
  { id: 'fz_winterdienst', name: 'Winterdienstfahrzeug', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['winterdienst'], keywords: ['winterdienst'], popularity: 40 },
  { id: 'fz_muellwagen', name: 'Müllwagen', category: 'vehicles', subcategory: 'fz_lkw_nutzfahrzeuge', tags: ['müllwagen'], keywords: ['müllwagen'], popularity: 60 },

  // ─── Fahrzeuge: Busse ──────────────────────────────────────────────
  { id: 'fz_bus_linienbus', name: 'Linienbus', category: 'vehicles', subcategory: 'fz_busse', tags: ['bus', 'linienbus'], keywords: ['linienbus'], popularity: 75 },
  { id: 'fz_bus_gelenkbus', name: 'Gelenkbus', category: 'vehicles', subcategory: 'fz_busse', tags: ['bus', 'gelenkbus'], keywords: ['gelenkbus'], popularity: 65 },
  { id: 'fz_bus_e_bus', name: 'E-Bus', category: 'vehicles', subcategory: 'fz_busse', tags: ['bus', 'e-bus'], keywords: ['e bus'], popularity: 50 },
  { id: 'fz_bus_schulbus', name: 'Schulbus', category: 'vehicles', subcategory: 'fz_busse', tags: ['bus', 'schulbus'], keywords: ['schulbus'], popularity: 55 },
  { id: 'fz_bus_kleinbus', name: 'Kleinbus', category: 'vehicles', subcategory: 'fz_busse', tags: ['bus', 'kleinbus'], keywords: ['kleinbus'], popularity: 55 },
  { id: 'fz_bus_shuttlebus', name: 'Shuttlebus', category: 'vehicles', subcategory: 'fz_busse', tags: ['bus', 'shuttle'], keywords: ['shuttlebus'], popularity: 45 },

  // ─── Fahrzeuge: Zweiräder ──────────────────────────────────────────
  { id: 'fz_fahrrad', name: 'Fahrrad', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['fahrrad'], keywords: ['fahrrad'], popularity: 85 },
  { id: 'fz_e_bike', name: 'E-Bike', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['e-bike'], keywords: ['e bike'], popularity: 70 },
  { id: 'fz_rennrad', name: 'Rennrad', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['rennrad'], keywords: ['rennrad'], popularity: 60 },
  { id: 'fz_mtb', name: 'MTB', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['mtb', 'mountainbike'], keywords: ['mountainbike'], popularity: 60 },
  { id: 'fz_lastenrad', name: 'Lastenrad', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['lastenrad'], keywords: ['lastenrad'], popularity: 55 },
  { id: 'fz_motorrad_standard', name: 'Motorrad (Standard)', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['motorrad'], keywords: ['motorrad'], popularity: 70 },
  { id: 'fz_motorrad_sport', name: 'Motorrad (Sport)', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['motorrad', 'sport'], keywords: ['sportmotorrad'], popularity: 60 },
  { id: 'fz_roller', name: 'Roller', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['roller'], keywords: ['roller'], popularity: 60 },
  { id: 'fz_e_scooter', name: 'E-Scooter', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['e-scooter'], keywords: ['e scooter'], popularity: 55 },
  { id: 'fz_motorrad_beiwagen', name: 'Motorrad mit Beiwagen', category: 'vehicles', subcategory: 'fz_zweiraeder', tags: ['motorrad', 'beiwagen'], keywords: ['motorrad beiwagen'], popularity: 40 },

  // ─── Fahrzeuge: Einsatz-/Sonderfahrzeuge ───────────────────────────
  { id: 'fz_polizei_pkw', name: 'Polizei-Pkw', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['polizei', 'pkw'], keywords: ['polizei'], popularity: 95 },
  { id: 'fz_polizei_kombi', name: 'Polizei-Kombi', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['polizei', 'kombi'], keywords: ['polizei'], popularity: 90 },
  { id: 'fz_polizei_van', name: 'Polizei-Van', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['polizei', 'van'], keywords: ['polizei'], popularity: 80 },
  { id: 'fz_polizei_grukw', name: 'Polizei-GruKw', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['polizei', 'grukw'], keywords: ['grukw'], popularity: 70 },
  { id: 'fz_polizei_zivil', name: 'Polizei (zivil)', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['polizei', 'zivil'], keywords: ['zivilfahrzeug polizei'], popularity: 70 },
  { id: 'fz_feuerwehr_lf', name: 'Feuerwehr-LF', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['feuerwehr', 'lf'], keywords: ['feuerwehr lf'], popularity: 80 },
  { id: 'fz_feuerwehr_dlk', name: 'Feuerwehr-DLK', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['feuerwehr', 'dlk'], keywords: ['feuerwehr dlk'], popularity: 70 },
  { id: 'fz_feuerwehr_rw', name: 'Feuerwehr-RW', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['feuerwehr', 'rw'], keywords: ['feuerwehr rw'], popularity: 60 },
  { id: 'fz_feuerwehr_elw', name: 'Feuerwehr-ELW', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['feuerwehr', 'elw'], keywords: ['feuerwehr elw'], popularity: 60 },
  { id: 'fz_rettung_rtw', name: 'Rettung (RTW)', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['rettung', 'rtw'], keywords: ['rtw'], popularity: 85 },
  { id: 'fz_rettung_ktw', name: 'Rettung (KTW)', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['rettung', 'ktw'], keywords: ['ktw'], popularity: 70 },
  { id: 'fz_rettung_nef', name: 'Rettung (NEF)', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['rettung', 'nef'], keywords: ['nef'], popularity: 70 },
  { id: 'fz_abschleppwagen_flachbett', name: 'Abschleppwagen (Flachbett)', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['abschleppwagen', 'flachbett'], keywords: ['abschleppfahrzeug'], popularity: 65 },
  { id: 'fz_abschleppwagen_kran', name: 'Abschleppwagen (Kran)', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['abschleppwagen', 'kran'], keywords: ['abschleppfahrzeug'], popularity: 55 },
  { id: 'fz_gabelstapler', name: 'Gabelstapler', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['gabelstapler'], keywords: ['gabelstapler'], popularity: 40 },
  { id: 'fz_radlader', name: 'Radlader', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['radlader'], keywords: ['radlader'], popularity: 40 },
  { id: 'fz_minibagger', name: 'Minibagger', category: 'vehicles', subcategory: 'fz_einsatz_sonder', tags: ['minibagger'], keywords: ['minibagger'], popularity: 40 },

  // ─── Fahrzeuge: Sonstige ───────────────────────────────────────────
  { id: 'fz_golfcart', name: 'Golfcart', category: 'vehicles', subcategory: 'fz_sonstige', tags: ['golfcart'], keywords: ['golfcart'], popularity: 30 },
  { id: 'fz_segway', name: 'Segway', category: 'vehicles', subcategory: 'fz_sonstige', tags: ['segway'], keywords: ['segway'], popularity: 30 },
  { id: 'fz_elektrorollstuhl', name: 'Elektrorollstuhl', category: 'vehicles', subcategory: 'fz_sonstige', tags: ['elektrorollstuhl'], keywords: ['elektrorollstuhl'], popularity: 30 },
  { id: 'fz_kinderwagen', name: 'Kinderwagen', category: 'vehicles', subcategory: 'fz_sonstige', tags: ['kinderwagen'], keywords: ['kinderwagen'], popularity: 30 },
  { id: 'fz_skateboard', name: 'Skateboard', category: 'vehicles', subcategory: 'fz_sonstige', tags: ['skateboard'], keywords: ['skateboard'], popularity: 30 },
  { id: 'fz_hubwagen', name: 'Hubwagen', category: 'vehicles', subcategory: 'fz_sonstige', tags: ['hubwagen'], keywords: ['hubwagen'], popularity: 30 },

  // ─── Fahrzeuge: Straßenbahn ────────────────────────────────────────
  { id: 'fz_strassenbahn_voll', name: 'Straßenbahn (volle Seitenansicht)', category: 'vehicles', subcategory: 'fz_strassenbahn', tags: ['straßenbahn', 'tram'], keywords: ['straßenbahn'], popularity: 75 },
  { id: 'fz_strassenbahn_modul', name: 'Straßenbahn Gelenkmodul', category: 'vehicles', subcategory: 'fz_strassenbahn', tags: ['straßenbahn', 'modul'], keywords: ['tram modul'], popularity: 50 },
  { id: 'fz_stadtbahn', name: 'Stadtbahn-Variante', category: 'vehicles', subcategory: 'fz_strassenbahn', tags: ['stadtbahn'], keywords: ['stadtbahn'], popularity: 50 },

  // ─── Infrastruktur: Wege ───────────────────────────────────────────
  { id: 'infra_gehweg', name: 'Gehweg / Fußweg', category: 'infrastructure', subcategory: 'infra_wege', tags: ['gehweg', 'fußweg'], keywords: ['gehweg', 'fußweg'], popularity: 85 },
  { id: 'infra_radweg', name: 'Radweg', category: 'infrastructure', subcategory: 'infra_wege', tags: ['radweg'], keywords: ['radweg'], popularity: 80 },
  { id: 'infra_kombiweg', name: 'Kombiweg (Rad/Fuß)', category: 'infrastructure', subcategory: 'infra_wege', tags: ['kombiweg', 'radweg', 'fußweg'], keywords: ['gemeinsamer weg', 'rad fuß'], popularity: 70 },
  { id: 'infra_feldweg', name: 'Feldweg', category: 'infrastructure', subcategory: 'infra_wege', tags: ['feldweg', 'unbefestigt'], keywords: ['feldweg'], popularity: 60 },
  { id: 'infra_schotterweg', name: 'Schotterweg', category: 'infrastructure', subcategory: 'infra_wege', tags: ['schotterweg', 'unbefestigt'], keywords: ['schotterweg'], popularity: 55 },
  { id: 'infra_unterfuehrungsweg', name: 'Unterführungsweg', category: 'infrastructure', subcategory: 'infra_wege', tags: ['unterführung', 'weg'], keywords: ['unterführung'], popularity: 50 },

  // ─── Infrastruktur: Übergänge ──────────────────────────────────────
  { id: 'infra_zebrastreifen', name: 'Zebrastreifen', category: 'infrastructure', subcategory: 'infra_uebergaenge', tags: ['zebrastreifen', 'fußgängerüberweg'], keywords: ['zebrastreifen'], popularity: 95 },
  { id: 'infra_mittelinsel_ueberweg', name: 'Mittelinsel-Überweg', category: 'infrastructure', subcategory: 'infra_uebergaenge', tags: ['mittelinsel', 'überweg'], keywords: ['mittelinsel überweg'], popularity: 70 },
  { id: 'infra_bahnuebergang_mit_schranke', name: 'Bahnübergang (mit Schranke)', category: 'infrastructure', subcategory: 'infra_uebergaenge', tags: ['bahnübergang', 'schranke'], keywords: ['bahnübergang', 'schranke'], popularity: 65 },
  { id: 'infra_bahnuebergang_ohne_schranke', name: 'Bahnübergang (ohne Schranke)', category: 'infrastructure', subcategory: 'infra_uebergaenge', tags: ['bahnübergang', 'unbeschrankt'], keywords: ['bahnübergang'], popularity: 55 },
  { id: 'infra_radweg_kreuzung', name: 'Radwegübergang', category: 'infrastructure', subcategory: 'infra_uebergaenge', tags: ['radweg', 'übergang'], keywords: ['radwegübergang'], popularity: 55 },
  { id: 'infra_uebergang_fahrbahn_gehweg', name: 'Übergang Fahrbahn → Gehweg', category: 'infrastructure', subcategory: 'infra_uebergaenge', tags: ['übergang', 'fahrbahn', 'gehweg'], keywords: ['bordstein absenkung'], popularity: 65 },

  // ─── Infrastruktur: Begrenzungen ───────────────────────────────────
  { id: 'infra_mauer_kurz', name: 'Mauer (kurz)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['mauer', 'begrenzung'], keywords: ['mauer'], popularity: 60 },
  { id: 'infra_mauer_lang', name: 'Mauer (lang)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['mauer', 'begrenzung'], keywords: ['mauer'], popularity: 60 },
  { id: 'infra_betonsperre', name: 'Betonsperre', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['betonsperre', 'sperre'], keywords: ['betonsperre'], popularity: 50 },
  { id: 'infra_laermschutzwand', name: 'Lärmschutzwand', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['lärmschutzwand'], keywords: ['lärmschutz'], popularity: 50 },
  { id: 'infra_zaun_holz', name: 'Zaun (Holz)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['zaun', 'holz'], keywords: ['zaun holz'], popularity: 55 },
  { id: 'infra_zaun_draht', name: 'Zaun (Draht)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['zaun', 'draht'], keywords: ['zaun draht'], popularity: 55 },
  { id: 'infra_zaun_metall', name: 'Zaun (Metall)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['zaun', 'metall'], keywords: ['zaun metall'], popularity: 55 },
  { id: 'infra_zaun_garten', name: 'Zaun (Garten)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['zaun', 'garten'], keywords: ['gartenzaun'], popularity: 55 },
  { id: 'infra_poller_einzel', name: 'Poller (einzeln)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['poller'], keywords: ['poller'], popularity: 75 },
  { id: 'infra_poller_reihe', name: 'Poller (Reihe)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['poller', 'reihe'], keywords: ['pollerkette'], popularity: 65 },
  { id: 'infra_poller_kette', name: 'Poller (Kette)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['poller', 'kette'], keywords: ['pollerkette'], popularity: 60 },
  { id: 'infra_leitplanke_kurz', name: 'Leitplanke (kurz)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['leitplanke'], keywords: ['leitplanke'], popularity: 60 },
  { id: 'infra_leitplanke_lang', name: 'Leitplanke (lang)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['leitplanke'], keywords: ['leitplanke'], popularity: 60 },
  { id: 'infra_bordstein', name: 'Bordstein / Schrammbord', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['bordstein', 'schrammbord'], keywords: ['bordstein'], popularity: 80 },
  { id: 'infra_boeschung_links', name: 'Böschung (links)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['böschung', 'links'], keywords: ['böschung links'], popularity: 40 },
  { id: 'infra_boeschung_rechts', name: 'Böschung (rechts)', category: 'infrastructure', subcategory: 'infra_begrenzungen', tags: ['böschung', 'rechts'], keywords: ['böschung rechts'], popularity: 40 },

  // ─── Infrastruktur: ÖPNV & Haltepunkte ────────────────────────────
  { id: 'infra_bushaltestellenhaeuschen', name: 'Bushaltestellenhäuschen', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['bushaltestelle', 'unterstand'], keywords: ['bushaltestelle', 'häuschen'], popularity: 70 },
  { id: 'infra_haltebucht', name: 'Haltebucht', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['haltebucht', 'bucht'], keywords: ['haltebucht'], popularity: 60 },
  { id: 'infra_busteig', name: 'Bussteig', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['bussteig', 'haltestelle'], keywords: ['bussteig'], popularity: 60 },
  { id: 'infra_halte_markierung', name: 'Bushaltestellen-Bodenmarkierung', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['haltestelle', 'markierung'], keywords: ['haltestelle markierung'], popularity: 65 },
  { id: 'infra_tram_haltestelle', name: 'Tram-Haltestelle', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['tram', 'haltestelle'], keywords: ['tram haltestelle'], popularity: 65 },
  { id: 'infra_bahnsteig', name: 'Bahnsteig', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['bahnsteig', 'zug'], keywords: ['bahnsteig'], popularity: 55 },
  { id: 'infra_usbahn_zugang', name: 'U/S-Bahn-Zugang', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['u-bahn', 's-bahn', 'zugang'], keywords: ['u bahn', 's bahn'], popularity: 55 },
  { id: 'infra_oberleitungsmast', name: 'Oberleitungsmast', category: 'infrastructure', subcategory: 'infra_oepnv_haltepunkte', tags: ['oberleitung', 'mast'], keywords: ['oberleitung'], popularity: 40 },

  // ─── Infrastruktur: Parken & Stellflächen ──────────────────────────
  { id: 'infra_parkplatz_einzel', name: 'Einzelparkplatz', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['parkplatz', 'einzel'], keywords: ['parkplatz'], popularity: 90 },
  { id: 'infra_parkplatz_doppel', name: 'Doppelparkplatz', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['parkplatz', 'doppel'], keywords: ['parkplatz'], popularity: 80 },
  { id: 'infra_parkstreifen_laengs', name: 'Parkstreifen (längs)', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['parkstreifen', 'längsparken'], keywords: ['parkstreifen'], popularity: 85 },
  { id: 'infra_parkbucht_laengs', name: 'Parkbucht (längs)', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['parkbucht', 'längs'], keywords: ['parkbucht'], popularity: 70 },
  { id: 'infra_parkbucht_schraeg', name: 'Parkbucht (schräg)', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['parkbucht', 'schräg'], keywords: ['parkbucht schräg'], popularity: 70 },
  { id: 'infra_parkplatz_behindert', name: 'Behindertenparkplatz', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['behindertenparkplatz'], keywords: ['behindertenparkplatz'], popularity: 65 },
  { id: 'infra_motorradstellplatz', name: 'Motorradstellplatz', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['motorrad', 'stellplatz'], keywords: ['motorradstellplatz'], popularity: 55 },
  { id: 'infra_garagenzufahrt', name: 'Garagenzufahrt', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['garage', 'zufahrt'], keywords: ['garagenzufahrt'], popularity: 60 },
  { id: 'infra_carportzufahrt', name: 'Carportzufahrt', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['carport', 'zufahrt'], keywords: ['carport'], popularity: 50 },
  { id: 'infra_garage_silhouette', name: 'Garagen-Silhouette', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['garage', 'gebäude'], keywords: ['garage'], popularity: 50 },
  { id: 'infra_carport_dach', name: 'Carport-Dach', category: 'infrastructure', subcategory: 'infra_parken_stellflaechen', tags: ['carport', 'dach'], keywords: ['carport'], popularity: 45 },

  // ─── Infrastruktur: Sonstige ───────────────────────────────────────
  { id: 'infra_bruecke_symbol', name: 'Brückensymbol', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['brücke', 'symbol'], keywords: ['brücke'], popularity: 40 },
  { id: 'infra_unterfuehrung_eingang', name: 'Unterführungseingang', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['unterführung', 'eingang'], keywords: ['unterführung'], popularity: 40 },
  { id: 'infra_fussgaengerueberfuehrung', name: 'Fußgängerüberführung', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['fußgänger', 'überführung'], keywords: ['fußgängerbrücke'], popularity: 40 },
  { id: 'infra_baustellenflaeche', name: 'Baustellenfläche (baulich)', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['baustelle', 'fläche'], keywords: ['baustelle'], popularity: 45 },
  { id: 'infra_aufgerissene_fahrbahn', name: 'Aufgerissene Fahrbahn', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['aufgerissen', 'fahrbahn'], keywords: ['fahrbahn aufgerissen'], popularity: 40 },
  { id: 'infra_absperrgitter_nicht_stvo', name: 'Absperrgitter (nicht StVO)', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['absperrgitter'], keywords: ['absperrgitter'], popularity: 50 },
  { id: 'infra_hydrant_boden', name: 'Hydrant (Boden)', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['hydrant', 'boden'], keywords: ['hydrant'], popularity: 35 },
  { id: 'infra_gully', name: 'Gully', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['gully', 'ablauf'], keywords: ['gully'], popularity: 35 },
  { id: 'infra_schachtdeckel', name: 'Schachtdeckel', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['schachtdeckel'], keywords: ['schachtdeckel'], popularity: 35 },
  { id: 'infra_rampe_hoehenkante', name: 'Rampe / Höhenniveaukante', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['rampe', 'höhenkante'], keywords: ['rampe', 'höhenkante'], popularity: 40 },
  { id: 'infra_podest_terrasse', name: 'Podest / Terrasse', category: 'infrastructure', subcategory: 'infra_sonstige', tags: ['podest', 'terrasse'], keywords: ['terrasse'], popularity: 40 },

  // ─── Verkehrsregelung ──────────────────────────────────────────────
  { id: 'vr_gefahr_kurve_links', name: 'Gefahrzeichen: Kurve (links)', category: 'traffic-regulation', subcategory: 'vr_gefahrzeichen', tags: ['gefahrzeichen', 'kurve', 'links'], keywords: ['gefahrzeichen kurve links'], popularity: 70 },
  { id: 'vr_vorschrift_vorfahrt_achten', name: 'Vorfahrt gewähren', category: 'traffic-regulation', subcategory: 'vr_vorschriftzeichen', tags: ['vorschriftzeichen', 'vorfahrt gewähren'], keywords: ['vorfahrt achten'], popularity: 80 },
  { id: 'vr_richt_vorfahrtstrasse', name: 'Vorfahrtstraße', category: 'traffic-regulation', subcategory: 'vr_richtzeichen', tags: ['richtzeichen', 'vorfahrtstraße'], keywords: ['vorfahrtstraße'], popularity: 80 },
  { id: 'vr_ampel_standard', name: 'Lichtzeichenanlage (Standard)', category: 'traffic-regulation', subcategory: 'vr_ampeln', tags: ['ampel'], keywords: ['ampel'], popularity: 85 },
  { id: 'vr_bodenmarkierung_haltlinie', name: 'Bodenmarkierung: Haltlinie', category: 'traffic-regulation', subcategory: 'vr_bodenmarkierungen', tags: ['haltlinie', 'markierung'], keywords: ['haltlinie'], popularity: 75 },

  // ─── Umgebung: Vegetation ──────────────────────────────────────────
  { id: 'env_baum_laub', name: 'Baum (Laub)', category: 'environment', subcategory: 'um_vegetation', tags: ['baum', 'laubbaum'], keywords: ['baum'], popularity: 60 },
  { id: 'env_baum_nadel', name: 'Baum (Nadel)', category: 'environment', subcategory: 'um_vegetation', tags: ['baum', 'nadelbaum'], keywords: ['baum'], popularity: 50 },
  { id: 'env_busch', name: 'Busch', category: 'environment', subcategory: 'um_vegetation', tags: ['busch'], keywords: ['busch'], popularity: 50 },
  { id: 'env_hecke', name: 'Hecke', category: 'environment', subcategory: 'um_vegetation', tags: ['hecke'], keywords: ['hecke'], popularity: 50 },

  // ─── Umgebung: Stadtmöbel ─────────────────────────────────────────
  { id: 'env_bank', name: 'Bank', category: 'environment', subcategory: 'um_stadtmoebel', tags: ['bank', 'sitzgelegenheit'], keywords: ['bank'], popularity: 55 },
  { id: 'env_papierkorb', name: 'Papierkorb', category: 'environment', subcategory: 'um_stadtmoebel', tags: ['papierkorb'], keywords: ['papierkorb'], popularity: 45 },
  { id: 'env_laterne', name: 'Straßenlaterne', category: 'environment', subcategory: 'um_stadtmoebel', tags: ['laterne'], keywords: ['straßenlaterne'], popularity: 55 },
  { id: 'env_bushaltestelle', name: 'Bushaltestellen-Element', category: 'environment', subcategory: 'um_stadtmoebel', tags: ['bushaltestelle'], keywords: ['bushaltestelle'], popularity: 50 },

  // ─── Umgebung: Mensch & Tier ───────────────────────────────────────
  { id: 'env_reh', name: 'Reh', category: 'environment', subcategory: 'um_mensch_tier', tags: ['reh', 'wild'], keywords: ['reh'], popularity: 60 },

  // ─── Umgebung: Gebäude ─────────────────────────────────────────────
  { id: 'env_haus_einfamilien', name: 'Einfamilienhaus', category: 'environment', subcategory: 'um_gebaeude_bauliches', tags: ['haus', 'einfamilienhaus'], keywords: ['haus'], popularity: 60 },
  { id: 'env_mehrfamilienhaus', name: 'Mehrfamilienhaus', category: 'environment', subcategory: 'um_gebaeude_bauliches', tags: ['haus', 'mehrfamilienhaus'], keywords: ['mehrfamilienhaus'], popularity: 50 },
  { id: 'env_garage', name: 'Garage', category: 'environment', subcategory: 'um_gebaeude_bauliches', tags: ['garage'], keywords: ['garage'], popularity: 55 },

  // ─── Umgebung: Technische Objekte ──────────────────────────────────
  { id: 'env_verteilerkasten', name: 'Verteilerkasten', category: 'environment', subcategory: 'um_technische_objekte', tags: ['verteilerkasten'], keywords: ['verteilerkasten'], popularity: 40 },
  { id: 'env_trafohaus', name: 'Trafohaus', category: 'environment', subcategory: 'um_technische_objekte', tags: ['trafohaus'], keywords: ['trafohaus'], popularity: 40 },
  { id: 'env_mast', name: 'Mast', category: 'environment', subcategory: 'um_technische_objekte', tags: ['mast'], keywords: ['mast'], popularity: 40 },

  // ─── Umgebung: Müll & Container ────────────────────────────────────
  { id: 'env_muelltonne', name: 'Mülltonne', category: 'environment', subcategory: 'um_muells_container', tags: ['mülltonne'], keywords: ['mülltonne'], popularity: 45 },
  { id: 'env_altglas_container', name: 'Altglascontainer', category: 'environment', subcategory: 'um_muells_container', tags: ['altglas', 'container'], keywords: ['altglascontainer'], popularity: 45 },
  { id: 'env_container_gross', name: 'Großcontainer', category: 'environment', subcategory: 'um_muells_container', tags: ['container'], keywords: ['container'], popularity: 40 },

  // ─── Umgebung: Sonstige ────────────────────────────────────────────
  { id: 'env_zaun', name: 'Zaun', category: 'environment', subcategory: 'um_sonstige', tags: ['zaun'], keywords: ['zaun'], popularity: 50 },
  { id: 'env_poller', name: 'Poller', category: 'environment', subcategory: 'um_sonstige', tags: ['poller'], keywords: ['poller'], popularity: 50 },
  { id: 'env_schildhalter', name: 'Schildhalter', category: 'environment', subcategory: 'um_sonstige', tags: ['schildhalter'], keywords: ['schildhalter'], popularity: 40 },

  // ─── Markierungen ──────────────────────────────────────────────────
  { id: 'mark_pfeil_gerade', name: 'Pfeil (gerade)', category: 'markings', subcategory: 'mark_pfeile', tags: ['pfeil', 'gerade'], keywords: ['pfeil'], popularity: 90 },
  { id: 'mark_pfeil_links', name: 'Pfeil (links)', category: 'markings', subcategory: 'mark_pfeile', tags: ['pfeil', 'links'], keywords: ['pfeil links'], popularity: 80 },
  { id: 'mark_pfeil_rechts', name: 'Pfeil (rechts)', category: 'markings', subcategory: 'mark_pfeile', tags: ['pfeil', 'rechts'], keywords: ['pfeil rechts'], popularity: 80 },
  { id: 'mark_kollision_stern', name: 'Kollisionssymbol (Stern)', category: 'markings', subcategory: 'mark_kollisionen', tags: ['kollision', 'crash'], keywords: ['kollision'], popularity: 85 },
  { id: 'mark_bremsspur', name: 'Bremsspur', category: 'markings', subcategory: 'mark_spuren', tags: ['bremsspur'], keywords: ['bremsspur'], popularity: 80 },
  { id: 'mark_text_info', name: 'Textfeld / Info', category: 'markings', subcategory: 'mark_text_info', tags: ['text', 'info'], keywords: ['textfeld'], popularity: 70 },
  { id: 'mark_massband', name: 'Maßband / Distanz', category: 'markings', subcategory: 'mark_masse_distanzen', tags: ['maß', 'distanz'], keywords: ['maßband'], popularity: 75 },
  { id: 'mark_symbol_person', name: 'Symbol: Person', category: 'markings', subcategory: 'mark_symbole', tags: ['symbol', 'person'], keywords: ['symbol person'], popularity: 50 },
  { id: 'mark_nordpfeil', name: 'Nordpfeil', category: 'markings', subcategory: 'mark_orientierung', tags: ['nordpfeil', 'orientierung'], keywords: ['nordpfeil'], popularity: 60 },
]

// ── Search Utility ─────────────────────────────────────────────────────

export function searchLibrary(items: LibraryItem[], query: string): LibraryItem[] {
  const q = query.toLowerCase()
  return items.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.tags.some(t => t.toLowerCase().includes(q)) ||
    (item.keywords?.some(k => k.toLowerCase().includes(q))) ||
    item.category.toLowerCase().includes(q) ||
    item.subcategory.toLowerCase().includes(q)
  )
}

// ── Helpers ────────────────────────────────────────────────────────────

export function getItemsForCategory(category: string): LibraryItem[] {
  return LIBRARY_ITEMS.filter(item => item.category === category)
}

export function getItemsForSubcategory(category: string, subcategory: string): LibraryItem[] {
  return LIBRARY_ITEMS.filter(item => item.category === category && item.subcategory === subcategory)
}

export function getSubcategoryLabel(subcategoryId: string): string {
  for (const subs of Object.values(LIBRARY_SUBCATEGORIES)) {
    const found = subs.find(s => s.id === subcategoryId)
    if (found) return found.label
  }
  return subcategoryId
}
