<template>
  <div class="quiz-shell">
    <div
        class="quiz-progress"
        role="progressbar"
        :aria-valuenow="currentStep + 1"
        :aria-valuemin="1"
        :aria-valuemax="totalSteps"
        :aria-label="`Question ${currentStep + 1} of ${totalSteps}`"
    >
      <div
          v-for="i in totalSteps"
          :key="i"
          class="quiz-progress-seg"
          :class="i <= currentStep + 1 ? 'bg-charcoal' : 'bg-border'"
      />
    </div>

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
          <div class="quiz-question-meta">
            Question <span>{{ currentStep + 1 }}</span> of {{ totalSteps }}
          </div>
          <h2 class="quiz-question-title">
            {{ question.question }}
          </h2>
          <p class="quiz-question-desc">
            {{ question.description }}
          </p>
        </div>

        <div class="quiz-options">
          <QuizOptionCard
              v-for="(opt, idx) in question.options"
              :key="`${question.id}-${idx}`"
              :option="opt"
              :selected="answers[currentStep] === idx"
              :disabled="isAdvancing"
              @select="onSelect(idx)"
          />
        </div>

        <div class="quiz-nav">
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
  (e: 'next' | 'prev'): void
}>()

const stepKey = computed(() => `${props.question.id}-${props.currentStep}`)
const transitionName                                   = ref<'quiz-forward' | 'quiz-back'>('quiz-forward')
const isAdvancing                                      = ref(false)
let advanceTimer: ReturnType<typeof setTimeout> | null = null

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

function onSelect(idx: number) {
  if (isAdvancing.value) return

  const already = props.answers[props.currentStep] === idx
  emit('select', idx)

  if (already) return

  isAdvancing.value    = true
  transitionName.value = 'quiz-forward'
  if (advanceTimer) clearTimeout(advanceTimer)
  advanceTimer = setTimeout(() => {
    advanceTimer = null
    emit('next')
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
  if (!advanceTimer) {
    isAdvancing.value = false
  }
}
</script>

<style scoped>
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
