import assert from 'node:assert/strict';
import test from 'node:test';
import {loadTypeScript} from './load-typescript.mjs';

const {articleProgress, progressBetween, sectionProgress} = await loadTypeScript('../src/components/ReadingProgress/metrics.ts');

test('article progress excludes the header and reaches 100% when the body bottom is visible', () => {
  // Body spans document y=200..2200. A 60px navbar leaves 740px of the viewport.
  assert.equal(articleProgress(0, 200, 2000, 800, 60), 0);
  assert.equal(articleProgress(140, 200, 2000, 800, 60), 0);
  assert.equal(articleProgress(770, 200, 2000, 800, 60), 50);
  assert.equal(articleProgress(1400, 200, 2000, 800, 60), 100);
  // Scrolling into the footer must not reduce or overflow the completed progress.
  assert.equal(articleProgress(2000, 200, 2000, 800, 60), 100);
});

test('short articles complete only when their bottom is visible', () => {
  assert.equal(articleProgress(0, 600, 400, 800, 60), 0);
  assert.equal(articleProgress(200, 600, 400, 800, 60), 100);
});

test('progress clamps at both ends and handles empty ranges and non-finite inputs', () => {
  assert.equal(progressBetween(-50, 0, 100), 0);
  assert.equal(progressBetween(150, 0, 100), 100);
  assert.equal(progressBetween(50, 50, 50), 100);
  assert.equal(progressBetween(49, 50, 50), 0);
  assert.equal(progressBetween(Number.NaN, 0, 100), 0);
});

const headings = [
  {id: 'method', level: 2, top: 100},
  {id: 'derivation', level: 3, top: 200},
  {id: 'experiment', level: 2, top: 500},
];

test('parent section progress includes nested subsections', () => {
  const sections = sectionProgress(headings, 300, 900, false);
  assert.equal(sections.method.progress, 50);
  assert.equal(sections.derivation.progress, 33);
  assert.equal(sections.experiment.progress, 0);
  assert.equal(sections.experiment.started, false);
});

test('the last section completes at the article end and empty articles have no sections', () => {
  const sections = sectionProgress(headings, 850, 900, true);
  assert.ok(Object.values(sections).every(({progress, started}) => progress === 100 && started));
  assert.deepEqual(sectionProgress([], 100, 100, true), {});
});

test('moving back up recomputes progress instead of retaining the previous page position', () => {
  const sections = sectionProgress(headings, 150, 900, false);
  assert.equal(sections.method.progress, 13);
  assert.equal(sections.derivation.progress, 0);
  assert.equal(sections.experiment.started, false);
});
