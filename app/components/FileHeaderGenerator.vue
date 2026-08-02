<template>
  <section class="mb-16">
    <div class="text-center mb-10">
      <h2 class="serif text-3xl font-bold text-charcoal mb-2">2. File Header Customizer</h2>
      <h3 class="text-muted text-lg">Personalize your license headers before copying them to your files.</h3>
    </div>

    <div class="card overflow-hidden !p-0">
      <div class="grid lg:grid-cols-12 gap-6 w-full p-6">
        <!-- Editor Left Side -->
        <form @submit.prevent class="lg:col-span-5 bg-cream-dark p-6 rounded-2xl border border-border flex flex-col w-full h-full">
          <header class="flex items-center justify-between mb-6">
            <div class="text-sm tracking-widest uppercase font-bold text-tan">Project Details</div>
          </header>

          <fieldset class="space-y-4 border-none p-0 m-0">
            <div>
              <label for="projectName" class="block label-caps mb-1 ml-1 cursor-pointer">Project Name</label>
              <input id="projectName" v-model="formState.projectName" placeholder="e.g. My Awesome Library" class="input-field" />
            </div>
            <div>
              <label for="projectDesc" class="block label-caps mb-1 ml-1 cursor-pointer">Description</label>
              <input id="projectDesc" v-model="formState.description" placeholder="A short description" class="input-field" />
            </div>
            <div>
              <label for="authorName" class="block label-caps mb-1 ml-1 cursor-pointer">Author Name</label>
              <input id="authorName" v-model="formState.authorName" placeholder="Your Name or Company" class="input-field" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="email" class="block label-caps mb-1 ml-1 cursor-pointer">Email</label>
                <input id="email" v-model="formState.email" type="email" placeholder="hello@example.com" class="input-field" />
              </div>
              <div>
                <label for="website" class="block label-caps mb-1 ml-1 cursor-pointer">Website</label>
                <input id="website" v-model="formState.website" placeholder="https://..." class="input-field" />
              </div>
            </div>
          </fieldset>

          <div class="mt-8 pt-8 border-t border-border">
            <button @click="isModalOpen = true" class="btn-dashed bg-white">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Custom Properties
            </button>
            <div class="text-center mt-2 mb-6">
              <span class="text-[10px] uppercase tracking-widest text-muted font-bold opacity-70">
                <svg class="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Processed locally. Never saved.
              </span>
            </div>

            <!-- Monetization: Subtle Affiliate Link -->
            <aside class="bg-white border border-border rounded-xl p-4 transition-colors hover:border-tan group">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[9px] font-bold uppercase tracking-widest text-tan">Sponsored</span>
              </div>
              <p class="text-sm font-bold text-charcoal mb-1">Need a Privacy Policy?</p>
              <p class="text-xs text-muted mb-3 leading-relaxed">Most modern websites and apps require a compliant
                privacy policy by law.
              </p>
              <a :href="config.public.links.termsFeed" target="_blank" class="text-xs font-bold text-charcoal group-hover:text-tan transition-colors flex items-center gap-1">
                Generate one with TermsFeed
                <svg class="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </aside>
          </div>
        </form>

        <!-- Live Preview Right Side -->
        <section class="lg:col-span-7 bg-espresso p-6 rounded-2xl flex flex-col overflow-hidden min-h-0 relative group min-h-[400px]">
          <header class="flex items-center justify-between mb-6 shrink-0 relative z-10">
            <div class="flex items-center gap-4">
              <select
                  v-model="formState.language" class="bg-charcoal text-cream text-xs font-bold rounded-lg px-3 py-1.5 border border-bark outline-none focus:ring-1 focus:ring-tan cursor-pointer">
                <option v-for="[value, label] in Object.entries(LANGUAGE_LABELS)" :key="value" :value="value">{{
                    label
                  }}
                </option>
              </select>
              <div class="text-sm tracking-widest uppercase font-bold text-tan/70 hidden sm:block">Preview</div>
            </div>

            <div class="flex items-center gap-6">
              <!-- No Comments Toggle -->
              <div class="flex items-center gap-2">
                <label class="cursor-pointer group flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-tan hover:text-white transition-colors">No Comments</span>
                  <div class="relative inline-flex items-center">
                    <input type="checkbox" v-model="formState.excludeComments" class="sr-only peer">
                    <div class="w-8 h-4 bg-bark rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-tan"></div>
                  </div>
                </label>
              </div>

              <CopyButton :text="generatedHeaderCode" label="Copy" variant="light" />
            </div>
          </header>

          <div class="flex-1 overflow-auto relative z-10 custom-scrollbar pb-4 min-h-0">
            <pre class="font-mono text-sm leading-relaxed text-cream/90 m-0 w-full whitespace-pre pointer-events-auto h-full" v-html="validatedHighlightedCode"></pre>
          </div>
        </section>
      </div>
    </div>

    <CustomPropertiesModal
        :is-open="isModalOpen" :properties="formState.customProperties" @close="isModalOpen = false" @update="updateProperties" />
  </section>
</template>

<script setup lang="ts">
  import { ref, computed }                from 'vue'
  import hljs       from 'highlight.js/lib/core'
  import javascript from 'highlight.js/lib/languages/javascript'
  import python     from 'highlight.js/lib/languages/python'
  import php        from 'highlight.js/lib/languages/php'
  import ruby       from 'highlight.js/lib/languages/ruby'
  import xml        from 'highlight.js/lib/languages/xml'
  import css        from 'highlight.js/lib/languages/css'

  import 'highlight.js/styles/atom-one-dark.css'

  // Register languages
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('python', python)
  hljs.registerLanguage('php', php)
  hljs.registerLanguage('ruby', ruby)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('css', css)
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

  const config = useRuntimeConfig()

  const validatedHighlightedCode = computed(() => {
    const code = generatedHeaderCode.value
    const lang = formState.value.language

    // Map UI languages to registered highlight.js grammars
    let hljsLang: string | null = null
    if (lang === 'javascript' || lang === 'typescript') hljsLang = 'javascript'
    else if (lang === 'php') hljsLang = 'php'
    else if (lang === 'python') hljsLang = 'python'
    else if (lang === 'ruby') hljsLang = 'ruby'
    else if (lang === 'html') hljsLang = 'xml'
    else if (lang === 'css') hljsLang = 'css'
    // shell (and any future unmapped language): no grammar registered — escape plain text

    let highlighted: string
    if (hljsLang && hljs.getLanguage(hljsLang)) {
      highlighted = hljs.highlight(code, { language: hljsLang }).value
    } else {
      highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    // Custom validation for @tags
    const customKeys = formState.value.customProperties.map(p => p.key)
    return validateHtmlLines(highlighted, customKeys)
  })


</script>
