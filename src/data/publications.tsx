import type {Publication} from '../components/PublicationCard';

// Metadata moved from the existing homepage; publication claims are unchanged.
export const publications: Publication[] = [
  {
    id: "hcgrec",
    title: "Learning from Unreachable Rewards: Hint-Conditioned Reinforcement Learning for Generative Recommendation",
    url: "https://arxiv.org/abs/2608.11980",
    authors: <>Kangning Zhang*, <b>Haotian Fang*</b>, Xukun Luo, Hao Yin, Yang Gao,
          Peng Yan, Weiwen Liu, Weinan Zhang, Yong Yu.</>,
    venue: "CIKM 2026 Poster",
    role: "Co-first Author",
    links: [{"label": "Code", "href": "https://github.com/WncFht/HCGRec"}],
  },
  {
    id: "caring",
    title: "Coverage-Aware Reasoning with Medical Tokens for Diagnosis Prediction",
    url: "https://arxiv.org/abs/2610.10641",
    authors: <>Kaisong Zhang*, <b>Haotian Fang*</b>, Junmeng Zhou, Hang Lv, Yulan Pan,
          Yanchao Tan.</>,
    venue: "ICLR 2027 在投",
    role: "Co-first Author",
    links: [{"label": "Code", "href": "https://github.com/zmlxzyh/CARing-Codes-Logs"}],
  },
  {
    id: "tool-call-reward-model",
    title: "Empowering LLM Tool Invocation with Tool-call Reward Model",
    url: "https://openreview.net/forum?id=LnBEASInVr",
    authors: <>Da Ma, Ziyue Yang, Hongshen Xu, <b>Haotian Fang</b>, Kai Yu, Lu Chen.</>,
    venue: "ICLR 2026 Poster",
  },
];
