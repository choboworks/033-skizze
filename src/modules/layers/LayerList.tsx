// src/modules/layers/LayerList.tsx
import type React from 'react'
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { useAppStore } from '../../store/appStore'
import { Eye, EyeOff, Trash2, ChevronRight, ChevronDown, Unlink, Link } from 'lucide-react'
import { useDrag, useDrop } from 'react-dnd'

// Assets: zentraler Katalog aus Manifest
import { libraryAssets } from '../library/libraryManifest'

import { useLongPress } from '../../hooks/useLongPress'

type ChainPayloadVM = {
  id: string
  parts: string[]
  joints: unknown[]
  name?: string
}
type ElementDataVM = {
  id?: string
  name?: string
  kind?: 'chain' | string
  chain?: ChainPayloadVM
  chainId?: string
  parentId?: string
  assetId?: string
  text?: string
  [k: string]: unknown
}
type ElementVM = {
  id: string
  z: number
  visible: boolean
  data?: ElementDataVM
}
type TreeNode = ElementVM & {
  kind: 'chain' | 'object'
  children?: ElementVM[]
}
type DragItem = { type: 'LAYER_ROW'; id: string; index: number }

/* ──────────────────────────────
   Helpers
   ────────────────────────────── */
function NameCell({ el, index }: { el: ElementVM; index: number }) {
  const isChain = el.data?.kind === 'chain' && !!el.data?.chain
  const chainDefault = (el.data?.chain?.name as string | undefined) ?? 'Straßenverbund'
  const fallback = isChain ? chainDefault : `Objekt #${index + 1}`

  const initial = (el.data?.name as string | undefined) ?? fallback
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initial)
  const originalValueRef = useRef(initial)

  // Update originalValue wenn sich Daten ändern (aber nicht während Edit)
  useEffect(() => {
    if (editing) return // NICHT während Edit updaten
    
    const chain = el.data?.kind === 'chain' && !!el.data?.chain
    const freshBase =
      (el.data?.name as string | undefined) ??
      (chain ? ((el.data?.chain?.name as string | undefined) ?? 'Straßenverbund') : `Objekt #${index + 1}`)
    
    originalValueRef.current = freshBase
    setValue(freshBase)
  }, [el.data?.name, el.data?.chain, el.data?.kind, index, editing])

  const commit = () => {
    const trimmed = value.trim()
    const name = trimmed || originalValueRef.current || fallback
    window.dispatchEvent(new CustomEvent('app:rename-id', { detail: { id: el.id, name } }))
    setEditing(false)
  }

  const cancel = () => {
    setValue(originalValueRef.current) // Restore original
    setEditing(false)
  }

const longPressHandlers = useLongPress({
  onLongPress: () => setEditing(true),
  onDoubleClick: () => setEditing(true),
  delay: 500,
})

if (!editing) {
  return (
    <button
      type="button"
      className="block w-full flex-auto basis-0 min-w-0 max-w-full truncate text-[15px] font-medium text-[var(--text)] text-left touch-manipulation"
      title="Zum Umbenennen doppelklicken oder lange drücken"
      {...longPressHandlers}
    >
      {value}
    </button>
  )
}

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit()
        if (e.key === 'Escape') cancel()
      }}
      className="w-full flex-auto basis-0 min-w-0 max-w-full px-2 py-1 rounded-md border text-sm
                 bg-[var(--panel)] text-[var(--text)] border-[var(--border)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]"
    />
  )
}

function toggleVisibilityFor(id: string, visible: boolean) {
  window.dispatchEvent(new CustomEvent('app:update-visibility', { detail: { id, visible } }))
}
function deleteId(id: string) {
  window.dispatchEvent(new CustomEvent('app:delete-id', { detail: { id } }))
}
function requestDissolveChain(groupId: string, chainId?: string) {
  window.dispatchEvent(new CustomEvent('app:dissolve-chain', { detail: { groupId, chainId } }))
}
const svgUrlCache = new Map<string, string | null>()

