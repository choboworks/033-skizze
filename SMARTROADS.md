# SmartRoads – Entwicklungsdokumentation

## Überblick

SmartRoads ist das Straßenbau-System von 033-Skizze. Es ermöglicht PVBs (Polizeivollzugsbeamte) Straßen für Unfallskizzen zu erstellen – von der einfachen Geraden bis zum komplexen Kreisverkehr.

**Kernprinzip:** SmartRoads ist ein **Constrained Editor** – ein geführtes System das zur Geometrie passt. Keine freie 2D-Fläche auf der man Streifen puzzlen muss. Stattdessen: geordnete Streifen-Listen für Geraden/Kurven, generierte Geometrie mit Handles für Kreuzungen/Kreisverkehre. Korrektheit by Design, Freiheit nur wo sie Sinn ergibt.

---

## Architektur-Entscheidung: Constrained Editor

### Warum kein freier Canvas

Eine Gerade ist kein 2D-Problem. Sie ist ein **1D-Problem** – Streifen nebeneinander, links nach rechts:

```
[Gehweg][Bordstein][Radweg][Fahrstreifen][Fahrstreifen][Bordstein][Gehweg]
```

Auf einem freien Canvas muss der User jeden Streifen einzeln ziehen, manuell ausrichten, auf Snapping hoffen, Längen abgleichen. Das ist zu viel Arbeit für etwas das eigentlich trivial ist. Und der User kann "falsche" Straßen bauen – Lücken, Versatz, unterschiedliche Längen, schiefe Elemente.

### Warum kein parametrisches System

Ein rein parametrisches System (Datenmodell → Auto-Rendering) ist zu starr und erzeugt komplexe Probleme bei der Canvas-Integration (Scale-Bugs, Center-Shift, separate Store-Logik). Getestet und verworfen in Session 4.

### Der Mittelweg: Constrained Editor

Für **Geraden und Kurven**: **Strip-Editor** – Die Straße IST eine horizontale Liste von Streifen. Streifen sitzen immer bündig, keine Lücken möglich. Breite per Drag an Kanten. Reihenfolge per Drag & Drop. Markierungen frei auf der auto-generierten Draufsicht.

Für **Kreuzungen und Kreisverkehre**: **Geführter 2D-Canvas** – Die App generiert die Grundform aus einem Template/Preset. Der User passt über Handles (Armwinkel, Eckradien) und den Strip-Editor (pro Arm/Zufahrt) an. Markierungen frei auf der generierten Fläche.

**Ergebnis:** Kein manuelles Ausrichten. Kein Snapping nötig für die Grundstruktur. Garantiert korrekte Proportionen. Trotzdem volle Freiheit bei Markierungen.

---

## Koordinatensystem

**1 Einheit = 1 Meter.** Das gilt für den Editor und für den Hauptcanvas gleichermaßen.

Ein Fahrstreifen mit `width: 3.25` ist 3.25 Meter breit. Ein Gehweg mit `width: 2.50` ist 2.50 Meter breit. Auf dem Hauptcanvas wird ein einziger Scale-Faktor angewandt: `metersToPixels(1, currentScale)`.

Der User sieht keine Meterangaben. Alle Maße sind intern. Er arbeitet rein visuell.

---

## Workflow aus User-Sicht

### Schicht 1: Zero Config (fauler PVB)

```
User zieht "Gerade" aus der Bibliothek auf den Canvas
→ Default-Straße wird platziert (2 Spuren, Gehweg beidseitig)
→ Fertig. Sofort nutzbar. 2 Sekunden.
```

### Schicht 2: Quick Adjust (normaler PVB)

```
Doppelklick auf platzierte Straße
→ SmartRoad Editor öffnet sich
→ Quick Settings: Spuren auf 4, Radweg auf "Beide"
→ "Fertig" klicken
→ Straße auf dem Canvas ist aktualisiert. 10 Sekunden.
```

### Schicht 3: Full Custom (motivierter PVB)

```
Doppelklick auf platzierte Straße
→ SmartRoad Editor öffnet sich
→ Strip-Editor: Busstreifen einfügen, Grünstreifen links
→ Draufsicht: Zebrastreifen platzieren, Richtungspfeile setzen
→ "Fertig" klicken. 1-2 Minuten.
```

---

## Editor UI-Layout

Der Editor öffnet sich als **Overlay** (Radix `Dialog`) über dem Hauptcanvas. Hintergrund gedimmt.

