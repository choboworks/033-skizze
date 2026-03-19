import type { StripType, StripVariant, Strip, Marking, MarkingVariant, StraightRoadState, RoadClass } from './types'

// ============================================================
// SmartRoads – Constants & Defaults (RASt-basiert)
// ============================================================

// --- Default Strip Widths in Meters ---
// Sources: RASt 06, RAL 2012, ERA 2010, EFA 2002
export const STRIP_WIDTH_DEFAULTS: Record<StripType, number> = {
  lane: 3.25,          // RASt 06: einstreifig baulich getrennt 3.25m
  sidewalk: 2.50,      // RASt 06/EFA: 1.80m Verkehrsraum + 0.50m Sicherheit + 0.20m Bebauung
  cyclepath: 1.85,     // ERA 2010: Radfahrstreifen Regelbreite 1.85m
  parking: 2.00,       // RASt 06: Längsparken 2.00m
  green: 2.00,         // RASt 06: Grünstreifen
  curb: 0.15,          // DIN 483: Hochbord 15-18cm breit
  gutter: 0.30,        // Rinne/Entwässerung
  median: 0.15,        // Markierter Mittelstreifen (Schmalstrich 12cm + Toleranz)
  bus: 3.50,           // RASt 06: Busfahrstreifen 3.50m
  tram: 3.00,          // BOStrab: Gleiskörper
  shoulder: 1.50,      // RAL 2012: Bankett 1.50m
}

// --- Variant-specific Width Overrides ---
export const VARIANT_WIDTH_OVERRIDES: Partial<Record<StripVariant, number>> = {
  advisory: 1.50,          // ERA 2010: Schutzstreifen Regelbreite 1.50m
  angled: 4.50,            // RASt 06: Schrägparken 45-60°
  perpendicular: 5.00,     // RASt 06: Senkrechtparken 5.00m Tiefe
  'green-median': 3.00,    // RASt 06: begrünter Mittelstreifen
  barrier: 0.60,           // Leitplanke inkl. Aufstellbreite
  'tree-strip': 2.50,      // Baumstreifen
}

// --- Marking Dimensions (RMS-1, R-FGÜ, StVO) ---
export const MARKING_DEFAULTS = {
  // Strichbreiten (RMS-1)
  schmalstrich: 0.12,        // 12cm (andere Straßen)
  breitstrich: 0.25,         // 25cm (andere Straßen)
  schmalstrichAutobahn: 0.15, // 15cm (Autobahn)
  breitstrichAutobahn: 0.30,  // 30cm (Autobahn)
  // Haltelinie (Zeichen 294)
  stopLineWidth: 0.50,       // 50cm durchgehend
  // Zebrastreifen (Zeichen 293)
  crosswalkStripe: 0.50,     // 50cm Streifenbreite
  crosswalkGap: 0.50,        // 50cm Abstand
  crosswalkMinLength: 3.00,  // Mindestlänge 3.00m
  // Wartelinie (Zeichen 341)
  waitLineWidth: 0.50,       // 50cm breit und lang
  waitLineGap: 0.25,         // 25cm Lücke
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

// --- Road Class Config (RMS-1 / straßengrößen.md) ---
export const ROAD_CLASS_CONFIG: Record<RoadClass, {
  label: string
  centerlineVariant: MarkingVariant
  strokeWidth: number
}> = {
  innerorts: { label: 'Innerorts', centerlineVariant: 'standard-dash', strokeWidth: 0.12 },
  ausserorts: { label: 'Außerorts', centerlineVariant: 'rural-dash', strokeWidth: 0.12 },
  autobahn: { label: 'Autobahn', centerlineVariant: 'autobahn-dash', strokeWidth: 0.15 },
}

// --- Auto-generate lane markings between adjacent lanes ---
// Places a centerline between every pair of adjacent lane/bus strips.
export function generateLaneMarkings(
  strips: Strip[],
  variant: MarkingVariant = 'standard-dash',
  strokeWidth?: number,
): Marking[] {
  const markings: Marking[] = []
  let x = 0
  for (let i = 0; i < strips.length - 1; i++) {
    x += strips[i].width
    const a = strips[i]
    const b = strips[i + 1]
    if ((a.type === 'lane' || a.type === 'bus') && (b.type === 'lane' || b.type === 'bus')) {
      markings.push({
        id: crypto.randomUUID(),
        type: 'centerline',
        variant,
        x,
        y: 0,
        ...(strokeWidth ? { strokeWidth } : {}),
      })
    }
  }
  return markings
}

// --- Default Straight Road: 2 lanes, 10m long, centerline ---
export function createDefaultStraightRoad(): StraightRoadState {
  const strips = [
    createStrip('lane', 'standard', 'up'),
    createStrip('lane', 'standard', 'down'),
  ]
  return {
    length: 10,
    strips,
    markings: generateLaneMarkings(strips, 'standard-dash'),
  }
}

// --- Utility: Total width of a strip array ---
export function totalWidth(strips: Strip[]): number {
  return strips.reduce((sum, s) => sum + s.width, 0)
}
