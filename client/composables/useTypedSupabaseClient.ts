import type { Database } from '~/types/supabase'

export function useTypedSupabaseClient() {
  return useSupabaseClient<Database>()
}