```
┌──────────────────────────────────────────────────────────┐
│  SmartRoad: Gerade                            ✕ Schließen│
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│ ELEMENTE │  QUERSCHNITT (Strip-Editor, React/CSS)        │
│ (Radix   │                                               │
│ Accordion)│  [+ Links]                      [+ Rechts]   │
│          │  ┌────┬──┬─────┬──────┬──────┬──┬────┐       │
│▼ Fahrspur│  │ GW │Bo│ Rad │ Fstr │ Fstr │Bo│ GW │       │
│  ◉ Std   │  │2.50│  │1.85 │ 3.25 │ 3.25 │  │2.50│       │
│  ○ Abbieg│  └────┴──┴─────┴──────┴──────┴──┴────┘       │
│          │         ↕ Breite per Drag an Kanten            │
│▶ Radweg  │         ↔ Reihenfolge per Drag & Drop          │
│▶ Gehweg  │                                               │
│▶ Parken  │  ─────────────────────────────────────────    │
│▶ Grün    │                                               │
│▶ Bordst. │  DRAUFSICHT (Konva-Canvas, auto-generiert)    │
│▶ ...     │                                               │
│          │  ╔══════════════════════════════════╗          │
│──────────│  ║ ░░│  🚲  │  ↑  │  ↑  │  🚲  │░░║          │
│          │  ║ ░░│  🚲  │  ↑  │  ↑  │  🚲  │░░║          │
│MARKIERUNG│  ║ ░░│  🚲  │  ↑  │  ↑  │  🚲  │░░║          │
│(Accordion)│ ╚══════════════════════════════════╝          │
│▶ Leitl.  │   ↑ Markierungen hier frei platzierbar        │
│▶ Zebra   │                                               │
│▶ Pfeile  │                      ┌──────────────────────┐ │
│▶ Haltel. │                      │ QUICK SETTINGS       │ │
│▶ ...     │                      │ (Radix ToggleGroup)  │ │
│          │                      │ Spuren:  [−] 2 [+]   │ │
│ PRESETS  │                      │ Gehweg:  [L|B|R|—]    │ │
│  Erschl. │                      │ Radweg:  [L|B|R|—]    │ │
│  Hauptstr│                      │ Parken:  [L|B|R|—]    │ │
│  Landstr.│                      │ Mitte:   [—|L|G|LP]   │ │
│          │                      └──────────────────────┘ │
├──────────┴───────────────────────────────────────────────┤
│                                    Fertig      Abbrechen │
└──────────────────────────────────────────────────────────┘
```

### Zwei Editor-Bereiche

**Querschnitt (oben):** React/CSS-Komponente, KEIN Canvas. Geordnete horizontale Streifen-Liste. Streifen sitzen immer bündig. Breite per Drag an Kanten. Reihenfolge per Drag & Drop. Hinzufügen über [+ Links] / [+ Rechts] oder Drag aus der Palette.

**Draufsicht (unten):** Konva-Canvas, auto-generiert aus dem Strip-Array. Zeigt live wie die Straße von oben aussieht. Hier platziert der User **Markierungen frei** – das IST ein Canvas, aber nur für Markierungen. Die Fahrbahnflächen sind fest (kommen aus dem Querschnitt). Am unteren Rand der Draufsicht: **Längen-Handle** – ein Drag-Griff der die Straße verlängert/verkürzt (ändert `state.length` in Metern).

### Linke Spalte: Element-Palette (Radix `Accordion`)

Aufklappbare Schubladen mit Varianten (Radix `RadioGroup`):

```
▼ Radweg                          ← aufgeklappt
  ◉ Baulich getrennt
  ○ Radfahrstreifen (durchgezogen)
  ○ Schutzstreifen (gestrichelt)

▶ Fahrstreifen                    ← zugeklappt
▶ Gehweg
▶ Parkstreifen
...
```

Klick auf ein Element → wird an der gewünschten Seite eingefügt (via [+ Links] / [+ Rechts] Context). Oder Drag aus der Palette in den Querschnitt.

**Spuren & Streifen:**

