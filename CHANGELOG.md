# Changelog – 033-Skizze V2

---

## Session 12 – 27.03.2026

**Teilnehmer**: Alex + Claude
**Fokus**: Leitplanke (Composite-Strip), Verkehrsinsel (Marking-Umbau), Bauliches-Bereinigung

### Leitplanke: Composite-Strip mit Kontext-Elementen

- **Neuer StripType `guardrail`** mit 3 Varianten: Schutzplanke, Betonschutzwand, Doppelplanke (DIN EN 1317).
- **Composite-Rendering**: Leitplanke rendert optional Randstreifen (Asphalt) + Grünstreifen (Gras-Pattern) als integrale Bestandteile — keine separaten Strips.
- **An/Aus-Toggles** für Randstreifen (default 0.75m) und Grünstreifen (default 0.30m) in den Properties.
- **Korrekte Reihenfolge**: Fahrbahn → Randstreifen → Grün → Planke (von Fahrbahn nach außen).
- **Beidseitige Darstellung**: Bei `facingSide === 'both'` symmetrisch mit Extra-Renderbreite in `layout.ts`.
- **Validierungswarnung**: Info wenn Einzelplanke manuell mittig platziert wird.
- **Pfostenabstand** editierbar, bei Betonwand readonly.
- **Breiten in cm** mit `displayUnit: 'cm'`, `displayFactor: 100`.
- **Single Palette-Eintrag**: Nur "Leitplanke" in der Palette, Variante im Properties-Panel wählbar.
- **Pipeline komplett**: types.ts → stripRules.ts → constants.ts → stripProps.ts → state.ts → GuardrailStrip.tsx → stripDefinitions/guardrail.ts.

### Verkehrsinsel: Umbau von Strip zu Marking

- **Architektur-Entscheidung**: Verkehrsinsel verdrängt keine Fahrstreifen, sondern liegt AUF der Fahrbahn → Marking statt Strip.
- **Strip-Code komplett entfernt**: `IslandStrip.tsx`, `stripDefinitions/island.ts` gelöscht; alle island-Einträge aus types, rules, constants, stripProps, state, validation bereinigt.
- **Neuer MarkingType `traffic-island`** mit Varianten `median-island` (Begrünt) und `raised-paved` (Gepflastert).
- **Marking-Interface erweitert**: Optionale Felder `surfaceType`, `endShape`, `endTaperLength`, `showCurbBorder`, `showApproachMarking`, `approachLength`.
- **Marking-Property-System erweitert**: `MarkingNumberFieldDefinition` hinzugefügt für editierbare Zahlenfelder (analog zu Strip-Properties).
- **TrafficIsland.tsx**: Konva-Renderer mit Inselkörper (Endformen: abgerundet/spitz/flach), Oberflächen-Pattern, Bordstein-Rendering (Schatten/Body/Highlight).
- **Zulaufmarkierung (Z 298)**: Optionale Sperrflächen-Dreiecke an beiden Enden mit Asphalt-Hintergrund (deckt Leitlinie ab), diagonaler Schraffur und Borderlinien.
- **Schraffur-Regeln**: `SPERRFLAECHE_RULES` in `markingRules.ts` mit roadClass-abhängigen Abständen (innerorts 0.40m, außerorts 0.50m, autobahn 0.60m).
- **RoadwayBounds**: Neuer Typ in `layout.ts` — berechnet Fahrbahnbereich (minX, maxX, width) für X-Clamping und Breiten-Constraints.
- **Drag-Snapping**: X-Achse snappt auf Fahrbahnmitte + Streifenkanten (nur innerhalb Fahrbahn), Y-Achse frei mit Center-Snap.
- **constrainTrafficIslandMarkings()**: Automatisches Clamping von Breite und X-Position bei jeder Änderung.
- **Clipping**: `clipFunc` auf SmartRoadCanvasObject (statt `clipX/Y/Width/Height` — funktioniert zuverlässig mit `scaleX/scaleY`), Marking-Layer-Clip im Editor.
- **Varianten-Switch**: Wechsel Begrünt ↔ Gepflastert ändert automatisch Oberfläche, Bordstein und Form.
- **Keine Farbauswahl**: Farbe kommt aus Oberfläche/Pattern, nicht aus manuellem Color-Picker.

### Bauliches-Bereinigung

- **"Begrünter Mittelstreifen"** aus der Palette entfernt (redundant mit normalem Grünstreifen).
- Typ bleibt im Code für Abwärtskompatibilität.

### Bugfixes (aus vorheriger Session übernommen)

- **P0: `handleSet` zundo type mismatch** — `internalHandleSet` auf 1 Parameter reduziert.
- **P0: `CyclePathStrip` variant undefined** — `?? 'protected'` Default.
- **P0: `PageHeader` transformer comparison** — `as unknown as Konva.Node` Cast.
- **P1: `isDrawing` Funktionsaufruf** — `!isDrawing` → `!isDrawing()`.
- **P1: SmartRoad Position-Reset** — nur neue Straßen (`roadId === '__new__'`) zentrieren.
- **P2: Keyboard-Shortcuts im Editor** — Guard: `if (useAppStore.getState().roadEditor) return`.
- **P2: Drag-Cleanup bei Unmount** — `dragCleanupRef` für alle 4 Drag-Handler.
- **P3: UTC → lokales Datum** — `getFullYear/getMonth/getDate` statt UTC-Methoden.
- **Bordstein-Fugenabstand**: Von 1.25m auf 1.00m korrigiert (DIN 483).

### CLAUDE.md + Changelog aktualisiert

- Session-Stand auf 12 (27.03.2026).
- Neue Abschnitte: Leitplanke, Verkehrsinsel.
- Architektur-Entscheidung 14: Verkehrsinseln sind Markings, keine Strips.
- Pitfalls: `clipFunc` statt `clipX/Y`, RoadwayBounds, Approach-Clipping, GuardrailStrip-Reihenfolge.

---

## Session 11 – 25.03.2026

