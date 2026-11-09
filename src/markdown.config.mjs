import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCallouts from "rehype-callouts";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import { rehypeTableWrapper } from "./utils/rehypeTableWrapper.js";
import { rehypeMermaid } from "./utils/rehypeMermaid.js";

/** Shared by Markdown, MDX, and the rendering regression tests. */
/** @type {import("@astrojs/markdown-remark").UnifiedProcessorOptions} */
export const markdownOptions = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [
    rehypeHeadingIds,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: { className: ["heading-link"], ariaLabel: "链接到本节" },
        content: { type: "text", value: "#" },
      },
    ],
    [rehypeMathjax, { tex: { tags: "all" }, svg: { fontCache: "local" } }],
    rehypeCallouts,
    rehypeTableWrapper,
    rehypeMermaid,
  ],
};
