import { useEffect, useState } from 'react'
import { testConnection } from '@/lib/supabase'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection()
      if (result.success) {
        setStatus('connected')
      } else {
        setStatus('error')
        setError(result.error?.message || 'Failed to connect to Supabase')
      }
    }

    checkConnection()
  }, [])

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md shadow-lg">
        Checking connection...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Connection Error: {error}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4" />
      Connected to Supabase
    </div>
  )
} 