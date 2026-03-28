export const LINE_STYLES = [
  { id: 'solid' as const, label: 'Linie' },
  { id: 'dashed' as const, label: 'Striche' },
  { id: 'dotted' as const, label: 'Punkte' },
]

export const MARKING_TYPE_LABELS: Record<string, string> = {
  centerline: 'Leitlinie',
  laneboundary: 'Begrenzung',
  crosswalk: 'Zebrastreifen',
  stopline: 'Haltelinie',
  arrow: 'Richtungspfeil',
  'blocked-area': 'Sperrfläche',
  'yield-line': 'Wartelinie',
  'bike-crossing': 'Furtquerung',
  'bus-stop': 'Bushaltestelle',
  'speed-limit': 'Tempo',
  'parking-marking': 'Parkfläche',
  'free-line': 'Freie Linie',
  'traffic-island': 'Verkehrsinsel',
}
