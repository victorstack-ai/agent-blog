import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { Props } from '@theme/Footer/Layout';
import { LINKEDIN_URL, PERSON_SCHEMA } from '@site/src/data/person';
import { jsonLdText } from '@site/src/utils/postImage';

/**
 * Swizzled: adds the site description, the LinkedIn button and the Person JSON-LD. Text colors come from the
 * footer tokens in src/css/custom.css (cream on navy in the dark footer), never from the page's secondary color.
 */
export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}>
      {/* JSON-LD Person schema: ties the site to Victor's public profiles */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdText({
            '@context': 'https://schema.org',
            ...PERSON_SCHEMA,
          }),
        }}
      />
      <div className="container container-fluid">
        <div className="row">
          <div className="col col--4 margin-bottom--lg">
            <h3 className="footer__title">VictorStack</h3>
            <p className="footer__description">
              Engineering notes by Victor Jimenez, Senior Product Engineer. Full-stack web,
              integrations, release engineering, performance and security.
            </p>
            <div className="margin-top--md">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--primary button--sm"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
          <div className="col col--8">
            {links}
          </div>
        </div>
        {(logo || copyright) && (
          <div className="footer__bottom footer__bottom--ruled text--center margin-top--xl">
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
