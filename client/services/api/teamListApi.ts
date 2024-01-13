import { useQuery } from '@tanstack/vue-query'

export function useTeamListQuery() {
  const supabase = useTypedSupabaseClient()
  return useQuery({
    queryFn: async () => {
      const response = await supabase.from('team').select('*').order('team_name', { ascending: true })
      if (response.error)
        throw new Error(response.error.message)

      return response.data
    },
    queryKey: ['teams'],
    select: response => response.map(({ team_name }) => team_name),
  })
}
