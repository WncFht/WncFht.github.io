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

默认使用 One Dark Pro 风格的深色方案，同时保留浅色切换。正文和代码注释提高了亮度，浅色模式使用单独调暗的强调色。用户此前手动选择的深浅色会保留；要查看默认深色，可使用导航栏的主题按钮切换。调整字体和行距请修改 `src/css/custom.css`。来源与字体许可证见 `THIRD_PARTY_NOTICES.md`。
