import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev tools (HMR) to be accessed from phones/devices on the same LAN
  allowedDevOrigins: [
    "192.168.0.*",
    "192.168.1.*",
    "10.0.0.*",
    "10.0.1.*",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-55a5586b0fb34f5aa26d2c343a67ac5b.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
