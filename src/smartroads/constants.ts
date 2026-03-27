import type { StripType, StripVariant, Strip, Marking, MarkingVariant, StraightRoadState, RoadClass } from './types'
import { MARKING_RULES } from './rules/markingRules'
import { ROAD_PROFILE_RULES } from './rules/profileRules'
import { FIXED_WIDTH_STRIP_TYPES, STRIP_BASE_RULES, STRIP_VARIANT_RULES, getStripDefaultWidth, getStripEditorMinWidth } from './rules/stripRules'
import { getCyclepathStripProps, getDefaultStripProps, getStripRenderLength, getStripRenderY } from './stripProps'
import { getCrossSectionStrips } from './layout'

// ============================================================
// SmartRoads - Constants and helpers
// ============================================================

// The normative source of truth lives in src/smartroads/rules/.
// This file keeps the public helper API stable for the rest of the editor.

export const STRIP_WIDTH_DEFAULTS: Record<StripType, number> = Object.fromEntries(
  (Object.keys(STRIP_BASE_RULES) as StripType[]).map((type) => [type, STRIP_BASE_RULES[type].defaultWidth])
) as Record<StripType, number>

export const VARIANT_WIDTH_OVERRIDES: Partial<Record<StripVariant, number>> = Object.fromEntries(
  Object.entries(STRIP_VARIANT_RULES).map(([variant, rule]) => [variant, rule.width])
) as Partial<Record<StripVariant, number>>

export const MARKING_DEFAULTS = {
  schmalstrich: MARKING_RULES.lineWidths.otherRoads.schmalstrich,
  breitstrich: MARKING_RULES.lineWidths.otherRoads.breitstrich,
  schmalstrichAutobahn: MARKING_RULES.lineWidths.autobahn.schmalstrich,
  breitstrichAutobahn: MARKING_RULES.lineWidths.autobahn.breitstrich,
  stopLineWidth: MARKING_RULES.stopline.strokeWidth,
  crosswalkStripe: MARKING_RULES.crosswalk.stripeWidth,
  crosswalkGap: MARKING_RULES.crosswalk.gap,
  crosswalkMinLength: MARKING_RULES.crosswalk.minLength,
  waitLineWidth: MARKING_RULES.waitLine.strokeWidth,
  waitLineGap: MARKING_RULES.waitLine.gap,
}

export const STRIP_MIN_WIDTHS: Record<StripType, number> = Object.fromEntries(
  (Object.keys(STRIP_BASE_RULES) as StripType[]).map((type) => [type, getStripEditorMinWidth(type)])
) as Record<StripType, number>

export const FIXED_WIDTH_STRIPS: StripType[] = FIXED_WIDTH_STRIP_TYPES

export const STRIP_COLORS: Record<StripType, string> = {
  lane: '#3a3a3a',
  sidewalk: '#c8c0b0',
  cyclepath: '#EF4444',
  parking: '#3a3a3a',
  green: '#7a9a5a',
  curb: '#999999',
  gutter: '#888888',
  median: '#444444',
  bus: '#3a3a3a',
  tram: '#555555',
  shoulder: '#999999',
  path: '#8B7355',
  guardrail: '#b0b0b0',
}

export const DEFAULT_MARKING_COLOR = '#ffffff'

export function getStripSwatchColor(strip: Pick<Strip, 'type' | 'variant' | 'color'>): string {
  if (strip.type === 'curb') return STRIP_COLORS.curb
  if (strip.color) return strip.color

  if (strip.type === 'cyclepath') {
    if (strip.variant === 'advisory' || strip.variant === 'lane-marked') return STRIP_COLORS.lane
    return STRIP_COLORS.cyclepath
  }

  if (strip.type === 'sidewalk') {
    return STRIP_COLORS.sidewalk
  }

  if (strip.type === 'path') {
    if (strip.variant === 'gravel') return '#9a9080'
    if (strip.variant === 'forest') return '#5a4a38'
    return '#8B7355'
  }

  if (strip.type === 'guardrail') {
    if (strip.variant === 'betonwand') return '#8a8a85'
    return '#b0b0b0'
  }

  return STRIP_COLORS[strip.type] || '#666666'
}

export const STRIP_LABELS: Record<StripType, string> = {
  lane: 'Fahrstreifen',
  sidewalk: 'Gehweg',
  cyclepath: 'Radweg',
  parking: 'Parkstreifen',
  green: 'Grünstreifen',
  curb: 'Bordstein',
  gutter: 'Rinne',
  median: 'Mittelstreifen',
  bus: 'Busstreifen',
  tram: 'Gleiskörper',
  shoulder: 'Seitenstreifen',
  path: 'Weg',
  guardrail: 'Leitplanke',
}

