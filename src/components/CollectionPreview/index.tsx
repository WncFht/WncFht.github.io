// Adapted from Axi404/Axi-Theme CollectionPreview.astro. See THIRD_PARTY_NOTICES.md.
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import type {CatalogPost, CollectionDefinition} from '../../types/content';
import styles from './styles.module.css';

export default function CollectionPreview({collection, posts}: {
  collection: CollectionDefinition;
  posts: readonly CatalogPost[];
}): ReactNode {
  return (
    <Link to={`/collections/${collection.id}`} className={styles.card}>
      <div className={styles.meta}><span>专题合集</span><span>{posts.length ? `${posts.length} 篇` : '待更新'}</span></div>
      <Heading as="h3" className={styles.title}>{collection.title}</Heading>
      <p className={styles.description}>{collection.description}</p>
      <span className={styles.action}>浏览专题 <span aria-hidden="true">→</span></span>
    </Link>
  );
}
