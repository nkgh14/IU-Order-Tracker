import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Order, Product } from '../types'

export interface NewOrderInput {
  customer_name: string
  phone: string
  email: string
  address: string
  products: Product[]
  notes: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ordersRef = useRef<Order[]>([])
  useEffect(() => {
    ordersRef.current = orders
  }, [orders])

  const upsert = useCallback((order: Order) => {
    setOrders((current) => {
      const idx = current.findIndex((o) => o.id === order.id)
      if (idx === -1) return [order, ...current]
      const next = [...current]
      next[idx] = order
      return next
    })
  }, [])

  const removeLocal = useCallback((id: string) => {
    setOrders((current) => current.filter((o) => o.id !== id))
  }, [])

  useEffect(() => {
    let active = true
    let channel: RealtimeChannel | null = null

    async function fetchAll() {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (!active) return
      if (fetchError) {
        setError(`Couldn't load orders: ${fetchError.message}`)
      } else if (data) {
        setOrders(data as Order[])
      }
      setLoading(false)
    }

    function subscribe() {
      channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              removeLocal((payload.old as { id: string }).id)
            } else {
              upsert(payload.new as Order)
            }
          }
        )
        .subscribe((status) => {
          if (!active) return
          if (status === 'SUBSCRIBED') {
            setConnected(navigator.onLine)
          } else if (
            status === 'CHANNEL_ERROR' ||
            status === 'TIMED_OUT' ||
            status === 'CLOSED'
          ) {
            setConnected(false)
          }
        })
    }

    function resync() {
      if (!navigator.onLine) return
      fetchAll()
      if (channel) supabase.removeChannel(channel)
      subscribe()
    }

    function handleOffline() {
      setConnected(false)
    }

    fetchAll()
    subscribe()

    window.addEventListener('online', resync)
    window.addEventListener('offline', handleOffline)

    return () => {
      active = false
      window.removeEventListener('online', resync)
      window.removeEventListener('offline', handleOffline)
      if (channel) supabase.removeChannel(channel)
    }
  }, [upsert, removeLocal])

  const addOrder = useCallback(
    async (input: NewOrderInput, actor: string): Promise<Order | null> => {
      const payload = {
        ...input,
        updated_by: actor,
        updated_at: new Date().toISOString(),
      }
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert(payload)
        .select()
        .single()
      if (insertError) {
        setError(`Couldn't save the order: ${insertError.message}`)
        return null
      }
      const order = data as Order
      upsert(order)
      return order
    },
    [upsert]
  )

  const updateOrder = useCallback(
    async (id: string, patch: Partial<Order>, actor: string): Promise<boolean> => {
      const prev = ordersRef.current.find((o) => o.id === id)
      if (!prev) return false
      const updated_at = new Date().toISOString()
      const optimistic: Order = { ...prev, ...patch, updated_at, updated_by: actor }
      upsert(optimistic)

      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ ...patch, updated_at, updated_by: actor })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        upsert(prev)
        setError(`Couldn't save your change: ${updateError.message}`)
        return false
      }
      if (data) upsert(data as Order)
      return true
    },
    [upsert]
  )

  const dismissError = useCallback(() => setError(null), [])

  return { orders, loading, connected, error, dismissError, addOrder, updateOrder }
}
