import type { CanvasObject } from '@/types'

const TYPE_NAMES: Record<string, string> = {
  rect: 'Rechteck',
  'rounded-rect': 'Abgerundet',
  ellipse: 'Ellipse',
  triangle: 'Dreieck',
  line: 'Linie',
  arrow: 'Pfeil',
  polygon: 'Polygon',
  path: 'Pfad',
  star: 'Stern',
  freehand: 'Freihand',
  text: 'Text',
  image: 'Bild',
  dimension: 'Bemaßung',
  smartroad: 'Straße',
}

export function objectDisplayName(obj: CanvasObject, index: number): string {
  if (obj.label) return obj.label
  return `${TYPE_NAMES[obj.type] || obj.type} ${index + 1}`
}
