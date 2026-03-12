// src/modules/library/markings.ts

// Markierungs-SVGs
// Schlüssel = ID aus libraryManifest.ts (category: 'markierungen')
// Wert = kompletter SVG-String (Platzhalter)

export const markings: Record<string, string> = {
  // ---------------------------------------------------------------------------
  // Pfeile
  // ---------------------------------------------------------------------------

  mark_pfeil_gerade: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Einfacher, gerader Pfeil nach rechts -->
  <line x1="20" y1="50" x2="70" y2="50" stroke="#000000" stroke-width="4" />
  <polygon points="70,45 85,50 70,55" fill="#000000" />
</svg>
`,

  mark_pfeil_links: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Pfeil nach links -->
  <line x1="80" y1="50" x2="30" y2="50" stroke="#000000" stroke-width="4" />
  <polygon points="30,45 15,50 30,55" fill="#000000" />
</svg>
`,

  mark_pfeil_rechts: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Pfeil nach rechts -->
  <line x1="20" y1="50" x2="70" y2="50" stroke="#000000" stroke-width="4" />
  <polygon points="70,45 85,50 70,55" fill="#000000" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Kollisionssymbole
  // ---------------------------------------------------------------------------

  mark_kollision_stern: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Einfacher „Crash“-Stern -->
  <polygon
    points="50,20 56,38 75,32 63,48 78,60 58,60 50,78 42,60 22,60 37,48 25,32 44,38"
    fill="#ffffff"
    stroke="#000000"
    stroke-width="2"
  />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Spuren
  // ---------------------------------------------------------------------------

  mark_bremsspur: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Zwei leicht versetzte, schräge Streifen als Bremsspur -->
  <line x1="25" y1="70" x2="60" y2="35" stroke="#000000" stroke-width="3" stroke-dasharray="4 3" />
  <line x1="35" y1="70" x2="70" y2="35" stroke="#000000" stroke-width="3" stroke-dasharray="4 3" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Text & Info
  // ---------------------------------------------------------------------------

  mark_text_info: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Einfaches Textfeld -->
  <rect x="20" y="30" width="60" height="40" fill="#ffffff" stroke="#000000" stroke-width="2" />
  <text x="50" y="55" text-anchor="middle" font-size="18" fill="#000000">T</text>
</svg>
`,

  // ---------------------------------------------------------------------------
  // Maße & Distanzen
  // ---------------------------------------------------------------------------

  mark_massband: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Maßband / Distanz mit Pfeilen an beiden Enden -->
  <line x1="20" y1="60" x2="80" y2="60" stroke="#000000" stroke-width="2" />
  <polygon points="20,56 12,60 20,64" fill="#000000" />
  <polygon points="80,56 88,60 80,64" fill="#000000" />
  <rect x="40" y="52" width="20" height="16" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Symbole
  // ---------------------------------------------------------------------------

  mark_symbol_person: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Sehr vereinfachtes Person-Symbol (Top-Down/Stilisierung) -->
  <circle cx="50" cy="30" r="8" fill="#ffffff" stroke="#000000" stroke-width="2" />
  <rect x="44" y="38" width="12" height="20" fill="#ffffff" stroke="#000000" stroke-width="2" />
  <line x1="44" y1="60" x2="38" y2="72" stroke="#000000" stroke-width="2" />
  <line x1="56" y1="60" x2="62" y2="72" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Orientierung
  // ---------------------------------------------------------------------------

  mark_nordpfeil: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Nordpfeil: Pfeil nach oben mit „N“ -->
  <polygon points="50,15 62,35 38,35" fill="#ffffff" stroke="#000000" stroke-width="2" />
  <line x1="50" y1="35" x2="50" y2="75" stroke="#000000" stroke-width="2" />
  <text x="50" y="90" text-anchor="middle" font-size="16" fill="#000000">N</text>
</svg>
`,
}
