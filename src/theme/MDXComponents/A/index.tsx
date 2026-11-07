import {useEffect, useId, useState, type ReactNode} from 'react';
import OriginalA from '@theme-original/MDXComponents/A';
import type {Props} from '@theme/MDXComponents/A';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useContentCatalog from '../../../hooks/useContentCatalog';
import {internalPath} from '../../../utils/reading';

export default function ArticleLink(props: Props): ReactNode {
  const {posts} = useContentCatalog();
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();
  const [position, setPosition] = useState<{left: number; top: number; above: boolean} | null>(null);
  const id = useId();
  useEffect(() => {
    if (!position) return;
    const hide = () => setPosition(null);
    window.addEventListener('scroll', hide, {passive: true}); window.addEventListener('resize', hide);
    return () => {window.removeEventListener('scroll', hide); window.removeEventListener('resize', hide);};
  }, [position]);
  const show = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const width = Math.min(340, innerWidth * .75);
    const above = rect.top > 200;
    setPosition({left: Math.max(8, Math.min(innerWidth - width - 8, rect.left)), top: above ? rect.top - 8 : rect.bottom + 8, above});
  };
  const path = internalPath(props.href ?? '', siteConfig.url);
  const post = path && path !== decodeURI(pathname).replace(/\/$/, '') ? posts.find((entry) => decodeURI(entry.permalink).replace(/\/$/, '') === path) : undefined;
  if (!post) return <OriginalA {...props} />;
  return <span className="reading-link-preview" onPointerEnter={(event) => {if (event.pointerType !== 'touch') show(event.currentTarget);}} onPointerLeave={() => setPosition(null)} onFocus={(event) => show(event.currentTarget)} onBlur={() => setPosition(null)} onKeyDown={(event) => {if (event.key === 'Escape') setPosition(null);}}>
    <OriginalA {...props} aria-describedby={position ? id : props['aria-describedby']} />
    {position && <span id={id} className="reading-link-card" role="tooltip" style={{left: position.left, top: position.top, transform: position.above ? 'translateY(-100%)' : undefined}}><strong>{post.title}</strong><span>{post.description}</span><small>{post.kind === 'note' ? '研究笔记' : '技术博客'}{post.readingTime ? ` · 约 ${Math.ceil(post.readingTime)} 分钟` : ''}</small></span>}
  </span>;
}