| Element | Varianten | Default-Breite |
|---|---|---|
| Fahrstreifen | Standard, Abbiegespur Links, Abbiegespur Rechts, Mehrzweck | 3.25m |
| Radweg | Baulich getrennt, Radfahrstreifen (durchg.), Schutzstreifen (gestr.) | 1.85m / 1.50m |
| Busstreifen | Standard | 3.50m |
| Gehweg | Standard, Gemeinsamer Geh-/Radweg, Getrennter Geh-/Radweg | 2.50m |
| Parkstreifen | Längsparken, Schrägparken, Querparken | 2.00m / 4.50m / 5.00m |
| Grünstreifen | Standard, Baumstreifen | 2.00m |
| Gleiskörper | Eigentrasse, Bündig | 3.00m |
| Mittelstreifen | Markierung, Grünstreifen, Leitplanke, Gleise | 0.15m–3.00m |
| Seitenstreifen | Standard | 1.50m |
| Bankett | Standard | 1.50m |
| Bordstein | Standard | 0.15m |
| Rinne | Standard | 0.30m |

**Markierungen (frei auf der Draufsicht):**

| Markierung | Varianten |
|---|---|
| Leitlinie | Standard (6m/6m), Kurz (3m/3m), Warnlinie (6m/3m) |
| Fahrstreifenbegrenzung | Durchgezogen, Doppelt |
| Sperrfläche | Schraffur (Winkel einstellbar) |
| Richtungspfeil | Geradeaus, Links, Rechts, Geradeaus+Links, Geradeaus+Rechts |
| Haltelinie | Standard (breit, durchgezogen) |
| Wartelinie | Haifischzähne |
| Fußgängerüberweg | Zebrastreifen |
| Radfurt | Gestrichelt, rot hinterlegt |
| Bushaltestellenmarkierung | Standard |
| Tempo-Piktogramm | 30, 50 etc. |
| Parkflächenmarkierung | Standard |
| Freie Linie | Typ, Stärke, Muster wählbar |

### Quick Settings (Radix `ToggleGroup`)

Schnelle Buttons für die häufigsten Anpassungen – manipulieren das Strip-Array direkt:

**Gerade & Kurve:**
```
Länge:   [−] 30m [+]        ← auch per Drag-Handle in der Draufsicht
Spuren:  [−] 2 [+]
Gehweg:  [Links] [Beide] [Rechts] [—]
Radweg:  [Links] [Beide] [Rechts] [—]
Parken:  [Links] [Beide] [Rechts] [—]
Mitte:   [—] [Linie] [Grün] [Planke]
```

**Wichtig:** Die Länge einer Straße wird NUR im Editor gesteuert (Quick Settings oder Drag-Handle in der Draufsicht). Auf dem Hauptcanvas gibt es KEINE Längen-Handles – das hat im parametrischen Ansatz zu Scale/Center-Shift-Problemen geführt. Länge ändern = Editor öffnen.

**Kreuzung zusätzlich:**
```
Template: [T-Kreuzung ▼]       (Radix DropdownMenu)
Pro Arm: Spuren [−][+], Abbiegespur, Fußgängerfurt
[+ Arm hinzufügen]
```

**Kreisverkehr zusätzlich:**
```
Preset: [Kompakt ▼]
Überfahrbarer Ring: [●] / [○]
Pro Zufahrt: Fußgängerquerung
[+ Zufahrt hinzufügen]
```

### Presets

Vordefinierte Strip-Arrays als One-Click-Startpunkte:

**Gerade:** Erschließungsstraße, Sammelstraße, Hauptverkehrsstraße, Landstraße, Autobahn, Tempo-30-Zone, Spielstraße

**Kurve:** 90° Standardkurve, 45° weite Kurve

**Kreuzung:** T-Kreuzung, Standardkreuzung (4-Arm), Y-Kreuzung, 5-Arm

**Kreisverkehr:** Mini (Ø 13–22m), Kompakt (Ø 26–40m), Groß (> 40m)

Klick auf Preset → Strip-Array wird geladen → User kann danach anpassen.

User kann eigene Querschnitte als "Meine Straßen" speichern (IndexedDB).

---

## Vier Segment-Typen, zwei Editor-Paradigmen

| Typ | Paradigma | Editor | Geometrie |
|---|---|---|---|
| Gerade | **Strip-Editor** | `StraightEditor` | 1D: Streifen nebeneinander |
| Kurve | **Strip-Editor** | `CurveEditor` | 1D: Streifen als Bogensegmente |
| Kreuzung | **Geführter 2D-Canvas** | `IntersectionEditor` | 2D: Arme + Mitte, Template-basiert |
| Kreisverkehr | **Geführter 2D-Canvas** | `RoundaboutEditor` | 2D: Ring + radiale Zufahrten |

