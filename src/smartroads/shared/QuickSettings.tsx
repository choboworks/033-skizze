import { useState } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { AlertTriangle, ChevronDown, Minus, Plus } from 'lucide-react'
import type { Marking, RoadClass, Strip } from '../types'
import { totalWidth } from '../constants'
import { getStripDefaultWidth } from '../rules/stripRules'
import { getCrossSectionStrips, getLaneOverlayOccupancyWidth, getLaneOverlaySafetyBufferWidth, isLaneOverlayCyclepath } from '../layout'
import { getCyclepathOverlaySide } from '../stripProps'
import { validateStraightRoadState } from '../validation'
import type { StraightRoadIssue } from '../validation'
import { calculateAutoScale, PAGE_WIDTH_MM } from '@/utils/scale'

interface Props {
  strips: Strip[]
  markings: Marking[]
  length: number
  roadClass: RoadClass
  onUpdateStrips: (strips: Strip[]) => void
  onUpdateLength: (length: number) => void
  onUpdateRoadClass: (roadClass: RoadClass) => void
}

function countLanes(strips: Strip[]): number {
  return strips.filter((strip) => strip.type === 'lane').length
}

function isRoadwayStrip(strip: Strip): boolean {
  return strip.type === 'lane' || strip.type === 'bus'
}

function sumWidths(strips: Strip[]): number {
  return strips.reduce((sum, strip) => sum + strip.width, 0)
}

function formatMeters(value: number): string {
  return `${value.toFixed(2)} m`
}

function getIssuePresentation(issue: StraightRoadIssue): {
  background: string
  border: string
  color: string
} {
  if (issue.severity === 'error') {
    return {
      background: 'rgba(255,96,96,0.10)',
      border: '1px solid rgba(255,96,96,0.25)',
      color: 'var(--text)',
    }
  }

  if (issue.severity === 'info') {
    return {
      background: 'rgba(74,158,255,0.08)',
      border: '1px solid rgba(74,158,255,0.18)',
      color: 'var(--text-secondary)',
    }
  }

  return {
    background: 'rgba(255,180,50,0.08)',
    border: '1px solid rgba(255,180,50,0.18)',
    color: 'var(--text-secondary)',
  }
}

function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  unit = '',
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))

  const commit = () => {
    const nextValue = parseFloat(editValue)
    if (!Number.isNaN(nextValue)) {
      onChange(Math.max(min, Math.min(max, nextValue)))
    }
    setEditing(false)
  }

  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <button
        className="toggle-btn flex items-center justify-center"
        style={{ width: 28, height: 28, borderRadius: 10 }}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <Minus size={13} />
      </button>
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(event) => setEditValue(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit()
            if (event.key === 'Escape') setEditing(false)
          }}
          className="text-center text-[11px] font-mono"
          style={{
            width: 48,
            height: 28,
            borderRadius: 10,
            background: 'var(--panel-control-bg)',
            border: '1px solid var(--accent)',
            color: 'var(--text)',
            outline: 'none',
          }}
        />
      ) : (
        <button
          className="value-display text-center text-[11px] font-semibold font-mono flex items-center justify-center cursor-pointer"
          style={{ width: 48, height: 28, borderRadius: 10 }}
          onClick={() => {
            setEditValue(String(value))
            setEditing(true)
          }}
        >
          {value}
          {unit}
        </button>
      )}
      <button
        className="toggle-btn flex items-center justify-center"
        style={{ width: 28, height: 28, borderRadius: 10 }}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <Plus size={13} />
      </button>
    </div>
  )
}

