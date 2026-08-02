/**
 * Nuxt Content collection config for license Markdown pages.
 * Schema here is the source of truth for frontmatter (not CONTRIBUTING samples).
 */
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

//shared shape for permissions / conditions / limitations bullets
const conditionItem = z.object({
  label:   z.string(),
  example: z.string()
})

export default defineContentConfig({
  collections: {
    //one collection: every file under content/licenses/*.md
    licenses: defineCollection({
      type:   'page',
      source: 'licenses/*.md',
      //frontmatter fields used by matcher + result UI
      schema: z.object({
        spdx:            z.string(),
        name:            z.string(),
        subtitle:        z.string(),
        whyThisLicense:  z.string(),
        url:             z.string(),
        //matcher tags (strings; cast to LicenseTrait in app code)
        traits:          z.array(z.string()),
        permissions:     z.array(conditionItem),
        conditions:      z.array(conditionItem),
        limitations:     z.array(conditionItem),
        headerStatement: z.string(),
        //tie-break popularity (higher wins)
        popularity:      z.number().default(0)
      })
    })
  }
})
