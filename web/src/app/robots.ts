import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/admin/",
        "/api/",
        // Carries a one-time ?token= in the URL — never worth indexing.
        "/reset-password",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
