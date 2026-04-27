<script setup lang="ts">
  const config = useRuntimeConfig()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-pattern selection:bg-tan selection:text-white relative">

    <!-- Top Header -->
    <header class="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-3 group">
        <div class="relative w-10 h-10 flex items-center justify-center">
          <div class="absolute inset-0 bg-charcoal rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
          <div class="absolute inset-0 bg-tan rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-50"></div>
          <svg class="w-5 h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight text-charcoal">
          whatlicense<span class="text-tan">.io</span>
        </span> </a>

      <!-- Navigation & Socials -->
      <div class="flex items-center gap-4 sm:gap-6">
        <div class="hidden md:flex items-center gap-6 mr-4 border-r border-border pr-6">
          <a :href="config.public.links.termsFeed" target="_blank" class="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-charcoal transition-colors">Privacy
            Generator</a>
          <a href="/#wizard" class="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-charcoal transition-colors">How
            it works</a>
        </div>

        <div class="flex items-center gap-4">
          <a :href="config.public.links.paypal" target="_blank" class="text-muted hover:text-tan transition-colors" title="Support the project">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.712 4.33a.75.75 0 01.711.89l-.128.51a2 2 0 01-1.077 1.388l-3.999 2.002a2 2 0 01-1.788 0l-3.999-2.002a2 2 0 01-1.077-1.388l-.128-.51a.75.75 0 011.059-.838l1.45.69a2 2 0 001.788 0l1.45-.69a.75.75 0 011.059.838l-.128.51a2 2 0 01-1.077 1.388l-3.999 2.002a2 2 0 01-1.788 0l-3.999-2.002a2 2 0 01-1.077-1.388l-.128-.51a.75.75 0 01.711-.89z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21a9.003 9.003 0 008.367-5.657M12 21a9.003 9.003 0 01-8.367-5.657m16.734 0A16.37 16.37 0 0112 16.736a16.37 16.37 0 01-8.367-1.393m16.734 0c.163-.513.266-1.051.3-1.607a4.5 4.5 0 10-9 0c0 .556.137 1.094.3 1.607m-7.434 0a4.494 4.494 0 01-.3-1.607 4.5 4.5 0 119 0c0 .556-.137 1.094-.3 1.607" />
            </svg>
          </a> <a href="https://x.com" target="_blank" class="text-muted hover:text-charcoal transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
          </svg>
        </a>
          <a :href="config.public.links.github" target="_blank" class="text-muted hover:text-charcoal transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <div class="hidden sm:flex items-center px-2 py-0.5 rounded-md bg-cream-dark border border-border text-[10px] font-bold text-muted group-hover:text-charcoal transition-colors">
              Star
            </div>
          </a>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col px-6">
      <NuxtPage />
    </main>

    <footer class="py-10 px-6 border-t border-border mt-12 bg-white/30 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-tan animate-pulse"></div>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">© {{ new Date().getFullYear() }}
            whatlicense.io
          </p>
        </div>

        <div class="flex items-center gap-8">
          <a href="#" class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors">Privacy</a>
          <a href="#" class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors">Terms</a>
          <a :href="config.public.links.paypal" target="_blank" class="text-[10px] font-bold uppercase tracking-[0.2em] text-tan hover:text-charcoal transition-colors flex items-center gap-1.5">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Support Us </a>
          <a :href="config.public.links.github" target="_blank" class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-charcoal transition-colors flex items-center gap-1.5">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub </a>
        </div>
      </div>
    </footer>

  </div>
</template>

