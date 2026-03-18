import type { StripType, StripVariant, Strip, StraightRoadState } from './types'

// ============================================================
// SmartRoads – Constants & Defaults (RASt-basiert)
// ============================================================

// --- Default Strip Widths in Meters (RASt guidelines) ---
export const STRIP_WIDTH_DEFAULTS: Record<StripType, number> = {
  lane: 3.25,
  sidewalk: 2.50,
  cyclepath: 1.85,
  parking: 2.00,
  green: 2.00,
  curb: 0.15,
  gutter: 0.30,
  median: 0.15,
  bus: 3.50,
  tram: 3.00,
  shoulder: 1.50,
}

// --- Variant-specific Width Overrides ---
export const VARIANT_WIDTH_OVERRIDES: Partial<Record<StripVariant, number>> = {
  advisory: 1.50,          // Schutzstreifen schmaler
  angled: 4.50,            // Schrägparken breiter
  perpendicular: 5.00,     // Querparken am breitesten
  'green-median': 3.00,    // Grüner Mittelstreifen breiter
  barrier: 0.60,           // Leitplanke
  'tree-strip': 2.50,      // Baumstreifen breiter
}

// --- Minimum Widths (enforced in Strip-Editor) ---
export const STRIP_MIN_WIDTHS: Record<StripType, number> = {
  lane: 2.75,
  sidewalk: 1.50,
  cyclepath: 1.00,
  parking: 1.80,
  green: 0.50,
  curb: 0.15,              // Bordstein: feste Breite, nicht resizebar
  gutter: 0.20,
  median: 0.10,
  bus: 3.00,
  tram: 2.50,
  shoulder: 0.50,
}

// --- Fixed-width strips (not resizeable by user) ---
export const FIXED_WIDTH_STRIPS: StripType[] = ['curb', 'gutter']

// --- Strip Colors for Rendering ---
export const STRIP_COLORS: Record<StripType, string> = {
  lane: '#3a3a3a',         // Asphalt dunkelgrau
  sidewalk: '#c8c0b0',     // Pflaster beige
  cyclepath: '#8b4513',    // Radweg braun/rot
  parking: '#555555',      // Parkstreifen mittelgrau
  green: '#7a9a5a',        // Grünstreifen
  curb: '#999999',         // Bordstein hellgrau
  gutter: '#888888',       // Rinne
  median: '#444444',       // Mittelstreifen
  bus: '#3a3a3a',          // Busstreifen = Asphalt
  tram: '#555555',         // Gleiskörper
  shoulder: '#999999',     // Seitenstreifen
}

// --- Strip Display Names (German, for UI) ---
export const STRIP_LABELS: Record<StripType, string> = {
  lane: 'Fahrstreifen',
  sidewalk: 'Gehweg',
  cyclepath: 'Radweg',
  parking: 'Parkstreifen',
  green: 'Grünstreifen',
  curb: 'Bordstein',
  gutter: 'Rinne',
  median: 'Mittelstreifen',
  bus: 'Busstreifen',
  tram: 'Gleiskörper',
  shoulder: 'Seitenstreifen',
}

// --- Variant Display Names ---
export const VARIANT_LABELS: Partial<Record<StripVariant, string>> = {
  standard: 'Standard',
  'turn-left': 'Abbiegespur Links',
  'turn-right': 'Abbiegespur Rechts',
  'multi-use': 'Mehrzweckstreifen',
  protected: 'Baulich getrennt',
  'lane-marked': 'Radfahrstreifen',
  advisory: 'Schutzstreifen',
  'shared-bike': 'Gemeinsamer Geh-/Radweg',
  'separated-bike': 'Getrennter Geh-/Radweg',
  parallel: 'Längsparken',
  angled: 'Schrägparken',
  perpendicular: 'Querparken',
  'marking-only': 'Markierung',
  'green-median': 'Grünstreifen',
  barrier: 'Leitplanke',
  'tree-strip': 'Baumstreifen',
  dedicated: 'Eigentrasse',
  flush: 'Bündig',
}

// --- Default Road Length ---
export const DEFAULT_ROAD_LENGTH = 30 // Meter

// --- Helper: Create a strip with defaults ---
export function createStrip(
  type: StripType,
  variant: StripVariant = 'standard',
  direction?: 'up' | 'down',
): Strip {
  const width = VARIANT_WIDTH_OVERRIDES[variant] ?? STRIP_WIDTH_DEFAULTS[type]
  return {
    id: crypto.randomUUID(),
    type,
    variant,
    width,
    direction,
  }
}

// --- Default Straight Road: 2 lanes + sidewalk on both sides ---
export function createDefaultStraightRoad(): StraightRoadState {
  return {
    length: DEFAULT_ROAD_LENGTH,
    strips: [
      createStrip('sidewalk', 'standard'),
      createStrip('curb', 'standard'),
      createStrip('lane', 'standard', 'up'),
      createStrip('lane', 'standard', 'down'),
      createStrip('curb', 'standard'),
      createStrip('sidewalk', 'standard'),
    ],
    markings: [],
  }
}

// --- Utility: Total width of a strip array ---
export function totalWidth(strips: Strip[]): number {
  return strips.reduce((sum, s) => sum + s.width, 0)
}
