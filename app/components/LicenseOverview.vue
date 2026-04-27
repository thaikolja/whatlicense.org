<template>
  <section class="mb-16">
    <div class="text-center mb-10">
      <h2 class="serif text-3xl font-bold text-charcoal mb-2">1. License Overview</h2>
      <h3 class="text-muted text-lg">A quick summary of what you are legally allowing, requiring, and limiting.</h3>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <OverviewFlipCard
          category="Permissions" :items="license.permissions || []" colorTheme="green" />
      <OverviewFlipCard
          category="Conditions" :items="license.conditions || []" colorTheme="blue" />
      <OverviewFlipCard
          category="Limitations" :items="license.limitations || []" colorTheme="red" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { License } from '~/types'

  defineProps<{
    license: License
  }>()
</script>
