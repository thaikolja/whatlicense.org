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
        <ContentRenderer
            v-if="(license as any).body"
            :value="(license as any).body"
            class="font-mono text-sm leading-relaxed text-charcoal whitespace-pre-wrap"
        />
        <p v-else>License text not found.</p>
      </div>
    </div>
  </section>
</template>

<script
    setup
    lang="ts"
>
import { computed }               from 'vue'
import type { License }           from '~/types'
import { licenseBodyToPlainText } from '~/utils/licenseText'

const props = defineProps<{
  license: License
}>()

const plainText = computed(() => {
  return licenseBodyToPlainText((props.license as { body?: unknown }).body)
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
