import type { CyclepathSide, Strip } from '../types'
import { LaneStrip } from './strips/LaneStrip'
import { SidewalkStrip } from './strips/SidewalkStrip'
import { CyclePathStrip } from './strips/CyclePathStrip'
import { ParkingStrip } from './strips/ParkingStrip'
import { GreenStrip } from './strips/GreenStrip'
import { CurbStrip } from './strips/CurbStrip'
import { GenericStrip } from './strips/GenericStrip'
import { getCurbStripProps, getCyclepathStripProps, getParkingStripProps } from '../stripProps'

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
  renderWidth?: number
  overlaySide?: CyclepathSide
  safetyBufferWidth?: number
  facingSide?: CyclepathSide
}

export function StripRenderer({ strip, x, y = 0, length, renderWidth, overlaySide, safetyBufferWidth, facingSide }: Props) {
  const baseWidth = Math.max(0.1, Number.isFinite(renderWidth ?? strip.width) ? (renderWidth ?? strip.width) : 0.1)
  const safeWidth = strip.type === 'cyclepath' ? baseWidth : baseWidth + AA
  const safeLength = Math.max(0.5, Number.isFinite(length) ? length : 0.5)
  switch (strip.type) {
    case 'lane':
    case 'bus':
      return <LaneStrip x={x} y={y} width={safeWidth} length={safeLength} color={strip.color} />
    case 'sidewalk':
      return <SidewalkStrip x={x} y={y} width={safeWidth} length={safeLength} variant={strip.variant} color={strip.color} />
    case 'cyclepath': {
      const cyclepathProps = getCyclepathStripProps(strip)
      return (
        <CyclePathStrip
          x={x}
          y={y}
          width={safeWidth}
          length={safeLength}
          variant={strip.variant}
          color={strip.color}
          overlaySide={overlaySide}
          safetyBufferWidth={safetyBufferWidth}
          pathType={cyclepathProps.pathType}
          centerLineMode={cyclepathProps.centerLineMode}
          boundaryLineMode={cyclepathProps.boundaryLineMode}
          centerLineStrokeWidth={cyclepathProps.centerLineStrokeWidth}
          boundaryLineStrokeWidth={cyclepathProps.boundaryLineStrokeWidth}
          centerLineDashLength={cyclepathProps.centerLineDashLength}
          centerLineGapLength={cyclepathProps.centerLineGapLength}
          boundaryLineDashLength={cyclepathProps.boundaryLineDashLength}
          boundaryLineGapLength={cyclepathProps.boundaryLineGapLength}
          centerLinePhase={cyclepathProps.centerLinePhase}
          boundaryLinePhase={cyclepathProps.boundaryLinePhase}
        />
      )
    }
    case 'parking':
      return <ParkingStrip x={x} y={y} width={safeWidth} length={safeLength} bayLength={getParkingStripProps(strip).bayLength} color={strip.color} />
    case 'green':
      return <GreenStrip x={x} y={y} width={safeWidth} length={safeLength} color={strip.color} />
    case 'curb': {
      const curbProps = getCurbStripProps(strip)
      return (
        <CurbStrip
          x={x}
          y={y}
          width={safeWidth}
          length={safeLength}
          facingSide={facingSide}
          kind={curbProps.kind}
          loweredSectionLength={curbProps.loweredSectionLength}
          loweredSectionOffset={curbProps.loweredSectionOffset}
        />
      )
    }
    case 'gutter':
      return <CurbStrip x={x} y={y} width={safeWidth} length={safeLength} color={strip.color} facingSide={facingSide} />
    default:
      return <GenericStrip x={x} y={y} width={safeWidth} length={safeLength} type={strip.type} color={strip.color} />
  }
}
