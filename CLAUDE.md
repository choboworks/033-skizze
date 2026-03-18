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

---

### Session 2 – 2026-03-17

**Teilnehmer**: User (Alex) + Claude Opus 4.6

#### Was wurde gemacht:

**1. Layout-Umbau: Toolbar + Library**
- **Alte Toolbar (vertikale Icon-Leiste)** wurde aus dem Layout entfernt
- **Neue Architektur**: Toolbar (48px) links mit Tool-Gruppen oben + Library-Kategorie-Icons unten
- Library-Drawer erscheint als **absolut positioniertes Overlay** neben der Toolbar (schiebt Canvas nicht)
- Library-Drawer mit **Grid-Layout** (3x2 Spalten), großen Thumbnails, Filter-Chips und Kategorie-Tabs
- Symmetrisches Layout: Toolbar links (48px) = LayerManager rechts (48px) wenn beide collapsed

**2. Tool-Gruppen & Popovers**
- Tools in **5 Gruppen** zusammengefasst statt einzelner Icons:
  - Select (V): Nur Auswahl-Tool (Direktauswahl + Hand entfernt – nicht relevant für Polizisten)
  - Freihand (P): Pencil-Tool
  - Formen (O): 9 Shapes im 3x3 Grid
  - Text (T): Text-Tool
  - Bemaßung (M): Dimension-Tool
- **Per-Group Popovers**: Long-press oder Rechtsklick öffnet Tool-spezifisches Options-Panel
- Popovers als **eigenständige abgerundete Panels** (rounded-2xl, 320px breit, Shadow)
- **Kleines Dreieck** am Icon zeigt an, dass Varianten/Optionen verfügbar sind
- Popover **öffnet automatisch** bei Tool-Auswahl (auch via Keyboard-Shortcut)
- **Toggle-Verhalten**: Nochmal gleichen Shortcut drücken → zurück zu Select

**3. Freihand-Tool komplett implementiert**
- **Zeichnen**: Klick+Drag sammelt Punkte, bei mouseUp wird Pfad vereinfacht
- **Pfad-Glättung**: Ramer-Douglas-Peucker Algorithmus + Konva tension Parameter
- **Strichart**: Durchgezogen / Gestrichelt / Gepunktet (Segmented Control)
- **Strichstärke**: Slider 1-10px
- **Glättung**: Slider 0-100%
- **Farbe**: Custom ColorPicker integriert
- Rendering als Konva `Line` mit `lineCap: round`, `lineJoin: round`

**4. Shapes-Tool mit 9 Formen**
- **3x3 Grid** im Popover mit großen quadratischen Icon-Buttons
- Neue Shapes: Rechteck, Abgerundetes Rechteck, Ellipse, Dreieck, Polygon (Hexagon), Stern, Linie, Pfeil, Pfad
- **Pfeil** als echte Konva `Arrow` mit dynamischer Pfeilspitze
- **Stern** als Konva `Star` (5 Zacken, innerRadius 0.4)
- **Dreieck + Polygon** als Konva `RegularPolygon`
- **Abgerundetes Rechteck** mit cornerRadius: 12
- **Füllung** nur bei geschlossenen Formen (nicht bei Linie/Pfeil/Pfad)
- Konturart (Strichart) für alle Shapes verfügbar

**5. Design-System: PanelPrimitives**
- Neue shared UI-Datei: `src/components/ui/PanelPrimitives.tsx`
- Wiederverwendbare Komponenten: PanelSection, PanelSlider, PanelSpacer, PanelSliderEnd, PanelSegmented, PanelColorLabel
- **Design-Konsistenz** zwischen Tool-Popovers und Floating Properties
- Einheitliches Spacing: px-7, pt-7, pb-8, h-10 Spacer, 15px Labels, py-3.5 Segmented Buttons

**6. Floating Properties: Tool-spezifisch**
- Properties-Panel rendert **je nach obj.type** unterschiedliche Controls:
  - Freehand: Strichstärke, Strichart, Glättung, Strichfarbe, Deckkraft
  - Shapes (geschlossen): Konturstärke, Konturart, Konturfarbe, Füllfarbe, Deckkraft
  - Shapes (offen: Linie/Pfeil/Pfad): Konturstärke, Konturart, Konturfarbe, Deckkraft (keine Füllung)
