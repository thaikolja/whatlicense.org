/**
 * Clipboard helper with secure Clipboard API + legacy textarea fallback.
 */
import { ref } from 'vue'

/**
 * Reactive “copied!” flag + async copy helper.
 */
export function useClipboard() {
  // flips true briefly after a successful copy
  const isCopied = ref(false)

  /**
   * Copy text to the clipboard (or best-effort fallback).
   */
  const copy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // modern secure path
        await navigator.clipboard.writeText(text)
      } else {
        // old-school fallback for non-HTTPS / missing API
        const textArea      = document.createElement('textarea')
        textArea.value      = text
        // park it off-screen so we don’t flash UI
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'
        document.body.prepend(textArea)
        textArea.select()
        try {
          // browser-native copy command
          document.execCommand('copy')
        } catch (error) {
          // log and keep going — finally still cleans up
          console.error(error)
        } finally {
          // always remove the temp node
          textArea.remove()
        }
      }
      // show “Copied!” for a couple seconds
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (err) {
      // secure path failed entirely
      console.error('Failed to copy text: ', err)
    }
  }

  // public API
  return {
    isCopied,
    copy
  }
}