**Teilnehmer**: Alex + Claude
**Fokus**: Parkstreifen, Gehweg-Bereinigung, Kontextmenü, Fahrstreifen-Begrenzungslinien, Palette-Aufräumen

### Parkstreifen: Komplettimplementierung
- **Drei Varianten**: Längsparken (`parallel`, 2.00m), Schrägparken (`angled`, 4.50m, 45°), Querparken (`perpendicular`, 5.00m).
- **Kammmuster für Querparken**: Querlinien + vertikale Randlinie — visuell klar unterscheidbar vom Längsparken.
- **Schrägparken spiegelt nach Straßenseite**: Diagonallinien werden je nach `facingSide` gespiegelt, damit Vorwärtseinparken immer zur Fahrtrichtung passt.
- **Phase-Drag für Stellplatzmarkierungen**: Stellplätze per Grip-Handle verschiebbar (wie bei Leitlinien). Phase-Wrap mit Modulo, kein Clamp auf positive Werte.
- **Grip-Indikator**: Drei dezente horizontale Linien in der Mitte des Strips — nur sichtbar bei selektiertem Strip.
- **Doppelklick auf Properties weiterhin möglich**: Drag-Overlay blockiert nur Drag, nicht Klick/Doppelklick.
- **Markierungsfarbe**: Rein weiß (`#ffffff`) ohne Opacity-Abschwächung, konsistent mit anderen Linien.
- **Asphaltfarbe**: Identisch mit Fahrstreifen (`STRIP_COLORS.lane`).
- **Normwerte in Rules**: `bayLength`, `bayWidth`, `angle`, `editorMinWidth` pro Variante in `stripRules.ts`.

### Gehweg-Bereinigung
- **`shared-bike`-Variante entfernt**: Gemeinsamer Geh-/Radweg (Z 240) ist physisch identisch mit Standard-Gehweg — alle Optionen (Belag, Begrenzungslinien, Breite) bereits im Standard verfügbar.
- **Nur aus Palette entfernt**: Typ bleibt im Type-System für Abwärtskompatibilität; bestehende Straßen crashen nicht.
- **Betonplatten vergrößert**: Pattern von 32×32 auf 64×64 Canvas (Scale 0.009 statt 0.018) — deutlich realistischere Plattenoptik.

### Kontextmenü für SmartRoad-Editor
- **Neue Komponente**: `EditorContextMenu.tsx` — visuell identisch mit dem Haupt-App-Kontextmenü.
- **Strip-Menü**: Eigenschaften, Duplizieren, Nach oben/unten (Ebene), Löschen.
- **Marking-Menü**: Eigenschaften, Löschen.
- **Rechtsklick-Erkennung**: `rightClickTargetRef` in `RoadTopView` speichert das Ziel bei `onMouseDown` mit `button === 2`, wird beim DOM-`contextmenu`-Event ausgelesen.
- **Drag-Handler abgesichert**: `startDragReorder` und `startOverlaySideDrag` prüfen jetzt `e.evt.button !== 0` — Rechtsklick startet keinen Drag mehr.
- **Konva-DblClick-Bug behoben**: `onDblClick` prüft `e.evt.button === 0` — Linksklick + schneller Rechtsklick öffnet nicht mehr fälschlich das Properties-Panel.
- **z-index 10003**: Über FloatingEditorProperties (10002) und Dialog (10001).

### Fahrstreifen: Begrenzungslinien
- **Optionale Außenlinie**: Fahrstreifen können jetzt mit einer äußeren Begrenzungslinie versehen werden.
- **Übliche Optionen**: Modus (Keine/Gestrichelt/Durchgezogen), Seiten (Beide/Links/Rechts), Strichstärke, Dash-Pattern.
- **RoadClass-abhängige Default-Strichstärke**: Innerorts 12cm (Schmalstrich), Außerorts/Autobahn 25cm (Breitstrich).

### Palette aufgeräumt
- **Mittelstreifen (Strip)** und **Busspur** aus der Palette entfernt.
- Typen bleiben im Code für Abwärtskompatibilität.
- Leitplanke und begrünter Mittelstreifen weiterhin unter „Bauliches" verfügbar.

### SmartRoad Bounding-Box auf Hauptcanvas
- **Bounds-Rect eingefügt**: `SmartRoadCanvasObject` rendert jetzt ein unsichtbares Rect mit exakten `totalWidth × length` Dimensionen als erstes Kind — erzwingt korrekte Bounding-Box unabhängig von Strip-Offsets.

### CLAUDE.md aktualisiert
- Session-Stand auf 11 (25.03.2026).
- Neue Abschnitte: Gehwege, Parkstreifen.
- Kontextmenü, Begrenzungslinien, entfernte Palette-Einträge dokumentiert.
- Pitfalls: Konva-Rechtsklick, Drag-Guards, Bounds-Rect.

---

## Session 10 – 24.03.2026

**Teilnehmer**: Alex + Claude
**Fokus**: Code-Review, Bugfixes, Layer-Z-Order, Belagstexturen, Gehweg- und Fahrbahnausbau

