import pdh from './dienststellenPDH.json'
import pdbs from './dienststellenPDBS.json'
import pdgoe from './dienststellenPDGOE.json'
import pdos from './dienststellenPDOS.json'
import pdlue from './dienststellenPDLUE.json'
import pdol from './dienststellenPDOL.json'
import sonder from './dienststellenSONDER.json'

export type Dienststelle = {
  id: string
  name: string
  adresse: string
  telefon: string
}

const all: Dienststelle[] = [
  ...(pdh as Dienststelle[]),
  ...(pdbs as Dienststelle[]),
  ...(pdgoe as Dienststelle[]),
  ...(pdos as Dienststelle[]),
  ...(pdlue as Dienststelle[]),
  ...(pdol as Dienststelle[]),
  ...(sonder as Dienststelle[]),
]

// optional: sortiert nach Name
all.sort((a, b) => a.name.localeCompare(b.name, 'de'))

export default all
export const DIENSTSTELLEN = all
