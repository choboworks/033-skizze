# 033-Skizze – Technische Spezifikation v2.0

## Projektübersicht

**Name:** 033-Skizze V2
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
| Framework | React 19 | Komponentenbasierte UI, riesiges Ökosystem |
| Sprache | TypeScript 5.9 (strict) | Pflicht bei der Komplexität der Datenstrukturen |
| Bundler | Vite 8 | Schneller Dev-Server, optimierte Builds |
| Canvas-Engine | Konva.js + react-konva | Deklarative React-Integration, Canvas-Performance |
| State Management | Zustand | Leichtgewichtig, kein Boilerplate |
| Undo/Redo | zundo (Zustand-Middleware) | Automatische History über State-Snapshots |
| Offline/PWA | vite-plugin-pwa + Workbox | Precaching aller App-Assets |
| Lokale DB | Dexie.js (IndexedDB) | Auto-Save, Dokumentenverwaltung |
| Dateiformat | JSZip | .033sketch als JSON-in-ZIP |
| Styling | Tailwind CSS 4 + CSS Custom Properties | Design-Tokens, Runtime Theme-Switching |
| Icons | Lucide React | Konsistente, moderne Ikonografie (einzige Icon-Library) |
| Typografie | Inter Variable (lokal gebundelt) | Open Source, professionell, nie extern geladen |
| UI-Komponenten | Custom PanelPrimitives | Eigene wiederverwendbare Panel-Bausteine (PanelSection, PanelSlider, PanelSegmented etc.) |

**Nicht verwendet:** Radix UI, Immer, externe UI-Bibliotheken.

---

## Design-Sprache

### Ästhetik: Figma-Style

Die App soll sich anfühlen wie ein professionelles Design-Tool – modern, aufgeräumt, luftig. Kein Polizei-Software-Look.

### Farbpalette

| Token | Dark Mode | Light Mode | Verwendung |
|---|---|---|---|
| `--bg` | `#1a1a1a` | `#f0f0f0` | App-Hintergrund |
| `--surface` | `#252525` | `#ffffff` | Panels, Sidebars, Popovers |
| `--surface-hover` | `#2e2e2e` | `#f5f5f5` | Hover-States |
| `--surface-active` | `#383838` | `#ebebeb` | Gedrückte/aktive States |
| `--accent` | `#4a9eff` | `#4a9eff` | Interaktive Elemente, Selektion |
| `--accent-muted` | `rgba(74,158,255,0.12)` | `rgba(74,158,255,0.08)` | Aktive Tool-Hintergründe |
| `--border` | `#2e2e2e` | `#e2e2e2` | Trennlinien, Panel-Ränder |
| `--border-subtle` | `#262626` | `#eeeeee` | Subtile Trennlinien |
| `--text` | `#f0f0f0` | `#1a1a1a` | Primärtext |
| `--text-secondary` | `#c0c0c0` | `#555555` | Sekundärtext |
| `--text-muted` | `#a0a0a0` | `#999999` | Labels, Hinweise |
| `--canvas-bg` | `#363636` | `#d5d5d5` | Viewport-Hintergrund |
| `--paper` | `#ffffff` | `#ffffff` | Canvas/Papier (immer weiß) |
| `--danger` | `#ef4444` | `#ef4444` | Löschen, Warnungen |
| `--success` | `#34d399` | `#22c55e` | Bestätigungen |
| `--warning` | `#fbbf24` | `#f59e0b` | Hinweise |

### Regeln

- Monochrom + ein Blau. Keine Farborgien.
- Hover-States dezent (Hintergrundfarbe, kein Glow).
- Dünne Borders (1px).
- Abgerundete Corners: `--radius-md: 6px` für Panels, `--radius-sm: 4px` für Buttons/Inputs, `rounded-2xl` (16px) für Popovers.
- Lucide Icons durchgehend: 18px in Toolbars, 16px in Panels, 14px inline.
- Inter als einzige Schriftart: 13px für UI, 12px für sekundäre Infos, 11px für Labels/Section-Headers.
- Animationen: CSS Keyframes mit `cubic-bezier(0.16, 1, 0.3, 1)` Easing (spring-like, Figma-Style). Klassen: `.anim-slide-left`, `.anim-slide-right`, `.anim-slide-down`, `.anim-scale-in`, `.anim-pop-in`, `.anim-fade-in`.

### Größen-Tokens

| Token | Wert | Verwendung |
|---|---|---|
| `--topbar-height` | `46px` | Top Bar Höhe |
| `--statusbar-height` | `32px` | Status Bar Höhe |
| `--toolbar-width` | `48px` | Toolbar Breite (collapsed = expanded, nur Labels/Shortcuts erscheinen) |
| `--sidebar-width` | `300px` | Library-Drawer Breite |

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo]  Dateiname ▾  │  033 SKIZZE - V.0.5  │ [✓] [◐] [?] [⚙] │
├────┬──────────────────────────────────────────────┬──────────┤
│    │                                              │          │
│ T  │                                              │  EBENEN  │
│ o  │                                              │  (48px   │
│ o  │           Canvas                             │  oder    │
│ l  │           (weißes DIN A4                     │  180px)  │
│ s  │            auf grauem Grund)                 │          │
│    │                                              │          │
│────│      ┌──────────────┐                        │          │
│ L  │      │ Floating     │                        │          │
│ i  │      │ Properties   │ (draggable)            │          │
│ b  │      └──────────────┘                        │          │
│    │                                              │          │
├────┴──────────────────────────────────┬───────────┴──────────┘
                                        │ DIN A4 · 1:200 · 100% │
                                        └────────────────────────┘
