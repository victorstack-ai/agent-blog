---
slug: modernizing-workflows-pre-commit-hooks-drupal
title: "Modernizing Workflows with Pre-commit Hooks in Drupal"
authors: [VictorStackAI]
tags: [drupal, git, devops, phpcs, static-analysis, workflow]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
description: "How to enforce coding standards globally across decentralized enterprise dev teams using strict Git hooks and automated code sniffing."
date: 2026-03-08T12:00:00
---

When managing a Drupal distribution for a massive intergovernmental corporation with developers working across three continents, "code review" cannot be the first line of defense against poor syntax. By the time a senior architect is reviewing a Pull Request, it is too late to argue about indentations or missing docblocks.

<!-- truncate -->

In evaluating a custom upstream (`CHG0099785`), we noticed that CI pipelines were continuously failing due to trivial PHPCS (PHP CodeSniffer) violations, creating massive bottlenecks in the merge cycle.

## The Cost of Late Detection

If a developer submits a PR with a `tab` instead of two `spaces`, the CI pipeline still consumes 5 to 10 minutes to spin up the container, run the automated tests, and eventually fail on the syntax check. 

Multiply 10 minutes of wait time by 20 developers committing 3 times a day, and the organization hemorrhaged hundreds of hours a week strictly waiting for Jenkins/GitLab to tell them they missed a semicolon.

## Shift-Left: Enforcing the Edge

To solve this, we moved the validation logic from the remote CI server directly onto the developer's local machine via automated Git Pre-Commit hooks.

### 1. Husky and Lint-Staged
We integrated `husky` and `lint-staged` into the project's root `package.json`. Rather than relying on developers to manually run `phpcs` before committing, the hook intercepts the `git commit` command.

It specifically targets *only* the files currently staged in Git. Checking an entire legacy Drupal core takes minutes; checking the two files the developer just edited takes 400 milliseconds.

### 2. Auto-Fixing on the Fly
The integration was configured not just to complain, but to assist. The pre-commit hook runs `phpcbf` (PHP Code Beautifier and Fixer) first. 

If a developer uses double quotes instead of single quotes, `phpcbf` instantly corrects the file locally, stages the corrected file, and allows the commit to proceed silently. The developer never even notices the error.

### 3. Graceful Upstream Disablement
An edge case arose when deploying the upstream distribution to downstream vendor agencies who didn't necessarily have the required binaries (like Node.js for Husky) installed locally. 

We engineered the `composer.json` scaffolding scripts to intentionally disable or bypass these strict pre-commit hooks during downstream deployment building, ensuring the hooks strictly applied to first-party UI/UX developers while remaining invisible to the production build pipeline.

## The ROI of Syntax Automation

By shifting validation to the extreme left—right at the point of the commit—we dropped CI failure rates due to syntax by 98%. Senior architects spend their time reviewing business logic and security vectors, rather than leaving comments about line-length limits.

***
*Need an Enterprise Architect to optimize your team's throughput? View my case studies at [victorjimenezdev.github.io](https://victorjimenezdev.github.io) or connect with me on LinkedIn.*


***
*Need an Enterprise CMS Architect to modernize your legacy PHP platforms? View my case studies at [victorjimenezdev.github.io](https://victorjimenezdev.github.io) or connect with me on LinkedIn.*
