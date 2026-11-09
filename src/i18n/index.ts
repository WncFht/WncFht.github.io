import type { UIStrings } from "./types";
import config from "@/config";

export { tplStr } from "./format";

const modules = import.meta.glob<{ default: UIStrings }>("./lang/*.ts", {
  eager: true,
});

const translations: Record<string, UIStrings> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.slice("./lang/".length, -".ts".length);
  translations[locale] = mod.default;
}

/** Resolve the site language, falling back to the complete English dictionary. */
export function useTranslations(locale: string = config.site.lang): UIStrings {
  return translations[locale] ?? translations["en"];
}
