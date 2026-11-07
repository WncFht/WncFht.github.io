import type {CatalogPost, CollectionDefinition, ContentTag} from '../types/content';

export interface PostMetadata {
  title: string;
  description: string;
  permalink: string;
  date?: string | Date;
  readingTime?: number;
  tags: readonly ContentTag[];
  frontMatter?: {[key: string]: unknown};
}

export function isoDate(value: unknown): string | undefined {
  if (!(typeof value === 'string' || value instanceof Date)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function toCatalogPost(metadata: PostMetadata, kind: CatalogPost['kind']): CatalogPost {
  const specifiedCollections = metadata.frontMatter?.collections;
  return {
    id: metadata.permalink,
    kind,
    title: metadata.title,
    description: metadata.description,
    permalink: metadata.permalink,
    date: isoDate(metadata.date),
    readingTime: metadata.readingTime,
    tags: metadata.tags.map(({label, permalink}) => ({label, permalink})),
    collections: Array.isArray(specifiedCollections)
      ? specifiedCollections.filter((id): id is string => typeof id === 'string')
      : [],
  };
}

export function postsInCollection(posts: readonly CatalogPost[], collection: CollectionDefinition): CatalogPost[] {
  return posts.filter((post) => post.collections.includes(collection.id));
}

export function sortPosts(posts: readonly CatalogPost[]): CatalogPost[] {
  return [...posts].sort((a, b) => {
    const dateDifference = Date.parse(b.date ?? '') - Date.parse(a.date ?? '');
    if (Number.isFinite(dateDifference) && dateDifference !== 0) return dateDifference;
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.permalink.localeCompare(b.permalink, 'en');
  });
}

export function estimateReadingTime(markdown: string): number {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').replace(/```[\s\S]*?```/g, '');
  const chineseCharacters = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const words = body.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  return Math.max(1, Math.ceil(chineseCharacters / 300 + words / 200));
}
