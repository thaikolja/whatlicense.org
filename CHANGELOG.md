# Changelog

**All notable changes to this project will be documented in this file.**

## v1.0.0

**Released:** 2026-04-27

*Changelogs for previous, non-stable versions can be found in the GitLab repository…*

### Added

- Initial release of whatlicense.org.
- 5-step license recommendation wizard.
- Weighted matching algorithm for high-accuracy results.
- Support for 26+ open-source licenses.
- Live File Header Customizer with syntax highlighting.
- Custom `@property` tag support in file headers.
- "Calculating" animation for a high-fidelity experience.
- Centralized monetization configuration (PayPal, TermsFeed).
- Minimalist footer and premium branding.
- Unit and `e2e` tests, SimpleAnalytics plugin integration.
- `AGENTS.md` with commit message guidelines.
- File‑commits script for per‑file commits.
- `git‑file‑commits` skill.

### Changed
- Updated UI components and improved license matching logic.
- Enhanced license matching UI and added a footer.
- Improved UI and added monetization features.
- Updated license texts and improved UI messaging.
- Updated license texts and improved code structure.
- Enhanced footer and social links.
- Updated project references from whatlicense.io to whatlicense.org.
- Updated commit message guidelines to the Sentry spec.
- Updated `.gitignore` with ignored paths.
- Refined `git‑file‑commits` skill to use per‑file commit messages.

### Removed
- Copies and unused files (backup configs, duplicate lock files).

### Fixed
- Fixed overlapping text in the header generator preview.
- Improved modal transitions with decoupled backdrop blur.
- Resolved navigation blocking issues during data fetching.
- Fixed AST stringification for license text copying.
