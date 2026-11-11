import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cognirex Solutions",
    short_name: "Cognirex",
    description: "Intelligence Engineered. Modern Websites, Custom Software, AI & Automation Solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F7FC",
    theme_color: "#7C3AED",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