export const VARIANT_LABELS: Partial<Record<StripVariant, string>> = {
  standard: 'Standard',
  'turn-left': 'Abbiegespur Links',
  'turn-right': 'Abbiegespur Rechts',
  'multi-use': 'Mehrzweckstreifen',
  protected: 'Baulich getrennt',
  'lane-marked': 'Radfahrstreifen',
  advisory: 'Schutzstreifen',
  'shared-bike': 'Gemeinsamer Geh-/Radweg',
  'separated-bike': 'Getrennter Geh-/Radweg',
  parallel: 'Längsparken',
  angled: 'Schrägparken',
  perpendicular: 'Querparken',
  'marking-only': 'Markierung',
  'green-median': 'Grünstreifen',
  barrier: 'Leitplanke',
  'tree-strip': 'Baumstreifen',
  dedicated: 'Eigentrasse',
  flush: 'Bündig',
  dirt: 'Erdweg',
  gravel: 'Schotterweg',
  forest: 'Waldweg',
  schutzplanke: 'Schutzplanke',
  betonwand: 'Betonschutzwand',
  doppel: 'Doppelschutzplanke',
}

export function getStripDisplayLabel(strip: Strip): string {
  if (strip.type === 'lane') {
    if (strip.variant === 'turn-left') return 'Abbiegespur Links'
    if (strip.variant === 'turn-right') return 'Abbiegespur Rechts'
    if (strip.variant === 'multi-use') return 'Mehrzweckstreifen'
    return 'Fahrstreifen'
  }

  if (strip.type === 'cyclepath') {
    if (strip.variant === 'advisory') {
      const side = getCyclepathStripProps(strip).overlaySide === 'left' ? ' links' : ' rechts'
      return `Schutzstreifen${side}`
    }
    if (strip.variant === 'lane-marked') {
      const side = getCyclepathStripProps(strip).overlaySide === 'left' ? ' links' : ' rechts'
      return `Radfahrstreifen${side}`
    }
    if (strip.variant === 'protected') {
      const { pathType, protectedPlacement } = getCyclepathStripProps(strip)
      if (pathType === 'two-way' && protectedPlacement === 'both-sides') return 'Zweirichtungsradweg (Sonderfall)'
      if (pathType === 'two-way') return 'Zweirichtungsradweg'
      return 'Baulich getrennter Radweg'
    }
  }

  if (strip.type === 'sidewalk') {
    if (strip.variant === 'shared-bike') return 'Gemeinsamer Geh-/Radweg'
    if (strip.variant === 'separated-bike') return 'Getrennter Geh-/Radweg'
    return 'Gehweg'
  }

  if (strip.type === 'parking') {
    if (strip.variant === 'parallel') return 'Längsparken'
    if (strip.variant === 'angled') return 'Schrägparken'
    if (strip.variant === 'perpendicular') return 'Querparken'
    return 'Parkstreifen'
  }

  if (strip.type === 'green') {
    if (strip.variant === 'tree-strip') return 'Baumstreifen'
    return 'Grünstreifen'
  }

  if (strip.type === 'median') {
    if (strip.variant === 'marking-only') return 'Mittelstreifen-Markierung'
    if (strip.variant === 'green-median') return 'Grünstreifen'
    if (strip.variant === 'barrier') return 'Leitplanke'
    return 'Mittelstreifen'
  }

  if (strip.type === 'tram') {
    if (strip.variant === 'dedicated') return 'Eigentrasse'
    if (strip.variant === 'flush') return 'Bündiger Gleiskörper'
  }

  if (strip.type === 'path') {
    if (strip.variant === 'dirt') return 'Erdweg'
    if (strip.variant === 'gravel') return 'Schotterweg'
    if (strip.variant === 'forest') return 'Waldweg'
    return 'Weg'
  }

  if (strip.type === 'guardrail') {
    if (strip.variant === 'schutzplanke') return 'Schutzplanke'
    if (strip.variant === 'betonwand') return 'Betonschutzwand'
    if (strip.variant === 'doppel') return 'Doppelschutzplanke'
    return 'Leitplanke'
  }

  return STRIP_LABELS[strip.type] || strip.type
}

export const DEFAULT_ROAD_LENGTH = 30

export function createStrip(
  type: StripType,
  variant: StripVariant = 'standard',
  direction?: 'up' | 'down',
  roadClass?: RoadClass,
): Strip {
  return {
    id: crypto.randomUUID(),
    type,
    variant,
    width: getStripDefaultWidth(type, variant, roadClass),
    direction,
    props: getDefaultStripProps(type, variant),
  }
}

