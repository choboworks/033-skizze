import { useAppStore } from '@/store'
import { EbenenPanel } from './EbenenPanel'
import { LibraryPanel } from './LibraryPanel'
import { MetadataPanel } from './MetadataPanel'

export function RightSidebar() {
  const activeTab = useAppStore((s) => s.rightSidebarTab)
  const setActiveTab = useAppStore((s) => s.setRightSidebarTab)

  return (
    <aside
      className="flex flex-col shrink-0 h-full min-h-0 overflow-hidden z-40"
      style={{ width: 'var(--sidebar-width)', gap: 16 }}
    >
      {/* Mode switch */}
      <div
        className="grid grid-cols-3 gap-1 shrink-0"
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
        <TabButton label="Ebenen" active={activeTab === 'layers'} onClick={() => setActiveTab('layers')} />
        <TabButton label="Library" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
        <TabButton label="Metadaten" active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')} />
      </div>

      {/* Active panel */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {activeTab === 'layers' && <EbenenPanel />}
        {activeTab === 'library' && <LibraryPanel />}
        {activeTab === 'metadata' && <MetadataPanel />}
      </div>
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
