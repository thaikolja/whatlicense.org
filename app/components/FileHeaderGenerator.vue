<template>
  <section class="mb-16">
    <div class="text-center mb-10">
      <h2 class="serif text-3xl font-bold text-charcoal mb-2">2. File Header Customizer</h2>
      <h3 class="text-muted text-lg">Personalize your license headers before copying them to your files.</h3>
    </div>

    <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden p-6">
      <div class="grid lg:grid-cols-12 gap-6 w-full">
        <!-- Editor Left Side -->
        <div class="lg:col-span-5 bg-cream-dark p-6 rounded-2xl border border-border flex flex-col w-full h-full">
          <div class="flex items-center justify-between mb-6">
            <div class="text-sm tracking-widest uppercase font-bold text-tan">Project Details</div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Project Name</label>
              <UInput v-model="formState.projectName" placeholder="e.g. My Awesome Library" size="lg" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Description</label>
              <UInput v-model="formState.description" placeholder="A short description" size="lg" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Author Name</label>
              <UInput v-model="formState.authorName" placeholder="Your Name or Company" size="lg" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Email</label>
                <UInput v-model="formState.email" type="email" placeholder="hello@example.com" size="lg" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Website</label>
                <UInput v-model="formState.website" placeholder="https://..." size="lg" />
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-border">
            <UButton
                @click="isModalOpen = true" block color="white" variant="outline" icon="i-heroicons-plus" class="py-3 rounded-xl border border-border bg-white text-charcoal font-bold hover:bg-cream-dark transition-colors">
              Add Custom Properties
            </UButton>
            <div class="text-center mt-2">
              <span class="text-[10px] uppercase tracking-widest text-muted font-bold opacity-70">
                <svg class="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Processed locally. Never saved.
              </span>
            </div>
          </div>
        </div>

        <!-- Live Preview Right Side -->
        <div class="lg:col-span-7 bg-espresso p-6 rounded-2xl flex flex-col overflow-hidden min-h-0 relative group min-h-[400px]">
          <div class="flex items-center justify-between mb-6 shrink-0 relative z-10">
            <div class="flex items-center gap-4">
              <USelect
                  v-model="formState.language" :options="Object.entries(LANGUAGE_LABELS).map(([value, label]) => ({ label, value }))" size="sm" class="min-w-[140px]" :ui="{ color: { white: { outline: 'bg-[#3a332c] text-cream ring-[#4a423a] focus:ring-[#b59b84]' } } }" />
              <div class="text-sm tracking-widest uppercase font-bold text-tan/70">Live Preview</div>
            </div>
            <CopyButton :text="generatedHeaderCode" />
          </div>

          <div class="flex-1 overflow-auto relative z-10 custom-scrollbar pr-2 min-h-0">
            <div class="absolute inset-0 pointer-events-none" v-html="validatedHighlightedCode"></div>
            <!-- We use a transparent textarea to allow selection/copy but hide it so it doesn't overlap the highlighted div incorrectly, actually in template.html it was just a pre/code block -->
            <pre class="font-mono text-sm leading-relaxed text-cream/90 m-0 w-full whitespace-pre-wrap break-all pointer-events-auto h-full" v-html="validatedHighlightedCode"></pre>
          </div>
        </div>
      </div>
    </div>

    <CustomPropertiesModal
        :is-open="isModalOpen" :properties="formState.customProperties" @close="isModalOpen = false" @update="updateProperties" />
  </section>
</template>

<script setup lang="ts">
  import { ref, computed }                from 'vue'
  import hljs                             from 'highlight.js'
  import 'highlight.js/styles/atom-one-dark.css'
  import type { License, CustomProperty } from '~/types'
  import { LANGUAGE_LABELS }              from '~/utils/commentStyles'
  import { useHeaderGenerator }           from '~/composables/useHeaderGenerator'
  import { useHeaderValidator }           from '~/composables/useHeaderValidator'

  const props = defineProps<{
    license: License
  }>()

  const isModalOpen = ref(false)

  const { formState, generatedHeaderCode } = useHeaderGenerator()
  const { validateHtmlLines }              = useHeaderValidator()

  const updateProperties = (props: CustomProperty[]) => {
    formState.value.customProperties = props
  }

  const validatedHighlightedCode = computed(() => {
    const code        = generatedHeaderCode.value
    const highlighted = hljs.highlight(code, { language: formState.value.language==='javascript' ? 'javascript': formState.value.language==='php' ? 'php': 'plaintext' }).value

    // Custom validation for @tags
    const customKeys = formState.value.customProperties.map(p => p.key)
    return validateHtmlLines(highlighted, customKeys)
  })

</script>
<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background:    rgba(181, 155, 132, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(181, 155, 132, 0.5);
  }
</style>
