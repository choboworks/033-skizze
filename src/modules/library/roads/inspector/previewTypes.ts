// src/modules/library/roads/inspector/previewTypes.ts
// Types und Konstanten für InteractiveRoadPreview

// Hover-Zone Types
export type ZoneType = 
  | 'surface' 
  | 'median' 
  | 'laneLine' 
  | 'sidewalk' 
  | 'cyclePath' 
  | 'cyclePathLine'  // Radweg-Trennlinie (baulich getrennt)
  | 'onRoadCyclePath'     // NEU: Radfahrstreifen/Schutzstreifen auf Fahrbahn
  | 'onRoadCyclePathLine' // NEU: Linie des Radstreifens auf Fahrbahn
  | 'curb' 
  | 'greenStrip' 
  | 'barrier'
  | 'emergencyLane'  // Standstreifen (nur Außerorts/Autobahn)
  | 'parking'        // Parkplätze (nur Innerorts)
  | 'ramp'           // Beschleunigungsstreifen (nur Außerorts/Autobahn)
  | 'tram'           // Straßenbahn-Gleise
  | 'addLeft' 
  | 'addRight'

export type ZoneSide = 'left' | 'right'

export type HoveredZone = {
  type: ZoneType
  side?: ZoneSide
  index?: number  // Für Spurlinien
} | null

// Popup Position
export type PopupPosition = {
  x: number
  y: number
  zone: ZoneType
  side?: ZoneSide
  index?: number
} | null

// Linie für Spurmarkierungen
export type LaneLineInfo = {
  x: number           // X-Position relativ zur Fahrbahn
  index: number       // Index der Linie (0 = zwischen Spur 0 und 1)
  type: string        // LineType (dashed, solid, barrier, green-strip, etc.)
  width?: number      // Physische Breite bei barrier/green-strip
  isPhysical?: boolean // Ob die Linie physischen Platz einnimmt
}

// Highlight-Farben für Zonen - jedes Element hat eine eigene Farbe
export const ZONE_COLORS: Record<ZoneType, string> = {
  surface: 'rgba(249, 115, 22, 0.25)',      // Orange - Fahrbahn
  median: 'rgba(34, 197, 94, 0.35)',        // Grün - Mittellinie
  laneLine: 'rgba(59, 130, 246, 0.4)',      // Blau - Spurlinien
  sidewalk: 'rgba(168, 162, 158, 0.4)',     // Grau/Beige - Gehweg
  cyclePath: 'rgba(239, 68, 68, 0.35)',     // Rot - Radweg (baulich getrennt)
  cyclePathLine: 'rgba(6, 182, 212, 0.5)',  // Cyan - Radweg-Trennlinie
  onRoadCyclePath: 'rgba(239, 68, 68, 0.35)',     // Rot - Radstreifen auf Fahrbahn
  onRoadCyclePathLine: 'rgba(6, 182, 212, 0.5)',  // Cyan - Radstreifen-Linie
  curb: 'rgba(168, 85, 247, 0.45)',         // Lila/Violett - Bordstein
  greenStrip: 'rgba(74, 124, 89, 0.4)',     // Grün - Grünfläche
  barrier: 'rgba(251, 191, 36, 0.45)',      // Gelb/Amber - Leitplanke
  emergencyLane: 'rgba(107, 114, 128, 0.4)', // Grau - Standstreifen
  parking: 'rgba(99, 102, 241, 0.4)',       // Indigo - Parkplätze
  ramp: 'rgba(14, 165, 233, 0.35)',         // Sky Blue - Beschleunigungsstreifen
  tram: 'rgba(245, 158, 11, 0.35)',         // Amber - Straßenbahn
  addLeft: 'transparent',
  addRight: 'transparent',
}

export const ZONE_BORDER_COLORS: Record<ZoneType, string> = {
  surface: '#f97316',
  median: '#22c55e', 
  laneLine: '#3b82f6',
  sidewalk: '#78716c',
  cyclePath: '#ef4444',
  cyclePathLine: '#06b6d4',    // Cyan
  onRoadCyclePath: '#ef4444',  // Rot
  onRoadCyclePathLine: '#06b6d4', // Cyan
  curb: '#a855f7',             // Lila/Violett
  greenStrip: '#4a7c59',
  barrier: '#f59e0b',          // Amber
  emergencyLane: '#6b7280',    // Grau - Standstreifen
  parking: '#6366f1',          // Indigo - Parkplätze
  ramp: '#0ea5e9',             // Sky Blue - Beschleunigungsstreifen
  tram: '#f59e0b',             // Amber - Straßenbahn
  addLeft: 'transparent',
  addRight: 'transparent',
}

// Farben für Seitenbereiche
export const ROADSIDE_COLORS = {
  sidewalk: {
    concrete: '#b8b8b8',
    tiles: '#c8c0b0',
    pavement: '#a0a0a0',
  },
  curb: {
    standard: '#4a4a4a',
    lowered: '#606060',
    none: 'transparent',
  },
  cyclePath: {
    separated: '#c45c5c',  // Rot
    lane: 'rgba(196, 92, 92, 0.3)',
    advisory: 'rgba(196, 92, 92, 0.15)',
  },
} as const

// Popup-Höhen für Positionierung
export const POPUP_HEIGHTS: Record<string, number> = {
  'sidewalk': 320,
  'cyclePath': 320,
  'cyclePathLine': 180,
  'onRoadCyclePath': 280,      // NEU
  'onRoadCyclePathLine': 180,  // NEU
  'curb': 200,
  'greenStrip': 220,
  'barrier': 150,
  'emergencyLane': 220,        // Standstreifen
  'parking': 280,              // Parkplätze
  'ramp': 120,                 // Beschleunigungsstreifen (nur Entfernen-Button)
  'tram': 320,                 // Straßenbahn
  'laneLine': 180,
  'median': 250,
  'surface': 220,
  'addLeft': 350,              // Erhöht für mehr Optionen
  'addRight': 350,
}