# Changelog – 033-Skizze V2

---

## Session 6 – 21.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6
**Fokus**: UI-Remake — Glassmorphism Design-Overhaul Phase 2

### Canvas Zoom
- **Zoom Snap-to-100%**: Padding auf 0 reduziert, Zoom snappt auf 1.0 wenn im Bereich 0.98–1.02. Canvas-Overlay-Bar entfernt (Info war redundant mit StatusBar).
- **Zoom-Bug gefixt**: Doppelter Store-Update (`setViewport` + `zoomTo`) im Wheel-Handler verursachte Race Conditions beim Pannen. `zoomTo` komplett aus SketchCanvas entfernt.

### Unified Panel System (Neue Architektur)
- **18 neue `--panel-*` CSS-Tokens** (Dark + Light Mode): `panel-bg-base`, `panel-bg-elevated`, `panel-border`, `panel-shadow`, `panel-control-bg/hover/border/active-*`, `panel-radius`, `panel-inner-radius`
- **6 neue CSS-Klassen**: `.panel-shell` (base), `.panel-shell-elevated`, `.panel-popover-header`, `.panel-header-btn`, `.panel-section`, `.segmented-control` + `.segmented-option`
- **PanelPrimitives.tsx**: Neues `PanelHeader` Komponente (icon, title, subtitle, onClose, onMouseDown für Drag). `PanelSection` + `PanelSegmented` auf CSS-Klassen umgestellt.
- **Tool-Popovers** (Freihand, Formen, Text, Bemaßung): Alle auf `panel-shell` + `PanelHeader` migriert, manuelle Header entfernt.
- **FloatingProperties**: Auf `panel-shell-elevated` + `PanelHeader` mit Drag-Support migriert.
- `.tool-popover` auf structural-only reduziert (nur width/padding), `.toggle-btn` auf Token-basiert.
- Redundante Light-Mode Overrides entfernt.

### Interaction Quality System
- **7 Motion-Tokens**: `--ease-out-soft`, `--ease-out-fast`, `--duration-hover` (120ms), `--duration-press` (80ms), `--duration-open` (180ms), `--duration-close` (140ms), `--duration-micro` (100ms)
- **Alle ~15 Transitions** von `0.15s` auf Token-basiert (`var(--duration-hover) var(--ease-out-fast)`)
- **Active/Press States**: Globale `scale(0.97)` mit 80ms für alle klickbaren Elemente
- **Focus Ring**: Dark-Mode `box-shadow: 0 0 0 3px rgba(56,189,248,0.08)` für `.field-input`
- **Panel-Animationen**: `popIn` Keyframe verfeinert (translateY(6px) scale(0.98)), alle auf `180ms ease-out-soft`
- **Library Card Hover**: `translateY(-1px)` Lift-Effekt
- **Library Search Debounce**: 150ms Debounce auf Suchfeld

### SmartRoad Editor Redesign (Komplett)
- **EditorShell**: `panel-bg-elevated`, `radius-2xl` (28px), `panel-shadow`, Entry-Animation `anim-scale-in`. Footer-Buttons auf `surface-btn`/`primary-btn` (36px, radius 14).
- **Bühne (Center)**: `radial-gradient(circle at center, #0f172a, #020617)`, Stage-Container mit `border-radius: 28px`, `box-shadow: 0 40px 120px`, `drop-shadow`.
- **ElementPalette → Chip-System**: Accordion komplett ersetzt durch Kategorie-Chips (Streifen/Markierungen/Presets) + Unterkategorie-Chips + gefilterte 60px Element-Cards mit Icon + Titel + Sublabel. Integrierte Searchbar (40px, 150ms Debounce). Presets als Tab integriert.
- **QuickSettings**: Segmented-Control für Straßentyp, Toggle-Buttons (26px) für Seitenoptionen, NumberStepper auf `toggle-btn` Tokens (28px). Kompakte 28px Controls.
- **EditorLayerManager**: 64px Items, `border-radius: 18px`, accent Selection, Drag Lift (`scale(1.02)` + Shadow statt Opacity), 28×28 Action-Icons.
- **Rechte Sidebar**: Zwei visuell getrennte Panel-Container (Quick Settings elevated + Road Structure base) mit 12px Gap, unterschiedlicher Shadow-Stärke.
- **Linke Sidebar**: Panel-Container mit `border-radius: 20px`, matching right side.
- **FloatingEditorProperties**: `width: 320px`, `border-radius: 20px`, Gradient-Shell, `blur(18px)`.
- **Strip/Marking Properties**: Variant-Buttons als Pills (28px, `border-radius: 9999`), Labels 11px/500, 14px Section-Gap.
- **Spacing Harmonisierung**: Strikte Skala (4, 6, 8, 10, 12, 14, 16, 20, 24px). Typography: 10px eyebrow, 11px meta, 12px buttons, 13px titles.

