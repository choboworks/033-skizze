import { MARKING_RULES } from './rules/markingRules'
import type { BusStripProps, CurbKind, CurbStripProps, CyclepathLineMode, CyclepathPathType, CyclepathProtectedPlacement, CyclepathSide, CyclepathStripProps, LaneStripProps, ParkingStripProps, Strip, StripPropsByType, StripType } from './types'

export const DEFAULT_PARKING_BAY_LENGTH = 5.7
export const DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH = 0.75
export const DEFAULT_CURB_LOWERED_SECTION_LENGTH = 3.0

const DEFAULT_STRIP_PROPS: { [K in StripType]: StripPropsByType[K] } = {
  lane: { startOffset: 0, endOffset: 0 },
  sidewalk: {},
  cyclepath: {
    pathType: 'one-way',
    protectedPlacement: 'single-side',
    overlaySide: 'right',
    safetyBufferWidth: DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH,
  },
  parking: { bayLength: DEFAULT_PARKING_BAY_LENGTH },
  green: {},
  curb: {
    kind: 'standard',
    loweredSectionLength: DEFAULT_CURB_LOWERED_SECTION_LENGTH,
    loweredSectionOffset: 0,
  },
  gutter: {},
  median: {},
  bus: { startOffset: 0, endOffset: 0 },
  tram: {},
  shoulder: {},
}

