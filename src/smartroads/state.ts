import { createDefaultStraightRoad, normalizeLayerOrder } from './constants'
import { getTrafficIslandPresetRule } from './rules/markingRules'
import { getBusStripProps, getCurbStripProps, getCyclepathStripProps, getDefaultStripProps, getGuardrailStripProps, getLaneStripProps, getParkingStripProps, getSidewalkStripProps } from './stripProps'
import { getStripDefaultWidth } from './rules/stripRules'
import type {
  BikeCrossingSurfaceType,
  CyclepathLineMode,
  LinkedCrossingType,
  Marking,
  MarkingType,
  MarkingVariant,
  RoadClass,
  StraightRoadState,
  Strip,
  StripProps,
  StripType,
  StripVariant,
  TrafficIslandEntryTreatment,
  TrafficIslandPreset,
  TrafficIslandSurfaceType,
} from './types'

const STRIP_TYPES: StripType[] = ['lane', 'sidewalk', 'cyclepath', 'parking', 'green', 'curb', 'gutter', 'median', 'bus', 'tram', 'shoulder', 'path', 'guardrail']
const MARKING_TYPES: MarkingType[] = ['centerline', 'laneboundary', 'stopline', 'crosswalk', 'arrow', 'blocked-area', 'yield-line', 'bike-crossing', 'bus-stop', 'speed-limit', 'parking-marking', 'free-line', 'traffic-island']
const ROAD_CLASSES: RoadClass[] = ['innerorts', 'ausserorts', 'autobahn']

const STRIP_VARIANTS_BY_TYPE: Record<StripType, StripVariant[]> = {
  lane: ['standard', 'turn-left', 'turn-right', 'multi-use'],
  sidewalk: ['standard', 'shared-bike', 'separated-bike'],
  cyclepath: ['protected', 'lane-marked', 'advisory'],
  parking: ['parallel', 'angled', 'perpendicular'],
  green: ['standard', 'tree-strip'],
  curb: ['standard'],
  gutter: ['standard'],
  median: ['marking-only', 'green-median', 'barrier'],
  bus: ['standard'],
  tram: ['dedicated', 'flush'],
  shoulder: ['standard'],
  path: ['dirt', 'gravel', 'forest'],
  guardrail: ['schutzplanke', 'betonwand', 'doppel'],
}

const MARKING_VARIANTS_BY_TYPE: Partial<Record<MarkingType, MarkingVariant[]>> = {
  centerline: ['standard-dash', 'rural-dash', 'autobahn-dash', 'short-dash', 'warning-dash', 'rural-warning', 'autobahn-warning'],
  laneboundary: ['solid', 'double'],
  stopline: ['default'],
  crosswalk: ['default'],
  'bike-crossing': ['default'],
  arrow: ['straight', 'left', 'right', 'straight-left', 'straight-right'],
  'speed-limit': ['tempo-30', 'tempo-50'],
  'free-line': ['custom'],
  'traffic-island': ['raised-paved'],
}

const DEFAULT_VARIANT_BY_TYPE: Record<StripType, StripVariant> = {
  lane: 'standard',
  sidewalk: 'standard',
  cyclepath: 'protected',
  parking: 'parallel',
  green: 'standard',
  curb: 'standard',
  gutter: 'standard',
  median: 'marking-only',
  bus: 'standard',
  tram: 'dedicated',
  shoulder: 'standard',
  path: 'dirt',
  guardrail: 'schutzplanke',
}

