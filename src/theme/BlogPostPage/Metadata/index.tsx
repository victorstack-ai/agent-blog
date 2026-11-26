/**
 * Swizzled: per-post Open Graph and Twitter card metadata with an absolute image URL, so shared links show the
 * post title, description and cover instead of the site defaults.
 *
 * PageMetadata emits the title, description and image tags (og:title, og:description, og:image, twitter:image and
 * their twitter: twins). The site layout emits og:url (canonical) and twitter:card. Children are plain <meta>
 * elements only: react-helmet-async drops tags wrapped in a Fragment inside <Head>.
 * The BlogPosting JSON-LD lives in the swizzled BlogPostPage/StructuredData, so it is emitted once.
 */
import React, {type ReactNode} from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {useAbsolutePostImage} from '@site/src/utils/postImage';

export default function BlogPostPageMetadata(): ReactNode {
  const {metadata} = useBlogPost();
  const {title, description, date, tags, authors, frontMatter} = metadata;
  const image = useAbsolutePostImage();
  const authorUrls = authors.map((author) => author.url).filter(Boolean);

  return (
    <PageMetadata
      title={frontMatter.title_meta ?? title}
      description={description}
      keywords={frontMatter.keywords}
      image={image}>
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={date} />
      {authorUrls.length > 0 && <meta property="article:author" content={authorUrls.join(',')} />}
      {tags.length > 0 && <meta property="article:tag" content={tags.map((tag) => tag.label).join(',')} />}
    </PageMetadata>
  );
}
