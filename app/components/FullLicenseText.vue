<template>
  <section class="container-reading">
    <div class="section-intro">
      <h2 class="heading-section">3. Full License Text</h2>
      <h3 class="heading-section-sub">
        Save this as a <code class="bg-border/50 px-1.5 py-0.5 rounded text-sm">LICENSE</code> file in your repository
        root.
      </h3>
    </div>

    <div class="terminal-window">
      <div class="terminal-chrome">
        <div class="dot-traffic">
          <span class="bg-red-400" /> <span class="bg-yellow-400" /> <span class="bg-green-400" />
        </div>
        <CopyButton :text="plainText" />
      </div>
      <div class="p-8 overflow-auto flex-1 custom-scrollbar">
        <ContentRenderer
            v-if="(license as any).body"
            :value="(license as any).body"
            class="font-mono text-sm leading-relaxed text-charcoal whitespace-pre-wrap"
        />
        <p v-else>
          License text not found.
        </p>
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
