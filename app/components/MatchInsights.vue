<script setup lang="ts">
/**
 * Shared “why this match / no match” + runners-up / closest list.
 */
import type { RankedLicense } from '~/utils/matchLicense'
import { licenseToSlug } from '~/utils/licenseSlug'

defineProps<{
  /** Title above the reasons list. */
  title: string
  /** Bullet reasons (match or empty). */
  reasons: string[]
  /** Optional score of the best match. */
  score?: number
  /** Gated runners-up (same hard constraints). */
  runnersUp?: RankedLicense[]
  /** Soft closest when empty (imperfect). */
  closest?: RankedLicense[]
  /** Label for closest list (defaults for empty state). */
  closestLabel?: string
}>()
</script>

<template>
  <div class="w-full max-w-lg mx-auto text-left space-y-6">
    <div v-if="reasons.length">
      <h2 class="eyebrow mb-3">
        {{ title }}
      </h2>
      <ul class="space-y-2 text-body-sm list-disc pl-5">
        <li
          v-for="(reason, i) in reasons"
          :key="i"
        >
          {{ reason }}
        </li>
      </ul>
      <p
        v-if="typeof score === 'number' && Number.isFinite(score) && score > -Infinity"
        class="mt-3 text-xs text-muted"
      >
        Match score: <strong class="text-charcoal">{{ score }}</strong>
      </p>
    </div>

    <div v-if="runnersUp?.length">
      <h2 class="eyebrow mb-3">
        Also close
      </h2>
      <ul class="space-y-2">
        <li
          v-for="row in runnersUp"
          :key="row.license.spdx"
        >
          <NuxtLink
            :to="`/licenses/${licenseToSlug(row.license)}`"
            class="link-brand text-sm"
          >
            {{ row.license.spdx }}
          </NuxtLink>
          <span class="text-xs text-muted ml-2">score {{ row.score }}</span>
        </li>
      </ul>
    </div>

    <div v-if="closest?.length">
      <h2 class="eyebrow mb-3">
        {{ closestLabel || 'Closest imperfect options' }}
      </h2>
      <p class="text-xs text-muted mb-2">
        These do not fully match your hard constraints — for orientation only.
      </p>
      <ul class="space-y-2">
        <li
          v-for="row in closest"
          :key="row.license.spdx"
        >
          <NuxtLink
            :to="`/licenses/${licenseToSlug(row.license)}`"
            class="link-brand text-sm"
          >
            {{ row.license.spdx }}
          </NuxtLink>
          <span class="text-xs text-muted ml-2">score {{ row.score }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
