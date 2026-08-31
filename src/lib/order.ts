import { STAGE_KEYS, type Order } from '../types'

export function stageProgress(order: Order): number {
  return STAGE_KEYS.reduce((count, key) => count + (order[key] ? 1 : 0), 0)
}

export function isComplete(order: Order): boolean {
  return stageProgress(order) === STAGE_KEYS.length
}

export function orderTier(order: Order): number {
  if (order.archived) return 2
  return isComplete(order) ? 1 : 0
}

export function matchesSearch(order: Order, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    order.customer_name.toLowerCase().includes(q) ||
    order.email.toLowerCase().includes(q) ||
    order.phone.toLowerCase().includes(q) ||
    order.products.some((p) => p.name.toLowerCase().includes(q))
  )
}