/**
 * Konvertiert SVG-String zu Data-URL mit Caching
 * 
 * @param svg - SVG-String
 * @returns Data-URL oder null bei Fehler (gecached)
 */
function svgToDataUrl(svg?: string): string | null {
  if (!svg) return null
  
  // Cache-Hit
  if (svgUrlCache.has(svg)) {
    return svgUrlCache.get(svg) ?? null
  }
  
  try {
    // Whitespace normalisieren für kleinere URLs
    const cleaned = svg
      .replace(/\s+/g, ' ')        // Multiple Spaces → Single Space
      .replace(/>\s+</g, '><')     // Spaces zwischen Tags entfernen
      .trim()
    
    // Encode für Data-URL (minimal encoding für Größe)
    const encoded = encodeURIComponent(cleaned)
      .replace(/%20/g, ' ')        // Spaces nicht encoden
      .replace(/%3D/g, '=')        // = nicht encoden
      .replace(/%3A/g, ':')        // : nicht encoden
      .replace(/%2F/g, '/')        // / nicht encoden
    
    const result = `data:image/svg+xml;charset=utf-8,${encoded}`
    
    // Cache speichern (Max 100 Einträge)
    if (svgUrlCache.size > 100) {
      const firstKey = svgUrlCache.keys().next().value
      if (firstKey) svgUrlCache.delete(firstKey)
    }
    svgUrlCache.set(svg, result)
    
    return result
  } catch (err) {
    console.warn('[LayerList] Failed to encode SVG:', err)
    svgUrlCache.set(svg, null)
    return null
  }
}

const isChainElement = (
  e: ElementVM
): e is ElementVM & { data: ElementDataVM & { chain: ChainPayloadVM; kind: 'chain' } } =>
  !!e.data && e.data.kind === 'chain' && !!e.data.chain

const isVehicleLabelVM = (e: ElementVM) => e.data?.kind === 'vehicleLabel'
const getChainParts = (e: ElementVM): string[] =>
  isChainElement(e) ? e.data.chain.parts ?? [] : []

// SVG thumbnail renderer from assetId
const ALL_ASSETS: Readonly<Record<string, string>> = Object.values(libraryAssets).reduce(
  (acc, asset) => {
    acc[asset.id] = asset.svg
    return acc
  },
  {} as Record<string, string>,
)

function Thumb({ assetId }: { assetId?: string }) {
  const svg = assetId ? ALL_ASSETS[assetId] : undefined
  const src = svgToDataUrl(svg)

  // Fallback ohne Rahmen
  if (!src) {
    return (
      <span
        aria-hidden
        className="shrink-0"
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          background: 'transparent',
        }}
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className="shrink-0 block"
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: 'transparent',
        objectFit: 'contain',
      }}
    />
  )
}

const keepSelProps = {
  'data-prevent-clear-selection': '',
  onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
  onMouseDown:   (e: React.MouseEvent)   => e.stopPropagation(),
} as const

/* ──────────────────────────────
   TopRow (Chevron, Drag-Handle, Thumbnail*, Parts-Badge)
   *Thumbnail nur bei Nicht-Ketten
   ────────────────────────────── */
function TopRow({
  node, index, movePreview, onDropFinalize, isSelected, onRowClick, onDragStart, onDragEnd, expanded, setExpanded,
}: {
  node: TreeNode
  index: number
  movePreview: (from: number, to: number) => void
  onDropFinalize: () => void
  isSelected: boolean
  onRowClick: (index: number, id: string, e: React.MouseEvent) => void
  onDragStart: () => void
  onDragEnd: () => void
  expanded: boolean
  setExpanded: (id: string, next?: boolean) => void
}) {
const timeoutRef = useRef<number | null>(null)

const [, drag] = useDrag<DragItem, void, unknown>({
  type: 'LAYER_ROW',
  item: () => {
    onDragStart()
    return { type: 'LAYER_ROW', id: node.id, index }
  },
  end: () => {
    // Cleanup vorheriger Timeout falls vorhanden
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      onDragEnd()
      timeoutRef.current = null
    }, 0)
  },
})

