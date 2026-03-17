import {
  Route,
  Car,
  Building,
  TrafficCone,
  Trees,
  Ruler,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface LibraryCategoryDef {
  id: string
  label: string
  icon: LucideIcon
}

export const LIBRARY_CATEGORIES: LibraryCategoryDef[] = [
  { id: 'smartroads', label: 'SmartRoads', icon: Route },
  { id: 'vehicles', label: 'Fahrzeuge', icon: Car },
  { id: 'infrastructure', label: 'Infrastruktur', icon: Building },
  { id: 'traffic-regulation', label: 'Verkehrsregelung', icon: TrafficCone },
  { id: 'environment', label: 'Umgebung', icon: Trees },
  { id: 'markings', label: 'Markierungen', icon: Ruler },
]
