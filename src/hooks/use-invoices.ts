import { useCallback, useState, useEffect } from 'react'
import { supabase, subscribeToInvoices } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Invoice = Database['public']['Tables']['invoices']['Row']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export function useInvoices() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  // Fetch initial invoices
  useEffect(() => {
    fetchInvoices()
    
    // Set up real-time subscription
    const subscription = subscribeToInvoices((payload) => {
      if (payload.eventType === 'INSERT') {
        setInvoices(prev => [payload.new as Invoice, ...prev])
      } else if (payload.eventType === 'DELETE') {
        setInvoices(prev => prev.filter(invoice => invoice.id !== payload.old.id))
      } else if (payload.eventType === 'UPDATE') {
        setInvoices(prev => prev.map(invoice => 
          invoice.id === payload.new.id ? payload.new as Invoice : invoice
        ))
      }
    })

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = useCallback(async (invoice: Omit<InvoiceInsert, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true)
      
      // Generate invoice number (you might want to implement a more robust system)
      const invoiceNumber = `INV-${Date.now()}`
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoice,
          invoice_number: invoiceNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
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

  const updateInvoice = useCallback(async (id: string, updates: Partial<InvoiceUpdate>) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          customers (
            name,
            email
          )
        `)
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
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
} 