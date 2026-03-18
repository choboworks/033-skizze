<p align="center">
  <img src="public/logo.png" alt="033-Skizze" width="120" />
</p>

<h1 align="center">033-Skizze V2</h1>

<p align="center">
  <strong>Professionelles Verkehrsunfallskizzen-Tool für den polizeilichen Einsatz</strong><br>
  Moderne Web-Applikation im Figma/Photoshop-Stil — offline-fähig, datenschutzkonform, sofort einsatzbereit.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Konva-Canvas-ff6347" alt="Konva" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Radix_UI-Primitives-161618?logo=radixui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Zustand-State-443e38" alt="Zustand" />
  <img src="https://img.shields.io/badge/PWA-Offline-5a0fc8?logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Lizenz-Propriet%C3%A4r-lightgrey" alt="Lizenz" />
</p>

<p align="center">
  Neuauflage des ursprünglichen <a href="https://github.com/choboworks/033-skizze">033-Skizze</a> Projekts.
</p>

---

## Warum 033-Skizze?

Polizisten brauchen ein Werkzeug, das **sofort funktioniert** — keine Einarbeitung, keine Konfiguration, keine IT-Abteilung. 033-Skizze ist genau das: Ein spezialisiertes Zeichentool für Verkehrsunfallskizzen, das sich anfühlt wie Figma, aber für den Streifenwagen gebaut ist.

- **Zero Config** — Straße droppen, Fahrzeuge platzieren, fertig
- **100% Offline** — Keine Server, keine Cloud, keine externen Verbindungen
- **Datenschutz** — Keine Telemetrie, keine Analytics, alles lokal
- **Maßstabsgetreu** — Automatische Maßstabsberechnung, DIN-konforme Bemaßung

---

## Features

### SmartRoads — Constrained Road Editor

Das Herzstück der App. Ein geführter Straßen-Editor der korrekte Ergebnisse garantiert:

- **Constrained Editor** — Streifen sitzen immer bündig, keine Lücken, keine Versätze
- **Interaktive Draufsicht** — Straße live bearbeiten, Kanten resizen, Markierungen frei platzieren
- **Quick Settings** — Spuren ±, Gehweg/Radweg/Parken [L|B|R|—], Länge ±
- **7 Presets** — Erschließungsstraße, Sammelstraße, Hauptverkehrsstraße, Landstraße, Autobahn, Tempo 30, Spielstraße
- **Live Konva-Nodes** — Vektor-Qualität bei jedem Zoom, kein Raster
- **Drag & Drop** aus der Bibliothek auf den Canvas
- **Doppelklick** auf platzierte Straße → Editor öffnet sich zum Bearbeiten

### Canvas & Viewport

| Feature | Details |
|---------|---------|
| **DIN A4 Canvas** | 794 × 1123px, korrektes Seitenformat |
| **Infinite Viewport** | Grauer Arbeitsbereich um das Blatt herum |
| **Photoshop-Panning** | `Leertaste` halten + Maus ziehen |
| **Scroll-Zoom** | Mausrad mit Zoom-to-Pointer |
| **Mittelmaus-Pan** | Mittlere Maustaste für schnelles Verschieben |
| **Reset** | Klick auf `%` in der Statusbar → 100% + zentriert |

### 5 Werkzeuge

```
┌────┐
│ ↖  │  Auswahl           V
├────┤
│ ✏  │  Freihand          P     Strichstärke · Strichart · Glättung · Farbe
├────┤
│ ⬜ │  Formen             O     9 Shapes · Kontur · Füllung
├────┤
│ T  │  Text               T     Größe · Bold/Italic/Underline · Ausrichtung · Farbe
├────┤
│ ↔  │  Bemaßung           M     DIN-Style · Auto-Meter · Linienstärke · Schriftgröße
└────┘
```

**Auswahl (V)** — Einzel- & Mehrfachauswahl, Verschieben, Skalieren, Drehen. Shift+Rotation = 90°-Snap.

