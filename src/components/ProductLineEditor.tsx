import type { Product } from '../types'

function makeBlankProduct(): Product {
  return { id: crypto.randomUUID(), name: '', qty: 1, notes: '' }
}

export { makeBlankProduct }

interface ProductLineEditorProps {
  products: Product[]
  onChange: (products: Product[]) => void
  /** Called when a change should be persisted (blur of a field, or add/remove). */
  onCommit?: (products: Product[]) => void
  disabled?: boolean
}

export function ProductLineEditor({
  products,
  onChange,
  onCommit,
  disabled,
}: ProductLineEditorProps) {
  function updateLine(id: string, patch: Partial<Product>) {
    onChange(products.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function removeLine(id: string) {
    const next = products.filter((p) => p.id !== id)
    onChange(next)
    onCommit?.(next)
  }

  function addLine() {
    const next = [...products, makeBlankProduct()]
    onChange(next)
    onCommit?.(next)
  }

  function handleBlur() {
    onCommit?.(products)
  }

  return (
    <div className="space-y-2">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="grid grid-cols-[1fr_4.5rem_auto] gap-2 items-start rounded-md border border-neutral-800 bg-neutral-950 p-2"
        >
          <div className="space-y-1.5 col-span-2">
            <label className="sr-only" htmlFor={`product-name-${product.id}`}>
              Product {i + 1} name
            </label>
            <input
              id={`product-name-${product.id}`}
              type="text"
              placeholder="Product name"
              value={product.name}
              disabled={disabled}
              onChange={(e) => updateLine(product.id, { name: e.target.value })}
              onBlur={handleBlur}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600"
            />
            <label className="sr-only" htmlFor={`product-notes-${product.id}`}>
              Product {i + 1} notes
            </label>
            <input
              id={`product-notes-${product.id}`}
              type="text"
              placeholder="Notes (size, color, etc.)"
              value={product.notes}
              disabled={disabled}
              onChange={(e) => updateLine(product.id, { notes: e.target.value })}
              onBlur={handleBlur}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600"
            />
          </div>
          <label className="sr-only" htmlFor={`product-qty-${product.id}`}>
            Product {i + 1} quantity
          </label>
          <input
            id={`product-qty-${product.id}`}
            type="number"
            min={0}
            placeholder="Qty"
            value={product.qty}
            disabled={disabled}
            onChange={(e) => updateLine(product.id, { qty: Number(e.target.value) })}
            onBlur={handleBlur}
            className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => removeLine(product.id)}
            aria-label={`Remove product ${i + 1}`}
            className="col-start-3 row-start-1 justify-self-end rounded border border-neutral-700 px-2 py-1.5 text-xs text-neutral-400 hover:border-red-500 hover:text-red-400 disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={addLine}
        className="rounded-md border border-dashed border-neutral-700 px-3 py-2 text-sm text-neutral-400 hover:border-amber-400 hover:text-amber-300 disabled:opacity-40"
      >
        + Add product
      </button>
    </div>
  )
}
