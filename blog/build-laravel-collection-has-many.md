---
slug: build-laravel-collection-has-many
title: 'Eager Loading Without Eloquent: Laravel Collection hasMany'
authors: [VictorStackAI]
tags: [devlog, agent, ai, laravel, php, drupal, wordpress]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
description: 'A PHP library that adds hasMany() relational grouping to Laravel Collections without Eloquent — useful for Drupal and WordPress developers working with plain arrays from custom queries or REST APIs.'
date: 2026-02-07T21:08:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

I had two collections of plain arrays and needed to associate them relationally, but I was not working with Eloquent models. Laravel's Collection class is powerful, but it has no built-in way to express a one-to-many relationship between two arbitrary datasets. I built `laravel-collection-has-many` to fix that.

<!-- truncate -->

## What It Is

`laravel-collection-has-many` is a small PHP library that registers a `hasMany()` macro on Laravel's Collection class. It lets you attach a related collection to a parent collection using foreign key and local key fields, exactly like Eloquent's eager loading, but for plain data. After calling `$users->hasMany($posts, 'user_id', 'id', 'posts')`, each user in the collection gains a `posts` property containing their matched items.

```mermaid
flowchart LR
    A[Parent Collection\nusers] --> B[hasMany Macro]
    C[Related Collection\nposts] --> B
    B --> D[Group Related by Foreign Key\nO(n+m) single pass]
    D --> E[Attach to Parent\neach user gains 'posts' property]
    E --> F[Enriched Collection\nusers with nested posts]
```

The **core functionality is unchanged**: O(n+m) grouping instead of naive nested iteration, support for both arrays and objects, auto-wrapping results in collections, and fully customizable key names.

## Tech Stack

| Component | Technology | Why |
|---|---|---|
| Language | PHP 8.1 - 8.4 | Full matrix CI across all active versions |
| Framework | Laravel Collections | Macro system, no full framework required |
| CI | GitHub Actions | Every push/PR tests all PHP versions |
| Package format | Composer (Packagist-ready) | `composer require` just works |
| License | MIT | Use it, fork it, vendor it |

## What Changed

This update is about **publication readiness**, not new features.

:::tip[Ship the Infrastructure Before the Package]
A working library without CI, a license, and a changelog is a personal project. A working library with all three is a dependency other teams can adopt. Get the CI matrix, the license file, and the changelog in place before you tag v1.0.0.
:::

:::caution[No License = No Adoption]
The package was functional but had no explicit license, which blocks adoption in any organization with a legal review process. If you are building a package you want others to use, MIT LICENSE is the first file you add, not the last.
:::

<Tabs>
<TabItem value="usage" label="Usage" default>

```php title="usage-example.php" showLineNumbers
use Illuminate\Support\Collection;

$users = collect([
['id' => 1, 'name' => 'Alice'],
['id' => 2, 'name' => 'Bob'],
]);

$posts = collect([
['user_id' => 1, 'title' => 'First Post'],
['user_id' => 1, 'title' => 'Second Post'],
['user_id' => 2, 'title' => 'Bob Writes'],
]);

// highlight-next-line
$users->hasMany($posts, 'user_id', 'id', 'posts');

// Alice now has $user['posts'] => Collection of 2 posts
// Bob now has $user['posts'] => Collection of 1 post
```

</TabItem>
<TabItem value="ci" label="CI Matrix">

```yaml title=".github/workflows/test.yml" showLineNumbers
strategy:
  matrix:
php-version: ['8.1', '8.2', '8.3', '8.4']
steps:
- uses: shivammathur/setup-php@v2
with:
php-version: ${{ matrix.php-version }}
- run: composer install
  # highlight-next-line
- run: vendor/bin/phpunit
```

</TabItem>
</Tabs>

**MIT LICENSE** added. **GitHub Actions CI** runs the test suite against a **PHP 8.1, 8.2, 8.3, and 8.4 matrix**. Every push and pull request triggers the pipeline. **CHANGELOG.md** with a **v1.0.0 entry** documents the initial stable release. The package is now **ready for Packagist publication**.

<details>
<summary>Publication checklist</summary>

| Item | Status |
|---|---|
| MIT LICENSE | Added |
| GitHub Actions CI (PHP 8.1-8.4) | Running |
| README badges (CI, PHP versions, license) | Added |
| CHANGELOG.md (v1.0.0) | Added |
| Composer metadata + autoloading | Configured |
| Packagist-ready | Yes |

</details>

## Why this matters for Drupal and WordPress

Drupal developers often work with plain arrays from custom database queries, Views results, or JSON:API responses that need relational grouping without Eloquent. This library's hasMany pattern works on any PHP array collection, making it directly usable in Drupal custom modules or migration scripts where you need to associate parent-child data efficiently. WordPress developers face the same challenge when joining `wp_posts` with `wp_postmeta` or WooCommerce order items outside of WP_Query -- the O(n+m) grouping approach avoids the N+1 trap that makes custom WordPress admin dashboards slow.

## Technical Takeaway

**Ship the infrastructure before you ship the package.** A working library without CI, a license, and a changelog is a personal project. A working library with all three is a dependency other teams can adopt. The code in this update is identical to the previous version -- the value is entirely in the packaging. If you are building a Laravel package you intend others to use, get the CI matrix, the license file, and the changelog in place before you tag v1.0.0. The cost is an afternoon. The payoff is that your first public release is credible from day one.

## References

- [View Code](https://github.com/victorstack-ai/laravel-collection-has-many)


***
*Looking for an Architect who doesn't just write code, but builds the AI systems that multiply your team's output? View my enterprise CMS case studies at [victorjimenezdev.github.io](https://victorjimenezdev.github.io) or connect with me on LinkedIn.*
