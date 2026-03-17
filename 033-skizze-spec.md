# 033-Skizze – Technische Spezifikation v1.0

## Projektübersicht

**Name:** 033-Skizze
**Typ:** Webbasierte Progressive Web App (PWA)
**Zweck:** Erstellung professioneller Verkehrsunfallskizzen für den polizeilichen Einsatz
**Zielgruppe:** Polizeivollzugsbeamte (PVB) im Innen- und Außendienst, Polizeidirektion Hannover
**Plattform:** Browser-basiert, offline-fähig, Desktop-optimiert mit Touch-Support
**URL:** 033-skizze.de

---

## Grundprinzipien

### Einfachheit vor allem

Die Zielgruppe will nicht konfigurieren, einstellen oder verstehen – sie will eine Skizze zeichnen. Jede Interaktion muss sich selbst erklären. Presets über Custom. Wenig Dialoge, viel Direct Manipulation. Icons + Labels wo nötig. Undo ist der beste Freund – alles muss rückgängig machbar sein, sofort, ohne Angst.

### Drei-Schichten-Prinzip

Jedes Feature folgt dem gleichen Muster:

- **Schicht 1 – Zero Config:** Funktioniert sofort mit sinnvollen Defaults. Drag & Drop, fertig.
- **Schicht 2 – Quick Adjust:** Schnelle Anpassungen über einfache Toggles und +/− Buttons. 5 Sekunden.
- **Schicht 3 – Full Custom:** Volle Kontrolle für motivierte User. Detailkonfiguration verfügbar, aber nie im Weg.

### Lizenzierung

Alle Dependencies Open Source (MIT, Apache 2.0, BSD). Keine proprietären Bibliotheken. Keine CDN-Abhängigkeiten zur Laufzeit. Alles self-contained.

### Datenschutz

Null externe Verbindungen im Betrieb. Keine Telemetrie, keine externen Fonts, keine Analytics, keine Tracking-Pixel. Alles lokal. Die App ist nach dem Laden komplett autark.

---

## Tech Stack

| Komponente | Technologie | Begründung |
|---|---|---|
| Framework | React 18+ | Komponentenbasierte UI, riesiges Ökosystem |
| Sprache | TypeScript (strict) | Pflicht bei der Komplexität der Datenstrukturen |
| Bundler | Vite | Schneller Dev-Server, optimierte Builds |
| Canvas-Engine | Konva.js + react-konva | Deklarative React-Integration, Canvas-Performance |
| State Management | Zustand + Immer | Leichtgewichtig, immutable Updates, kein Boilerplate |
| Undo/Redo | zundo (Zustand-Middleware) | Automatische History über State-Snapshots |
| Offline/PWA | vite-plugin-pwa + Workbox | Precaching aller App-Assets |
| Lokale DB | Dexie.js (IndexedDB) | Auto-Save, Dokumentenverwaltung |
| Dateiformat | JSZip | .033sketch als JSON-in-ZIP |
| Styling | Tailwind CSS | Schnelles, konsistentes Styling |
| UI-Primitives | Radix UI | Barrierefreie Basis (Dialoge, Dropdowns, Tooltips) |
| Icons | Lucide React | Konsistente, moderne Ikonografie |
| Typografie | Inter (lokal gebundelt) | Open Source, professionell, nie extern geladen |

---

## Design-Sprache

### Ästhetik: Figma-Style

Die App soll sich anfühlen wie ein professionelles Design-Tool – modern, aufgeräumt, luftig. Kein Polizei-Software-Look.

### Farbpalette

| Token | Dark Mode | Light Mode | Verwendung |
|---|---|---|---|
| `--bg` | `#1e1e1e` | `#f5f5f5` | App-Hintergrund |
| `--surface` | `#2a2a2a` | `#ffffff` | Panels, Sidebars |
| `--surface-hover` | `#333333` | `#f0f0f0` | Hover-States |
| `--accent` | `#4a9eff` | `#4a9eff` | Interaktive Elemente, Selektion |
| `--border` | `#333333` | `#e0e0e0` | Trennlinien, Panel-Ränder |
| `--text` | `#eeeeee` | `#1a1a1a` | Primärtext |
| `--text-muted` | `#888888` | `#666666` | Sekundärtext |
| `--canvas-bg` | `#3a3a3a` | `#d0d0d0` | Viewport-Hintergrund (grau) |
| `--paper` | `#ffffff` | `#ffffff` | Canvas/Papier (immer weiß) |
| `--danger` | `#ef4444` | `#ef4444` | Löschen, Warnungen |
| `--success` | `#22c55e` | `#22c55e` | Bestätigungen |

### Regeln

- Monochrom + ein Blau. Keine Farborgien.
- Hover-States dezent (Hintergrundfarbe, kein Glow).
- Keine Schatten-Exzesse. Maximal `box-shadow: 0 2px 8px rgba(0,0,0,0.15)`.
- Dünne Borders (1px).
- Abgerundete Corners: 6px für Panels, 4px für Buttons/Inputs.
- Panels mit Backdrop-Blur (`backdrop-filter: blur(12px)`) und leichter Transparenz.
- Lucide Icons durchgehend: 20px in Toolbars, 16px in Panels, 14px inline.
- Inter als einzige Schriftart: 13px für UI, 12px für sekundäre Infos, 11px für Labels.

---

## Layout

