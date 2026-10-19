---
slug: drupal-context-mcp-integration
title: "Making Drupal Sites AI-Discoverable with MCP"
authors: [VictorStackAI]
tags: [ai-engineering, agents, open-source, drupal, build]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
description: "A Drupal module that exposes a read-only site snapshot to AI agents, CI and monitoring through REST, HMAC, Drush and MCP, without SSH access."
date: 2026-02-16T18:30:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Asking a Drupal site which PHP version it runs should not require an SSH key and a terminal. I built **Project Context Connector**, a Drupal module that exposes a read-only JSON snapshot of site configuration to AI agents, automation scripts and monitoring tools. Each tool reads the same snapshot through one of four interfaces: REST, an HMAC-signed endpoint (a request signed with a shared secret), Drush or native Model Context Protocol (MCP) support.

<!-- truncate -->

<details>
<summary>TL;DR</summary>

- One module, one read-only snapshot, four ways to read it: REST, HMAC-signed endpoint, Drush, MCP.
- With `drupal/mcp_server` installed, Claude Desktop calls the snapshot tool inside Drupal's process.
- No PII, no secrets, database version off by default, rate limited through the Flood API at 60 req/min by default.

</details>

## Drupal sites that only answer over SSH

A tool has no standard way to ask a Drupal site "What version of Drupal is running?" or "Which modules need security updates?". The usual answers are SSH access, manual Drush commands or parsing HTML pages. For an agency with dozens of client sites, those checks become a part-time job that nobody was hired to do.

| Consumer | What it cannot do today |
|---|---|
| Support bots | Answer environment questions |
| CI/CD pipelines | Adapt to site configuration |
| AI assistants | Get real-time context about the stack |
| Security monitoring | Run without a custom script for each site |

Parsing HTML pages to learn a version number means scraping your own server. My fix is to expose the answer once, read-only, and let each tool read it through the access path it already supports.

## One snapshot, four interfaces

The module builds one JSON snapshot of site metadata and serves it four ways. Each interface matches a consumer from the table above.

```mermaid
flowchart TD
    A[Drupal Site\ncore, modules, themes, PHP, DB] --> B[Project Context Connector]
    B --> C[REST API\npermission-gated]
    B --> D[HMAC Signed Endpoint\nno Drupal user needed]
    B --> E[Drush Command\nlocal/CI]
    B --> F[MCP Tool\nAI assistants via mcp_server]
    C --> G[Remote Bots / Monitoring]
    D --> H[Serverless Functions\nLambda, Cloud Functions]
    E --> I[CI/CD Pipelines]
    F --> J[Claude Desktop / AI Agents]
```

MCP lets an AI assistant call a tool that another program exposes.

## Tech stack

| Component | Technology | Why |
|---|---|---|
| CMS | Drupal 10/11 | Target platform, service container |
| Protocol | MCP via `drupal/mcp_server` | Native AI assistant integration |
| Auth (REST) | Drupal permissions | Standard access control |
| Auth (serverless) | HMAC-SHA256 with replay protection | No Drupal user session needed |
| CLI | Drush command | CI/CD pipeline integration |
| Caching | Drupal render cache + cache tags | No extra DB queries on cached hits |
| Testing | Unit, kernel, functional + GitLab CI | Full coverage, production-ready |

### The four access patterns

The REST call uses Drupal permissions. The signed call authenticates with an HMAC signature instead of a Drupal user. It sends the timestamp in `X-PCC-Timestamp` next to the signature in `X-PCC-Signature`.

<Tabs>
<TabItem value="rest" label="REST API" default>

```bash title="rest-api-usage.sh"
# Permission-gated REST endpoint
curl -u user:pass https://site.com/project-context-connector/snapshot
```

</TabItem>
<TabItem value="hmac" label="HMAC Signed">

```bash title="hmac-signed-usage.sh"
# No Drupal user needed - HMAC authentication
TS=$(date +%s)
curl -H "X-PCC-Timestamp: $TS" \
-H "X-PCC-Signature: $(echo -n "$TS" | \
openssl dgst -sha256 -hmac 'secret' -binary | base64)" \
https://site.com/project-context-connector/snapshot/signed
```

</TabItem>
<TabItem value="drush" label="Drush">

```bash title="drush-usage.sh"
# Local or CI usage
drush pcc:snapshot --format=json
```

</TabItem>
<TabItem value="mcp" label="MCP Tool">

```json title="mcp-tool-definition.json"
{
  "name": "project_context_snapshot",
  "description": "Get Drupal site context",
  "input": {}
}
```

</TabItem>
</Tabs>

### Snapshot contents

The snapshot holds what external tools need and nothing else: versions, module security status and theme configuration.

```json title="snapshot-response.json" showLineNumbers
{
  "generated_at": "2026-02-16T18:00:00Z",
  "drupal": {
    "core_version": "10.3.0",
    "php": {"version": "8.3.0"},
    "database": {"driver": "mysql", "version": "8.0.36"},
    "active_modules": [
      {
        "name": "views",
        "version": "10.3.0",
        "origin": "core",
        // highlight-next-line
        "security_status": "current"
      }
    ],
    "themes": {
      "default": "olivero",
      "admin": "claro"
    }
  }
}
```

Security update status comes from Drupal's Update module cache, so building the snapshot makes no outbound requests. The trade-off is freshness. The status is as current as that cache, and cron is what warms it.

## MCP: the assistant asks Drupal directly

The module also supports MCP through Drupal's Tool API. Install the `mcp_server` module alongside Project Context Connector, and AI assistants like Claude Desktop can query the site directly.

