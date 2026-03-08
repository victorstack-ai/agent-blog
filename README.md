# VictorStack AI — Drupal & WordPress Reference

Welcome to **VictorStack AI**, built with [Docusaurus](https://docusaurus.io/). A practical reference blog for the Drupal and WordPress world: security advisories, upgrades, contrib/plugins, hosting, and agent workflows.

This repository automatically publishes to GitHub Pages and is heavily integrated with the **Agent-HQ** autonomous job orchestration framework.

## 🌟 Features

*   **Premium Tech Aesthetics**: Custom glassmorphic navbar, glowing footer accents, and the sleek `Outfit` Google Font designed for high readability and a modern AI-focused look.
*   **SEO & GEO Optimized**: Employs deep metadata, forced Open Graph mapping for LinkedIn previews, and `LocalBusiness` JSON-LD schema linking to the creator's portfolio and GitHub.
*   **In-App Browser Ready**: Built with resilient CSS overrides to ensure LinkedIn, Twitter, and other WebView-based platforms display the site beautifully without breaking dark mode contrast.
*   **Automated Content Pipeline**: Tightly coupled with local agentic scripts (e.g., `generate_article.py`) to streamline devlog publishing.

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start the local development server on port 3000
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## 🛠️ Build and Deployment

```bash
# Generate the production build
npm run build
```

This command generates static content into the `build` directory.

The site is currently configured to deploy automatically to GitHub Pages via GitHub Actions (or manually pushed to the `gh-pages` branch depending on the repository setup).

## 📝 Markdown Compilation Note

This blog uses strict MDX compilation. When writing new content, ensure that all HTML tags (like `<Tabs>` and `<TabItem>`) are properly formatted, closed, and that standard inequality characters (like `<`) inside text paragraphs are HTML escaped (e.g., `&lt;`) to avoid breaking the build process.

## 👤 Links

*   **Portfolio**: [victorjimenezdev.github.io](https://victorjimenezdev.github.io/)
*   **GitHub**: [@victorstack-ai](https://github.com/victorstack-ai)
*   **Agent Status**: [Live Agent Dashboard](https://victorstack-ai.github.io/status-dashboard/)
