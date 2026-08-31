import { useState } from 'react'
import { isUnlocked, getDisplayName } from './lib/storage'
import { useOrders } from './hooks/useOrders'
import { PasscodeGate } from './components/PasscodeGate'
import { NamePrompt } from './components/NamePrompt'
import { ConnectionBanner } from './components/ConnectionBanner'
import { OrderList } from './components/OrderList'
import { AddOrderModal } from './components/AddOrderModal'
import { OrderDetailsModal } from './components/OrderDetailsModal'
import type { StageKey } from './types'

function App() {
  const [unlocked, setUnlockedFlag] = useState(isUnlocked())
  const [displayName, setDisplayNameState] = useState(getDisplayName())

  if (!unlocked) return <PasscodeGate onUnlock={() => setUnlockedFlag(true)} />
  if (!displayName) return <NamePrompt onSet={setDisplayNameState} />

  return <OrderTracker displayName={displayName} />
}

function OrderTracker({ displayName }: { displayName: string }) {
  const { orders, loading, connected, error, dismissError, addOrder, updateOrder } = useOrders()
  const [showAdd, setShowAdd] = useState(false)
  const [detailsId, setDetailsId] = useState<string | null>(null)

  const disabled = !connected
  const detailsOrder = orders.find((o) => o.id === detailsId) ?? null

  function handleToggleStage(id: string, key: StageKey, value: boolean) {
    updateOrder(id, { [key]: value }, displayName)
  }

  return (
    <div className="min-h-svh bg-neutral-950 text-neutral-100">
      <ConnectionBanner connected={connected} />

      {error && (
        <div className="sticky top-0 z-40 bg-neutral-800 border-b border-red-500/40 text-sm text-red-300 px-4 py-2 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={dismissError} className="text-neutral-400 hover:text-neutral-100">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-svh">
          <p className="text-neutral-500">Loading orders…</p>
        </div>
      ) : (
        <OrderList
          orders={orders}
          onToggleStage={handleToggleStage}
          onOpenDetails={setDetailsId}
          onAddOrder={() => setShowAdd(true)}
          disabled={disabled}
        />
      )}

      {showAdd && (
        <AddOrderModal
          onClose={() => setShowAdd(false)}
          onSave={(input) => addOrder(input, displayName)}
        />
      )}

      {detailsOrder && (
        <OrderDetailsModal
          key={detailsOrder.id}
          order={detailsOrder}
          disabled={disabled}
          onClose={() => setDetailsId(null)}
          onUpdate={(id, patch) => updateOrder(id, patch, displayName)}
          onSetArchived={(id, archived) => updateOrder(id, { archived }, displayName)}
        />
      )}
    </div>
  )
}

export default App
