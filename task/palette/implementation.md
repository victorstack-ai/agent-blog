# Cover palette: implementation

Base: 68a0f918. Originals: `task/palette/orig/`.
- Original hashes: custom.css b01236ca..., config afa7a537...
- New hashes: custom.css c2d43f58101b0110444e9121e44a7c2e1617f25c8f284ca52f7a14eaf987cc4c, docusaurus.config.ts c97b9528aae30dc2480ffa429f954cbf3a3a1bb2c45ca0570ffdf368d3ae3b6b.

## Edits
`src/css/custom.css`:
- I replaced the duplicated blue :root and dark blocks with one set of semantic `--vs-*` tokens. They map to the Infima, search-local and footer variables, and the full primary scale is filled in.
- Added a light fallback override.
- Code, selection, focus-visible, blockquote, footer, sidebar and Mermaid edge labels now read from the tokens.
- I removed the forced `#fff` and blue rgba rules and the redundant navbar and footer border rules.
- Recolored the premium navbar, card, button and h1 gradient. Their layout rules did not change.

`docusaurus.config.ts`:
- Added the `coverPalette` constant and the `coverPrismDark` Prism theme, which replaces dracula.
- The Mermaid dark theme is now 'base' with themeVariables.
- The theme-color values are now coverPalette.navyDeep.

## Checks
- `npm ci`: pass.
- `npm run validate:content`, `npm run typecheck`, `npm run build`: pass. A second typecheck and build after the theme-color edit also pass.
- Server: `npx docusaurus serve --port 3917` at http://localhost:3917/agent-blog/ (left running).
- Playwright overflow check: 0 overflow on 5 routes at 8 widths. The routes are list, the how-i-combine post, the sequence-diagram post, tags and archive. The widths are 320, 375, 430, 600, 768, 1024, 1440 and 2560.
- Screenshots are in `task/palette/evidence/`. I inspected these: post-1440, mermaid-flow, mermaid-sequence, search-1440, mobile-menu-375.
- Computed colors from the browser:

| Element | Computed color |
| --- | --- |
| body background | rgb(13,25,45) |
| text and h2 | rgb(246,242,231) |
| links | rgb(233,123,40) |
| footer background | rgb(13,25,45) |
| footer links | rgb(217,207,189) |
| Mermaid node fill / stroke | rgb(27,48,75) / rgb(233,123,40) |
| keyboard focus outline | solid 2px rgb(244,165,101) |
| search menu | rgb(19,37,61) |
| mobile sidebar | rgb(13,25,45) |

This is not schema-v2 evidence. The root must reconcile the evidence manifest.

## Gaps
1. Existing defect: `headTags` sits inside `themeConfig`, so Docusaurus never emits the theme-color, apple status-bar or viewport-fit metas. This was already true at the base commit; the built index.html has none of them. The fix is to move `headTags` to the top level of the config. Before that, check for duplicates against the default viewport meta Docusaurus emits.
2. The mobile sidebar "Back to main menu" bar still uses the Infima emphasis gray. A token such as `--ifm-menu-color-background-active` or `.navbar-sidebar__back` could carry the surface color instead.
3. I did not inspect the remaining screenshots one by one, did not render the light fallback, and did not take hover-state screenshots.
4. I did not capture the code-block screenshot: the how-i-combine post has no `pre` element.