### Code-Review & Bugfixes (14 Fixes)
- **Resize-Guard unerreichbar**: `Math.max`-Clamp machte die Guard-Bedingung in `RoadTopView` dauerhaft `false` — auf raw-Width-Prüfung umgestellt.
- **Crosswalk-Clipping**: Letzter Zebrastreifen-Streifen ragte über die Strip-Breite hinaus — Clipping ergänzt.
- **Leitlinien-X falsch bei Overlays**: `generateLaneMarkings` zählte Overlay-Cyclepaths in die X-Position — nutzt jetzt `getCrossSectionStrips()`.
- **Drag-Guard wiederhergestellt**: `selectedStripId !== stripId`-Check war in Session 8/9 entfernt worden — Regression behoben.
- **Längen-Drag-Minimum**: Von 2m auf 5m angehoben (konsistent mit QuickSettings).
- **Umlaute wiederhergestellt**: `STRIP_LABELS`, `VARIANT_LABELS` und `getStripDisplayLabel` nutzten ASCII-Ersatz — echte Umlaute zurück.
- **Hardcodierter 3.25-Fallback**: `QuickSettings.addLane` nutzt jetzt `getStripDefaultWidth('lane', 'standard', roadClass)`.
- **Strichbreiten aus Rules**: `markingDefinitions/shared.ts` referenziert jetzt `MARKING_DEFAULTS` statt String-Literale.
- **Advisory-Minimalbreite**: `editorMinWidth` für `advisory` (1.25m) und `lane-marked` (1.85m) in `stripRules.ts` ergänzt.
- **Safety-Buffer-Konstante**: `cyclepath.ts` importiert jetzt `DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH` statt `0.75`.
- **roadLength-Fallback**: `stripDefinitions/shared.ts` nutzt `DEFAULT_ROAD_LENGTH` (30) statt `10`.
- **short-dash ergänzt**: `'short-dash'` als Centerline-Variant-Option hinzugefügt.
- **Sidewalk/shared-bike Minima in Rules**: `editorMinWidth` für `separated-bike` (3.90m), `shared-bike` (2.50m) in `stripRules.ts` hinterlegt.
- **Redundante Normalisierung**: Doppelter `normalizeLayerOrder`-Aufruf in `EditorLayerManager` → `StraightEditor` bereinigt.

### Layer-Z-Order — Editor-Layermanager funktioniert jetzt echt
- **Strip-Rendering folgt jetzt dem layerOrder**: Strips werden nicht mehr in Array-Reihenfolge gerendert, sondern nach der im Layer-Manager gesetzten Z-Order.
- **Fahrstreifen immer unten**: `normalizeLayerOrder` partitioniert Strips in Fahrstreifen (lane/bus) und Rest — Fahrstreifen liegen immer auf der niedrigsten Z-Ebene.
- **AA-Overlap beibehalten**: Anti-Aliasing-Overlap (0.02m) zwischen Fahrstreifen bleibt aktiv, überdeckt aber keine Boundary-Lines mehr.

### Radweg: Begrenzungslinien-Verbesserungen
- **Boundary-Inset**: Begrenzungslinien für `protected`-Radwege um `boundaryStroke / 2` nach innen versetzt — werden nicht mehr von Nachbar-Strips abgeschnitten.
- **Begrenzungslinien-Seiten**: Neue Option für baulich getrennte Radwege: `Beide`, `Links`, `Rechts` — im Properties-Panel unter "Begrenzung Seiten".
- **boundaryLineSides in stripProps**: Neuer Prop wird korrekt aus `getCyclepathStripProps` gelesen und im Rendering/Phase-Handles berücksichtigt.

### Fahrstreifen: Belag-Auswahl
- **Neuer Prop `surfaceType`** auf `LaneStripProps`: `asphalt` (Default), `concrete`, `cobblestone`, `paving`.
- **Realistische Texturen**: Asphalt (Körnung), Beton (Dehnungsfugen, Aggregate, Haarrisse), Kopfsteinpflaster (27 elliptische Natursteine mit Highlights/Schatten), Pflaster (Reihenverband mit 8 Farbvarianten).
- **Properties-Panel**: "Belag"-Auswahl im Fahrstreifen-Properties unter der Geometrie-Section.
- **Farboption eingeschränkt**: Farb-Picker nur noch bei Radwegen sichtbar.

### Gehwege: Komplettausbau
- **Editor-Minima korrigiert**: Standard-Gehweg von 1.50m auf 2.20m (VwV-StVO), Gem. Geh-/Radweg von 2.00m auf 2.50m (ERA 2010).
- **Belag-Auswahl**: 5 Optionen für Standard-Gehwege: Pflaster (Default), Betonplatten, Naturstein, Klinker, Asphalt.
- **Dedizierte Gehweg-Texturen**: `getSidewalkPattern` (Betonplatten mit 3D-Fugen), `getNaturalStonePattern` (Granit-Mischformat mit Glimmer), `getClinkerPattern` (rote Ziegel im Verband) — jeweils als 32x32 tileable Canvas-Patterns.
- **facingSide-Logik erweitert**: Neuer Wert `'both'` wenn ein Gehweg zwischen zwei Fahrbahnen liegt — zeigt Kanten beidseitig.
- **Begrenzungslinien für Gehwege**: Gestrichelt / Durchgezogen / Keine, mit Seiten-Auswahl (Beide/Links/Rechts), Stärke, Strichlänge, Lückenlänge — identische Optionen wie beim baulich getrennten Radweg.
- **Varianten-Auswahl entfernt**: Nutzer wählt im Elementmenü direkt den Typ (Standard, Gem. Rad, Getr. Rad) — kein redundanter Dropdown im Properties-Panel.

### Neuer Strip-Typ: Wege
- **`path`-Typ** mit drei Varianten: Erdweg (3.00m), Schotterweg (3.50m), Waldweg (2.50m).
- **Realistische Texturen**: Warme braune Erde, dichte Schottersteine, dunkler Waldboden mit Laub und Moos.
- **Komplett verdrahtet**: Types → Rules → Constants → stripProps → state.ts → Patterns → PathStrip-Renderer → StripRenderer → PropertyRegistry → ElementPalette.

### CLAUDE.md überarbeitet
- Auf echte Umlaute (ä, ö, ü, ß) umgestellt.
- Neue Sektionen: Dateibeziehungen (SmartRoads-Kern), Rules-System.
- Konventionen erweitert: Undo/Redo, Dev-Server, Maßeinheiten, Workflow für neue Werte.
- Donts und Pitfalls ergänzt für `stripProps.ts`, `state.ts`, `constants.ts`, `validation.ts`.

---

## Session 9 - 23.03.2026

**Teilnehmer**: Alex + Codex
**Fokus**: SmartRoad Editor weiter finishen, Radwege normnah nachziehen, Bauliches/Bordstein ausbauen, UI-Infrastruktur aufraeumen

