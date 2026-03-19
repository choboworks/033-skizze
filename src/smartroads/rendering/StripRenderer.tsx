import type { Strip } from '../types'
import { LaneStrip } from './strips/LaneStrip'
import { SidewalkStrip } from './strips/SidewalkStrip'
import { CyclePathStrip } from './strips/CyclePathStrip'
import { ParkingStrip } from './strips/ParkingStrip'
import { GreenStrip } from './strips/GreenStrip'
import { CurbStrip } from './strips/CurbStrip'
import { GenericStrip } from './strips/GenericStrip'

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
  length: number
}

export function StripRenderer({ strip, x, length }: Props) {
  const w = strip.width + AA
  switch (strip.type) {
    case 'lane':
    case 'bus':
      return <LaneStrip x={x} width={w} length={length} direction={strip.direction} />
    case 'sidewalk':
      return <SidewalkStrip x={x} width={w} length={length} />
    case 'cyclepath':
      return <CyclePathStrip x={x} width={w} length={length} variant={strip.variant} />
    case 'parking':
      return <ParkingStrip x={x} width={w} length={length} />
    case 'green':
      return <GreenStrip x={x} width={w} length={length} />
    case 'curb':
    case 'gutter':
      return <CurbStrip x={x} width={w} length={length} />
    default:
      return <GenericStrip x={x} width={w} length={length} type={strip.type} />
  }
}
