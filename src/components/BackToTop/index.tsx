// Adapted from Axi404/Axi-Theme BackToTop.astro. See THIRD_PARTY_NOTICES.md.
import type {ReactNode} from 'react';
import {useReadingProgress} from '../ReadingProgress';
import styles from './styles.module.css';

export default function BackToTop(): ReactNode {
  const {shown, progress, hasArticle} = useReadingProgress();
  if (!shown) return null;
  const label = `${hasArticle ? '文章' : '页面'}阅读进度 ${progress}%，返回顶部`;
  return (
    <button
      type="button"
      className={`theme-back-to-top-button ${styles.button}`}
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})}>
      <svg viewBox="0 0 52 52" className={styles.ring} aria-hidden="true">
        <circle cx="26" cy="26" r="23" className={styles.track} />
        <circle cx="26" cy="26" r="23" className={styles.progress} pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} />
      </svg>
      <span aria-hidden="true" className={styles.percent}>{progress}<span className={styles.unit}>%</span></span>
      <svg viewBox="0 0 24 24" className={styles.arrow} aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
    </button>
  );
}
