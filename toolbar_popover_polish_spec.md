# Toolbar & Tool Popovers – UI Polish Spezifikation

## Ziel
Die Toolbar und die Tool-Popovers sollen visuell auf das gleiche Niveau wie der Rest der App gehoben werden.

Aktuell:
- funktional korrekt
- aber noch zu „utility / dev UI“
- zu wenig visuelle Hierarchie
- nicht vollständig konsistent mit Panels & Sidebar

Ziel:
- hochwertige Editor-Controls
- klare Hierarchie
- konsistente Design-Sprache über alle Tools

---

## 1. Toolbar – Anpassungen

### Datei
`src/components/Toolbar/Toolbar.tsx`

### Probleme
- zu kompakt
- aktive Tools zu schwach hervorgehoben
- Tool-Buttons wirken zu technisch

---

### Änderungen

#### Container
```css
padding: 12px;
```

#### Tool-Label
```css
margin-bottom: 12px;
```

#### Tool-Liste
```css
gap: 10px;
```

---

### Aktiver Tool-State

```tsx
background: 'rgba(56,189,248,0.14)',
border: '1px solid rgba(56,189,248,0.32)',
boxShadow: '0 0 0 1px rgba(56,189,248,0.06)'
```

---

## 2. Tool Buttons

### Datei
`src/index.css`

```css
.tool-btn {
  background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.028));
  border: 1px solid rgba(255,255,255,0.07);
}

.tool-btn:hover {
  background: rgba(255,255,255,0.075);
  border-color: rgba(255,255,255,0.11);
}

.tool-btn[data-active="true"] {
  background: rgba(56,189,248,0.14);
  border-color: rgba(56,189,248,0.30);
}
```

---

## 3. Tool Popover – Base Styling

### Betroffene Dateien
- `FreehandTool.tsx`
- `ShapesTool.tsx`
- `TextTool.tsx`
- `DimensionTool.tsx`

### Gemeinsame Shell

```css
width: 292px;
padding: 14px;
border-radius: 24px;

background: rgba(15,18,24,0.92);
border: 1px solid rgba(255,255,255,0.08);

box-shadow:
  0 24px 60px rgba(0,0,0,0.45),
  0 0 0 1px rgba(255,255,255,0.04);

backdrop-filter: blur(18px);
```

---

## 4. Popover Header vereinheitlichen

### Änderung in allen Tools

```tsx
style={{
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  paddingBottom: 10,
  marginBottom: 12
}}
```

### Close Button

```tsx
style={{
  width: 28,
  height: 28,
  borderRadius: 10
}}
```

---

## 5. PanelPrimitives – Anpassungen

### Datei
`src/components/ui/PanelPrimitives.tsx`

---

### PanelSection

```css
padding: 14px 14px 16px 14px;
border-bottom: 1px solid rgba(255,255,255,0.05);
```

---

### Section Titel

```css
font-size: 10px;
letter-spacing: 0.08em;
font-weight: 700;
```

---

### Slider

```css
height: 4px;
```

---

### Segmented Control

```css
padding: 4px;
border-radius: 14px;
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.05);
```

---

## 6. ShapesTool – Grid

### Datei
`ShapesTool.tsx`

```css
gap: 12px;
margin-bottom: 14px;
```

---

### Shape Cards

```css
width: 84px;
height: 84px;
border-radius: 20px;

background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.06);
```

---

### Active

```css
background: rgba(56,189,248,0.14);
border-color: rgba(56,189,248,0.28);
```

---

## 7. FreehandTool

### Anpassungen
- mehr Abstand zwischen Sections
- ColorPicker in Mini-Container

```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.05);
border-radius: 14px;
padding: 10px;
```

---

## 8. TextTool – Toggle Buttons

### Datei
`src/index.css`

```css
.toggle-btn {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  color: var(--text-muted);
}

.toggle-btn:hover {
  background: rgba(255,255,255,0.07);
}

.toggle-btn[data-active="true"] {
  background: rgba(56,189,248,0.14);
  border-color: rgba(56,189,248,0.26);
  color: var(--accent);
}
```

---

### Layout

```css
gap: 6px;
margin-bottom: 12px;
```

---

## 9. DimensionTool

### Info Block

```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.05);
border-radius: 14px;
padding: 12px;
margin-bottom: 12px;
```

---

## 10. Definition of Done

- Toolbar wirkt luftiger und klarer
- aktive Tools sind klar hervorgehoben
- Popovers wirken wie Premium Panels
- alle Tool-Panels haben gleiche Struktur
- Segmented & Toggle Controls sind konsistent
- Shapes Grid wirkt wie Tool-Auswahl, nicht wie Buttons
- gesamtes System wirkt wie ein zusammenhängender Editor

---

## 11. Kurzfassung

1. Toolbar entzerren und Active-State stärken
2. Tool Buttons hochwertiger machen
3. Popover Shell vereinheitlichen
4. Header strukturieren
5. PanelPrimitives verbessern
6. Shapes Grid luftiger machen
7. Toggle Buttons redesignen
8. Tool Panels visuell vereinheitlichen
