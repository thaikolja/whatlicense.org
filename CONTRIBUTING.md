# Contributing to whatlicense.org

Thank you for contributing to whatlicense.org!

## How to add a new License

1. Create a new markdown file in `content/licenses/`.
2. Use the following frontmatter structure:
   ```yaml
   ---
   title: "License Name"
   spdx: "SPDX-ID"
   subtitle: "One sentence summary"
   whyThisLicense: "Detailed reasoning for recommendation"
   permissions: ["commercial", "modify", "distribute", "private-use"]
   conditions: ["include-copyright"]
   limitations: ["liability", "warranty"]
   tags: ["permissive", "popular"]
   ---
   Full license text goes here.
   ```
3. Add the license slug to the `useLicenseMatcher` logic if special weighting is needed.

## Improving the Matching Algorithm

The matching logic lives in `app/composables/useLicenseMatcher.ts`. It uses a scoring system:

- **Weights**: Traits like `copyleft`, `permissive`, or `non-commercial` add points to matching licenses.
- **Penalties**: Contradicting traits (e.g., asking for commercial use but matching a non-commercial license) apply
  heavy penalties.

## Local Setup

```bash
npm install
npm run dev
```