**Freihand (P)** — Klick+Drag zeichnet, Pfad-Glättung via Ramer-Douglas-Peucker. Strichart (durchgezogen/gestrichelt/gepunktet), Stärke 1–10px, einstellbare Glättung.

**Formen (O)** — 9 Shapes im 3×3 Grid-Popover:

| Rechteck | Abgerundet | Ellipse |
|:--------:|:----------:|:-------:|
| **Dreieck** | **Polygon** | **Stern** |
| **Linie** | **Pfeil** | **Pfad** |

Shift + Zeichnen bei Linien/Pfeilen = 45°-Snap. Füllung nur bei geschlossenen Formen.

**Text (T)** — Klick auf Canvas erstellt Textbox mit Inline-Editor. Schriftgröße 6–72px, Bold/Italic/Underline, Ausrichtung, Farbe + Hintergrundfarbe.

**Bemaßung (M)** — Zwei-Klick-Tool: Start → Ende. DIN-konforme Bemaßungslinie mit automatischer Meterangabe. Shift = 45°-Snap.

### Objekt-Bibliothek

Slide-Out-Drawer neben der Toolbar mit 6 Kategorien:

| Kategorie | Inhalte |
|-----------|---------|
| **SmartRoads** | Constrained Road Editor (Gerade, Kurve, Kreuzung, Kreisverkehr) |
| **Fahrzeuge** | PKW, LKW, Zweirad, Bus, Sonderfahrzeuge — maßstabsgetreue SVG-Draufsichten |
| **Infrastruktur** | Gebäude, Bordsteine, Leitplanken, Poller, Baustellenelemente |
| **Verkehrsregelung** | Ampeln, StVO-Verkehrszeichen (durchsuchbar), Zusatzzeichen |
| **Umgebung** | Bäume, Hecken, Laternen, Bushaltestellen, Gewässer |
| **Markierungen** | Bremsspuren, Splitterfelder, Flüssigkeiten, Kollisionspunkte, Bewegungslinien |

### Ebenen-Manager

Photoshop-Style Ebenen-Panel:

- Dynamische Objektliste — erscheint automatisch beim Erstellen
- **Drag & Drop** Z-Order mit visueller Drop-Indicator-Linie
- Sichtbarkeit, Sperren, Löschen pro Objekt
- Inline-Rename per Doppelklick
- SmartRoads: Zahnrad-Icon öffnet den Road-Editor

### Floating Properties

Frei positionierbares Properties-Panel mit **typ-spezifischen Controls**:
- **Freihand** → Strichstärke, Strichart, Glättung, Farbe, Deckkraft
- **Formen** → Kontur, Füllung, Deckkraft
- **Text** → Schrift, Stil, Ausrichtung, Farben, Deckkraft
- **Bemaßung** → Linienstärke, Schriftgröße, Farbe, Deckkraft

Integrierter **Custom Color Picker** mit HSV-Fläche, Hue-Slider, Hex-Eingabe und Preset-Farben.

### Maßstab-System

| Maßstab | Darstellungsfläche | Typischer Einsatz |
|---------|-------------------|-------------------|
| 1:50 | 10.5 × 14.85m | Parkplatz-Rempler |
| 1:100 | 21 × 29.7m | Einmündung |
| 1:200 | 42 × 59.4m | Standard-Kreuzung (Default) |
| 1:500 | 105 × 148.5m | Straßenabschnitt |
| 1:1000 | 210 × 297m | Langer Streckenabschnitt |

Vollautomatisch berechnet. Der User wählt nie den Maßstab — das System passt ihn an wenn SmartRoads hinzugefügt/entfernt werden.

---

## Tech Stack

