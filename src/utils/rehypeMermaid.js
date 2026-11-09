/** Keep diagram sources separate from Expressive Code's rendered markup. */
export const rehypeMermaid = () => tree => {
  const walk = node => {
    const code = node.tagName === "pre" && node.children?.[0];
    if (code?.properties?.className?.includes("language-mermaid")) {
      node.tagName = "div";
      node.properties = {
        className: ["mermaid-diagram"],
        dataMermaidSource: code.children
          .map(child => child.value ?? "")
          .join(""),
      };
      // The source remains readable if JavaScript is unavailable.
      node.children = [{ ...code, properties: {} }];
      return;
    }
    node.children?.forEach(walk);
  };
  walk(tree);
};
