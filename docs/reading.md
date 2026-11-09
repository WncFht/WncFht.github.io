# 文章与阅读功能

本页面向文章作者与阅读组件维护者。文章位于 `src/content/posts/`，普通内容用 Markdown，需要局部组件时使用 MDX。当前演示内容是[阅读组件实验页源文](../src/content/posts/reading-playground.mdx)；本地预览地址为 `/posts/reading-playground`。

## 文章元数据

```yaml
---
title: 示例研究笔记
pubDatetime: 2026-11-09T00:00:00+08:00
description: 这篇笔记讨论的问题与结论。
collection: agent
kind: research-note
---
```

`title`、`description`、`pubDatetime` 必填，完整约束由[内容 schema](../src/content.config.ts)定义。专题由[共享定义](../src/data/collections.ts)维护；`collection` 为可选的单专题归属。新增专题先更新共享定义，列表、详情与 schema 会共同使用它。

`draft: true` 的文章不发布。生产构建按站点或文章时区的日历日期过滤未来文章，开发时展示非草稿的定时文章；静态站需要在发布日期重新构建。更新时间使用 `modDatetime`。当前不使用旧站的 `collections`、`issue`、`series_order` 字段组织页面。

## 数学公式

行内公式使用 `$p(y \mid x)$`，保持在同一段内；行间公式用独立的 `$$` 包围。MathJax 在构建时输出 SVG，行间公式按文章编号，行内公式不编号。

```latex
$$
\begin{aligned}
p(y \mid x) &= \frac{p(x,y)}{p(x)} \\
\log p(y \mid x) &= \log p(x,y)-\log p(x)
\end{aligned}
$$
```

`aligned` 多行共用一个编号。使用 `\tag{A}` 指定编号，`\notag` 取消该条编号；局部颜色可用 `\textcolor{#c2410c}{x}`。默认公式使用独立的紫色变量，链接沿用浅色蓝、深色橙；配色归 [theme.css](../src/styles/theme.css)。数学段落横向溢出时在自身区域滚动。

不要用独立段落包裹本应行内的公式。行内 MathJax 容器和 SVG 的行内布局由 [typography.css](../src/styles/typography.css)维护，调整全局 SVG 样式后需要复查。

## 代码与自然语言

代码围栏标注语言，例如 `python`。Expressive Code 提供高亮、复制与行号；代码默认不换行，读者可通过每个代码块右上角的按钮切换换行。

自然语言 Prompt 使用 `text` 或 `plaintext`：默认换行、不显示行号，仍可手动切换。渲染规则归 [ec.config.mjs](../ec.config.mjs)，不在文章脚本中另建复制或高亮逻辑。

Frames 0.44.3 与换行插件共用工具栏时，需要将复制事件限定到带 `data-code` 的按钮。兼容处理和回归测试已放在同一配置与测试入口，升级后先核对上游是否已修复，再决定是否移除。

## 图片、表格与图表

图片提供有意义的 alt，远程图片或手写标签尽量提供宽高，避免加载后布局变化。未包在链接中的正文图片可点击或用 Enter / 空格打开 PhotoSwipe，方向键切图、Esc 关闭并返回焦点；带链接图片沿用链接行为。当前没有从 title 自动生成图注或按段落自动推断图组的插件。

普通表格使用 Markdown 表格，构建时自动增加可聚焦的横向滚动容器。复杂列、合并单元格或公式表格保持原结构，不自动转手机卡片、排序或转换数据。需要说明来源或单位时直接写在邻近正文。

Mermaid 使用 `mermaid` 代码围栏。构建保留源文，浏览器按需加载渲染器；明暗主题变化后重新绘制。加载或解析失败时保留源文。当前没有图表全屏、平移缩放或下载控件。

提示块使用 `> [!TIP]` 等 GitHub 风格语法，折叠内容可使用标准 HTML `details`。新增内容组件先核对现有插件和语义，具体设计参考见[设计调研](research/2026-11-09-阅读体验设计参考.md)。

## 定位、搜索与验证

目录消费 Astro 的标题信息。宽屏使用侧栏，窄屏通过浮动按钮打开目录；活动章节、进度和返回顶部均跟随当前页面。标题的 `#` 链接可复制章节地址。Pagefind 搜索在构建后生成，开发环境需要先执行一次完整构建。

当前不提供纯净模式、字号与列宽偏好、段落分享、站内悬停预览或表格与代码全屏。旧实现的这些能力不能从历史调研推断为现有功能。

修改渲染或样式后运行[开发指南](development.md#检查与-git-hooks)中的相关检查，再使用演示页检查明暗主题、窄屏、行内公式、编号、复制与换行、图片键盘与焦点、Mermaid、搜索和客户端往返导航。自动化覆盖范围由测试本身决定，浏览器检查不能由构建通过代替。
