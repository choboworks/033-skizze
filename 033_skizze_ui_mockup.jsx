import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  CircleDot,
  Copy,
  FileText,
  Grid3X3,
  Layers3,
  Library,
  Lock,
  MousePointer2,
  Move,
  Pencil,
  Ruler,
  Search,
  Settings2,
  Shapes,
  Square,
  Type,
  Undo2,
  Eye,
  ZoomIn,
  Download,
  Save,
  PanelRightOpen,
  Route,
  ChevronRight,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const tools = [
  { id: "select", label: "Auswahl", key: "V", icon: MousePointer2 },
  { id: "freehand", label: "Freihand", key: "P", icon: Pencil },
  { id: "shapes", label: "Formen", key: "O", icon: Shapes },
  { id: "text", label: "Text", key: "T", icon: Type },
  { id: "measure", label: "Bemaßung", key: "M", icon: Ruler },
  { id: "crop", label: "Ausschnitt", key: "A", icon: Square },
];

// 🔧 Base Tool Panel Config (anpassbar pro Tool)
type ToolPanelGroup =
  | { type: "slider"; label: string; key: string; min: number; max: number; step: number; default: number }
  | { type: "switch"; label: string; key: string; default: boolean }
  | { type: "color"; label: string; key: string; colors: string[] };

type ToolPanelConfig = {
  title: string;
  groups: ToolPanelGroup[];
};

const toolPanels: Partial<Record<string, ToolPanelConfig>> = {
  freehand: {
    title: "Freihand Optionen",
    groups: [
      { type: "slider", label: "Stärke", key: "size", min: 1, max: 10, step: 1, default: 4 },
      { type: "switch", label: "Glättung", key: "smooth", default: true },
      { type: "color", label: "Farbe", key: "color", colors: ["#ffffff", "#3b82f6", "#22c55e", "#ef4444"] },
    ],
  },
};

