<script lang="ts" setup>
import { useHeadToHeadQuery } from '~/services/api/headToHeadApi'

const route = useRoute('primaryTeam-secondaryTeam')

const { data: headToHead, isLoading } = useHeadToHeadQuery(route.params)

const columns = [
  {
    key: 'fixture_date',
    label: 'Date',
    sortable: true,
  },
  {
    key: 'home_team_name',
    label: 'Home Team',
  },
  {
    key: 'full_time_home_goals',
    label: 'Home Goals',
  },
  {
    key: 'full_time_away_goals',
    label: 'Away Goals',
  },
  {
    key: 'away_team_name',
    label: 'Away Team',
  },
]
</script>

<template>
  <div>
    {{ route.params.secondaryTeam }} -- {{ headToHead?.length }}
    <UTable :columns="columns" :rows="headToHead" :loading="isLoading" />
  </div>
</template>
