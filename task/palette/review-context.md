# Cover palette: review context

## Stable requirements
- Change only colors. The blog palette must match the post cover images.
- Keep the dark default site: navy background, cream body text and headings, orange accent links.
- Keep layout, fonts, assets, URLs and analytics.
- Owned source paths: `src/css/custom.css` and `docusaurus.config.ts`.
- AC1 to AC5 are as stated in `palette-brief.md`.

## Source facts (sampled with ImageMagick from static/img, 1672x941 JPGs)
| Image | sha256 (first 16) | Sampled colors |
| --- | --- | --- |
| harness-engineering.jpg | 41d710e383e1dd9b | paper #F6F2E7 (crop average), navy desk #1B304B, deep navy #0D192D, shirt orange #E97B28 (crop average) |
| loop-engineering.jpg | 53be0df344e5c3ab | navy #192D43, deep #172333, tan #E6D0B2, orange-tan #C69161 |
| graph-engineering.jpg | aba6e9c14a90c635 | paper #F7EFE3, slate #3A455A, rust #AC7157 |
| how-i-combine-...jpg | da60cdba5bb3e0c6 | navy #132C4A, deep #0F1D31, orange #E5904C (quantized blend) |

I also looked at harness-engineering.jpg directly: cream paper, navy ink and a vivid orange shirt.

## Intended palette
Source colors: `--vs-navy-deep #0d192d`, `--vs-navy-ink #1b304b`, `--vs-cream-paper #f6f2e7`, `--vs-orange #e97b28`.

These shades are inferred, not sampled:
- Dark mode: surface #13253d, code background #0a1426, border #2a4262, muted text #d9cfbd, subtle text #a9b6c9, accent hover and focus ring #f4a565.
- Primary scale: #a45110 / #c86214 / #dc6c17 / **#e97b28** / #ec8b43 / #ee9550 / #f4b47f.
- Light fallback: cream background, navy text, accent #a4500f. Its primary scale is #73380b to #d56813.
- Code tokens: comments #8c9db5, keywords and tags #f4a565, strings #e6d0b2, functions #f4b47f, numbers #9db8da (a cool steel tint from the navy family), deleted #ff8a80.

Contrast, computed by hand from WCAG relative luminance:
- Cream #f6f2e7 on #0d192d: about 16:1.
- Orange #e97b28 on #0d192d: about 6.1:1 (AA).
- Navy #0d192d on orange buttons: about 6.1:1.
- Light-mode accent #a4500f on cream: about 4.9:1 (AA).
- Comment color #8c9db5 on #0a1426: about 6.6:1.

## Coverage inventory
| Surface | Colors come from |
| --- | --- |
| Body, headings | --ifm-* tokens |
| Links, hover | --ifm-link-* tokens |
| Navbar glass | --premium-glass-bg |
| Mobile sidebar | .navbar-sidebar |
| Search | --search-local-* and the --ifm-navbar-search-* tokens |
| Footer | the .footer--dark variables, which Infima otherwise sets to #303846 |
| Pagination | sublabel color |
| Tags and archive | primary color |
| Tables | head, stripe and border colors |
| Blockquote | border, text and surface |
| Inline code | --ifm-code-* |
| Code blocks | the custom Prism theme `coverPrismDark` |
| Mermaid diagrams | 'base' theme plus themeVariables (flow and sequence) |
| Selection, focus-visible | --vs-accent, --vs-focus-ring |
| theme-color meta | navy deep for both schemes (not emitted; see gaps) |

## Inferred choices
- The h1 gradient stays, recolored from cream to light orange. The light fallback runs from navy to dark orange.
- I removed the forced `#ffffff` text overrides. Text now uses the cream tokens, with an explicit color on html and body. The in-app WebView intent is kept: there is still no gray-on-blue.
- I used a theme-color of navy for both schemes because the site always renders dark.
