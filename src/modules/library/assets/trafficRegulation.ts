// src/modules/library/trafficRegulation.ts

// Traffic-Regulation-SVGs
// Schlüssel = ID aus libraryManifest.ts (category: 'verkehrsregelung')
// Wert = kompletter SVG-String (Platzhalter)

export const trafficRegulation: Record<string, string> = {
  // ---------------------------------------------------------------------------
  // Gefahrzeichen
  // ---------------------------------------------------------------------------

  vr_gefahr_kurve_links: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Dreieck als Platzhalter für Gefahrzeichen -->
  <polygon points="50,15 15,80 85,80" fill="#ffffff" stroke="#000000" stroke-width="3" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Vorschriftzeichen
  // ---------------------------------------------------------------------------

  vr_vorschrift_vorfahrt_achten: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Umgedrehtes Dreieck als Platzhalter für "Vorfahrt gewähren" -->
  <polygon points="50,85 15,20 85,20" fill="#ffffff" stroke="#000000" stroke-width="3" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Richtzeichen
  // ---------------------------------------------------------------------------

  vr_richt_vorfahrtstrasse: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Rhombus als Platzhalter für Vorfahrtstraße -->
  <polygon points="50,10 90,50 50,90 10,50" fill="#ffffff" stroke="#000000" stroke-width="3" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Ampeln
  // ---------------------------------------------------------------------------

  vr_ampel_standard: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Einfache senkrechte Ampel als Platzhalter -->
  <rect x="40" y="20" width="20" height="60" fill="#ffffff" stroke="#000000" stroke-width="2" />
  <circle cx="50" cy="30" r="6" fill="#cccccc" stroke="#000000" stroke-width="1" />
  <circle cx="50" cy="50" r="6" fill="#cccccc" stroke="#000000" stroke-width="1" />
  <circle cx="50" cy="70" r="6" fill="#cccccc" stroke="#000000" stroke-width="1" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Bodenmarkierungen
  // ---------------------------------------------------------------------------

  vr_bodenmarkierung_haltlinie: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Einfache horizontale Linie als Platzhalter für Haltlinie -->
  <rect x="15" y="50" width="70" height="6" fill="#ffffff" stroke="#000000" stroke-width="2" />
</svg>
`,
}
