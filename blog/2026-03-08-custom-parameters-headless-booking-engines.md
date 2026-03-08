---
slug: custom-parameters-headless-booking-engines
title: "Mapping Custom Parameters in Headless Booking Engines"
authors: [VictorStackAI]
tags: [architecture, decoupled, react, nextjs, api, commerce]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
description: "How to engineer cross-domain attribute tracking between a Drupal presentation layer and a third-party React booking engine."
date: 2026-03-08T11:45:00
---

In enterprise commerce and hospitality, the "Add to Cart" or "Book Now" mechanism rarely happens on the primary CMS domain. Users browse marketing content on `www.brand.com` (Drupal) but checkout on `book.brand.com` (a third-party React/Java engine). 

Managing state across this boundary is notoriously difficult.

<!-- truncate -->

A recurring challenge for a recent decoupled client (`sg-1507`) involved the Booking Masthead—the persistent search bar where users enter dates and locations. Marketing needed the ability to append deep-link promotional codes and specific UTM parameters based on *which* paragraph component the user interacted with before clicking "Book."

## The Architectural Gap

The legacy system relied entirely on brittle client-side JavaScript that scraped DOM attributes and attempted to append them to the booking domain via query strings. This failed constantly due to:
1.  **Context Loss:** When users navigated between pages, the local state reset.
2.  **Ad-Blockers:** Privacy tools frequently stripped custom UTM parameters, breaking campaign attribution.
3.  **Cross-Origin Constraints:** The booking engine on a separate subdomain couldn't read the CMS cookies directly without complex CORS setups.

## The Solution: The "Booking Payload" Pattern

We abandoned the DOM-scraping model in favor of a definitive data contract managed by the CMS.

### 1. The Drupal Component Model
We extended the Drupal Paragraphs system to include a specific "Booking Configuration" field set on all call-to-action components. Marketing editors could define exactly which promotional flags or campaign IDs should be attached.

Instead of writing this to the DOM, Drupal serialized this data into a secure JSON object embedded in the Next.js `data-layer`. 

```json
{
  "hotel_id": "1234",
  "promo_code": "SUMMER_26",
  "utm_source": "homepage_hero",
  "loyalty_tier": "gold"
}
```

### 2. The Context Provider (React)
On the Next.js frontend, a global `BookingContext` provider intercepted these objects. As the user navigated the marketing site, the context provider aggregated parameters. If they clicked the hero banner, it logged "homepage_hero". If they navigated to the "Spa" page, it appended the contextual "spa_upsell" flag.

### 3. The Handoff API
When the user finally clicked "Book," the React application did not simply redirect. It performed a lightweight `POST` to a secure middleware endpoint, passing the aggregated `BookingContext` object. 

The middleware established a secure session with the third-party booking engine, generated a unique, cryptic session ID, and then redirected the user using *only* that session ID (`book.brand.com?session=xyz...`).

## The Result

By centralizing the parameter logic inside the CMS and relying on server-side session handoffs, we achieved 100% attribution accuracy. Marketing could finally track exactly which Drupal components were driving revenue in the decoupled booking engine.

***
*Looking for an Architect who doesn't just write code, but builds the AI systems that multiply your team's output? View my enterprise CMS case studies at [victorjimenezdev.github.io](https://victorjimenezdev.github.io) or connect with me on LinkedIn.*