// Cleanup bei Unmount
useEffect(() => {
  return () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
  }
}, [])

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: 'LAYER_ROW',
    hover: (item) => {
      if (item.index !== index) {
        movePreview(item.index, index)
        item.index = index
      }
    },
    drop: () => onDropFinalize(),
    collect: (m) => ({ isOver: m.isOver({ shallow: true }) }),
  })

  const base =
    'flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer select-none border transition-colors-quick ' +
    'bg-[var(--panel)] hover:bg-[var(--panel-elev)]'
  const off = 'border-[var(--border)] text-[var(--text)]'
  const on  = 'border-[var(--primary)] ring-1 ring-[var(--ring)]/40'
  const rowCls = `${base} ${isSelected ? on : off}`

  const isChain = node.kind === 'chain'
  const showThumb = !isChain

  const caret = isChain ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setExpanded(node.id, !expanded) }}
      className="p-1 rounded-md hover:bg-[var(--panel-elev)] shrink-0"
      title={expanded ? 'Einklappen' : 'Ausklappen'}
    >
      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  ) : (<div className="w-4 shrink-0" />)

  const partsCount = node.children?.length ?? 0
  const partsLabel = partsCount === 1 ? 'Teil' : 'Teile'

return (
<div
  ref={(el) => { if (el) drop(el) }}
  {...keepSelProps}
  onClick={(e) => onRowClick(index, node.id, e)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRowClick(index, node.id, e as unknown as React.MouseEvent)
    }
    // Arrow-Keys für Navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = e.currentTarget.nextElementSibling as HTMLElement | null
      next?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = e.currentTarget.previousElementSibling as HTMLElement | null
      prev?.focus()
    }
  }}
  className={rowCls}
  style={{ boxShadow: isOver ? '0 0 0 2px var(--ring)' : undefined }}
  title={node.id}
  role="button"
  tabIndex={0}
  aria-selected={isSelected}
  aria-label={`${isChain ? 'Gruppe' : 'Ebene'}: ${node.data?.name || `Objekt #${index + 1}`}`}
>
      {/* Links: dynamisches Grid (Badge nur bei Ketten, Thumb nur bei Nicht-Ketten) */}
      <div
        className="grid items-center gap-2 min-w-0 flex-1"
        style={{
          gridTemplateColumns: isChain
            ? 'auto auto minmax(0,1fr) auto'        // caret | handle | name | badge
            : 'auto auto auto minmax(0,1fr)',       // caret | handle | thumb | name
        }}
      >
        {caret}

        {/* Drag-Handle */}
<div
  ref={(el) => { if (el) drag(el) }}
  {...keepSelProps}
  className="text-sm text-[var(--text-muted)] cursor-grab active:cursor-grabbing select-none"
  title="Ziehen zum Sortieren"
  aria-label="Ziehen zum Sortieren"
>
  ↕
</div>


        {/* Thumbnail nur für Nicht-Ketten */}
        {showThumb && <Thumb assetId={node.data?.assetId} />}

        {/* Name: bei Ketten kleiner, damit besser passt */}
        <div className={isChain ? 'min-w-0 [&>button]:!text-[13px] [&>input]:!text-[13px]' : 'min-w-0'}>
          <NameCell el={node} index={index} />
        </div>

        {/* Kompaktes Parts-Badge: „2 Teile“ */}
        {isChain && (
          <span
            className="ml-1 shrink-0 text-[11px] text-[var(--text-muted)] tabular-nums px-1.5 py-0.5 rounded-md
                       border border-[var(--border)] bg-[var(--panel-elev)]"
            title={`${partsCount} ${partsLabel}`}
          >
            {partsCount} {partsLabel}
          </span>
        )}
      </div>

{/* Rechts: Aktionen */}
      <div className="flex items-center gap-1 shrink-0 ml-2">
        {isChain && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const chainId = node.data?.chain?.id as string | undefined
              requestDissolveChain(node.id, chainId)
            }}
            title="Gruppe lösen"
            className="p-1 rounded-md hover:bg-[var(--panel-elev)]"
          >
            <Unlink size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleVisibilityFor(node.id, !node.visible) }}
          title={node.visible ? 'Verbergen' : 'Einblenden'}
          aria-label={node.visible ? 'Ebene verbergen' : 'Ebene einblenden'}
          className="p-1 rounded-md hover:bg-[var(--panel-elev)]"
        >
          {node.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); deleteId(node.id) }}
          title="Löschen"
          aria-label="Ebene löschen"
          className="p-1 rounded-md hover:bg-[var(--panel-elev)]"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