### TopBar Redesign
- **Layout vereinfacht**: Center-Badges entfernt (Dokumentname, Maßstab, Gespeichert-Status). Nur noch Links: Logo + Projektinfo, Rechts: Actions.
- **Alle Buttons auf 32px**: Einheitlicher Base-Style mit `rgba(255,255,255,0.04)` bg, konsistente Hover/Active States.
- **Button-Gruppen**: [Undo/Redo] | [Save/Export] | [Settings/Theme] mit 1px Separatoren.
- **Export**: Gradient-Primary mit `box-shadow`, brightness-Hover.
- **Glass-Background**: Gleicher `.glass` Style wie Toolbar und rechte Sidebar.

### StatusBar Vereinfachung
- **Entfernt**: Center Zoom Controls (+/- Buttons, % Anzeige), Reset-Button.
- **Zoom-Badge klickbar**: Klick auf Zoom% → `resetView()`.
- **Rechts**: Version + Copyright ("033-Skizze v2.0 · © 2026 ChoboWorks") statt Keyboard-Hints.

### Metadaten-Panel (Komplett neu)
- **Inhalt bereinigt**: Nur noch 6 Felder (Überschrift, Vorgangsnummer, Datum, Dienststelle, Dienstabteilung, Sachbearbeiter/in). Alle technischen Inhalte entfernt (Canvas, Zoom, Grid, Snap, Maßstab).
- **3 Section-Cards**: Vorgang, Zuständigkeit, Bearbeitung. Gradient-Surface (`rgba(255,255,255,0.035)→0.02`), `inset box-shadow`, `border-radius: 16px`.
- **Premium Inputs**: 36px height, `border-radius: 12px`, Hover + Focus States (accent ring `3px`).
- **Panel Header**: Titel + Subtitle ("Falldaten & Zuständigkeit").
- **Date-Picker**: Nativer `type="date"` mit Dark/Light-Mode Styling.
- **Neues Feld**: `subdivision` (Dienstabteilung) in `DocumentMeta` Typ + Store.

### Cleanup
- **Gelöschte Dateien**: `Inspector.tsx` (orphaned), `LibrarySidebar.tsx` (orphaned).
- **PresetList.tsx**: UI-Komponente entfernt, nur noch `STRAIGHT_PRESETS` Export.
- **Unbenutzte Imports bereinigt**: ArrowDown (ElementPalette), ObjectIcon + removeObject + idx (EbenenPanel), STRIP_LABELS + VARIANT_LABELS (ElementPalette).
- **Unbenutzte CSS-Klasse**: `.panel-card` + Light-Mode Overrides entfernt.
- **0 ESLint Fehler, 0 TypeScript Fehler**.

---

## Session 5 – 19.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6

