import { createDefaultStraightRoad, normalizeLayerOrder } from './constants'
import { getBusStripProps, getCurbStripProps, getCyclepathStripProps, getDefaultStripProps, getLaneStripProps, getParkingStripProps } from './stripProps'
import { getStripDefaultWidth } from './rules/stripRules'
import type { Marking, MarkingType, MarkingVariant, RoadClass, StraightRoadState, Strip, StripProps, StripType, StripVariant } from './types'

const STRIP_TYPES: StripType[] = ['lane', 'sidewalk', 'cyclepath', 'parking', 'green', 'curb', 'gutter', 'median', 'bus', 'tram', 'shoulder']
const MARKING_TYPES: MarkingType[] = ['centerline', 'laneboundary', 'stopline', 'crosswalk', 'arrow', 'blocked-area', 'yield-line', 'bike-crossing', 'bus-stop', 'speed-limit', 'parking-marking', 'free-line']
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
}

const MARKING_VARIANTS_BY_TYPE: Partial<Record<MarkingType, MarkingVariant[]>> = {
  centerline: ['standard-dash', 'rural-dash', 'autobahn-dash', 'short-dash', 'warning-dash', 'rural-warning', 'autobahn-warning'],
  laneboundary: ['solid', 'double'],
  stopline: ['default'],
  crosswalk: ['default'],
  arrow: ['straight', 'left', 'right', 'straight-left', 'straight-right'],
  'speed-limit': ['tempo-30', 'tempo-50'],
  'free-line': ['custom'],
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
}

const DEFAULT_MARKING_VARIANT_BY_TYPE: Partial<Record<MarkingType, MarkingVariant>> = {
  centerline: 'standard-dash',
  laneboundary: 'solid',
  stopline: 'default',
  crosswalk: 'default',
  arrow: 'straight',
  'speed-limit': 'tempo-50',
  'free-line': 'custom',
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

function sanitizeStrip(raw: unknown, roadLength: number, roadClass: RoadClass): Strip | null {
  if (!isRecord(raw)) return null

  const type = sanitizeStripType(raw.type)
  if (!type) return null

  const variant = sanitizeStripVariant(type, raw.variant)
  const width = toPositiveNumber(raw.width, getStripDefaultWidth(type, variant, roadClass), 0.1)
  const height = typeof raw.height === 'number' && Number.isFinite(raw.height) && raw.height > 0
    ? Math.min(raw.height, roadLength)
    : undefined

  const strip: Strip = {
    id: sanitizeId(raw.id, `${type}-strip`),
    type,
    variant,
    width,
    ...(height != null ? { height } : {}),
    ...(type !== 'curb' && sanitizeColor(raw.color) ? { color: sanitizeColor(raw.color) } : {}),
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
    default:
      return { ...strip, props: getDefaultStripProps(type) }
  }
}

function sanitizeMarking(raw: unknown, roadLength: number): Marking | null {
  if (!isRecord(raw)) return null

  const type = sanitizeMarkingType(raw.type)
  if (!type) return null

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
    ...(sanitizeDashPattern(raw.dashPattern) ? { dashPattern: sanitizeDashPattern(raw.dashPattern) } : {}),
    ...(sanitizeColor(raw.color) ? { color: sanitizeColor(raw.color) } : {}),
  }

  return marking
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

  const rawLayerOrder = Array.isArray(raw.layerOrder)
    ? raw.layerOrder.filter((entry): entry is string => typeof entry === 'string')
    : fallback.layerOrder

  return {
    strips,
    markings,
    length,
    roadClass,
    layerOrder: normalizeLayerOrder(rawLayerOrder, strips, markings),
  }
}
