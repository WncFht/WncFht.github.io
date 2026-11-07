import type {ReactNode} from 'react';
import useContentCatalog from '../../hooks/useContentCatalog';
import PostPreview from './index';

export default function RecentPosts({limit = 3}: {limit?: number}): ReactNode {
  const {posts} = useContentCatalog();
  if (!posts.length) return <p>文章整理中，发布后会在这里显示。</p>;
  return <div>{posts.slice(0, limit).map((post) => <PostPreview key={post.id} post={post} headingLevel="h3" />)}</div>;
}
