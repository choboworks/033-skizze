export const ROOT_RULEBOOK = 'Nachschlagewerk_Strasseninfrastruktur_Deutschland.md'

export interface RuleSourceRef {
  kind: 'reference' | 'editor-default'
  document?: string
  section: string
  detail?: string
  note?: string
}

export function reference(section: string, detail?: string, note?: string): RuleSourceRef {
  return {
    kind: 'reference',
    document: ROOT_RULEBOOK,
    section,
    ...(detail ? { detail } : {}),
    ...(note ? { note } : {}),
  }
}

export function editorDefault(note: string): RuleSourceRef {
  return {
    kind: 'editor-default',
    section: 'app-default',
    note,
  }
}
