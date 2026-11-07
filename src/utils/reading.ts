export const readerDefaults = {size: 'standard', width: 'standard', spacing: 'relaxed', focus: false} as const;
export type ReaderPreferences = {size: 'small' | 'standard' | 'large'; width: 'standard' | 'wide'; spacing: 'compact' | 'relaxed'; focus: boolean};
export const readerStorageKey = 'site-reader-v1';

export function validatePreferences(value: unknown): ReaderPreferences {
  const p = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return {
    size: p.size === 'small' || p.size === 'large' ? p.size : 'standard',
    width: p.width === 'wide' ? 'wide' : 'standard',
    spacing: p.spacing === 'compact' ? 'compact' : 'relaxed',
    focus: p.focus === true,
  };
}

// Applied in the document head before paint. Keep validation aligned with the helper above.
export const readerInitScript = `(function(){try{var p=JSON.parse(localStorage.getItem('${readerStorageKey}')||'{}')||{};var d=document.documentElement.dataset;d.readerSize=['small','large'].includes(p.size)?p.size:'standard';d.readerWidth=p.width==='wide'?'wide':'standard';d.readerSpacing=p.spacing==='compact'?'compact':'relaxed';d.focusMode=p.focus===true?'true':'false'}catch(e){}})();`;

export function normalizeText(text: string): string { return text.replace(/\s+/g, ' ').trim(); }

// A paragraph position is only a hint; verify its text and fail closed on ambiguous fallbacks.
export function findSharedParagraph(texts: readonly string[], position: number, quote: string): number {
  const q = normalizeText(quote);
  if (q.length < 4) return -1;
  const matches = texts.map((text, index) => normalizeText(text).includes(q) ? index : -1).filter((i) => i >= 0);
  if (Number.isInteger(position) && position > 0 && matches.includes(position - 1)) return position - 1;
  return matches.length === 1 ? matches[0] : -1;
}

export function tableAsTSV(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map((cell) => cell.replace(/[\t\r\n]+/g, ' ').trim()).join('\t')).join('\n');
}

export function internalPath(href: string, origin: string): string | undefined {
  if (!href || href.startsWith('#')) return undefined;
  try {
    const url = new URL(href, origin);
    if (url.origin !== new URL(origin).origin) return undefined;
    return decodeURI(url.pathname).replace(/\/$/, '') || '/';
  } catch { return undefined; }
}

export function mermaidColors(dark: boolean, tokens: {background: string; surface: string; text: string; accent: string; border: string}) {
  return {
    darkMode: dark, background: tokens.background, primaryColor: tokens.surface,
    primaryTextColor: tokens.text, primaryBorderColor: tokens.accent,
    secondaryColor: tokens.background, tertiaryColor: tokens.surface,
    lineColor: tokens.border, textColor: tokens.text, mainBkg: tokens.surface,
    nodeBorder: tokens.accent, clusterBkg: tokens.background, clusterBorder: tokens.border,
    edgeLabelBackground: tokens.background, titleColor: tokens.text,
    actorBkg: tokens.surface, actorBorder: tokens.accent, actorTextColor: tokens.text,
    signalColor: tokens.text, signalTextColor: tokens.text, noteBkgColor: tokens.surface, noteTextColor: tokens.text,
    fontFamily: 'JetBrains Mono Variable, LXGW WenKai Screen, monospace', fontSize: '16px',
  };
}
