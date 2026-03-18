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
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Konva-Canvas-ff6347" alt="Konva" />
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

**Bemaßung (M)** — Zwei-Klick-Tool: Start → Ende. Erzeugt DIN-konforme Bemaßungslinie mit Pfeilspitzen, Verlängerungsstrichen und automatischer Meterangabe. Shift = 45°-Snap. Frei verschiebbar nach Erstellung.

### Objekt-Bibliothek

Slide-Out-Drawer neben der Toolbar mit 6 Kategorien:

| Kategorie | Inhalte |
|-----------|---------|
| **SmartRoads** | Parametrischer Straßengenerator (Gerade, Kurve, Kreuzung, Kreisverkehr) |
| **Fahrzeuge** | PKW, LKW, Zweirad, Bus, Sonderfahrzeuge — maßstabsgetreue SVG-Draufsichten |
| **Infrastruktur** | Gebäude, Bordsteine, Leitplanken, Poller, Baustellenelemente |
| **Verkehrsregelung** | Ampeln, StVO-Verkehrszeichen (durchsuchbar), Zusatzzeichen |
| **Umgebung** | Bäume, Hecken, Laternen, Bushaltestellen, Gewässer |
| **Markierungen** | Bremsspuren, Splitterfelder, Flüssigkeiten, Kollisionspunkte, Bewegungslinien |

### Ebenen-Manager

Photoshop-Style Ebenen-Panel auf der rechten Seite:

- Dynamische Objektliste — erscheint automatisch beim Erstellen
- **Drag & Drop** Z-Order mit visueller Drop-Indicator-Linie
- Sichtbarkeit, Sperren, Löschen pro Objekt
- Inline-Rename per Doppelklick
- Auto-Expand / Auto-Collapse
- Collapsible auf 48px für maximalen Canvas-Platz

### Floating Properties

Frei positionierbares Properties-Panel — öffnet per Doppelklick auf Canvas-Objekt oder Zahnrad-Icon im Ebenen-Manager.

Zeigt **typ-spezifische Controls**:
- **Freihand** → Strichstärke, Strichart, Glättung, Farbe, Deckkraft
- **Formen (geschlossen)** → Kontur, Füllung, Deckkraft
- **Formen (offen)** → Kontur, Deckkraft (keine Füllung)
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

Der Maßstab wird **vollautomatisch** berechnet — der User wählt, sieht oder konfiguriert ihn nie direkt. Er erscheint als Info in der Statusbar.

### UI & Design

- **Figma/Photoshop-inspiriert** — Dark & Light Theme, professioneller Look
- Design-Token-System mit CSS Custom Properties
- Shared PanelPrimitives für konsistentes Panel-Design
- CSS Keyframe-Animationen mit Figma-Style Easing
- Inter Font (lokal gebundelt, kein CDN)
- Symmetrisches Layout: Toolbar links (48px) = Ebenen-Manager rechts (48px)

---

## Tech Stack

| Bereich | Technologie | Zweck |
|---------|-------------|-------|
| Framework | **React 19** | Komponentenbasierte UI |
| Sprache | **TypeScript 5.9** (strict) | Typsicherheit für komplexe Datenstrukturen |
| Bundler | **Vite 8** | Schneller Dev-Server, optimierte Builds |
| Canvas | **Konva + react-konva** | Deklaratives Canvas-Rendering |
| State | **Zustand + zundo** | Leichtgewichtiges State-Management mit Undo/Redo |
| Styling | **Tailwind CSS 4** | Utility-First + CSS Custom Properties |
| Icons | **Lucide React** | Konsistente Ikonografie |
| Offline | **vite-plugin-pwa + Workbox** | Precaching aller Assets |
| Lokale DB | **Dexie.js (IndexedDB)** | Auto-Save, Dokumentenverwaltung |
| Dateiformat | **JSZip** | `.033sketch` als JSON-in-ZIP |

**Keine externen UI-Bibliotheken.** Alle Panel-Komponenten sind custom-built (PanelPrimitives).

---

## Projekt-Struktur

