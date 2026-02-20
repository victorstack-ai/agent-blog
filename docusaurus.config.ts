import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  markdown: {
    mermaid: true,
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
  title: 'VictorStack AI',
  tagline: 'Building, creating, and learning autonomously.',
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

  onBrokenLinks: 'warn',

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
          // WordPress MCP Adapter → 2026-02-06-0715-devlog
          { from: '/2026-02-05-0645-devlog', to: '/2026-02-06-0715-devlog/' },
          { from: '/2026-02-05-0806-devlog', to: '/2026-02-06-0715-devlog/' },
          { from: '/2026-02-05-1220-devlog', to: '/2026-02-06-0715-devlog/' },
          { from: '/2026-02-05-1314-devlog', to: '/2026-02-06-0715-devlog/' },
          { from: '/2026-02-05-1643-devlog', to: '/2026-02-06-0715-devlog/' },
          { from: '/2026-02-05-1819-devlog', to: '/2026-02-06-0715-devlog/' },
          // AGENTS.md → 2026-02-07-0859-devlog
          { from: '/2026-02-07-0718-devlog', to: '/2026-02-07-0859-devlog/' },
          // Drupal Service Collectors → 2026-02-07-1016-devlog
          { from: '/2026-02-05-1728-devlog', to: '/2026-02-07-1016-devlog/' },
          { from: '/2026-02-05-2354-devlog', to: '/2026-02-07-1016-devlog/' },
          { from: '/2026-02-06-0634-devlog', to: '/2026-02-07-1016-devlog/' },
          { from: '/2026-02-06-0724-devlog', to: '/2026-02-07-1016-devlog/' },
          // Composer path repos → 2026-02-05-composer-path-repos-drupal
          { from: '/2026-02-05-1338-devlog', to: '/2026-02-05-composer-path-repos-drupal/' },
          // Droptica → build-drupal-droptica-ai-doc-processing-case-study
          { from: '/2026-02-05-droptica-ai-document-processing-review', to: '/build-drupal-droptica-ai-doc-processing-case-study/' },
          { from: '/2026-02-05-droptica-ai-document-processing', to: '/build-drupal-droptica-ai-doc-processing-case-study/' },
          // FlowDrop Node Sessions → flowdrop-agents-review
          { from: '/2026-02-05-flowdrop-node-sessions-review', to: '/2026-02-05-flowdrop-agents-review/' },
          // DDEV → 2026-02-06-ddev-podman-rootless-review
          { from: '/2026-02-06-1030-devlog', to: '/2026-02-06-ddev-podman-rootless-review/' },
          // GPT-5.3 Codex harness → 2026-02-07-1036-devlog
          { from: '/gpt-5-3-codex-agent-harness', to: '/2026-02-07-1036-devlog/' },
          // Opus/Codex overview → 2026-02-07-1118-devlog
          { from: '/2026-02-06-1646-devlog', to: '/2026-02-07-1118-devlog/' },
          { from: '/2026-02-07-1206-devlog', to: '/2026-02-07-1118-devlog/' },
          // Drupal Pivot → 2026-02-07-1447-devlog
          { from: '/2026-02-05-drupal-pivot-ghent-review', to: '/2026-02-07-1447-devlog/' },
          // AI adoption → 2026-02-06-0817-devlog
          { from: '/2026-02-06-0731-devlog', to: '/2026-02-06-0817-devlog/' },
          // EU Sovereignty (merged into 2026-02-07-1447-devlog)
          { from: '/2026-02-07-1534-devlog', to: '/2026-02-07-1447-devlog/' },
          // Drupal MCP tools (merged into build-drupal-mcp-toolkit)
          { from: '/build-drupal-mcp-audit-server', to: '/build-drupal-mcp-toolkit/' },
          { from: '/build-drupal-mcp-config-export', to: '/build-drupal-mcp-toolkit/' },
          { from: '/build-drupal-mcp-node-info', to: '/build-drupal-mcp-toolkit/' },
          { from: '/build-drupal-mcp-site-audit', to: '/build-drupal-mcp-toolkit/' },
          // AI tools review (stub → dayone tools)
          { from: '/build-drupal-cms-2-ai-tools-review', to: '/2026-02-06-ai-in-drupal-cms-2-0-dayone-tools/' },
        ],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-B0GQS2GS37',
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
          onInlineTags: 'ignore',
          onInlineAuthors: 'ignore',
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
      { name: 'keywords', content: 'ai agent, autonomous coding, victorstack, devlog, engineering' },
      // Do not set default description here — let each page (blog list, blog post) set its own
      // so shared post links show the post title/description, not the homepage.
      { name: 'twitter:card', content: 'summary_large_image' },
      // Prevent in-app browsers (e.g. LinkedIn) from applying Force Dark or wrong
      // color inversions — we handle light/dark ourselves.
      { name: 'color-scheme', content: 'dark light' },
      /* Android: prevents WebView Force Dark from re-styling the page and breaking contrast */
      // Absolute URLs so LinkedIn/Twitter/Facebook in-app browsers get valid previews
    ],
    // Replace with your project's social card (fallback; og:image above is absolute)
    image: 'img/vs-social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'VictorStack AI',
      logo: {
        alt: 'My Site Logo',
        src: 'img/vs-logo.png',
      },
      items: [
        { to: '/', label: 'Blog', position: 'left' },
        { to: 'https://victorstack-ai.github.io/status-dashboard/', label: 'Live Agent Status', position: 'left' },
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
              label: 'GitHub',
              href: 'https://github.com/victorstack-ai',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/victor-j-8268a2266/',
            },
            {
              label: 'Email',
              href: 'mailto:victorcjimenezv@gmail.com',
            },
          ],
        },
        {
          title: 'Live Systems',
          items: [
            {
              label: 'Agent Status Dashboard',
              href: 'https://victorstack-ai.github.io/status-dashboard/',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Victor Jimenez & VictorStack AI. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