:::tip[MCP calls skip HTTP]
When Claude Desktop connects through Drush MCP, the tool call runs inside Drupal's process. There is no HTTP overhead, no authentication step and no CORS. It is the shortest path from "what PHP version is production running?" to an answer.
:::

```mermaid
sequenceDiagram
    participant C as Claude Desktop
    participant D as drush mcp:server
    participant P as Project Context Connector
    C->>D: call project_context_snapshot
    D->>P: run tool inside Drupal process
    P-->>D: JSON snapshot
    D-->>C: versions, modules, themes
```

The network's contribution to this feature is staying out of it. Install both modules and rebuild the cache:

```bash title="installation.sh"
composer require drupal/mcp_server drupal/project_context_connector
drush en -y mcp_server project_context_connector
drush cr
```

Then point Claude Desktop at the Drupal root. The `cwd` line is the one that matters:

```json title="claude-desktop-config.json" showLineNumbers
{
  "mcpServers": {
    "drupal-prod": {
      "command": "drush",
      "args": ["mcp:server"],
      // highlight-next-line
      "cwd": "/var/www/drupal"
    }
  }
}
```

Claude can now answer "What PHP version is the production site running?" by calling the `project_context_snapshot` tool directly, without an HTTP request.

## Slack bot on the signed endpoint

I built a companion Slack bot that uses these endpoints to answer team questions.

```text title="slack-bot-interaction.txt"
/drupal-env production

Response:
Production Environment:
- Drupal: 10.3.0
- PHP: 8.3.0
- Database: MySQL 8.0.36
- Modules needing updates: 0
- Security status: All current
```

The bot authenticates with HMAC signatures, runs on AWS Lambda and costs pennies per month. It needs no SSH access, and no credentials are stored in the bot code.

## Security: minimal by design

A snapshot with nothing secret in it is a dull target, and that is the design goal. The module is secure by default, and anything added to the snapshot should keep it that way.

:::caution[Keep the snapshot minimal]
The snapshot includes versions, security status and configuration flags, and excludes database credentials, API keys and user information. Even the optional database version is off by default, per OWASP recommendation. Do not extend the snapshot with personally identifiable information (PII) or secrets.
:::

- Read-only operations, with no write endpoints.
- Zero personally identifiable information (PII) exposure: no user data, emails or credentials.
- Rate limiting through Drupal's Flood API (default: 60 req/min).
- CORS allow-lists for browser clients.
- HTTP caching with cache tags.
- HMAC-SHA256 authentication with replay protection.
- Optional database version hiding (OWASP recommendation).

## Technical decisions

Each interface exists because a consumer needs it. The optional MCP dependency had a cost in static analysis, because PHPStan has no concept of "optional". To PHPStan, a class that is not installed is a missing class.

<details>
<summary>Reasons for four interfaces</summary>

Different use cases need different access patterns. MCP fits local AI assistants, REST APIs work for remote bots, Drush fits CI/CD pipelines, and HMAC signatures let serverless functions read the snapshot without managing Drupal sessions.

</details>

<details>
<summary>Limits on snapshot contents</summary>

I would add a field only when a consumer needs it and its value can be shared with every caller allowed to read the snapshot. The existing snapshot excludes credentials and user information.

</details>

<details>
<summary>PHPStan challenge with optional MCP dependency</summary>

The MCP integration uses an optional dependency (`drupal/tool`). PHPStan fails if that module is not installed, but the module cannot be required, because the HTTP and Drush features work without it. My fix: `phpstan.neon` uses `excludePaths` to skip the MCP plugin during analysis when the tool module is absent.

</details>

## Performance

Every read comes from a cache that Drupal already maintains, so the endpoint does not add database queries.

| Aspect | Detail |
|---|---|
| Cached responses | Full Drupal render cache with proper contexts |
| Database queries | None. Uses cached module and theme lists from extension discovery |
| Security updates | Reads from the Update module cache, already warmed by cron |
| Response size | About 50KB typical for 100+ modules |

## Installation (2 minutes)

```bash title="quick-install.sh"
composer require drupal/project_context_connector
drush en -y project_context_connector
drush cr
```

For MCP support, add `mcp_server`:

```bash title="mcp-install.sh"
composer require drupal/mcp_server
drush en -y mcp_server
```

Grant the "access project context snapshot" permission to service users, or configure HMAC authentication.

## For agencies with many Drupal sites

The usual alternative is a custom script for each client, and the maintenance work grows with every client added. With this module, every site exposes the same interface for core version, PHP version, module security status and theme configuration, without SSH access. My judgment: the HMAC-signed endpoint matters most for serverless monitoring stacks that cannot keep a Drupal user session.

## Planned work, none of it built yet

The module is production-ready on Drupal.org, with unit, kernel and functional tests and GitLab CI pipelines. These are directions I plan to explore. None of them exists today:

- Custom field plugins for site-specific metadata.
- GraphQL endpoint alongside REST.
- Webhook notifications on security updates.
- Multi-site aggregation dashboard.

## Verification checklist

The third item is the check that matters: read the actual output before any tool reads it.

- [ ] Install `drupal/project_context_connector` with Composer, enable it and run `drush cr`.
- [ ] Grant "access project context snapshot" to a service user, or configure HMAC authentication.
- [ ] Run `drush pcc:snapshot --format=json` and confirm the output contains no PII or secrets.
- [ ] Confirm cron warms the Update module cache, because security status is read from it.
- [ ] Leave the database version off unless a tool needs it.
- [ ] For MCP, install `drupal/mcp_server` and point the Claude Desktop `cwd` at the Drupal root.

## References

- [Project Context Connector (Drupal Module)](https://www.drupal.org/project/project_context_connector)
- [GitHub Mirror](https://github.com/victorjimenezdev/project_context_connector)