```
┌──────────────────────────────────────────────────────────┐
│  [Logo] 033-Skizze    Dateiname.033sketch    [Offline ✓] │
│  File  Edit  View  Help                    [⚙] [?] [◐]  │
├────┬─────────────────────────────────────────┬───────────┤
│    │                                         │           │
│ T  │                                         │ INSPECTOR │
│ o  │                                         │           │
│ o  │           Canvas                        │ (kontext- │
│ l  │           (weißes DIN A4                │  sensitiv)│
│ b  │            auf grauem Grund)            │           │
│ a  │                                         │           │
│ r  │                                         │           │
│    │                                         ├───────────┤
├────┤                                         │           │
│    │                                         │ EBENEN    │
│ L  │                                         │ MANAGER   │
│ i  │                                         │           │
│ b  │                                         │           │
│    │                                         │           │
└────┴─────────────────────────────┬───────────┴───────────┘
                                   │ DIN A4 · 1:200 · 100% │
                                   └───────────────────────┘
```

### Top Bar

- Logo + App-Name links
- Aktiver Dateiname (editierbar per Klick) mittig
- Offline-Status-Indikator
- Menüleiste: File, Edit, View, Help
- Rechts: Einstellungen (Zahnrad), Hilfe (?), Dark/Light Toggle (◐)

### Linke Sidebar – Obere Hälfte: Toolbar

Schmale vertikale Icon-Leiste. Ein Icon pro Tool. Aktives Tool hervorgehoben mit Accent-Farbe. Tooltip bei Hover mit Name + Shortcut.

### Linke Sidebar – Untere Hälfte: Objektbibliothek

Ausklappbar. Collapsed: nur Kategorie-Icons. Expanded: volle Sidebar mit Suchfeld und Kategorie-Accordions.

### Rechte Sidebar – Obere Hälfte: Inspector

Kontextsensitiv – zeigt Properties des aktuell ausgewählten Objekts oder Dokument-Infos wenn nichts ausgewählt ist.

### Rechte Sidebar – Untere Hälfte: Ebenen-Manager

Layer-Stack mit Sichtbarkeit, Sperrung, Drag & Drop.

### Statusbar

Minimale Leiste am unteren Rand:

```
DIN A4 · Maßstab: 1:200 · Zoom: 100%
```

- **DIN A4:** Dokumentformat (statisch)
- **Maßstab:** Live-Anzeige, reine Anzeige, nicht editierbar. Blinkt kurz orange wenn er eine Stufe springt.
- **Zoom:** Aktueller Zoom-Level, +/− Buttons daneben

### Panel-Verhalten

- Alle Panels resizable und collapsible
- Doppelklick auf Panel-Header → minimieren
- Panels merken ihren Zustand (collapsed/expanded, Größe) in IndexedDB

---

## Canvas & Viewport

### Dokumentfläche

- DIN A4 Hochformat (210mm × 277mm bedruckbarer Bereich bei 10mm Rändern)
- Fester, sichtbarer Druckrahmen als weißes Rechteck
- Kein Grid, kein Raster – freier Canvas
- Eine Seite pro Dokument, keine Mehrseitigkeit

### Viewport

- Unendlicher Arbeitsbereich um das A4-Blatt herum (grauer Hintergrund)
- Pan: Mittelmaus-Drag, Space + Linksklick-Drag, Touch: Zwei-Finger-Drag
- Zoom: Scrollrad, Pinch-to-Zoom, Ctrl+0 = Fit-to-Page, Ctrl+1 = 100%
- Objekte können außerhalb des A4-Rahmens platziert werden (werden beim Export abgeschnitten)
- Sanfter roter Schimmer am A4-Rand wenn Objekte außerhalb liegen

### Druckrahmen

Am Rand des A4-Blattes, nur im Export/Druck sichtbar:

- Automatisch generierte Maßstabsleiste (z.B. `├── 5m ──┤`)
- Aktenzeichen, Datum, Sachbearbeiter, Dienststelle (aus Dokument-Properties)

---

## Maßstab-System

### Grundprinzip: Invisible Complexity

Das gesamte Koordinatensystem arbeitet intern in **echten Metern**. Jedes Objekt, jede Straße, jeder Abstand wird in Metern definiert. Der User merkt davon nichts – er arbeitet rein visuell.

### Interne Berechnung

```
Bedruckbarer A4-Bereich: 190mm × 277mm

contentBounds = Bounding Box aller Objekte auf dem Canvas
scaleX = 190mm / contentBounds.widthInMeters
scaleY = 277mm / contentBounds.heightInMeters
rawScale = min(scaleX, scaleY)

VALID_SCALES = [1:50, 1:100, 1:150, 1:200, 1:250, 1:500, 1:1000]
printScale = nächster VALID_SCALES Wert ≤ rawScale (immer abrunden)
```

### Typische Maßstäbe

| Szene-Ausdehnung (längste Seite) | Auto-Maßstab | Typischer Anwendungsfall |
|---|---|---|
| bis ~15m | 1:50 | Parkplatz-Rempler, Engstelle |
| bis ~25m | 1:100 | Einmündung, kleiner Kreuzungsbereich |
| bis ~50m | 1:200 | Standard-Kreuzung |
| bis ~80m | 1:250 | Große Kreuzung mit Zufahrten |
| bis ~150m | 1:500 | Straßenabschnitt |
| bis ~300m | 1:1000 | Langer Streckenabschnitt |

### Was der User sieht

- Statusbar: `Maßstab: 1:200` – aktualisiert sich live, reine Anzeige
- Kurzes oranges Aufblinken wenn der Maßstab eine Stufe springt
- Maßstabsleiste im Druckrahmen (nur auf dem gedruckten PDF)
- Bemaßungstool zeigt Realmaße (einzige Stelle wo der User Meterangaben sieht)

### Was der User NICHT sieht

- Keine Meter-Eingabefelder im UI
- Keine Koordinatenanzeige
- Keine Maßstab-Auswahl oder -Konfiguration
- Keine Breiten- oder Höhenangaben bei Objekten

---

## Werkzeuge (Toolbar)

