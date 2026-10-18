import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Allow dev tools (HMR) to be accessed from phones/devices on the same LAN
  allowedDevOrigins: [
    "192.168.0.*",
    "192.168.1.*",
    "10.0.0.*",
    "10.0.1.*",
  ],
};

export default nextConfig;