const DEFAULT_MARKING_VARIANT_BY_TYPE: Partial<Record<MarkingType, MarkingVariant>> = {
  centerline: 'standard-dash',
  laneboundary: 'solid',
  stopline: 'default',
  crosswalk: 'default',
  'bike-crossing': 'default',
  arrow: 'straight',
  'speed-limit': 'tempo-50',
  'free-line': 'custom',
  'traffic-island': 'raised-paved',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function createFallbackId(prefix: string): string {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function sanitizeId(value: unknown, prefix: string): string {
  if (typeof value === 'string' && value.trim().length > 0) return value
  return createFallbackId(prefix)
}

function sanitizeColor(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function toFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function toPositiveNumber(value: unknown, fallback: number, min: number): number {
  return Math.max(min, toFiniteNumber(value, fallback))
}

function sanitizeRoadClass(value: unknown, fallback: RoadClass): RoadClass {
  return typeof value === 'string' && ROAD_CLASSES.includes(value as RoadClass) ? (value as RoadClass) : fallback
}

function sanitizeStripType(value: unknown): StripType | null {
  return typeof value === 'string' && STRIP_TYPES.includes(value as StripType) ? (value as StripType) : null
}

function sanitizeMarkingType(value: unknown): MarkingType | null {
  return typeof value === 'string' && MARKING_TYPES.includes(value as MarkingType) ? (value as MarkingType) : null
}

function sanitizeStripVariant(type: StripType, value: unknown): StripVariant {
  return typeof value === 'string' && STRIP_VARIANTS_BY_TYPE[type].includes(value as StripVariant)
    ? (value as StripVariant)
    : DEFAULT_VARIANT_BY_TYPE[type]
}

function sanitizeMarkingVariant(type: MarkingType, value: unknown): MarkingVariant {
  const allowed = MARKING_VARIANTS_BY_TYPE[type]
  if (allowed && typeof value === 'string' && allowed.includes(value as MarkingVariant)) {
    return value as MarkingVariant
  }
  return DEFAULT_MARKING_VARIANT_BY_TYPE[type] ?? 'default'
}

function sanitizeDashPattern(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) return undefined
  const next = value
    .filter((entry): entry is number => typeof entry === 'number' && Number.isFinite(entry) && entry > 0)
    .map((entry) => Math.max(0.05, entry))
  return next.length > 0 ? next : undefined
}

function sanitizeLineMode(value: unknown): CyclepathLineMode | undefined {
  return value === 'dashed' || value === 'solid' || value === 'none'
    ? value as CyclepathLineMode
    : undefined
}

function sanitizeStrip(raw: unknown, roadLength: number, roadClass: RoadClass): Strip | null {
  if (!isRecord(raw)) return null

  let type = sanitizeStripType(raw.type)
  if (!type) return null

  // Legacy migration: median/barrier → guardrail/schutzplanke
  let rawVariant = raw.variant
  if (type === 'median' && rawVariant === 'barrier') {
    type = 'guardrail'
    rawVariant = 'schutzplanke'
  }

  const variant = sanitizeStripVariant(type, rawVariant)
  const width = toPositiveNumber(raw.width, getStripDefaultWidth(type, variant, roadClass), 0.1)
  const height = typeof raw.height === 'number' && Number.isFinite(raw.height) && raw.height > 0
    ? Math.min(raw.height, roadLength)
    : undefined

  const sanitizedColor = type !== 'curb' && type !== 'guardrail' ? sanitizeColor(raw.color) : undefined

  const strip: Strip = {
    id: sanitizeId(raw.id, `${type}-strip`),
    type,
    variant,
    width,
    ...(height != null ? { height } : {}),
    ...(sanitizedColor ? { color: sanitizedColor } : {}),
    ...(raw.direction === 'up' || raw.direction === 'down' ? { direction: raw.direction } : {}),
  }

  const propsSource = isRecord(raw.props) ? (raw.props as StripProps) : undefined
  const candidate = { ...strip, ...(propsSource ? { props: propsSource } : {}) }

  switch (type) {
    case 'lane':
      return { ...strip, props: getLaneStripProps(candidate) }
    case 'bus':
      return { ...strip, props: getBusStripProps(candidate) }
    case 'cyclepath':
      return { ...strip, props: getCyclepathStripProps(candidate) }
    case 'parking':
      return { ...strip, props: getParkingStripProps(candidate) }
    case 'curb':
      return { ...strip, props: getCurbStripProps(candidate) }
    case 'sidewalk':
      return { ...strip, props: getSidewalkStripProps(candidate) }
    case 'guardrail':
      return { ...strip, props: getGuardrailStripProps(candidate) }
    default:
      return { ...strip, props: getDefaultStripProps(type) }
  }
}

function sanitizeMarking(raw: unknown, roadLength: number): Marking | null {
  if (!isRecord(raw)) return null

  const type = sanitizeMarkingType(raw.type)
  if (!type) return null

  const dashPattern = sanitizeDashPattern(raw.dashPattern)
  const markingColor = sanitizeColor(raw.color)
  const rawTrafficIslandSurfaceType: TrafficIslandSurfaceType | undefined =
    typeof raw.surfaceType === 'string' && ['green', 'paved', 'cobblestone'].includes(raw.surfaceType)
      ? (raw.surfaceType as TrafficIslandSurfaceType)
      : undefined
  const trafficIslandPreset = typeof raw.crossingAidPreset === 'string' && ['standard', 'barrier-free', 'bike-crossing', 'free'].includes(raw.crossingAidPreset)
    ? (raw.crossingAidPreset as TrafficIslandPreset)
    // Legacy: map removed "overrunnable" states to the nearest supported crossing-aid preset.
    : raw.crossingAidPreset === 'overrunnable'
      ? ('standard' as TrafficIslandPreset)
      : ('free' as TrafficIslandPreset)
  const defaultTrafficIslandSurfaceType: TrafficIslandSurfaceType = raw.surfaceType === 'asphalt'
    // Legacy: removed asphalt traffic-island surfaces fall back to a paved island body.
    ? 'paved'
    : trafficIslandPreset === 'free'
      ? 'green'
      : 'paved'
  const sanitizedTrafficIslandSurfaceType = rawTrafficIslandSurfaceType ?? defaultTrafficIslandSurfaceType
  const defaultTrafficIslandShowCurbBorder = true
  const defaultTrafficIslandEntryTreatment = 'none' as TrafficIslandEntryTreatment
  const defaultTrafficIslandShowApproachMarking = getTrafficIslandPresetRule(trafficIslandPreset).showApproachMarking
  const bikeCrossingSurfaceType: BikeCrossingSurfaceType =
    raw.bikeCrossingSurfaceType === 'crosswalk'
      ? 'crosswalk'
      : raw.bikeCrossingSurfaceType === 'cyclepath' || raw.bikeCrossingSurfaceType === 'red' || raw.bikeCrossingSurfaceType === 'none'
        ? 'cyclepath'
        : 'cyclepath'
  const legacyBikeCrossingEdgeStyle = typeof raw.bikeCrossingEdgeStyle === 'string' ? raw.bikeCrossingEdgeStyle : undefined
  const bikeCrossingBoundaryLineMode = sanitizeLineMode(raw.bikeCrossingBoundaryLineMode)
    ?? (legacyBikeCrossingEdgeStyle === 'dashed-broad' || legacyBikeCrossingEdgeStyle === 'dashed-narrow'
      ? 'dashed'
      : legacyBikeCrossingEdgeStyle === 'none'
        ? 'none'
        : undefined)
  const bikeCrossingBoundaryLineStrokeWidth = typeof raw.bikeCrossingBoundaryLineStrokeWidth === 'number' && Number.isFinite(raw.bikeCrossingBoundaryLineStrokeWidth)
    ? Math.max(0.01, raw.bikeCrossingBoundaryLineStrokeWidth)
    : legacyBikeCrossingEdgeStyle === 'dashed-narrow'
      ? 0.12
      : legacyBikeCrossingEdgeStyle === 'dashed-broad'
        ? 0.25
        : undefined
  const bikeCrossingBoundaryLineDashLength = typeof raw.bikeCrossingBoundaryLineDashLength === 'number' && Number.isFinite(raw.bikeCrossingBoundaryLineDashLength)
    ? Math.max(0.01, raw.bikeCrossingBoundaryLineDashLength)
    : bikeCrossingBoundaryLineMode === 'dashed'
      ? 0.5
      : undefined
  const bikeCrossingBoundaryLineGapLength = typeof raw.bikeCrossingBoundaryLineGapLength === 'number' && Number.isFinite(raw.bikeCrossingBoundaryLineGapLength)
    ? Math.max(0.01, raw.bikeCrossingBoundaryLineGapLength)
    : bikeCrossingBoundaryLineMode === 'dashed'
      ? 0.2
      : undefined

  const marking: Marking = {
    id: sanitizeId(raw.id, `${type}-marking`),
    type,
    variant: sanitizeMarkingVariant(type, raw.variant),
    x: toFiniteNumber(raw.x, 0),
    y: toFiniteNumber(raw.y, 0),
    ...(typeof raw.width === 'number' && Number.isFinite(raw.width) ? { width: Math.max(0.1, raw.width) } : {}),
    ...(typeof raw.length === 'number' && Number.isFinite(raw.length) ? { length: Math.max(0.1, Math.min(raw.length, roadLength)) } : {}),
    ...(typeof raw.offsetY === 'number' && Number.isFinite(raw.offsetY) ? { offsetY: Math.max(0, raw.offsetY) } : {}),
    ...(typeof raw.rotation === 'number' && Number.isFinite(raw.rotation) ? { rotation: raw.rotation } : {}),
    ...(typeof raw.strokeWidth === 'number' && Number.isFinite(raw.strokeWidth) ? { strokeWidth: Math.max(0.01, raw.strokeWidth) } : {}),
    ...(dashPattern ? { dashPattern } : {}),
    ...(markingColor ? { color: markingColor } : {}),
    ...(typeof raw.linkedIslandId === 'string' && raw.linkedIslandId.trim().length > 0 ? { linkedIslandId: raw.linkedIslandId } : {}),
    // Traffic island specific fields
    ...(type === 'traffic-island' ? {
      crossingAidPreset: trafficIslandPreset,
      surfaceType: sanitizedTrafficIslandSurfaceType,
      curbType: 'flat',
      ...(typeof raw.entryTreatment === 'string' && ['none', 'round-3cm', 'kassel', 'separated-0-6'].includes(raw.entryTreatment)
        ? { entryTreatment: raw.entryTreatment as TrafficIslandEntryTreatment }
        : { entryTreatment: defaultTrafficIslandEntryTreatment }),
      ...(typeof raw.endShape === 'string' && ['rounded', 'pointed', 'flat'].includes(raw.endShape) ? { endShape: raw.endShape } : { endShape: 'rounded' }),
      ...(typeof raw.endTaperLength === 'number' && Number.isFinite(raw.endTaperLength) ? { endTaperLength: Math.max(0.2, raw.endTaperLength) } : { endTaperLength: 1.0 }),
      showCurbBorder: typeof raw.showCurbBorder === 'boolean' ? raw.showCurbBorder : defaultTrafficIslandShowCurbBorder,
      showApproachMarking: typeof raw.showApproachMarking === 'boolean' ? raw.showApproachMarking : defaultTrafficIslandShowApproachMarking,
      ...(typeof raw.approachLength === 'number' && Number.isFinite(raw.approachLength) ? { approachLength: Math.max(1.0, Math.min(15.0, raw.approachLength)) } : { approachLength: 3.0 }),
    } : {}),
    ...(type === 'bike-crossing' ? {
      bikeCrossingSurfaceType,
      ...(bikeCrossingBoundaryLineMode ? { bikeCrossingBoundaryLineMode } : {}),
      ...(bikeCrossingBoundaryLineStrokeWidth != null ? { bikeCrossingBoundaryLineStrokeWidth } : {}),
      ...(bikeCrossingBoundaryLineDashLength != null ? { bikeCrossingBoundaryLineDashLength } : {}),
      ...(bikeCrossingBoundaryLineGapLength != null ? { bikeCrossingBoundaryLineGapLength } : {}),
    } : {}),
  }

  return marking
}

function normalizeTrafficIslandMarkings(markings: Marking[]): Marking[] {
  const linkedCrossingTypes = new Map<string, LinkedCrossingType>()
  for (const marking of markings) {
    if ((marking.type === 'crosswalk' || marking.type === 'bike-crossing') && typeof marking.linkedIslandId === 'string' && marking.linkedIslandId.trim().length > 0) {
      linkedCrossingTypes.set(marking.linkedIslandId, marking.type)
    }
  }

  const linkedIslandIds = new Set(
    markings
      .filter((marking): marking is Marking & { linkedIslandId: string } => (
        (marking.type === 'crosswalk' || marking.type === 'bike-crossing') && typeof marking.linkedIslandId === 'string' && marking.linkedIslandId.trim().length > 0
      ))
      .map((marking) => marking.linkedIslandId),
  )

  return markings.map((marking) => {
    if (marking.type !== 'traffic-island') return marking

    const hasLinkedCrosswalk = linkedIslandIds.has(marking.id)
    const linkedCrossingType = linkedCrossingTypes.get(marking.id)
    const preset: TrafficIslandPreset = linkedCrossingType === 'bike-crossing'
      ? 'bike-crossing'
      : hasLinkedCrosswalk
        ? (marking.crossingAidPreset === 'barrier-free' ? 'barrier-free' : 'standard')
      : 'free'
    const presetRule = getTrafficIslandPresetRule(preset)
    const surfaceType = linkedCrossingType
      ? (marking.surfaceType === 'cobblestone' || marking.surfaceType === 'paved' ? marking.surfaceType : presetRule.surfaceType)
      : (marking.surfaceType === 'green' || marking.surfaceType === 'paved' || marking.surfaceType === 'cobblestone'
          ? marking.surfaceType
          : presetRule.surfaceType)

    return {
      ...marking,
      crossingAidPreset: preset,
      surfaceType,
      curbType: 'flat',
      entryTreatment: linkedCrossingType === 'crosswalk'
        ? (preset === 'barrier-free'
            ? 'separated-0-6'
            : (marking.entryTreatment ?? presetRule.entryTreatment))
        : 'none',
      showCurbBorder: typeof marking.showCurbBorder === 'boolean' ? marking.showCurbBorder : presetRule.showCurbBorder,
      showApproachMarking: typeof marking.showApproachMarking === 'boolean' ? marking.showApproachMarking : presetRule.showApproachMarking,
      approachLength: marking.approachLength ?? presetRule.approachLength,
    }
  })
}

export function normalizeStraightRoadState(raw: unknown, fallback: StraightRoadState = createDefaultStraightRoad()): StraightRoadState {
  if (!isRecord(raw)) return fallback

  const roadClass = sanitizeRoadClass(raw.roadClass, fallback.roadClass ?? 'innerorts')
  const length = toPositiveNumber(raw.length, fallback.length, 0.5)
  const strips = Array.isArray(raw.strips)
    ? raw.strips.map((strip) => sanitizeStrip(strip, length, roadClass)).filter((strip): strip is Strip => Boolean(strip))
    : fallback.strips
  const markings = Array.isArray(raw.markings)
    ? raw.markings.map((marking) => sanitizeMarking(marking, length)).filter((marking): marking is Marking => Boolean(marking))
    : fallback.markings
  const normalizedMarkings = normalizeTrafficIslandMarkings(markings)
  const suppressedCenterlines = Array.isArray(raw.suppressedCenterlines)
    ? raw.suppressedCenterlines
      .map((marking) => sanitizeMarking(marking, length))
      .filter((marking): marking is Marking => marking != null && marking.type === 'centerline')
    : fallback.suppressedCenterlines ?? []

  const rawLayerOrder = Array.isArray(raw.layerOrder)
    ? raw.layerOrder.filter((entry): entry is string => typeof entry === 'string')
    : fallback.layerOrder

  return {
    strips,
    markings: normalizedMarkings,
    suppressedCenterlines,
    length,
    roadClass,
    layerOrder: normalizeLayerOrder(rawLayerOrder, strips, normalizedMarkings),
  }
}

