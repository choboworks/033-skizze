// src/modules/library/environment.ts

// Alle Umgebung-SVGs.
// Schlüssel = ID aus libraryManifest.ts (category: 'umgebung').
// Wert = komplettes SVG (<svg ...>...</svg>), damit du es später einfach ersetzen kannst.

export const environment = {
  // ---------------------------------------------------------------------------
  // Vegetation
  // ---------------------------------------------------------------------------

  env_baum_laub: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="35" r="20" fill="#a3e635" stroke="#000000" stroke-width="2" />
  <rect x="45" y="40" width="10" height="25" fill="#854d0e" stroke="#000000" stroke-width="1.5" />
</svg>
`,

  env_baum_nadel: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,15 30,45 70,45" fill="#22c55e" stroke="#000000" stroke-width="2" />
  <polygon points="50,25 32,55 68,55" fill="#16a34a" stroke="#000000" stroke-width="2" />
  <rect x="45" y="55" width="10" height="20" fill="#854d0e" stroke="#000000" stroke-width="1.5" />
</svg>
`,

  env_busch: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse cx="50" cy="55" rx="25" ry="15" fill="#22c55e" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_hecke: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="15" y="50" width="70" height="15" fill="#16a34a" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Stadtmöbel
  // ---------------------------------------------------------------------------

  env_bank: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="50" width="60" height="10" fill="#9ca3af" stroke="#000000" stroke-width="2" />
  <rect x="22" y="42" width="56" height="7" fill="#9ca3af" stroke="#000000" stroke-width="2" />
  <rect x="25" y="60" width="5" height="12" fill="#4b5563" />
  <rect x="70" y="60" width="5" height="12" fill="#4b5563" />
</svg>
`,

  env_papierkorb: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="40" y="35" width="20" height="35" fill="#9ca3af" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_laterne: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="47" y="25" width="6" height="40" fill="#4b5563" stroke="#000000" stroke-width="1.5" />
  <circle cx="50" cy="22" r="4" fill="#facc15" stroke="#000000" stroke-width="1.5" />
</svg>
`,

  env_bushaltestelle: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="40" width="60" height="25" fill="#e5e7eb" stroke="#000000" stroke-width="2" />
  <rect x="25" y="45" width="50" height="15" fill="#f9fafb" stroke="#000000" stroke-width="1.5" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Mensch und Tier
  // ---------------------------------------------------------------------------

    env_reh: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="35" r="20" fill="#a3e635" stroke="#000000" stroke-width="2" />
  <rect x="45" y="40" width="10" height="25" fill="#854d0e" stroke="#000000" stroke-width="1.5" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Gebäude & Bauliches
  // ---------------------------------------------------------------------------

  env_haus_einfamilien: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,45 50,25 80,45" fill="#e5e7eb" stroke="#000000" stroke-width="2" />
  <rect x="25" y="45" width="50" height="30" fill="#ffffff" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_mehrfamilienhaus: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="25" width="50" height="50" fill="#e5e7eb" stroke="#000000" stroke-width="2" />
  <rect x="30" y="30" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="1" />
  <rect x="45" y="30" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="1" />
  <rect x="60" y="30" width="10" height="10" fill="#ffffff" stroke="#000000" stroke-width="1" />
</svg>
`,

  env_garage: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="25,50 50,35 75,50" fill="#e5e7eb" stroke="#000000" stroke-width="2" />
  <rect x="28" y="50" width="44" height="22" fill="#ffffff" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Technische Objekte
  // ---------------------------------------------------------------------------

  env_verteilerkasten: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="40" height="30" fill="#e5e7eb" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_trafohaus: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="32" width="50" height="38" fill="#e5e7eb" stroke="#000000" stroke-width="2" />
  <polygon points="25,32 50,20 75,32" fill="#d4d4d4" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_mast: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="47" y="25" width="6" height="40" fill="#6b7280" stroke="#000000" stroke-width="1.5" />
  <line x1="35" y1="28" x2="65" y2="28" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Müll & Container
  // ---------------------------------------------------------------------------

  env_muelltonne: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="35" y="30" width="30" height="35" fill="#9ca3af" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_altglas_container: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="40" height="30" rx="8" ry="8" fill="#9ca3af" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_container_gross: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="32" width="60" height="35" fill="#9ca3af" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Sonstige Umgebung
  // ---------------------------------------------------------------------------

  env_zaun: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="50" width="60" height="4" fill="#9ca3af" />
  <rect x="25" y="42" width="4" height="16" fill="#9ca3af" />
  <rect x="40" y="42" width="4" height="16" fill="#9ca3af" />
  <rect x="55" y="42" width="4" height="16" fill="#9ca3af" />
  <rect x="70" y="42" width="4" height="16" fill="#9ca3af" />
</svg>
`,

  env_poller: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="40" width="10" height="25" fill="#9ca3af" stroke="#000000" stroke-width="2" />
</svg>
`,

  env_schildhalter: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="48" y="30" width="4" height="35" fill="#6b7280" stroke="#000000" stroke-width="1.5" />
  <rect x="40" y="25" width="20" height="8" fill="#e5e7eb" stroke="#000000" stroke-width="1.5" />
</svg>
`,
}
