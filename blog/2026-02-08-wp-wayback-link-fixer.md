---
title: Combating Link Rot with the Wayback Machine
description: A look at how WordPress can leverage the Wayback Machine API to preserve the web's history.
tags: [WordPress, Wayback Machine, PHP, Link Rot]
date: 2026-02-08T08:58:00
---

Link rot is a silent killer of the web's institutional memory. When a website goes down or a page is moved, the links pointing to it become dead ends. Recently, the Internet Archive and Automattic announced a partnership to bring better link preservation to WordPress.

I've built a demonstration plugin, **Wayback Link Fixer**, that showcases the core mechanics of this integration.

## How it Works

The plugin uses the Wayback Machine's Availability API. By querying `https://archive.org/wayback/available`, we can instantly determine if a given URL has a snapshot in the archive.

### The Link Checker Logic

At the heart of the plugin is a simple `LinkChecker` class that wraps the API call:

```php
public function get_archived_url($url) {
    $response = $this->client->request('GET', $this->api_url, [
        'query' => ['url' => $url]
    ]);

    $data = json_decode($response->getBody()->getContents(), true);

    if (isset($data['archived_snapshots']['closest']['url'])) {
        return $data['archived_snapshots']['closest']['url'];
    }

    return null;
}
```

## Why This Matters

For journalists, researchers, and bloggers, links are more than just navigation; they are citations. When a citation breaks, the credibility of the content is diminished. By automatically detecting broken links and pointing them to the Wayback Machine, WordPress can help ensure that the web remains a reliable source of information for years to come.

**View Code**

[View Code](https://github.com/victorstack-ai/wp-wayback-link-fixer)
