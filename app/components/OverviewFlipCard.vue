<template>
  <div
      class="rounded-2xl border flip-container min-h-[220px]"
      :class="[themeClasses.bg, themeClasses.border, { 'flipped': isFlipped }]"
  >
    <div class="flip-front p-8">
      <h3
          class="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
          :class="themeClasses.text"
      >
        <svg
            v-if="category === 'Permissions'"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
            v-if="category === 'Conditions'"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
            v-if="category === 'Limitations'"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {{ category }}
      </h3>
      <ul
          class="space-y-3 text-sm font-medium mb-4"
          :class="themeClasses.textMuted"
      >
        <li
            v-for="(item, idx) in items"
            :key="idx"
            class="flex items-start gap-2"
        >
          <svg
              v-if="category === 'Permissions' || category === 'Conditions'"
              class="w-4 h-4 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
            />
          </svg>
          <svg
              v-if="category === 'Limitations'"
              class="w-4 h-4 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {{ item.label }}
        </li>
      </ul>
      <button
          @click="isFlipped = true"
          class="mt-auto self-start text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
          :class="themeClasses.btn"
      >
        <svg
            class="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Example
      </button>
    </div>

    <div class="flip-back flex flex-col justify-center">
      <div
          v-for="(item, idx) in items"
          :key="idx"
          class="mb-4"
      >
        <p
            class="text-sm font-medium"
            :class="themeClasses.textMuted"
        ><strong class="mr-1">{{
            item.label
          }}:</strong>{{ item.example }}
        </p>
      </div>
      <button
          @click="isFlipped = false"
          class="self-start text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1 mt-auto"
          :class="themeClasses.btn"
      >
        <svg
            class="w-3 h-3 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Back
      </button>
    </div>
  </div>
</template>

<script
    setup
    lang="ts"
>
import { ref, computed }      from 'vue'
import type { ConditionItem } from '~/types'

type ThemeColor = 'green' | 'blue' | 'red'
type ThemeClasses = {
  bg: string
  border: string
  text: string
  textMuted: string
  btn: string
}

const props = defineProps<{
  category: 'Permissions' | 'Conditions' | 'Limitations'
  items: readonly ConditionItem[]
  colorTheme: ThemeColor
}>()

const isFlipped = ref(false)

//exhaustive lookup instead of a switch so computed always returns a value
const THEME_CLASSES: Record<ThemeColor, ThemeClasses> = {
  green: {
    bg:        'bg-[#f0fdf4]',
    border:    'border-[#bbf7d0]',
    text:      'text-[#166534]',
    textMuted: 'text-[#166534]/80',
    btn:       'text-[#166534]/70 hover:text-[#166534]'
  },
  blue:  {
    bg:        'bg-[#eff6ff]',
    border:    'border-[#bfdbfe]',
    text:      'text-[#1e40af]',
    textMuted: 'text-[#1e40af]/80',
    btn:       'text-[#1e40af]/70 hover:text-[#1e40af]'
  },
  red:   {
    bg:        'bg-[#fef2f2]',
    border:    'border-[#fecaca]',
    text:      'text-[#991b1b]',
    textMuted: 'text-[#991b1b]/80',
    btn:       'text-[#991b1b]/70 hover:text-[#991b1b]'
  }
}

const themeClasses = computed(() => THEME_CLASSES[props.colorTheme])
</script>