/* ──────────────────────────────
   ChildRow (Bullet, Thumbnail, Name)
   ────────────────────────────── */
function ChildRow({
  el,
  parentSelected,
  isSelected,
  onClick,
  indexForName,
}: {
  el: ElementVM
  parentSelected: boolean
  isSelected: boolean
  onClick: (id: string, e: React.MouseEvent) => void
  indexForName: number
}) {
  const isLabel = isVehicleLabelVM(el)

  const base =
    'ml-6 flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer select-none border transition-colors-quick ' +
    'bg-[var(--panel)] hover:bg-[var(--panel-elev)]'
  const off = 'border-[var(--border)] text-[var(--text)]'
  const on  = 'border-[var(--primary)] ring-1 ring-[var(--ring)]/40'
  const rowCls = `${base} ${isSelected ? on : off} ${parentSelected ? 'opacity-90' : ''}`

return (
<div
  className={rowCls}
  {...keepSelProps}
  onClick={(e) => onClick(el.id, e)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(el.id, e as unknown as React.MouseEvent)
    }
    // Arrow-Keys für Navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = e.currentTarget.nextElementSibling as HTMLElement | null
      next?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = e.currentTarget.previousElementSibling as HTMLElement | null
      prev?.focus()
    }
  }}
  title={el.id}
  role="button"
  tabIndex={0}
  aria-selected={isSelected}
  aria-label={`Teil: ${el.data?.name || el.data?.text || 'Label'}`}
>

      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="text-sm text-[var(--text-muted)] shrink-0">•</div>

        {/* Thumbnail */}
        <Thumb assetId={el.data?.assetId} />

        {isLabel ? (
          <span className="text-[15px] font-medium text-[var(--text)] truncate">
            {(el.data?.text as string | undefined) || (el.data?.name as string | undefined) || 'Label'}
          </span>
        ) : (
          <NameCell el={el} index={indexForName} />
        )}
      </div>

      <div className="shrink-0">
        {isLabel ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); deleteId(el.id) }}
            title="Label entfernen"
            className="p-1 rounded-md hover:bg-[var(--panel-elev)]"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="w-4" />
        )}
      </div>
    </div>
  )
}

const partsSignature = (ids: string[]) => ids.slice().sort().join('|')

/* ──────────────────────────────
   Hauptliste
   ────────────────────────────── */
