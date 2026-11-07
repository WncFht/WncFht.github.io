import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import useContentCatalog from '../../hooks/useContentCatalog';
import {seriesPosts} from '../../utils/contentCatalog';

// Explicit collection membership follows Douchi's series approach; no tag inference.
export default function SeriesNav(): ReactNode {
  const {pathname} = useLocation();
  const {posts, collections} = useContentCatalog();
  const current = posts.find((post) => decodeURI(post.permalink).replace(/\/$/, '') === decodeURI(pathname).replace(/\/$/, ''));
  if (!current?.collections.length) return null;
  return <nav className="reading-series" aria-label="同专题文章" data-no-share>
    {collections.filter(({id}) => current.collections.includes(id)).map((collection) => {
      const entries = seriesPosts(posts, collection);
      const index = entries.findIndex(({id}) => id === current.id);
      const start = Math.max(0, Math.min(index - 2, entries.length - 5));
      const ordered = current.seriesOrder !== undefined;
      const previous = ordered && index > 0 && entries[index - 1].seriesOrder !== undefined ? entries[index - 1] : undefined;
      const next = ordered && entries[index + 1]?.seriesOrder !== undefined ? entries[index + 1] : undefined;
      return <section key={collection.id}>
        <div className="reading-series-header"><strong>{collection.title}</strong><Link to={`/collections/${collection.id}`}>全部 {entries.length} 篇 →</Link></div>
        <ol start={start + 1}>{entries.slice(start, start + 5).map((post) => <li key={post.id}>{post.id === current.id ? <span aria-current="page">{post.title} <small>当前文章</small></span> : <Link to={post.permalink}>{post.title}</Link>}</li>)}</ol>
        {(previous || next) && <div className="reading-series-adjacent">{previous && <Link to={previous.permalink} rel="prev">← 上一篇：{previous.title}</Link>}{next && <Link to={next.permalink} rel="next">下一篇：{next.title} →</Link>}</div>}
      </section>;
    })}
  </nav>;
}
