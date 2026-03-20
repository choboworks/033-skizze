import { useState } from 'react'
import { EbenenPanel } from './EbenenPanel'
import { LibraryPanel } from './LibraryPanel'
import { MetadataPanel } from './MetadataPanel'

type Tab = 'library' | 'metadata'

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('library')

  return (
    <aside
      className="flex flex-col shrink-0 h-full overflow-y-auto z-40"
      style={{ width: 380, gap: 12 }}
    >
      {/* Ebenen-Manager — eigene Panel-Card */}
      <EbenenPanel />

      {/* Tab bar */}
      <div
        className="grid grid-cols-2 gap-1 p-1 shrink-0"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          backdropFilter: 'var(--glass-blur)',
        }}
      >
        <TabButton label="Library" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
        <TabButton label="Metadaten" active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')} />
      </div>

      {/* Tab content */}
      {activeTab === 'library' ? <LibraryPanel /> : <MetadataPanel />}
    </aside>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="py-2 text-[12px] font-semibold transition-all"
      style={{
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#000' : 'var(--text-muted)',
        border: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-hover)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {label}
    </button>
  )
}
