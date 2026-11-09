import { defineEcConfig, pluginFrames } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginWordWrap } from "@khaister/expressive-code-word-wrap";

// Frames 0.44.3 binds every .copy button, including the wrap plugin's button.
// Keep its implementation, but scope copying to buttons carrying code data.
const frames = pluginFrames();
frames.jsModules = frames.jsModules?.map(script =>
  script.replaceAll(
    ".expressive-code .copy button",
    ".expressive-code .copy button[data-code]"
  )
);

export default defineEcConfig({
  themes: ["min-light", "night-owl"],
  useDarkModeMediaQuery: false,
  themeCssSelector: theme =>
    `[data-theme="${theme.type === "dark" ? "dark" : "light"}"]`,
  frames: false,
  plugins: [frames, pluginLineNumbers(), pluginWordWrap()],
  defaultProps: {
    wrap: false,
    overridesByLang: {
      text: { wrap: true, showLineNumbers: false },
      plaintext: { wrap: true, showLineNumbers: false },
    },
  },
  styleOverrides: {
    codeFontFamily: "var(--font-mono)",
    uiFontFamily: "var(--font-sans)",
    borderColor: "var(--border)",
  },
});