### Radverkehr - Regeln, Geometrie und Realismus
- **Neues Radverkehrs-Nachschlagewerk ausgewertet**: `Radverkehrs Nachschlagewerk.md` gegen die bestehende SmartRoad-Logik geprueft und die App auf die aktualisierten Regeln nachgezogen.
- **Leit- und Warnlinien korrigiert**:
- Innerorts Leitlinie: `3m / 6m`
- Ausserorts Leitlinie: `4m / 8m`
- Warnlinie innerorts: `3m / 1,5m`
- Warnlinie ausserorts: `4m / 2m`
- Warnlinie Autobahn: `6m / 3m`
- **Radfahrstreifen und Schutzstreifen normnah gemacht**:
- `Radfahrstreifen` jetzt mit `2,25m` Regelbreite
- `Schutzstreifen` bei `1,50m`
- Strichbreiten und Strichbilder aus dem Regelwerk uebernommen
- **Baulich getrennter Radweg verfeinert**:
- `Eine Richtung`: `2,00m`
- `Beide Richtungen, beidseitig/Sonderfall`: `2,50m`
- `Beide Richtungen, einseitig`: `3,00m`
- **Laengsparken angepasst**: Stellplatzlaenge auf `5,70m` gebracht.
- **Richtungspfeile korrigiert**: Pfeile jetzt mit echter 3-facher Laengsverzerrung statt gleichmaessiger Skalierung.

### Radwege - neues Bedienmodell im Editor
- **Schutzstreifen und Radfahrstreifen als fahrbahngebundene Overlays umgebaut**: Diese Typen sind keine freien Nebenstreifen mehr, sondern werden auf der Fahrbahn gerendert und verbreitern die Fahrbahnaufteilung fachlich korrekt.
- **Baulich getrennter Radweg bleibt echter Strip**: Kann weiter als eigenes Querschnittselement neben der Fahrbahn gebaut und verschoben werden.
- **Overlay-Radwege standardmaessig rechts eingefuegt**: Kein zusaetzlicher Lage-Schalter mehr beim Anlegen.
- **Seitenwechsel per Preview-Drag statt Property**: `Schutzstreifen` und `Radfahrstreifen` lassen sich jetzt mit derselben Drag-Logik wie Strips im Preview zwischen linker und rechter Fahrbahnseite umsetzen; die sichtbare `links/rechts`-Property wurde dafuer wieder entfernt.
- **Nur eine Overlay-Radanlage pro Seite**: Konflikte werden beim Verschieben bzw. Normalisieren sauber aufgeloest, statt chaotisch zu ueberlagern.
- **Sicherheitstrennstreifen sichtbar gemacht**: Abstaende zu Parkstaenden werden nicht mehr nur validiert, sondern in der belegten Breite und Info-Anzeige beruecksichtigt.
- **Hinweise/Warnungen gestuft**: Validierung im SmartRoad-Editor jetzt mit `info`, `warning`, `error` statt einer einzigen gelben Warnklasse.
- **Quick-Info zur Fahrbahnlogik**: Die rechte Info-Karte erklaert jetzt belegte Radverkehrsflaeche, verbleibende Kernfahrbahn und ob etwas innerhalb der Fahrbahn oder als eigener Seitenstreifen zu lesen ist.

### Radwege - Properties und direkte Manipulation
- **Radweg-Farbwahl als echte Property**: Alle Radwegtypen koennen jetzt individuell eingefaerbt werden; Standardfarbe fuer baulich getrennte Radwege auf `#EF4444` gesetzt.
- **Linien fuer Radwege voll editierbar gemacht**:
- Begrenzungslinien: `gestrichelt`, `durchgezogen`, `keine`
- Mittellinie (bei baulich getrennt): `gestrichelt`, `durchgezogen`, `keine`
- Strichstaerke, Strichlaenge und Lueckenlaenge als eigene Properties
- **Einheiten verbessert**: Kleine Linienmasse werden im Property-Panel jetzt in `cm` statt in `m` editiert, wo das fuer Nutzer sinnvoller ist.
- **Labels sprachlich klarer gemacht**: z. B. `Begrenzung Strichlaenge` und `Begrenzung Lueckenlaenge` statt der unklaren Kurzlabels.
- **Linienphase direkt manipulierbar**: Gestrichelte Radweg-Linien lassen sich im Preview vertikal verschieben, aehnlich zur freien Leitlinien-Positionierung.
- **Mathematische Renderlogik robust gemacht**: Cyclepath-Optionen werden defensiv normalisiert, damit inkonsistente Altwerte oder kaputte Props nicht den gesamten SmartRoad-Renderer verschwinden lassen.

### SmartRoad Editor - Struktur, Quick Settings und Bedienfluss
- **Reset-Button in der Bottom Bar**: Ein Klick setzt den Straight-Editor wieder auf den Standardzustand zurueck.
- **Quick Settings entschlackt und neu austariert**:
- Controls auf `Strassentyp`, `Laenge`, `Spuren` reduziert
- Warn- und Info-Karten bewusst behalten, weil sie fuer den fachlichen Kontext wichtig sind
- `Innerorts`, `Ausserorts`, `Autobahn` wiederhergestellt, da daran Standardbreiten und Markierungsdefaults haengen
- **Strassentyp sauber wieder verdrahtet**: Ein Wechsel der RoadClass zieht wieder profil-sensitive Fahrstreifenbreiten und auto-generierte Mittelmarkierungen nach.
- **RoadClass-Buttons verfeinert**: Erst vergroessert, dann so ueberarbeitet, dass sie im schmalen Quick-Settings-Container wieder sauber fitten.
- **Absturz im StraightEditor behoben**: Fehlender Import von `createDefaultStraightRoad` nach einem State-Refactor verursachte einen kompletten Editor-Crash; ist gefixt.

