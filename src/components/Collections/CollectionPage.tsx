import type {ReactNode} from 'react';
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
  return (
    <Layout title={collection.title} description={collection.description}>
      <main className={`container ${styles.main}`}>
        <Link to="/collections" className={styles.back}>← 全部专题</Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>专题合集 · {entries.length} 篇</p>
          <Heading as="h1">{collection.title}</Heading>
          <p className={styles.description}>{collection.description}</p>
        </header>
        {entries.length > 0 ? entries.map((post) => <PostPreview key={post.id} post={post} />) : (
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