### Bugfixes
- **SmartRoad Drop-Bug**: Straße erschien im LayerManager aber nicht auf dem Canvas. Ursache: Meter-Position wurde mit altem Maßstab berechnet, Rendering nutzte neuen Maßstab nach `recalculateScale()`. Fix: Position wird jetzt nach Scale-Berechnung konvertiert.
- **Anti-Aliasing-Naht**: Sichtbare Lücke zwischen benachbarten Fahrstreifen (Konva Rect-Seams). Fix: Jeder Strip wird um 0.02m breiter gerendert (unsichtbar, eliminiert Naht).
- **Kantenlinie zwischen gleichen Strips**: Weiße Linie zwischen zwei Fahrstreifen im Editor entfernt — Kantenlinie nur noch zwischen verschiedenen Strip-Typen.
- **Freihand auf SmartRoad**: Konnte nicht auf einer SmartRoad zeichnen, da die Straße den Klick abfing. Fix: Objekte nur bei aktivem Select-Tool draggable.
- **Overflow-Warnung falsch**: Warnung wurde gegen Druckbereich (190mm) geprüft statt Seitenbreite (210mm). Fix: Prüfung gegen `PAGE_WIDTH_MM`.
- **SmartRoad Drag im Ausschnitt-Modus**: Position wurde ohne Content-Frame-Offset zurückgerechnet → Objekt verschwand nach Frame-Resize. Fix: `contentOriginX/Y` und `offsetXMeters/Y` in Drag-Handler berücksichtigt.

### Design-Überarbeitung
- **Alle Überschriften zentriert**: Strip-Labels im Editor, Sidebar-Überschriften (Streifen, Markierungen, Quick Settings, Presets, Werkzeuge, Bibliothek, Ebenen) — alles `text-center`.
- **Main-App LayerManager → Card-Style**: 75px hohe Cards mit `rounded-lg`, eigener Border, Farbpunkt, 240px Sidebar-Breite, Actions immer sichtbar (nicht nur Hover).
- **Main-App Toolbar**: 240px expanded (gleich wie LayerManager).
- **SmartRoad Editor komplett überarbeitet (Figma/PS-Style)**:
  - Sidebars breiter: links 280px, rechts 260px
  - ElementPalette: 38px Accordion-Trigger, 34px Varianten-Buttons, 13px Font
  - QuickSettings: 32px Buttons, full-width Art-Selector, collapsible Accordion
  - Presets: 2-Spalten-Grid, 40px Buttons, Speichern/Laden-Buttons (Platzhalter)
  - Footer: Abbrechen/Fertig Buttons 140×44px, mittig unter Preview
  - Header: Titel zentriert über linker Sidebar

### SmartRoad Editor — Neue Features

#### Straßenklassen-System ("Art")
- Toggle in Quick Settings: **Innerorts** / **Außerorts** / **Autobahn**
- Jede Klasse hat eigenes Dash-Pattern und Strichbreite (RMS-1 konform):
  - Innerorts: 3m/6m, Schmalstrich 12cm
  - Außerorts: 6m/12m, Schmalstrich 12cm
  - Autobahn: 6m/12m, Schmalstrich 15cm
- Warnlinien: Innerorts 6m/3m, Autobahn 12m/6m
- Umschalten ändert automatisch alle bestehenden Leitlinien
- `RoadClass` Typ + `ROAD_CLASS_CONFIG` Mapping in constants.ts
- Presets setzen korrekte Straßenklasse (Landstraße → Außerorts, Autobahn → Autobahn)
- `roadClass` im `editorState` gespeichert, backward-compatible

#### Leitlinien-System
- **Default-Straße mit Leitlinie**: `createDefaultStraightRoad()` erzeugt automatisch Centerline-Marking
- **Auto-Regeneration**: `generateLaneMarkings()` Helper — bei Spuränderung werden Leitlinien automatisch neu platziert, andere Markierungen bleiben erhalten
- **RMS-1 konforme Dash-Patterns**: Alle Varianten (standard-dash, rural-dash, autobahn-dash, warning-dash, autobahn-warning, short-dash)
- **Dash-Centering**: Striche werden mittig auf der Straße platziert, nicht an den Rändern. Formel berücksichtigt Cycle-Länge und Straßenlänge für alle Varianten.
- **Phase-Drag**: Vertikales Ziehen einer Leitlinie verschiebt die Dash-Phase (wo die Striche beginnen), Linie bleibt immer über volle Straßenlänge. Direkte Konva-Manipulation via Ref für 60fps Feedback.
- **Phase-Snap**: Beim Drag snappt die Phase an die Phase anderer Leitlinien (0.4m Threshold, wrap-around berücksichtigt) — alle Striche auf gleicher Höhe.
- **Begrenzungslinien**: Y-gesperrt (durchgezogen, kein Phase-Shift nötig), nur horizontal verschiebbar.

