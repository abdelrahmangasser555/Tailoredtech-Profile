import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok (and similar tunnels) to load dev HMR assets in development.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
