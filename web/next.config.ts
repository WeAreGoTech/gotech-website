import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite loads its WASM/data files from disk at runtime, so it must not be bundled
  serverExternalPackages: ["@electric-sql/pglite"],
  experimental: {
    // IIS/ARR forwards requests to 127.0.0.1:3000 with preserveHostHeader off, so the
    // upstream Host never matches the browser's Origin and every Server Action (login,
    // forms) fails its CSRF check with a 500. Name the public host explicitly.
    serverActions: {
      allowedOrigins: ["gotech-web-31-40-199-183.sslip.io"],
    },
  },
};

export default nextConfig;
