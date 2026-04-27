<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="localIsOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-espresso/40 backdrop-blur-sm" @click="closeModal"></div>
        
        <!-- Modal content -->
        <div class="relative w-full max-w-xl bg-cream rounded-3xl shadow-2xl border border-border overflow-hidden animate-fade-up">
          <div class="px-6 py-5 border-b border-border flex items-center justify-between bg-white">
            <div>
              <h3 class="serif text-2xl font-bold text-charcoal">Custom Properties</h3>
              <p class="text-xs text-muted mt-1">Add your own @ properties to the file header.</p>
            </div>
            <button @click="closeModal" class="text-muted hover:text-charcoal transition-colors p-2 hover:bg-cream-dark rounded-full">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="px-6 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar" @keydown.enter="save">
            <div v-if="localProperties.length > 0" class="flex gap-2 mb-2 px-1">
              <label class="w-1/3 text-[10px] font-bold uppercase tracking-wider text-muted">Property Key</label>
              <label class="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted">Value</label>
              <div class="w-9"></div> <!-- Spacer for delete button -->
            </div>
            <div class="space-y-3 mb-6">
              <div v-for="(prop, index) in localProperties" :key="index" class="flex gap-2 items-center">
                <div class="relative w-1/3">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono text-sm z-10 pointer-events-none">@</span>
                  <input v-model="prop.key" placeholder="key" class="input-field font-mono text-xs" style="padding-left: 1.25rem !important" />
                </div>
                <input v-model="prop.value" placeholder="value" class="input-field flex-1 text-xs" />
                <button
                    @click="removeProperty(index)" class="p-2 text-red-400 hover:text-red-600 transition-colors shrink-0">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div v-if="localProperties.length === 0" class="text-center py-10 text-muted text-sm italic border-2 border-dashed border-border rounded-xl bg-cream-dark/50">
                No custom properties yet.
              </div>
            </div>

            <button
                @click="addProperty" class="w-full py-3 rounded-xl border border-dashed border-tan text-tan hover:bg-cream-dark transition-all text-sm font-bold flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Add Property
            </button>
          </div>

          <div class="px-6 py-5 border-t border-border bg-white">
            <button
                @click="save" class="btn w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg">
              Save Properties
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, watch }          from 'vue'
  import type { CustomProperty } from '~/types'

  const props = defineProps<{
    isOpen: boolean
    properties: CustomProperty[]
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'update', props: CustomProperty[]): void
  }>()

  const localIsOpen     = ref(props.isOpen)
  const localProperties = ref<CustomProperty[]>([])

  watch(() => props.isOpen, (newVal) => {
    localIsOpen.value = newVal
    if (newVal) {
      // deep copy
      localProperties.value = JSON.parse(JSON.stringify(props.properties))
    }
  })

  watch(localIsOpen, (newVal) => {
    if (!newVal && props.isOpen) {
      emit('close')
    }
  })

  const closeModal = () => {
    localIsOpen.value = false
    emit('close')
  }

  const addProperty = () => {
    localProperties.value.push({ key: '', value: '' })
  }

  const removeProperty = (index: number) => {
    localProperties.value.splice(index, 1)
  }

  const save = () => {
    // filter out completely empty ones
    const filtered = localProperties.value.filter(p => p.key.trim()!=='' || p.value.trim()!=='')
    emit('update', filtered)
    closeModal()
  }
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