export function getDefaultStripProps<T extends StripType>(type: T): StripPropsByType[T] {
  return { ...DEFAULT_STRIP_PROPS[type] }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function clampNonNegative(value: unknown, fallback = 0): number {
  if (!isFiniteNumber(value)) return fallback
  return Math.max(0, value)
}

function normalizePositive(value: unknown, fallback: number): number {
  if (!isFiniteNumber(value)) return fallback
  return Math.max(0.1, value)
}

function normalizeLineMetric(value: unknown, fallback: number): number {
  if (!isFiniteNumber(value)) return fallback
  return Math.max(0.01, value)
}

function normalizeSectionLength(value: unknown, fallback: number): number {
  if (!isFiniteNumber(value)) return fallback
  return Math.max(0.5, value)
}

function normalizeCyclepathPathType(raw: unknown): CyclepathPathType {
  if (raw === 'two-way' || raw === 'two-way-both-sides' || raw === 'two-way-single-side') {
    return 'two-way'
  }
  return 'one-way'
}

function normalizeCyclepathSide(raw: unknown): CyclepathSide {
  return raw === 'left' ? 'left' : 'right'
}

function normalizeCyclepathProtectedPlacement(
  rawPathType: unknown,
  rawPlacement: unknown,
): CyclepathProtectedPlacement {
  if (rawPathType === 'two-way-both-sides') return 'both-sides'
  if (rawPathType === 'two-way-single-side') return 'single-side'
  if (rawPlacement === 'both-sides' || rawPlacement === 'single-side') return rawPlacement
  return 'single-side'
}

function normalizeCyclepathLineMode(raw: unknown): CyclepathLineMode | undefined {
  if (raw === 'dashed' || raw === 'solid' || raw === 'none') return raw
  if (raw === 'default' || raw === 'standard' || raw == null) return undefined
  return undefined
}

export function mergeStripProps(strip: Strip, patch: Record<string, unknown>): Pick<Strip, 'props'> {
  return {
    props: {
      ...(strip.props ?? {}),
      ...patch,
    },
  }
}

export function getLaneStripProps(strip: Strip): LaneStripProps {
  if (strip.type !== 'lane') {
    return { startOffset: 0, endOffset: 0 }
  }

  const raw = (strip.props as LaneStripProps | undefined) ?? {}
  return {
    startOffset: clampNonNegative(raw.startOffset, DEFAULT_STRIP_PROPS.lane.startOffset ?? 0),
    endOffset: clampNonNegative(raw.endOffset, DEFAULT_STRIP_PROPS.lane.endOffset ?? 0),
  }
}

export function getBusStripProps(strip: Strip): BusStripProps {
  if (strip.type !== 'bus') {
    return { startOffset: 0, endOffset: 0 }
  }

  const raw = (strip.props as BusStripProps | undefined) ?? {}
  return {
    startOffset: clampNonNegative(raw.startOffset, DEFAULT_STRIP_PROPS.bus.startOffset ?? 0),
    endOffset: clampNonNegative(raw.endOffset, DEFAULT_STRIP_PROPS.bus.endOffset ?? 0),
  }
}

export function getStripStartOffset(strip: Strip): number {
  if (strip.type === 'lane') return getLaneStripProps(strip).startOffset ?? 0
  if (strip.type === 'bus') return getBusStripProps(strip).startOffset ?? 0
  return 0
}

export function getStripEndOffset(strip: Strip): number {
  if (strip.type === 'lane') return getLaneStripProps(strip).endOffset ?? 0
  if (strip.type === 'bus') return getBusStripProps(strip).endOffset ?? 0
  return 0
}

export function getStripRenderY(strip: Strip): number {
  return getStripStartOffset(strip)
}

export function getStripRenderLength(strip: Strip, roadLength: number): number {
  const safeRoadLength = normalizePositive(roadLength, 10)
  if (strip.type === 'lane' || strip.type === 'bus') {
    const hasExplicitOffsets = getStripStartOffset(strip) > 0 || getStripEndOffset(strip) > 0
    if (!hasExplicitOffsets && isFiniteNumber(strip.height)) {
      return Math.max(0.5, Math.min(strip.height, safeRoadLength))
    }
    const visible = safeRoadLength - getStripStartOffset(strip) - getStripEndOffset(strip)
    return Math.max(0.5, Math.round(visible * 100) / 100)
  }

  if (isFiniteNumber(strip.height)) {
    return Math.max(0.5, Math.min(strip.height, safeRoadLength))
  }
  return safeRoadLength
}

export function getParkingStripProps(strip: Strip): ParkingStripProps {
  if (strip.type !== 'parking') {
    return { bayLength: DEFAULT_PARKING_BAY_LENGTH }
  }
  const raw = (strip.props as ParkingStripProps | undefined) ?? {}
  return {
    bayLength: normalizePositive(raw.bayLength, DEFAULT_PARKING_BAY_LENGTH),
  }
}

export function getCurbStripProps(strip: Strip): CurbStripProps {
  if (strip.type !== 'curb') {
    return {
      kind: 'standard',
      loweredSectionLength: DEFAULT_CURB_LOWERED_SECTION_LENGTH,
      loweredSectionOffset: 0,
    }
  }

  const raw = (strip.props as Record<string, unknown> | undefined) ?? {}
  const kind = (() => {
    if (raw.kind === 'standard' || raw.kind === 'lowered' || raw.kind === 'driveway') {
      return raw.kind as CurbKind
    }
    // Legacy migration: the old boolean "lowered" described the driveway segment.
    if (raw.lowered === true) return 'driveway'
    return 'standard'
  })()
  return {
    kind,
    loweredSectionLength: normalizeSectionLength(
      raw.loweredSectionLength,
      DEFAULT_CURB_LOWERED_SECTION_LENGTH,
    ),
    loweredSectionOffset: clampNonNegative(raw.loweredSectionOffset, 0),
  }
}

export function getCyclepathStripProps(strip: Strip): CyclepathStripProps {
  if (strip.type !== 'cyclepath') {
    return { pathType: 'one-way', protectedPlacement: 'single-side' }
  }
  const rawProps = (strip.props as Record<string, unknown> | undefined) ?? {}
  const legacyLineMode = normalizeCyclepathLineMode(rawProps.lineMode)
  const rawPathType = rawProps.pathType
  const rawProtectedPlacement = rawProps.protectedPlacement
  const rawCenterLineMode = normalizeCyclepathLineMode(rawProps.centerLineMode)
  const rawBoundaryLineMode = normalizeCyclepathLineMode(rawProps.boundaryLineMode)
  const rawCenterLineStrokeWidth = rawProps.centerLineStrokeWidth
  const rawBoundaryLineStrokeWidth = rawProps.boundaryLineStrokeWidth
  const rawCenterLineDashLength = rawProps.centerLineDashLength
  const rawCenterLineGapLength = rawProps.centerLineGapLength
  const rawBoundaryLineDashLength = rawProps.boundaryLineDashLength
  const rawBoundaryLineGapLength = rawProps.boundaryLineGapLength
  const rawCenterLinePhase = rawProps.centerLinePhase
  const rawBoundaryLinePhase = rawProps.boundaryLinePhase
  const rawOverlaySide = rawProps.overlaySide
  const rawSafetyBufferWidth = rawProps.safetyBufferWidth

  return {
    pathType: normalizeCyclepathPathType(rawPathType),
    protectedPlacement: normalizeCyclepathProtectedPlacement(rawPathType, rawProtectedPlacement),
    overlaySide: normalizeCyclepathSide(rawOverlaySide),
    safetyBufferWidth: clampNonNegative(rawSafetyBufferWidth, DEFAULT_CYCLEPATH_SAFETY_BUFFER_WIDTH),
    ...(legacyLineMode && strip.variant === 'protected'
      ? { centerLineMode: legacyLineMode }
      : legacyLineMode
        ? { boundaryLineMode: legacyLineMode }
        : {}),
    ...(rawCenterLineMode ? { centerLineMode: rawCenterLineMode } : {}),
    ...(rawBoundaryLineMode ? { boundaryLineMode: rawBoundaryLineMode } : {}),
    ...(isFiniteNumber(rawCenterLineStrokeWidth) ? { centerLineStrokeWidth: normalizeLineMetric(rawCenterLineStrokeWidth, MARKING_RULES.lineWidths.otherRoads.schmalstrich) } : {}),
    ...(isFiniteNumber(rawBoundaryLineStrokeWidth) ? { boundaryLineStrokeWidth: normalizeLineMetric(rawBoundaryLineStrokeWidth, MARKING_RULES.lineWidths.otherRoads.schmalstrich) } : {}),
    ...(isFiniteNumber(rawCenterLineDashLength) ? { centerLineDashLength: normalizeLineMetric(rawCenterLineDashLength, 1.5) } : {}),
    ...(isFiniteNumber(rawCenterLineGapLength) ? { centerLineGapLength: normalizeLineMetric(rawCenterLineGapLength, 1.5) } : {}),
    ...(isFiniteNumber(rawBoundaryLineDashLength) ? { boundaryLineDashLength: normalizeLineMetric(rawBoundaryLineDashLength, 1) } : {}),
    ...(isFiniteNumber(rawBoundaryLineGapLength) ? { boundaryLineGapLength: normalizeLineMetric(rawBoundaryLineGapLength, 1) } : {}),
    ...(isFiniteNumber(rawCenterLinePhase) ? { centerLinePhase: rawCenterLinePhase } : {}),
    ...(isFiniteNumber(rawBoundaryLinePhase) ? { boundaryLinePhase: rawBoundaryLinePhase } : {}),
  }
}

export function getDefaultCyclepathBoundaryStrokeWidth(variant: Strip['variant']): number {
  return variant === 'lane-marked'
    ? MARKING_RULES.lineWidths.otherRoads.breitstrich
    : MARKING_RULES.lineWidths.otherRoads.schmalstrich
}

export function getDefaultCyclepathCenterStrokeWidth(): number {
  return MARKING_RULES.lineWidths.otherRoads.schmalstrich
}

export function getDefaultCyclepathBoundaryDashPattern(variant: Strip['variant']): [number, number] {
  if (variant === 'advisory') return [1, 1]
  if (variant === 'lane-marked') return [0.5, 0.2]
  return [1.5, 1.5]
}

export function getDefaultCyclepathCenterDashPattern(): [number, number] {
  return [1.5, 1.5]
}

export function isTwoWayCyclepath(pathType: CyclepathPathType | undefined): boolean {
  return pathType === 'two-way'
}

export function getCyclepathOverlaySide(strip: Strip): CyclepathSide {
  return getCyclepathStripProps(strip).overlaySide ?? 'right'
}

export function resolveCyclepathBoundaryLineMode(
  variant: Strip['variant'],
  rawMode: CyclepathLineMode | undefined,
): CyclepathLineMode {
  if (rawMode === 'dashed' || rawMode === 'solid' || rawMode === 'none') return rawMode
  if (variant === 'advisory') return 'dashed'
  if (variant === 'lane-marked') return 'solid'
  return 'none'
}

export function resolveCyclepathCenterLineMode(
  variant: Strip['variant'],
  rawMode: CyclepathLineMode | undefined,
  pathType: CyclepathPathType | undefined,
): CyclepathLineMode {
  if (rawMode === 'dashed' || rawMode === 'solid' || rawMode === 'none') return rawMode
  if (variant === 'protected') return isTwoWayCyclepath(pathType) ? 'dashed' : 'none'
  return 'none'
}

export function resolveCyclepathBoundaryStrokeWidth(
  variant: Strip['variant'],
  rawWidth: number | undefined,
): number {
  return normalizeLineMetric(rawWidth, getDefaultCyclepathBoundaryStrokeWidth(variant))
}

export function resolveCyclepathCenterStrokeWidth(rawWidth: number | undefined): number {
  return normalizeLineMetric(rawWidth, getDefaultCyclepathCenterStrokeWidth())
}

export function resolveCyclepathBoundaryDashPattern(
  variant: Strip['variant'],
  rawDashLength: number | undefined,
  rawGapLength: number | undefined,
): [number, number] {
  const [defaultDash, defaultGap] = getDefaultCyclepathBoundaryDashPattern(variant)
  return [
    normalizeLineMetric(rawDashLength, defaultDash),
    normalizeLineMetric(rawGapLength, defaultGap),
  ]
}

export function resolveCyclepathCenterDashPattern(
  rawDashLength: number | undefined,
  rawGapLength: number | undefined,
): [number, number] {
  const [defaultDash, defaultGap] = getDefaultCyclepathCenterDashPattern()
  return [
    normalizeLineMetric(rawDashLength, defaultDash),
    normalizeLineMetric(rawGapLength, defaultGap),
  ]
}
