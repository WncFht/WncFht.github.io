import { globSync, readFileSync } from "node:fs";
import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import expressiveCode from "astro-expressive-code";
import { markdownOptions } from "./src/markdown.config.mjs";
import config from "./astro-paper.config";

// Subset the build-only CJK font to site text and article content.
const ogGlyphs = [
  ...new Set(
    [
      JSON.stringify(config.site),
      ...globSync("src/content/posts/**/*.{md,mdx}").map(path =>
        readFileSync(path, "utf8")
      ),
    ].join("")
  ),
];

export default defineConfig({
  site: config.site.url,
  redirects: {
    "/notes": { destination: "/posts/", status: 308 },
    "/docs/intro": { destination: "/posts/", status: 308 },
    "/docs/reading-playground": {
      destination: "/posts/reading-playground/",
      status: 308,
    },
    "/blog/2025/03/29/agent-memory-thoughts": {
      destination: "/posts/agent-memory-thoughts/",
      status: 308,
    },
  },
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !/\/archives\/?$/.test(page),
    }),
  ],
  i18n: {
    locales: ["zh-Hans"],
    defaultLocale: "zh-Hans",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified(markdownOptions),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Noto Sans SC",
      cssVariable: "--font-og",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [400, 700],
      styles: ["normal"],
      formats: ["woff"],
      options: { experimental: { glyphs: ogGlyphs } },
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
