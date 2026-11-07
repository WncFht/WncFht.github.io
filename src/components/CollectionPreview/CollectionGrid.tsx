import type {ReactNode} from 'react';
import useContentCatalog from '../../hooks/useContentCatalog';
import {postsInCollection} from '../../utils/contentCatalog';
import CollectionPreview from './index';
import styles from './styles.module.css';

export default function CollectionGrid(): ReactNode {
  const {collections, posts} = useContentCatalog();
  return <div className={styles.grid}>{collections.map((collection) => (
    <CollectionPreview key={collection.id} collection={collection} posts={postsInCollection(posts, collection)} />
  ))}</div>;
}
