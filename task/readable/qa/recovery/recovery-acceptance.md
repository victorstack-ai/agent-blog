# Independent Browser Acceptance Recovery Report

- **Verdict**: `PASS`
- **Task**: `COPY/PROFILE task local browser acceptance recovery`
- **Tool / Model**: `AGY Gemini 3.8 Flash (Medium)`
- **Target URL**: `http://127.0.0.1:3918/agent-blog/`
- **Source ID**: `ad61113d60e7f105ca85d1e66906776e137ed61df6565fec590f5eb5520c8ad7`
- **Original Base**: `12e28ad0858205a7ac5ee68a0be2a9dbcc9146a5`
- **HQ Commit**: `dcf12ec`
- **Single Delta**: `One verified 404 reference URL updated to official 200 GitGuardian docs; zero UI/CSS/component changes`

## 1. 62-Case Route Metrics Verification

- Total checks: 62 (31 unique articles across 375px and 1440px viewports)
- HTTP 200 responses: All 62/62 PASS
- Title matches: All 62/62 PASS
- Horizontal document overflow: None (all 62/62 PASS)
- Console errors: None (0 errors)
- Bad application responses: None (0 errors)
- Mermaid diagrams rendered: 47 SVGs at 375px, 47 SVGs at 1440px (total 94 SVGs rendered, 100% of expected 94)
- Open Graph Image status: 24 entries serve global default OG image (`https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png`) matching public baseline on main `12e28ad0`. Honestly classified as pre-existing site behavior, not a regression.

## 2. Screenshot Provenance and Hashes

| File | Dimensions | Size | SHA256 |
|---|---|---|---|
| `agentic-quadrant-chart.png` | 1440x900 | 147141 B | `f07880eb0eea399080f2e91b16d50014f1093098a7fab8c14899e3fa1fd6a2ac` |
| `combined-flow-sequence-scroll.png` | 1440x900 | 178158 B | `173e7fd51bacd02f848ff6e0592e316de6ab989cd6cc6129f38efa4941134e9b` |
| `combined-width-1024.png` | 1024x900 | 219760 B | `14772b8250db7975195c8583b6cf8fb9cde301f6b6318998e4e8bd97bc62e10c` |
| `combined-width-1440.png` | 1440x900 | 236105 B | `eccb0b7284d026a89ab64e8ce7f3851e38bc682acd63a1eeb744ab9b2c9d3b31` |
| `combined-width-2560.png` | 2560x900 | 245780 B | `f33890054d892df8e5c72d5af815e487bcce1be2b2ceb33e04db3f931fc1d55f` |
| `combined-width-320.png` | 320x900 | 71969 B | `4ba9219beccb29cc0ffb388b92ffcbee8e52562fa280db8f40bf3f3cf09943ba` |
| `combined-width-375.png` | 375x900 | 78382 B | `7adf9d8b86deed313e6a8951e1208c8baace50c76c631ab7ac7dff010e9052d3` |
| `combined-width-430.png` | 430x900 | 100114 B | `82bb146b0ead3fadcbd1a206537de3881d599df81f2e9919808ca163a6fe239c` |
| `combined-width-600.png` | 600x900 | 108884 B | `5df23795bdefc8798ba45fe407436dbb187cbbcf2e23a5991995c9a10bea316c` |
| `combined-width-768.png` | 768x900 | 113047 B | `c515a4fbd574abd867d90307813e2000c6c6ba51d066a8fad6e030a92ddd60b3` |
| `jira-graph-quoted-edges.png` | 1440x900 | 208605 B | `333d5682aa9593ea0f0b1e27bacc44b45e05cefdc4c5a7eee4aa3b6295fd9832` |
| `scanner-details-code-tabs.png` | 1440x900 | 233585 B | `a1f3ec9d5092eeeaf210c463a136767e4f8d9aa1ef935f3e2a9a56a37dc7f22f` |
| `combined-sequence.png` | 1440x900 | 181756 B | `358c957339c780c5512e724f6db9719ececa881af94925bb29895517d86b2d7c` |

