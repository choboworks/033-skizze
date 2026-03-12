// src/modules/library/roads/types.ts

/**
 * Straßenkategorie
 */
export type RoadCategory = 'strasse'

/**
 * Straßen-Shape-Typ
 */
export type RoadShape = 
  | 'straight'        // Gerade
  | 'curve'           // Kurve
  | 'junction'        // Kreuzung
  | 'roundabout'      // Kreisel

/**
 * Linien-Typ zwischen zwei Spuren
 * Vereinheitlicht: Jede Linie zwischen Spur i und i+1 kann jeden Typ haben.
 * Der User entscheidet frei, wo welche Trennung sitzt.
 */
export type LineType = 
  | 'none'            // Keine Markierung
  | 'dashed'          // Gestrichelte Linie
  | 'solid'           // Durchgezogene Linie
  | 'double-solid'    // Doppelt durchgezogen
  | 'solid-dashed'    // Links durchgezogen, rechts gestrichelt
  | 'dashed-solid'    // Links gestrichelt, rechts durchgezogen
  | 'green-strip'     // Grünstreifen (physische Trennung)
  | 'barrier'         // Leitplanke (physische Trennung)

/**
 * Konfiguration einer einzelnen Linie zwischen zwei Spuren
 */
export type LineConfig = {
  type: LineType
  width?: number       // Breite bei green-strip/barrier (Standard: 12)
}

// ============================================================================
// Legacy-Aliase (erlaubt schrittweise Migration)
// ============================================================================
export type MedianType = LineType
export type LaneMarkingType = LineType

/**
 * Straßenoberfläche
 */
export type SurfaceType = 
  | 'asphalt'         // Asphalt
  | 'cobblestone'     // Pflastersteine
  | 'gravel'          // Schotter
  | 'concrete'        // Beton
  | 'pavement'        // Kopfsteinpflaster
  | 'custom'          // Custom Farbe

/**
 * Gehweg-Oberfläche
 */
export type SidewalkSurfaceType = 
  | 'concrete'        // Beton (hellgrau)
  | 'tiles'           // Gehwegplatten (beige/grau)
  | 'pavement'        // Pflastersteine

/**
 * Radweg-Typ
 */
export type CyclePathType = 
  | 'none'            // Kein Radweg
  | 'separated'       // Baulich getrennt (eigene Fläche, rot)
  | 'lane'            // Radfahrstreifen (auf Fahrbahn, durchgezogene Linie)
  | 'advisory'        // Schutzstreifen (auf Fahrbahn, gestrichelte Linie)

/**
 * Bordstein-Typ
 */
export type CurbType = 
  | 'none'            // Kein Bordstein
  | 'standard'        // Standard-Bordstein
  | 'lowered'         // Abgesenkter Bordstein

/**
 * Konfiguration für einen Seitenbereich (links oder rechts)
 */
export type RoadsideElementType = 'sidewalk' | 'curb' | 'cyclePath' | 'greenStrip' | 'barrier' | 'emergencyLane' | 'parking'

export const DEFAULT_ROADSIDE_ORDER: RoadsideElementType[] = [
  'emergencyLane', 'parking', 'barrier', 'cyclePath', 'greenStrip', 'curb', 'sidewalk'
]

export type RoadsideConfig = {
  order?: RoadsideElementType[]  // Reihenfolge von innen (Fahrbahn) nach außen
  sidewalk?: {
    width: number
    surface?: SidewalkSurfaceType
  }
  curb?: CurbType
  cyclePath?: {
    type: CyclePathType
    width?: number
    surface?: 'red' | 'asphalt'
    lineType?: 'dashed' | 'solid' | 'none'
  }
  greenStrip?: {
    width: number
  }
  barrier?: boolean
  emergencyLane?: {
    width: number
  }
  ramp?: {
    type: 'acceleration' | 'deceleration'
    length: number  // Länge des Streifens in px (100-300)
  }
  parking?: {
    type: 'on-road' | 'separated'
    orientation: 'parallel' | 'perpendicular' | 'angled'
    width: number
  }
}

/**
 * Straßenbahn-Gleiskörper-Typ
 */
export type TramTrackType = 
  | 'embedded'
  | 'dedicated'
  | 'grass'

/**
 * Straßenbahn-Position
 */
export type TramPosition = 'center' | 'left' | 'right'

/**
 * Straßenbahn-Konfiguration
 */
export type TramConfig = {
  tracks: 1 | 2
  trackType: TramTrackType
  position: TramPosition
  width?: number
}

/**
 * Konfiguration für eine Smart Road
 * 
 * VEREINFACHT: Kein bidirectional/lanesLeft/lanesRight/median.
 * Jede Linie zwischen Spuren ist frei konfigurierbar über lines[].
 */
