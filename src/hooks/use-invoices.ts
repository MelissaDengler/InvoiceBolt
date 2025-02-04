import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'
import type { CreateInvoiceInput, DbInvoice } from '@/types/invoice'
import { mockInvoices } from '@/lib/mock/invoices'
import type { Invoice } from '@/types/invoice'

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate API call
    const loadInvoices = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInvoices(mockInvoices);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load invoices'));
        setLoading(false);
      }
    };

    loadInvoices();
  }, [])

  const createInvoice = async (invoice: Invoice) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newInvoice = {
      ...invoice,
      id: `INV-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const deleteInvoice = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  return {
    invoices,
    loading,
    error,
    createInvoice,
    deleteInvoice,
  }
} 