export const ROAD_CLASS_CONFIG: Record<RoadClass, {
  label: string
  centerlineVariant: MarkingVariant
  strokeWidth: number
}> = Object.fromEntries(
  (Object.keys(ROAD_PROFILE_RULES) as RoadClass[]).map((roadClass) => [
    roadClass,
    {
      label: ROAD_PROFILE_RULES[roadClass].label,
      centerlineVariant: ROAD_PROFILE_RULES[roadClass].centerlineVariant,
      strokeWidth: ROAD_PROFILE_RULES[roadClass].centerlineStrokeWidth,
    },
  ])
) as Record<RoadClass, { label: string; centerlineVariant: MarkingVariant; strokeWidth: number }>

export function generateLaneMarkings(
  strips: Strip[],
  variant: MarkingVariant = 'standard-dash',
  strokeWidth?: number,
  roadLength?: number,
): Marking[] {
  const markings: Marking[] = []
  let x = 0
  const effectiveRoadLength = roadLength ?? DEFAULT_ROAD_LENGTH
  const baseStrips = getCrossSectionStrips(strips)

  for (let i = 0; i < baseStrips.length - 1; i++) {
    x += Math.max(0.1, Number.isFinite(baseStrips[i].width) ? baseStrips[i].width : 0.1)
    const a = baseStrips[i]
    const b = baseStrips[i + 1]
    if ((a.type === 'lane' || a.type === 'bus') && (b.type === 'lane' || b.type === 'bus')) {
      const startOffset = Math.max(getStripRenderY(a), getStripRenderY(b))
      const lineEnd = Math.min(
        getStripRenderY(a) + getStripRenderLength(a, effectiveRoadLength),
        getStripRenderY(b) + getStripRenderLength(b, effectiveRoadLength),
      )
      const lineLength = lineEnd - startOffset
      if (lineLength <= 0) continue
      markings.push({
        id: crypto.randomUUID(),
        type: 'centerline',
        variant,
        x,
        y: 0,
        ...(startOffset > 0 ? { offsetY: startOffset } : {}),
        ...(lineLength !== effectiveRoadLength ? { length: lineLength } : {}),
        ...(strokeWidth ? { strokeWidth } : {}),
      })
    }
  }

  return markings
}

export function createLayerOrder(strips: Strip[], markings: Marking[]): string[] {
  return [...strips.map((strip) => strip.id), ...markings.map((marking) => marking.id)]
}

export function normalizeLayerOrder(
  layerOrder: string[] | undefined,
  strips: Strip[],
  markings: Marking[],
): string[] {
  const proposed = layerOrder ?? []
  const stripIds = strips.map((strip) => strip.id)
  const markingIds = markings.map((marking) => marking.id)
  const stripIdSet = new Set(stripIds)
  const markingIdSet = new Set(markingIds)

  // Lanes (lane + bus) always stay at the bottom of the z-order.
  // Other strips are layered above them; markings always on top.
  const laneIds = new Set(strips.filter((s) => s.type === 'lane' || s.type === 'bus').map((s) => s.id))

  const orderedStrips = proposed.filter((id) => stripIdSet.has(id))
  const orderedMarkings = proposed.filter((id) => markingIdSet.has(id))

  for (const stripId of stripIds) {
    if (!orderedStrips.includes(stripId)) orderedStrips.push(stripId)
  }

  for (const markingId of markingIds) {
    if (!orderedMarkings.includes(markingId)) orderedMarkings.push(markingId)
  }

  // Partition strips: lanes first (bottom), then everything else
  const laneOrder = orderedStrips.filter((id) => laneIds.has(id))
  const nonLaneOrder = orderedStrips.filter((id) => !laneIds.has(id))

  return [...laneOrder, ...nonLaneOrder, ...orderedMarkings]
}

export function orderMarkingsByLayer(markings: Marking[], layerOrder?: string[]): Marking[] {
  const normalized = normalizeLayerOrder(layerOrder, [], markings)
  const markingMap = new Map(markings.map((marking) => [marking.id, marking]))

  return normalized
    .map((id) => markingMap.get(id))
    .filter((marking): marking is Marking => Boolean(marking))
}

export function createDefaultStraightRoad(): StraightRoadState {
  const strips = [
    createStrip('lane', 'standard', 'up', 'innerorts'),
    createStrip('lane', 'standard', 'down', 'innerorts'),
  ]
  const markings = generateLaneMarkings(strips, 'standard-dash', undefined, 10)

  return {
    length: 10,
    strips,
    markings,
    suppressedCenterlines: [],
    layerOrder: createLayerOrder(strips, markings),
  }
}

export function totalWidth(strips: Strip[]): number {
  return getCrossSectionStrips(strips).reduce((sum, strip) => sum + Math.max(0.1, Number.isFinite(strip.width) ? strip.width : 0.1), 0)
}
