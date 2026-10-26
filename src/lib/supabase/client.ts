import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.PUBLIC_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()

if (!url || !publishableKey) {
  throw new Error(
    '[Supabase] Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copia .env.example a .env, configura ambas variables y reinicia Astro.',
  )
}

if (url.includes('YOUR_PROJECT_REF') || publishableKey === 'sb_publishable_YOUR_KEY') {
  throw new Error('[Supabase] Reemplaza los placeholders de .env con la URL y la clave publishable de tu proyecto.')
}

// Singleton independiente del repositorio local. Sin sesiones ni detección de callbacks
// durante foundation. En el checkpoint de Auth se revisarán y activarán según corresponda.
// En frontend están prohibidas las claves secret/service_role; usar solo publishable.
export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
