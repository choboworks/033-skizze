<p align="center">
  <img src="public/logo.png" alt="033-Skizze" width="120" />
</p>

<h1 align="center">033-Skizze V2</h1>

<p align="center">
  <strong>Professionelles Verkehrsunfallskizzen-Tool</strong><br>
  Web-Applikation im Figma/Photoshop-Stil — offline-fähig, datenschutzkonform, maßstabsgetreu.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Konva-Canvas-ff6347" alt="Konva" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Zustand-State-443e38" alt="Zustand" />
  <img src="https://img.shields.io/badge/PWA-Offline-5a0fc8?logo=pwa&logoColor=white" alt="PWA" />
</p>

---

## Überblick

033-Skizze ist ein spezialisiertes Zeichentool für maßstabsgetreue Verkehrsunfallskizzen. Es kombiniert die Bedienbarkeit von Figma/Photoshop mit fachspezifischen Features wie normkonformen Straßenquerschnitten, automatischer Maßstabsberechnung und einer vorkonfigurierten Objektbibliothek.

**Kernprinzip**: Drei Komplexitätsschichten — sofort nutzbar mit Defaults, schnell anpassbar über Toggles, voll konfigurierbar für Experten.

---

## Features

### SmartRoads — Constrained Road Editor

Kein freihändiges Straßenzeichnen. Ein geführter Editor der korrekte Ergebnisse garantiert:

- **Strip-Editor** — Fahrstreifen, Gehwege, Radwege, Parkstreifen als geordnete Liste. Immer bündig, keine Lücken.
- **Interaktive Draufsicht** — Kanten resizen, Streifen per Drag & Drop tauschen, Markierungen frei platzieren
- **Straßenklassen** — Innerorts, Außerorts, Autobahn. Strichbreiten und Dash-Patterns nach RMS-1
- **6 Presets** — Erschließungsstraße, Sammelstraße, Hauptverkehrsstraße, Landstraße, Autobahn, Tempo 30
- **Markierungen** — Leitlinien, Begrenzungen, Zebrastreifen, Haltelinien, Richtungspfeile, Sperrflächen
- **Leitlinien-System** — Maßstabsgerecht, auto-generiert, Phase per Drag einstellbar, Snap zwischen Linien
- **Live Konva-Nodes** — Vektor-Qualität bei jedem Zoom
- **Properties Panel** — Floating Modal für Strip-/Markierungseigenschaften (Breite, Variante, Richtung)
- **Ebenen-Manager** — Alle Elemente als Card-Liste mit Z-Order DnD

### 6 Werkzeuge

| | Tool | Shortcut | Features |
|---|---|---|---|
| ↖ | **Auswahl** | `V` | Einzel-/Mehrfachauswahl, Verschieben, Skalieren, Drehen, Shift=90°-Snap |
| ✏ | **Freihand** | `P` | RDP-Glättung, Strichart, Stärke 1–10px, Farbe |
| ⬜ | **Formen** | `O` | 9 Shapes (Rect, Ellipse, Dreieck, Polygon, Stern, Linie, Pfeil, Pfad), Shift=45°-Snap |
| T | **Text** | `T` | Inline-Editor, 6–72px, Bold/Italic/Underline, Ausrichtung, Farbe + Hintergrund |
| ↔ | **Bemaßung** | `M` | DIN-Style Zwei-Klick-Tool, automatische Meterangabe, Shift=45°-Snap |
| 🔍 | **Ausschnitt** | `A` | Druckbereich auf A4 definieren, Frame verschieben/skalieren |

### Ausschnitt-Tool

Definiert welcher Teil der Szene auf A4 gedruckt wird — ohne die Szene zu verändern:

- Rahmen auf dem Canvas aufziehen → Maßstab wird automatisch berechnet
- Content-Frame innerhalb der A4-Seite verschiebbar und skalierbar (Platz für Header/Footer)
- SmartRoad-Objekte innerhalb des Frames verschiebbar
- Override bleibt bei Tool-Wechsel bestehen, Reset via StatusBar

