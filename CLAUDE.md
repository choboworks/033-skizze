# 033-Skizze

Web-basiertes Verkehrsunfallskizzen-Tool für die Polizei Niedersachsen.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.9 (strict), Vite 7
- **Canvas:** Fabric.js 6 — alle gezeichneten Objekte sind Fabric-Objekte
- **State:** Zustand 5 (`src/store/appStore.ts`) — UI, Elements, Selection, Meta, Theme
- **Styling:** Tailwind CSS 3 + CSS Custom Properties (Theme light/dark)
- **DnD:** react-dnd (HTML5 + Touch backends)
- **Export:** pdf-lib, pdfmake

## Commands

```bash
npm run dev        # Vite dev server (port 5173)
npm run build      # tsc -b && vite build
npm run preview    # Vite production preview (port 4173)
npm run lint       # ESLint auf src/**/*.{ts,tsx}
npm run test       # Vitest run
npm run e2e        # Playwright
npm run svgo       # SVG-Optimierung in public/assets
```

## Project Structure

```
src/
  app/           # App-Einstieg, Layout, DnD-Provider
  canvas/        # Fabric.js Canvas + alle Interaktions-Hooks
    core/        # CrispCanvas, metaOverlays, dropSizing, Clipboard, History
    CanvasArea.tsx  # Hauptkomponente — initialisiert Canvas, bindet Hooks
  history/       # Undo/Redo (Command Pattern, max 100)
  hooks/         # Geteilte React Hooks
  modules/
    library/     # Linke Sidebar — Asset-Bibliothek mit Kategorien + SmartRoads
      roads/     # SmartRoad-System (Generator, Inspector, Markings, Presets)
    toolbar/     # Obere Werkzeugleiste (Select, Pen, Fill, Text, Objects, Eraser)
    actions/     # Rechte Sidebar — Layer-Liste, Metadaten, Export
    layers/      # Layer-Management (Sichtbarkeit, Lock, Reihenfolge)
    ui/          # Wiederverwendbare Komponenten (Button, Slider, RadioGroup)
    intro/       # Onboarding-Overlay
  store/         # Zustand Store (appStore.ts)
  services/      # Export (PDF/PNG)
```

## Architecture

### Canvas-Pipeline

`CanvasArea.tsx` erstellt einen `CrispCanvas` (Fabric.js mit Retina-Capping max 3×) und bindet Hooks:
- `useCanvasPenTool`, `useCanvasEraserTool`, `useCanvasFillTool`, `useCanvasTextTool`
- `useCanvasObjectsTool` (Linien, Pfeile, Formen)
- `useCanvasHistory` (transaktionsbasiertes Undo/Redo)
- `useSpaceHandPan`, `useWheelZoom`, `useMarqueeSelection`
- `useRoadSnapping` (Straßen-Konnektoren)

### SmartRoad-System

Parametrische Straßen mit Live-Regeneration:

- `SmartRoad` extends `fabric.Group` — enthält generiertes SVG als Fabric-Objekte
- `SmartRoadGenerator` (gerade) / `CurveRoadGenerator` (Kurven)
- Generator-Module: `DimensionModule`, `LaneModule`, `MarkingModule`, `RoadsideModule`, `SurfaceModule`, `TramModule`
- **Dual Rendering:** Preview (React SVG mit `<pattern>`, `<clipPath>`) vs Canvas (Fabric.js — nur flache `<path>`-Elemente)
- `flatPaths`-System: Vorberechnete Schraffur-Linien mit Polygon-Clipping für Fabric.js-Kompatibilität
- `transformPath.ts`: Affine Matrixtransformation auf SVG-Pfad-Strings (kein `<g transform>` für Fabric.js)
- `regenerate()` → Debounce 16ms → `_doRegenerate()` → `generateSvg()` → `loadSVGFromString()` → `removeAll()` + `add()`
- Inspector: `VisualRoadInspector` (gerade) / `VisualCurveInspector` (Kurven) — öffnet per Doppelklick

### State Flow

```
Inspector → onUpdate(newConfig) → handleRoadUpdate (CanvasArea)
  → road.roadConfig = deepCopy(config)
  → road.regenerate()
  → setInspectorConfig(config)
```

### Element-Modell

Jedes Canvas-Objekt hat ein `ElementModel` im Store (`appStore.elements`):
- `id`, `type`, `z`, `visible`, `locked`, `geom`, `style`, `data`
- Typen: road, vehicle, sign, environment, shape, text, arrow, line

### Cross-Module-Kommunikation

Window Custom Events: `app:toggle-theme`, `app:delete-id`, `app:rename-id`, `app:reorder-z`, `app:select-ids`

## Conventions

- **Sprache:** UI-Labels und Kommentare auf Deutsch, Code (Variablen/Funktionen) auf Englisch
- **Komponenten:** Funktional mit Hooks, Props als Inline-Interfaces
- **Asset-IDs:** snake_case (`fz_pkw_kombi`, `infra_strassen_innerorts`)
- **TypeScript:** strict mode, keine unused locals/params, kein fallthrough
- **Keine Tests vorhanden** — Vitest und Playwright sind konfiguriert, aber es gibt noch keine Testdateien

## Wichtige Hinweise

- Fabric.js unterstützt KEINE SVG-`<pattern>`, `<clipPath>` oder `<style>` — daher das `flatPaths`-System
- `applyFabricPatterns()` in SmartRoad wendet Patterns manuell als Fabric-Pattern-Objekte an
- `makeIdsUnique()` in den Generatoren hängt Timestamp+Random an alle IDs (außer `pattern-*`)
- CSP-Headers in `vite.config.ts` — dev ist lockerer (HMR braucht `unsafe-eval` + WebSocket)
- Theme-Bootstrap in `public/theme-bootstrap.js` verhindert FOUC
