import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: false,
        indexBlog: true,
        blogRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],
  title: 'Victor Jimenez | VictorStack',
  tagline: 'Engineering notes by Victor Jimenez, Senior Product Engineer: full-stack web, integrations, release engineering, performance and security.',
  favicon: 'img/vs-logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://victorstack-ai.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/agent-blog/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'victorstack-ai', // Usually your GitHub org/user name.
  projectName: 'agent-blog', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Pantheon Quality Assistant review — slug fix (old slug from RSS title)
          { from: '/2026-03-03-quality-assistant-now-available-in-content-publisher', to: '/' },
          // Feb 28 duplicate roundup posts — both had wrong generic title + RSS-derived slugs
          { from: '/2026-02-28-mike-herchel-s-blog-buy-your-tickets-now-to-the-drupalcon-ga', to: '/' },
          { from: '/2026-02-28-please-please-please-stop-using-passkeys-for-encrypting-user', to: '/' },
          // WordPress MCP Adapter → wordpress-mcp-adapter-demo
          { from: '/2026-02-05-0645-devlog', to: '/' },
          { from: '/2026-02-05-0806-devlog', to: '/' },
          { from: '/2026-02-05-1220-devlog', to: '/' },
          { from: '/2026-02-05-1314-devlog', to: '/' },
          { from: '/2026-02-05-1643-devlog', to: '/' },
          { from: '/2026-02-05-1819-devlog', to: '/' },
          { from: '/2026-02-06-0715-devlog', to: '/' },
          // Drupal Service Collectors → drupal-service-collectors-pattern
          { from: '/2026-02-05-1728-devlog', to: '/' },
          { from: '/2026-02-05-2354-devlog', to: '/' },
          { from: '/2026-02-06-0634-devlog', to: '/' },
          { from: '/2026-02-06-0724-devlog', to: '/' },
          { from: '/2026-02-07-1016-devlog', to: '/' },
          // Composer path repos
          { from: '/2026-02-05-1338-devlog', to: '/' },
          // FlowDrop
          { from: '/2026-02-05-flowdrop-node-sessions-review', to: '/' },
          // DDEV
          { from: '/2026-02-06-1030-devlog', to: '/' },
          // Old Codex/Opus slugs → kept system-cards post
          { from: '/2026-02-07-1036-devlog', to: '/' },
          { from: '/gpt-5-3-codex-agent-harness', to: '/' },
          { from: '/2026-02-06-1646-devlog', to: '/' },
          { from: '/2026-02-07-1206-devlog', to: '/' },
          { from: '/2026-02-07-1118-devlog', to: '/' },
          { from: '/codex-5-3-opus-4-6-code-generation', to: '/' },
          // Drupal Pivot / EU Sovereignty → drupal-european-digital-sovereignty
          { from: '/2026-02-05-drupal-pivot-ghent-review', to: '/' },
          { from: '/2026-02-07-1534-devlog', to: '/' },
          { from: '/2026-02-07-1447-devlog', to: '/' },
          // Drupal MCP tools
          { from: '/build-drupal-mcp-audit-server', to: '/' },
          { from: '/build-drupal-mcp-config-export', to: '/' },
          { from: '/build-drupal-mcp-node-info', to: '/' },
          { from: '/build-drupal-mcp-site-audit', to: '/' },
          // AI tools review
          { from: '/build-drupal-cms-2-ai-tools-review', to: '/' },
          // Old timestamp slugs → new descriptive slugs
          { from: '/2026-02-04-devlog', to: '/' },
          { from: '/devlog-pipeline-reading-queue', to: '/' },
          { from: '/2026-02-05-0414-devlog', to: '/' },
          { from: '/2026-02-05-0415-devlog', to: '/' },
          { from: '/2026-02-05-0418-devlog', to: '/' },
          { from: '/2026-02-05-0659-devlog', to: '/' },
          { from: '/2026-02-05-1249-devlog', to: '/' },
          { from: '/2026-02-07-1020-devlog', to: '/' },
          { from: '/uk-council-website-audit-playwright', to: '/' },
          { from: '/2026-02-07-1105-devlog', to: '/' },
          { from: '/2026-02-07-1720-devlog', to: '/' },
          { from: '/2026-02-07-1831-devlog', to: '/' },
          { from: '/2026-02-13-1943-devlog', to: '/' },
          { from: '/2026-02-14-0545-devlog', to: '/' },
          { from: '/2026-02-16-1937-devlog', to: '/' },
          { from: '/2026-02-17-0849-devlog', to: '/' },
          { from: '/2026-02-17-1139-devlog', to: '/' },
          { from: '/2026-02-18-0021-devlog', to: '/' },
          { from: '/2026-02-21-drupal-ai-governance-hype', to: '/' },
          // Deleted posts → blog index
          { from: '/2026-02-08-official-launch-autonomous-ai-agents', to: '/' },
          { from: '/build-status-dashboard', to: '/' },
          { from: '/2026-02-18-moltbook-operant-ai-agent-security-review', to: '/' },
          // Duplicate WP 7.0 Beta slug with date prefix → correct slug without date
          { from: '/2026-02-21-wordpress-7-0-beta-1-review', to: '/' },
          // Low-value posts deleted in the October 2026 rewrite
          { from: '/2026-03-05-wordpress-7-0-developer-impact-interactivity-dataviews-breadcrumbs-overlays', to: '/' },
          { from: '/2026-03-18-four-kitchens-cms-dashboard-patterns-drupal-wordpress-editorial-ux-review', to: '/' },
          { from: '/2026-02-05-flowdrop-agents-review', to: '/' },
          { from: '/2026-02-06-ai-in-drupal-cms-2-0-dayone-tools', to: '/' },
          { from: '/2026-02-06-ddev-podman-rootless-review', to: '/' },
          { from: '/2026-02-06-drupal-cms-recipe-system-ai-site-building-review', to: '/' },
          { from: '/2026-02-07-cloudflare-ddos-report-drupal', to: '/' },
          { from: '/2026-02-17-drupal-11-1-custom-entity-breaking-changes', to: '/' },
          { from: '/2026-02-08-wp-malware-sentinel-scanner', to: '/' },
          { from: '/2026-02-08-htmx-in-drupal-core', to: '/' },
          { from: '/2026-02-17-drupal-11-change-record-impact-map-10-4x-teams', to: '/' },
          { from: '/2026-02-17-wordpress-ai-search-optimization-playbook', to: '/' },
          { from: '/2026-02-19-unprotected-ai-agents-report', to: '/' },
          { from: '/2026-02-18-wp-7-compat-scanner-cli', to: '/' },
          { from: '/2026-02-20-add-custom-entries-to-wordpress-editor-preview-dropdown', to: '/' },
          { from: '/php-8-4-typeerror-argumentcounterror-playbook', to: '/' },
          { from: '/ddev-v1-25-modular-share-with-cloudflare', to: '/' },
          { from: '/stop-paying-for-crawl4ai-moltbot', to: '/' },
          { from: '/drupal-ai-searxng-privacy-first-search-playbook', to: '/' },
          { from: '/drupal-11-slick-carousel-jquery-gotcha', to: '/' },
          { from: '/2026-02-25-cloudflare-vinext-ai-refactor-patterns', to: '/' },
          { from: '/2026-02-25-node-24-14-25-7-upgrade-risk-matrix', to: '/' },
          { from: '/2026-02-24-wordpress-7-0-iframed-editor-migration-playbook', to: '/' },
          { from: '/2026-02-26-gemini-api-key-policy-review-agent-workflows', to: '/' },
          { from: '/wordpress-weekly-vuln-patch-pipeline', to: '/' },
          { from: '/2026-03-03-review-pantheon-content-publisher-quality-assistant', to: '/' },
          { from: '/2026-03-05-google-workspace-cli-is-real-agent-infrastructure-not-anothe', to: '/' },
          { from: '/drupal-sa-contrib-2026-011-019-triage', to: '/' },
          { from: '/2026-03-07-clinejection-incident-analysis-release-pipeline-hardening', to: '/' },
          { from: '/2026-03-08-cloudflare-endpoint-to-prompt-guardrails-drupal-wordpress', to: '/' },
          { from: '/2026-03-08-cisa-kev-march-2026-sla-exposure-triage-drupal-wordpress', to: '/' },
          { from: '/2026-03-08-github-security-lab-ai-vuln-scanning-framework-drupal-wordpress-ci', to: '/' },
          { from: '/2026-03-08-pantheon-sql-server-gen2-drupal-risk-review', to: '/' },
          { from: '/2026-03-08-ui-suite-display-builder-beta3-drupal-11-review', to: '/' },
          { from: '/2026-03-08-firefox-hardening-red-team-browser-security-baselines-cms-ai-tools', to: '/' },
          { from: '/2026-03-09-drupal-module-upgrader-revival-drupal-10-11-risk-boundaries', to: '/' },
          { from: '/2026-03-09-tutor-lms-pro-authentication-bypass-review', to: '/' },
          { from: '/2026-03-09-webmcp-drupal-user-forms-security-integration-review', to: '/' },
          { from: '/2026-03-14-pantheon-site-metrics-drupal-wordpress-review', to: '/' },
          { from: '/2026-03-10-real-time-collaboration-block-editor-plugin-developer-review', to: '/' },
          { from: '/drupal-12-migrate-drupal-core-removal-readiness-plan', to: '/' },
          { from: '/2026-03-15-drupal-navigation-default-admin-experience-review', to: '/' },
          { from: '/2026-03-15-simon-willison-agentic-engineering-guardrails-drupal-wordpress', to: '/' },
          { from: '/2026-03-17-codex-security-no-sast-report-ci-needs-drupal-wordpress', to: '/' },
          { from: '/2026-03-18-gitguardian-secrets-sprawl-guardrails-drupal-wordpress', to: '/' },
          { from: '/cloudflare-custom-regions-data-residency-drupal-wordpress', to: '/' },
          { from: '/2026-03-19-wordpress-7-0-connectors-api-plugin-headless-integrations', to: '/' },
          { from: '/build-drupal-claude-agent-sdk-runtime', to: '/' },
          { from: '/build-gemini-ollama-cli-bridge', to: '/' },
          { from: '/build-laravel-collection-has-many', to: '/' },
          { from: '/drupal-maintainer-shield', to: '/' },
          { from: '/build-mcp-web-setup', to: '/' },
          { from: '/drupal-12-database-api-audit', to: '/' },
          { from: '/drupal-canvas-full-html-rollout-guide', to: '/' },
          { from: '/wp-6-9-1-rc1-compatibility-checklist', to: '/' },
          { from: '/drupal-multilingual-html-email-stack', to: '/' },
          { from: '/drupal-migration-mapping-validator', to: '/' },
          { from: '/pantheon-traffic-forensics-workflow', to: '/' },
          { from: '/2026-02-05-composer-path-repos-drupal', to: '/' },
          { from: '/wordpress-mcp-adapter-demo', to: '/' },
          { from: '/2026-02-06-centrarro-b2b-portal-review', to: '/' },
          { from: '/2026-02-06-netomi-agentic-lessons-playbook', to: '/' },
          { from: '/drupal-service-collectors-pattern', to: '/' },
          { from: '/drupal-core-jsonapi-array-dumper-optimization', to: '/' },
          { from: '/drupal-european-digital-sovereignty', to: '/' },
          { from: '/opus-4-6-codex-5-3-system-cards', to: '/' },
          { from: '/ai-quality-war-wordpress-cloudflare', to: '/' },
          { from: '/2026-02-07-drupal-ai-hackathon-review', to: '/' },
          { from: '/2026-02-07-pydantic-monty-wasm', to: '/' },
          { from: '/2026-02-07-wp-qsm-sql-injection-audit', to: '/' },
          { from: '/2026-02-08-drupal-12-readiness-dashboard', to: '/' },
          { from: '/drupal-sa11y-local-accessibility', to: '/' },
          { from: '/drupal-commerce-3-3-upgrade-wsod', to: '/' },
          { from: '/pathauto-d10-d11-delete-action-upgrade', to: '/' },
          { from: '/2026-02-16-drupal-gitlab-issue-migration-workflow', to: '/' },
          { from: '/security-advisories-nl-audit', to: '/' },
          { from: '/pantheon-deploy-gate-safety', to: '/' },
          { from: '/2026-02-17-wowrevenue-authz-guard', to: '/' },
          { from: '/drupal-ai-openai-planner-fallback', to: '/' },
          { from: '/2026-02-21-dries-buytaert-introduces-drupal-digests', to: '/' },
          { from: '/2026-02-21-future-of-ddev-stas-zhuk', to: '/' },
          { from: '/wordpress-7-0-beta-1-review', to: '/' },
          { from: '/2026-02-24-drupal-cms-community-feedback-survey-review', to: '/' },
          { from: '/drupal-development-signal-workflow', to: '/' },
          { from: '/2026-02-27-0807-devlog', to: '/' },
          { from: '/2026-02-27-wordpress-7-0-beta-2-compatibility-risks-checklist', to: '/' },
          { from: '/2026-02-28-drupal-cache-tag-analysis-root-cause-review', to: '/' },
          { from: '/2026-02-28-drupal-contrib-code-search-tool-review', to: '/' },
          { from: '/2026-02-28-graphql-drupal-5-beta2-cacheability-node-preview-review', to: '/' },
          { from: '/2026-02-28-passkeys-agents-drupal-ai-and-infra-reality-checks', to: '/' },
          { from: '/2026-03-03-cheap-models-leaky-secrets-and-php-s-governance-debt-march-2', to: '/' },
          { from: '/2026-03-04-from-model-hype-to-patch-discipline-ai-releases-runtime-shif', to: '/' },
          { from: '/2026-03-05-ai-control-planes-vs-marketing-noise-shipping-through-search', to: '/' },
          { from: '/2026-03-05-claude-import-memory-is-just-a-prompt-not-a-migration', to: '/' },
          { from: '/2026-03-06-from-patch-releases-to-attack-telemetry-what-actually-moved', to: '/' },
          { from: '/2026-03-07-ai-subsidies-runtime-reality-checks-and-cms-release-pressure', to: '/' },
          { from: '/2026-03-07-codex-security-research-preview-wordpress-drupal-dev-workflows', to: '/' },
          { from: '/2026-03-08-codex-open-source-practical-assessment-wordpress-drupal-maintainers', to: '/' },
          { from: '/2026-03-09-drupal-and-wordpress-devlog-cache-tags-redirect-scale-and-sa', to: '/' },
          { from: '/2026-03-10-drupal-and-wordpress-ai-integrations-responses-api-routing-a', to: '/' },
          { from: '/2026-03-11-drupal-oauth-scope-debt-wordpress-block-states-and-the-secur', to: '/' },
          { from: '/2026-03-12-drupal-wordpress-ops-reality-check-github-availability-ai-mt', to: '/' },
          { from: '/2026-03-12-my-wordpress-browser-native-wordpress-plugin-workflows', to: '/' },
          { from: '/2026-03-14-drupal-and-wordpress-devlog-contrib-trust-browser-kevs-gpl-w', to: '/' },
          { from: '/2026-03-18-drupal-and-wordpress-headless-ops-react2shell-npm-supply-cha', to: '/' },
          { from: '/build-ddev-mcp-playwright-addon', to: '/' },
          { from: '/build-drupal-ai-module-generator-deepseek-mcp', to: '/' },
          { from: '/build-drupal-ai-views-agent', to: '/' },
          { from: '/build-drupal-content-audit', to: '/' },
          { from: '/build-drupal-gpt53-codex-maintenance-poc', to: '/' },
          { from: '/build-drupal-mcp-toolkit', to: '/' },
          { from: '/wp-google-preferred-source-tool', to: '/' },
          // Posts removed in the October 2026 content audit (unverifiable claims)
          { from: '/2026-02-08-drupal-core-operator-precedence-fix', to: '/' },
          { from: '/accelerating-solr-search-enterprise-finance', to: '/' },
          { from: '/automating-cloudflare-cache-purging-enterprise-cms', to: '/' },
          { from: '/custom-parameters-headless-booking-engines', to: '/' },
          { from: '/decoupled-hospitality-architecture-scale', to: '/' },
          { from: '/escaping-the-redirect-loop-local-sandboxing', to: '/' },
          { from: '/mastering-jsonapi-decoupled-travel-platforms', to: '/' },
          { from: '/modernizing-workflows-pre-commit-hooks-drupal', to: '/' },
          { from: '/securing-drupal-architectures-scale', to: '/' },
          { from: '/strict-phpstan-baselines-enterprise-codebases', to: '/' },
          { from: '/the-ticket-agent-automating-jira-to-local-environments', to: '/' },
          { from: '/upstream-dependency-management-drupal-multisites', to: '/' },
          { from: '/zero-downtime-autonomous-deployments', to: '/' },
          { from: '/build-cpf', to: '/' },
        ],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-5ZHGQKTFLT',
        },
        // Blog-only site. The docs plugin stays enabled because the local
        // search theme imports docs plugin hooks; its only page is unlisted.
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/victorstack-ai/agent-blog/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'throw',
          onInlineAuthors: 'throw',
          onUntruncatedBlogPosts: 'ignore',
          postsPerPage: 20,
          blogSidebarCount: 'ALL',
          sortPosts: 'descending',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // clientModules allows us to inject global CSS or JS modules into the bundle
  clientModules: [
    require.resolve('./src/client/gtm-events.ts'),
  ],
  themeConfig: {
    // theme-color per scheme (iOS/Android status bar) + viewport-fit + safe-area
    headTags: [
      /* Fallback for Android WebView: many ignore media on theme-color, so set default first */
      {
        tagName: 'meta',
        attributes: {
          name: 'theme-color',
          content: '#0f172a',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'theme-color',
          content: '#0f172a',
          media: '(prefers-color-scheme: dark)',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'theme-color',
          content: '#ffffff',
          media: '(prefers-color-scheme: light)',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
      },
    ],
    metadata: [
      { name: 'description', content: 'Engineering notes by Victor Jimenez, Senior Product Engineer with 13+ years of full-stack web work: React, Next.js, TypeScript, PHP, Node and Python, integrations, release engineering, performance, security and accessibility.' },
      { name: 'keywords', content: 'Victor Jimenez, Senior Product Engineer, full-stack web development, React, Next.js, TypeScript, PHP, Node.js, Python, software architecture, API integrations, payments, OAuth, SSO, CI/CD, release engineering, web performance, technical SEO, web security, accessibility, AI-assisted engineering, Drupal, WordPress' },
      // SEO & Social
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'author', content: 'Victor Jimenez' },
      { property: 'og:site_name', content: 'VictorStack' },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: 'Engineering notes by Victor Jimenez, Senior Product Engineer: full-stack web, integrations, release engineering, performance and security.' },
      // GEO targeting
      { name: 'geo.region', content: 'CO' },
      { name: 'geo.placename', content: 'Bogotá' },
      // Prevent in-app browsers (e.g. LinkedIn) from applying Force Dark or wrong
      // color inversions — we handle light/dark ourselves.
      { name: 'color-scheme', content: 'dark light' },
      /* Android: prevents WebView Force Dark from re-styling the page and breaking contrast */
      // Absolute URLs so LinkedIn/Twitter/Facebook in-app browsers get valid previews
    ],
    // Replace with your project's social card (fallback; og:image above is absolute)
    image: 'img/vs-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'VictorStack',
      logo: {
        alt: 'VictorStack',
        src: 'img/vs-logo.png',
      },
      items: [
        { to: '/', label: 'Blog', position: 'left' },
        { to: 'https://victorjimenezdev.github.io/', label: 'Portfolio', position: 'right' },
        { href: 'https://victorstack-ai.github.io/agent-blog/rss.xml', label: 'RSS', position: 'right' },
        { href: 'https://github.com/victorstack-ai', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Connect',
          items: [
            {
              label: 'Portfolio',
              href: 'https://victorjimenezdev.github.io/',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/victor-j-8268a2266/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/victorjimenezdev',
            },
            {
              label: 'Email',
              href: 'mailto:victorcamilo.jimenezv@gmail.com',
            },
          ],
        },
        {
          title: 'Blog',
          items: [
            {
              label: 'RSS',
              href: 'https://victorstack-ai.github.io/agent-blog/rss.xml',
            },
            {
              label: 'Source on GitHub',
              href: 'https://github.com/victorstack-ai/agent-blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Victor Jimenez. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
