# CLAUDE.md - Projekt-Kontext

> Was man fuer dieses Projekt wissen muss, das nicht sauber aus dem Code allein ableitbar ist.
> Changelog -> `changelog.md`
> Strassen-Normen -> `Nachschlagewerk_Strasseninfrastruktur_Deutschland.md`
> Radverkehr -> `Radverkehrs Nachschlagewerk.md`

---

## Was ist das?

**033-Skizze V2** ist ein Verkehrsunfallskizzen-Tool fuer die Polizei.
Die App soll **modern und stylisch** wirken, aber darunter ein belastbares Fachwerkzeug sein.

- **Zielgruppe**: Polizeivollzugsbeamte
- **Prinzip**: Einfachheit in der Bedienung, aber fachlich ernstzunehmende Ergebnisse
- **Tech**: React 19, TypeScript, Vite, react-konva, Zustand, Tailwind CSS 4, Radix UI
- **Offline-first**: PWA, keine externen Laufzeitabhaengigkeiten fuer den Kernworkflow

```bash
npm run dev
npm run build
npm run lint
```

---

## Aktueller Stand (Session 9, 23.03.2026)

### Fertig / tragfaehig

- Hauptcanvas mit DIN-A4-Seite, Pan/Zoom, Auswahl, Freihand, Formen, Text, Bemaessung, Ausschnitt
- Rechte Sidebar als 3-Modus-Bereich: `Ebenen`, `Library`, `Metadaten`
- Floating Properties als globale UI-Komponente
- Globaler `ColorPicker` unter `src/components/ui/`
- Undo/Redo, Kontextmenue, Tooltips, Toasts, Auto-Header, SignatureBlock

### SmartRoads aktuell

- **Gerade** ist der aktive und weit fortgeschrittene Editor
- Strip-basiertes Querschnittsmodell plus freie Markierungen
- Layer-Manager im Editor ist funktional und steuert die Z-Order wirklich
- Properties koennen ueber Layer-Manager oder Doppelklick im Preview geoeffnet werden
- Strips lassen sich direkt anfassen, ohne Vorselektion
- `lane` und `bus` haben Laengslogik ueber `startOffset` / `endOffset`
- `roadClass` ist aktiv und wichtig: `innerorts`, `ausserorts`, `autobahn`
- Strip-Properties sind modularisiert unter:
  - `src/smartroads/shared/properties/stripDefinitions/`
- Marking-Properties sind modularisiert unter:
  - `src/smartroads/shared/properties/markingDefinitions/`

### Radwege aktuell

- `cyclepath.protected` = **baulich getrennter Radweg** = echter Strip im Querschnitt
- `cyclepath.advisory` = **Schutzstreifen** = fahrbahngebundenes Overlay
- `cyclepath.lane-marked` = **Radfahrstreifen** = fahrbahngebundenes Overlay
- Schutzstreifen und Radfahrstreifen werden standardmaessig **rechts** eingefuegt
- Seitenwechsel erfolgt **nicht** ueber eine Property, sondern per Preview-Drag
- Pro Seite gibt es nur eine fahrbahngebundene Radanlage
- Radweg-Linien, Farben, Strichstaerken, Strichlaengen und Luecken sind editierbar
- Kleine Linienmasse werden im UI in `cm` gezeigt

### Bauliches aktuell

- Eigene Palette-Kategorie: `Bauliches`
- Darunter aktuell u. a.:
  - `Bordstein`
  - `Rinne`
  - `Leitplanke`
  - `Gruenstreifen`
  - `Begruenter Mittelstreifen`
- Bordstein besitzt aktuell die Arten:
  - `Standard`
  - `Abgeflacht`
  - `Ein- oder Ausfahrt`
- `Ein- oder Ausfahrt` ist ein lokaler abgesenkter Abschnitt
- Default-Laenge fuer `Ein- oder Ausfahrt` ist `3.00 m`
- Der Ein-/Ausfahrtsbereich ist im Preview vertikal verschiebbar

### Offen

- SmartRoads: Kurven, Kreuzungen, Kreisverkehre
- Mehr bauliche Elemente mit echter Fachlogik
- Fahrzeuge und weitere Library-Objekte
- Export / Save-Load fertigziehen
- Weitere Norm-Validierungen und mehr Presets, sobald der Editor stabil finalisiert ist

---

## Verbindliche Architektur-Entscheidungen

Diese Entscheidungen gelten, bis sie bewusst gemeinsam geaendert werden.

1. **Zwei Objekt-Welten**
   Zeichenobjekte arbeiten in Pixeln. Reale Objekte arbeiten in Metern. Diese Welten nicht vermischen.

2. **SmartRoads sind ein Editor im Editor**
   Auf dem Hauptcanvas liegt ein SmartRoad-Objekt. Geometrie wird im SmartRoad-Editor gebaut, nicht frei auf dem Hauptcanvas.

