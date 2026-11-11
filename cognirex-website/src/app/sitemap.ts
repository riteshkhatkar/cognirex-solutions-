import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/solutions",
    "/projects",
    "/about",
    "/careers",
    "/contact",
    "/get-in-touch",
    "/privacy-policy",
    "/terms",
    "/innovation",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/solutions" ? 0.9 : 0.8,
  }));
}