```

### Top Bar (46px)

- **Links:** Logo + editierbarer Dateiname mit Chevron-Dropdown → Dokument-Properties (Aktenzeichen, Datum, Sachbearbeiter, Dienststelle) als aufklappbares Panel
- **Mitte:** "033 SKIZZE - V.0.5" Brand-Text
- **Rechts:** Status ("Lokal gespeichert ✓" / "Offline"), Teilen, Dark/Light Toggle, Hilfe, Einstellungen
- **Keine Menüleiste** (File/Edit/View/Help) — alles über Direct Manipulation und Shortcuts

### Linke Sidebar: Toolbar + Library (48px collapsed)

Eine einzige vertikale Sidebar mit zwei Bereichen, getrennt durch Divider:

**Oberer Bereich – Werkzeuge:** 5 Tool-Gruppen (siehe Werkzeuge-Kapitel). Jede Gruppe hat ein Icon, bei expandierter Sidebar auch Label + Shortcut-Badge. Aktives Tool mit Accent-Farbe + linker Accent-Leiste hervorgehoben.

**Unterer Bereich – Bibliothek-Kategorien:** Icons für SmartRoads, Fahrzeuge, Infrastruktur, Verkehrsregelung, Umgebung, Markierungen + Suche.

**Collapsible:** Toggle-Button (PanelLeftClose/PanelLeftOpen) wechselt zwischen 48px (nur Icons) und expandiert (Icons + Labels). Collapsed = Expanded haben gleiche `--toolbar-width: 48px`, der Inhalt ändert sich (Label/Shortcut ein-/ausgeblendet).

### Library-Drawer

Absolut positioniertes Overlay neben der Toolbar (schiebt Canvas NICHT). Öffnet bei Klick auf eine Bibliothek-Kategorie. Grid-Layout (3 Spalten) mit großen Thumbnails, Filter-Chips und Kategorie-Tabs.

### Rechte Sidebar: Ebenen-Manager

Collapsible: 48px (Layers-Icon + Objekt-Count-Badge) oder 180px (volle Liste). Toggle über PanelRightClose-Button (zum Einklappen) und Layers-Icon (zum Aufklappen).

**Kein fester Inspector/Properties-Panel in der rechten Sidebar.**

### Floating Properties (Draggable Modal)

Kontextsensitives Properties-Panel als frei verschiebbares Fenster (320px breit). Öffnet per:
- Doppelklick auf Canvas-Objekt
- Zahnrad-Icon im Ebenen-Manager

Zeigt je nach Objekttyp unterschiedliche Controls (Strichstärke, Farbe, Schrift, etc.). Position merkt sich der User durch Drag.

### Statusbar (32px)

Minimale Leiste am unteren Rand:

```
DIN A4 · Maßstab: 1:200 · Zoom: 100%
```

- **DIN A4:** Dokumentformat (statisch)
- **Maßstab:** Live-Anzeige, dynamisch berechnet, **nicht editierbar**. Blinkt kurz orange wenn er eine Stufe springt.
- **Zoom:** Aktueller Zoom-Level, Klick auf % = resetView (100% + zentrieren)

---

## Canvas & Viewport

### Dokumentfläche

- DIN A4 Hochformat (210mm × 297mm, bedruckbarer Bereich 190mm × 277mm bei 10mm Rändern)
- Fester, sichtbarer Druckrahmen als weißes Rechteck
- Kein Grid, kein Raster – freier Canvas
- Eine Seite pro Dokument, keine Mehrseitigkeit
- Canvas-Pixel bei 96 DPI: 793.7px × 1122.5px

### Viewport

- Unendlicher Arbeitsbereich um das A4-Blatt herum (grauer Hintergrund)
- Pan: Mittelmaus-Drag, Space + Linksklick-Drag, Touch: Zwei-Finger-Drag
- Zoom: Scrollrad (Zoom-to-Pointer), Pinch-to-Zoom, Klick auf % in StatusBar = Reset
- Objekte können außerhalb des A4-Rahmens platziert werden (werden beim Export abgeschnitten)
- Startet bei 100% Zoom, Seite zentriert

### Druckrahmen

Am Rand des A4-Blattes, nur im Export/Druck sichtbar:

- Automatisch generierte Maßstabsleiste (z.B. `├── 5m ──┤`)
- Aktenzeichen, Datum, Sachbearbeiter, Dienststelle (aus Dokument-Properties)

---

## Maßstab-System & Koordinatensystem

### Grundprinzip: Dynamischer Auto-Maßstab

Der Maßstab wird **vollautomatisch** berechnet. Der User wählt, sieht oder konfiguriert ihn nie direkt – er erscheint nur als Info in der Statusbar. Der User arbeitet rein visuell.

### Zwei Objekt-Welten

Die App unterscheidet zwei fundamental verschiedene Objektkategorien:

| | Zeichenobjekte | Reale Objekte |
|---|---|---|
| **Beispiele** | Freihand, Rect, Ellipse, Text | SmartRoads, Fahrzeuge, Schilder, Bemaßung |
| **Koordinaten** | Page-Pixel (relativ zu A4 bei 0,0) | Meter (Realwelt-Maße) |
| **Maßstab** | Irrelevant – rein visuell/dekorativ | Bestimmt Darstellungsgröße auf Canvas |
| **Transformer** | Voller Resize + Rotate | Nur Rotate + eigene Handles (keine freie Skalierung) |
| **Skalierung** | Frei per Handles | Parametrisch (z.B. Spuren hinzufügen/entfernen, Länge ziehen) |

**Warum keine freie Skalierung bei realen Objekten?** Eine 4-spurige Straße IST 14m breit (4 × 3.5m). Der User kann sie nicht auf 20m ziehen – das ergibt physikalisch keinen Sinn. Breite = Parameteränderung (Spur dazu), Länge = Endpunkt-Handle ziehen.

### Wie reale Objekte auf den Canvas kommen

Jedes Bibliotheks-Objekt (Fahrzeug, Schild) hat im Object Registry hinterlegte **Realmaße in Metern**. Beim Platzieren:

1. `metersToPixels(realWidth, currentScale)` → Pixel-Breite auf Canvas
2. `metersToPixels(realHeight, currentScale)` → Pixel-Höhe auf Canvas
3. Objekt wird mit diesen Pixel-Maßen gerendert

Für SmartRoads:

```
User droppt "Gerade, 2 Spuren" auf Canvas
→ System: 2 × 3.5m = 7m Breite
→ User zieht Länge auf z.B. 30m
→ metersToPixels(7, 200) = 132px breit
→ metersToPixels(30, 200) = 567px lang
→ Rendering auf Canvas
```

### Auto-Maßstab-Berechnung

Wenn reale Objekte hinzugefügt, verschoben oder verändert werden:

1. Bounding Box aller realen Objekte in Metern berechnen
2. `calculateAutoScale()` findet den kleinsten gültigen Maßstab, bei dem alles auf A4 passt
3. Maßstab springt ggf. auf nächste Stufe
4. **Alle realen Objekte werden mit neuem Maßstab neu gerendert** (weniger Pixel für gleiche Meter)
5. Zeichenobjekte bleiben unverändert (Pixel-basiert)

### Gültige Maßstäbe

| Maßstab | A4-Darstellungsfläche | Typischer Anwendungsfall |
|---|---|---|
| 1:50 | 10.5m × 14.85m | Parkplatz-Rempler, Engstelle |
| 1:100 | 21m × 29.7m | Einmündung, kleiner Kreuzungsbereich |
| 1:150 | 31.5m × 44.55m | Mittlere Kreuzung |
| 1:200 | 42m × 59.4m | Standard-Kreuzung (Default) |
| 1:250 | 52.5m × 74.25m | Große Kreuzung mit Zufahrten |
| 1:500 | 105m × 148.5m | Straßenabschnitt |
| 1:1000 | 210m × 297m | Langer Streckenabschnitt |

### Umrechnungsfunktionen

```typescript
// Meter → Pixel: Bei 1:200 sind 1m = 5mm auf Papier = 18.9px bei 96dpi
function metersToPixels(meters: number, scale: ValidScale): number {
  const mmOnPaper = (1000 / scale) * meters
  return mmOnPaper * MM_TO_PX  // MM_TO_PX = 96/25.4 ≈ 3.78
}