### Auswahl & Navigation

| Icon | Name | Shortcut | Beschreibung |
|---|---|---|---|
| ↖ | Auswahl | V | Einzel- und Mehrfachauswahl (Rahmen, Shift+Klick) |
| ◇ | Direktauswahl | A | Ankerpunkte von Pfaden und Roads editieren |
| ✋ | Hand | H / Space | Pan (auch via Mittelmaus) |

### Zeichenwerkzeuge

| Icon | Name | Shortcut | Beschreibung |
|---|---|---|---|
| ✏️ | Freihand | B | Konfigurierbarer Pinsel (Stärke, Farbe, Glättung) |
| ╱ | Linie | L | Gerade Linie, optional mit Pfeilspitze |
| ↗ | Pfeil | Shift+L | Linie mit Pfeilspitze |
| ⬜ | Rechteck | R | Rechteck / Quadrat (Shift) |
| ⭕ | Ellipse | O | Ellipse / Kreis (Shift) |
| ⬡ | Polygon | P | Punkt für Punkt, schließen per Doppelklick/Enter |
| 〰️ | Pfad | Shift+P | Bezier-Kurven für Freiformen |

### Text

| Icon | Name | Shortcut | Beschreibung |
|---|---|---|---|
| T | Text | T | Textbox mit Schrift, Größe, Farbe, Ausrichtung |

### Bemaßung

| Icon | Name | Shortcut | Beschreibung |
|---|---|---|---|
| ↔ | Bemaßung | M | Zwei Punkte setzen → automatische Realmaß-Anzeige in Metern |

### Unfallspezifische Werkzeuge

| Icon | Name | Shortcut | Beschreibung |
|---|---|---|---|
| 〰️ | Bremsspur | – | Parametrisch: Start-/Endbreite, Verlauf, Typ |
| ▨ | Splitterfeld | – | Polygon mit genormter Schraffur |
| 💧 | Flüssigkeit | – | Öl, Kraftstoff, Kühlwasser (je eigene Schraffur) |
| ✕ | Kollisionspunkt | – | Genormtes Symbol für Kollisionsstelle |
| ◎ | Endlage | – | Marker für Fahrzeug-Endlage |
| ↝ | Bewegungslinie | – | Gekurvte Pfeile für Fahrtrichtungen entlang Pfad |

---

## Objektbibliothek

### Aufbau

Sidebar links, untere Hälfte. Zwei Zustände:

**Collapsed:** Nur Kategorie-Icons vertikal. Hover zeigt Label.

**Expanded:** Volle Sidebar mit:
- Suchfeld oben (filtert über Tags und Labels)
- Kategorien als Accordion-Gruppen

### Kategorien

#### 🛣️ SmartRoads (Straßengenerator)

- Gerade
- Kurve
- Kreuzung
- Kreisverkehr

Jeder Typ ist ein eigenständiges, parametrisches Objekt. Drag & Drop auf Canvas platziert einen sinnvollen Default. Doppelklick öffnet den SmartRoad Editor. → Siehe Kapitel "SmartRoads".

#### 🚗 Fahrzeuge

- **PKW:** Limousine, Kombi, SUV, Kleinwagen, Cabrio
- **LKW:** Solo, mit Anhänger, Sattelzug, Kleintransporter
- **Zweirad:** Motorrad, Fahrrad, E-Scooter, Lastenrad
- **Bus:** Linienbus, Gelenkbus, Reisebus
- **Sonderfahrzeuge:** Streifenwagen, RTW, Feuerwehr

Jedes Fahrzeug: SVG-Draufsicht, einfärbbar über benannte SVG-IDs, maßstabsgetreu.

#### 🏗️ Infrastruktur

- Gebäudeumrisse (generisch, beschriftbar)
- Bordsteine, Gehwegkanten
- Leitplanken, Schutzplanken
- Poller, Absperrungen
- Brücken, Unterführungen
- Baustellenelemente (Baken, Absperrtafeln)

#### 🚦 Verkehrsregelung

- Ampeln (Fahrzeug, Fußgänger)
- Verkehrszeichen nach StVO (durchsuchbar nach Nummer und Name)
- Zusatzzeichen

#### 🌳 Umgebung

- Bäume (Laub, Nadel – Draufsicht als Kreis/Symbol)
- Hecken, Zäune, Mauern
- Laternen, Masten
- Parkbänke, Bushaltestellen
- Gewässer (Graben, Bach als Linienelement)
- Böschungen

#### 📐 Markierungen

- Bremsspuren (vordefinierte Varianten)
- Splitterfelder, Flüssigkeiten
- Endlagen, Kollisionspunkte
- Nummerierungs-Labels (kreisförmig: ①②③)
- Himmelsrichtungs-Pfeil (N-Pfeil)
- Foto-Standort-Marker (Kamera-Icon mit Blickrichtung)

### Drag & Drop

Objekte werden per Drag aus der Bibliothek auf den Canvas gezogen. Beim Droppen werden sie mit korrekten Realmaßen platziert (intern, basierend auf dem aktuellen Auto-Maßstab). Das Objekt erscheint zentriert unter dem Cursor.

---

## SVG-Objekt-System

### SVG-Anforderungen

Alle Objekte liegen als Inline-SVGs in der App vor. Die SVGs stammen aus einer eigenen Bibliothek (Adobe Illustrator Export) und haben unterschiedliche ViewBox-Größen je nach Objekttyp.

### SVG-Preprocessing-Pipeline

Ein Build-Script normalisiert alle SVGs automatisch:

1. **ViewBox trimmen:** Whitespace entfernen, ViewBox auf tatsächliche Pfad-Grenzen beschneiden
2. **SVGO-Optimierung:** Unnötige Illustrator-Metadaten entfernen, Pfade optimieren
3. **ID-Konsistenz:** Sicherstellen dass einfärbbare Elemente konsistente IDs haben
4. **Export:** Als ES-Module für Vite Raw-Import

