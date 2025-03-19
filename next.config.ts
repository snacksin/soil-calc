import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Static HTML export settings
  output: "standalone",
  
  // Optimization
  poweredByHeader: false
};

export default nextConfig;
