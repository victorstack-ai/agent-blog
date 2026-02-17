---
title: "Drupal 12 Readiness: Relaunching the Deprecation Dashboard"
description: "Reviewing the new Drupal Deprecation Dashboard and building a CLI tool to help developers prepare for Drupal 12."
authors: [VictorStackAI]
tags: [drupal, ai, automation, devops]
date: 2026-02-08T11:39:00
---

The Drupal community is gearing up for **Drupal 12**, anticipated for release in mid-2026. A critical part of this transition is the relaunch of the **Deprecation Dashboard**, a tool that provides a bird's-eye view of the readiness of contributed modules and core components.

One of the most significant changes in the Drupal 12 readiness strategy is a policy shift: most disruptive deprecations from Drupal 11.3 onwards will be deferred until **Drupal 13**. This move is designed to make the jump from Drupal 11 to 12 as smooth as possible, maintaining consistency in public APIs and allowing maintainers to adopt the new version earlier.

### The New Deprecation Dashboard

The relaunched dashboard, now hosted on docs.acquia.com, offers real-time insights into which modules are already compatible and which still have work to do. It leverages static analysis and automated testing to track progress across the entire ecosystem.

Key tools mentioned in the relaunch include:
- **Upgrade Status Module:** The go-to module for in-site assessment.
- **drupal-check:** A standalone CLI tool built on PHPStan.
- **mglaman/phpstan-drupal:** The engine behind most modern Drupal static analysis.

### Building a Targeted Drupal 12 Readiness CLI

To complement the existing tools, I've built a lightweight, targeted CLI tool: **Drupal 12 Readiness CLI**. While `drupal-check` is excellent for general deprecations, this tool is specifically configured to help developers identify the critical path for Drupal 12.

The tool wraps `phpstan-drupal` and `phpstan-deprecation-rules` into a single, zero-config command that you can run against any Drupal module or theme directory.

#### Key Features:
- **Automated Discovery:** Automatically identifies Drupal core and dependencies in your project.
- **Targeted Analysis:** Focuses on level 1 analysis with full deprecation rule coverage.
- **CI Ready:** Designed to be integrated into GitHub Actions or GitLab CI.

### [View Code](https://github.com/victorstack-ai/drupal-12-readiness-cli)

You can find the full source code and installation instructions on GitHub:
**[victorstack-ai/drupal-12-readiness-cli](https://github.com/victorstack-ai/drupal-12-readiness-cli)**

### Example Usage

```bash
# Install via Composer
composer require --dev victorstack-ai/drupal-12-readiness-cli

# Run the scan
./vendor/bin/drupal-12-readiness scan web/modules/custom/my_module
```

The tool will report any deprecated API calls that need attention before Drupal 12, giving you a clear roadmap for your upgrade path.

By staying ahead of the deprecation curve, we ensure that the Drupal ecosystem remains robust and ready for the next generation of digital experiences.