### Bordstein / Bauliches
- **Neue Oberkategorie `Bauliches` in der Palette**: `Bordstein`, `Rinne`, `Leitplanke` und die Gruen-Elemente aus `Streifen` herausgeloest und sauber neu strukturiert.
- **Unterkategorien fuer Bauliches eingefuehrt**:
- `Rand`
- `Trennung`
- `Gruen` wurde spaeter wieder entfernt und in `Trennung` integriert
- **Bordstein optisch komplett ueberarbeitet**: Betonkoerper, Kantenlogik, Fugen und Seitenorientierung so angepasst, dass das Element links und rechts stimmig wirkt.
- **Bordstein ohne Farbauswahl**: Farbwahl bewusst aus den Properties entfernt, weil ein Bordstein kein frei einfaerbbares Design-Element sein soll.
- **Bordstein-Properties fachlich neu aufgebaut**:
- `Art`: `Standard`, `Abgeflacht`, `Ein- oder Ausfahrt`
- `Abgeflacht` = ueber die gesamte Laenge abgesenkter Bordstein
- `Ein- oder Ausfahrt` = lokaler abgesenkter Abschnitt
- **Ein-/Ausfahrt zentriert**: Beim Aktivieren spawnte der abgesenkte Abschnitt zuerst oben am Rand; jetzt startet er mittig auf dem Bordstein.
- **Standardlaenge fuer Ein-/Ausfahrt gesetzt**: `3,00m` als Default fuer den abgesenkten Abschnitt.
- **Vertikale Direktmanipulation fuer Ein-/Ausfahrt**: Der lokale abgesenkte Bereich kann im Preview vertikal verschoben werden; das ist nur fuer `Ein- oder Ausfahrt` aktiv, nicht fuer den voll abgeflachten Bordstein.
- **Main Canvas zieht mit**: Bordsteine rendern im Preview und auf dem Hauptcanvas ueber dieselbe Komponente, damit Optik und Logik konsistent bleiben.

### Architektur und Code-Wartbarkeit
- **Strip-Properties modularisiert**: Die bisher zentrale Strip-Property-Registry in einzelne Definitionsdateien pro Typ ausgelagert.
- Neuer Ordner: `src/smartroads/shared/properties/stripDefinitions/`
- Enthalten u. a.: `lane.ts`, `cyclepath.ts`, `parking.ts`, `curb.ts`, `sidewalk.ts`, `gutter.ts`, `median.ts`, `tram.ts`, `shoulder.ts`, `bus.ts`
- **Marking-Properties vorbereitet und ebenfalls modularisiert**:
- Neuer Ordner: `src/smartroads/shared/properties/markingDefinitions/`
- Aufgeteilt u. a. in `centerline.ts`, `laneboundary.ts`, `arrow.ts`, `crosswalk.ts`, `stopline.ts`
- **State-Normalisierung gehaertet**: SmartRoad-States werden beim Laden, Speichern und Rendern defensiv normalisiert, damit fehlerhafte Props, alte IDs oder kaputte LayerOrder-Eintraege nicht das ganze Objekt zerlegen.

### Globale UI-Infrastruktur
- **ColorPicker komplett neu gestaltet**: Mehrfach ueberarbeitet in Design, Positionierung und Bedienung, bis er in Haupt-App und SmartRoad-Editor konsistent funktioniert.
- **Portal-Positionierung repariert**: Picker wird jetzt im richtigen Layer gerendert und ist auch im SmartRoad-Dialog wirklich klickbar.
- **OK/Abbrechen-Flow eingefuehrt**: Live-Vorschau beim Aendern, bewusstes Bestaetigen oder Verwerfen fuer einfacheren Nutzerfluss.
- **Preset-Farben neu strukturiert**: 10 Schnellfarben, darunter `Transparent` als normaler Preset-Swatch statt als Sonderbutton.
- **Spacing und globale Wiederverwendung verbessert**: Picker in der ganzen App optisch aufgeraeumt und in die gemeinsamen UI-Komponenten verschoben.
- **`ColorPicker` und `FloatingProperties` aus dem alten Inspector geloest**: Beide liegen jetzt unter `src/components/ui/`, der alte `Inspector`-Ordner wird nicht mehr gebraucht.

### Neue Dateien
| Datei | Zweck |
|-------|-------|
| `src/components/ui/ColorPicker.tsx` | Globaler, ueberarbeiteter Farb-Picker fuer App und SmartRoad-Editor |
| `src/components/ui/FloatingProperties.tsx` | Gemeinsame Floating-Properties-Komponente unter `ui` |
| `src/smartroads/shared/properties/stripDefinitions/types.ts` | Gemeinsame Typen fuer modulare Strip-Property-Definitionen |
| `src/smartroads/shared/properties/stripDefinitions/shared.ts` | Gemeinsame Strip-Property-Helper |
| `src/smartroads/shared/properties/stripDefinitions/lane.ts` | Lane-Property-Definition |
| `src/smartroads/shared/properties/stripDefinitions/cyclepath.ts` | Cyclepath-Property-Definition |
| `src/smartroads/shared/properties/stripDefinitions/parking.ts` | Parking-Property-Definition |
| `src/smartroads/shared/properties/stripDefinitions/curb.ts` | Curb-Property-Definition |
| `src/smartroads/shared/properties/markingDefinitions/registry.ts` | Registry fuer modulare Marking-Properties |
| `src/smartroads/shared/properties/markingDefinitions/centerline.ts` | Centerline-Properties |
| `src/smartroads/shared/properties/markingDefinitions/laneboundary.ts` | Lane-Boundary-Properties |
| `src/smartroads/shared/properties/markingDefinitions/arrow.ts` | Richtungspfeil-Properties |
| `src/smartroads/shared/properties/markingDefinitions/crosswalk.ts` | Zebrastreifen-Properties |
| `src/smartroads/shared/properties/markingDefinitions/stopline.ts` | Haltelinien-Properties |

### Geloeschte Dateien
| Datei | Grund |
|-------|-------|
| `src/components/Inspector/ColorPicker.tsx` | Durch globale UI-Version unter `src/components/ui/` ersetzt |
| `src/components/Inspector/FloatingProperties.tsx` | Durch globale UI-Version unter `src/components/ui/` ersetzt |

