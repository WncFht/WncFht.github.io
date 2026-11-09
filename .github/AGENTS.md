# CI 与部署

沿用已有 CI 和 GitHub Pages 部署入口。本地与 CI 复用 `package.json` 的检查命令；维护检查不能替代 Astro 构建和内容渲染测试。

依赖安装使用 `npm ci` 和带哈希的 Python 锁文件。Notes 冻结检查的基线从事件的 PR base 或 push before 取得，获取相应 Git 历史，不让待审配置自行选择基线。

涉及工作流改动时验证有效输入和失败传播。仅本地执行通过时，不宣称远端 required checks 或部署已完成。
