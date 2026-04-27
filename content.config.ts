import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const conditionItem = z.object({
  label:   z.string(),
  example: z.string()
})

export default defineContentConfig({
  collections: {
    licenses: defineCollection({
      type:   'page',
      source: 'licenses/*.md',
      schema: z.object({
        spdx:            z.string(),
        name:            z.string(),
        subtitle:        z.string(),
        whyThisLicense:  z.string(),
        url:             z.string(),
        traits:          z.array(z.string()),
        permissions:     z.array(conditionItem),
        conditions:      z.array(conditionItem),
        limitations:     z.array(conditionItem),
        headerStatement: z.string(),
        popularity:      z.number().default(0)
      })
    })
  }
})