### Object Registry

Zentrale Definition für jedes Objekt:

```typescript
interface ObjectEntry {
  // Identifikation
  id: string                        // "veh-pkw-limousine"
  category: ObjectCategory          // "vehicles"
  subcategory: string               // "pkw"
  label: string                     // "Limousine"
  tags: string[]                    // ["pkw", "auto", "limousine", "personenwagen"]

  // Realmaße in Metern (intern, nie dem User angezeigt)
  realWidth: number                 // 1.80
  realHeight: number                // 4.50

  // Orientierung (welche Achse ist "vorne")
  orientation: 'up' | 'right'       // 'up' = Nase zeigt nach oben im SVG

  // SVG-Referenz (Vite raw import)
  svgId: string

  // Einfärbung
  colorable: boolean
  colorTargets: string[]            // CSS-Selektoren: ["#body", "#body-2", ...]
  defaultColor: string              // "#f9f9f6"

  // Verhalten
  rotatable: boolean
  defaultLayer: string              // "vehicles" – Ebene auf der das Objekt landet

  // Optionale Andockpunkte (für Snapping)
  snapPoints?: SnapPoint[]
}

type ObjectCategory =
  | 'smartroads'
  | 'vehicles'
  | 'infrastructure'
  | 'traffic-regulation'
  | 'environment'
  | 'markings'
```

### Einfärbung

SVGs haben benannte IDs (z.B. `body`, `body-2`, `body-3`) für die Karosserie. Das Registry definiert welche IDs die Farbziele sind. Beim Einfärben wird per Style-Attribut die Fill-Farbe auf diesen Elementen gesetzt.

Vordefinierte Farbchips im Inspector: Weiß, Schwarz, Silber, Rot, Blau, Grün, Gelb + Custom Color Picker.

---

## SmartRoads – Parametrischer Straßengenerator

### Philosophie

SmartRoads ist das Alleinstellungsmerkmal der App. Ein parametrischer Generator für Straßensegmente, basierend auf RASt-Defaultwerten (Richtlinien für die Anlage von Stadtstraßen), aber ohne Konformitätszwang. Der User hat maximale Freiheit.

RASt dient ausschließlich als Quelle für sinnvolle Standardwerte (Fahrstreifenbreiten, Gehwegbreiten etc.). Keine Validierung, keine Warnungen, keine Einschränkungen.

### Verfügbare Segment-Typen

In der Objektbibliothek unter "SmartRoads":

- **Gerade** – Standardstraßenabschnitt
- **Kurve** – Gebogenes Segment mit Radius
- **Kreuzung** – Knotenpunkt (Template-basiert)
- **Kreisverkehr** – Parametrischer Kreisverkehr

### Workflow

```
1. User zieht Segment-Typ aus der Bibliothek auf den Canvas
   → Sinnvoller Default wird platziert (2 Spuren, Gehweg beidseitig)
   → Sofort nutzbar

2. Optional: Doppelklick auf platziertes Segment
   → SmartRoad Editor öffnet sich als Overlay
   → User passt an
   → "Übernehmen" aktualisiert das Segment auf dem Canvas

3. Auf dem Canvas: Segment verschieben, rotieren, an andere andocken
```

### SmartRoad Editor – UI

Öffnet sich als großes Overlay über dem Canvas. Canvas im Hintergrund bleibt sichtbar (gedimmt). Einheitliches Layout für alle vier Segment-Typen, rechte Spalte ist typspezifisch.

```
┌──────────────────────────────────────────────────────────┐
│  SmartRoad: [Typ]                             ✕ Schließen│
├──────────┬───────────────────────┬───────────────────────┤
│          │                       │                       │
│ ELEMENTE │   LIVE-VORSCHAU       │  QUICK SETTINGS       │
│          │   (Draufsicht)        │  (typspezifisch)      │
│ Spuren & │                       │                       │
│ Streifen │   Breiten per Drag    ├───────────────────────┤
│          │   direkt hier ändern  │                       │
│──────────│                       │  ELEMENT-LISTE        │
│          │   Markierungen        │  (Mini-Ebenenmanager) │
│MARKIERUNG│   direkt hier setzen  │                       │
│          │                       │                       │
├──────────┴───────────────────────┴───────────────────────┤
│                                  Übernehmen    Abbrechen │
└──────────────────────────────────────────────────────────┘
```

### Linke Spalte: Element-Palette

#### Spuren & Streifen

Jedes Element ist eine **aufklappbare Schublade** mit Varianten:

**Fahrstreifen:**
```
▼ Fahrstreifen
  ◉ Standard
  ○ Abbiegespur Links
  ○ Abbiegespur Rechts
  ○ Mehrzweckstreifen
  Richtung: [←] [→]
```
Default-Breite (intern): 3.25m

**Radweg:**
```
▼ Radweg
  ◉ Baulich getrennt
  ○ Radfahrstreifen (durchgezogen)
  ○ Schutzstreifen (gestrichelt)
  Farbe: [●] Rot  [○] Keine
```
Default-Breite (intern): 1.85m (baulich), 1.50m (Schutzstreifen)

**Gehweg:**
```
▼ Gehweg
  ◉ Standard
  ○ Gemeinsamer Geh-/Radweg
  ○ Getrennter Geh-/Radweg
  Bordstein: [●] Ja  [○] Nein
```
Default-Breite (intern): 2.50m

**Parkstreifen:**
```
▼ Parkstreifen
  ◉ Längsparken
  ○ Schrägparken
  ○ Querparken
```
Default-Breite (intern): 2.00m (Längs), 4.50m (Schräg), 5.00m (Quer)

