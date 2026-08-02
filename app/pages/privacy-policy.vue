<script
    setup
    lang="ts"
>
/**
 * Privacy Policy — written for whatlicense.org’s client-side design.
 */
// shared contact + social URLs
const links = useSiteLinks()
// human-readable email for body copy (no mailto: prefix)
const email = computed(() => links.email.replace(/^mailto:/i, ''))

useSeoMeta({
  title:         'Privacy Policy',
  description:   'How whatlicense.org handles privacy: client-side license matching, no quiz accounts, and privacy-friendly analytics.',
  ogTitle:       'Privacy Policy | whatlicense.org',
  ogDescription: 'Client-side license wizard. No accounts. No server-side storage of quiz answers.'
})
</script>

<template>
  <LegalDocument
      title="Privacy Policy"
      subtitle="We built whatlicense.org so you can pick a license without handing us your project’s secrets. This page explains what we do and do not collect."
      effective-date="August 2, 2026"
  >
    <section>
      <h2>1. Who we are</h2>
      <p>
        <strong>whatlicense.org</strong> is a free, open-source web app that recommends open-source licenses from a
        short quiz and helps you generate file headers. It is operated by <strong>Kolja Nolte</strong> (
        <a :href="links.email">{{ email }}</a>
        ). The project source is available on
        <a
            :href="links.github"
            target="_blank"
            rel="noopener noreferrer"
        >GitHub
        </a>
        .
      </p>
    </section>

    <section>
      <h2>2. The short version</h2>
      <ul>
        <li>The quiz and license matching run <strong>in your browser</strong>.</li>
        <li>We do <strong>not</strong> create accounts or log you in.</li>
        <li>We do <strong>not</strong> store your quiz answers or generated headers on our servers.</li>
        <li>We use <strong>privacy-friendly analytics</strong> (Simple Analytics) without advertising cookies.</li>
        <li>Optional third-party links (donations, affiliates) are only used if <strong>you</strong> click them.</li>
      </ul>
    </section>

    <section>
      <h2>3. What the app processes on your device</h2>
      <p>
        When you use the wizard, the following stay on your device (or in your browser session) unless you deliberately
        copy or share them elsewhere:
      </p>
      <ul>
        <li><strong>Quiz answers</strong> — used only to score licenses and show a result.</li>
        <li><strong>Matched license choice</strong> — derived from answers + our public license catalog.</li>
        <li>
          <strong>File header form fields</strong> (project name, author, email, website, custom <code>@property</code>
          tags) — used only to build the preview you can copy.
        </li>
      </ul>
      <p>
        Because matching and header generation are client-side, refreshing or closing the tab clears in-memory wizard
        state. We do not operate a backend database of user projects or answers.
      </p>
    </section>

    <section>
      <h2>4. Information we may receive as a website operator</h2>
      <h3>4.1 Hosting and delivery</h3>
      <p>
        The static site is hosted on infrastructure such as <strong>Cloudflare Pages</strong> (or similar CDNs). Like
        almost every website, the host may process technical data needed to serve pages — for example IP address, user
        agent, timestamps, and requested URLs — under the host’s own policies and for security, reliability, and abuse
        prevention.
      </p>

      <h3>4.2 Analytics (Simple Analytics)</h3>
      <p>
        In production we may load
        <a
            href="https://www.simpleanalytics.com/"
            target="_blank"
            rel="noopener noreferrer"
        >Simple Analytics
        </a>
        to understand aggregate traffic (e.g. page views). Simple Analytics is designed to avoid personal identifiers
        and advertising cookies. It is not used to retarget you. Analytics is skipped outside production so local
        development traffic does not pollute stats.
      </p>

      <h3>4.3 When you contact us</h3>
      <p>
        If you email us or open an issue on GitHub, we receive whatever you choose to send (message content, email
        address, GitHub profile). We use that only to respond and maintain the project.
      </p>

      <h3>4.4 Donations and affiliate links</h3>
      <p>
        Optional links may send you to third parties such as <strong>PayPal</strong> (support/donations) or <strong>TermsFeed</strong>
        (affiliate-style “generate a privacy policy” offer). Those services process data under <em>their</em> privacy
        policies once you leave whatlicense.org. We only learn what those platforms share with us as affiliates or
        payees (if anything).
      </p>
    </section>

    <section>
      <h2>5. Cookies and similar technologies</h2>
      <p>
        The core product does not require advertising cookies or a cookie consent wall for the quiz itself. Your browser
        may still store ordinary technical data (e.g. cache, local storage you or extensions set). Analytics, if enabled
        in production, is chosen to minimize or avoid classic tracking cookies. Third-party sites you open from our
        links may set their own cookies.
      </p>
    </section>

    <section>
      <h2>6. What we do not do</h2>
      <ul>
        <li>Sell your personal data.</li>
        <li>Build advertising profiles from quiz answers.</li>
        <li>Require an account to use the recommender or header generator.</li>
        <li>Upload your source code to our servers as part of normal use.</li>
      </ul>
    </section>

    <section>
      <h2>7. Children’s privacy</h2>
      <p>
        The site is a general developer tool. We do not knowingly collect personal information from children for
        marketing. If you believe a child has sent us personal data by email, contact us and we will delete it where
        appropriate.
      </p>
    </section>

    <section>
      <h2>8. International visitors</h2>
      <p>
        The site is available worldwide via CDN. Technical processing by hosts and analytics may occur in different
        countries. By using the site you understand that network requests travel over the internet to deliver static
        assets and optional analytics.
      </p>
    </section>

    <section>
      <h2>9. Your choices</h2>
      <ul>
        <li>Use the site without filling optional header fields that contain personal details.</li>
        <li>Use browser privacy tools / blockers if you prefer not to send analytics beacons.</li>
        <li>Contact us to ask questions about this policy or request deletion of data you emailed us.</li>
      </ul>
    </section>

    <section>
      <h2>10. Changes</h2>
      <p>
        We may update this Privacy Policy when the product or legal requirements change. The “Effective date” at the top
        will be revised. Continued use of the site after changes means you accept the updated policy for future visits.
      </p>
    </section>

    <section>
      <h2>11. Contact</h2>
      <p>
        Privacy questions:
        <a :href="links.email">{{ email }}</a>
        . You can also open an issue on our
        <a
            :href="links.github"
            target="_blank"
            rel="noopener noreferrer"
        >GitHub repository
        </a>
        .
      </p>
      <p class="text-sm text-muted mt-4">
        This page describes how <em>this website</em> handles privacy. It is not a substitute for a privacy policy for
        <em>your</em> product — generate that for your own app or site separately if the law requires it.
      </p>
    </section>
  </LegalDocument>
</template>
