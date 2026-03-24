# CLAUDE.md - Projekt-Kontext

> Was man für dieses Projekt wissen muss, das nicht sauber aus dem Code allein ableitbar ist.
> Changelog -> `changelog.md`
> Straßen-Normen -> `Nachschlagewerk_Strasseninfrastruktur_Deutschland.md`
> Radverkehr -> `Radverkehrs Nachschlagewerk.md`

---

## Was ist das?

**033-Skizze V2** ist ein Verkehrsunfallskizzen-Tool für die Polizei.
Die App soll **modern und stylisch** wirken, aber darunter ein belastbares Fachwerkzeug sein.

- **Zielgruppe**: Polizeivollzugsbeamte
- **Prinzip**: Einfachheit in der Bedienung, aber fachlich ernstzunehmende Ergebnisse
- **Tech**: React 19, TypeScript, Vite, react-konva, Zustand, Tailwind CSS 4, Radix UI
- **Offline-first**: PWA, keine externen Laufzeitabhängigkeiten für den Kernworkflow

```bash
npm run dev
npm run build
npm run lint
```

---

## Aktueller Stand (Session 9, 23.03.2026)

### Fertig / tragfähig

- Hauptcanvas mit DIN-A4-Seite, Pan/Zoom, Auswahl, Freihand, Formen, Text, Bemaßung, Ausschnitt
- Rechte Sidebar als 3-Modus-Bereich: `Ebenen`, `Library`, `Metadaten`
- Floating Properties als globale UI-Komponente
- Globaler `ColorPicker` unter `src/components/ui/`
- Undo/Redo, Kontextmenü, Tooltips, Toasts, Auto-Header, SignatureBlock

### SmartRoads aktuell

- **Gerade** ist der aktive und weit fortgeschrittene Editor
- Strip-basiertes Querschnittsmodell plus freie Markierungen
- Layer-Manager im Editor ist funktional und steuert die Z-Order wirklich
- Properties können über Layer-Manager oder Doppelklick im Preview geöffnet werden
- Strips lassen sich direkt anfassen, ohne Vorselektion
- `lane` und `bus` haben Längslogik über `startOffset` / `endOffset`
- `roadClass` ist aktiv und wichtig: `innerorts`, `ausserorts`, `autobahn`
- Strip-Properties sind modularisiert unter:
  - `src/smartroads/shared/properties/stripDefinitions/`
- Marking-Properties sind modularisiert unter:
  - `src/smartroads/shared/properties/markingDefinitions/`

### Radwege aktuell

- `cyclepath.protected` = **baulich getrennter Radweg** = echter Strip im Querschnitt
- `cyclepath.advisory` = **Schutzstreifen** = fahrbahngebundenes Overlay
- `cyclepath.lane-marked` = **Radfahrstreifen** = fahrbahngebundenes Overlay
- Schutzstreifen und Radfahrstreifen werden standardmäßig **rechts** eingefügt
- Seitenwechsel erfolgt **nicht** über eine Property, sondern per Preview-Drag
- Pro Seite gibt es nur eine fahrbahngebundene Radanlage
- Radweg-Linien, Farben, Strichstärken, Strichlängen und Lücken sind editierbar
- Kleine Linienmaße werden im UI in `cm` gezeigt

### Bauliches aktuell

- Eigene Palette-Kategorie: `Bauliches`
- Darunter aktuell u. a.:
  - `Bordstein`
  - `Rinne`
  - `Leitplanke`
  - `Grünstreifen`
  - `Begrünter Mittelstreifen`
- Bordstein besitzt aktuell die Arten:
  - `Standard`
  - `Abgeflacht`
  - `Ein- oder Ausfahrt`
- `Ein- oder Ausfahrt` ist ein lokaler abgesenkter Abschnitt
- Default-Länge für `Ein- oder Ausfahrt` ist `3.00 m`
- Der Ein-/Ausfahrtsbereich ist im Preview vertikal verschiebbar

### Offen

- SmartRoads: Kurven, Kreuzungen, Kreisverkehre
- Mehr bauliche Elemente mit echter Fachlogik
- Fahrzeuge und weitere Library-Objekte
- Export / Save-Load fertigziehen
- Weitere Norm-Validierungen und mehr Presets, sobald der Editor stabil finalisiert ist

