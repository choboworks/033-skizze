import type { RoadClass, StraightRoadState, Strip } from '../types'
import { createLayerOrder, createStrip, generateLaneMarkings, ROAD_CLASS_CONFIG } from '../constants'

// ============================================================
// Preset definitions for straight road segments
// ============================================================

interface PresetDef {
  id: string
  label: string
  create: () => StraightRoadState
}

function buildPresetState(roadClass: RoadClass, length: number, strips: Strip[]): StraightRoadState {
  const config = ROAD_CLASS_CONFIG[roadClass]
  const markings = generateLaneMarkings(strips, config.centerlineVariant, config.strokeWidth, length)

  return {
    length,
    strips,
    markings,
    layerOrder: createLayerOrder(strips, markings),
    roadClass,
  }
}

export const STRAIGHT_PRESETS: PresetDef[] = [
  {
    id: 'residential',
    label: 'Erschliessungsstr.',
    create: () => {
      const strips = [
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('lane', 'standard', 'up', 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
      ]

      return {
        length: 30,
        strips,
        markings: [],
        layerOrder: createLayerOrder(strips, []),
        roadClass: 'innerorts',
      }
    },
  },
  {
    id: 'collector',
    label: 'Sammelstrasse',
    create: () => {
      const strips = [
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('cyclepath', 'advisory', undefined, 'innerorts'),
        createStrip('lane', 'standard', 'up', 'innerorts'),
        createStrip('lane', 'standard', 'down', 'innerorts'),
        createStrip('cyclepath', 'advisory', undefined, 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
      ]

      return buildPresetState('innerorts', 30, strips)
    },
  },
  {
    id: 'arterial',
    label: 'Hauptverkehrsstr.',
    create: () => {
      const strips = [
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('cyclepath', 'protected', undefined, 'innerorts'),
        createStrip('lane', 'standard', 'up', 'innerorts'),
        createStrip('lane', 'standard', 'up', 'innerorts'),
        createStrip('green', 'standard', undefined, 'innerorts'),
        createStrip('lane', 'standard', 'down', 'innerorts'),
        createStrip('lane', 'standard', 'down', 'innerorts'),
        createStrip('cyclepath', 'protected', undefined, 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
      ]

      return buildPresetState('innerorts', 30, strips)
    },
  },
  {
    id: 'rural',
    label: 'Landstrasse',
    create: () => {
      const strips = [
        createStrip('shoulder', 'standard', undefined, 'ausserorts'),
        createStrip('lane', 'standard', 'up', 'ausserorts'),
        createStrip('lane', 'standard', 'down', 'ausserorts'),
        createStrip('shoulder', 'standard', undefined, 'ausserorts'),
      ]

      return buildPresetState('ausserorts', 40, strips)
    },
  },
  {
    id: 'highway',
    label: 'Autobahn',
    create: () => {
      const strips = [
        createStrip('shoulder', 'standard', undefined, 'autobahn'),
        createStrip('lane', 'standard', 'up', 'autobahn'),
        createStrip('lane', 'standard', 'up', 'autobahn'),
        createStrip('lane', 'standard', 'up', 'autobahn'),
        createStrip('median', 'barrier', undefined, 'autobahn'),
        createStrip('lane', 'standard', 'down', 'autobahn'),
        createStrip('lane', 'standard', 'down', 'autobahn'),
        createStrip('lane', 'standard', 'down', 'autobahn'),
        createStrip('shoulder', 'standard', undefined, 'autobahn'),
      ]

      return buildPresetState('autobahn', 50, strips)
    },
  },
  {
    id: 'tempo30',
    label: 'Tempo 30',
    create: () => {
      const strips = [
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('lane', 'standard', 'up', 'innerorts'),
        createStrip('lane', 'standard', 'down', 'innerorts'),
        createStrip('curb', 'standard', undefined, 'innerorts'),
        createStrip('sidewalk', 'standard', undefined, 'innerorts'),
      ]

      return buildPresetState('innerorts', 25, strips)
    },
  },
]
