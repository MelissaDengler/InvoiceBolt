import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'
import type { CreateInvoiceInput, DbInvoice } from '@/types/invoice'

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<DbInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Fetching invoices...')
      
      // Use GET instead of POST and add proper headers
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            id,
            name,
            email,
            phone,
            address
          )
        `)
        .order('created_at', { ascending: false })
        .returns<DbInvoice[]>()

      console.log('Full query response:', {
        success: !error,
        hasData: data && data.length > 0,
        dataCount: data?.length,
        error: error ? {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        } : null
      })

      if (error) throw error
      
      if (data) {
        console.log('Setting invoices:', {
          count: data.length,
          sample: data[0] ? {
            id: data[0].id,
            hasCustomer: !!data[0].customers
          } : null
        })
        setInvoices(data)
      } else {
        setInvoices([])
      }
    } catch (err) {
      console.error('Error fetching invoices:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      })
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()

    // Set up real-time subscription
    const subscription = supabase
      .channel('invoice-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Real-time update received:', payload)
          fetchInvoices()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchInvoices])

  const createInvoice = useCallback(async (invoice: CreateInvoiceInput, customer: CustomerData) => {
    try {
      setLoading(true)
      console.log('Creating invoice with data:', { invoice, customer })
      
      // Add timeout for operations
      const timeout = setTimeout(() => {
        throw new Error('Operation timed out')
      }, 30000)

      // First create the customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null
        })
        .select('*')
        .single()

      if (customerError) {
        console.error('Customer creation error:', customerError)
        if (customerError.code === '42501') {
          throw new Error('Permission denied. Please check database policies.')
        }
        throw customerError
      }

      if (!customerData) {
        throw new Error('Customer creation failed - no data returned')
      }

      console.log('Customer created successfully:', customerData)

      const invoiceNumber = `INV-${Date.now()}`
      
      // Then create the invoice with the new customer_id
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          customer_id: customerData.id,
          status: invoice.status || 'pending',
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          total_amount: invoice.total_amount,
          currency: invoice.currency || 'USD',
          notes: invoice.notes || null,
          logo_url: invoice.logo_url || null
        })
        .select('*')
        .single()

      if (invoiceError) {
        console.error('Invoice creation error:', invoiceError)
        // Try to cleanup the customer if invoice creation fails
        await supabase.from('customers').delete().eq('id', customerData.id)
        throw invoiceError
      }

      if (!invoiceData) {
        throw new Error('Invoice creation failed - no data returned')
      }

      console.log('Invoice created successfully:', invoiceData)

      // Create invoice items if they exist
      if (invoice.items?.length) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            invoice.items.map(item => ({
              invoice_id: invoiceData.id,
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              // unit_price and amount will be calculated automatically by the database
            }))
          )

        if (itemsError) {
          console.error('Items creation error:', itemsError)
          // Try to cleanup if items creation fails
          await supabase.from('invoices').delete().eq('id', invoiceData.id)
          await supabase.from('customers').delete().eq('id', customerData.id)
          throw itemsError
        }
      }

      // Fetch the complete invoice with items and customer
      const { data: completeInvoice, error: fetchError } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (*),
          items:invoice_items (
            id,
            description,
            quantity,
            rate,
            unit_price,
            amount
          )
        `)
        .eq('id', invoiceData.id)
        .single()

      if (fetchError) throw fetchError
      
      await fetchInvoices() // Refresh the list
      clearTimeout(timeout)
      return completeInvoice as DbInvoice
    } catch (err) {
      console.error('Error creating invoice:', err)
      setError(err instanceof Error ? err : new Error('An error occurred'))
      if (err instanceof Error) {
        if (err.message.includes('duplicate key')) {
          throw new Error('An invoice with this number already exists')
        }
        if (err.message.includes('permission denied')) {
          throw new Error('You do not have permission to create invoices')
        }
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchInvoices])

  const updateInvoice = useCallback(async (id: string, updates: Database['public']['Tables']['invoices']['Update']) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      
      // Refresh the invoices list
      fetchInvoices()
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchInvoices])

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Refresh the invoices list
      fetchInvoices()
      return true
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchInvoices])

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
} 