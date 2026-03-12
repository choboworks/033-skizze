// src/modules/library/assets/verkehrsregelungAssets.ts
import type { AssetBaseMeta } from '../libraryManifest'

export const VERKEHRSREGELUNG_ASSETS: AssetBaseMeta[] = [
 
    {
    id: 'vr_gefahr_kurve_links',
    label: 'Gefahrzeichen: Kurve (links)',
    category: 'verkehrsregelung',
    subcategory: 'vr_gefahrzeichen',
    tags: ['gefahrzeichen', 'kurve', 'links'],
    searchKeywords: ['gefahrzeichen kurve links'],
    popularity: 70,
  },
  {
    id: 'vr_vorschrift_vorfahrt_achten',
    label: 'Vorschriftzeichen: Vorfahrt gewähren',
    category: 'verkehrsregelung',
    subcategory: 'vr_vorschriftzeichen',
    tags: ['vorschriftzeichen', 'vorfahrt gewähren'],
    searchKeywords: ['vorfahrt achten'],
    popularity: 80,
  },
  {
    id: 'vr_richt_vorfahrtstrasse',
    label: 'Richtzeichen: Vorfahrtstraße',
    category: 'verkehrsregelung',
    subcategory: 'vr_richtzeichen',
    tags: ['richtzeichen', 'vorfahrtstraße'],
    searchKeywords: ['vorfahrtstraße'],
    popularity: 80,
  },
  {
    id: 'vr_ampel_standard',
    label: 'Lichtzeichenanlage (Standard)',
    category: 'verkehrsregelung',
    subcategory: 'vr_ampeln',
    tags: ['ampel'],
    searchKeywords: ['ampel'],
    popularity: 85,
  },
  {
    id: 'vr_bodenmarkierung_haltlinie',
    label: 'Bodenmarkierung: Haltlinie',
    category: 'verkehrsregelung',
    subcategory: 'vr_bodenmarkierungen',
    tags: ['haltlinie', 'markierung'],
    searchKeywords: ['haltlinie'],
    popularity: 75,
  },
  // TODO: Hier später deine komplette StVO-Liste 1:1 einfügen
]

