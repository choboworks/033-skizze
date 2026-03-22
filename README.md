<p align="center">
  <img src="public/logo.png" alt="033-Skizze" width="100" />
</p>

<h1 align="center">033-Skizze</h1>

<p align="center">
  <strong>Professionelle Verkehrsunfallskizzen fur den polizeilichen Einsatz</strong><br>
  <sub>Figma-Style Web-App — offline-fahig, datenschutzkonform, massstabsgetreu</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Konva-Canvas-ff6347?style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-State-443e38?style=flat-square" />
  <img src="https://img.shields.io/badge/PWA-Offline-5a0fc8?style=flat-square" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active_Development-22c55e?style=flat-square" />
  <img src="https://img.shields.io/badge/License-Proprietary-ef4444?style=flat-square" />
</p>

---

## Was ist 033-Skizze?

Ein spezialisiertes Zeichentool fur massstabsgetreue Verkehrsunfallskizzen. Kombiniert die Bedienbarkeit von Figma/Photoshop mit fachspezifischen Features: normkonforme Strassenquerschnitte, automatische Massstabsberechnung, Dienststellen-Datenbank und vorkonfigurierte Objektbibliothek.

> **Drei Komplexitatsschichten** — sofort nutzbar mit Defaults, schnell anpassbar uber Toggles, voll konfigurierbar fur Experten.

---

## Highlights

<table>
<tr>
<td width="50%">

### SmartRoads
Geführter Strasseneditor mit garantierter Korrektheit. Strip-System fur Fahrstreifen, Gehwege, Radwege. 6 Presets, RMS-1 konforme Markierungen, interaktive Draufsicht.

</td>
<td width="50%">

### Auto-Header
Automatisch generierter Dokumentkopf aus Metadaten: Dienststelle, Vorgangsnummer, Adresse, Datum, Sachbearbeiter. Live-Rendering auf dem A4-Canvas.

</td>
</tr>
<tr>
<td>

### Dark & Light Mode
Glassmorphism-Design mit vollstandigem Light Mode. CSS-Token-System fur konsistente Themes. Professionelle Asthetik in beiden Modi.

</td>
<td>

### Undo/Redo
Intelligentes Undo-System mit Debounce — bündelt schnelle Anderungen zu einem Eintrag. Ctrl+Z/Y, 50-Schritte-History, Flush-before-Undo.

</td>
</tr>
</table>

---

## Features

### Werkzeuge

| Shortcut | Tool | Beschreibung |
|:--------:|------|-------------|
| `V` | **Auswahl** | Einzel-/Mehrfachauswahl, Verschieben, Skalieren, Drehen |
| `P` | **Freihand** | RDP-Glaettung, Strichart, Staerke, Farbe |
| `O` | **Formen** | 9 Shapes: Rechteck, Ellipse, Dreieck, Polygon, Stern, Linie, Pfeil, Pfad |
| `T` | **Text** | Inline-Editor, Bold/Italic/Underline, Ausrichtung, Farbe + Hintergrund |
| `M` | **Bemassung** | DIN-Style Zwei-Klick, automatische Meterangabe |
| `A` | **Ausschnitt** | Druckbereich auf A4 definieren, Frame verschieben/skalieren |

### Tastatur

| Shortcut | Aktion |
|----------|--------|
| `Strg+Z` | Rückgangig |
| `Strg+Y` / `Strg+Shift+Z` | Wiederholen |
| `Strg+D` | Duplizieren |
| `Strg+A` | Alles auswahlen |
| `Strg+0` | Ansicht einpassen |
| `Strg+1` | 100% Zoom |
| `Leertaste` | Canvas verschieben (halten) |
| `Shift` | 45°/90°-Snap |
| `Delete` | Loschen |
| `Escape` | Abwahlen / Tool zurucksetzen |
| `Rechtsklick` | Kontextmenu |

### Canvas & Viewport

- **DIN A4** — 794 x 1123px, korrektes Seitenformat
- **Infinite Viewport** — Grauer Arbeitsbereich, Spacebar-Pan, Scroll-Zoom, Mittelmaus-Pan
- **25 Massstabsstufen** — 1:10 bis 1:5000, vollautomatisch berechnet
- **Zoom-Controls** — +/- Buttons, Einpassen, Klick auf % zum Reset

### Metadaten & Dokumentkopf

- **Dienststellen-Suche** — Autocomplete uber ~300 niedersachsische Polizeidienststellen
- **Pflichtfeld-Validierung** — Visuelles Feedback bei leeren Pflichtfeldern
- **Auto-Header** — Konva-Rendering: Dienststelle, Adresse, Telefon, Vorgangsnummer, Datum, Sachbearbeiter
- **Unterschriftenblock** — Draggable/resizable, separate vom Header

### Objekt-Bibliothek

| Kategorie | Beispiele |
|-----------|-----------|
| **SmartRoads** | Gerade, Kurve, Kreuzung, Kreisverkehr |
| **Fahrzeuge** | PKW, LKW, Zweirad, Bus, Sonderfahrzeuge |
| **Infrastruktur** | Gebaude, Bordsteine, Leitplanken, Poller |
| **Verkehrsregelung** | Ampeln, Verkehrszeichen, Zusatzzeichen |
| **Umgebung** | Baume, Hecken, Laternen, Bushaltestellen |
| **Markierungen** | Bremsspuren, Splitterfelder, Kollisionspunkte |

