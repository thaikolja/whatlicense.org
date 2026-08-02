<script
    setup
    lang="ts"
>
/**
 * About — editorial story of whatlicense.org (not a legal page).
 */
const config = useRuntimeConfig()

const email = computed(() => {
  const raw = config.public?.links?.email as string | undefined
  if (!raw) return 'kolja.nolte@gmail.com'
  return raw.replace(/^mailto:/i, '')
})

const constellation = [
  { spdx: 'MIT', vibe: 'maximum freedom', rotate: '-rotate-2' },
  { spdx: 'Apache-2.0', vibe: 'patents included', rotate: 'rotate-1' },
  { spdx: 'GPL-3.0', vibe: 'share-alike', rotate: 'rotate-2' },
  { spdx: 'AGPL-3.0', vibe: 'closes the SaaS gap', rotate: '-rotate-1' },
  { spdx: 'MPL-2.0', vibe: 'file-level copyleft', rotate: 'rotate-3' },
  { spdx: 'CC0-1.0', vibe: 'public domain-ish', rotate: '-rotate-3' }
] as const

const principles = [
  {
    title: 'Questions, not case law',
    body:  'You should not need a J.D. to ship a README. We translate “do I care about patents?” into tags a matcher can score.'
  },
  {
    title: 'Honest empty results',
    body:  'If no license in the catalog fits, we say so. Inventing AGPL because “something has to win” is worse than a blank slate.'
  },
  {
    title: 'Your code never phones home',
    body:  'Matching and header generation run in the browser. We don’t store quiz answers on a server. Privacy is a product feature, not a footnote.'
  },
  {
    title: 'Headers you can paste',
    body:  'A recommendation without a file header is half a gift. Generate comment blocks for PHP, JS, Python, and friends — with custom @tags.'
  }
] as const

const timeline = [
  {
    step:   '01',
    title:  'Share or keep closed?',
    detail: 'Copyleft vs permissive — the fork in the road that unlocks the rest of the path.'
  },
  {
    step:   '02',
    title:  'Money & patents',
    detail: 'Commercial use and patent grants shape the short list more than buzzwords do.'
  },
  {
    step:   '03',
    title:  'Scope & network (if copyleft)',
    detail: 'Strong vs weak, and whether SaaS should trigger sharing — only when it actually matters.'
  },
  {
    step:   '04',
    title:  'Match, explain, ship',
    detail: 'Gates first, then weighted scores, then a plain-English “why” plus the full text and a header.'
  }
] as const

useSeoMeta({
  title:         'About Licenses',
  description:   'The story of whatlicense.org — a privacy-first, browser-side open-source license wizard for developers who hate legal jargon.',
  ogTitle:       'About Licenses',
  ogDescription: 'Why we built a branching license quiz, honest matching, and a file-header generator that never uploads your answers.'
})
</script>

