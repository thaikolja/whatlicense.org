<template>
  <button
      type="button"
      class="opt-card p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl flex flex-col justify-between h-full text-left w-full min-h-[11rem] sm:min-h-0"
      :class="{
      selected: selected,
      'opt-card--disabled': disabled
    }"
      :disabled="disabled"
      :aria-pressed="selected"
      @click="$emit('select')"
  >
    <div class="flex justify-between items-start mb-4 sm:mb-6 gap-3">
      <div class="text-xl sm:text-2xl md:text-3xl font-bold serif text-espresso leading-snug">
        {{ option.title }}
      </div>
      <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300"
          :class="selected ? 'border-charcoal' : 'border-border'"
          aria-hidden="true"
      >
        <div
            class="w-3 h-3 bg-charcoal rounded-full transition-transform duration-300"
            :class="selected ? 'scale-100' : 'scale-0'"
        />
      </div>
    </div>

    <div class="text-base sm:text-lg md:text-xl text-muted mb-4 sm:mb-6 flex-1 leading-relaxed">
      {{ option.desc }}
    </div>

    <div class="example-panel mt-2 sm:mt-4 text-walnut text-xs sm:text-sm leading-relaxed bg-cream-dark/50 p-3 sm:p-4 rounded-xl border border-border">
      <span class="text-[10px] font-bold uppercase tracking-widest text-tan block mb-1">
        Real Life Example:
      </span>
      {{ option.example }}
    </div>
  </button>
</template>

<script
    setup
    lang="ts"
>
/**
 * One quiz choice — button for keyboard/a11y, brand opt-card styling.
 */
import type { QuizOption } from '~/types'

defineProps<{
  option: QuizOption
  selected: boolean
  /** Blocks re-clicks while the wizard is auto-advancing. */
  disabled?: boolean
}>()

defineEmits<{
  (e: 'select'): void
}>()
</script>
