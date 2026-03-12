// src/modules/library/roads/templates.ts
// SVG-Templates für SmartRoads

/**
 * Basis-Template für gerade 2-spurige Straße
 * 
 * WICHTIG: IDs müssen mit Generator-Modulen übereinstimmen:
 * - road-body: Gruppe mit Fahrbahn-Rects
 * - road-edges: Gruppe mit Randlinien
 * - lane-markings: Gruppe für Spurlinien (wird vom Generator befüllt)
 */
const ROAD_STRAIGHT_2LANE = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 200" width="80" height="200">
  <defs>
    <pattern id="pattern-asphalt" patternUnits="userSpaceOnUse" width="20" height="20">
      <rect width="20" height="20" fill="#6b6b6b"/>
      <circle cx="5" cy="5" r="1" fill="#5a5a5a"/>
      <circle cx="15" cy="15" r="1" fill="#5a5a5a"/>
    </pattern>
  </defs>
  
  <!-- Fahrbahn (Gruppe für Generator) -->
  <g id="road-body">
    <rect x="0" y="0" width="80" height="200" fill="#6b6b6b"/>
  </g>
  
  <!-- Randlinien (Gruppe für Generator) -->
  <g id="road-edges">
    <rect id="edge-left" x="0" y="0" width="2" height="200" fill="#ffffff"/>
    <rect id="edge-right" x="78" y="0" width="2" height="200" fill="#ffffff"/>
  </g>
  
  <!-- Spurmarkierungen (wird vom Generator befüllt) -->
  <g id="lane-markings">
    <line x1="40" y1="0" x2="40" y2="200" stroke="#ffffff" stroke-width="2" stroke-dasharray="12 20"/>
  </g>
  
  <!-- Connectors (unsichtbar) -->
  <rect id="conn-top" x="38" y="0" width="4" height="4" fill="transparent"/>
  <rect id="conn-bottom" x="38" y="196" width="4" height="4" fill="transparent"/>
</svg>`

/**
 * Basis-Template für 90° Rechtskurve
 * Mittelpunkt: links unten (0, 200)
 * Außenradius: 200, Innenradius: 100
 * Eingang: oben (vertikal), Ausgang: rechts (horizontal)
 */
const ROAD_CURVE_RIGHT = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <!-- Fahrbahn: Viertelkreis-Ring -->
  <path id="road-surface" d="M200,100V0C89.5,0,0,89.5,0,200h100c0-55.2,44.8-100,100-100Z" fill="#6b6b6b"/>
  
  <!-- Spurmarkierungen (werden vom Generator ersetzt) -->
  <path id="lane-marking-1" d="M180.8,49.1c-13.4,1.7-26.3,5.1-38.4,10.1l1.5,3.7c11.8-4.8,24.3-8.2,37.4-9.8,0,0-.5-4-.5-4Z" fill="#fff"/>
  <path id="lane-marking-2" d="M107.9,78.9c-10.6,8.1-20.1,17.5-28.2,28l3.2,2.4c7.9-10.2,17.2-19.4,27.5-27.3,0,0-2.4-3.2-2.4-3.2Z" fill="#fff"/>
  <path id="lane-marking-3" d="M63.3,142.8l-3.7-1.5c-5.1,12.1-8.6,24.9-10.4,38.4l4,.5c1.7-13.1,5.2-25.6,10.1-37.4h0Z" fill="#fff"/>
  
  <!-- Randlinien -->
  <path id="edge-outer" d="M200,2c-109.4,0-198,88.6-198,198h3c0-107.7,87.3-195,195-195v-3Z" fill="#e7e6e6"/>
  <path id="edge-inner" d="M200,98v-3c-58,0-105,47-105,105h3c0-56.3,45.7-102,102-102h0Z" fill="#e7e6e6"/>
  
  <!-- Connectors (unsichtbar) -->
  <rect id="conn-top" x="196" y="48" width="4" height="4" fill="transparent"/>
  <rect id="conn-bottom" x="48" y="196" width="4" height="4" fill="transparent"/>
</svg>`

/**
 * Template-Registry
 */
const TEMPLATES: Record<string, string> = {
  'road-straight-2lane': ROAD_STRAIGHT_2LANE,
  'road-curve': ROAD_CURVE_RIGHT,
  'road-curve-right': ROAD_CURVE_RIGHT,
}

/**
 * Holt ein Road-Template nach Key
 */
export function getRoadTemplate(key: string): string | undefined {
  return TEMPLATES[key]
}

/**
 * Alle verfügbaren Template-Keys
 */
export function getTemplateKeys(): string[] {
  return Object.keys(TEMPLATES)
}