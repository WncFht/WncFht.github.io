import rss from "@astrojs/rss";
import { getPublishedPosts } from "@/utils/getPublishedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

export async function GET() {
  const posts = await getPublishedPosts();

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: posts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
