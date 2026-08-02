/**
 * ESLint flat config — wraps Nuxt’s generated config.
 */
// @ts-check
import withNuxt from './node_modules/.cache/nuxt/.nuxt/eslint.config.mjs'

//start from Nuxt defaults; drop custom rules in the callback if needed
export default withNuxt(
        //your custom configs here
)
