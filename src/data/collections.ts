export const collections = [
  {
    id: "agent",
    title: "Agent",
    description: "智能体记忆、上下文管理、工具调用与系统实践。",
  },
  {
    id: "paper-weekly",
    title: "论文周报",
    description: "近期论文、方法比较与值得继续追踪的问题。",
  },
] as const;

export const collectionIds = collections.map(collection => collection.id) as [
  (typeof collections)[number]["id"],
  ...(typeof collections)[number]["id"][],
];