- **Doppelklick** auf Canvas-Objekt öffnet Properties-Panel
- Gleiche PanelPrimitives wie Tool-Popovers

**7. Keyboard Shortcuts überarbeitet**
- V = Auswahl, P = Freihand (Pencil), O = Formen (Objekte), T = Text, M = Bemaßung
- `direct-select` und `hand` komplett aus ToolType entfernt (Hand = Spacebar)
- **Toggle-Verhalten**: Nochmal gleichen Shortcut → zurück zu Select
- Shortcut öffnet auch das zugehörige Tool-Popover

#### Architektur-Entscheidungen:

1. **Keine Layer-Gruppierung**: User wollte explizit KEINE vorgefertigten Layer-Kategorien (Straßen, Fahrzeuge etc.). Jedes Objekt ist ein eigener Eintrag im Ebenen-Manager. DEFAULT_LAYERS ist ein leeres Array.

2. **Properties als Floating Modal**: Nicht in der rechten Sidebar fixiert, sondern als draggbares Fenster. Öffnet per Zahnrad-Icon ODER Doppelklick auf Canvas-Objekt.

3. **Koordinaten in Pixeln**: CanvasObject x/y/width/height sind in Page-Pixel-Koordinaten (relativ zu A4-Seite bei 0,0), nicht in Metern. Meter-Konvertierung kommt später.

4. **Position/Größe/Rotation NICHT im Properties-Panel**: User will, dass Objekte nur auf dem Canvas manipuliert werden (Drag/Handles), keine Zahlen-Eingabe.

5. **Sidebar-Breite dynamisch**: LayerManager steuert seine eigene Breite (48px collapsed, 300px expanded). Kein Wrapper in App.tsx.

6. **Icons immer Lucide**: Keine anderen Icon-Libraries.

7. **Tool-Popovers eigenständig**: Jedes Tool baut sein eigenes Popover (FreehandTool.tsx, ShapesTool.tsx). Keine shared ToolPopover-Wrapper-Komponente. Shared Design über PanelPrimitives.

8. **Library-Drawer überlagert Canvas**: Absolut positioniert, schiebt den Canvas nicht. Im Gegensatz zum LayerManager der im Flex-Flow liegt.

9. **Zielgruppe bedenken**: Polizisten, keine Designer. Library (Fahrzeuge, Schilder) ist wichtiger als Zeichentools. Einfachheit vor Funktionalität. Keine Ankerpunkt-Bearbeitung, kein Direktauswahl-Tool.

---

### Session 3 – 2026-03-18

**Teilnehmer**: User (Alex) + Claude Opus 4.6

#### Was wurde gemacht:

**1. Bemaßung (Dimension) Tool — komplett implementiert**
- `DimensionShape` Komponente in CanvasObjects.tsx: DIN-Style Bemaßungslinie mit Pfeilspitzen an beiden Enden, senkrechte Verlängerungsstriche, Maßzahl zentriert über der Linie
- Zwei-Klick-Muster in SketchCanvas.tsx: Erster Klick = Startpunkt, Zweiter Klick = Endpunkt
- Vorschau während des Zeichnens (gestrichelte Linie + Kreise)
- Distanz automatisch in Metern via `pixelsToMeters()`
- `DimensionToolPopover` (Linienstärke, Schriftgröße, Farbe)
- Dimension Properties im FloatingProperties Panel
- Ruler-Icon im LayerManager
- Popover in Toolbar verdrahtet (`hasPopover: true`, case 'measure')

**2. Bemaßungslinie draggable gemacht**
- Problem: Group hatte `x={0} y={0}` mit absoluten Koordinaten → nicht verschiebbar
- Fix: Alle Koordinaten relativ zum Startpunkt, Group origin = `dimensionStart`
- `onDragEnd`: Verschiebt sowohl `dimensionStart` als auch `dimensionEnd` um gleiches Delta
- Hauptlinie hat `hitStrokeWidth={20}` für klickbaren Bereich (andere Children = `listening={false}`)

