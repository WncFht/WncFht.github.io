import {useEffect, useRef, useState, type ComponentProps, type ReactNode} from 'react';
import Modal from './Modal';
import CopyAction from './CopyAction';
import {tableAsTSV} from '../../utils/reading';

export default function ReadingTable(props: ComponentProps<'table'>): ReactNode {
  const [open, setOpen] = useState(false);
  const [edges, setEdges] = useState({left: false, right: false});
  const scroller = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setEdges({left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2});
    const observer = new ResizeObserver(measure);
    observer.observe(el); if (table.current) observer.observe(table.current);
    el.addEventListener('scroll', measure, {passive: true}); measure();
    return () => {observer.disconnect(); el.removeEventListener('scroll', measure);};
  }, []);
  const asText = () => tableAsTSV(Array.from(table.current?.rows ?? []).map((row) => Array.from(row.cells).map((cell) => cell.textContent ?? '')));
  const caption = typeof props['aria-label'] === 'string' ? props['aria-label'] : '数据表格';
  return <div className="reading-table-frame" data-left={edges.left} data-right={edges.right}>
    <div className="reading-toolbar" data-no-share><span>{edges.left || edges.right ? '左右滑动查看完整表格' : caption}</span><div><CopyAction text={asText} label="复制 TSV" /><button className="reading-button" type="button" onClick={() => setOpen(true)}>展开表格</button></div></div>
    <div ref={scroller} className="reading-table-scroll" tabIndex={0} role="region" aria-label={`${caption}，可横向滚动`}><table {...props} ref={table} /></div>
    <Modal open={open} onClose={() => setOpen(false)} title={caption} wide>
      <div className="reading-table-scroll reading-table-expanded" tabIndex={0} role="region" aria-label="完整数据表格"><table {...props} /></div>
    </Modal>
  </div>;
}
