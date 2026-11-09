# WncFht.github.io

Haotian Fang 的研究笔记站点，记录 LLM 训练、Agent 系统和具身智能方向的论文阅读、方法思考与实践。

站点基于 [AstroPaper](https://github.com/satnaing/astro-paper) 构建，使用 Astro 静态输出并部署到 GitHub Pages。

## 本地开发

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

质量检查：

```bash
npm run lint
npm run format:check
npm test
```

架构入口、依赖复用边界、扩展约定与审查结果见 [站点架构与维护约定](docs/architecture.md)。

文章位于 `src/content/posts/`，专题使用 `collection` 字段组织。目前维护 Agent 和论文周报两个专题，不维护额外 tag。交互内容使用 MDX 和局部客户端组件。

MOPD 论文文件保留在本地工作区，不属于公开站点内容，也不加入 Git 提交。
