import type { NextConfig } from "next";

/** Remote images used by `next/image` (Sanity CDN, Storybook placeholders). Add hosts for new asset sources. */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
