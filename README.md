<p align="center">
  <img src="public/logo.png" alt="033-Skizze Logo" width="120" />
</p>

<h1 align="center">033-Skizze</h1>

<p align="center">
  Web-basiertes Verkehrsunfallskizzen-Tool
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Fabric.js-6-ff6600" alt="Fabric.js 6" />
  <img src="https://img.shields.io/badge/Vite-7-646cff?logo=vite" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss" alt="Tailwind CSS 3" />
</p>

---

## Überblick

**033-Skizze** ist eine professionelle Webanwendung zur Erstellung von Verkehrsunfallskizzen. Das Tool ermöglicht es, direkt im Browser Unfallskizzen zu erstellen — mit parametrischen Straßen, Fahrzeugen, Verkehrszeichen, Umgebungselementen und freiem Zeichnen.

### Kernfunktionen

- **Parametrischer Straßengenerator** — Gerade und kurvige Straßen mit konfigurierbaren Spuren, Fahrbahnmarkierungen, Gehwegen, Radwegen, Straßenbahnen und Parkstreifen
- **Umfangreiche Asset-Bibliothek** — Fahrzeuge, Infrastruktur, Verkehrsregelung, Umgebungselemente und Markierungen per Drag & Drop
- **Professionelle Zeichenwerkzeuge** — Freihand-Stift, Textfelder, Linien, Pfeile, geometrische Formen, Fülleimer und Radierer
- **Layer-Management** — Sichtbarkeit, Sperren, Z-Reihenfolge und Benennung einzelner Elemente
- **Undo/Redo** — Transaktionsbasiertes Command Pattern mit bis zu 100 Schritten
- **PDF-Export** — PDF/A-1b-konformer Export mit 300 DPI, sRGB-ICC-Profil und Metadaten
- **Vorgangsdaten** — Erfassung von Metadaten wie Aktenzeichen, Datum und weiteren Falldaten
- **Dark/Light Theme** — Systemübergreifendes Farbschema mit FOUC-Prävention
- **Touch-Support** — Optimiert für Tablet-Nutzung mit Touch-Pan und -Gesten
- **PWA-fähig** — Web App Manifest für die Installation auf Endgeräten

---

## Tech Stack

| Bereich | Technologie |
|---------|-------------|
| **Frontend** | React 19, TypeScript 5.9 (strict mode) |
| **Build** | Vite 7, ESBuild |
| **Canvas** | Fabric.js 6 (Retina-optimiert, max 3x) |
| **State** | Zustand 5 |
| **Styling** | Tailwind CSS 3, CSS Custom Properties |
| **Drag & Drop** | react-dnd (HTML5 + Touch Backends) |
| **PDF-Export** | pdf-lib (PDF/A-1b), pdfmake |
| **Animationen** | Framer Motion |
| **Icons** | Lucide React |
| **Linting** | ESLint 9, Prettier |
| **Testing** | Vitest, Playwright (konfiguriert) |
| **SVG-Optimierung** | SVGO |

---

## Erste Schritte

### Voraussetzungen

- **Node.js** >= 18
- **npm** oder **pnpm**

### Installation

