import type { Strip } from '../types'
import { LaneStrip } from './strips/LaneStrip'
import { SidewalkStrip } from './strips/SidewalkStrip'
import { CyclePathStrip } from './strips/CyclePathStrip'
import { ParkingStrip } from './strips/ParkingStrip'
import { GreenStrip } from './strips/GreenStrip'
import { CurbStrip } from './strips/CurbStrip'
import { GenericStrip } from './strips/GenericStrip'
import { getParkingStripProps } from '../stripProps'

// ============================================================
// StripRenderer – Dispatches to the correct Konva component
// Used in both the Editor top-down view AND the main canvas.
//
// Each strip is rendered slightly wider (+0.02m) to prevent
// anti-aliasing seams between adjacent Konva Rects.
// ============================================================

// Anti-aliasing overlap: 2cm — invisible at road scale, eliminates seams
const AA = 0.02

interface Props {
  strip: Strip
  x: number
  y?: number
  length: number
}

export function StripRenderer({ strip, x, y = 0, length }: Props) {
  const w = strip.width + AA
  switch (strip.type) {
    case 'lane':
    case 'bus':
      return <LaneStrip x={x} y={y} width={w} length={length} />
    case 'sidewalk':
      return <SidewalkStrip x={x} y={y} width={w} length={length} variant={strip.variant} />
    case 'cyclepath':
      return <CyclePathStrip x={x} y={y} width={w} length={length} variant={strip.variant} />
    case 'parking':
      return <ParkingStrip x={x} y={y} width={w} length={length} bayLength={getParkingStripProps(strip).bayLength} />
    case 'green':
      return <GreenStrip x={x} y={y} width={w} length={length} />
    case 'curb':
    case 'gutter':
      return <CurbStrip x={x} y={y} width={w} length={length} />
    default:
      return <GenericStrip x={x} y={y} width={w} length={length} type={strip.type} />
  }
}
