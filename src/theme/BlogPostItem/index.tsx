/**
 * Wrapper so the blog list/sidebar shows list_title (e.g. "Devlog: 2026-02-05")
 * while the post page keeps the descriptive title.
 */
import React from 'react';
import DefaultBlogPostItem from '@theme-original/BlogPostItem';
import type { Props } from '@theme/BlogPostItem';

type PropsWithFrontMatter = Props & {
  frontMatter?: { list_title?: string };
};

export default function BlogPostItem(props: PropsWithFrontMatter): JSX.Element {
  const { metadata, frontMatter, truncated } = props;
  if (!metadata) {
    return <DefaultBlogPostItem {...props} />;
  }
  const listTitle =
    truncated && frontMatter?.list_title
      ? frontMatter.list_title
      : metadata.title ?? '';
  const safeMetadata = { ...metadata, title: listTitle };
  return <DefaultBlogPostItem {...props} metadata={safeMetadata} />;
}
