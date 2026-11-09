/** Own page-scoped listeners and dispose them before Astro replaces the DOM. */
export function onPageLoad(setup: (signal: AbortSignal) => void) {
  let controller: AbortController | undefined;

  document.addEventListener("astro:page-load", () => {
    controller?.abort();
    controller = new AbortController();
    setup(controller.signal);
  });
  document.addEventListener("astro:before-swap", () => controller?.abort());
}
