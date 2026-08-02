# AGENTS.md — whatlicense.org

Guidance for AI coding agents working in this repository.

## Project overview

**whatlicense.org** is a client-side open-source license recommender. Users answer a short quiz; a weighted trait-matching engine scores licenses and returns a recommendation plus a customizable file-header generator. All matching runs in the browser — no server-side personal data.

- **Live site:** https://whatlicense.org  
- **Repo:** https://github.com/thaikolja/whatlicense.org  
- **Author:** Kolja Nolte (`kolja.nolte@gmail.com`)  
- **License:** MIT  

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 4 (`app/` directory) |
| UI | Vue 3, **shadcn-vue** (`shadcn-nuxt`, `app/components/ui/`), Tailwind CSS v4 (`@theme` + brand CSS vars in `app/assets/css/main.css`) |
| Content | `@nuxt/content` v3 — licenses as Markdown in `content/licenses/` |
| SEO | `@nuxtjs/seo` |
| Icons | `@nuxt/icon` **local only** (`provider: 'none'`, client bundle) + `@iconify-json/mdi` / lucide — no Iconify API |
| Fonts | `@nuxt/fonts` — Karla (sans), Playfair Display (serif) |
| Syntax highlight | `highlight.js` (tree-shaken languages in file header UI) |
| Analytics | Simple Analytics (`app/plugins/simpleanalytics.client.js`) — stubbed in Vitest (`test/mocks/simple-analytics-vue.ts`) |
| Package manager | **Bun preferred** — `packageManager` in `package.json`, lockfile `bun.lock`. npm/yarn can run scripts; do not commit other lockfiles |
| Deploy (default) | Cloudflare Pages via Wrangler (`wrangler pages deploy dist`) |
| Nitro preset (default) | `cloudflare_pages_static` |
| SSG | `nuxt generate` → `dist/` also works on any static host |
| Tests | Vitest 4 + `@nuxt/test-utils` + `@vitest/coverage-v8` |

## Commands

Prefer Bun. Vitest is invoked via Node (`node ./node_modules/vitest/vitest.mjs`) so e2e does not hit Bun’s `bun:test` conflict.

```bash
bun install                 # Install (+ nuxt prepare via postinstall)
bun run dev                 # Local dev server
bun run build               # Nuxt build
bun run generate            # Static generation → dist/
bun run preview             # Preview production build
bun run deploy              # wrangler pages deploy dist (run generate first)
bun run test                # All Vitest projects (unit + nuxt + e2e)
bun run test:unit           # Pure logic tests
bun run test:nuxt           # Component tests (Nuxt env / happy-dom)
bun run test:e2e            # HTTP e2e against local Nuxt server
bun run test:coverage       # unit + nuxt with coverage → coverage/
bun run test:watch          # Vitest watch mode
```

ESLint: `@nuxt/eslint` (`eslint.config.mjs`).

## Repository layout

```
app/
  app.vue                    # Shell: header, footer, NuxtPage
  assets/css/main.css        # Tailwind v4 + brand + shadcn CSS vars
  components/                # Wizard UI, result dashboard, header generator
  components/ui/             # shadcn-vue primitives (Button, …)
  composables/               # useWizard, useLicenseMatcher, header utils, clipboard
  data/questions.ts          # Quiz questions + trait tags
  lib/utils.ts               # cn() helper (shadcn)
  pages/
    index.vue                # Wizard flow (intro → quiz → result)
    licenses/[slug].vue      # Per-license detail pages
  plugins/                   # Client plugins (Simple Analytics)
  types/index.ts             # Shared TypeScript types (source of truth)
  utils/commentStyles.ts     # Language → comment syntax for headers
content/
  licenses/*.md              # One Markdown file per license (26+)
content.config.ts            # Collection schema for licenses
nuxt.config.ts               # Modules, SEO, icon bundle, Nitro, runtimeConfig
vitest.config.ts             # Vitest projects + coverage
test/
  unit/                      # Node environment, pure logic
  nuxt/                      # Nuxt environment (mountSuspended)
  e2e/                       # @nuxt/test-utils/e2e setup()
  mocks/                     # e.g. simple-analytics-vue stub
wrangler.toml                # Cloudflare Pages project config
public/                      # Static assets, _headers, security.txt, etc.
```