export default function LayerList() {
  const elements = useAppStore((s) => s.elements)
  const selection = useAppStore((s) => s.ui.selection ?? []) as string[]

  const elementsAll = useMemo(() => Object.values(elements) as ElementVM[], [elements])

const sortedFlat: ElementVM[] = useMemo(() => {
  const arr = elementsAll.filter((e) => e.data?.kind !== 'vehicleLabel')
  arr.sort((a, b) => (b.z ?? 0) - (a.z ?? 0))
   
  return arr
}, [elementsAll])

  const labelByParent = useMemo(() => {
    const map = new Map<string, ElementVM>()
    for (const el of elementsAll) {
      if (isVehicleLabelVM(el)) {
        const pid = el.data?.parentId
        if (pid) map.set(pid, el)
      }
    }
    return map
  }, [elementsAll])

  const byId = useMemo(() => new Map(sortedFlat.map((e) => [e.id, e])), [sortedFlat])
  const chainsRaw = useMemo(() => sortedFlat.filter((e) => isChainElement(e)), [sortedFlat])

  const chains = useMemo(() => {
    const bestBySig = new Map<string, ElementVM>()
    for (const ch of chainsRaw) {
      const sig = partsSignature(getChainParts(ch))
      const prev = bestBySig.get(sig)
      if (!prev || (ch.z ?? 0) > (prev.z ?? 0)) bestBySig.set(sig, ch)
    }
    return Array.from(bestBySig.values())
  }, [chainsRaw])

  const allowedChainIds = useMemo(() => new Set(chains.map((c) => c.id)), [chains])

  const childToParent = useMemo(() => {
    const map = new Map<string, string>()
    for (const chain of chains) {
      for (const pid of getChainParts(chain)) map.set(pid, chain.id)
    }
    const byChainId = new Map<string, string>()
    for (const chain of chains) {
      const cid = chain.data?.chain?.id
      if (cid) byChainId.set(cid, chain.id)
    }
    for (const el of sortedFlat) {
      const cid = el.data?.chainId
      if (cid && byChainId.has(cid)) map.set(el.id, byChainId.get(cid)!)
    }
    for (const [pid, lbl] of labelByParent.entries()) {
      map.set(lbl.id, pid)
    }
    return map
  }, [chains, sortedFlat, labelByParent])

  const treeTop: TreeNode[] = useMemo(() => {
    const out: TreeNode[] = []
    for (const el of sortedFlat) {
      const parentId = childToParent.get(el.id)
      if (parentId) continue

      if (isChainElement(el)) {
        if (!allowedChainIds.has(el.id)) continue
        const partIds = getChainParts(el)
        const children: ElementVM[] = []
        for (const pid of partIds) {
          const c = byId.get(pid)
          if (c) children.push(c)
        }
        if (children.length === 0) {
          const cid = el.data.chain.id
          sortedFlat.forEach((cand) => {
            if (cand.data?.chainId === cid) children.push(cand)
          })
        }
        out.push({ ...el, kind: 'chain', children })
      } else {
        out.push({ ...el, kind: 'object' })
      }
    }
    return out
  }, [sortedFlat, childToParent, byId, allowedChainIds])

  const suppressSyncRef = useRef(false)
  const onDragStart = useCallback(() => { suppressSyncRef.current = true }, [])
  const dragEndTimeoutRef = useRef<number | null>(null)

const onDragEnd = useCallback(() => {
  // Cleanup vorheriger Timeout
  if (dragEndTimeoutRef.current !== null) {
    clearTimeout(dragEndTimeoutRef.current)
  }
  
  // Kein Timeout mehr - finalize() handled das
  dragEndTimeoutRef.current = null
}, [])

// Cleanup bei Unmount
useEffect(() => {
  return () => {
    if (dragEndTimeoutRef.current !== null) {
      clearTimeout(dragEndTimeoutRef.current)
    }
  }
}, [])
  const [order, setOrder] = useState<string[]>([])
  useEffect(() => {
    const next = treeTop.map((n) => n.id)
    if (suppressSyncRef.current) return
    const same = order.length === next.length && order.every((id, i) => id === next[i])
    if (!same) setOrder(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeTop])

  const movePreview = (from: number, to: number) => {
    setOrder((prev) => {
      if (from === to) return prev
      const next = prev.slice()
      const [m] = next.splice(from, 1)
      next.splice(to, 0, m)
      return next
    })
  }
const finalize = () => {
  if (!order.length) return
  
  // Event dispatchen
  window.dispatchEvent(new CustomEvent('app:reorder-z', { detail: { idsTopDown: order } }))
  
  // Sofort suppressSync deaktivieren für unmittelbares Feedback
  suppressSyncRef.current = false
}

  const lastAnchorRef = useRef<number | null>(null)
  const setSelectionApp = (ids: string[]) =>
    window.dispatchEvent(new CustomEvent('app:select-ids', { detail: { ids } }))
  const flatTopIds = order.length ? order : treeTop.map((n) => n.id)

  const handleTopRowClick = (index: number, id: string, e: React.MouseEvent) => {
    const isMeta = e.metaKey || e.ctrlKey
    const isShift = e.shiftKey
    if (isShift) {
      const anchor = lastAnchorRef.current ?? index
      const [a, b] = anchor < index ? [anchor, index] : [index, anchor]
      const rangeIds = flatTopIds.slice(a, b + 1)
      const set = new Set(selection)
      rangeIds.forEach((rid) => set.add(rid))
      setSelectionApp(Array.from(set))
      lastAnchorRef.current = index
      return
    }
    if (isMeta) {
      const set = new Set(selection)
      if (set.has(id)) set.delete(id); else set.add(id)
      setSelectionApp(Array.from(set))
      lastAnchorRef.current = index
      return
    }
    setSelectionApp([id])
    lastAnchorRef.current = index
  }

  const handleChildClick = (id: string, e: React.MouseEvent) => {
    const isMeta = e.metaKey || e.ctrlKey
    const isShift = e.shiftKey
    if (isShift) {
      const set = new Set(selection); set.add(id); setSelectionApp(Array.from(set)); return
    }
    if (isMeta) {
      const set = new Set(selection); if (set.has(id)) set.delete(id); else set.add(id)
      setSelectionApp(Array.from(set)); return
    }
    setSelectionApp([id])
  }

  const selectedCount = selection.length
  const elementsById = useMemo(() => new Map(sortedFlat.map((e) => [e.id, e])), [sortedFlat])
  const bulkShow = () => selection.forEach((id) => { const el = elementsById.get(id); if (el && !el.visible) toggleVisibilityFor(id, true) })
  const bulkHide = () => selection.forEach((id) => { const el = elementsById.get(id); if (el && el.visible) toggleVisibilityFor(id, false) })
  const bulkDelete = () => selection.forEach((id) => deleteId(id))

  const [expanded, setExpandedState] = useState<Set<string>>(new Set())
  const setExpanded = (id: string, next?: boolean) => {
    setExpandedState((prev) => {
      const out = new Set(prev)
      const shouldOpen = typeof next === 'boolean' ? next : !out.has(id)
      if (shouldOpen) out.add(id); else out.delete(id)
      return out
    })
  }

  if ((order.length || treeTop.length) === 0) return null

  const mapTop = new Map(treeTop.map((n) => [n.id, n]))
  const displayTop: TreeNode[] = (order.length ? order : treeTop.map((n) => n.id))
    .map((id) => mapTop.get(id)!)
    .filter(Boolean)

  return (
<div
  className="mt-4"
  {...keepSelProps}
  onClick={(e) => {
    if (e.currentTarget === e.target) {
      setSelectionApp([])
      lastAnchorRef.current = null
    }
  }}
>

      <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Ebenen</div>

{selectedCount > 0 && (
  <div
    className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 rounded-md min-w-0 border"
    style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', borderColor: 'var(--primary)' }}
  >
    <div className="text-xs font-medium whitespace-nowrap text-[var(--text)]">
      {selectedCount} ausgewählt
    </div>

    <div className="flex flex-wrap items-center gap-1 min-w-0">
      {selectedCount > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            window.dispatchEvent(
              new CustomEvent('app:group-selection', { detail: { ids: selection } })
            )
          }}
          title="Ausgewählte gruppieren"
          aria-label={`${selectedCount} Ebenen gruppieren`}
          className="px-2 py-1 rounded-md hover:bg-[var(--panel-elev)] flex items-center gap-1 whitespace-nowrap"
        >
          <Link size={14} />
          <span className="text-xs">Gruppieren</span>
        </button>
      )}

      {/* 🔥 NEU: Spiegeln Horizontal */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          window.dispatchEvent(
            new CustomEvent('app:flip-selection', { 
              detail: { direction: 'horizontal' } 
            })
          )
        }}
        title="Horizontal spiegeln (Shift+H)"
        aria-label={`${selectedCount} Ebenen horizontal spiegeln`}
        className="px-2 py-1 rounded-md hover:bg-[var(--panel-elev)] flex items-center gap-1 whitespace-nowrap"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
          <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
          <path d="M12 20v2" />
          <path d="M12 14v2" />
          <path d="M12 8v2" />
          <path d="M12 2v2" />
        </svg>
        <span className="text-xs">↔</span>
      </button>

      {/* 🔥 NEU: Spiegeln Vertikal */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          window.dispatchEvent(
            new CustomEvent('app:flip-selection', { 
              detail: { direction: 'vertical' } 
            })
          )
        }}
        title="Vertikal spiegeln (Shift+V)"
        aria-label={`${selectedCount} Ebenen vertikal spiegeln`}
        className="px-2 py-1 rounded-md hover:bg-[var(--panel-elev)] flex items-center gap-1 whitespace-nowrap"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
          <path d="M20 12h2" />
          <path d="M14 12h2" />
          <path d="M8 12h2" />
          <path d="M2 12h2" />
        </svg>
        <span className="text-xs">↕</span>
      </button>

      <button
        type="button"
        onClick={bulkShow}
        title="Ausgewählte einblenden"
        aria-label={`${selectedCount} Ebenen einblenden`}
        className="px-2 py-1 rounded-md hover:bg-[var(--panel-elev)] flex items-center gap-1 whitespace-nowrap"
      >
        <Eye size={14} />
        <span className="text-xs">Einblenden</span>
      </button>

      <button
        type="button"
        onClick={bulkHide}
        title="Ausgewählte verbergen"
        aria-label={`${selectedCount} Ebenen verbergen`}
        className="px-2 py-1 rounded-md hover:bg-[var(--panel-elev)] flex items-center gap-1 whitespace-nowrap"
      >
        <EyeOff size={14} />
        <span className="text-xs">Verbergen</span>
      </button>

      <button
        type="button"
        onClick={bulkDelete}
        title="Ausgewählte löschen"
        aria-label={`${selectedCount} Ebenen löschen`}
        className="px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap hover:bg-[var(--panel-elev)]"
      >
        <Trash2 size={14} />
        <span className="text-xs">Löschen</span>
      </button>
    </div>
  </div>
)}

      <div className="space-y-1">
        {displayTop.map((node, idx) => {
          const isTopSelected = selection.includes(node.id)
          const isOpen = expanded.has(node.id)

          const labelChild = labelByParent.get(node.id)

          return (
            <div key={node.id}>
              <TopRow
                node={node}
                index={idx}
                movePreview={movePreview}
                onDropFinalize={finalize}
                isSelected={isTopSelected}
                onRowClick={handleTopRowClick}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                expanded={isOpen}
                setExpanded={setExpanded}
              />

              {node.kind === 'chain' && isOpen && node.children && node.children.length > 0 && (
                <div className="mt-1 space-y-1">
                  {node.children.map((child, cIdx) => (
                    <ChildRow
                      key={child.id}
                      el={child}
                      parentSelected={isTopSelected}
                      isSelected={selection.includes(child.id)}
                      onClick={(id, e) => handleChildClick(id, e)}
                      indexForName={cIdx}
                    />
                  ))}
                </div>
              )}

              {node.kind === 'object' && labelChild && (
                <div className="mt-1 space-y-1">
                  <ChildRow
                    key={labelChild.id}
                    el={labelChild}
                    parentSelected={isTopSelected}
                    isSelected={selection.includes(labelChild.id)}
                    onClick={(id, e) => handleChildClick(id, e)}
                    indexForName={0}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}