import type { BusStripProps, LaneStripProps, ParkingStripProps, Strip, StripPropsByType, StripType } from './types'

export const DEFAULT_PARKING_BAY_LENGTH = 5

const DEFAULT_STRIP_PROPS: { [K in StripType]: StripPropsByType[K] } = {
  lane: { startOffset: 0, endOffset: 0 },
  sidewalk: {},
  cyclepath: {},
  parking: { bayLength: DEFAULT_PARKING_BAY_LENGTH },
  green: {},
  curb: {},
  gutter: {},
  median: {},
  bus: { startOffset: 0, endOffset: 0 },
  tram: {},
  shoulder: {},
}

export function getDefaultStripProps<T extends StripType>(type: T): StripPropsByType[T] {
  return { ...DEFAULT_STRIP_PROPS[type] }
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

  return {
    ...DEFAULT_STRIP_PROPS.lane,
    ...((strip.props as LaneStripProps | undefined) ?? {}),
  }
}

export function getBusStripProps(strip: Strip): BusStripProps {
  if (strip.type !== 'bus') {
    return { startOffset: 0, endOffset: 0 }
  }

  return {
    ...DEFAULT_STRIP_PROPS.bus,
    ...((strip.props as BusStripProps | undefined) ?? {}),
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
  if (strip.type === 'lane' || strip.type === 'bus') {
    const hasExplicitOffsets = getStripStartOffset(strip) > 0 || getStripEndOffset(strip) > 0
    if (!hasExplicitOffsets && strip.height != null) {
      return strip.height
    }
    const visible = roadLength - getStripStartOffset(strip) - getStripEndOffset(strip)
    return Math.max(0.5, Math.round(visible * 100) / 100)
  }

  return strip.height ?? roadLength
}

export function getParkingStripProps(strip: Strip): ParkingStripProps {
  if (strip.type !== 'parking') {
    return { bayLength: DEFAULT_PARKING_BAY_LENGTH }
  }
  return {
    ...DEFAULT_STRIP_PROPS.parking,
    ...((strip.props as ParkingStripProps | undefined) ?? {}),
  }
}
