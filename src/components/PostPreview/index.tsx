// Adapted from Axi404/Axi-Theme PostPreview.astro. See THIRD_PARTY_NOTICES.md.
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import type {CatalogPost} from '../../types/content';
import styles from './styles.module.css';
import {contentFeatures} from '../../config/content';

export interface Props {
  post: CatalogPost;
  headingLevel?: 'h2' | 'h3' | 'h4';
}

export default function PostPreview({post, headingLevel = 'h2'}: Props): ReactNode {
  const date = post.date ? new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
  }).format(new Date(post.date)) : undefined;

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span>{post.kind === 'note' ? '研究笔记' : '技术博客'}</span>
        {date && <time dateTime={post.date}>{date}</time>}
        {typeof post.readingTime === 'number' && Number.isFinite(post.readingTime) && (
          <span>约 {Math.max(1, Math.ceil(post.readingTime))} 分钟阅读</span>
        )}
      </div>
      <Heading as={headingLevel} className={styles.title}>
        <Link to={post.permalink}>
          {post.title}<span aria-hidden="true" className={styles.arrow}>↗</span>
        </Link>
      </Heading>
      {post.description && <p className={styles.description}>{post.description}</p>}
      {contentFeatures.tags && post.tags.length > 0 && (
        <ul className={styles.tags} aria-label="文章标签">
          {post.tags.map((tag) => <li key={tag.permalink}><Link to={tag.permalink}>{tag.label}</Link></li>)}
        </ul>
      )}
    </article>
  );
}
