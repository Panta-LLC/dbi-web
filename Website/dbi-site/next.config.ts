import type { NextConfig } from "next";

/** Remote images used by `next/image` (Sanity CDN, Storybook placeholders). Add hosts for new asset sources. */
const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults local matching to pathname '**' with search '' only, which rejects
    // any query string on local paths and yields "url" parameter is not allowed.
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
