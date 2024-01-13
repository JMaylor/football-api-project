import { useQuery } from '@tanstack/vue-query'

export function useHeadToHeadQuery({ primaryTeam, secondaryTeam }: { primaryTeam: MaybeRef<string>, secondaryTeam: MaybeRef<string> }) {
  const supabase = useTypedSupabaseClient()
  return useQuery({
    queryFn: async () => {
      const response = await supabase.rpc('head_to_head', { primary_team: unref(primaryTeam), secondary_team: unref(secondaryTeam) })
      if (response.error)
        throw new Error(response.error.message)

      return response.data
    },
    queryKey: ['headToHead', { primaryTeam, secondaryTeam }],
  })
}