Alle vier teilen **UI-Komponenten** (EditorShell, ElementPalette, QuickSettings, Presets) aber haben **eigene Logik** für ihre Geometrie.

### Strip-Editor (Geraden & Kurven)

Der Querschnitt ist eine **React/CSS-Komponente** (kein Canvas):

```typescript
interface Strip {
  id: string
  type: 'lane' | 'sidewalk' | 'cyclepath' | 'parking' | 'green' | 'curb' | ...
  variant: string
  width: number        // Meter
  direction?: 'up' | 'down'
}
```

Jeder Streifen ist ein `<div>` mit proportionaler Breite, farbcodiert. Zwei Interaktions-Mechanismen:

**Reihenfolge ändern:** `@dnd-kit/sortable` – Streifen per Drag & Drop tauschen. dnd-kit liefert das Sortier-Verhalten, Animation und Accessibility.

**Breite ändern:** Eigene Pointer-Event-Handler (NICHT dnd-kit — das ist nur für Sortierung). An jeder Kante zwischen zwei Streifen sitzt ein unsichtbarer Resize-Handle (4px breit, `cursor: col-resize`):

```typescript
// Pointer-Events auf der Kante zwischen Streifen
onPointerDown → merke startX + strip.width
onPointerMove → delta = currentX - startX
                newWidth = Math.max(MIN_WIDTH, startWidth + delta * metersPerPixel)
                updateStrip(stripId, { width: newWidth })
onPointerUp   → finalisieren
```

`MIN_WIDTH` pro Typ: Fahrstreifen min. 2.75m, Gehweg min. 1.50m, Bordstein fix 0.15m (nicht resizebar). Die benachbarten Streifen verschieben sich automatisch (Flexbox).

### Kurven-Rendering: Strip → Bogensegment

Kurven nutzen dasselbe Strip-Array wie Geraden. Im Rendering wird jeder Strip zu einem **Bogensegment** statt einem Rect:

```typescript
// Für jeden Strip in einer Kurve:
// stripOffset = Summe der Breiten aller Strips links davon
innerRadius = curveRadius - totalWidth / 2 + stripOffset
outerRadius = innerRadius + strip.width

// Konva-Rendering als Arc oder Path:
<Arc
  innerRadius={innerRadius}
  outerRadius={outerRadius}
  angle={curveAngle}
  fill={stripColor}
  rotation={-curveAngle / 2}  // zentriert
/>
```

Die Breiten bleiben identisch (3.25m Fahrstreifen = 3.25m Fahrstreifen, egal ob gerade oder gebogen). Nur das Rendering ändert sich: innere Streifen haben einen kleineren Radius als äußere. Der Strip-Editor (React/CSS) sieht identisch aus — der User sieht den Querschnitt immer als flache Liste, die Draufsicht zeigt die Kurve.

### Geführter Canvas (Kreuzungen & Kreisverkehre)

Hier ergibt 2D Sinn — aber geführt, nicht frei:

**Kreuzung:** User wählt Template → App generiert Grundform → User passt Armwinkel per Drag-Handle an → Eckradien per Handle → pro Arm: Querschnitt über Strip-Editor als Sub-View → Markierungen frei auf der generierten Fläche.

**Kreisverkehr:** App generiert Ring → User definiert Zufahrten (Anzahl, Winkel per Drag) → Pro Zufahrt: Querschnitt → Markierungen frei.

**v1-Scoping:** Kreuzungen und Kreisverkehre sind in v1 **Preset-basiert mit eingeschränkter Anpassung** (Armwinkel, Spurzahl pro Arm, Eckradien). Die volle Geometrie-Engine (Fahrbahnverschneidung, automatische Eckausrundung, freie Arm-Konfiguration) ist Phase 2. Die Grundarchitektur (Template → Handles → Strip-Editor pro Arm) steht, aber die geometrische Verschneidung der Kreuzungsfläche in der Mitte ist ein eigenständiges Teilprojekt.

---

## Datenmodell

### Strip-Array als Quelle der Wahrheit

```typescript
interface StraightRoadState {
  strips: Strip[]
  markings: Marking[]
  length: number         // Meter
}

interface CurveRoadState {
  strips: Strip[]
  markings: Marking[]
  radius: number         // Meter
  angle: number          // Grad
}

interface IntersectionState {
  template: 'T' | 'fourWay' | 'Y' | 'custom'
  arms: Arm[]
  markings: Marking[]
}

interface Arm {
  id: string
  angle: number          // Grad
  strips: Strip[]        // Querschnitt pro Arm
  cornerRadius: number   // Meter
  hasCrosswalk: boolean
}

interface RoundaboutState {
  preset: 'mini' | 'compact' | 'large'
  outerRadius: number
  laneWidth: number
  overridable: boolean
  approaches: Approach[]
  markings: Marking[]
}
```

