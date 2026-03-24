import type { StripType } from '../../types'
import { getBusPropertySections } from './stripDefinitions/bus'
import { getCurbPropertySections } from './stripDefinitions/curb'
import { getCyclepathPropertySections } from './stripDefinitions/cyclepath'
import { getGreenPropertySections } from './stripDefinitions/green'
import { getGutterPropertySections } from './stripDefinitions/gutter'
import { getLanePropertySections } from './stripDefinitions/lane'
import { getMedianPropertySections } from './stripDefinitions/median'
import { getParkingPropertySections } from './stripDefinitions/parking'
import { getShoulderPropertySections } from './stripDefinitions/shoulder'
import { getSidewalkPropertySections } from './stripDefinitions/sidewalk'
import { getTramPropertySections } from './stripDefinitions/tram'
import { getPathPropertySections } from './stripDefinitions/path'
import type { StripPropertyContext, StripPropertySectionDefinition } from './stripDefinitions/types'

export type {
  StripChoiceFieldDefinition,
  StripChoiceOption,
  StripNumberFieldDefinition,
  StripPropertyContext,
  StripPropertyFieldDefinition,
  StripPropertySectionDefinition,
} from './stripDefinitions/types'

const STRIP_PROPERTY_BUILDERS: Record<StripType, (context: StripPropertyContext) => StripPropertySectionDefinition[]> = {
  lane: getLanePropertySections,
  bus: getBusPropertySections,
  cyclepath: getCyclepathPropertySections,
  sidewalk: getSidewalkPropertySections,
  parking: getParkingPropertySections,
  green: getGreenPropertySections,
  median: getMedianPropertySections,
  tram: getTramPropertySections,
  curb: getCurbPropertySections,
  gutter: getGutterPropertySections,
  shoulder: getShoulderPropertySections,
  path: getPathPropertySections,
}

export function getStripPropertySections(context: StripPropertyContext): StripPropertySectionDefinition[] {
  return STRIP_PROPERTY_BUILDERS[context.strip.type](context)
}
