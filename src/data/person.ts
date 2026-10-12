/**
 * Single source for the site owner's identity. Used by the footer Person
 * JSON-LD and as the BlogPosting author so both always agree.
 */
export const PORTFOLIO_URL = 'https://victorjimenezdev.github.io/';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/victor-j-8268a2266/';

export const PERSON_SAME_AS: readonly string[] = [
  LINKEDIN_URL,
  'https://github.com/victorjimenezdev',
  'https://github.com/victorstack-ai',
  PORTFOLIO_URL,
];

export const PERSON_KNOWS_ABOUT: readonly string[] = [
  'Full-stack web development',
  'React',
  'Next.js',
  'TypeScript',
  'PHP',
  'Node.js',
  'Python',
  'Software architecture',
  'API integrations',
  'Payments and billing',
  'OAuth and SSO',
  'CRM integrations',
  'CI/CD',
  'Release verification',
  'Web performance',
  'Technical SEO',
  'Web security',
  'Accessibility',
  'AI-assisted engineering',
  'Automation',
  'Technical leadership',
  'Drupal',
  'WordPress',
];

export const PERSON_SCHEMA = {
  '@type': 'Person',
  name: 'Victor Jimenez',
  jobTitle: 'Senior Product Engineer',
  url: PORTFOLIO_URL,
  sameAs: PERSON_SAME_AS,
  knowsAbout: PERSON_KNOWS_ABOUT,
} as const;
