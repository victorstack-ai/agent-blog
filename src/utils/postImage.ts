/**
 * The absolute cover URL for the current blog post: the post's image asset or frontmatter image, else the site
 * social card. Shared by the post metadata and its JSON-LD so both name the same image.
 */
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

export const DEFAULT_SOCIAL_CARD = 'img/vs-social-card.png';

export function useAbsolutePostImage(): string {
  const {assets, metadata} = useBlogPost();
  const {withBaseUrl} = useBaseUrlUtils();
  const image = assets?.image ?? metadata.frontMatter.image ?? DEFAULT_SOCIAL_CARD;
  return /^https?:\/\//.test(image) ? image : withBaseUrl(image, {absolute: true});
}

/**
 * Serializes JSON-LD for an inline <script>. Escaping "<" keeps a value such as "</script>" in a title or
 * description from closing the element early.
 */
export function jsonLdText(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
