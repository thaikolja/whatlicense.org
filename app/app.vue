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

// defaults keep shell useful if runtimeConfig is partial (tests)
const links = {
  paypal: config.public.links?.paypal || 'https://paypal.me/thaikolja/10',
  github: config.public.links?.github || 'https://github.com/thaikolja/whatlicense.org',
  email:  config.public.links?.email || 'mailto:kolja.nolte@gmail.com'
}

const icons = ref<IconLink[]>([
  {
    name: 'PayPal',
    icon: 'mdi:paypal',
    link: links.paypal
  },
  {
    name: 'GitHub',
    icon: 'mdi:github',
    link: links.github
  },
  {
    name: 'E-Mail',
    icon: 'mdi:envelope',
    link: links.email
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
    link: links.paypal,
    icon:     'mdi:paypal',
    external: true
  },
  {
    title:    'GitHub',
    name:     'GitHub',
    link: links.github,
    icon:     'mdi:github',
    external: true
  }
])

// year fixed at build for pure SSG markup (avoids hydration mismatch)
const copyrightYear = new Date().getFullYear()
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <NuxtLink
          to="/"
          class="flex items-center gap-2 sm:gap-3 group shrink-0"
          title="whatlicense.org home"
      >
        <div class="logo-mark">
          <div class="logo-mark-back" />
          <div class="logo-mark-front" />
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
        <span class="logo-wordmark">
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
              class="nav-link"
          >
            About
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-4 sm:gap-6">
          <NuxtLink
              v-for="icon in icons"
              :key="icon.name"
              :to="icon.link"
              :title="`Go to ${icon.name}`"
              :target="icon.link.startsWith('mailto:') ? undefined : '_blank'"
              :rel="icon.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'"
              class="icon-link"
          >
            <Icon
                :id="`icon-${useSlug(icon.name)}`"
                :name="icon.icon"
                :aria-label="icon.name"
                aria-hidden="true"
            />
            <span class="hidden sm:inline eyebrow-muted">{{ icon.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="site-main">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <div class="container-wide flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        <p class="eyebrow-muted tracking-[0.2em] text-center sm:text-left">
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
              class="icon-link"
          >
            <Icon
                v-if="link.icon"
                :id="`icon-footer-${link.name.toLowerCase()}`"
                :name="link.icon"
                size="12"
            />
            <span class="eyebrow-muted">{{ link.name }}</span>
          </NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>