Path alias: `~/` and `@/` → `app/` (Nuxt).

## Architecture (wizard)

1. **`useWizard`** — screen state, **branching** active questions, answers, `collectedTags`.
2. **`QUIZ_QUESTIONS`** (`app/data/questions.ts`) — catalog with `id` + optional `requiresCopyleft`.
    - Always: share → commercial → patents
    - If share = copyleft: + scope (strong/weak) + network
    - Helpers: `getActiveQuestions`, `collectTagsFromAnswers`
3. **`matchLicense`** (`app/utils/matchLicense.ts`) — pure gates + weighted score + popularity tie-break.  
   Composable `useLicenseMatcher` loads content then calls pure matcher.
4. **Result UI** — `ResultDashboard`, `LicenseOverview`, `FullLicenseText`, `FileHeaderGenerator`.  
5. **Header generator** — `useHeaderGenerator` + `useHeaderValidator` + `commentStyles`.

**Alignment rule:** Scope/network questions must not run for permissive users. Q4 must tag `strong-copyleft` /
`weak-copyleft` (not re-tag `copyleft`). Golden tests: `test/unit/wizardAlignment.test.ts`.

### Trait tags (`LicenseTrait`)

Defined in `app/types/index.ts`:

`copyleft` | `strong-copyleft` | `weak-copyleft` | `permissive` | `commercial-ok` | `non-commercial` | `patent-grant` |
`no-patent` | `simple` | `comprehensive` | `network-copyleft` | `no-network` | `public-domain`

- Strong GPL family: `copyleft` + `strong-copyleft`
- Weak (MPL/LGPL/…): `weak-copyleft` only
- User tags and license `traits` must stay aligned with this union.

## Adding or editing a license

1. Add `content/licenses/<slug>.md` with frontmatter matching `content.config.ts`:

```yaml
---
spdx: MIT
name: MIT License
subtitle: One-line summary
whyThisLicense: Plain-English why this matches certain answers
url: https://opensource.org/licenses/MIT
traits: [permissive, commercial-ok, no-patent, simple, no-network]
popularity: 100
permissions:
  - label: Commercial use
    example: Short real-life example.
conditions:
  - label: License & copyright notice
    example: Short real-life example.
limitations:
  - label: Liability
    example: Short real-life example.
headerStatement: |-
  Released under the MIT License.
  See: https://opensource.org/licenses/MIT
---

Full legal license text body…
```

2. Prerender picks up new files automatically (`nuxt.config.ts` scans `content/licenses/*.md` → `/licenses/<slug>`).  
3. Update matcher weights/mismatches only if the license introduces new trait relationships.  
4. Keep `traits` accurate — they drive recommendations.

See also `CONTRIBUTING.md` (frontmatter examples may lag; **`content.config.ts` wins**).

## Configuration notes

### `nuxt.config.ts`

- Modules: `@nuxt/icon`, `shadcn-nuxt`, `@nuxt/fonts`, `@nuxtjs/seo`, `@nuxt/eslint`, `@nuxt/content`
- Tailwind: `@tailwindcss/vite` plugin; do **not** re-add `@nuxt/ui`
- shadcn: `app/components/ui/`; add with `bunx shadcn-vue@latest add <name>`
- Icons: `provider: 'none'`, `clientBundle.scan` + explicit list; keep `@iconify-json/*` for used collections
- Site URL: `https://whatlicense.org`
- `runtimeConfig.public.debugAutoSelect` — `NUXT_PUBLIC_DEBUG_AUTO_SELECT`
- `runtimeConfig.public.links` — PayPal, GitHub, Twitter, TermsFeed, email
- OG image disabled (`ogImage.enabled: false`)
- Vite: terser minify; strips `console.log` / `console.info` in production
- Nitro: default `cloudflare_pages_static`; crawl + explicit license routes

### Wrangler / deploy

