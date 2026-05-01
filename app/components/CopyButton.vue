<template>
  <button
      class="text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group" :class="[
        isCopied ? 'text-green-600' : (variant === 'light' ? 'text-tan hover:text-white' : 'text-tan hover:text-charcoal')
      ]" @click="handleCopy">
    <svg v-if="!isCopied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span class="transition-colors">{{ isCopied ? 'Copied!': label }}</span>
  </button>
</template>

<script setup lang="ts">
  import { useClipboard } from '~/composables/useClipboard'

  const props = withDefaults(defineProps<{
    text: string
    label?: string
    variant?: 'light' | 'dark'
  }>(), {
    label: 'Copy',
    variant: 'dark'
  })

  const { isCopied, copy } = useClipboard()

  const handleCopy = () => {
    copy(props.text)
  }
</script>
