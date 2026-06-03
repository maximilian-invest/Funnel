import type { NextConfig } from "next";

// Server build (Railway runs Node). No static export / basePath: the app is
// served from the domain root and uses the /api/register backend route.
const nextConfig: NextConfig = {};

export default nextConfig;