```bash
# Repository klonen
git clone https://github.com/choboworks/033-skizze.git
cd 033-skizze

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter **http://localhost:5173** erreichbar.

### Verfügbare Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Vite Dev-Server (Port 5173) mit HMR |
| `npm run build` | TypeScript-Kompilierung + Vite Production Build |
| `npm run preview` | Vite Production Preview (Port 4173) |
| `npm run lint` | ESLint auf `src/**/*.{ts,tsx}` |
| `npm run test` | Vitest Unit Tests |
| `npm run e2e` | Playwright End-to-End Tests |
| `npm run svgo` | SVG-Optimierung in `public/assets` |

---

## Projektstruktur

```
033-skizze/
├── public/
│   ├── assets/
│   │   └── cars/              # Fahrzeug-Sprites (PKW, LKW, etc.)
│   ├── fonts/                 # Inter Variable Font
│   ├── favicon.svg
│   ├── logo.png
│   ├── manifest.webmanifest   # PWA-Manifest
│   └── theme-bootstrap.js     # Synchrones Theme-Loading (FOUC-Prävention)
│
├── src/
│   ├── app/                   # App-Einstieg, Layout, DnD-Provider
│   │
│   ├── canvas/                # Fabric.js Canvas-Engine
│   │   ├── core/              # Canvas-Kern: CrispCanvas, Tools, Clipboard, Zoom, Pan
│   │   ├── roads/             # Straßen-Snapping und Konnektoren
│   │   └── CanvasArea.tsx     # Hauptkomponente — initialisiert Canvas, bindet alle Hooks
│   │
│   ├── history/               # Undo/Redo-System (Command Pattern, max 100 Schritte)
│   │
│   ├── hooks/                 # Geteilte React Hooks (Long Press, Swipe)
│   │
│   ├── modules/
│   │   ├── library/           # Linke Sidebar — Asset-Bibliothek
│   │   │   ├── assets/        # Asset-Definitionen nach Kategorie
│   │   │   └── roads/         # SmartRoad-System
│   │   │       ├── generator/ # SVG-Generatoren (Gerade + Kurve)
│   │   │       ├── inspector/ # Visuelle Straßen-Editoren
│   │   │       └── markings/  # Fahrbahnmarkierungen (Pfeile, Sperrflächen)
│   │   │
│   │   ├── toolbar/           # Obere Werkzeugleiste
│   │   ├── actions/           # Rechte Sidebar — Vorgangsdaten, Export
│   │   ├── layers/            # Layer-Liste (Sichtbarkeit, Lock, Z-Order)
│   │   ├── ui/                # UI-Komponentenbibliothek
│   │   ├── intro/             # Onboarding-Overlay
│   │   └── footer/            # Footer mit Zoom-Controls
│   │
│   ├── services/
│   │   └── export/            # PDF/PNG-Export mit sRGB-ICC-Profil
│   │
│   └── store/
│       └── appStore.ts        # Zustand Store (UI, Elemente, Selektion, Meta, Theme)
│
├── api/                       # Backend: PHP-Kontaktformular mit PHPMailer
├── CLAUDE.md                  # KI-Assistenten-Kontext
├── vite.config.ts             # Vite-Konfiguration mit CSP-Headers
└── tailwind.config.js         # Tailwind-Konfiguration
```

---

## Architektur

### Canvas-Pipeline

Die zentrale `CanvasArea.tsx` erstellt einen **CrispCanvas** (Fabric.js mit Retina-Capping bei max 3x DPR) und orchestriert alle Interaktions-Hooks:

```
CanvasArea.tsx
├── useCanvasPenTool          # Freihand-Zeichnen
├── useCanvasEraserTool       # Radierer
├── useCanvasFillTool         # Fülleimer
├── useCanvasTextTool         # Textfelder
├── useCanvasObjectsTool      # Linien, Pfeile, Formen
├── useCanvasHistory          # Transaktionsbasiertes Undo/Redo
├── useSpaceHandPan           # Leertaste → Pan
├── useWheelZoom              # Mausrad → Zoom
├── useTouchPan               # Touch-Gesten
├── useMarqueeSelection       # Aufzieh-Selektion
├── useRoadSnapping           # Straßen-Konnektoren
├── useCanvasKeyboardShortcuts # Tastatur-Shortcuts
└── useCanvasLayerBridge      # Layer-Synchronisation
```

### SmartRoad-System

Das Herzstück der Anwendung — parametrische Straßen mit Live-Regeneration:

- **`SmartRoad`** extends `fabric.Group` — enthält generiertes SVG als flache Fabric-Objekte
- **Zwei Generator-Typen:** `SmartRoadGenerator` (gerade Straßen) und `CurveRoadGenerator` (Kurven)
- **Modularer Aufbau:** `DimensionModule`, `LaneModule`, `MarkingModule`, `RoadsideModule`, `SurfaceModule`, `TramModule`
- **Dual Rendering Pipeline:**
  - *Preview* (Inspector): React SVG mit `<pattern>`, `<clipPath>` — interaktiv, visuell reichhaltig
  - *Canvas* (Hauptfläche): Fabric.js — nur flache `<path>`-Elemente (Fabric.js unterstützt keine SVG-Patterns/ClipPaths)
- **`flatPaths`-System:** Vorberechnete Schraffur-Linien mit Polygon-Clipping für Fabric.js-Kompatibilität
- **`transformPath.ts`:** Affine Matrixtransformation direkt auf SVG-Pfad-Strings (statt `<g transform>`)
- **Live-Regeneration:** `regenerate()` → Debounce 16ms → `generateSvg()` → `loadSVGFromString()` → Update

### State Management

Zentraler Zustand via **Zustand 5** in `appStore.ts`:

```
AppState
├── UI         # activeTool, objectsMode, sidebarPrefs
├── View       # zoom, panX, panY
├── Elements   # Map<id, ElementModel> — alle Canvas-Objekte
├── Selection  # selectedIds, inspectorConfig
├── Meta       # Vorgangsdaten (Dienststelle, Aktenzeichen, Datum)
└── Theme      # light / dark
```

### Element-Modell

Jedes Canvas-Objekt hat ein zugehöriges `ElementModel` im Store:

| Feld | Beschreibung |
|------|-------------|
| `id` | Eindeutige Kennung |
| `type` | `road` · `vehicle` · `sign` · `environment` · `shape` · `text` · `arrow` · `line` |
| `z` | Z-Index für Schichtung |
| `visible` | Sichtbarkeit |
| `locked` | Sperrstatus |
| `geom` | Position, Rotation, Skalierung |
| `style` | Farbe, Strichstärke, Füllung |
| `data` | Typ-spezifische Zusatzdaten |

### Cross-Module-Kommunikation

Lose Kopplung über Window Custom Events:

| Event | Beschreibung |
|-------|-------------|
| `app:toggle-theme` | Theme wechseln |
| `app:delete-id` | Element löschen |
| `app:rename-id` | Element umbenennen |
| `app:reorder-z` | Z-Reihenfolge ändern |
| `app:select-ids` | Elemente selektieren |

---

## Werkzeuge

| Werkzeug | Shortcut | Beschreibung |
|----------|----------|-------------|
| Auswahl | `V` | Objekte auswählen, verschieben, transformieren |
| Stift | `P` | Freihand-Zeichnen mit konfigurierbarer Strichstärke und Farbe |
| Füllen | `F` | Farbfüllung auf geschlossene Formen anwenden |
| Text | `T` | Textfelder erstellen und bearbeiten |
| Objekte | `O` | Linien, Pfeile (ein-/beidseitig, Kurven), Rechtecke, Ellipsen, Dreiecke |
| Radierer | `E` | Objekte durch Überstreichen löschen |

### Weitere Shortcuts

| Aktion | Shortcut |
|--------|----------|
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Shift+Z` |
| Pan | `Leertaste + Drag` |
| Zoom | `Mausrad` / `Ctrl+Mausrad` |
| Löschen | `Entf` / `Backspace` |
| Marquee-Selektion | `Drag` im Auswahl-Modus |

