// src/modules/library/roads/roadPresets.ts

import type { RoadTemplate } from './types'

/**
 * Vordefinierte Straßen für die Library
 * 
 * VEREINFACHT: Keine bidirectional-Logik mehr.
 * User konfiguriert Linien frei per Klick im Inspector.
 */
export const roadPresets: RoadTemplate[] = [
  /* ========================================================================= */
  /* GERADE STRASSE                                                            */
  /* ========================================================================= */
  
  {
    id: 'road-strasse-straight',
    label: 'Gerade Straße',
    templateKey: 'road-straight-2lane',
    defaultConfig: {
      category: 'strasse',
      shape: 'straight',
      width: 80,
      length: 200,
      lanes: 2,
      
      // Eine Linie zwischen den 2 Spuren: gestrichelt
      lines: [{ type: 'dashed' }],
      defaultLineType: 'dashed',
      
      surface: {
        type: 'asphalt',
      },
    }
  },
  
  /* ========================================================================= */
  /* KURVEN                                                                    */
  /* ========================================================================= */
  
  {
    id: 'road-strasse-curve',
    label: 'Kurve Straße',
    templateKey: 'road-curve',
    defaultConfig: {
      category: 'strasse',
      shape: 'curve',
      width: 80,
      length: 200,
      lanes: 2,
      
      lines: [{ type: 'dashed' }],
      defaultLineType: 'dashed',
      
      curve: {
        angle: 90,
        direction: 'right',
        radius: 100,
      },
      
      surface: {
        type: 'asphalt',
      },
    }
  },
]

/**
 * Hilfsfunktion: Preset nach ID finden
 */
export function getRoadPreset(id: string): RoadTemplate | undefined {
  return roadPresets.find(p => p.id === id)
}
