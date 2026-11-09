import { onPageLoad } from "./onPageLoad";

// Serialize renders because Mermaid's renderer and configuration are shared.
let renderQueue = Promise.resolve();
let renderId = 0;

onPageLoad(signal => {
  const diagrams = Array.from(
    document.querySelectorAll<HTMLElement>("#article [data-mermaid-source]")
  );
  if (!diagrams.length) return;
  let generation = 0;

  const render = () => {
    const current = ++generation;
    renderQueue = renderQueue
      .then(async () => {
        if (signal.aborted || current !== generation) return;
        const { default: mermaid } = await import("mermaid");
        if (signal.aborted || current !== generation) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme:
            document.documentElement.dataset.theme === "dark"
              ? "dark"
              : "default",
        });
        for (const diagram of diagrams) {
          if (signal.aborted || current !== generation) return;
          try {
            const { svg } = await mermaid.render(
              `mermaid-${++renderId}`,
              diagram.dataset.mermaidSource ?? ""
            );
            if (signal.aborted || current !== generation) return;
            diagram.innerHTML = svg;
            delete diagram.dataset.renderError;
          } catch {
            if (signal.aborted || current !== generation) return;
            diagram.textContent = diagram.dataset.mermaidSource ?? "";
            diagram.dataset.renderError = "";
          }
        }
      })
      .catch(() => {
        // Keep the original source visible if loading the renderer fails.
      });
  };

  window.addEventListener("site:theme-change", render, { signal });
  render();
});