<template>
  <div class="container-page py-4 sm:py-10 pb-16 sm:pb-20">
    <section class="relative section-block animate-fade-up">
      <div
          class="pointer-events-none absolute -top-8 right-0 w-48 h-48 border border-sand rounded-full opacity-40 -z-10 hidden sm:block"
          aria-hidden="true"
      />
      <div
          class="pointer-events-none absolute top-12 right-12 w-24 h-24 border border-tan/40 rounded-full opacity-50 -z-10 hidden sm:block"
          aria-hidden="true"
      />

      <p class="eyebrow-wide tracking-[0.25em] mb-3 sm:mb-4">
        About the project
      </p>
      <h1 class="text-3xl sm:text-5xl md:text-7xl heading-display leading-[1.08] mb-5 sm:mb-6 max-w-3xl">
        Licenses are poetry <span class="italic text-muted font-normal">with teeth.</span>
      </h1>
      <p class="text-base sm:text-xl text-body max-w-2xl mb-6 sm:mb-8">
        <strong class="text-charcoal">whatlicense.org</strong> is a small, stubborn tool for developers who want a clear
        answer to a messy question: <em class="text-charcoal not-italic font-semibold">what open-source license do I
        actually need?</em> No account. No jargon gauntlet. Just a branching quiz, a honest matcher, and a header you
        can paste before coffee cools.
      </p>

      <div class="flex flex-wrap items-center gap-3 sm:gap-4">
        <NuxtLink
            to="/"
            class="btn"
        >
          Start the wizard <span aria-hidden="true">→</span>
        </NuxtLink>
        <a
            :href="config.public.links.github"
            target="_blank"
            rel="noopener noreferrer"
            class="link-ghost"
        >
          Source on GitHub
        </a>
      </div>
    </section>

    <section
        class="section-block animate-fade-up"
        aria-label="Sample licenses in the catalog"
    >
      <div class="flex items-end justify-between gap-4 mb-6">
        <h2 class="text-2xl sm:text-3xl heading-display">
          A constellation of choices
        </h2>
        <p class="eyebrow-muted hidden sm:block">
          26+ licenses curated
        </p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div
            v-for="(item, i) in constellation"
            :key="item.spdx"
            class="constellation-card"
            :class="[item.rotate, i % 2 === 1 ? 'md:translate-y-3' : '']"
        >
          <p class="font-mono text-sm sm:text-base font-bold text-charcoal tracking-tight mb-1">
            {{ item.spdx }}
          </p>
          <p class="text-xs text-muted leading-snug">
            {{ item.vibe }}
          </p>
          <div
              class="constellation-dot"
              aria-hidden="true"
          />
        </div>
      </div>
      <p class="mt-4 text-body-sm max-w-xl">
        From “do almost anything” MIT energy to AGPL’s network copyleft — the catalog lives as Markdown under
        <code class="text-charcoal font-semibold">content/licenses/</code>, scored by traits, not vibes alone.
      </p>
    </section>

    <section class="section-block">
      <div class="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
        <div class="md:col-span-4">
          <p class="eyebrow-wide mb-3">
            Manifesto
          </p>
          <h2 class="text-3xl sm:text-4xl heading-display leading-tight mb-4">
            Built for people who ship on evenings and weekends
          </h2>
          <p class="text-body">
            Legal documents are long. Your pull request is short. We sit in the awkward middle — translation layer
            between intent and SPDX.
          </p>
        </div>
        <div class="md:col-span-8 grid sm:grid-cols-2 gap-4">
          <article
              v-for="(p, idx) in principles"
              :key="p.title"
              class="principle-card"
          >
            <span class="eyebrow">
              0{{ idx + 1 }}
            </span>
            <h3 class="text-lg font-bold text-charcoal mt-2 mb-2">
              {{ p.title }}
            </h3>
            <p class="text-body-sm">
              {{ p.body }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-block engine-panel">
      <div class="grid md:grid-cols-2">
        <div class="p-6 sm:p-10 border-b md:border-b-0 md:border-r border-border">
          <p class="eyebrow-wide mb-3">
            Under the hood
          </p>
          <h2 class="text-2xl sm:text-3xl heading-display mb-4">
            A branching quiz, then hard gates
          </h2>
          <p class="text-body mb-6">
            Pick permissive and you’re done in three beats. Choose copyleft and we unlock scope and network — because
            “share-alike” without those questions is a coin flip in a dark room.
          </p>
          <p class="text-sm text-charcoal leading-relaxed border-l-2 border-tan pl-4">
            Scoring is pure TypeScript: filter impossible licenses first, weight the rest, break ties with popularity.
            The UI is just a friendly coat of paint over that honesty.
          </p>
        </div>
        <ol class="p-6 sm:p-10 space-y-6 list-none">
          <li
              v-for="t in timeline"
              :key="t.step"
              class="flex gap-4"
          >
            <span class="font-mono text-xs font-bold text-tan shrink-0 pt-1">
              {{ t.step }}
            </span>
            <div>
              <h3 class="font-bold text-charcoal mb-1">
                {{ t.title }}
              </h3>
              <p class="text-body-sm">
                {{ t.detail }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section-block relative">
      <blockquote class="max-w-3xl mx-auto text-center px-2">
        <p class="text-2xl sm:text-3xl md:text-4xl heading-display leading-snug mb-6">
          “Your answers stay where your code lives — <span class="italic text-muted font-normal">on your machine.</span>”
        </p>
        <footer class="eyebrow-muted tracking-[0.2em]">
          Privacy-first by architecture · see
          <NuxtLink
              to="/privacy-policy"
              class="link-brand"
          >
            Privacy Policy
          </NuxtLink>
        </footer>
      </blockquote>
    </section>

    <section class="mb-16 sm:mb-20 grid md:grid-cols-5 gap-8 items-stretch">
      <div class="md:col-span-3 panel-dark p-6 sm:p-10">
        <div
            class="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white/10"
            aria-hidden="true"
        />
        <p class="eyebrow-wide mb-3">
          The human
        </p>
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          Made by Kolja Nolte
        </h2>
        <p class="text-cream/80 leading-relaxed mb-6 max-w-lg">
          A developer who got tired of reopening the same “MIT vs Apache vs GPL” tabs at 1 a.m. This site is open source
          (MIT), opinionated about clarity, and happy to be wrong in public — open an issue when the matcher misses.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
              :href="`mailto:${email}`"
              class="inline-flex items-center gap-2 eyebrow text-cream/90 hover:text-white transition-colors"
          >
            <Icon
                name="mdi:envelope"
                size="14"
            />
            {{ email }}
          </a>
          <a
              :href="config.public.links.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 eyebrow text-cream/90 hover:text-white transition-colors"
          >
            <Icon
                name="mdi:github"
                size="14"
            />
            GitHub
          </a>
        </div>
      </div>

      <div class="md:col-span-2 flex flex-col gap-4">
        <div class="flex-1 rounded-3xl border border-border bg-cream-dark p-6 flex flex-col justify-between">
          <div>
            <p class="eyebrow mb-2">
              Support
            </p>
            <p class="text-body-sm mb-4">
              Hosting and caffeine are not free. If the wizard saved you an hour, a coffee keeps the lights on.
            </p>
          </div>
          <a
              :href="config.public.links.paypal"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm btn-block"
          >
            <Icon
                name="mdi:paypal"
                size="14"
            />
            Donate via PayPal
          </a>
        </div>
        <div class="panel-glass rounded-3xl p-6">
          <p class="eyebrow mb-2">
            Fine print (friendly)
          </p>
          <p class="text-body-sm">
            Recommendations are <strong class="text-charcoal">not legal advice</strong>. Read the
            <NuxtLink
                to="/terms-of-service"
                class="link-brand"
            >
              Terms
            </NuxtLink>
            when you need the serious voice.
          </p>
        </div>
      </div>
    </section>

    <section class="text-center border-t border-border pt-12">
      <p class="eyebrow-wide tracking-[0.25em] mb-3">
        Ready when you are
      </p>
      <h2 class="text-3xl sm:text-4xl heading-display mb-6">
        What license do <span class="italic text-muted font-normal">you</span> need?
      </h2>
      <NuxtLink
          to="/"
          class="btn"
      >
        Open the wizard
      </NuxtLink>
    </section>
  </div>
</template>