**3. Shift-constrained Rotation (90°-Snap)**
- `SelectionTransformer`: Shift-Key-State via `useState` + keydown/keyup Listener
- `rotationSnaps={shiftHeld ? [0, 90, 180, 270] : []}`
- `rotationSnapTolerance={shiftHeld ? 45 : 0}` — 45° Toleranz = lückenlose Abdeckung, NUR 90°-Winkel möglich bei Shift
- Gilt für ALLE Objekte (Shapes, Text, Bemaßung)

**4. Shift-constrained Drawing (45°-Snap)**
- Neue Utility: `src/utils/snapAngle.ts` mit `snapTo45()` Funktion
- Berechnung: Winkel zum nächsten 45°-Vielfachen snappen, Endpunkt auf diesem Winkel bei gleicher Distanz
- In `useDrawing.ts`: `onDrawMove()` nimmt jetzt `shiftKey` Parameter, wendet 45°-Snap bei Linien/Pfeilen an
- In `SketchCanvas.tsx`: Dimension-Vorschau UND finaler Klick nutzen 45°-Snap bei Shift
- `e.evt.shiftKey` wird von Konva-Events durchgereicht

**5. Spec-Datei komplett überarbeitet (033-skizze-spec.md v2.0)**
- Tech Stack aktualisiert (React 19, Vite 8, TS 5.9, Tailwind 4, keine Radix UI/Immer)
- Layout-Diagramm an tatsächliche Architektur angepasst (kein Inspector rechts, Floating Properties, keine Menüleiste)
- Werkzeuge: 5 Gruppen mit korrekten Shortcuts (P/O/T/M statt B/L/R), 9 Shapes dokumentiert
- **Zwei Objekt-Welten definiert**: Zeichenobjekte (Pixel, frei skalierbar) vs. Reale Objekte (Meter, parametrisch, kein freier Resize)
- **Dynamischer Auto-Maßstab**: User wählt nie den Maßstab, wird automatisch berechnet
- Maßstab-System mit `metersToPixels()`/`pixelsToMeters()` Formeln dokumentiert
- Ebenen-Manager: Flache Objektliste (keine Layer-Gruppierung) dokumentiert
- Farbpalette aktualisiert (echte Werte aus index.css)

**6. Phasen-Plan neu strukturiert**
- Phase 3 = **SmartRoads MVP** (Gerade Straße) — detaillierter Plan mit 7 Teilschritten (3a–3g)
- Phase 4 = SmartRoads Editor & erweiterte Segmente
- Phase 5 = Objekte & Library (vorher Phase 3)
- Phase 6 = Polish & Export (vorher Phase 5)

#### Architektur-Entscheidungen (Session 3):

10. **Zwei Objekt-Welten**: Zeichenobjekte (Pixel-basiert, frei skalierbar) vs. Reale Objekte (Meter-basiert, parametrisch). SmartRoads und Fahrzeuge sind NICHT frei skalierbar.

11. **Dynamischer Auto-Maßstab**: User wählt NIE den Maßstab. System berechnet ihn automatisch basierend auf Bounding Box aller realen Objekte. `recalculateScale()` wird bei jeder Road-Mutation aufgerufen.

12. **Getrennte Store-Collections**: `roads` + `roadOrder` (Meter-basiert) neben `objects` + `objectOrder` (Pixel-basiert). SmartRoads haben eigenes Datenmodell, eigenes Rendering, eigene Interaktion.

13. **SmartRoads vor Library**: Straßen sind das Herzstück (Alleinstellungsmerkmal), nicht die SVG-Bibliothek. Phase 3 = SmartRoads, Phase 5 = Library.

14. **Konva Shapes für Roads (nicht SVG)**: Direkte Konva Rects/Lines für performantes parametrisches Rendering. SVG-Generierung erst beim Export.

#### Nächster Schritt (Session 4):

**Phase 3: SmartRoads — Gerade Straße (MVP)**
- Detaillierter Plan in `033-skizze-spec.md` Kapitel "Phase 3"
- Schritte 3a–3g: Datenmodell → Rendering → Auto-Maßstab → Library-Drop → Canvas-Interaktion → Quick-Properties → Ebenen-Manager

---

## Datei-Referenz