### Verifikation
- **`npm run lint`** laeuft sauber nach den heutigen Aenderungen.
- Ein kompletter neuer `build` wurde in dieser Session nicht als Abschlusslauf dokumentiert; bekannte Altprobleme ausserhalb dieser Arbeiten koennen weiterhin separat bestehen.

---

## Session 8 – 22.03.2026

**Teilnehmer**: Alex + Codex
**Fokus**: SmartRoad Editor fertigziehen, Regelbasis auf Profi-Niveau vorbereiten, rechte Sidebar umbauen

### SmartRoad Editor – Bugfixes & Interaktions-Qualität
- **Spur-hinzufügen Bug gefixt**: Beim Hinzufügen eines Fahrstreifens konnte eine riesige weiße Fläche über der Straße erscheinen. Ursache war eine fehlerhafte Leitlinien-Neuberechnung; `generateLaneMarkings()` bekam in einem Codepfad falsche Argumente und setzte die Straßenlänge als `strokeWidth`. Die Centerlines werden jetzt in allen Add/Delete/Update-Pfaden konsistent neu aufgebaut.
- **Reorder-Animation stabilisiert**: Das seitliche Einschnappen der Strips im Editor war visuell "flashy", weil die Bewegung pro Frame über React-State neu angeschoben wurde. Das Verhalten läuft jetzt stabil über einen `requestAnimationFrame`-Loop mit `ref`-basiertem Animationszustand.
- **Properties per Doppelklick im Preview**: Strips können ihre Eigenschaften jetzt nicht nur über das Zahnrad im Editor-Layer-Manager, sondern auch per Doppelklick direkt im Road-Preview öffnen. Die Hit-Target-Logik wurde dafür auf einen stabilen gemeinsamen Konva-Node umgebaut.
- **Direktes Anfassen ohne Vorselektion**: Ein Strip im SmartRoad-Preview muss nicht mehr erst separat ausgewählt werden. `mousedown` selektiert sofort und startet direkt die Drag-/Reorder-Vorbereitung, mit Dead-Zone gegen versehentliche Drags.
- **SmartRoad Layer-Manager funktional gemacht**: Die Karten im Editor-Layer-Manager sind jetzt wirklich draggable; ihre Reihenfolge steuert die Z-Order im Preview und bleibt über `layerOrder` persistent erhalten.
- **Strips immer unter Markierungen**: Auch wenn im Layer-Manager frei gezogen wird, können Fahrbahnen/Fahrstreifen technisch nicht über Markierungen einsortiert werden. Der Strip-Block bleibt immer unten, die Markierungen liegen darüber.

### SmartRoad Editor – Geometrie & Properties
- **Strip-Höhe eingeführt**: Einzelne Strips können jetzt kürzer als die Gesamtstraße sein. Die Eigenschaft wurde im Properties-Panel ergänzt und sowohl im Editor als auch auf dem Hauptcanvas korrekt ins Rendering übernommen.
- **Leitlinien auf echten Überlappungsbereich begrenzt**: Auto-generierte Centerlines laufen nicht mehr stumpf über die gesamte Straßenlänge, sondern nur noch über den gemeinsamen sichtbaren Bereich benachbarter Fahrstreifen.
- **Längslage für Fahrstreifen**: Für `lane` und `bus` wurden `startOffset` und `endOffset` als neue Längs-Properties eingeführt. Dadurch können Fahrstreifen später beginnen oder früher enden, statt nur "kürzer" zu sein.
- **Abgeleitete Länge statt stumpfer Höhe**: Im Lane-/Bus-Panel wird jetzt eine berechnete `Länge` aus Straßenlänge minus Start-/End-Offset angezeigt. Legacy-Strips mit nur `height` bleiben kompatibel.
- **Richtung aus Fahrstreifen-Properties entfernt**: `direction` wurde aus dem sichtbaren Strip-Panel entfernt, weil sie für eure aktuelle Darstellung keine relevante Wirkung hatte.
- **Fahrstreifenart aus Lane-Panel entfernt**: `standard`, `turn-left`, `turn-right`, `multi-use` blieben semantisch ohne sichtbare Auswirkung, während Pfeile bewusst als eigene Markierungen gesetzt werden. Deshalb ist die sichtbare `Variante` für Fahrstreifen vorerst aus der UI entfernt worden.

### Neue Property-Architektur für Strips
- **Registry statt Einheitsformular**: Die Strip-Properties wurden von hartcodierter Speziallogik auf eine Registry umgestellt. Gemeinsame Geometrie (`Breite`, `Höhe`) und typspezifische Sektionen werden jetzt sauber getrennt gerendert.
- **Typ-spezifische `props` im Datenmodell**: Strips besitzen jetzt eine gemeinsame Hülle plus optionale fachliche Zusatzdaten je Typ (`lane`, `bus`, `parking`, usw.).
- **Parking als erstes echtes Beispiel**: `parking` bekam mit `Stellplatzlänge` die erste reale Fach-Property, die nicht nur im Panel sichtbar ist, sondern das Rendering der Stellplatz-Trennlinien tatsächlich beeinflusst.
- **Vorbereitung für weitere Strip-Typen**: Durch die Registry lassen sich jetzt nach und nach fachlich saubere Properties pro Typ ergänzen, ohne `StripProperties.tsx` immer wieder komplett zu verbiegen.

