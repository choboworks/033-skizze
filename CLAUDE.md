# CLAUDE.md – Projekt-Kontext für Claude

> Diese Datei dient als Gedächtnis für neue Claude-Instanzen. Changelog → `CHANGELOG.md`. Detaillierte Spezifikationen → `033-skizze-spec.md`, `SMARTROADS.md`, `MASSSTAB-ZOOM.md`.

---

## Projekt-Übersicht

**033-Skizze V2** ist ein professionelles Verkehrsunfallskizzen-Tool für den polizeilichen Einsatz. Moderne Web-Applikation im Figma/Photoshop-Stil.

- **Repo**: https://github.com/choboworks/033-skizze
- **Branch**: main
- **Tech**: React 19, TypeScript 5.9, Vite 8, Konva (react-konva), Zustand + zundo, Tailwind CSS 4, Radix UI (nur im SmartRoad Editor)
- **Zielgruppe**: Polizeivollzugsbeamte (PVBs) — Einfachheit vor Funktionalität

---

## Aktueller Stand (Session 5, 19.03.2026)

### Fertige Features
- **Canvas**: DIN A4, Pan/Zoom, Spacebar-Pan, Scroll-Zoom, resetView
- **Zeichen-Tools**: Freihand (RDP-Glättung), 9 Formen, Text, Bemaßung (DIN-Style)
- **Tool-Gruppen**: V=Auswahl, P=Freihand, O=Formen, T=Text, M=Bemaßung, A=Ausschnitt
- **SmartRoads**: Constrained Editor mit Strip-System, Presets, Markierungen
- **Ausschnitt-Tool**: Druckbereich auf A4 definieren, Frame verschieben/skalieren
- **Ebenen-Manager**: Card-Style, DnD Z-Order, immer sichtbare Actions
- **Floating Properties**: Draggable Modal für Objekt-Eigenschaften

### In Arbeit / Geplant
- SmartRoad Editor: Preset speichern/laden (UI steht, Funktionalität Platzhalter)
- Fahrzeuge & Library-Objekte (SVG-basiert)
- PDF-Export
- Undo/Redo UI-Anbindung (zundo vorbereitet)

---

## Architektur

### Zwei Objekt-Welten

| | Zeichenobjekte | Reale Objekte |
|---|---|---|
| Einheit | Pixel (Page-Koordinaten) | Meter |
| Skalierung | Frei (Transformer) | Parametrisch (nur im Editor) |
| Position | `x`, `y` | `xMeters`, `yMeters` |
| Beispiele | Rect, Ellipse, Freihand, Text | SmartRoad, Fahrzeuge (geplant) |
| Resize | Transformer-Handles | Nicht erlaubt auf Canvas |

### Maßstab-System

- **Auto-Maßstab**: Berechnet aus Bounding Box aller realen Objekte. `recalculateScale()` bei jeder Mutation. 25 Stufen von 1:10 bis 1:5000.
- **Ausschnitt-Override**: User kann via Ausschnitt-Tool einen Druckbereich definieren. `ScaleViewportOverride { centerX, centerY, scale, frameX, frameY, frameW, frameH }`. Override bleibt bei Tool-Wechsel bestehen, Reset via StatusBar.
- **Effective Scale**: `viewport?.scale ?? currentScale`. Alle Rendering-Funktionen nutzen den effektiven Maßstab.
- **Content-Frame**: Bei Override wird der Inhalt in einen Rahmen innerhalb der A4-Seite gerendert (Default: 190×257mm, 25mm Header oben, 15mm Footer unten). Frame ist verschiebbar und skalierbar.

### SmartRoad-System (Constrained Editor)

**Kernprinzip**: Kein freier Canvas für Straßen. Geordnete Strip-Listen, korrekte Proportionen by Design.

- **Strip-Array als Datenmodell**: `{ strips: Strip[], markings: Marking[], length: number, roadClass?: RoadClass }`
- **Straßenklassen**: Innerorts (3m/6m, 12cm), Außerorts (6m/12m, 12cm), Autobahn (6m/12m, 15cm)
- **Auto-Regeneration**: Leitlinien werden automatisch bei Spuränderung neu generiert
- **Phase-Drag**: Vertikales Ziehen verschiebt Dash-Phase, Linie bleibt volle Länge
- **Phase-Snap**: Leitlinien snappen zur Phase anderer Leitlinien
- **Strip-Snap**: Markierungen snappen an Fahrstreifengrenzen

### Store-Architektur (Zustand)