### SmartRoad-Objekt auf dem Hauptcanvas

```typescript
// Erweitert CanvasObject (lebt in objects + objectOrder, kein separater Store)
interface SmartRoadObject extends CanvasObject {
  type: 'smartroad'
  subtype: 'straight' | 'curve' | 'intersection' | 'roundabout'

  // Editierbarer State (eigenes Datenmodell, NICHT stage.toJSON())
  editorState: string   // JSON.stringify({ strips, markings, length, ... })

  // Bounding Box in Metern (für Auto-Maßstab)
  realWidth: number
  realHeight: number
}
```

**Wichtig:** `editorState` ist unser eigenes Datenmodell (`{ strips, markings, length }`), NICHT `stage.toJSON()`. Das ist kleiner, lesbarer, versionierbar, und wir können daraus sowohl den Strip-Editor wiederherstellen als auch Live-Konva-Nodes rendern.

### Export auf den Hauptcanvas

```typescript
function handleFinish(state: StraightRoadState) {
  const roadObject: SmartRoadObject = {
    type: 'smartroad',
    subtype: 'straight',
    editorState: JSON.stringify(state),
    realWidth: state.strips.reduce((sum, s) => sum + s.width, 0),
    realHeight: state.length,
    x: dropPosition.x,
    y: dropPosition.y,
    rotation: 0,
  }
  store.addObject(roadObject)
}

// Doppelklick → Editor wieder öffnen
function handleDoubleClick(roadId: string) {
  const road = store.getObject(roadId) as SmartRoadObject
  const state = JSON.parse(road.editorState) as StraightRoadState
  openEditor(road.subtype, state, roadId)  // roadId für Update-Modus
}

// "Fertig" im Edit-Modus → bestehendes Objekt aktualisieren
function handleFinishEdit(roadId: string, state: StraightRoadState) {
  store.updateObject(roadId, {
    editorState: JSON.stringify(state),
    realWidth: state.strips.reduce((sum, s) => sum + s.width, 0),
    realHeight: state.length,
  })
  // → React re-rendert SmartRoadCanvasObject weil der Store sich ändert
  // → Straße auf dem Hauptcanvas zeigt sofort den neuen Querschnitt
  closeEditor()
}
```

**Zwei Modi:** Der Editor kennt "Neu erstellen" (`handleFinish` → `addObject`) und "Bearbeiten" (`handleFinishEdit` → `updateObject`). Der Unterschied: bei "Bearbeiten" wird kein neues Objekt erzeugt, sondern das bestehende aktualisiert. Position und Rotation auf dem Hauptcanvas bleiben erhalten — nur `editorState`, `realWidth`, `realHeight` ändern sich.

---

## Rendering

### Live Konva-Nodes (kein Raster)

SmartRoads werden auf dem Hauptcanvas als **Live Konva-Nodes** gerendert. Kein `toDataURL()`, keine Pixel.

```typescript
// Draufsicht-Renderer: nimmt Strip-Array, rendert Konva-Shapes
function RoadTopView({ strips, length, markings, scaleFactor }: TopViewProps) {
  return (
    <Group scaleX={scaleFactor} scaleY={scaleFactor}>
      <Layer>
        {strips.reduce<{ nodes: React.ReactNode[]; offset: number }>(
          (acc, strip) => {
            acc.nodes.push(
              <StripRenderer key={strip.id} strip={strip} x={acc.offset} length={length} />
            )
            acc.offset += strip.width
            return acc
          },
          { nodes: [], offset: 0 }
        ).nodes}
      </Layer>
      <Layer>
        {markings.map(m => (
          <MarkingRenderer key={m.id} marking={m} />
        ))}
      </Layer>
    </Group>
  )
}
```

Gleiche `StripRenderer`-Komponenten im Editor (Draufsicht) und auf dem Hauptcanvas. Eine Codebasis, zwei Verwendungen.

### SmartRoadCanvasObject (Hauptcanvas-Renderer)

`SmartRoadCanvasObject.tsx` ist die Komponente die ein SmartRoad-Objekt auf dem Hauptcanvas rendert. Sie:

