import {useEffect, useState, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import {findSharedParagraph, normalizeText} from '../../utils/reading';
import CopyAction from './CopyAction';

// Tw93 weekly: paragraph position + text verification, with unique-text fallback.
export default function ParagraphShare(): ReactNode {
  const {pathname} = useLocation();
  const [selection, setSelection] = useState<{url: string; left: number; top: number} | null>(null);
  useEffect(() => {
    setSelection(null);
    const article = document.querySelector('.theme-doc-markdown [data-reading-body], #__blog-post-container [data-reading-body]');
    if (!article) return;
    let disposed = false;
    let target: HTMLElement | undefined;
    const blocks = Array.from(article.querySelectorAll<HTMLElement>('p,li')).filter((block) => !block.querySelector('p,li') && !block.closest('pre,table,figure,[data-no-share],.reading-toolbar'));
    const params = new URLSearchParams(location.hash.slice(1));
    const locate = () => {
      if (disposed) return;
      target?.classList.remove('reading-shared-target');
      const index = findSharedParagraph(blocks.map((block) => block.textContent ?? ''), Number(params.get('p')), params.get('q') ?? '');
      if (index >= 0) {target = blocks[index]; target.classList.add('reading-shared-target'); target.scrollIntoView({block: 'center'});}
    };
    const initial = window.setTimeout(locate, 0);
    if (params.has('q')) void document.fonts?.ready.then(locate);
    const hide = () => setSelection(null);
    const update = () => {
      const selected = window.getSelection();
      if (!selected || selected.isCollapsed || !selected.rangeCount) return hide();
      const range = selected.getRangeAt(0);
      const block = blocks.find((item) => item.contains(range.startContainer) && item.contains(range.endContainer));
      const quote = normalizeText(selected.toString()).slice(0, 80);
      if (!block || quote.length < 4) return hide();
      const rect = range.getBoundingClientRect();
      const url = new URL(location.href); url.hash = new URLSearchParams({p: String(blocks.indexOf(block) + 1), q: quote}).toString();
      setSelection({url: url.href, left: Math.max(8, Math.min(innerWidth - 170, rect.left)), top: Math.max(8, Math.min(innerHeight - 56, rect.bottom + 8))});
    };
    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', hide, {passive: true}); window.addEventListener('resize', hide);
    const hashChange = () => {const next = new URLSearchParams(location.hash.slice(1)); params.set('q', next.get('q') ?? ''); params.set('p', next.get('p') ?? ''); locate();};
    window.addEventListener('hashchange', hashChange);
    return () => {disposed = true; clearTimeout(initial); target?.classList.remove('reading-shared-target'); document.removeEventListener('selectionchange', update); window.removeEventListener('scroll', hide); window.removeEventListener('resize', hide); window.removeEventListener('hashchange', hashChange);};
  }, [pathname]);
  return selection ? <div className="reading-share-popover" style={{left: selection.left, top: selection.top}} onPointerDown={(event) => event.preventDefault()} data-no-share><CopyAction text={selection.url} label="复制此段链接" /></div> : null;
}