// Pixel → Meter: Umkehrung
function pixelsToMeters(pixels: number, scale: ValidScale): number {
  const mmOnPaper = pixels / MM_TO_PX
  return mmOnPaper * (scale / 1000)
}
```

### Bemaßungstool: Mathematik

Das Bemaßungstool nutzt euklidische Distanz und `pixelsToMeters()`:

```
User klickt Punkt A → Canvas-Pixel (x1, y1)
User klickt Punkt B → Canvas-Pixel (x2, y2)

distPx = √((x2-x1)² + (y2-y1)²)
distMeters = pixelsToMeters(distPx, currentScale)

Anzeige: "6.50 m"
```

### Viewport-Zoom vs. Maßstab

- **Maßstab** (1:200): Bestimmt was 1 Pixel in der realen Welt bedeutet. Beeinflusst Größe realer Objekte. Automatisch berechnet.
- **Viewport-Zoom** (Scrollrad): Rein visuelle Vergrößerung/Verkleinerung. Ändert keine Werte. User-gesteuert.

### Was der User sieht

- Statusbar: `Maßstab: 1:200` – aktualisiert sich live, reine Anzeige, nicht editierbar
- Bemaßungstool zeigt Realmaße (Meter-Anzeige)
- Maßstabsleiste im Druckrahmen (nur auf dem gedruckten PDF)

### Was der User NICHT sieht

- Keine Meter-Eingabefelder im UI
- Keine Koordinatenanzeige
- Keine Maßstab-Auswahl oder -Konfiguration
- Keine Breiten- oder Höhenangaben bei Objekten

---

## Werkzeuge (Toolbar)

5 Werkzeug-Gruppen in der vertikalen Toolbar. Jede Gruppe hat ein Icon, ein Label und einen Keyboard-Shortcut. Tool-spezifische Optionen erscheinen als Popover neben der Toolbar (320px breit, rounded-2xl, eigenständig).

**Grundsatz:** Ein Tool ist etwas, womit man frei auf dem Canvas interagiert (klicken, ziehen, zeichnen). Ein Bibliotheks-Objekt ist etwas Vordefiniertes, das man platziert.

**Popover-Verhalten:**
- Öffnet automatisch bei Tool-Auswahl (auch via Keyboard-Shortcut)
- Long-Press oder Rechtsklick auf Tool-Icon öffnet auch das Popover
- Schließt bei Klick außerhalb
- Jedes Tool hat eigene Popover-Datei, shared Design über PanelPrimitives

**Toggle-Verhalten:** Nochmal gleichen Shortcut drücken → zurück zu Select-Tool.

```
┌────┐
│ ↖  │  Auswahl          V     (kein Popover)
├────┤
│ ✏  │  Freihand         P     (Popover: Stärke, Strichart, Glättung, Farbe)
├────┤
│ ⬜  │  Formen           O     (Popover: 3×3 Grid mit 9 Shapes + Kontur/Füllung)
├────┤
│ T  │  Text              T     (Popover: Größe, Bold/Italic/Underline, Ausrichtung, Farbe)
├────┤
│ ↔  │  Bemaßung          M     (Popover: Linienstärke, Schriftgröße, Farbe)
└────┘
```

### 1. Auswahl (V)

- Klick = Einzelauswahl
- Rahmen ziehen = Mehrfachauswahl (Marquee)
- Shift+Klick = zur Auswahl hinzufügen/entfernen
- Ctrl+A = Alles auswählen
- Drag auf Objekt = verschieben
- Anfasser an Ecken/Kanten = skalieren (nur bei Zeichenobjekten)
- Anfasser oben = rotieren
- **Shift + Rotation = 90°-Snap** (rastet auf 0°, 90°, 180°, 270°)
- Doppelklick auf SmartRoad = Editor öffnen
- Doppelklick auf Text = Text inline editieren
- Doppelklick auf anderes Objekt = Properties-Panel öffnen
- Delete/Backspace = Löschen
- Pan via Space (gehalten) + Drag oder Mittelmaus-Drag

### 2. Freihand (P)

- Drag = freies Zeichnen
- Bei mouseUp: Pfad-Vereinfachung via Ramer-Douglas-Peucker Algorithmus
- Konva `Line` mit `tension` Parameter für Glättung
- Nach Zeichnen: Auto-Switch zu Select, Objekt selektiert
- Zu kurze Pfade (< 6 Punkte) werden verworfen

**Popover-Optionen:**
- Strichstärke (1-10px, Slider)
- Strichart (Durchgezogen / Striche / Punkte, Segmented Control)
- Glättung (0-100%, Slider)
- Strichfarbe (ColorPicker)

### 3. Formen (O)

9 Shapes im 3×3 Grid-Popover:

| Rechteck | Abgerundet | Ellipse |
|---|---|---|
| **Dreieck** | **Polygon** | **Stern** |
| **Linie** | **Pfeil** | **Pfad** |

- Klick+Drag auf Canvas erstellt Shape
- **Shift + Zeichnen (Linie/Pfeil) = 45°-Snap** (rastet auf 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
- Nach Zeichnen: Auto-Switch zu Select, Objekt selektiert
- Zu kleine Objekte (< 3px) werden verworfen

**Shape-Details:**
- **Abgerundetes Rechteck:** cornerRadius 12px
- **Dreieck + Polygon:** Konva RegularPolygon (3 bzw. 6 Seiten)
- **Stern:** Konva Star (5 Zacken, innerRadius 0.4)
- **Pfeil:** Konva Arrow mit dynamischer Pfeilspitze
- **Füllung:** Nur bei geschlossenen Formen (nicht bei Linie/Pfeil/Pfad)

**Popover-Optionen:**
- Shape-Auswahl (3×3 Grid mit Icons)
- Konturstärke (0-10px, Slider)
- Konturart (Durchgezogen / Striche / Punkte)
- Konturfarbe (ColorPicker)
- Füllfarbe (ColorPicker, nur bei geschlossenen Formen)

### 4. Text (T)

- Klick auf Canvas = Textbox erstellen, sofort tippen (Inline-Editor)
- Enter = Zeilenumbruch, Escape/Klick außerhalb = bestätigen
- Feste Schriftart (Inter) – keine Schriftwahl
- Transformer: Proportionale Skalierung (ändert fontSize, nicht Bounding Box)
- Ebenen-Name passt sich automatisch dem Text an (Photoshop-Style)

**Popover-Optionen:**
- Schriftgröße (6-72px, Slider)
- Stil: Bold, Italic, Underline (Toggle-Buttons)
- Ausrichtung: Links, Mitte, Rechts
- Textfarbe (ColorPicker)
- Hintergrundfarbe (ColorPicker)

### 5. Bemaßung (M)

- Zwei-Klick-Tool: Erster Klick = Startpunkt, Zweiter Klick = Endpunkt
- **Shift + Zeichnen = 45°-Snap** (wie bei Linie/Pfeil)
- Erstellt DIN-Style Bemaßungslinie: Pfeilspitzen an beiden Enden, Verlängerungsstriche senkrecht, Maßzahl zentriert über der Linie
- Distanz wird automatisch in Metern berechnet via `pixelsToMeters()`
- Vorschau: Gestrichelte Linie + Kreise an Start/Endpunkt während des Zeichnens
- Nach Erstellen: Auto-Switch zu Select

**Popover-Optionen:**
- Linienstärke (1-5px, Slider)
- Schriftgröße (10-36px, Slider)
- Linienfarbe (ColorPicker)

---

## Objektbibliothek

### Aufbau

Unterer Bereich der linken Toolbar. Collapsed: nur Kategorie-Icons. Klick auf Kategorie öffnet Library-Drawer als absolut positioniertes Overlay (schiebt Canvas nicht).

Library-Drawer: Grid-Layout (3 Spalten) mit großen Thumbnails, Filter-Chips und Kategorie-Tabs. 300px breit.

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

Jedes Fahrzeug: SVG-Draufsicht, einfärbbar über benannte SVG-IDs, maßstabsgetreu. **Nicht frei skalierbar** – Realmaße sind fix (z.B. VW Golf = 4.28m × 1.79m).

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

- Bremsspuren (vordefinierte Varianten + parametrisch: Start-/Endbreite, Verlauf, Typ)
- Splitterfelder (Polygon mit genormter Schraffur)
- Flüssigkeiten (Öl, Kraftstoff, Kühlwasser – je eigene Schraffur/Füllung)
- Kollisionspunkt (genormtes Symbol)
- Endlage-Marker (genormtes Symbol)
- Bewegungslinien / Fahrtrichtungspfeile (gekurvte Pfeile entlang Pfad)
- Nummerierungs-Labels (kreisförmig: ①②③)
- Himmelsrichtungs-Pfeil (N-Pfeil)
- Foto-Standort-Marker (Kamera-Icon mit Blickrichtung)

### Drag & Drop

Objekte werden per Drag aus der Bibliothek auf den Canvas gezogen. Beim Droppen werden sie mit korrekten Realmaßen platziert (über `metersToPixels()` basierend auf aktuellem Auto-Maßstab). Das Objekt erscheint zentriert unter dem Cursor.

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
  scalable: false                   // Reale Objekte sind NICHT frei skalierbar

  // Optionale Andockpunkte (für Snapping)
  snapPoints?: SnapPoint[]
}
```