**Weitere Elemente:**

| Element | Varianten | Default-Breite (intern) |
|---|---|---|
| Grünstreifen | Standard, Baumstreifen | 2.00m |
| Busstreifen | Standard | 3.50m |
| Gleiskörper | Eigentrasse, bündig | 3.00m |
| Mittelstreifen | Markierung, Grünstreifen, Leitplanke, Gleise | 0.15m–3.00m |
| Seitenstreifen | Standard | 1.50m |
| Bankett | Standard | 1.50m |
| Bordstein | Standard | 0.15m |
| Rinne | Standard | 0.30m |

#### Markierungen

Ebenfalls aufklappbare Schubladen:

**Leitlinie:**
```
▼ Leitlinie
  ◉ Standard (6m/6m)
  ○ Kurz (3m/3m)
  ○ Warnlinie (6m/3m)
```

**Richtungspfeil:**
```
▼ Richtungspfeil
  ◉ Geradeaus
  ○ Links
  ○ Rechts
  ○ Geradeaus + Links
  ○ Geradeaus + Rechts
```

**Weitere Markierungen:**

| Markierung | Varianten |
|---|---|
| Fahrstreifenbegrenzung | Durchgezogen, doppelt |
| Sperrfläche | Schraffur (Winkel einstellbar) |
| Haltelinie | Standard (breit, durchgezogen) |
| Wartelinie | Haifischzähne |
| Fußgängerüberweg | Zebrastreifen |
| Radfurt | Gestrichelt, rot hinterlegt |
| Bushaltestellenmarkierung | Standard |
| Tempo-Piktogramm | 30, 50, etc. |
| Parkflächenmarkierung | Standard |
| Freie Linie | Typ, Stärke, Muster wählbar |
| Freies Symbol | Aus Bibliothek wählen |

### Mittlere Spalte: Live-Vorschau

Zeigt das Segment in Draufsicht – exakt wie es auf dem Canvas aussehen wird. Aktualisiert sich bei jeder Änderung live.

**Interaktion direkt in der Vorschau:**

- Breiten per Drag an Elementkanten ändern
- Markierungen per Drag positionieren
- Visuelles Highlight des aktuell in der Element-Liste ausgewählten Elements

**Bei Kreuzung/Kreisverkehr:** Die gesamte Mitte wird zur interaktiven Draufsicht des Knotenpunkts. Arme/Zufahrten per Drag drehen, Eckradien per Handle anpassen.

### Rechte Spalte: Quick Settings + Element-Liste

#### Quick Settings (oberer Bereich)

Schnelle Buttons für die häufigsten Anpassungen – 80% aller Konfigurationen ohne die Element-Palette zu berühren:

**Gerade & Kurve:**
```
Spuren:  [−] 2 [+]
Gehweg:  [L] [Beide] [R] [—]
Radweg:  [L] [Beide] [R] [—]
Parken:  [L] [Beide] [R] [—]
Mitte:   [—] [Linie] [Grün] [Planke]
```

**Kurve zusätzlich:**
```
Richtung: [← Links] [Rechts →]
```
Radius und Winkel werden direkt auf dem Canvas per Drag-Handles angepasst, nicht über Eingabefelder.

**Kreuzung:**
```
Template: [T-Kreuzung ▼]

Arme: 3
┌ Arm 1 (Nord) ─────────────┐
│ Spuren: [−] 2 [+]         │
│ Abbiegespur: [Nein ▼]     │
│ Fußgängerfurt: [●]        │
│ [Querschnitt anpassen →]  │
└────────────────────────────┘
┌ Arm 2 (Ost) ──────────────┐
│ ...                        │
└────────────────────────────┘

[+ Arm hinzufügen]
```

Verfügbare Templates: T-Kreuzung (3-Arm, 90°), Standardkreuzung (4-Arm, 90°), Versetzt, Y-Kreuzung, 5-Arm, Custom.

Jeder Arm ist eine einklappbare Karte. "Querschnitt anpassen" öffnet den Spur-Editor als Sub-View für diesen Arm.

Armwinkel und Eckradien werden in der Live-Vorschau per Drag angepasst, nicht numerisch.

**Kreisverkehr:**
```
Preset: [Kompakt ▼]
Überfahrbarer Ring: [○] Aus

Zufahrten: 4
┌ Zufahrt 1 (Nord) ─────────┐
│ Fußgängerquerung: [●]     │
│ [Querschnitt anpassen →]  │
└────────────────────────────┘

[+ Zufahrt hinzufügen]
```

Verfügbare Presets: Mini (Ø 13–22m), Kompakt (Ø 26–40m), Groß (> 40m).

Außenradius, Fahrbahnbreite und Zufahrtswinkel werden in der Vorschau per Drag angepasst.

#### Element-Liste / Mini-Ebenenmanager (unterer Bereich)

Zeigt alle Elemente des aktuellen Segments als geordnete Liste:

```
QUERSCHNITT
─────────────────────────
  ≡  Gehweg                🗑
  ≡  Radweg (baulich)      🗑
  ≡  Fahrstreifen →        🗑
  ┄┄┄┄ Mitte ┄┄┄┄┄┄┄┄┄
  ≡  Fahrstreifen ←        🗑
  ≡  Gehweg                🗑

MARKIERUNGEN
─────────────────────────
  ≡  Leitlinie             🗑
  ≡  Zebrastreifen         🗑

[+ Links]  [+ Mitte]  [+ Rechts]
```

**Interaktion:**
- ≡ Drag-Handle: Reihenfolge ändern (= Position im Querschnitt tauschen)
- 🗑 Löschen (mit Undo)
- Klick auf Element: Schublade links klappt auf mit Optionen dieses Elements vorgeladen (Typ nachträglich änderbar)
- Klick auf Element: In der Live-Vorschau wird es hervorgehoben

