<script lang="ts" setup>
import { useTeamListQuery } from '~/services/api/teamListApi'

const { data: teams } = useTeamListQuery()

const modelValue = defineModel<string>({ required: false })
</script>

<template>
  <USelect
    v-if="teams"
    v-model="modelValue"
    :options="teams"
    class="w-40"
    icon="i-heroicons-magnifying-glass-20-solid"
  />
</template>
