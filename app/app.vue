<script
    setup
    lang="ts"
>
import { useSlug } from '#imports'

/**
 * App shell: header, main NuxtPage, footer — SSG-friendly, no client-only APIs here.
 */
import type { IconLink, FooterLink } from '~/types'

const config = useRuntimeConfig()

const icons = ref<IconLink[]>([
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
    name: 'Privacy',
    link:     '/privacy-policy',
    icon: 'mdi:shield-lock-outline',
    external: false
  },
  {
    title:    'Terms of Service',
    name: 'Terms',
    link:     '/terms-of-service',
    icon: 'mdi:file-document-outline',
    external: false
  },
  {
    title:    'Support the project',
    name: 'Support',
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

//year is fixed at build for pure SSG markup (avoids hydration mismatch)
const copyrightYear = new Date().getFullYear()
const isEmail       = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-pattern selection:bg-tan selection:text-white relative">
    <header class="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex justify-between items-center relative z-20 gap-3">
      <NuxtLink
          to="/"
          class="flex items-center gap-2 sm:gap-3 group shrink-0"
          title="whatlicense.org home"
      >
        <div class="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
          <div class="absolute inset-0 bg-charcoal rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
          <div class="absolute inset-0 bg-tan rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-50" />
          <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <span class="text-base sm:text-xl font-bold tracking-tight text-charcoal">
          whatlicense<span class="text-tan">.org</span>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-3 sm:gap-6 min-w-0">
        <nav
            class="flex items-center gap-4 sm:gap-6 sm:mr-2 sm:border-r sm:border-border sm:pr-6"
            aria-label="Primary"
        >
          <NuxtLink
              to="/about"
              title="About whatlicense.org"
              class="text-xs font-bold uppercase tracking-widest text-muted hover:text-charcoal transition-colors"
          >
            About
          </NuxtLink>
          <NuxtLink
              to="/about"
              title="About whatlicense.org"
              class="text-xs font-bold uppercase tracking-widest text-muted hover:text-charcoal transition-colors"
          >
            About
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-4 sm:gap-6">
          <NuxtLink
              v-for="icon in icons"
              :key="icon.name"
              :to="isEmail(icon.link) ? `mailto:${icon.link}` : icon.link"
              :title="`Go to ${icon.name}`"
              target="_blank"
              class="text-muted hover:text-charcoal transition-colors px-1 flex items-center gap-1.5 sm:gap-2"
          >
            <Icon
                :id="`icon-${useSlug(icon.name)}`"
                :name="icon.icon"
                :aria-label="icon.name"
                aria-hidden="true"
            />
            {{ icon.name }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col px-4 sm:px-6 w-full min-w-0">
      <NuxtPage />
    </main>

    <footer class="py-8 sm:py-10 px-4 sm:px-6 border-t border-border mt-10 sm:mt-12 bg-white/30 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-center sm:text-left">
          © {{ copyrightYear }} whatlicense.org
        </p>

        <nav
            class="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8"
            aria-label="Footer"
        >
          <NuxtLink
              v-for="link in footerLinks"
              :key="link.name"
              :to="link.link"
              :title="link.title"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              class="text-muted hover:text-charcoal transition-colors flex items-center gap-1.5 sm:gap-2"
          >
            <Icon
                v-if="link.icon"
                :id="`icon-footer-${link.name.toLowerCase()}`"
                :name="link.icon"
                size="12"
            />
            <span class="text-[10px] font-bold uppercase tracking-widest">
            {{ link.name }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>
