import { useRef, useState } from 'react'
import type { Order, Product, StageKey } from '../types'
import { formatDateTime, telHref } from '../lib/format'
import { StageChecklist } from './StageChecklist'
import { ProductLineEditor } from './ProductLineEditor'

interface OrderDetailsModalProps {
  order: Order
  onClose: () => void
  onUpdate: (id: string, patch: Partial<Order>) => void
  onSetArchived: (id: string, archived: boolean) => void
  disabled: boolean
}

type TextField = 'customer_name' | 'phone' | 'email' | 'address' | 'notes'

export function OrderDetailsModal({
  order,
  onClose,
  onUpdate,
  onSetArchived,
  disabled,
}: OrderDetailsModalProps) {
  const [draft, setDraft] = useState({
    customer_name: order.customer_name,
    phone: order.phone,
    email: order.email,
    address: order.address,
    notes: order.notes,
  })
  const [products, setProducts] = useState<Product[]>(order.products)
  const [confirmingArchive, setConfirmingArchive] = useState(false)

  const lastCommitted = useRef({ ...draft })

  function commitField(field: TextField) {
    const value = draft[field]
    if (lastCommitted.current[field] === value) return
    if (field === 'customer_name' && !value.trim()) {
      // customer name can't be blanked out — revert
      setDraft((d) => ({ ...d, customer_name: lastCommitted.current.customer_name }))
      return
    }
    lastCommitted.current = { ...lastCommitted.current, [field]: value }
    onUpdate(order.id, { [field]: value })
  }

  function commitProducts(next: Product[]) {
    setProducts(next)
    onUpdate(order.id, { products: next })
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92svh] overflow-y-auto rounded-t-xl sm:rounded-xl border border-neutral-800 bg-neutral-900 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-100">Order details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-sm text-neutral-400 mb-2">Stages</span>
            <StageChecklist
              order={order}
              disabled={disabled}
              onToggle={(key: StageKey, value) => onUpdate(order.id, { [key]: value })}
            />
          </div>

          <div>
            <label htmlFor="d-name" className="block text-sm text-neutral-400 mb-1">
              Customer name
            </label>
            <input
              id="d-name"
              type="text"
              disabled={disabled}
              value={draft.customer_name}
              onChange={(e) => setDraft((d) => ({ ...d, customer_name: e.target.value }))}
              onBlur={() => commitField('customer_name')}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="d-phone" className="block text-sm text-neutral-400 mb-1">
                Phone
              </label>
              <input
                id="d-phone"
                type="tel"
                disabled={disabled}
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                onBlur={() => commitField('phone')}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
              />
              {order.phone && (
                <a href={telHref(order.phone)} className="mt-1 inline-block text-sm text-amber-400 hover:underline">
                  Call {order.phone}
                </a>
              )}
            </div>
            <div>
              <label htmlFor="d-email" className="block text-sm text-neutral-400 mb-1">
                Email
              </label>
              <input
                id="d-email"
                type="email"
                disabled={disabled}
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                onBlur={() => commitField('email')}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
              />
              {order.email && (
                <a href={`mailto:${order.email}`} className="mt-1 inline-block text-sm text-amber-400 hover:underline">
                  Email {order.email}
                </a>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="d-address" className="block text-sm text-neutral-400 mb-1">
              Address
            </label>
            <input
              id="d-address"
              type="text"
              disabled={disabled}
              value={draft.address}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
              onBlur={() => commitField('address')}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
            />
          </div>

          <div>
            <span className="block text-sm text-neutral-400 mb-1">Products ordered</span>
            <ProductLineEditor
              products={products}
              onChange={setProducts}
              onCommit={commitProducts}
              disabled={disabled}
            />
          </div>

          <div>
            <label htmlFor="d-notes" className="block text-sm text-neutral-400 mb-1">
              Notes
            </label>
            <textarea
              id="d-notes"
              rows={3}
              disabled={disabled}
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              onBlur={() => commitField('notes')}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
            />
          </div>

          <div className="text-xs text-neutral-500 border-t border-neutral-800 pt-3 space-y-0.5">
            <p>Created {formatDateTime(order.created_at)}</p>
            <p>
              Last updated {formatDateTime(order.updated_at)}
              {order.updated_by ? ` by ${order.updated_by}` : ''}
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            {order.archived ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSetArchived(order.id, false)}
                className="text-sm text-amber-400 hover:text-amber-300 disabled:opacity-40 disabled:pointer-events-none"
              >
                Unarchive this order
              </button>
            ) : !confirmingArchive ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setConfirmingArchive(true)}
                className="text-sm text-red-400 hover:text-red-300 disabled:opacity-40 disabled:pointer-events-none"
              >
                Archive this order
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-300">Archive this order?</span>
                <button
                  type="button"
                  onClick={() => {
                    onSetArchived(order.id, true)
                    setConfirmingArchive(false)
                    onClose()
                  }}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-500"
                >
                  Yes, archive
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingArchive(false)}
                  className="rounded-md border border-neutral-700 px-3 py-1.5 text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