#### Markierungs-Interaktion im Editor
- **Selektion**: Alle Markierungen klickbar mit transparenter Hit-Area, blauer Highlight bei Auswahl (`rgba(74,158,255,0.15)`).
- **Löschen**: Delete/Backspace entfernt selektierte Markierung.
- **Snap an Strip-Grenzen**: Markierungen snappen beim Drag an Fahrstreifengrenzen (0.5m Threshold). Snap-Guide-Linien erscheinen während des Drags.
- **Gegenseitig exklusiv**: Strip-Klick deselektiert Marking und umgekehrt.

#### Editor Ebenen-Manager
- **Neuer EditorLayerManager**: Alle Strips + Markierungen als flache Card-Liste, Main-App-Design (Card-Style, Farbpunkt, GripVertical für DnD).
- **Z-Order DnD**: Strips per Drag & Drop umsortieren.
- **Hover-Actions**: Zahnrad (Properties öffnen) + Trash (Löschen), immer sichtbar.
- **Doppelklick** öffnet Floating Properties (wie Main-App).

#### Floating Editor Properties
- **FloatingEditorProperties**: Draggable Modal (GripHorizontal Titlebar, 340px breit), gleicher Style wie Main-App.
- **StripProperties**: Breite (±0.25m Stepper), Richtung (↑/↓ Toggle), Variante (Segmented Control).
- **MarkingProperties**: Variante (Innerorts/Außerorts/Autobahn/Warnlinie), Strichbreite (12cm/15cm/25cm).
- **Öffnet per**: Zahnrad-Icon im EditorLayerManager, Doppelklick auf Element im Canvas oder Layer-Liste.

#### Maßstab-Verbesserungen
- **Feinere Stufen**: 25 Maßstabsstufen von 1:10 bis 1:5000 (vorher 9). Neue Zwischenstufen: 1:15, 1:20, 1:30, 1:40, 1:60, 1:75, 1:125, 1:175, 1:300, 1:400, 1:600, 1:750, 1:1500, 1:3000.
- **Overflow-Warnung**: Gelbe Box mit AlertTriangle wenn Straßenbreite > Seitenbreite im aktuellen Maßstab.
- **Live-Anzeige**: Breite × Länge × Maßstab in Quick Settings, immer sichtbar (auch bei eingeklapptem Accordion).

### Ausschnitt-Tool (neues Tool)
- **Toolbar**: ScanSearch-Icon, Label "Ausschnitt", Shortcut **A**
- **Rahmen aufziehen**: Rechteck auf dem Canvas ziehen → definiert den Druckbereich. Maßstab wird automatisch berechnet.
- **Auto-Switch**: Nach Frame-Erstellung automatisch zurück zu Select-Tool.
- **Content-Frame**: Druckbereich wird in einen Rahmen innerhalb der A4-Seite gerendert (190×257mm, 25mm Header oben, 15mm Footer unten).
- **Interaktiver Frame**: Mit Select-Tool verschiebbar (Drag) + skalierbar (Eck-Handles), live Update. Minimum 40×40mm.
- **Content verschieben**: Bei aktivem Ausschnitt-Tool und existierendem Frame: SmartRoad-Objekte innerhalb des Frames verschiebbar.
- **StatusBar**: Orange Maßstabsanzeige + Reset-Button (RotateCcw) wenn Override aktiv.
- **Datenmodell**: `ScaleViewportOverride { centerX, centerY, scale, frameX, frameY, frameW, frameH }` im Store.
- **Extrahiert**: Hook in `src/hooks/useAusschnitt.ts`, Komponenten in `src/components/Toolbar/PrintAreaTool.tsx`.

