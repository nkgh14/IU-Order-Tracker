import type { Order, StageKey } from '../types'
import { STAGE_KEYS } from '../types'
import { isComplete, stageProgress } from '../lib/order'
import { StageChecklist } from './StageChecklist'

interface OrderRowProps {
  order: Order
  onToggleStage: (id: string, key: StageKey, value: boolean) => void
  onOpenDetails: (id: string) => void
  disabled: boolean
}

export function OrderRow({ order, onToggleStage, onOpenDetails, disabled }: OrderRowProps) {
  const complete = isComplete(order)
  const progress = stageProgress(order)

  return (
    <div
      className={
        'rounded-lg border p-3 sm:p-4 transition-colors ' +
        (order.archived
          ? 'border-neutral-800/60 bg-neutral-900/40 opacity-50'
          : complete
            ? 'border-neutral-800/70 bg-neutral-900/60 opacity-70'
            : 'border-neutral-800 bg-neutral-900')
      }
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="min-w-0">
          <p className="font-medium text-neutral-100 truncate">
            {order.customer_name || 'Unnamed customer'}
          </p>
          {order.email && <p className="text-sm text-neutral-500 truncate">{order.email}</p>}
          {order.archived && (
            <span className="inline-block mt-1 rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
              Archived
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={
              'font-mono text-sm tabular-nums rounded px-1.5 py-0.5 ' +
              (complete ? 'text-amber-300 bg-amber-400/10' : 'text-neutral-400 bg-neutral-800')
            }
          >
            {progress}/{STAGE_KEYS.length}
          </span>
          <button
            onClick={() => onOpenDetails(order.id)}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Details
          </button>
        </div>
      </div>

      <StageChecklist
        order={order}
        compact
        disabled={disabled}
        onToggle={(key, value) => onToggleStage(order.id, key, value)}
      />
    </div>
  )
}
