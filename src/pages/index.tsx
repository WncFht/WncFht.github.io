import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const socialLinks = [
  {label: 'Email', href: 'mailto:fanghaotian@sjtu.edu.cn'},
  {label: 'GitHub', href: 'https://github.com/WncFht'},
  {label: '知乎', href: 'https://www.zhihu.com/people/fht-64'},
];

const interests = [
  {
    emoji: '🧠',
    title: 'LLM 全链路训练',
    desc: '预训练、后训练与强化学习的完整管线：奖励模型、PPO/GRPO、信用分配与训练效率。',
  },
  {
    emoji: '🤖',
    title: '具身智能',
    desc: '让模型在与环境的交互中学习和行动：embodied agents、VLA 与世界模型。',
  },
  {
    emoji: '⚙️',
    title: 'Agent 系统',
    desc: '记忆与上下文管理、工具调用、RAG 检索管线，以及支撑 agent 的基础设施。',
  },
];

const experiences = [
  {
    period: '至今',
    role: '科研助理 (RA)',
    org: 'SJTU APEX Lab',
    points: [
      <>
        在{' '}
        <Link to="https://apex.sjtu.edu.cn/">
          SJTU APEX 数据和知识管理实验室
        </Link>{' '}
        担任科研助理（Research Assistant）。
      </>,
    ],
  },
  {
    period: '2025.09 — 2026.09',
    role: '科研实习（生成式推荐）',
    org: '美团',
    points: [
      <>
        产出论文 <b>HCGRec: Hint-Conditioned Generative Recommendation with
        Semantic IDs</b>（<Link to="https://arxiv.org/pdf/2608.11980">CIKM 2026</Link>，
        <Link to="https://github.com/WncFht/HCGRec">code</Link>）。
      </>,
      '针对 Semantic ID 生成式推荐中 GRPO 的同质零奖励问题，提出 hint-conditioned 训练框架与 hint-aware credit decomposition。',
      '将 zero-advantage 训练样本占比从 70%+ 降至 20% 以下，HR@K / NDCG@K 多项指标持续提升。',
    ],
  },
  {
    period: '曾任',
    role: '科研助理 (RA)',
    org: 'X-Lance Lab, SJTU',
    points: [
      <>
        产出论文 <b>Empowering LLM Tool Invocation with a Tool-Call Reward
        Model</b>（<Link to="https://openreview.net/pdf?id=LnBEASInVr">ICLR 2026
        Poster</Link> 已接收）。
      </>,
      '提出 Tool-call Reward Model (TRM)：将过程奖励模型引入工具调用场景，设计「必要性×质量」标注准则与 turn-level 信用分配。',
      '在搜索问答与代码数学任务上，使 Qwen2.5 系列 1.5B–7B 模型一致超越 outcome-only RL 基线。',
    ],
  },
  {
    period: '2025.03 — 2025.09',
    role: 'Agent 开发工程师',
    org: '上海将然科技有限公司',
    points: [
      '构建通用型记忆与上下文控制中间件：异步记忆沉淀机制将短期会话转化为长期用户画像。',
      '设计多管道并行召回框架与「元数据 + 关键词 + 向量」三路混合检索，评测选定 bge-m3 / bge-reranker。',
      '自研覆盖版式分析、共指消解、时间处理的文档预处理管道，支撑高质量下游检索。',
    ],
  },
];

const projects = [
  {
    name: 'HCGRec',
    href: 'https://github.com/WncFht/HCGRec',
    role: 'First Author',
    desc: 'CIKM 2026 论文官方代码：hint-aware GRPO + constrained decoding 的 Semantic ID 生成式推荐。',
  },
  {
    name: 'devin2api',
    href: 'https://github.com/WncFht/devin2api',
    role: 'Owner',
    desc: 'Devin upstream → OpenAI Responses / Anthropic Messages 兼容 API 代理（Go）。',
  },
  {
    name: 'attention-calculator',
    href: 'https://github.com/WncFht/attention-calculator',
    role: 'Owner',
    desc: '「注意力计算器」复现与扩展：输入常数自动构造定积分恒等式证明，exact 模式输出 ℚ 上机器可检证书。',
  },
  {
    name: 'zcode-teardown',
    href: 'https://github.com/WncFht/zcode-teardown',
    role: 'Owner',
    desc: 'ZCode IDE 55 个版本逐版逆向拆解：签名快照、逐版 diff 与工作区上传机制分析报告。',
  },
  {
    name: 'Tencent-GRec',
    href: 'https://github.com/WncFht/Tencent-GRec',
    role: 'Owner',
    desc: '2025 腾讯广告算法大赛 TAAC：全模态生成式推荐，HSTU 复现优化 + 混合负采样。',
  },
];

