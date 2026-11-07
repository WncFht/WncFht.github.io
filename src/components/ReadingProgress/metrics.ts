export function progressBetween(position: number, start: number, end: number): number {
  if (![position, start, end].every(Number.isFinite)) return 0;
  if (end <= start) return position >= end ? 100 : 0;
  return Math.round(Math.min(1, Math.max(0, (position - start) / (end - start))) * 100);
}

export function articleProgress(scrollY: number, top: number, height: number, viewport: number, navbar: number): number {
  if (height <= viewport - navbar) return top + height <= scrollY + viewport ? 100 : 0;
  return progressBetween(scrollY + navbar, top, top + height - (viewport - navbar));
}

export interface HeadingPosition {
  id: string;
  level: number;
  top: number;
}

export interface SectionProgress {
  progress: number;
  started: boolean;
}

export function sectionProgress(headings: readonly HeadingPosition[], readingLine: number, bottom: number, complete: boolean): Record<string, SectionProgress> {
  return Object.fromEntries(headings.map((heading, index) => {
    const next = headings.slice(index + 1).find((item) => item.level <= heading.level);
    return [heading.id, {
      progress: complete ? 100 : progressBetween(readingLine, heading.top, next?.top ?? bottom),
      started: complete || readingLine >= heading.top,
    }];
  }));
}
