import type { MetadataRoute } from "next";
import { columnas } from "@/data/columnas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gallonantioquia.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/columnas`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const columnaPages = columnas.map((col) => ({
    url: `${baseUrl}/columnas/${col.slug}`,
    lastModified: new Date(col.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...columnaPages];
}