### Presets (gespeicherte Querschnitte)

**System-Presets** (vordefiniert):
- Erschließungsstraße (1 Fahrstreifen + Gehweg beidseitig)
- Sammelstraße (1 Fahrstreifen + Rad + Gehweg beidseitig)
- Hauptverkehrsstraße (2 Fahrstreifen + Mittelstreifen + Rad + Gehweg)
- Landstraße (1 Fahrstreifen pro Richtung + Bankett)
- Autobahn (2–3 Fahrstreifen + Standstreifen + Mittelstreifen)
- Tempo-30-Zone
- Spielstraße / Verkehrsberuhigt

**User-Presets:** Der User kann eigene Querschnitte als "Meine Straßen" speichern. Werden in IndexedDB persistiert und sind dokumentübergreifend verfügbar.

### Snapping & Konnektoren

Platzierte SmartRoad-Segmente haben **Konnektoren** an offenen Enden:

- Magnetischer Snap ab ~20px Bildschirmnähe
- Auto-Rotation passend zum Endwinkel des Zielsegments
- Bei unterschiedlichen Querschnittsbreiten: lineare Verziehung automatisch
- Kreuzungen haben einen Konnektor pro Arm
- Kreisverkehre haben einen Konnektor pro Zufahrt
- Verbundene Segmente bleiben verlinkt – Verschieben zieht angedockte mit

### Road-Rendering

SmartRoad-Segmente werden intern als SVG definiert und auf den Konva-Canvas als Image-Layer gerendert. Das ermöglicht:

- Performantes Canvas-Rendering (Pixel, kein SVG-DOM)
- Sauberen SVG-Export (die SVG-Definition existiert bereits)
- Korrekte Strichstärken und Markierungsmuster in jedem Maßstab

---

## Inspector / Properties Panel

### Kontextsensitives Verhalten

Der Inspector (rechte Sidebar, obere Hälfte) zeigt unterschiedliche Inhalte je nach Auswahl:

### Nichts ausgewählt → Dokument-Properties

```
DOKUMENT
──────────────────────
Aktenzeichen: [ ____________ ]
Datum:        [ ____________ ]
Sachbearbeiter: [ ____________ ]
Dienststelle: [ ____________ ]
```

Diese Felder erscheinen im Druckrahmen beim PDF-Export.

### Objekt ausgewählt → Objekt-Properties

```
[Icon] PKW 1
──────────────────────
Rotation:  [Drehregler]
Farbe:     [● ● ● ● ● ● ● 🎨]
──────────────────────
Label:     [ PKW 1          ]
Nr:        [ 1 ]
Notiz:     [ ______________ ]
```

- **Rotation:** Drehregler (Dial) + Shift+Drag auf Canvas
- **Farbe:** Chips + Custom Picker (nur bei `colorable: true`)
- **Label:** Freitext, erscheint als Beschriftung
- **Nr:** Beteiligtennummer
- **Notiz:** Freitext-Notiz (nur in Datei, nicht auf Canvas)

Position und Größe werden ausschließlich per Direct Manipulation auf dem Canvas geändert (Drag, Anfasser). Keine X/Y/W/H-Eingabefelder.

### Mehrere Objekte ausgewählt → Alignment

```
AUSRICHTUNG
──────────────────────
[⫢] [⫤] [⫠] [⫞]  (links, rechts, oben, unten)
[⫟] [⫡]          (horizontal, vertikal zentriert)
[⋯] [⋮]          (gleichmäßig verteilen h/v)
```

### SmartRoad ausgewählt → Road-Info

```
[Icon] SmartRoad: Gerade
──────────────────────
Spuren: 2
Gehweg: Beidseitig
Markierungen: 3

[Bearbeiten →]  (öffnet SmartRoad Editor)
```

Einfache Anzeige + Button zum Editor. Keine Inline-Bearbeitung von Road-Parametern.

---

## Ebenen-Manager

### Aufbau

Panel rechts unten. Zeigt den Layer-Stack des Dokuments.

### Default-Ebenen bei neuem Dokument

```
☐ Background
├ 🛣 Straßen        👁 🔒
├ 🚗 Fahrzeuge       👁 🔒
├ 📐 Markierungen    👁 🔒
├ T  Beschriftung    👁 🔒
└ ↔  Bemaßung        👁 🔒
```

### Pro Ebene

- **Sichtbarkeit:** Auge-Icon (👁) – Toggle
- **Sperrung:** Schloss-Icon (🔒) – Toggle (gesperrte Objekte nicht selektierbar/verschiebbar)
- **Farbcode:** Kleiner Farbdot für visuelle Unterscheidung
- **Aktiv-Indikator:** Hervorgehobene Ebene = dort landen neue Objekte

### Interaktion

- **Drag & Drop:** Ebenen-Reihenfolge ändern (Z-Order)
- **Drag & Drop:** Objekte zwischen Ebenen verschieben
- **Doppelklick auf Name:** Inline-Rename
- **Rechtsklick:** Kontextmenü (Duplizieren, Zusammenführen, Löschen, "Alle anderen sperren")
- **Gruppen:** Objekte innerhalb einer Ebene gruppierbar (ein-/ausklappbar)
- **Klick auf Objekt in Liste:** Selektiert es auf dem Canvas
- **Klick auf Objekt auf Canvas:** Scrollt die Ebenen-Liste zum entsprechenden Eintrag

### Objektdarstellung in Ebenen