3. **Strips bleiben das Kernmodell**
   SmartRoad-Geometrie basiert auf `strips[]`. Markierungen sind getrennt davon. Kein freies "Malen" fuer Strassenkoerper.

4. **Fahrbahngebundene Radwege sind keine echten Neben-Strips**
   `Schutzstreifen` und `Radfahrstreifen` sind Teil der Fahrbahn und werden als Overlays modelliert.
   `Baulich getrennt` bleibt dagegen ein echter Strip.

5. **Overlay-Radwege werden per direkter Manipulation umpositioniert**
   Keine sichtbare `links/rechts`-Property im Panel. Standardmaessig rechts einfuegen, dann per Preview-Drag auf die andere Seite setzen.

6. **RoadClass ist keine rein dekorative Auswahl**
   `innerorts`, `ausserorts`, `autobahn` steuern relevante Defaults:
   - Fahrstreifenbreiten
   - auto-generierte Mittelmarkierungen
   - Strichbreiten / Dash-Defaults

7. **Properties bleiben ein Floating Modal**
   Eigenschaften nicht in der Hauptsidebar verankern. Die Floating Properties sind Teil der Produktlogik.

8. **Position, Groesse und Rotation gehoeren auf den Canvas**
   Keine allgemeine Rueckkehr zu numerischen Geometrieformularen fuer freie Objekte.
   Direkte Manipulation hat Prioritaet.

9. **SmartRoads nicht auf dem Hauptcanvas freiskalieren**
   Parametrik nur im Editor. Hauptcanvas nur Positionierung / Auswahl / Kontext.

10. **`editorState` ist weiterhin ein JSON-String**
    Migrationen an `StraightRoadState` und Strip-/Marking-Props vorsichtig behandeln.

11. **Properties-Definitionen bleiben modular**
    Neue Strip-Properties in `stripDefinitions/`, neue Marking-Properties in `markingDefinitions/`.
    Nicht wieder alles in eine monolithische Registry zurueckkippen.

12. **Globale UI-Komponenten gehoeren unter `src/components/ui/`**
    `ColorPicker` und `FloatingProperties` sind globale UI-Bausteine, nicht mehr "Inspector"-Spezialfaelle.

13. **Normnahe Defaults, aber bewusst editierbar**
    Die App darf "constrained freedom" geben:
    - Defaults und Startwerte sollen normnah sein
    - Nutzer duerfen bewusst abweichen
    - Validierungen duerfen warnen, aber nicht alles hart blockieren

---

## Konventionen

- **UI-Sprache**: Deutsch
- **Code-Sprache**: Englisch
- **Styling**: Tokens und zentrale UI-Muster statt harter Einzelfall-Stile
- **Icons**: Lucide React
- **State**: Zustand, flache Actions, kein Immer
- **Rendering**: Konva fuer Editor und Hauptcanvas
- **Normbezug**: Strassen- und Radverkehrs-Nachschlagewerke sind Referenz fuer Defaults und Validierungen

---

## Donts

- Kein neues freies Strassen-Canvas statt SmartRoad-Editor
- Keine SVG-Strassen als Kernmodell
- Keine neue Sidebar-fixe Properties-Architektur
- Keine versteckten Sonderlogiken fuer Radwege, wenn sie als direkte Manipulation loesbar sind
- Keine hardcodierten Einzel-Property-Monolithen fuer Strips/Markings
- Keine neuen globalen UI-Komponenten im alten `Inspector`-Pfad
- Keine Resize-Handles fuer SmartRoad-Geometrie auf dem Hauptcanvas
- Keine neuen Dependencies ohne Absprache
- Nicht committen ohne ausdrueckliche Anweisung

---

## Pitfalls

- **`editorState` als String**: Aenderungen an SmartRoad-Typen koennen alte Objekte brechen
- **`RoadTopView.tsx`**: Zentrale Interaktionsdatei, leicht regressionsanfaellig
- **`layout.ts`**: Enthaelt Querschnittslogik, Overlay-Radwege, Facing-Side-Logik und Platzierungen
- **Cyclepath-Overlay-Logik**: Schutzstreifen und Radfahrstreifen sind fachlich heikel; nicht wie normale freie Strips behandeln
- **Bordstein-Arten**: `Abgeflacht` und `Ein- oder Ausfahrt` muessen in Preview und Hauptcanvas gleich gelesen werden
- **Quick Settings**: Nicht wieder mit zu vielen semantischen Toggles aufblasen; `roadClass`, `Laenge`, `Spuren` plus Hinweise ist aktuell die richtige Richtung
- **ColorPicker**: Nutzt Portal-/Layer-Logik; bei Umbauten immer Haupt-App und SmartRoad-Dialog testen
