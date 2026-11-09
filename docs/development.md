# 开发与维护

本站使用 npm 和 Astro，维护工具为项目内 Python 环境。Node.js 最低版本归 `package.json`，CI 与 Docker 使用 Node.js 24；Python 需要 3.10 或更高版本。

## 本地准备

从仓库根目录执行：

```sh
npm ci
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --require-hashes -r requirements-dev.lock
npm run setup:maintenance
```

setup 安装本地 pre-commit / pre-push hooks，并创建被 Git 忽略的 `.claude/skills` 软链；不安装全局技能。已有自定义 hooksPath 或外来 hook、技能目录时会拒绝覆盖，应保留原入口并按下节接入两阶段顺序。项目 `.venv` 删除或移动后，重建环境并重新运行 setup。

启动与预览：

```sh
npm run dev
npm run build
npm run preview
```

构建包含 Astro 类型检查、静态生成与 Pagefind 索引。分享图字体首次构建需要访问 Google 字体服务。开发、容器与部署继续复用现有入口，不另设一套站点构建系统。

## 检查与 Git hooks

维护命令前激活 `.venv`。一次完整检查使用：

```sh
npm run check
```

它按顺序执行站点 ESLint、Prettier、Markdownlint、维护脚本 Ruff、文档契约、Node 渲染测试、Python 维护工具测试与实际 Astro 构建。任一命令失败即退出；修正后重跑相关检查，完整提交或推送前再跑全量入口。

| 变更              | 独立检查                                               |
| ----------------- | ------------------------------------------------------ |
| 页面或 TypeScript | `npm run lint`、`npm run build`                        |
| 文档、链接、技能  | `npm run lint:md`、`npm run check:docs`                |
| 格式              | `npm run format:check`；修复使用 `npm run format`      |
| 渲染配置          | `npm test` 加演示页浏览器验证                          |
| 维护脚本          | `npm run lint:maintenance`、`npm run test:maintenance` |

文档检查读取 Git 跟踪文件与未忽略新文件，跳过被忽略的本地论文、生成物、软链和冻结历史；检查本地目标、Markdown 章节锚点、三个维护技能的元数据与常驻入口预算。它不请求外部链接，不判断自然语言事实、公式语义或网站路由。Git index 的检查导出独立快照，不读取未暂存文档来掩盖将提交的错误。

Git 提交依次执行：

1. `git-format-staged` 格式化暂存内容，尝试把格式调整合并到工作区。
2. pre-commit 暂存隐藏未提交差异，运行 lint 与暂存快照契约检查。

不要用普通 `pre-commit install` 覆盖这个入口。若格式合并产生 warning，检查 `git diff` 和 `git diff --cached`，保留并处理工作区原文后重新暂存；检查失败不会替你完成提交。推送前执行 `npm run check`。本机 hook 记住安装时的 Python 环境，通常不需在每次提交前激活环境。

CI 在已有工作流中安装 npm 与锁定 Python 依赖，再调用同一个 `npm run check`。Notes 历史基线由事件确定，本地默认 HEAD；`workflow_call` 缺少事件基线时使用当前 HEAD。该检查防止常规误改，不是对恶意 PR 的隔离沙箱。远端检查和合并保护是否启用，仍由托管平台实际结果决定。

## 工具范围与升级

采用 Prettier、ESLint、Markdownlint、Ruff 与文档检查，各自负责实际存在的文件类型。当前没有另外引入 AutoCorrect、Taplo、ShellCheck、actionlint 或第二套检查调度器；中文表达按 [maintain-prose](../.agents/skills/maintain-prose/SKILL.md)审阅，现有 Astro / MDX 格式规则保留。

npm 新增维护工具使用精确版本，锁文件为 `package-lock.json`。Markdownlint 间接依赖 `re2js` 暂固定为修复漏洞的 `2.8.7`；升级上游后核对是否可移除 override。Python 依赖与哈希归 `requirements-dev.txt`、`requirements-dev.lock`。修改依赖后重新生成锁文件、审阅规则变化，并运行有效与违规输入、实际部分暂存、失败传播及产品构建测试。

可选 MPE 预览未作为产品或 CI 前置条件。已有 `scripts/crossnote-links.sh` 改为上游的显式副本同步入口；需要时从本机 agent-maintenance 源构建预览资源，再通过 `CROSSNOTE_SRC` 指定 `assets/.crossnote` 运行同步。根 `.crossnote/` 被忽略，不复制完整预览开发依赖。MPE 脚本权限与实际编辑器验收按上游指南核对。[^upstream]

## 维护规则来源

引入 agent-maintenance 提交 `527af880f6feb0e352cae42b2c7601dc443b2b70`[^upstream] 的三个维护技能、共享 references / templates、Agent Notes 规则、文档与冻结检查、两阶段 hook 安装器和相关行为测试。MIT 许可原文保留在 [LICENSE.agent-maintenance](../.agents/LICENSE.agent-maintenance)，本站原许可证保持独立。

目标适配包括：文档扫描使用 Git 文件集合以排除私有草稿；自动化参考改为项目 npm 入口；文档与 CI 的分工、篇幅预算及测试范围按本站调整；仅采用实际使用的工具，未复制上游的过程记录与 MPE 运行载荷。升级时按固定来源比较对应文件，保留这些适配并复跑测试。

### 参考文献

[^upstream]: WncFht. agent-maintenance. 接入提交 `527af880f6feb0e352cae42b2c7601dc443b2b70`. [README 与采用指南](https://github.com/WncFht/agent-maintenance/tree/527af880f6feb0e352cae42b2c7601dc443b2b70)。
