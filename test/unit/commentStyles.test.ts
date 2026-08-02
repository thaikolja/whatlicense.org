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

describe('commentStyles', () => {
  it('wraps lines in C-style block comments for php/js/ts', () => {
    for (const lang of [ 'php', 'javascript', 'typescript' ] as const) {
      const result = formatComment(lang, [ 'My Project', '', '@author Ada' ])
      expect(result).toBe('/**\n * My Project\n * \n * @author Ada\n */')
    }
  })

  it('wraps lines in hash comments for python/ruby/shell', () => {
    for (const lang of [ 'python', 'ruby', 'shell' ] as const) {
      const result = formatComment(lang, [ 'Cool Tool', '@author Grace' ])
      expect(result).toBe('# Cool Tool\n# @author Grace')
    }
  })

  it('wraps lines in HTML comments', () => {
    expect(formatComment('html', [ 'Site header' ])).toBe('<!--\n  Site header\n-->')
  })

  it('wraps lines in CSS block comments', () => {
    expect(formatComment('css', [ 'theme tokens' ])).toBe(
      '/*\n * theme tokens\n */'
    )
  })

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

  it('exposes human-readable labels for every language', () => {
    for (const lang of languages) {
      expect(LANGUAGE_LABELS[lang].length).toBeGreaterThan(0)
    }
  })
})
