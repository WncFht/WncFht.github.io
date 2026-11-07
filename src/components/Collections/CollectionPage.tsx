import {useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useContentCatalog from '../../hooks/useContentCatalog';
import {postsInCollection} from '../../utils/contentCatalog';
import type {CollectionDefinition} from '../../types/content';
import PostPreview from '../PostPreview';
import styles from './styles.module.css';

export default function CollectionPage({collection}: {collection: CollectionDefinition}): ReactNode {
  const {posts} = useContentCatalog();
  const entries = postsInCollection(posts, collection);
  const [kind, setKind] = useState('all');
  const visible = entries.filter((post) => kind === 'all' || post.kind === kind);
  const years = [...new Set(visible.map((post) => post.date?.slice(0, 4) ?? '持续更新'))];
  return (
    <Layout title={collection.title} description={collection.description}>
      <main className={`container ${styles.main}`}>
        <Link to="/collections" className={styles.back}>← 全部专题</Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>专题合集 · {entries.length} 篇</p>
          <Heading as="h1">{collection.title}</Heading>
          <p className={styles.description}>{collection.description}</p>
        </header>
        {entries.length > 0 && <div className="collection-filters" aria-label="文章类型">{[['all', '全部'], ['note', '研究笔记'], ['blog', '技术博客']].map(([id, label]) => <button className="reading-button" type="button" key={id} aria-pressed={kind === id} onClick={() => setKind(id)}>{label}</button>)}</div>}
        {entries.length > 0 ? <>
          <p className="collection-count" role="status">{visible.length} 篇内容</p>
          {years.map((year) => <section key={year} aria-label={`${year} 年文章`}>
            <Heading as="h2" className="collection-year">{year}</Heading>
            {visible.filter((post) => (post.date?.slice(0, 4) ?? '持续更新') === year).map((post) => <PostPreview key={post.id} post={post} headingLevel="h3" />)}
          </section>)}
          {!visible.length && <p>这一类型还没有文章，可以切换到“全部”。</p>}
        </> : (
          <div className={styles.empty}>
            <Heading as="h2">这个专题还在整理中</Heading>
            <p>新的论文笔记和文章发布后，会汇集到这里。</p>
            <Link to="/collections">先看看其他专题 →</Link>
          </div>
        )}
      </main>
    </Layout>
  );
}
