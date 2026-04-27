/**
 * Quiz question definitions for the license wizard.
 *
 * @description  Each question presents two mutually-exclusive options. Every
 *               option carries {@link LicenseTrait} tags that feed into the
 *               scoring algorithm in {@link useLicenseMatcher}.
 *
 *               The wizard uses 5 questions to differentiate ~25 licenses:
 *               1. Sharing philosophy (copyleft vs permissive)
 *               2. Commercial use (allow vs restrict)
 *               3. Patent protection (include vs skip)
 *               4. Copyleft strength (strong vs weak/file-level)
 *               5. Network/SaaS coverage (AGPL-style vs standard)
 */
import type { QuizQuestion } from '~/types'

/**
 * Ordered array of quiz questions presented to the user.
 *
 * @remarks The order matters — questions are shown sequentially and the
 *          progress bar length is derived from `QUIZ_QUESTIONS.length`.
 */
export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
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
  {
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
  {
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
  {
    question:    'Copyleft Scope',
    description: 'If someone uses your code, how far should the sharing requirement reach?',
    options:     [
      {
        title:   'Entire project',
        desc:    'The whole program that includes your code must be open-sourced. Maximum protection.',
        example: 'A company builds a huge app and includes your library. The ENTIRE app must be released under the same open-source license — not just the part that uses your code.',
        tags:    [ 'copyleft' ]
      },
      {
        title:   'Only modified files',
        desc:    'Only the files they actually changed need to stay open. The rest of their project can be proprietary.',
        example: 'A company fixes a bug in your library file. They only need to share that fix. Their larger commercial app can stay closed-source.',
        tags:    [ 'weak-copyleft' ]
      }
    ]
  },
  {
    question:    'Network / SaaS Use',
    description: 'Should running your code on a server (without distributing it) trigger sharing requirements?',
    options:     [
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