export type SmartRoadConfig = {
  category: RoadCategory
  shape: RoadShape
  
  width: number
  length: number
  
  /** Gesamtanzahl Spuren */
  lanes: number
  
  curve?: {
    angle: number
    direction: 'left' | 'right'
    radius: number
  }
  
  /**
   * Linien zwischen Spuren: lines[i] = Linie zwischen Spur i und i+1
   * Array hat maximal lanes-1 Einträge.
   * Jede Linie kann frei konfiguriert werden (gestrichelt, Leitplanke, Grünstreifen, etc.)
   */
  lines?: LineConfig[]
  
  /** Globaler Fallback wenn lines[i] nicht gesetzt */
  defaultLineType?: LineType
  
  leftSide?: RoadsideConfig
  rightSide?: RoadsideConfig
  symmetricSides?: boolean
  
  surface?: {
    type: SurfaceType
    color?: string
    pattern?: string
  }
  
  features?: {
    crosswalk?: { position: number }
    trafficLights?: boolean
    stopLine?: boolean
  }
  
  markings?: RoadMarking[]
  tram?: TramConfig
}

/**
 * Gemeinsame Basis für alle Fahrbahnmarkierungen
 */
interface MarkingBase {
  id: string
  positionPercent: number   // Position entlang der Straße (0-100)
  rotation?: number         // Rotation in Grad
  scale?: number            // Einheitliche Skalierung (legacy, Fallback für scaleX/scaleY)
  scaleX?: number           // Horizontale Skalierung (1 = Standard)
  scaleY?: number           // Vertikale Skalierung (1 = Standard)
}

/**
 * Pfeilmarkierung (VZ 297)
 */
export interface ArrowMarking extends MarkingBase {
  type: 'arrow'
  arrowType: 'straight' | 'left' | 'right' | 'straight-left' | 'straight-right' | 'all' | 'half-left' | 'half-right'
  laneIndex: number
  xPercent?: number         // Freie X-Position (0-100% der Fahrbahnbreite). Überschreibt laneIndex wenn gesetzt.
}

/**
 * Zebrastreifen / Fußgängerüberweg
 */
export interface ZebraMarking extends MarkingBase {
  type: 'zebra'
  width?: number
}

/**
 * Haltelinie / Stopplinie — dicke durchgezogene Linie vor Ampeln/Stoppschildern
 * xPercent: Zentrum der Linie (0-100% der Fahrbahnbreite, Default: 50 = Mitte)
 * widthPercent: Breite der Linie (0-100% der Fahrbahnbreite, Default: 100 = ganz)
 */
export interface StopLineMarking extends MarkingBase {
  type: 'stopLine'
  xPercent?: number         // Zentrum auf der Fahrbahn (0-100%). Default: 50
  widthPercent?: number     // Breite (0-100% der Fahrbahn). Default: 100
}

/**
 * Wartelinie — unterbrochene Linie bei "Vorfahrt gewähren"
 */
export interface WaitLineMarking extends MarkingBase {
  type: 'waitLine'
  xPercent?: number
  widthPercent?: number
}

/**
 * Haifischzähne — Dreiecke quer zur Fahrtrichtung (Vorfahrt gewähren)
 */
export interface SharkTeethMarking extends MarkingBase {
  type: 'sharkTeeth'
  xPercent?: number
  widthPercent?: number
  direction: 'inward' | 'outward'
}

/**
 * Geschwindigkeitszahl auf der Fahrbahn
 */
export interface SpeedNumberMarking extends MarkingBase {
  type: 'speedNumber'
  value: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 100 | 120 | 130
  laneIndex: number
  xPercent?: number         // Freie X-Position (0-100% der Fahrbahnbreite). Überschreibt laneIndex wenn gesetzt.
}

/**
 * Fahrstreifenbegrenzung — kurzes senkrechtes Liniensegment (wie eine Spurlinie)
 * Verhalten wie Pfeile (laneIndex, positionPercent), wird senkrecht gerendert
 */
export interface LaneLineMarking extends MarkingBase {
  type: 'laneLine'
  lineType: 'solid' | 'double-solid' | 'solid-dashed' | 'dashed-solid'
  laneIndex: number
  xPercent?: number         // Freie X-Position (0-100% der Fahrbahnbreite). Überschreibt laneIndex wenn gesetzt.
}

/**
 * Sperrfläche — schraffierte Fläche auf der Fahrbahn (Zeichen 298 StVO)
 * Verhalten wie Quermarkierungen (xPercent/widthPercent für Breite)
 * Plus heightPercent für die Ausdehnung entlang der Straße
 * - hatchRect: Rechteckig (einfache Sperrfläche)
 * - hatchWedge: Keilförmig, läuft unten spitz zu (endende Spuren, Abbiegestreifen)
 * - chevron: V-förmige Pfeilmarkierungen (Ausfahrten, Einengungen)
 */
