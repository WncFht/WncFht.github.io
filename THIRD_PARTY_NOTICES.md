# 第三方来源与许可

## 当前站点与维护工具

本站基于 AstroPaper，保留根目录 [MIT 许可证](LICENSE)中的上游版权声明。当前页面与构建依赖见 `package.json`，维护方式见[开发指南](docs/development.md)。

图片查看器使用 PhotoSwipe；代码高亮、行号和复制采用 Expressive Code，换行开关采用 `@khaister/expressive-code-word-wrap`；公式使用 remark-math / rehype-mathjax，流程图使用 Mermaid。依赖及其许可证随 npm 包分发。当前实现边界见[架构](docs/architecture.md)，使用方法见[阅读指南](docs/reading.md)。

项目维护规则与工具改编自 WncFht/agent-maintenance 提交 `527af880f6feb0e352cae42b2c7601dc443b2b70`；MIT 原文保存在 [.agents/LICENSE.agent-maintenance](.agents/LICENSE.agent-maintenance)。采用范围与本地适配见[开发指南](docs/development.md#维护规则来源)。

## 设计参考与历史适配

早期 Docusaurus 版本曾将 Axi404/Axi-Theme 的目录、回顶、合集、论文卡片和文章预览改写为 React，并适配 Docusaurus 的 TOCItems 与 CodeBlock Layout。相关 React 路径已在迁移中移除；保留 [Axi Apache 2.0](licenses/Axi-Theme-APACHE-2.0.txt)与 [Docusaurus MIT](licenses/Docusaurus-MIT.txt)许可原文作为历史来源记录。

排版、导航、专题与分享设计参考 Tw93、潮流周刊、Niracler/Bokushi、Lowbee/Koharu、椒盐豆豉等。具体页面、组件入口、固定源码快照与许可证见[设计参考](docs/research/2026-11-09-阅读体验设计参考.md)。未复制 Bokushi 的 CC BY-NC-SA-4.0 或 Koharu 的 AGPL-3.0 实现代码，未引入这些站点的文章、图片或封面。`public/img/reading-example.svg` 为本站原创。

## 字体与配色

- 深色基础色参考 One Dark Pro，使用色值构建本站语义色板，未包含其 VS Code 扩展代码；历史来源许可见 [OneDark Pro MIT](licenses/OneDark-Pro-MIT.txt)。当前链接采用浅色蓝、深色橙，公式使用独立紫色。
- LXGW WenKai Screen 通过 `lxgw-wenkai-screen-webfont` 分发；字体与 Webfont 包许可分别见 [SIL OFL 1.1](licenses/LXGW-WenKai-OFL.txt)和 [MIT](licenses/LXGW-Webfont-MIT.txt)。
- JetBrains Mono 通过 `@fontsource-variable/jetbrains-mono` 分发，字体许可见 [SIL OFL 1.1](licenses/JetBrains-Mono-OFL.txt)。Inter 通过 `@fontsource-variable/inter` 分发，许可随 npm 包提供。
