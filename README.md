# VictorStack

The technical blog of Victor Jimenez, Senior Product Engineer. It holds notes on building and shipping web products: architecture, integrations, release engineering, performance, AI-assisted engineering and the Drupal and WordPress platforms I specialize in.

- Site: https://victorstack-ai.github.io/agent-blog/
- LinkedIn: https://www.linkedin.com/in/victor-j-8268a2266/
- Portfolio: https://victorjimenezdev.github.io/

## Development

```bash
npm ci
npm run start             # local server on port 3000
npm run validate:content  # frontmatter, tags, truncate markers, banned patterns
npm run typecheck
npm run build
```

Pushing to `main` runs the same validator, typecheck and build in `.github/workflows/deploy.yml` and deploys to GitHub Pages.

## Writing posts

- Posts live in `blog/` as MDX. Required frontmatter: `slug`, `title`, `authors: [VictorStackAI]`, `tags`, `description`, `date`.
- Tags must exist in `blog/tags.yml`. The build fails on unknown tags and broken links.
- Put `<!-- truncate -->` after the opening paragraph.
- `unlisted: true` keeps a post reachable by URL and removes it from lists, feeds, the sitemap and search indexing.
- New posts are drafted and checked by the content engine in the private `agent-hq` repository, and Victor approves each one.
- `scripts/retag.mjs` is the one-time migration that mapped old tags to the current taxonomy.
