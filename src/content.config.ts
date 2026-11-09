import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";
import { collectionIds } from "@/data/collections";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default([]),
      collection: z.enum(collectionIds).optional(),
      kind: z
        .enum(["research-note", "paper-weekly", "tutorial", "project-note"])
        .optional(),
      papers: z.number().int().positive().optional(),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      hideToc: z.boolean().optional(),
      // An empty value means "not set", so the site timezone applies.
      timezone: z
        .string()
        .optional()
        .transform(tz => tz || undefined),
    }),
});

export const collections = { posts };
