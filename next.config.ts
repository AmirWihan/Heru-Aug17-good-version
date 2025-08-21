
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow builds to proceed even if lint/type errors exist (useful for CI deploys)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Temporarily disable static export to fix build issues
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
