// src/modules/library/roads/inspector/hooks/useRoadCalculations.ts
// Hook für Breiten-, Linien- und Skalierungsberechnungen

import { useMemo } from 'react'
import type { SmartRoadConfig, LineType, RoadsideElementType } from '../../types'
import { getActiveOrder, getElementWidth } from '../../types'
import type { LaneLineInfo } from '../previewTypes'

/**
 * Berechne physische Breite eines Linientyps
 */
function getLinePhysicalWidth(type: LineType, configWidth?: number): number {
  if (type === 'green-strip' || type === 'barrier') {
    return configWidth || 12
  }
  if (type === 'double-solid' || type === 'solid-dashed' || type === 'dashed-solid') {
    return 6
  }
  return 0
}

/** Position eines Seitenelements in der Preview */
export type SideElementPosition = {
  type: RoadsideElementType
  x: number      // X-Position (relativ zum Seitenbereich-Start)
  width: number   // Breite des Elements
}

type RoadCalculations = {
  // Order-basierte Positionen
  leftElements: SideElementPosition[]
  rightElements: SideElementPosition[]
  
  // Kompatibilität: Gesamtbreiten
  leftSideWidth: number
  rightSideWidth: number
  
  // Einzelbreiten (legacy, für bestehende Komponenten)
  leftSidewalkWidth: number
  leftCurbWidth: number
  leftGreenStripWidth: number
  leftCyclePathWidth: number
  leftBarrierWidth: number
  leftEmergencyLaneWidth: number
  leftParkingWidth: number
  rightSidewalkWidth: number
  rightCurbWidth: number
  rightGreenStripWidth: number
  rightCyclePathWidth: number
  rightBarrierWidth: number
  rightEmergencyLaneWidth: number
  rightParkingWidth: number
  
  // Gesamt
  totalWidth: number
  
  // Skalierung
  scale: number
  displayWidth: number
  displayHeight: number
  
  // Linien zwischen Spuren
  lines: LaneLineInfo[]
  showLaneLines: boolean
  
  // Spur-Geometrie
  laneWidth: number
  totalPhysicalWidth: number
  
  // Flags
  isAsphalt: boolean
}

function buildElementPositions(config: SmartRoadConfig, side: 'left' | 'right'): SideElementPosition[] {
  const sc = side === 'left' ? config.leftSide : config.rightSide
  if (!sc) return []
  
  const order = getActiveOrder(sc)
  const positions: SideElementPosition[] = []
  let x = 0
  
  for (const el of order) {
    const w = getElementWidth(sc, el)
    if (w > 0) {
      positions.push({ type: el, x, width: w })
      x += w
    }
  }
  
  return positions
}

function getWidthByType(elements: SideElementPosition[], type: RoadsideElementType): number {
  return elements.find(e => e.type === type)?.width || 0
}

export function useRoadCalculations(config: SmartRoadConfig): RoadCalculations {
  return useMemo(() => {
    // ========== ORDER-BASIERTE POSITIONEN ==========
    const leftElements = buildElementPositions(config, 'left')
    const rightElements = buildElementPositions(config, 'right')
    
    const leftSideWidth = leftElements.reduce((s, e) => s + e.width, 0)
    const rightRampWidth = config.rightSide?.ramp ? 30 : 0
    const rightSideWidth = rightElements.reduce((s, e) => s + e.width, 0) + rightRampWidth
    
    // Legacy Einzelbreiten (für bestehende Komponenten die sie noch brauchen)
    const leftSidewalkWidth = getWidthByType(leftElements, 'sidewalk')
    const leftCurbWidth = getWidthByType(leftElements, 'curb')
    const leftGreenStripWidth = getWidthByType(leftElements, 'greenStrip')
    const leftCyclePathWidth = getWidthByType(leftElements, 'cyclePath')
    const leftBarrierWidth = getWidthByType(leftElements, 'barrier')
    const leftEmergencyLaneWidth = getWidthByType(leftElements, 'emergencyLane')
    const leftParkingWidth = getWidthByType(leftElements, 'parking')
    
    const rightSidewalkWidth = getWidthByType(rightElements, 'sidewalk')
    const rightCurbWidth = getWidthByType(rightElements, 'curb')
    const rightGreenStripWidth = getWidthByType(rightElements, 'greenStrip')
    const rightCyclePathWidth = getWidthByType(rightElements, 'cyclePath')
    const rightBarrierWidth = getWidthByType(rightElements, 'barrier')
    const rightEmergencyLaneWidth = getWidthByType(rightElements, 'emergencyLane')
    const rightParkingWidth = getWidthByType(rightElements, 'parking')
    
    const totalWidth = leftSideWidth + config.width + rightSideWidth
    
    // ========== SKALIERUNG ==========
    const maxWidth = 600
    const maxHeight = 700
    const scaleX = maxWidth / totalWidth
    const scaleY = maxHeight / config.length
    const scale = Math.min(scaleX, scaleY)
    const displayWidth = totalWidth * scale
    const displayHeight = config.length * scale
    
    // ========== LINIEN ZWISCHEN SPUREN ==========
    const lanes = config.lanes
    const configLines = config.lines || []
    const defaultType = config.defaultLineType || 'dashed'
    
    let totalPhysicalWidth = 0
    for (let i = 0; i < lanes - 1; i++) {
      const line = configLines[i]
      const lineType = (line?.type || defaultType) as LineType
      totalPhysicalWidth += getLinePhysicalWidth(lineType, line?.width)
    }
    
    const availableWidth = config.width - totalPhysicalWidth
    const laneWidth = lanes > 0 ? availableWidth / lanes : config.width
    
    const lines: LaneLineInfo[] = []
    let currentX = 0
    
    for (let laneIdx = 0; laneIdx < lanes; laneIdx++) {
      currentX += laneWidth
      
      if (laneIdx < lanes - 1) {
        const line = configLines[laneIdx]
        const lineType = (line?.type || defaultType) as LineType
        const physWidth = getLinePhysicalWidth(lineType, line?.width)
        const lineX = currentX + physWidth / 2
        
        lines.push({
          x: lineX,
          index: laneIdx,
          type: lineType,
          width: line?.width,
          isPhysical: physWidth > 0,
        })
        
        currentX += physWidth
      }
    }
    
    // ========== FLAGS ==========
    const isAsphalt = (config.surface?.type || 'asphalt') === 'asphalt'
    const showLaneLines = isAsphalt && lines.length > 0
    
    return {
      leftElements,
      rightElements,
      leftSidewalkWidth,
      leftCurbWidth,
      leftGreenStripWidth,
      leftCyclePathWidth,
      leftBarrierWidth,
      leftEmergencyLaneWidth,
      leftParkingWidth,
      leftSideWidth,
      rightSidewalkWidth,
      rightCurbWidth,
      rightGreenStripWidth,
      rightCyclePathWidth,
      rightBarrierWidth,
      rightEmergencyLaneWidth,
      rightParkingWidth,
      rightSideWidth,
      totalWidth,
      scale,
      displayWidth,
      displayHeight,
      lines,
      showLaneLines,
      laneWidth,
      totalPhysicalWidth,
      isAsphalt,
    }
  }, [config])
}
