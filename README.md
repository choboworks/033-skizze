# 033-Skizze V2

**Professionelles Verkehrsunfallskizzen-Tool** für den polizeilichen Einsatz. Komplett neu aufgebaut als moderne Web-Applikation im Figma/Photoshop-Stil.

> Neuauflage und vollständige Überarbeitung des ursprünglichen [033-Skizze](https://github.com/choboworks/033-skizze) Projekts.

![033-Skizze](public/logo.png)

---

## Features

### Canvas & Zeichnen
- **DIN A4 Canvas** mit korrektem Seitenformat (794x1123px)
- **Zeichen-Tools**: Rechteck (R), Ellipse (O), Linie (L) per Klick+Drag
- **Photoshop-Style Panning**: Leertaste halten + Maus ziehen
- **Zoom**: Mausrad mit Zoom-to-Pointer, Klick auf % für Reset auf 100%
- **Objekt-Manipulation**: Auswählen, Verschieben, Skalieren, Drehen via Transformer-Handles
- **Mehrfachauswahl**: Shift+Klick, gemeinsames Verschieben

### Ebenen-Manager (Photoshop-Style)
- Dynamische Objektliste - Objekte erscheinen automatisch beim Erstellen
- **Drag & Drop Sortierung** - Z-Reihenfolge per Drag ändern, Canvas spiegelt sofort
- Sichtbarkeit (Eye), Sperren (Lock), Löschen (Trash) pro Objekt
- Inline-Rename per Doppelklick
- Auto-Expand beim Hinzufügen, Auto-Collapse wenn leer
- Collapsible auf Toolbar-Breite (48px) für maximalen Canvas-Platz

### Floating Properties Manager
- Öffnet per Zahnrad-Icon im Ebenen-Manager
- **Draggable Modal** - frei positionierbar auf dem Bildschirm
- Bezeichnung, Deckkraft (Slider), Kontur (Farbe + Breite), Füllung
- **Custom Color Picker** mit Sättigung/Helligkeit-Fläche, Hue-Slider, Hex-Eingabe und Preset-Farben

### UI & Design
- **Figma/Photoshop-inspiriertes** Dark/Light Theme
- Responsive Sidebar-Layout mit collapsierbaren Panels
- Design-Token-System mit CSS Custom Properties
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
| UI Components | Radix UI Primitives |
| Icons | Lucide React |
| Storage | Dexie (IndexedDB) |
| PWA | vite-plugin-pwa (Workbox) |

---

## Projekt-Struktur

```
src/
├── components/
│   ├── Canvas/          # Konva Canvas + Objekt-Rendering
│   ├── Inspector/       # Floating Properties + Color Picker
│   ├── LayerManager/    # Ebenen-Panel mit Drag & Drop
│   ├── Sidebar/         # Objekt-Bibliothek (Platzhalter)
│   ├── StatusBar/       # Zoom, Scale, Canvas-Info
│   ├── Toolbar/         # Vertikale Werkzeugleiste
│   └── TopBar/          # Header mit Logo, Dateiname, Actions
├── hooks/
│   ├── useDrawing.ts    # Zeichen-Logik (Klick+Drag)
│   └── useKeyboard.ts   # Tastatur-Shortcuts
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
| `H` | Hand-Tool |
| `R` | Rechteck zeichnen |
| `O` | Ellipse zeichnen |
| `L` | Linie zeichnen |
| `T` | Text-Tool |
| `M` | Bemaßung |
| `Leertaste` (halten) | Canvas verschieben (Photoshop-Style) |
| `Delete` / `Backspace` | Ausgewählte Objekte löschen |
| `Escape` | Auswahl aufheben |
| `Ctrl+0` | Ansicht zurücksetzen |
| `Ctrl+1` | Zoom 100% |

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

- [ ] **Objekt-Bibliothek**: SVG-Fahrzeuge, Verkehrszeichen, Infrastruktur per Drag & Drop
- [ ] **SmartRoads**: Parametrischer Straßengenerator (Gerade, Kurve, Kreuzung, Kreisverkehr)
- [ ] **Unfall-spezifische Tools**: Bremsspuren, Splitterfelder, Flüssigkeiten, Kollisionspunkte
- [ ] **Export**: PDF mit Druckrahmen, PNG, SVG
- [ ] **Speichern/Laden**: .033sketch Format (JSON in ZIP), Auto-Save in IndexedDB
- [ ] **Undo/Redo**: Bereits vorbereitet via zundo, UI-Anbindung ausstehend
- [ ] **Touch-Support**: Zwei-Finger Pan, Pinch Zoom

---

## Lizenz

Proprietary - choboworks

---

*Built with React, Konva, Zustand, and Tailwind CSS.*
