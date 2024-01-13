<script lang="ts" setup>
const primaryTeam = ref<string>()
const secondaryTeam = ref<string>()

const teamsSelected = computed(() => primaryTeam.value && secondaryTeam.value)

watch(teamsSelected, (val) => {
  if (val)
    navigateTo(`/${primaryTeam.value}/${secondaryTeam.value}`)
})
</script>

<template>
  <div class="flex gap-4">
    <TeamList v-model="primaryTeam" />
    <TeamList v-model="secondaryTeam" />
  </div>
</template>
