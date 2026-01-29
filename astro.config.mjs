import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://archives-of-bub.pages.dev",
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
  server: { port: 3000 },
});