---

## Dateibeziehungen (SmartRoads-Kern)

```
types.ts → stripProps.ts → state.ts
             ↑                  ↑
         rules/*.ts ←→ constants.ts
             ↓
stripPropertyRegistry.ts → stripDefinitions/*.ts

RoadTopView.tsx → StripRenderer.tsx → strips/*.tsx
                → MarkingRenderer.tsx → markings/*.tsx
                → layout.ts (Querschnittslogik, Overlay-Platzierung)
```

- `rules/` = normative Wahrheit (Strichbreiten, Dashlängen, Streifenmaße)
- `stripProps.ts` = defensive Getter/Normalizer; repariert fehlende/ungültige Werte
- `state.ts` = Sanitization beim Laden; stellt sicher, dass alte Objekte nicht crashen
- `constants.ts` = abgeleitete Werte aus `rules/`; nicht manuell duplizieren

---

## Rules-System (`src/smartroads/rules/`)

- `shared.ts`: `RuleSourceRef`-Interface mit Normquelle (Dokument, Abschnitt, Detail)
- `profileRules.ts`: Fahrstreifenbreiten und Mittellinie pro `roadClass`
- `stripRules.ts`: Default-Breiten, Varianten, Radweg-Dimensionen (größte Datei)
- `markingRules.ts`: Dash-Patterns (3m/6m, 4m/8m usw.), Strichbreiten
- **Prinzip**: Neue Normwerte gehören in `rules/`, nicht hart in Renderer oder Properties

---

## Verbindliche Architektur-Entscheidungen

Diese Entscheidungen gelten, bis sie bewusst gemeinsam geändert werden.

1. **Zwei Objekt-Welten**
   Zeichenobjekte arbeiten in Pixeln. Reale Objekte arbeiten in Metern. Diese Welten nicht vermischen.

2. **SmartRoads sind ein Editor im Editor**
   Auf dem Hauptcanvas liegt ein SmartRoad-Objekt. Geometrie wird im SmartRoad-Editor gebaut, nicht frei auf dem Hauptcanvas.

3. **Strips bleiben das Kernmodell**
   SmartRoad-Geometrie basiert auf `strips[]`. Markierungen sind getrennt davon. Kein freies "Malen" für Straßenkörper.

4. **Fahrbahngebundene Radwege sind keine echten Neben-Strips**
   `Schutzstreifen` und `Radfahrstreifen` sind Teil der Fahrbahn und werden als Overlays modelliert.
   `Baulich getrennt` bleibt dagegen ein echter Strip.

5. **Overlay-Radwege werden per direkter Manipulation umpositioniert**
   Keine sichtbare `links/rechts`-Property im Panel. Standardmäßig rechts einfügen, dann per Preview-Drag auf die andere Seite setzen.

6. **RoadClass ist keine rein dekorative Auswahl**
   `innerorts`, `ausserorts`, `autobahn` steuern relevante Defaults:
   - Fahrstreifenbreiten
   - auto-generierte Mittelmarkierungen
   - Strichbreiten / Dash-Defaults

7. **Properties bleiben ein Floating Modal**
   Eigenschaften nicht in der Hauptsidebar verankern. Die Floating Properties sind Teil der Produktlogik.

8. **Position, Größe und Rotation gehören auf den Canvas**
   Keine allgemeine Rückkehr zu numerischen Geometrieformularen für freie Objekte.
   Direkte Manipulation hat Priorität.

9. **SmartRoads nicht auf dem Hauptcanvas freiskalieren**
   Parametrik nur im Editor. Hauptcanvas nur Positionierung / Auswahl / Kontext.

10. **`editorState` ist weiterhin ein JSON-String**
    Migrationen an `StraightRoadState` und Strip-/Marking-Props vorsichtig behandeln.

11. **Properties-Definitionen bleiben modular**
    Neue Strip-Properties in `stripDefinitions/`, neue Marking-Properties in `markingDefinitions/`.
    Nicht wieder alles in eine monolithische Registry zurückkippen.

