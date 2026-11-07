import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {loadTypeScript} from './load-typescript.mjs';

const {readerDefaults, validatePreferences, readerInitScript, findSharedParagraph, tableAsTSV, internalPath, mermaidColors} = await loadTypeScript('../src/utils/reading.ts');
const {default: remarkFigures} = await loadTypeScript('../plugins/remark-figures/index.ts');

test('reader preferences reject malformed and unknown persisted values', () => {
  for (const value of [null, undefined, 'bad', [], {size: 'huge', width: 'x', spacing: 1, focus: 'true'}]) {
    assert.deepEqual(validatePreferences(value), readerDefaults);
  }
  assert.deepEqual(validatePreferences({size: 'large', width: 'wide', spacing: 'compact', focus: true}), {size: 'large', width: 'wide', spacing: 'compact', focus: true});
});

test('before-paint initialization agrees with preference validation and survives blocked storage', () => {
  for (const value of [{}, null, {size: 'small', width: 'wide', focus: true}, {size: 'bad', spacing: 'compact'}]) {
    const dataset = {};
    vm.runInNewContext(readerInitScript, {document: {documentElement: {dataset}}, localStorage: {getItem: () => JSON.stringify(value)}});
    const p = validatePreferences(value);
    assert.deepEqual(dataset, {readerSize: p.size, readerWidth: p.width, readerSpacing: p.spacing, focusMode: String(p.focus)});
  }
  assert.doesNotThrow(() => vm.runInNewContext(readerInitScript, {localStorage: {getItem: () => {throw new Error('blocked');}}}));
});

test('paragraph links verify text, relocate unique quotes, and reject ambiguous or stale links', () => {
  const texts = ['这是第一段原文', '这是第二段 原文', '这是第一段原文'];
  assert.equal(findSharedParagraph(texts, 3, '第一段原文'), 2);
  assert.equal(findSharedParagraph(texts, 1, '第二段  原文'), 1);
  assert.equal(findSharedParagraph(texts, 0, '第一段原文'), -1);
  assert.equal(findSharedParagraph(texts, 1, '已经改掉的句子'), -1);
  assert.equal(findSharedParagraph(texts, 1, '第一'), -1);
});

test('TSV keeps column boundaries while removing tabs and newlines inside cells', () => {
  assert.equal(tableAsTSV([['名称', '数值'], [' a\nb\tc ', '72.30']]), '名称\t数值\na b c\t72.30');
  assert.equal(tableAsTSV([]), '');
});

test('preview links only resolve canonical paths on the same origin', () => {
  const origin = 'https://example.com';
  assert.equal(internalPath('/docs/中文/?x=1#section', origin), '/docs/中文');
  assert.equal(internalPath('https://example.com/blog/a', origin), '/blog/a');
  for (const href of ['#section', 'https://external.com/docs/a', 'mailto:test@example.com', '/bad%zz']) assert.equal(internalPath(href, origin), undefined);
});

test('Mermaid configuration shares the active palette without CSS-variable strings', () => {
  const tokens = {background: '#282c34', surface: '#303641', text: '#e6e9ef', accent: '#61afef', border: '#677180'};
  const theme = mermaidColors(true, tokens);
  assert.equal(theme.darkMode, true);
  assert.equal(theme.primaryBorderColor, tokens.accent);
  assert.equal(theme.actorTextColor, tokens.text);
  assert.equal(mermaidColors(false, tokens).darkMode, false);
});

const img = (alt, title) => ({type: 'image', url: '/img/test.svg', alt, title});
const paragraph = (...children) => ({type: 'paragraph', children});
const transform = (...children) => {const tree = {type: 'root', children}; remarkFigures()(tree); return tree.children;};

test('figure captions prefer title, preserve image metadata, and stay plain text', () => {
  const image = img('Alt text', '<script>plain caption</script>');
  const [figure] = transform(paragraph(image));
  assert.equal(figure.name, 'figure');
  assert.equal(figure.children[0], image);
  assert.equal(figure.children[1].children[0].value, '<script>plain caption</script>');
  assert.equal(transform(paragraph(img('Alt fallback')))[0].children[1].children[0].value, 'Alt fallback');
  assert.equal(transform(paragraph(img('')))[0].children.length, 1);
});

test('figure transform groups image-only paragraphs and leaves mixed text and linked images intact', () => {
  const mixed = paragraph({type: 'text', value: 'See '}, img('a'));
  const linked = paragraph({type: 'link', url: '/elsewhere', children: [img('a')]});
  const [group, unchanged, unchangedLink] = transform(paragraph(img('a'), {type: 'text', value: '\n'}, img('b')), mixed, linked);
  assert.equal(group.name, 'div');
  assert.equal(group.children.length, 2);
  assert.equal(group.attributes.find(({name}) => name === 'data-gallery').value, 'group-1');
  assert.equal(unchanged, mixed);
  assert.equal(unchangedLink, linked);
});
