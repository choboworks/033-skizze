import type { DocumentMeta } from '@/types'

/** Required metadata fields for export */
const REQUIRED_FIELDS: (keyof DocumentMeta)[] = ['caseNumber', 'date', 'department', 'officer']

/** Check if all required metadata fields are filled */
export function isMetadataComplete(doc: DocumentMeta): boolean {
  return REQUIRED_FIELDS.every((key) => doc[key]?.toString().trim() !== '')
}

/** Get list of missing required field labels */
export function getMissingFields(doc: DocumentMeta): string[] {
  const labels: Record<string, string> = {
    caseNumber: 'Vorgangsnummer',
    date: 'Datum',
    department: 'Dienststelle',
    officer: 'Sachbearbeiter/in',
  }
  return REQUIRED_FIELDS
    .filter((key) => !doc[key]?.toString().trim())
    .map((key) => labels[key] || key)
}