### UX

- **Tooltips** mit Shortcut-Hints auf allen Buttons
- **Kontextmenu** — Rechtsklick: Duplizieren, Loschen, Vordergrund/Hintergrund, Eigenschaften
- **Toast-Benachrichtigungen** — Success/Info/Error mit Auto-Dismiss
- **Ebenen-Manager** — Type-Icons, Drag & Drop Z-Order, Inline-Rename
- **Floating Properties** — Draggbares Modal mit HSV Color Picker

---

## Tech Stack

| | Technologie | Zweck |
|---|-------------|-------|
| | **React 19** | Komponentenbasierte UI |
| | **TypeScript 5.9** | Strict Mode Typsicherheit |
| | **Vite 8** | Build-Tool + HMR Dev-Server |
| | **Konva** | Deklaratives Canvas-Rendering |
| | **Zustand + zundo** | State-Management + Undo/Redo |
| | **Tailwind CSS 4** | Utility-First + CSS Custom Properties |
| | **Radix UI** | Accessible Primitives (Dialog, Accordion, ToggleGroup) |
| | **Lucide React** | Konsistente Icon-Bibliothek |
| | **PWA** | Offline-fahig via Precaching |

---

## Projekt-Struktur

```
src/
├── components/
│   ├── Canvas/              # SketchCanvas, CanvasObjects, PageHeader, ContextMenu
│   ├── Toolbar/             # 6 Tool-Gruppen + PrintAreaTool
│   ├── RightSidebar/        # EbenenPanel, LibraryPanel, MetadataPanel, Dienststellen
│   ├── Inspector/           # FloatingProperties, ColorPicker
│   ├── TopBar/              # Header mit Actions (Undo/Redo, Save, Export)
│   ├── StatusBar/           # Zoom-Controls, Masstab, Auswahl-Info
│   └── ui/                  # PanelPrimitives, Toast, Tooltip
│
├── smartroads/              # SmartRoads Constrained Editor
│   ├── types.ts             # Strip, Marking, RoadClass
│   ├── constants.ts         # RASt-Defaults, Presets
│   ├── editors/             # StraightEditor
│   ├── rendering/           # SmartRoadCanvasObject, RoadTopView, Strips, Markings
│   └── shared/              # EditorShell, QuickSettings, ElementPalette, Properties
│
├── hooks/                   # useDrawing, useKeyboard, useAusschnitt, useUndoRedo, useToast
├── store/                   # Zustand Store (temporal middleware)
├── constants/               # library.ts, shared.ts
├── types/                   # Core TypeScript-Definitionen
└── utils/                   # scale.ts, snapAngle.ts, objectHelpers.ts, validation.ts
```

---

## Setup

```bash
git clone https://github.com/choboworks/033-skizze.git
cd 033-skizze
npm install
npm run dev
```

Offnet `http://localhost:5173` im Browser.

| Script | Beschreibung |
|--------|-------------|
| `npm run dev` | Vite Dev-Server mit HMR |
| `npm run build` | TypeScript-Check + Production Build |
| `npm run lint` | ESLint |
| `npm run preview` | Production Preview |

---

## Architektur

### Zwei Objekt-Welten

| | Zeichenobjekte | Reale Objekte |
|---|---|---|
| **Beispiele** | Freihand, Shapes, Text | SmartRoads, Fahrzeuge |
| **Koordinaten** | Page-Pixel (px) | Meter (m) |
| **Skalierung** | Frei per Handles | Parametrisch im Editor |
| **Masstab** | Irrelevant | Bestimmt Darstellungsgrosse |

### State

Single Zustand Store. Canvas, Ebenen-Manager, Properties, Toolbar und SmartRoad-Editor rendern dieselben Daten. Kein Sync notig. Undo/Redo via zundo Temporal Middleware mit custom Debounce.

---

## Roadmap

- [x] **Phase 1** — Canvas, Viewport, Layout, Theme
- [x] **Phase 2** — Zeichenwerkzeuge, Formen, Text, Bemassung
- [x] **Phase 3** — SmartRoads, Ausschnitt-Tool, Metadaten, UX
- [ ] **Phase 4** — SmartRoads: Kurven, Kreuzungen, Kreisverkehre
- [ ] **Phase 5** — SVG-Elemente + Objekt-Bibliothek
- [ ] **Phase 6** — Export, Save/Load

---

## Grundsatze

| Prinzip | Umsetzung |
|---------|-----------|
| **Einfachheit** | Drei Schichten: Zero Config → Quick Adjust → Full Custom |
| **Datenschutz** | Null externe Verbindungen. Keine Telemetrie, keine CDN-Fonts |
| **Offline-first** | Nach dem Laden komplett autark. PWA mit Precaching |
| **Massstabstreue** | Strassenelemente nach RASt 06, RAL 2012, ERA 2010, RMS-1 |

---

<p align="center">
  <sub>Proprietary — <a href="https://github.com/choboworks">choboworks</a></sub><br>
  <sub>React 19 · TypeScript 5.9 · Vite 8 · Konva · Zustand · Tailwind CSS 4</sub>
</p>
