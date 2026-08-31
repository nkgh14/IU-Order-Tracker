export interface Product {
  id: string
  name: string
  qty: number
  notes: string
}

export interface Order {
  id: string
  created_at: string
  updated_at: string
  updated_by: string | null
  customer_name: string
  phone: string
  email: string
  address: string
  products: Product[]
  order_received: boolean
  invoice_sent: boolean
  materials_ordered: boolean
  items_done: boolean
  invoice_paid: boolean
  package_delivered: boolean
  notes: string
  archived: boolean
}

export const STAGE_KEYS = [
  'order_received',
  'invoice_sent',
  'materials_ordered',
  'items_done',
  'invoice_paid',
  'package_delivered',
] as const

export type StageKey = (typeof STAGE_KEYS)[number]

export const STAGE_LABELS: Record<StageKey, string> = {
  order_received: 'Order received',
  invoice_sent: 'Invoice sent',
  materials_ordered: 'Materials ordered',
  items_done: 'Items done',
  invoice_paid: 'Invoice paid',
  package_delivered: 'Package delivered',
}
