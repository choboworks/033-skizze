// src/modules/ui/overlayTokens.ts
// Token-basierter Shim für Legacy-Aufrufer.
// Empfehlung: langfristig <Button />-Varianten statt Klassenstrings verwenden.

export const CHIP_BASE =
  'h-8 px-2 inline-flex items-center justify-center rounded-md text-sm transition select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]'

export const CHIP_IDLE =
  'border border-[var(--border)] text-[var(--text)] bg-[var(--panel)] hover:bg-[var(--panel-elev)]'

export const CHIP_ACTIVE =
  'border border-[var(--primary)] bg-[var(--panel)] shadow-sm text-[var(--text)]'

export const ICON_BASE =
  'w-8 h-8 inline-flex items-center justify-center rounded-md text-sm transition select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]'

export const ICON_IDLE = CHIP_IDLE
export const ICON_ACTIVE = CHIP_ACTIVE
