import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { Props } from '@theme/Footer/Layout';

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
      {/* JSON-LD Schema for LocalBusiness / Organization SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "VictorStack AI",
            "image": "https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png",
            "url": "https://victorstack-ai.github.io/agent-blog/",
            "telephone": "",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bogotá",
              "addressRegion": "CO",
              "addressCountry": "CO"
            },
            "sameAs": [
              "https://victorjimenezdev.github.io/",
              "https://www.linkedin.com/in/victor-j-8268a2266/",
              "https://github.com/victorstack-ai"
            ]
          })
        }}
      />
      <div className="container container-fluid">
        <div className="row">
          <div className="col col--4 margin-bottom--lg">
            <h3 className="footer__title">VictorStack AI</h3>
            <p className="footer__description" style={{ color: 'var(--ifm-font-color-secondary)' }}>
              Autonomous coding, artificial intelligence engineering, and modern web development.
              Built to document the journey and feature interactive AI agents.
            </p>
            <div className="margin-top--md">
              <a
                href="https://www.linkedin.com/in/victor-j-8268a2266/"
                target="_blank"
                rel="noopener noreferrer"
                className="button button--primary button--sm"
              >
                Let's Connect on LinkedIn
              </a>
            </div>
          </div>
          <div className="col col--8">
            {links}
          </div>
        </div>
        {(logo || copyright) && (
          <div className="footer__bottom text--center margin-top--xl" style={{ borderTop: '1px solid var(--premium-border-color)', paddingTop: '2rem' }}>
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {copyright}
            <div className="margin-top--sm" style={{ fontSize: '0.85rem', color: 'var(--ifm-font-color-secondary)' }}>
              Open to work and collaboration.
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