---

## PDF-Export

- **Standard:** PDF/A-1b (maximale Kompatibilität)
- **Auflösung:** 300 DPI (konfigurierbar)
- **Farbprofil:** Eingebettetes sRGB-ICC-Profil
- **Format:** DIN A4, Hoch- oder Querformat
- **Metadaten:** Titel, Autor, Erstellungsdatum, Schlüsselwörter
- **Optionen:** Direkter Download oder Druckdialog

---

## Sicherheit

- **Content Security Policy** in `vite.config.ts` — produktionsgehärtet
- **Keine Inline-Scripts** in Produktion (`unsafe-eval` nur im Dev-Modus für HMR)
- **object-src: none** — verhindert Plugin-basierte Angriffe
- **Strikte connect-src** — nur `self`, `blob:`, `data:`

---

## Konventionen

| Bereich | Konvention |
|---------|-----------|
| **UI-Sprache** | Deutsch (Labels, Tooltips, Kommentare) |
| **Code-Sprache** | Englisch (Variablen, Funktionen, Klassen) |
| **Komponenten** | Funktional mit Hooks, Props als Inline-Interfaces |
| **Asset-IDs** | `snake_case` (`fz_pkw_kombi`, `infra_strassen_innerorts`) |
| **TypeScript** | Strict Mode, keine unused locals/params, kein fallthrough |
| **Styling** | Tailwind Utility Classes + CSS Custom Properties für Theming |

---

## Lizenz

Proprietär. Alle Rechte vorbehalten.

---

<p align="center">
  <sub>Entwickelt von choboworks</sub>
</p>