| Bereich | Technologie | Version | Zweck |
|---------|-------------|---------|-------|
| Framework | **React** | 19 | Komponentenbasierte UI |
| Sprache | **TypeScript** | 5.9 (strict) | Typsicherheit |
| Bundler | **Vite** | 8 | Dev-Server, optimierte Builds |
| Canvas | **Konva + react-konva** | 10 / 19 | Deklaratives Canvas-Rendering |
| State | **Zustand + zundo** | 5 / 2 | State-Management + Undo/Redo |
| Styling | **Tailwind CSS** | 4 | Utility-First + CSS Custom Properties |
| UI Primitives | **Radix UI** | — | Dialog, Accordion, ToggleGroup, Tooltip, DropdownMenu |
| Drag & Drop | **dnd-kit** | 6 | Sortable Strip-Editor |
| Icons | **Lucide React** | 0.577 | Konsistente Ikonografie |
| Offline/PWA | **vite-plugin-pwa + Workbox** | — | Precaching aller Assets |
| Lokale DB | **Dexie.js** | 4 | Auto-Save (IndexedDB) |
| Dateiformat | **JSZip** | 3 | `.033sketch` als JSON-in-ZIP |

---

## Projekt-Struktur

```
src/
├── smartroads/                    # SmartRoads Constrained Editor
│   ├── types.ts                   # Strip, Marking, StraightRoadState
│   ├── constants.ts               # RASt-Defaults, Farben, Presets, Factories
│   ├── editors/
│   │   └── StraightEditor.tsx     # Gerade: orchestriert alle Komponenten
│   ├── rendering/
│   │   ├── StripRenderer.tsx      # Dispatcher: Strip-Typ → Konva-Komponente
│   │   ├── MarkingRenderer.tsx    # Dispatcher: Marking-Typ → Konva-Komponente
│   │   ├── RoadTopView.tsx        # Interaktive Konva-Draufsicht (Edge-Resize, Markierungen)
│   │   ├── SmartRoadCanvasObject.tsx  # Hauptcanvas-Renderer (Live Nodes + Scale)
│   │   ├── strips/                # LaneStrip, SidewalkStrip, CyclePathStrip, ...
│   │   └── markings/             # CenterLine, Crosswalk, DirectionArrow, ...
│   └── shared/
│       ├── EditorShell.tsx        # Radix Dialog Overlay
│       ├── ElementPalette.tsx     # Radix Accordion + RadioGroup
│       ├── QuickSettings.tsx      # Radix ToggleGroup
│       ├── PresetList.tsx         # 7 Straßen-Presets
│       ├── StripEditor.tsx        # React/CSS Strip-Editor (dnd-kit)
│       └── patterns.ts           # Textur-Generierung (Pflaster, Gras, Asphalt)
│
├── components/
│   ├── Canvas/
│   │   ├── SketchCanvas.tsx       # Konva Stage, Pan/Zoom, Drawing, Drag & Drop
│   │   ├── CanvasObjects.tsx      # Shape-Rendering + SmartRoad-Integration
│   │   └── shapeRefs.ts          # Konva Node-Referenzen
│   ├── Inspector/
│   │   ├── FloatingProperties.tsx # Draggable Properties-Modal
│   │   └── ColorPicker.tsx        # HSV Color Picker
│   ├── LayerManager/             # Ebenen-Panel mit Drag & Drop Z-Order
│   ├── Sidebar/                  # Library-Drawer mit Drag & Drop
│   ├── StatusBar/                # Zoom, Maßstab, Canvas-Info
│   ├── Toolbar/                  # 5 Tool-Gruppen + Per-Tool Popovers
│   ├── TopBar/                   # Logo, Dateiname, Dokument-Properties
│   └── ui/                       # Shared PanelPrimitives
│
├── hooks/
│   ├── useDrawing.ts              # Zeichen-Logik (Freehand + Shapes + Shift-Snap)
│   └── useKeyboard.ts            # Keyboard Shortcuts
├── store/
│   └── index.ts                   # Zustand Store
├── types/
│   └── index.ts                   # Core TypeScript-Definitionen
├── utils/
│   ├── scale.ts                   # DIN A4 Maßstab, metersToPixels/pixelsToMeters
│   └── snapAngle.ts              # 45°-Snap
└── assets/
    └── fonts/                     # Inter Variable Font (lokal)
```

