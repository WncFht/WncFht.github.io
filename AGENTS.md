# 项目维护入口

本站使用 Astro 静态输出，源码在 `src/`，文章在 `src/content/posts/`。先读 [README](README.md)、[架构说明](docs/architecture.md)和受影响目录的入口，再修改实现。

- 成熟库优先承担渲染和交互；新增抽象须有实际消费者。删除旧实现时同步检查依赖、样式、声明、文案和测试。
- 项目配置、元数据和渲染规则复用已有入口，避免页面各自维护副本。
- 实现、文档和验证在同一变更更新；运行实际测试、类型检查与构建，静态检查不能替代产品行为验证。
- 文档归位使用 [maintain-docs](.agents/skills/maintain-docs/SKILL.md)，句级审阅使用 [maintain-prose](.agents/skills/maintain-prose/SKILL.md)。长期取舍按 [Agent Notes](.agents/notes/README.md)维护，局部机械或界面修改无需新建记录。
- 普通文档说明当前行为；研究材料保留核查日期、来源和未验证边界。移动页面须修复入链与章节锚点。
- `docs/papers/` 中被 Git 忽略的本地论文材料不加入提交、不发布，也不作为演示与 CI 的前置条件。
- `.agents/` 是项目维护规则事实源，`.claude/skills` 由 setup 生成；已有本机指令继续适用。

维护工具、两阶段 hooks 和验证入口见[开发指南](docs/development.md)。保留现有工具链，不使用普通 `pre-commit install` 覆盖 setup 安装的两阶段入口。

区域规则：[文档](docs/AGENTS.md)、[维护脚本](scripts/AGENTS.md)、[CI](.github/AGENTS.md)。
