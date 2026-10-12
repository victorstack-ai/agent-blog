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
          { from: '/2026-03-03-quality-assistant-now-available-in-content-publisher', to: '/2026-03-03-review-pantheon-content-publisher-quality-assistant/' },
          // Feb 28 duplicate roundup posts — both had wrong generic title + RSS-derived slugs
          { from: '/2026-02-28-mike-herchel-s-blog-buy-your-tickets-now-to-the-drupalcon-ga', to: '/2026-02-28-passkeys-agents-drupal-ai-and-infra-reality-checks/' },
          { from: '/2026-02-28-please-please-please-stop-using-passkeys-for-encrypting-user', to: '/2026-02-28-passkeys-agents-drupal-ai-and-infra-reality-checks/' },
          // WordPress MCP Adapter → wordpress-mcp-adapter-demo
          { from: '/2026-02-05-0645-devlog', to: '/wordpress-mcp-adapter-demo/' },
          { from: '/2026-02-05-0806-devlog', to: '/wordpress-mcp-adapter-demo/' },
          { from: '/2026-02-05-1220-devlog', to: '/wordpress-mcp-adapter-demo/' },
          { from: '/2026-02-05-1314-devlog', to: '/wordpress-mcp-adapter-demo/' },
          { from: '/2026-02-05-1643-devlog', to: '/wordpress-mcp-adapter-demo/' },
          { from: '/2026-02-05-1819-devlog', to: '/wordpress-mcp-adapter-demo/' },
          { from: '/2026-02-06-0715-devlog', to: '/wordpress-mcp-adapter-demo/' },
          // Drupal Service Collectors → drupal-service-collectors-pattern
          { from: '/2026-02-05-1728-devlog', to: '/drupal-service-collectors-pattern/' },
          { from: '/2026-02-05-2354-devlog', to: '/drupal-service-collectors-pattern/' },
          { from: '/2026-02-06-0634-devlog', to: '/drupal-service-collectors-pattern/' },
          { from: '/2026-02-06-0724-devlog', to: '/drupal-service-collectors-pattern/' },
          { from: '/2026-02-07-1016-devlog', to: '/drupal-service-collectors-pattern/' },
          // Composer path repos
          { from: '/2026-02-05-1338-devlog', to: '/2026-02-05-composer-path-repos-drupal/' },
          // FlowDrop
          { from: '/2026-02-05-flowdrop-node-sessions-review', to: '/2026-02-05-flowdrop-agents-review/' },
          // DDEV
          { from: '/2026-02-06-1030-devlog', to: '/2026-02-06-ddev-podman-rootless-review/' },
          // Old Codex/Opus slugs → kept system-cards post
          { from: '/2026-02-07-1036-devlog', to: '/opus-4-6-codex-5-3-system-cards/' },
          { from: '/gpt-5-3-codex-agent-harness', to: '/opus-4-6-codex-5-3-system-cards/' },
          { from: '/2026-02-06-1646-devlog', to: '/opus-4-6-codex-5-3-system-cards/' },
          { from: '/2026-02-07-1206-devlog', to: '/opus-4-6-codex-5-3-system-cards/' },
          { from: '/2026-02-07-1118-devlog', to: '/opus-4-6-codex-5-3-system-cards/' },
          { from: '/codex-5-3-opus-4-6-code-generation', to: '/opus-4-6-codex-5-3-system-cards/' },
          // Drupal Pivot / EU Sovereignty → drupal-european-digital-sovereignty
          { from: '/2026-02-05-drupal-pivot-ghent-review', to: '/drupal-european-digital-sovereignty/' },
          { from: '/2026-02-07-1534-devlog', to: '/drupal-european-digital-sovereignty/' },
          { from: '/2026-02-07-1447-devlog', to: '/drupal-european-digital-sovereignty/' },
          // Drupal MCP tools
          { from: '/build-drupal-mcp-audit-server', to: '/build-drupal-mcp-toolkit/' },
          { from: '/build-drupal-mcp-config-export', to: '/build-drupal-mcp-toolkit/' },
          { from: '/build-drupal-mcp-node-info', to: '/build-drupal-mcp-toolkit/' },
          { from: '/build-drupal-mcp-site-audit', to: '/build-drupal-mcp-toolkit/' },
          // AI tools review
          { from: '/build-drupal-cms-2-ai-tools-review', to: '/2026-02-06-ai-in-drupal-cms-2-0-dayone-tools/' },
          // Old timestamp slugs → new descriptive slugs
          { from: '/2026-02-04-devlog', to: '/' },
          { from: '/devlog-pipeline-reading-queue', to: '/' },
          { from: '/2026-02-05-0414-devlog', to: '/drupal-canvas-full-html-rollout-guide/' },
          { from: '/2026-02-05-0415-devlog', to: '/wp-6-9-1-rc1-compatibility-checklist/' },
          { from: '/2026-02-05-0418-devlog', to: '/drupal-multilingual-html-email-stack/' },
          { from: '/2026-02-05-0659-devlog', to: '/drupal-migration-mapping-validator/' },
          { from: '/2026-02-05-1249-devlog', to: '/pantheon-traffic-forensics-workflow/' },
          { from: '/2026-02-07-1020-devlog', to: '/' },
          { from: '/uk-council-website-audit-playwright', to: '/' },
          { from: '/2026-02-07-1105-devlog', to: '/drupal-core-jsonapi-array-dumper-optimization/' },
          { from: '/2026-02-07-1720-devlog', to: '/opus-4-6-codex-5-3-system-cards/' },
          { from: '/2026-02-07-1831-devlog', to: '/ai-quality-war-wordpress-cloudflare/' },
          { from: '/2026-02-13-1943-devlog', to: '/drupal-sa11y-local-accessibility/' },
          { from: '/2026-02-14-0545-devlog', to: '/drupal-commerce-3-3-upgrade-wsod/' },
          { from: '/2026-02-16-1937-devlog', to: '/pathauto-d10-d11-delete-action-upgrade/' },
          { from: '/2026-02-17-0849-devlog', to: '/security-advisories-nl-audit/' },
          { from: '/2026-02-17-1139-devlog', to: '/pantheon-deploy-gate-safety/' },
          { from: '/2026-02-18-0021-devlog', to: '/drupal-ai-openai-planner-fallback/' },
          { from: '/2026-02-21-drupal-ai-governance-hype', to: '/drupal-ai-openai-planner-fallback/' },
          // Deleted posts → blog index
          { from: '/2026-02-08-official-launch-autonomous-ai-agents', to: '/' },
          { from: '/build-status-dashboard', to: '/' },
          { from: '/2026-02-18-moltbook-operant-ai-agent-security-review', to: '/2026-02-19-unprotected-ai-agents-report/' },
          // Duplicate WP 7.0 Beta slug with date prefix → correct slug without date
          { from: '/2026-02-21-wordpress-7-0-beta-1-review', to: '/wordpress-7-0-beta-1-review/' },
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
