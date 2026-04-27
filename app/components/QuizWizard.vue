<template>
  <div class="w-full max-w-5xl mx-auto pt-16 md:pt-24 pb-20">
    <div class="flex items-center justify-center gap-4 mb-16 animate-fade-up">
      <div
          v-for="i in totalSteps" :key="i" class="w-20 h-2 rounded-full transition-colors duration-500" :class="i <= currentStep + 1 ? 'bg-charcoal' : 'bg-border'"></div>
    </div>

    <div class="text-center mb-12 animate-fade-up delay-100">
      <div class="text-sm tracking-widest uppercase font-bold text-tan mb-4">Question <span>{{ currentStep + 1 }}</span>
        of {{ totalSteps }}
      </div>
      <h2 class="text-5xl md:text-6xl mb-6 text-espresso leading-tight">{{ question.question }}</h2>
      <p class="text-2xl text-muted max-w-2xl mx-auto">{{ question.description }}</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 mb-16 animate-fade-up delay-200">
      <QuizOptionCard
          v-for="(opt, idx) in question.options" :key="idx" :option="opt" :selected="answers[currentStep] === idx" @select="selectOption(idx)" />
    </div>

    <div class="flex justify-between items-center animate-fade-up delay-300 border-t border-border pt-8">
      <UButton
          v-if="currentStep > 0" @click="$emit('prev')" variant="outline" color="gray" class="px-8 py-3 rounded-full border border-border text-muted font-bold hover:bg-white transition-colors uppercase tracking-wide text-sm">
        Back
      </UButton>
      <div v-else class="flex-1"></div>

      <div class="flex-1"></div>

      <UButton
          @click="$emit('next')" :disabled="!canAdvance" class="btn px-10 py-4 rounded-full font-bold uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-charcoal hover:bg-espresso text-white">
        Next Step
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { QuizQuestion } from '~/types'

  defineProps<{
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

  function selectOption(idx: number) {
    emit('select', idx)
  }
</script>
