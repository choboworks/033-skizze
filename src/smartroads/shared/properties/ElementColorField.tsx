import { ColorPicker } from '@/components/Inspector/ColorPicker'

interface Props {
  value: string
  hasCustomColor: boolean
  onChange: (color: string) => void
  onReset: () => void
}

export function ElementColorField({ value, hasCustomColor, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px]" style={{ color: 'var(--text)', fontWeight: 500 }}>Farbe</span>
      <div className="color-picker-well">
        <ColorPicker value={value} onChange={onChange} />
      </div>
      <button
        type="button"
        className="toggle-btn h-8 rounded-lg text-[11px] font-medium"
        disabled={!hasCustomColor}
        onClick={onReset}
        style={{
          opacity: hasCustomColor ? 1 : 0.5,
          cursor: hasCustomColor ? 'pointer' : 'default',
        }}
      >
        Standardfarbe
      </button>
    </div>
  )
}
