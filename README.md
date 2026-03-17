# 033-Skizze V2

**Professionelles Verkehrsunfallskizzen-Tool** für den polizeilichen Einsatz. Komplett neu aufgebaut als moderne Web-Applikation im Figma/Photoshop-Stil.

> Neuauflage und vollständige Überarbeitung des ursprünglichen [033-Skizze](https://github.com/choboworks/033-skizze) Projekts.

![033-Skizze](public/logo.png)

---

## Features

### Canvas & Zeichnen
- **DIN A4 Canvas** mit korrektem Seitenformat (794x1123px)
- **Freihand-Tool** mit Strichstärke, Strichart (durchgezogen/gestrichelt/gepunktet), Glättung und Farbwahl
- **9 Formen**: Rechteck, Abgerundetes Rechteck, Ellipse, Dreieck, Polygon, Stern, Linie, Pfeil, Pfad
- **Photoshop-Style Panning**: Leertaste halten + Maus ziehen
- **Zoom**: Mausrad mit Zoom-to-Pointer, Klick auf % für Reset auf 100%
- **Objekt-Manipulation**: Auswählen, Verschieben, Skalieren, Drehen via Transformer-Handles
- **Mehrfachauswahl**: Shift+Klick, gemeinsames Verschieben

### Toolbar mit Tool-Popovers
- Gruppierte Tools (Auswahl, Freihand, Formen, Text, Bemaßung)
- **Per-Tool Options-Panels**: Öffnen bei Klick, Long-Press oder Rechtsklick
- Freihand-Popover: Strichstärke, Strichart, Glättung, Farbe
- Formen-Popover: 3x3 Grid-Auswahl, Kontur, Füllung
- **Keyboard-Toggle**: Shortcut drücken öffnet Panel, nochmal drücken schließt es

### Objekt-Bibliothek (Library)
- **Slide-Out-Drawer** neben der Toolbar mit Kategorie-Tabs und Filter-Chips
- Kategorien: SmartRoads, Fahrzeuge, Infrastruktur, Verkehrsregelung, Umgebung, Markierungen
- Grid-Layout mit großen Thumbnails (SVG-Inhalte folgen in Phase 2)

### Ebenen-Manager (Photoshop-Style)
- Dynamische Objektliste – Objekte erscheinen automatisch beim Erstellen
- **Drag & Drop Sortierung** – Z-Reihenfolge per Drag ändern, Canvas spiegelt sofort
- Sichtbarkeit (Eye), Sperren (Lock), Löschen (Trash) pro Objekt
- Inline-Rename per Doppelklick
- Auto-Expand beim Hinzufügen, Auto-Collapse wenn leer
- Collapsible auf Toolbar-Breite (48px) für maximalen Canvas-Platz

### Floating Properties Manager
- **Tool-spezifische Properties** je nach Objekttyp (Freihand vs. Formen)
- Öffnet per Zahnrad-Icon im Ebenen-Manager oder **Doppelklick auf Canvas-Objekt**
- **Draggable Modal** – frei positionierbar auf dem Bildschirm
- **Custom Color Picker** mit Sättigung/Helligkeit-Fläche, Hue-Slider, Hex-Eingabe und Preset-Farben
- Design-konsistent mit Tool-Popovers (shared PanelPrimitives)

### UI & Design
- **Figma/Photoshop-inspiriertes** Dark/Light Theme
- Symmetrisches Layout: Toolbar + Library links, LayerManager rechts
- Design-Token-System mit CSS Custom Properties
- Shared UI-Primitives für konsistentes Panel-Design
- Inter Font (lokal gebundelt, kein CDN)
- PWA-ready (Offline-fähig via Workbox)

### Dokument-Management
- Editierbarer Dateiname in der TopBar
- Dokument-Properties (Aktenzeichen, Datum, Sachbearbeiter, Dienststelle) im Dropdown
- Auto-Scale-System (1:50 bis 1:1000)

---

## Tech Stack

| Bereich | Technologie |
|---------|-------------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Canvas | Konva + react-konva |
| State | Zustand + zundo (Undo/Redo) |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |

---

## Projekt-Struktur

```
src/
├── components/
│   ├── Canvas/          # Konva Canvas + Objekt-Rendering (9 Shape-Types)
│   ├── Inspector/       # Floating Properties (tool-spezifisch) + Color Picker
│   ├── LayerManager/    # Ebenen-Panel mit Drag & Drop
│   ├── Sidebar/         # Library-Drawer (Slide-Out, Grid-Layout)
│   ├── StatusBar/       # Zoom, Scale, Canvas-Info
│   ├── Toolbar/         # Tool-Gruppen + Per-Tool Popovers (FreehandTool, ShapesTool)
│   ├── TopBar/          # Header mit Logo, Dateiname, Actions
│   └── ui/              # Shared PanelPrimitives (Section, Slider, Segmented, etc.)
├── constants/
│   └── library.ts       # Library-Kategorie-Definitionen
├── hooks/
│   ├── useDrawing.ts    # Zeichen-Logik (Freehand + Shapes + Pfad-Glättung)
│   └── useKeyboard.ts   # Tastatur-Shortcuts mit Toggle-Verhalten
├── store/
│   └── index.ts         # Zustand Store mit allen Actions
├── types/
│   └── index.ts         # TypeScript Definitionen
├── utils/
│   └── scale.ts         # DIN A4 Maßstab-Berechnungen
└── assets/
    └── fonts/           # Inter Variable Font
```

---

## Tastatur-Shortcuts

| Shortcut | Aktion |
|----------|--------|
| `V` | Auswahl-Tool |
| `P` | Freihand-Tool (Pencil) |
| `O` | Formen-Tool (Objekte) |
| `T` | Text-Tool |
| `M` | Bemaßung |
| `Leertaste` (halten) | Canvas verschieben (Photoshop-Style) |
| `Delete` / `Backspace` | Ausgewählte Objekte löschen |
| `Escape` | Auswahl aufheben + Tool zurücksetzen |
| `Ctrl+0` | Ansicht zurücksetzen |
| `Ctrl+1` | Zoom 100% |

> Shortcuts togglen: Nochmal drücken schließt das Tool-Panel und wechselt zurück zur Auswahl.

---

## Setup & Entwicklung

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# TypeScript-Check + Production Build
npm run build

# ESLint
npm run lint

# Production Preview
npm run preview
```

---

## Roadmap

- [ ] **SVG-Fahrzeuge + Drag & Drop** aus Library auf Canvas
- [ ] **SmartRoads**: Parametrischer Straßengenerator (Gerade, Kurve, Kreuzung, Kreisverkehr)
- [ ] **Unfall-spezifische Tools**: Bremsspuren, Splitterfelder, Flüssigkeiten, Kollisionspunkte
- [ ] **Text-Tool**: Implementierung
- [ ] **Export**: PDF mit Druckrahmen, PNG, SVG
- [ ] **Speichern/Laden**: .033sketch Format (JSON in ZIP), Auto-Save in IndexedDB
- [ ] **Undo/Redo**: Bereits vorbereitet via zundo, UI-Anbindung ausstehend
- [ ] **Touch-Support**: Zwei-Finger Pan, Pinch Zoom

---

## Lizenz

Proprietary - choboworks

---

*Built with React, Konva, Zustand, and Tailwind CSS.*
