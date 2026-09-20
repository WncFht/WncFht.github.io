---
title: 个人对 Agent Memory 的看法和总结
authors: fht
tags: [agent, memory, llm]
date: 2025-03-29
---

很显然，现在对于 Agent Memory 的研究是极其匮乏的，调研了现在所有的文献以及开源仓库，我稍微做一下总结。

当然，其实不仅仅是 memory，所谓的 memory 其实包含了 knowledge，它是一个所有信息存储的综合。也就是说，RAG 这种信息检索的机制是 memory 机制的一部分，而不完全等同于 memory。

{/* truncate */}

那么，如果我们想要实现 memory 机制，就是说我们需要实现一个信息检索的方案。

我的个人理解：之所以要实现这样一个方案，是因为我们没有办法让 LLM 在无限上下文长度实现推理。也就是说，我们不可能把所有的内容都塞进大模型让它进行推理。当然对于人类来说也是一样的，我们在思考输出东西的时候，不会对所有的东西都进行思考。即，有以下几个方面（idea）可以来看待 memory 机制：

1. Memory 是一种联想能力，一种推理能力，你能通过当前的信息联想到以前的内容。
   1. 这需要 reasoning，或者，最基本的 predict next token。
      1. 当然，现在最主流的方案有两个
         1. Embedding 直接看语言相似度查询，这可以在一定程度上实现所谓的一定的 reasoning
         2. Graph RAG 等通过预处理来构建结构性的知识图谱，从而尝试来提升 reasoning 能力
2. Memory 实际上是一种过滤的机制，把海量的信息筛选出有用的部分。也就是说，一种注意力机制，能够知道什么是重要的、相关的，什么是不重要的。
   1. 对应到 RAG 里面，实际上它为了弥补 embedding 的缺点，引入了 rewrite、reranking 等（rewrite 尝试通过重写问题，来用语义相似度实现更精准的过滤）。
   2. 一些弥补的方案
      1. 通过 summary，形成层次化的结构（不管是树状的如 RAPTOR，还是图的层次化结构如 Graph RAG / HiRAG），来一层一层的搜索，来实现更 efficient、精准的搜索。
      2. 结合多种索引机制，来同时使用不同的方法过滤。比如，先用关键词，再用 embedding。
3. 个人认为，memory 肯定要有层次结构，不可能说是一个 embedding 搞定所有。同时，只有图结构是不够的，图结构本身虽然有一定的多跳能力，但它仅仅是一个推理能力的低配版本。同时，本身的性能和颗粒度十分的不好控制，且费 token，Graph RAG 大概要 1:20。
   1. 所谓的层次结构是为了弥补推理能力的缺失，来实现一种类似人类思考的逐渐深入的过程。一种从简略到详细的过程。
4. 对于一些手动分离不同 memory 的方案，我认为之后一定会被取代掉，比如说维护一个 user profile 这种。大部分都是通过 prompt 来实现一个简易的，只是糊墙罢了，并不是所谓的 memory。
   1. 真正能够区分的基本只有两种
      1. 一种是 context
      2. 一种是 long-term memory
   2. 所有不在 context 中的信息都属于是 long-term memory
   3. Agent 通过对这些信息进行检索，来生成它需要的回复。
      1. 最简单的实现方式就是搞一个判别的 agent，判断信息够不够用，就像 cursor 一样不断地 search code in the file。
   4. 这里所谓的手动分离，本质上是维护一种 workflow，而这种 workflow 会被更合理的架构替代掉，不管说是 multi-agent 的 RFT（Deep Research 就是一种 RFT）还是说是一种合理的、全面的 memory 架构。
      1. 这里能说的也有很多，基于 agent 的探索、自我优化等等。
      2. 很可惜现在很多的 paper 喜欢用固定死的 workflow 来说自己提升了多少多少点，比如加一个反思的 agent 就觉得自己创新了，加一个 QA 的 agent 就觉得自己创新了。
5. Memory 要能够更新，而不是静态的。
   1. 这里不仅仅说是它要能够插入更多的 memory，比如新的 memory 和旧的 memory 矛盾的处理；以及 memory 机制要能够有时间上（新旧）的观念（本质上是一种推理能力）。
   2. 也是说，agent 能够根据 memory 来优化自身，或者说是，它能够从历史的信息中学习。
      1. 最简单的例子：人类不断地回忆一个东西，会越来越熟练；同时，人类可以对回忆不断地思考，来获得新的内容。
      2. 但是对于现在的主流技术来说就只有两种方案
         1. 调参数
         2. 加入上下文

后续希望能从搜广推、reasoning、attention、时间序列找点灵感。

相关项目：[agent-basic-skill](https://github.com/WncFht/agent-basic-skill) —— 我自己维护的可复用 Codex/Claude skills 与本地 agent 配置仓库。

---

> 本文首发于知乎专栏：[个人对 Agent Memory 的看法和总结](https://zhuanlan.zhihu.com/p/1889125384697659538)
