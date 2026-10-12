---
slug: build-config-sync
title: "SyncForge Config Manager: WordPress Config as YAML, Not Guesswork"
authors: [VictorStackAI]
tags: [devops, wordpress, build]
image: https://victorstack-ai.github.io/agent-blog/img/build-config-sync.png
description: "A WordPress plugin that exports, diffs, imports and rolls back site settings as provider-based YAML, with one workflow across admin, REST and WP-CLI."
date: 2026-03-10T08:10:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

WordPress configuration usually lives in `wp-admin` as tribal memory. I built **SyncForge Config Manager** to export it to YAML, diff it, import it with guardrails and roll it back when a release goes sideways. The YAML is the boring part. The value is one deterministic workflow across admin UI, REST and WP-CLI instead of three behaviors that are almost the same.

<!-- truncate -->

<details>
<summary>TL;DR</summary>

- Seven providers map config domains (options, roles, menus, widgets, theme mods, rewrite rules, block patterns) between the database and YAML files.
- `ConfigManager` runs export, import, diff and rollback for admin, REST and WP-CLI through the same path.
- Every import goes through lock, dependency sort, env overrides, schema validation and sanitization before dry-run or import.
- Two known gaps: capability checks differ between REST and admin, and the docs still name an old config path.

</details>

## The problem: configuration drift

A database dump is not config management. It is mostly a panic button.

What breaks teams is drift that normal release pipelines do not track:

- options changed in `wp-admin`
- theme mods changed in one environment only
- widget trees drifting without anyone noticing
- rewrite config that differs after one plugin update

