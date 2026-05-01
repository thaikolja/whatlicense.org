/**
 * Core TypeScript type definitions for the whatlicense.org application.
 *
 * @description  Defines all shared interfaces and enums used across composables,
 *               components, and data modules. Centralised here to enforce type
 *               safety and keep the codebase DRY.
 * @author       whatlicense.org
 * @license      MIT
 */

/* ------------------------------------------------------------------ */
/*  Wizard Flow                                                        */
/* ------------------------------------------------------------------ */

/**
 * Represents the three discrete phases of the single-page wizard UI.
 *
 * - `intro`  – Landing / welcome screen.
 * - `quiz`   – Multi-step questionnaire.
 * - `result` – License result dashboard.
 */
export type WizardScreen = 'intro' | 'quiz' | 'result'

/**
 * A single selectable option displayed inside a {@link QuizQuestion}.
 *
 * Each option carries a human-readable title, description, an illustrative
 * real-life example, and an array of {@link LicenseTrait} tags that feed
 * into the scoring algorithm.
 */
export interface QuizOption {
  /** Short headline shown on the option card. */
  readonly title: string
  /** Longer explanation below the title (1-2 sentences). */
  readonly desc: string
  /** Plain-English real-life example toggled via accordion. */
  readonly example: string
  /** Trait tags that this option contributes to the user's profile. */
  readonly tags: readonly LicenseTrait[]
}

/**
 * A single step in the quiz flow, containing exactly two options.
 *
 * The wizard renders one `QuizQuestion` at a time and collects the
 * user's selection before advancing.
 */
export interface QuizQuestion {
  /** Main question heading (e.g. "What's your stance on sharing?"). */
  readonly question: string
  /** Supporting description displayed below the heading. */
  readonly description: string
  /** Exactly two mutually-exclusive options. */
  readonly options: readonly [ QuizOption, QuizOption ]
}

/* ------------------------------------------------------------------ */
/*  License Data Model                                                 */
/* ------------------------------------------------------------------ */

/**
 * Trait tags used to classify both user answers and license characteristics.
 *
 * The matcher scores each license by counting how many of the user's
 * selected traits overlap with the license's own trait set.
 */
export type LicenseTrait =
    | 'copyleft'
    | 'weak-copyleft'
    | 'permissive'
    | 'commercial-ok'
    | 'non-commercial'
    | 'patent-grant'
    | 'no-patent'
    | 'simple'
    | 'comprehensive'
    | 'network-copyleft'
    | 'no-network'
    | 'public-domain'

/**
 * One of the three condition categories displayed in the result overview.
 */
export type ConditionCategory = 'permissions' | 'conditions' | 'limitations'

/**
 * A single bullet point inside a {@link ConditionCategory} card.
 */
export interface ConditionItem {
  /** Human-readable label (e.g. "Commercial use"). */
  readonly label: string
  /** Short real-life example sentence for the flip-card back. */
  readonly example: string
}

/**
 * Complete definition of an open-source license used throughout the app.
 *
 * Each license carries metadata, condition lists, trait tags for matching,
 * the full legal text, a human-readable summary explaining *why* it was
 * recommended, and a file-header boilerplate statement.
 */
export interface License {
  /** File ID or path. */
  readonly id: string
  /** SPDX identifier (e.g. "MIT", "GPL-3.0-only"). */
  readonly spdx: string
  /** Human-readable name (e.g. "MIT License"). */
  readonly name: string
  /** One-line tagline shown under the license name. */
  readonly subtitle: string
  /** Plain-English paragraph explaining why this license matches the user's answers. */
  readonly whyThisLicense: string
  /** URL to the canonical license text or SPDX page. */
  readonly url: string
  /** Trait tags that define this license's characteristics. */
  readonly traits: readonly LicenseTrait[]
  /** Items displayed in the green "Permissions" card. */
  readonly permissions: readonly ConditionItem[]
  /** Items displayed in the blue "Conditions" card. */
  readonly conditions: readonly ConditionItem[]
  /** Items displayed in the red "Limitations" card. */
  readonly limitations: readonly ConditionItem[]
  /** Multi-line boilerplate for file-header comments. */
  readonly headerStatement: string
}

/* ------------------------------------------------------------------ */
/*  File Header Generator                                              */
/* ------------------------------------------------------------------ */

/**
 * Supported programming languages for file-header comment formatting.
 */
export type CommentLanguage = 'php' | 'javascript' | 'typescript' | 'python' | 'ruby' | 'html' | 'css' | 'shell'

/**
 * A user-defined custom `@property` injected into the file header.
 */
export interface CustomProperty {
  /** The property key without the leading `@` (e.g. "version"). */
  key: string
  /** The property value (e.g. "1.0.0"). */
  value: string
}

/**
 * Reactive form state for the file-header customiser panel.
 */
export interface HeaderFormState {
  /** User's project name. */
  projectName: string
  /** Short project description. */
  description: string
  /** Author's full name. */
  authorName: string
  /** Author's email address. */
  email: string
  /** Author's website URL. */
  website: string
  /** Selected comment-style language. */
  language: CommentLanguage
  /** User-added custom `@property` entries. */
  customProperties: CustomProperty[]
  /** Whether to strip comment syntax from the generated code. */
  excludeComments: boolean
}

export interface IconLink {
  name: string
  icon: string
  link: string
}

export interface FooterLink {
  name: string
  link: string
  icon?: string
  title: string
}

/* ------------------------------------------------------------------ */
/*  Header Validation                                                  */

/* ------------------------------------------------------------------ */

/**
 * Represents a single validation error found in the generated header code.
 */
export interface ValidationError {
  /** Zero-based line index where the error was detected. */
  line: number
  /** Human-readable error message. */
  message: string
}
