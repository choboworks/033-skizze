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
      style={{ width: 'var(--sidebar-width)', gap: 16 }}
    >
      {/* Ebenen-Manager — eigene Panel-Card */}
      <EbenenPanel />

      {/* Tab bar */}
      <div
        className="grid grid-cols-2 gap-1 shrink-0"
        style={{
          height: 44,
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          backdropFilter: 'var(--glass-blur)',
          marginBottom: 12,
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
      data-active={active}
      className="tab-trigger flex items-center justify-center text-[12px] font-semibold"
      style={{ height: 36, borderRadius: 16 }}
    >
      {label}
    </button>
  )
}