export function QuickSettings({ strips, markings, length, roadClass, onUpdateStrips, onUpdateLength, onUpdateRoadClass }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const laneCount = countLanes(strips)
  const crossSectionWidth = totalWidth(strips)
  const issues = validateStraightRoadState({ strips, markings, roadClass, length })
  const baseStrips = getCrossSectionStrips(strips)
  const roadwayWidth = sumWidths(baseStrips.filter(isRoadwayStrip))
  const overlayCyclepaths = strips.filter(isLaneOverlayCyclepath)
  const { currentScale } = calculateAutoScale(0, length * 1.15)
  const pageWidthM = (PAGE_WIDTH_MM / 1000) * currentScale
  const widthOverflow = crossSectionWidth > pageWidthM

  const addLane = () => {
    const lastLaneIndex = strips.reduce(
      (currentIndex, strip, index) => (strip.type === 'lane' ? index : currentIndex),
      -1,
    )
    const laneTemplate = lastLaneIndex >= 0 ? strips[lastLaneIndex] : strips.find((strip) => strip.type === 'lane')
    const nextLane: Strip = {
      id: crypto.randomUUID(),
      type: 'lane',
      variant: 'standard',
      width: laneTemplate?.type === 'lane' ? laneTemplate.width : getStripDefaultWidth('lane', 'standard', roadClass),
      direction: laneTemplate?.type === 'lane' ? laneTemplate.direction : 'down',
      ...(laneTemplate?.type === 'lane' && laneTemplate.props ? { props: laneTemplate.props } : {}),
    }
    const nextStrips = [...strips]
    nextStrips.splice(lastLaneIndex + 1, 0, nextLane)
    onUpdateStrips(nextStrips)
  }

  const removeLane = () => {
    if (laneCount <= 1) return
    const lastLaneIndex = strips.reduce(
      (currentIndex, strip, index) => (strip.type === 'lane' ? index : currentIndex),
      -1,
    )
    if (lastLaneIndex >= 0) {
      onUpdateStrips(strips.filter((_, index) => index !== lastLaneIndex))
    }
  }

  return (
    <div className="flex flex-col">
      <button
        className="flex items-center justify-center gap-2.5 w-full"
        style={{ height: 36, cursor: 'pointer' }}
        onClick={() => setCollapsed((currentValue) => !currentValue)}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.08em]"
          style={{ color: 'var(--text-muted)' }}
        >
          Quick Settings
        </span>
        <ChevronDown
          size={13}
          className="transition-transform duration-200"
          style={{
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)',
            color: 'var(--text-muted)',
          }}
        />
      </button>

      {collapsed ? null : (
        <div className="flex flex-col" style={{ gap: 14 }}>
          <div className="flex flex-col gap-2">
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              Straßentyp
            </span>
            <ToggleGroup.Root
              type="single"
              value={roadClass}
              onValueChange={(value) => {
                if (value === 'innerorts' || value === 'ausserorts' || value === 'autobahn') {
                  onUpdateRoadClass(value)
                }
              }}
              className="grid"
              style={{ gap: 4, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              <ToggleGroup.Item
                value="innerorts"
                className="toggle-btn flex items-center justify-center"
                style={{ height: 34, minWidth: 0, borderRadius: 9999, fontSize: 10.5, fontWeight: 700, padding: '0 8px', whiteSpace: 'nowrap' }}
                data-active={roadClass === 'innerorts'}
              >
                Innerorts
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="ausserorts"
                className="toggle-btn flex items-center justify-center"
                style={{ height: 34, minWidth: 0, borderRadius: 9999, fontSize: 10.5, fontWeight: 700, padding: '0 8px', whiteSpace: 'nowrap' }}
                data-active={roadClass === 'ausserorts'}
              >
                Außerorts
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="autobahn"
                className="toggle-btn flex items-center justify-center"
                style={{ height: 34, minWidth: 0, borderRadius: 9999, fontSize: 10.5, fontWeight: 700, padding: '0 8px', whiteSpace: 'nowrap' }}
                data-active={roadClass === 'autobahn'}
              >
                Autobahn
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              Länge
            </span>
            <NumberStepper value={length} onChange={onUpdateLength} min={5} max={200} step={5} unit="m" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              Spuren
            </span>
            <div className="flex items-center" style={{ gap: 8 }}>
              <button
                className="toggle-btn flex items-center justify-center"
                style={{ width: 28, height: 28, borderRadius: 10 }}
                onClick={removeLane}
              >
                <Minus size={13} />
              </button>
              <span
                className="value-display text-center text-[11px] font-semibold font-mono flex items-center justify-center"
                style={{ width: 48, height: 28, borderRadius: 10 }}
              >
                {laneCount}
              </span>
              <button
                className="toggle-btn flex items-center justify-center"
                style={{ width: 28, height: 28, borderRadius: 10 }}
                onClick={addLane}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="pt-3 flex flex-col gap-2"
        style={{ borderTop: '1px solid var(--panel-section-border)', marginTop: 12 }}
      >
        <div className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
          Fahrbahn {roadwayWidth.toFixed(1)}m · Gesamtquerschnitt {crossSectionWidth.toFixed(1)}m · {length}m
          lang · 1:{currentScale}
        </div>

        {overlayCyclepaths.map((overlayCyclepath) => {
          const side = getCyclepathOverlaySide(overlayCyclepath)
          const sideLabel = side === 'left' ? 'links' : 'rechts'
          const oppositeSideLabel = side === 'left' ? 'rechts' : 'links'
          const occupancyWidth = getLaneOverlayOccupancyWidth(overlayCyclepath, baseStrips)
          const safetyBufferWidth = getLaneOverlaySafetyBufferWidth(overlayCyclepath, baseStrips)
          const remainingRoadwayWidth = Math.max(0, roadwayWidth - occupancyWidth)

          return (
            <div
              key={overlayCyclepath.id}
              className="flex flex-col gap-1 px-3 py-2.5 rounded-xl text-[11px]"
              style={{
                background: 'rgba(74,158,255,0.08)',
                border: '1px solid rgba(74,158,255,0.18)',
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: 'var(--text)' }}>
                {overlayCyclepath.variant === 'advisory'
                  ? `Schutzstreifen ${sideLabel} auf der Fahrbahn`
                  : `Radfahrstreifen ${sideLabel} auf der Fahrbahn`}
              </span>
              <span>
                {overlayCyclepath.variant === 'advisory'
                  ? `Radverkehrsfläche ${formatMeters(overlayCyclepath.width)} · Kernfahrbahn ${oppositeSideLabel} der Leitlinie ${formatMeters(remainingRoadwayWidth)}`
                  : `Radfahrstreifen ${formatMeters(overlayCyclepath.width)} · verbleibende Fahrbahn ${oppositeSideLabel} der Trennlinie ${formatMeters(remainingRoadwayWidth)}`}
              </span>
              {safetyBufferWidth > 0 && (
                <span>Sicherheitstrennstreifen {formatMeters(safetyBufferWidth)} zwischen Parken und Radverkehr.</span>
              )}
              <span>Belegte Fahrbahnbreite durch Radanlage: {formatMeters(occupancyWidth)}.</span>
              <span>Die Fläche liegt innerhalb der Fahrbahn und wird nicht als eigener Nebenstreifen addiert.</span>
            </div>
          )
        })}

        {widthOverflow && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px]"
            style={{
              background: 'rgba(255,180,50,0.1)',
              border: '1px solid rgba(255,180,50,0.25)',
              color: 'var(--warning, #f0b030)',
            }}
          >
            <AlertTriangle size={14} className="shrink-0" />
            <span>Straße breiter als Seite. Länge erhöhen oder Streifen entfernen.</span>
          </div>
        )}

        {issues.map((issue) => (
          <div
            key={issue.id}
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-[11px]"
            style={getIssuePresentation(issue)}
          >
            <AlertTriangle size={14} className="shrink-0 mt-[1px]" />
            <span>{issue.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
