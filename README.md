# whatlicense.org

[![License](https://img.shields.io/github/license/thaikolja/whatlicense.org?style=flat)](https://github.com/thaikolja/whatlicense.org/blob/main/LICENSE) [![Stars](https://img.shields.io/github/stars/thaikolja/whatlicense.org?style=flat)](https://github.com/thaikolja/whatlicense.org/stargazers) [![Last commit](https://img.shields.io/github/last-commit/thaikolja/whatlicense.org?style=flat)](https://github.com/thaikolja/whatlicense.org/commits/main) [![Issues](https://img.shields.io/github/issues/thaikolja/whatlicense.org?style=flat)](https://github.com/thaikolja/whatlicense.org/issues) [![Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen?style=flat)](https://github.com/thaikolja/whatlicense.org#testing)

## Description

**[whatlicense.org](https://whatlicense.org/)** is a free, open-source Nuxt 4 web application that helps developers choose an open-source license for their project.

Instead of comparing legal documents by hand, you answer a short branching quiz about how others may use, share, and
modify your code. A pure matching engine applies hard gates, weighted trait scores, and a popularity tie-breaker against
a curated set of popular licenses (MIT, Apache-2.0, GPL, AGPL, MPL, and many others) and recommends the best honest
fit — or no match when nothing fits.

After you get a result, you can:

- Read a plain-English explanation of *why* that license was chosen
- Review permissions, conditions, and limitations
- Copy the full license text
- Generate a customized source-file header for several programming languages

Everything runs in the browser. There is no account system and no server-side storage of quiz answers.

[TOC]

## How it works

1. Start the wizard on the homepage.
2. Answer the quiz:
    - **Always:** sharing model (copyleft vs permissive), commercial use, patents
    - **If you chose copyleft:** copyleft scope (strong vs weak) and network/SaaS
    - Permissive paths are **3 steps**; copyleft paths are **5 steps**
3. Receive a recommended license with overview cards and full legal text (or an honest empty result if no catalog
   license fits).
4. Optionally fill in project details and generate a file header to paste into your source files.

Matching is implemented in pure TypeScript (`app/utils/matchLicense.ts`) so it is easy to unit-test; the Nuxt composable
loads license content and calls that engine.

## Features

- Branching quiz aligned with license families (strong/weak copyleft, network, non-commercial)
- Hard gates + weighted scoring + popularity tie-breaker (never invents a contradicted winner)
- 26+ license definitions stored as Markdown content
- File header generator (project name, author, copyright, website, custom `@property` tags)
- Comment styles for PHP, JavaScript, TypeScript, Python, Ruby, HTML, CSS, and Shell
- Built with Nuxt 4, shadcn-vue, and Tailwind CSS v4
- Static site: Cloudflare Pages + Wrangler by default; also usable as normal SSG
- Vitest suite: unit, Nuxt component, and e2e projects (~97% line coverage on app logic)

## Examples

### File header (PHP / MIT-style)

```php
/**
 * MyAwesomeLib
 *
 * @description     Tiny utilities for side projects
 * @author          Ada Lovelace <ada@example.com>
 * @copyright       2026 (C) Ada Lovelace
 * @see             https://github.com/ada/my-awesome-lib
 *
 * Released under the MIT License.
 * See: https://opensource.org/licenses/MIT
 */
```

### File header (Python / AGPL-style)

```python
# CoolSaaS Toolkit
#
# @description     Open-source SaaS building blocks
# @author          Grace Hopper <grace@example.com>
# @copyright       2026 (C) Grace Hopper
#
# Released under the GNU Affero General Public License v3.0 or later.
# See: https://www.gnu.org/licenses/agpl-3.0.html
```

## Getting started

### Requirements

- [Bun](https://bun.sh) (**preferred**) — see `packageManager` in `package.json` and lockfile `bun.lock`
- Or [Node.js](https://nodejs.org/) with npm or yarn (scripts work; prefer Bun for install fidelity)

### Install

```bash
git clone https://github.com/thaikolja/whatlicense.org.git
cd whatlicense.org
```

```bash
# Preferred
bun install

# Alternatives
npm install
yarn install
```

### Scripts

| Action | Bun (preferred) | npm | yarn |
|--------|-----------------|-----|------|
| Development server | `bun run dev` | `npm run dev` | `yarn dev` |
| Production static build (`dist/`) | `bun run generate` | `npm run generate` | `yarn generate` |
| Preview production build | `bun run preview` | `npm run preview` | `yarn preview` |
| Deploy to Cloudflare Pages | `bun run deploy` | `npm run deploy` | `yarn deploy` |
| Run all tests | `bun run test` | `npm run test` | `yarn test` |
| Unit tests | `bun run test:unit` | `npm run test:unit` | `yarn test:unit` |
| Nuxt component tests | `bun run test:nuxt` | `npm run test:nuxt` | `yarn test:nuxt` |
| End-to-end tests | `bun run test:e2e` | `npm run test:e2e` | `yarn test:e2e` |
| Coverage (unit + nuxt) | `bun run test:coverage` | `npm run test:coverage` | `yarn test:coverage` |

```bash
bun run dev
```

### Testing

Tests use [Vitest](https://vitest.dev/) and [@nuxt/test-utils](https://github.com/nuxt/test-utils):

| Suite | Path         | Purpose                                                     |
|-------|--------------|-------------------------------------------------------------|
| unit  | `test/unit/` | Pure logic (matcher, wizard, headers, golden answer matrix) |
| nuxt  | `test/nuxt/` | Components in a Nuxt environment                            |
| e2e   | `test/e2e/`  | HTTP against a local Nuxt server (`node-server` preset)     |

```bash
bun run test
bun run test:coverage
```

Coverage uses `@vitest/coverage-v8`. Reports are written to `coverage/` (text, HTML, lcov). HTML report:
`coverage/index.html`. E2E is excluded from the coverage command. Floors are configured in `vitest.config.ts` (
lines/statements ≥ 50%, branches/functions ≥ 40%).

Vitest is invoked via Node (`node ./node_modules/vitest/vitest.mjs`) so e2e does not hit Bun’s `bun:test` conflict — use
the package scripts, not bare `bunx vitest` for the full suite.

### Deployment

**Default: Cloudflare Pages via [Wrangler](https://developers.cloudflare.com/workers/wrangler/).**  
Nitro uses the `cloudflare_pages_static` preset in `nuxt.config.ts`. Deploy runs `wrangler pages deploy dist`.

```bash
bun run generate
bun run deploy
```

**Also normal SSG.**  
`bun run generate` outputs a static site in `dist/` for any host (Netlify, GitHub Pages, Nginx, S3, etc.). For a host that does not need Cloudflare wiring, you may change or remove the Nitro `preset` in `nuxt.config.ts`.

```bash
bun run generate
# publish the contents of dist/ with your host of choice
```

### CI/CD

Both GitHub Actions (`.github/workflows/ci.yml`) and GitLab CI (`.gitlab-ci.yml`) run the same gate on every push /
merge
request:

1. `bun install --frozen-lockfile`
2. `bun run lint`
3. `bun run test`
4. `bun run generate`

On `main`, both then offer a **manual deploy to Cloudflare Pages** (`pages deploy dist --project-name whatlicense-org`).
It activates only when the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets/CI variables are configured
(GitHub: Actions secrets; GitLab: protected masked CI/CD variables); otherwise the deploy job is skipped or hidden.

## Project layout

| Path                                   | Purpose                                                 |
|----------------------------------------|---------------------------------------------------------|
| `app/`                                 | Nuxt app (pages, components, composables)               |
| `app/components/ui/`                   | shadcn-vue components                                   |
| `app/composables/useWizard.ts`         | Branching quiz state machine                            |
| `app/composables/useLicenseMatcher.ts` | Loads licenses; calls pure matcher                      |
| `app/utils/matchLicense.ts`            | Gates, scoring, tie-break (pure, unit-tested)           |
| `app/data/questions.ts`                | Wizard questions, tags, branch helpers                  |
| `app/utils/commentStyles.ts`           | File-header comment formatters                          |
| `content/licenses/`                    | License Markdown content (26+)                          |
| `content.config.ts`                    | Content collection schema (frontmatter source of truth) |
| `nuxt.config.ts`                       | Nuxt configuration                                      |
| `vitest.config.ts`                     | Vitest projects + coverage                              |
| `test/unit/wizardAlignment.test.ts`    | Golden matrix: answers → expected SPDX                  |
| `test/fixtures/`                       | Shared license fixtures for unit tests                  |
| `test/`                                | unit, nuxt, and e2e tests                               |
| `wrangler.toml`                        | Cloudflare Pages settings                               |

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add licenses and improve matching.
Agent-oriented project notes live in [AGENTS.md](AGENTS.md).

1. Fork the repository
2. Create a branch for your change
3. Run `bun run test` (and `bun run test:coverage` if you touch tested code)
4. Open a pull request against `main`

## Author

**Kolja Nolte**  
Email: [kolja.nolte@gmail.com](mailto:kolja.nolte@gmail.com)

## License

This project is licensed under the [MIT License](LICENSE).
