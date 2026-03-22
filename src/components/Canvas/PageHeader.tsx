import { useState, useRef, useEffect } from 'react'
import { Group, Rect, Text, Line as KonvaLine, Transformer } from 'react-konva'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX, MM_TO_PX } from '@/utils/scale'
import type { DocumentMeta } from '@/types'
import type Konva from 'konva'

const MARGIN = 10 * MM_TO_PX
const HEADER_WIDTH = PAGE_WIDTH_PX - 2 * MARGIN
const PAD = 8
const LINE_H = 16
const FONT = 'Inter, sans-serif'

interface Props {
  document: DocumentMeta
}

function parseAddress(address: string): { street: string; plzCity: string } {
  const idx = address.lastIndexOf(', ')
  if (idx === -1) return { street: address, plzCity: '' }
  return { street: address.slice(0, idx), plzCity: address.slice(idx + 2) }
}

function formatDate(iso: string): string {
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  return `${parts[2]}.${parts[1]}.${parts[0]}`
}

/**
 * Static document header on the A4 page.
 * Only shows fields that have content (except Überschrift + Datum which always show).
 */
export function PageHeader({ document: doc }: Props) {
  const { street, plzCity } = parseAddress(doc.departmentAddress)
  const dateStr = formatDate(doc.date)

  // Check which fields have content
  const hasDept = doc.department.trim() !== ''
  const hasSub = doc.subdivision.trim() !== ''
  const hasCase = doc.caseNumber.trim() !== ''
  const hasAddress = doc.departmentAddress.trim() !== ''
  const hasPhone = doc.departmentPhone.trim() !== ''
  const hasOfficer = doc.officer.trim() !== ''

  // Only show header box if at least one field besides name/date is filled
  const hasHeaderContent = hasDept || hasCase || hasOfficer

  // Build left column (only non-empty lines)
  const leftLines: Array<{ text: string; fontSize: number; fontStyle: string }> = []
  if (hasDept) leftLines.push({ text: doc.department, fontSize: 11, fontStyle: 'bold' })
  if (hasSub) leftLines.push({ text: doc.subdivision, fontSize: 9, fontStyle: 'normal' })
  if (hasCase) {
    leftLines.push({ text: 'Vorgangsnummer', fontSize: 8, fontStyle: 'normal' })
    leftLines.push({ text: doc.caseNumber, fontSize: 11, fontStyle: 'bold' })
  }

  // Build right column (only non-empty lines)
  const rightLines: Array<{ text: string; fontSize: number; fontStyle: string }> = []
  if (hasAddress || doc.date) {
    rightLines.push({ text: plzCity ? `${plzCity}, ${dateStr}` : dateStr, fontSize: 9, fontStyle: 'normal' })
  }
  if (hasAddress) rightLines.push({ text: street, fontSize: 9, fontStyle: 'normal' })
  if (hasPhone) rightLines.push({ text: `Tel.: ${doc.departmentPhone}`, fontSize: 9, fontStyle: 'normal' })
  if (hasOfficer) rightLines.push({ text: doc.officer, fontSize: 9, fontStyle: 'normal' })

  // Header box height adapts to content
  const maxLines = Math.max(leftLines.length, rightLines.length, 1)
  const headerHeight = PAD * 2 + maxLines * LINE_H
  const headerBottom = MARGIN + headerHeight

  const rightColX = PAGE_WIDTH_PX - MARGIN - PAD - 250
  const rightColW = 250
  const leftX = MARGIN + PAD

  return (
    <Group listening={false}>
      {/* Header box — only if there's content */}
      {hasHeaderContent && (
        <>
          <Rect
            x={MARGIN}
            y={MARGIN}
            width={HEADER_WIDTH}
            height={headerHeight}
            stroke="#000"
            strokeWidth={0.5}
          />

          {/* Left column */}
          {leftLines.map((line, i) => (
            <Text
              key={`left-${i}`}
              x={leftX}
              y={MARGIN + PAD + i * LINE_H}
              text={line.text}
              fontSize={line.fontSize}
              fontStyle={line.fontStyle}
              fontFamily={FONT}
              fill="#000"
            />
          ))}

          {/* Right column */}
          {rightLines.map((line, i) => (
            <Text
              key={`right-${i}`}
              x={rightColX}
              y={MARGIN + PAD + i * LINE_H}
              width={rightColW}
              text={line.text}
              fontSize={line.fontSize}
              fontStyle={line.fontStyle}
              fontFamily={FONT}
              fill="#000"
              align="right"
            />
          ))}
        </>
      )}

      {/* Title — always visible (from "Überschrift" field) */}
      <Text
        x={MARGIN}
        y={hasHeaderContent ? headerBottom + 12 : MARGIN + 12}
        width={PAGE_WIDTH_PX - 2 * MARGIN}
        text={doc.name || 'Verkehrsunfallskizze'}
        fontSize={11}
        fontStyle="normal"
        fontFamily={FONT}
        fill="#000"
        align="center"
      />
    </Group>
  )
}

