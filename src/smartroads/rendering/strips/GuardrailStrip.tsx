import { Group, Line, Rect } from 'react-konva'
import { getConcretePattern, getGrassPattern } from '../../shared/patterns'
import type { StripVariant } from '../../types'
import type { FacingSide } from '../../layout'

interface Props {
  x: number
  y?: number
  width: number
  length: number
  variant?: StripVariant
  postSpacing?: number
  facingSide?: FacingSide
  showShoulder?: boolean
  shoulderWidth?: number
  showGreen?: boolean
  greenWidth?: number
}

export function GuardrailStrip({
  x,
  y = 0,
  width,
  length,
  variant = 'schutzplanke',
  postSpacing = 2.0,
  facingSide,
  showShoulder = false,
  shoulderWidth = 0.75,
  showGreen = false,
  greenWidth = 0.30,
}: Props) {
  const safeLength = Math.max(0.5, length)
  const isBoth = facingSide === 'both'
  const side: 'left' | 'right' = facingSide === 'left' ? 'left' : 'right'

  // The width from properties is calculated for ONE side of context (rail + shoulder + green).
  // When facingSide === 'both', we need to fit mirrored context into the same width.
  // Strategy: the rail gets its default share, and the context elements shrink proportionally.
  const requestedShoulder = showShoulder ? Math.max(0.10, shoulderWidth) : 0
  const requestedGreen = showGreen ? Math.max(0.10, greenWidth) : 0
  const sides = isBoth ? 2 : 1
  const requestedContext = (requestedShoulder + requestedGreen) * sides
  const availableForRail = width - requestedContext

  // If not enough room, scale context down proportionally
  let effShoulder: number, effGreen: number, railWidth: number
  if (availableForRail < 0.08 && requestedContext > 0) {
    // Rail needs at least 0.08m — shrink context
    railWidth = 0.08
    const contextBudget = Math.max(0, width - 0.08) / sides
    const ratio = requestedShoulder + requestedGreen > 0
      ? contextBudget / (requestedShoulder + requestedGreen)
      : 0
    effShoulder = showShoulder ? requestedShoulder * ratio : 0
    effGreen = showGreen ? requestedGreen * ratio : 0
  } else {
    effShoulder = requestedShoulder
    effGreen = requestedGreen
    railWidth = Math.max(0.08, availableForRail)
  }

  const contextOneSize = effShoulder + effGreen
  let railX: number
  if (isBoth) {
    railX = contextOneSize
  } else if (side === 'right') {
    railX = 0
  } else {
    railX = contextOneSize
  }

  const renderShoulder = (sx: number) => (
    <Group x={sx}>
      <Rect width={effShoulder} height={safeLength} fill="#3a3a3a" />
    </Group>
  )

  const renderGreen = (gx: number) => (
    <Group x={gx}>
      <Rect
        width={effGreen}
        height={safeLength}
        fillPatternImage={getGrassPattern() as unknown as HTMLImageElement}
        fillPatternScale={{ x: 0.015, y: 0.015 }}
      />
      <Rect width={effGreen} height={safeLength} fill="rgba(100,140,80,0.15)" listening={false} />
    </Group>
  )

  const renderRail = () => {
    if (variant === 'betonwand') return <ConcreteBarrier x={railX} length={safeLength} width={railWidth} facingSide={side} />
    if (variant === 'doppel') return <DoubleGuardrail x={railX} length={safeLength} width={railWidth} postSpacing={postSpacing} />
    return <SingleGuardrail x={railX} length={safeLength} width={railWidth} postSpacing={postSpacing} facingSide={side} />
  }

  return (
    <Group x={x} y={y} clipX={0} clipY={0} clipWidth={width} clipHeight={safeLength}>
      {isBoth ? (
        <>
          {/* Left side: shoulder → green → rail → green → shoulder */}
          {showShoulder && renderShoulder(0)}
          {showGreen && renderGreen(effShoulder)}
          {renderRail()}
          {showGreen && renderGreen(railX + railWidth)}
          {showShoulder && renderShoulder(railX + railWidth + effGreen)}
        </>
      ) : side === 'right' ? (
        <>
          {/* Road right: rail → green → shoulder (shoulder closest to road) */}
          {renderRail()}
          {showGreen && renderGreen(railWidth)}
          {showShoulder && renderShoulder(railWidth + effGreen)}
        </>
      ) : (
        <>
          {/* Road left: shoulder → green → rail (shoulder closest to road) */}
          {showShoulder && renderShoulder(0)}
          {showGreen && renderGreen(effShoulder)}
          {renderRail()}
        </>
      )}
    </Group>
  )
}

