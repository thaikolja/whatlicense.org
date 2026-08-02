<script
    setup
    lang="ts"
>
/**
 * Terms of Service — product-specific, not legal advice for end-user projects.
 */
const config = useRuntimeConfig()
const email  = computed(() => {
  const raw = config.public?.links?.email as string | undefined
  if (!raw) return 'kolja.nolte@gmail.com'
  return raw.replace(/^mailto:/i, '')
})

useSeoMeta({
  title: 'Terms of Service',
  description:
      'Terms for using whatlicense.org: informational license recommendations, no warranties, and open-source project terms.',
  ogTitle: 'Terms of Service | whatlicense.org',
  ogDescription:
      'Use of the license wizard is at your own risk. Recommendations are not legal advice.'
})
</script>

<template>
  <LegalDocument
      title="Terms of Service"
      subtitle="These terms govern your use of whatlicense.org — a free license recommender and file-header helper for developers."
      effective-date="August 2, 2026"
  >
    <section>
      <h2>1. Agreement</h2>
      <p>
        By accessing or using <strong>whatlicense.org</strong> (the “Site”), you agree to these Terms of Service
        (“Terms”). If you do not agree, do not use the Site. The Site is operated by <strong>Kolja Nolte</strong> (
        <a :href="`mailto:${email}`">{{ email }}</a>
        ).
      </p>
    </section>

    <section>
      <h2>2. What the Site provides</h2>
      <p>The Site offers, among other things:</p>
      <ul>
        <li>A short quiz that scores answers against a curated catalog of open-source licenses.</li>
        <li>Plain-English overviews, permissions/conditions/limitations summaries, and full license text where
          available.
        </li>
        <li>A client-side file-header generator for common programming languages.</li>
        <li>Static pages describing individual licenses.</li>
      </ul>
      <p>
        Features may change, expand, or shrink as the open-source project evolves. We may update license metadata,
        questions, or matching logic without prior notice.
      </p>
    </section>

    <section>
      <h2>3. Not legal advice</h2>
      <p>
        <strong>License recommendations and explanations on this Site are informational tools only. They are not legal
          advice.</strong> Open-source licensing can depend on your codebase, dependencies, jurisdiction, commercial
        plans, and how you distribute software. Matching is automated and may be incomplete, outdated, or wrong for your
        situation.
      </p>
      <p>
        You are solely responsible for choosing, applying, and complying with any license. If you need certainty —
        especially for commercial products, patents, trademarks, or compliance programs — consult a qualified attorney.
      </p>
    </section>

    <section>
      <h2>4. License texts and third-party rights</h2>
      <p>
        Full license documents (MIT, GPL, Apache, etc.) are published by their respective authors and stewards.
        Displaying them here does not transfer ownership. Copyright and trademark rights in those texts remain with
        their owners. Always verify against the official SPDX or steward source when compliance matters.
      </p>
      <p>
        Summaries, “why this license,” and trait tags are editorial content of the Site and may simplify or omit
        nuances.
      </p>
    </section>

    <section>
      <h2>5. Your responsibilities</h2>
      <ul>
        <li>Use the Site lawfully and in a way that does not harm the service or other users.</li>
        <li>Do not attempt to disrupt, scrape abusively, or overload the Site.</li>
        <li>Do not use the Site to misrepresent the license of software you did not have rights to license.</li>
        <li>Double-check generated headers and legal texts before shipping them in production code.</li>
      </ul>
    </section>

    <section>
      <h2>6. No accounts; client-side processing</h2>
      <p>
        The core wizard does not require an account. Quiz answers and header form fields are processed in your browser
        for the purpose of showing results and previews. See our
        <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
        for details on analytics, hosting, and third-party links.
      </p>
    </section>

    <section>
      <h2>7. Open-source software of the Site</h2>
      <p>
        The Site’s own source code is available under the <strong>MIT License</strong> (see the repository
        <a
            :href="config.public.links.github"
            target="_blank"
            rel="noopener noreferrer"
        >on GitHub
        </a>
        and the project <code>LICENSE</code> file). That license governs the software of the Site — not the open-source
        licenses the Site recommends for <em>your</em> projects.
      </p>
    </section>

    <section>
      <h2>8. External links and sponsorships</h2>
      <p>
        The Site may link to third parties (for example GitHub, PayPal donations, or TermsFeed). We do not control those
        services. Your use of them is under their terms and policies. Some links may be affiliate or sponsorship
        relationships; they do not change section 3 (not legal advice).
      </p>
    </section>

    <section>
      <h2>9. Disclaimer of warranties</h2>
      <p>
        THE SITE IS PROVIDED <strong>“AS IS”</strong> AND <strong>“AS AVAILABLE”</strong>, WITHOUT WARRANTIES OF ANY
        KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, OR THAT THE MATCHING ENGINE WILL SELECT THE “CORRECT” LICENSE FOR
        YOU. We do not warrant uninterrupted or error-free operation.
      </p>
    </section>

    <section>
      <h2>10. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR AND CONTRIBUTORS OF WHATLICENSE.ORG SHALL NOT BE LIABLE FOR
        ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL,
        OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SITE OR ANY LICENSE
        YOU CHOOSE BASED ON THE SITE — EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p>
        Where liability cannot be excluded, it is limited to the greater of (a) the amount you paid us (if any) for
        using the Site in the twelve months before the claim, or (b) fifty euros (€50). The Site is free for ordinary
        use; donations are voluntary and not a purchase of advice.
      </p>
    </section>

    <section>
      <h2>11. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless the operator and contributors from claims arising out of your use of
        the Site, your software licensing decisions, or your violation of these Terms, to the extent permitted by
        applicable law.
      </p>
    </section>

    <section>
      <h2>12. Changes to the Terms</h2>
      <p>
        We may update these Terms from time to time. The “Effective date” will change when we do. Continued use after an
        update constitutes acceptance of the revised Terms for subsequent use.
      </p>
    </section>

    <section>
      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws applicable to the operator’s place of establishment, without regard to
        conflict-of-law rules that would apply another jurisdiction’s law, except where mandatory consumer protections
        in your country apply and cannot be waived.
      </p>
    </section>

    <section>
      <h2>14. Contact</h2>
      <p>
        Questions about these Terms:
        <a :href="`mailto:${email}`">{{ email }}</a>
        or via the
        <a
            :href="config.public.links.github"
            target="_blank"
            rel="noopener noreferrer"
        >GitHub project
        </a>
        .
      </p>
      <p>
        Related:
        <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
        .
      </p>
    </section>
  </LegalDocument>
</template>