### Einfärbung

SVGs haben benannte IDs (z.B. `body`, `body-2`, `body-3`) für die Karosserie. Das Registry definiert welche IDs die Farbziele sind. Beim Einfärben wird per Style-Attribut die Fill-Farbe auf diesen Elementen gesetzt.

Vordefinierte Farbchips im Properties-Panel: Weiß, Schwarz, Silber, Rot, Blau, Grün, Gelb + Custom Color Picker.

---

## SmartRoads – Parametrischer Straßengenerator

### Philosophie

SmartRoads ist das Alleinstellungsmerkmal der App. Ein parametrischer Generator für Straßensegmente, basierend auf RASt-Defaultwerten (Richtlinien für die Anlage von Stadtstraßen), aber ohne Konformitätszwang. Der User hat maximale Freiheit.

RASt dient ausschließlich als Quelle für sinnvolle Standardwerte (Fahrstreifenbreiten, Gehwegbreiten etc.). Keine Validierung, keine Warnungen, keine Einschränkungen.

### Interaktion auf dem Canvas

SmartRoad-Objekte verhalten sich anders als Zeichenobjekte:
- **Keine freie Skalierung** über Transformer-Handles
- **Breite:** Nur über Parameter änderbar (Spuren hinzufügen/entfernen)
- **Länge:** Über eigene Endpunkt-Handles (nicht den Standard-Transformer)
- **Rotation:** Erlaubt (Shift = 90°-Snap)
- **Verschieben:** Normal per Drag