```
AppState:
  document         — DocumentMeta (Name, Aktenzeichen, Datum, Sachbearbeiter, Dienststelle)
  viewport         — { x, y, zoom } (Bildschirm-Darstellung)
  scale            — { currentScale, rawScale, viewport: ScaleViewportOverride | null }
  canvasSize       — { width, height }
  objects          — Record<string, CanvasObject>
  objectOrder      — string[] (Z-Order)
  selection        — string[]
  activeTool       — ToolType
  toolOptions      — ToolOptions
  roadEditor       — { roadId, subtype } | null
  panels           — PanelStates
  theme            — 'dark' | 'light'
  propertiesPanelId — string | null
  activeLibraryCategory — string | null
  editingTextId    — string | null
```

---

## Datei-Referenz

### Core
| Datei | Zweck |
|-------|-------|
| `src/store/index.ts` | Zustand Store, alle Actions |
| `src/types/index.ts` | CanvasObject, ShapeType, ToolType, ScaleState, ScaleViewportOverride |
| `src/App.tsx` | Layout, SmartRoad Editor Overlay, DevTestBench |

### Canvas
| Datei | Zweck |
|-------|-------|
| `src/components/Canvas/SketchCanvas.tsx` | Konva Stage, Pan/Zoom, Drawing, Dimension-Tool, Ausschnitt-Integration |
| `src/components/Canvas/CanvasObjects.tsx` | Shape-Rendering + SelectionTransformer, effectiveScale + Viewport-Offset |
| `src/components/Canvas/shapeRefs.ts` | Globale Map für Konva Node-Referenzen |

### Toolbar & Tools
| Datei | Zweck |
|-------|-------|
| `src/components/Toolbar/Toolbar.tsx` | 6 Tool-Gruppen + Library-Kategorien |
| `src/components/Toolbar/FreehandTool.tsx` | Freihand-Popover |
| `src/components/Toolbar/ShapesTool.tsx` | Formen-Popover (3×3 Grid) |
| `src/components/Toolbar/TextTool.tsx` | Text-Popover |
| `src/components/Toolbar/DimensionTool.tsx` | Bemaßung-Popover |
| `src/components/Toolbar/PrintAreaTool.tsx` | Ausschnitt: PrintAreaFrame + PrintAreaPreview Komponenten |

### UI
| Datei | Zweck |
|-------|-------|
| `src/components/LayerManager/LayerManager.tsx` | Main-App Ebenen-Manager (Card-Style, 240px, DnD) |
| `src/components/Inspector/FloatingProperties.tsx` | Main-App Properties-Modal |
| `src/components/Inspector/ColorPicker.tsx` | Custom HSV Color Picker |
| `src/components/TopBar/TopBar.tsx` | Header mit Dokument-Properties |
| `src/components/StatusBar/StatusBar.tsx` | Zoom-Controls, Maßstab (orange bei Override + Reset) |
| `src/components/Sidebar/LibrarySidebar.tsx` | Library-Drawer |
| `src/components/ui/PanelPrimitives.tsx` | Shared UI-Primitives |

### Hooks
| Datei | Zweck |
|-------|-------|
| `src/hooks/useDrawing.ts` | Drawing-Logik (Klick+Drag, RDP, 45°-Snap) |
| `src/hooks/useKeyboard.ts` | Keyboard Shortcuts (V/P/O/T/M/A + Toggle) |
| `src/hooks/useAusschnitt.ts` | Ausschnitt-Tool Hook (Frame-Drag) |

