import { defineEcConfig } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginWordWrap } from "@khaister/expressive-code-word-wrap";

export default defineEcConfig({
  themes: ["min-light", "night-owl"],
  useDarkModeMediaQuery: false,
  themeCssSelector: theme =>
    `[data-theme="${theme.type === "dark" ? "dark" : "light"}"]`,
  plugins: [pluginLineNumbers(), pluginWordWrap()],
  defaultProps: {
    wrap: false,
    overridesByLang: {
      text: { wrap: true, showLineNumbers: false },
      plaintext: { wrap: true, showLineNumbers: false },
      mermaid: { showLineNumbers: false },
    },
  },
  styleOverrides: {
    codeFontFamily: '"JetBrains Mono", "LXGW WenKai Screen", monospace',
    uiFontFamily: '"Inter", "LXGW WenKai Screen", sans-serif',
    borderColor: "var(--border)",
  },
});
