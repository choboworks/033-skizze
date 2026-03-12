// src/modules/ui/RadioGroup.tsx

type RadioOption<T extends string> = {
  value: T
  label: string
  description?: string
}

type RadioGroupProps<T extends string> = {
  label: string
  options: RadioOption<T>[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}

export function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: RadioGroupProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text)]">
        {label}
      </label>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition
                       ${value === option.value
                         ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                         : 'border-[var(--border)] bg-[var(--panel)] hover:bg-[var(--panel-elev)]'
                       }
                       ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as T)}
              disabled={disabled}
              className="mt-0.5 w-4 h-4 accent-[var(--primary)]"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text)]">
                {option.label}
              </div>
              {option.description && (
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}