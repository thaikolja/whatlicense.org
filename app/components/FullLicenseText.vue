<template>
  <section class="max-w-4xl mx-auto w-full">
    <div class="text-center mb-10">
      <h2 class="serif text-3xl font-bold text-charcoal mb-2">3. Full License Text</h2>
      <h3 class="text-muted text-lg">Save this as a
        <code class="bg-border/50 px-1.5 py-0.5 rounded text-sm">LICENSE</code> file in your repository root.
      </h3>
    </div>

    <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col max-h-[600px]">
      <div class="bg-cream-dark p-4 border-b border-border flex items-center justify-between shrink-0">
        <div class="flex gap-2">
          <div class="w-3 h-3 rounded-full bg-red-400"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div class="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <CopyButton :text="plainText" />
      </div>
      <div class="p-8 overflow-auto flex-1 custom-scrollbar">
        <!-- Render the markdown body of the license -->
        <ContentRenderer v-if="(license as any).body" :value="(license as any).body" class="font-mono text-sm leading-relaxed text-charcoal whitespace-pre-wrap" />
        <p v-else>License text not found.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { License } from '~/types'

  const props = defineProps<{
    license: License
  }>()

  // Helper to extract text from Nuxt Content body AST
  const extractText = (node: any): string => {
    if (!node) return ''
    if (typeof node==='string') return node

    let text = ''

    // Handle arrays of nodes
    if (Array.isArray(node)) {
      return node.map(extractText).join('')
    }

    // Handle text nodes
    if (node.type==='text') {
      return node.value || ''
    }

    // Handle element nodes (p, h1, etc.)
    if (node.children) {
      text = node.children.map(extractText).join('')
      // Add double newlines after paragraphs and headers for better formatting
      if ([ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li' ].includes(node.tag)) {
        text += '\n\n'
      }
    }

    return text
  }

  const plainText = computed(() => {
    const body = (props.license as any).body
    if (!body) return ''
    // If it's already a string (unlikely in v3)
    if (typeof body==='string') return body
    // Otherwise walk the AST
    return extractText(body.children || body).trim()
  })
</script>
<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background:    var(--color-border);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-tan);
  }
</style>