```
▼ 🚗 Fahrzeuge                   👁 🔒
  ▼ 📁 Gruppe                    👁 🔒
    🚗 PKW 1                 👁 🔒 🔵
    🚗 PKW 2                 👁 🔒 🔴
  📐 Bremsspur 1                 👁 🔒
```

Jedes Objekt zeigt: Typ-Icon, Label, Sichtbarkeit, Sperrung, Farbdot (bei eingefärbten Objekten).

### Dynamic Rename

Inline-Rename per Doppelklick auf den Objektnamen. Sofort editierbar, Enter bestätigt, Escape bricht ab.

---

## Undo/Redo & History

### Implementierung

Über Zustand-Snapshots via zundo (Zustand-Middleware). Jeder State-Change erzeugt automatisch einen Snapshot.

### Verhalten

- **Ctrl+Z:** Undo
- **Ctrl+Shift+Z / Ctrl+Y:** Redo
- Unbegrenzt (bis Memory-Limit, älteste States fallen raus)
- Alle Aktionen sind rückgängig machbar: Platzieren, Löschen, Verschieben, Rotieren, Farbänderungen, Ebenen-Operationen, SmartRoad-Änderungen

### History-Panel (optional)

Einblendbar über View-Menü. Zeigt benannte Einträge:

```
HISTORY
──────────────────────
• PKW 1 hinzugefügt
• PKW 1 rotiert
• Straße platziert
• Bremsspur gezeichnet
• PKW 2 eingefärbt (rot)
```

Klick auf Eintrag → springt zu diesem State.

---

## Datei & Export

### Dateiformat: `.033sketch`

Internes Format: JSON in ZIP (via JSZip).

**Struktur:**
```
dokument.033sketch (ZIP)
├── document.json       → Canvas-State, Dokument-Metadaten
├── layers.json         → Ebenenstruktur mit Objektreferenzen
├── roads.json          → SmartRoad-Definitionen (parametrisch)
├── history.json        → Undo-History (optional, konfigurierbar)
└── assets/             → Eingebettete Bilder/Custom-SVGs
```

### Auto-Save

- Alle 30 Sekunden automatisch in IndexedDB (via Dexie.js)
- Kein Datenverlust bei Browser-Crash oder versehentlichem Schließen
- Statusanzeige in der Top Bar: "Gespeichert ✓" / "Speichert..."

### Manuelles Speichern & Laden

- **File System Access API** (Chrome/Edge): Natives Save/Open-Verhalten
- **Fallback:** Download als .033sketch / Upload via Datei-Dialog
- **Ctrl+S:** Speichern
- **Ctrl+Shift+S:** Speichern unter

### Startansicht

Beim Öffnen der App (kein Dokument geladen):

- Zuletzt geöffnete Dokumente als Kacheln mit Thumbnail (aus IndexedDB)
- "Neues Dokument" Button
- Vorlagen-Auswahl (Leere Skizze, Kreuzung, T-Kreuzung, Autobahn-Abschnitt)

### Export

| Format | Beschreibung |
|---|---|
| PDF | Mit Druckrahmen (Maßstabsleiste, Aktenzeichen, Datum, Sachbearbeiter) |
| PDF/A-1b | Für elektronische Akte / NIVADIS |
| PNG | Wählbare Auflösung |
| SVG | Vektor-Export |

Alle Exporte respektieren den automatisch berechneten Maßstab und beinhalten den DIN-A4-Druckrahmen mit Maßstabsleiste.

---

## UX & Interaktion

### Keyboard Shortcuts

Alle Tools und häufigen Aktionen haben Shortcuts. Konfigurierbar über Einstellungen.

**Wichtigste:**
| Shortcut | Aktion |
|---|---|
| V | Auswahl-Tool |
| H / Space (halten) | Hand-Tool (Pan) |
| T | Text-Tool |
| B | Freihand/Brush |
| L | Linie |
| R | Rechteck |
| M | Bemaßung |
| Delete / Backspace | Ausgewähltes löschen |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+C / Ctrl+V | Copy / Paste |
| Ctrl+G | Gruppieren |
| Ctrl+Shift+G | Gruppe auflösen |
| Ctrl+A | Alles auswählen |
| Ctrl+S | Speichern |
| Ctrl+K | Command Palette |
| Ctrl+0 | Zoom: Fit to Page |
| Ctrl+1 | Zoom: 100% |
| Ctrl++ / Ctrl+- | Zoom in / out |

### Radial-Kontextmenü

Rechtsklick auf Canvas öffnet ein rundes Menü mit den häufigsten Aktionen (kontextsensitiv):

**Auf leerem Canvas:** Einfügen, Alle auswählen, Zoom to Fit
**Auf Objekt:** Kopieren, Einfügen, Löschen, Gruppieren, Ebene wechseln, In den Vordergrund/Hintergrund

### Command Palette

Ctrl+K öffnet eine Suchleiste (wie VS Code / Figma). Tippen filtert alle verfügbaren Aktionen: Tools, Befehle, Objekte, Einstellungen. Enter führt aus.

### Snapping

- An Objekte (Kanten, Mittelpunkte)
- An Konnektoren (SmartRoad-Enden)
- An Hilfslinien
- Snapping global ein/aus schaltbar (Toggle in Statusbar oder Shortcut)

### Hilfslinien

- Ziehbar von den Linealen (Oberkante, linke Kante des Canvas)
- Magnetisch – Objekte snappen daran
- Löschbar per Drag zurück auf das Lineal

### Clipboard

- Copy/Cut/Paste von Objekten
- Intern als JSON in Zwischenablage → funktioniert auch zwischen Dokumenten (wenn beide in separaten Tabs offen)

### Touch-Support