1. Liest `editorState` aus dem CanvasObject im Store
2. Parsed das JSON → `StraightRoadState` (oder Curve/Intersection/Roundabout)
3. Rendert die Strips + Markierungen als Live Konva-Nodes in einer Group
4. Wendet Position, Rotation und Scale an

```typescript
function SmartRoadCanvasObject({ obj, scaleFactor }: Props) {
  const state = useMemo(() =>
    JSON.parse(obj.editorState!) as StraightRoadState,
    [obj.editorState]
  )

  return (
    <Group
      x={obj.x}
      y={obj.y}
      rotation={obj.rotation}
      scaleX={scaleFactor}
      scaleY={scaleFactor}
    >
      {/* Strips: auto-layouted, keine manuelle Positionierung */}
      {state.strips.reduce<{ nodes: React.ReactNode[]; offset: number }>(
        (acc, strip) => {
          acc.nodes.push(
            <StripRenderer key={strip.id} strip={strip} x={acc.offset} length={state.length} />
          )
          acc.offset += strip.width
          return acc
        },
        { nodes: [], offset: 0 }
      ).nodes}

      {/* Markierungen */}
      {state.markings.map(m => (
        <MarkingRenderer key={m.id} marking={m} />
      ))}
    </Group>
  )
}
```

**Position und Rotation** kommen aus dem `CanvasObject` (Standard-Felder `x`, `y`, `rotation`). Der User verschiebt und rotiert die Straße auf dem Hauptcanvas genauso wie jedes andere Objekt — über den Standard-Konva-Transformer. **Kein Resize** erlaubt (nur Rotation + Drag), weil die Straßenmaße real sind.

**`scaleFactor`** konvertiert Meter → Pixel: `metersToPixels(1, currentScale)`. Wird als Prop durchgereicht, ändert sich nur wenn der Maßstab springt.

### Maßstab-Kompatibilität

Auf dem Hauptcanvas: ein einziger Scale-Faktor auf der Group:

```typescript
const scaleFactor = metersToPixels(1, currentScale)
// Bei 1:200 → 18.9 px/m
// Bei 1:500 → 7.56 px/m
```

Wenn der Maßstab springt: **ein Wert ändert sich**. Alle Proportionen bleiben korrekt.

### Performance

`group.cache()` wenn die Straße nicht aktiv bearbeitet wird → Raster für Speed. `group.clearCache()` bei Interaktion → zurück zu Live-Nodes. Best of both worlds.

---

## Bausteine: Konva-Primitives

Straßen-Elemente sind geometrisch simpel — keine SVGs nötig:

```typescript
// StripRenderer: wählt die richtige Komponente basierend auf Strip-Typ
function StripRenderer({ strip, x, length }: StripRendererProps) {
  switch (strip.type) {
    case 'lane':
      return <LaneStrip x={x} width={strip.width} length={length} direction={strip.direction} />
    case 'sidewalk':
      return <SidewalkStrip x={x} width={strip.width} length={length} />
    case 'cyclepath':
      return <CyclePathStrip x={x} width={strip.width} length={length} variant={strip.variant} />
    // ... etc
  }
}

// Beispiel: LaneStrip
function LaneStrip({ x, width, length, direction }: LaneStripProps) {
  return (
    <Group x={x} y={0}>
      <Rect width={width} height={length} fill="#3a3a3a" />
      <DirectionArrow x={width / 2} y={length / 2} direction={direction} />
    </Group>
  )
}

// Beispiel: SidewalkStrip
function SidewalkStrip({ x, width, length }: SidewalkStripProps) {
  const pattern = usePavingPattern()
  return (
    <Rect x={x} y={0} width={width} height={length}
      fillPatternImage={pattern} fillPatternScale={{ x: 0.01, y: 0.01 }} />
  )
}
```

### Pattern-Generierung

Texturen für Gehweg, Grünfläche etc. via Offscreen-Canvas (einmal erzeugt, gecached):

```typescript
export function createPavingPattern(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 8; canvas.height = 8
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#c8c0b0'; ctx.fillRect(0, 0, 8, 8)
  ctx.fillStyle = '#b8b0a0'; ctx.globalAlpha = 0.4
  ctx.fillRect(0, 0, 4, 4); ctx.fillRect(4, 4, 4, 4)
  return canvas
}
```

---

## UI-Framework: Radix UI

