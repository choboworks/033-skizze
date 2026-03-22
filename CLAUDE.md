# CLAUDE.md – Projekt-Kontext

> Was Claude wissen muss, das nicht aus dem Code ablesbar ist.
> Changelog → `CHANGELOG.md`. Straßennormen → `Nachschlagewerk_Strasseninfrastruktur_Deutschland.md`.

---

## Was ist das?

**033-Skizze V2** — Verkehrsunfallskizzen-Tool für die Polizei. Web-App im Figma/Photoshop-Stil.

- **Zielgruppe**: Polizeivollzugsbeamte (PVBs) — Einfachheit vor Funktionalität
- **Tech**: React 19, TypeScript 5.9, Vite 8, Konva (react-konva), Zustand + zundo, Tailwind CSS 4, Radix UI
- **Offline-first**: PWA mit vite-plugin-pwa, null externe Verbindungen
- **Repo**: https://github.com/choboworks/033-skizze

```bash
npm run dev      # Vite Dev-Server (localhost:5173)
npm run build    # tsc -b && vite build
npm run lint     # ESLint
```

---

## Aktueller Stand (Session 6, 21.03.2026)

### Fertig
- Canvas: DIN A4, Pan/Zoom, Spacebar-Pan, Scroll-Zoom
- 6 Tools: V=Auswahl, P=Freihand, O=Formen (9), T=Text, M=Bemaßung, A=Ausschnitt
- SmartRoads: Constrained Editor mit Strip-System, Presets, Markierungen, Properties
- Ausschnitt-Tool: Druckbereich auf A4, Frame verschieben/skalieren
- RightSidebar: Tabs (Library/Metadata) + EbenenPanel
- Unified Panel System: 18 CSS-Tokens, 6 CSS-Klassen, Motion-Tokens
- MetadataPanel: 6 Felder (Überschrift, Vorgangsnummer, Datum, Dienststelle, Abteilung, Sachbearbeiter)
- Floating Properties: Draggable Modal für Objekt-Eigenschaften

### Offen
- SmartRoad: Kurven, Kreuzungen, Kreisverkehre
- Fahrzeuge & Library-Objekte (SVG-basiert) — ToolTypes vorbereitet (brake-trail, debris-field, fluid, collision-point, final-position, movement-line)
- PDF/PNG/SVG-Export (jszip als Dependency vorhanden)
- Save/Load (dexie/IndexedDB als Dependency vorhanden)
- Undo/Redo UI-Anbindung (zundo vorbereitet)

---

## Architektur-Entscheidungen

Diese Entscheidungen sind **verbindlich** und dürfen nicht ohne Absprache geändert werden.

1. **Zwei Objekt-Welten**: Zeichenobjekte (Pixel, frei skalierbar) vs. reale Objekte (Meter, parametrisch im Editor). Nie vermischen.
2. **Flache Objektliste**: Keine Layer-Gruppierung. `objects` + `objectOrder` im Store. (`layers: Layer[]` existiert noch als toter Code — ignorieren, nicht nutzen.)
3. **Properties als Floating Modal**: Nicht Sidebar-fixiert. Draggable mit GripHorizontal.
4. **Position/Größe/Rotation nur auf Canvas**: Keine numerischen Eingabefelder für Geometrie.
5. **SmartRoads = Constrained Editor**: Strip-Array als Datenmodell. Streifen immer bündig, keine Lücken. Korrektheit by Design.
6. **Konva Shapes für Roads**: Nicht SVG — SVG erst beim Export.
7. **Auto-Maßstab**: `recalculateScale()` bei jeder Mutation realer Objekte. 25 Stufen (1:10 bis 1:5000). Override via Ausschnitt-Tool, bleibt bei Tool-Wechsel bestehen.
8. **editorState als JSON-String**: `CanvasObject.editorState` ist `string` (serialisiertes `StraightRoadState`). Bei Migrationen vorsichtig.
9. **Library-Drawer überlagert Canvas**: Absolut positioniert, kein Layout-Shift.

---

## Konventionen

- **UI-Sprache**: Deutsch (Labels, Tooltips, Platzhalter)
- **Code-Sprache**: Englisch (Variablen, Kommentare, Commits)
- **Styling**: Tailwind CSS 4 + CSS Custom Properties (`--panel-*`, `--ease-*`, `--duration-*`). Panel-Komponenten nutzen `.panel-shell`, `.panel-shell-elevated` etc.
- **State**: Zustand mit flachen Actions, kein Immer
- **Komponenten**: Funktional, keine Klassen
- **Icons**: Lucide React (einzige Icon-Library)
- **Markierungen**: RMS-1 konforme Maße (Nachschlagewerk als Referenz)

---

## Don'ts

- **Kein `useEffect` für State-Sync** — Zustand Actions nutzen
- **Keine neuen Dependencies** ohne Absprache
- **Keine Zahlen-Inputs für Position/Größe** — nur Canvas-Manipulation
- **Kein freier Canvas für Straßen** — immer Constrained Editor
- **Keine Layer-Logik bauen** — `layers` Array im Store ist Legacy, nicht nutzen
- **Kein Resize von SmartRoads auf dem Hauptcanvas** — nur im Editor parametrisch änderbar
- **`effectiveScale` immer über Store lesen** — nie lokal berechnen

---

## Pitfalls

- **`SketchCanvas.tsx` (743 LoC)**: Größte Datei, enthält Pan/Zoom/Drawing/Dimension/Ausschnitt. Vorsichtig refactoren, viele Abhängigkeiten.
- **`RoadTopView.tsx` (644 LoC)**: Zweiter Hotspot. Interaktive Draufsicht mit Snap, Selection, Phase-Drag.
- **`LayerManager.tsx` ist verwaist**: Wird in App.tsx nicht importiert. `EbenenPanel.tsx` hat die Rolle übernommen.
- **`editorState` ist ein JSON-String**: Kein typisiertes Objekt im Store. Bei Änderungen am `StraightRoadState`-Typ → bestehende Objekte können brechen.
- **Maßstab nach SmartRoad-Drop**: Position muss NACH `recalculateScale()` konvertiert werden, nicht davor (Bug aus Session 5).
- **Anti-Aliasing-Naht**: Strips werden +0.02m breiter gerendert um Konva Rect-Seams zu vermeiden.
