import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import {articleProgress, sectionProgress, type SectionProgress} from './metrics';

interface ReadingState {
  pathname: string;
  progress: number;
  shown: boolean;
  hasArticle: boolean;
  sections: Record<string, SectionProgress>;
}

const initial: ReadingState = {pathname: '', progress: 0, shown: false, hasArticle: false, sections: {}};
const ReadingContext = createContext<ReadingState>(initial);

export function useReadingProgress(): ReadingState {
  return useContext(ReadingContext);
}

export function ReadingProgressProvider({children}: {children: ReactNode}): ReactNode {
  const {pathname} = useLocation();
  const [state, setState] = useState<ReadingState>(initial);

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const main = document.querySelector('main');

    const measure = () => {
      frame = 0;
      if (disposed) return;
      // Use the article body, excluding comments, related posts, pagination and the footer.
      const article = document.querySelector<HTMLElement>('.theme-doc-markdown, #__blog-post-container');
      const content = article ?? main;
      if (!content) {
        setState({...initial, pathname});
        return;
      }
      const scrollY = window.scrollY;
      const rect = content.getBoundingClientRect();
      const top = rect.top + scrollY;
      const body = article?.querySelector<HTMLElement>('[data-reading-body]');
      const bottom = (body?.getBoundingClientRect().bottom ?? rect.bottom) + scrollY;
      const navbar = document.querySelector('.navbar')?.getBoundingClientRect().height ?? 0;
      const progress = articleProgress(scrollY, top, bottom - top, window.innerHeight, navbar);
      const readingLine = scrollY + navbar + Math.max(0, window.innerHeight - navbar) * 0.3;
      const headings = article ? Array.from(article.querySelectorAll<HTMLElement>('h2[id], h3[id], h4[id], h5[id], h6[id]')).map((heading) => ({
        id: heading.id,
        level: Number(heading.tagName.slice(1)),
        top: heading.getBoundingClientRect().top + scrollY,
      })) : [];
      const next: ReadingState = {
        pathname,
        progress,
        shown: scrollY > 300,
        hasArticle: Boolean(article),
        sections: sectionProgress(headings, readingLine, bottom, progress === 100),
      };
      setState((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };

    const schedule = () => {
      if (!disposed && !frame) frame = window.requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    main?.addEventListener('load', schedule, true);

    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    if (main) resizeObserver?.observe(main);
    const article = document.querySelector('.theme-doc-markdown, #__blog-post-container');
    if (article) resizeObserver?.observe(article);
    const mutationObserver = new MutationObserver(schedule);
    if (main) mutationObserver.observe(main, {childList: true, subtree: true});
    void document.fonts?.ready.then(schedule);
    schedule();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      main?.removeEventListener('load', schedule, true);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return <ReadingContext.Provider value={state.pathname === pathname ? state : {...initial, pathname}}>{children}</ReadingContext.Provider>;
}