Der Constrained Editor ist eine **React/CSS-Anwendung** (nicht Canvas-first). Radix UI liefert die UI-Primitives:

| Radix-Primitive | Verwendung im Editor |
|---|---|
| `Dialog` | Editor-Overlay (Focus-Trapping, ESC, Backdrop) |
| `Accordion` | Element-Palette (aufklappbare Schubladen) |
| `RadioGroup` | Varianten-Auswahl in den Schubladen |
| `ToggleGroup` | Quick Settings ([L\|B\|R\|—]) |
| `DropdownMenu` | Template-Auswahl (Kreuzung), Presets |
| `Tooltip` | Streifen-Info (Hover → "Fahrstreifen, 3.25m") |

**Warum Radix jetzt sinnvoll ist:** Der Strip-Editor ist React/CSS, nicht Canvas. Alle Radix-Primitives haben hier echte Anwendungsfälle — Accessibility, Keyboard-Navigation, Focus-Management gratis.

---

## Ordnerstruktur

```
src/smartroads/
├── types.ts                      // Strip, Marking, StraightRoadState, etc.
├── constants.ts                  // RASt-Defaults, Farben, Preset-Definitionen
│
├── shared/                       // Geteilte UI (Radix + React)
│   ├── EditorShell.tsx           // Overlay (Radix Dialog), Header, Footer
│   ├── ElementPalette.tsx        // Linke Spalte (Radix Accordion + RadioGroup)
│   ├── QuickSettings.tsx         // Floating Panel (Radix ToggleGroup)
│   ├── PresetList.tsx            // Preset-Buttons
│   ├── StripEditor.tsx           // Querschnitt-Editor (React/CSS, Drag & Drop)
│   └── patterns.ts              // Textur-Generierung (Pflaster, Gras, Asphalt)
│
├── rendering/                    // Konva-Komponenten (Editor-Draufsicht + Hauptcanvas)
│   ├── StripRenderer.tsx         // Dispatcher: Strip-Typ → Konva-Komponente
│   ├── MarkingRenderer.tsx       // Dispatcher: Marking-Typ → Konva-Komponente
│   ├── RoadTopView.tsx           // Draufsicht (Konva Stage für Markierungen)
│   ├── SmartRoadCanvasObject.tsx // Hauptcanvas-Renderer (Live Nodes + Group Scale)
│   ├── strips/                   // Konva-Komponenten pro Streifen-Typ
│   │   ├── LaneStrip.tsx
│   │   ├── SidewalkStrip.tsx
│   │   ├── CyclePathStrip.tsx
│   │   ├── ParkingStrip.tsx
│   │   ├── GreenStrip.tsx
│   │   ├── CurbStrip.tsx
│   │   └── ...
│   └── markings/                 // Konva-Komponenten pro Markierung
│       ├── CenterLine.tsx
│       ├── Crosswalk.tsx
│       ├── DirectionArrow.tsx
│       ├── StopLine.tsx
│       └── ...
│
├── editors/                      // Die vier Editoren
│   ├── StraightEditor.tsx        // Gerade: Strip-Editor + Draufsicht
│   ├── CurveEditor.tsx           // Kurve: Strip-Editor + Bogen-Draufsicht
│   ├── IntersectionEditor.tsx    // Kreuzung: Template + Arm-Konfiguration
│   └── RoundaboutEditor.tsx      // Kreisverkehr: Ring + Zufahrten
│
└── presets/                      // Vordefinierte Strip-Arrays
    ├── straight/
    │   ├── residential.ts        // Erschließungsstraße
    │   ├── collector.ts          // Sammelstraße
    │   ├── arterial.ts           // Hauptverkehrsstraße
    │   ├── rural.ts              // Landstraße
    │   ├── highway.ts            // Autobahn
    │   ├── tempo30.ts            // Tempo-30-Zone
    │   └── residential-zone.ts   // Spielstraße
    ├── curve/
    ├── intersection/
    └── roundabout/
```

---

## Presets: Datenstruktur

Ein Preset ist ein Strip-Array (kein Konva-JSON):

