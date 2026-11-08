export type ResearchInterest = { title: string; description: string };
export type Experience = {
  period: string;
  role: string;
  organization: string;
  points: string[];
};
export type Project = {
  name: string;
  href: string;
  role: string;
  description: string;
};

export const researchInterests: ResearchInterest[] = [
  { title: "LLM 全链路训练", description: "预训练与后训练的完整管线。" },
  { title: "具身智能", description: "Code as Policy、VLA 与世界模型。" },
  { title: "Agent 系统", description: "记忆与上下文管理、工具调用。" },
];

export const experiences: Experience[] = [
  {
    period: "至今",
    role: "科研助理（RA）",
    organization: "SJTU APEX 数据和知识管理实验室",
    points: ["围绕数据管理、知识管理与智能系统开展研究。"],
  },
  {
    period: "2025.09 — 2026.09",
    role: "科研实习（生成式推荐）",
    organization: "美团",
    points: [
      "产出 Learning from Unreachable Rewards: Hint-Conditioned Reinforcement Learning for Generative Recommendation（CIKM 2026，Co-first Author）。",
      "针对 Semantic ID 生成式推荐中 GRPO 的同质零奖励问题，提出 hint-conditioned 训练框架与 hint-aware credit decomposition。",
      "将 zero-advantage 训练样本占比从 70%+ 降至 20% 以下，HR@K / NDCG@K 多项指标持续提升。",
    ],
  },
  {
    period: "曾任",
    role: "科研助理（RA）",
    organization: "X-Lance Lab, SJTU",
    points: [
      "产出 Empowering LLM Tool Invocation with a Tool-Call Reward Model（ICLR 2026 Poster）。",
      "提出 Tool-call Reward Model（TRM）：将过程奖励模型引入工具调用场景，设计“必要性 × 质量”标注准则与 turn-level 信用分配。",
      "在搜索问答与代码数学任务上，使 Qwen2.5 系列 1.5B–7B 模型一致超越 outcome-only RL 基线。",
    ],
  },
  {
    period: "2025.03 — 2025.09",
    role: "Agent 开发工程师",
    organization: "上海将然科技有限公司",
    points: [
      "构建通用型记忆与上下文控制中间件：异步记忆沉淀机制将短期会话转化为长期用户画像。",
      "设计多管道并行召回框架与“元数据 + 关键词 + 向量”三路混合检索，评测选定 bge-m3 / bge-reranker。",
      "自研覆盖版式分析、共指消解、时间处理的文档预处理管道，支撑高质量下游检索。",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "HCGRec",
    href: "https://github.com/WncFht/HCGRec",
    role: "Co-first Author",
    description:
      "CIKM 2026 论文官方代码：hint-aware GRPO + constrained decoding 的 Semantic ID 生成式推荐。",
  },
  {
    name: "CARing",
    href: "https://github.com/zmlxzyh/CARing-Codes-Logs",
    role: "Co-first Author",
    description:
      "ICLR 2027 在投论文代码：medical Semantic IDs、coverage-reward GRPO 与 multi-positive supervision。",
  },
  {
    name: "devin2api",
    href: "https://github.com/WncFht/devin2api",
    role: "Owner",
    description:
      "Devin upstream 到 OpenAI Responses / Anthropic Messages 兼容 API 的 Go 代理。",
  },
  {
    name: "texlate",
    href: "https://github.com/WncFht/texlate",
    role: "Owner",
    description: "arXiv LaTeX 论文翻译工具：保留公式与引用，重编译中文 PDF。",
  },
  {
    name: "Tencent-GRec",
    href: "https://github.com/WncFht/Tencent-GRec",
    role: "Owner",
    description: "2025 腾讯广告算法大赛 TAAC：全模态生成式推荐与混合负采样。",
  },
];
