import { useState } from 'react'
import { StraightEditor } from './editors/StraightEditor'
import { createDefaultStraightRoad } from './constants'
import type { StraightRoadState } from './types'

// ============================================================
// DEV ONLY – Test bench for SmartRoad editor.
// Open with Ctrl+Shift+D. Remove before production.
// ============================================================

export function DevTestBench({ onClose }: { onClose: () => void }) {
  const [editorOpen, setEditorOpen] = useState(true)
  const [lastResult, setLastResult] = useState<StraightRoadState | null>(null)

  const handleFinish = (state: StraightRoadState) => {
    setLastResult(state)
    setEditorOpen(false)
  }

  const handleCancel = () => {
    setEditorOpen(false)
  }

  return (
    <div className="fixed inset-0 z-9998 flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{ height: 46, borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
          SmartRoad Test Bench
        </span>
        <div className="flex items-center gap-3">
          {!editorOpen && (
            <button
              className="px-4 py-1.5 rounded-lg text-[13px] font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}
              onClick={() => setEditorOpen(true)}
            >
              Editor öffnen
            </button>
          )}
          <button
            className="px-3 py-1.5 rounded text-[13px]"
            style={{ background: 'var(--danger)', color: '#fff' }}
            onClick={onClose}
          >
            Schließen (Ctrl+Shift+D)
          </button>
        </div>
      </div>

      {/* Result display */}
      {lastResult && !editorOpen && (
        <div className="flex-1 overflow-auto p-6">
          <div className="text-[13px] font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Letztes Ergebnis: {lastResult.strips.length} Streifen, {lastResult.markings.length} Markierungen, {lastResult.length}m lang
          </div>
          <pre
            className="text-[11px] p-3 rounded-lg overflow-auto max-h-96"
            style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            {JSON.stringify(lastResult, null, 2)}
          </pre>
        </div>
      )}

      {/* StraightEditor */}
      <StraightEditor
        open={editorOpen}
        initialState={lastResult || createDefaultStraightRoad()}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />
    </div>
  )
}
