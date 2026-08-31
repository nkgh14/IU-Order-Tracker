import { STAGE_KEYS, STAGE_LABELS, type Order } from '../types'

interface StageChecklistProps {
  order: Order
  onToggle: (key: (typeof STAGE_KEYS)[number], value: boolean) => void
  disabled?: boolean
  compact?: boolean
}

export function StageChecklist({ order, onToggle, disabled, compact }: StageChecklistProps) {
  return (
    <div
      className={
        compact
          ? 'flex flex-wrap gap-1.5'
          : 'grid grid-cols-1 sm:grid-cols-2 gap-2'
      }
    >
      {STAGE_KEYS.map((key) => {
        const checked = order[key]
        return (
          <label
            key={key}
            className={
              (compact
                ? 'flex items-center gap-1.5 px-2 py-1.5 text-xs '
                : 'flex items-center gap-3 px-3 py-3 text-sm ') +
              'rounded-md border border-neutral-700 bg-neutral-900 text-neutral-300 select-none transition-colors ' +
              'has-[:checked]:border-sky-400 has-[:checked]:bg-sky-400/10 has-[:checked]:text-sky-300 ' +
              (disabled
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer hover:border-neutral-600')
            }
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) => onToggle(key, e.target.checked)}
              className={compact ? 'h-4 w-4 accent-sky-400' : 'h-5 w-5 accent-sky-400'}
            />
            {STAGE_LABELS[key]}
          </label>
        )
      })}
    </div>
  )
}
