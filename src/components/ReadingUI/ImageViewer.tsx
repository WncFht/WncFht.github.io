import {useEffect, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import type PhotoSwipe from 'photoswipe';

// PhotoSwipe API and Tw93's on-demand viewer pattern; no competing zoom plugin.
export default function ImageViewer(): ReactNode {
  const {pathname} = useLocation();
  useEffect(() => {
    let disposed = false;
    let opening = false;
    let viewer: PhotoSwipe | undefined;
    const article = document.querySelector('.theme-doc-markdown, #__blog-post-container');
    const images = Array.from(article?.querySelectorAll<HTMLImageElement>('img:not([data-no-zoom])') ?? []).filter((img) => !img.closest('a,button'));
    const oldAttributes = images.map((img) => ({img, role: img.getAttribute('role'), tab: img.getAttribute('tabindex'), label: img.getAttribute('aria-label')}));
    images.forEach((img) => {img.setAttribute('role', 'button'); img.tabIndex = 0; img.setAttribute('aria-label', `查看大图：${img.alt || '文章图片'}`); img.classList.add('reading-zoomable');});
    const open = async (target: HTMLImageElement) => {
      if (opening || viewer) return;
      opening = true;
      try {
        const gallery = target.closest('[data-gallery]');
        const group = gallery ? images.filter((img) => gallery.contains(img)) : [target];
        // Explicit small groups are loaded on user request, never eagerly on page load.
        await Promise.all(group.map((img) => img.decode().catch(() => undefined)));
        const {default: PhotoSwipeClass} = await import('photoswipe');
        if (disposed) return;
        const items = group.map((img) => ({src: img.currentSrc || img.src, width: img.naturalWidth || img.width || 1200, height: img.naturalHeight || img.height || 800, alt: img.alt, caption: img.closest('figure')?.querySelector('figcaption')?.textContent || img.title || img.alt}));
        viewer = new PhotoSwipeClass({dataSource: items, index: group.indexOf(target), bgOpacity: .94, loop: false, returnFocus: true, closeTitle: '关闭', zoomTitle: '缩放', arrowPrevTitle: '上一张', arrowNextTitle: '下一张', errorMsg: '图片加载失败，请稍后重试', showHideAnimationType: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'fade'});
        viewer.on('uiRegister', () => viewer?.ui?.registerElement({name: 'reading-caption', order: 9, isButton: false, appendTo: 'root', onInit: (el, pswp) => {
          const update = () => {el.textContent = items[pswp.currIndex]?.caption ?? '';};
          pswp.on('change', update); update();
        }}));
        viewer.on('destroy', () => {viewer = undefined; if (!disposed && target.isConnected) target.focus({preventScroll: true});});
        viewer.init();
      } catch {target.setAttribute('aria-label', '图片查看失败，请重试');}
      finally {opening = false;}
    };
    const handle = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
      const target = event.target;
      if (target instanceof HTMLImageElement && images.includes(target)) {event.preventDefault(); void open(target);}
    };
    article?.addEventListener('click', handle); article?.addEventListener('keydown', handle);
    return () => {
      disposed = true; viewer?.destroy();
      article?.removeEventListener('click', handle); article?.removeEventListener('keydown', handle);
      oldAttributes.forEach(({img, role, tab, label}) => {
        for (const [name, value] of [['role', role], ['tabindex', tab], ['aria-label', label]]) {if (value === null) img.removeAttribute(name!); else img.setAttribute(name!, value!);}
        img.classList.remove('reading-zoomable');
      });
    };
  }, [pathname]);
  return null;
}
