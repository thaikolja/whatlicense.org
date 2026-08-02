/**
 * Comment style formatters for different programming languages.
 *
 * Used by the file-header generator to wrap raw @tag lines in language-native
 * comment syntax (/** * /, #, <!-- -->, etc.).
 */
import type { CommentLanguage } from '~/types'

/** A function that wraps raw content lines in language-specific comment syntax. */
type CommentFormatter = (lines: readonly string[]) => string

// ... C-style block comment (PHP / JS / TS etc.)
const cStyleBlock: CommentFormatter = (lines) => {
  // ... prefix every line with " * "
  const body = lines.map(line => ` * ${line}`).join('\n')
  return `/**\n${body}\n */`
}

// ... hash line comments (Python / Ruby / Shell)
const hashLine: CommentFormatter = (lines) => {
  // ... one # per line
  return lines.map(line => `# ${line}`).join('\n')
}

// ... HTML/XML comment block
const htmlBlock: CommentFormatter = (lines) => {
  // ... indent body a bit inside <!-- -->
  const body = lines.map(line => `  ${line}`).join('\n')
  return `<!--\n${body}\n-->`
}

// ... CSS block comment
const cssBlock: CommentFormatter = (lines) => {
  // ... same star-prefix vibe as C-style, without the second *
  const body = lines.map(line => ` * ${line}`).join('\n')
  return `/*\n${body}\n */`
}

// ... shell is also hash-style (same as python/ruby for headers)
const shellLine: CommentFormatter = (lines) => {
  // ... identical to hashLine; kept separate for clarity in the map
  return lines.map(line => `# ${line}`).join('\n')
}

/** Maps each supported language to its formatter. */
const FORMATTERS: Record<CommentLanguage, CommentFormatter> = {
  // ... C-family share /** */
  php:        cStyleBlock,
  javascript: cStyleBlock,
  typescript: cStyleBlock,
  // ... # languages
  python:     hashLine,
  ruby:       hashLine,
  shell:      shellLine,
  // ... markup / stylesheets
  html:       htmlBlock,
  css:        cssBlock
}

/**
 * Formats raw content lines into a comment block for the given language.
 *
 * @param language - Target programming language.
 * @param lines    - Raw content lines to wrap in comments.
 * @returns        Formatted comment block string.
 */
export function formatComment(language: CommentLanguage, lines: readonly string[]): string {
  // ... pick formatter and run it
  const formatter = FORMATTERS[language]
  return formatter(lines)
}

/**
 * Returns the file extension typically associated with a language.
 *
 * @param language - The comment language identifier.
 * @returns        File extension including the dot (e.g. `.php`).
 */
export function getFileExtension(language: CommentLanguage): string {
  // ... static map of language → extension
  const extensions: Record<CommentLanguage, string> = {
    php:        '.php',
    javascript: '.js',
    typescript: '.ts',
    python:     '.py',
    ruby:       '.rb',
    html:       '.html',
    css:        '.css',
    shell:      '.sh'
  }
  return extensions[language]
}

/** Human-readable labels for the language dropdown. */
export const LANGUAGE_LABELS: Record<CommentLanguage, string> = {
  php:        'PHP',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python:     'Python',
  ruby:       'Ruby',
  html:       'HTML / XML',
  css:        'CSS / SCSS',
  shell:      'Shell / Bash'
}
