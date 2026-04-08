import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workaround for Windows `spawn EPERM` when Next attempts to execute
  // `node_modules/.bin/tsc` during `next build`.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: true,
  },
};

export default nextConfig;
