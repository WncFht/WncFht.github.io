import type { CollectionEntry } from "astro:content";
import { dateInTimezone } from "./datetime.ts";

type PublicationOptions = {
  timezone: string;
  now?: Date;
  includeScheduled?: boolean;
};

/** Exclude drafts, publish by calendar day, then order by last update without mutating input. */
export function selectPublishedPosts(
  posts: CollectionEntry<"posts">[],
  { timezone, now = new Date(), includeScheduled = false }: PublicationOptions
) {
  return posts
    .filter(({ data }) => {
      if (data.draft) return false;
      if (includeScheduled) return true;
      const zone = data.timezone ?? timezone;
      return !dateInTimezone(data.pubDatetime, zone)
        .startOf("day")
        .isAfter(dateInTimezone(now, zone).startOf("day"));
    })
    .sort(
      (a, b) =>
        (b.data.modDatetime ?? b.data.pubDatetime).getTime() -
        (a.data.modDatetime ?? a.data.pubDatetime).getTime()
    );
}
