import assert from 'node:assert/strict';
import test from 'node:test';
import {loadTypeScript} from './load-typescript.mjs';

const {toCatalogPost, postsInCollection, sortPosts, isoDate, estimateReadingTime} = await loadTypeScript('../src/utils/contentCatalog.ts');
const collection = {id: 'agent', title: 'Agent', description: ''};
const post = (overrides = {}) => ({
  id: '/test', kind: 'blog', title: 'Test', description: '', permalink: '/test', tags: [], collections: [], ...overrides,
});

test('collection membership uses explicit IDs and ignores old tags', () => {
  const taggedOnly = post({tags: [{label: 'Agent', permalink: '/blog/tags/agent'}]});
  const explicit = post({id: '/explicit', collections: ['agent']});
  const other = post({id: '/other', collections: ['paper-weekly']});
  assert.deepEqual(postsInCollection([taggedOnly, explicit, other], collection).map(({id}) => id), ['/explicit']);
});

test('a post can belong to multiple collections without duplicate entries', () => {
  const entry = post({collections: ['agent', 'paper-weekly', 'agent']});
  assert.equal(postsInCollection([entry], collection).length, 1);
  assert.equal(postsInCollection([entry], {...collection, id: 'paper-weekly'}).length, 1);
  assert.equal(postsInCollection([], collection).length, 0);
});

test('sorts dated posts newest first, leaves undated notes last, and does not mutate input', () => {
  const input = [post({id: 'old', date: '2025-01-01', permalink: '/old'}), post({id: 'note'}), post({id: 'new', date: '2026-01-01', permalink: '/new'})];
  assert.deepEqual(sortPosts(input).map(({id}) => id), ['new', 'old', 'note']);
  assert.equal(input[0].id, 'old');
});

test('metadata preserves the canonical URL, reading time and explicit collections', () => {
  const result = toCatalogPost({title: 'Title', description: 'Summary', permalink: '/canonical', date: new Date('2026-01-01'), readingTime: 4.5, tags: [], frontMatter: {collections: ['agent', 123]}}, 'blog');
  assert.equal(result.permalink, '/canonical');
  assert.equal(result.date, '2026-01-01T00:00:00.000Z');
  assert.equal(result.readingTime, 4.5);
  assert.deepEqual(result.collections, ['agent']);
});

test('missing or invalid dates stay absent rather than becoming the current date', () => {
  assert.equal(isoDate(undefined), undefined);
  assert.equal(isoDate('not-a-date'), undefined);
  assert.equal(toCatalogPost({title: 'Note', description: '', permalink: '/note', tags: []}, 'note').date, undefined);
});

test('reading estimates count Chinese prose and English words, excluding metadata and code blocks', () => {
  assert.equal(estimateReadingTime('中'.repeat(600)), 2);
  assert.equal(estimateReadingTime('word '.repeat(400)), 2);
  assert.equal(estimateReadingTime('---\ntitle: Metadata\n---\n短文\n```python\n' + 'word '.repeat(1000) + '\n```'), 1);
});