- Project name: `whatlicense-org`
- Output: `dist`
- Default deploy: `bun run generate && bun run deploy`
- Also SSG: publish `dist/` anywhere; adjust/remove Nitro `preset` if a host needs default Nuxt static output
- Prefer `wrangler.jsonc` if migrating Wrangler config later
- Keep `compatibility_date` reasonably current when touching Workers/Pages runtime config

### Environment

- `.env` is gitignored. Known vars: `NUXT_PUBLIC_DEBUG_AUTO_SELECT`, `NUXT_OG_IMAGE_SECRET`
- Local Wrangler secrets: `.dev.vars` if needed; never commit secrets

## Coding conventions

- **TypeScript:** Strict; shared types in `app/types/index.ts` — extend there first.  
- **Vue:** `<script setup lang="ts">`; prefer composables over large component logic.  
- **Imports:** `~/` or `@/` aliases; `import type` for types.  
- **Styling:** Tailwind + brand tokens (`cream`, `tan`, `charcoal`, `muted`, …). Brand `text-muted` / `border-border` stay as product colors (mapped carefully with shadcn vars in `main.css`).  
- **UI:** Prefer existing custom classes (`.btn`, `.opt-card`, …) or brand-tuned shadcn variants; do not reintroduce Nuxt UI.  
- **Client-only:** Analytics and clipboard stay client-side; do not break static generation.  
- **Do not** reintroduce server-side license matching or store quiz answers remotely.  
- **Do not** commit `node_modules`, `.nuxt`, `dist`, `coverage/`, `.wrangler`, `.env`, or secrets.

## Design / product constraints

- Privacy-first: matching and header generation are local.  
- Premium developer UI (cream/tan/charcoal, serif headings).  
- Header generator: custom `@property` tags + multi-language comments.  
- Monetization links (PayPal, TermsFeed) live in `runtimeConfig.public.links` / footer only.

## Testing guidance

| Project | Path | Environment | Notes |
|---------|------|-------------|--------|
| unit | `test/unit/` | `node` | Pure logic; relative imports to `app/` OK |
| nuxt | `test/nuxt/` | `nuxt` + happy-dom | `mountSuspended` from `@nuxt/test-utils/runtime` |
| e2e | `test/e2e/` | `node` + real server | `setup({ dev: true, nuxtConfig: { nitro: { preset: 'node-server' } } })` — not Cloudflare preset |

- Coverage: `bun run test:coverage` (unit + nuxt only). Config in `vitest.config.ts`. Reports: `coverage/` (gitignored). Thresholds currently `0` (suite still small).  
- Prefer tests for `useLicenseMatcher` scoring (contradictions, popularity tie-break) and `commentStyles` when changing those areas.  
- Keep `simple-analytics-vue` aliased to `test/mocks/simple-analytics-vue.ts` in Vitest (package is broken CJS/ESM under Vitest).  
- Run Vitest via the package scripts (Node runner), not bare `bunx vitest` for e2e.

## Commit / PR habits

- Prefer small, focused commits.  
- Imperative summary; explain *why* when non-obvious.  
- New licenses: content file + any matcher tweaks.  
- Update `CHANGELOG.md` for user-visible releases when maintained for that change.  
- Run `bun run test` before claiming test-related work is done.

## Common pitfalls

| Pitfall | Correct approach |
|---------|------------------|
| License frontmatter as string arrays | Use `{ label, example }` objects per schema |
| New license not prerendered | File under `content/licenses/*.md` |
| Trait typo | Must match `LicenseTrait` union exactly |
| Ignoring Bun lockfile | Prefer Bun; only commit `bun.lock` |
| Deploy without generate | Always `generate` so `dist/` is fresh |
| E2e with Cloudflare Nitro preset | Use `node-server` (or `dev: true`) in e2e setup |
| Re-adding `@nuxt/ui` | Use shadcn-vue + Tailwind vite plugin |
| Icons via Iconify API | Keep local client bundle + `@iconify-json/*` |
| `.gitignore` ignoring `wrangler.toml` | Coordinate before relying on tracked Wrangler config |

## Out of scope (unless explicitly asked)

- Multi-page CMS or authenticated app  
- Replacing `@nuxt/content` with a custom API without a migration plan  
- Heavy analytics beyond Simple Analytics  
- Brand palette changes without design intent  
