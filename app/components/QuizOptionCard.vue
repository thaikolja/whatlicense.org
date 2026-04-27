<template>
  <div
      class="opt-card p-8 md:p-10 rounded-3xl flex flex-col justify-between h-full" :class="{ 'selected': selected }" @click="$emit('select')">
    <div class="flex justify-between items-start mb-6">
      <div class="text-3xl font-bold serif text-espresso">{{ option.title }}</div>
      <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4" :class="selected ? 'border-charcoal' : 'border-border'">
        <div v-if="selected" class="w-3 h-3 bg-charcoal rounded-full"></div>
      </div>
    </div>

    <div class="text-xl text-muted mb-6 flex-1 leading-relaxed">
      {{ option.desc }}
    </div>

    <button
        @click.stop="isExampleOpen = !isExampleOpen" class="text-sm font-bold uppercase tracking-widest text-tan hover:text-charcoal transition-colors flex items-center gap-2 mt-auto self-start">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      View real life example
    </button>

    <div
        class="example-panel mt-4 text-walnut text-sm leading-relaxed bg-cream-dark p-4 rounded-xl border border-border" :class="{ 'open': isExampleOpen }">
      {{ option.example }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref }             from 'vue'
  import type { QuizOption } from '~/types'

  defineProps<{
    option: QuizOption
    selected: boolean
  }>()

  defineEmits<{
    (e: 'select'): void
  }>()

  const isExampleOpen = ref(false)
</script>