### Verfügbare Segment-Typen

In der Objektbibliothek unter "SmartRoads":

- **Gerade** – Standardstraßenabschnitt
- **Kurve** – Gebogenes Segment mit Radius
- **Kreuzung** – Knotenpunkt (Template-basiert)
- **Kreisverkehr** – Parametrischer Kreisverkehr

### Workflow

```
1. User zieht "Gerade" aus Library auf Canvas
   → Default: 2 Spuren (7m breit), Gehweg beidseitig
   → Maßstab berechnet sich automatisch
   → Sofort nutzbar

2. User stellt "4 Spuren" ein
   → System: 4 × 3.5m = 14m breit
   → Maßstab passt sich ggf. an

3. User zieht Länge über Endpunkt-Handle
   → z.B. 40m lang
   → Maßstab springt ggf. auf nächste Stufe

4. User fügt zweite Straße hinzu → Kreuzung wird größer
   → Maßstab springt ggf. auf 1:500

5. Optional: Doppelklick auf platziertes Segment
   → SmartRoad Editor öffnet sich als Overlay
   → User passt Querschnitt an
   → "Übernehmen" aktualisiert das Segment
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
- Klick auf Element: Schublade links klappt auf mit Optionen dieses Elements vorgeladen
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

## Ebenen-Manager

### Aufbau

Rechte Sidebar. Collapsible: 48px (Layers-Icon + Count-Badge) oder 180px (volle Liste).

### Kein Layer-System — Flache Objektliste

**Bewusste Entscheidung:** Es gibt KEINE vorgefertigten Layer-Kategorien (Straßen, Fahrzeuge etc.). Jedes Objekt auf dem Canvas ist ein eigener Eintrag im Ebenen-Manager. Die Liste startet leer.

### Pro Objekt

- **Typ-Icon:** Passt zum Objekttyp (Square, Circle, Pencil, Type, Ruler, etc.)
- **Name:** Auto-generiert oder custom. Bei Text: passt sich dem Inhalt an (Photoshop-Style)
- **Sichtbarkeit:** Auge-Icon – Toggle
- **Sperrung:** Schloss-Icon – Toggle
- **Farbdot:** Zeigt Strokefarbe des Objekts
- **Properties:** Zahnrad-Icon → öffnet Floating Properties

### Interaktion

- **Drag & Drop:** Z-Order per GripVertical Handle ändern (blaue Drop-Indicator-Linie)
- **Klick:** Selektiert Objekt auf Canvas
- **Shift+Klick:** Multi-Select
- **Doppelklick auf Name:** Inline-Rename
- **Auto-Expand:** Klappt auf wenn neues Objekt hinzugefügt wird
- **Auto-Collapse:** Klappt zu wenn letztes Objekt gelöscht wird

### `objectOrder` Array

Im Store bestimmt `objectOrder: string[]` die Zeichenreihenfolge (Index 0 = unten, letzter = oben). Der Ebenen-Manager zeigt die umgekehrte Reihenfolge (oben = vorne).

---

## Floating Properties Panel

### Kontextsensitives Verhalten

Draggable Modal (320px, GripHorizontal Titlebar). Zeigt unterschiedliche Controls je nach Objekttyp:

### Freehand → Strich-Properties
- Strichstärke (Slider)
- Strichart (Segmented: Linie/Striche/Punkte)
- Glättung (Slider)
- Strichfarbe (ColorPicker)
- Deckkraft (Slider)

### Geschlossene Shapes (Rect, Ellipse, etc.) → Kontur + Füllung
- Konturstärke (Slider)
- Konturart (Segmented)
- Konturfarbe (ColorPicker)
- Füllfarbe (ColorPicker)
- Deckkraft (Slider)

### Offene Shapes (Linie, Pfeil, Pfad) → Nur Kontur
- Konturstärke (Slider)
- Konturart (Segmented)
- Konturfarbe (ColorPicker)
- Deckkraft (Slider)

### Text → Schrift-Properties
- Schriftgröße (Slider)
- Stil: Bold, Italic, Underline
- Ausrichtung: Links, Mitte, Rechts
- Textfarbe (ColorPicker)
- Hintergrundfarbe (ColorPicker)
- Deckkraft (Slider)

### Bemaßung → Darstellungs-Properties
- Linienstärke (Slider)
- Schriftgröße (Slider)
- Linienfarbe (ColorPicker)
- Deckkraft (Slider)

### Alle Objekttypen
- Bezeichnung (Text-Input, oben im Panel)
- Deckkraft (Slider, unten im Panel)

---

## Undo/Redo & History

### Implementierung

Über Zustand-Snapshots via zundo (Zustand-Middleware). State wird partialize'd – viewport, panels, theme etc. ausgeschlossen.

### Verhalten

- **Ctrl+Z:** Undo
- **Ctrl+Shift+Z / Ctrl+Y:** Redo
- Unbegrenzt (bis Memory-Limit, älteste States fallen raus)
- Alle Aktionen sind rückgängig machbar: Platzieren, Löschen, Verschieben, Rotieren, Farbänderungen, SmartRoad-Änderungen

---

## Datei & Export

### Dateiformat: `.033sketch`

Internes Format: JSON in ZIP (via JSZip).

**Struktur:**
```
dokument.033sketch (ZIP)
├── document.json       → Canvas-State, Dokument-Metadaten
├── layers.json         → Objektliste mit Reihenfolge
├── roads.json          → SmartRoad-Definitionen (parametrisch)
├── history.json        → Undo-History (optional, konfigurierbar)
└── assets/             → Eingebettete Bilder/Custom-SVGs
```

### Auto-Save

- Alle 30 Sekunden automatisch in IndexedDB (via Dexie.js)
- Kein Datenverlust bei Browser-Crash oder versehentlichem Schließen
- Statusanzeige in der Top Bar: "Lokal gespeichert ✓" / "Offline"

### Manuelles Speichern & Laden

- **File System Access API** (Chrome/Edge): Natives Save/Open-Verhalten
- **Fallback:** Download als .033sketch / Upload via Datei-Dialog
- **Ctrl+S:** Speichern
- **Ctrl+Shift+S:** Speichern unter

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

| Shortcut | Aktion |
|---|---|
| V | Auswahl-Tool |
| P | Freihand (Pencil) |
| O | Formen (Objects) |
| T | Text-Tool |
| M | Bemaßung (Measure) |
| Space (halten) | Pan (Hand) |
| Shift + Rotation | 90°-Snap (0°, 90°, 180°, 270°) |
| Shift + Linie/Pfeil/Bemaßung | 45°-Snap beim Zeichnen |
| Delete / Backspace | Ausgewähltes löschen |
| Escape | Tool-Popover schließen / Properties schließen |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+A | Alles auswählen |
| Ctrl+S | Speichern |

**Toggle-Verhalten:** Gleichen Shortcut nochmal drücken → zurück zu Auswahl (V).

### Snapping

- An Objekte (Kanten, Mittelpunkte)
- An Konnektoren (SmartRoad-Enden)
- Snapping global ein/aus schaltbar

### Clipboard

- Copy/Cut/Paste von Objekten (Ctrl+C/X/V)
- Intern als JSON → funktioniert auch zwischen Dokumenten

### Touch-Support

Grundlegende Bedienbarkeit auf Tablets (iPad, Surface):
- Pan: Zwei-Finger-Drag
- Zoom: Pinch
- Auswahl: Tap
- Verschieben: Long-Press + Drag

### Dark/Light Mode

- Toggle über Icon in der Top Bar (Sun/Moon)
- Systemeinstellung als Default
- Canvas/Papier bleibt immer weiß

### Lokalisierung

- Deutsch als Primärsprache (UI-Labels, Tooltips)
- Englisch als Code-Sprache (Variablen, Kommentare)

---

## Entwicklungsphasen

### Phase 1: Foundation ✅

- Projekt-Setup (Vite + React 19 + TypeScript + Zustand + Konva)
- Canvas mit DIN-A4-Rahmen, Pan & Zoom (Spacebar-Pan, Mittelmaus-Pan, Scroll-Zoom)
- Layout: TopBar, Toolbar, Canvas, LayerManager, StatusBar
- Dark/Light Mode mit CSS Custom Properties
- Dokument-Properties (Aktenzeichen, Datum, Sachbearbeiter, Dienststelle)

### Phase 2: Zeichenwerkzeuge ✅

- Toolbar: 5 Tool-Gruppen mit Popovers (Freihand, Formen, Text, Bemaßung)
- Freihand mit Pfad-Glättung (Ramer-Douglas-Peucker)
- 9 Formen (Rect, Rounded-Rect, Ellipse, Triangle, Polygon, Star, Line, Arrow, Path)
- Text-Tool mit Inline-Editor (Bold, Italic, Underline, Ausrichtung)
- Bemaßung mit Zwei-Klick-Muster und Meter-Anzeige
- Shift-constrained Drawing (45° für Linien, 90° für Rotation)
- Shared PanelPrimitives für konsistentes Popover-Design
- Ebenen-Manager mit Drag&Drop Z-Order, Auto-Expand/Collapse
- Floating Properties (draggable, typ-spezifisch)
- Custom ColorPicker (HSV, Presets, Hex-Input)
- Animationen (CSS Keyframes, Figma-Style Easing)

### Phase 3: SmartRoads — Gerade Straße (MVP) ← NÄCHSTE SESSION

Das Herzstück der App. Wir starten mit dem minimal funktionsfähigen Straßensegment und bauen darauf auf.

#### 3a: Datenmodell & Typen

- `SmartRoadSegment` Typ definieren (eigener Typ, nicht CanvasObject):
  ```typescript
  interface RoadLane {
    id: string
    type: 'lane' | 'sidewalk' | 'bike' | 'parking' | 'green' | 'median'
    direction?: 'forward' | 'backward'  // Fahrtrichtung
    widthMeters: number                  // Realbreite in Metern
    variant?: string                     // z.B. 'protected', 'striped', 'curb'
  }

  interface SmartRoadSegment {
    id: string
    type: 'straight'  // später: 'curve' | 'intersection' | 'roundabout'
    // Position & Orientierung auf Canvas
    x: number          // Meter (Weltkoordinaten)
    y: number          // Meter (Weltkoordinaten)
    rotation: number   // Grad
    lengthMeters: number  // Gesamtlänge
    // Querschnitt (von links nach rechts, Draufsicht in Fahrtrichtung)
    lanes: RoadLane[]
    // Berechnet
    totalWidthMeters: number  // Summe aller lane.widthMeters
    // Markierungen (Phase 4)
    markings?: RoadMarking[]
    // State
    visible: boolean
    locked: boolean
    label: string
  }
  ```
- `SmartRoadSegment` im Store neben `objects` als eigene Collection (`roads: Record<string, SmartRoadSegment>`, `roadOrder: string[]`)
- Getrennt von `CanvasObject`, weil fundamental anderes Verhalten (Meter-basiert, parametrisch, kein freier Resize)

#### 3b: Rendering — Gerade Straße auf Canvas

- Neue Komponente `SmartRoadRenderer.tsx` (analog zu `CanvasObjects.tsx`)
- Rendering via Konva `Group` + `Rect` pro Spur:
  - Fahrbahn: dunkelgrau (`#555`)
  - Gehweg: hellgrau (`#bbb`)
  - Radweg: optional rot getönt
  - Grünstreifen: grün
  - Leitlinie (Mittellinie): weiße gestrichelte Linie zwischen Gegenrichtungs-Spuren
  - Fahrstreifenbegrenzung: durchgezogene weiße Linie an Außenkanten