### Regelbasis aus dem Nachschlagewerk
- **Nachschlagewerk analysiert**: `Nachschlagewerk_Strasseninfrastruktur_Deutschland.md` wurde gegen die aktuelle SmartRoad-Implementierung geprüft. Ergebnis: gute Basis, aber noch nicht durchgängig professionell belastbar; daraus entstand die neue Regel-Roadmap.
- **Source of Truth eingeführt**: Normnahe Werte für Profile, Strips und Markierungen wurden in eigene Regeldateien ausgelagert, statt weiter verstreut in `constants.ts` und einzelnen Renderern zu liegen.
- **Neue Regeldateien**:
- `src/smartroads/rules/shared.ts`
- `src/smartroads/rules/profileRules.ts`
- `src/smartroads/rules/stripRules.ts`
- `src/smartroads/rules/markingRules.ts`
- **Markierungsrenderer an Regeln angebunden**: Kernwerte für Centerlines, Haltelinien, Zebrastreifen und Lane-Boundaries werden jetzt zentral aus den Regeln gezogen statt aus losen Hardcodes.
- **RoadClass steuert jetzt nicht mehr nur Striche**: `innerorts`, `ausserorts` und `autobahn` beeinflussen jetzt auch Geometrie relevanter Strips. Aktuell sind `lane`, `shoulder` und `median` mit `barrier`-Variante an die Profilregeln angeschlossen.
- **Quick Settings / Presets an Profilregeln gekoppelt**: Neue Strips aus Palette und Quick Settings sowie die bestehenden Straight-Presets greifen jetzt auf die jeweilige `roadClass`-Breite statt auf globale Einheitswerte zurück.
- **Kommentar zur Maßstabslogik korrigiert**: Der irreführende Beispiel-Kommentar in `src/utils/scale.ts` wurde auf die korrekte Rechnung (`1 m` bei `1:200` = `5 mm`) gebracht.

### Main App – Flow & rechte Sidebar
- **Direktes Greifen auf dem Hauptcanvas**: Unselektierte Objekte müssen vor dem Verschieben nicht mehr extra angewählt werden. Auf `mousedown` wird sofort selektiert; `dragstart` dient als Fallback. Das gilt auch für SmartRoad-Objekte.
- **Sofort sichtbare Auswahl beim Ziehen**: Auf dem Hauptcanvas ist das Objekt beim direkten Anfassen nun auch optisch sofort ausgewählt, nicht erst nach dem Start des Drags.
- **Rechte Sidebar strukturell umgebaut**: Statt gequetschtem Stack aus Layer-Manager + Tabs + Library/Metadaten gibt es jetzt oben drei Buttons: `Ebenen`, `Library`, `Metadaten`. Der aktive Bereich nutzt darunter die volle Höhe der Sidebar.
- **Layer-Manager automatisch öffnen**: Immer wenn ein neues Objekt auf den Canvas kommt, schaltet die rechte Sidebar automatisch auf `Ebenen`.
- **Library-Scroll-Bug gefixt**: Wenn der Inhalt der Objekt-Bibliothek höher als der verfügbare Bereich wurde, war die Liste nicht scrollbar. Die Layout-Kette der rechten Sidebar wurde dafür mit `h-full`, `min-h-0` und `overflow-hidden` bereinigt.

### Visuelle Differenzierung der Rad- und Gehweg-Typen
- **Cyclepath-Varianten neu gestaltet**: `Schutzstreifen`, `Radfahrstreifen` und `baulich getrennter Radweg` unterscheiden sich jetzt nicht mehr nur grob über Braun/Rot, sondern über Materialwirkung, Kanten und innere Struktur.
- **Schutzstreifen fahrbahnnah gehalten**: Leichte Tönung + gestrichelte Führungskanten statt vollwertiger Eigenkörper.
- **Radfahrstreifen als eigener markierter Streifen**: Kräftigerer Kern und klare Kanten, aber weiter klar der Fahrbahn verwandt.
- **Baulich getrennter Radweg als eigene Infrastruktur**: Heller Randaufbau und separater Oberflächencharakter statt nur "stärker rot".
- **Gehweg-Varianten endlich sichtbar getrennt**: `SidewalkStrip` berücksichtigt jetzt seine Varianten.
- `standard`: neutraler Pflasterbelag
- `shared-bike`: gemeinsame, weich getönte Mischfläche
- `separated-bike`: intern geteilte Fläche mit sichtbarer Trennlinie und eigenem Radbereich

### Neue Dateien
| Datei | Zweck |
|-------|-------|
| `src/smartroads/rules/shared.ts` | Gemeinsame Regel-Helper und fachliche Metadaten |
| `src/smartroads/rules/profileRules.ts` | Regelprofile für `innerorts`, `ausserorts`, `autobahn` |
| `src/smartroads/rules/stripRules.ts` | Normnahe Strip-Breiten und Variant-Regeln |
| `src/smartroads/rules/markingRules.ts` | Zentrale Markierungsmaße und Dash-/Stroke-Regeln |
| `src/smartroads/stripProps.ts` | Default-Props und Geometrie-Helper für Strip-Typen |
| `src/smartroads/shared/properties/stripPropertyRegistry.ts` | Registry für typ-spezifische Strip-Properties |

### Verifikation
- **`npm run lint`** läuft sauber nach allen heutigen Änderungen.
- **`npm run build`** scheitert weiterhin nur an den bereits vorher vorhandenen TypeScript-Fehlern in `src/components/Canvas/PageHeader.tsx` und `src/store/index.ts`.

---

## Session 7 – 22.03.2026

**Teilnehmer**: Alex + Claude Opus 4.6
**Fokus**: Code Review, Light Mode, UX-Features, Metadaten-System, Auto-Header

### Code Review & Cleanup
- **40+ Findings** identifiziert, **21 Bugs gefixt** (duplicate style props, stale getState, locked delete, space key stuck, etc.)
- **~2.000 Zeilen Dead Code entfernt**: `LayerManager.tsx`, `StripEditor.tsx`, Layer-System aus Store/Types, dead CSS-Klassen, `@theme` Block
- **Code-Duplikation eliminiert**: `objectDisplayName` → `src/utils/objectHelpers.ts`, `MARKING_TYPE_LABELS` + `LINE_STYLES` → `src/constants/shared.ts`
- **Undo-History optimiert**: `selection`/`activeTool` aus zundo `partialize` entfernt
- **CLAUDE.md** schlank umgeschrieben (200 → 95 Zeilen, fokussiert auf nicht-ableitbaren Kontext)

