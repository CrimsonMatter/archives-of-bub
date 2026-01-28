import { defineCollection, z } from "astro:content";

const library = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    volume: z.string(),
    attribution: z.string().default("Attributed to Bub"),

    primary_domain: z.string(),
    domains: z.array(z.string()),

    filed_under: z.string().optional(),
    see_also: z.array(z.string()).default([]),

    status: z.enum(["cataloged", "forthcoming", "restricted"]).optional(),
    index_rank: z.number().int().optional(),
  }),
});

export const collections = { library };