---

## Tastatur-Shortcuts

| Shortcut | Aktion |
|----------|--------|
| `V` | Auswahl-Tool |
| `P` | Freihand (Pencil) |
| `O` | Formen (Objekte) |
| `T` | Text-Tool |
| `M` | Bemaßung (Measure) |
| `Leertaste` (halten) | Canvas verschieben |
| `Shift` + Rotation | 90°-Snap |
| `Shift` + Linie/Pfeil/Bemaßung | 45°-Snap |
| `Delete` / `Backspace` | Ausgewählte Objekte löschen |
| `Escape` | Auswahl aufheben / Tool zurücksetzen |

> **Toggle-Verhalten:** Shortcut drücken aktiviert Tool + öffnet Popover. Nochmal drücken schließt und wechselt zurück zur Auswahl.

---

## Setup & Entwicklung

```bash
npm install        # Dependencies installieren
npm run dev        # Entwicklungsserver (http://localhost:5173)
npm run build      # TypeScript-Check + Production Build
npm run lint       # ESLint
npm run preview    # Production Preview
```

---

## Architektur

### Drei-Schichten-Prinzip

Jedes Feature folgt dem gleichen Muster:

1. **Zero Config** — Funktioniert sofort mit sinnvollen Defaults
2. **Quick Adjust** — Schnelle Anpassungen über Toggles und +/− Buttons
3. **Full Custom** — Volle Kontrolle, aber nie im Weg

### Zwei Objekt-Welten

| | Zeichenobjekte | Reale Objekte |
|---|---|---|
| **Beispiele** | Freihand, Shapes, Text | SmartRoads, Fahrzeuge |
| **Koordinaten** | Page-Pixel | Meter (intern) |
| **Skalierung** | Frei per Handles | Parametrisch (Constrained Editor) |
| **Maßstab** | Irrelevant | Bestimmt Darstellungsgröße |

### SmartRoads: Constrained Editor

Kein freier Canvas, kein rein parametrisches System. Stattdessen: **geordnete Streifen-Liste** (1D für Geraden/Kurven) + **geführter 2D-Canvas** (Kreuzungen/Kreisverkehre). Streifen immer bündig, Markierungen frei platzierbar. Vollständige Spezifikation: [SMARTROADS.md](SMARTROADS.md)

### State = Single Source of Truth

Alles läuft über Zustand. Canvas, Ebenen-Manager, Properties, Toolbar und SmartRoad-Editor rendern dieselben Daten. Kein Sync nötig.

---

## Roadmap

- [x] **Phase 1** — Foundation (Canvas, Viewport, Layout, Theme)
- [x] **Phase 2** — Zeichenwerkzeuge (Freihand, 9 Formen, Text, Bemaßung)
- [x] **Phase 3** — SmartRoads Constrained Editor (Gerade)
- [ ] **Phase 4** — SmartRoads: Kurven, Kreuzungen, Kreisverkehre
- [ ] **Phase 5** — SVG-Fahrzeuge + Objekt-Bibliothek
- [ ] **Phase 6** — Undo/Redo UI, Export (PDF/PNG/SVG), Save/Load, Auto-Save

---

## Grundsätze

| Prinzip | Umsetzung |
|---------|-----------|
| **Einfachheit** | Polizisten, keine Designer. Jede Interaktion erklärt sich selbst. |
| **Datenschutz** | Null externe Verbindungen. Keine Telemetrie, keine Fonts-CDN, nichts. |
| **Offline-first** | Nach dem Laden komplett autark. PWA mit Precaching. |
| **Open-Source-Stack** | Alle Dependencies MIT/Apache/BSD. Keine proprietären Libs. |

---

## Lizenz

Proprietary — [choboworks](https://github.com/choboworks)

---

<p align="center">
  <sub>Built with React 19 · TypeScript 5.9 · Vite 8 · Konva · Zustand · Tailwind CSS 4 · Radix UI · dnd-kit</sub>
</p>
