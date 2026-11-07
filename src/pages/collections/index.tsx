import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CollectionGrid from '../../components/CollectionPreview/CollectionGrid';
import RecentPosts from '../../components/PostPreview/RecentPosts';
import styles from '../../components/Collections/styles.module.css';

export default function Collections(): ReactNode {
  return (
    <Layout title="专题合集" description="按研究方向浏览论文笔记与技术文章。">
      <main className={`container ${styles.main}`}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>COLLECTIONS</p>
          <Heading as="h1">专题合集</Heading>
          <p className={styles.description}>围绕同一个问题，把论文阅读、方法思考和实践记录放在一起。</p>
        </header>
        <CollectionGrid />
        <Heading as="h2">最近发布</Heading>
        <RecentPosts />
      </main>
    </Layout>
  );
}
