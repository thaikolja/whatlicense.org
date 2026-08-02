<script
    setup
    lang="ts"
>
/**
 * Shared layout for Privacy Policy / Terms of Service pages.
 */
defineProps<{
  /** Page heading (e.g. "Privacy Policy"). */
  title: string
  /** One-line subtitle under the heading. */
  subtitle: string
  /** Human-readable effective date. */
  effectiveDate: string
}>()
</script>

<template>
  <article class="w-full max-w-3xl mx-auto py-6 sm:py-12 animate-fade-up min-w-0">
    <header class="mb-8 sm:mb-10 border-b border-border pb-6 sm:pb-8">
      <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-tan mb-3">
        Legal
      </p>
      <h1 class="text-3xl sm:text-5xl font-bold text-espresso tracking-tight mb-3">
        {{ title }}
      </h1>
      <p class="text-base sm:text-lg text-muted leading-relaxed mb-4">
        {{ subtitle }}
      </p>
      <p class="text-xs font-bold uppercase tracking-widest text-muted/80">
        Effective date: {{ effectiveDate }}
      </p>
    </header>

    <div class="legal-prose space-y-8 text-charcoal/90 leading-relaxed">
      <slot />
    </div>

    <footer class="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <NuxtLink
          to="/"
          class="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-charcoal transition-colors"
      >
        ← Back to wizard
      </NuxtLink>
      <p class="text-[10px] font-bold uppercase tracking-widest text-muted/70">
        whatlicense.org
      </p>
    </footer>
  </article>
</template>

<style scoped>
.legal-prose :deep(h2) {
  font-family:    var(--font-serif);
  font-size:      1.35rem;
  font-weight:    700;
  color:          var(--color-espresso);
  margin-bottom:  0.75rem;
  letter-spacing: -0.02em;
}

.legal-prose :deep(h3) {
  font-size:     0.95rem;
  font-weight:   700;
  color:         var(--color-charcoal);
  margin-top:    1.25rem;
  margin-bottom: 0.5rem;
}

.legal-prose :deep(p),
.legal-prose :deep(li) {
  font-size:   0.95rem;
  line-height: 1.7;
  color:       color-mix(in srgb, var(--color-charcoal) 88%, transparent);
}

.legal-prose :deep(ul) {
  list-style:     disc;
  padding-left:   1.25rem;
  display:        flex;
  flex-direction: column;
  gap:            0.4rem;
}

.legal-prose :deep(a) {
  color:                 var(--color-charcoal);
  font-weight:           600;
  text-decoration:       underline;
  text-decoration-color: var(--color-sand);
  text-underline-offset: 3px;
  transition:            text-decoration-color 0.2s, color 0.2s;
}

.legal-prose :deep(a:hover) {
  color:                 var(--color-espresso);
  text-decoration-color: var(--color-tan);
}

.legal-prose :deep(strong) {
  color:       var(--color-charcoal);
  font-weight: 700;
}
</style>
