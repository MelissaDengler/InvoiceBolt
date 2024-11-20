import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Invoice = Database['public']['Tables']['invoices']['Row']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export function useInvoices() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getInvoices = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createInvoice = useCallback(async (invoice: InvoiceInsert) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateInvoice = useCallback(async (id: string, updates: InvoiceUpdate) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
} 