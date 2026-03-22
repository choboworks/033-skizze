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

## Aktueller Stand (Session 7, 22.03.2026)

### Fertig
- Canvas: DIN A4, Pan/Zoom, Spacebar-Pan, Scroll-Zoom
- 6 Tools: V=Auswahl, P=Freihand, O=Formen (9), T=Text, M=Bemaßung, A=Ausschnitt
- SmartRoads: Constrained Editor mit Strip-System, Presets, Markierungen, Properties
- Ausschnitt-Tool: Druckbereich auf A4, Frame verschieben/skalieren
- RightSidebar: Tabs (Library/Metadata) + EbenenPanel mit Type-Icons
- Unified Panel System: CSS-Tokens + Utility-Klassen (`.meta-input`, `.editor-panel-card`, `.color-picker-well`, `.divider-v`, `.value-display`)
- MetadataPanel: Pflichtfeld-Validierung, Dienststellen-Autocomplete (JSON-Datenbank), Zusatzfelder bei manueller Eingabe
- Auto-Header auf A4 Canvas: Konva-Rendering aus Metadaten (Dienststelle, Vorgangsnummer, Adresse, Telefon, Datum, Sachbearbeiter)
- SignatureBlock: Draggable/resizable/rotierbar, Konva Transformer, nicht im Ebenen-Manager
- Floating Properties: Draggable Modal für Objekt-Eigenschaften
- Undo/Redo: zundo + custom Debounce (150ms) + Flush-before-Undo, Ctrl+Z/Y/Shift+Z
- Tooltips: Alle Toolbar/TopBar-Buttons mit Shortcut-Hints
- Kontextmenü: Rechtsklick auf Canvas (Duplizieren, Löschen, Vordergrund/Hintergrund, Eigenschaften)
- Toast-Benachrichtigungen: Success/Info/Error mit Auto-Dismiss
- Zoom-Controls in StatusBar: +/- Buttons, Einpassen, Auswahl-Info
- Light Mode: Vollständig redesigned, alle hardcoded RGBA → CSS-Tokens
- Keyboard-Shortcuts: Ctrl+Z/Y (Undo/Redo), Ctrl+D (Duplizieren), Ctrl+A, Delete

### Offen
- SmartRoad: Kurven, Kreuzungen, Kreisverkehre
- Fahrzeuge & Library-Objekte (SVG-basiert) — ToolTypes vorbereitet
- PDF/PNG/SVG-Export (jszip vorhanden, `validation.ts` mit `isMetadataComplete()` vorbereitet)
- Save/Load (dexie/IndexedDB vorhanden)

---

## Architektur-Entscheidungen

Diese Entscheidungen sind **verbindlich** und dürfen nicht ohne Absprache geändert werden.

1. **Zwei Objekt-Welten**: Zeichenobjekte (Pixel, frei skalierbar) vs. reale Objekte (Meter, parametrisch im Editor). Nie vermischen.
2. **Flache Objektliste**: Keine Layer-Gruppierung. `objects` + `objectOrder` im Store.
3. **Properties als Floating Modal**: Nicht Sidebar-fixiert. Draggable mit GripHorizontal.
4. **Position/Größe/Rotation nur auf Canvas**: Keine numerischen Eingabefelder für Geometrie.
5. **SmartRoads = Constrained Editor**: Strip-Array als Datenmodell. Streifen immer bündig, keine Lücken.
6. **Konva Shapes für Roads**: Nicht SVG — SVG erst beim Export.
7. **Auto-Maßstab**: `recalculateScale()` bei jeder Mutation realer Objekte. 25 Stufen (1:10 bis 1:5000).
8. **editorState als JSON-String**: `CanvasObject.editorState` ist `string`. Bei Migrationen vorsichtig.
9. **Library-Drawer überlagert Canvas**: Absolut positioniert, kein Layout-Shift.
10. **Undo/Redo via custom Hook**: zundo's `undo()` ist inkompatibel mit Zustand v5 (ersetzt State statt merge). `useUndoRedo.ts` managed Past/Future-Stacks manuell mit Pause/Resume + Debounce-Flush.
11. **PageHeader ist statisch (listening=false)**: Konva-Layer zwischen Paper und Objects. SignatureBlock ist separat und interaktiv.

---

## Konventionen

- **UI-Sprache**: Deutsch (Labels, Tooltips, Platzhalter)
- **Code-Sprache**: Englisch (Variablen, Kommentare, Commits)
- **Styling**: Tailwind CSS 4 + CSS Custom Properties. Neue Inline-Styles MÜSSEN Tokens nutzen (`var(--surface)`, nicht `rgba(255,255,255,0.06)`)
- **State**: Zustand mit flachen Actions, kein Immer
- **Komponenten**: Funktional, keine Klassen
- **Icons**: Lucide React (einzige Icon-Library)
- **Markierungen**: RMS-1 konforme Maße (Nachschlagewerk als Referenz)
- **Shared Constants**: `src/constants/shared.ts` für `LINE_STYLES`, `MARKING_TYPE_LABELS`
- **Shared Utilities**: `src/utils/objectHelpers.ts` für `objectDisplayName()`

---

## Don'ts

- **Kein `useEffect` für State-Sync** — Zustand Actions nutzen
- **Keine neuen Dependencies** ohne Absprache
- **Keine Zahlen-Inputs für Position/Größe** — nur Canvas-Manipulation
- **Kein freier Canvas für Straßen** — immer Constrained Editor
- **Kein Resize von SmartRoads auf dem Hauptcanvas** — nur im Editor parametrisch änderbar
- **`effectiveScale` immer über Store lesen** — nie lokal berechnen
- **Keine hardcoded `rgba(255,255,255,...)` in TSX** — immer CSS-Tokens nutzen
- **Kein `useAppStore.temporal.getState().undo()`** — immer `undoAction()` / `redoAction()` aus `useUndoRedo.ts`
- **Nicht committen ohne explizite Anweisung** — User entscheidet wann

---

## Pitfalls

- **`SketchCanvas.tsx` (~750 LoC)**: Größte Datei. Pan/Zoom/Drawing/Dimension/Ausschnitt/ContextMenu/EmptyHint/SignatureBlock. Vorsichtig refactoren.
- **`RoadTopView.tsx` (644 LoC)**: Zweiter Hotspot. Interaktive Draufsicht mit Snap, Selection, Phase-Drag.
- **`editorState` ist ein JSON-String**: Bei Änderungen am `StraightRoadState`-Typ → bestehende Objekte können brechen.
- **Undo-Debounce**: `_undoDebounce` in `store/index.ts` ist module-level State. `useUndoRedo.ts` flushed den Timer vor Undo. Wenn die Debounce-Logik geändert wird, beide Dateien synchron halten.
- **Dienststellen-JSON**: ~300 Einträge in 7 JSON-Dateien. Werden beim Import sortiert. Adressformat: `"Straße, PLZ Stadt"`.
- **SignatureBlock Position**: Default unten-links, aber User kann es frei verschieben. Position wird NICHT im Store persistiert (geht verloren bei Reload).
