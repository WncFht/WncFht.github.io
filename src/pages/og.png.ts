import type { APIRoute } from "astro";
import { createOgImage } from "@/utils/createOgImage";
import config from "@/config";

export const GET: APIRoute = ({ url }) =>
  createOgImage(
    { title: config.site.title, description: config.site.description },
    url
  );
