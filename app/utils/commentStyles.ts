/**
 * Comment style formatters for different programming languages.
 *
 * @description  Provides language-specific comment wrapping functions used by
 *               the file-header generator. Each formatter takes an array of
 *               raw content lines and returns a single formatted string with
 *               the appropriate comment syntax.
 */
import type { CommentLanguage } from '~/types'

/* ------------------------------------------------------------------ */
/*  Formatter type                                                     */
/* ------------------------------------------------------------------ */

/**
 * A function that wraps raw content lines in language-specific comment syntax.
 *
 * @param lines - Array of raw content lines (without comment prefixes).
 * @returns      Fully formatted comment block as a single string.
 */
type CommentFormatter = (lines: readonly string[]) => string

/* ------------------------------------------------------------------ */
/*  Formatters                                                         */
/* ------------------------------------------------------------------ */

/**
 * C-style block comment (`/** ... * /`).
 * Used by PHP, JavaScript, TypeScript, Java, C, C++, C#, Go, Rust, Swift, Kotlin.
 */
const cStyleBlock: CommentFormatter = (lines) => {
  const body = lines.map(line => ` * ${line}`).join('\n')
  return `/**\n${body}\n */`
}

/**
 * Hash-prefixed line comments (`# ...`).
 * Used by Python, Ruby, Shell, Perl, R, YAML.
 */
const hashLine: CommentFormatter = (lines) => {
  return lines.map(line => `# ${line}`).join('\n')
}

/**
 * HTML/XML comment block (`<!-- ... -->`).
 * Used by HTML, XML, SVG, Vue templates.
 */
const htmlBlock: CommentFormatter = (lines) => {
  const body = lines.map(line => `  ${line}`).join('\n')
  return `<!--\n${body}\n-->`
}

/**
 * CSS block comment (`/* ... * /`).
 * Used by CSS, SCSS, Less.
 */
const cssBlock: CommentFormatter = (lines) => {
  const body = lines.map(line => ` * ${line}`).join('\n')
  return `/*\n${body}\n */`
}

/**
 * Shell-style hash comments with a shebang-aware header.
 * Used by Bash, Zsh, Shell scripts.
 */
const shellLine: CommentFormatter = (lines) => {
  return lines.map(line => `# ${line}`).join('\n')
}

/* ------------------------------------------------------------------ */
/*  Language → Formatter mapping                                       */
/* ------------------------------------------------------------------ */

/**
 * Maps each supported {@link CommentLanguage} to its formatter function.
 */
const FORMATTERS: Record<CommentLanguage, CommentFormatter> = {
  php:        cStyleBlock,
  javascript: cStyleBlock,
  typescript: cStyleBlock,
  python:     hashLine,
  ruby:       hashLine,
  html:       htmlBlock,
  css:        cssBlock,
  shell:      shellLine
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */

/* ------------------------------------------------------------------ */

/**
 * Formats raw content lines into a comment block for the given language.
 *
 * @param language - Target programming language.
 * @param lines    - Raw content lines to wrap in comments.
 * @returns         Formatted comment block string.
 *
 * @example
 * ```ts
 * formatComment('php', ['My Project', '', '@author John'])
 * // => "/**\n * My Project\n *\n * @author John\n * /"
 * ```
 */
export function formatComment(language: CommentLanguage, lines: readonly string[]): string {
  const formatter = FORMATTERS[language]
  return formatter(lines)
}

/**
 * Returns the file extension typically associated with a language.
 *
 * @param language - The comment language identifier.
 * @returns         File extension including the dot (e.g. `.php`).
 */
export function getFileExtension(language: CommentLanguage): string {
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

/**
 * Human-readable display labels for language selector dropdowns.
 */
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
