# 第三方来源与许可

以下 React 组件参考并适配自 Axi404/Axi-Theme[^axi-theme] 的 Astro 组件，原项目采用 Apache License 2.0[^axi-license]。许可证全文保存在 `licenses/Axi-Theme-APACHE-2.0.txt`。

| 原组件 | 当前实现 |
| --- | --- |
| `src/components/pages/TOC.astro` | `src/theme/TOCItems/Tree.tsx`、`src/components/ReadingProgress/` |
| `src/components/pages/BackToTop.astro` | `src/components/BackToTop/` |
| `src/components/pages/CollectionPreview.astro` | `src/components/CollectionPreview/`、`src/components/Collections/` |
| `src/components/user/PublicationCard.astro` | `src/components/PublicationCard/` |
| `src/components/pages/PostPreview.astro` | `src/components/PostPreview/` |

适配日期：2026-11-07。改动包括将 Astro 组件改为 React、Tailwind 样式改为 CSS Modules 与 Docusaurus 主题变量、使用 Docusaurus 内容元数据生成合集，并重写滚动进度逻辑以支持页面切换与事件清理。未引入原站文章、封面、头像或其他内容素材。

`src/theme/TOCItems/index.tsx` 改编自 Docusaurus theme-classic 的同名组件，保留标题过滤逻辑，将高亮更新交由 React 管理。原组件版权归 Facebook, Inc. and its affiliates，采用 MIT 许可证；全文见 `licenses/Docusaurus-MIT.txt`。

### 字体与配色

- 深色基础色和强调色参考 One Dark Pro[^one-dark-pro]，正文、辅助文字及浅色配色按网页阅读需要调整。使用色值构建本站语义色板，不包含其 VS Code 扩展代码。上游许可证见 `licenses/OneDark-Pro-MIT.txt`。
- LXGW WenKai Screen 通过 `lxgw-wenkai-screen-webfont`[^lxgw-webfont] 分发。字体采用 SIL Open Font License 1.1，Webfont 包采用 MIT；许可证分别保存在 `licenses/LXGW-WenKai-OFL.txt` 和 `licenses/LXGW-Webfont-MIT.txt`。
- JetBrains Mono[^jetbrains-mono] 通过 `@fontsource-variable/jetbrains-mono` 分发，字体采用 SIL Open Font License 1.1；许可证保存在 `licenses/JetBrains-Mono-OFL.txt`。

### 参考文献

[^axi-theme]: Axi404. Axi-Theme. GitHub. [源码仓库](https://github.com/Axi404/Axi-Theme)。
[^axi-license]: Axi404. Axi-Theme LICENSE. GitHub. [Apache License 2.0](https://github.com/Axi404/Axi-Theme/blob/main/LICENSE)。

[^one-dark-pro]: Binaryify. One Dark Pro. GitHub. [源码与色板](https://github.com/Binaryify/OneDark-Pro)。
[^lxgw-webfont]: Chawye Hsu. LXGW WenKai Webfont. GitHub. [Webfont 源码](https://github.com/chawyehsu/lxgw-wenkai-webfont)。
[^jetbrains-mono]: JetBrains. JetBrains Mono. GitHub. [字体源码](https://github.com/JetBrains/JetBrainsMono)。
