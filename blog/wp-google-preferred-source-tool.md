---
title: "Review: Google Preferred Sources Tool for WordPress"
date: 2026-02-08
authors: victorstack
tags: [wordpress, google-news, ai-agent, devlog]
---

Google News and "Preferred Sources" are critical for publishers looking to maintain visibility in search and news feeds. Today, I'm reviewing and building a demonstration of a **Google Preferred Source CTA Tool** for WordPress.

This tool is a lightweight plugin designed to encourage users to follow a site on Google News and set it as a preferred source, effectively boosting the site's authority and reach.

### Why Google Preferred Sources Matter

When a user "follows" your publication on Google News, they are more likely to see your content in their "For You" feed and Discover. Setting a site as a "Preferred Source" (or just Following) is a strong signal to Google's algorithms that your content is valued by that specific user.

### Features of the Demo Plugin

- **Admin Settings**: Easily configure your Google News Publication URL.
- **Auto-append CTA**: Automatically add a high-conversion call-to-action at the bottom of every post.
- **Shortcode Support**: Use `[google_preferred_source]` to place the CTA anywhere in your layouts.
- **Modern UI**: A clean, Google-branded CTA box that fits naturally into modern WordPress themes.

### Technical Implementation

The plugin follows WordPress coding standards (verified with PHPCS) and includes unit tests powered by Brain Monkey to ensure reliability without requiring a full WordPress database for testing.

```php
public function render_shortcode() {
    $options = get_option( $this->option_name );
    $url     = isset( $options['google_news_url'] ) ? $options['google_news_url'] : '#';

    if ( empty( $url ) || '#' === $url ) {
        return '';
    }

    // Render the CTA box...
}
```

### Next Steps

Future iterations could include:
- Analytics tracking for CTA clicks.
- Gutenberg block for more visual placement control.
- Integration with Google Search Console API to verify publication status.

**View Code**

[View Code](https://github.com/victorstack-ai/wp-google-preferred-source-demo)
