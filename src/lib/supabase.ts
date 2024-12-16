import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL:', supabaseUrl)
  throw new Error('Invalid VITE_SUPABASE_URL format. Must be a valid URL.')
}

console.log('Creating Supabase client with:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyStart: supabaseAnonKey.substring(0, 10)
})

// Add error handling for invalid anon key format
if (!/^[a-zA-Z0-9\-_]+$/.test(supabaseAnonKey)) {
  throw new Error('Invalid VITE_SUPABASE_ANON_KEY format')
}

// Add timeout to client creation
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    },
    global: {
      headers: { 'x-application-name': 'invoice-app' },
    },
    db: {
      schema: 'public'
    }
  }
)

// Modified test connection to check auth headers
export const testSupabaseConnection = async () => {
  try {
    console.log('=== Supabase Connection Test ===')
    console.log('URL:', supabaseUrl)
    
    // Test 1: Basic Auth Check
    console.log('\n1. Testing Authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('Auth Test Result:', { 
      success: !authError, 
      session: authData?.session ? 'Present' : 'None',
      error: authError 
    })

    // Test 2: Simple Table Access with explicit headers
    console.log('\n2. Testing Basic Table Access...')
    const { data: tableData, error: tableError } = await supabase
      .from('invoices')
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.error('Table access error:', {
        code: tableError.code,
        message: tableError.message,
        details: tableError.details,
        hint: tableError.hint
      })
    }
    
    console.log('Table Access Result:', { 
      success: !tableError, 
      hasData: tableData && tableData.length > 0,
      error: tableError 
    })

    // Test 3: Direct API Call
    console.log('\n3. Testing Direct API Call...')
    const response = await fetch(`${supabaseUrl}/rest/v1/invoices?select=id&limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    const responseData = await response.text()
    console.log('Direct API Call Result:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      data: responseData
    })

    // Summary
    console.log('\n=== Connection Test Summary ===')
    const allErrors = [authError, tableError].filter(Boolean)
    if (allErrors.length === 0) {
      console.log('✅ All tests passed successfully')
      return { success: true, data: { auth: authData, table: tableData } }
    } else {
      console.error('❌ Some tests failed:', allErrors)
      return { 
        success: false, 
        errors: allErrors,
        errorDetails: {
          auth: authError,
          table: tableError
        }
      }
    }

  } catch (err) {
    console.error('🚨 Critical Connection Error:', err)
    return { 
      success: false, 
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export const subscribeToInvoices = (callback: (payload: any) => void) => {
  return supabase
    .channel('invoice-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'invoices'
      },
      callback
    )
    .subscribe()
} 