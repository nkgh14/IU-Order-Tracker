import { useState, type FormEvent } from 'react'
import type { NewOrderInput } from '../hooks/useOrders'
import type { Product } from '../types'
import { ProductLineEditor, makeBlankProduct } from './ProductLineEditor'

interface AddOrderModalProps {
  onClose: () => void
  onSave: (input: NewOrderInput) => Promise<unknown>
}

export function AddOrderModal({ onClose, onSave }: AddOrderModalProps) {
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [products, setProducts] = useState<Product[]>([makeBlankProduct()])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmedName = customerName.trim()
    if (!trimmedName) return
    setSaving(true)
    const cleanedProducts = products.filter((p) => p.name.trim() || p.notes.trim() || p.qty)
    const result = await onSave({
      customer_name: trimmedName,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      products: cleanedProducts,
      notes: notes.trim(),
    })
    setSaving(false)
    if (result) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full sm:max-w-lg max-h-[92svh] overflow-y-auto rounded-t-xl sm:rounded-xl border border-neutral-800 bg-neutral-900 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-100">Add order</h2>
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
            <label htmlFor="customer-name" className="block text-sm text-neutral-400 mb-1">
              Customer name <span className="text-amber-400">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              autoFocus
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm text-neutral-400 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-neutral-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm text-neutral-400 mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
            />
          </div>

          <div>
            <span className="block text-sm text-neutral-400 mb-1">Products ordered</span>
            <ProductLineEditor products={products} onChange={setProducts} />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm text-neutral-400 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-700 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!customerName.trim() || saving}
            className="rounded-md bg-amber-400 px-4 py-2.5 text-sm font-medium text-neutral-950 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none"
          >
            {saving ? 'Saving…' : 'Save order'}
          </button>
        </div>
      </form>
    </div>
  )
}