Grundlegende Bedienbarkeit auf Tablets (iPad, Surface):
- Pan: Zwei-Finger-Drag
- Zoom: Pinch
- Auswahl: Tap
- Verschieben: Long-Press + Drag
- Keine Hover-States auf Touch → alle wichtigen Aktionen auch per Tap erreichbar

### Dark/Light Mode

- Toggle über Icon in der Top Bar (◐)
- Systemeinstellung als Default
- Canvas/Papier bleibt immer weiß

### Lokalisierung

- Deutsch als Primärsprache
- Englisch als Fallback
- Alle UI-Strings in i18n-Dateien (vorbereitet für weitere Sprachen)

---

## Entwicklungsphasen

### Phase 1: Foundation

- Projekt-Setup (Vite + React + TypeScript + Zustand + Konva)
- Canvas mit DIN-A4-Rahmen, Pan & Zoom
- Auto-Maßstab-System (intern, Statusbar-Anzeige)
- Grundlegendes Tool-System (Auswahl, Hand)
- Ebenen-Manager (Grundversion: Erstellen, Umbenennen, Sichtbarkeit, Sperrung, Drag & Drop)
- Dark/Light Mode
- Grundlegendes Layout (Toolbar, Panels, Statusbar)

### Phase 2: Objekte

- SVG-Preprocessing-Pipeline (SVGO, Normalisierung, Build-Script)
- Object Registry + Manifest für alle Objekte
- Objektbibliothek UI (Sidebar, Suche, Kategorien, Drag & Drop)
- Inspector (Rotation, Farbe, Metadaten)
- Objekt-Einfärbung
- Undo/Redo (zundo)
- Snapping-System (Objekt-an-Objekt)

### Phase 3: Zeichenwerkzeuge

- Freihand, Linie, Pfeil
- Rechteck, Ellipse, Polygon, Pfad
- Bemaßungstool (mit Realmaß-Anzeige in Metern)
- Text-Tool
- Unfallspezifische Tools (Bremsspur, Splitterfeld, Flüssigkeit, Kollisionspunkt, Endlage, Bewegungslinien)
- Hilfslinien

### Phase 4: SmartRoads

- SmartRoad-Datenmodell (Querschnitt, Segmente, Markierungen)
- SmartRoad Editor UI (Overlay, Element-Palette, Live-Vorschau, Quick Settings, Element-Liste)
- Gerade Segmente (Querschnitt-Rendering, Markierungen)
- Kurven (Radius, Winkel, Drag-Handles)
- Kreuzungen (Template-System, Arm-Konfiguration)
- Kreisverkehr (Parametrisch, Zufahrten)
- Snapping/Konnektoren zwischen Segmenten
- Preset-System (System-Presets + User-Presets)

### Phase 5: Polish & Export

- PDF-Export mit Druckrahmen (Maßstabsleiste, Metadaten)
- PDF/A-1b für elektronische Akte
- PNG/SVG-Export
- Dateiformat (.033sketch) Save/Load
- Auto-Save (IndexedDB, Dexie.js)
- Startansicht (zuletzt geöffnet, Vorlagen)
- Keyboard Shortcuts komplett
- Command Palette (Ctrl+K)
- Radial-Kontextmenü
- Touch-Support
- Vorlagen-System
- Onboarding (interaktives Tutorial beim ersten Start)

---

## Technische Architektur (Übersicht)

### State-Philosophie

Alles läuft über React-State (Zustand). Der Canvas ist kein eigenständiges Ökosystem, sondern eine View auf den Store. Der Ebenen-Manager rendert dieselben Daten wie der Canvas – kein Sync nötig. Tool-Wechsel ist ein State-Update, kein imperativer Moduswechsel.

### Store-Struktur (Zustand)

```typescript
interface AppState {
  // Dokument
  document: DocumentMeta           // Aktenzeichen, Datum, etc.
  
  // Canvas
  viewport: ViewportState          // Zoom, Pan-Offset
  scale: ScaleState                // Berechneter Maßstab
  
  // Objekte & Ebenen
  layers: Layer[]                  // Ebenen-Stack
  objects: Map<string, CanvasObject>  // Alle Objekte, ID → Objekt
  selection: string[]              // IDs der ausgewählten Objekte
  
  // Tools
  activeTool: ToolType             // Aktives Werkzeug
  toolOptions: ToolOptions         // Tool-spezifische Optionen
  
  // SmartRoads
  roadEditor: RoadEditorState | null  // null = Editor geschlossen
  
  // UI
  panels: PanelStates              // Collapsed/Expanded, Größen
  theme: 'light' | 'dark'
}
```

### Rendering-Pipeline

```
Zustand Store (Quelle der Wahrheit)
       │
       ├──→ react-konva Komponenten (Canvas-Rendering)
       ├──→ Inspector Panel (React-Komponenten)
       ├──→ Ebenen-Manager (React-Komponenten)
       └──→ SmartRoad Editor (React-Komponenten)
```

Alle Views lesen denselben Store. Änderungen in einem View (z.B. Objekt im Ebenen-Manager löschen) reflektieren sofort in allen anderen Views (Canvas, Inspector).

### Offline-Strategie

```
Workbox (vite-plugin-pwa)
├── Precache: Alle App-Assets (JS, CSS, HTML, SVGs, Fonts)
├── Runtime: Nichts (keine externen Requests)
└── Service Worker: Install → Activate → Serve from Cache

IndexedDB (Dexie.js)
├── Dokumente: Auto-Save-Snapshots
├── User-Presets: Gespeicherte SmartRoad-Querschnitte
├── UI-State: Panel-Positionen, Theme-Preference
└── Thumbnails: Vorschaubilder für Startansicht
```

---

*Dieses Dokument ist die verbindliche Spezifikation für die Entwicklung von 033-Skizze v1.0. Änderungen werden versioniert und hier dokumentiert.*
