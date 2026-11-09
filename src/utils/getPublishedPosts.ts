import { getCollection } from "astro:content";
import config from "@/config";
import { selectPublishedPosts } from "./selectPublishedPosts";

/** Shared query for public lists, article routes, feeds and generated share images. */
export async function getPublishedPosts() {
  return selectPublishedPosts(await getCollection("posts"), {
    timezone: config.site.timezone,
    includeScheduled: import.meta.env.DEV,
  });
}
