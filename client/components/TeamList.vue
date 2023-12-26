<script lang="ts" setup>
const supabase = useTypedSupabaseClient()

const { data: teams } = await supabase.from('team').select('*').order('team_name', { ascending: true })
const team = ref<string>()
</script>

<template>
  <USelectMenu v-if="teams" v-model="team" searchable :options="teams" option-attribute="team_name" value-attribute="team_name" class="w-40" />
  {{ team }}
</template>
