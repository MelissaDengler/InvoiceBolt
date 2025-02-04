export function validateEnv() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  for (const variable of required) {
    if (!import.meta.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`)
    }
  }
} 