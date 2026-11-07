import {readFile} from 'node:fs/promises';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {BlogContent} from '@docusaurus/plugin-content-blog';
import type {LoadedContent as DocsContent} from '@docusaurus/plugin-content-docs';
import {collections} from '../../src/data/collections';
import {estimateReadingTime, isoDate, sortPosts, toCatalogPost} from '../../src/utils/contentCatalog';
import type {CatalogPost} from '../../src/types/content';
import {readerInitScript} from '../../src/utils/reading';

export default function contentCatalogPlugin(context: LoadContext): Plugin {
  return {
    name: 'content-catalog',
    injectHtmlTags() {
      return {headTags: [{tagName: 'script', innerHTML: readerInitScript}]};
    },
    async allContentLoaded({allContent, actions}) {
      const posts: CatalogPost[] = [];
      const blogInstances = allContent['docusaurus-plugin-content-blog'] ?? {};
      for (const content of Object.values(blogInstances) as BlogContent[]) {
        for (const {metadata} of content.blogPosts) {
          if (!metadata.unlisted && !metadata.frontMatter.draft && metadata.frontMatter.catalog !== false) {
            posts.push(toCatalogPost(metadata, 'blog'));
          }
        }
      }

      const docsInstances = allContent['docusaurus-plugin-content-docs'] ?? {};
      for (const content of Object.values(docsInstances) as DocsContent[]) {
        const version = content.loadedVersions.find((item) => item.versionName === 'current')
          ?? content.loadedVersions[0];
        for (const doc of version?.docs ?? []) {
          if (doc.unlisted || doc.frontMatter.draft || doc.frontMatter.catalog === false) continue;
          const source = path.resolve(context.siteDir, doc.source.replace(/^@site\//, ''));
          const markdown = await readFile(source, 'utf8');
          const post = toCatalogPost({...doc, date: undefined}, 'note');
          const lastUpdate = doc.frontMatter.last_update as {date?: unknown} | undefined;
          post.date = isoDate(lastUpdate?.date);
          post.readingTime = estimateReadingTime(markdown);
          posts.push(post);
        }
      }

      const knownCollections = new Set(collections.map(({id}) => id));
      for (const post of posts) {
        for (const id of post.collections) {
          if (!knownCollections.has(id)) throw new Error(`Unknown collection "${id}" on ${post.permalink}`);
        }
      }

      actions.setGlobalData({posts: sortPosts(posts), collections});
      for (const collection of collections) {
        const data = await actions.createData(`${collection.id}.json`, collection);
        actions.addRoute({
          path: `${context.siteConfig.baseUrl}collections/${collection.id}`,
          component: '@site/src/components/Collections/CollectionPage.tsx',
          exact: true,
          modules: {collection: data},
        });
      }
    },
  };
}
