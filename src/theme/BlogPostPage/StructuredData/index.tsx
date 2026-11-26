/**
 * Swizzled: the post's single BlogPosting JSON-LD block. It replaces the built-in structured data so the author is
 * the same Person entity as the footer JSON-LD and the publisher is VictorStack.
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {PERSON_SCHEMA} from '@site/src/data/person';
import {jsonLdText, useAbsolutePostImage} from '@site/src/utils/postImage';

export default function BlogPostStructuredData(): ReactNode {
  const {metadata} = useBlogPost();
  const {title, description, date, tags, frontMatter, permalink} = metadata;
  const {siteConfig} = useDocusaurusContext();
  const {url: siteUrl, baseUrl} = siteConfig;
  const {keywords} = frontMatter;
  // permalink already includes baseUrl (e.g. /agent-blog/slug/).
  const postUrl = `${siteUrl}${permalink}`;
  const headline = frontMatter.title_meta ?? title;
  const image = useAbsolutePostImage();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    ...(description && {description}),
    url: postUrl,
    datePublished: date,
    ...(frontMatter.last_update?.date && {dateModified: frontMatter.last_update.date}),
    image: {'@type': 'ImageObject', url: image},
    ...(keywords && {keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords}),
    author: PERSON_SCHEMA,
    publisher: {
      '@type': 'Organization',
      name: 'VictorStack',
      url: `${siteUrl}${baseUrl}`,
      logo: {'@type': 'ImageObject', url: `${siteUrl}${baseUrl}img/vs-logo.png`},
    },
    mainEntityOfPage: {'@type': 'WebPage', '@id': postUrl},
    inLanguage: 'en',
    ...(tags.length > 0 && {articleSection: tags.map((tag) => tag.label).join(', ')}),
  };

  return (
    <Head>
      <script type="application/ld+json">{jsonLdText(jsonLd)}</script>
    </Head>
  );
}