```
src/
├── components/
│   ├── Canvas/
│   │   ├── SketchCanvas.tsx       # Konva Stage, Pan/Zoom, Drawing, Dimension-Tool, Text-Editor
│   │   ├── CanvasObjects.tsx      # Shape-Rendering (alle Typen) + SelectionTransformer
│   │   └── shapeRefs.ts           # Globale Map für Konva Node-Referenzen
│   ├── Inspector/
│   │   ├── FloatingProperties.tsx # Typ-spezifisches draggable Properties-Modal
│   │   └── ColorPicker.tsx        # Custom HSV Color Picker
│   ├── LayerManager/
│   │   └── LayerManager.tsx       # Ebenen-Panel mit Drag & Drop Z-Order
│   ├── Sidebar/
│   │   └── LibrarySidebar.tsx     # Library-Drawer (Overlay, Grid-Layout)
│   ├── StatusBar/
│   │   └── StatusBar.tsx          # Zoom, Maßstab, Canvas-Info
│   ├── Toolbar/
│   │   ├── Toolbar.tsx            # Tool-Gruppen, Library-Icons, Popover-Management
│   │   ├── FreehandTool.tsx       # Freihand-Popover
│   │   ├── ShapesTool.tsx         # Formen-Popover (3×3 Grid)
│   │   ├── TextTool.tsx           # Text-Popover
│   │   └── DimensionTool.tsx      # Bemaßung-Popover
│   ├── TopBar/
│   │   └── TopBar.tsx             # Header mit Logo, Dateiname, Dokument-Properties
│   └── ui/
│       └── PanelPrimitives.tsx    # Shared UI-Bausteine (Section, Slider, Segmented, etc.)
├── constants/
│   └── library.ts                 # Library-Kategorie-Definitionen
├── hooks/
│   ├── useDrawing.ts              # Zeichen-Logik (Freehand + Shapes + Shift-Snap)
│   └── useKeyboard.ts            # Keyboard Shortcuts mit Toggle-Verhalten
├── store/
│   └── index.ts                   # Zustand Store mit allen Actions
├── types/
│   └── index.ts                   # TypeScript-Definitionen
├── utils/
│   ├── scale.ts                   # DIN A4 Maßstab, metersToPixels/pixelsToMeters
│   └── snapAngle.ts              # 45°-Snap-Berechnung für Linien/Pfeile/Bemaßung
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
| `Shift` + Rotation | 90°-Snap (0°, 90°, 180°, 270°) |
| `Shift` + Linie/Pfeil/Bemaßung | 45°-Snap beim Zeichnen |
| `Delete` / `Backspace` | Ausgewählte Objekte löschen |
| `Escape` | Auswahl aufheben / Tool zurücksetzen |

> **Toggle-Verhalten:** Shortcut drücken aktiviert Tool + öffnet Popover. Nochmal drücken schließt und wechselt zurück zur Auswahl.

---

## Setup & Entwicklung

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# TypeScript-Check + Production Build
npm run build

# ESLint
npm run lint

# Production Preview
npm run preview
```

---

## Architektur-Prinzipien

**Drei-Schichten-Prinzip** — Jedes Feature folgt dem gleichen Muster:
1. **Zero Config** — Funktioniert sofort mit sinnvollen Defaults
2. **Quick Adjust** — Schnelle Anpassungen über Toggles und +/− Buttons
3. **Full Custom** — Volle Kontrolle für motivierte User, aber nie im Weg

**Zwei Objekt-Welten** — Die App unterscheidet fundamental:
- **Zeichenobjekte** (Freihand, Shapes, Text) — Pixel-basiert, frei skalierbar
- **Reale Objekte** (SmartRoads, Fahrzeuge, Schilder) — Meter-basiert, parametrisch, maßstabsgetreu

**State = Single Source of Truth** — Alles läuft über Zustand. Canvas, Ebenen-Manager, Properties und Toolbar rendern dieselben Daten. Kein Sync nötig.

---

## Roadmap

### Phase 3 — SmartRoads (Straßengenerator) `← aktuell`
- [ ] Gerade Straße als parametrisches Segment (Spuren, Gehwege, Markierungen)
- [ ] Dynamischer Auto-Maßstab bei Straßen-Mutations
- [ ] Drag & Drop aus Library auf Canvas
- [ ] Endpunkt-Handles für Längenänderung
- [ ] Quick-Properties (Spuranzahl, Gehweg L/R/Beide)

### Phase 4 — SmartRoads Editor & erweiterte Segmente
- [ ] SmartRoad Editor Overlay (Element-Palette, Live-Vorschau, Quick Settings)
- [ ] Kurven, Kreuzungen, Kreisverkehre
- [ ] Snapping/Konnektoren zwischen Segmenten
- [ ] Preset-System (System + User-Presets)

### Phase 5 — Objekte & Library
- [ ] SVG-Fahrzeuge mit Einfärbung + maßstabsgerechter Platzierung
- [ ] Object Registry + Drag & Drop
- [ ] Undo/Redo UI-Anbindung
- [ ] Snapping-System

### Phase 6 — Polish & Export
- [ ] PDF-Export mit Druckrahmen + Maßstabsleiste
- [ ] `.033sketch` Save/Load (JSON-in-ZIP)
- [ ] Auto-Save (IndexedDB)
- [ ] Touch-Support
- [ ] Vorlagen-System

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
  <sub>Built with React, Konva, Zustand, and Tailwind CSS.</sub>
</p>
