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
  | 'path'          // Weg (Feldweg, Schotterweg, Waldweg)
  | 'guardrail'     // Leitplanke / Fahrzeug-Rückhaltesystem

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
  // Path
  | 'dirt'            // Erdweg / Feldweg
  | 'gravel'          // Schotterweg
  | 'forest'          // Waldweg
  // Guardrail
  | 'schutzplanke'    // Stahlschutzplanke (ESP/EDSP)
  | 'betonwand'       // Betonschutzwand (New Jersey)
  | 'doppel'          // Doppelschutzplanke (DDSP)

// --- Strip (a single cross-section element) ---
export type LaneSurfaceType = 'asphalt' | 'concrete' | 'cobblestone' | 'paving'
export interface LaneStripProps {
  startOffset?: number
  endOffset?: number
  surfaceType?: LaneSurfaceType
  boundaryLineMode?: CyclepathLineMode
  boundaryLineSides?: CyclepathBoundaryLineSides
  boundaryLineStrokeWidth?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
  boundaryLinePhase?: number
}
export type SidewalkSurfaceType = 'slabs' | 'paving' | 'natural-stone' | 'clinker' | 'asphalt' | 'gravel-bound'
export interface SidewalkStripProps {
  surfaceType?: SidewalkSurfaceType
  boundaryLineMode?: CyclepathLineMode
  boundaryLineSides?: CyclepathBoundaryLineSides
  boundaryLineStrokeWidth?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
  boundaryLinePhase?: number
}
export type CyclepathPathType = 'one-way' | 'two-way'
export type CyclepathProtectedPlacement = 'single-side' | 'both-sides'
export type CyclepathLineMode = 'none' | 'dashed' | 'solid'
export type CyclepathBoundaryLineSides = 'both' | 'left' | 'right'
export type CyclepathSide = 'left' | 'right'
export interface CyclepathStripProps {
  pathType?: CyclepathPathType
  protectedPlacement?: CyclepathProtectedPlacement
  overlaySide?: CyclepathSide
  safetyBufferWidth?: number
  centerLineMode?: CyclepathLineMode
  boundaryLineMode?: CyclepathLineMode
  boundaryLineSides?: CyclepathBoundaryLineSides
  centerLineStrokeWidth?: number
  boundaryLineStrokeWidth?: number
  centerLineDashLength?: number
  centerLineGapLength?: number
  boundaryLineDashLength?: number
  boundaryLineGapLength?: number
  centerLinePhase?: number
  boundaryLinePhase?: number
}
export type ParkingMarkingStyle = 'solid' | 'dashed' | 'none'
export interface ParkingStripProps {
  bayLength?: number
  bayOffset?: number
  angle?: number
  markingStyle?: ParkingMarkingStyle
}
export type GreenStripProps = Record<string, never>
export type CurbKind = 'standard' | 'lowered' | 'driveway'
export interface CurbStripProps {
  kind?: CurbKind
  loweredSectionLength?: number
  loweredSectionOffset?: number
}
export type GutterStripProps = Record<string, never>
export type MedianStripProps = Record<string, never>
export interface BusStripProps {
  startOffset?: number
  endOffset?: number
}
export type TramStripProps = Record<string, never>
export type ShoulderStripProps = Record<string, never>
export type PathStripProps = Record<string, never>
export interface GuardrailStripProps {
  postSpacing?: number    // Pfostenabstand in Metern (2.0 Standard, 1.33 Super-Rail)
  showShoulder?: boolean  // Randstreifen (asphaltiert) anzeigen
  shoulderWidth?: number  // Breite Randstreifen in Metern
  showGreen?: boolean     // Grünstreifen anzeigen
  greenWidth?: number     // Breite Grünstreifen in Metern
}
export interface StripPropsByType {
  lane: LaneStripProps
  sidewalk: SidewalkStripProps
  cyclepath: CyclepathStripProps
  parking: ParkingStripProps
  green: GreenStripProps
  curb: CurbStripProps
  gutter: GutterStripProps
  median: MedianStripProps
  bus: BusStripProps
  tram: TramStripProps
  shoulder: ShoulderStripProps
  path: PathStripProps
  guardrail: GuardrailStripProps
}

export type StripProps = StripPropsByType[StripType]
export interface Strip {
  id: string
  type: StripType
  variant: StripVariant
  width: number             // Meter (die Quelle der Wahrheit)
  height?: number           // Meter (optional; falls gesetzt, kuerzer als die Gesamtstrasse)
  color?: string
  props?: StripProps
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
  | 'traffic-island'    // Verkehrsinsel / Mittelinsel

// --- Marking Variants ---
export type MarkingVariant =
  // Centerline
  | 'standard-dash'     // Leitlinie innerorts: 3m/6m
  | 'rural-dash'        // Leitlinie außerorts/Landstraße: 4m/8m
  | 'autobahn-dash'     // Leitlinie Autobahn: 6m/12m, 15cm breit
  | 'short-dash'        // Kurze Leitlinie: 1.5m/3m
  | 'warning-dash'      // Warnlinie innerorts: 3m/1,5m
  | 'rural-warning'     // Warnlinie außerorts/Landstraße: 4m/2m
  | 'autobahn-warning'  // Warnlinie Autobahn: 6m/3m
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
  // Traffic island
  | 'median-island'     // Begrünt
  | 'raised-paved'      // Gepflastert
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
  length?: number         // Meter (used by linear markings like centerlines)
  offsetY?: number        // Meter (start offset for linear markings)
  rotation?: number       // Degrees
  // Free line specific
  strokeWidth?: number
  dashPattern?: number[]
  color?: string
  // Traffic island specific
  surfaceType?: string      // 'green' | 'paved' | 'cobblestone'
  endShape?: string         // 'rounded' | 'pointed' | 'flat'
  endTaperLength?: number
  showCurbBorder?: boolean
  showApproachMarking?: boolean
  approachLength?: number   // Length of the hatched approach zone in meters
}

// --- Road Class (determines marking dimensions) ---
export type RoadClass = 'innerorts' | 'ausserorts' | 'autobahn'

// --- Road States (per segment type) ---

export interface StraightRoadState {
  strips: Strip[]
  markings: Marking[]
  suppressedCenterlines?: Marking[] // hidden while a traffic island suppresses centerlines
  layerOrder?: string[]      // z-order: first = bottom, last = top
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