- Pixel-Berechnung: `metersToPixels(lane.widthMeters, currentScale)` pro Spur
- Straße wird als rotierbare Group gerendert, Position = `metersToPixels(x/y)`
- **Kein Konva Transformer** für Resize — eigene Endpunkt-Handles für Längenänderung

#### 3c: Dynamischer Auto-Maßstab

- Neue Store-Action: `recalculateScale()` — wird aufgerufen wenn:
  - Road hinzugefügt/entfernt wird
  - Road-Länge oder Querschnitt sich ändert
  - Road verschoben wird
- Berechnung: Bounding Box aller Roads in Metern → `calculateAutoScale()` → Store-Update
- Wenn Maßstab springt: Alle Roads neu rendern (neue Pixel-Größen)
- Zeichenobjekte (Freihand, Shapes etc.) bleiben unverändert — Pixel-basiert
- StatusBar zeigt neuen Maßstab, kurzes oranges Aufblinken bei Sprung

#### 3d: Library-Integration — Straße droppen

- "Gerade" als erstes echtes Objekt in der SmartRoads-Kategorie der Library
- Drag & Drop auf Canvas → Default-Straße erstellen:
  - 2 Fahrstreifen (je 3.25m, Gegenrichtung) + Gehweg beidseitig (je 2.50m)
  - Gesamtbreite: 11.50m
  - Default-Länge: 30m
  - Zentriert unter Cursor
