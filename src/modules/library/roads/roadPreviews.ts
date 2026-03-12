// src/modules/library/roads/roadPreviews.ts
// Statische SVG-Previews für SmartRoads in Library und LayerList

/**
 * Einfache SVG-Vorschaubilder für die verschiedenen Straßentypen
 * Werden in Library-Sidebar und LayerList verwendet
 */

// Innerorts: 2-spurige Stadtstraße mit Bordstein
export const PREVIEW_INNERORTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
  <!-- Bordstein links -->
  <rect x="0" y="0" width="3" height="120" fill="#4a4a4a"/>
  <!-- Fahrbahn -->
  <rect x="3" y="0" width="74" height="120" fill="#6b6b6b"/>
  <!-- Bordstein rechts -->
  <rect x="77" y="0" width="3" height="120" fill="#4a4a4a"/>
  <!-- Mittellinie gestrichelt -->
  <line x1="40" y1="10" x2="40" y2="30" stroke="#ffffff" stroke-width="2"/>
  <line x1="40" y1="45" x2="40" y2="65" stroke="#ffffff" stroke-width="2"/>
  <line x1="40" y1="80" x2="40" y2="100" stroke="#ffffff" stroke-width="2"/>
</svg>`

// Außerorts: 2-spurige Landstraße ohne Bordstein
export const PREVIEW_AUSSERORTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
  <!-- Bankett links -->
  <rect x="0" y="0" width="5" height="120" fill="#a3a3a3"/>
  <!-- Fahrbahn -->
  <rect x="5" y="0" width="70" height="120" fill="#6b6b6b"/>
  <!-- Bankett rechts -->
  <rect x="75" y="0" width="5" height="120" fill="#a3a3a3"/>
  <!-- Randlinie links -->
  <line x1="7" y1="0" x2="7" y2="120" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Randlinie rechts -->
  <line x1="73" y1="0" x2="73" y2="120" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Mittellinie gestrichelt -->
  <line x1="40" y1="10" x2="40" y2="30" stroke="#ffffff" stroke-width="2"/>
  <line x1="40" y1="45" x2="40" y2="65" stroke="#ffffff" stroke-width="2"/>
  <line x1="40" y1="80" x2="40" y2="100" stroke="#ffffff" stroke-width="2"/>
</svg>`

// Autobahn: 4-spurig mit Leitplanke
export const PREVIEW_AUTOBAHN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120">
  <!-- Standstreifen links -->
  <rect x="0" y="0" width="10" height="120" fill="#5a5a5a"/>
  <!-- Fahrbahn links (2 Spuren) -->
  <rect x="10" y="0" width="35" height="120" fill="#6b6b6b"/>
  <!-- Leitplanke Mitte -->
  <rect x="45" y="0" width="10" height="120" fill="#888888"/>
  <rect x="48" y="0" width="4" height="120" fill="#d4d4d4"/>
  <!-- Fahrbahn rechts (2 Spuren) -->
  <rect x="55" y="0" width="35" height="120" fill="#6b6b6b"/>
  <!-- Standstreifen rechts -->
  <rect x="90" y="0" width="10" height="120" fill="#5a5a5a"/>
  <!-- Spurlinien links -->
  <line x1="27" y1="10" x2="27" y2="30" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="27" y1="45" x2="27" y2="65" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="27" y1="80" x2="27" y2="100" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Spurlinien rechts -->
  <line x1="73" y1="10" x2="73" y2="30" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="73" y1="45" x2="73" y2="65" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="73" y1="80" x2="73" y2="100" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Randlinien -->
  <line x1="10" y1="0" x2="10" y2="120" stroke="#ffffff" stroke-width="2"/>
  <line x1="90" y1="0" x2="90" y2="120" stroke="#ffffff" stroke-width="2"/>
