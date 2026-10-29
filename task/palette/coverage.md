# Palette coverage

The user supplied four cover illustrations as a color reference and then explicitly requested the background change. The source supplies a palette, not web page geometry, fonts, responsive layouts, or interactions. The existing Docusaurus layout and behavior are the basis for those inferences. The original dark-default inference is superseded by the user's cream-background steering.

All four 1672x941 covers were inspected: harness-engineering.jpg, loop-engineering.jpg, graph-engineering.jpg and how-i-combine-harness-loop-graph-engineering.jpg. Source hashes and exact representative pixel locations are in source-samples.json. The four colors are cream #f6f2e7, navy #1b304b, deep navy #0d1a2d and orange #e87b28. The one-channel changes from the first averaged shades are deliberate exact source samples.

The source and implementation comparison images are diagnostic swatches. The source swatches render the measured source pixel colors. The implementation swatches render independently read computed colors from body background, body text, footer background and article-link decoration. The overlay compares palette values only. It does not claim that a web page matches an illustration's composition. The complete page screenshots separately prove the inferred layout and readable color application.

| Scope | Source property | Implementation and verification |
| --- | --- | --- |
| Canvas | Cream source pixel | body background, list/detail/tags/archive, nine widths |
| Reading text | Deep navy source pixel | body and headings; keyboard and content stress |
| Navigation and footer | Navy source pixel | text and footer surface; mobile menu open/close |
| Accents | Orange source pixel | underlines, buttons, focus on navy, diagram borders |
| Search | Same palette | results, selected result, no results, escape |
| Code | Navy and cream | actual pre block and syntax tokens |
| Diagrams | Same palette | four flow/sequence diagrams, edge text, native horizontal scrolling |
| Responsive inference | Existing Infima 996px breakpoint | 320/375/430/600/768/1024/1440/1672/2560 captures; 995/996/997 measurements |
| Browser inference | Existing CSS features | Chromium, Firefox and WebKit |
| Lifecycle and content | Existing blog and search model | load, resize, scroll, preference restore, short/long/empty/localized/repeated fixtures, zoom/reflow, short/tall, portrait/landscape, keyboard, no JS, navigation restore |

Brand image assets, platform logos and article content remain original. Their pixels are not template color tokens. No content, asset, URL, analytics, font or layout change is requested or included.

No new motion is designed or implemented. Existing hover transitions are retained. Normal and reduced-motion preferences are exercised for visible and readable content. There is no source motion choreography to reproduce.

AC-1: Match the cover palette including the cream background. AC-2: Apply it across shared templates, code and diagrams. AC-3: Preserve readable text, responsive layout and interactions. AC-4: Pass content validation, typecheck and build. AC-5: Verify the installed theme on the running site and after publication. The local gate covers the first four and the local part of AC-5; live verification remains pending until release.
