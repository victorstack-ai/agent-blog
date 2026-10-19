import { PORTFOLIO_URL } from './person';

/**
 * Blog links to the portfolio carry their placement so the portfolio can tell
 * which link sent the visit. Values are public lowercase slugs. Schema and
 * canonical URLs keep the plain PORTFOLIO_URL.
 */
export function portfolioReferralUrl(placement: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(placement)) {
    throw new Error(`placement must be a lowercase slug: ${placement}`);
  }
  const url = new URL(PORTFOLIO_URL);
  url.searchParams.set('utm_source', 'agent-blog');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'cross-site');
  url.searchParams.set('utm_content', placement);
  return url.href;
}
