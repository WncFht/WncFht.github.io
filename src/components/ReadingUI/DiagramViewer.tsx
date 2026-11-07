import {useEffect, useRef, useState, type ReactNode} from 'react';
import type {PanzoomObject} from '@panzoom/panzoom';

export default function DiagramViewer({svg}: {svg: string}): ReactNode {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const api = useRef<PanzoomObject | null>(null);
  const fit = useRef(1);
  const [scale, setScale] = useState(100);
  const reset = () => {api.current?.pan(0, 0, {force: true}); api.current?.zoom(fit.current, {force: true});};
  useEffect(() => {
    let disposed = false;
    const el = canvas.current;
    const container = viewport.current;
    if (!el || !container) return;
    let observer: ResizeObserver | undefined;
    const wheel = (event: WheelEvent) => api.current?.zoomWithWheel(event);
    const changed = (event: Event) => setScale(Math.round((event as CustomEvent<{scale: number}>).detail.scale * 100));
    void import('@panzoom/panzoom').then(({default: Panzoom}) => {
      if (disposed) return;
      const image = el.querySelector('svg');
      const width = image?.viewBox.baseVal.width || 1000;
      const height = image?.viewBox.baseVal.height || 600;
      el.style.width = `${width}px`; el.style.height = `${height}px`;
      if (image) {image.style.width = '100%'; image.style.height = '100%'; image.style.maxWidth = 'none';}
      fit.current = Math.max(.05, Math.min(1, (container.clientWidth - 32) / width, (container.clientHeight - 32) / height));
      api.current = Panzoom(el, {canvas: true, startScale: fit.current, minScale: .05, maxScale: 8, animate: false});
      setScale(Math.round(fit.current * 100));
      el.addEventListener('panzoomchange', changed);
      container.addEventListener('wheel', wheel, {passive: false});
      observer = new ResizeObserver(() => {fit.current = Math.max(.05, Math.min(1, (container.clientWidth - 32) / width, (container.clientHeight - 32) / height)); reset();});
      observer.observe(container);
    });
    return () => {disposed = true; observer?.disconnect(); container.removeEventListener('wheel', wheel); el.removeEventListener('panzoomchange', changed); api.current?.destroy(); api.current = null;};
  }, [svg]);
  return <>
    <div className="reading-toolbar"><span>拖动平移 · 滚轮缩放 · + / − / 0</span><div><button className="reading-button" type="button" aria-label="缩小图表" onClick={() => api.current?.zoomOut()}>−</button><output aria-label="缩放比例">{scale}%</output><button className="reading-button" type="button" aria-label="放大图表" onClick={() => api.current?.zoomIn()}>＋</button><button className="reading-button" type="button" onClick={reset}>适应窗口</button><button className="reading-button" type="button" onClick={() => {api.current?.pan(0, 0); api.current?.zoom(1);}}>100%</button></div></div>
    <div ref={viewport} className="diagram-viewport" tabIndex={0} role="region" aria-label="可缩放图表，使用加减号缩放，0 适应窗口，方向键平移" onKeyDown={(event) => {
      const p = api.current;
      if (!p) return;
      const pos = p.getPan();
      if (event.key === '+' || event.key === '=') p.zoomIn();
      else if (event.key === '-') p.zoomOut();
      else if (event.key === '0') reset();
      else if (event.key === 'ArrowLeft') p.pan(pos.x - 30, pos.y);
      else if (event.key === 'ArrowRight') p.pan(pos.x + 30, pos.y);
      else if (event.key === 'ArrowUp') p.pan(pos.x, pos.y - 30);
      else if (event.key === 'ArrowDown') p.pan(pos.x, pos.y + 30);
      else return;
      event.preventDefault();
    }}><div ref={canvas} className="diagram-canvas" dangerouslySetInnerHTML={{__html: svg}} /></div>
  </>;
}
