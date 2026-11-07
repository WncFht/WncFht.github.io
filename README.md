# wncfht.github.io

Personal site & blog of Haotian Fang (方皓天), built with [Docusaurus](https://docusaurus.io/) and deployed to GitHub Pages via GitHub Actions.

## Local Development

```bash
npm install
npm run start
```

## Build

```bash
npm run build
```

## Deployment

Push to `master` — the `deploy` workflow builds and publishes to Pages automatically.

## 阅读组件与专题维护

五个阅读组件已适配为 React，来源与许可证见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

| 功能 | 页面与维护位置 |
| --- | --- |
| 目录高亮与分节进度 | 文档目录和博客目录；`src/theme/TOCItems/Tree.tsx` |
| 返回顶部与正文阅读百分比 | 全站页面；`src/components/BackToTop/` |
| 专题预览与合集 | `/collections`；`src/data/collections.ts` |
| 论文卡片 | 首页、笔记首页；`src/data/publications.tsx` |
| 文章预览 | 博客列表、首页、合集；`src/components/PostPreview/` |

### 新增文章与专题

博客的标题、摘要、日期和阅读时间来自 Docusaurus 元数据。列表分页和文章详情继续由原博客插件管理。笔记的阅读时间为基于正文中文字符数与英文词数的估算，不计代码块。

在 `src/data/collections.ts` 配置专题的名称和简介。当前提供 `agent`（Agent）和 `paper-weekly`（论文周报），文章或笔记只通过 front matter 指定归属：

```yaml
title: 文章标题
description: 用一句话说明这篇文章讨论的问题。
collections: [agent]
```

`collections` 支持多个专题 ID；未知 ID 会令构建失败，避免文章悄悄落到不存在的专题。站点入口页可设 `catalog: false`，使其不出现在最近文章和合集里。草稿和未列出文章不进入全站合集。标签已暂停：无需填写 `tags` 或维护 `blog/tags.yml`；当前内容已去掉标签，构建不生成标签页。`src/config/content.ts` 统一控制标签展示，博客和文档插件均停止读取标签字典。恢复时开启该开关、重新添加文章标签即可。专题不依赖标签。

文档笔记的日期可由 `last_update.date` 指定；未指定时不生成虚构日期。合集为空时显示“待更新”和空状态，不生成占位文章。

### 在 MDX 中使用论文卡片

```mdx
import PublicationCard from '@site/src/components/PublicationCard';
import {publications} from '@site/src/data/publications';

<PublicationCard publication={publications[0]} />
```

`publication` 包含 `id`、`title`、`url`、`authors`、`venue`，以及可选的 `role`、`abstract`、`links`。`authors` 可以是字符串或 JSX，`links` 是 `{label, href}` 数组。首页原有论文信息集中到 `src/data/publications.tsx`，不在各页面重复维护。

### 进度与验证

进度使用 Docusaurus 的正文容器，不计评论和页脚；正文完全进入视野时到达 100%。分节进度以视口上部的阅读线为依据，父节包含其子节。滚动事件通过 `requestAnimationFrame` 合并，图片与字体加载、窗口大小变化后会重新计算；页面切换时清理监听器和观察器。系统设置减少动态效果时，返回顶部立即跳转。

```bash
npm run typecheck
npm test
npm run build
npm run serve
```

使用构建后的页面检查 `/docs/intro`、`/blog`、`/collections` 及各专题。检查窄屏、深色模式、目录锚点、返回顶部、文章正文末尾的 100%，以及页面切换后是否只有一个返回顶部按钮。


## 字体与配色

正文、标题和代码中的英文使用 JetBrains Mono Variable，中文回退到霞鹜文楷屏幕阅读版（LXGW WenKai Screen）。字体通过 npm 包随站点托管，使用 `font-display: swap` 和 Unicode 分片；这两款字体无需访问外部字体 CDN。数学公式继续使用 KaTeX 自身的数学字体。

配色分为三层，组件使用语义变量，新增界面无需另写颜色字面量：

| 位置 | 负责内容 |
| --- | --- |
| `src/css/palette.css` | 深浅色的原始色值：背景、表面、正文、辅助文字、边框、强调色、状态色与语法色 |
| `src/css/theme.css` | 将色板映射到 Docusaurus、Infima 和本地搜索组件 |
| `src/theme/codeTheme.ts` | 将 Prism 语法类型映射到同一份色板 |

默认使用 One Dark Pro 风格的深色方案，同时保留浅色切换。正文和代码注释提高了亮度，浅色模式使用单独调暗的强调色。用户此前手动选择的深浅色会保留；要查看默认深色，可使用导航栏的主题按钮切换。调整字体请修改 `src/css/custom.css`，正文尺度与行距在 `src/css/reading.css`。来源与字体许可证见 `THIRD_PARTY_NOTICES.md`。

## 阅读体验增强

统一演示入口为 `/docs/reading-playground`。逐项来源、文件位置、验证范围与升级注意事项见 [阅读体验实现与维护](./research/2026-11-07-阅读体验实现与维护.md)。

| 功能 | 使用方式 |
| --- | --- |
| 正文与阅读设置 | 左下角切换纯净阅读；设置字号、宽度和行距，或恢复默认 |
| 宽表 | 保留原生 Markdown 表格和列对齐，支持横向滚动、TSV 复制与展开 |
| 手机目录 | 顶部目录显示当前章节，打开时定位当前项，点击后收起 |
| 图片与图组 | 独立图片段落自动生成图注；点击或 Enter 打开放大，Esc 关闭 |
| 代码 | 原有 Prism 高亮、行号、文件名；统一复制、换行与全屏，超过 24 行默认折叠 |
| Mermaid | 明暗主题联动、源码切换、全屏、拖动平移、滚轮缩放、适应窗口、SVG 下载 |
| 专题 | Agent 与论文周报；按年份分组，按内容类型筛选，文章末尾显示同专题导航 |
| 提示与强调 | 原生 admonitions、引用、details 折叠与 `mark`，共用站点色板 |
| 搜索 | 保留本地全文索引；`Cmd/Ctrl+K` 聚焦，方向键选择，Enter 打开 |
| 预览与分享 | 已收录站内文章的链接支持悬停/聚焦摘要；正文选中至少 4 个字符后复制段落链接 |

### 图片、提示块与系列元数据

Markdown 图片的 title 优先作为图注，缺少 title 时使用 alt；alt 仍保留为图片说明。同一段内连续的独立图片组成图组。混合正文或带超链接的图片保持原结构。MDX 中的 `<img data-no-zoom ... />` 可以关闭单张图片的查看器。远程图片应显式提供宽高；本地图片继续使用 Docusaurus 的尺寸处理。

```markdown
![方法图的可访问说明](/img/example.png "图 1：方法概览与来源。")
```

当前启用了 Docusaurus v4 兼容配置，带标题的提示块使用 directive 标题语法：

```markdown
:::tip[阅读顺序]

先读问题与结论，再比较方法和实验设置。
:::
```

周报期号和有顺序的系列使用可选的正整数元数据。`issue` 用于卡片展示；`series_order` 控制文章末尾同专题导航的顺序。未设置顺序的内容按日期浏览，不生成虚构的“上一课/下一课”。一个文章的顺序作用于其加入的所有专题，多个专题需要不同顺序时应扩展数据模型。不要复用同专题的顺序号。

```yaml
collections: [paper-weekly]
issue: 1
series_order: 1
```

阅读偏好保存在 `localStorage` 的 `site-reader-v1` 中；不登录、不上传。正文宽度受屏幕大小约束，宽屏设置在桌面或纯净阅读时更明显。段落链接包含选中文字的前 80 个字符与段落位置；打开后校验文字，文字变化或匹配不唯一时不会盲目跳转。它是阅读定位工具，不是永久文献引用。SVG 导出不嵌入字体，跨设备字形可能不同。

### 升级检查

更新 Docusaurus 时核对 `CodeBlock/Layout`、`Mermaid`、`TOCCollapsible` 与原生主题的接口，并运行类型检查、测试、构建；使用实验页复查弹层焦点、窄屏滚动、深浅主题、SPA 路由切换和搜索。`SearchBar` 的页脚提示样式依赖 easyops 的 CSS Modules 类名前缀，升级该插件时也要复查。