- Nach Drop: Objekt selektiert, Properties-Panel öffnet

#### 3e: Interaktion auf Canvas

- **Selektieren:** Klick auf Straße = selektieren (blauer Rahmen)
- **Verschieben:** Drag = Straße verschieben → `recalculateScale()`
- **Rotieren:** Rotation-Handle des Transformers (Shift = 90°-Snap), KEIN Resize via Handles
- **Länge ändern:** Zwei kreisförmige Endpunkt-Handles an den kurzen Seiten der Straße. Drag = Länge ändern (in Metern, snapped ggf.)
- **KEIN freier Resize:** Transformer-Anchors deaktiviert für SmartRoad-Objekte
- **Doppelklick:** Öffnet SmartRoad Editor (Phase 4) — vorerst: öffnet Quick-Properties

#### 3f: Quick-Properties für Straße (im Floating Panel)

- Bezeichnung (Input)
- **Spuren: [−] 2 [+]** — Fahrstreifen hinzufügen/entfernen
- **Gehweg: [L] [Beide] [R] [—]** — Gehweg-Konfiguration
- **Länge:** Anzeige in Metern (read-only, Änderung per Canvas-Handle)
- **Breite:** Anzeige in Metern (read-only, Änderung per Spuranzahl)
- Deckkraft (Slider)

