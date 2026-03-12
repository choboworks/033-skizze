// src/modules/library/roads/inspector/VisualRoadInspector.tsx
// Hauptkomponente für den Straßen-Inspector
// Layout: Links (Markierungen etc.) | Mitte (Preview) | Rechts (Kontext-Panel)

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { SmartRoadConfig } from '../types'
import { X } from 'lucide-react'
import { MarkingsPanel } from './components/MarkingsPalette'
import { MinimalToolbar } from './components/MinimalToolbar'
import { InteractiveRoadPreview } from './InteractiveRoadPreview'
import { ContextPanel } from './components/ContextPanel'
import type { PopupPosition } from './previewTypes'

type Props = {
  open: boolean
  config: SmartRoadConfig
  onClose: () => void
  onUpdate: (config: SmartRoadConfig, preserveSize?: boolean) => void
}

export default function VisualRoadInspector({ open, config, onClose, onUpdate }: Props) {
  const [localConfig, setLocalConfig] = useState<SmartRoadConfig>(config)
  const [initialConfig, setInitialConfig] = useState<SmartRoadConfig | null>(null)
  const [contextPopup, setContextPopup] = useState<PopupPosition>(null)

  const handleClose = useCallback(() => {
    setInitialConfig(null)
    setContextPopup(null)
    onClose()
  }, [onClose])

  // Config in lokalen State laden
  useEffect(() => {
    if (config) {
      let loadedConfig = { ...config }
      let needsUpdate = false
      
      if (!initialConfig) {
        setInitialConfig(JSON.parse(JSON.stringify(config)))
      }
      
      // Auto-Korrektur: Bei nicht-Asphalt Belägen Linien entfernen
      if (loadedConfig.surface?.type && loadedConfig.surface.type !== 'asphalt') {
        const hasLines = loadedConfig.lines?.some(l => l.type !== 'none')
        if (hasLines) {
          loadedConfig = {
            ...loadedConfig,
            lines: loadedConfig.lines?.map(() => ({ type: 'none' as const })),
            defaultLineType: 'none',
          }
          needsUpdate = true
        }
      }
      
      setLocalConfig(loadedConfig)
      if (needsUpdate) {
        onUpdate(loadedConfig, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  // ESC zum Schließen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (contextPopup) {
          setContextPopup(null)
        } else {
          handleClose()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose, contextPopup])

  if (!open || !localConfig) return null

  const categoryLabel = 'Straße'

  // Partial Update Handler
  const updatePartial = (updates: Partial<SmartRoadConfig>) => {
    const updated = { ...localConfig }
    
    Object.keys(updates).forEach((key) => {
      const k = key as keyof SmartRoadConfig
      const value = updates[k]
      
      if (k === 'leftSide' && value) {
        updated.leftSide = { ...(localConfig.leftSide || {}), ...(value as typeof localConfig.leftSide) }
      } else if (k === 'rightSide' && value) {
        updated.rightSide = { ...(localConfig.rightSide || {}), ...(value as typeof localConfig.rightSide) }
      } else {
        (updated as Record<string, unknown>)[k] = value
      }
    })
    
    setLocalConfig(updated)
    const hasRoadsideChanges = !!(updates.leftSide || updates.rightSide)
    onUpdate(updated, !hasRoadsideChanges)
  }

  // Typed Update Handler für Toolbar
  const handleUpdate = <K extends keyof SmartRoadConfig>(key: K, value: SmartRoadConfig[K]) => {
    let updated = { ...localConfig, [key]: value }
    
    if (key === 'lanes') {
      const newLanes = value as number
      if (updated.width === 80 && newLanes >= 3) {
        updated = { ...updated, width: 160 }
      }
    }
    
    if (key === 'surface') {
      const newSurface = value as SmartRoadConfig['surface']
      if (newSurface?.type && newSurface.type !== 'asphalt') {
        const newLines = (updated.lines || []).map(() => ({ type: 'none' as const }))
        updated = { ...updated, lines: newLines, defaultLineType: 'none' }
      } else if (newSurface?.type === 'asphalt' && updated.defaultLineType === 'none') {
        updated = { ...updated, defaultLineType: 'dashed', lines: undefined }
      }
    }
    
    const widthChanged = updated.width !== localConfig.width
    setLocalConfig(updated)
    onUpdate(updated, !widthChanged)
  }

  const handleReset = () => {
    if (initialConfig) {
      const resetConfig = JSON.parse(JSON.stringify(initialConfig))
      setLocalConfig(resetConfig)
      onUpdate(resetConfig, false)
      setContextPopup(null)
    }
  }

  // Handler für Zone-Klicks aus der Preview → öffnet ContextPanel
  const handleZoneSelect = (popup: PopupPosition) => {
    setContextPopup(popup)
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/40" onClick={handleClose} />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-labelledby="inspector-title"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-auto flex flex-col overflow-hidden"
          style={{
            background: 'var(--panel)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            width: '95vw',
            maxWidth: '1650px',
            height: '95vh',
            maxHeight: '1050px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <h2 id="inspector-title" className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                {categoryLabel}
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--primary-alpha, rgba(59, 130, 246, 0.1))', color: 'var(--primary)' }}>
                {localConfig.lanes} {localConfig.lanes === 1 ? 'Spur' : 'Spuren'}
              </span>
            </div>
            <button onClick={handleClose}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-500"
              style={{ color: 'var(--text-muted)' }} title="Schließen (ESC)">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content: Markierungen-Palette | Preview | Context Panel */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Markierungen-Palette (immer sichtbar) */}
            <MarkingsPanel
              config={localConfig}
              onUpdate={(newConfig, preserveSize) => {
                setLocalConfig(newConfig)
                onUpdate(newConfig, preserveSize)
              }}
            />
            
            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center relative"
              style={{ background: 'var(--panel-elev)', minHeight: '450px' }}
              onClick={() => setContextPopup(null)}
            >
              <InteractiveRoadPreview 
                config={localConfig} 
                updatePartial={updatePartial}
                onZoneSelect={handleZoneSelect}
              />
            </div>
            
            {/* Kontext-Panel rechts (immer sichtbar) */}
            <ContextPanel
              config={localConfig}
              popup={contextPopup}
              updatePartial={updatePartial}
              onClose={() => setContextPopup(null)}
            />
          </div>

          {/* Hint Text */}
          <div className="text-center py-2"
            style={{ color: 'var(--text-muted)', fontSize: '12px', background: 'var(--panel-elev)', borderTop: '1px solid var(--border)' }}>
            <span><span style={{ color: 'var(--primary)', fontWeight: 500 }}>Klicke</span> auf Elemente zum Bearbeiten</span>
            {(localConfig.markings?.length || 0) > 0 && (
              <span> • Drag verschieben • Shift+Drag frei platzieren • Scroll rotieren</span>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className="px-4 py-3 flex items-center justify-center"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--panel)' }}>
            <MinimalToolbar
              config={localConfig}
              onUpdate={handleUpdate}
              onReset={handleReset}
              canReset={!!initialConfig}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}