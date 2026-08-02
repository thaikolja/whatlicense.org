/**
 * Stub for simple-analytics-vue (broken CJS/ESM package under Vitest).
 * Vitest aliases the real package here so Nuxt component tests can boot.
 */
export default {
  /** Vue plugin install — intentionally does nothing. */
  install() {
    // ... no-op: we don’t want analytics network calls in tests
  }
}
