import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite loads its WASM/data files from disk at runtime, so it must not be bundled
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
