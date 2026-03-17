# CLAUDE.md – Projekt-Kontext für Claude

> Diese Datei wird nach jeder Session aktualisiert. Sie dient als Gedächtnis für neue Claude-Instanzen, um den aktuellen Stand, getroffene Entscheidungen und die Architektur des Projekts zu verstehen.

---

## Projekt-Übersicht

**033-Skizze V2** ist ein professionelles Verkehrsunfallskizzen-Tool für den polizeilichen Einsatz. Es ist die komplette Neuauflage des ursprünglichen 033-Skizze Projekts, neu aufgebaut als moderne Web-Applikation im Figma/Photoshop-Stil.

- **Repo**: https://github.com/choboworks/033-skizze
- **Branch**: main
- **Tech**: React 19, TypeScript 5.9, Vite 8, Konva, Zustand, Tailwind CSS 4

---

## Session-Log

### Session 1 – 2026-03-17

**Teilnehmer**: User (Alex) + Claude Opus 4.6

#### Was wurde gemacht:

**1. Projekt-Setup & Grundgerüst**
- Vite + React + TypeScript Projekt war bereits scaffolded (vom User)
- Logo (logo.png) und Favicon (favicon.svg) vom User bereitgestellt und eingebunden
- Alte Vite-Dateien (vite.svg) entfernt

