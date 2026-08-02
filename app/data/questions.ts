/**
 * Quiz question definitions for the license wizard.
 *
 * Flow:
 * 1. Sharing philosophy (copyleft vs permissive)
 * 2. Commercial use
 * 3. Patent protection
 * 4. Copyleft strength — only if copyleft was chosen
 * 5. Network/SaaS — only if copyleft was chosen
 */
import type { QuizQuestion } from '~/types'

/**
 * Ordered catalog of quiz questions. Use {@link getActiveQuestions} for the
 * branch-aware sequence shown to the user.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  // Q1: share-alike vs permissive (always shown)
  {
    id:          'share',
    question:    'What\'s your stance on sharing?',
    description: 'Choose how you want others to treat modifications of your code.',
    options:     [
      {
        title:   'Share alike (Copyleft)',
        desc:    'Anyone who modifies your code must open-source their changes under the same license.',
        example: 'You build a cool library. A big company uses it, adds a feature, and sells it. With this rule, they MUST publish the source code for their new feature so the community benefits.',
        tags:    [ 'copyleft' ]
      },
      {
        title:   'Permissive',
        desc:    'They can use and modify your code, even in closed-source proprietary projects.',
        example: 'You build a cool library. A big company uses it in their closed-source app. They don\'t have to share their code back with you. This leads to maximum adoption.',
        tags:    [ 'permissive' ]
      }
    ]
  },
  // Q2: can companies make money off it?
  {
    id:          'commercial',
    question:    'Commercial Usage',
    description: 'Should companies be allowed to profit off your code?',
    options:     [
      {
        title:   'Allow commercial use',
        desc:    'Standard for open source. Anyone can sell software containing your code.',
        example: 'A startup uses your framework to build their paid SaaS app. This is totally fine and encouraged — it helps your project grow.',
        tags:    [ 'commercial-ok' ]
      },
      {
        title:   'Non-commercial only',
        desc:    'Restricts enterprise usage. Note: Not considered officially "Open Source" by OSI.',
        example: 'A student can use your code for a university project, but a corporation cannot use it internally without buying a commercial license from you.',
        tags:    [ 'non-commercial' ]
      }
    ]
  },
  // Q3: patent language or keep the license short
  {
    id:          'patents',
    question:    'Patent Protection',
    description: 'Do you need explicit patent clauses to protect your users?',
    options:     [
      {
        title:   'Include patent grants',
        desc:    'Protects users against patent litigation from contributors. Safer for enterprise adoption.',
        example: 'A large tech company contributes to your project. Later, they try to sue your users for patent infringement. A patent grant prevents this.',
        tags:    [ 'patent-grant', 'comprehensive' ]
      },
      {
        title:   'Keep it simple',
        desc:    'No explicit patent language. Keeps the license very short and easy to read.',
        example: 'You just want a 3-paragraph license that anyone can read in 10 seconds. You aren\'t worried about complex patent lawsuits.',
        tags:    [ 'no-patent', 'simple' ]
      }
    ]
  },
  // Q4 (copyleft only): strong vs weak scope
  {
    id:               'scope',
    requiresCopyleft: true,
    question:         'Copyleft Scope',
    description:      'Because you chose share-alike: how far should the sharing requirement reach?',
    options:          [
      {
        title:   'Entire project',
        desc:    'The whole program that includes your code must be open-sourced. Maximum protection (strong copyleft).',
        example: 'A company builds a huge app and includes your library. The ENTIRE app must be released under the same open-source license — not just the part that uses your code.',
        tags:    [ 'strong-copyleft' ]
      },
      {
        title:   'Only modified files',
        desc:    'Only the files they actually changed need to stay open. The rest of their project can be proprietary (weak / file-level copyleft).',
        example: 'A company fixes a bug in your library file. They only need to share that fix. Their larger commercial app can stay closed-source.',
        tags:    [ 'weak-copyleft' ]
      }
    ]
  },
  // Q5 (copyleft only): SaaS / network trigger
  {
    id:               'network',
    requiresCopyleft: true,
    question:         'Network / SaaS Use',
    description:      'Should running your code on a server (without distributing it) trigger sharing requirements?',
    options:          [
      {
        title:   'Close the SaaS loophole',
        desc:    'If someone runs a modified version on a server, they must publish the source code too.',
        example: 'A cloud company takes your code, modifies it, and offers it as a paid web service. Without this clause, they never technically "distribute" the code, so they escape copyleft. This option closes that gap.',
        tags:    [ 'network-copyleft' ]
      },
      {
        title:   'Standard protection',
        desc:    'Sharing is only required when the software is actually distributed to end users.',
        example: 'You\'re fine with companies running your code on their servers without sharing changes. You only care about redistribution of the actual binary or source code.',
        tags:    [ 'no-network' ]
      }
    ]
  }
] as const

/**
 * Did the user pick share-alike on the share question?
 * Answers are indexed against the question list you pass in (usually the active list).
 */
export function choseCopyleft(
    questions: readonly QuizQuestion[],
    answers: readonly number[]
): boolean {
  // find the share step in this list
  const shareIdx      = questions.findIndex(q => q.id === 'share')
  // noUncheckedIndexedAccess: grab the question before using it
  const shareQuestion = shareIdx >= 0 ? questions[shareIdx] : undefined
  if (!shareQuestion) return false
  // no answer yet → treat as not copyleft
  const answer = answers[shareIdx]
  if (answer === undefined) return false
  // check if that option’s tags include copyleft
  return shareQuestion.options[answer]?.tags.includes('copyleft') ?? false
}

/**
 * Questions visible given answers so far (answers align with returned sequence).
 */
export function getActiveQuestions(
    allQuestions: readonly QuizQuestion[] = QUIZ_QUESTIONS,
    answers: readonly number[]            = []
): QuizQuestion[] {
  // build the branch-aware list from scratch each time
  const active: QuizQuestion[] = []

  for (const q of allQuestions) {
    if (q.requiresCopyleft) {
      // only unlock scope/network once share = copyleft among active answers
      if (!choseCopyleft(active, answers.slice(0, active.length))) {
        continue
      }
    }
    // include this step
    active.push(q)
  }

  return active
}

/**
 * Collect deduped trait tags from answers aligned with the given question list.
 * Weak path drops bare `copyleft` so we don’t look like strong GPL.
 */
export function collectTagsFromAnswers(
    questions: readonly QuizQuestion[],
    answers: readonly number[]
): import('~/types').LicenseTrait[] {
  // gather every tag from chosen options
  const tags: import('~/types').LicenseTrait[] = []
  answers.forEach((answerIndex, questionIndex) => {
    const option = questions[questionIndex]?.options[answerIndex]
    if (option?.tags) {
      tags.push(...option.tags)
    }
  })

  // unique-ify
  const unique = [ ...new Set(tags) ]

  // weak path: Q1 still emitted copyleft — strip it
  if (unique.includes('weak-copyleft')) {
    return unique.filter(t => t !== 'copyleft')
  }

  return unique
}