#### 3g: Ebenen-Manager Integration

- SmartRoad-Objekte erscheinen im Ebenen-Manager wie andere Objekte
- Eigenes Icon (Road/Highway Icon aus Lucide)
- Name: "Straße 1", "Straße 2" etc. (oder custom Label)
- Sichtbarkeit, Sperrung, Drag&Drop Z-Order — alles wie bei Zeichenobjekten

#### Architektur-Entscheidungen für Phase 3

1. **Getrennte Collections:** `roads` + `roadOrder` im Store, getrennt von `objects` + `objectOrder`. Grund: SmartRoads haben fundamental anderes Datenmodell, Rendering und Interaktion.
2. **Meter als Quelle der Wahrheit:** Road-Dimensionen in Metern gespeichert. Pixel-Werte werden bei jedem Render berechnet via `metersToPixels()`.
3. **Querschnitt = Array von Spuren:** Von links nach rechts (Draufsicht in Fahrtrichtung). Einfach erweiterbar um neue Spurtypen.
4. **Rendering via Konva Shapes (nicht SVG):** Direkte Konva Rects/Lines sind performanter und einfacher zu parametrisieren als SVG-Generierung. SVG kommt erst beim Export.
5. **Scale-Trigger:** Jede Mutation an `roads` löst `recalculateScale()` aus. Debounced bei Drag-Operationen.

### Phase 4: SmartRoads — Editor & erweiterte Segmente

- SmartRoad Editor UI (Overlay, Element-Palette, Live-Vorschau, Quick Settings)
- Erweiterte Spurtypen (Radweg, Parkstreifen, Busstreifen, Grünstreifen, Mittelstreifen)
- Straßenmarkierungen (Leitlinie, Haltelinie, Zebrastreifen, Richtungspfeile)
- Kurven (Radius, Winkel, Drag-Handles)
- Kreuzungen (Template-System, Arm-Konfiguration)
- Kreisverkehr (Parametrisch, Zufahrten)
- Snapping/Konnektoren zwischen Segmenten
- Preset-System (System-Presets + User-Presets)

### Phase 5: Objekte & Library

- SVG-Preprocessing-Pipeline (SVGO, Normalisierung)
- Object Registry + Manifest für alle Objekte (Fahrzeuge, Schilder, etc.)
- Objektbibliothek: Drag & Drop aus Library auf Canvas
- Maßstabsgerechte Platzierung (metersToPixels, nicht frei skalierbar)
- Objekt-Einfärbung
- Undo/Redo UI-Anbindung (zundo ist ready)
- Snapping-System (Objekt-an-Objekt, Objekt-an-Road)

### Phase 6: Polish & Export

- PDF-Export mit Druckrahmen (Maßstabsleiste, Metadaten)
- PDF/A-1b für elektronische Akte
- PNG/SVG-Export
- Dateiformat (.033sketch) Save/Load
- Auto-Save (IndexedDB, Dexie.js)
- Startansicht (zuletzt geöffnet, Vorlagen)
- Keyboard Shortcuts komplett (Copy/Paste, Gruppieren etc.)
- Touch-Support
- Vorlagen-System

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
  canvasSize: { width; height }    // Container-Größe für resetView

  // Zeichenobjekte (Pixel-basiert, flach, keine Layer-Gruppierung)
  objects: Record<string, CanvasObject>  // Alle Objekte, ID → Objekt
  objectOrder: string[]            // Z-Order (Index 0 = unten, letzter = oben)
  selection: string[]              // IDs der ausgewählten Objekte

  // SmartRoads (Meter-basiert, parametrisch, eigene Collection)
  roads: Record<string, SmartRoadSegment>
  roadOrder: string[]              // Z-Order für Roads

  // Tools
  activeTool: ToolType             // Aktives Werkzeug
  toolOptions: ToolOptions         // Tool-spezifische Optionen

  // SmartRoads
  roadEditor: RoadEditorState | null  // null = Editor geschlossen

  // UI
  panels: PanelStates              // Collapsed/Expanded, Breiten
  theme: 'light' | 'dark'
  propertiesPanelId: string | null // Welches Objekt zeigt Properties
  activeLibraryCategory: string | null
  editingTextId: string | null     // Inline Text-Editor
}
```

### Rendering-Pipeline

```
Zustand Store (Quelle der Wahrheit)
       │
       ├──→ react-konva Komponenten (Canvas-Rendering via CanvasObjects.tsx)
       ├──→ Floating Properties (React-Komponenten)
       ├──→ Ebenen-Manager (React-Komponenten)
       ├──→ Toolbar + Popovers (React-Komponenten)
       └──→ SmartRoad Editor (React-Komponenten, Phase 4)
```

### Offline-Strategie

```
Workbox (vite-plugin-pwa)
├── Precache: Alle App-Assets (JS, CSS, HTML, SVGs, Fonts)
├── Runtime: Nichts (keine externen Requests)
└── Service Worker: Install → Activate → Serve from Cache

IndexedDB (Dexie.js)
├── Dokumente: Auto-Save-Snapshots
├── User-Presets: Gespeicherte SmartRoad-Querschnitte
├── UI-State: Theme-Preference
└── Thumbnails: Vorschaubilder für Startansicht
```

---

*Dieses Dokument ist die verbindliche Spezifikation für die Entwicklung von 033-Skizze V2. Zuletzt aktualisiert: 2026-03-18 (Session 3).*