// ==========================================================
// Schutzplanke (ESP/EDSP)
// ==========================================================
function SingleGuardrail({ x, length, width, postSpacing, facingSide }: {
  x: number; length: number; width: number; postSpacing: number; facingSide: 'left' | 'right'
}) {
  const posts = buildPostPositions(length, postSpacing)
  const holmWidth = Math.max(0.04, width * 0.55)
  const holmX = facingSide === 'right' ? width * 0.08 : width - width * 0.08 - holmWidth
  const postWidth = Math.max(0.03, width * 0.65)
  const postDepth = Math.min(0.055, width * 0.35)
  const postX = (width - postWidth) / 2
  const waveCount = Math.max(2, Math.floor(length / 0.3))
  const waveStep = length / waveCount

  return (
    <Group x={x}>
      <Rect width={width} height={length} fill="#6a6a68" />
      <Rect x={holmX} width={holmWidth} height={length} fill="#c2c0bc" />
      {Array.from({ length: waveCount }, (_, i) => (
        <Rect key={`w-${i}`} x={holmX} y={i * waveStep} width={holmWidth} height={waveStep}
          fill={i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'} listening={false} />
      ))}
      <Line points={[holmX, 0, holmX, length]} stroke="rgba(255,255,255,0.38)" strokeWidth={0.012} listening={false} />
      <Line points={[holmX + holmWidth, 0, holmX + holmWidth, length]} stroke="rgba(0,0,0,0.22)" strokeWidth={0.012} listening={false} />
      <Line points={[holmX + holmWidth * 0.5, 0, holmX + holmWidth * 0.5, length]} stroke="rgba(180,178,174,0.5)" strokeWidth={0.008} listening={false} />
      {posts.map((py, i) => (
        <Group key={`p-${i}`}>
          <Rect x={postX} y={py - postDepth / 2} width={postWidth} height={postDepth} fill="#7a7876" listening={false} />
          <Line points={[postX, py - postDepth / 2, postX + postWidth, py - postDepth / 2]} stroke="rgba(255,255,255,0.18)" strokeWidth={0.006} listening={false} />
          <Line points={[postX, py + postDepth / 2, postX + postWidth, py + postDepth / 2]} stroke="rgba(0,0,0,0.2)" strokeWidth={0.006} listening={false} />
        </Group>
      ))}
    </Group>
  )
}

// ==========================================================
// Betonschutzwand (New Jersey NJ 81)
// ==========================================================
function ConcreteBarrier({ x, length, width, facingSide }: {
  x: number; length: number; width: number; facingSide: 'left' | 'right'
}) {
  const segmentLength = 3.50
  const seamCount = Math.max(0, Math.floor(length / segmentLength))
  const crownWidth = Math.max(0.03, width * 0.25)
  const crownX = (width - crownWidth) / 2
  const slopeWidth = (width - crownWidth) / 2
  const stepInset = Math.max(0.02, width * 0.15)

  return (
    <Group x={x}>
      <Rect width={width} height={length}
        fillPatternImage={getConcretePattern() as unknown as HTMLImageElement}
        fillPatternScale={{ x: 0.014, y: 0.014 }} />
      <Rect width={width} height={length} fill="rgba(210,205,196,0.25)" listening={false} />
      <Rect x={facingSide === 'right' ? 0 : width - slopeWidth} width={slopeWidth} height={length} fill="rgba(0,0,0,0.08)" listening={false} />
      <Line points={[stepInset, 0, stepInset, length]} stroke="rgba(90,85,78,0.3)" strokeWidth={0.015} listening={false} />
      <Line points={[width - stepInset, 0, width - stepInset, length]} stroke="rgba(90,85,78,0.3)" strokeWidth={0.015} listening={false} />
      <Rect x={crownX} width={crownWidth} height={length} fill="rgba(255,255,255,0.14)" listening={false} />
      <Line points={[crownX, 0, crownX, length]} stroke="rgba(255,255,255,0.2)" strokeWidth={0.008} listening={false} />
      <Line points={[crownX + crownWidth, 0, crownX + crownWidth, length]} stroke="rgba(90,85,78,0.22)" strokeWidth={0.008} listening={false} />
      <Line points={[0.005, 0, 0.005, length]} stroke="rgba(0,0,0,0.15)" strokeWidth={0.01} listening={false} />
      <Line points={[width - 0.005, 0, width - 0.005, length]} stroke="rgba(0,0,0,0.15)" strokeWidth={0.01} listening={false} />
      {Array.from({ length: seamCount }, (_, i) => {
        const seamY = (i + 1) * segmentLength
        return (
          <Group key={`s-${i}`}>
            <Line points={[0.01, seamY, width - 0.01, seamY]} stroke="rgba(70,65,58,0.25)" strokeWidth={0.012} listening={false} />
            <Line points={[0.01, seamY + 0.012, width - 0.01, seamY + 0.012]} stroke="rgba(255,255,255,0.08)" strokeWidth={0.006} listening={false} />
          </Group>
        )
      })}
    </Group>
  )
}

// ==========================================================
// Doppelschutzplanke (DDSP)
// ==========================================================
function DoubleGuardrail({ x, length, width, postSpacing }: {
  x: number; length: number; width: number; postSpacing: number
}) {
  const posts = buildPostPositions(length, postSpacing)
  const gap = Math.max(0.03, width * 0.18)
  const railWidth = Math.max(0.04, (width - gap) / 2)
  const postDepth = Math.min(0.05, width * 0.25)
  const waveCount = Math.max(2, Math.floor(length / 0.35))
  const waveStep = length / waveCount

  return (
    <Group x={x}>
      <Rect width={width} height={length} fill="#6a6a68" />
      <Rect x={railWidth} width={gap} height={length} fill="#555553" listening={false} />
      {/* Left rail */}
      <Rect width={railWidth} height={length} fill="#c0beba" />
      {Array.from({ length: waveCount }, (_, i) => (
        <Rect key={`wl-${i}`} y={i * waveStep} width={railWidth} height={waveStep}
          fill={i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'} listening={false} />
      ))}
      <Line points={[0, 0, 0, length]} stroke="rgba(255,255,255,0.3)" strokeWidth={0.01} listening={false} />
      <Line points={[railWidth, 0, railWidth, length]} stroke="rgba(0,0,0,0.18)" strokeWidth={0.01} listening={false} />
      {/* Right rail */}
      <Rect x={railWidth + gap} width={railWidth} height={length} fill="#c0beba" />
      {Array.from({ length: waveCount }, (_, i) => (
        <Rect key={`wr-${i}`} x={railWidth + gap} y={i * waveStep} width={railWidth} height={waveStep}
          fill={i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'} listening={false} />
      ))}
      <Line points={[railWidth + gap, 0, railWidth + gap, length]} stroke="rgba(255,255,255,0.3)" strokeWidth={0.01} listening={false} />
      <Line points={[width, 0, width, length]} stroke="rgba(0,0,0,0.18)" strokeWidth={0.01} listening={false} />
      {/* Posts */}
      {posts.map((py, i) => (
        <Group key={`p-${i}`}>
          <Rect y={py - postDepth / 2} width={width} height={postDepth} fill="#7a7876" listening={false} />
          <Line points={[0, py - postDepth / 2, width, py - postDepth / 2]} stroke="rgba(255,255,255,0.15)" strokeWidth={0.005} listening={false} />
          <Line points={[0, py + postDepth / 2, width, py + postDepth / 2]} stroke="rgba(0,0,0,0.18)" strokeWidth={0.005} listening={false} />
        </Group>
      ))}
    </Group>
  )
}

function buildPostPositions(length: number, spacing: number): number[] {
  if (spacing <= 0) return []
  const positions: number[] = []
  for (let py = spacing; py < length; py += spacing) positions.push(py)
  return positions
}