| Datei | Zweck |
|-------|-------|
| `src/store/index.ts` | Zustand Store, alle Actions, setToolOptions |
| `src/types/index.ts` | TypeScript Definitionen (CanvasObject, ShapeType inkl. dimension, ToolType, ToolOptions) |
| `src/components/Canvas/SketchCanvas.tsx` | Konva Stage, Pan/Zoom, Drawing-Integration, Dimension-Tool (2-Klick), Text Inline-Editor |
| `src/components/Canvas/CanvasObjects.tsx` | Shape-Rendering (alle Typen inkl. TextShape, DimensionShape) + SelectionTransformer (90°-Snap) |
| `src/components/Canvas/shapeRefs.ts` | Globale Map für Konva Node-Referenzen (extrahiert für ESLint) |
| `src/components/LayerManager/LayerManager.tsx` | Ebenen-Panel mit Drag&Drop Z-Order, Icons für alle Typen inkl. Text/Dimension |
| `src/components/Inspector/FloatingProperties.tsx` | Typ-spezifisches Properties-Modal (Freehand, Shape, Text, Dimension) |
| `src/components/Inspector/ColorPicker.tsx` | Custom HSV Color Picker |
| `src/components/Toolbar/Toolbar.tsx` | Tool-Gruppen, Library-Icons, Popover-Management inkl. Dimension |
| `src/components/Toolbar/FreehandTool.tsx` | Freihand-Popover |
| `src/components/Toolbar/ShapesTool.tsx` | Formen-Popover (3x3 Grid) |
| `src/components/Toolbar/TextTool.tsx` | Text-Popover (Größe, Bold/Italic/Underline, Ausrichtung, Farbe) |
| `src/components/Toolbar/DimensionTool.tsx` | Bemaßung-Popover (Linienstärke, Schriftgröße, Farbe) |
| `src/components/Sidebar/LibrarySidebar.tsx` | Library-Drawer (Overlay, Grid-Layout, Placeholder) |
| `src/components/ui/PanelPrimitives.tsx` | Shared UI: PanelSection, PanelSlider, PanelSpacer, PanelSliderEnd, PanelSegmented, PanelColorLabel |
| `src/components/TopBar/TopBar.tsx` | Header mit Logo, Dateiname-Dropdown, Dokument-Properties |
| `src/components/StatusBar/StatusBar.tsx` | Canvas-Info, Zoom-Controls, Scale-Anzeige |
| `src/constants/library.ts` | Library-Kategorie-Definitionen |
| `src/hooks/useDrawing.ts` | Drawing-Logik (Klick+Drag, Freehand mit RDP, Shift 45°-Snap für Linien/Pfeile) |
| `src/hooks/useKeyboard.ts` | Keyboard Shortcuts (V/P/O/T/M + Toggle) |
| `src/utils/scale.ts` | DIN A4 Maßstab-Berechnungen, metersToPixels/pixelsToMeters |
| `src/utils/snapAngle.ts` | `snapTo45()` — Endpunkt auf nächsten 45°-Winkel snappen |
| `src/index.css` | Design-Tokens, CSS Custom Properties, Animationen (anim-slide-left etc.) |
| `033-skizze-spec.md` | Verbindliche Spezifikation v2.0 (aktualisiert Session 3) |

---

## Konventionen

- **Sprache UI**: Deutsch (Labels, Tooltips, Platzhalter)
- **Sprache Code**: Englisch (Variablen, Kommentare, Commits)
- **Styling**: Tailwind CSS 4 Klassen + inline styles mit CSS-Variablen (var(--xxx))
- **State**: Zustand mit flachen Actions, kein Immer
- **Komponenten**: Funktionale Components, keine Klassen
- **Icons**: Lucide React, immer (einzige Icon-Library)
- **Tool-Panels**: Jedes Tool hat eigene Datei, shared Design via PanelPrimitives
- **Popovers**: Eigenständige rounded-2xl Panels, 320px breit, absolut positioniert
- **Spacing-Standard**: PanelSection (px-7, pt-7, pb-8), PanelSpacer (h-10), Labels (15px), Buttons (py-3.5)
- **Animationen**: CSS Keyframes mit `cubic-bezier(0.16, 1, 0.3, 1)` Easing
- **Zwei Objekt-Welten**: Zeichenobjekte (Pixel, frei skalierbar) vs. Reale Objekte (Meter, parametrisch, kein freier Resize)
- **Maßstab**: Dynamisch, automatisch berechnet, User wählt nie
