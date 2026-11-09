import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { selectAll } from "astro-expressive-code/hast";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { createRenderer } from "astro-expressive-code";
import { markdownOptions } from "../src/markdown.config.mjs";
import ecConfig from "../ec.config.mjs";

const markdown = await createMarkdownProcessor({
  ...markdownOptions,
  syntaxHighlight: false,
});

test("display numbering, manual tags, notag and local colors coexist and reset per document", async () => {
  const source = String.raw`Inline $x+y$.

$$
x=y
$$

$$
\begin{aligned}a&=b\\c&=d\end{aligned}
$$

$$
x=y\tag{A}
$$

$$
x=y\notag
$$

$$
\textcolor{#c2410c}{x}+y
$$`;
  const { code } = await markdown.render(source);
  assert.deepEqual(
    [...code.matchAll(/id="mjx-eqn:([^"]+)"/g)].map(match => match[1]),
    ["1", "2", "A", "3"]
  );
  assert.match(code, /<p>Inline <mjx-container class="MathJax" jax="SVG">/);
  assert.match(code, /fill="#c2410c"/);
  assert.doesNotMatch(code, /data-mjx-error|mathjax-error/);
  const second = await markdown.render("$$\nz=w\n$$");
  assert.match(second.code, /id="mjx-eqn:1"/);
});

test("Markdown uses one table wrapper, one heading anchor and preserves diagram source", async () => {
  const { code, metadata } = await markdown.render(`## 方法

| 项目 | 数值 |
| --- | --- |
| 样本 | 3 |

> [!TIP]
> 阅读提示。

\`\`\`mermaid
flowchart LR
  A[阅读] --> B[比较]
\`\`\`
`);
  assert.equal((code.match(/class="table-wrapper"/g) ?? []).length, 1);
  assert.equal((code.match(/class="heading-link"/g) ?? []).length, 1);
  assert.equal(metadata.headings[0].text, "方法");
  assert.match(code, /data-mermaid-source="flowchart LR/);
  assert.doesNotMatch(code, /<pre/);
  assert.match(code, /callout/);
});

function findAll(node, predicate) {
  return [
    ...(predicate(node) ? [node] : []),
    ...(node.children ?? []).flatMap(child => findAll(child, predicate)),
  ];
}

test("code configuration supplies line numbers, copy controls and per-block wrap controls", async () => {
  const { ec } = await createRenderer(ecConfig);
  const code = await ec.render({ code: "x = 1\nprint(x)", language: "python" });
  const prompt = await ec.render({
    code: "请概括方法、实验设置与局限。",
    language: "text",
  });
  const byClass = name => node => node.properties?.className?.includes(name);
  assert.equal(findAll(code.renderedGroupAst, byClass("gutter")).length, 2);
  assert.equal(findAll(prompt.renderedGroupAst, byClass("gutter")).length, 0);
  for (const [result, pressed] of [
    [code, "false"],
    [prompt, "true"],
  ]) {
    const [button] = findAll(
      result.renderedGroupAst,
      byClass("ec-word-wrap-button")
    );
    assert.equal(button.properties.ariaPressed, pressed);
    assert.equal(findAll(result.renderedGroupAst, byClass("copy")).length, 1);
  }
});

test("copy initialization binds only copy buttons when wrap controls share the toolbar", async () => {
  const { ec } = await createRenderer(ecConfig);
  const { renderedGroupAst } = await ec.render({
    code: "print(1)",
    language: "python",
  });
  const bound = [];
  const document = {
    body: {},
    querySelectorAll(selector) {
      return selectAll(selector, renderedGroupAst).map(node => ({
        addEventListener(type) {
          if (type === "click") bound.push(node);
        },
      }));
    },
    addEventListener() {},
  };
  const [frames] = ecConfig.plugins;
  for (const script of frames.jsModules) {
    runInNewContext(script, {
      document,
      console,
      MutationObserver: class {
        observe() {}
      },
    });
  }
  assert.equal(bound.length, 1);
  assert.ok(bound[0].properties.dataCode);
  assert.ok(!bound[0].properties.className?.includes("ec-word-wrap-button"));
});
