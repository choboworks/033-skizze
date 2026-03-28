// ============================================================
// SmartRoads - Type Definitions (Constrained Editor)
// ============================================================

// --- Strip Types (road cross-section elements) ---
export type StripType =
  | 'lane'          // Fahrstreifen
  | 'sidewalk'      // Gehweg
  | 'cyclepath'     // Radweg
  | 'parking'       // Parkstreifen
  | 'green'         // Gruenstreifen
  | 'curb'          // Bordstein
  | 'gutter'        // Rinne
  | 'median'        // Mittelstreifen
  | 'bus'           // Busstreifen
  | 'tram'          // Gleiskoerper
  | 'shoulder'      // Seitenstreifen / Bankett
  | 'path'          // Weg (Feldweg, Schotterweg, Waldweg)
  | 'guardrail'     // Leitplanke / Fahrzeug-Rueckhaltesystem

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
  | 'parallel'        // Laengsparken
  | 'angled'          // Schraegparken
  | 'perpendicular'   // Querparken
  // Median
  | 'marking-only'    // Nur Markierung
  | 'green-median'    // Gruenstreifen
  | 'barrier'         // Leitplanke
  // Green
  | 'tree-strip'      // Baumstreifen
  // Tram
  | 'dedicated'       // Eigentrasse
  | 'flush'           // Buendig
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
export type SidewalkSurfaceType = 'slabs' | 'paving' | 'natural-stone' | 'clinker' | 'asphalt'
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
  postSpacing?: number
  showShoulder?: boolean
  shoulderWidth?: number
  showGreen?: boolean
  greenWidth?: number
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
  width: number
  height?: number
  color?: string
  props?: StripProps
  direction?: 'up' | 'down'
}

// --- Marking Types ---
export type MarkingType =
  | 'centerline'
  | 'laneboundary'
  | 'stopline'
  | 'crosswalk'
  | 'arrow'
  | 'blocked-area'
  | 'yield-line'
  | 'bike-crossing'
  | 'bus-stop'
  | 'speed-limit'
  | 'parking-marking'
  | 'free-line'
  | 'traffic-island'

// --- Marking Variants ---
export type MarkingVariant =
  // Centerline
  | 'standard-dash'
  | 'rural-dash'
  | 'autobahn-dash'
  | 'short-dash'
  | 'warning-dash'
  | 'rural-warning'
  | 'autobahn-warning'
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
  | 'raised-paved'
  // Default
  | 'default'

export type TrafficIslandPreset = 'standard' | 'barrier-free' | 'bike-crossing' | 'free'
export type TrafficIslandSurfaceType = 'green' | 'paved' | 'cobblestone'
export type TrafficIslandCurbType = 'flat'
export type TrafficIslandEntryTreatment = 'none' | 'round-3cm' | 'kassel' | 'separated-0-6'
export type BikeCrossingSurfaceType = 'cyclepath' | 'crosswalk'
export type LinkedCrossingType = 'crosswalk' | 'bike-crossing'

// --- Marking (freely placed on the top-down view) ---
export interface Marking {
  id: string
  type: MarkingType
  variant: MarkingVariant
  x: number
  y: number
  width?: number
  length?: number
  offsetY?: number
  rotation?: number
  strokeWidth?: number
  dashPattern?: number[]
  color?: string
  linkedIslandId?: string
  // Traffic island specific
  crossingAidPreset?: TrafficIslandPreset
  surfaceType?: TrafficIslandSurfaceType
  curbType?: TrafficIslandCurbType
  entryTreatment?: TrafficIslandEntryTreatment
  endShape?: string
  endTaperLength?: number
  showCurbBorder?: boolean
  showApproachMarking?: boolean
  approachLength?: number
  // Bike-crossing specific fields
  bikeCrossingSurfaceType?: BikeCrossingSurfaceType
  bikeCrossingBoundaryLineMode?: CyclepathLineMode
  bikeCrossingBoundaryLineStrokeWidth?: number
  bikeCrossingBoundaryLineDashLength?: number
  bikeCrossingBoundaryLineGapLength?: number
}

// --- Road Class (determines marking dimensions) ---
export type RoadClass = 'innerorts' | 'ausserorts' | 'autobahn'

// --- Road States (per segment type) ---
export interface StraightRoadState {
  strips: Strip[]
  markings: Marking[]
  suppressedCenterlines?: Marking[]
  layerOrder?: string[]
  length: number
  roadClass?: RoadClass
}

export interface CurveRoadState {
  strips: Strip[]
  markings: Marking[]
  radius: number
  angle: number
}

export interface IntersectionArm {
  id: string
  angle: number
  strips: Strip[]
  cornerRadius: number
  hasCrosswalk: boolean
  hasSignal: boolean
}

export interface IntersectionState {
  template: 'T' | 'fourWay' | 'Y' | 'fiveWay' | 'custom'
  arms: IntersectionArm[]
  markings: Marking[]
}

export interface RoundaboutApproach {
  id: string
  angle: number
  strips: Strip[]
  hasCrosswalk: boolean
}

export interface RoundaboutState {
  preset: 'mini' | 'compact' | 'large'
  outerRadius: number
  laneWidth: number
  overridable: boolean
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
  label: string
  subtype: 'straight' | 'curve' | 'intersection' | 'roundabout'
  state: StraightRoadState | CurveRoadState | IntersectionState | RoundaboutState
}
