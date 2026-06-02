import type { NextConfig } from "next";

// When GITHUB_PAGES=true (CI), produce a fully static export served from the
// /Funnel sub-path. Local dev/build stays a normal server build.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "Funnel";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export" as const,
        basePath: `/${repo}`,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isPages ? `/${repo}` : "",
  },
};

export default nextConfig;
