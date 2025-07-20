import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignora errores de ESLint durante la compilación (build)
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