</svg>`

// ============================================================================
// KURVEN-PREVIEWS (90° Rechtskurven - basierend auf echtem Generator-Output)
// ============================================================================

// Kurve Innerorts: 90° Rechtskurve (wie generiert, ohne Rotation)
export const PREVIEW_CURVE_INNERORTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 190 190">
  <!-- Fahrbahn -->
  <path d="M 180 0 A 180 180 0 0 0 0 180 L 80 180 A 100 100 0 0 1 180 80 Z" fill="#6b6b6b" />
  <!-- Randlinie außen -->
  <path d="M 180 1 A 179 179 0 0 0 1 180" fill="none" stroke="#e7e6e6" stroke-width="2" />
  <!-- Randlinie innen -->
  <path d="M 180 79 A 101 101 0 0 0 79 180" fill="none" stroke="#e7e6e6" stroke-width="2" />
  <!-- Mittellinie gestrichelt -->
  <path d="M 180 40 A 140 140 0 0 0 40 180" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="15 25" />
</svg>`

// Kurve Außerorts: 90° Rechtskurve mit Randlinien
export const PREVIEW_CURVE_AUSSERORTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 210 210">
  <!-- Fahrbahn -->
  <path d="M 200 0 A 200 200 0 0 0 0 200 L 80 200 A 120 120 0 0 1 200 80 Z" fill="#6b6b6b" />
  <!-- Randlinie außen -->
  <path d="M 200 5 A 195 195 0 0 0 5 200" fill="none" stroke="#ffffff" stroke-width="2" />
  <!-- Randlinie innen -->
  <path d="M 200 85 A 115 115 0 0 0 85 200" fill="none" stroke="#ffffff" stroke-width="2" />
  <!-- Mittellinie gestrichelt -->
  <path d="M 200 42 A 158 158 0 0 0 42 200" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="15 25" />
</svg>`

// Kurve Autobahn: 90° Rechtskurve mit Leitplanke und 2x2 Spuren
export const PREVIEW_CURVE_AUTOBAHN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 250 250">
  <!-- Standstreifen außen -->
  <path d="M 240 0 A 240 240 0 0 0 0 240 L 30 240 A 210 210 0 0 1 240 30 Z" fill="#5a5a5a" />
  <!-- Fahrbahn außen (2 Spuren) -->
  <path d="M 240 30 A 210 210 0 0 0 30 240 L 100 240 A 140 140 0 0 1 240 100 Z" fill="#6b6b6b" />
  <!-- Leitplanke Gesamt (dunkelgrau) -->
  <path d="M 240 100 A 140 140 0 0 0 100 240 L 116 240 A 124 124 0 0 1 240 116 Z" fill="#888888" />
  <!-- Leitplanke Mitte (hellgrau) -->
  <path d="M 240 105 A 135 135 0 0 0 105 240 L 111 240 A 129 129 0 0 1 240 111 Z" fill="#d4d4d4" />
  <!-- Fahrbahn innen (2 Spuren) -->
  <path d="M 240 116 A 124 124 0 0 0 116 240 L 180 240 A 60 60 0 0 1 240 180 Z" fill="#6b6b6b" />
  <!-- Standstreifen innen -->
  <path d="M 240 180 A 60 60 0 0 0 180 240 L 210 240 A 30 30 0 0 1 240 210 Z" fill="#5a5a5a" />
  <!-- Randlinie außen -->
  <path d="M 240 30 A 210 210 0 0 0 30 240" fill="none" stroke="#ffffff" stroke-width="2" />
  <!-- Randlinie innen -->
  <path d="M 240 210 A 30 30 0 0 0 210 240" fill="none" stroke="#ffffff" stroke-width="2" />
  <!-- Leitplanken-Randlinien -->
  <path d="M 240 100 A 140 140 0 0 0 100 240" fill="none" stroke="#ffffff" stroke-width="2" />
  <path d="M 240 116 A 124 124 0 0 0 116 240" fill="none" stroke="#ffffff" stroke-width="2" />
  <!-- Spurlinien links -->
  <path d="M 240 65 A 175 175 0 0 0 65 240" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="12 20" />
  <!-- Spurlinien rechts -->
  <path d="M 240 148 A 92 92 0 0 0 148 240" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="12 20" />
</svg>`

/**
 * Mapping: Road-ID -> Preview-SVG
 */
export const ROAD_PREVIEWS: Record<string, string> = {
  // Gerade
  'road-strasse-straight': PREVIEW_INNERORTS,
  // Kurven
  'road-strasse-curve': PREVIEW_CURVE_INNERORTS,
}

/**
 * Holt das Preview-SVG für eine Road-ID
 */
export function getRoadPreview(roadId: string): string | undefined {
  return ROAD_PREVIEWS[roadId]
}