/**
 * Swizzled: ensure blog post pages get per-post OG/Twitter card meta (absolute URLs)
 * so shared links show the post title, description, and image — not the homepage.
 */
import React, {type ReactNode} from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function BlogPostPageMetadata(): ReactNode {
  const {assets, metadata} = useBlogPost();
  const {title, description, date, tags, authors, frontMatter, permalink} = metadata;
  const {siteConfig} = useDocusaurusContext();
  const {url: siteUrl, baseUrl} = siteConfig;

  const {keywords} = frontMatter;
  const image = assets?.image ?? frontMatter.image;

  // Absolute URL for this post (LinkedIn/Twitter need this for correct preview)
  const absolutePostUrl = `${siteUrl}${baseUrl}${permalink.replace(/^\//, '')}`;
  // Absolute image URL: use as-is if already full URL, else resolve with baseUrl
  const absoluteImage =
    typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))
      ? image
      : image
        ? `${siteUrl}${baseUrl}${typeof image === 'string' ? image.replace(/^\//, '') : ''}`
        : undefined;

  const pageTitle = frontMatter.title_meta ?? title;
  const pageDescription = description ?? undefined;

  return (
    <>
      <PageMetadata
        title={pageTitle}
        description={pageDescription}
        keywords={keywords}>
        {/* Explicit per-post OG/Twitter so crawlers see post, not homepage */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={absolutePostUrl} />
        <meta property="og:title" content={pageTitle} />
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        {absoluteImage && (
          <>
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="627" />
            <meta name="twitter:image" content={absoluteImage} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        {pageDescription && <meta name="twitter:description" content={pageDescription} />}
        <meta property="article:published_time" content={date} />
        {authors.some((author) => author.url) && (
          <meta
            property="article:author"
            content={authors
              .map((author) => author.url)
              .filter(Boolean)
              .join(',')}
          />
        )}
        {tags.length > 0 && (
          <meta
            property="article:tag"
            content={tags.map((tag) => tag.label).join(',')}
          />
        )}
      </PageMetadata>
    </>
  );
}
