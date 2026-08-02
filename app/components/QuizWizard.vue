<template>
  <div class="w-full max-w-5xl mx-auto pt-8 sm:pt-12 md:pt-24 pb-16 sm:pb-20">
    <!-- Progress: fluid segments so 5 steps fit on small phones -->
    <div
        class="flex items-center justify-center gap-1.5 sm:gap-3 mb-10 sm:mb-16"
        role="progressbar"
        :aria-valuenow="currentStep + 1"
        :aria-valuemin="1"
        :aria-valuemax="totalSteps"
        :aria-label="`Question ${currentStep + 1} of ${totalSteps}`"
    >
      <div
          v-for="i in totalSteps"
          :key="i"
          class="h-1.5 sm:h-2 flex-1 max-w-12 sm:max-w-20 rounded-full transition-colors duration-500"
          :class="i <= currentStep + 1 ? 'bg-charcoal' : 'bg-border'"
      />
    </div>

    <!-- Step content: out-in fade/slide when question changes -->
    <Transition
        :name="transitionName"
        mode="out-in"
        @after-leave="onAfterLeave"
    >
      <div
          :key="stepKey"
          class="quiz-step"
      >
        <div class="text-center mb-8 sm:mb-12">
          <div class="text-[10px] sm:text-sm tracking-widest uppercase font-bold text-tan mb-3 sm:mb-4">
            Question <span>{{ currentStep + 1 }}</span> of {{ totalSteps }}
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 text-espresso leading-tight px-1">
            {{ question.question }}
          </h2>
          <p class="text-base sm:text-xl md:text-2xl text-muted max-w-2xl mx-auto px-1 leading-relaxed">
            {{ question.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16">
          <QuizOptionCard
              v-for="(opt, idx) in question.options"
              :key="`${question.id}-${idx}`"
              :option="opt"
              :selected="answers[currentStep] === idx"
              :disabled="isAdvancing"
              @select="onSelect(idx)"
          />
        </div>

        <div class="flex justify-between items-center gap-3 border-t border-border pt-6 sm:pt-8">
          <Button
              v-if="currentStep > 0"
              variant="outline"
              size="default"
              type="button"
              class="min-h-11 px-5 sm:px-8"
              :disabled="isAdvancing"
              @click="onPrev"
          >
            Back
          </Button>
          <div
              v-else
              class="flex-1"
          />

          <div class="flex-1" />

          <Button
              variant="default"
              size="lg"
              type="button"
              class="min-h-11 min-w-[7.5rem] sm:min-w-0"
              :disabled="!canAdvance || isAdvancing"
              @click="onNext"
          >
            <span
                v-if="isAdvancing"
                class="inline-flex items-center gap-2"
            >
              <span
                  class="quiz-next-spinner"
                  aria-hidden="true"
              />
              Next
            </span> <span v-else>Next Step</span>
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script
    setup
    lang="ts"
>
/**
 * Branching quiz step UI with slide transitions and select → auto-advance.
 */
import type { QuizQuestion } from '~/types'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  question: QuizQuestion
  currentStep: number
  totalSteps: number
  answers: number[]
  canAdvance: boolean
}>()

const emit = defineEmits<{
  (e: 'select', idx: number): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

// ... stable key for Transition (id + step index)
const stepKey = computed(() => `${props.question.id}-${props.currentStep}`)

// ... slide direction for next vs back
const transitionName                                   = ref<'quiz-forward' | 'quiz-back'>('quiz-forward')
// ... locks UI while select auto-advances or Next is in flight
const isAdvancing                                      = ref(false)
let advanceTimer: ReturnType<typeof setTimeout> | null = null

// ... clear pending auto-advance if parent changes step externally
watch(
    () => props.currentStep,
    () => {
      if (advanceTimer) {
        clearTimeout(advanceTimer)
        advanceTimer = null
      }
      isAdvancing.value = false
    }
)

onBeforeUnmount(() => {
  if (advanceTimer) clearTimeout(advanceTimer)
})

/** Pick an option; brief highlight then auto-advance (feels one-tap). */
function onSelect(idx: number) {
  if (isAdvancing.value) return

  const already = props.answers[props.currentStep] === idx
  emit('select', idx)

  // ... re-tap same option after Back — don’t auto-skip
  if (already) return

  // ... show selection, then move on smoothly
  isAdvancing.value    = true
  transitionName.value = 'quiz-forward'
  if (advanceTimer) clearTimeout(advanceTimer)
  advanceTimer = setTimeout(() => {
    advanceTimer = null
    emit('next')
    // isAdvancing cleared when currentStep changes (watch)
  }, 420)
}

function onNext() {
  if (!props.canAdvance || isAdvancing.value) return
  isAdvancing.value    = true
  transitionName.value = 'quiz-forward'
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  // ... parent bumps step → stepKey changes → out-in transition
  emit('next')
}

function onPrev() {
  if (isAdvancing.value) return
  transitionName.value = 'quiz-back'
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  emit('prev')
}

function onAfterLeave() {
  // ... safety unlock if step didn’t change (e.g. final result hop)
  if (!advanceTimer) {
    isAdvancing.value = false
  }
}
</script>

<style scoped>
/* Forward: leave left, enter from right */
.quiz-forward-enter-active,
.quiz-forward-leave-active,
.quiz-back-enter-active,
.quiz-back-leave-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.quiz-forward-enter-from {
  opacity:   0;
  transform: translateX(1.25rem);
}

.quiz-forward-leave-to {
  opacity:   0;
  transform: translateX(-1rem);
}

.quiz-back-enter-from {
  opacity:   0;
  transform: translateX(-1.25rem);
}

.quiz-back-leave-to {
  opacity:   0;
  transform: translateX(1rem);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .quiz-forward-enter-active,
  .quiz-forward-leave-active,
  .quiz-back-enter-active,
  .quiz-back-leave-active {
    transition-duration: 0.01ms;
  }

  .quiz-forward-enter-from,
  .quiz-forward-leave-to,
  .quiz-back-enter-from,
  .quiz-back-leave-to {
    transform: none;
  }
}

.quiz-next-spinner {
  width:            0.875rem;
  height:           0.875rem;
  border:           2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius:    9999px;
  animation:        quiz-spin 0.6s linear infinite;
}

@keyframes quiz-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
