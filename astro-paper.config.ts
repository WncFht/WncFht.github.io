import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://wncfht.github.io",
    title: "Haotian Fang",
    description: "Research notes on agents, LLM training and embodied AI.",
    author: "Haotian Fang",
    profile: "https://github.com/WncFht",
    ogImage: "default-og.jpg",
    lang: "zh-Hans",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 6,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/WncFht" },
    { name: "mail", url: "mailto:fanghaotian@sjtu.edu.cn" },
  ],
  shareLinks: [],
});
