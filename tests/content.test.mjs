import assert from "node:assert/strict";
import test from "node:test";
import { selectPublishedPosts } from "../src/utils/selectPublishedPosts.ts";
import { dateInTimezone } from "../src/utils/datetime.ts";

const now = new Date("2026-11-09T01:00:00Z");
const options = { timezone: "Asia/Shanghai", now };
const post = (id, pubDatetime, extra = {}) => ({
  id,
  data: { pubDatetime: new Date(pubDatetime), ...extra },
});

test("production publishes the whole local calendar day while excluding drafts and future days", () => {
  const entries = [
    post("past", "2026-11-08T12:00:00Z"),
    post("later-today", "2026-11-09T15:59:59Z"),
    post("tomorrow", "2026-11-09T16:00:00Z"),
    post("draft", "2026-11-08T12:00:00Z", { draft: true }),
  ];
  assert.deepEqual(
    selectPublishedPosts(entries, options).map(p => p.id),
    ["later-today", "past"]
  );
  assert.deepEqual(
    selectPublishedPosts(entries, { ...options, includeScheduled: true }).map(
      p => p.id
    ),
    ["tomorrow", "later-today", "past"]
  );
});

test("per-post timezone overrides the site timezone at the publication boundary", () => {
  const publishedAt = "2026-11-09T09:00:00Z";
  const entries = [
    post("site-day", publishedAt),
    post("los-angeles-tomorrow", publishedAt, {
      timezone: "America/Los_Angeles",
    }),
  ];
  assert.deepEqual(
    selectPublishedPosts(entries, options).map(p => p.id),
    ["site-day"]
  );
});

test("updated posts sort by exact timestamp and the source array stays intact", () => {
  const original = [
    post("new", "2026-11-08T01:00:00.001Z"),
    post("updated", "2026-01-01T00:00:00Z", {
      modDatetime: new Date("2026-11-08T01:00:00.002Z"),
    }),
    post("old", "2026-11-08T01:00:00.000Z", { modDatetime: null }),
  ];
  assert.deepEqual(
    selectPublishedPosts(original, options).map(p => p.id),
    ["updated", "new", "old"]
  );
  assert.deepEqual(
    original.map(p => p.id),
    ["new", "updated", "old"]
  );
  assert.deepEqual(selectPublishedPosts([], options), []);
});

test("date formatting and publication policy share timezone fallback and DST rules", t => {
  const warning = t.mock.method(console, "warn", () => {});
  const invalid = "Invalid/Content-Test-Zone";
  assert.equal(
    dateInTimezone(now, invalid).format("YYYY-MM-DD HH:mm"),
    "2026-11-09 01:00"
  );
  assert.equal(dateInTimezone(now, invalid).utcOffset(), 0);
  assert.equal(warning.mock.callCount(), 1);
  assert.equal(
    dateInTimezone("2026-11-01T08:30:00Z", "America/Los_Angeles").format(
      "HH:mm Z"
    ),
    "01:30 -07:00"
  );
  assert.equal(
    dateInTimezone("2026-11-01T09:30:00Z", "America/Los_Angeles").format(
      "HH:mm Z"
    ),
    "01:30 -08:00"
  );
  assert.equal(
    selectPublishedPosts([post("utc-tomorrow", "2026-11-10T00:00:00Z")], {
      ...options,
      timezone: invalid,
    }).length,
    0
  );
});