## 3. Interactive Component Verification

- **Details Keyboard Toggle**: `PASS`
  - Initial `open`: False
  - After Enter (with 700ms settle): True
  - After second Enter (with 700ms settle): False
- **Diagram Horizontal Keyboard Scroll**: `PASS`
  - Container: `docusaurus-mermaid-container container_lyt7` (scrollWidth: 622px > clientWidth: 293px)
  - `scrollLeft` before: 0px
  - `scrollLeft` after ArrowRight: 190px (Native Chromium scroll container keyboard navigation confirmed)
- **Local Search**: `PASS`
  - Typed: "harness" in `input[placeholder="Search"]`
  - Combobox dismissal: `Escape` key successfully dismisses search combobox/modal without locator failures.
- **Visible Code Block Copy**: `PASS`
  - Successfully copied 71 bytes to system clipboard ("python skills_sentry.py scan ./some-skill-bundle --json out/report.json").
- **Tabs Switching**: `PASS`
- **Anchor Navigation**: `PASS` (`#malware-in-the-top-downloaded-skill`)

## 4. Responsive & Reflow Verification

### Navbar Breakpoints
- `995px`: toggle visible = True, items visible = True (mobile_nav (toggle visible))
- `996px`: toggle visible = True, items visible = True (mobile_nav (toggle visible))
- `997px`: toggle visible = False, items visible = True (desktop_nav (toggle hidden, desktop items visible))

### 320px Reflow / 200% Zoom: `PASS`
- Scroll width: 320px (no horizontal overflow)
### Reduced Motion: `PASS`
- Prefers-reduced-motion media query matches: `True`

## 5. In-Browser Axe Accessibility Comparison

Comparison between **Old Public Baseline** (`https://victorstack-ai.github.io/agent-blog/`, main `12e28ad0`) and **Current Local Target** (`http://127.0.0.1:3918/agent-blog/`):

- **Axe Core Engine**: v4.13.0
- **Total Introduced Violations**: **0**

| Route | Baseline Violations | Current Violations | Net New Introduced | Violation IDs & Node Counts (Baseline vs Current) |
|---|---|---|---|---|
| `how-i-combine-harness-loop-graph-engineering/` | 3 | 3 | **0** | image-redundant-alt (1 vs 1), region (1 vs 1), scrollable-region-focusable (2 vs 2) |
| `skills-sentry-skill-marketplace-scanner/` | 4 | 4 | **0** | color-contrast (1 vs 1), image-redundant-alt (1 vs 1), label (6 vs 6), region (1 vs 1) |
| `2026-03-16-wordpress-7-0-block-editor-patterns-visibility-custom-css-dimensions-text-indent-review/` | 4 | 4 | **0** | image-redundant-alt (1 vs 1), label (9 vs 9), region (1 vs 1), scrollable-region-focusable (1 vs 1) |

### Findings Analysis
- `image-redundant-alt`: Present on all baseline pages due to themed logo alt text.
- `region`: Present on all baseline pages due to sidebar layout markup.
- `scrollable-region-focusable`: Flagged on overflowing Mermaid diagram containers without explicit tabindex; verified in Chromium that container natively receives keyboard focus and scrolls via ArrowRight.
- `label`: Flagged on static disabled task checkboxes in legacy archive posts; identical node count (6 on skills-sentry, 9 on wordpress-7-0) between baseline and current.
- `color-contrast`: Flagged on highlighted YAML token syntax highlighting in code block; identical on baseline and current.
- **Conclusion**: Zero introduced accessibility regressions. All observed findings are existing site-wide baseline component properties.

## 6. Final Verdict & Delivery Disposition

- **Status**: `PASS`
- **Remaining Gaps**: None
- **Delivery Disposition**: Browser acceptance is verified and passed. Publication and live deployment recheck owned by Root.