function ProfileCard() {
  return (
    <section className={styles.profile}>
      <img
        className={styles.avatar}
        src="https://github.com/WncFht.png"
        alt="Haotian Fang's avatar"
      />
      <div>
        <Heading as="h1" className={styles.name}>
          方皓天 <span className={styles.enName}>Haotian Fang</span>
        </Heading>
        <p className={styles.identity}>
          B.Eng. Student @ UM-SJTU Joint Institute, Shanghai Jiao Tong University
        </p>
        <div className={styles.socials}>
          {socialLinks.map((s) => (
            <Link key={s.label} className={styles.socialLink} to={s.href}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutMe() {
  return (
    <section className={styles.section}>
      <Heading as="h2">About Me</Heading>
      <p>
        我是上海交通大学密西根学院（UM-SJTU Joint
        Institute）电子与计算机工程专业的本科生。我的兴趣集中在大语言模型的全链路训练（预训练、后训练、强化学习）与具身智能。
      </p>
      <p>
        目前在{' '}
        <Link to="https://apex.sjtu.edu.cn/">
          SJTU APEX 数据和知识管理实验室
        </Link>{' '}
        担任科研助理。此前我在美团做生成式推荐方向的科研实习，在 SJTU X-Lance
        实验室担任科研助理，并在上海将然科技有限公司担任过 Agent
        开发工程师。研究成果包括一篇 CIKM 2026 论文（HCGRec）和一篇 ICLR 2026
        Poster（Tool-call Reward Model）。
      </p>
    </section>
  );
}

function ResearchInterests() {
  return (
    <section className={styles.section}>
      <Heading as="h2">Research Interests</Heading>
      <div className={styles.cardGrid}>
        {interests.map((it) => (
          <div key={it.title} className={styles.card}>
            <div className={styles.cardEmoji}>{it.emoji}</div>
            <Heading as="h3" className={styles.cardTitle}>
              {it.title}
            </Heading>
            <p className={styles.cardDesc}>{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className={styles.section}>
      <Heading as="h2">Experience</Heading>
      <div className={styles.timeline}>
        {experiences.map((e) => (
          <div key={e.org} className={styles.timelineItem}>
            <div className={styles.timelinePeriod}>{e.period}</div>
            <div className={styles.timelineBody}>
              <Heading as="h3" className={styles.timelineTitle}>
                {e.role} · {e.org}
              </Heading>
              <ul>
                {e.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className={styles.section}>
      <Heading as="h2">Selected Open-Source Projects</Heading>
      <div className={styles.cardGrid}>
        {projects.map((p) => (
          <Link key={p.name} to={p.href} className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <span className={styles.projectName}>{p.name}</span>
              <span className={styles.projectRole}>{p.role}</span>
            </div>
            <p className={styles.cardDesc}>{p.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className={styles.section}>
      <Heading as="h2">Education</Heading>
      <div className={styles.eduItem}>
        <Heading as="h3" className={styles.timelineTitle}>
          上海交通大学 · 密西根学院（UM-SJTU Joint Institute）
        </Heading>
        <p>
          电子与计算机工程（Electrical and Computer Engineering）本科 ·
          2024.09 — 2028.06（预计）
        </p>
        <p>全国中学生物理竞赛浙江省一等奖（2024）</p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Haotian Fang — SJTU UM-SJTU JI undergraduate, working on LLM training and embodied AI">
      <main className={clsx('container', styles.main)}>
        <ProfileCard />
        <AboutMe />
        <ResearchInterests />
        <Experience />
        <Projects />
        <Education />
      </main>
    </Layout>
  );
}