### Neue Dateien
| Datei | Zweck |
|-------|-------|
| `src/smartroads/shared/EditorLayerManager.tsx` | Ebenen-Manager im SmartRoad Editor |
| `src/smartroads/shared/FloatingEditorProperties.tsx` | Draggable Properties-Modal im Editor |
| `src/smartroads/shared/EditorProperties.tsx` | Properties-Dispatcher (Strip/Marking) |
| `src/smartroads/shared/properties/StripProperties.tsx` | Strip-Properties (Breite, Richtung, Variante) |
| `src/smartroads/shared/properties/MarkingProperties.tsx` | Marking-Properties (Variante, Strichbreite) |
| `src/smartroads/rendering/markings/snapHelper.ts` | Shared Snap-Logik für Markierungen |
| `src/hooks/useAusschnitt.ts` | Ausschnitt-Tool Hook (Frame-Drag) |
| `src/components/Toolbar/PrintAreaTool.tsx` | Ausschnitt Frame + Preview Komponenten |
| `SMARTROADS.md` | SmartRoads Entwicklungsdokumentation |
| `straßengrößen.md` | Nachschlagewerk: Deutsche Straßennormen & Maße |
| `MASSSTAB-ZOOM.md` | Spezifikation Ausschnitt-Tool |

---

## Session 4 – 18.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6

### SmartRoads Constrained Editor (MVP)
- Komplettes SmartRoad-System: Datenmodell, Rendering, Editor
- StraightEditor mit Strip-Editor, RoadTopView, ElementPalette, QuickSettings, PresetList
- 6 Presets: Erschließungsstraße, Sammelstraße, Hauptverkehrsstraße, Landstraße, Autobahn, Tempo 30
- Konva-Rendering: LaneStrip, SidewalkStrip, CyclePathStrip, ParkingStrip, GreenStrip, CurbStrip
- Markierungen: CenterLine, LaneBoundary, Crosswalk, DirectionArrow, StopLine
- Pattern-System: Pflaster, Gras, Asphalt (Offscreen-Canvas, gecached)
- SmartRoadCanvasObject: Live Konva-Nodes auf dem Hauptcanvas
- Library-Integration: Drag & Drop + Doppelklick aus LibrarySidebar
- Radix UI: Dialog (EditorShell), Accordion (ElementPalette), ToggleGroup (QuickSettings)
- Dependency Cleanup, UI-Fixes

---

## Session 3 – 18.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6

### Bemaßung & Constraints
- Bemaßung (Dimension) Tool komplett implementiert (DIN-Style, Zwei-Klick, draggable)
- Shift-constrained Rotation (90°-Snap)
- Shift-constrained Drawing (45°-Snap)
- Spec-Datei v2.0 überarbeitet
- Phasen-Plan neu strukturiert (SmartRoads vor Library)

---

## Session 2 – 17.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6

### Layout & Tools
- Layout-Umbau: Toolbar + Library-Drawer
- 5 Tool-Gruppen mit Popovers
- Freihand-Tool (RDP-Glättung, Strichart, ColorPicker)
- Shapes-Tool (9 Formen im 3×3 Grid)
- PanelPrimitives Design-System
- Floating Properties typ-spezifisch
- Keyboard Shortcuts (V/P/O/T/M + Toggle)

---

## Session 1 – 17.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6

### Grundgerüst
- Projekt-Setup (Vite + React + TypeScript)
- Design-System (CSS Custom Properties, Dark/Light Theme)
- TopBar, Canvas-System (Konva, Pan/Zoom, A4-Seite)
- Zeichen-Tools (rect, ellipse, line)
- Objekt-Rendering & Selection (Shared Transformer, Multi-Select)
- Ebenen-Manager (Photoshop-Style, DnD Z-Order)
- Floating Properties Manager
- Custom HSV Color Picker
- Zustand Store-Architektur

---

*Dieses Changelog wird nach jeder Session aktualisiert.*
