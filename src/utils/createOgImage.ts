import { fontData, experimental_getFontFileURL } from "astro:assets";
import satori from "satori";
import sharp from "sharp";
import { getFontPathByWeight } from "./getFontPathByWeight";
import config from "@/config";

type OgContent = { title: string; description?: string; author?: string };

/** One template and font-loading path for site and article social images. */
export async function createOgImage(content: OgContent, url: URL) {
  const fonts = await Promise.all(
    ([400, 700] as const).map(async weight => {
      const path = getFontPathByWeight(fontData["--font-og"], weight);
      if (!path)
        throw new Error(`Cannot find the OG font at weight ${weight}.`);
      const response = await fetch(experimental_getFontFileURL(path, url));
      if (!response.ok)
        throw new Error(`Cannot load the OG font: ${response.status}`);
      return {
        name: "Noto Sans SC",
        data: await response.arrayBuffer(),
        weight,
        style: "normal" as const,
      };
    })
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          background: "#fefbfb",
          display: "flex",
          padding: 48,
          fontFamily: "Noto Sans SC",
        },
        children: {
          type: "div",
          props: {
            style: {
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              border: "4px solid #282728",
              boxShadow: "16px 16px 0 #ecebeb",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 32,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 64,
                          fontWeight: 700,
                          lineHeight: 1.3,
                          lineClamp: 3,
                        },
                        children: content.title,
                      },
                    },
                    ...(content.description
                      ? [
                          {
                            type: "div",
                            props: {
                              style: { fontSize: 28, marginTop: 24 },
                              children: content.description,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 28,
                    marginTop: 20,
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        children: content.author
                          ? `by ${content.author}`
                          : config.site.title,
                      },
                    },
                    {
                      type: "span",
                      props: { children: new URL(config.site.url).hostname },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    { width: 1200, height: 630, embedFont: true, fonts }
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