**2. Design-System komplett überarbeitet (Figma/PS-Style)**
- `index.css`: Neue Design-Tokens mit CSS Custom Properties
  - Farben: Dunklere, kontrastreichere Palette (--bg: #1a1a1a, --surface: #252525)
  - Neue Variablen: --surface-active, --accent-muted, --text-secondary, --border-subtle, --warning
  - Spacing-System: --space-xs/sm/md/lg/xl
  - Größen: --topbar-height: 46px, --statusbar-height: 32px, --toolbar-width: 48px, --sidebar-width: 300px
  - Wiederverwendbare Klassen: .panel-header, .icon-btn, .field-input, .field-label
  - Dark + Light Theme über [data-theme] Attribut

**3. TopBar redesigned**
- Links: Logo + editierbarer Dateiname mit Chevron-Dropdown
- Mitte: "033 SKIZZE" Brand-Text
- Rechts: "Lokal gespeichert" Status, Share, Sun/Moon Theme-Toggle, Help, Settings
- Dokument-Properties (Aktenzeichen, Datum, Sachbearbeiter, Dienststelle) im Dropdown beim Dateinamen

**4. Canvas-System**
- Konva Stage mit ResizeObserver (passt sich an Container an, nicht window.innerWidth)
- DIN A4 Seite bei (0,0), zentriert beim ersten Render via Viewport-Offset
- Startet bei 100% Zoom (nicht fit-to-view)
- Photoshop-Style Spacebar-Panning (Leertaste halten + Maus ziehen)
- Mittlere Maustaste Pan
- Scroll-Wheel Zoom mit Zoom-to-Pointer
- Klick auf % in StatusBar = resetView (100% + zentrieren)
- canvasSize wird im Store gespeichert für resetView-Berechnung

**5. Zeichen-Tools implementiert**
- useDrawing Hook: Klick+Drag erstellt Objekte
- Unterstützte Tools: rect, ellipse, line (arrow vorbereitet)
- Nach dem Zeichnen: Auto-Switch zu Select-Tool, Objekt selektiert
- Cursor wechselt zu Crosshair im Zeichenmodus
- Zu kleine Objekte (< 3px) werden automatisch entfernt (versehentlicher Klick)
- Default-Füllung: transparent (nicht blau)

**6. Objekt-Rendering & Selection**
- CanvasObjects.tsx rendert alle Objekte aus dem Store als Konva-Shapes
- Shared Transformer für Multi-Select (ein Transformer für alle selektierten Objekte)
- Shape-Refs über globale Map verwaltet
- Klick auf Objekt = Select, Shift+Klick = Multi-Select
- Drag = Verschieben, Handles = Skalieren, Rotate-Handle = Drehen
- Klick auf leeren Canvas = Deselektieren
- Delete/Backspace = Löschen

**7. Ebenen-Manager (Photoshop-Style)**
- Zeigt NUR Objekte auf dem Canvas (keine vorgefertigten Kategorien)
- Default: leer, "Keine Objekte" Platzhalter
- Objekte erscheinen automatisch beim Erstellen
- 56px hohe Einträge mit Thumbnail-Icon, Name, Typ, Farbpunkt
- Hover-Actions: Settings2 (Properties), Eye (Sichtbarkeit), Lock (Sperren), Trash (Löschen)
- Inline-Rename per Doppelklick auf Namen
- **Drag & Drop Z-Order**: GripVertical Handle, blaue Drop-Indicator-Linie
- objectOrder Array im Store bestimmt Zeichenreihenfolge
- **Auto-Expand**: Klappt auf wenn neues Objekt hinzugefügt wird
- **Auto-Collapse**: Klappt zu wenn letztes Objekt gelöscht wird
- **Collapsible**: Eingeklappt = 48px (= Toolbar-Breite), mit vertikalem "EBENEN" Text + Layers-Icon
- Klick auf Icon/Text öffnet immer (auch wenn leer)

**8. Floating Properties Manager**
- Draggable Modal (GripHorizontal Titlebar)
- Öffnet per Zahnrad-Icon im LayerManager
- Zentriert sich beim ersten Öffnen
- Sektionen: Bezeichnung, Deckkraft (Slider + %), Kontur (Slider + ColorPicker), Füllung (Quick-Color-Bar + ColorPicker)
- 400px breit, py-5 Spacing, max-height 65vh scrollbar

**9. Custom Color Picker**
- Sättigung/Helligkeit-Fläche (160px hoch) mit weißem Picker-Dot
- Hue-Slider (Regenbogen-Leiste)
- Live-Vorschau Swatch + Hex-Eingabe mit # Prefix
- 10 Preset-Farben + Transparent als Swatches
- Öffnet nach OBEN (bottom-full) damit nichts abgeschnitten wird
- HSV <-> Hex Konvertierung in reinem JS

**10. Store-Architektur**
- Zustand + zundo (Undo/Redo vorbereitet, UI-Anbindung ausstehend)
- State: document, viewport, scale, canvasSize, objects, objectOrder, selection, activeTool, toolOptions, panels, theme, propertiesPanelId, layers (leer), roadEditor
- objectOrder: Array für Z-Reihenfolge (Index 0 = unten, letzter = oben)
- partialize: Explizite Property-Liste für Undo-History (viewport, panels, theme etc. ausgeschlossen)
- addObject fügt zu objects + objectOrder hinzu
- removeObject entfernt aus objects + objectOrder + selection

#### Architektur-Entscheidungen:

1. **Keine Layer-Gruppierung**: User wollte explizit KEINE vorgefertigten Layer-Kategorien (Straßen, Fahrzeuge etc.). Jedes Objekt ist ein eigener Eintrag im Ebenen-Manager. DEFAULT_LAYERS ist ein leeres Array.

2. **Properties als Floating Modal**: Nicht in der rechten Sidebar fixiert, sondern als draggbares Fenster. Öffnet per Zahnrad-Icon, nicht per Doppelklick (Doppelklick = Inline-Rename).

3. **Koordinaten in Pixeln**: CanvasObject x/y/width/height sind in Page-Pixel-Koordinaten (relativ zu A4-Seite bei 0,0), nicht in Metern. Meter-Konvertierung kommt später.

4. **Position/Größe/Rotation NICHT im Properties-Panel**: User will, dass Objekte nur auf dem Canvas manipuliert werden (Drag/Handles), keine Zahlen-Eingabe. Nur Deckkraft, Kontur, Füllung im Properties-Panel.

5. **Sidebar-Breite dynamisch**: LayerManager steuert seine eigene Breite (48px collapsed, 300px expanded). Kein Wrapper in App.tsx.

6. **Icons immer Lucide**: Keine anderen Icon-Libraries.

#### Offene Punkte / Nächste Schritte:

- Objekt-Bibliothek (LibrarySidebar): SVG-Fahrzeuge, Verkehrszeichen per Drag & Drop
- SmartRoads: Parametrischer Straßengenerator
- Undo/Redo UI-Anbindung (zundo ist ready)
- Text-Tool
- Export (PDF, PNG, SVG)
- Speichern/Laden (.033sketch Format)
- Auto-Save in IndexedDB
- Touch-Support

---

## Datei-Referenz

| Datei | Zweck |
|-------|-------|
| `src/store/index.ts` | Zustand Store, alle Actions |
| `src/types/index.ts` | TypeScript Definitionen (CanvasObject, ShapeType, AppState etc.) |
| `src/components/Canvas/SketchCanvas.tsx` | Konva Stage, Pan/Zoom, Drawing-Integration |
| `src/components/Canvas/CanvasObjects.tsx` | Shape-Rendering + Shared Transformer |
| `src/components/LayerManager/LayerManager.tsx` | Ebenen-Panel mit Drag&Drop, Auto-Expand/Collapse |
| `src/components/Inspector/FloatingProperties.tsx` | Draggable Properties-Modal |
| `src/components/Inspector/ColorPicker.tsx` | Custom HSV Color Picker |
| `src/components/TopBar/TopBar.tsx` | Header mit Dateiname-Dropdown |
| `src/hooks/useDrawing.ts` | Drawing-Logik (Klick+Drag Objekt-Erstellung) |
| `src/hooks/useKeyboard.ts` | Keyboard Shortcuts |
| `src/utils/scale.ts` | DIN A4 Maßstab-Berechnungen, PAGE_WIDTH_PX/PAGE_HEIGHT_PX |
| `src/index.css` | Design-Tokens, CSS Custom Properties, Base Styles |

---

## Konventionen

- **Sprache UI**: Deutsch (Labels, Tooltips, Platzhalter)
- **Sprache Code**: Englisch (Variablen, Kommentare, Commits)
- **Styling**: Tailwind CSS Klassen + inline styles mit CSS-Variablen (var(--xxx))
- **State**: Zustand mit flachen Actions, kein Immer (trotz Import)
- **Komponenten**: Funktionale Components, keine Klassen
- **Icons**: Lucide React, immer
