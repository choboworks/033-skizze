// ============================================================
// SmartRoads – Type Definitions (Constrained Editor)
// ============================================================

// --- Strip Types (road cross-section elements) ---
export type StripType =
  | 'lane'          // Fahrstreifen
  | 'sidewalk'      // Gehweg
  | 'cyclepath'     // Radweg
  | 'parking'       // Parkstreifen
  | 'green'         // Grünstreifen
  | 'curb'          // Bordstein
  | 'gutter'        // Rinne
  | 'median'        // Mittelstreifen
  | 'bus'           // Busstreifen
  | 'tram'          // Gleiskörper
  | 'shoulder'      // Seitenstreifen / Bankett

// --- Strip Variants ---
export type StripVariant =
  // Lane
  | 'standard'
  | 'turn-left'
  | 'turn-right'
  | 'multi-use'
  // Cyclepath
  | 'protected'       // baulich getrennt
  | 'lane-marked'     // Radfahrstreifen (durchgezogen)
  | 'advisory'        // Schutzstreifen (gestrichelt)
  // Sidewalk
  | 'shared-bike'     // Gemeinsamer Geh-/Radweg
  | 'separated-bike'  // Getrennter Geh-/Radweg
  // Parking
  | 'parallel'        // Längsparken
  | 'angled'          // Schrägparken
  | 'perpendicular'   // Querparken
  // Median
  | 'marking-only'    // Nur Markierung
  | 'green-median'    // Grünstreifen
  | 'barrier'         // Leitplanke
  // Green
  | 'tree-strip'      // Baumstreifen
  // Tram
  | 'dedicated'       // Eigentrasse
  | 'flush'           // Bündig

// --- Strip (a single cross-section element) ---
export interface Strip {
  id: string
  type: StripType
  variant: StripVariant
  width: number             // Meter (die Quelle der Wahrheit)
  direction?: 'up' | 'down' // Fahrtrichtung (nur für lane, bus)
}

// --- Marking Types ---
export type MarkingType =
  | 'centerline'        // Leitlinie (gestrichelt)
  | 'laneboundary'      // Fahrstreifenbegrenzung (durchgezogen)
  | 'stopline'          // Haltelinie
  | 'crosswalk'         // Zebrastreifen / Fußgängerüberweg
  | 'arrow'             // Richtungspfeil
  | 'blocked-area'      // Sperrfläche (Schraffur)
  | 'yield-line'        // Wartelinie (Haifischzähne)
  | 'bike-crossing'     // Radfurt
  | 'bus-stop'          // Bushaltestellenmarkierung
  | 'speed-limit'       // Tempo-Piktogramm
  | 'parking-marking'   // Parkflächenmarkierung
  | 'free-line'         // Freie Linie

// --- Marking Variants ---
export type MarkingVariant =
  // Centerline
  | 'standard-dash'     // Leitlinie innerorts: 3m/6m
  | 'rural-dash'        // Leitlinie außerorts/Landstraße: 6m/12m
  | 'autobahn-dash'     // Leitlinie Autobahn: 6m/12m, 15cm breit
  | 'short-dash'        // Kurze Leitlinie: 1.5m/3m
  | 'warning-dash'      // Warnlinie innerorts: 6m/3m
  | 'autobahn-warning'  // Warnlinie Autobahn: 12m/6m
  // Lane boundary
  | 'solid'
  | 'double'
  // Arrow
  | 'straight'
  | 'left'
  | 'right'
  | 'straight-left'
  | 'straight-right'
  // Speed limit
  | 'tempo-30'
  | 'tempo-50'
  // Free line
  | 'custom'
  // Default
  | 'default'

// --- Marking (freely placed on the top-down view) ---
export interface Marking {
  id: string
  type: MarkingType
  variant: MarkingVariant
  // Position on the top-down view (in meters, relative to road origin)
  x: number
  y: number
  // Optional sizing
  width?: number          // Meter (e.g. crosswalk width = road width)
  rotation?: number       // Degrees
  // Free line specific
  strokeWidth?: number
  dashPattern?: number[]
  color?: string
}

// --- Road Class (determines marking dimensions) ---
export type RoadClass = 'innerorts' | 'ausserorts' | 'autobahn'

// --- Road States (per segment type) ---

export interface StraightRoadState {
  strips: Strip[]
  markings: Marking[]
  length: number           // Meter
  roadClass?: RoadClass    // defaults to 'innerorts' if absent
}

export interface CurveRoadState {
  strips: Strip[]
  markings: Marking[]
  radius: number           // Meter (Kurvenradius, gemessen an der Straßenmitte)
  angle: number            // Grad (Bogenwinkel)
}

export interface IntersectionArm {
  id: string
  angle: number            // Grad (Richtung des Arms, 0° = Norden)
  strips: Strip[]          // Querschnitt dieses Arms
  cornerRadius: number     // Meter (Eckradius)
  hasCrosswalk: boolean
  hasSignal: boolean       // Ampel
}

export interface IntersectionState {
  template: 'T' | 'fourWay' | 'Y' | 'fiveWay' | 'custom'
  arms: IntersectionArm[]
  markings: Marking[]
}

export interface RoundaboutApproach {
  id: string
  angle: number            // Grad (Richtung der Zufahrt)
  strips: Strip[]          // Querschnitt dieser Zufahrt
  hasCrosswalk: boolean
}

export interface RoundaboutState {
  preset: 'mini' | 'compact' | 'large'
  outerRadius: number      // Meter
  laneWidth: number        // Meter (Kreisfahrbahnbreite)
  overridable: boolean     // Überfahrbarer Innenring
  approaches: RoundaboutApproach[]
  markings: Marking[]
}

// --- Union type for all road states ---
export type RoadState =
  | { subtype: 'straight'; state: StraightRoadState }
  | { subtype: 'curve'; state: CurveRoadState }
  | { subtype: 'intersection'; state: IntersectionState }
  | { subtype: 'roundabout'; state: RoundaboutState }

// --- Preset Definition ---
export interface PresetDefinition {
  id: string
  label: string            // "Hauptverkehrsstraße", "T-Kreuzung", etc.
  subtype: 'straight' | 'curve' | 'intersection' | 'roundabout'
  state: StraightRoadState | CurveRoadState | IntersectionState | RoundaboutState
}
