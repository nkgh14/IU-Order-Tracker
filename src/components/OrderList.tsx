import { useMemo, useState } from 'react'
import type { Order, StageKey } from '../types'
import { matchesSearch, orderTier } from '../lib/order'
import { OrderRow } from './OrderRow'

interface OrderListProps {
  orders: Order[]
  onToggleStage: (id: string, key: StageKey, value: boolean) => void
  onOpenDetails: (id: string) => void
  onAddOrder: () => void
  disabled: boolean
}

export function OrderList({
  orders,
  onToggleStage,
  onOpenDetails,
  onAddOrder,
  disabled,
}: OrderListProps) {
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  const visible = useMemo(() => {
    let list = showArchived ? orders : orders.filter((o) => !o.archived)
    if (search.trim()) list = list.filter((o) => matchesSearch(o, search))
    return [...list].sort((a, b) => {
      const ta = orderTier(a)
      const tb = orderTier(b)
      if (ta !== tb) return ta - tb
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [orders, search, showArchived])

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 pb-24">
      <header className="flex items-center justify-between py-5 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-100 tracking-tight">
          IU Order Tracker
        </h1>
        <button
          onClick={onAddOrder}
          disabled={disabled}
          className="rounded-md bg-sky-400 px-3.5 py-2 text-sm font-medium text-neutral-950 hover:bg-sky-300 disabled:opacity-40 disabled:pointer-events-none"
        >
          + Add order
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <label htmlFor="search" className="sr-only">
          Search orders
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search name, email, phone, or product…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-600"
        />
        <label className="flex items-center gap-2 px-1 text-sm text-neutral-400 select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-4 w-4 accent-sky-400"
          />
          Show archived
        </label>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-800 py-16 px-4 text-center">
          <p className="text-neutral-300 font-medium mb-1">No orders yet</p>
          <p className="text-neutral-500 text-sm mb-4">Add the first one to get started.</p>
          <button
            onClick={onAddOrder}
            className="rounded-md bg-sky-400 px-4 py-2.5 text-sm font-medium text-neutral-950 hover:bg-sky-300"
          >
            + Add order
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-neutral-500 text-sm py-10 text-center">
          {search.trim()
            ? 'No orders match your search.'
            : 'Everything visible is archived — check "Show archived" to see it.'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {visible.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onToggleStage={onToggleStage}
              onOpenDetails={onOpenDetails}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}