### Canvas & Viewport

| Feature | Details |
|---------|---------|
| **DIN A4 Canvas** | 794 × 1123px, korrektes Seitenformat |
| **Infinite Viewport** | Grauer Arbeitsbereich um das Blatt |
| **Spacebar-Pan** | Leertaste halten + Maus ziehen |
| **Scroll-Zoom** | Mausrad mit Zoom-to-Pointer |
| **Mittelmaus-Pan** | Mittlere Maustaste |
| **Reset** | Klick auf `%` in der Statusbar |

### Maßstab-System

25 Stufen von 1:10 bis 1:5000. Vollautomatisch berechnet aus der Bounding Box aller realen Objekte. Feine Abstufungen verhindern, dass Inhalte zu klein dargestellt werden. Manueller Override via Ausschnitt-Tool.

### Objekt-Bibliothek

Slide-Out-Drawer mit 6 Kategorien:

| Kategorie | Inhalte |
|-----------|---------|
| **SmartRoads** | Gerade, Kurve, Kreuzung, Kreisverkehr |
| **Fahrzeuge** | PKW, LKW, Zweirad, Bus, Sonderfahrzeuge |
| **Infrastruktur** | Gebäude, Bordsteine, Leitplanken, Poller |
| **Verkehrsregelung** | Ampeln, Verkehrszeichen, Zusatzzeichen |
| **Umgebung** | Bäume, Hecken, Laternen, Bushaltestellen |
| **Markierungen** | Bremsspuren, Splitterfelder, Kollisionspunkte |

### Ebenen-Manager

- Card-Style Einträge (75px) mit Farbpunkt, Icon, Name
- Actions immer sichtbar: Properties, Sichtbarkeit, Sperren, Löschen
- Drag & Drop Z-Order
- Inline-Rename per Doppelklick

### Floating Properties

Frei positionierbares Modal mit typ-spezifischen Controls und integriertem HSV Color Picker.

---

## Tech Stack

| Bereich | Technologie | Zweck |
|---------|-------------|-------|
| Framework | **React 19** | Komponentenbasierte UI |
| Sprache | **TypeScript 5.9** (strict) | Typsicherheit |
| Bundler | **Vite 8** | Dev-Server, optimierte Builds |
| Canvas | **Konva + react-konva** | Deklaratives Canvas-Rendering |
| State | **Zustand + zundo** | State-Management + Undo/Redo |
| Styling | **Tailwind CSS 4** | Utility-First + CSS Custom Properties |
| UI Primitives | **Radix UI** | Dialog, Accordion, ToggleGroup (SmartRoad Editor) |
| Icons | **Lucide React** | Konsistente Ikonografie |
| Offline | **PWA** | Precaching aller Assets |

---

## Projekt-Struktur

```
src/
├── smartroads/                     # SmartRoads Constrained Editor
│   ├── types.ts                    # Strip, Marking, RoadClass, StraightRoadState
│   ├── constants.ts                # RASt-Defaults, Presets, generateLaneMarkings()
│   ├── editors/                    # StraightEditor (CurveEditor etc. geplant)
│   ├── rendering/
│   │   ├── SmartRoadCanvasObject   # Hauptcanvas-Renderer
│   │   ├── RoadTopView             # Editor-Draufsicht (interaktiv)
│   │   ├── StripRenderer           # Dispatcher → strips/
│   │   ├── MarkingRenderer         # Dispatcher → markings/
│   │   ├── strips/                 # Lane, Sidewalk, CyclePath, Parking, Green, Curb
│   │   └── markings/               # CenterLine, Crosswalk, StopLine, DirectionArrow
│   └── shared/                     # EditorShell, QuickSettings, Palette, Properties
│
├── components/
│   ├── Canvas/                     # SketchCanvas, CanvasObjects, shapeRefs
│   ├── Toolbar/                    # 6 Tool-Gruppen + PrintAreaTool
│   ├── LayerManager/               # Ebenen-Panel (Card-Style, DnD)
│   ├── Inspector/                  # FloatingProperties, ColorPicker
│   ├── Sidebar/                    # Library-Drawer
│   ├── TopBar/                     # Header, Dokument-Properties
│   ├── StatusBar/                  # Zoom, Maßstab, Override-Indicator
│   └── ui/                         # Shared PanelPrimitives
│
├── hooks/                          # useDrawing, useKeyboard, useAusschnitt
├── store/                          # Zustand Store
├── types/                          # Core TypeScript-Definitionen
└── utils/                          # scale.ts, snapAngle.ts
```

