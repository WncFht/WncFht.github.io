import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createOgImage } from "@/utils/createOgImage";
import { getPostSlug } from "@/utils/getPostPaths";
import { postFilter } from "@/utils/postFilter";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(post => postFilter(post) && !post.data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }
  return createOgImage(
    { title: props.data.title, author: props.data.author },
    url
  );
};
