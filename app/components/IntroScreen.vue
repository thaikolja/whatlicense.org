<template>
  <section class="w-full pt-8 md:pt-16 pb-20">
    <div class="container-reading text-center relative">
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 border border-sand rounded-full opacity-50 -z-10" />
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 border border-tan rounded-full opacity-20 -z-10" />

      <header>
        <div class="badge">
          <Icon
              name="mdi:heart"
              size="24"
              class="text-red-500/80 mr-2"
          />
          Proudly programmed without AI
        </div>

        <h1 class="animate-fade-up delay-100 text-4xl sm:text-6xl md:text-8xl mb-6 sm:mb-8 text-espresso leading-[1.1] tracking-tight px-1">
          What license <span class="italic text-muted">do I need?</span>
        </h1>

        <p class="animate-fade-up delay-200 text-base sm:text-xl md:text-2xl text-body max-w-2xl mx-auto mb-8 sm:mb-12 px-1">
          Stop getting bogged down by legal jargon. Answer simple questions and get the perfect open-source
          recommendation with our <span class="text-charcoal font-bold">license header generator</span> — ready to use
          instantly.
        </p>
      </header>

      <div class="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-20 w-full">
        <button
            type="button"
            class="cta cta-lg cta-block group"
            @click="$emit('start')"
        >
          <svg
              class="w-5 h-5 text-tan group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Start Wizard
          <svg
              class="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
        <div class="flex items-center gap-4">
          <div class="meta-chip">
            <svg
                class="w-4 h-4 text-tan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ~45 seconds
          </div>
          <span class="w-1 h-1 rounded-full bg-border" />
          <div class="meta-chip">
            <svg
                class="w-4 h-4 text-tan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            100% Free
          </div>
        </div>
      </div>

      <section class="animate-fade-up delay-400 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto border-t border-border pt-10 sm:pt-16">
        <article class="text-left card">
          <div class="step-num">1</div>
          <h3 class="text-lg sm:text-xl font-bold mb-2 text-espresso">Answer Basics</h3>
          <p class="text-body-sm">Define how others should share and use the project source code.</p>
        </article>
        <article class="text-left card">
          <div class="step-num">2</div>
          <h3 class="text-lg sm:text-xl font-bold mb-2 text-espresso">Get Matched</h3>
          <p class="text-body-sm">The engine matches answers against 25+ OSI-approved open-source licenses.</p>
        </article>
        <article class="text-left card">
          <div class="step-num">3</div>
          <h3 class="text-lg sm:text-xl font-bold mb-2 text-espresso">License Headers</h3>
          <p class="text-body-sm">
            Copy the full license text and beautifully formatted
            <span class="text-charcoal font-bold">file headers</span> for any programming language instantly.
          </p>
        </article>
      </section>
    </div>
  </section>
</template>

<script
    setup
    lang="ts"
>
defineEmits<{
  (e: 'start'): void
}>()
</script>