### SmartRoads
| Datei | Zweck |
|-------|-------|
| `src/smartroads/types.ts` | Strip, Marking, RoadClass, StraightRoadState, etc. |
| `src/smartroads/constants.ts` | RASt-Defaults, ROAD_CLASS_CONFIG, generateLaneMarkings() |
| **Editors** | |
| `src/smartroads/editors/StraightEditor.tsx` | Orchestrator: Selection, Properties, Layer Manager |
| **Shared UI** | |
| `src/smartroads/shared/EditorShell.tsx` | Overlay-Layout (3-Spalten, Header, Footer) |
| `src/smartroads/shared/ElementPalette.tsx` | Linke Sidebar: Streifen + Markierungen (Radix Accordion) |
| `src/smartroads/shared/QuickSettings.tsx` | Rechte Sidebar: Art, Länge, Spuren, Gehweg/Radweg/Parken |
| `src/smartroads/shared/PresetList.tsx` | 6 Presets + Speichern/Laden Buttons |
| `src/smartroads/shared/EditorLayerManager.tsx` | Ebenen-Manager im Editor (Card-Style) |
| `src/smartroads/shared/FloatingEditorProperties.tsx` | Draggable Properties-Modal im Editor |
| `src/smartroads/shared/EditorProperties.tsx` | Properties-Dispatcher |
| `src/smartroads/shared/properties/StripProperties.tsx` | Strip: Breite, Richtung, Variante |
| `src/smartroads/shared/properties/MarkingProperties.tsx` | Marking: Variante, Strichbreite |
| **Rendering** | |
| `src/smartroads/rendering/SmartRoadCanvasObject.tsx` | Hauptcanvas-Renderer (effectiveScale + Offset) |
| `src/smartroads/rendering/RoadTopView.tsx` | Editor-Draufsicht (interaktiv, Snap, Selection) |
| `src/smartroads/rendering/StripRenderer.tsx` | Dispatcher: Strip-Typ → Konva-Komponente |
| `src/smartroads/rendering/MarkingRenderer.tsx` | Dispatcher: Marking-Typ → Konva-Komponente |
| `src/smartroads/rendering/strips/*.tsx` | Lane, Sidewalk, CyclePath, Parking, Green, Curb, Generic |
| `src/smartroads/rendering/markings/*.tsx` | CenterLine, LaneBoundary, Crosswalk, StopLine, DirectionArrow |
| `src/smartroads/rendering/markings/snapHelper.ts` | Shared Snap-Logik |
| `src/smartroads/shared/patterns.ts` | Textur-Generierung (Pflaster, Gras, Asphalt) |

### Dokumentation
| Datei | Zweck |
|-------|-------|
| `CLAUDE.md` | Diese Datei — Projekt-Kontext |
| `CHANGELOG.md` | Session-Changelog |
| `033-skizze-spec.md` | Verbindliche Spezifikation v2.0 |
| `SMARTROADS.md` | SmartRoads Constrained Editor Spezifikation |
| `MASSSTAB-ZOOM.md` | Ausschnitt-Tool Spezifikation |
| `straßengrößen.md` | Nachschlagewerk: Deutsche Straßennormen (RASt, RAL, ERA, RMS-1) |

---

## Konventionen

- **Sprache UI**: Deutsch (Labels, Tooltips, Platzhalter)
- **Sprache Code**: Englisch (Variablen, Kommentare, Commits)
- **Styling**: Tailwind CSS 4 + inline styles mit CSS-Variablen
- **State**: Zustand mit flachen Actions, kein Immer
- **Komponenten**: Funktionale Components, keine Klassen
- **Icons**: Lucide React (einzige Icon-Library)
- **Tool-Panels**: Jedes Tool hat eigene Datei (FreehandTool.tsx, PrintAreaTool.tsx, etc.)
- **Hooks**: Eigene Dateien in `src/hooks/` (useDrawing, useKeyboard, useAusschnitt)
- **Design**: Figma/PS-Stil — große Touch-Targets, Card-Style Layer-Einträge (75px), generous Spacing
- **SmartRoad Editor**: Constrained Editor Pattern — Strip-Array als Datenmodell, React/CSS Querschnitt, Konva Draufsicht
- **Markierungen**: RMS-1 konforme Maße (straßengrößen.md als Referenz), maßstabsgerecht
- **Maßstab**: Auto-berechnet + User-Override via Ausschnitt-Tool möglich
- **Zwei Objekt-Welten**: Pixel-Zeichenobjekte vs. Meter-basierte reale Objekte

### Architektur-Entscheidungen
1. Keine Layer-Gruppierung — flache Objektliste
2. Properties als Floating Modal (nicht Sidebar-fixiert)
3. Koordinaten: Zeichenobjekte in Pixeln, SmartRoads in Metern
4. Position/Größe/Rotation nur auf Canvas manipulierbar (keine Zahlen-Eingabe)
5. Library-Drawer überlagert Canvas (absolut positioniert)
6. SmartRoads vor Library (Alleinstellungsmerkmal)
7. Konva Shapes für Roads (nicht SVG) — SVG erst beim Export
8. Constrained Editor: Streifen immer bündig, keine Lücken, Korrektheit by Design
9. Editor-Architektur: Selection State in StraightEditor geliftet, FloatingProperties Pattern wiederverwendet
10. Ausschnitt-Tool: Override bleibt bei Tool-Wechsel, Reset nur explizit
