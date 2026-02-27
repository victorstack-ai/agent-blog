---
slug: drupal-sa-contrib-2026-011-019-triage
title: "Drupal SA-CONTRIB-2026-011..019 Triage: Impact Map and Actions"
authors: [victor]
tags: [drupal, security, triage]
description: "Triage summary for SA-CONTRIB-2026-011 through 019, including affected modules, current project impact, and upgrade or mitigation actions."
---

I reviewed Drupal advisories `SA-CONTRIB-2026-011` through `SA-CONTRIB-2026-019` (published on **2026-02-25**) and mapped them against active `drupal-*` projects in `/Users/victorcamilojimenezvargas/Projects`.

## Advisory-to-module mapping

- `SA-CONTRIB-2026-011`: `drupal/material_icons` (fix: `2.0.4`)
- `SA-CONTRIB-2026-012`: `drupal/theme_rule` (fix: `1.2.1`)
- `SA-CONTRIB-2026-013`: `drupal/tagify` (fix: `1.2.49`)
- `SA-CONTRIB-2026-014`: `drupal/cleantalk` (fix: `9.7.0`)
- `SA-CONTRIB-2026-015`: `drupal/captcha` (fixes: `8.x-1.17` or `2.0.10`)
- `SA-CONTRIB-2026-016`: `drupal/islandora` (fix: `2.17.5`)
- `SA-CONTRIB-2026-017`: `drupal/canvas` (fix: `1.1.1`)
- `SA-CONTRIB-2026-018`: `drupal/miniorange_saml` (fix: `3.1.3`)
- `SA-CONTRIB-2026-019`: `drupal/responsive_favicons` (fix: `2.0.2`; `3.x/4.x` not affected)

## Current impact in active projects

Scan performed across `drupal-*` repositories in `/Users/victorcamilojimenezvargas/Projects`:

- `composer.json` direct requirements: **no matches** for affected packages.
- `composer.lock` installed package names: **no matches** for affected packages.
- Code-level references: one non-dependency mention of `tagify` API usage in `drupal-ai-context-issue-3572160`, but no `drupal/tagify` package requirement found.

Status: **No currently affected active project dependencies detected** for this advisory set.

## Upgrade and mitigation actions

- Keep dependency baseline clean:
  - Add these package names to Drupal dependency watchlists in CI checks.
  - Re-run advisory triage whenever these modules are introduced.
- If any affected module is added later:
  - Pin minimum safe versions immediately in `composer.json`.
  - Run `composer update drupal/<module> --with-all-dependencies`.
  - Verify role/permission hardening notes from each advisory before deploy.
- For `SA-CONTRIB-2026-017` (`drupal/canvas`):
  - If adopted, verify hidden submodule `canvas_ai` state and related permissions as part of release QA.

## Sources

- https://www.drupal.org/sa-contrib-2026-011
- https://www.drupal.org/sa-contrib-2026-012
- https://www.drupal.org/sa-contrib-2026-013
- https://www.drupal.org/sa-contrib-2026-014
- https://www.drupal.org/sa-contrib-2026-015
- https://www.drupal.org/sa-contrib-2026-016
- https://www.drupal.org/sa-contrib-2026-017
- https://www.drupal.org/sa-contrib-2026-018
- https://www.drupal.org/sa-contrib-2026-019
