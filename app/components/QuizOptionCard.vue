<template>
  <button
      type="button"
      class="opt-card"
      :class="{
      selected: selected,
      'opt-card--disabled': disabled
    }"
      :disabled="disabled"
      :aria-pressed="selected"
      @click="$emit('select')"
  >
    <div class="flex justify-between items-start mb-4 sm:mb-6 gap-3">
      <div class="opt-card-title">
        {{ option.title }}
      </div>
      <div
          class="opt-card-radio"
          :class="selected ? 'border-charcoal' : 'border-border'"
          aria-hidden="true"
      >
        <div
            class="opt-card-radio-dot"
            :class="selected ? 'scale-100' : 'scale-0'"
        />
      </div>
    </div>

    <div class="opt-card-desc">
      {{ option.desc }}
    </div>

    <div class="example-panel">
      <span class="example-panel-label">Real Life Example:</span> {{ option.example }}
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