```typescript
// presets/straight/arterial.ts
export const arterialPreset: StraightRoadState = {
  length: 30,
  strips: [
    { id: '1',  type: 'sidewalk',  variant: 'standard',  width: 2.50 },
    { id: '2',  type: 'curb',      variant: 'standard',  width: 0.15 },
    { id: '3',  type: 'parking',   variant: 'parallel',  width: 2.00 },
    { id: '4',  type: 'cyclepath', variant: 'protected',  width: 1.85 },
    { id: '5',  type: 'lane',      variant: 'standard',  width: 3.25, direction: 'up' },
    { id: '6',  type: 'lane',      variant: 'standard',  width: 3.25, direction: 'up' },
    { id: '7',  type: 'green',     variant: 'standard',  width: 2.00 },
    { id: '8',  type: 'lane',      variant: 'standard',  width: 3.25, direction: 'down' },
    { id: '9',  type: 'lane',      variant: 'standard',  width: 3.25, direction: 'down' },
    { id: '10', type: 'cyclepath', variant: 'protected',  width: 1.85 },
    { id: '11', type: 'parking',   variant: 'parallel',  width: 2.00 },
    { id: '12', type: 'curb',      variant: 'standard',  width: 0.15 },
    { id: '13', type: 'sidewalk',  variant: 'standard',  width: 2.50 },
  ],
  markings: [
    { id: 'm1', type: 'centerline', variant: 'standard', x: 13.00, y: 0 },
    { id: 'm2', type: 'laneboundary', variant: 'solid', x: 6.50, y: 0 },
    { id: 'm3', type: 'laneboundary', variant: 'solid', x: 21.50, y: 0 },
  ],
}
```

---

## SVG-Export

Da SmartRoads als Live Konva-Nodes gerendert werden, ist Vektor-Export direkt möglich:

- Alle Bausteine sind Konva-Primitives (Rect, Line, Path, Group)
- PDF-Export: Konva-Nodes → Canvas-API → PDF (Vektor-Qualität)
- SVG-Export: `toSVG()` Methode pro Element-Komponente
- Fallback: `toDataURL({ pixelRatio: 4 })` für High-Res Raster

---

## Snapping auf dem Hauptcanvas

Platzierte SmartRoad-Segmente haben **Konnektoren** an offenen Enden:

- Magnetischer Snap ab ~20px Bildschirmnähe
- Auto-Rotation passend zum Endwinkel des Zielsegments
- Kreuzungen: ein Konnektor pro Arm
- Kreisverkehre: ein Konnektor pro Zufahrt
- Verbundene Segmente bleiben verlinkt

---

## Dependencies

| Package | Verwendung |
|---|---|
| `@radix-ui/react-dialog` | Editor-Overlay |
| `@radix-ui/react-accordion` | Element-Palette |
| `@radix-ui/react-toggle-group` | Quick Settings Toggles |
| `@radix-ui/react-dropdown-menu` | Template/Preset-Auswahl |
| `@radix-ui/react-tooltip` | Strip-Info-Tooltips |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Strip-Reihenfolge im Querschnitt |

---

## Zusammenfassung der Designprinzipien

1. **Constrained Editor, nicht freier Canvas.** Streifen sind immer bündig, keine Lücken, keine Versätze. Korrektheit by Design.
2. **Strip-Array als Datenmodell.** `{ strips, markings, length }` — simpel, lesbar, versionierbar. Kein `stage.toJSON()`.
3. **Zwei Rendering-Kontexte.** Querschnitt = React/CSS (Strip-Editor). Draufsicht = Konva-Canvas (Markierungen frei).
4. **Live Konva-Nodes auf dem Hauptcanvas.** Kein Raster. Vektor-Qualität bei jedem Zoom.
5. **Maßstab über Group-Scale.** Ein einziger `scaleFactor = metersToPixels(1, currentScale)`. Keine Konvertierung pro Strip.
6. **Radix UI für den Editor.** Dialog, Accordion, ToggleGroup, RadioGroup, DropdownMenu, Tooltip. Accessibility gratis.
7. **Vier Editoren, zwei Paradigmen.** Geraden/Kurven = Strip-Editor (1D). Kreuzungen/Kreisverkehre = Geführter 2D-Canvas.
8. **Drei Schichten.** Zero Config (Presets) → Quick Adjust (Toggle-Buttons) → Full Custom (Strip-Editor + Markierungen).
9. **Performance über Caching.** `group.cache()` wenn inaktiv. `clearCache()` bei Interaktion.
10. **Gleiche Konva-Komponenten überall.** StripRenderer und MarkingRenderer im Editor UND auf dem Hauptcanvas.

---

*Dieses Dokument ist die verbindliche Spezifikation für SmartRoads. Zuletzt aktualisiert: 2026-03-18 (Session 4 — Constrained Editor Ansatz).*
