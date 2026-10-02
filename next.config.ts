import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.my-cdn.com',
      },
    ],
    minimumCacheTTL: 60,
    unoptimized: true,
  },
  output: 'export',
};

export default nextConfig;