export interface BlockedAreaMarking extends MarkingBase {
  type: 'blockedArea'
  areaType: 'hatchRect' | 'hatchWedge' | 'hatchWedgeRounded' | 'hatchBogen'
  xPercent?: number         // Zentrum (0-100%). Default: 50
  widthPercent?: number     // Breite (0-100%). Default: 100
  heightPercent?: number    // Höhe/Länge entlang Straße (0-100%). Default: 15
}

/**
 * Union-Typ für alle Fahrbahnmarkierungen
 */
export type RoadMarking = ArrowMarking | ZebraMarking | StopLineMarking | WaitLineMarking | SharkTeethMarking | SpeedNumberMarking | LaneLineMarking | BlockedAreaMarking

/**
 * Markierungs-Typ als String-Union
 */
export type MarkingType = RoadMarking['type']

/**
 * Template-Definition für die Library
 */
export type RoadTemplate = {
  id: string
  label: string
  templateKey: string
  defaultConfig: SmartRoadConfig
}

/**
 * Gibt die aktive Reihenfolge der Seitenelemente zurück.
 * Nur Elemente die tatsächlich vorhanden sind werden zurückgegeben.
 * Neue Elemente die noch nicht im order-Array sind, werden ans Ende angehängt.
 */
export function getActiveOrder(side: RoadsideConfig | undefined): RoadsideElementType[] {
  if (!side) return []
  
  const order = side.order || DEFAULT_ROADSIDE_ORDER
  
  // Prüfe welche Elemente tatsächlich aktiv sind
  const isActive = (el: RoadsideElementType): boolean => {
    switch (el) {
      case 'sidewalk': return !!(side.sidewalk?.width)
      case 'curb': return !!(side.curb && side.curb !== 'none')
      case 'cyclePath': return side.cyclePath?.type === 'separated'
      case 'greenStrip': return !!(side.greenStrip?.width)
      case 'barrier': return !!side.barrier
      case 'emergencyLane': return !!(side.emergencyLane?.width)
      case 'parking': return side.parking?.type === 'separated'
      default: return false
    }
  }
  
  // Filtere auf aktive Elemente, behalte Reihenfolge aus order
  const active = order.filter(isActive)
  
  // Falls ein aktives Element nicht im order-Array ist, hinten anhängen
  const allActive = DEFAULT_ROADSIDE_ORDER.filter(el => isActive(el) && !active.includes(el))
  
  return [...active, ...allActive]
}

/**
 * Berechnet die Breite eines einzelnen Seitenelements
 */
export function getElementWidth(side: RoadsideConfig, el: RoadsideElementType): number {
  switch (el) {
    case 'sidewalk': return side.sidewalk?.width || 0
    case 'curb': return (side.curb && side.curb !== 'none') ? 3 : 0
    case 'cyclePath': return side.cyclePath?.type === 'separated' ? (side.cyclePath.width || 25) : 0
    case 'greenStrip': return side.greenStrip?.width || 0
    case 'barrier': return side.barrier ? 8 : 0
    case 'emergencyLane': return side.emergencyLane?.width || 0
    case 'parking': {
      if (side.parking?.type !== 'separated') return 0
      const orient = side.parking.orientation || 'parallel'
      const raw = side.parking.width || 25
      return orient === 'parallel' ? (raw <= 30 ? raw : 25) : (raw >= 40 ? raw : 50)
    }
    default: return 0
  }
}

/**
 * Berechnet die X-Position einer Markierung auf der Fahrbahn.
 * Wenn xPercent gesetzt ist → freie Position (0-100% der Fahrbahnbreite).
 * Sonst → Mitte der Spur (laneIndex).
 */
export function getMarkingX(
  marking: { laneIndex: number; xPercent?: number },
  roadWidth: number,
  lanes: number,
  leftSideWidth: number
): number {
  if (marking.xPercent !== undefined) {
    return leftSideWidth + (marking.xPercent / 100) * roadWidth
  }
  const laneWidth = roadWidth / lanes
  return leftSideWidth + (marking.laneIndex + 0.5) * laneWidth
}

/**
 * Berechnet x1/x2 einer Quermarkierung (Haltelinie, Wartelinie, Haifischzähne).
 * xPercent: Zentrum (Default: 50), widthPercent: Breite (Default: 100)
 */
export function getCrossMarkingBounds(
  marking: { xPercent?: number; widthPercent?: number },
  roadWidth: number,
  leftSideWidth: number
): { x1: number; x2: number; centerX: number; lineWidth: number } {
  const centerPct = marking.xPercent ?? 50
  const widthPct = marking.widthPercent ?? 100
  const halfWidthPct = widthPct / 2
  
  const x1Pct = Math.max(0, centerPct - halfWidthPct)
  const x2Pct = Math.min(100, centerPct + halfWidthPct)
  
  const x1 = leftSideWidth + (x1Pct / 100) * roadWidth
  const x2 = leftSideWidth + (x2Pct / 100) * roadWidth
  
  return { x1, x2, centerX: (x1 + x2) / 2, lineWidth: x2 - x1 }
}