---

## Tastatur-Shortcuts

| Shortcut | Aktion |
|----------|--------|
| `V` | Auswahl-Tool |
| `P` | Freihand |
| `O` | Formen |
| `T` | Text |
| `M` | Bemaßung |
| `A` | Ausschnitt |
| `Leertaste` (halten) | Canvas verschieben |
| `Shift` + Rotation | 90°-Snap |
| `Shift` + Linie/Pfeil/Bemaßung | 45°-Snap |
| `Delete` / `Backspace` | Löschen |
| `Escape` | Auswahl aufheben / Tool zurücksetzen |
| `Ctrl+A` | Alle Objekte auswählen |
| `Ctrl+0` | Ansicht einpassen |
| `Ctrl+1` | 100% Zoom |

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

### Zwei Objekt-Welten

| | Zeichenobjekte | Reale Objekte |
|---|---|---|
| **Beispiele** | Freihand, Shapes, Text | SmartRoads, Fahrzeuge |
| **Koordinaten** | Page-Pixel | Meter |
| **Skalierung** | Frei per Handles | Parametrisch (Editor) |
| **Maßstab** | Irrelevant | Bestimmt Darstellungsgröße |

### SmartRoads: Constrained Editor

Kein freier Canvas, kein rein parametrisches System. **Geordnete Streifen-Listen** mit garantierter Korrektheit. Markierungen frei platzierbar auf der auto-generierten Draufsicht. Vollständige Spezifikation: [SMARTROADS.md](SMARTROADS.md)

### State = Single Source of Truth

Zustand Store. Canvas, Ebenen-Manager, Properties, Toolbar und SmartRoad-Editor rendern dieselben Daten. Kein Sync nötig.

---

## Roadmap

- [x] **Phase 1** — Foundation (Canvas, Viewport, Layout, Theme)
- [x] **Phase 2** — Zeichenwerkzeuge (Freihand, 9 Formen, Text, Bemaßung)
- [x] **Phase 3** — SmartRoads Constrained Editor (Gerade)
- [x] **Phase 3b** — Ausschnitt-Tool, Maßstab-Verfeinerung, Editor Properties
- [ ] **Phase 4** — SmartRoads: Kurven, Kreuzungen, Kreisverkehre
- [ ] **Phase 5** — SVG-Fahrzeuge + Objekt-Bibliothek
- [ ] **Phase 6** — Undo/Redo UI, Export (PDF/PNG/SVG), Save/Load, Auto-Save

---

## Grundsätze

| Prinzip | Umsetzung |
|---------|-----------|
| **Einfachheit** | Jede Interaktion erklärt sich selbst. Drei Schichten: Zero Config → Quick Adjust → Full Custom. |
| **Datenschutz** | Null externe Verbindungen. Keine Telemetrie, keine CDN-Fonts, alles lokal. |
| **Offline-first** | Nach dem Laden komplett autark. PWA mit Precaching. |
| **Maßstabstreue** | Alle Straßenelemente nach RASt 06, RAL 2012, ERA 2010, RMS-1. |

---

## Lizenz

Proprietary — [choboworks](https://github.com/choboworks)

---

<p align="center">
  <sub>Built with React 19 · TypeScript 5.9 · Vite 8 · Konva · Zustand · Tailwind CSS 4 · Radix UI</sub>
</p>