> "Export, import, and sync WordPress site configuration as YAML files across environments."
>
> - SyncForge Config Manager README, [GitHub](https://github.com/victorstack-ai/config-sync/blob/main/README.md)

## Why I built a plugin instead of installing one

The first question was whether a maintained WordPress plugin already did this. I did not find one that combined the pieces that matter in delivery work.

| Requirement | What it replaces |
|---|---|
| Provider-based exports | One giant opaque blob |
| Diff, dry-run and rollback in one workflow | Separate tools, or hope |
| Roles, menus, widgets, theme mods, rewrite rules, block patterns | Options-only sync |
| One orchestration path for admin, REST and WP-CLI | Three interfaces with their own edge cases |

That gap is the only reason the plugin exists. If a maintained plugin had covered those boundaries, writing another one would have been waste.

## How it works: one path for three interfaces

The plugin boots a container, registers providers, then hands every operation to `ConfigManager`. Providers define how each config domain maps between database state and YAML files.

```mermaid
flowchart TD
  A[WordPress Bootstrap] --> B[Plugin::init]
  B --> C[Register 7 Providers]
  B --> D[Init Services]
  D --> E[ConfigManager]
  E --> F[FileHandler YAML I/O]
  E --> G[SchemaValidator + YamlSanitizer]
  E --> H[EnvironmentOverride]
  E --> I[DiffEngine]
  E --> J[AuditLogger + Snapshots]
  K[WP-CLI syncforge *] --> E
  L[REST /syncforge/v1/*] --> E
  M[Admin UI Tools > SyncForge] --> L
```

The admin UI goes through REST, and REST and WP-CLI both land on `ConfigManager`. A bug fixed there is fixed in all three places.

<Tabs>

<TabItem value="cli" label="WP-CLI Path" default>

```bash title="real commands from src/CLI/*.php"
wp syncforge export
wp syncforge diff --format=json
wp syncforge import --dry-run
wp syncforge import --yes
wp syncforge status
wp syncforge discover --track-all
```

</TabItem>

<TabItem value="rest" label="REST/Admin Path">

```bash title="real routes from src/Rest/*.php"
/wp-json/syncforge/v1/export
/wp-json/syncforge/v1/import
/wp-json/syncforge/v1/diff
/wp-json/syncforge/v1/snapshots
/wp-json/syncforge/v1/rollback/{id}
/wp-json/syncforge/v1/discover
```

</TabItem>

</Tabs>

## The import pipeline in ConfigManager

`ConfigManager` does the work in a fixed order. Nothing reaches a provider without passing validation and sanitization first.

```mermaid
flowchart TD
  A[Acquire lock] --> B[Sort providers by dependency]
  B --> C[Read provider YAML]
  C --> D[Apply environment overrides]
  D --> E[Validate schema]
  E -->|invalid| X[Throw RuntimeException]
  E -->|valid| F[Sanitize]
  F --> G{Dry run?}
  G -->|yes| H[provider dry_run]
  G -->|no| I[provider import]
```

The per-provider step looks like this:

```php title="syncforge-config-manager/src/ConfigManager.php" showLineNumbers
private function do_import_provider( Provider\ProviderInterface $provider, bool $dry_run ): array {
	$config = $this->read_provider_config( $provider );

	// highlight-next-line
	$config = $this->container->get_environment_override()->apply_overrides( $provider->get_id(), $config );

	$validation = $this->container->get_schema_validator()->validate( $provider->get_id(), $config );

	if ( is_wp_error( $validation ) ) {
		throw new \RuntimeException(
			sprintf(
				esc_html__( 'Validation failed for provider %1$s: %2$s', 'syncforge-config-manager' ),
				esc_html( $provider->get_id() ),
				esc_html( $validation->get_error_message() )
			)
		);
	}

	// highlight-next-line
	$config = $this->container->get_yaml_sanitizer()->sanitize( $config, $provider->get_id() );

	if ( $dry_run ) {
		return $provider->dry_run( $config );
	}

	return $provider->import( $config );
}
```

## Option discovery without a hardcoded plugin list

A hardcoded list of plugin options is out of date the day after the next plugin install. Discovery classifies keys by pattern instead, then groups them by plugin slug, or `misc` when ownership is ambiguous.

```php title="syncforge-config-manager/src/Admin/OptionDiscovery.php" showLineNumbers
private const RUNTIME_KEYWORDS = array(
	'_version',
	'_db_version',
	'_migration',
	'_nonce',
	'_session',
	'_token_',
	'_count',
	'_dismissed',
	'_telemetry',
	'_last_run',
	'_children',
	'_site_health',
);

private const RUNTIME_SUFFIXES = array(
	'_state',
	'_rat',
	'_pubkey',
	'_auth',
	'_install',
);
```

These patterns keep runtime state such as nonces, sessions, counters and version markers out of the YAML. WordPress hides a lot of mutable state in options, so this filter decides whether the export is config or noise.

## Providers and their dependencies

Each provider declares what it depends on, which is what makes the topological sort possible. Menus, widgets, theme mods and rewrite rules all wait for `options`.

| Provider ID | Dependency | File strategy |
|---|---|---|
| `options` | none | fixed files (`options/general.yml`, etc.) + dynamic extra groups |
| `roles` | none | dynamic directory (`roles/{role}.yml`) |
| `menus` | `options` | directory (`menus/`) |
| `widgets` | `options` | directory (`widgets/`) |
| `theme-mods` | `options` | single file (`theme-mods.yml`) |
| `rewrite` | `options` | single file (`rewrite.yml`) |
| `block-patterns` | none | directory (`block-patterns/`) |

## The rename to SyncForge

The project moved from generic `config-sync` branding to `syncforge-config-manager`. The plugin header and docs reflect it.

```diff
-=== Config Sync ===
+=== SyncForge Config Manager ===
-Contributors: victorstack-ai
+Contributors: victorjimenezdev
-Text Domain: config-sync
+Text Domain: syncforge-config-manager
-Plugin Name: Config Sync
+Plugin Name: SyncForge Config Manager
```

<details>
<summary>Supplementary: security controls implemented in code</summary>

- `FileHandler::resolve_safe_path()` rejects traversal before file access.
- ZIP import rejects entries containing `..` and only extracts `.yml`.
- `YamlSanitizer` rejects serialized object payload patterns.
- `AuditLogger` redacts secret-looking keys before storing snapshots/diffs.
- Config directory gets `.htaccess`, `index.php`, and `web.config` deny files.

</details>

## Known gaps

Two things are not finished, and both are drift of the kind the plugin exists to catch. The code defaults to `wp-content/syncforge-config-manager`, while the docs still mention `wp-content/config-sync/`, which is a fair live demonstration of the problem.

:::caution[Capability Model Is Split]
REST checks `manage_config_sync`, while parts of admin and ZIP handling check `manage_options`. If you run this with delegated ops roles, unify the capability checks before someone finds an action that works in one interface and is blocked in another.
:::

## Use dry-run as a release gate

The tooling is there. What is missing is the habit of running it before production, and no plugin ships that.

:::tip[Use Dry-Run as a Release Gate]
Make `wp syncforge diff` and `wp syncforge import --dry-run` mandatory in staging before any production import. If the diff is not reviewed, the import does not run.
:::

## Release checklist

- [ ] Run `wp syncforge export` and commit the YAML.
- [ ] Run `wp syncforge diff --format=json` in staging and read it.
- [ ] Run `wp syncforge import --dry-run` and confirm no validation errors.
- [ ] Confirm a snapshot exists under `/wp-json/syncforge/v1/snapshots` so rollback has a target.
- [ ] Check which config directory the site uses: the code default, not the old docs path.
- [ ] Check that the user running the import has both `manage_config_sync` and `manage_options`.
- [ ] Run `wp syncforge import --yes` in production.

## What I learned

- Provider contracts beat one giant "sync everything" routine. Dependencies are explicit and sortable.
- The lock model (`config_sync_lock` in `wp_options`) is plain and good enough for admin and CLI concurrency.
- One orchestration layer serving REST, CLI and admin reduces behavior drift between interfaces.
- Default paths matter more than people admit. Mine already disagree with my docs.
- WordPress keeps more mutable state in runtime options than it looks, so classification, sanitization and rollback have to be strict for this to work outside demos.

## References

- [View Code](https://github.com/victorstack-ai/config-sync)
- [Project README](https://github.com/victorstack-ai/config-sync/blob/main/README.md)
- [Main Plugin Bootstrap](https://github.com/victorstack-ai/config-sync/blob/main/syncforge-config-manager/syncforge-config-manager.php)
