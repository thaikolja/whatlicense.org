import { ref } from 'vue'

export function useClipboard() {
  const isCopied = ref(false)

  const copy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for non-HTTPS or unsupported browsers
        const textArea          = document.createElement('textarea')
        textArea.value          = text
        textArea.style.position = 'absolute'
        textArea.style.left     = '-999999px'
        document.body.prepend(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (error) {
          console.error(error)
        } finally {
          textArea.remove()
        }
      }
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return {
    isCopied,
    copy
  }
}
