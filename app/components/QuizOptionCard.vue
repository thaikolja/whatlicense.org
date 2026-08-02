<template>
  <div
      class="opt-card p-8 md:p-10 rounded-3xl flex flex-col justify-between h-full"
      :class="{ 'selected': selected }"
      @click="$emit('select')"
  >
    <div class="flex justify-between items-start mb-6">
      <div class="text-3xl font-bold serif text-espresso">{{ option.title }}</div>
      <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4"
          :class="selected ? 'border-charcoal' : 'border-border'"
      >
        <div
            v-if="selected"
            class="w-3 h-3 bg-charcoal rounded-full"
        ></div>
      </div>
    </div>

    <div class="text-xl text-muted mb-6 flex-1 leading-relaxed">
      {{ option.desc }}
    </div>

    <div class="example-panel mt-4 text-walnut text-sm leading-relaxed bg-cream-dark/50 p-4 rounded-xl border border-border">
      <span class="text-[10px] font-bold uppercase tracking-widest text-tan block mb-1">Real Life Example:</span>
      {{ option.example }}
    </div>
  </div>
</template>

<script
    setup
    lang="ts"
>
import type { QuizOption } from '~/types'

defineProps<{
  option: QuizOption
  selected: boolean
}>()

defineEmits<{
  (e: 'select'): void
}>()
</script>