### Light Mode Redesign
- **57 hardcoded `rgba(255,255,255,...)` Werte** in 11 TSX-Dateien durch CSS-Tokens ersetzt
- **Neue CSS-Klassen**: `.meta-input`, `.editor-panel-card`, `.color-picker-well`, `.divider-v`, `.value-display`
- **Light-Mode Token-Palette getuned**: Wärmeres Bg, stärkere Borders/Shadows, neuer `--editor-bg` Token
- **Fehlende Light-Overrides ergänzt**: `.tool-btn`, `.toggle-btn` + Hover-States
- **Imperative JS-Hover-Handler** in MetadataPanel/TopBar durch CSS-Klassen ersetzt
- Dark Mode bleibt unverändert

### Undo/Redo System
- **zundo + custom Hook** (`src/hooks/useUndoRedo.ts`): Manual Past/Future Stack Management wegen Zustand v5 Inkompatibilität
- **Debounced handleSet** (150ms): Bündelt schnelle `set()` Calls zu einem Undo-Eintrag (addObject + recalculateScale = 1 Entry)
- **Flush-before-Undo**: Pending Debounce wird sofort gespeichert vor Undo (kein State-Verlust)
- **Pause/Resume**: Undo/Redo-Operationen erzeugen keine neuen History-Einträge
- **Selection-Cleanup**: Verwaiste Selections und `propertiesPanelId` werden nach Undo aufgeräumt
- **History-Limit**: Max 50 Einträge
- TopBar-Buttons + Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y

### UX-Features
- **Tooltips**: Alle TopBar + Toolbar Buttons mit Label + Shortcut-Hint (500ms Delay, Portal-basiert)
- **Kontextmenü**: Rechtsklick auf Canvas → Duplizieren, Löschen, Vordergrund/Hintergrund, Eigenschaften, Alles auswählen, Ansicht einpassen
- **Toast-Benachrichtigungen**: `src/hooks/useToast.ts` + `src/components/ui/Toast.tsx` — Success/Info/Error, Auto-Dismiss 2.5s
- **Zoom-Controls in StatusBar**: +/- Buttons, Einpassen-Button (Maximize2), Zoom-% klickbar
- **Auswahl-Info in StatusBar**: "1 Objekt" / "3 Objekte" oder Gesamtzahl
- **Leerer Canvas Hinweis**: "Ziehen Sie eine Straße aus der Bibliothek oder wählen Sie ein Werkzeug"
- **Ebenen-Manager Type-Icons**: Rechteck/Kreis/Stift/Text/Straßen-Icons statt Farbpunkt
- **Ctrl+D**: Duplizieren mit +20px Offset + "(Kopie)" Label
- **UI-Sprache Deutsch**: "von Alex Pohlmeier", alle Tooltips, "Laden"/"Speichern"/"Exportieren" Buttons

### Metadaten-System
- **DocumentMeta erweitert**: `departmentAddress`, `departmentPhone` Felder
- **Dienststellen-Autocomplete**: Kontextsuche über ~300 Dienststellen aus 7 JSON-Dateien (PD Hannover, Braunschweig, Göttingen, Osnabrück, Lüneburg, Oldenburg, Sonder)
- **Pflichtfeld-Validierung**: Rotes `*`, roter Border + Glow bei leeren Pflichtfeldern (Vorgangsnummer, Datum, Dienststelle, Sachbearbeiter)
- **Zusatzfelder**: Adresse + Telefon erscheinen bei manueller Dienststellen-Eingabe
- **Export-Validation vorbereitet**: `src/utils/validation.ts` mit `isMetadataComplete()` + `getMissingFields()`

### Auto-Header auf A4 Canvas
- **PageHeader** (`src/components/Canvas/PageHeader.tsx`): Konva-Rendering, `listening={false}`
  - Rahmenbox mit 2-Spalten Layout (Dienststelle/Vorgangsnr. links, Adresse/Datum/Tel./Sachbearbeiter rechts)
  - Dynamische Höhe — passt sich an Anzahl gefüllter Felder an
  - Überschrift zentriert unterhalb (aus "Überschrift"-Feld, Default: "Verkehrsunfallskizze")
  - Header-Box erscheint erst bei erster Eingabe (Dienststelle/Vorgangsnr./Sachbearbeiter)
- **SignatureBlock**: Linie + Sachbearbeiter-Name, Linie passt sich Textbreite an
  - Standard Konva Transformer (Rotation + Resize)
  - Klick selektiert, Klick daneben deselektiert
  - Nicht im Ebenen-Manager
- Font: Inter (statt Serif)

### Neue Dateien
| Datei | Zweck |
|-------|-------|
| `src/components/Canvas/PageHeader.tsx` | Auto-Header + SignatureBlock auf A4 Canvas |
| `src/components/Canvas/ContextMenu.tsx` | Rechtsklick-Kontextmenü |
| `src/components/ui/Toast.tsx` | Toast-Benachrichtigungs-Renderer |
| `src/components/ui/Tooltip.tsx` | Hover-Tooltips mit Shortcut-Hints |
| `src/hooks/useToast.ts` | Toast Mini-Store (useSyncExternalStore) |
| `src/hooks/useUndoRedo.ts` | Custom Undo/Redo mit Debounce-Flush |
| `src/utils/objectHelpers.ts` | Shared `objectDisplayName()` |
| `src/utils/validation.ts` | Metadaten-Pflichtfeld-Prüfung (für Export) |
| `src/constants/shared.ts` | Shared `LINE_STYLES`, `MARKING_TYPE_LABELS` |

### Gelöschte Dateien
| Datei | Grund |
|-------|-------|
| `src/components/LayerManager/LayerManager.tsx` | Verwaist, ersetzt durch EbenenPanel |
| `src/smartroads/shared/StripEditor.tsx` | 277 Zeilen, nie importiert |
| `SMARTROADS.md` | Entfernt durch User |
| `033_skizze_ui_mockup.jsx` | Entfernt durch User |

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