12. **Globale UI-Komponenten gehören unter `src/components/ui/`**
    `ColorPicker` und `FloatingProperties` sind globale UI-Bausteine, nicht mehr "Inspector"-Spezialfälle.

13. **Normnahe Defaults, aber bewusst editierbar**
    Die App darf "constrained freedom" geben:
    - Defaults und Startwerte sollen normnah sein
    - Nutzer dürfen bewusst abweichen
    - Validierungen dürfen warnen, aber nicht alles hart blockieren

---

## Konventionen

- **UI-Sprache**: Deutsch
- **Code-Sprache**: Englisch
- **Styling**: Tokens und zentrale UI-Muster statt harter Einzelfall-Stile
- **Icons**: Lucide React
- **State**: Zustand, flache Actions, kein Immer
- **Rendering**: Konva für Editor und Hauptcanvas
- **Normbezug**: Straßen- und Radverkehrs-Nachschlagewerke sind Referenz für Defaults und Validierungen
- **Undo/Redo**: Zustand + zundo; debounced Batching für Drag-Operationen
- **Dev-Server**: `npm run dev` auf Port 5173 (Vite); `.claude/launch.json` konfiguriert
- **Maßeinheiten im Code**: Meter für SmartRoad-Werte, Pixel für Canvas; `cm`-Anzeige nur im UI für kleine Maße
- **Neue Strip-/Marking-Werte**: Normwerte in `rules/*.ts`, Getter in `stripProps.ts`, Sanitization in `state.ts`, UI in `stripDefinitions/` oder `markingDefinitions/`

---

## Donts

- Kein neues freies Straßen-Canvas statt SmartRoad-Editor
- Keine SVG-Straßen als Kernmodell
- Keine neue Sidebar-fixe Properties-Architektur
- Keine versteckten Sonderlogiken für Radwege, wenn sie als direkte Manipulation lösbar sind
- Keine hardcodierten Einzel-Property-Monolithen für Strips/Markings
- Keine neuen globalen UI-Komponenten im alten `Inspector`-Pfad
- Keine Resize-Handles für SmartRoad-Geometrie auf dem Hauptcanvas
- Keine neuen Dependencies ohne Absprache
- Nicht committen ohne ausdrückliche Anweisung
- Keine Normwerte direkt in Renderer oder Properties hart codieren; immer über `rules/` definieren
- Keine neuen Strip-Props ohne Default-Getter in `stripProps.ts` und Sanitization in `state.ts`
- `constants.ts` nicht manuell befüllen; Werte werden aus `rules/` abgeleitet

---

## Pitfalls

- **`editorState` als String**: Änderungen an SmartRoad-Typen können alte Objekte brechen
- **`RoadTopView.tsx`**: Zentrale Interaktionsdatei, leicht regressionsanfällig
- **`layout.ts`**: Enthält Querschnittslogik, Overlay-Radwege, Facing-Side-Logik und Platzierungen
- **Cyclepath-Overlay-Logik**: Schutzstreifen und Radfahrstreifen sind fachlich heikel; nicht wie normale freie Strips behandeln
- **Bordstein-Arten**: `Abgeflacht` und `Ein- oder Ausfahrt` müssen in Preview und Hauptcanvas gleich gelesen werden
- **Quick Settings**: Nicht wieder mit zu vielen semantischen Toggles aufblähen; `roadClass`, `Länge`, `Spuren` plus Hinweise ist aktuell die richtige Richtung
- **ColorPicker**: Nutzt Portal-/Layer-Logik; bei Umbauten immer Haupt-App und SmartRoad-Dialog testen
- **`stripProps.ts`**: Defensive Normalisierung; neue Props müssen hier Default-Getter bekommen, sonst NaN/undefined im Rendering
- **`state.ts`**: Sanitization beim Laden; neue Strip-/Marking-Felder müssen in `sanitizeStrip()`/`sanitizeMarking()` abgefangen werden
- **`constants.ts`**: Abgeleitet aus `rules/`; Werte nicht hier manuell setzen, sondern in `rules/*.ts` pflegen
- **`validation.ts`**: Info/Warning/Error-Level; Validierungen dürfen warnen, aber nicht die Eingabe blockieren
