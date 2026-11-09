import type PhotoSwipe from "photoswipe";
import "photoswipe/style.css";
import { onPageLoad } from "./onPageLoad";

onPageLoad(signal => {
  const article = document.getElementById("article");
  const progress = document.querySelector<HTMLElement>(
    "[data-reading-progress]"
  );
  if (!article || !progress) return;

  let frame = 0;
  const updateProgress = () => {
    frame = 0;
    const root = document.documentElement;
    const total = root.scrollHeight - root.clientHeight;
    progress.style.width = `${total > 0 ? (root.scrollTop / total) * 100 : 0}%`;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(updateProgress);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  addEventListener("scroll", schedule, { passive: true, signal });
  addEventListener("resize", schedule, { signal });
  updateProgress();

  const images = Array.from(article.querySelectorAll("img")).filter(
    image => !image.closest("a")
  );
  for (const image of images) {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute("aria-label", `查看图片：${image.alt || "文章插图"}`);
  }

  let viewer: PhotoSwipe | undefined;
  let opening = false;
  async function openImage(image: HTMLImageElement) {
    if (opening || viewer) return;
    opening = true;
    try {
      const [{ default: PhotoSwipe }] = await Promise.all([
        import("photoswipe"),
        image.decode().catch(() => undefined),
      ]);
      if (signal.aborted) return;
      const readyImages = images.filter(
        image => image.width > 0 && image.height > 0
      );
      const index = readyImages.indexOf(image);
      if (index < 0) return;
      image.focus();
      viewer = new PhotoSwipe({
        dataSource: readyImages.map(image => ({
          src: image.currentSrc || image.src,
          width: image.naturalWidth || image.width,
          height: image.naturalHeight || image.height,
          alt: image.alt,
          element: image,
        })),
        index,
        closeTitle: "关闭",
        zoomTitle: "缩放",
        arrowPrevTitle: "上一张",
        arrowNextTitle: "下一张",
        errorMsg: "图片无法加载",
        showHideAnimationType: "fade",
      });
      viewer.on("destroy", () => {
        viewer = undefined;
      });
      viewer.init();
    } finally {
      opening = false;
    }
  }

  const activate = (event: Event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !images.includes(image)) return;
    event.preventDefault();
    void openImage(image);
  };
  article.addEventListener("click", activate, { signal });
  article.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter" || event.key === " ") activate(event);
    },
    { signal }
  );
  signal.addEventListener("abort", () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    viewer?.destroy();
  });
});
