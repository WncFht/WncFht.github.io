export interface ContentTag {
  label: string;
  permalink: string;
}

export interface CatalogPost {
  id: string;
  kind: 'blog' | 'note';
  title: string;
  description: string;
  permalink: string;
  date?: string;
  readingTime?: number;
  tags: ContentTag[];
  collections: string[];
}

export interface CollectionDefinition {
  id: string;
  title: string;
  description: string;
}

export interface ContentCatalog {
  posts: CatalogPost[];
  collections: CollectionDefinition[];
}
