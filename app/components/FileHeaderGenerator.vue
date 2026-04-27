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
              <input v-model="formState.projectName" placeholder="e.g. My Awesome Library" class="input-field" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Description</label>
              <input v-model="formState.description" placeholder="A short description" class="input-field" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Author Name</label>
              <input v-model="formState.authorName" placeholder="Your Name or Company" class="input-field" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Email</label>
                <input v-model="formState.email" type="email" placeholder="hello@example.com" class="input-field" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wide text-muted mb-1 ml-1">Website</label>
                <input v-model="formState.website" placeholder="https://..." class="input-field" />
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-border">
            <button
                @click="isModalOpen = true" class="w-full py-3 rounded-xl border border-border border-dashed bg-white text-charcoal font-bold hover:bg-cream-dark transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Custom Properties
            </button>
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
              <select
                  v-model="formState.language" class="bg-charcoal text-cream text-xs font-bold rounded-lg px-3 py-1.5 border border-bark outline-none focus:ring-1 focus:ring-tan">
                <option v-for="[value, label] in Object.entries(LANGUAGE_LABELS)" :key="value" :value="value">{{
                    label
                  }}
                </option>
              </select>
              <div class="text-sm tracking-widest uppercase font-bold text-tan/70">Live Preview</div>
            </div>
            <CopyButton :text="generatedHeaderCode" />
          </div>

          <div class="flex-1 overflow-auto relative z-10 custom-scrollbar pb-4 min-h-0">
            <pre class="font-mono text-sm leading-relaxed text-cream/90 m-0 w-full whitespace-pre pointer-events-auto h-full" v-html="validatedHighlightedCode"></pre>
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

  const { formState, generatedHeaderCode } = useHeaderGenerator(() => props.license)
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
    height: 6px;
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
