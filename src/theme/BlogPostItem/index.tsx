import type {ReactNode} from 'react';
import OriginalBlogPostItem from '@theme-original/BlogPostItem';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import type {Props} from '@theme/BlogPostItem';
import PostPreview from '../../components/PostPreview';
import {toCatalogPost} from '../../utils/contentCatalog';

export default function BlogPostItem(props: Props): ReactNode {
  const {isBlogPostPage, metadata} = useBlogPost();
  if (isBlogPostPage) return <OriginalBlogPostItem {...props} />;
  return <PostPreview post={toCatalogPost(metadata, 'blog')} />;
}
