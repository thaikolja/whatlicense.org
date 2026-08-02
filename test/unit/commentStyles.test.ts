/**
 * Unit: comment formatters + language labels.
 *
 * Casual notes use //above important lines in app code;
 * tests stay readable with a file-level JSDoc only where dense.
 */
import { describe, expect, it } from 'vitest'
import {
  formatComment,
  getFileExtension,
  LANGUAGE_LABELS
} from '../../app/utils/commentStyles'
import type { CommentLanguage } from '../../app/types'

const languages: CommentLanguage[] = [
  'php',
  'javascript',
  'typescript',
  'python',
  'ruby',
  'html',
  'css',
  'shell'
]

//test suite for 'commentStyles'
describe('commentStyles', () => {
  //wraps lines in C-style block comments for php/js/ts
  it('wraps lines in C-style block comments for php/js/ts', () => {
    for (const lang of [ 'php', 'javascript', 'typescript' ] as const) {
      const result = formatComment(lang, [ 'My Project', '', '@author Ada' ])
      expect(result).toBe('/**\n * My Project\n * \n * @author Ada\n */')
    }
  })

  //wraps lines in hash comments for python/ruby/shell
  it('wraps lines in hash comments for python/ruby/shell', () => {
    for (const lang of [ 'python', 'ruby', 'shell' ] as const) {
      const result = formatComment(lang, [ 'Cool Tool', '@author Grace' ])
      expect(result).toBe('# Cool Tool\n# @author Grace')
    }
  })

  //wraps lines in HTML comments
  it('wraps lines in HTML comments', () => {
    expect(formatComment('html', [ 'Site header' ])).toBe('<!--\n  Site header\n-->')
  })

  //wraps lines in CSS block comments
  it('wraps lines in CSS block comments', () => {
    expect(formatComment('css', [ 'theme tokens' ])).toBe(
      '/*\n * theme tokens\n */'
    )
  })

  //returns expected file extensions for every language
  it('returns expected file extensions for every language', () => {
    const expected: Record<CommentLanguage, string> = {
      php:        '.php',
      javascript: '.js',
      typescript: '.ts',
      python:     '.py',
      ruby:       '.rb',
      html:       '.html',
      css:        '.css',
      shell:      '.sh'
    }

    for (const lang of languages) {
      expect(getFileExtension(lang)).toBe(expected[lang])
    }
  })

  //exposes human-readable labels for every language
  it('exposes human-readable labels for every language', () => {
    for (const lang of languages) {
      expect(LANGUAGE_LABELS[lang].length).toBeGreaterThan(0)
    }
  })
})
