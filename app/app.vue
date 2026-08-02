<script
    setup
    lang="ts"
>
import type { IconLink, FooterLink } from '~/types'

const config = useRuntimeConfig()
const icons  = ref<IconLink[]>([
  {
    name: 'PayPal',
    icon: 'mdi:paypal',
    link: config.public?.links?.paypal ?? ''
  },
  {
    name: 'GitHub',
    icon: 'mdi:github',
    link: config.public?.links?.github ?? ''
  },
  {
    name: 'E-Mail',
    icon: 'mdi:envelope',
    link: config.public?.links?.email ?? ''
  }
])

const footerLinks = ref<FooterLink[]>([
  {
    title:    'Privacy Policy',
    name:     'Privacy',
    link:     '/privacy-policy',
    external: false
  },
  {
    title:    'Terms of Service',
    name:     'Terms',
    link:     '/terms-of-service',
    external: false
  },
  {
    title:    'Support the project',
    name:     'Support',
    link:     config.public?.links?.paypal ?? '',
    icon:     'mdi:paypal',
    external: true
  },
  {
    title:    'GitHub',
    name:     'GitHub',
    link:     config.public?.links?.github ?? '',
    icon:     'mdi:github',
    external: true
  }
])
</script>

<template>
  <div class="min-h-screen flex flex-col bg-pattern selection:bg-tan selection:text-white relative">
    <!-- Top Header -->
    <header class="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
      <!-- Logo -->
      <a
          href="/"
          class="flex items-center gap-3 group"
      >
        <div class="relative w-10 h-10 flex items-center justify-center">
          <div class="absolute inset-0 bg-charcoal rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
          <div class="absolute inset-0 bg-tan rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-50" />
          <svg
              class="w-5 h-5 text-white relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight text-charcoal">
          whatlicense<span class="text-tan">.org</span>
        </span></a>

      <!-- Navigation & Socials -->
      <div class="flex items-center gap-4 sm:gap-6">
        <div class="hidden md:flex items-center gap-6 mr-4 border-r border-border pr-6">
          <a
              :href="config.public.links.termsFeed"
              target="_blank"
              class="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-charcoal transition-colors"
          >
            About
          </a>
        </div>

        <div class="flex items-center gap-8">
          <NuxtLink
              v-for="icon in icons"
              :key="icon.name"
              :to="icon.link"
              :title="`whatlicense.org on ${icon.name}`"
              target="_blank"
              class="text-muted hover:text-charcoal transition-colors"
          >
            <Icon
                :id="`icon-${icon.name.toLowerCase()}`"
                :name="icon.icon"
                size="16"
            />
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col px-6">
      <NuxtPage />
    </main>

    <footer class="py-10 px-6 border-t border-border mt-12 bg-white/30 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            © {{ new Date().getFullYear() }} whatlicense.org
          </p>
        </div>

        <div class="flex items-center gap-8">
          <NuxtLink
              v-for="link in footerLinks"
              :key="link.name"
              :to="link.link"
              :title="link.title"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              class="text-muted hover:text-charcoal transition-colors flex items-center gap-2"
          >
            <Icon
                v-if="link.icon"
                :id="`icon-${link.name.toLowerCase()}`"
                :name="link.icon"
                size="12"
            />
            <span class="text-[10px] font-bold uppercase tracking-widest">{{ link.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
