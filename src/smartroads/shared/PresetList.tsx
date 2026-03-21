import type { StraightRoadState } from '../types'
import { createStrip, generateLaneMarkings } from '../constants'

// ============================================================
// Preset definitions for straight road segments
// ============================================================

interface PresetDef {
  id: string
  label: string
  create: () => StraightRoadState
}

export const STRAIGHT_PRESETS: PresetDef[] = [
  {
    id: 'residential', label: 'Erschließungsstr.',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'),
        createStrip('lane', 'standard', 'up'),
        createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 30, strips, markings: [], roadClass: 'innerorts' }
    },
  },
  {
    id: 'collector', label: 'Sammelstraße',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'), createStrip('cyclepath', 'advisory'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
        createStrip('cyclepath', 'advisory'), createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 30, strips, markings: generateLaneMarkings(strips, 'standard-dash'), roadClass: 'innerorts' }
    },
  },
  {
    id: 'arterial', label: 'Hauptverkehrsstr.',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'), createStrip('cyclepath', 'protected'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'),
        createStrip('green'),
        createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'),
        createStrip('cyclepath', 'protected'), createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 30, strips, markings: generateLaneMarkings(strips, 'standard-dash'), roadClass: 'innerorts' }
    },
  },
  {
    id: 'rural', label: 'Landstraße',
    create: () => {
      const strips = [
        createStrip('shoulder'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
        createStrip('shoulder'),
      ]
      return { length: 40, strips, markings: generateLaneMarkings(strips, 'rural-dash'), roadClass: 'ausserorts' }
    },
  },
  {
    id: 'highway', label: 'Autobahn',
    create: () => {
      const strips = [
        createStrip('shoulder'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'up'),
        createStrip('median', 'barrier'),
        createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'), createStrip('lane', 'standard', 'down'),
        createStrip('shoulder'),
      ]
      return { length: 50, strips, markings: generateLaneMarkings(strips, 'autobahn-dash', 0.15), roadClass: 'autobahn' }
    },
  },
  {
    id: 'tempo30', label: 'Tempo 30',
    create: () => {
      const strips = [
        createStrip('sidewalk'), createStrip('curb'),
        createStrip('lane', 'standard', 'up'), createStrip('lane', 'standard', 'down'),
        createStrip('curb'), createStrip('sidewalk'),
      ]
      return { length: 25, strips, markings: generateLaneMarkings(strips, 'standard-dash'), roadClass: 'innerorts' }
    },
  },
]