// 🧩 Generic Tool Context Bar Renderer
function ToolContextBar({ config }: { config?: ToolPanelConfig }) {
  if (!config) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-xs text-white/60">{config.title}</span>
      <Separator orientation="vertical" className="h-5 bg-white/10" />

      {config.groups.map((g: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-white/50">{g.label}</span>

          {g.type === 'slider' && (
            <div className="w-[120px]"><Slider defaultValue={[g.default]} max={g.max} min={g.min} step={g.step} /></div>
          )}

          {g.type === 'switch' && (
            <Switch defaultChecked={g.default} />
          )}

          {g.type === 'color' && (
            <div className="flex gap-1">
              {g.colors.map((c: string) => (
                <div key={c} className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const libraryItems = [
  { title: "Gerade Straße", meta: "SmartRoads · Preset", icon: Route },
  { title: "Kreuzung", meta: "SmartRoads · geplant", icon: Grid3X3 },
  { title: "PKW", meta: "Fahrzeuge", icon: Car },
  { title: "Verkehrszeichen", meta: "Verkehrsregelung", icon: CircleDot },
  { title: "Gebäude", meta: "Infrastruktur", icon: Copy },
  { title: "Bremsspur", meta: "Markierungen", icon: Move },
];

const layers = [
  { name: "SmartRoad – Erschließungsstraße", type: "SmartRoad", locked: false, visible: true },
  { name: "PKW 01", type: "Fahrzeug", locked: false, visible: true },
  { name: "PKW 02", type: "Fahrzeug", locked: false, visible: true },
  { name: "Bemaßung 6.4m", type: "Maß", locked: false, visible: true },
  { name: "Text – Unfallort", type: "Text", locked: false, visible: true },
];

const scaleSteps = ["1:10", "1:25", "1:50", "1:100", "1:250", "1:500", "1:1000"];

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold tracking-wide text-white/90">{title}</CardTitle>
          {right}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CanvasObject({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`absolute rounded-2xl border border-sky-400/30 bg-sky-400/10 shadow-[0_0_0_1px_rgba(56,189,248,0.08),0_10px_30px_rgba(2,132,199,0.12)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function SketchAppMockup() {
  const [activeTool, setActiveTool] = useState("select");
  const [zoom] = useState(125);
  const [showGrid, setShowGrid] = useState(true);
  const [snap, setSnap] = useState(true);
  const [activeTab, setActiveTab] = useState("library");
    const activeToolObj = useMemo(() => tools.find((t) => t.id === activeTool), [activeTool]);
  const activeToolPanel = toolPanels[activeTool];

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_25%)]" />
        <div className="relative flex min-h-screen flex-col p-4 lg:p-5">
          <header className="mb-4 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-lg shadow-sky-950/50">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white/95">033-Skizze V2</div>
                <div className="text-xs text-white/50">Verkehrsunfallskizzen-Tool · offline-first</div>
              </div>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <Badge className="rounded-full border-0 bg-sky-500/15 px-3 py-1 text-sky-300">Dokument: Unfallskizze_2026-03-20</Badge>
              <Badge className="rounded-full border-0 bg-emerald-500/15 px-3 py-1 text-emerald-300">Maßstab automatisch</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Undo2 className="mr-2 h-4 w-4" />
                Undo
              </Button>
              <Button variant="secondary" className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button className="rounded-2xl bg-sky-500 text-black hover:bg-sky-400">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </header>

          <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[92px_minmax(0,1fr)_390px]">
            <aside className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between px-1 pt-1">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">Tools</span>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl text-white/60 hover:bg-white/10 hover:text-white">
                  <PanelRightOpen className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <motion.button
                      key={tool.id}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTool(tool.id)}
                      className={`group flex w-full flex-col items-center gap-2 rounded-3xl border px-2 py-4 transition-all ${
                        isActive
                          ? "border-sky-400/40 bg-sky-400/15 shadow-[0_0_30px_rgba(56,189,248,0.12)]"
                          : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? "bg-sky-400 text-black" : "bg-white/5 text-white/70 group-hover:text-white"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] font-medium text-white/85">{tool.label}</div>
                        <div className="text-[10px] text-white/35">{tool.key}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </aside>

            <main className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0f1218] shadow-2xl">

  {/* Top Context Bar */}
  <div className="absolute inset-x-0 top-0 z-20 border-b border-white/5 bg-black/30 px-4 py-3 backdrop-blur-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge className="rounded-full border-0 bg-white/5 text-white/80">Aktiv: {activeToolObj?.label}</Badge>
        <Badge className="rounded-full border-0 bg-emerald-500/15 text-emerald-300">Snap aktiv</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/45">
        <Search className="h-4 w-4" />
        Scroll = Zoom · Space = Pan
      </div>
    </div>

    <div className="mt-2">
      <ToolContextBar config={activeToolPanel} />
    </div>
  </div>

  {/* Canvas Area */}
  <div className="relative h-[900px] overflow-hidden">

    <div
      className="absolute inset-0"
      style={{
        backgroundImage: showGrid
          ? "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)"
          : undefined,
        backgroundSize: "28px 28px",
      }}
    />

    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute left-1/2 top-1/2 h-[780px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/70 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
    />

  </div>

</main>

            <aside className="space-y-4">
              <Panel
                title="Ebenen-Manager"
                right={<Badge className="border-0 bg-sky-500/15 text-sky-300">Immer sichtbar</Badge>}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <Input placeholder="Ebenen filtern ..." className="rounded-2xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30" />
                  </div>
                  <Button size="sm" className="rounded-2xl bg-white/5 text-white hover:bg-white/10">
                    <Plus className="mr-2 h-4 w-4" />Neu
                  </Button>
                </div>

                <div className="max-h-[360px] space-y-3 overflow-auto pr-1">
                  {layers.map((layer, idx) => (
                    <div key={layer.name} className={`flex items-center gap-3 rounded-3xl border p-3 ${idx === 0 ? 'border-sky-400/30 bg-sky-500/10' : 'border-white/10 bg-white/[0.03]'}`}>
                      <div className={`h-3 w-3 rounded-full ${idx === 0 ? 'bg-sky-400' : 'bg-white/30'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white/90">{layer.name}</div>
                        <div className="text-xs text-white/40">{layer.type}</div>
                      </div>
                      <div className="flex items-center gap-1 text-white/50">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white/10 hover:text-white"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white/10 hover:text-white"><Lock className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white/10 hover:text-white"><Move className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-[24px] border border-white/10 bg-white/5 p-1">
                  <TabsTrigger value="library" className="rounded-[18px] data-[state=active]:bg-sky-500 data-[state=active]:text-black">Library</TabsTrigger>
                  <TabsTrigger value="metadata" className="rounded-[18px] data-[state=active]:bg-sky-500 data-[state=active]:text-black">Metadaten</TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="mt-4">
                  <Panel title="Objekt-Bibliothek" right={<Badge className="border-0 bg-white/5 text-white/60">6 Kategorien</Badge>}>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                        <Input placeholder="Objekt suchen ..." className="rounded-2xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/30" />
                      </div>
                      <Button variant="secondary" className="rounded-2xl border border-white/10 bg-white/5 text-white">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {['SmartRoads', 'Fahrzeuge', 'Infrastruktur', 'Verkehrsregelung', 'Umgebung', 'Markierungen'].map((cat, i) => (
                        <Badge key={cat} className={`rounded-full border-0 px-3 py-1 ${i === 0 ? 'bg-sky-500/15 text-sky-300' : 'bg-white/5 text-white/55'}`}>{cat}</Badge>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {libraryItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <motion.div key={item.title} whileHover={{ x: 3 }} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-sky-300">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-white/90">{item.title}</div>
                              <div className="text-xs text-white/40">{item.meta}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-white/30" />
                          </motion.div>
                        );
                      })}
                    </div>
                  </Panel>
                </TabsContent>

                <TabsContent value="metadata" className="mt-4 space-y-4">
                  <Panel title="Falldaten & Dokument-Metadaten">
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mb-1 text-xs text-white/45">Fallnummer</div>
                          <div className="text-sm font-semibold text-white/90">VU-2026-031</div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="mb-1 text-xs text-white/45">Datum / Uhrzeit</div>
                          <div className="text-sm font-semibold text-white/90">20.03.2026 · 14:35</div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                        <div className="flex items-center justify-between"><span className="text-white/55">Bearbeiter</span><span className="text-white/90">Max Mustermann</span></div>
                        <div className="flex items-center justify-between"><span className="text-white/55">Ort</span><span className="text-white/90">Musterstraße / Kreuzung Nord</span></div>
                        <div className="flex items-center justify-between"><span className="text-white/55">Canvas</span><span className="text-white/90">DIN A4</span></div>
                        <div className="flex items-center justify-between"><span className="text-white/55">Zoom</span><span className="text-sky-300">{zoom}%</span></div>
                      </div>
                    </div>
                  </Panel>

                  <Panel title="Skizzenoptionen">
                    <div className="space-y-4 text-sm">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-white/75">Grid anzeigen</span>
                          <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/75">Snap aktiv</span>
                          <Switch checked={snap} onCheckedChange={setSnap} />
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <Panel title="Maßstab-System">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white/90">Aktueller Maßstab</div>
                        <div className="text-xs text-white/40">Automatisch aus realen Objekten berechnet</div>
                      </div>
                      <Badge className="border-0 bg-sky-500/15 text-sky-300">1:250</Badge>
                    </div>
                    <Separator className="my-3 bg-white/10" />
                    <div className="grid grid-cols-2 gap-2">
                      {scaleSteps.map((step, idx) => (
                        <div key={step} className={`rounded-2xl border px-3 py-2 text-xs ${idx === 4 ? 'border-sky-400/40 bg-sky-400/15 text-sky-300' : 'border-white/10 bg-white/5 text-white/55'}`}>{step}</div>
                      ))}
                    </div>
                  </Panel>
                </TabsContent>
              </Tabs>
            </aside>
          </div>

          <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Badge className="border-0 bg-white/5 text-white/70">Tool: {activeToolObj?.label}</Badge>
              <Badge className="border-0 bg-white/5 text-white/70">Zoom: {zoom}%</Badge>
              <Badge className="border-0 bg-white/5 text-white/70">Maßstab: 1:250</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Library className="h-4 w-4" />
              Objektbibliothek · <Layers3 className="h-4 w-4" /> Ebenen · <FileText className="h-4 w-4" /> Offline-ready
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-2xl text-white/60 hover:bg-white/10 hover:text-white"><ZoomIn className="mr-2 h-4 w-4" />Reset View</Button>
              <Button variant="ghost" className="rounded-2xl text-white/60 hover:bg-white/10 hover:text-white"><Settings2 className="mr-2 h-4 w-4" />Settings</Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
