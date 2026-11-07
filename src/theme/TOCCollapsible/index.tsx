// Native heading data and TOCItems are retained; mobile chapter entry inspired by Koharu.
import {useEffect, useRef, useState, type ReactNode} from 'react';
import TOCItems from '@theme/TOCItems';
import type {Props} from '@theme/TOCCollapsible';
import {useReadingProgress} from '../../components/ReadingProgress';

export default function TOCCollapsible({toc, className, minHeadingLevel, maxHeadingLevel}: Props): ReactNode {
  const {sections} = useReadingProgress();
  const current = toc.filter(({id}) => sections[id]?.started).at(-1);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (open) ref.current?.querySelector('[aria-current="location"]')?.scrollIntoView({block: 'nearest'});
  }, [open]);
  if (!toc.length) return null;
  return <details ref={ref} className={`reading-toc ${className ?? ''}`} onToggle={(e) => setOpen(e.currentTarget.open)}>
    <summary><span>目录</span><span>{current?.value.replace(/<[^>]*>/g, '') ?? '跳转到章节'}</span></summary>
    <div className="reading-toc-panel" onClick={(e) => {if ((e.target as HTMLElement).closest('a') && ref.current) ref.current.open = false;}}>
      <TOCItems toc={toc} minHeadingLevel={minHeadingLevel} maxHeadingLevel={maxHeadingLevel} />
    </div>
  </details>;
}