/**
 * Draggable/resizable/rotatable signature block with standard Konva Transformer.
 * Not in layer manager. Click to select, click elsewhere to deselect.
 */
export function SignatureBlock({ document: doc, stageRef }: Props & { stageRef?: React.RefObject<Konva.Stage | null> }) {
  const groupRef = useRef<Konva.Group>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const [selected, setSelected] = useState(false)
  const textPad = 6

  const defaultX = MARGIN
  const defaultY = PAGE_HEIGHT_PX - MARGIN - 40

  // Attach/detach transformer
  useEffect(() => {
    if (!trRef.current) return
    trRef.current.nodes(selected && groupRef.current ? [groupRef.current] : [])
    trRef.current.getLayer()?.batchDraw()
  }, [selected])

  // Deselect on click outside — use setTimeout to avoid race with onClick
  useEffect(() => {
    const stage = stageRef?.current
    if (!stage) return
    const handler = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const target = e.target
      const group = groupRef.current
      const tr = trRef.current
      if (!group) return
      // Click is on our group or transformer → ignore
      if (target === group || group.isAncestorOf(target)) return
      if (tr && (target === tr || tr.isAncestorOf(target))) return
      setSelected(false)
    }
    stage.on('click tap', handler)
    return () => { stage.off('click tap', handler) }
  }, [stageRef])

  // Track text width for signature line
  const [lineW, setLineW] = useState(60)
  const measureText = (node: Konva.Text | null) => {
    if (node) {
      const w = Math.max(30, node.width())
      if (w !== lineW) setLineW(w)
    }
  }

  if (!doc.officer) return null

  return (
    <>
      <Group
        ref={groupRef}
        x={defaultX}
        y={defaultY}
        draggable
        onClick={() => setSelected(true)}
        onTap={() => setSelected(true)}
      >
        {/* Signature line — exactly as wide as text */}
        <KonvaLine
          points={[0, 0, lineW, 0]}
          stroke="#000"
          strokeWidth={0.5}
        />
        {/* Officer name */}
        <Text
          ref={measureText}
          x={0}
          y={textPad}
          text={doc.officer}
          fontSize={10}
          fontFamily={FONT}
          fill="#000"
        />
        {/* Invisible hit area */}
        <Rect
          x={0}
          y={-2}
          width={lineW}
          height={textPad + 16}
          fill="transparent"
        />
      </Group>
      <Transformer
        ref={trRef}
        rotateEnabled
        resizeEnabled
        borderStroke="#4a9eff"
        borderStrokeWidth={1}
        anchorSize={8}
        anchorStroke="#4a9eff"
        anchorFill="#fff"
        anchorCornerRadius={2}
        keepRatio={false}
        boundBoxFunc={(_oldBox, newBox) => {
          // Minimum size
          if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 10) return _oldBox
          return newBox
        }}
      />
    </>
  )
}
